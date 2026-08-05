"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { getCstdLinkTargetProps } from "../domain/link-target";
import { cstdProjects } from "../content/projects";
import {
  cstdLearningPath,
  cstdLiveObjectIds,
  cstdProofs,
  cstdSystems,
  getCstdProjectsById,
  type CstdLearningEntry,
  type CstdProof,
  type CstdSystem,
} from "../content/systems";
import { ClickSpark } from "./click-spark";
import { DecryptedText } from "./decrypted-text";
import { HeroOrbit, type OrbitItem } from "./hero-orbit";
import { Magnet } from "./magnet";
import { NoiseOverlay } from "./noise-overlay";
import { ShinyText } from "./shiny-text";
import { SpotlightCard } from "./spotlight-card";
import { TiltFrame } from "./tilt-frame";
import { TracingProgress } from "./tracing-progress";

// anime.js 驱动的文字特效走异步 chunk，保住初始 JS 预算
const LetterReveal = dynamic(
  () => import("./letter-reveal").then((module) => module.LetterReveal),
);
const CountUp = dynamic(() => import("./count-up").then((module) => module.CountUp));

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

const heroSignals = [
  "PRODUCT ENGINEERING",
  "AI CREATION",
  "DATA SYSTEMS",
  "EDGE DELIVERY",
  "RESEARCH MODELS",
] as const;

// Hero 浮动进程标签：位置（视口 %）、视差深度、漂浮参数
const heroOrbitItems: OrbitItem[] = [
  { label: "PROC 001 · PRODUCT ENGINEERING", left: 6, top: 22, depth: 1.5, float: 8, speed: 1.1, phase: 0 },
  { label: "PROC 002 · AI CREATION", left: 82, top: 16, depth: 1.1, float: 10, speed: 0.9, phase: 2.1 },
  { label: "PROC 003 · DATA SYSTEMS", left: 88, top: 58, depth: 1.7, float: 7, speed: 1.3, phase: 4.2 },
  { label: "PROC 004 · EDGE DELIVERY", left: 3, top: 64, depth: 0.9, float: 9, speed: 0.75, phase: 1.2 },
  { label: "PROC 005 · RESEARCH MODELS", left: 44, top: 10, depth: 1.3, float: 8, speed: 1.05, phase: 3.3 },
];

const learningAssets: Record<CstdLearningEntry["year"], { src: string; alt: string }> = {
  "2022": {
    src: "/cstd-archive/cstd-archive-notebook-v1.webp",
    alt: "带有计算草图的研究笔记材料",
  },
  "2024": {
    src: "/cstd-archive/cstd-archive-resin-circuit-v1.webp",
    alt: "透明树脂中的数据线路材料",
  },
  "2025": {
    src: "/cstd-archive/cstd-archive-cobalt-modules-v1.webp",
    alt: "钴蓝色模块化系统材料",
  },
  "2026": {
    src: "/cstd-archive/cstd-archive-studio-v1.webp",
    alt: "暖光中的个人技术工作室材料",
  },
};

const researchAccents = [
  {
    text: "text-[#33ff66]",
    background: "bg-[#33ff66]",
    border: "border-[#33ff66]",
    glow: "shadow-[0_0_20px_rgba(51,255,102,0.25)]",
    code: "AMBER / ORIGIN",
  },
  {
    text: "text-[#5b8dff]",
    background: "bg-[#5b8dff]",
    border: "border-[#5b8dff]",
    glow: "shadow-[0_0_20px_rgba(91,141,255,0.22)]",
    code: "COBALT / SIGNAL",
  },
  {
    text: "text-[#f4b72f]",
    background: "bg-[#f4b72f]",
    border: "border-[#f4b72f]",
    glow: "shadow-[0_0_20px_rgba(244,183,47,0.22)]",
    code: "CORAL / STRUCTURE",
  },
  {
    text: "text-[#7ee8a2]",
    background: "bg-[#7ee8a2]",
    border: "border-[#7ee8a2]",
    glow: "shadow-[0_0_20px_rgba(126,232,162,0.2)]",
    code: "MINT / CONTINUUM",
  },
] as const;

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
const springSnappy = { type: "spring", stiffness: 260, damping: 24, mass: 0.5 } as const;

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
function TerminalBar({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2a2d33] bg-[#14161a] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="text-[10px] font-bold tracking-[0.12em] text-[#8a8f98]">{title}</span>
      {right ? <span className="text-[10px] font-bold text-[#8a8f98]">{right}</span> : <span aria-hidden="true" className="w-12" />}
    </div>
  );
}

