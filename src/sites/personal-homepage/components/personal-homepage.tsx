"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { clsx } from "clsx";
import {
  LazyMotion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as m from "framer-motion/m";
import {
  useEffect,
  memo,
  useMemo,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  lazy,
  Suspense,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cstdProjects } from "../content/projects";
import {
  cstdLiveObjectIds,
  cstdProofs,
  cstdSystems,
  getCstdProjectsById,
  type CstdSystem,
} from "../content/systems";
import { ClickSpark } from "./click-spark";
import { DecryptedText } from "./decrypted-text";
import { Magnet } from "./magnet";
import { ShinyText } from "./shiny-text";
import { TerminalBar } from "./terminal-bar";
import { TerminalCommand, type TerminalLine } from "./terminal-command";
import type { OrbitItem } from "./hero-orbit";

// 特效组件全部动态加载（不进初始 bundle）
const LazyGlitchFx = lazy(() => import("./reactbits/glitch-fx").then((m) => ({ default: m.GlitchFx })));
const LazyConfettiBurst = lazy(() => import("./reactbits/confetti-burst").then((m) => ({ default: m.ConfettiBurst })));
const LazyHeroOrbit = lazy(() => import("./hero-orbit").then((m) => ({ default: m.HeroOrbit })));
const LazyNoiseOverlay = lazy(() => import("./noise-overlay").then((m) => ({ default: m.NoiseOverlay })));
// 章节级 code-splitting：每个章节独立 chunk，初始 bundle 只含 Hero
const LazySignalStrip = lazy(() => import("./sections/signal-strip").then((m) => ({ default: m.MemoizedSignalStrip })));
const LazySystemsChapter = lazy(() => import("./sections/systems-chapter").then((m) => ({ default: m.MemoizedSystemsChapter })));
const LazySelectedWork = lazy(() => import("./sections/selected-work").then((m) => ({ default: m.MemoizedSelectedWork })));
const LazyResearchPath = lazy(() => import("./sections/research-path").then((m) => ({ default: m.MemoizedResearchPath })));

// anime.js 驱动的文字特效走异步 chunk，保住初始 JS 预算
const LetterReveal = dynamic(
  () => import("./letter-reveal").then((module) => module.LetterReveal),
);

const PersonalImmersiveScene = memo(
  dynamic(
    () => import("./immersive-scene").then((module) => module.PersonalImmersiveScene),
    { ssr: false },
  ),
);

const loadPersonalMotionFeatures = () =>
  import("./motion-features").then((module) => module.default);

type ChapterId = "hero" | "systems" | "proof" | "path";

const chapterLinks = [
  { id: "systems", label: "系统" },
  { id: "proof", label: "作品" },
  { id: "path", label: "路径" },
] as const;

const chapterLabels: Record<ChapterId, string> = {
  hero: "LIVE FIELD",
  systems: "SYSTEMS",
  proof: "SELECTED WORK",
  path: "RESEARCH PATH",
};

// Hero 浮动进程标签：位置（视口 %）、视差深度、漂浮参数（精简 3 个，全部贴边不遮挡中央内容）
const heroOrbitItems: OrbitItem[] = [
  { label: "PROC 001 · PRODUCT ENGINEERING", left: 3, top: 24, depth: 1.5, float: 8, speed: 1.1, phase: 0 },
  { label: "PROC 003 · DATA SYSTEMS", left: 90, top: 62, depth: 1.7, float: 7, speed: 1.3, phase: 4.2 },
  { label: "PROC 005 · RESEARCH MODELS", left: 86, top: 12, depth: 1.1, float: 9, speed: 0.9, phase: 2.4 },
];


const proofProjects = getCstdProjectsById(
  cstdProjects,
  cstdProofs.map((proof) => proof.projectId),
);

const liveProjects = getCstdProjectsById(cstdProjects, cstdLiveObjectIds);

const motionModeStorageKey = "cstd-motion-mode";
const motionModeChangeEvent = "cstd-motion-mode-change";
type MotionMode = "full" | "calm";
let volatileMotionMode: MotionMode = "full";

// 统一 spring 物理参数
const springSoft = { type: "spring", stiffness: 90, damping: 18, mass: 0.7 } as const;

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

function useDeferredEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), { timeout: 900 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => setReady(true), 120);
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

