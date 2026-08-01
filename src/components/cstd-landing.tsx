"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Crosshair, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { getCstdLinkTargetProps } from "@/lib/cstd-link-target";
import { cstdProjects } from "@/lib/cstd-projects";
import {
  cstdLearningPath,
  cstdLiveObjectIds,
  cstdProofs,
  cstdSystems,
  getCstdProjectsById,
  type CstdLearningEntry,
  type CstdProof,
  type CstdSystem,
} from "@/lib/cstd-systems";

const CstdImmersiveScene = dynamic(
  () => import("@/components/cstd-immersive-scene").then((module) => module.CstdImmersiveScene),
  { ssr: false },
);

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
    code: "AMBER / ORIGIN",
  },
  {
    text: "text-[#75b8ee]",
    background: "bg-[#75b8ee]",
    border: "border-[#75b8ee]",
    code: "COBALT / SIGNAL",
  },
  {
    text: "text-[#ee7862]",
    background: "bg-[#ee7862]",
    border: "border-[#ee7862]",
    code: "CORAL / STRUCTURE",
  },
  {
    text: "text-[#b7d9c2]",
    background: "bg-[#b7d9c2]",
    border: "border-[#b7d9c2]",
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

function useWideViewport() {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isWide;
}

function SignalStrip({ reducedMotion }: { reducedMotion: boolean }) {
  const content = [...heroSignals, ...heroSignals];

  return (
    <div data-cstd-signal-strip className="relative z-20 h-[8svh] min-h-16 overflow-hidden border-y border-black bg-[#f4b72f] text-[#11130f]">
      {[0, 1].map((track) => (
        <motion.div
          key={track}
          data-cstd-signal-track={track}
          className={`flex h-1/2 w-max items-center border-black ${track === 0 ? "border-b" : "bg-[#2d6fae] text-white"}`}
          animate={reducedMotion ? undefined : { x: track === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: track === 0 ? 24 : 31, ease: "linear", repeat: Infinity }}
        >
          {content.map((signal, index) => (
            <span key={`${track}-${signal}-${index}`} className="flex items-center whitespace-nowrap px-6 text-xs font-black tracking-[0] md:text-sm">
              {signal}
              <span aria-hidden="true" className="ml-6 text-base">/</span>
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function SystemsChapter({
  activeSystemId,
  setActiveSystemId,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
}) {
  const activeSystem = cstdSystems.find((system) => system.id === activeSystemId) ?? cstdSystems[0];

  return (
    <section
      id="systems"
      data-cstd-chapter="systems"
      aria-labelledby="systems-heading"
      className="relative z-10 min-h-[150svh] border-b border-white/20 bg-[#090a08]/76 text-[#f4efe4] lg:min-h-[185svh]"
    >
      <div className="sticky top-0 flex min-h-svh items-center px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1540px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div className="flex flex-col justify-between gap-12 lg:min-h-[68svh]">
            <div>
              <p className="text-xs font-bold text-[#f4b72f]">01 / SYSTEM FIELD</p>
              <h2 id="systems-heading" className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[0] md:text-6xl xl:text-7xl">
                五条能力轴，
                <br />
                汇成一条流。
              </h2>
            </div>

            <motion.div
              key={activeSystem.id}
              data-cstd-system-visual={activeSystem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl border-l-2 border-[#f4b72f] pl-6"
            >
              <p className="text-lg leading-8 text-white/82 md:text-xl">{activeSystem.summary}</p>
              <p className="mt-4 text-sm leading-6 text-white/55">{activeSystem.evidence}</p>
              <p className="mt-6 text-xs font-bold leading-6 text-[#f4b72f]">
                {activeSystem.stack.join("  /  ")}
              </p>
            </motion.div>
          </div>

          <div className="border-t border-white/25">
            {cstdSystems.map((system, index) => {
              const isActive = system.id === activeSystem.id;
              return (
                <motion.button
                  type="button"
                  key={system.id}
                  data-cstd-system={system.id}
                  data-cstd-system-active={isActive ? "true" : "false"}
                  onPointerEnter={() => setActiveSystemId(system.id)}
                  onFocus={() => setActiveSystemId(system.id)}
                  className="group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-white/25 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f] md:grid-cols-[4rem_1fr_auto] md:py-7"
                  animate={{ x: isActive ? 18 : 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                >
                  <span className={`text-xs font-black ${isActive ? "text-[#f4b72f]" : "text-white/35"}`}>0{index + 1}</span>
                  <span className={`text-2xl font-black leading-none tracking-[0] transition-colors md:text-4xl xl:text-5xl ${isActive ? "text-white" : "text-white/45 group-hover:text-white/78"}`}>
                    {system.title}
                  </span>
                  <span aria-hidden="true" className={`h-px transition-all duration-500 ${isActive ? "w-16 bg-[#f4b72f]" : "w-5 bg-white/35"}`} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofChapter({ proof, index }: { proof: CstdProof; index: number }) {
  const project = proofProjects.find((candidate) => candidate.id === proof.projectId);
  if (!project?.preview) return null;
  const targetProps = getCstdLinkTargetProps(project.href);

  return (
    <article
      data-cstd-proof={proof.projectId}
      className="group relative grid min-h-svh items-center overflow-hidden border-b border-black/25 px-5 py-24 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-16"
    >
      <div className="relative z-10 max-w-2xl self-center lg:pr-8">
        <div className="flex items-center gap-5 text-xs font-black text-black/50">
          <span>0{index + 1}</span>
          <span aria-hidden="true" className="h-px w-16 bg-black/35" />
          <span>{proof.lens.toUpperCase()}</span>
        </div>
        <h3 className="mt-8 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">{project.title}</h3>
        <p className="mt-8 max-w-xl text-2xl font-bold leading-tight md:text-3xl">{proof.statement}</p>
        <p className="mt-5 max-w-lg text-base leading-7 text-black/65 md:text-lg">{proof.detail}</p>
        <a
          href={project.href}
          {...targetProps}
          className="mt-10 inline-flex items-center gap-3 border-b-2 border-black pb-2 text-sm font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6fae]"
        >
          {project.action}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
        </a>
      </div>

      <motion.figure
        data-cstd-project-plane={proof.projectId}
        className="relative mt-14 aspect-[16/11] min-h-0 overflow-hidden border border-black/20 bg-black lg:mt-0"
        initial={{ clipPath: "polygon(7% 0%, 100% 0%, 93% 100%, 0% 100%)" }}
        whileHover={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="absolute inset-[-2%]" whileHover={{ scale: 1.055, rotate: index % 2 === 0 ? -0.7 : 0.7 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
          <Image
            src={project.preview.src}
            alt={project.preview.alt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
            style={{ objectPosition: project.preview.position }}
          />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 border-[10px] border-[#efe8dc]/10" />
        <figcaption className="absolute bottom-0 left-0 bg-[#11130f] px-4 py-3 text-[10px] font-black text-white">
          LIVE / {project.kicker.toUpperCase()}
        </figcaption>
      </motion.figure>
    </article>
  );
}

function SelectedWork() {
  return (
    <section id="proof" data-cstd-chapter="proof" aria-labelledby="proof-heading" className="relative z-20 bg-[#efe8dc] text-[#11130f]">
      <header className="border-b border-black/25 px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-16 lg:pt-32">
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black text-[#2d6fae]">02 / SELECTED WORK</p>
            <h2 id="proof-heading" className="mt-5 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">
              不陈列全部，
              <br />
              只放真实运行的证据。
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-black/58">三个项目，分别验证资料结构、研究过程和业务边界。画面可以夸张，结果必须能用。</p>
        </div>
      </header>

      <div data-cstd-proof-reel>
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} />
        ))}
      </div>

      <div className="border-b border-black/25 px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-0 border-t border-black/25 md:grid-cols-2">
          {liveProjects.map((project) => {
            const targetProps = getCstdLinkTargetProps(project.href);
            return (
              <div key={project.id} data-cstd-live-object={project.id} className="border-b border-black/25 py-8 md:odd:border-r md:odd:pr-10 md:even:pl-10">
                <p className="text-xs font-black text-black/45">LIVE OBJECT / {project.kicker.toUpperCase()}</p>
                <a href={project.href} {...targetProps} className="mt-4 flex items-center justify-between gap-4 text-2xl font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6fae] md:text-3xl">
                  {project.title}
                  <ArrowUpRight aria-hidden="true" className="h-6 w-6 flex-none" />
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
  horizontalPath,
  reducedMotion,
  scrollProgress,
  velocityTilt,
}: {
  entry: CstdLearningEntry;
  index: number;
  active: boolean;
  horizontalPath: boolean;
  reducedMotion: boolean;
  scrollProgress: MotionValue<number>;
  velocityTilt: MotionValue<number>;
}) {
  const asset = learningAssets[entry.year];
  const accent = researchAccents[index];
  const lastIndex = cstdLearningPath.length - 1;
  const center = index / lastIndex;
  const reach = 0.22;
  const inputRange = index === 0
    ? [0, reach]
    : index === lastIndex
      ? [1 - reach, 1]
      : [center - reach, center, center + reach];
  const mediaShift = useTransform(
    scrollProgress,
    inputRange,
    index === 0 ? [0, -72] : index === lastIndex ? [72, 0] : [72, 0, -72],
  );
  const copyShift = useTransform(
    scrollProgress,
    inputRange,
    index === 0 ? [0, -34] : index === lastIndex ? [34, 0] : [34, 0, -34],
  );
  const mediaScale = useTransform(
    scrollProgress,
    inputRange,
    index === 0 ? [1, 0.92] : index === lastIndex ? [0.92, 1] : [0.92, 1, 0.92],
  );
  const mediaOpacity = useTransform(
    scrollProgress,
    inputRange,
    index === 0 ? [1, 0.42] : index === lastIndex ? [0.42, 1] : [0.42, 1, 0.42],
  );
  const motionStyle = horizontalPath && !reducedMotion;

  return (
    <li
      data-cstd-learning-step={entry.year}
      data-cstd-learning-active={active ? "true" : "false"}
      className={clsx(
        "group relative grid w-full flex-none items-center overflow-hidden border-white/20 px-5 md:px-10 lg:px-16",
        horizontalPath
          ? "h-svh w-screen grid-cols-[0.72fr_1.08fr_0.2fr] gap-12 border-r pb-14 pt-40"
          : "min-h-svh gap-12 border-b py-28 md:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:py-32",
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={asset.src}
          alt=""
          fill
          sizes="100vw"
          className="scale-125 object-cover opacity-[0.09] saturate-50 transition duration-1000 group-hover:scale-[1.29] group-hover:opacity-[0.14] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-[#090a08]/78" />
        <span className="absolute -bottom-12 right-2 text-[13rem] font-black leading-none text-white/[0.035] md:text-[20rem] lg:-right-5 lg:text-[27rem]">
          {entry.year.slice(2)}
        </span>
        <span className="absolute inset-x-0 top-[42%] h-px bg-white/10" />
        <span className="absolute bottom-0 top-0 left-[8%] w-px bg-white/[0.07]" />
      </div>

      <motion.div
        className="relative z-20 min-w-0 max-w-2xl"
        style={motionStyle ? { x: copyShift } : undefined}
      >
        <div className="flex items-center gap-4 text-[10px] font-black text-white/48 md:text-xs">
          <span className={accent.text}>0{index + 1}</span>
          <span aria-hidden="true" className={clsx("h-px w-12", accent.background)} />
          <span>{entry.focus}</span>
        </div>
        <p className={clsx("mt-8 text-8xl font-black leading-none md:text-9xl", accent.text)}>{entry.year}</p>
        <h3 className="mt-6 text-balance text-4xl font-black leading-[0.96] tracking-[0] md:text-5xl xl:text-6xl">{entry.title}</h3>
        <p className="mt-7 max-w-lg text-balance text-base leading-8 text-white/66">{entry.note}</p>
        <div className="mt-10 flex items-center gap-4 text-[10px] font-black text-white/38">
          <span>{accent.code}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/18" />
          <span>{String(index + 1).padStart(2, "0")} / {String(cstdLearningPath.length).padStart(2, "0")}</span>
        </div>
      </motion.div>

      <motion.figure
        className={clsx(
          "relative z-10 min-h-0 overflow-hidden border bg-black shadow-[0_30px_90px_rgba(0,0,0,0.42)]",
          accent.border,
          horizontalPath ? "aspect-[5/4] max-h-[62svh]" : "aspect-[4/5] max-h-[70svh]",
        )}
        style={motionStyle ? { y: mediaShift, opacity: mediaOpacity, rotate: velocityTilt } : undefined}
        whileHover={reducedMotion ? undefined : { scale: 1.018 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-[-4%]"
          style={motionStyle ? { scale: mediaScale } : undefined}
        >
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover saturate-[0.78] transition duration-700 group-hover:saturate-100"
          />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 border-[12px] border-black/10" />
        <div aria-hidden="true" className="absolute left-5 top-5 h-8 w-8 border-l border-t border-white/70" />
        <div aria-hidden="true" className="absolute bottom-5 right-5 h-8 w-8 border-b border-r border-white/70" />
        <figcaption className={clsx("absolute bottom-0 right-0 px-4 py-3 text-[10px] font-black text-black", accent.background)}>
          CSTD ARCHIVE / {entry.year}
        </figcaption>
      </motion.figure>

      {horizontalPath ? (
        <div aria-hidden="true" className="relative z-20 hidden h-[62svh] flex-col items-end justify-between border-l border-white/18 pl-6 lg:flex">
          <span className="text-[10px] font-black text-white/38">FRAME {String(index + 1).padStart(2, "0")}</span>
          <span className={clsx("text-6xl font-black", accent.text)}>0{index + 1}</span>
          <span className="text-[10px] font-black text-white/38">CSTD / {entry.year}</span>
        </div>
      ) : null}

      {index === lastIndex ? (
        <a
          href="#cstd-footer"
          aria-label="继续到页脚"
          className="absolute bottom-8 right-6 z-30 flex h-12 w-12 items-center justify-center border border-white/45 text-white transition-colors hover:border-[#f4b72f] hover:bg-[#f4b72f] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f] md:right-10 lg:right-16"
        >
          <ArrowDown aria-hidden="true" className="h-5 w-5" />
        </a>
      ) : null}
    </li>
  );
}

function ResearchPath({ reducedMotion, isWide }: { reducedMotion: boolean; isWide: boolean }) {
  const pathRef = useRef<HTMLElement>(null);
  const [activeYear, setActiveYear] = useState<CstdLearningEntry["year"]>(cstdLearningPath[0].year);
  const { scrollYProgress } = useScroll({ target: pathRef, offset: ["start start", "end end"] });
  const pathX = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const pathVelocity = useVelocity(scrollYProgress);
  const smoothPathVelocity = useSpring(pathVelocity, { stiffness: 90, damping: 24, mass: 0.45 });
  const velocityTilt = useTransform(smoothPathVelocity, [-0.65, 0.65], [-2.2, 2.2]);
  const horizontalPath = isWide && !reducedMotion;
  const activeIndex = cstdLearningPath.findIndex((entry) => entry.year === activeYear);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!horizontalPath) return;
    const index = Math.min(cstdLearningPath.length - 1, Math.floor(value * cstdLearningPath.length));
    const year = cstdLearningPath[index].year;
    setActiveYear((current) => (current === year ? current : year));
  });

  useEffect(() => {
    if (horizontalPath) return;
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
  }, [horizontalPath]);

  return (
    <section
      id="path"
      ref={pathRef}
      data-cstd-chapter="path"
      data-cstd-research-state={activeYear}
      data-cstd-path-mode={horizontalPath ? "horizontal" : "vertical"}
      aria-labelledby="path-heading"
      className={clsx(
        "relative z-10 bg-[#090a08]/88 text-[#f4efe4]",
        horizontalPath && "min-h-[420svh]",
      )}
    >
      <div
        data-cstd-path-stage
        className={horizontalPath ? "sticky top-0 h-svh overflow-hidden" : "relative"}
      >
        <header className={clsx(
          "z-30 border-b border-white/20 bg-[#090a08]/78 px-5 pb-7 pt-24 backdrop-blur-md md:px-10 lg:px-16",
          horizontalPath ? "absolute inset-x-0 top-0" : "relative",
        )}>
          <div className="flex items-end justify-between gap-10">
          <div>
            <p className="text-xs font-black text-[#f4b72f]">03 / RESEARCH PATH</p>
              <h2 id="path-heading" className="mt-3 max-w-5xl text-4xl font-black leading-[0.96] tracking-[0] md:text-6xl">
                学习不是履历，是镜头继续向前。
              </h2>
            </div>
            <div className="hidden items-end gap-5 lg:flex">
              <span className="pb-2 text-[10px] font-black text-white/38">0{activeIndex + 1} / 0{cstdLearningPath.length}</span>
              <span className="text-7xl font-black leading-none text-white/12">{activeYear}</span>
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/12">
            <motion.div data-cstd-path-progress className="h-px origin-left bg-[#f4b72f]" style={{ scaleX: scrollYProgress }} />
          </div>
        </header>

        <motion.ol
          style={horizontalPath ? { x: pathX } : undefined}
          className={horizontalPath ? "flex h-svh w-[400vw] flex-row will-change-transform" : "flex w-full flex-col"}
        >
          {cstdLearningPath.map((entry, index) => {
            return (
              <ResearchPathPanel
                key={entry.year}
                entry={entry}
                index={index}
                active={entry.year === activeYear}
                horizontalPath={horizontalPath}
                reducedMotion={reducedMotion}
                scrollProgress={scrollYProgress}
                velocityTilt={velocityTilt}
              />
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}

function ChapterRail({ activeChapter }: { activeChapter: ChapterId }) {
  return (
    <nav
      aria-label="章节导航"
      className={clsx(
        "fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 border-l border-white/30 pl-4 transition-opacity duration-500 xl:block",
        activeChapter === "path" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <ol className="space-y-5">
        {chapterLinks.map((chapter, index) => {
          const active = activeChapter === chapter.id;
          return (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`} className="group flex items-center gap-3 text-[10px] font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]">
                <span className={`transition-opacity ${active ? "opacity-100" : "opacity-35 group-hover:opacity-70"}`}>0{index + 1}</span>
                <span aria-hidden="true" className={`h-px transition-all duration-500 ${active ? "w-8 bg-[#f4b72f]" : "w-3 bg-white/40"}`} />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function CstdLanding() {
  const motionMode = useSyncExternalStore(
    subscribeMotionMode,
    getMotionModeSnapshot,
    getMotionModeServerSnapshot,
  );
  const reducedMotion = motionMode === "calm";
  const isWide = useWideViewport();
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef(0);
  const activeChapterRef = useRef<ChapterId>("hero");
  const [activeChapter, setActiveChapter] = useState<ChapterId>("hero");
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const { scrollY, scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.34 });
  const cursorX = useMotionValue(-80);
  const cursorY = useMotionValue(-80);
  const smoothCursorX = useSpring(cursorX, { stiffness: 420, damping: 34, mass: 0.25 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 420, damping: 34, mass: 0.25 });

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
    () => ({ progressRef, pointerRef, impulseRef, reducedMotion }),
    [reducedMotion],
  );

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    pointerRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -((event.clientY / window.innerHeight) * 2 - 1),
    };
    cursorX.set(event.clientX - 18);
    cursorY.set(event.clientY - 18);
  }

  function handlePointerLeave() {
    pointerRef.current = { x: 0, y: 0 };
    cursorX.set(-80);
    cursorY.set(-80);
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
    <main
      data-cstd-kinetic-world
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => {
        if (!reducedMotion) impulseRef.current = 1;
      }}
      className="relative isolate overflow-clip bg-[#090a08] font-sans text-[#f4efe4]"
    >
      <a href="#systems" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black">
        跳到主要内容
      </a>

      <div aria-hidden="true" className="fixed inset-0 z-0 bg-[#090a08]">
        <Image
          src="/cstd-world/cstd-kinetic-studio-v2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/26" />
        <CstdImmersiveScene {...sceneProps} />
      </div>

      <motion.div
        aria-hidden="true"
        data-cstd-page-progress
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-[#f4b72f]"
        style={{ scaleX: pageProgress }}
      />

      <motion.div
        aria-hidden="true"
        data-cstd-pointer-field
        className={clsx(
          "pointer-events-none fixed left-0 top-0 z-[80] hidden h-9 w-9 items-center justify-center border border-white/65 text-[#f4b72f] mix-blend-difference lg:flex",
          reducedMotion && "lg:!hidden",
        )}
        style={{ x: smoothCursorX, y: smoothCursorY }}
      >
        <Crosshair className="h-4 w-4" strokeWidth={1.6} />
      </motion.div>

      <motion.header
        data-cstd-header-theme={activeChapter}
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/18 bg-[#090a08]/72 px-5 text-white backdrop-blur-md md:px-10 lg:px-12"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#top" className="flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]">
          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#f4b72f] text-xs font-black text-black">CS</span>
          <span className="text-sm font-black">CSTD</span>
          <span aria-hidden="true" className="h-4 w-px bg-white/30" />
          <span className="hidden text-[10px] font-bold text-white/55 sm:inline">{chapterLabels[activeChapter]}</span>
        </a>

        <div className="flex items-center gap-4 md:gap-7">
          <nav aria-label="主导航" className="flex items-center gap-5 text-xs font-black md:gap-8">
            {chapterLinks.map((chapter) => (
              <a key={chapter.id} href={`#${chapter.id}`} className="text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]">
                {chapter.label}
              </a>
            ))}
          </nav>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/25 sm:block" />
          <button
            type="button"
            data-cstd-motion-toggle
            aria-pressed={!reducedMotion}
            aria-label={reducedMotion ? "开启增强动效" : "关闭增强动效"}
            onClick={toggleMotionMode}
            className="group relative hidden h-8 w-8 items-center justify-center border border-white/35 text-white transition-colors hover:border-[#f4b72f] hover:text-[#f4b72f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f] sm:flex"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            <span role="tooltip" className="pointer-events-none absolute right-0 top-10 hidden whitespace-nowrap border border-white/20 bg-[#090a08] px-3 py-2 text-[10px] font-black text-white group-hover:block group-focus-visible:block">
              {reducedMotion ? "FULL MOTION" : "CALM MOTION"}
            </span>
          </button>
        </div>
      </motion.header>

      <ChapterRail activeChapter={activeChapter} />

      <section
        id="top"
        data-cstd-hero
        data-cstd-elastic-archive
        aria-labelledby="cstd-hero-title"
        className="relative z-10 flex h-[92svh] min-h-[680px] items-end overflow-hidden px-5 pb-12 pt-24 md:px-10 md:pb-16 lg:px-16"
      >
        <div className="mx-auto flex w-full max-w-[1540px] flex-col justify-end">
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-5 text-xs font-black text-[#f4b72f]"
          >
            奶黄包的个人技术工作室 / CREATIVE SYSTEMS LAB
          </motion.p>
          <motion.h1
            id="cstd-hero-title"
            data-cstd-hero-depth
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-[7rem] font-black leading-[0.72] tracking-[0] text-white mix-blend-difference md:text-[11rem] xl:text-[16rem] 2xl:text-[20rem]"
          >
            CSTD
          </motion.h1>

          <div className="mt-8 grid items-end gap-8 border-t border-white/35 pt-6 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="text-2xl font-black leading-tight text-white md:text-4xl">
                把产品、数据、AI 和研究，
                <br className="hidden sm:block" />
                折进一条会呼吸的系统。
              </p>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/62 md:text-base">真实项目持续运行，新的技术继续进入镜头。这里不是作品目录，而是一套正在演化的个人方法。</p>
            </div>
            <a
              href="#systems"
              aria-label="进入系统章节"
              className="flex h-14 w-14 items-center justify-center border border-white/60 text-white transition-colors hover:border-[#f4b72f] hover:bg-[#f4b72f] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b72f]"
            >
              <ArrowDown aria-hidden="true" className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <SignalStrip reducedMotion={reducedMotion} />
      <SystemsChapter activeSystemId={activeSystemId} setActiveSystemId={setActiveSystemId} />
      <SelectedWork />
      <ResearchPath reducedMotion={reducedMotion} isWide={isWide} />

      <footer id="cstd-footer" className="relative z-20 border-t border-white/20 bg-[#090a08] px-5 py-16 text-white md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-5xl font-black tracking-[0] md:text-7xl">CSTD</p>
            <p className="mt-3 text-sm text-white/48">奶黄包个人技术工作室 / Sydney · Nanjing · The web</p>
          </div>
          <div className="text-left text-xs font-bold text-white/45 md:text-right">
            <p>DESIGNED AND ENGINEERED AS A LIVING SYSTEM</p>
            <p className="mt-2 text-[#f4b72f]">2022 — 2026 / STILL IN MOTION</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
