"use client";

import { clsx } from "clsx";
import type { CstdSceneId } from "../experience/scene-manifest";
import { HomepageControls } from "./homepage-controls";
import { ThemeSwitcher } from "./theme-switcher";
import { CstdChapterLink } from "./site/cstd-chapter-link";
import { CstdLink } from "./site/cstd-link";
import { getCstdThemeMeta, useCstdTheme } from "../experience/theme-store";

const homepageLinks = [
  { href: "#systems", label: "能力", sceneId: "systems" },
  { href: "#proof", label: "作品", sceneId: "proof" },
  { href: "#operator", label: "证据", sceneId: "operator" },
] as const;

export function HomepageHeader({
  activeSceneId,
  overdrive,
  reducedMotion,
  onToggleOverdrive,
  onToggleMotion,
}: {
  activeSceneId: CstdSceneId;
  overdrive: boolean;
  reducedMotion: boolean;
  onToggleOverdrive: () => void;
  onToggleMotion: () => void;
}) {
  const theme = useCstdTheme();
  const themeMeta = getCstdThemeMeta(theme);
  const mark = theme === "ink-protocol" ? "墨" : theme === "press-room" ? "报" : theme === "pixel-quest" ? "8B" : "奶";
  return (
    <header
      data-cstd-home-header
      data-cstd-header-theme={activeSceneId}
      data-cstd-header-world={themeMeta.kind}
      className="pointer-events-none fixed inset-x-3 top-3 z-50 md:inset-x-6 md:top-5"
    >
      <div className="pointer-events-auto relative mx-auto flex h-14 w-full max-w-[1320px] items-center overflow-hidden rounded-[7px] border border-white/10 bg-[#050709]/95 px-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.3)] md:px-3">
        <CstdChapterLink
          href="#top"
          className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4d431]"
        >
          <span data-cstd-header-mark className="flex h-9 w-9 items-center justify-center bg-[#f4d431] text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">
            {mark}
          </span>
          <span className="min-w-0">
            <span data-cstd-header-brand className="block whitespace-nowrap text-sm font-black">{themeMeta.brand}</span>
            <span data-cstd-header-edition className="hidden whitespace-nowrap text-[8px] font-bold uppercase lg:block">{themeMeta.edition}</span>
          </span>
        </CstdChapterLink>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <nav aria-label="首页导航" className="hidden items-center gap-0.5 text-[12px] font-semibold text-[#9ca5a8] md:flex">
            {homepageLinks.map((link) => {
              const active = activeSceneId === link.sceneId;
              return (
                <CstdChapterLink
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  data-cstd-nav-active={active ? "true" : "false"}
                  className={clsx(
                    "relative px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f4d431]",
                    active ? "text-[#f4d431]" : "hover:text-white",
                  )}
                >
                  {link.label}
                </CstdChapterLink>
              );
            })}
            <span aria-hidden="true" className="mx-2 h-4 w-px bg-white/10" />
            <CstdLink eagerPrefetch href="/notes" className="px-2.5 py-2 transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#24e0ff]">
              札记
            </CstdLink>
            <CstdLink eagerPrefetch href="/about" className="px-2.5 py-2 transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#24e0ff]">
              关于
            </CstdLink>
          </nav>
          <CstdChapterLink href="#proof" className="mr-1 font-mono text-xs font-semibold text-[#f4d431] md:hidden">
            作品
          </CstdChapterLink>
          <ThemeSwitcher />
          <HomepageControls
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
