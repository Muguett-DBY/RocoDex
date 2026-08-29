"use client";

import { useSyncExternalStore } from "react";

export type CstdMotionMode = "full" | "calm";

const storageKey = "cstd-motion-mode";
const changeEvent = "cstd-motion-mode-change";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
let volatileMotionMode: CstdMotionMode = "full";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getSnapshot(): CstdMotionMode {
  try {
    const storedMode = window.localStorage.getItem(storageKey);
    if (storedMode === "calm" || storedMode === "full") return storedMode;
    return window.matchMedia(reducedMotionQuery).matches ? "calm" : "full";
  } catch {
    return volatileMotionMode;
  }
}

export function useCstdMotionMode() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "full");
}

export function setCstdMotionMode(mode: CstdMotionMode) {
  volatileMotionMode = mode;
  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    // Keep the in-session preference when storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}
