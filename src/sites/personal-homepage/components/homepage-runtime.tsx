"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { CstdNarrativeMode } from "../content/narratives";
import type { CstdLocale } from "../content/content-types";
import { setCstdMotionMode, useCstdMotionMode } from "../experience/motion-store";
import {
  useCstdChapterReveal,
  useCstdDeferredEnhancements,
  useCstdDesktopScene,
  useCstdDocumentVisibility,
  useCstdRuntimeProfile,
  type CstdRuntimeProfile,
} from "../experience/runtime-hooks";
import { useCstdSceneClock } from "../experience/scene-clock";
import { cstdSceneById } from "../experience/scene-manifest";
import { getCstdThemeMeta, useCstdTheme } from "../experience/theme-store";
import { HomepageHeader } from "./homepage-header";
import { MemoizedSceneRuntime } from "./scene-runtime";
import { ThemeSceneNavigator, ThemeWorldLayer } from "./theme-world-layer";
import { MemoizedWorldBackdrop } from "./world-backdrop";
import { CstdDocumentLocale } from "./site/cstd-document-locale";

const LazyCstdTelemetry = lazy(() =>
  import("./site/cstd-telemetry").then((module) => ({ default: module.CstdTelemetry })),
);

function getRenderedProfile(profile: CstdRuntimeProfile, enhanced: boolean): CstdRuntimeProfile {
  if (enhanced) return profile;
  return {
    ...profile,
    tier: "image",
    backend: "image",
    webgpu: false,
    reason: "balanced-default",
  };
}

