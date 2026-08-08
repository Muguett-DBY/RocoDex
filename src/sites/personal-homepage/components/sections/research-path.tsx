"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { memo, useEffect, useRef, useState } from "react";
import { cstdLearningPath, type CstdLearningEntry } from "../../content/systems";

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
    src: "/cstd-universe/cstd-data-vault-v1.webp",
    alt: "原创未来数据档案馆与透明研究模块",
  },
};

const researchAccents: Record<CstdLearningEntry["year"], string> = {
  "2022": "#f4d431",
  "2024": "#24e0ff",
  "2025": "#ff3b30",
  "2026": "#3dff8f",
};

function ResearchPath({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeYear, setActiveYear] = useState<CstdLearningEntry["year"]>("2026");
  const [imageReady, setImageReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const activeEntry = cstdLearningPath.find((entry) => entry.year === activeYear) ?? cstdLearningPath.at(-1)!;
  const asset = learningAssets[activeEntry.year];
  const accent = researchAccents[activeEntry.year];

  const activateYear = (year: CstdLearningEntry["year"]) => {
    if (year === activeYear) return;
    setImageLoaded(false);
    setActiveYear(year);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="path"
      ref={sectionRef}
      data-cstd-chapter="path"
      data-cstd-scene="path"
      data-cstd-research-state={activeYear}
      data-cstd-path-mode="interactive-timeline"
      data-cstd-generated-visual="data-vault-v1"
      aria-labelledby="path-heading"
      className="relative z-20 overflow-hidden bg-[#050709]/82 px-5 py-24 text-[#f2efe7] contain-paint backdrop-blur-md md:px-10 md:py-32 lg:px-16"
    >
      <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1 bg-[#ff3b30]" />
      <span aria-hidden="true" className="absolute -left-8 top-24 font-mono text-[10rem] font-black leading-none text-white/[0.025] md:text-[18rem]">MEM</span>
      <div className="mx-auto max-w-[1540px]" data-cstd-path-stage>
        <header className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_28rem] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase text-[#3dff8f]">04 // MEMORY PATH</p>
            <h2 id="path-heading" className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[0] md:text-7xl xl:text-8xl">
              学习不是履历，是人格芯片持续写入。
            </h2>
          </div>
          <p className="text-base leading-8 text-[#92989c]">
            四个节点不是完整清单，而是工程直觉如何从计算基础走向数据系统与独立交付的缩影。
          </p>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(28rem,0.88fr)] lg:items-stretch lg:gap-16">
          <figure className="relative aspect-[4/3] min-h-0 overflow-hidden border border-[#24e0ff]/25 bg-[#0a0d10] shadow-[0_28px_90px_rgba(0,0,0,0.45)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)] lg:aspect-auto lg:min-h-[650px]">
            {imageReady ? (
              <Image
                key={activeEntry.year}
                src={asset.src}
                alt={asset.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 58vw, 100vw"
                onLoad={() => setImageLoaded(true)}
                className={clsx("object-cover saturate-[0.82] transition-opacity", imageLoaded ? "opacity-100" : "opacity-0", reducedMotion ? "duration-0" : "duration-500")}
              />
            ) : (
              <div aria-hidden="true" className="absolute inset-0 bg-[#15181b]" />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-black/10" />
            <div
              aria-hidden="true"
              className={clsx("absolute inset-0 z-[1] overflow-hidden bg-[#080c10] transition-opacity", imageLoaded ? "pointer-events-none opacity-0" : "opacity-100", reducedMotion ? "duration-0" : "duration-300")}
              style={{
                backgroundImage: "linear-gradient(rgba(36,224,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(36,224,255,0.07) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            >
              <div className="cstd-memory-loader-scan absolute inset-x-0 top-0 h-px bg-[#24e0ff] shadow-[0_0_24px_rgba(36,224,255,0.8)]" />
              <span className="absolute left-6 top-6 font-mono text-[10px] font-black text-[#24e0ff]">DECRYPTING MEMORY SHARD // {activeEntry.year}</span>
              <span className="absolute bottom-28 left-6 font-mono text-[10px] text-[#68747b]">STREAM BUFFER / AWAITING VISUAL DATA</span>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 z-[2] grid gap-3 border-t border-[#24e0ff]/25 bg-[#050709]/90 p-5 backdrop-blur-xl md:grid-cols-[auto_1fr] md:items-end md:p-7">
              <span className="font-mono text-5xl font-black" style={{ color: accent }}>{activeEntry.year}</span>
              <span className="text-sm leading-6 text-[#c0c3c3] md:text-right">{activeEntry.note}</span>
            </figcaption>
          </figure>

          <ol className="border-t border-white/10">
            {cstdLearningPath.map((entry, index) => {
              const active = entry.year === activeYear;
              const itemAccent = researchAccents[entry.year];
              return (
                <li
                  key={entry.year}
                  data-cstd-learning-step={entry.year}
                  data-cstd-learning-active={active ? "true" : "false"}
                  className="border-b border-white/10"
                >
                  <button
                    type="button"
                    onClick={() => activateYear(entry.year)}
                    onPointerEnter={() => activateYear(entry.year)}
                    onFocus={() => activateYear(entry.year)}
                    className={clsx("group grid w-full grid-cols-[2rem_5rem_1fr_auto] items-start gap-3 px-3 py-6 text-left transition-colors [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431] md:gap-5 md:px-5 md:py-7", active && "bg-white/[0.045]")}
                  >
                    <span className="pt-1 font-mono text-[10px] font-bold text-[#656b6f]">0{index + 1}</span>
                    <span className="font-mono text-xl font-black transition-colors" style={{ color: active ? itemAccent : "#8f9599" }}>{entry.year}</span>
                    <span>
                      <span className={clsx("block text-xl font-semibold transition-colors md:text-2xl", active ? "text-[#f2efe7]" : "text-[#9ba0a4] group-hover:text-[#d8d7d2]")}>{entry.title}</span>
                      <span className="mt-2 block font-mono text-[10px] font-semibold leading-5 text-[#777d81]">{entry.focus}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className={clsx("mt-1 h-4 w-4 transition-transform", active && "translate-x-1")} style={{ color: active ? itemAccent : "#656b6f" }} />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export const MemoizedResearchPath = memo(ResearchPath);
