"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Cloud,
  Database,
  FlaskConical,
  Layers3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { getCstdLinkTargetProps } from "@/lib/cstd-link-target";
import { cstdProjects } from "@/lib/cstd-projects";
import {
  cstdLearningPath,
  cstdLiveObjectIds,
  cstdProofs,
  cstdSystems,
  getCstdProjectsById,
  type CstdLearningEntry,
  type CstdSystem,
  type CstdSystemIcon,
} from "@/lib/cstd-systems";

const systemIcons: Record<CstdSystemIcon, LucideIcon> = {
  product: Layers3,
  edge: Cloud,
  ai: Sparkles,
  research: FlaskConical,
  data: Database,
};

const archiveMaterials = [
  {
    id: "resin-circuit",
    src: "/cstd-archive/cstd-archive-resin-circuit-v1.webp",
    alt: "嵌有铜线与奶黄色触点的薄荷绿色透明树脂计算模块",
    label: "RESIN CIRCUIT",
    color: "#d8ece4",
  },
  {
    id: "data-film",
    src: "/cstd-archive/cstd-archive-data-film-v1.webp",
    alt: "带有精密微孔与蚀刻线路的弧形透明数据薄膜",
    label: "DATA FILM",
    color: "#d7d0c3",
  },
  {
    id: "notebook",
    src: "/cstd-archive/cstd-archive-notebook-v1.webp",
    alt: "记录系统图、矩阵与数据曲线的计算研究笔记",
    label: "COMPUTE NOTE",
    color: "#f0e6cf",
  },
  {
    id: "cobalt-modules",
    src: "/cstd-archive/cstd-archive-cobalt-modules-v1.webp",
    alt: "置于深色技术托盘上的钴蓝陶瓷计算模块",
    label: "MODULE ARRAY",
    color: "#2759a5",
  },
  {
    id: "studio",
    src: "/cstd-archive/cstd-archive-studio-v1.webp",
    alt: "有研究图纸、透明计算材料与茶杯的温暖个人技术工作台",
    label: "STUDIO LOG",
    color: "#d6b36a",
  },
] as const;

type ArchiveMaterial = (typeof archiveMaterials)[number];

const proofProjects = getCstdProjectsById(
  cstdProjects,
  cstdProofs.map((proof) => proof.projectId),
);
const proofEntries = cstdProofs.map((proof, index) => ({
  proof,
  project: proofProjects[index],
}));
const liveObjects = getCstdProjectsById(cstdProjects, cstdLiveObjectIds);

const chapters = [
  { id: "systems", index: "01", label: "系统" },
  { id: "proof", index: "02", label: "证据" },
  { id: "path", index: "03", label: "路径" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];
type VisualChapter = "hero" | ChapterId;

const headerPalettes: Record<
  VisualChapter,
  { backgroundColor: string; borderColor: string; color: string; accent: string }
> = {
  hero: {
    backgroundColor: "rgba(22, 24, 21, 0.96)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
    accent: "#f4bd3f",
  },
  systems: {
    backgroundColor: "rgba(243, 240, 231, 0.94)",
    borderColor: "rgba(24, 25, 20, 0.14)",
    color: "#181914",
    accent: "#276eae",
  },
  proof: {
    backgroundColor: "rgba(23, 26, 22, 0.95)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    color: "#ffffff",
    accent: "#f4bd3f",
  },
  path: {
    backgroundColor: "rgba(238, 243, 237, 0.94)",
    borderColor: "rgba(24, 25, 20, 0.14)",
    color: "#181914",
    accent: "#276eae",
  },
};

const systemSignals = cstdSystems.map((system) => system.title);
const technologySignals = Array.from(new Set(cstdSystems.flatMap((system) => system.stack)));
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);
}

function useActiveChapter() {
  const [activeChapter, setActiveChapter] = useState<ChapterId | null>(null);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (mostVisible) setActiveChapter(mostVisible.target.id as ChapterId);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0, 0.18, 0.42, 0.68] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeChapter;
}

