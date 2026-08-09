"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import type { CstdRuntimeCapabilities, CstdRuntimeTier } from "./runtime-capabilities";

const desktopSceneQuery = "(min-width: 769px) and (pointer: fine)";

export type CstdRuntimeProfile = Readonly<{
  tier: "pending" | CstdRuntimeTier;
  backend: "pending" | CstdRuntimeCapabilities["backend"];
  webgpu: boolean;
  reason: "pending" | "responsive-image" | CstdRuntimeCapabilities["reason"];
  saveData: boolean;
  effectiveType: string | null;
  viewportPixels: number;
}>;

function subscribeDesktopScene(onStoreChange: () => void) {
  const query = window.matchMedia(desktopSceneQuery);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

export function useCstdDesktopScene() {
  return useSyncExternalStore(
    subscribeDesktopScene,
    () => window.matchMedia(desktopSceneQuery).matches,
    () => false,
  );
}

export function useCstdDeferredEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }
    const timeoutId = globalThis.setTimeout(() => setReady(true), 240);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return ready;
}

export function useCstdDocumentVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(document.visibilityState !== "hidden");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return visible;
}

export function useCstdRuntimeProfile(enhancementsReady: boolean, desktopScene: boolean) {
  const [profile, setProfile] = useState<CstdRuntimeProfile>({
    tier: "pending",
    backend: "pending",
    webgpu: false,
    reason: "pending",
    saveData: false,
    effectiveType: null,
    viewportPixels: 0,
  });

  useEffect(() => {
    if (!desktopScene) return;
    if (!enhancementsReady) return;

    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      void import("./runtime-capabilities").then(({ detectCstdRuntimeCapabilities }) => {
        if (cancelled) return;
        const detected = detectCstdRuntimeCapabilities();
        setProfile({
          tier: detected.tier,
          backend: detected.backend,
          webgpu: detected.webgpu,
          reason: detected.reason,
          saveData: detected.saveData,
          effectiveType: detected.effectiveType,
          viewportPixels: detected.viewportPixels,
        });
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [desktopScene, enhancementsReady]);

  return desktopScene
    ? profile
    : { tier: "image", backend: "image", webgpu: false, reason: "responsive-image", saveData: false, effectiveType: null, viewportPixels: 0 } as const;
}

export function useCstdChapterReveal(rootRef: RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!ready || !root) return;
    const observed = new WeakSet<Element>();
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-cstd-revealed", "true");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12%", threshold: 0.08 },
    );
    const scan = () => {
      root.querySelectorAll("[data-cstd-chapter], [data-cstd-finale]").forEach((chapter) => {
        if (observed.has(chapter)) return;
        observed.add(chapter);
        revealObserver.observe(chapter);
      });
    };
    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(root, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [ready, rootRef]);
}
