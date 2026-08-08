import type {
  ContentArtifact,
  ContentCorrection,
  ContentEvidence,
  ContentImage,
  ContentMetric,
  ContentTocEntry,
  LocalizedText,
  PublicationStatus,
} from "./content-types";
import type { CstdSystem } from "./systems";

export type CstdCaseStudy = Readonly<{
  slug: string;
  projectId: string;
  year: string;
  publicationStatus: PublicationStatus;
  revision: number;
  publishedAt: string;
  updatedAt: string;
  title: LocalizedText;
  kicker: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  status: LocalizedText;
  liveHref?: string;
  image: ContentImage;
  technologies: readonly string[];
  metrics: readonly ContentMetric[];
  evidence: readonly ContentEvidence[];
  toc: readonly ContentTocEntry[];
  capabilityIds: readonly CstdSystem["id"][];
  relatedNoteSlugs: readonly string[];
  relatedLabSlugs: readonly string[];
  artifacts: readonly ContentArtifact[];
}>;

export type CstdTechnicalNote = Readonly<{
  slug: string;
  publicationStatus: PublicationStatus;
  revision: number;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  category: LocalizedText;
  series: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  image: ContentImage;
  relatedCaseSlugs: readonly string[];
  tags: readonly string[];
  corrections: readonly ContentCorrection[];
  toc: readonly ContentTocEntry[];
}>;
