"use client";

import { useEffect } from "react";
import type { CstdLocale } from "../../content/content-types";
import { cstdLocaleConfig } from "../../infrastructure/i18n";

export function CstdDocumentLocale({ locale }: { locale: CstdLocale }) {
  const config = cstdLocaleConfig[locale];
  const script = `document.documentElement.lang=${JSON.stringify(config.htmlLang)};document.documentElement.dir="ltr";document.documentElement.dataset.cstdLocale=${JSON.stringify(locale)};`;

  useEffect(() => {
    document.documentElement.lang = config.htmlLang;
    document.documentElement.dir = "ltr";
    document.documentElement.dataset.cstdLocale = locale;
  }, [config.htmlLang, locale]);

  return <script data-cstd-document-locale={locale} dangerouslySetInnerHTML={{ __html: script }} />;
}
