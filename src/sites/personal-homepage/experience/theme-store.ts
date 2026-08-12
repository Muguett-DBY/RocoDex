"use client";

import { useSyncExternalStore } from "react";

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
  brand: string;
  edition: string;
}>;

export const cstdThemeStorageKey = "cstd-world-theme";
const cstdThemeEvent = "cstd-world-theme-change";

export const cstdThemes: readonly CstdThemeMeta[] = [
  {
    id: "neon-district",
    kind: "cyberpunk",
    label: "NEON DISTRICT",
    zhLabel: "霓虹街区",
    description: "A cinematic cyberpunk engineering district.",
    zhDescription: "赛博夜城、工程舱与实时信号构成的电影化世界。",
    swatch: "#f4d431",
    signal: "#24e0ff",
    brand: "奶黄包",
    edition: "CSTD / PERSONAL STUDIO",
  },
  {
    id: "ink-protocol",
    kind: "ink-scroll",
    label: "INK PROTOCOL",
    zhLabel: "水墨协议",
    description: "A living technical scroll drawn in ink and silence.",
    zhDescription: "宣纸、山水、印章与工程图谱共同展开的数字长卷。",
    swatch: "#a7382f",
    signal: "#273d39",
    brand: "奶黄包",
    edition: "水墨协议 / 造物求真",
  },
  {
    id: "press-room",
    kind: "broadsheet",
    label: "CSTD PRESS ROOM",
    zhLabel: "工程日报",
    description: "An independent technology broadsheet built from evidence.",
    zhDescription: "版头、分栏、铅字和半调图像组成的独立技术报纸。",
    swatch: "#c43124",
    signal: "#087c89",
    brand: "THE CUSTARD CHRONICLE",
    edition: "SYSTEMS / RESEARCH / SYDNEY EDITION",
  },
  {
    id: "pixel-quest",
    kind: "pixel-game",
    label: "PIXEL QUEST",
    zhLabel: "像素任务",
    description: "A playable 16-bit engineering journey.",
    zhDescription: "把能力、作品和证据编排成一条 16-bit 工程关卡。",
    swatch: "#ffd43b",
    signal: "#31d7ff",
    brand: "CSTD QUEST",
    edition: "PLAYER 01 / LEVEL 17",
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
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(cstdThemeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(cstdThemeEvent, onStoreChange);
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
  return "neon-district";
}

export function useCstdTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getCstdThemeMeta(theme: CstdThemeId) {
  return cstdThemes.find((candidate) => candidate.id === theme) ?? cstdThemes[0];
}

export function setCstdTheme(theme: CstdThemeId) {
  volatileTheme = theme;
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
