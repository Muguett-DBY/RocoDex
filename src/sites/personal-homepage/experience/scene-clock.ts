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
  depthRef?: RefObject<HTMLElement | null>;
  chapterRef?: RefObject<HTMLElement | null>;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function useCstdSceneClock({
  rootRef,
  progressBarRef,
  depthRef,
  chapterRef,
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

    const sync = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;

      const timestamp = performance.now();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const globalProgress = clamp(window.scrollY / maxScroll);
      const elapsed = Math.max(16, timestamp - lastTimestamp);
      const deltaY = window.scrollY - lastScrollY;
      const velocity = Math.min(1, Math.abs(deltaY) / elapsed / 1.35);
      lastScrollY = window.scrollY;
      lastTimestamp = timestamp;

      let nextSceneId: CstdSceneId = "hero";
      const activationLine = window.innerHeight * 0.52;
      if (window.scrollY > 1) {
        for (const scene of cstdSceneManifest) {
          const element = document.getElementById(scene.elementId);
          if (element && element.getBoundingClientRect().top <= activationLine) nextSceneId = scene.id;
        }
      }

      const scene = cstdSceneById[nextSceneId];
      const sceneElement = document.getElementById(scene.elementId);
      let sceneProgress = 0;
      if (sceneElement) {
        const scrollableDistance = Math.max(1, sceneElement.offsetHeight - window.innerHeight);
        const sceneStart = sceneElement.getBoundingClientRect().top + window.scrollY;
        sceneProgress = clamp((window.scrollY - sceneStart) / scrollableDistance);
      }

      progressRef.current = globalProgress;
      sceneProgressRef.current = sceneProgress;
      sceneIndexRef.current = scene.index;
      velocityRef.current = velocity;

      root.dataset.cstdSceneCurrent = nextSceneId;
      root.style.setProperty("--cstd-progress", globalProgress.toFixed(4));
      root.style.setProperty("--cstd-scene-progress", sceneProgress.toFixed(4));
      root.style.setProperty("--cstd-scene-index", String(scene.index));
      root.style.setProperty("--cstd-scroll-direction", deltaY < 0 ? "-1" : "1");
      root.style.setProperty("--cstd-scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--cstd-scroll-velocity-percent", `${Math.round(velocity * 100)}%`);
      root.style.setProperty("--cstd-speed-offset", `${Math.round(window.scrollY % 72)}px`);
      root.style.setProperty("--cstd-chapter-progress", sceneProgress.toFixed(4));
      root.style.setProperty("--cstd-chapter-shift", `${Math.round(sceneProgress * 100)}%`);

      if (progressBarRef?.current) progressBarRef.current.style.transform = `scaleX(${globalProgress})`;
      if (depthRef?.current) depthRef.current.textContent = `${String(Math.round(globalProgress * 8192)).padStart(4, "0")}M`;
      if (chapterRef?.current) chapterRef.current.textContent = scene.label.toUpperCase();

      window.clearTimeout(velocityTimeout);
      velocityTimeout = window.setTimeout(() => {
        velocityRef.current = 0;
        root.style.setProperty("--cstd-scroll-velocity", "0");
      }, 140);

      if (nextSceneId !== activeSceneRef.current) {
        activeSceneRef.current = nextSceneId;
        setActiveSceneId(nextSceneId);
      }
    };

    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };

    sync();
    const resizeObserver = new ResizeObserver(requestSync);
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
  }, [chapterRef, depthRef, progressBarRef, rootRef]);

  return { activeSceneId, progressRef, sceneProgressRef, sceneIndexRef, velocityRef };
}
