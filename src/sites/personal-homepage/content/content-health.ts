import { cstdCaseStudies } from "./case-studies";
import type { LocalizedText } from "./content-types";
import { createCstdDigest } from "./digest";
import { cstdLabs } from "./labs";
import { cstdTechnicalNotes } from "./technical-notes";
import { cstdTopics } from "./topics";

export type CstdContentFreshness = "current" | "aging" | "stale";

export type CstdContentHealthSnapshot = Readonly<{
  schemaVersion: 1;
  release: "CSTD-9.0";
  generatedAt: string;
  status: "healthy" | "attention";
  score: number;
  freshness: CstdContentFreshness;
  totals: Readonly<{
    cases: number;
    notes: number;
    labs: number;
    topics: number;
    artifacts: number;
    corrections: number;
  }>;
  coverage: Readonly<{
    bilingualPercent: number;
    topicPercent: number;
    relationPercent: number;
  }>;
  issues: Readonly<{
    missingLocalePairs: number;
    brokenRelations: readonly string[];
    orphanedEntries: readonly string[];
    staleArtifacts: readonly string[];
  }>;
  provenance: Readonly<{
    contract: "cstd.content-health/v1";
    digest: `fnv1a32:${string}`;
    sources: readonly Readonly<{ id: string; href: string }>[];
  }>;
}>;

function localizedPairComplete(value: LocalizedText) {
  return value.zh.trim().length > 0 && value.en.trim().length > 0;
}

function getFreshness(updatedAt: string, now: Date): CstdContentFreshness {
  const ageDays = Math.max(0, (now.getTime() - Date.parse(`${updatedAt}T00:00:00Z`)) / 86_400_000);
  if (ageDays <= 45) return "current";
  if (ageDays <= 120) return "aging";
  return "stale";
}

