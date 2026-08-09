"use client";

import { clsx } from "clsx";
import { lazy, Suspense } from "react";
import type { CstdSceneId } from "../experience/scene-manifest";
import { CstdChapterLink } from "./site/cstd-chapter-link";

const LazyCstdLink = lazy(() =>
  import("./site/cstd-link").then((module) => ({ default: module.CstdLink })),
);
const LazyHomepageControls = lazy(() =>
  import("./homepage-controls").then((module) => ({ default: module.HomepageControls })),
);

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
  return (
    <header
      data-cstd-home-header
      data-cstd-header-theme={activeSceneId}
      className="pointer-events-none fixed inset-x-3 top-3 z-50 md:inset-x-5 md:top-4"
    >
      <div className="pointer-events-auto relative mx-auto flex h-14 w-full max-w-[1440px] items-center overflow-hidden rounded-[8px] border border-white/12 bg-[#050709]/98 px-2.5 shadow-[0_18px_60px_rgba(0,0,0,0.34)] md:px-3">
        <CstdChapterLink
          href="#top"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4d431]"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-[#f4d431] text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">
            奶
          </span>
          <span className="whitespace-nowrap text-sm font-black">奶黄包</span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="hidden font-mono text-[9px] font-bold text-[#7f8b90] sm:inline">CSTD / 05</span>
        </CstdChapterLink>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <nav aria-label="首页导航" className="hidden items-center gap-1 font-mono text-[10px] font-bold text-[#a5aaad] md:flex">
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
            <span aria-hidden="true" className="mx-2 h-4 w-px bg-white/15" />
            <Suspense fallback={<><a href="/notes" className="px-2 py-2">札记</a><a href="/about" className="px-2 py-2">关于</a></>}>
              <LazyCstdLink eagerPrefetch href="/notes" className="px-2 py-2 transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#24e0ff]">
                札记
              </LazyCstdLink>
              <LazyCstdLink eagerPrefetch href="/about" className="px-2 py-2 transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#24e0ff]">
                关于
              </LazyCstdLink>
            </Suspense>
          </nav>
          <CstdChapterLink href="#proof" className="mr-1 font-mono text-xs font-semibold text-[#f4d431] md:hidden">
            作品
          </CstdChapterLink>
          <Suspense fallback={<span aria-hidden="true" className="h-9 w-[4.75rem] border border-white/10" />}>
            <LazyHomepageControls
              overdrive={overdrive}
              reducedMotion={reducedMotion}
              onToggleOverdrive={onToggleOverdrive}
              onToggleMotion={onToggleMotion}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
