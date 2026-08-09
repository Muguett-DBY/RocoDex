"use client";

import Image from "next/image";
import { memo } from "react";
import { getCstdSceneWindow, type CstdSceneId } from "../experience/scene-manifest";
import { cstdVisualAssetByScene } from "../media/asset-manifest";

function WorldBackdrop({ activeSceneId }: { activeSceneId: CstdSceneId }) {
  const sceneWindow = getCstdSceneWindow(activeSceneId);

  return (
    <div
      aria-hidden="true"
      data-cstd-world-backdrop
      data-cstd-world-scene={activeSceneId}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050709]"
    >
      {sceneWindow.map((scene) => {
        const asset = cstdVisualAssetByScene[scene.id];
        const active = scene.id === activeSceneId;
        return (
          <div
            key={scene.id}
            data-cstd-world-frame={scene.id}
            data-cstd-world-frame-active={active ? "true" : "false"}
            className="cstd-world-frame absolute inset-0"
          >
            <Image
              src={asset.src}
              alt=""
              fill
              loading={asset.priority ? "eager" : "lazy"}
              fetchPriority={asset.priority ? "high" : "auto"}
              sizes="100vw"
              className="cstd-world-frame-image object-cover"
              style={{ objectPosition: asset.position }}
            />
          </div>
        );
      })}

      <div className="cstd-world-vignette absolute inset-0" />
      <div className="cstd-world-depth absolute inset-0" />
      <div className="cstd-world-grid absolute inset-0" />
      <div className="cstd-world-rain absolute inset-0" />
      <div className="cstd-world-transition absolute inset-0" />
    </div>
  );
}

export const MemoizedWorldBackdrop = memo(WorldBackdrop);
