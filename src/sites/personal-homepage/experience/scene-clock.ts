"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cstdSceneById, cstdSceneManifest, type CstdSceneId } from "./scene-manifest";

type NumberRef = { current: number };

export type CstdSceneClock = {
  activeSceneId: CstdSceneId;
  progressRef: NumberRef;
  sceneProgressRef: NumberRef;
  sceneIndexRef: NumberRef;
  velocityRef: NumberRef;
};

type SceneClockOptions = {
  rootRef: RefObject<HTMLElement | null>;
  progressBarRef?: RefObject<HTMLElement | null>;
};

type SceneMetric = {
  id: CstdSceneId;
  top: number;
  height: number;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function useCstdSceneClock({
  rootRef,
  progressBarRef,
}: SceneClockOptions): CstdSceneClock {
  const progressRef = useRef(0);
  const sceneProgressRef = useRef(0);
  const sceneIndexRef = useRef(0);
  const velocityRef = useRef(0);
  const activeSceneRef = useRef<CstdSceneId>("hero");
  const [activeSceneId, setActiveSceneId] = useState<CstdSceneId>("hero");

  useEffect(() => {
    let frame = 0;
    let velocityTimeout = 0;
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();
    let sceneMetrics: SceneMetric[] = [];
    let maxScroll = 1;
    let viewportHeight = window.innerHeight;

    const commitActiveScene = (nextSceneId: CstdSceneId) => {
      if (nextSceneId === activeSceneRef.current) return;
      activeSceneRef.current = nextSceneId;
      const root = rootRef.current;
      if (root) root.dataset.cstdSceneCurrent = nextSceneId;
      setActiveSceneId(nextSceneId);
    };

    const resolveActiveScene = (scrollY: number) => {
      const activationPoint = scrollY + viewportHeight * 0.52;
      let nextSceneId: CstdSceneId = "hero";
      for (const metric of sceneMetrics) {
        if (metric.top > activationPoint) break;
        nextSceneId = metric.id;
      }
      return nextSceneId;
    };

    const refreshMetrics = () => {
      viewportHeight = window.innerHeight;
      sceneMetrics = cstdSceneManifest.flatMap((scene) => {
        const element = document.getElementById(scene.elementId);
        if (!element) return [];
        const bounds = element.getBoundingClientRect();
        return [{ id: scene.id, top: bounds.top + window.scrollY, height: element.offsetHeight }];
      });
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
      commitActiveScene(resolveActiveScene(window.scrollY));
    };

    const sync = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;

      const timestamp = performance.now();
      const scrollY = window.scrollY;
      const globalProgress = clamp(scrollY / maxScroll);
      const elapsed = Math.max(16, timestamp - lastTimestamp);
      const deltaY = scrollY - lastScrollY;
      const velocity = Math.min(1, Math.abs(deltaY) / elapsed / 1.35);
      lastScrollY = scrollY;
      lastTimestamp = timestamp;

      const nextSceneId = resolveActiveScene(scrollY);
      commitActiveScene(nextSceneId);
      const scene = cstdSceneById[nextSceneId];
      const metric = sceneMetrics.find((candidate) => candidate.id === nextSceneId);
      const scrollableDistance = Math.max(1, (metric?.height ?? viewportHeight) - viewportHeight);
      const sceneProgress = metric ? clamp((scrollY - metric.top) / scrollableDistance) : 0;

      progressRef.current = globalProgress;
      sceneProgressRef.current = sceneProgress;
      sceneIndexRef.current = scene.index;
      velocityRef.current = velocity;

      root.style.setProperty("--cstd-scene-progress", sceneProgress.toFixed(4));
      root.style.setProperty("--cstd-scroll-velocity", velocity.toFixed(3));
      if (progressBarRef?.current) progressBarRef.current.style.transform = `scaleX(${globalProgress})`;
    };

    const requestSync = () => {
      if (viewportHeight !== window.innerHeight) refreshMetrics();
      if (!frame) frame = window.requestAnimationFrame(sync);
      window.clearTimeout(velocityTimeout);
      velocityTimeout = window.setTimeout(() => {
        velocityRef.current = 0;
        rootRef.current?.style.setProperty("--cstd-scroll-velocity", "0");
      }, 140);
    };

    const root = rootRef.current;
    if (root) root.dataset.cstdSceneCurrent = activeSceneRef.current;
    refreshMetrics();
    sync();

    const resizeObserver = new ResizeObserver(() => {
      refreshMetrics();
      requestSync();
    });
    resizeObserver.observe(document.documentElement);
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      window.clearTimeout(velocityTimeout);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [progressBarRef, rootRef]);

  return { activeSceneId, progressRef, sceneProgressRef, sceneIndexRef, velocityRef };
}
