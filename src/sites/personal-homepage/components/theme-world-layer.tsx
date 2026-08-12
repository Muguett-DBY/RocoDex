"use client";

import Image from "next/image";
import type { CstdSceneId } from "../experience/scene-manifest";
import { getCstdThemeMeta, type CstdThemeId } from "../experience/theme-store";
import { cstdThemeWorldAssets } from "../media/asset-manifest";

const sceneCopy: Record<CstdSceneId, { ink: string; press: string; pixel: string }> = {
  hero: { ink: "卷首", press: "FRONT PAGE", pixel: "STAGE 01" },
  systems: { ink: "器", press: "SYSTEMS DESK", pixel: "STAGE 02" },
  proof: { ink: "证", press: "FIELD REPORTS", pixel: "STAGE 03" },
  operator: { ink: "验", press: "LIVE LAB", pixel: "BOSS LAB" },
  path: { ink: "迹", press: "OPINION & NOTES", pixel: "LORE ROOM" },
  finale: { ink: "未完", press: "LATE EDITION", pixel: "CONTINUE?" },
};

export function ThemeWorldLayer({ theme, activeSceneId }: { theme: CstdThemeId; activeSceneId: CstdSceneId }) {
  const meta = getCstdThemeMeta(theme);
  if (theme === "neon-district") return null;

  return (
    <div
      aria-hidden="true"
      data-cstd-theme-world
      data-cstd-theme-world-kind={meta.kind}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Image
        src={cstdThemeWorldAssets[theme]}
        alt=""
        fill
        priority
        sizes="100vw"
        className="cstd-theme-world-image object-cover"
      />
      <div className="cstd-theme-world-wash absolute inset-0" />
      <div className="cstd-theme-world-texture absolute inset-0" />
      <div className="cstd-theme-world-register absolute inset-0" />
      <div className="cstd-theme-world-scene-label absolute">
        {theme === "ink-protocol" ? sceneCopy[activeSceneId].ink : theme === "press-room" ? sceneCopy[activeSceneId].press : sceneCopy[activeSceneId].pixel}
      </div>
      {theme === "ink-protocol" ? <div className="cstd-ink-seal absolute">CSTD</div> : null}
      {theme === "press-room" ? (
        <div className="cstd-press-furniture absolute inset-x-0 top-0 flex justify-between">
          <span>VOL. XVII</span><span>SYDNEY / NANJING</span><span>EST. 2026</span>
        </div>
      ) : null}
      {theme === "pixel-quest" ? (
        <>
          <div className="cstd-pixel-stars absolute inset-0" />
          <div className="cstd-pixel-hud absolute inset-x-0 top-0 flex items-center justify-between">
            <span>PLAYER 01</span><span>XP 01700</span><span>BUILD × ∞</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