export function createCstdContentHealth(now = new Date()): CstdContentHealthSnapshot {
  const localizedPairs: LocalizedText[] = [];
  const pushPair = (value: LocalizedText | null | undefined) => {
    if (value) localizedPairs.push(value);
  };

  for (const entry of cstdCaseStudies) {
    [entry.title, entry.kicker, entry.summary, entry.film.logline, entry.role, entry.status, entry.image.alt]
      .forEach(pushPair);
    entry.film.beats.forEach((beat) => [beat.title, beat.detail, beat.signal].forEach(pushPair));
    entry.metrics.forEach((metric) => pushPair(metric.label));
    entry.evidence.forEach((evidence) => [evidence.label, evidence.detail].forEach(pushPair));
    entry.toc.forEach((item) => [item.eyebrow, item.title].forEach(pushPair));
    entry.artifacts.forEach((artifact) => [artifact.label, artifact.detail, artifact.href].forEach(pushPair));
  }
  for (const entry of cstdTechnicalNotes) {
    [entry.category, entry.series, entry.title, entry.summary, entry.image.alt].forEach(pushPair);
    entry.toc.forEach((item) => [item.eyebrow, item.title].forEach(pushPair));
    entry.corrections.forEach((correction) => pushPair(correction.note));
  }
  for (const entry of cstdTopics) {
    [entry.title, entry.thesis, entry.summary, entry.image.alt].forEach(pushPair);
  }
  for (const entry of cstdLabs) {
    [entry.title, entry.summary, entry.principle, entry.image.alt, entry.evidenceHref].forEach(pushPair);
  }

  const caseSlugs = new Set(cstdCaseStudies.map((entry) => entry.slug));
  const noteSlugs = new Set(cstdTechnicalNotes.map((entry) => entry.slug));
  const labSlugs = new Set<string>(cstdLabs.map((entry) => entry.slug));
  const topicCaseSlugs = new Set(cstdTopics.flatMap((entry) => entry.caseSlugs));
  const topicNoteSlugs = new Set(cstdTopics.flatMap((entry) => entry.noteSlugs));
  const topicLabSlugs = new Set<string>(cstdTopics.flatMap((entry) => entry.labSlugs));
  const brokenRelations: string[] = [];

  for (const entry of cstdCaseStudies) {
    entry.relatedNoteSlugs.forEach((slug) => {
      if (!noteSlugs.has(slug)) brokenRelations.push(`case:${entry.slug}->note:${slug}`);
    });
    entry.relatedLabSlugs.forEach((slug) => {
      if (!labSlugs.has(slug)) brokenRelations.push(`case:${entry.slug}->lab:${slug}`);
    });
  }
  for (const entry of cstdTechnicalNotes) {
    entry.relatedCaseSlugs.forEach((slug) => {
      if (!caseSlugs.has(slug)) brokenRelations.push(`note:${entry.slug}->case:${slug}`);
    });
  }
  for (const entry of cstdTopics) {
    entry.caseSlugs.forEach((slug) => {
      if (!caseSlugs.has(slug)) brokenRelations.push(`topic:${entry.slug}->case:${slug}`);
    });
    entry.noteSlugs.forEach((slug) => {
      if (!noteSlugs.has(slug)) brokenRelations.push(`topic:${entry.slug}->note:${slug}`);
    });
    entry.labSlugs.forEach((slug) => {
      if (!labSlugs.has(slug)) brokenRelations.push(`topic:${entry.slug}->lab:${slug}`);
    });
  }

  const orphanedEntries = [
    ...cstdCaseStudies.filter((entry) => !topicCaseSlugs.has(entry.slug)).map((entry) => `case:${entry.slug}`),
    ...cstdTechnicalNotes.filter((entry) => !topicNoteSlugs.has(entry.slug)).map((entry) => `note:${entry.slug}`),
    ...cstdLabs.filter((entry) => !topicLabSlugs.has(entry.slug)).map((entry) => `lab:${entry.slug}`),
  ];
  const staleArtifacts = cstdCaseStudies.flatMap((entry) => entry.artifacts
    .filter((artifact) => getFreshness(artifact.verifiedAt, now) === "stale")
    .map((artifact) => `${entry.slug}:${artifact.kind}:${artifact.verifiedAt}`));
  const missingLocalePairs = localizedPairs.filter((pair) => !localizedPairComplete(pair)).length;
  const topicEligibleCount = cstdCaseStudies.length + cstdTechnicalNotes.length + cstdLabs.length;
  const topicCoveredCount = topicEligibleCount - orphanedEntries.length;
  const relationCount = cstdCaseStudies.reduce((sum, entry) => sum + entry.relatedNoteSlugs.length + entry.relatedLabSlugs.length, 0)
    + cstdTechnicalNotes.reduce((sum, entry) => sum + entry.relatedCaseSlugs.length, 0)
    + cstdTopics.reduce((sum, entry) => sum + entry.caseSlugs.length + entry.noteSlugs.length + entry.labSlugs.length, 0);
  const validRelationCount = Math.max(0, relationCount - brokenRelations.length);
  const latestUpdate = [
    ...cstdCaseStudies.map((entry) => entry.updatedAt),
    ...cstdTechnicalNotes.map((entry) => entry.updatedAt),
    ...cstdLabs.map((entry) => entry.updatedAt),
  ].sort().at(-1) ?? "1970-01-01";
  const issueWeight = missingLocalePairs * 10 + brokenRelations.length * 10 + orphanedEntries.length * 4 + staleArtifacts.length * 2;
  const score = Math.max(0, 100 - issueWeight);
  const digest = createCstdDigest(JSON.stringify({
    cases: cstdCaseStudies.map((entry) => [entry.slug, entry.revision, entry.updatedAt]),
    notes: cstdTechnicalNotes.map((entry) => [entry.slug, entry.revision, entry.updatedAt]),
    labs: cstdLabs.map((entry) => [entry.slug, entry.version, entry.updatedAt]),
    topics: cstdTopics.map((entry) => entry.slug),
  }));

  return {
    schemaVersion: 1,
    release: "CSTD-9.0",
    generatedAt: latestUpdate,
    status: score === 100 ? "healthy" : "attention",
    score,
    freshness: getFreshness(latestUpdate, now),
    totals: {
      cases: cstdCaseStudies.length,
      notes: cstdTechnicalNotes.length,
      labs: cstdLabs.length,
      topics: cstdTopics.length,
      artifacts: cstdCaseStudies.reduce((sum, entry) => sum + entry.artifacts.length, 0),
      corrections: cstdTechnicalNotes.reduce((sum, entry) => sum + entry.corrections.length, 0),
    },
    coverage: {
      bilingualPercent: localizedPairs.length === 0 ? 100 : Math.round(((localizedPairs.length - missingLocalePairs) / localizedPairs.length) * 100),
      topicPercent: topicEligibleCount === 0 ? 100 : Math.round((topicCoveredCount / topicEligibleCount) * 100),
      relationPercent: relationCount === 0 ? 100 : Math.round((validRelationCount / relationCount) * 100),
    },
    issues: { missingLocalePairs, brokenRelations, orphanedEntries, staleArtifacts },
    provenance: {
      contract: "cstd.content-health/v1",
      digest,
      sources: [
        { id: "case-registry", href: "/work" },
        { id: "note-registry", href: "/notes" },
        { id: "topic-registry", href: "/topics.json" },
        { id: "lab-registry", href: "/lab" },
      ],
    },
  };
}

export const cstdContentHealth = createCstdContentHealth();