/** 终端窗口标题栏（红黄绿圆点 + 标题） */

/** 终端提示符 */

// Hero 终端启动日志（打字机剧本）
const heroBootLines: TerminalLine[] = [
  { text: "whoami", prompt: true, type: 14 },
  { text: "奶黄包 — product engineer / creative systems builder", type: 10 },
  { text: "uptime", prompt: true, type: 14 },
  { text: "up 4 years, building live products with product, data, AI and research.", type: 10 },
  { text: "", type: 0 },
  { text: "▸ 这是活的终端 —— 试试输入 help 回车，或按 Tab 补全", tone: "accent", type: 9 },
];

function ChapterRail({ activeChapter }: { activeChapter: ChapterId }) {
  return (
    <nav
      aria-label="章节导航"
      className={clsx(
        "fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 font-mono transition-opacity duration-500 xl:flex",
        activeChapter === "path" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {chapterLinks.map((chapter) => {
        const active = activeChapter === chapter.id;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={chapter.label}
            className="group flex items-center gap-3 text-[10px] font-bold text-[#a8adb5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]"
          >
            <span
              className={clsx(
                "rounded-sm border px-2.5 py-1 transition-all duration-500",
                active
                  ? "border-[#33ff66] bg-[#33ff66] text-[#0b0c0e] shadow-[0_0_16px_rgba(51,255,102,0.4)]"
                  : "border-[#3a3f47] text-[#8a8f98] group-hover:border-[#5a5f66] group-hover:text-[#d7d7d7]",
              )}
            >
              ~/{chapter.id}
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "h-px transition-all duration-500",
                active ? "w-6 bg-[#33ff66]" : "w-3 bg-[#3a3f47] group-hover:w-5",
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
  const reducedMotion = motionMode === "calm";
  const enhancementsReady = useDeferredEnhancements();
  const documentVisible = useDocumentVisibility();
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef(0);
  const activeChapterRef = useRef<ChapterId>("hero");
  const [activeChapter, setActiveChapter] = useState<ChapterId>("hero");
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const [termPath, setTermPath] = useState("~");
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.35 });
  // ASCII 滚动百分比文本（MotionValue 直渲染，零重渲染）
  const scrollPercent = useTransform(pageProgress, (value) => `${Math.round(value * 100)}%`);

  // Hero 滚动视差
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, -140]);
  const heroOpacity = useTransform(heroProgress, [0, 0.72], [1, 0]);

  // 双层光标：内十字（快 spring）+ 外光环（慢 spring）
  const cursorX = useMotionValue(-80);
  const cursorY = useMotionValue(-80);
  const smoothCursorX = useSpring(cursorX, { stiffness: 420, damping: 34, mass: 0.25 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 420, damping: 34, mass: 0.25 });
  const glowCursorX = useSpring(cursorX, { stiffness: 130, damping: 22, mass: 0.7 });
  const glowCursorY = useSpring(cursorY, { stiffness: 130, damping: 22, mass: 0.7 });
  const glowHover = useSpring(0, { stiffness: 200, damping: 20 });
  const glowScale = useTransform(glowHover, [0, 1], [1, 1.5]);
  const glowOpacity = useTransform(glowHover, [0, 1], [0.25, 0.7]);
  const hoveringInteractiveRef = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  useMotionValueEvent(scrollY, "change", (value) => {
    const activationLine = value + window.innerHeight * 0.42;
    let nextChapter: ChapterId = "hero";
    for (const chapter of chapterLinks) {
      const section = document.getElementById(chapter.id);
      if (section && activationLine >= section.offsetTop) nextChapter = chapter.id;
    }
    if (nextChapter !== activeChapterRef.current) {
      activeChapterRef.current = nextChapter;
      setActiveChapter(nextChapter);
    }
  });

  const sceneProps = useMemo(
    () => ({
      progressRef,
      pointerRef,
      impulseRef,
      reducedMotion,
      active: documentVisible && (activeChapter === "hero" || activeChapter === "systems"),
    }),
    [activeChapter, documentVisible, reducedMotion],
  );

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    pointerRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -((event.clientY / window.innerHeight) * 2 - 1),
    };
    cursorX.set(event.clientX - 18);
    cursorY.set(event.clientY - 18);
    const target = event.target as HTMLElement | null;
    const hovering = Boolean(target?.closest?.("a, button, [role='button']"));
    if (hovering !== hoveringInteractiveRef.current) {
      hoveringInteractiveRef.current = hovering;
      glowHover.set(hovering ? 1 : 0);
    }
  }

  function handlePointerLeave() {
    pointerRef.current = { x: 0, y: 0 };
    cursorX.set(-80);
    cursorY.set(-80);
    hoveringInteractiveRef.current = false;
    glowHover.set(0);
  }

  function toggleMotionMode() {
    const next = motionMode === "full" ? "calm" : "full";
    volatileMotionMode = next;
    try {
      window.localStorage.setItem(motionModeStorageKey, next);
    } catch {
      // The in-session toggle still works when storage is unavailable.
    }
    window.dispatchEvent(new Event(motionModeChangeEvent));
  }

  // Hero 交互终端的命令处理器
  const handleTerminalCommand = useCallback(
    (raw: string, echo: (lines: TerminalLine[]) => void) => {
      const cmd = raw.trim();
      const first = cmd.split(/\s+/)[0].toLowerCase();
      switch (first) {
        case "help":
          echo([
            { text: "可用命令：", tone: "accent" },
            { text: "  whoami               — 我是谁", tone: "dim" },
            { text: "  ls                   — 列出项目目录", tone: "dim" },
            { text: "  cd systems|work|path — 跳转章节", tone: "dim" },
            { text: "  ps                   — 查看运行中的能力进程", tone: "dim" },
            { text: "  open <项目名>         — 打开项目（新窗口）", tone: "dim" },
            { text: "  top                  — 实时系统负载", tone: "dim" },
            { text: "  ping custard.top     — 网络延迟测试", tone: "dim" },
            { text: "  tree                 — 目录树", tone: "dim" },
            { text: "  whois                — 域名信息", tone: "dim" },
            { text: "  curl <host>          — 模拟 HTTP 请求", tone: "dim" },
            { text: "  matrix               — 数字雨（彩蛋）", tone: "dim" },
            { text: "  history              — 命令历史", tone: "dim" },
            { text: "  echo <文本>          — 回显", tone: "dim" },
            { text: "  neofetch             — 系统信息", tone: "dim" },
            { text: "  date                 — 当前时间", tone: "dim" },
            { text: "  clear                — 清屏", tone: "dim" },
            { text: "  exit                 — 退出到页脚", tone: "dim" },
          ]);
          break;
        case "whoami":
          echo([
            { text: "奶黄包 — product engineer / creative systems builder", tone: "accent" },
            { text: "base: Sydney · Nanjing · The web", tone: "dim" },
            { text: "focus: 把产品、数据、AI 和研究折进一条会呼吸的系统。", tone: "dim" },
          ]);
          break;
        case "ls":
          echo([
            { text: "~/projects/", tone: "accent" },
            ...proofProjects.map((project) => ({
              text: `  drwxr-xr-x  ${project.id}/`,
              tone: "default" as const,
            })),
            ...liveProjects.map((project) => ({
              text: `  lrwxrwxrwx  ${project.id} → live`,
              tone: "dim" as const,
            })),
            { text: `  ${proofProjects.length + liveProjects.length} entries`, tone: "dim" },
          ]);
          break;
        case "cd": {
          const target = cmd.split(/\s+/)[1];
          const map: Record<string, string> = {
            "~": "top",
            "/": "top",
            systems: "systems",
            work: "proof",
            projects: "proof",
            path: "path",
          };
          const id = map[target ?? ""];
          if (id) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            setTermPath(target ?? "~");
            echo([{ text: `→ ~/${target}`, tone: "accent" }]);
          } else {
            echo([{ text: `cd: no such directory: ${target ?? ""}`, tone: "error" }]);
          }
          break;
        }
        case "tree":
          echo([
            { text: "~/", tone: "accent" },
            { text: "├── systems/", tone: "dim" },
            ...cstdSystems.map((system) => ({
              text: `│   ├── ${system.id}.service [RUNNING]`,
              tone: "default" as const,
            })),
            { text: "├── work/", tone: "dim" },
            ...proofProjects.map((project) => ({
              text: `│   ├── ${project.id}/ (${project.title})`,
              tone: "default" as const,
            })),
            { text: "├── path/", tone: "dim" },
            { text: "│   └── 2022 → 2026 learning log", tone: "default" },
            { text: "└── README.md — 把产品、数据、AI 和研究折进一条会呼吸的系统。", tone: "dim" },
          ]);
          break;
        case "echo": {
          const rest = cmd.slice(4).trim();
          echo([{ text: rest || "", tone: "default" }]);
          break;
        }
        case "whois":
          echo([
            { text: "Domain: custard.top", tone: "dim" },
            { text: "Registrant: 奶黄包 (product engineer)", tone: "default" },
            { text: "Registered: 2022 · Updated: 2026", tone: "dim" },
            { text: "Status: clientTransferProhibited", tone: "dim" },
            { text: "Name servers: curiosity.work · persistence.dev · taste.studio", tone: "accent" },
          ]);
          break;
        case "curl": {
          const target = cmd.split(/\s+/)[1];
          if (target && target.includes("custard.top")) {
            echo([
              { text: "HTTP/1.1 200 OK", tone: "dim", type: 7 },
              { text: "Content-Type: text/html; charset=utf-8", tone: "dim", type: 7 },
              { text: "Cache-Control: public, max-age=3600", tone: "dim", type: 7 },
              { text: "", type: 0 },
              { text: "<!doctype html><title>cstd@custard.top</title>", tone: "default", type: 7 },
              { text: "<body class='terminal'>把产品、数据、AI 和研究，折进一条会呼吸的系统。</body>", tone: "default", type: 7 },
            ]);
          } else {
            echo([{ text: `curl: could not resolve host: ${target ?? ""}`, tone: "error" }]);
          }
          break;
        }
        case "ps":
          echo([
            { text: "PID   STATUS    PROCESS", tone: "dim" },
            ...cstdSystems.map((system, index) => ({
              text: `${String(index + 1).padStart(4, " ")}  [RUNNING]  ${system.title}`,
              tone: "default" as const,
            })),
          ]);
          break;
        case "open": {
          const target = cmd.split(/\s+/)[1];
          const project = [...proofProjects, ...liveProjects].find((p) => p.id === target);
          if (project) {
            echo([{ text: `opening ${project.id}...`, tone: "dim" }]);
            window.open(project.href, "_blank", "noopener,noreferrer");
          } else {
            echo([{ text: `open: no such project: ${target ?? ""}（试试 ls）`, tone: "error" }]);
          }
          break;
        }
        case "top": {
          // 预生成三帧"实时"负载，打字机打出（模拟 top 刷新）
          const bar = (pct: number) =>
            "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
          const frames = [
            [38, 12, 55, 24, 8],
            [42, 14, 58, 22, 9],
            [36, 11, 61, 26, 7],
          ];
          echo([
            { text: "top - up 4 years, 1 user, load average: 0.42, 0.35, 0.28", tone: "dim", type: 8 },
            { text: "", type: 0 },
            { text: "PID   CPU%  MEM%  PROCESS", tone: "dim", type: 8 },
            ...frames.flatMap((frame) =>
              cstdSystems.map((system, index) => ({
                text: `${String(index + 1).padStart(3)}   ${bar(frame[index])} ${String(frame[index]).padStart(3)}%  ${system.title}`,
                tone: "default" as const,
                type: 5,
              })),
            ),
          ]);
          break;
        }
        case "ping": {
          const rtt = () => (Math.random() * 18 + 6).toFixed(1);
          echo([
            { text: "PING custard.top (140.82.114.4): 56 data bytes", tone: "dim", type: 8 },
            { text: `64 bytes from 140.82.114.4: icmp_seq=0 ttl=56 time=${rtt()} ms`, type: 7 },
            { text: `64 bytes from 140.82.114.4: icmp_seq=1 ttl=56 time=${rtt()} ms`, type: 7 },
            { text: `64 bytes from 140.82.114.4: icmp_seq=2 ttl=56 time=${rtt()} ms`, type: 7 },
            { text: "--- custard.top ping statistics ---", tone: "dim", type: 8 },
            { text: "3 packets transmitted, 3 received, 0% packet loss", tone: "accent", type: 8 },
          ]);
          break;
        }
        case "neofetch":
          echo([
            { text: "        ████████████", tone: "accent" },
            { text: "       ██          ██        cstd@custard.top", tone: "accent" },
            { text: "      ██              ██     -------------------", tone: "accent" },
            { text: "     ██                ██    OS: Personal Platform v4", tone: "accent" },
            { text: "     ██    ████████    ██    Shell: zsh 5.9", tone: "accent" },
            { text: "     ██    ████████    ██    Uptime: 4 years", tone: "accent" },
            { text: "     ██                ██    Stack: React/Next/Three", tone: "accent" },
            { text: "      ██              ██     Flavors: 奶黄", tone: "accent" },
            { text: "       ██          ██", tone: "accent" },
            { text: "        ████████████", tone: "accent" },
          ]);
          break;
        case "date":
          echo([
            { text: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }) + " (CST)", tone: "default" },
          ]);
          break;
        case "clear":
          // 清屏由 TerminalCommand 内部处理（不 echo）
          break;
        case "exit":
          document.getElementById("cstd-footer")?.scrollIntoView({ behavior: "smooth" });
          echo([{ text: "logout", tone: "dim" }]);
          break;
        case "sudo":
          echo([
            { text: "奶黄包 is not in the sudoers file. This incident will be reported. ☕", tone: "error" },
          ]);
          // 彩蛋：即使没权限，也值得一场庆祝（动态加载 canvas-confetti）
          if (!reducedMotion) {
            void import("canvas-confetti").then(({ default: confetti }) => {
              const defaults = {
                spread: 80,
                ticks: 100,
                zIndex: 200,
                colors: ["#33ff66", "#5b8dff", "#febc2e", "#d7d7d7"],
              };
              confetti({ ...defaults, particleCount: 70, origin: { x: 0.25, y: 0.55 } });
              confetti({ ...defaults, particleCount: 70, origin: { x: 0.75, y: 0.55 } });
            });
          }
          break;
        default:
          echo([{ text: `zsh: command not found: ${first}（试试 help）`, tone: "error" }]);
      }
    },
    [reducedMotion],
  );

  return (
    <LazyMotion features={loadPersonalMotionFeatures} strict>
      <main
        data-cstd-kinetic-world
        data-cstd-enhancements-ready={enhancementsReady ? "true" : "false"}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={() => {
          if (!reducedMotion) impulseRef.current = 1;
        }}
        className="relative isolate overflow-clip bg-[#0b0c0e] font-mono text-[#d7d7d7]"
      >
      <ClickSpark
        disabled={reducedMotion}
        sparkColor="#33ff66"
        sparkCount={10}
        sparkRadius={20}
        sparkSize={8}
      >
      <a href="#systems" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black">
        跳到主要内容
      </a>

      <div aria-hidden="true" className="fixed inset-0 z-0 bg-[#0b0c0e]">
        <Image
          src="/cstd-world/cstd-kinetic-studio-v2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#0b0c0e]/75" />
        {enhancementsReady ? (
          <>
            <PersonalImmersiveScene {...sceneProps} />
            {/* 压暗层：让粒子成为氛围而不是噪音 */}
            <div className="absolute inset-0 bg-[#0b0c0e]/40" />
          </>
        ) : null}
      </div>

      <Suspense fallback={null}>
        <LazyNoiseOverlay
          staticMode={reducedMotion}
          opacity={0.05}
          blendMode="normal"
          className="fixed inset-0 z-[64]"
        />
      </Suspense>

      <m.div
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
        style={{
          scaleX: pageProgress,
          background: "linear-gradient(90deg, #33ff66 0%, #7ee8a2 45%, #5b8dff 100%)",
          boxShadow: "0 0 12px rgba(51,255,102,0.4)",
        }}
      />

      {/* ASCII 滚动百分比（终端风） */}
      <m.span
        aria-hidden="true"
        className="fixed right-3 top-2 z-[70] font-mono text-[10px] font-bold text-[#33ff66]/85"
        style={{ textShadow: "0 0 8px rgba(51,255,102,0.5)" }}
      >
        {scrollPercent}
      </m.span>

      {/* 终端方块光标（内） */}
      <m.div
        aria-hidden="true"
        data-cstd-pointer-field
        className={clsx(
          "pointer-events-none fixed left-0 top-0 z-[80] hidden h-5 w-3 items-center justify-center bg-[#33ff66] lg:block",
          reducedMotion && "lg:!hidden",
        )}
        style={{ x: smoothCursorX, y: smoothCursorY }}
      />

      {/* 终端光标外环 */}
      <m.div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none fixed left-0 top-0 z-[79] hidden h-12 w-12 rounded-full border border-[#33ff66]/25 lg:block",
          reducedMotion && "lg:!hidden",
        )}
        style={{
          x: glowCursorX,
          y: glowCursorY,
          scale: glowScale,
          opacity: glowOpacity,
        }}
      />

      <m.header
        data-cstd-header-theme={activeChapter}
        className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#2a2d33] bg-[#0b0c0e]/90 px-5 font-mono text-white md:px-10 lg:px-12"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={springSoft}
      >
        <Magnet disabled={reducedMotion} padding={24} magnetStrength={4}>
          <a href="#top" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-[#33ff66] bg-[#33ff66]/10 text-[10px] font-black text-[#33ff66]">CS</span>
            <span className="text-sm font-black text-[#d7d7d7]">cstd@custard.top</span>
            <span aria-hidden="true" className="hidden text-[#5a5f66] sm:inline">:</span>
            <DecryptedText
              key={activeChapter}
              text={`~/${chapterLabels[activeChapter].toLowerCase()}`}
              animateOn="view"
              sequential
              speed={30}
              maxIterations={6}
              className="text-[10px] font-bold text-[#8a8f98]"
              encryptedClassName="text-[#3a3f47]"
              parentClassName="hidden sm:inline-block"
            />
          </a>
        </Magnet>

        <div className="flex items-center gap-3 md:gap-5">
          <nav aria-label="主导航" className="flex items-center gap-3 text-xs font-bold md:gap-5">
            {chapterLinks.map((chapter) => (
              <Magnet key={chapter.id} disabled={reducedMotion} padding={20} magnetStrength={4}>
                <a href={`#${chapter.id}`} className="text-[#8a8f98] transition-colors hover:text-[#33ff66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]">
                  ~/{chapter.label}
                </a>
              </Magnet>
            ))}
          </nav>
          <span aria-hidden="true" className="hidden h-4 w-px bg-[#2a2d33] sm:block" />
          <button
            type="button"
            data-cstd-motion-toggle
            aria-pressed={!reducedMotion}
            aria-label={reducedMotion ? "开启增强动效" : "关闭增强动效"}
            onClick={toggleMotionMode}
            className="group relative flex h-8 items-center justify-center rounded-sm border border-[#3a3f47] px-2 font-mono text-[10px] font-bold text-[#8a8f98] transition-colors hover:border-[#33ff66] hover:text-[#33ff66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]"
          >
            {reducedMotion ? "MOTION: OFF" : "MOTION: ON"}
            <span role="tooltip" className="pointer-events-none absolute right-0 top-10 hidden whitespace-nowrap rounded-sm border border-[#2a2d33] bg-[#14161a] px-3 py-2 text-[10px] font-bold text-white group-hover:block group-focus-visible:block">
              {reducedMotion ? "FULL MOTION" : "CALM MOTION"}
            </span>
          </button>
        </div>
      </m.header>

      <ChapterRail activeChapter={activeChapter} />

      <section
        id="top"
        ref={heroRef}
        data-cstd-hero
        data-cstd-elastic-archive
        aria-labelledby="cstd-hero-title"
        className="relative z-10 flex min-h-[92svh] items-center overflow-hidden px-5 pb-16 pt-24 contain-paint md:px-10 md:pb-20 lg:px-16"
      >
        <Suspense fallback={null}>
          <LazyHeroOrbit items={heroOrbitItems} disabled={reducedMotion || !enhancementsReady} />
        </Suspense>

        <m.div
          className="mx-auto w-full max-w-[1540px]"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* 交互终端窗口 */}
          <div className="relative overflow-hidden rounded-lg border border-[#2a2d33] bg-[#0b0c0e]/80 shadow-[0_40px_120px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-300 focus-within:border-[#33ff66]/50 focus-within:shadow-[0_0_0_1px_rgba(51,255,102,0.25),0_0_60px_rgba(51,255,102,0.15),0_40px_120px_rgba(0,0,0,0.6)]">
            <TerminalBar
              title={`cstd@custard.top: ${termPath}`}
              right={
                <span className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTerminalMinimized((current) => !current)}
                    aria-label={terminalMinimized ? "展开终端窗口" : "最小化终端窗口"}
                    className="flex h-10 w-10 items-center justify-center rounded border border-[#2a2d33] font-mono text-xs font-bold leading-none text-[#8a8f98] transition-colors hover:border-[#33ff66]/50 hover:text-[#33ff66] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33ff66]"
                  >
                    {terminalMinimized ? "+" : "–"}
                  </button>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      {!reducedMotion && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#33ff66] opacity-60" />
                      )}
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#33ff66]" />
                    </span>
                    INTERACTIVE
                  </span>
                </span>
              }
            />
            <m.div
              initial={false}
              animate={{ height: terminalMinimized ? 0 : "auto", opacity: terminalMinimized ? 0 : 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { height: { type: "spring", stiffness: 260, damping: 30 }, opacity: { duration: 0.22 } }
              }
              className="overflow-hidden"
            >
            <div className="px-5 py-5 md:px-8 md:py-6">
              <TerminalCommand
                bootLines={heroBootLines}
                disabled={reducedMotion || !enhancementsReady}
                onCommand={handleTerminalCommand}
                placeholder="输入 help 回车，或 Tab 补全…"
                height="min(230px, 24svh)"
                completions={{
                  cd: ["~", "/", "systems", "work", "projects", "path"],
                  open: [...proofProjects, ...liveProjects].map((project) => project.id),
                }}
              />
            </div>
            </m.div>
            {/* CRT 扫描线（克制） */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div
                className="h-24 w-full bg-[#33ff66] opacity-[0.05]"
                style={{
                  animation: reducedMotion ? undefined : "cstd-scanline 9s linear infinite",
                }}
              />
            </div>
          </div>

          {/* CSTD 巨型标题 + 呼吸辉光 */}
          <div className="relative mt-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-10 -top-12 bottom-0"
              style={{
                background:
                  "radial-gradient(50% 60% at 50% 40%, rgba(51,255,102,0.16), transparent 70%)",
                animation: reducedMotion ? undefined : "cstd-glow-breathe 4.5s ease-in-out infinite",
              }}
            />
            <h1
              id="cstd-hero-title"
              data-cstd-hero-depth
              className="relative text-[4.5rem] font-black leading-[0.8] tracking-[-0.02em] text-[#33ff66] md:text-[7rem] xl:text-[10rem] 2xl:text-[12rem]"
              style={{ textShadow: "0 0 40px rgba(51,255,102,0.35), 0 0 120px rgba(51,255,102,0.15)" }}
            >
              <LetterReveal
                disabled={reducedMotion || !enhancementsReady}
                staggerDelay={85}
                duration={1050}
                delay={160}
                fromY={115}
                fromRotate={7}
                fromSkew={9}
              >
                CSTD
              </LetterReveal>
            </h1>
          </div>

          <div className="mt-6 grid items-end gap-6 border-t border-[#2a2d33] pt-6 font-mono md:grid-cols-[1fr_auto]">
                <div className="max-w-2xl">
                  <p className="text-lg font-bold leading-tight text-[#d7d7d7] md:text-2xl">
                    <span className="text-[#33ff66]">$ </span>cat about.md
                    <br />
                    <ShinyText
                      text="把产品、数据、AI 和研究，折进一条会呼吸的系统。"
                      disabled={reducedMotion}
                      speed={3.4}
                      delay={0.8}
                      color="rgba(215,215,215,0.95)"
                      shineColor="#33ff66"
                    />
                  </p>
                  <p className="mt-4 max-w-lg text-sm leading-6 text-[#8a8f98] md:text-base">真实项目持续运行，新的技术继续进入镜头。这里不是作品目录，而是一套正在演化的个人方法。</p>
                </div>
                <Magnet disabled={reducedMotion} padding={42} magnetStrength={3}>
                  <a
                    href="#systems"
                    aria-label="进入系统章节"
                    className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#33ff66]/60 bg-[#33ff66]/[0.08] px-5 font-mono text-sm font-bold text-[#33ff66] transition-colors hover:bg-[#33ff66] hover:text-[#0b0c0e] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]"
                  >
                    cd systems/
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </a>
                </Magnet>
              </div>
        </m.div>
      </section>

      {/* 章节级 code-split：骨架占位防 CLS，chunk 毫秒级加载 */}
      <Suspense fallback={<div className="relative z-20 h-[8svh] min-h-16 border-y border-[#2a2d33] bg-[#0b0c0e]" />}>
        <LazySignalStrip reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={<div className="relative z-10 min-h-[80svh] bg-[#0b0c0e]" />}>
        <LazySystemsChapter activeSystemId={activeSystemId} setActiveSystemId={setActiveSystemId} reducedMotion={reducedMotion} />
      </Suspense>

      {/* 终端虚线分隔 */}
      <div aria-hidden="true" className="relative z-20 flex items-center gap-4 bg-[#0b0c0e] px-5 py-6 font-mono text-[10px] font-bold tracking-[0.2em] text-[#3a3f47] md:px-10 lg:px-16">
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
        <Suspense fallback={<span>~/work</span>}>
          <LazyGlitchFx disabled={reducedMotion} interval={3400} className="text-[#5a5f66]">
            ~/work
          </LazyGlitchFx>
        </Suspense>
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
      </div>

      <Suspense fallback={<div className="relative z-20 min-h-[60svh] bg-[#0e1013]" />}>
        <LazySelectedWork reducedMotion={reducedMotion} />
      </Suspense>

      {/* 终端虚线分隔 */}
      <div aria-hidden="true" className="relative z-20 flex items-center gap-4 bg-[#0b0c0e] px-5 py-6 font-mono text-[10px] font-bold tracking-[0.2em] text-[#3a3f47] md:px-10 lg:px-16">
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
        <Suspense fallback={<span>~/path</span>}>
          <LazyGlitchFx disabled={reducedMotion} interval={3800} className="text-[#5a5f66]">
            ~/path
          </LazyGlitchFx>
        </Suspense>
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
      </div>

      <Suspense fallback={<div className="relative z-10 min-h-[60svh] bg-[#0b0c0e]" />}>
        <LazyResearchPath reducedMotion={reducedMotion} />
      </Suspense>

      <footer id="cstd-footer" className="relative z-20 border-t border-[#2a2d33] bg-[#0b0c0e] px-5 py-20 font-mono text-white [content-visibility:auto] [contain-intrinsic-size:auto_560px] md:px-10 lg:px-16">
        {/* 终端风锯齿波 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-6 overflow-hidden opacity-50"
        >
          <svg
            className="absolute h-full w-[200%]"
            style={{ animation: reducedMotion ? undefined : "cstd-wave-slide 16s linear infinite" }}
            preserveAspectRatio="none"
            viewBox="0 0 200 24"
          >
            <path
              d="M0 20 L10 4 L20 20 L30 4 L40 20 L50 4 L60 20 L70 4 L80 20 L90 4 L100 20 L110 4 L120 20 L130 4 L140 20 L150 4 L160 20 L170 4 L180 20 L190 4 L200 20"
              fill="none"
              stroke="#33ff66"
              strokeWidth="1.5"
              strokeOpacity="0.55"
            />
          </svg>
        </div>
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex items-center gap-6">
            <span className="flex h-16 w-16 flex-none items-center justify-center rounded-sm border border-[#33ff66] bg-[#33ff66]/10 text-xl font-black text-[#33ff66] shadow-[0_0_30px_rgba(51,255,102,0.25)] md:h-20 md:w-20 md:text-2xl">
              CS
            </span>
            <div>
              <ShinyText
                text="cstd@custard.top"
                disabled={reducedMotion}
                speed={4.2}
                delay={1.2}
                className="text-3xl font-black tracking-[0] md:text-4xl"
                color="rgba(215,215,215,0.9)"
                shineColor="#33ff66"
              />
              <p className="mt-2 text-sm text-[#8a8f98]">奶黄包个人技术工作室 / Sydney · Nanjing · The web</p>
            </div>
          </div>
          <div className="text-left font-mono text-xs font-bold text-[#5a5f66] md:text-right">
            <p>-- EOF --</p>
            <p className="mt-2 flex items-center gap-2 text-[#33ff66] md:justify-end">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-sm bg-[#33ff66] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-sm bg-[#33ff66]" />
              </span>
              $ exit — 2022—2026 · STILL IN MOTION
            </p>
            <div className="mt-6 md:flex md:justify-end">
              <Suspense fallback={null}>
                <LazyConfettiBurst disabled={reducedMotion} />
              </Suspense>
            </div>
          </div>
        </div>
      </footer>
      </ClickSpark>
      </main>
    </LazyMotion>
  );
}
