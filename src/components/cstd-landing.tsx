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
  useMotionTemplate,
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
  type CstdProof,
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

const systemNodePositions: Record<CstdSystem["id"], { left: string; top: string }> = {
  "product-surfaces": { left: "39%", top: "27%" },
  "edge-operations": { left: "76%", top: "28%" },
  "ai-creation": { left: "57%", top: "47%" },
  "research-models": { left: "36%", top: "65%" },
  "data-systems": { left: "78%", top: "66%" },
};

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
      { rootMargin: "-28% 0px -56% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeChapter;
}

export function CstdLanding() {
  const reducedMotion = useReducedMotion();
  const activeChapter = useActiveChapter();
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 25,
    restDelta: 0.001,
  });
  const heroImageY = useTransform(scrollYProgress, [0, 0.2], [0, reducedMotion ? 0 : -46]);
  const heroCopyY = useTransform(scrollYProgress, [0, 0.18], [0, reducedMotion ? 0 : 54]);
  const heroScale = useTransform(scrollYProgress, [0, 0.24], [1.06, reducedMotion ? 1.06 : 1.14]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 130, damping: 24, mass: 0.45 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 130, damping: 24, mass: 0.45 });
  const heroImageX = useTransform(smoothPointerX, [-1, 1], reducedMotion ? [0, 0] : [-18, 18]);
  const heroImagePointerY = useTransform(smoothPointerY, [-1, 1], reducedMotion ? [0, 0] : [-10, 10]);
  const heroCopyX = useTransform(smoothPointerX, [-1, 1], reducedMotion ? [0, 0] : [7, -7]);
  const heroCopyPointerY = useTransform(smoothPointerY, [-1, 1], reducedMotion ? [0, 0] : [6, -6]);
  const telemetryX = useTransform(smoothPointerX, [-1, 1], reducedMotion ? [0, 0] : [-12, 12]);
  const telemetryY = useTransform(smoothPointerY, [-1, 1], reducedMotion ? [0, 0] : [-8, 8]);
  const telemetryTransform = useMotionTemplate`translate3d(${telemetryX}px, ${telemetryY}px, 0)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e7] text-[#181914]">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-[#f4bd3f]"
        style={{ scaleX: progressScale }}
      />

      <ChapterRail activeChapter={activeChapter} reducedMotion={reducedMotion} />

      <header className="sticky top-0 z-50 border-b border-[#181914]/15 bg-[#f3f0e7]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1520px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            aria-label="返回 CSTD 首页顶部"
            className="inline-flex items-center gap-3 text-sm font-black text-[#181914] no-underline"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#f4bd3f] text-[11px] font-black">
              CS
            </span>
            <span>CSTD</span>
          </a>

          <nav aria-label="主导航" className="flex items-center gap-1 sm:gap-3">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                aria-current={activeChapter === chapter.id ? "location" : undefined}
                className={`relative px-2 py-2 text-xs font-bold no-underline transition-colors sm:px-3 sm:text-sm ${
                  activeChapter === chapter.id ? "text-[#181914]" : "text-[#625e52] hover:text-[#181914]"
                }`}
              >
                {chapter.label}
                {activeChapter === chapter.id ? (
                  <motion.span
                    layoutId="cstd-header-chapter"
                    className="absolute inset-x-2 -bottom-[1px] h-0.5 bg-[#276eae] sm:inset-x-3"
                    transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
                  />
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section
        id="top"
        data-cstd-hero
        aria-labelledby="cstd-hero-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        className="relative isolate h-[calc(100svh-4rem)] min-h-[660px] max-h-[960px] overflow-hidden bg-[#10120f] text-white"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 will-change-transform motion-reduce:!transform-none"
          style={{ scale: heroScale, y: heroImageY }}
        >
          <motion.div
            data-cstd-hero-depth
            className="absolute inset-[-2%] motion-reduce:!transform-none"
            style={{ x: heroImageX, y: heroImagePointerY }}
          >
            <Image
              src="/cstd-systems-hero-v1.png"
              alt=""
              fill
              loading="eager"
              sizes="100vw"
              className="object-cover object-[62%_center]"
            />
          </motion.div>
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#10120f]/[0.54]" />

        <motion.div
          aria-hidden="true"
          className="absolute right-[5%] top-[13%] z-[5] hidden h-44 w-64 border border-[#f9eccd]/35 bg-[#10120f]/25 p-4 text-[#f9eccd] backdrop-blur-sm motion-reduce:!transform-none lg:block"
          style={{ transform: telemetryTransform }}
        >
          <div className="flex items-center justify-between text-[10px] font-black">
            <span>SYSTEM SIGNAL</span>
            <motion.span
              className="h-2 w-2 rounded-full bg-[#f4bd3f]"
              animate={reducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-9 grid grid-cols-3 gap-3 border-t border-[#f9eccd]/30 pt-4">
            {[
              ["05", "systems"],
              ["03", "shipped"],
              ["02", "research"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-[9px] font-bold uppercase text-white/55">{label}</p>
              </div>
            ))}
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-[#f4bd3f]"
            initial={{ width: "18%" }}
            animate={reducedMotion ? undefined : { width: ["18%", "74%", "38%"] }}
            transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto flex h-full max-w-[1520px] flex-col justify-between px-5 py-9 motion-reduce:!transform-none sm:px-8 sm:py-12 lg:px-12 lg:py-14"
          style={{ y: heroCopyY }}
        >
          <motion.div
            className="flex h-full flex-col justify-between motion-reduce:!transform-none"
            style={{ x: heroCopyX, y: heroCopyPointerY }}
          >
          <div className="flex items-center gap-3 text-xs font-bold text-[#f9eccd]">
            <span className="h-px w-9 bg-[#f4bd3f]" />
            CSTD / CREATIVE SYSTEMS LAB
          </div>

          <div className="max-w-[760px] pb-5">
            <p className="text-sm font-bold text-[#f4bd3f] sm:text-base">
              奶黄包的个人技术工作室
            </p>
            <h1
              id="cstd-hero-title"
              className="mt-5 text-7xl font-black leading-[0.82] text-white sm:text-8xl lg:text-[9.5rem]"
            >
              <span className="sr-only">CSTD</span>
              <span aria-hidden="true" className="flex overflow-hidden">
                {["C", "S", "T", "D"].map((letter, index) => (
                  <motion.span
                    key={letter}
                    className="motion-reduce:!transform-none"
                    initial={reducedMotion ? false : { y: "115%", rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 95, damping: 16, delay: 0.12 + index * 0.07 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </h1>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-2xl text-2xl font-semibold leading-9 text-white motion-reduce:!transform-none motion-reduce:!opacity-100 sm:text-3xl sm:leading-[1.28]"
            >
              把产品、数据、AI 和系统，慢慢做成能用的东西。
            </motion.p>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
              <a
                href="#systems"
                className="inline-flex min-h-12 items-center gap-3 rounded-md bg-[#f4bd3f] px-5 py-3 text-sm font-black text-[#181914] no-underline transition-transform hover:-translate-y-1"
              >
                看系统
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm font-semibold text-white/75">南京 / 独立开发 / 持续交付</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 border-t border-white/25 pt-5 text-xs font-semibold text-white/72 sm:flex-row sm:items-end sm:text-sm">
            <p className="max-w-xl leading-6">
              不是作品数量的陈列，而是从界面、数据到运行系统的长期练习。
            </p>
            <p className="font-bold text-[#f9eccd]">2022 - 2026</p>
          </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="systems" aria-labelledby="systems-heading" className="scroll-mt-20 bg-[#f3f0e7]">
        <div className="mx-auto max-w-[1520px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-black text-[#6f6758]">01 / SYSTEMS</p>
              <h2
                id="systems-heading"
                className="mt-5 max-w-2xl text-5xl font-black leading-[1.02] text-[#181914] sm:text-6xl lg:text-7xl"
              >
                把技术藏在
                <br />
                能用的东西里。
              </h2>
            </div>
            <p className="max-w-2xl text-lg font-semibold leading-8 text-[#625e52] sm:text-xl sm:leading-9 lg:justify-self-end">
              从产品表面开始，延伸到边缘服务、AI 工作流和数据研究。每一层都保持真实边界，
              也给下一层留下继续生长的空间。
            </p>
          </div>

          <SystemMap />

          <div className="mt-16 border-t border-[#181914]/20 lg:mt-20">
            {cstdSystems.map((system, index) => (
              <SystemRow key={system.id} system={system} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="proof" aria-labelledby="proof-heading" className="scroll-mt-20 bg-[#171a16] text-white">
        <div className="mx-auto max-w-[1520px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-8 border-b border-white/20 pb-12 lg:grid-cols-[0.85fr_1.15fr] lg:pb-16">
            <div>
              <p className="text-xs font-black text-[#f4bd3f]">02 / SELECTED PROOF</p>
              <h2
                id="proof-heading"
                className="mt-5 max-w-2xl text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl"
              >
                三个已上线的
                <br />
                系统切面。
              </h2>
            </div>
            <p className="max-w-2xl self-end text-lg font-semibold leading-8 text-white/70 sm:text-xl sm:leading-9 lg:justify-self-end">
              只挑出足以说明方法的三件事。它们不是完整案例复盘，而是正在运行的、可直接抵达的证据。
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
            {proofEntries.map(({ proof, project }, index) => (
              <ProofCard key={proof.projectId} proof={proof} project={project} index={index} />
            ))}
          </div>

          <div className="mt-16 border-t border-white/20 pt-7 lg:mt-20 lg:pt-9">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm font-black text-[#f9eccd]">另外两件仍在线的作品</p>
              <p className="text-sm font-semibold text-white/60">影像表达 / 私有创作流程</p>
            </div>
            <ul className="mt-5 grid border-t border-white/20 sm:grid-cols-2">
              {liveObjects.map((project) => {
                const targetProps = getCstdLinkTargetProps(project.href);
                return (
                  <li
                    data-cstd-live-object={project.id}
                    key={project.id}
                    className="border-b border-white/20 sm:odd:border-r"
                  >
                    <a
                      href={project.href}
                      {...targetProps}
                      className="group flex min-h-20 items-center justify-between gap-5 px-1 py-5 text-white no-underline"
                    >
                      <span>
                        <span className="block text-base font-black">{project.title}</span>
                        <span className="mt-1 block text-xs font-semibold text-white/58">{project.kicker}</span>
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-[#f4bd3f] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="path" aria-labelledby="path-heading" className="scroll-mt-20 bg-[#e5efe9] text-[#181914]">
        <div className="mx-auto max-w-[1520px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16">
            <ResearchArchive />

            <div>
              <p className="text-xs font-black text-[#2c6254]">03 / RESEARCH PATH</p>
              <h2
                id="path-heading"
                className="mt-5 max-w-xl text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl"
              >
                深度来自
                <br />
                反复做过的练习。
              </h2>
              <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-[#4e5d55] sm:text-xl sm:leading-9">
                产品交付和研究训练并行发生。这里记录的是技术方向如何一点点变得具体，
                不是把课程名换成一面标签墙。
              </p>

              <ol className="mt-10 border-t border-[#181914]/20">
                {cstdLearningPath.map((entry) => (
                  <li key={entry.year} className="grid grid-cols-[74px_1fr] gap-4 border-b border-[#181914]/20 py-5 sm:grid-cols-[92px_1fr] sm:gap-6">
                    <p className="text-xl font-black text-[#276eae] sm:text-2xl">{entry.year}</p>
                    <div>
                      <h3 className="text-base font-black sm:text-lg">{entry.title}</h3>
                      <p className="mt-1 text-sm font-bold text-[#2c6254]">{entry.focus}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#59655e]">{entry.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#181914] bg-[#f4bd3f] text-[#181914]">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-7 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-md border border-[#181914]/20 bg-[#f8efcf] p-2">
              <Image
                src="/cstd-mascot.svg"
                alt=""
                width={40}
                height={40}
                className="h-auto w-full"
              />
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

function ChapterRail({
  activeChapter,
  reducedMotion,
}: {
  activeChapter: ChapterId | null;
  reducedMotion: boolean;
}) {
  return (
    <nav
      aria-label="章节导航"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-center gap-5 py-3">
        <span aria-hidden="true" className="absolute bottom-5 top-5 w-px bg-[#181914]/20" />
        {chapters.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <a
              key={chapter.id}
              data-cstd-chapter={chapter.id}
              href={`#${chapter.id}`}
              aria-label={`${chapter.index} ${chapter.label}`}
              aria-current={isActive ? "location" : undefined}
              className="group relative grid h-8 w-8 place-items-center text-[#181914] no-underline"
            >
              <span
                className={`relative z-10 block h-2.5 w-2.5 rounded-full border transition-colors ${
                  isActive
                    ? "border-[#181914] bg-[#f4bd3f]"
                    : "border-[#181914]/45 bg-[#f3f0e7] group-hover:border-[#181914]"
                }`}
              />
              {isActive ? (
                <motion.span
                  layoutId="cstd-chapter-rail"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[#181914]/35 bg-[#f3f0e7]/85"
                  transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 250, damping: 26 }}
                />
              ) : null}
              <span className="pointer-events-none absolute right-9 whitespace-nowrap border border-[#181914]/15 bg-[#f3f0e7] px-2 py-1 text-[10px] font-black opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {chapter.index} / {chapter.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function SystemMap() {
  const reducedMotion = useReducedMotion();
  const mapRef = useRef<HTMLElement>(null);
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(cstdSystems[0].id);
  const activeSystem = cstdSystems.find((system) => system.id === activeSystemId) ?? cstdSystems[0];
  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [34, -34]);

  return (
    <div
      role="group"
      aria-label="技术系统图"
      className="relative mt-14 lg:mt-20"
    >
      <figure
        ref={mapRef}
        className="relative aspect-[3/2] overflow-hidden rounded-md border border-[#181914]/20 bg-[#dbece3] shadow-[16px_18px_0_rgba(24,25,20,0.12)]"
      >
        <motion.div className="absolute inset-[-6%] will-change-transform motion-reduce:!transform-none" style={{ y: mediaY }}>
          <Image
            src="/cstd-systems-map-v1.png"
            alt="由产品、边缘服务、AI、研究与数据五种模块组成的实体系统材料图"
            fill
            sizes="(min-width: 1024px) 92vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 border-[10px] border-[#f3f0e7]/45 sm:border-[18px]" />

        <div className="absolute inset-0 hidden lg:block">
          {cstdSystems.map((system, index) => {
            const Icon = systemIcons[system.icon];
            const isActive = activeSystemId === system.id;
            return (
              <div
                key={system.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={systemNodePositions[system.id]}
              >
                <motion.button
                  type="button"
                  data-cstd-atlas-node={system.id}
                  aria-label={`${system.title}：${system.summary}`}
                  aria-pressed={activeSystemId === system.id}
                  onClick={() => setActiveSystemId(system.id)}
                  onFocus={() => setActiveSystemId(system.id)}
                  onMouseEnter={() => setActiveSystemId(system.id)}
                  whileHover={reducedMotion ? undefined : { scale: 1.12 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                  className={`relative grid h-11 w-11 place-items-center rounded-full border text-sm shadow-[0_5px_18px_rgba(24,25,20,0.22)] backdrop-blur-md transition-colors ${
                    isActive
                      ? "border-[#181914] bg-[#f4bd3f] text-[#181914]"
                      : "border-white/75 bg-[#f3f0e7]/85 text-[#181914] hover:bg-white"
                  }`}
                >
                  <Icon className="relative z-10 h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">0{index + 1}</span>
                  {isActive && !reducedMotion ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-[-7px] rounded-full border border-[#181914]/35"
                      animate={{ scale: [0.9, 1.35], opacity: [0.8, 0] }}
                      transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                    />
                  ) : null}
                </motion.button>
              </div>
            );
          })}
        </div>
      </figure>

      <div className="mt-5 flex snap-x gap-2 overflow-x-auto pb-2 lg:hidden">
        {cstdSystems.map((system, index) => {
          const Icon = systemIcons[system.icon];
          const isActive = activeSystemId === system.id;
          return (
            <button
              key={system.id}
              type="button"
              data-cstd-atlas-node={system.id}
              aria-label={`${system.title}：${system.summary}`}
              aria-pressed={activeSystemId === system.id}
              onClick={() => setActiveSystemId(system.id)}
              onFocus={() => setActiveSystemId(system.id)}
              className={`flex min-w-[124px] snap-start items-center gap-2 rounded-md border px-3 py-3 text-left text-xs font-black transition-colors ${
                isActive
                  ? "border-[#181914] bg-[#f4bd3f] text-[#181914]"
                  : "border-[#181914]/20 bg-[#f8f5ed] text-[#4f584e]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              0{index + 1} / {system.title}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSystem.id}
          data-cstd-atlas-detail={activeSystem.id}
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.985 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 border border-[#181914]/20 bg-[#f3f0e7]/95 p-5 shadow-[8px_10px_0_rgba(24,25,20,0.12)] backdrop-blur-md lg:absolute lg:left-8 lg:top-8 lg:mt-0 lg:w-[330px] lg:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] font-black text-[#276eae]">
              SYSTEM {String(cstdSystems.indexOf(activeSystem) + 1).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-black text-[#2c6254]">
              {activeSystem.track === "shipped" ? "LIVE" : "RESEARCH"}
            </p>
          </div>
          <p className="mt-4 text-2xl font-black leading-[1.08] text-[#181914]">{activeSystem.title}</p>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#50594f]">{activeSystem.summary}</p>
          <p className="mt-5 border-t border-[#181914]/15 pt-4 text-xs font-black leading-5 text-[#181914]">
            {activeSystem.stack.join(" / ")}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SystemRow({ system, index }: { system: CstdSystem; index: number }) {
  const reducedMotion = useReducedMotion();
  const Icon = systemIcons[system.icon];

  return (
    <motion.article
      data-cstd-system={system.id}
      aria-labelledby={`system-${system.id}-title`}
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reducedMotion ? undefined : { x: 6 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 160, damping: 23, delay: index * 0.035 }}
      className={`group relative grid overflow-hidden gap-7 border-b border-[#181914]/20 px-1 py-9 motion-reduce:!transform-none motion-reduce:!opacity-100 sm:px-4 lg:grid-cols-[112px_0.9fr_1.1fr] lg:items-start lg:gap-10 lg:px-6 lg:py-11 ${
        index % 2 === 1 ? "bg-[#e7eee7]" : "bg-transparent"
      }`}
    >
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-1 origin-top bg-[#276eae] motion-reduce:!transform-none"
        initial={reducedMotion ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.7, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="flex items-center gap-4 lg:block">
        <p className="text-sm font-black text-[#276eae]">0{index + 1}</p>
        <span className="mt-3 grid h-11 w-11 place-items-center rounded-md bg-[#181914] text-[#f4bd3f] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none lg:mt-5">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div>
        <p className="text-xs font-black text-[#2c6254]">
          {system.track === "shipped" ? "已上线交付" : "课程与研究"}
        </p>
        <h3 id={`system-${system.id}-title`} className="mt-3 text-3xl font-black leading-[1.08] transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none sm:text-4xl">
          {system.title}
        </h3>
      </div>

      <div>
        <p className="max-w-xl text-base font-semibold leading-7 text-[#4f584e] sm:text-lg sm:leading-8">
          {system.summary}
        </p>
        <p className="mt-5 border-l-2 border-[#f4bd3f] pl-4 text-sm font-bold leading-6 text-[#5e655b]">
          {system.evidence}
        </p>
        <p className="mt-5 text-sm font-black leading-6 text-[#181914]">{system.stack.join(" / ")}</p>
      </div>
    </motion.article>
  );
}

function ProofCard({
  proof,
  project,
  index,
}: {
  proof: CstdProof;
  project: (typeof proofProjects)[number] | undefined;
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 190, damping: 24, mass: 0.55 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 190, damping: 24, mass: 0.55 });
  const imageX = useTransform(smoothRotateY, [-6, 6], [-8, 8]);
  const imageY = useTransform(smoothRotateX, [-5, 5], [7, -7]);
  if (!project || !project.preview) return null;

  const targetProps = getCstdLinkTargetProps(project.href);
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const localY = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(localX * 12);
    rotateX.set(localY * -10);
  };
  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      data-cstd-proof={proof.projectId}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reducedMotion ? undefined : { y: -10 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: index * 0.06 }}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformPerspective: 1200 }}
      className="group overflow-hidden rounded-md border border-white/20 bg-[#20241f] shadow-[11px_14px_0_rgba(0,0,0,0.2)] motion-reduce:!transform-none motion-reduce:!opacity-100 [transform-style:preserve-3d]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f0e7]">
        <motion.div className="absolute inset-[-3%] motion-reduce:!transform-none" style={{ x: imageX, y: imageY }}>
          <Image
            src={project.preview.src}
            alt={project.preview.alt}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
            style={{ objectPosition: project.preview.position ?? "center top" }}
          />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 origin-left bg-[#f4bd3f] motion-reduce:!transform-none"
          initial={{ scaleX: 0.28 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.8, delay: 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="relative z-10 px-6 py-7 sm:px-7 sm:py-8">
        <p className="text-xs font-black text-[#f4bd3f]">0{index + 1} / {proof.lens}</p>
        <h3 className="mt-4 text-2xl font-black leading-[1.08]">{project.title}</h3>
        <p className="mt-4 text-base font-black leading-7 text-[#f9eccd]">{proof.statement}</p>
        <p className="mt-4 text-sm font-semibold leading-6 text-white/65">{proof.detail}</p>
        <a
          href={project.href}
          {...targetProps}
          className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[#f4bd3f] pb-1 text-sm font-black text-white no-underline transition-colors hover:text-[#f4bd3f]"
        >
          {project.action}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

function ResearchArchive() {
  const reducedMotion = useReducedMotion();
  const archiveRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: archiveRef,
    offset: ["start end", "end start"],
  });
  const archiveY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [28, -28]);

  return (
    <figure
      ref={archiveRef}
      className="relative aspect-[3/2] overflow-hidden rounded-md border border-[#181914]/20 bg-[#f8f2df] shadow-[16px_18px_0_rgba(24,25,20,0.12)]"
    >
      <motion.div className="absolute inset-[-5%] will-change-transform motion-reduce:!transform-none" style={{ y: archiveY }}>
        <Image
          src="/cstd-research-archive-v1.png"
          alt="由计算笔记、数据玻璃板、模块化计算物件与蓝色数据流组成的研究档案材料图"
          fill
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 border-[10px] border-[#e5efe9]/45 sm:border-[18px]" />
      <div aria-hidden="true" className="absolute bottom-5 right-5 bg-[#f4bd3f] px-3 py-2 text-xs font-black text-[#181914] sm:bottom-8 sm:right-8">
        field notes
      </div>
    </figure>
  );
}
