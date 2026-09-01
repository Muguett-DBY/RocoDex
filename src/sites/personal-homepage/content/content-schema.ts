import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const internalOrHttpsHref = z.string().refine(
  (value) => value.startsWith("/") || value.startsWith("https://"),
  "Expected an internal path or HTTPS URL",
);

const localizedTextSchema = z.object({
  zh: z.string().min(1),
  en: z.string().min(1),
}).strict();

const imageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: localizedTextSchema,
  position: z.string().optional(),
}).strict();

const metricSchema = z.object({
  value: z.string().min(1),
  label: localizedTextSchema,
}).strict();

const evidenceSchema = z.object({
  label: localizedTextSchema,
  detail: localizedTextSchema,
}).strict();

const tocSchema = z.object({
  id: slug,
  eyebrow: localizedTextSchema.nullable(),
  title: localizedTextSchema,
}).strict();

const artifactSchema = z.object({
  kind: z.enum(["production", "release", "ci", "test", "note", "lab"]),
  label: localizedTextSchema,
  detail: localizedTextSchema,
  href: z.object({ zh: internalOrHttpsHref, en: internalOrHttpsHref }).strict(),
  verifiedAt: isoDate,
}).strict();

const caseFilmSchema = z.object({
  durationSeconds: z.number().int().min(45).max(240),
  logline: localizedTextSchema,
  beats: z.array(z.object({
    id: slug,
    phase: z.enum(["problem", "constraint", "decision", "architecture", "failure", "evidence", "outcome"]),
    title: localizedTextSchema,
    detail: localizedTextSchema,
    signal: localizedTextSchema,
  }).strict()).min(4).max(7),
}).strict();

const publicationSchema = {
  schemaVersion: z.literal(1),
  publicationStatus: z.enum(["draft", "scheduled", "published"]),
  revision: z.number().int().positive(),
  publishedAt: isoDate,
  updatedAt: isoDate,
};

export const caseDocumentSchema = z.object({
  kind: z.literal("case"),
  ...publicationSchema,
  slug,
  projectId: slug,
  year: z.string().regex(/^20\d{2}$/),
  title: localizedTextSchema,
  kicker: localizedTextSchema,
  summary: localizedTextSchema,
  film: caseFilmSchema,
  role: localizedTextSchema,
  runtimeStatus: localizedTextSchema,
  liveHref: z.string().url().nullable(),
  image: imageSchema,
  technologies: z.array(z.string().min(1)).min(4),
  metrics: z.array(metricSchema).min(2),
  evidence: z.array(evidenceSchema).min(3),
  capabilityIds: z.array(z.enum(["product-surfaces", "edge-operations", "ai-creation", "research-models", "data-systems"])).min(1),
  relatedNoteSlugs: z.array(slug),
  relatedLabSlugs: z.array(slug).min(1),
  artifacts: z.array(artifactSchema).min(2),
  toc: z.array(tocSchema).min(3),
}).strict();

export const noteDocumentSchema = z.object({
  kind: z.literal("note"),
  ...publicationSchema,
  slug,
  readingMinutes: z.number().int().positive(),
  category: localizedTextSchema,
  series: localizedTextSchema,
  title: localizedTextSchema,
  summary: localizedTextSchema,
  image: imageSchema,
  relatedCaseSlugs: z.array(slug).min(1),
  tags: z.array(z.string().min(1)).min(2),
  corrections: z.array(z.object({ date: isoDate, note: localizedTextSchema }).strict()),
  toc: z.array(tocSchema).min(3),
}).strict();

export type CaseDocumentMetadata = z.infer<typeof caseDocumentSchema>;
export type NoteDocumentMetadata = z.infer<typeof noteDocumentSchema>;
