"use client";

import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { clsx } from "clsx";
import { ArrowDown } from "lucide-react";
import * as m from "framer-motion/m";
import { cstdLearningPath, type CstdLearningEntry } from "../../content/systems";

const LetterReveal = dynamic(() => import("../letter-reveal").then((module) => module.LetterReveal));
const CountUp = dynamic(() => import("../count-up").then((module) => module.CountUp));
const LazyTracingProgress = lazy(() => import("../tracing-progress").then((module) => ({ default: module.TracingProgress })));

// 统一 spring 物理参数
const springSoft = { type: "spring", stiffness: 90, damping: 18, mass: 0.7 } as const;
const springSnappy = { type: "spring", stiffness: 260, damping: 24, mass: 0.5 } as const;

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
      <Suspense fallback={null}>
        <LazyTracingProgress disabled={reducedMotion} color="#33ff66" className="left-4 md:left-8" />
      </Suspense>
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

export const MemoizedResearchPath = memo(ResearchPath);
