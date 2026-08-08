import { generatedCstdCaseStudies } from "./generated/content-registry";
import type { CstdCaseStudy } from "./content-models";
import type { CstdLocale } from "./content-types";

export type { CstdCaseStudy } from "./content-models";

export const cstdCaseStudies: readonly CstdCaseStudy[] = generatedCstdCaseStudies.filter(
  (entry) => entry.publicationStatus === "published",
);

export function getCstdCaseStudy(slug: string) {
  return cstdCaseStudies.find((entry) => entry.slug === slug);
}

export function getCaseStudyPath(caseStudy: CstdCaseStudy, locale: CstdLocale) {
  return locale === "en" ? `/en/work/${caseStudy.slug}` : `/work/${caseStudy.slug}`;
}
