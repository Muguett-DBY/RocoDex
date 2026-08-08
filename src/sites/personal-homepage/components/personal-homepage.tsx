"use client";

import dynamic from "next/dynamic";
import { Command, Pause, Play, Volume2, VolumeX, Zap } from "lucide-react";
import { clsx } from "clsx";
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
import { cstdSystems, type CstdSystem } from "../content/systems";
import { useCstdSceneClock } from "../experience/scene-clock";
import {
  cstdSceneById,
  cstdSceneManifest,
  type CstdSceneId,
} from "../experience/scene-manifest";
import { MemoizedNeuralGate } from "../scenes/neural-gate/neural-gate";
import { ambientSound } from "./ambient-sound";
import { MemoizedSceneDirector } from "./scene-director";
import { MemoizedWorldBackdrop } from "./world-backdrop";

const LazyCommandDrawer = lazy(() =>
  import("./command-drawer").then((module) => ({ default: module.CommandDrawer })),
);
const LazySignalStrip = lazy(() =>
  import("./sections/signal-strip").then((module) => ({ default: module.MemoizedSignalStrip })),
);
const LazySystemsChapter = lazy(() =>
  import("./sections/systems-chapter").then((module) => ({ default: module.MemoizedSystemsChapter })),
);
const LazySelectedWork = lazy(() =>
  import("./sections/selected-work").then((module) => ({ default: module.MemoizedSelectedWork })),
);
const LazyOperatorProfile = lazy(() =>
  import("./sections/operator-profile").then((module) => ({ default: module.MemoizedOperatorProfile })),
);
const LazyResearchPath = lazy(() =>
  import("./sections/research-path").then((module) => ({ default: module.MemoizedResearchPath })),
);
const LazyFinale = lazy(() =>
  import("./sections/finale").then((module) => ({ default: module.MemoizedFinale })),
);

const PersonalImmersiveScene = memo(
  dynamic(
    () => import("./immersive-scene").then((module) => module.PersonalImmersiveScene),
    { ssr: false },
  ),
);

type MotionMode = "full" | "calm";

const chapterLinks = cstdSceneManifest.filter(
  (scene) => scene.id !== "hero" && scene.id !== "finale",
);

const motionModeStorageKey = "cstd-motion-mode";
const motionModeChangeEvent = "cstd-motion-mode-change";
const desktopSceneQuery = "(min-width: 769px) and (pointer: fine)";
let volatileMotionMode: MotionMode = "full";

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

