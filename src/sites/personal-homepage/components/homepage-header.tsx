"use client";

import { clsx } from "clsx";
import { cstdSceneById, cstdSceneManifest, type CstdSceneId } from "../experience/scene-manifest";
import { CstdLink } from "./site/cstd-link";
import { HomepageControls } from "./homepage-controls";

const chapterLinks = cstdSceneManifest.filter((scene) => scene.id !== "hero" && scene.id !== "finale");

function ChapterRail({ activeChapter }: { activeChapter: CstdSceneId }) {
  return (
    <nav aria-label="章节导航" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
      {chapterLinks.map((chapter, index) => {
        const active = activeChapter === chapter.id;
        return (
          <a key={chapter.id} href={`#${chapter.id}`} aria-label={chapter.navLabel} className="group flex items-center justify-end gap-3 font-mono text-[10px] font-semibold text-[#8f9599] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]">
            <span className={clsx("transition-colors", active && "text-[#f4c95d]")}>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className={clsx("h-px bg-current transition-[width,color] duration-300", active ? "w-10 text-[#f4c95d]" : "w-4 text-[#555b60] group-hover:w-7")} />
          </a>
        );
      })}
    </nav>
  );
}

export function HomepageHeader({
  activeSceneId,
  overdrive,
  ambienceOn,
  reducedMotion,
  onToggleOverdrive,
  onToggleAmbience,
  onToggleMotion,
}: {
  activeSceneId: CstdSceneId;
  overdrive: boolean;
  ambienceOn: boolean;
  reducedMotion: boolean;
  onToggleOverdrive: () => void;
  onToggleAmbience: () => void;
  onToggleMotion: () => void;
}) {
  return (
    <>
      <header data-cstd-header-theme={activeSceneId} className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-[#f4d431]/35 bg-[#050709]/88 px-5 backdrop-blur-xl md:px-10 lg:px-12">
        <a href="#top" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]">
          <span className="flex h-8 w-8 items-center justify-center bg-[#f4d431] text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">奶</span>
          <span className="min-w-14 whitespace-nowrap text-sm font-black tracking-[0]">奶黄包</span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="hidden font-mono text-[10px] font-bold uppercase text-[#7f8b90] sm:inline">{cstdSceneById[activeSceneId].label}</span>
        </a>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <nav aria-label="主导航" className="hidden items-center gap-5 font-mono text-xs font-semibold text-[#a5aaad] md:flex">
            {chapterLinks.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeSceneId === chapter.id ? "page" : undefined} className="hidden transition-colors hover:text-[#f4c95d] aria-[current=page]:text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d] xl:inline">{chapter.navLabel}</a>)}
            <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 xl:block" />
            <CstdLink href="/work" className="transition-colors hover:text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]">档案</CstdLink>
            <CstdLink href="/notes" className="transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]">札记</CstdLink>
            <CstdLink href="/lab" className="transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]">LAB</CstdLink>
            <CstdLink href="/map" className="transition-colors hover:text-[#3dff8f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3dff8f]">图谱</CstdLink>
          </nav>
          <a href="#proof" className="mr-1 font-mono text-xs font-semibold text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d] md:hidden">作品</a>
          <HomepageControls overdrive={overdrive} ambienceOn={ambienceOn} reducedMotion={reducedMotion} onToggleOverdrive={onToggleOverdrive} onToggleAmbience={onToggleAmbience} onToggleMotion={onToggleMotion} />
        </div>
      </header>
      <ChapterRail activeChapter={activeSceneId} />
    </>
  );
}