/** 终端提示符 */
function Prompt({ children, dim = false }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <span className={clsx("whitespace-pre-wrap", dim && "text-[#6b7280]")}>
      <span className="text-[#33ff66]">$ </span>
      {children}
    </span>
  );
}

function SignalStrip({ reducedMotion }: { reducedMotion: boolean }) {
  const content = [...heroSignals, ...heroSignals];

  return (
    <div
      data-cstd-signal-strip
      className="relative z-20 h-[8svh] min-h-16 overflow-hidden border-y border-[#2a2d33] bg-[#0b0c0e] text-[#33ff66] font-mono"
    >
      {[0, 1].map((track) => (
        <m.div
          key={track}
          data-cstd-signal-track={track}
          className={clsx(
            "flex h-1/2 w-max items-center border-[#2a2d33]",
            track === 0 ? "border-b" : "bg-[#101214] text-[#5b8dff]",
          )}
          animate={reducedMotion ? undefined : { x: track === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: track === 0 ? 24 : 31, ease: "linear", repeat: Infinity }}
        >
          {content.map((signal, index) => (
            <span key={`${track}-${signal}-${index}`} className="flex items-center whitespace-nowrap px-4 text-[10px] font-bold tracking-[0.08em] md:text-xs">
              <span className="rounded-sm border border-current/40 bg-current/[0.07] px-2 py-0.5">[{track === 0 ? "OK" : "LOG"}] {signal}</span>
              <span aria-hidden="true" className="mx-3 text-current/40">▸</span>
            </span>
          ))}
        </m.div>
      ))}
    </div>
  );
}

const MemoizedSignalStrip = memo(SignalStrip);

