"use client";

import type { CSSProperties } from "react";
import { cstdSceneManifest, type CstdSceneId } from "../experience/scene-manifest";
import { cstdThemes, getCstdThemeMeta, type CstdThemeId } from "../experience/theme-store";
import { cstdThemeWorldAssets } from "../media/asset-manifest";
import type { CstdLocale, LocalizedText } from "../content/content-types";
import { CstdChapterLink } from "./site/cstd-chapter-link";

const sceneCopy: Record<CstdSceneId, { atelier: LocalizedText; neon: LocalizedText; underworld: LocalizedText; astral: LocalizedText }> = {
  hero: { atelier: { zh: "开始", en: "START" }, neon: { zh: "入侵", en: "BREACH" }, underworld: { zh: "门庭", en: "GATE" }, astral: { zh: "启程", en: "VENTURE" } },
  systems: { atelier: { zh: "方法", en: "METHOD" }, neon: { zh: "装载", en: "LOADOUT" }, underworld: { zh: "锻造", en: "FORGE" }, astral: { zh: "法术书", en: "SPELLBOOK" } },
  proof: { atelier: { zh: "作品", en: "WORK" }, neon: { zh: "追踪", en: "TRACE" }, underworld: { zh: "试炼", en: "TRIALS" }, astral: { zh: "判定", en: "ROLL" } },
  path: { atelier: { zh: "笔记", en: "NOTES" }, neon: { zh: "记忆", en: "MEMORY" }, underworld: { zh: "神谕", en: "ORACLE" }, astral: { zh: "编年史", en: "CHRONICLE" } },
  finale: { atelier: { zh: "联络", en: "CONTACT" }, neon: { zh: "撤离", en: "EXIT" }, underworld: { zh: "归返", en: "RETURN" }, astral: { zh: "传承", en: "LEGACY" } },
};

const visualWorldThemes = ["underworld-forge", "astral-covenant"] as const;

function getSceneLabel(theme: CstdThemeId, sceneId: CstdSceneId, locale: CstdLocale) {
  if (theme === "atelier") return sceneCopy[sceneId].atelier[locale];
  if (theme === "underworld-forge") return sceneCopy[sceneId].underworld[locale];
  if (theme === "astral-covenant") return sceneCopy[sceneId].astral[locale];
  return sceneCopy[sceneId].neon[locale];
}

export function ThemeWorldLayer({ theme, activeSceneId, locale }: { theme: CstdThemeId; activeSceneId: CstdSceneId; locale: CstdLocale }) {
  if (theme === "atelier") return null;
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
      <div data-cstd-theme-world-decoration="astral-covenant">
        <>
          <div className="cstd-astral-vignette absolute inset-0" />
          <div className="cstd-astral-routes absolute inset-0"><i /><i /><i /><i /><i /></div>
          <div className="cstd-astral-die absolute"><span>20</span><i /><b /></div>
          <div className="cstd-astral-compass absolute"><span /><i /><b /></div>
          <div className="cstd-astral-motes absolute inset-0"><i /><i /><i /><i /><i /><i /></div>
          <div className="cstd-astral-furniture absolute inset-x-0 top-0 flex justify-between">
            <span>{locale === "zh" ? "星界旅记 / 卷六" : "ASTRAL JOURNAL / VI"}</span>
            <span>{locale === "zh" ? "同行 · 抉择 · 传承" : "PARTY · CHOICE · LEGACY"}</span>
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
