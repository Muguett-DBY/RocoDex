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
