"use client";

import { useSyncExternalStore } from "react";

export type CstdMotionMode = "full" | "calm";

const storageKey = "cstd-motion-mode";
const changeEvent = "cstd-motion-mode-change";
let volatileMotionMode: CstdMotionMode = "full";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
  };
}

function getSnapshot(): CstdMotionMode {
  try {
    return window.localStorage.getItem(storageKey) === "calm" ? "calm" : "full";
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
