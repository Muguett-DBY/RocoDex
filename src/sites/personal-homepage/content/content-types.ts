export type CstdLocale = "zh" | "en";

export type LocalizedText = Readonly<Record<CstdLocale, string>>;

export type ContentMetric = Readonly<{
  value: string;
  label: LocalizedText;
}>;

export type ContentEvidence = Readonly<{
  label: LocalizedText;
  detail: LocalizedText;
}>;

export type ContentArtifactKind = "production" | "release" | "ci" | "test" | "note" | "lab";

export type ContentArtifact = Readonly<{
  kind: ContentArtifactKind;
  label: LocalizedText;
  detail: LocalizedText;
  href: LocalizedText;
  verifiedAt: string;
}>;

export type ContentTocEntry = Readonly<{
  id: string;
  eyebrow: LocalizedText | null;
  title: LocalizedText;
}>;

export type PublicationStatus = "draft" | "scheduled" | "published";

export type ContentCorrection = Readonly<{
  date: string;
  note: LocalizedText;
}>;

export type ContentSection = Readonly<{
  id: string;
  eyebrow?: LocalizedText;
  title: LocalizedText;
  paragraphs: readonly LocalizedText[];
  bullets?: readonly LocalizedText[];
  code?: Readonly<{
    language: string;
    label: LocalizedText;
    value: string;
  }>;
}>;

export type ContentImage = Readonly<{
  src: string;
  alt: LocalizedText;
  position?: string;
}>;

export function localize(text: LocalizedText, locale: CstdLocale) {
  return text[locale];
}

export const supportedCstdLocales = ["zh", "en"] as const satisfies readonly CstdLocale[];
