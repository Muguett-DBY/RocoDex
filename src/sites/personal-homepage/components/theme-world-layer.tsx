"use client";

import type { CSSProperties } from "react";
import { cstdSceneManifest, type CstdSceneId } from "../experience/scene-manifest";
import { cstdThemes, getCstdThemeMeta, type CstdThemeId } from "../experience/theme-store";
import { cstdThemeWorldAssets } from "../media/asset-manifest";
import type { CstdLocale, LocalizedText } from "../content/content-types";
import { CstdChapterLink } from "./site/cstd-chapter-link";

const sceneCopy: Record<CstdSceneId, { ink: LocalizedText; press: LocalizedText; pixel: LocalizedText; underworld: LocalizedText }> = {
  hero: { ink: { zh: "卷首", en: "OPEN" }, press: { zh: "头版", en: "FRONT PAGE" }, pixel: { zh: "关卡 01", en: "STAGE 01" }, underworld: { zh: "门庭", en: "GATE" } },
  systems: { ink: { zh: "器", en: "FORM" }, press: { zh: "系统部", en: "SYSTEMS DESK" }, pixel: { zh: "关卡 02", en: "STAGE 02" }, underworld: { zh: "锻造", en: "FORGE" } },
  proof: { ink: { zh: "证", en: "PROOF" }, press: { zh: "现场报道", en: "FIELD REPORTS" }, pixel: { zh: "关卡 03", en: "STAGE 03" }, underworld: { zh: "试炼", en: "TRIALS" } },
  path: { ink: { zh: "迹", en: "TRACE" }, press: { zh: "观点与札记", en: "OPINION & NOTES" }, pixel: { zh: "知识房", en: "LORE ROOM" }, underworld: { zh: "神谕", en: "ORACLE" } },
  finale: { ink: { zh: "未完", en: "NEXT" }, press: { zh: "晚刊", en: "LATE EDITION" }, pixel: { zh: "继续？", en: "CONTINUE?" }, underworld: { zh: "归返", en: "RETURN" } },
};

const visualWorldThemes = ["ink-protocol", "press-room", "pixel-quest", "underworld-forge"] as const;

function getSceneLabel(theme: CstdThemeId, sceneId: CstdSceneId, locale: CstdLocale) {
  if (theme === "ink-protocol") return sceneCopy[sceneId].ink[locale];
  if (theme === "press-room") return sceneCopy[sceneId].press[locale];
  if (theme === "pixel-quest") return sceneCopy[sceneId].pixel[locale];
  if (theme === "underworld-forge") return sceneCopy[sceneId].underworld[locale];
  return sceneId.toUpperCase();
}

