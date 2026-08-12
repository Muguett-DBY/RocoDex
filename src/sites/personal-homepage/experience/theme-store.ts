"use client";

import { useSyncExternalStore } from "react";

export type CstdThemeId = "neon-district" | "solar-lab" | "ink-protocol";

export type CstdThemeMeta = Readonly<{
  id: CstdThemeId;
  label: string;
  zhLabel: string;
  description: string;
  swatch: string;
  signal: string;
}>;

export const cstdThemeStorageKey = "cstd-world-theme";
const cstdThemeEvent = "cstd-world-theme-change";

export const cstdThemes: readonly CstdThemeMeta[] = [
  {
    id: "neon-district",
    label: "NEON DISTRICT",
    zhLabel: "Neon District",
    description: "Cyberpunk systems, electric night and executable energy.",
    swatch: "#f4d431",
    signal: "#24e0ff",
  },
  {
    id: "solar-lab",
    label: "CUSTARD SOLAR LAB",
    zhLabel: "Custard Solar Lab",
    description: "Warm daylight, living interfaces and optimistic engineering.",
    swatch: "#b8652b",
    signal: "#1d7c76",
  },
  {
    id: "ink-protocol",
    label: "INK PROTOCOL",
    zhLabel: "Ink Protocol",
    description: "Digital ink, quiet mountains and deliberate technical craft.",
    swatch: "#a7382f",
    signal: "#315d66",
  },
] as const;

let volatileTheme: CstdThemeId = "neon-district";
let transitionTimer: number | undefined;

function isCstdThemeId(value: string | null): value is CstdThemeId {
  return value === "neon-district" || value === "solar-lab" || value === "ink-protocol";
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
    const stored = window.localStorage.getItem(cstdThemeStorageKey);
    return isCstdThemeId(stored) ? stored : volatileTheme;
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
  }, 720);

  window.dispatchEvent(new Event(cstdThemeEvent));
  window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: `theme_${theme}`, value: 1 } }));
}
