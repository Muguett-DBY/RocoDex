"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Building2,
  Camera,
  ExternalLink,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getCstdLinkTargetProps } from "@/lib/cstd-link-target";
import {
  cstdProjects,
  type CstdProjectIconKey,
  type CstdProjectTone,
} from "@/lib/cstd-projects";
import {
  getCstdShowcaseProjects,
  type CstdShowcaseProject,
} from "@/lib/cstd-showcase";

const showcaseProjects = getCstdShowcaseProjects(cstdProjects);

const projectIcons: Record<CstdProjectIconKey, LucideIcon> = {
  sparkles: Sparkles,
  camera: Camera,
  "trending-up": TrendingUp,
  bot: Bot,
  building: Building2,
  rotate: Sparkles,
};

const projectPalettes: Record<
  CstdProjectTone,
  {
    section: string;
    eyebrow: string;
    accent: string;
    frame: string;
    chrome: string;
    button: string;
    buttonHover: string;
    border: string;
  }
> = {
  mint: {
    section: "bg-[#151814] text-[#f5f4ed]",
    eyebrow: "text-[#b7f4ca]",
    accent: "bg-[#b7f4ca] text-[#10150f]",
    frame: "bg-[#b7f4ca]",
    chrome: "bg-[#effce9] text-[#1d2a20]",
    button: "bg-[#b7f4ca] text-[#10150f]",
    buttonHover: "hover:bg-[#d4ffe0]",
    border: "border-white/20",
  },
  rose: {
    section: "bg-[#f3c9cf] text-[#24171a]",
    eyebrow: "text-[#9c2943]",
    accent: "bg-[#ed5d78] text-white",
    frame: "bg-[#ed5d78]",
    chrome: "bg-[#fff4f5] text-[#4a2029]",
    button: "bg-[#211619] text-white",
    buttonHover: "hover:bg-[#4c202b]",
    border: "border-[#24171a]/25",
  },
  teal: {
    section: "bg-[#1849d6] text-white",
    eyebrow: "text-[#b9f2ee]",
    accent: "bg-[#b9f2ee] text-[#102e4b]",
    frame: "bg-[#b9f2ee]",
    chrome: "bg-[#f2ffff] text-[#143e5f]",
    button: "bg-[#f7c84b] text-[#17130c]",
    buttonHover: "hover:bg-[#ffe082]",
    border: "border-white/25",
  },
  violet: {
    section: "bg-[#eeeae2] text-[#171512]",
    eyebrow: "text-[#5b45cc]",
    accent: "bg-[#6552d7] text-white",
    frame: "bg-[#6552d7]",
    chrome: "bg-[#fbfaf7] text-[#302b54]",
    button: "bg-[#171512] text-white",
    buttonHover: "hover:bg-[#6552d7]",
    border: "border-[#171512]/20",
  },
  amber: {
    section: "bg-[#f5c94f] text-[#17140d]",
    eyebrow: "text-[#764b00]",
    accent: "bg-[#17140d] text-[#f5c94f]",
    frame: "bg-[#17140d]",
    chrome: "bg-[#fff7dc] text-[#49350b]",
    button: "bg-[#17140d] text-white",
    buttonHover: "hover:bg-[#355c55]",
    border: "border-[#17140d]/25",
  },
  sky: {
    section: "bg-[#a9ddeb] text-[#10242b]",
    eyebrow: "text-[#15546a]",
    accent: "bg-[#15546a] text-white",
    frame: "bg-[#15546a]",
    chrome: "bg-[#eefbff] text-[#143d4b]",
    button: "bg-[#10242b] text-white",
    buttonHover: "hover:bg-[#15546a]",
    border: "border-[#10242b]/20",
  },
};

const studioNotes = [
  "先把问题看明白，再把界面做漂亮。",
  "真实上线，比停在概念图里更有意思。",
  "产品、影像、研究与工具，都可以有自己的性格。",
] as const;