export function CstdLanding() {
  const reducedMotion = useReducedMotion();
  const activeChapter = useActiveChapter();
  const visualChapter: VisualChapter = activeChapter ?? "hero";
  const headerPalette = headerPalettes[visualChapter];
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = reducedMotion ? "auto" : "smooth";
    return () => {
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [reducedMotion]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e7] text-[#181914]">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[80] h-1 origin-left bg-[#f4bd3f]"
        style={{ scaleX: progressScale }}
      />

      <ChapterRail activeChapter={activeChapter} visualChapter={visualChapter} />

      <motion.header
        data-cstd-header-theme={visualChapter}
        animate={{
          backgroundColor: headerPalette.backgroundColor,
          borderColor: headerPalette.borderColor,
          color: headerPalette.color,
        }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-[70] border-b backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            aria-label="返回 CSTD 首页顶部"
            className="inline-flex items-center gap-3 text-sm font-black text-current no-underline"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#f4bd3f] text-[10px] font-black text-[#181914]">
              CS
            </span>
            <span>CSTD</span>
            <span className="ml-3 hidden border-l border-current/25 pl-5 text-[10px] font-bold opacity-65 md:inline">
              CREATIVE SYSTEMS LAB
            </span>
          </a>

          <nav aria-label="主导航" className="flex items-center gap-1 sm:gap-3">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                aria-current={activeChapter === chapter.id ? "location" : undefined}
                className={`relative px-2 py-2 text-xs font-bold text-current no-underline transition-opacity sm:px-3 sm:text-sm ${
                  activeChapter === chapter.id ? "opacity-100" : "opacity-55 hover:opacity-100"
                }`}
              >
                {chapter.label}
                {activeChapter === chapter.id ? (
                  <motion.span
                    layoutId="cstd-header-chapter"
                    animate={{ backgroundColor: headerPalette.accent }}
                    className="absolute inset-x-2 -bottom-[1px] h-0.5 sm:inset-x-3"
                    transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
                  />
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </motion.header>

      <ElasticArchiveHero reducedMotion={reducedMotion} />
      <SignalStrip />

      <section id="systems" aria-labelledby="systems-heading" className="scroll-mt-16 bg-[#f3f0e7]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <SectionHeading
            eyebrow="01 / SYSTEMS"
            id="systems-heading"
            lines={["从产品表面，", "做到系统深处。"]}
            copy="技术栈不是一面标签墙。每个方向都对应正在运行的产品、服务或研究练习，彼此之间保持真实边界，也能够连续协作。"
          />
          <SystemsStage />
        </div>
      </section>

      <section id="proof" aria-labelledby="proof-heading" className="scroll-mt-16 bg-[#171a16] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <SectionHeading
            eyebrow="02 / SELECTED PROOF"
            id="proof-heading"
            lines={["只展示足以", "说明方法的证据。"]}
            copy="不做冗长案例拆解。三个已经上线的系统，以真实界面、明确边界和持续交付证明这套方法能够落地。"
            dark
          />
          <ProofReel />
          <LiveObjects />
        </div>
      </section>

      <section id="path" aria-labelledby="path-heading" className="scroll-mt-16 bg-[#edf3ed] text-[#181914]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <ResearchPath />
        </div>
      </section>

      <footer className="border-t border-[#181914] bg-[#f4bd3f] text-[#181914]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-7 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-md border border-[#181914]/20 bg-[#f8efcf] p-2">
              <Image src="/cstd-mascot.svg" alt="" width={40} height={40} className="h-auto w-full" />
            </div>
            <div>
              <p className="text-xl font-black">CSTD</p>
              <p className="text-sm font-semibold text-[#50471f]">Made with custard by custard.</p>
            </div>
          </div>
          <a
            href="#top"
            aria-label="返回页面顶部"
            title="返回页面顶部"
            className="grid h-11 w-11 place-items-center rounded-md border border-[#181914]/25 text-[#181914] no-underline transition-transform hover:-translate-y-1"
          >
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}

type TrailItem = {
  id: number;
  src: ArchiveMaterial["src"];
  alt: string;
  x: number;
  y: number;
  rotate: number;
};

function ElasticArchiveHero({ reducedMotion }: { reducedMotion: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 125, damping: 24, mass: 0.5 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 125, damping: 24, mass: 0.5 });
  const depthX = useTransform(smoothPointerX, [-1, 1], reducedMotion ? [0, 0] : [-14, 14]);
  const depthY = useTransform(smoothPointerY, [-1, 1], reducedMotion ? [0, 0] : [-9, 9]);
  const [trailItems, setTrailItems] = useState<TrailItem[]>([]);
  const trailId = useRef(0);
  const lastTrailPoint = useRef({ x: -200, y: -200 });
  const trailTimers = useRef(new Set<number>());
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const lettersY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -90]);
  const copyY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 72]);
  const signalScale = useTransform(scrollYProgress, [0, 0.75], [0.18, 1]);

  useEffect(() => {
    const timers = trailTimers.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    pointerX.set((localX / bounds.width - 0.5) * 2);
    pointerY.set((localY / bounds.height - 0.5) * 2);

    if (reducedMotion || event.pointerType !== "mouse") return;
    const distance = Math.hypot(
      localX - lastTrailPoint.current.x,
      localY - lastTrailPoint.current.y,
    );
    if (distance < 105) return;

    lastTrailPoint.current = { x: localX, y: localY };
    trailId.current += 1;
    const id = trailId.current;
    const material = archiveMaterials[id % archiveMaterials.length];
    setTrailItems((current) => [
      ...current.slice(-4),
      {
        id,
        src: material.src,
        alt: "",
        x: localX,
        y: localY,
        rotate: ((id % 5) - 2) * 2.5,
      },
    ]);

    const timer = window.setTimeout(() => {
      setTrailItems((current) => current.filter((item) => item.id !== id));
      trailTimers.current.delete(timer);
    }, 820);
    trailTimers.current.add(timer);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
    lastTrailPoint.current = { x: -200, y: -200 };
  };

  return (
    <section
      ref={heroRef}
      id="top"
      data-cstd-hero
      data-cstd-elastic-archive
      aria-labelledby="cstd-hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative isolate h-[calc(100svh-9rem)] min-h-[560px] max-h-[720px] overflow-hidden bg-[#f3f0e7] sm:min-h-[650px] sm:max-h-[780px] lg:max-h-[820px]"
    >
      <motion.h1
        id="cstd-hero-title"
        aria-label="CSTD"
        className="pointer-events-none absolute left-[3%] top-[10%] z-0 text-[9rem] font-black leading-[0.72] text-[#171a16] sm:text-[13rem] lg:text-[18rem] xl:text-[22rem]"
        style={{ y: lettersY }}
      >
        CSTD
      </motion.h1>

      <div aria-hidden="true" className="absolute bottom-[13%] left-6 top-[8%] z-30 hidden w-10 flex-col justify-between text-[10px] font-black lg:flex">
        <span>2022</span>
        <span className="h-full w-px self-center bg-[#181914]/25" />
        <span>2024</span>
        <span className="h-full w-px self-center bg-[#181914]/25" />
        <span className="text-[#276eae]">2026</span>
      </div>

      <motion.div
        data-cstd-hero-depth
        aria-hidden="true"
        className="absolute bottom-[25%] left-[39%] right-4 top-[5%] z-10 grid grid-cols-2 gap-2 will-change-transform sm:bottom-[18%] sm:left-[33%] sm:grid-cols-3 md:left-[29%] md:grid-cols-4 lg:bottom-[8%] lg:left-[29%] lg:right-[12%] lg:grid-cols-5"
        style={{ x: depthX, y: depthY }}
      >
        {archiveMaterials.map((material, index) => (
          <MaterialColumn
            key={material.id}
            material={material}
            index={index}
            pointerX={smoothPointerX}
            pointerY={smoothPointerY}
            scrollProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-5 right-5 z-30 border-l-4 border-[#f4bd3f] bg-[#f3f0e7]/95 px-5 py-5 shadow-[10px_12px_0_rgba(24,25,20,0.13)] backdrop-blur-md sm:left-[8%] sm:right-auto sm:w-[340px] lg:bottom-auto lg:left-[8%] lg:top-[37%] lg:w-[300px] lg:shadow-none"
        style={{ y: copyY }}
        initial={reducedMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-black text-[#c58b10]">奶黄包的个人技术工作室</p>
        <p className="mt-5 text-xl font-black leading-8 text-[#181914] lg:text-lg lg:leading-7">
          把产品、数据、AI 和系统，慢慢做成能用的东西。
        </p>
        <a
          href="#systems"
          className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-[#181914] text-sm font-black text-[#181914] no-underline transition-colors hover:border-[#276eae] hover:text-[#276eae]"
        >
          进入系统
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </motion.div>

      <div className="absolute inset-x-0 top-[61%] z-20 hidden items-center lg:flex">
        <motion.span
          aria-hidden="true"
          className="h-px origin-left bg-[#f4bd3f]"
          style={{ scaleX: signalScale, width: "100%" }}
        />
        <span className="absolute left-[44%] bg-[#f4bd3f] px-3 py-1 text-[10px] font-black text-[#181914]">
          LIVE SIGNAL / 05 SYSTEMS
        </span>
      </div>

      <div className="absolute bottom-6 left-[4%] z-30 hidden items-end gap-5 lg:flex">
        <div>
          <p className="text-[10px] font-black text-[#6f6758]">CHAPTER</p>
          <p className="mt-1 text-7xl font-light leading-none text-[#181914]">00</p>
        </div>
        <p className="pb-1 text-xs font-bold text-[#6f6758]">研究墙 / 弹性档案</p>
      </div>

      <div data-cstd-image-trail aria-hidden="true" className="pointer-events-none absolute inset-0 z-50 hidden lg:block">
        <AnimatePresence>
          {trailItems.map((item) => (
            <motion.div
              key={item.id}
              className="absolute h-44 w-32 overflow-hidden border border-white/70 bg-[#f3f0e7] shadow-[8px_10px_0_rgba(24,25,20,0.18)]"
              style={{ left: item.x - 64, top: item.y - 88 }}
              initial={{ opacity: 0, scale: 0.72, rotate: item.rotate - 3 }}
              animate={{ opacity: 0.94, scale: 1, rotate: item.rotate }}
              exit={{ opacity: 0, scale: 0.86, y: -22 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={item.src} alt={item.alt} fill sizes="128px" className="object-cover" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

const materialColumnClasses = [
  "mt-[3%] mb-[11%]",
  "-mt-[3%] mb-[1%]",
  "mt-[11%] -mb-[4%] hidden sm:block",
  "mt-[1%] mb-[13%] hidden md:block",
  "mt-[8%] -mb-[3%] hidden lg:block",
] as const;

function MaterialColumn({
  material,
  index,
  pointerX,
  pointerY,
  scrollProgress,
  reducedMotion,
}: {
  material: ArchiveMaterial;
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const travel = [84, -112, 138, -78, 106][index];
  const columnY = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, travel]);
  const columnX = useTransform(pointerX, [-1, 1], reducedMotion ? [0, 0] : [index * -1.4, index * 1.4]);
  const pointerLift = useTransform(pointerY, [-1, 1], reducedMotion ? [0, 0] : [6 - index, index - 6]);

  return (
    <motion.figure
      data-cstd-material-column={material.id}
      className={`group relative min-h-0 overflow-hidden border border-[#181914]/18 bg-[#e8e3d8] shadow-[7px_9px_0_rgba(24,25,20,0.1)] ${materialColumnClasses[index]}`}
      style={{ y: columnY }}
      whileHover={reducedMotion ? undefined : { y: -12, zIndex: 4 }}
      transition={{ type: "spring", stiffness: 190, damping: 22 }}
    >
      <motion.div className="absolute inset-[-4%] will-change-transform" style={{ x: columnX, y: pointerLift }}>
        <Image
          src={material.src}
          alt={material.alt}
          fill
          priority={index < 2}
          sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 34vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
        />
      </motion.div>
      <figcaption className="absolute bottom-0 left-0 bg-[#171a16] px-3 py-2 text-[9px] font-black text-white">
        0{index + 1} / {material.label}
      </figcaption>
    </motion.figure>
  );
}

function SignalStrip() {
  return (
    <section
      data-cstd-signal-strip
      aria-labelledby="technology-signal-heading"
      className="relative z-10 overflow-hidden border-y border-[#181914]"
    >
      <h2 id="technology-signal-heading" className="sr-only">技术栈信号</h2>
      <p className="sr-only">
        系统方向：{systemSignals.join("、")}。技术栈：{technologySignals.join("、")}。
      </p>
      <SignalLane
        signalId="systems"
        items={systemSignals}
        direction="left"
        duration={24}
        className="bg-[#f4bd3f] py-3.5 text-sm text-[#181914] sm:text-base"
      />
      <SignalLane
        signalId="technology"
        items={technologySignals}
        direction="right"
        duration={52}
        className="border-t border-[#181914] bg-[#276eae] py-2.5 text-xs text-white sm:text-sm"
      />
    </section>
  );
}

function SignalLane({
  signalId,
  items,
  direction,
  duration,
  className,
}: {
  signalId: string;
  items: readonly string[];
  direction: "left" | "right";
  duration: number;
  className: string;
}) {
  const reducedMotion = useReducedMotion();
  const groups = reducedMotion ? [0] : [0, 1];

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <motion.div
        data-cstd-signal-track={signalId}
        initial={reducedMotion ? false : { x: direction === "left" ? "0%" : "-50%" }}
        animate={reducedMotion ? { x: 0 } : { x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="flex w-max will-change-transform motion-reduce:!transform-none"
      >
        {groups.map((group) => (
          <div key={group} className="flex shrink-0 items-center pr-8">
            {items.map((item, index) => (
              <span key={`${group}-${item}`} className="flex shrink-0 items-center font-black whitespace-nowrap">
                <span className="px-4 sm:px-6">{item}</span>
                {index < items.length - 1 || !reducedMotion ? <span className="font-semibold opacity-45">/</span> : null}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  id,
  lines,
  copy,
  dark = false,
}: {
  eyebrow: string;
  id: string;
  lines: readonly string[];
  copy: string;
  dark?: boolean;
}) {
  return (
    <div className={`grid gap-8 border-b pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:pb-16 ${dark ? "border-white/20" : "border-[#181914]/20"}`}>
      <div>
        <p className={`text-xs font-black ${dark ? "text-[#f4bd3f]" : "text-[#276eae]"}`}>{eyebrow}</p>
        <RevealHeading
          id={id}
          lines={lines}
          className={`mt-5 max-w-3xl text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl ${dark ? "text-white" : "text-[#181914]"}`}
        />
      </div>
      <p className={`max-w-2xl self-end text-lg font-semibold leading-8 sm:text-xl sm:leading-9 lg:justify-self-end ${dark ? "text-white/68" : "text-[#625e52]"}`}>
        {copy}
      </p>
    </div>
  );
}

function RevealHeading({
  id,
  lines,
  className,
}: {
  id: string;
  lines: readonly string[];
  className: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.h2
      id={id}
      data-cstd-reveal-heading
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.42 }}
      className={className}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true" className="block">
        {lines.map((line, index) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block origin-bottom-left motion-reduce:!transform-none"
              variants={{
                hidden: { y: "112%", rotate: 2.5 },
                visible: { y: 0, rotate: 0 },
              }}
              transition={{
                duration: 0.82,
                delay: index * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.h2>
  );
}

function SystemsStage() {
  const reducedMotion = useReducedMotion();
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const activeIndex = Math.max(0, cstdSystems.findIndex((system) => system.id === activeSystemId));
  const activeSystem = cstdSystems[activeIndex];
  const activeMaterial = archiveMaterials[activeIndex % archiveMaterials.length];

  return (
    <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16">
      <div className="lg:sticky lg:top-24">
        <figure
          data-cstd-system-visual={activeSystem.id}
          className="relative aspect-[4/5] max-h-[720px] overflow-hidden border border-[#181914]/20 bg-[#ddd8cb] shadow-[14px_16px_0_rgba(24,25,20,0.12)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeMaterial.id}
              className="absolute inset-0"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.04, x: 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.985, x: -18 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={activeMaterial.src}
                alt={activeMaterial.alt}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 border-t border-white/20 bg-[#171a16]/94 px-5 py-5 text-white backdrop-blur-md sm:px-7 sm:py-6">
            <div>
              <p className="text-[10px] font-black text-[#f4bd3f]">ACTIVE SYSTEM / 0{activeIndex + 1}</p>
              <p className="mt-2 text-xl font-black sm:text-2xl">{activeSystem.title}</p>
            </div>
            <p className="max-w-[44%] text-right text-[10px] font-bold leading-4 text-white/65 sm:text-xs sm:leading-5">
              {activeSystem.stack.join(" / ")}
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="border-t border-[#181914]/20">
        {cstdSystems.map((system, index) => {
          const Icon = systemIcons[system.icon];
          const isActive = system.id === activeSystemId;
          return (
            <motion.article
              key={system.id}
              data-cstd-system={system.id}
              data-cstd-system-active={isActive ? "true" : "false"}
              aria-labelledby={`system-${system.id}-title`}
              tabIndex={0}
              onFocus={() => setActiveSystemId(system.id)}
              onMouseEnter={() => setActiveSystemId(system.id)}
              onViewportEnter={() => setActiveSystemId(system.id)}
              viewport={{ amount: 0.58, margin: "-8% 0px -24% 0px" }}
              animate={{ x: isActive && !reducedMotion ? 10 : 0 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 27 }}
              className={`relative grid min-h-[148px] cursor-default grid-cols-[58px_1fr] gap-4 border-b border-[#181914]/20 px-3 py-6 outline-none transition-colors duration-500 sm:grid-cols-[72px_0.85fr_1.15fr] sm:gap-6 sm:px-5 sm:py-7 ${
                isActive ? "bg-[#e5eee7]" : "bg-transparent hover:bg-white/45 focus-visible:bg-white/55"
              }`}
            >
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-1 origin-center bg-[#276eae]"
                animate={{ scaleY: isActive ? 1 : 0 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
              <div>
                <p className={`text-xs font-black ${isActive ? "text-[#276eae]" : "text-[#6f6758]"}`}>0{index + 1}</p>
                <span className={`mt-4 grid h-10 w-10 place-items-center rounded-md ${isActive ? "bg-[#181914] text-[#f4bd3f]" : "bg-[#d9d7cd] text-[#4f584e]"}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#2c6254]">{system.track === "shipped" ? "SHIPPED" : "RESEARCH"}</p>
                <h3 id={`system-${system.id}-title`} className="mt-3 text-2xl font-black leading-[1.08] sm:text-3xl">
                  {system.title}
                </h3>
              </div>
              <div className="col-start-2 sm:col-start-auto">
                <p className="text-sm font-semibold leading-6 text-[#4f584e] sm:text-base sm:leading-7">{system.summary}</p>
                <p className="mt-3 text-xs font-black leading-5 text-[#181914]">{system.evidence}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function ProofReel() {
  const reducedMotion = useReducedMotion();
  const firstProofId = proofEntries.find((entry) => entry.project)?.proof.projectId ?? cstdProofs[0].projectId;
  const [activeProofId, setActiveProofId] = useState(firstProofId);

  return (
    <div data-cstd-proof-reel className="mt-12 grid gap-4 lg:mt-16 lg:flex lg:h-[650px] lg:gap-3">
      {proofEntries.map(({ proof, project }, index) => {
        if (!project || !project.preview) return null;
        const isActive = proof.projectId === activeProofId;
        const targetProps = getCstdLinkTargetProps(project.href);
        return (
          <motion.article
            key={proof.projectId}
            data-cstd-proof={proof.projectId}
            onMouseEnter={() => setActiveProofId(proof.projectId)}
            onFocus={() => setActiveProofId(proof.projectId)}
            animate={{ flexGrow: isActive ? 1.58 : 0.82 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 24 }}
            className="group relative min-w-0 overflow-hidden border border-white/18 bg-[#20241f] lg:basis-0"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f0e7] lg:h-[72%] lg:aspect-auto">
              <Image
                src={project.preview.src}
                alt={project.preview.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                style={{ objectPosition: project.preview.position ?? "center top" }}
              />
              <span className="absolute left-4 top-4 bg-[#f4bd3f] px-3 py-2 text-[10px] font-black text-[#181914] sm:left-5 sm:top-5">
                0{index + 1} / {proof.lens}
              </span>
            </div>
            <div className="flex min-h-[190px] flex-col justify-between px-5 py-6 sm:px-7 lg:h-[28%] lg:min-h-0">
              <div>
                <h3 className="text-xl font-black leading-[1.08] sm:text-2xl">{project.title}</h3>
                <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/64">{proof.statement}</p>
              </div>
              <a
                href={project.href}
                {...targetProps}
                className="mt-5 inline-flex w-fit min-h-10 items-center gap-2 border-b border-[#f4bd3f] text-sm font-black text-white no-underline transition-colors hover:text-[#f4bd3f]"
              >
                {project.action}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function LiveObjects() {
  return (
    <div className="mt-14 border-t border-white/20 pt-7 lg:mt-20 lg:pt-9">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-sm font-black text-[#f9eccd]">另外两件仍在线的作品</p>
        <p className="text-sm font-semibold text-white/55">影像表达 / 私有创作流程</p>
      </div>
      <ul className="mt-5 grid border-t border-white/20 sm:grid-cols-2">
        {liveObjects.map((project) => {
          const targetProps = getCstdLinkTargetProps(project.href);
          return (
            <li data-cstd-live-object={project.id} key={project.id} className="border-b border-white/20 sm:odd:border-r">
              <a
                href={project.href}
                {...targetProps}
                className="group flex min-h-20 items-center justify-between gap-5 px-1 py-5 text-white no-underline"
              >
                <span>
                  <span className="block text-base font-black">{project.title}</span>
                  <span className="mt-1 block text-xs font-semibold text-white/55">{project.kicker}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[#f4bd3f] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResearchPath() {
  const reducedMotion = useReducedMotion();
  const [activeYear, setActiveYear] = useState<CstdLearningEntry["year"]>(cstdLearningPath[0].year);
  const activeEntry = cstdLearningPath.find((entry) => entry.year === activeYear) ?? cstdLearningPath[0];

  return (
    <div className="grid gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-black text-[#2c6254]">03 / RESEARCH PATH</p>
        <p className="mt-5 text-8xl font-light leading-none text-[#181914]">03</p>
        <p className="mt-4 text-sm font-bold text-[#59655e]">研究与反复练习</p>
      </div>

      <div>
        <RevealHeading
          id="path-heading"
          lines={["深度来自", "反复做过的练习。"]}
          className="max-w-4xl text-5xl font-black leading-[1.02] text-[#181914] sm:text-6xl lg:text-7xl"
        />
        <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[#4e5d55] sm:text-xl sm:leading-9">
          产品交付和研究训练并行发生。这里记录技术方向如何一点点变得具体，而不是把课程名换成一面标签墙。
        </p>

        <div className="mt-12 grid gap-10 xl:grid-cols-[1.08fr_0.92fr] xl:items-start xl:gap-12">
          <div className="xl:sticky xl:top-28">
            <ResearchArchive activeEntry={activeEntry} />
          </div>
          <ol className="border-t border-[#181914]/20">
            {cstdLearningPath.map((entry) => {
              const isActive = entry.year === activeEntry.year;
              return (
                <motion.li
                  key={entry.year}
                  data-cstd-learning-step={entry.year}
                  data-cstd-learning-active={isActive ? "true" : "false"}
                  aria-current={isActive ? "step" : undefined}
                  onViewportEnter={() => setActiveYear(entry.year)}
                  viewport={{ amount: 0.58, margin: "-8% 0px -28% 0px" }}
                  animate={{ x: isActive && !reducedMotion ? 8 : 0 }}
                  transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 27 }}
                  className={`relative grid min-h-[150px] grid-cols-[76px_1fr] gap-4 overflow-hidden border-b border-[#181914]/20 px-3 py-6 transition-colors duration-500 sm:grid-cols-[94px_1fr] sm:gap-6 sm:px-5 ${
                    isActive ? "bg-white/55" : "bg-transparent"
                  }`}
                >
                  <motion.span
                    aria-hidden="true"
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 top-0 w-1 origin-center bg-[#276eae] motion-reduce:!transform-none"
                  />
                  <p className={`text-xl font-black transition-colors duration-500 sm:text-2xl ${isActive ? "text-[#276eae]" : "text-[#66786e]"}`}>
                    {entry.year}
                  </p>
                  <div>
                    <h3 className="text-base font-black sm:text-lg">{entry.title}</h3>
                    <p className="mt-1 text-sm font-bold text-[#2c6254]">{entry.focus}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#59655e]">{entry.note}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function ResearchArchive({ activeEntry }: { activeEntry: CstdLearningEntry }) {
  const reducedMotion = useReducedMotion();
  const activeIndex = Math.max(0, cstdLearningPath.findIndex((entry) => entry.year === activeEntry.year));
  const activeMaterial = archiveMaterials[activeIndex % archiveMaterials.length];

  return (
    <figure
      data-cstd-research-state={activeEntry.year}
      className="relative aspect-[4/5] max-h-[720px] overflow-hidden border border-[#181914]/20 bg-[#f8f2df] shadow-[14px_16px_0_rgba(24,25,20,0.12)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeMaterial.id}
          className="absolute inset-0"
          initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 1.025 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -16, scale: 0.99 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={activeMaterial.src}
            alt={activeMaterial.alt}
            fill
            sizes="(min-width: 1280px) 42vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute left-5 top-5 border border-[#181914]/20 bg-[#f8f2df]/92 px-3 py-2 text-[10px] font-black text-[#181914] backdrop-blur-sm sm:left-7 sm:top-7">
        RESEARCH LOG / {activeEntry.year}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figcaption
          key={activeEntry.year}
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 border border-[#181914]/20 bg-[#f4bd3f]/95 px-4 py-3 text-[#181914] shadow-[6px_7px_0_rgba(24,25,20,0.14)] backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:px-5 sm:py-4"
        >
          <span className="text-3xl font-black sm:text-4xl">{activeEntry.year}</span>
          <span className="max-w-[68%] text-right text-[10px] font-black leading-4 sm:text-xs">{activeEntry.focus}</span>
        </motion.figcaption>
      </AnimatePresence>
    </figure>
  );
}

function ChapterRail({
  activeChapter,
  visualChapter,
}: {
  activeChapter: ChapterId | null;
  visualChapter: VisualChapter;
}) {
  const isDarkSurface = visualChapter === "proof";

  return (
    <nav
      aria-label="章节导航"
      data-cstd-rail-theme={visualChapter}
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 xl:block"
    >
      <div className={`border-l px-3 py-2 ${isDarkSurface ? "border-white/28 text-white" : "border-[#181914]/25 text-[#181914]"}`}>
        {chapters.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <a
              key={chapter.id}
              data-cstd-chapter={chapter.id}
              href={`#${chapter.id}`}
              aria-label={`${chapter.index} ${chapter.label}`}
              aria-current={isActive ? "location" : undefined}
              className={`group my-3 block min-w-16 py-1 text-right no-underline transition-transform ${isActive ? "translate-x-0" : "translate-x-2 opacity-55 hover:translate-x-0 hover:opacity-100"}`}
            >
              <span className={`block text-sm font-black ${isActive ? "text-[#f4bd3f]" : "text-current"}`}>{chapter.index}</span>
              <span className="mt-0.5 block text-[10px] font-bold">{chapter.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
