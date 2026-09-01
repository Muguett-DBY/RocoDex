"use client";

import { useSyncExternalStore } from "react";
import type { LocalizedText } from "../content/content-types";

export type CstdThemeId = "neon-district" | "underworld-forge" | "astral-covenant";
export type CstdThemeKind = "cyberpunk" | "mythic-underworld" | "fantasy-codex";

export type CstdThemeMeta = Readonly<{
  id: CstdThemeId;
  kind: CstdThemeKind;
  label: string;
  zhLabel: string;
  description: string;
  zhDescription: string;
  swatch: string;
  signal: string;
  brand: LocalizedText;
  compactBrand: LocalizedText;
  edition: LocalizedText;
}>;

const cstdThemeStorageKey = "cstd-world-theme";
const cstdThemeEvent = "cstd-world-theme-change";

export const cstdThemes: readonly CstdThemeMeta[] = [
  {
    id: "neon-district",
    kind: "cyberpunk",
    label: "NEON DISTRICT",
    zhLabel: "霓虹街区",
    description: "A night district for systems that have to work in the real world.",
    zhDescription: "夜城、工程舱和实时信号，给那些必须在现实里跑起来的作品。",
    swatch: "#f4d431",
    signal: "#24e0ff",
    brand: { zh: "奶黄包", en: "CUSTARD" },
    compactBrand: { zh: "奶黄包", en: "CUSTARD" },
    edition: { zh: "CSTD / 个人工作室", en: "CSTD / PERSONAL STUDIO" },
  },
  {
    id: "underworld-forge",
    kind: "mythic-underworld",
    label: "UNDERWORLD FORGE",
    zhLabel: "冥府工坊",
    description: "A mythic forge where difficult systems are shaped, tested, and sent back into the world.",
    zhDescription: "黑曜石、金箔与冥火围成一座工坊，把复杂系统锻造成能回到现实的作品。",
    swatch: "#d7a84b",
    signal: "#8fe0b7",
    brand: { zh: "奶黄包 · 冥府工坊", en: "CUSTARD / UNDERWORLD FORGE" },
    compactBrand: { zh: "冥府工坊", en: "CSTD FORGE" },
    edition: { zh: "造物 / 试炼 / 归返", en: "CRAFT / TRIAL / RETURN" },
  },
  {
    id: "astral-covenant",
    kind: "fantasy-codex",
    label: "ASTRAL COVENANT",
    zhLabel: "星界契约",
    description: "A celestial campaign table where systems advance through choices, companions, and proof.",
    zhDescription: "星图、羊皮卷和命运骰铺成一张冒险桌，让系统沿着选择、协作与证据继续前进。",
    swatch: "#c5a668",
    signal: "#77d6d1",
    brand: { zh: "奶黄包 · 星界契约", en: "CUSTARD / ASTRAL COVENANT" },
    compactBrand: { zh: "星界契约", en: "CSTD ASTRAL" },
    edition: { zh: "同行 / 抉择 / 传承", en: "PARTY / CHOICE / LEGACY" },
  },
] as const;

let volatileTheme: CstdThemeId = "neon-district";
let transitionTimer: number | undefined;

export function normalizeTheme(value: string | null): CstdThemeId | null {
  if (
    value === "neon-district"
    || value === "underworld-forge"
    || value === "astral-covenant"
  ) {
    return value;
  }
  // Retired visual worlds migrate to the default game world without breaking a saved preference.
  if (value === "solar-lab" || value === "ink-protocol" || value === "press-room" || value === "pixel-quest") {
    return "neon-district";
  }
  return null;
}

function subscribe(onStoreChange: () => void) {
  const syncTheme = () => {
    applyDocumentTheme(getSnapshot());
    onStoreChange();
  };
  window.addEventListener("storage", syncTheme);
  window.addEventListener(cstdThemeEvent, syncTheme);
  return () => {
    window.removeEventListener("storage", syncTheme);
    window.removeEventListener(cstdThemeEvent, syncTheme);
  };
}

function getSnapshot(): CstdThemeId {
  try {
    return normalizeTheme(window.localStorage.getItem(cstdThemeStorageKey)) ?? volatileTheme;
  } catch {
    return volatileTheme;
  }
}

function getServerSnapshot(): CstdThemeId {
  // Keep hydration identical to the static HTML. The head bootstrap applies the
  // persisted world before paint; the live snapshot takes over after hydration.
  return "neon-district";
}

export function useCstdTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getCstdThemeMeta(theme: CstdThemeId) {
  return cstdThemes.find((candidate) => candidate.id === theme) ?? cstdThemes[0];
}

function applyDocumentTheme(theme: CstdThemeId) {
  const meta = getCstdThemeMeta(theme);
  document.documentElement.dataset.cstdTheme = theme;
  document.documentElement.dataset.cstdThemeKind = meta.kind;
}

export function setCstdTheme(theme: CstdThemeId) {
  volatileTheme = theme;
  applyDocumentTheme(theme);
  try {
    window.localStorage.setItem(cstdThemeStorageKey, theme);
  } catch {
    // The current tab still updates when persistent storage is unavailable.
  }

  document.documentElement.dataset.cstdThemeTransition = theme;
  if (transitionTimer) window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    delete document.documentElement.dataset.cstdThemeTransition;
    transitionTimer = undefined;
  }, 760);

  window.dispatchEvent(new Event(cstdThemeEvent));
  window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: `theme_${theme}`, value: 1 } }));
}
