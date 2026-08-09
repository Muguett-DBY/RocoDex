"use client";

import type { CstdSceneId } from "../experience/scene-manifest";
import { CstdLink } from "./site/cstd-link";
import { HomepageControls } from "./homepage-controls";

const homepageLinks = [
  { href: "#systems", label: "能力" },
  { href: "#proof", label: "作品" },
  { href: "#operator", label: "证据" },
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
      data-cstd-header-theme={activeSceneId}
      className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-white/10 bg-[#050709]/96 px-5 md:px-10 lg:px-12"
    >
      <a
        href="#top"
        className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
      >
        <span className="flex h-8 w-8 items-center justify-center bg-[#f4d431] text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">
          奶
        </span>
        <span className="whitespace-nowrap text-sm font-black">奶黄包</span>
        <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 sm:block" />
        <span className="hidden font-mono text-[9px] font-bold text-[#7f8b90] sm:inline">CSTD / PERSONAL STUDIO</span>
      </a>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <nav aria-label="首页导航" className="hidden items-center gap-5 font-mono text-[11px] font-semibold text-[#a5aaad] md:flex">
          {homepageLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              {link.label}
            </a>
          ))}
          <span aria-hidden="true" className="h-4 w-px bg-white/15" />
          <CstdLink href="/notes" className="transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]">
            札记
          </CstdLink>
          <CstdLink href="/about" className="transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]">
            关于
          </CstdLink>
        </nav>
        <a href="#proof" className="mr-1 font-mono text-xs font-semibold text-[#f4d431] md:hidden">
          作品
        </a>
        <HomepageControls
          overdrive={overdrive}
          reducedMotion={reducedMotion}
          onToggleOverdrive={onToggleOverdrive}
          onToggleMotion={onToggleMotion}
        />
      </div>
    </header>
  );
}
