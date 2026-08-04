"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Crosshair, Sparkles } from "lucide-react";
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
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
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
import { CreamDivider } from "./cream-divider";
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

const PersonalImmersiveScene = dynamic(
  () => import("./immersive-scene").then((module) => module.PersonalImmersiveScene),
  { ssr: false },
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

// Hero 浮动胶囊：位置（视口 %）、视差深度、漂浮参数
const heroOrbitItems: OrbitItem[] = [
  { label: "PRODUCT ENGINEERING", left: 7, top: 24, depth: 1.5, float: 10, speed: 1.1, phase: 0 },
  { label: "AI CREATION", left: 84, top: 18, depth: 1.1, float: 13, speed: 0.9, phase: 2.1 },
  { label: "DATA SYSTEMS", left: 90, top: 58, depth: 1.7, float: 9, speed: 1.3, phase: 4.2 },
  { label: "EDGE DELIVERY", left: 4, top: 62, depth: 0.9, float: 12, speed: 0.75, phase: 1.2 },
  { label: "RESEARCH MODELS", left: 46, top: 12, depth: 1.3, float: 11, speed: 1.05, phase: 3.3 },
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
    text: "text-[#f4b72f]",
    background: "bg-[#f4b72f]",
    border: "border-[#f4b72f]",
    glow: "shadow-[0_0_50px_rgba(244,183,47,0.35)]",
    code: "AMBER / ORIGIN",
  },
  {
    text: "text-[#8ec9f0]",
    background: "bg-[#8ec9f0]",
    border: "border-[#8ec9f0]",
    glow: "shadow-[0_0_50px_rgba(142,201,240,0.3)]",
    code: "COBALT / SIGNAL",
  },
  {
    text: "text-[#f08a6d]",
    background: "bg-[#f08a6d]",
    border: "border-[#f08a6d]",
    glow: "shadow-[0_0_50px_rgba(240,138,109,0.3)]",
    code: "CORAL / STRUCTURE",
  },
  {
    text: "text-[#bfe0c8]",
    background: "bg-[#bfe0c8]",
    border: "border-[#bfe0c8]",
    glow: "shadow-[0_0_50px_rgba(191,224,200,0.28)]",
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

// 统一 spring 物理参数：丝滑弹性
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

function SignalStrip({ reducedMotion }: { reducedMotion: boolean }) {
  const content = [...heroSignals, ...heroSignals];

  return (
    <div
      data-cstd-signal-strip
      className="relative z-20 h-[8svh] min-h-16 overflow-hidden rounded-t-[2.5rem] border-y border-black/20 bg-[#f4b72f] text-[#2a1d0e] shadow-[0_-20px_60px_rgba(244,183,47,0.25)]"
    >
      {[0, 1].map((track) => (
        <m.div
          key={track}
          data-cstd-signal-track={track}
          className={`flex h-1/2 w-max items-center border-black ${track === 0 ? "border-b" : "bg-[#3d7fc0] text-white"}`}
          animate={reducedMotion ? undefined : { x: track === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: track === 0 ? 24 : 31, ease: "linear", repeat: Infinity }}
        >
          {content.map((signal, index) => (
            <span key={`${track}-${signal}-${index}`} className="flex items-center whitespace-nowrap px-5 text-xs font-black tracking-[0] md:text-sm">
              <span className="rounded-full bg-black/10 px-3 py-1 md:px-4 md:py-1.5">{signal}</span>
              <span aria-hidden="true" className="mx-4 h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            </span>
          ))}
        </m.div>
      ))}
    </div>
  );
}

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
      className="relative z-10 min-h-[150svh] bg-[#171208] text-[#fbf1df] lg:min-h-[185svh]"
    >
      <div className="sticky top-0 flex min-h-svh items-center px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1540px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-12 lg:min-h-[66svh]">
            <div>
              <p className="text-xs font-bold text-[#f4b72f]">01 / SYSTEM FIELD</p>
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
              spotlightColor="rgba(255, 217, 122, 0.18)"
              size={680}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-md md:p-9"
            >
              <m.div
                key={activeSystem.id}
                data-cstd-system-visual={activeSystem.id}
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={springSoft}
                className="max-w-xl rounded-[1.4rem] border-l-[3px] border-[#f4b72f] bg-gradient-to-r from-[#f4b72f]/[0.07] to-transparent pl-6"
              >
                <p className="text-lg leading-8 text-white/85 md:text-xl">{activeSystem.summary}</p>
                <p className="mt-4 text-sm leading-6 text-white/55">{activeSystem.evidence}</p>
                <p className="mt-6 text-xs font-bold leading-6 text-[#f4b72f]">
                  {activeSystem.stack.join("  /  ")}
                </p>
              </m.div>
            </SpotlightCard>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
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
                    "group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f] md:grid-cols-[3rem_1fr_auto] md:gap-4 md:px-6 md:py-5",
                    isActive
                      ? "border-[#f4b72f]/40 bg-[#f4b72f]/[0.09] shadow-[0_10px_40px_rgba(244,183,47,0.14)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
                  )}
                  animate={{ x: isActive ? 14 : 0 }}
                  transition={springSnappy}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current md:h-9 md:w-9">
                    <span className={clsx("text-[10px] font-black md:text-xs", isActive ? "text-[#f4b72f]" : "text-white/35")}>
                      0{index + 1}
                    </span>
                  </span>
                  <span className={clsx("text-xl font-black leading-none tracking-[0] transition-colors duration-300 md:text-3xl xl:text-4xl", isActive ? "text-white" : "text-white/45 group-hover:text-white/80")}>
                    {system.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "h-2 w-2 rounded-full transition-all duration-500",
                      isActive ? "bg-[#f4b72f] shadow-[0_0_14px_rgba(244,183,47,0.9)]" : "bg-white/20",
                    )}
                  />
                </m.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofChapter({ proof, index, reducedMotion }: { proof: CstdProof; index: number; reducedMotion: boolean }) {
  const project = proofProjects.find((candidate) => candidate.id === proof.projectId);
  if (!project?.preview) return null;
  const targetProps = getCstdLinkTargetProps(project.href);

  return (
    <article
      data-cstd-proof={proof.projectId}
      className="group relative grid min-h-svh items-center overflow-hidden px-5 py-24 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-16"
    >
      {/* 超大编号背景字 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-10 select-none text-[11rem] font-black leading-none text-[#f4b72f]/[0.07] md:text-[18rem]"
      >
        0{index + 1}
      </span>

      <div className="relative z-10 max-w-2xl self-center lg:pr-8">
        <div className="flex items-center gap-5 text-xs font-black text-black/50">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a1d0e] text-[#ffd97a]">0{index + 1}</span>
          <span aria-hidden="true" className="h-px w-14 bg-black/30" />
          <span>{proof.lens.toUpperCase()}</span>
        </div>
        <h3 className="mt-8 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">{project.title}</h3>
        <p className="mt-8 max-w-xl text-2xl font-bold leading-tight md:text-3xl">{proof.statement}</p>
        <p className="mt-5 max-w-lg text-base leading-7 text-black/65 md:text-lg">{proof.detail}</p>
        <a
          href={project.href}
          {...targetProps}
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#2a1d0e] px-6 py-3 text-sm font-black text-[#ffd97a] shadow-[0_14px_36px_rgba(42,29,14,0.3)] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3d7fc0]"
        >
          {project.action}
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
          className="relative aspect-[16/11] min-h-0 overflow-hidden rounded-[2rem] border border-white/40 bg-black shadow-[0_40px_100px_rgba(42,29,14,0.35)] lg:mt-0"
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
          <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border-[10px] border-[#fdf3e0]/15" />
          <figcaption className="absolute bottom-5 left-5 rounded-full bg-[#2a1d0e]/85 px-4 py-2 text-[10px] font-black text-[#ffd97a] backdrop-blur-sm">
            LIVE / {project.kicker.toUpperCase()}
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
      className="relative z-20 bg-[#fdf3e0] text-[#2a1d0e]"
    >
      {/* 奶油暖光：极淡琥珀径向光晕，非霓虹 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[#f4b72f]/[0.1] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[30rem] rounded-full bg-[#f08a6d]/[0.06] blur-[110px]" />
      </div>

      <header className="relative border-b border-black/20 px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-14 lg:pt-32">
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black text-[#3d7fc0]">02 / SELECTED WORK</p>
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
          <p className="max-w-md text-base leading-7 text-black/58">三个项目，分别验证资料结构、研究过程和业务边界。画面可以夸张，结果必须能用。</p>
        </div>
      </header>

      <div data-cstd-proof-reel className="relative">
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="relative border-t border-black/20 px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-4 md:grid-cols-2 md:gap-6">
          {liveProjects.map((project) => {
            const targetProps = getCstdLinkTargetProps(project.href);
            return (
              <div
                key={project.id}
                data-cstd-live-object={project.id}
                className="group rounded-3xl border border-black/15 bg-white/70 px-6 py-7 shadow-[0_18px_50px_rgba(42,29,14,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_26px_60px_rgba(42,29,14,0.2)]"
              >
                <p className="text-[10px] font-black tracking-[0.12em] text-black/45">LIVE OBJECT / {project.kicker.toUpperCase()}</p>
                <a
                  href={project.href}
                  {...targetProps}
                  className="mt-4 flex items-center justify-between gap-4 text-2xl font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3d7fc0] md:text-3xl"
                >
                  {project.title}
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f4b72f]/20 text-[#2a1d0e] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#f4b72f]">
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
        "group relative grid min-h-svh w-full items-center gap-12 overflow-hidden px-5 py-28 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-16 lg:py-32",
        index % 2 === 1 && "lg:grid-cols-[1.18fr_0.82fr]",
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={asset.src}
          alt=""
          fill
          sizes="100vw"
          className="scale-125 object-cover opacity-[0.08] saturate-50 transition duration-1000 group-hover:scale-[1.29] group-hover:opacity-[0.13] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-[#171208]/80" />
        <span className="absolute -bottom-12 right-2 text-[13rem] font-black leading-none text-white/[0.035] md:text-[20rem] lg:-right-5 lg:text-[27rem]">
          {entry.year.slice(2)}
        </span>
        <span className="absolute inset-x-0 top-[42%] h-px bg-white/10" />
      </div>

      {/* 年份发光节点 */}
      <span
        aria-hidden="true"
        className={clsx(
          "absolute left-3 top-1/2 z-30 hidden h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-500 lg:block",
          active ? `${accent.background} ${accent.glow} scale-125` : "bg-white/25",
        )}
      />

      <m.div
        className={clsx(
          "relative z-20 min-w-0 max-w-2xl",
          index % 2 === 1 && "lg:order-2 lg:pl-8",
        )}
        initial={reducedMotion ? false : { opacity: 0, y: 48 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ amount: 0.28, once: true }}
        transition={springSoft}
      >
        <div className="flex items-center gap-4 text-[10px] font-black text-white/48 md:text-xs">
          <span className={clsx("flex h-6 w-6 items-center justify-center rounded-full border border-current", accent.text)}>0{index + 1}</span>
          <span aria-hidden="true" className={clsx("h-px w-12", accent.background)} />
          <span>{entry.focus}</span>
        </div>
        <p className={clsx("mt-8 text-8xl font-black leading-none md:text-9xl", accent.text)}>
          <CountUp disabled={reducedMotion} value={Number(entry.year)} duration={1150} threshold={0.3} />
        </p>
        <h3 className="mt-6 text-balance text-4xl font-black leading-[0.96] tracking-[0] md:text-5xl xl:text-6xl">{entry.title}</h3>
        <p className="mt-7 max-w-lg text-balance text-base leading-8 text-white/66">{entry.note}</p>
        <div className="mt-10 flex items-center gap-4 text-[10px] font-black text-white/38">
          <span>{accent.code}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/18" />
          <span>{String(index + 1).padStart(2, "0")} / {String(cstdLearningPath.length).padStart(2, "0")}</span>
        </div>
      </m.div>

      <m.figure
        className={clsx(
          "relative z-10 aspect-[4/5] max-h-[72svh] min-h-0 overflow-hidden rounded-[2rem] border bg-black",
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
        <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border-[10px] border-white/10" />
        <figcaption className={clsx("absolute bottom-4 right-4 rounded-full px-4 py-2 text-[10px] font-black text-black", accent.background)}>
          CSTD ARCHIVE / {entry.year}
        </figcaption>
      </m.figure>

      {index === lastIndex ? (
        <a
          href="#cstd-footer"
          aria-label="继续到页脚"
          className="absolute bottom-8 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/45 text-white transition-colors hover:border-[#f4b72f] hover:bg-[#f4b72f] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f] md:right-10 lg:right-16"
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
      className="relative z-10 bg-[#171208] text-[#fbf1df]"
    >
      <TracingProgress disabled={reducedMotion} color="#f4b72f" className="left-4 md:left-8" />
      <div data-cstd-path-stage className="relative">
        <header className="relative z-30 border-b border-white/15 px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-14 lg:pt-32">
          <div className="flex items-end justify-between gap-10">
          <div>
            <p className="text-xs font-black text-[#f4b72f]">03 / RESEARCH PATH</p>
              <h2 id="path-heading" className="mt-3 max-w-5xl text-4xl font-black leading-[0.96] tracking-[0] md:text-6xl">
                <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={26} duration={800} fromY={90} fromRotate={3}>
                  学习不是履历，是镜头继续向前。
                </LetterReveal>
              </h2>
            </div>
            <div className="hidden items-end gap-5 lg:flex">
              <span className="pb-2 text-[10px] font-black text-white/38">0{activeIndex + 1} / 0{cstdLearningPath.length}</span>
              <span className="text-7xl font-black leading-none text-white/12">{activeYear}</span>
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/12">
            <m.div
              data-cstd-path-progress
              className="h-px origin-left"
              style={{
                background: "linear-gradient(90deg, #f4b72f, #ffd97a)",
                boxShadow: "0 0 10px rgba(244,183,47,0.6)",
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

function ChapterRail({ activeChapter }: { activeChapter: ChapterId }) {
  return (
    <nav
      aria-label="章节导航"
      className={clsx(
        "fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 transition-opacity duration-500 xl:flex",
        activeChapter === "path" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {chapterLinks.map((chapter, index) => {
        const active = activeChapter === chapter.id;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={chapter.label}
            className="group flex items-center gap-3 text-[10px] font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]"
          >
            <span
              className={clsx(
                "rounded-full border px-2.5 py-1 transition-all duration-500",
                active
                  ? "border-[#f4b72f] bg-[#f4b72f] text-[#2a1d0e] shadow-[0_0_16px_rgba(244,183,47,0.5)]"
                  : "border-white/30 text-white/45 group-hover:border-white/60 group-hover:text-white",
              )}
            >
              0{index + 1}
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "h-px transition-all duration-500",
                active ? "w-6 bg-[#f4b72f]" : "w-3 bg-white/40 group-hover:w-5",
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

  // Hero 滚动视差：内容上飘 + 淡出
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
        className="relative isolate overflow-clip bg-[#171208] font-sans text-[#fbf1df]"
      >
      <ClickSpark
        disabled={reducedMotion}
        sparkColor="#ffd97a"
        sparkCount={10}
        sparkRadius={20}
        sparkSize={8}
      >
      <a href="#systems" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black">
        跳到主要内容
      </a>

      <div aria-hidden="true" className="fixed inset-0 z-0 bg-[#171208]">
        <Image
          src="/cstd-world/cstd-kinetic-studio-v2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/26" />
        {enhancementsReady ? <PersonalImmersiveScene {...sceneProps} /> : null}
      </div>

      <NoiseOverlay
        staticMode={reducedMotion}
        opacity={0.07}
        blendMode="overlay"
        className="fixed inset-0 z-[64]"
      />

      <m.div
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left"
        style={{
          scaleX: pageProgress,
          background: "linear-gradient(90deg, #f4b72f 0%, #ffd97a 42%, #8ec9f0 100%)",
          boxShadow: "0 0 14px rgba(244,183,47,0.5)",
        }}
      />

      {/* 内十字光标 */}
      <m.div
        aria-hidden="true"
        data-cstd-pointer-field
        className={clsx(
          "pointer-events-none fixed left-0 top-0 z-[80] hidden h-9 w-9 items-center justify-center border border-white/65 text-[#f4b72f] mix-blend-difference lg:flex",
          reducedMotion && "lg:!hidden",
        )}
        style={{ x: smoothCursorX, y: smoothCursorY }}
      >
        <Crosshair className="h-4 w-4" strokeWidth={1.6} />
      </m.div>

      {/* 外圈柔光光环：慢弹簧跟随，hover 交互元素时放大 */}
      <m.div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none fixed left-0 top-0 z-[79] hidden h-16 w-16 rounded-full border border-[#ffd97a]/30 lg:block",
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
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/15 bg-[#171208]/70 px-5 text-white backdrop-blur-xl md:px-10 lg:px-12"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={springSoft}
      >
        <Magnet disabled={reducedMotion} padding={24} magnetStrength={4}>
          <a href="#top" className="flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4b72f] text-xs font-black text-black shadow-[0_0_20px_rgba(244,183,47,0.5)]">CS</span>
            <span className="text-sm font-black">CSTD</span>
            <span aria-hidden="true" className="h-4 w-px bg-white/30" />
            <DecryptedText
              key={activeChapter}
              text={chapterLabels[activeChapter]}
              animateOn="view"
              sequential
              speed={30}
              maxIterations={6}
              className="text-[10px] font-bold text-white/90"
              encryptedClassName="text-white/30"
              parentClassName="hidden sm:inline-block"
            />
          </a>
        </Magnet>

        <div className="flex items-center gap-4 md:gap-7">
          <nav aria-label="主导航" className="flex items-center gap-5 text-xs font-black md:gap-8">
            {chapterLinks.map((chapter) => (
              <Magnet key={chapter.id} disabled={reducedMotion} padding={20} magnetStrength={4}>
                <a href={`#${chapter.id}`} className="text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]">
                  {chapter.label}
                </a>
              </Magnet>
            ))}
          </nav>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/25 sm:block" />
          <button
            type="button"
            data-cstd-motion-toggle
            aria-pressed={!reducedMotion}
            aria-label={reducedMotion ? "开启增强动效" : "关闭增强动效"}
            onClick={toggleMotionMode}
            className="group relative hidden h-8 w-8 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-[#f4b72f] hover:text-[#f4b72f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f] sm:flex"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            <span role="tooltip" className="pointer-events-none absolute right-0 top-10 hidden whitespace-nowrap rounded-lg border border-white/20 bg-[#171208] px-3 py-2 text-[10px] font-black text-white group-hover:block group-focus-visible:block">
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
        className="relative z-10 flex h-[92svh] min-h-[680px] items-center overflow-hidden px-5 pb-16 pt-24 md:px-10 md:pb-20 lg:px-16"
      >
        <HeroOrbit items={heroOrbitItems} disabled={reducedMotion || !enhancementsReady} />

        <m.div
          className="mx-auto w-full max-w-[1540px]"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <m.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.12 }}
            className="mb-5 text-xs font-black text-[#f4b72f]"
          >
            奶黄包的个人技术工作室 / CREATIVE SYSTEMS LAB
          </m.p>
          <h1
            id="cstd-hero-title"
            data-cstd-hero-depth
            className="text-[7rem] font-black leading-[0.72] tracking-[0] text-white mix-blend-difference md:text-[11rem] xl:text-[16rem] 2xl:text-[20rem]"
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

          <div className="mt-8 grid items-end gap-8 border-t border-white/35 pt-6 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="text-2xl font-black leading-tight text-white md:text-4xl">
                把产品、数据、AI 和研究，
                <br className="hidden sm:block" />
                <ShinyText
                  text="折进一条会呼吸的系统。"
                  disabled={reducedMotion}
                  speed={3.4}
                  delay={0.8}
                  color="rgba(251,241,223,0.95)"
                  shineColor="#ffd97a"
                />
              </p>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/62 md:text-base">真实项目持续运行，新的技术继续进入镜头。这里不是作品目录，而是一套正在演化的个人方法。</p>
            </div>
            <Magnet disabled={reducedMotion} padding={42} magnetStrength={3}>
              <a
                href="#systems"
                aria-label="进入系统章节"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:border-[#f4b72f] hover:bg-[#f4b72f] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]"
              >
                <ArrowDown aria-hidden="true" className="h-5 w-5" />
              </a>
            </Magnet>
          </div>
        </m.div>
      </section>

      <SignalStrip reducedMotion={reducedMotion} />

      {/* 琥珀信号条 → 深色系统的弧形过渡 */}
      <CreamDivider fill="#171208" height={72} float={reducedMotion ? 0 : 4} disabled={reducedMotion} className="-mt-px z-20" />

      <SystemsChapter activeSystemId={activeSystemId} setActiveSystemId={setActiveSystemId} reducedMotion={reducedMotion} />

      {/* 深色 → 奶油区弧形过渡 */}
      <CreamDivider fill="#fdf3e0" height={88} flip float={reducedMotion ? 0 : 5} disabled={reducedMotion} className="z-20" />

      <SelectedWork reducedMotion={reducedMotion} />

      {/* 奶油区 → 深色区弧形过渡 */}
      <CreamDivider fill="#171208" height={88} float={reducedMotion ? 0 : 5} disabled={reducedMotion} className="z-20" />

      <ResearchPath reducedMotion={reducedMotion} />

      <footer id="cstd-footer" className="relative z-20 border-t border-white/15 bg-[#171208] px-5 py-20 text-white md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex items-center gap-6">
            <span className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-[#f4b72f] text-2xl font-black text-black shadow-[0_0_50px_rgba(244,183,47,0.4)] md:h-24 md:w-24 md:text-3xl">
              CS
            </span>
            <div>
              <ShinyText
                text="CSTD"
                disabled={reducedMotion}
                speed={4.2}
                delay={1.2}
                className="text-5xl font-black tracking-[0] md:text-6xl"
                color="rgba(251,241,223,0.88)"
                shineColor="#ffd97a"
              />
              <p className="mt-2 text-sm text-white/48">奶黄包个人技术工作室 / Sydney · Nanjing · The web</p>
            </div>
          </div>
          <div className="text-left text-xs font-bold text-white/45 md:text-right">
            <p>DESIGNED AND ENGINEERED AS A LIVING SYSTEM</p>
            <p className="mt-2 flex items-center gap-2 text-[#f4b72f] md:justify-end">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f4b72f] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f4b72f]" />
              </span>
              2022 — 2026 / STILL IN MOTION
            </p>
          </div>
        </div>
      </footer>
      </ClickSpark>
      </main>
    </LazyMotion>
  );
}
