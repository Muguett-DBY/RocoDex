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
} from "react";
import type { CstdHomepageObservatory } from "../content/observatory";
import type { CstdNarrativeMode } from "../content/narratives";
import type { CstdSystem } from "../content/systems";
import { setCstdMotionMode, useCstdMotionMode } from "../experience/motion-store";
import { useCstdNarrativeMode } from "../experience/narrative-store";
import {
  useCstdChapterReveal,
  useCstdDeferredEnhancements,
  useCstdDesktopScene,
  useCstdDocumentVisibility,
  useCstdRuntimeProfile,
  type CstdRuntimeProfile,
} from "../experience/runtime-hooks";
import { useCstdSceneClock } from "../experience/scene-clock";
import { HomepageHeader } from "./homepage-header";
import { MemoizedSceneRuntime } from "./scene-runtime";

const LazyNeuralGate = lazy(() =>
  import("../scenes/neural-gate/neural-gate").then((module) => ({ default: module.MemoizedNeuralGate })),
);
const LazyLivingStudioTwin = lazy(() =>
  import("./sections/living-studio-twin").then((module) => ({ default: module.MemoizedLivingStudioTwin })),
);
const LazySelectedWork = lazy(() =>
  import("./sections/selected-work").then((module) => ({ default: module.MemoizedSelectedWork })),
);
const LazyExecutableEvidence = lazy(() =>
  import("./sections/executable-evidence").then((module) => ({ default: module.MemoizedExecutableEvidence })),
);
const LazyKnowledgeLens = lazy(() =>
  import("./sections/knowledge-lens").then((module) => ({ default: module.MemoizedKnowledgeLens })),
);
const LazyFinale = lazy(() =>
  import("./sections/finale").then((module) => ({ default: module.MemoizedFinale })),
);
const LazyCstdTelemetry = lazy(() =>
  import("./site/cstd-telemetry").then((module) => ({ default: module.CstdTelemetry })),
);
const LazyWorldBackdrop = lazy(() =>
  import("./world-backdrop").then((module) => ({ default: module.MemoizedWorldBackdrop })),
);

const firstSystemByNarrative = {
  builder: "product-surfaces",
  researcher: "research-models",
  collaborator: "product-surfaces",
} as const satisfies Record<CstdNarrativeMode, CstdSystem["id"]>;

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

