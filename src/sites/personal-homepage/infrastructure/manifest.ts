import type { CstdLocale } from "../content/content-types";
import { cstdLocaleConfig } from "./i18n";

export function createCstdManifest(locale: CstdLocale) {
  const isEnglish = locale === "en";
  return {
    id: isEnglish ? "/en" : "/",
    name: isEnglish ? "Custard // Personal Engineering Universe" : "奶黄包 // 个人工程宇宙",
    short_name: isEnglish ? "Custard" : "奶黄包",
    description: isEnglish
      ? "Custard's identity-first portfolio of shipped systems, executable evidence, and engineering knowledge."
      : "奶黄包以个人身份为核心，连接真实交付系统、可执行证据与长期工程知识。",
    lang: cstdLocaleConfig[locale].htmlLang,
    dir: "ltr",
    start_url: isEnglish ? "/en" : "/",
    scope: "/",
    display: "standalone",
    background_color: "#050709",
    theme_color: "#f4d431",
    icons: [
      { src: "/cstd-mascot.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  } as const;
}
