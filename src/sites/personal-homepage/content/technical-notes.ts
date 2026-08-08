import { generatedCstdTechnicalNotes } from "./generated/content-registry";
import type { CstdTechnicalNote } from "./content-models";
import type { CstdLocale } from "./content-types";

export type { CstdTechnicalNote } from "./content-models";

export const cstdTechnicalNotes: readonly CstdTechnicalNote[] = generatedCstdTechnicalNotes.filter(
  (entry) => entry.publicationStatus === "published",
);

export function getCstdTechnicalNote(slug: string) {
  return cstdTechnicalNotes.find((entry) => entry.slug === slug);
}

export function getTechnicalNotePath(note: CstdTechnicalNote, locale: CstdLocale) {
  return locale === "en" ? `/en/notes/${note.slug}` : `/notes/${note.slug}`;
}