export function PersonalHomepage({
  initialNarrativeMode,
  observatory,
}: {
  initialNarrativeMode?: CstdNarrativeMode;
  observatory: CstdHomepageObservatory;
}) {
  const motionMode = useCstdMotionMode();
  const persistedNarrativeMode = useCstdNarrativeMode();
  const narrativeMode = initialNarrativeMode ?? persistedNarrativeMode;
  const desktopScene = useCstdDesktopScene();
  const reducedMotion = motionMode === "calm";
  const [overdrive, setOverdrive] = useState(false);
  const enhancementsReady = useCstdDeferredEnhancements();
  const documentVisible = useCstdDocumentVisibility();
  const runtimeProfile = useCstdRuntimeProfile(enhancementsReady && overdrive, desktopScene);
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
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(() => firstSystemByNarrative[narrativeMode]);
  const renderedProfile = useMemo(() => getRenderedProfile(runtimeProfile, overdrive), [overdrive, runtimeProfile]);

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
      active: documentVisible,
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
    if (reducedMotion) return;
    pendingPointerRef.current = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    };
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

  return (
    <main
      ref={rootRef}
      data-cstd-kinetic-world
      data-cstd-home-refined
      data-cstd-enhancements-ready={enhancementsReady ? "true" : "false"}
      data-cstd-scene-mode={renderedProfile.tier === "image" ? "image" : "webgl"}
      data-cstd-immersive-runtime={renderedProfile.tier}
      data-cstd-render-backend={renderedProfile.backend}
      data-cstd-render-policy={overdrive ? "enhanced" : "balanced"}
      data-cstd-webgpu={renderedProfile.webgpu ? "active" : "unavailable"}
      data-cstd-runtime-reason={renderedProfile.reason}
      data-cstd-network={runtimeProfile.effectiveType ?? "unknown"}
      data-cstd-data-saver={runtimeProfile.saveData ? "true" : "false"}
      data-cstd-narrative-mode={narrativeMode}
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      data-cstd-overdrive={overdrive ? "true" : "false"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate overflow-x-clip bg-[#07090b] font-sans text-[#f2efe7]"
    >
      <a
        href="#systems"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
      >
        跳到主要内容
      </a>

      <Suspense fallback={<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[#050709]" />}>
        <LazyWorldBackdrop activeSceneId={activeSceneId} />
      </Suspense>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <MemoizedSceneRuntime {...sceneProps} profile={renderedProfile} enabled={enhancementsReady && desktopScene && overdrive} />
      </div>
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
        activeSceneId={activeSceneId}
        overdrive={overdrive}
        reducedMotion={reducedMotion}
        onToggleOverdrive={toggleOverdrive}
        onToggleMotion={toggleMotionMode}
      />

      <Suspense
        fallback={(
          <section data-cstd-chapter="hero" data-cstd-scene="hero" className="relative z-10 flex min-h-svh items-center border-b border-[#24e0ff]/18 px-5 pb-16 pt-28 md:px-10 lg:px-16">
            <div className="mx-auto w-full max-w-[1440px]">
              <p className="font-mono text-[10px] font-black text-[#f4d431]">01 / 奶黄包 / CUSTARD</p>
              <h1 className="mt-7 text-[4.8rem] font-black leading-[0.82] text-[#f2efe7] md:text-[7.25rem] lg:text-[8.5rem]">奶黄包</h1>
              <p className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-[#24e0ff] md:text-4xl">复杂，但必须清楚；炫酷，但必须能跑。</p>
            </div>
          </section>
        )}
      >
        <LazyNeuralGate narrativeMode={narrativeMode} />
      </Suspense>

      <div id="systems" data-cstd-scene-shell="systems" className="relative scroll-mt-16">
        <Suspense fallback={<section data-cstd-chapter="systems" data-cstd-scene="systems" aria-hidden="true" className="relative z-20 min-h-[140svh] bg-[#0a0c0f]" />}>
          <LazyLivingStudioTwin
            activeSystemId={activeSystemId}
            setActiveSystemId={setActiveSystemId}
            narrativeMode={narrativeMode}
            observatory={observatory}
          />
        </Suspense>
      </div>

      <div id="proof" data-cstd-scene-shell="proof" className="relative scroll-mt-16">
        <Suspense fallback={<section data-cstd-chapter="proof" data-cstd-scene="proof" aria-hidden="true" className="relative z-20 min-h-[125svh] bg-[#efeee8]" />}>
          <LazySelectedWork reducedMotion={reducedMotion} narrativeMode={narrativeMode} />
        </Suspense>
      </div>

      <div id="operator" data-cstd-scene-shell="operator" className="relative scroll-mt-16">
        <Suspense fallback={<section data-cstd-chapter="operator" data-cstd-scene="operator" aria-hidden="true" className="relative z-20 min-h-svh bg-[#050709]" />}>
          <LazyExecutableEvidence />
        </Suspense>
      </div>

      <div id="path" data-cstd-scene-shell="path" className="relative scroll-mt-16">
        <Suspense fallback={<section data-cstd-chapter="path" data-cstd-scene="path" aria-hidden="true" className="relative z-20 min-h-[110svh] bg-[#08100d]" />}>
          <LazyKnowledgeLens observatory={observatory} />
        </Suspense>
      </div>

      <Suspense fallback={<div className="relative z-20 min-h-[80svh] bg-[#050709]" />}>
        <LazyFinale narrativeMode={narrativeMode} />
      </Suspense>
      <Suspense fallback={null}>
        <LazyCstdTelemetry page="home" />
      </Suspense>
    </main>
  );
}
