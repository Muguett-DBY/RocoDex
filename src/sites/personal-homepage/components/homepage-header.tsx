"use client";

import { clsx } from "clsx";
import { cstdSceneManifest, type CstdSceneId } from "../experience/scene-manifest";
import { HomepageControls } from "./homepage-controls";
import { ThemeSwitcher } from "./theme-switcher";
import { CstdChapterLink } from "./site/cstd-chapter-link";
import { CstdLink } from "./site/cstd-link";
import { cstdThemes, getCstdThemeMeta, useCstdTheme, type CstdThemeId } from "../experience/theme-store";
import type { CstdLocale } from "../content/content-types";
import { getLocalizedCstdHref } from "../infrastructure/i18n";
import { CstdLanguageSwitcher } from "./site/cstd-language-switcher";

const homepageLinks = cstdSceneManifest.filter((scene) => scene.id === "systems" || scene.id === "proof" || scene.id === "path");

function getThemeMark(theme: CstdThemeId, locale: CstdLocale) {
  if (theme === "ink-protocol") return locale === "zh" ? "墨" : "IK";
  if (theme === "press-room") return locale === "zh" ? "报" : "PR";
  if (theme === "pixel-quest") return "8B";
  if (theme === "underworld-forge") return locale === "zh" ? "冥" : "UF";
  return locale === "zh" ? "奶" : "CS";
}

export function HomepageHeader({
  activeSceneId,
  locale,
  overdrive,
  reducedMotion,
  onToggleOverdrive,
  onToggleMotion,
}: {
  activeSceneId: CstdSceneId;
  locale: CstdLocale;
  overdrive: boolean;
  reducedMotion: boolean;
  onToggleOverdrive: () => void;
  onToggleMotion: () => void;
}) {
  const theme = useCstdTheme();
  const themeMeta = getCstdThemeMeta(theme);
  return (
    <header
      suppressHydrationWarning
      data-cstd-home-header
      data-cstd-header-theme={activeSceneId}
      data-cstd-header-world={themeMeta.kind}
      className="pointer-events-none fixed inset-x-3 top-3 z-50 md:inset-x-6 md:top-5"
    >
      <div className="pointer-events-auto relative mx-auto flex h-14 w-full max-w-[1320px] items-center overflow-hidden rounded-[7px] border border-white/10 bg-[#050709]/95 px-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.3)] md:px-3">
        <CstdChapterLink
          href="#top"
          className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4d431]"
        >
          <span data-cstd-header-mark className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f4d431] text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">
            {cstdThemes.map((candidate) => <span key={candidate.id} data-cstd-theme-mark-copy={candidate.id}>{getThemeMark(candidate.id, locale)}</span>)}
          </span>
          <span className="min-w-0 overflow-hidden">
            <span data-cstd-header-brand className="hidden truncate text-sm font-black sm:block">
              {cstdThemes.map((candidate) => <span key={candidate.id} data-cstd-theme-meta-copy={candidate.id}>{candidate.brand[locale]}</span>)}
            </span>
            <span data-cstd-header-brand-compact className="block truncate text-xs font-black sm:hidden">
              {cstdThemes.map((candidate) => <span key={candidate.id} data-cstd-theme-meta-copy={candidate.id}>{candidate.compactBrand[locale]}</span>)}
            </span>
            <span data-cstd-header-edition className="hidden whitespace-nowrap text-[8px] font-bold uppercase lg:block">
              {cstdThemes.map((candidate) => <span key={candidate.id} data-cstd-theme-meta-copy={candidate.id}>{candidate.edition[locale]}</span>)}
            </span>
          </span>
        </CstdChapterLink>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 min-[360px]:gap-2 md:gap-4">
          <nav aria-label={locale === "zh" ? "首页导航" : "Homepage navigation"} className="hidden items-center gap-0.5 text-[12px] font-semibold text-[#9ca5a8] md:flex">
            {homepageLinks.map((link) => {
              const active = activeSceneId === link.id;
              return (
                <CstdChapterLink
                  key={link.shareHref}
                  href={link.shareHref}
                  aria-current={active ? "location" : undefined}
                  data-cstd-nav-active={active ? "true" : "false"}
                  className={clsx(
                    "relative px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f4d431]",
                    active ? "text-[#f4d431]" : "hover:text-white",
                  )}
                >
                  {link.navLabel[locale]}
                </CstdChapterLink>
              );
            })}
            <span aria-hidden="true" className="mx-2 h-4 w-px bg-white/10" />
            <CstdLink eagerPrefetch href={getLocalizedCstdHref("/notes", locale)} className="px-2.5 py-2 transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#24e0ff]">
              {locale === "zh" ? "札记" : "Notes"}
            </CstdLink>
            <CstdLink eagerPrefetch href={getLocalizedCstdHref("/about", locale)} className="px-2.5 py-2 transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#24e0ff]">
              {locale === "zh" ? "关于" : "About"}
            </CstdLink>
          </nav>
          <CstdChapterLink href="#proof" className="mr-1 hidden font-mono text-xs font-semibold text-[#f4d431] min-[360px]:inline-flex md:hidden">
            {locale === "zh" ? "证据" : "Evidence"}
          </CstdChapterLink>
          <ThemeSwitcher locale={locale} />
          <CstdLanguageSwitcher locale={locale} compact />
          <HomepageControls
            locale={locale}
            overdrive={overdrive}
            reducedMotion={reducedMotion}
            onToggleOverdrive={onToggleOverdrive}
            onToggleMotion={onToggleMotion}
          />
        </div>
      </div>
    </header>
  );
}