export function ThemeWorldLayer({ theme, activeSceneId, locale }: { theme: CstdThemeId; activeSceneId: CstdSceneId; locale: CstdLocale }) {
  const meta = getCstdThemeMeta(theme);

  return (
    <div
      suppressHydrationWarning
      aria-hidden="true"
      data-cstd-theme-world
      data-cstd-theme-world-kind={meta.kind}
      data-cstd-theme-world-scene={activeSceneId}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {visualWorldThemes.map((candidateTheme) => (
        <div
          key={candidateTheme}
          data-cstd-theme-world-image={candidateTheme}
          className="cstd-theme-world-image absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cstdThemeWorldAssets[candidateTheme]})` } as CSSProperties}
        />
      ))}
      <div className="cstd-theme-world-wash absolute inset-0" />
      <div className="cstd-theme-world-texture absolute inset-0" />
      <div className="cstd-theme-world-register absolute inset-0" />
      <div className="cstd-theme-world-scene-label absolute">
        {cstdThemes.map((candidate) => (
          <span key={candidate.id} data-cstd-theme-world-copy={candidate.id}>{getSceneLabel(candidate.id, activeSceneId, locale)}</span>
        ))}
      </div>
      <div data-cstd-theme-world-decoration="neon-district">
        <>
          <div className="cstd-neon-world-grid absolute inset-0" />
          <div className="cstd-neon-world-target absolute"><span /><i /></div>
          <div className="cstd-neon-world-telemetry absolute">
            <span>{locale === "zh" ? "信号" : "SIG"} / CSTD-017</span><span>{locale === "zh" ? "同步" : "SYNC"} / {activeSceneId.toUpperCase()}</span><span>LAT / -33.8688</span>
          </div>
        </>
      </div>
      <div data-cstd-theme-world-decoration="ink-protocol">
        <>
          <div className="cstd-ink-mist cstd-ink-mist-one absolute" />
          <div className="cstd-ink-mist cstd-ink-mist-two absolute" />
          <div className="cstd-ink-running-copy absolute"><span>{locale === "zh" ? "造物" : "CRAFT"}</span><span>{locale === "zh" ? "求真" : "TRUTH"}</span><span>{locale === "zh" ? "知行" : "PRAXIS"}</span></div>
          <div className="cstd-ink-seal absolute">CSTD</div>
        </>
      </div>
      <div data-cstd-theme-world-decoration="press-room">
        <>
          <div className="cstd-press-column-grid absolute inset-0" />
          <div className="cstd-press-registration absolute"><i /><i /><i /><i /></div>
          <div className="cstd-press-furniture absolute inset-x-0 top-0 flex justify-between">
            <span>VOL. XVII</span><span>SYDNEY / NANJING</span><span>EST. 2026</span>
          </div>
        </>
      </div>
      <div data-cstd-theme-world-decoration="pixel-quest">
        <>
          <div className="cstd-pixel-stars absolute inset-0" />
          <div className="cstd-pixel-terrain absolute inset-x-0 bottom-0"><i /><i /><i /><i /><i /></div>
          <div className="cstd-pixel-runner absolute"><span /></div>
          <div className="cstd-pixel-hud absolute inset-x-0 top-0 flex items-center justify-between">
            <span>{locale === "zh" ? "玩家 01" : "PLAYER 01"}</span><span>XP 01700</span><span>{locale === "zh" ? "构建" : "BUILD"} × ∞</span>
          </div>
        </>
      </div>
      <div data-cstd-theme-world-decoration="underworld-forge">
        <>
          <div className="cstd-underworld-vignette absolute inset-0" />
          <div className="cstd-underworld-arch absolute"><span /><span /><span /></div>
          <div className="cstd-underworld-embers absolute inset-0"><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="cstd-underworld-orbit absolute"><span /><i /><b /></div>
          <div className="cstd-underworld-furniture absolute inset-x-0 top-0 flex justify-between">
            <span>{locale === "zh" ? "冥府档案 / 卷五" : "UNDERWORLD ARCHIVE / V"}</span>
            <span>{locale === "zh" ? "造物 · 试炼 · 归返" : "CRAFT · TRIAL · RETURN"}</span>
          </div>
        </>
      </div>
    </div>
  );
}

export function ThemeSceneNavigator({ theme, activeSceneId, locale }: { theme: CstdThemeId; activeSceneId: CstdSceneId; locale: CstdLocale }) {
  return (
    <nav
      suppressHydrationWarning
      aria-label={locale === "zh" ? "五幕主页导航" : "Five-act homepage navigation"}
      data-cstd-theme-scene-rail={theme}
      className="cstd-theme-scene-rail pointer-events-auto z-[34]"
    >
      {cstdSceneManifest.map((scene, index) => (
        <div
          key={scene.id}
          data-cstd-theme-scene-node={scene.id}
          data-cstd-theme-scene-active={activeSceneId === scene.id ? "true" : "false"}
        >
          <CstdChapterLink href={scene.shareHref} aria-current={activeSceneId === scene.id ? "location" : undefined} aria-label={`${String(index + 1).padStart(2, "0")} / ${scene.navLabel[locale]}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{cstdThemes.map((candidate) => <span key={candidate.id} data-cstd-theme-scene-copy={candidate.id}>{getSceneLabel(candidate.id, scene.id, locale)}</span>)}</b>
          </CstdChapterLink>
        </div>
      ))}
    </nav>
  );
}
