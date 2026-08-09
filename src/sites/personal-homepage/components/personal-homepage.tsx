"use client";

import dynamic from "next/dynamic";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { CstdSystem } from "../content/systems";
import { getCstdNarrative, type CstdNarrativeMode } from "../content/narratives";
import type { CstdRuntimeTier } from "../experience/runtime-capabilities";
import { setCstdNarrativeMode, useCstdNarrativeMode } from "../experience/narrative-store";
import { useCstdSceneClock } from "../experience/scene-clock";

const LazyNeuralGate = memo(
  dynamic(
    () => import("../scenes/neural-gate/neural-gate").then((module) => module.MemoizedNeuralGate),
    {
      loading: () => (
        <section id="top" data-cstd-hero data-cstd-chapter="hero" data-cstd-scene="hero" className="relative z-10 flex min-h-svh items-center border-b border-[#24e0ff]/20 px-5 pt-20 md:px-10 lg:px-16">
          <div><p className="font-mono text-xs font-black text-[#f4d431]">CSTD / LINKING</p><h1 className="mt-6 text-[6rem] font-black leading-[0.78] text-[#f2efe7] md:text-[9rem]">CSTD</h1><p className="mt-6 max-w-2xl text-2xl font-semibold text-[#24e0ff]">CODE / SHIP / VERIFY / EVOLVE</p></div>
        </section>
      ),
    },
  ),
);
const LazyHomepageHeader = lazy(() =>
  import("./homepage-header").then((module) => ({ default: module.HomepageHeader })),
);
const LazyHomepageHud = lazy(() =>
  import("./homepage-hud").then((module) => ({ default: module.HomepageHud })),
);

const LazySignalStrip = lazy(() =>
  import("./sections/signal-strip").then((module) => ({ default: module.MemoizedSignalStrip })),
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
const LazySceneDirector = lazy(() =>
  import("./scene-director").then((module) => ({ default: module.MemoizedSceneDirector })),
);
const LazyWorldBackdrop = lazy(() =>
  import("./world-backdrop").then((module) => ({ default: module.MemoizedWorldBackdrop })),
);

const PersonalImmersiveScene = memo(
  dynamic(
    () => import("./immersive-scene").then((module) => module.PersonalImmersiveScene),
    { ssr: false },
  ),
);
const LitePersonalImmersiveScene = memo(
  dynamic(
    () => import("./lite-immersive-scene").then((module) => module.LitePersonalImmersiveScene),
    { ssr: false },
  ),
);

type MotionMode = "full" | "calm";
type ImmersiveRuntime = "pending" | CstdRuntimeTier;

const motionModeStorageKey = "cstd-motion-mode";
const motionModeChangeEvent = "cstd-motion-mode-change";
const desktopSceneQuery = "(min-width: 769px) and (pointer: fine)";
let volatileMotionMode: MotionMode = "full";
type AmbientSound = (typeof import("./ambient-sound"))["ambientSound"];
let loadedAmbientSound: AmbientSound | null = null;
let ambientSoundPromise: Promise<AmbientSound> | null = null;

function loadAmbientSound() {
  ambientSoundPromise ??= import("./ambient-sound").then((module) => {
    loadedAmbientSound = module.ambientSound;
    return module.ambientSound;
  });
  return ambientSoundPromise;
}

function subscribeMotionMode(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(motionModeChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(motionModeChangeEvent, onStoreChange);
  };
}

function getMotionModeSnapshot(): MotionMode {
  try {
    return window.localStorage.getItem(motionModeStorageKey) === "calm" ? "calm" : "full";
  } catch {
    return volatileMotionMode;
  }
}

function getMotionModeServerSnapshot(): MotionMode {
  return "full";
}

function subscribeDesktopScene(onStoreChange: () => void) {
  const query = window.matchMedia(desktopSceneQuery);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getDesktopSceneSnapshot() {
  return window.matchMedia(desktopSceneQuery).matches;
}

function getDesktopSceneServerSnapshot() {
  return false;
}

function useDeferredEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => setReady(true), 240);
    return () => clearTimeout(timeoutId);
  }, []);

  return ready;
}

function useDocumentVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(document.visibilityState !== "hidden");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return visible;
}

