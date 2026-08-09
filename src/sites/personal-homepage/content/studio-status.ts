import { cstdCaseStudies } from "./case-studies";
import { cstdProofMesh, getCstdProofFreshness, type CstdProofFreshness } from "./proof-mesh";
import { cstdSystems, type CstdSystem } from "./systems";
import { cstdTimeline } from "./timeline";

export type CstdDistrictStatus = Readonly<{
  id: CstdSystem["id"];
  code: string;
  title: string;
  district: string;
  coverageScore: number;
  evidenceCount: number;
  projectCount: number;
  verifiedAt: string;
  freshness: CstdProofFreshness;
  state: "online" | "watch" | "refresh";
  stack: readonly string[];
}>;

export type CstdStudioSnapshot = Readonly<{
  schemaVersion: 3;
  release: "CSTD-8.0";
  generatedAt: string;
  source: "build-time-public-evidence";
  provenance: Readonly<{
    contract: "cstd.studio-snapshot/v3";
    digest: `fnv1a32:${string}`;
    sources: readonly Readonly<{
      id: "proof-mesh" | "knowledge-graph" | "release-ledger";
      href: string;
      observedAt: string;
    }>[];
  }>;
  totals: Readonly<{
    districts: number;
    projects: number;
    artifacts: number;
    graphNodes: number;
  }>;
  districts: readonly CstdDistrictStatus[];
  releases: readonly (typeof cstdTimeline)[number][];
}>;

function latestDate(values: readonly string[]) {
  return [...values].sort().at(-1) ?? "1970-01-01";
}

function digestEvidence(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}` as const;
}

export function createCstdStudioSnapshot(now = new Date()): CstdStudioSnapshot {
  const districts = cstdSystems.map((system): CstdDistrictStatus => {
    const proofs = cstdProofMesh.filter((proof) =>
      (proof.capabilityIds as readonly CstdSystem["id"][]).includes(system.id),
    );
    const verifiedAt = latestDate(proofs.map((proof) => proof.verifiedAt));
    const freshness = getCstdProofFreshness(verifiedAt, now);
    const coverageScore = proofs.length === 0
      ? 0
      : Math.round(proofs.reduce((sum, proof) => sum + proof.coverageScore, 0) / proofs.length);
    return {
      id: system.id,
      code: system.code,
      title: system.title,
      district: system.district,
      coverageScore,
      evidenceCount: proofs.reduce((sum, proof) => sum + proof.artifactCount, 0),
      projectCount: proofs.length,
      verifiedAt,
      freshness,
      state: freshness === "current" ? "online" : freshness === "aging" ? "watch" : "refresh",
      stack: system.stack,
    };
  });

  const releases = cstdTimeline
    .filter((entry) => entry.kind === "release" || entry.kind === "diagnosis")
    .slice(-4);
  const generatedAt = latestDate([
    ...cstdCaseStudies.map((entry) => entry.updatedAt),
    ...cstdProofMesh.map((entry) => entry.verifiedAt),
  ]);
  const digest = digestEvidence(cstdProofMesh
    .map((entry) => [entry.projectId, entry.status, entry.verifiedAt, entry.artifactCount, entry.coverageScore].join(":"))
    .sort()
    .join("|"));

  return {
    schemaVersion: 3,
    release: "CSTD-8.0",
    generatedAt,
    source: "build-time-public-evidence",
    provenance: {
      contract: "cstd.studio-snapshot/v3",
      digest,
      sources: [
        { id: "proof-mesh", href: "/proof.json", observedAt: generatedAt },
        { id: "knowledge-graph", href: "/graph.json", observedAt: generatedAt },
        { id: "release-ledger", href: "/releases.json", observedAt: latestDate(releases.map((entry) => entry.date)) },
      ],
    },
    totals: {
      districts: districts.length,
      projects: cstdProofMesh.length,
      artifacts: cstdProofMesh.reduce((sum, entry) => sum + entry.artifactCount, 0),
      graphNodes: cstdSystems.length + cstdCaseStudies.length,
    },
    districts,
    releases,
  };
}

export const cstdStudioSnapshot = createCstdStudioSnapshot();

export function getCstdDistrictStatus(id: CstdSystem["id"]) {
  return cstdStudioSnapshot.districts.find((district) => district.id === id);
}
