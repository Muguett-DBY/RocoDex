import type { CstdLocale } from "../content/content-types";

export const cstdLocaleConfig = {
  zh: {
    htmlLang: "zh-CN",
    openGraphLocale: "zh_CN",
    pathPrefix: "",
    label: "中文",
    shortLabel: "中",
  },
  en: {
    htmlLang: "en-AU",
    openGraphLocale: "en_AU",
    pathPrefix: "/en",
    label: "English",
    shortLabel: "EN",
  },
} as const satisfies Record<CstdLocale, {
  htmlLang: string;
  openGraphLocale: string;
  pathPrefix: string;
  label: string;
  shortLabel: string;
}>;

export const defaultCstdLocale: CstdLocale = "zh";

function stripInternalPrefix(pathname: string) {
  if (pathname === "/cstd") return "/";
  return pathname.startsWith("/cstd/") ? pathname.slice(5) : pathname;
}

function stripLocalePrefix(pathname: string) {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

export function getCstdLocaleFromPathname(pathname: string): CstdLocale {
  const publicPathname = stripInternalPrefix(pathname);
  return publicPathname === "/en" || publicPathname.startsWith("/en/") ? "en" : defaultCstdLocale;
}

export function getLocalizedCstdPathname(pathname: string, locale: CstdLocale) {
  const publicPathname = stripInternalPrefix(pathname || "/");
  const basePathname = stripLocalePrefix(publicPathname);
  if (locale === "zh") return basePathname || "/";
  return basePathname === "/" ? "/en" : `/en${basePathname}`;
}

export function getLocalizedCstdHref(href: string, locale: CstdLocale) {
  if (!href.startsWith("/")) return href;
  const suffixIndex = href.search(/[?#]/);
  const pathname = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : href.slice(suffixIndex);
  return `${getLocalizedCstdPathname(pathname, locale)}${suffix}`;
}

export function getCstdLanguageAlternates(pathname: string) {
  const zhPath = getLocalizedCstdPathname(pathname, "zh");
  const enPath = getLocalizedCstdPathname(pathname, "en");
  return {
    "zh-CN": zhPath,
    "en-AU": enPath,
    "x-default": zhPath,
  } as const;
}
