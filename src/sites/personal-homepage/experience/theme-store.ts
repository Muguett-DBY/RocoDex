"use client";

import { useSyncExternalStore } from "react";
import type { LocalizedText } from "../content/content-types";

export type CstdThemeId = "neon-district" | "ink-protocol" | "press-room" | "pixel-quest";
export type CstdThemeKind = "cyberpunk" | "ink-scroll" | "broadsheet" | "pixel-game";

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

export const cstdThemeStorageKey = "cstd-world-theme";
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
    id: "ink-protocol",
    kind: "ink-scroll",
    label: "INK PROTOCOL",
    zhLabel: "水墨协议",
    description: "A quiet work scroll where craft and evidence share a page.",
    zhDescription: "宣纸、山水和工程批注铺开一卷，慢慢看清每个取舍。",
    swatch: "#a7382f",
    signal: "#273d39",
    brand: { zh: "奶黄包", en: "CUSTARD" },
    compactBrand: { zh: "奶黄包", en: "CUSTARD" },
    edition: { zh: "水墨协议 / 造物求真", en: "INK / CRAFT + TRUTH" },
  },
  {
    id: "press-room",
    kind: "broadsheet",
    label: "CSTD PRESS ROOM",
    zhLabel: "工程日报",
    description: "A working newspaper for release notes, reports, and corrections.",
    zhDescription: "像一份仍在编辑的技术报纸，报道交付，也刊登修订。",
    swatch: "#c43124",
    signal: "#087c89",
    brand: { zh: "THE CUSTARD CHRONICLE", en: "THE CUSTARD CHRONICLE" },
    compactBrand: { zh: "工程日报", en: "CSTD PRESS" },
    edition: { zh: "系统 / 研究 / 悉尼版", en: "SYSTEMS / RESEARCH / SYDNEY EDITION" },
  },
  {
    id: "pixel-quest",
    kind: "pixel-game",
    label: "PIXEL QUEST",
    zhLabel: "像素任务",
    description: "A small 16-bit quest through choices, bugs, and release checks.",
    zhDescription: "一条 16-bit 小路，把能力、漏洞和过关记录编在一起。",
    swatch: "#ffd43b",
    signal: "#31d7ff",
    brand: { zh: "CSTD QUEST", en: "CSTD QUEST" },
    compactBrand: { zh: "CSTD QUEST", en: "CSTD QUEST" },
    edition: { zh: "玩家 01 / 等级 17", en: "PLAYER 01 / LEVEL 17" },
  },
] as const;

let volatileTheme: CstdThemeId = "neon-district";
let transitionTimer: number | undefined;

function normalizeTheme(value: string | null): CstdThemeId | null {
  if (value === "neon-district" || value === "ink-protocol" || value === "press-room" || value === "pixel-quest") {
    return value;
  }
  // CSTD 18 used this palette-only theme. Preserve the preference while upgrading it to the press world.
  if (value === "solar-lab") return "press-room";
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
