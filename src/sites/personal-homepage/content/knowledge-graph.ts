import { cstdArtBible } from "./art-bible";
import { cstdCaseStudies, getCaseStudyPath } from "./case-studies";
import type { CstdLocale, LocalizedText } from "./content-types";
import { cstdLabs, getLabPath } from "./labs";
import { cstdSystems, type CstdSystem } from "./systems";
import { cstdTechnicalNotes, getTechnicalNotePath } from "./technical-notes";
import { cstdTimeline } from "./timeline";

export type CstdKnowledgeNodeType = "system" | "case" | "note" | "lab" | "moment";

export type CstdKnowledgeNode = Readonly<{
  id: string;
  type: CstdKnowledgeNodeType;
  title: LocalizedText;
  summary: LocalizedText;
  href: Readonly<Record<CstdLocale, string>>;
  capabilityIds: readonly CstdSystem["id"][];
  updatedAt: string;
  image?: string;
}>;

export type CstdKnowledgeEdge = Readonly<{
  id: string;
  source: string;
  target: string;
  relation: "proves" | "explains" | "replays" | "evolves";
}>;

const systemNodes: readonly CstdKnowledgeNode[] = cstdSystems.map((entry) => ({
  id: `system:${entry.id}`,
  type: "system",
  title: { zh: entry.title, en: entry.district },
  summary: { zh: entry.summary, en: entry.relation },
  href: { zh: "/map", en: "/en/map" },
  capabilityIds: [entry.id],
  updatedAt: "2026-08-09",
  image: cstdArtBible[entry.id].image,
}));

const caseNodes: readonly CstdKnowledgeNode[] = cstdCaseStudies.map((entry) => ({
  id: `case:${entry.slug}`,
  type: "case",
  title: entry.title,
  summary: entry.summary,
  href: { zh: getCaseStudyPath(entry, "zh"), en: getCaseStudyPath(entry, "en") },
  capabilityIds: entry.capabilityIds,
  updatedAt: entry.updatedAt,
  image: entry.image.src,
}));

const noteNodes: readonly CstdKnowledgeNode[] = cstdTechnicalNotes.map((entry) => {
  const capabilities = new Set<CstdSystem["id"]>();
  for (const slug of entry.relatedCaseSlugs) {
    cstdCaseStudies.find((candidate) => candidate.slug === slug)?.capabilityIds.forEach((id) => capabilities.add(id));
  }
  return {
    id: `note:${entry.slug}`,
    type: "note",
    title: entry.title,
    summary: entry.summary,
    href: { zh: getTechnicalNotePath(entry, "zh"), en: getTechnicalNotePath(entry, "en") },
    capabilityIds: [...capabilities],
    updatedAt: entry.updatedAt,
    image: entry.image.src,
  };
});

const labNodes: readonly CstdKnowledgeNode[] = cstdLabs.map((entry) => {
  const relatedCase = cstdCaseStudies.find((candidate) => candidate.relatedLabSlugs.includes(entry.slug));
  return {
    id: `lab:${entry.slug}`,
    type: "lab",
    title: entry.title,
    summary: entry.summary,
    href: { zh: getLabPath(entry, "zh"), en: getLabPath(entry, "en") },
    capabilityIds: relatedCase?.capabilityIds ?? [],
    updatedAt: entry.updatedAt,
    image: entry.image.src,
  };
});

const momentNodes: readonly CstdKnowledgeNode[] = cstdTimeline.map((entry, index) => ({
  id: `moment:${entry.date}:${index}`,
  type: "moment",
  title: entry.title,
  summary: entry.summary,
  href: entry.evidence,
  capabilityIds: entry.capabilityIds,
  updatedAt: entry.date,
}));

const edges: CstdKnowledgeEdge[] = [];
const addEdge = (source: string, target: string, relation: CstdKnowledgeEdge["relation"]) => {
  const id = `${source}->${target}:${relation}`;
  if (!edges.some((edge) => edge.id === id)) edges.push({ id, source, target, relation });
};

for (const entry of cstdCaseStudies) {
  for (const capabilityId of entry.capabilityIds) addEdge(`case:${entry.slug}`, `system:${capabilityId}`, "proves");
  for (const noteSlug of entry.relatedNoteSlugs) addEdge(`note:${noteSlug}`, `case:${entry.slug}`, "explains");
  for (const labSlug of entry.relatedLabSlugs) addEdge(`lab:${labSlug}`, `case:${entry.slug}`, "replays");
}
for (const [index, entry] of cstdTimeline.entries()) {
  for (const capabilityId of entry.capabilityIds) addEdge(`moment:${entry.date}:${index}`, `system:${capabilityId}`, "evolves");
}

export const cstdKnowledgeGraph = {
  schemaVersion: 1,
  nodes: [...systemNodes, ...caseNodes, ...noteNodes, ...labNodes, ...momentNodes],
  edges,
} as const;

export const cstdKnowledgeGraphStats = {
  nodes: cstdKnowledgeGraph.nodes.length,
  edges: cstdKnowledgeGraph.edges.length,
  systems: systemNodes.length,
  evidenceNodes: caseNodes.length + noteNodes.length + labNodes.length,
} as const;

export function getCstdKnowledgeNode(id: string) {
  return cstdKnowledgeGraph.nodes.find((node) => node.id === id);
}
