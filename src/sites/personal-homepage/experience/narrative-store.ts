"use client";

import { useSyncExternalStore } from "react";
import type { CstdNarrativeMode } from "../content/narratives";

const storageKey = "cstd-narrative-mode-v1";
const changeEvent = "cstd-narrative-mode-change";
let volatileMode: CstdNarrativeMode = "builder";

function isNarrativeMode(value: string | null): value is CstdNarrativeMode {
  return value === "builder" || value === "researcher" || value === "collaborator";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
  };
}

function getSnapshot(): CstdNarrativeMode {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return isNarrativeMode(stored) ? stored : volatileMode;
  } catch {
    return volatileMode;
  }
}

export function setCstdNarrativeMode(mode: CstdNarrativeMode) {
  volatileMode = mode;
  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    // The mode remains available for the current document when storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
  window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: `narrative_${mode}`, value: 1 } }));
}

export function useCstdNarrativeMode() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "builder" as const);
}