export function PersonalHomepage({ initialNarrativeMode }: { initialNarrativeMode?: CstdNarrativeMode } = {}) {
  const motionMode = useSyncExternalStore(
    subscribeMotionMode,
    getMotionModeSnapshot,
    getMotionModeServerSnapshot,
  );
  const desktopScene = useSyncExternalStore(
    subscribeDesktopScene,
    getDesktopSceneSnapshot,
    getDesktopSceneServerSnapshot,
  );
  const reducedMotion = motionMode === "calm";
  const persistedNarrativeMode = useCstdNarrativeMode();
  const [routeNarrativeMode, setRouteNarrativeMode] = useState<CstdNarrativeMode | null>(initialNarrativeMode ?? null);
  const narrativeMode = routeNarrativeMode ?? persistedNarrativeMode;
  const enhancementsReady = useDeferredEnhancements();
  const documentVisible = useDocumentVisibility();
  const rootRef = useRef<HTMLElement>(null);
  const coordinateRef = useRef<HTMLSpanElement>(null);
  const diveDepthRef = useRef<HTMLSpanElement>(null);
  const diveChapterRef = useRef<HTMLParagraphElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef(0);
  const overdriveRef = useRef(false);
  const {
    activeSceneId,
    progressRef,
    sceneProgressRef,
    sceneIndexRef,
    velocityRef,
  } = useCstdSceneClock({
    rootRef,
    progressBarRef,
    depthRef: diveDepthRef,
    chapterRef: diveChapterRef,
  });
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>("product-surfaces");
  const [overdrive, setOverdrive] = useState(false);
  const [ambienceOn, setAmbienceOn] = useState(false);
  const [immersiveRuntime, setImmersiveRuntime] = useState<ImmersiveRuntime>("pending");
  const [renderBackend, setRenderBackend] = useState("pending");
  const [webgpuAvailable, setWebgpuAvailable] = useState(false);
  const [runtimeReason, setRuntimeReason] = useState("pending");
  const toggleOverdrive = useCallback(() => {
    setOverdrive((current) => !current);
  }, []);
  const toggleAmbience = useCallback(async () => {
    if (ambienceOn) {
      loadedAmbientSound?.stop();
      setAmbienceOn(false);
      return;
    }
    const ambientSound = await loadAmbientSound();
    ambientSound.setScene(activeSceneId);
    ambientSound.setOverdrive(overdrive);
    await ambientSound.start();
    setAmbienceOn(true);
  }, [activeSceneId, ambienceOn, overdrive]);

  useEffect(() => () => loadedAmbientSound?.stop(), []);

  useEffect(() => {
    if (!enhancementsReady || !desktopScene) return;
    const frame = window.requestAnimationFrame(() => {
      void import("../experience/runtime-capabilities").then(({ detectCstdRuntimeCapabilities }) => {
        const profile = detectCstdRuntimeCapabilities();
        setImmersiveRuntime(profile.tier);
        setRenderBackend(profile.backend);
        setWebgpuAvailable(profile.webgpu);
        setRuntimeReason(profile.reason);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [desktopScene, enhancementsReady]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === "o") {
        toggleOverdrive();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleOverdrive]);

  useEffect(() => {
    overdriveRef.current = overdrive;
    loadedAmbientSound?.setOverdrive(overdrive);
    loadedAmbientSound?.pulse();
  }, [overdrive]);

  useEffect(() => {
    loadedAmbientSound?.setScene(activeSceneId);
  }, [activeSceneId]);

  useEffect(() => {
    if (!enhancementsReady) return;
    const root = rootRef.current;
    if (!root) return;
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
  }, [enhancementsReady]);

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
    [
      activeSceneId,
      documentVisible,
      progressRef,
      reducedMotion,
      sceneIndexRef,
      sceneProgressRef,
      velocityRef,
    ],
  );

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    pointerRef.current = { x: x * 2 - 1, y: -(y * 2 - 1) };
    rootRef.current?.style.setProperty("--cstd-pointer-x", `${Math.round(x * 100)}%`);
    rootRef.current?.style.setProperty("--cstd-pointer-y", `${Math.round(y * 100)}%`);
    rootRef.current?.style.setProperty("--cstd-pointer-shift-x", `${((x - 0.5) * -18).toFixed(2)}px`);
    rootRef.current?.style.setProperty("--cstd-pointer-shift-y", `${((y - 0.5) * -12).toFixed(2)}px`);
    if (coordinateRef.current) {
      coordinateRef.current.textContent = `${String(Math.round(x * 999)).padStart(3, "0")}:${String(Math.round(y * 999)).padStart(3, "0")}`;
    }
  }

  function handlePointerLeave() {
    pointerRef.current = { x: 0, y: 0 };
    rootRef.current?.style.setProperty("--cstd-pointer-x", "50%");
    rootRef.current?.style.setProperty("--cstd-pointer-y", "42%");
    rootRef.current?.style.setProperty("--cstd-pointer-shift-x", "0px");
    rootRef.current?.style.setProperty("--cstd-pointer-shift-y", "0px");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    loadedAmbientSound?.pulse();
    impulseRef.current = 1;
    const pulse = pulseRef.current;
    if (!pulse) return;
    pulse.style.left = `${event.clientX}px`;
    pulse.style.top = `${event.clientY}px`;
    pulse.classList.remove("cstd-click-pulse-active");
    void pulse.offsetWidth;
    pulse.classList.add("cstd-click-pulse-active");
  }

  function toggleMotionMode() {
    const next = motionMode === "full" ? "calm" : "full";
    volatileMotionMode = next;
    try {
      window.localStorage.setItem(motionModeStorageKey, next);
    } catch {
      // The in-session switch remains usable when storage is unavailable.
    }
    window.dispatchEvent(new Event(motionModeChangeEvent));
  }

  function handleNarrativeChange(mode: CstdNarrativeMode) {
    setRouteNarrativeMode(mode);
    setCstdNarrativeMode(mode);
    setActiveSystemId(getCstdNarrative(mode).systemOrder[0]);
  }

  return (
    <main
      ref={rootRef}
      data-cstd-kinetic-world
      data-cstd-enhancements-ready={enhancementsReady ? "true" : "false"}
      data-cstd-scene-mode={desktopScene ? "webgl" : "image"}
      data-cstd-immersive-runtime={desktopScene ? immersiveRuntime : "image"}
      data-cstd-render-backend={desktopScene ? renderBackend : "image"}
      data-cstd-webgpu={webgpuAvailable ? "available" : "unavailable"}
      data-cstd-runtime-reason={desktopScene ? runtimeReason : "responsive-image"}
      data-cstd-narrative-mode={narrativeMode}
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      data-cstd-overdrive={overdrive ? "true" : "false"}
      data-cstd-ambience={ambienceOn ? "on" : "off"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="relative isolate overflow-x-clip bg-[#0a0b0d] font-sans text-[#f2efe7]"
    >
      <a
        href="#systems"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
      >
        跳到主要内容
      </a>

      <Suspense fallback={null}>
        <LazyHomepageHud reducedMotion={reducedMotion} coordinateRef={coordinateRef} depthRef={diveDepthRef} chapterRef={diveChapterRef} pulseRef={pulseRef} />
      </Suspense>

      <Suspense fallback={<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[#050709]" />}>
        <LazyWorldBackdrop activeSceneId={activeSceneId} />
      </Suspense>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {enhancementsReady && desktopScene && immersiveRuntime === "full" ? <PersonalImmersiveScene {...sceneProps} /> : null}
        {enhancementsReady && desktopScene && immersiveRuntime === "lite" ? <LitePersonalImmersiveScene {...sceneProps} /> : null}
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div className="cstd-world-copy-shade absolute inset-0" />
        <div
          data-cstd-pointer-field
          className="absolute inset-0 opacity-70 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(36rem circle at var(--cstd-pointer-x, 50%) var(--cstd-pointer-y, 42%), rgba(36,224,255,0.16), transparent 62%)",
          }}
        />
      </div>

      <Suspense fallback={null}>
        <LazySceneDirector activeSceneId={activeSceneId} />
      </Suspense>

      <div
        ref={progressBarRef}
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left scale-x-0 bg-[#f4c95d] shadow-[0_0_14px_rgba(244,201,93,0.45)]"
      />

      <Suspense fallback={<div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#f4d431]/25 bg-[#050709]/92" />}>
        <LazyHomepageHeader
          activeSceneId={activeSceneId}
          overdrive={overdrive}
          ambienceOn={ambienceOn}
          reducedMotion={reducedMotion}
          onToggleOverdrive={toggleOverdrive}
          onToggleAmbience={() => void toggleAmbience()}
          onToggleMotion={toggleMotionMode}
        />
      </Suspense>

      <LazyNeuralGate
        overdrive={overdrive}
        onToggleOverdrive={toggleOverdrive}
        activeSystemId={activeSystemId}
        onSelectSystem={setActiveSystemId}
        narrativeMode={narrativeMode}
        onNarrativeChange={handleNarrativeChange}
      />

      <Suspense fallback={<div className="relative z-20 h-24 border-y border-white/10 bg-[#0d0f12]" />}>
        <LazySignalStrip reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={<div className="relative z-10 min-h-[80svh] bg-[#101216]" />}>
        <LazyLivingStudioTwin
          activeSystemId={activeSystemId}
          setActiveSystemId={setActiveSystemId}
          reducedMotion={reducedMotion}
          narrativeMode={narrativeMode}
        />
      </Suspense>

      <Suspense fallback={<div className="relative z-20 min-h-[70svh] bg-[#f4d431]" />}>
        <LazySelectedWork reducedMotion={reducedMotion} narrativeMode={narrativeMode} />
      </Suspense>

      <Suspense fallback={<div className="relative z-20 min-h-[80svh] bg-[#050709]" />}>
        <LazyExecutableEvidence />
      </Suspense>

      <Suspense fallback={<div className="relative z-10 min-h-[70svh] bg-[#0a0b0d]" />}>
        <LazyKnowledgeLens />
      </Suspense>

      <Suspense fallback={<div className="relative z-20 min-h-[70svh] bg-[#050709]" />}>
        <LazyFinale narrativeMode={narrativeMode} />
      </Suspense>
      <Suspense fallback={null}>
        <LazyCstdTelemetry page="home" />
      </Suspense>
    </main>
  );
}