export function HomepageRuntime({
  narrativeMode,
  locale,
  children,
}: {
  narrativeMode: CstdNarrativeMode;
  locale: CstdLocale;
  children: ReactNode;
}) {
  const motionMode = useCstdMotionMode();
  const theme = useCstdTheme();
  const immersiveTheme = theme === "neon-district";
  const desktopScene = useCstdDesktopScene();
  const reducedMotion = motionMode === "calm";
  const [overdrive, setOverdrive] = useState(false);
  const enhancementsReady = useCstdDeferredEnhancements();
  const documentVisible = useCstdDocumentVisibility();
  const runtimeProfile = useCstdRuntimeProfile(enhancementsReady && overdrive && immersiveTheme, desktopScene);
  const rootRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pendingPointerRef = useRef({ x: 0.5, y: 0.42 });
  const pointerFrameRef = useRef(0);
  const impulseRef = useRef(0);
  const overdriveRef = useRef(false);
  const { activeSceneId, progressRef, sceneProgressRef, sceneIndexRef, velocityRef } = useCstdSceneClock({
    rootRef,
    progressBarRef,
  });
  const renderedProfile = useMemo(() => getRenderedProfile(runtimeProfile, overdrive && immersiveTheme), [immersiveTheme, overdrive, runtimeProfile]);
  const immersiveSceneEnabled = enhancementsReady && desktopScene && overdrive && immersiveTheme;

  const toggleOverdrive = useCallback(() => {
    setOverdrive((current) => !current);
  }, []);

  useEffect(() => {
    overdriveRef.current = overdrive;
  }, [overdrive]);

  useEffect(() => () => {
    if (pointerFrameRef.current) window.cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useCstdChapterReveal(rootRef, enhancementsReady);

  const sceneProps = useMemo(
    () => ({
      progressRef,
      sceneProgressRef,
      sceneIndexRef,
      velocityRef,
      pointerRef,
      impulseRef,
      overdriveRef,
      reducedMotion,
      showArchive: activeSceneId === "systems" || activeSceneId === "path",
      active: documentVisible && !cstdSceneById[activeSceneId].pauseGpu,
    }),
    [activeSceneId, documentVisible, progressRef, reducedMotion, sceneIndexRef, sceneProgressRef, velocityRef],
  );

  function flushPointerPosition() {
    pointerFrameRef.current = 0;
    const root = rootRef.current;
    if (!root) return;
    const { x, y } = pendingPointerRef.current;
    pointerRef.current = { x: x * 2 - 1, y: -(y * 2 - 1) };
    root.style.setProperty("--cstd-pointer-x", `${Math.round(x * 100)}%`);
    root.style.setProperty("--cstd-pointer-y", `${Math.round(y * 100)}%`);
    root.style.setProperty("--cstd-pointer-shift-x", `${((x - 0.5) * -10).toFixed(2)}px`);
    root.style.setProperty("--cstd-pointer-shift-y", `${((y - 0.5) * -7).toFixed(2)}px`);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion || theme === "ink-protocol" || theme === "press-room") return;
    const rawX = event.clientX / window.innerWidth;
    const rawY = event.clientY / window.innerHeight;
    pendingPointerRef.current = theme === "pixel-quest"
      ? { x: Math.round(rawX * 12) / 12, y: Math.round(rawY * 8) / 8 }
      : { x: rawX, y: rawY };
    if (!pointerFrameRef.current) pointerFrameRef.current = window.requestAnimationFrame(flushPointerPosition);
  }

  function handlePointerLeave() {
    pendingPointerRef.current = { x: 0.5, y: 0.42 };
    pointerRef.current = { x: 0, y: 0 };
    if (!pointerFrameRef.current) pointerFrameRef.current = window.requestAnimationFrame(flushPointerPosition);
  }

  function toggleMotionMode() {
    setCstdMotionMode(motionMode === "full" ? "calm" : "full");
  }

  return <>
    <CstdDocumentLocale locale={locale} />
    <main
      suppressHydrationWarning
      ref={rootRef}
      data-cstd-kinetic-world
      data-cstd-home-refined
      data-cstd-enhancements-ready={enhancementsReady ? "true" : "false"}
      data-cstd-scene-mode={renderedProfile.tier === "image" ? "image" : "webgl"}
      data-cstd-immersive-runtime={renderedProfile.tier}
      data-cstd-render-backend={renderedProfile.backend}
      data-cstd-render-policy={overdrive && immersiveTheme ? "enhanced" : "balanced"}
      data-cstd-webgpu={renderedProfile.webgpu ? "active" : "unavailable"}
      data-cstd-runtime-reason={renderedProfile.reason}
      data-cstd-network={runtimeProfile.effectiveType ?? "unknown"}
      data-cstd-data-saver={runtimeProfile.saveData ? "true" : "false"}
      data-cstd-narrative-mode={narrativeMode}
      data-cstd-locale={locale}
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      data-cstd-motion-system="layered"
      data-cstd-theme={theme}
      data-cstd-theme-kind={getCstdThemeMeta(theme).kind}
      data-cstd-overdrive={overdrive && immersiveTheme ? "true" : "false"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate overflow-x-clip bg-[#07090b] font-sans text-[#f2efe7]"
    >
      <a
        href="#systems"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
      >
        {locale === "zh" ? "跳到主要内容" : "Skip to main content"}
      </a>

      <MemoizedWorldBackdrop activeSceneId={activeSceneId} />
      <ThemeWorldLayer theme={theme} activeSceneId={activeSceneId} locale={locale} />
      <div aria-hidden="true" data-cstd-theme-atmosphere className="cstd-theme-atmosphere" />
      {immersiveSceneEnabled ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
          <MemoizedSceneRuntime {...sceneProps} profile={renderedProfile} enabled />
        </div>
      ) : null}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] hidden overflow-hidden md:block">
        <div className="cstd-world-copy-shade absolute inset-0" />
        <div
          data-cstd-pointer-field
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(34rem circle at var(--cstd-pointer-x, 50%) var(--cstd-pointer-y, 42%), rgba(36,224,255,0.11), transparent 64%)",
          }}
        />
      </div>

      <div
        ref={progressBarRef}
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left scale-x-0 bg-[#f4c95d]"
      />

      <HomepageHeader
        locale={locale}
        activeSceneId={activeSceneId}
        overdrive={overdrive}
        reducedMotion={reducedMotion}
        onToggleOverdrive={toggleOverdrive}
        onToggleMotion={toggleMotionMode}
      />
      <ThemeSceneNavigator theme={theme} activeSceneId={activeSceneId} locale={locale} />

      {children}

      {enhancementsReady ? (
        <Suspense fallback={null}>
          <LazyCstdTelemetry page={locale === "zh" ? "home" : "home-en"} />
        </Suspense>
      ) : null}
    </main>
  </>;
}