export function CstdLanding() {
  const reducedMotion = useReducedMotion();
  const [activeProjectId, setActiveProjectId] = useState(showcaseProjects[0]?.project.id ?? "");
  const [studioNoteIndex, setStudioNoteIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  const heroImageY = useTransform(scrollYProgress, [0, 0.18], ["0%", reducedMotion ? "0%" : "8%"]);
  const heroCopyY = useTransform(scrollYProgress, [0, 0.14], [0, reducedMotion ? 0 : 70]);

  useEffect(() => {
    const sections = showcaseProjects
      .map(({ project }) => document.getElementById(`project-${project.id}`))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visibleEntry) {
          setActiveProjectId(visibleEntry.target.id.replace("project-", ""));
        }
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f2f0e9] text-[#171512]">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-[#f6c84f]"
        style={{ scaleX: progressScale }}
      />

      <header className="sticky top-0 z-50 border-b border-black/15 bg-[#f2f0e9]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            className="inline-flex items-center gap-3 text-sm font-black text-[#171512] no-underline"
            aria-label="返回 CSTD 首页顶部"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#f6c84f] text-xs">
              CS
            </span>
            <span>CSTD</span>
          </a>

          <nav aria-label="主导航" className="flex items-center gap-1 sm:gap-3">
            <a
              href="#work"
              className="px-3 py-2 text-sm font-bold text-[#4c463d] no-underline transition-colors hover:text-black"
            >
              作品
            </a>
            <a
              href="#studio"
              className="px-3 py-2 text-sm font-bold text-[#4c463d] no-underline transition-colors hover:text-black"
            >
              关于
            </a>
          </nav>
        </div>
      </header>

      <section
        id="top"
        aria-labelledby="cstd-hero-title"
        className="relative isolate h-[calc(100svh-7rem)] min-h-[620px] max-h-[900px] overflow-hidden bg-[#11110f] text-white"
      >
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <Image
            src="/cstd-studio-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.08] object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/25" />

        <motion.div
          className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14"
          style={{ y: heroCopyY }}
        >
          <div className="flex items-center gap-3 text-xs font-bold uppercase text-white/80">
            <span className="h-px w-10 bg-[#f6c84f]" />
            Independent product studio
          </div>

          <div className="max-w-[760px] pb-8">
            <p className="mb-4 text-sm font-bold text-[#f6c84f] sm:text-base">
              产品设计 · 全栈开发 · 影像创作
            </p>
            <h1
              id="cstd-hero-title"
              className="text-[clamp(5rem,13vw,12rem)] font-black leading-[0.78] tracking-normal text-white"
            >
              CSTD
            </h1>
            <p className="mt-8 max-w-2xl text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10">
              把想法做成，可以打开的东西。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center gap-3 rounded-md bg-[#f6c84f] px-5 py-3 text-sm font-black text-[#171512] no-underline transition-transform hover:-translate-y-1"
              >
                看五个作品
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm font-semibold text-white/75">
                南京 · 独立开发 · 持续上线
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-8 border-t border-white/30 pt-5">
            <p className="max-w-md text-xs font-semibold leading-5 text-white/70 sm:text-sm">
              从游戏数据、人物摄影到投资研究、AI 创作与业务系统。
            </p>
            <p className="hidden text-right text-xs font-bold uppercase text-white/60 md:block">
              Scroll to explore · 2026
            </p>
          </div>
        </motion.div>
      </section>

      <div
        aria-label="作品关键词"
        className="overflow-hidden border-y border-black bg-[#f6c84f] py-4 text-[#171512]"
      >
        <motion.div
          className="flex w-max items-center gap-8 whitespace-nowrap text-sm font-black uppercase"
          animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 28, ease: "linear", repeat: Number.POSITIVE_INFINITY }
          }
        >
          {[0, 1].map((setIndex) => (
            <div className="flex items-center gap-8" key={setIndex} aria-hidden={setIndex === 1}>
              {[
                "Data products",
                "Portrait stories",
                "Investment research",
                "AI creation",
                "Business systems",
              ].map((label) => (
                <span className="flex items-center gap-8" key={`${setIndex}-${label}`}>
                  {label}
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <section id="work" aria-labelledby="work-heading" className="bg-[#f2f0e9]">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
          <div>
            <p className="text-xs font-black uppercase text-[#6e6558]">Selected work / 01-05</p>
            <h2
              id="work-heading"
              className="mt-5 max-w-xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl"
            >
              五个正在
              <br />
              真实运行的产品
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-2xl text-lg font-semibold leading-8 text-[#5d554a] sm:text-xl sm:leading-9">
              不展示虚构概念，也不让你在作品集里做复杂选择。每一屏只讲一件已经交付的作品，
              看见它、理解它，然后直接进入它。
            </p>
          </div>
        </div>

        <ShowcaseIndex activeProjectId={activeProjectId} />

        <div>
          {showcaseProjects.map((item, index) => (
            <ProjectShowcase key={item.project.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <section
        id="studio"
        aria-labelledby="studio-heading"
        className="relative overflow-hidden bg-[#151513] text-white"
      >
        <div className="mx-auto grid min-h-[660px] max-w-[1600px] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-28">
          <motion.div
            className="relative mx-auto w-full max-w-[620px]"
            animate={
              reducedMotion
                ? undefined
                : {
                    rotate: studioNoteIndex % 2 === 0 ? -2 : 2,
                    y: studioNoteIndex % 2 === 0 ? 0 : -12,
                  }
            }
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          >
            <div className="absolute -left-5 -top-5 h-full w-full rounded-lg bg-[#1d54e8]" />
            <div className="absolute -bottom-5 -right-5 h-full w-full rounded-lg bg-[#ed5d78]" />
            <div className="relative flex aspect-square items-center justify-center rounded-lg border border-white/20 bg-[#f6c84f] p-10">
              <Image
                src="/cstd-mascot.svg"
                alt="CSTD 奶黄包吉祥物"
                width={520}
                height={520}
                className="h-auto w-full drop-shadow-[16px_18px_0_rgba(0,0,0,0.18)]"
              />
            </div>
          </motion.div>

          <div className="lg:pl-12">
            <p className="text-xs font-black uppercase text-[#f6c84f]">Inside the studio</p>
            <h2
              id="studio-heading"
              className="mt-5 max-w-2xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl"
            >
              不是某一种风格，
              <br />
              是把每个问题做成它该有的样子。
            </h2>
            <motion.p
              key={studioNoteIndex}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 max-w-xl text-xl font-semibold leading-9 text-white/75"
              aria-live="polite"
            >
              {studioNotes[studioNoteIndex]}
            </motion.p>
            <button
              type="button"
              onClick={() =>
                setStudioNoteIndex((current) => (current + 1) % studioNotes.length)
              }
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-md border border-white/35 px-5 py-3 text-sm font-black text-white transition-colors hover:border-[#f6c84f] hover:bg-[#f6c84f] hover:text-[#171512]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              再碰一下奶黄包
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black bg-[#f2f0e9] text-[#171512]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
          <div>
            <p className="text-3xl font-black">CSTD</p>
            <p className="mt-2 text-sm font-semibold text-[#6e6558]">
              Made with custard by custard.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {showcaseProjects.map(({ project }) => {
              const targetProps = getCstdLinkTargetProps(project.href);
              return (
                <a
                  key={project.id}
                  href={project.href}
                  {...targetProps}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#4c463d] no-underline transition-colors hover:text-black"
                >
                  {project.title}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </main>
  );
}

function ShowcaseIndex({ activeProjectId }: { activeProjectId: string }) {
  return (
    <nav
      aria-label="作品索引"
      className="sticky top-16 z-40 border-y border-black/20 bg-[#f2f0e9]/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1600px] overflow-x-auto px-5 sm:px-8 lg:px-12">
        {showcaseProjects.map(({ project, number }) => {
          const active = project.id === activeProjectId;
          return (
            <a
              key={project.id}
              href={`#project-${project.id}`}
              aria-current={active ? "true" : undefined}
              className={`group flex min-h-16 min-w-[180px] flex-1 items-center gap-3 border-r border-black/15 px-4 text-left no-underline transition-colors first:border-l ${
                active ? "bg-[#171512] text-white" : "text-[#4c463d] hover:bg-white"
              }`}
            >
              <span className={`text-xs font-black ${active ? "text-[#f6c84f]" : "text-[#8e8475]"}`}>
                {number}
              </span>
              <span className="truncate text-sm font-black">{project.title}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function ProjectShowcase({
  item,
  index,
}: {
  item: CstdShowcaseProject;
  index: number;
}) {
  const { project, number } = item;
  const palette = projectPalettes[project.tone];
  const Icon = projectIcons[project.icon];
  const reducedMotion = useReducedMotion();
  const mediaFirst = index % 2 === 1;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [50, -50],
  );
  const targetProps = getCstdLinkTargetProps(project.href);

  return (
    <article
      ref={sectionRef}
      id={`project-${project.id}`}
      data-cstd-project={project.id}
      aria-labelledby={`project-${project.id}-title`}
      className={`scroll-mt-32 border-b border-black/20 ${palette.section}`}
    >
      <div className="mx-auto grid min-h-[780px] max-w-[1600px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
        <motion.div
          className={mediaFirst ? "lg:order-2" : ""}
          style={{ y: mediaY }}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={reducedMotion ? undefined : { y: -8, rotate: mediaFirst ? 0.7 : -0.7 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className={`relative rounded-lg p-3 shadow-[18px_20px_0_rgba(0,0,0,0.16)] sm:p-4 ${palette.frame}`}
          >
            <div className="overflow-hidden rounded-md border border-black/30 bg-white">
              <div className={`flex h-10 items-center justify-between border-b border-black/15 px-4 ${palette.chrome}`}>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef5c62]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f2c84b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#58b979]" />
                </div>
                <span className="max-w-[70%] truncate text-[11px] font-bold">
                  {new URL(project.href).hostname}
                </span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden bg-white">
                <Image
                  src={project.preview.src}
                  alt={project.preview.alt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.025]"
                  style={{ objectPosition: project.preview.position ?? "center top" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={mediaFirst ? "lg:order-1" : ""}
          initial={reducedMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-4">
            <span className={`grid h-12 w-12 place-items-center rounded-md ${palette.accent}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className={`text-xs font-black uppercase ${palette.eyebrow}`}>
                {number} / {project.kicker}
              </p>
              <p className="mt-1 text-xs font-bold opacity-60">{project.evidence.current}</p>
            </div>
          </div>

          <h3
            id={`project-${project.id}-title`}
            className="mt-8 max-w-2xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl"
          >
            {project.title}
          </h3>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-8 opacity-75">
            {project.description}
          </p>

          <dl className={`mt-10 grid grid-cols-3 border-y ${palette.border}`}>
            {project.metrics.map(([value, label]) => (
              <div className={`border-r py-5 pr-3 last:border-r-0 ${palette.border}`} key={label}>
                <dt className="text-xl font-black sm:text-2xl">{value}</dt>
                <dd className="mt-1 text-xs font-bold opacity-60">{label}</dd>
              </div>
            ))}
          </dl>

          <div className={`mt-9 border-l-4 pl-5 ${palette.border}`}>
            <p className="text-xs font-black uppercase opacity-55">What changed</p>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-7 opacity-80">
              {project.evidence.outcome}
            </p>
          </div>

          <a
            href={project.href}
            {...targetProps}
            className={`mt-10 inline-flex min-h-12 items-center gap-3 rounded-md px-5 py-3 text-sm font-black no-underline transition-all hover:-translate-y-1 ${palette.button} ${palette.buttonHover}`}
          >
            {project.action}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </article>
  );
}