function ChapterRail({ activeChapter }: { activeChapter: CstdSceneId }) {
  return (
    <nav
      aria-label="章节导航"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
    >
      {chapterLinks.map((chapter, index) => {
        const active = activeChapter === chapter.id;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={chapter.navLabel}
            className="group flex items-center justify-end gap-3 font-mono text-[10px] font-semibold text-[#8f9599] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
          >
            <span className={clsx("transition-colors", active && "text-[#f4c95d]")}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "h-px bg-current transition-[width,color] duration-300",
                active ? "w-10 text-[#f4c95d]" : "w-4 text-[#555b60] group-hover:w-7",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}

export function PersonalHomepage() {
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
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [overdrive, setOverdrive] = useState(false);
  const [ambienceOn, setAmbienceOn] = useState(false);
  const openConsole = useCallback(() => setConsoleOpen(true), []);
  const closeConsole = useCallback(() => setConsoleOpen(false), []);
  const toggleOverdrive = useCallback(() => {
    ambientSound.pulse();
    setOverdrive((current) => !current);
  }, []);
  const enableOverdrive = useCallback(() => setOverdrive(true), []);
  const toggleAmbience = useCallback(async () => {
    if (ambienceOn) {
      ambientSound.stop();
      setAmbienceOn(false);
      return;
    }
    await ambientSound.start();
    setAmbienceOn(true);
  }, [ambienceOn]);

  useEffect(() => () => ambientSound.stop(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openConsole();
      }
      if (event.shiftKey && event.key.toLowerCase() === "o") {
        toggleOverdrive();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openConsole, toggleOverdrive]);

  useEffect(() => {
    overdriveRef.current = overdrive;
    ambientSound.setOverdrive(overdrive);
  }, [overdrive]);

  useEffect(() => {
    ambientSound.setScene(activeSceneId);
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
    ambientSound.pulse();
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

  return (
    <main
      ref={rootRef}
      data-cstd-kinetic-world
      data-cstd-enhancements-ready={enhancementsReady ? "true" : "false"}
      data-cstd-scene-mode={desktopScene ? "webgl" : "image"}
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

      <div aria-hidden="true" className="cstd-boot-sequence pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[#050709]">
        <div className="font-mono text-center">
          <p className="text-[10px] font-black text-[#24e0ff]">CSTD NEURAL LINK</p>
          <p className="mt-2 text-3xl font-black text-[#f4d431]">BOOT://01</p>
        </div>
      </div>

      <MemoizedWorldBackdrop activeSceneId={activeSceneId} />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {enhancementsReady && desktopScene ? <PersonalImmersiveScene {...sceneProps} /> : null}
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

      <div aria-hidden="true" data-cstd-global-hud className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
        <div data-cstd-speed-lines className="cstd-speed-lines absolute inset-0 opacity-0" />
        <div className="cstd-hud-scan absolute inset-x-0 top-0 h-px bg-[#24e0ff]/70 shadow-[0_0_18px_rgba(36,224,255,0.75)]" />
        <div className="absolute left-4 top-24 hidden h-28 w-px bg-[#f4d431]/60 lg:block" />
        <div className="absolute left-3 top-56 hidden -rotate-90 origin-left font-mono text-[9px] font-bold tracking-[0] text-[#f4d431]/70 lg:block">CSTD // NEURAL BUS</div>
        <div className="absolute bottom-7 right-6 hidden items-center gap-3 border-r-2 border-[#24e0ff] pr-3 font-mono text-[9px] font-bold text-[#8f9ba0] lg:flex">
          PTR <span ref={coordinateRef} className="text-[#24e0ff]">500:420</span>
        </div>
        <div
          data-cstd-crosshair
          className={clsx("cstd-crosshair fixed hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 lg:block", reducedMotion && "lg:!hidden")}
          style={{ left: "var(--cstd-pointer-x, 50%)", top: "var(--cstd-pointer-y, 42%)" }}
        />
        <span ref={pulseRef} className="cstd-click-pulse fixed h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-0" />
        <div data-cstd-neural-dive className="absolute bottom-7 left-6 hidden items-end gap-4 font-mono lg:flex">
          <div>
            <p className="text-[8px] font-black text-[#68757b]">NEURAL DIVE / DEPTH</p>
            <p className="mt-1 text-lg font-black text-[#f4d431]"><span ref={diveDepthRef}>0000M</span></p>
          </div>
          <span aria-hidden="true" className="mb-1 h-8 w-px bg-[#24e0ff]/45" />
          <p ref={diveChapterRef} className="mb-1 text-[9px] font-black text-[#24e0ff]">STUDIO</p>
        </div>
      </div>

      <MemoizedSceneDirector activeSceneId={activeSceneId} />

      <div
        ref={progressBarRef}
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left scale-x-0 bg-[#f4c95d] shadow-[0_0_14px_rgba(244,201,93,0.45)]"
      />

      <header
        data-cstd-header-theme={activeSceneId}
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-[#f4d431]/35 bg-[#050709]/88 px-5 backdrop-blur-xl md:px-10 lg:px-12"
      >
        <a
          href="#top"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
        >
          <span className="flex h-8 w-8 items-center justify-center bg-[#f4d431] font-mono text-[11px] font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">
            CS
          </span>
          <span className="font-mono text-sm font-black tracking-[0]">CSTD://</span>
          <span className="hidden font-mono text-[10px] font-bold uppercase text-[#7f8b90] sm:inline">{cstdSceneById[activeSceneId].label}</span>
        </a>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <nav aria-label="主导航" className="hidden items-center gap-7 font-mono text-xs font-semibold text-[#a5aaad] md:flex">
            {chapterLinks.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                aria-current={activeSceneId === chapter.id ? "page" : undefined}
                className="transition-colors hover:text-[#f4c95d] aria-[current=page]:text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
              >
                {chapter.navLabel}
              </a>
            ))}
          </nav>
          <a
            href="#proof"
            className="mr-1 font-mono text-xs font-semibold text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d] md:hidden"
          >
            作品
          </a>
          <button
            type="button"
            data-cstd-overdrive-toggle
            aria-pressed={overdrive}
            aria-label={overdrive ? "关闭超载模式" : "启动超载模式"}
            title={overdrive ? "关闭 OVERDRIVE" : "启动 OVERDRIVE"}
            onClick={toggleOverdrive}
            className={clsx(
              "flex h-9 w-9 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]",
              overdrive
                ? "border-[#ff3b30] bg-[#ff3b30] text-[#050709] shadow-[0_0_22px_rgba(255,59,48,0.45)]"
                : "border-[#ff3b30]/40 text-[#ff5a50] hover:bg-[#ff3b30] hover:text-[#050709]",
            )}
          >
            <Zap aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-cstd-ambience-toggle
            aria-pressed={ambienceOn}
            aria-label={ambienceOn ? "关闭环境声场" : "开启环境声场"}
            title={ambienceOn ? "关闭环境声场" : "开启环境声场"}
            onClick={() => void toggleAmbience()}
            className={clsx(
              "hidden h-9 w-9 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff] sm:flex",
              ambienceOn
                ? "border-[#24e0ff] bg-[#24e0ff] text-[#050709]"
                : "border-white/15 text-[#a5aaad] hover:border-[#24e0ff]/70 hover:text-[#24e0ff]",
            )}
          >
            {ambienceOn ? <Volume2 aria-hidden="true" className="h-4 w-4" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
          </button>
          <button
            type="button"
            data-cstd-motion-toggle
            aria-pressed={!reducedMotion}
            aria-label={reducedMotion ? "开启增强动效" : "切换到平静模式"}
            title={reducedMotion ? "开启增强动效" : "切换到平静模式"}
            onClick={toggleMotionMode}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#a5aaad] transition-colors hover:border-[#f4d431]/60 hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
          >
            {reducedMotion ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
          </button>
          <button
            type="button"
            data-cstd-console-trigger
            aria-expanded={consoleOpen}
            aria-controls="cstd-command-drawer"
            aria-label="打开控制台"
            title="打开控制台"
            onClick={openConsole}
            className="flex h-9 w-9 items-center justify-center border border-[#24e0ff]/45 bg-[#24e0ff]/10 text-[#24e0ff] transition-colors hover:bg-[#24e0ff] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
          >
            <Command aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ChapterRail activeChapter={activeSceneId} />

      <MemoizedNeuralGate
        overdrive={overdrive}
        onOpenConsole={openConsole}
        onToggleOverdrive={toggleOverdrive}
      />

      <Suspense fallback={<div className="relative z-20 h-24 border-y border-white/10 bg-[#0d0f12]" />}>
        <LazySignalStrip reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={<div className="relative z-10 min-h-[80svh] bg-[#101216]" />}>
        <LazySystemsChapter
          activeSystemId={activeSystemId}
          setActiveSystemId={setActiveSystemId}
          reducedMotion={reducedMotion}
        />
      </Suspense>

      <Suspense fallback={<div className="relative z-20 min-h-[70svh] bg-[#f4d431]" />}>
        <LazySelectedWork reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={<div className="relative z-20 min-h-[80svh] bg-[#050709]" />}>
        <LazyOperatorProfile />
      </Suspense>

      <Suspense fallback={<div className="relative z-10 min-h-[70svh] bg-[#0a0b0d]" />}>
        <LazyResearchPath reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={<div className="relative z-20 min-h-[70svh] bg-[#050709]" />}>
        <LazyFinale />
      </Suspense>

      {consoleOpen ? (
        <Suspense fallback={null}>
          <LazyCommandDrawer
            reducedMotion={reducedMotion}
            onClose={closeConsole}
            onOverdrive={enableOverdrive}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
