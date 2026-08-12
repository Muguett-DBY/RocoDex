"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { CstdLocale } from "../../content/content-types";
import { cstdLocaleConfig, getLocalizedCstdHref } from "../../infrastructure/i18n";
import { CstdLink } from "./cstd-link";

const localeStorageKey = "cstd-locale";
const localeCookieMaxAge = 60 * 60 * 24 * 365;

function subscribeLocation(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("pageshow", onStoreChange);
  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("pageshow", onStoreChange);
  };
}

function getLocationSuffix() {
  return `${window.location.search}${window.location.hash}`;
}

function getServerLocationSuffix() {
  return "";
}

export function CstdLanguageSwitcher({ locale, compact = false }: { locale: CstdLocale; compact?: boolean }) {
  const pathname = usePathname() || "/";
  const targetLocale: CstdLocale = locale === "zh" ? "en" : "zh";
  const target = cstdLocaleConfig[targetLocale];
  const locationSuffix = useSyncExternalStore(subscribeLocation, getLocationSuffix, getServerLocationSuffix);
  const href = getLocalizedCstdHref(`${pathname}${locationSuffix}`, targetLocale);
  const label = locale === "zh" ? "切换到英文" : "Switch to Chinese";

  function rememberLocale() {
    document.documentElement.lang = target.htmlLang;
    document.documentElement.dataset.cstdLocale = targetLocale;
    document.cookie = `${localeStorageKey}=${targetLocale}; Max-Age=${localeCookieMaxAge}; Path=/; SameSite=Lax; Secure`;
    try {
      window.localStorage.setItem(localeStorageKey, targetLocale);
    } catch {
      // Navigation remains functional when storage is unavailable.
    }
  }

  return (
    <CstdLink
      href={href}
      hrefLang={target.htmlLang}
      lang={target.htmlLang}
      data-cstd-locale-switch
      data-cstd-locale-from={locale}
      data-cstd-locale-to={targetLocale}
      aria-label={label}
      title={label}
      onClick={rememberLocale}
      className="cstd-locale-switcher flex h-9 min-w-9 items-center justify-center gap-2 border border-white/15 px-2 font-mono text-[10px] font-black text-[#9aa4a8] transition-colors hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]"
    >
      <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className={compact ? "sr-only" : "hidden xl:inline"}>{target.shortLabel}</span>
    </CstdLink>
  );
}
