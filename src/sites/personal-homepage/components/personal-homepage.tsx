"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, Command, Pause, Play } from "lucide-react";
import { clsx } from "clsx";
import {
  lazy,
  memo,
  Suspense,
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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef(0);
  const activeChapterRef = useRef<ChapterId>("hero");
  const [activeChapter, setActiveChapter] = useState<ChapterId>("hero");
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const [consoleOpen, setConsoleOpen] = useState(false);

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
  }

  function handlePointerLeave() {
    pointerRef.current = { x: 0, y: 0 };
    rootRef.current?.style.setProperty("--cstd-pointer-x", "50%");
    rootRef.current?.style.setProperty("--cstd-pointer-y", "42%");
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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => {
        if (!reducedMotion) impulseRef.current = 1;
      }}
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
          src="/cstd-world/cstd-kinetic-studio-v2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 saturate-[0.72] contrast-110"
        />
        {enhancementsReady && desktopScene ? <PersonalImmersiveScene {...sceneProps} /> : null}
        <div className="absolute inset-0 bg-[#0a0b0d]/55" />
        <div
          data-cstd-pointer-field
          className="absolute inset-0 opacity-70 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(42rem circle at var(--cstd-pointer-x, 50%) var(--cstd-pointer-y, 42%), rgba(85,194,200,0.12), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div
        ref={progressBarRef}
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left scale-x-0 bg-[#f4c95d] shadow-[0_0_14px_rgba(244,201,93,0.45)]"
      />

      <header
        data-cstd-header-theme={activeChapter}
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-white/10 bg-[#0a0b0d]/82 px-5 backdrop-blur-xl md:px-10 lg:px-12"
      >
        <a
          href="#top"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f4c95d] font-mono text-[11px] font-black text-[#0a0b0d]">
            CS
          </span>
          <span className="font-mono text-sm font-black">CSTD</span>
          <span className="hidden text-xs text-[#8f9599] sm:inline">/ {chapterLabels[activeChapter]}</span>
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
            data-cstd-motion-toggle
            aria-pressed={!reducedMotion}
            aria-label={reducedMotion ? "开启增强动效" : "切换到平静模式"}
            title={reducedMotion ? "开启增强动效" : "切换到平静模式"}
            onClick={toggleMotionMode}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-[#a5aaad] transition-colors hover:border-[#f4c95d]/60 hover:text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
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
            onClick={() => setConsoleOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#f4c95d]/45 bg-[#f4c95d]/10 text-[#f4c95d] transition-colors hover:bg-[#f4c95d] hover:text-[#0a0b0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
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
        className="relative z-10 flex min-h-[94svh] items-center px-5 pb-20 pt-28 contain-paint md:px-10 md:pt-32 lg:px-16"
      >
        <div className="mx-auto grid w-full max-w-[1540px] gap-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-20">
          <div className="max-w-6xl">
            <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase text-[#f4c95d] md:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-[#8bcaa8] shadow-[0_0_18px_rgba(139,202,168,0.7)]" />
              Personal systems studio / Sydney · Nanjing
            </p>
            <h1
              id="cstd-hero-title"
              className="mt-8 text-[6rem] font-black leading-[0.78] tracking-[0] text-[#f2efe7] md:text-[9rem] lg:text-[11rem] xl:text-[13rem]"
            >
              CSTD
            </h1>
            <p className="mt-10 max-w-4xl text-3xl font-semibold leading-[1.08] text-[#f2efe7] md:text-5xl lg:text-6xl">
              把产品、数据、AI 与研究，
              <span className="text-[#f4c95d]">做成真正运行的系统。</span>
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#a5aaad] md:text-lg">
              奶黄包的个人技术工作室。这里保留代表作品、工程方法与仍在推进的研究路径，不做拥挤的项目目录。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#proof"
                aria-label="进入作品章节"
                className="inline-flex h-12 items-center gap-3 rounded-md bg-[#f4c95d] px-5 font-mono text-sm font-black text-[#0a0b0d] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#f8d983] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c95d]"
              >
                查看代表作品
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setConsoleOpen(true)}
                className="inline-flex h-12 items-center gap-3 rounded-md border border-white/20 bg-black/20 px-5 font-mono text-sm font-bold text-[#f2efe7] transition-colors hover:border-[#55c2c8]/70 hover:text-[#55c2c8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#55c2c8]"
              >
                <Command aria-hidden="true" className="h-4 w-4" />
                打开控制台
              </button>
            </div>
          </div>

          <aside className="border-y border-white/15 py-6 font-mono lg:mb-1" aria-label="工作室状态">
            <p className="text-[10px] font-bold uppercase text-[#8f9599]">Studio ledger / 2026</p>
            <dl className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-1">
              <div className="border-l-2 border-[#f4c95d] pl-3">
                <dt className="text-[10px] uppercase text-[#777d81]">Systems</dt>
                <dd className="mt-1 text-2xl font-black text-[#f2efe7]">{cstdSystems.length}</dd>
              </div>
              <div className="border-l-2 border-[#55c2c8] pl-3">
                <dt className="text-[10px] uppercase text-[#777d81]">Proofs</dt>
                <dd className="mt-1 text-2xl font-black text-[#f2efe7]">{cstdProofs.length}</dd>
              </div>
              <div className="border-l-2 border-[#ef7868] pl-3">
                <dt className="text-[10px] uppercase text-[#777d81]">Status</dt>
                <dd className="mt-1 text-sm font-black text-[#8bcaa8]">BUILDING</dd>
              </div>
            </dl>
            <p className="mt-6 text-[10px] leading-5 text-[#777d81]">Product surfaces · edge operations · AI creation · research models</p>
          </aside>
        </div>

        <a
          href="#systems"
          aria-label="进入系统章节"
          className="absolute bottom-6 left-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase text-[#8f9599] transition-colors hover:text-[#f4c95d] md:left-10 lg:left-16"
        >
          Scroll to explore
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

      <Suspense fallback={<div className="relative z-20 min-h-[70svh] bg-[#e9e5dc]" />}>
        <LazySelectedWork reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={<div className="relative z-10 min-h-[70svh] bg-[#0a0b0d]" />}>
        <LazyResearchPath reducedMotion={reducedMotion} />
      </Suspense>

      <footer
        id="cstd-footer"
        className="relative z-20 border-t border-white/10 bg-[#0a0b0d] px-5 py-20 text-[#f2efe7] [content-visibility:auto] [contain-intrinsic-size:auto_420px] md:px-10 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1540px] gap-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-[#f4c95d]">End of current build</p>
            <p className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">继续学习，继续交付，继续把复杂问题做清楚。</p>
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
            onClose={() => setConsoleOpen(false)}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
