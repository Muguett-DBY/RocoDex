import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import type { CstdLocale, LocalizedText } from "../../content/content-types";
import { cstdLabs, getLabPath } from "../../content/labs";
import { cstdSystems } from "../../content/systems";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../../content/technical-notes";
import { cstdTimeline } from "../../content/timeline";

export type GuideSourceType = "case" | "note" | "capability" | "lab" | "moment";

export type GuideKnowledgeEntry = Readonly<{
  id: string;
  type: GuideSourceType;
  title: LocalizedText;
  summary: LocalizedText;
  href: Readonly<Record<CstdLocale, string>>;
  keywords: readonly string[];
  updatedAt: string;
  relatedIds: readonly string[];
}>;

const caseEntries: readonly GuideKnowledgeEntry[] = cstdCaseStudies.map((entry) => ({
  id: `case:${entry.slug}`,
  type: "case",
  title: entry.title,
  summary: entry.summary,
  href: { zh: getCaseStudyPath(entry, "zh"), en: getCaseStudyPath(entry, "en") },
  keywords: [entry.projectId, ...entry.technologies, ...entry.capabilityIds, ...entry.evidence.flatMap((item) => [item.label.zh, item.label.en, item.detail.zh, item.detail.en])],
  updatedAt: entry.updatedAt,
  relatedIds: [
    ...entry.capabilityIds.map((id) => `capability:${id}`),
    ...entry.relatedNoteSlugs.map((slug) => `note:${slug}`),
    ...entry.relatedLabSlugs.map((slug) => `lab:${slug}`),
  ],
}));

const noteEntries: readonly GuideKnowledgeEntry[] = cstdTechnicalNotes.map((entry) => ({
  id: `note:${entry.slug}`,
  type: "note",
  title: entry.title,
  summary: entry.summary,
  href: { zh: getTechnicalNotePath(entry, "zh"), en: getTechnicalNotePath(entry, "en") },
  keywords: [...entry.tags, entry.category.zh, entry.category.en, entry.series.zh, entry.series.en, ...entry.relatedCaseSlugs],
  updatedAt: entry.updatedAt,
  relatedIds: entry.relatedCaseSlugs.map((slug) => `case:${slug}`),
}));

const capabilityEntries: readonly GuideKnowledgeEntry[] = cstdSystems.map((entry) => ({
  id: `capability:${entry.id}`,
  type: "capability",
  title: { zh: entry.title, en: entry.district },
  summary: { zh: `${entry.summary}${entry.evidence}`, en: `${entry.relation} Evidence: ${entry.evidence}` },
  href: { zh: entry.evidenceLinks[0].href, en: `/en${entry.evidenceLinks[0].href}` },
  keywords: [entry.id, entry.code, entry.district, entry.relation, ...entry.stack],
  updatedAt: "2026-08-09",
  relatedIds: cstdCaseStudies.filter((candidate) => candidate.capabilityIds.includes(entry.id)).map((candidate) => `case:${candidate.slug}`),
}));

const labEntries: readonly GuideKnowledgeEntry[] = cstdLabs.map((entry) => ({
  id: `lab:${entry.slug}`,
  type: "lab",
  title: entry.title,
  summary: { zh: `${entry.summary.zh}${entry.principle.zh}`, en: `${entry.summary.en} ${entry.principle.en}` },
  href: { zh: getLabPath(entry, "zh"), en: getLabPath(entry, "en") },
  keywords: [entry.slug, entry.renderer, ...entry.tags],
  updatedAt: entry.updatedAt,
  relatedIds: cstdCaseStudies.filter((candidate) => candidate.relatedLabSlugs.includes(entry.slug)).map((candidate) => `case:${candidate.slug}`),
}));

const momentEntries: readonly GuideKnowledgeEntry[] = cstdTimeline.map((entry, index) => ({
  id: `moment:${entry.date}:${index}`,
  type: "moment",
  title: entry.title,
  summary: entry.summary,
  href: entry.evidence,
  keywords: [entry.kind, entry.date, ...entry.capabilityIds],
  updatedAt: entry.date,
  relatedIds: entry.capabilityIds.map((id) => `capability:${id}`),
}));

export const guideKnowledge: readonly GuideKnowledgeEntry[] = [
  ...caseEntries,
  ...noteEntries,
  ...capabilityEntries,
  ...labEntries,
  ...momentEntries,
];
