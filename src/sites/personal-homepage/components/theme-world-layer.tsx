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

const sceneSequence: CstdSceneId[] = ["hero", "systems", "proof", "operator", "path", "finale"];

function getSceneLabel(theme: CstdThemeId, sceneId: CstdSceneId) {
  if (theme === "ink-protocol") return sceneCopy[sceneId].ink;
  if (theme === "press-room") return sceneCopy[sceneId].press;
  if (theme === "pixel-quest") return sceneCopy[sceneId].pixel;
  return sceneId.toUpperCase();
}

export function ThemeWorldLayer({ theme, activeSceneId }: { theme: CstdThemeId; activeSceneId: CstdSceneId }) {
  const meta = getCstdThemeMeta(theme);

  return (
    <div
      aria-hidden="true"
      data-cstd-theme-world
      data-cstd-theme-world-kind={meta.kind}
      data-cstd-theme-world-scene={activeSceneId}
      className={`pointer-events-none inset-0 z-0 overflow-hidden ${theme === "neon-district" ? "absolute" : "fixed"}`}
    >
      {theme !== "neon-district" ? (
        <Image
          src={cstdThemeWorldAssets[theme]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="cstd-theme-world-image object-cover"
        />
      ) : null}
      <div className="cstd-theme-world-wash absolute inset-0" />
      <div className="cstd-theme-world-texture absolute inset-0" />
      <div className="cstd-theme-world-register absolute inset-0" />
      <div className="cstd-theme-world-scene-label absolute">
        {getSceneLabel(theme, activeSceneId)}
      </div>
      {theme === "neon-district" ? (
        <>
          <div className="cstd-neon-world-grid absolute inset-0" />
          <div className="cstd-neon-world-target absolute"><span /><i /></div>
          <div className="cstd-neon-world-telemetry absolute">
            <span>SIG / CSTD-017</span><span>SYNC / {activeSceneId.toUpperCase()}</span><span>LAT / -33.8688</span>
          </div>
        </>
      ) : null}
      {theme === "ink-protocol" ? (
        <>
          <div className="cstd-ink-mist cstd-ink-mist-one absolute" />
          <div className="cstd-ink-mist cstd-ink-mist-two absolute" />
          <div className="cstd-ink-running-copy absolute"><span>造物</span><span>求真</span><span>知行</span></div>
          <div className="cstd-ink-seal absolute">CSTD</div>
        </>
      ) : null}
      {theme === "press-room" ? (
        <>
          <div className="cstd-press-column-grid absolute inset-0" />
          <div className="cstd-press-registration absolute"><i /><i /><i /><i /></div>
          <div className="cstd-press-furniture absolute inset-x-0 top-0 flex justify-between">
            <span>VOL. XVII</span><span>SYDNEY / NANJING</span><span>EST. 2026</span>
          </div>
        </>
      ) : null}
      {theme === "pixel-quest" ? (
        <>
          <div className="cstd-pixel-stars absolute inset-0" />
          <div className="cstd-pixel-terrain absolute inset-x-0 bottom-0"><i /><i /><i /><i /><i /></div>
          <div className="cstd-pixel-runner absolute"><span /></div>
          <div className="cstd-pixel-hud absolute inset-x-0 top-0 flex items-center justify-between">
            <span>PLAYER 01</span><span>XP 01700</span><span>BUILD × ∞</span>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function ThemeSceneNavigator({ theme, activeSceneId }: { theme: CstdThemeId; activeSceneId: CstdSceneId }) {
  return (
    <div
      aria-hidden="true"
      data-cstd-theme-scene-rail={theme}
      className="cstd-theme-scene-rail pointer-events-none z-[34]"
    >
      {sceneSequence.map((sceneId, index) => (
        <div
          key={sceneId}
          data-cstd-theme-scene-node={sceneId}
          data-cstd-theme-scene-active={activeSceneId === sceneId ? "true" : "false"}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{getSceneLabel(theme, sceneId)}</b>
        </div>
      ))}
    </div>
  );
}
