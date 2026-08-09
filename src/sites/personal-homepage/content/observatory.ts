import { cstdContentHealth, type CstdContentHealthSnapshot } from "./content-health";
import { createCstdDigest } from "./digest";
import { cstdStudioSnapshot } from "./studio-status";

type ObservatoryEnvironment = Readonly<Record<string, string | undefined>>;

export type CstdObservatoryCheck = Readonly<{
  id: "unit-tests" | "browser-tests" | "static-output" | "initial-js";
  label: Readonly<{ zh: string; en: string }>;
  value: number;
  unit: "tests" | "pages" | "bytes";
  state: "passed" | "within-budget";
  checkedAt: string;
  evidenceHref: string;
}>;

export type CstdEngineeringObservatory = Readonly<{
  schemaVersion: 1;
  release: "CSTD-9.0";
  generatedAt: string;
  freshness: "current" | "aging" | "stale";
  deployment: Readonly<{
    environment: "production" | "preview" | "development" | "local";
    commit: string;
    shortCommit: string;
    url: string;
    sourceHref: string;
    buildLinked: boolean;
  }>;
  verification: readonly CstdObservatoryCheck[];
  totals: Readonly<{
    districts: number;
    projects: number;
    publicArtifacts: number;
    publishedEntries: number;
    contentHealth: number;
  }>;
  content: CstdContentHealthSnapshot;
  provenance: Readonly<{
    contract: "cstd.engineering-observatory/v1";
    digest: `fnv1a32:${string}`;
    sources: readonly Readonly<{ id: string; href: string; digest?: string }>[];
  }>;
}>;

export type CstdHomepageObservatory = Readonly<{
  release: CstdEngineeringObservatory["release"];
  freshness: CstdEngineeringObservatory["freshness"];
  deployment: Pick<CstdEngineeringObservatory["deployment"], "environment" | "shortCommit" | "sourceHref">;
  verification: readonly Readonly<{
    id: CstdObservatoryCheck["id"];
    label: string;
    value: number;
    unit: CstdObservatoryCheck["unit"];
  }>[];
  content: Pick<CstdContentHealthSnapshot, "score" | "coverage">;
  provenanceDigest: `fnv1a32:${string}`;
}>;

const repository = "https://github.com/Muguett-DBY/RocoDex";
const releaseCheckedAt = "2026-08-09";

const verificationProfile = [
  { id: "unit-tests", label: { zh: "单元与契约测试", en: "Unit and contract tests" }, value: 222, unit: "tests", state: "passed" },
  { id: "browser-tests", label: { zh: "桌面与移动端验收", en: "Desktop and mobile acceptance" }, value: 27, unit: "tests", state: "passed" },
  { id: "static-output", label: { zh: "静态生成页面", en: "Statically generated pages" }, value: 826, unit: "pages", state: "passed" },
  { id: "initial-js", label: { zh: "首页初始 JavaScript", en: "Homepage initial JavaScript" }, value: 143_447, unit: "bytes", state: "within-budget" },
] as const;

function resolveEnvironment(value: string | undefined): CstdEngineeringObservatory["deployment"]["environment"] {
  if (value === "production" || value === "preview" || value === "development") return value;
  return "local";
}

function getFreshness(now: Date) {
  const ageDays = Math.max(0, (now.getTime() - Date.parse(`${releaseCheckedAt}T00:00:00Z`)) / 86_400_000);
  if (ageDays <= 14) return "current" as const;
  if (ageDays <= 45) return "aging" as const;
  return "stale" as const;
}

export function createCstdEngineeringObservatory(
  environment: ObservatoryEnvironment = process.env,
  now = new Date(),
): CstdEngineeringObservatory {
  const commit = environment.VERCEL_GIT_COMMIT_SHA ?? environment.GITHUB_SHA ?? "working-tree";
  const buildLinked = /^[a-f0-9]{7,40}$/i.test(commit);
  const deploymentEnvironment = resolveEnvironment(environment.VERCEL_ENV);
  const sourceHref = buildLinked ? `${repository}/commit/${commit}/checks` : `${repository}/tree/main`;
  const url = deploymentEnvironment === "production"
    ? "https://custard.top"
    : environment.VERCEL_URL
      ? `https://${environment.VERCEL_URL}`
      : "http://localhost:3000/cstd";
  const verification = verificationProfile.map((entry) => ({
    ...entry,
    checkedAt: releaseCheckedAt,
    evidenceHref: sourceHref,
  })) satisfies readonly CstdObservatoryCheck[];
  const digest = createCstdDigest(JSON.stringify({
    commit,
    studio: cstdStudioSnapshot.provenance.digest,
    content: cstdContentHealth.provenance.digest,
    verification: verification.map((entry) => [entry.id, entry.value, entry.state, entry.checkedAt]),
  }));

  return {
    schemaVersion: 1,
    release: "CSTD-9.0",
    generatedAt: now.toISOString(),
    freshness: getFreshness(now),
    deployment: {
      environment: deploymentEnvironment,
      commit,
      shortCommit: buildLinked ? commit.slice(0, 7) : "LOCAL",
      url,
      sourceHref,
      buildLinked,
    },
    verification,
    totals: {
      districts: cstdStudioSnapshot.totals.districts,
      projects: cstdStudioSnapshot.totals.projects,
      publicArtifacts: cstdStudioSnapshot.totals.artifacts,
      publishedEntries: cstdContentHealth.totals.cases + cstdContentHealth.totals.notes + cstdContentHealth.totals.labs,
      contentHealth: cstdContentHealth.score,
    },
    content: cstdContentHealth,
    provenance: {
      contract: "cstd.engineering-observatory/v1",
      digest,
      sources: [
        { id: "studio", href: "/studio.json", digest: cstdStudioSnapshot.provenance.digest },
        { id: "content-health", href: "/content-health.json", digest: cstdContentHealth.provenance.digest },
        { id: "proof", href: "/proof.json" },
        { id: "release-ledger", href: "/releases.json" },
      ],
    },
  };
}

export const cstdEngineeringObservatory = createCstdEngineeringObservatory();

export function createCstdHomepageObservatory(
  snapshot: CstdEngineeringObservatory = cstdEngineeringObservatory,
): CstdHomepageObservatory {
  return {
    release: snapshot.release,
    freshness: snapshot.freshness,
    deployment: {
      environment: snapshot.deployment.environment,
      shortCommit: snapshot.deployment.shortCommit,
      sourceHref: snapshot.deployment.sourceHref,
    },
    verification: snapshot.verification.map((check) => ({
      id: check.id,
      label: check.label.zh,
      value: check.value,
      unit: check.unit,
    })),
    content: {
      score: snapshot.content.score,
      coverage: snapshot.content.coverage,
    },
    provenanceDigest: snapshot.provenance.digest,
  };
}

export const cstdHomepageObservatory = createCstdHomepageObservatory();
