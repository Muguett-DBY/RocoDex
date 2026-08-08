"use client";

import { memo } from "react";

const sceneNumbers = {
  hero: "00",
  systems: "01",
  proof: "02",
  operator: "03",
  path: "04",
} as const;

export type DirectedChapter = keyof typeof sceneNumbers;

function SceneDirector({ activeChapter }: { activeChapter: DirectedChapter }) {
  return (
    <div
      aria-hidden="true"
      data-cstd-scene-director
      data-cstd-director-phase={activeChapter}
      className="pointer-events-none fixed inset-0 z-[32] hidden overflow-hidden lg:block"
    >
      <span className="cstd-director-aperture cstd-director-aperture-top absolute inset-x-0 top-0 h-20 bg-[#050709]" />
      <span className="cstd-director-aperture cstd-director-aperture-bottom absolute inset-x-0 bottom-0 h-20 bg-[#050709]" />
      <span className="cstd-director-aperture cstd-director-aperture-left absolute inset-y-0 left-0 w-8 bg-[#050709]" />
      <span className="cstd-director-aperture cstd-director-aperture-right absolute inset-y-0 right-0 w-8 bg-[#050709]" />

      <div className="absolute right-7 top-24 flex items-center gap-3 font-mono text-[9px] font-black text-[#758086]">
        <span className="h-px w-12 bg-[#24e0ff]/55" />
        SCENE {sceneNumbers[activeChapter]} / DIRECTED
      </div>
      <div className="cstd-velocity-meter absolute bottom-24 right-7 h-24 w-px bg-white/10">
        <span className="absolute inset-x-0 bottom-0 bg-[#ff3b30]" />
      </div>
    </div>
  );
}

export const MemoizedSceneDirector = memo(SceneDirector);