function SystemsChapter({
  activeSystemId,
  setActiveSystemId,
  reducedMotion,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
  reducedMotion: boolean;
}) {
  const activeSystem = cstdSystems.find((system) => system.id === activeSystemId) ?? cstdSystems[0];

  return (
    <section
      id="systems"
      data-cstd-chapter="systems"
      aria-labelledby="systems-heading"
      className="relative z-10 min-h-[150svh] bg-[#0b0c0e] text-[#d7d7d7] contain-paint lg:min-h-[185svh]"
    >
      <div className="sticky top-0 flex min-h-svh items-center px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1540px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-12 lg:min-h-[66svh]">
            <div>
              <p className="font-mono text-xs font-bold text-[#33ff66]">$ ps aux | grep cstd ▍</p>
              <h2 id="systems-heading" className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[0] md:text-6xl xl:text-7xl">
                <span className="block">
                  <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={30} duration={820} fromY={90} fromRotate={3}>
                    五条能力轴，
                  </LetterReveal>
                </span>
                <span className="block">
                  <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={30} duration={820} delay={200} fromY={90} fromRotate={3}>
                    汇成一条流。
                  </LetterReveal>
                </span>
              </h2>
            </div>

            <SpotlightCard
              disabled={reducedMotion}
              spotlightColor="rgba(51, 255, 102, 0.1)"
              size={680}
              className="overflow-hidden rounded-lg border border-[#2a2d33] bg-[#101214] shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <TerminalBar title={`cstd@custard.top: ~/systems/${activeSystem.id}`} right="bash" />
              <m.div
                key={activeSystem.id}
                data-cstd-system-visual={activeSystem.id}
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={springSoft}
                className="max-w-xl p-6 font-mono md:p-8"
              >
                <Prompt dim>cat systems/{activeSystem.id}.md</Prompt>
                <p className="mt-3 text-base leading-7 text-[#d7d7d7] md:text-lg">{activeSystem.summary}</p>
                <p className="mt-3 text-sm leading-6 text-[#8a8f98]">{activeSystem.evidence}</p>
                <p className="mt-5 border-t border-[#2a2d33] pt-4 text-xs font-bold leading-6 text-[#33ff66]">
                  $ stack: {activeSystem.stack.join("  /  ")}
                </p>
              </m.div>
            </SpotlightCard>
          </div>

          <div className="flex flex-col gap-2 font-mono md:gap-3">
            <p className="px-1 pb-1 text-[10px] font-bold tracking-[0.14em] text-[#8a8f98]">PID  CPU%  STATUS  PROCESS</p>
            {cstdSystems.map((system, index) => {
              const isActive = system.id === activeSystem.id;
              return (
                <m.button
                  type="button"
                  key={system.id}
                  data-cstd-system={system.id}
                  data-cstd-system-active={isActive ? "true" : "false"}
                  onPointerEnter={() => setActiveSystemId(system.id)}
                  onFocus={() => setActiveSystemId(system.id)}
                  className={clsx(
                    "group grid w-full grid-cols-[1.4rem_1fr_auto] items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66] md:gap-4 md:px-5 md:py-4",
                    isActive
                      ? "border-[#33ff66]/50 bg-[#33ff66]/[0.06]"
                      : "border-[#2a2d33] bg-[#101214] hover:border-[#3a3f47] hover:bg-[#14161a]",
                  )}
                  animate={{ x: isActive ? 12 : 0 }}
                  transition={springSnappy}
                >
                  <span className={clsx("text-[10px] font-bold md:text-xs", isActive ? "text-[#33ff66]" : "text-[#6b7280]")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={clsx("text-base font-bold leading-none tracking-[0] md:text-xl xl:text-2xl", isActive ? "text-[#33ff66]" : "text-[#a8adb5] group-hover:text-[#d7d7d7]")}>
                    {system.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "text-[9px] font-bold tracking-widest md:text-[10px]",
                      isActive ? "text-[#33ff66]" : "text-[#5a5f66]",
                    )}
                  >
                    {isActive ? "[RUNNING]" : "[READY]"}
                  </span>
                </m.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const MemoizedSystemsChapter = memo(SystemsChapter);

function ProofChapter({ proof, index, reducedMotion }: { proof: CstdProof; index: number; reducedMotion: boolean }) {
  const project = proofProjects.find((candidate) => candidate.id === proof.projectId);
  if (!project?.preview) return null;
  const targetProps = getCstdLinkTargetProps(project.href);

  return (
    <article
      data-cstd-proof={proof.projectId}
      className="group relative grid min-h-svh items-center overflow-hidden px-5 py-24 contain-paint md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-16"
    >
      {/* 超大编号背景字 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-10 select-none font-mono text-[11rem] font-black leading-none text-[#33ff66]/[0.05] md:text-[18rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 max-w-2xl self-center font-mono lg:pr-8">
        <div className="flex items-center gap-4 text-xs font-bold text-[#8a8f98]">
          <span className="rounded-sm border border-[#2a2d33] bg-[#101214] px-2 py-1 text-[#33ff66]">
            [OK] 0{index + 1}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-[#2a2d33]" />
          <span>{proof.lens.toUpperCase()}</span>
        </div>
        <h3 className="mt-8 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">{project.title}</h3>
        <p className="mt-8 max-w-xl text-2xl font-bold leading-tight md:text-3xl">{proof.statement}</p>
        <p className="mt-5 max-w-lg text-base leading-7 text-[#8a8f98] md:text-lg">{proof.detail}</p>
        <a
          href={project.href}
          {...targetProps}
          className="mt-10 inline-flex items-center gap-3 rounded-md border border-[#33ff66]/60 bg-[#33ff66]/[0.08] px-5 py-3 font-mono text-sm font-bold text-[#33ff66] shadow-[0_0_24px_rgba(51,255,102,0.12)] transition-all duration-300 hover:bg-[#33ff66] hover:text-[#0b0c0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]"
        >
          $ open {project.action}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
        </a>
      </div>

      <TiltFrame
        disabled={reducedMotion}
        rotateAmplitude={5}
        scaleOnHover={1.02}
        className="mt-14 min-h-0 lg:mt-0"
      >
        <m.figure
          data-cstd-project-plane={proof.projectId}
          className="relative aspect-[16/11] min-h-0 overflow-hidden rounded-lg border border-[#2a2d33] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:mt-0"
          initial={{ clipPath: "polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)" }}
          whileHover={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <m.div
            className="absolute inset-[-2%]"
            whileHover={{ scale: 1.06, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={project.preview.src}
              alt={project.preview.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
              style={{ objectPosition: project.preview.position }}
            />
          </m.div>
          <div aria-hidden="true" className="absolute inset-0 rounded-lg border-[6px] border-[#0b0c0e]/20" />
          <figcaption className="absolute bottom-4 left-4 rounded-sm border border-[#33ff66]/50 bg-[#0b0c0e]/85 px-3 py-1.5 font-mono text-[10px] font-bold text-[#33ff66]">
            [LIVE] {project.kicker.toUpperCase()}
          </figcaption>
        </m.figure>
      </TiltFrame>
    </article>
  );
}

function SelectedWork({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="proof"
      data-cstd-chapter="proof"
      aria-labelledby="proof-heading"
      className="relative z-20 bg-[#0e1013] text-[#d7d7d7] contain-paint"
    >
      {/* 终端暗纹：极淡网格 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <header className="relative border-b border-[#2a2d33] px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-14 lg:pt-32">
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-black text-[#5b8dff]">$ ls ~/projects/ ▍</p>
            <h2 id="proof-heading" className="mt-5 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">
              <span className="block">
                <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={34} duration={860} fromY={95} fromRotate={3}>
                  不陈列全部，
                </LetterReveal>
              </span>
              <span className="block">
                <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={34} duration={860} delay={210} fromY={95} fromRotate={3}>
                  只放真实运行的证据。
                </LetterReveal>
              </span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-sm leading-7 text-[#8a8f98]">三个项目，分别验证资料结构、研究过程和业务边界。画面可以夸张，结果必须能用。</p>
        </div>
      </header>

      <div data-cstd-proof-reel className="relative">
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="relative border-t border-[#2a2d33] px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-3 font-mono md:grid-cols-2 md:gap-4">
          {liveProjects.map((project) => {
            const targetProps = getCstdLinkTargetProps(project.href);
            return (
              <div
                key={project.id}
                data-cstd-live-object={project.id}
                className="group rounded-lg border border-[#2a2d33] bg-[#101214] px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#33ff66]/40"
              >
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#5a5f66]">[LIVE OBJECT] {project.kicker.toUpperCase()}</p>
                <a
                  href={project.href}
                  {...targetProps}
                  className="mt-3 flex items-center justify-between gap-4 text-2xl font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66] md:text-3xl"
                >
                  {project.title}
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-[#33ff66]/40 text-[#33ff66] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#33ff66] group-hover:text-[#0b0c0e]">
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const MemoizedSelectedWork = memo(SelectedWork);

function ResearchPathPanel({
  entry,
  index,
  active,
  reducedMotion,
}: {
  entry: CstdLearningEntry;
  index: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const asset = learningAssets[entry.year];
  const accent = researchAccents[index];
  const lastIndex = cstdLearningPath.length - 1;

  return (
    <li
      data-cstd-learning-step={entry.year}
      data-cstd-learning-active={active ? "true" : "false"}
      className={clsx(
        "group relative grid min-h-svh w-full items-center gap-12 overflow-hidden px-5 py-28 contain-paint md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-16 lg:py-32",
        index % 2 === 1 && "lg:grid-cols-[1.18fr_0.82fr]",
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={asset.src}
          alt=""
          fill
          sizes="100vw"
          className="scale-125 object-cover opacity-[0.07] saturate-50 transition duration-1000 group-hover:scale-[1.29] group-hover:opacity-[0.12] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-[#0b0c0e]/85" />
        <span className="absolute -bottom-12 right-2 font-mono text-[13rem] font-black leading-none text-white/[0.03] md:text-[20rem] lg:-right-5 lg:text-[27rem]">
          {entry.year.slice(2)}
        </span>
        <span className="absolute inset-x-0 top-[42%] h-px bg-[#2a2d33]" />
      </div>

      {/* 年份发光节点（commit 点） */}
      <span
        aria-hidden="true"
        className={clsx(
          "absolute left-3 top-1/2 z-30 hidden h-3.5 w-3.5 -translate-y-1/2 rotate-45 transition-all duration-500 lg:block",
          active ? `${accent.background} ${accent.glow} scale-125` : "bg-[#3a3f47]",
        )}
      />

      <m.div
        className={clsx(
          "relative z-20 min-w-0 max-w-2xl font-mono",
          index % 2 === 1 && "lg:order-2 lg:pl-8",
        )}
        initial={reducedMotion ? false : { opacity: 0, y: 48 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ amount: 0.28, once: true }}
        transition={springSoft}
      >
        <div className="flex items-center gap-4 text-[10px] font-bold text-[#8a8f98] md:text-xs">
          <span className={clsx("rounded-sm border border-current px-2 py-0.5", accent.text)}>commit {String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden="true" className={clsx("h-px w-12", accent.background)} />
          <span>{entry.focus}</span>
        </div>
        <p className={clsx("mt-8 text-8xl font-black leading-none md:text-9xl", accent.text)}>
          <CountUp disabled={reducedMotion} value={Number(entry.year)} duration={1150} threshold={0.3} />
        </p>
        <h3 className="mt-6 text-balance text-4xl font-black leading-[0.96] tracking-[0] md:text-5xl xl:text-6xl">{entry.title}</h3>
        <p className="mt-7 max-w-lg text-balance text-base leading-8 text-[#a8adb5]">{entry.note}</p>
        <div className="mt-10 flex items-center gap-4 text-[10px] font-bold text-[#5a5f66]">
          <span>{accent.code}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[#2a2d33]" />
          <span>{String(index + 1).padStart(2, "0")} / {String(cstdLearningPath.length).padStart(2, "0")}</span>
        </div>
      </m.div>

      <m.figure
        className={clsx(
          "relative z-10 aspect-[4/5] max-h-[72svh] min-h-0 overflow-hidden rounded-lg border bg-black",
          accent.border,
          accent.glow,
          index % 2 === 1 && "lg:order-1",
        )}
        initial={reducedMotion ? false : { opacity: 0.5, y: 70, scale: 0.94 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ amount: 0.24, once: true }}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        transition={springSoft}
      >
        <m.div
          className="absolute inset-[-4%]"
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          transition={springSoft}
        >
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover saturate-[0.78] transition duration-700 group-hover:saturate-100"
          />
        </m.div>
        <div aria-hidden="true" className="absolute inset-0 rounded-lg border-[6px] border-white/10" />
        <figcaption className={clsx("absolute bottom-4 right-4 rounded-sm px-3 py-1.5 text-[10px] font-bold text-black", accent.background)}>
          [ARCHIVE] {entry.year}
        </figcaption>
      </m.figure>

      {index === lastIndex ? (
        <a
          href="#cstd-footer"
          aria-label="继续到页脚"
          className="absolute bottom-8 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-md border border-[#3a3f47] text-[#8a8f98] transition-colors hover:border-[#33ff66] hover:text-[#33ff66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66] md:right-10 lg:right-16"
        >
          <ArrowDown aria-hidden="true" className="h-5 w-5" />
        </a>
      ) : null}
    </li>
  );
}

function ResearchPath({ reducedMotion }: { reducedMotion: boolean }) {
  const pathRef = useRef<HTMLElement>(null);
  const [activeYear, setActiveYear] = useState<CstdLearningEntry["year"]>(cstdLearningPath[0].year);
  const activeIndex = cstdLearningPath.findIndex((entry) => entry.year === activeYear);

  useEffect(() => {
    const section = pathRef.current;
    if (!section) return;
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-cstd-learning-step]"));
    const observer = new IntersectionObserver(
      () => {
        const focusLine = window.innerHeight * 0.48;
        const closest = steps.reduce((winner, step) => {
          const rect = step.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height * 0.42 - focusLine);
          return distance < winner.distance ? { step, distance } : winner;
        }, { step: steps[0], distance: Number.POSITIVE_INFINITY });
        const year = closest.step?.dataset.cstdLearningStep as CstdLearningEntry["year"] | undefined;
        if (year) setActiveYear((current) => (current === year ? current : year));
      },
      { threshold: [0, 0.2, 0.5, 0.8] },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="path"
      ref={pathRef}
      data-cstd-chapter="path"
      data-cstd-research-state={activeYear}
      data-cstd-path-mode="vertical"
      data-cstd-path-continuous="true"
      aria-labelledby="path-heading"
      className="relative z-10 bg-[#0b0c0e] text-[#d7d7d7] contain-paint"
    >
      <TracingProgress disabled={reducedMotion} color="#33ff66" className="left-4 md:left-8" />
      <div data-cstd-path-stage className="relative">
        <header className="relative z-30 border-b border-[#2a2d33] px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-14 lg:pt-32">
          <div className="flex items-end justify-between gap-10">
            <div>
              <p className="font-mono text-xs font-black text-[#33ff66]">$ git log --oneline ▍</p>
              <h2 id="path-heading" className="mt-3 max-w-5xl text-4xl font-black leading-[0.96] tracking-[0] md:text-6xl">
                <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={26} duration={800} fromY={90} fromRotate={3}>
                  学习不是履历，是镜头继续向前。
                </LetterReveal>
              </h2>
            </div>
            <div className="hidden items-end gap-5 font-mono lg:flex">
              <span className="pb-2 text-[10px] font-bold text-[#5a5f66]">commit {String(activeIndex + 1).padStart(2, "0")}/{String(cstdLearningPath.length).padStart(2, "0")}</span>
              <span className="text-7xl font-black leading-none text-white/10">{activeYear}</span>
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#2a2d33]">
            <m.div
              data-cstd-path-progress
              className="h-px origin-left"
              style={{
                background: "linear-gradient(90deg, #33ff66, #7ee8a2)",
                boxShadow: "0 0 10px rgba(51,255,102,0.5)",
              }}
              animate={{ scaleX: (activeIndex + 1) / cstdLearningPath.length }}
              transition={springSnappy}
            />
          </div>
        </header>

        <ol className="flex w-full flex-col">
          {cstdLearningPath.map((entry, index) => {
            return (
              <ResearchPathPanel
                key={entry.year}
                entry={entry}
                index={index}
                active={entry.year === activeYear}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const MemoizedResearchPath = memo(ResearchPath);

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
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.35 });

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
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[#0b0c0e]/70" />
        {enhancementsReady ? <PersonalImmersiveScene {...sceneProps} /> : null}
      </div>

      <NoiseOverlay
        staticMode={reducedMotion}
        opacity={0.05}
        blendMode="normal"
        className="fixed inset-0 z-[64]"
      />

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
        className="relative z-10 flex h-[92svh] min-h-[680px] items-center overflow-hidden px-5 pb-16 pt-24 contain-paint md:px-10 md:pb-20 lg:px-16"
      >
        <HeroOrbit items={heroOrbitItems} disabled={reducedMotion || !enhancementsReady} />

        <m.div
          className="mx-auto w-full max-w-[1540px]"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* 终端大窗口 */}
          <div className="overflow-hidden rounded-lg border border-[#2a2d33] bg-[#0b0c0e]/80 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <TerminalBar title="cstd@custard.top: ~" right="zsh — 120×40" />
            <div className="px-6 py-8 md:px-10 md:py-10">
              <p className="font-mono text-xs leading-6 text-[#8a8f98] md:text-sm">
                <span className="text-[#33ff66]">$ </span>whoami
                <br />
                <span className="text-[#d7d7d7]">奶黄包 — product engineer / creative systems builder</span>
                <br />
                <span className="text-[#33ff66]">$ </span>uptime
                <br />
                <span className="text-[#d7d7d7]">up 4 years, building live products with product, data, AI and research.</span>
              </p>
              <h1
                id="cstd-hero-title"
                data-cstd-hero-depth
                className="mt-6 text-[4.5rem] font-black leading-[0.8] tracking-[-0.02em] text-[#33ff66] md:text-[8rem] xl:text-[11rem] 2xl:text-[13rem]"
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

              <div className="mt-8 grid items-end gap-6 border-t border-[#2a2d33] pt-6 font-mono md:grid-cols-[1fr_auto]">
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
                    className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#33ff66]/60 bg-[#33ff66]/[0.08] px-5 font-mono text-sm font-bold text-[#33ff66] transition-colors hover:bg-[#33ff66] hover:text-[#0b0c0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]"
                  >
                    cd systems/
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </a>
                </Magnet>
              </div>
            </div>
          </div>
        </m.div>
      </section>

      <MemoizedSignalStrip reducedMotion={reducedMotion} />

      <MemoizedSystemsChapter activeSystemId={activeSystemId} setActiveSystemId={setActiveSystemId} reducedMotion={reducedMotion} />

      {/* 终端虚线分隔 */}
      <div aria-hidden="true" className="relative z-20 flex items-center gap-4 bg-[#0b0c0e] px-5 py-6 font-mono text-[10px] font-bold tracking-[0.2em] text-[#3a3f47] md:px-10 lg:px-16">
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
        <span>~/work</span>
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
      </div>

      <MemoizedSelectedWork reducedMotion={reducedMotion} />

      {/* 终端虚线分隔 */}
      <div aria-hidden="true" className="relative z-20 flex items-center gap-4 bg-[#0b0c0e] px-5 py-6 font-mono text-[10px] font-bold tracking-[0.2em] text-[#3a3f47] md:px-10 lg:px-16">
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
        <span>~/path</span>
        <span className="flex-1 border-t border-dashed border-[#2a2d33]" />
      </div>

      <MemoizedResearchPath reducedMotion={reducedMotion} />

      <footer id="cstd-footer" className="relative z-20 border-t border-[#2a2d33] bg-[#0b0c0e] px-5 py-20 font-mono text-white md:px-10 lg:px-16">
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
          </div>
        </div>
      </footer>
      </ClickSpark>
      </main>
    </LazyMotion>
  );
}
