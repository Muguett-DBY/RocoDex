"use client";

import { memo, type CSSProperties } from "react";
import {
  cstdSceneById,
  cstdSceneManifest,
  type CstdSceneId,
} from "../experience/scene-manifest";

function SceneDirector({ activeSceneId }: { activeSceneId: CstdSceneId }) {
  const activeScene = cstdSceneById[activeSceneId];

  return (
    <div
      aria-hidden="true"
      data-cstd-scene-director
      data-cstd-director-phase={activeSceneId}
      data-cstd-director-axis={activeScene.transition.axis}
      data-cstd-director-aperture={activeScene.transition.aperture}
      className="pointer-events-none fixed inset-0 z-[32] hidden overflow-hidden lg:block"
    >
      <span className="cstd-director-aperture cstd-director-aperture-top absolute inset-x-0 top-0 h-20 bg-[#050709]" />
      <span className="cstd-director-aperture cstd-director-aperture-bottom absolute inset-x-0 bottom-0 h-20 bg-[#050709]" />
      <span className="cstd-director-aperture cstd-director-aperture-left absolute inset-y-0 left-0 w-8 bg-[#050709]" />
      <span className="cstd-director-aperture cstd-director-aperture-right absolute inset-y-0 right-0 w-8 bg-[#050709]" />

      <div className="absolute right-7 top-24 flex items-center gap-3 font-mono text-[9px] font-black text-[#9aa4a8]">
        <span className="h-px w-12 bg-[#24e0ff]/55" />
        SCENE {String(activeScene.index + 1).padStart(2, "0")} / {String(cstdSceneManifest.length).padStart(2, "0")} / {activeScene.label.toUpperCase()}
      </div>
      <div className="cstd-velocity-meter absolute bottom-24 right-7 h-24 w-px bg-white/10">
        <span className="absolute inset-x-0 bottom-0 bg-[#ff3b30]" />
      </div>
      <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-3">
        {cstdSceneManifest.map((scene) => (
          <span
            key={scene.id}
            className="cstd-director-node h-1.5 w-8 border border-white/20 bg-[#050709]"
            data-cstd-director-node-active={scene.id === activeSceneId ? "true" : "false"}
            style={{ "--cstd-director-accent": scene.accent } as CSSProperties}
          />
        ))}
      </div>
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 font-mono text-[8px] font-black text-[#68757b]">
        {activeScene.signal}
      </div>
    </div>
  );
}

export const MemoizedSceneDirector = memo(SceneDirector);
