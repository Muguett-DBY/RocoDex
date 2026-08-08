"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, Command, Pause, Play, Zap } from "lucide-react";
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
import { cstdProofs, cstdSystems, type CstdSystem } from "../content/systems";

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
const LazyResearchPath = lazy(() =>
  import("./sections/research-path").then((module) => ({ default: module.MemoizedResearchPath })),
);

const PersonalImmersiveScene = memo(
  dynamic(
    () => import("./immersive-scene").then((module) => module.PersonalImmersiveScene),
    { ssr: false },
  ),
);

type ChapterId = "hero" | "systems" | "proof" | "path";
type MotionMode = "full" | "calm";

const chapterLinks = [
  { id: "systems", label: "系统" },
  { id: "proof", label: "作品" },
  { id: "path", label: "路径" },
] as const;

const chapterLabels: Record<ChapterId, string> = {
  hero: "Studio",
  systems: "Systems",
  proof: "Selected work",
  path: "Research path",
};

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

function ChapterRail({ activeChapter }: { activeChapter: ChapterId }) {
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
            aria-label={chapter.label}
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
  const pulseRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef(0);
  const activeChapterRef = useRef<ChapterId>("hero");
  const [activeChapter, setActiveChapter] = useState<ChapterId>("hero");
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [overdrive, setOverdrive] = useState(false);
  const openConsole = useCallback(() => setConsoleOpen(true), []);
  const closeConsole = useCallback(() => setConsoleOpen(false), []);
  const toggleOverdrive = useCallback(() => setOverdrive((current) => !current), []);
  const enableOverdrive = useCallback(() => setOverdrive(true), []);

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
    let frame = 0;

    const syncScroll = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      progressRef.current = progress;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      const activationLine = window.innerHeight * 0.42;
      let nextChapter: ChapterId = "hero";
      for (const chapter of chapterLinks) {
        const section = document.getElementById(chapter.id);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          nextChapter = chapter.id;
        }
      }
      if (nextChapter !== activeChapterRef.current) {
        activeChapterRef.current = nextChapter;
        setActiveChapter(nextChapter);
      }
    };

    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncScroll);
    };

    syncScroll();
    const resizeObserver = new ResizeObserver(requestSync);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const sceneProps = useMemo(
    () => ({
      progressRef,
      pointerRef,
      impulseRef,
      reducedMotion,
      showArchive: activeChapter === "systems",
      active: documentVisible && (activeChapter === "hero" || activeChapter === "systems"),
    }),
    [activeChapter, documentVisible, reducedMotion],
  );

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    pointerRef.current = { x: x * 2 - 1, y: -(y * 2 - 1) };
    rootRef.current?.style.setProperty("--cstd-pointer-x", `${Math.round(x * 100)}%`);
    rootRef.current?.style.setProperty("--cstd-pointer-y", `${Math.round(y * 100)}%`);
    if (coordinateRef.current) {
      coordinateRef.current.textContent = `${String(Math.round(x * 999)).padStart(3, "0")}:${String(Math.round(y * 999)).padStart(3, "0")}`;
    }
  }

  function handlePointerLeave() {
    pointerRef.current = { x: 0, y: 0 };
    rootRef.current?.style.setProperty("--cstd-pointer-x", "50%");
    rootRef.current?.style.setProperty("--cstd-pointer-y", "42%");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion) return;
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

      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#0a0b0d]">
        <Image
          src="/cstd-world/cstd-night-ops-v1.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="cstd-hero-image object-cover opacity-70 saturate-[0.86] contrast-110"
        />
        {enhancementsReady && desktopScene ? <PersonalImmersiveScene {...sceneProps} /> : null}
        <div className="absolute inset-0 bg-[#050709]/45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.9)_0%,rgba(5,7,9,0.48)_47%,rgba(5,7,9,0.08)_78%)]" />
        <div
          data-cstd-pointer-field
          className="absolute inset-0 opacity-70 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(36rem circle at var(--cstd-pointer-x, 50%) var(--cstd-pointer-y, 42%), rgba(36,224,255,0.18), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div aria-hidden="true" data-cstd-global-hud className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
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
      </div>

      <div
        ref={progressBarRef}
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left scale-x-0 bg-[#f4c95d] shadow-[0_0_14px_rgba(244,201,93,0.45)]"
      />

      <header
        data-cstd-header-theme={activeChapter}
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
          <span className="hidden font-mono text-[10px] font-bold uppercase text-[#7f8b90] sm:inline">{chapterLabels[activeChapter]}</span>
        </a>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <nav aria-label="主导航" className="hidden items-center gap-7 font-mono text-xs font-semibold text-[#a5aaad] md:flex">
            {chapterLinks.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                aria-current={activeChapter === chapter.id ? "page" : undefined}
                className="transition-colors hover:text-[#f4c95d] aria-[current=page]:text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
              >
                {chapter.label}
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

      <ChapterRail activeChapter={activeChapter} />

      <section
        id="top"
        data-cstd-hero
        data-cstd-elastic-archive
        aria-labelledby="cstd-hero-title"
        className="relative z-10 flex min-h-[96svh] items-center px-5 pb-20 pt-28 contain-paint md:px-10 md:pt-32 lg:px-16"
      >
        <div className="mx-auto grid w-full max-w-[1540px] gap-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-20">
          <div className="max-w-6xl">
            <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase text-[#f4d431] md:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-[#3dff8f] shadow-[0_0_18px_rgba(61,255,143,0.7)]" />
              [ NODE CSTD-01 ] · NIGHT OPERATIONS ONLINE
            </p>
            <h1
              id="cstd-hero-title"
              data-text="CSTD"
              className="cstd-glitch-title mt-8 w-fit text-[6rem] font-black leading-[0.78] tracking-[0] text-[#f2efe7] md:text-[9rem] lg:text-[11rem] xl:text-[13rem]"
            >
              CSTD
            </h1>
            <p className="mt-9 font-mono text-xs font-black tracking-[0] text-[#24e0ff] md:text-sm">CODE / SHIP / BREAK LIMITS / REPEAT</p>
            <p className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.06] text-[#f2efe7] md:text-5xl lg:text-6xl">
              把代码写进现实，
              <span className="text-[#f4d431]">让系统在霓虹里运行。</span>
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#a5aaad] md:text-lg">
              奶黄包的个人技术工作室。产品、数据、AI 与研究在这里接入同一条神经总线，每一项能力都必须通向真实交付。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#proof"
                aria-label="进入作品章节"
                className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#ffe95f] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
              >
                接入作品档案
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={openConsole}
                className="inline-flex h-12 items-center gap-3 border border-[#24e0ff]/45 bg-[#061015]/70 px-5 font-mono text-sm font-bold text-[#d8fbff] transition-colors hover:border-[#24e0ff] hover:bg-[#24e0ff] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
              >
                <Command aria-hidden="true" className="h-4 w-4" />
                打开 CYBERDECK
              </button>
              <button
                type="button"
                aria-pressed={overdrive}
                onClick={toggleOverdrive}
                className={clsx(
                  "inline-flex h-12 items-center gap-3 border px-5 font-mono text-sm font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]",
                  overdrive
                    ? "border-[#ff3b30] bg-[#ff3b30] text-[#050709]"
                    : "border-[#ff3b30]/50 bg-[#1a0909]/70 text-[#ff6a60] hover:bg-[#ff3b30] hover:text-[#050709]",
                )}
              >
                <Zap aria-hidden="true" className="h-4 w-4" />
                {overdrive ? "关闭超载" : "启动超载"}
              </button>
            </div>
          </div>

          <aside className="border-y border-[#24e0ff]/25 bg-[#061015]/65 px-5 py-6 font-mono backdrop-blur-sm lg:mb-1" aria-label="工作室状态">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase text-[#24e0ff]">Runtime monitor / 2026</p>
              <span className={clsx("text-[9px] font-black", overdrive ? "text-[#ff5a50]" : "text-[#3dff8f]")}>{overdrive ? "OVERDRIVE" : "STABLE"}</span>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-1">
              <div className="border-l-2 border-[#f4d431] pl-3">
                <dt className="text-[10px] uppercase text-[#777d81]">Systems</dt>
                <dd className="mt-1 text-2xl font-black text-[#f2efe7]">{cstdSystems.length}</dd>
              </div>
              <div className="border-l-2 border-[#24e0ff] pl-3">
                <dt className="text-[10px] uppercase text-[#777d81]">Proofs</dt>
                <dd className="mt-1 text-2xl font-black text-[#f2efe7]">{cstdProofs.length}</dd>
              </div>
              <div className="border-l-2 border-[#ff3b30] pl-3">
                <dt className="text-[10px] uppercase text-[#777d81]">Link</dt>
                <dd className="mt-1 text-sm font-black text-[#3dff8f]">ONLINE</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-[#24e0ff]/20 pt-4 text-[9px] font-bold leading-5 text-[#718087]">
              <p>ACCESS: ROOT / READ-WRITE</p>
              <p>TRACE: CLEAN / LATENCY 12MS</p>
              <p>SIGNAL: PRODUCT · DATA · AI · RESEARCH</p>
            </div>
          </aside>
        </div>

        <a
          href="#systems"
          aria-label="进入系统章节"
          className="absolute bottom-6 left-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase text-[#8f9599] transition-colors hover:text-[#f4c95d] md:left-10 lg:left-16"
        >
          Jack in / scroll to explore
          <span aria-hidden="true" className="h-px w-10 bg-current" />
        </a>
      </section>

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

      <Suspense fallback={<div className="relative z-10 min-h-[70svh] bg-[#0a0b0d]" />}>
        <LazyResearchPath reducedMotion={reducedMotion} />
      </Suspense>

      <footer
        id="cstd-footer"
        className="relative z-20 overflow-hidden border-t border-[#f4d431]/40 bg-[#050709] px-5 py-20 text-[#f2efe7] [content-visibility:auto] [contain-intrinsic-size:auto_420px] md:px-10 lg:px-16"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(135deg,#f4d431_0_14px,#050709_14px_28px)]" />
        <span aria-hidden="true" className="absolute -right-4 -top-8 font-mono text-[9rem] font-black leading-none text-[#f4d431]/[0.04] md:text-[16rem]">EOF</span>
        <div className="mx-auto grid max-w-[1540px] gap-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-[#f4d431]">SYSTEM // STILL LIVE</p>
            <p className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">继续编译现实，直到复杂问题失去噪声。</p>
          </div>
          <div className="font-mono text-xs text-[#8f9599] md:text-right">
            <a href="#top" className="font-bold text-[#f2efe7] transition-colors hover:text-[#f4c95d]">cstd@custard.top ↑</a>
            <p className="mt-3">奶黄包个人技术工作室</p>
            <p className="mt-1">2022–2026 / STILL BUILDING</p>
          </div>
        </div>
      </footer>

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
