import type { CstdLocale } from "../content/content-types";
import { cstdLocaleConfig } from "./i18n";

export function createCstdManifest(locale: CstdLocale) {
  const isEnglish = locale === "en";
  return {
    id: isEnglish ? "/en" : "/",
    name: isEnglish ? "Custard / Personal Studio" : "奶黄包 / 个人工作室",
    short_name: isEnglish ? "Custard" : "奶黄包",
    description: isEnglish
      ? "Data analysis, products, and the decisions behind the work."
      : "数据分析、产品开发，以及每份作品背后的思考。",
    lang: cstdLocaleConfig[locale].htmlLang,
    dir: "ltr",
    start_url: isEnglish ? "/en" : "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f5ef",
    theme_color: "#242b27",
    icons: [
      { src: "/cstd-atelier/mark-v1.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  } as const;
}
