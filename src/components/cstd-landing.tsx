"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { playCstdIntroSound } from "@/lib/cstd-intro-sound";
import {
  CSTD_MOTION_PREFERENCE_KEY,
  type CstdMotionPreference,
  getCstdIntroControlLabel,
  shouldPlayCstdIntro,
  shouldPlayCstdIntroReplay,
} from "@/lib/cstd-motion";
import {
  cstdHeaderNavClassName,
  cstdHeroActionsClassName,
  cstdHeroSectionClassName,
  cstdMascotAsideClassName,
  cstdMascotShellClassName,
  cstdNavLinkClassName,
  cstdPageShellClassName,
  cstdProjectCards,
  cstdProjectGridClassName,
} from "@/lib/cstd-mobile-layout";

type MascotMood = "curious" | "happy" | "working";
type CstdIntroPhase = "idle" | "playing";

const projects = [
  {
    title: "洛克图鉴 / RocoDex",
    kicker: cstdProjectCards[0].kicker,
    status: "Live",
    href: "https://rocodex.custard.top",
    action: "打开图鉴",
    softAction: "查看 PVP 阵容",
    softHref: "https://rocodex.custard.top/pvp-teams",
    icon: Sparkles,
    tone: "mint",
    description:
      "面向《洛克王国世界》的中文精灵资料库，支持搜索筛选、精灵对比、PVP 阵容探索、技能浏览和洛克性格测试。",
    metrics: [
      ["347", "只精灵"],
      ["402", "个形态"],
      ["PVP", "阵容与攻略"],
    ],
    tags: ["Next.js 16", "Tailwind", "Upstash Redis", "Cloudflare DNS"],
  },
  {
    title: "奶黄包摄影",
    kicker: cstdProjectCards[1].kicker,
    status: "Live",
    href: "https://shoot.custard.top",
    action: "查看摄影站",
    icon: Camera,
    tone: "rose",
    description:
      "南京女生写真与情侣约拍。柔雾胶片感、自然陪拍、江南感写真和情侣纪念，用清晰的套餐、作品展示和预约入口承载更温柔的拍摄体验。",
    metrics: [
      ["Portrait", "人像"],
      ["Nanjing", "城市"],
      ["Soft", "胶片感"],
    ],
    tags: ["Portrait", "Nanjing", "Cloudflare Pages"],
  },
  {
    title: "更多项目孵化中",
    kicker: cstdProjectCards[2].kicker,
    status: "Next",
    href: "#projects",
    action: "继续发酵",
    icon: RotateCcw,
    tone: "sky",
    description:
      "小工具、小动画、小交互和某些奇怪但有趣的灵感会先在这里冒泡，等它能被清楚使用时，再放进这个实验田。",
    metrics: [
      ["UI", "实验"],
      ["Motion", "动效"],
      ["Tiny", "小工具"],
    ],
    tags: ["Prototype", "Visual lab", "Cute systems"],
  },
] as const;

const noteItems = [
  ["02", "个在线项目"],
  ["347", "只精灵资料"],
  ["Motion", "可爱动效实验"],
] as const;

const CstdCustardStage = dynamic(
  () => import("@/components/cstd-custard-stage").then((module) => module.CstdCustardStage),
  {
    ssr: false,
    loading: () => (
      <div className={`${cstdMascotShellClassName} min-h-[286px] sm:min-h-[374px] lg:min-h-[486px]`}>
        <motion.img src="/cstd-mascot.svg" alt="" className="relative z-10 w-56 drop-shadow-[12px_14px_0_rgba(47,36,29,.1)] sm:w-72 lg:w-96" />
      </div>
    ),
  },
);

export function CstdLanding() {
  const reducedMotion = usePrefersReducedMotion();
  const initialized = useRef(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [introPhase, setIntroPhase] = useState<CstdIntroPhase>("idle");
  const [motionPreference, setMotionPreference] = useState<CstdMotionPreference>("enabled");
  const [mascotMood, setMascotMood] = useState<MascotMood>("curious");
  const prefersReducedMotion = reducedMotion ?? true;
  const motionDisabled = prefersReducedMotion;

  useEffect(() => {
    if (reducedMotion === null) return;
    if (initialized.current) return;
    initialized.current = true;

    const storedPreference = window.localStorage.getItem(CSTD_MOTION_PREFERENCE_KEY);
    const preference: CstdMotionPreference = storedPreference === "disabled" ? "disabled" : "enabled";
    const shouldShowIntro = shouldPlayCstdIntro({
      reducedMotion,
      motionPreference: preference,
    });
    setMotionPreference(preference);
    setIntroVisible(shouldShowIntro);
    setIntroPhase("idle");
  }, [reducedMotion]);

  useEffect(() => {
    if (!introVisible) return;
    if (introPhase !== "playing") return;
    const timer = window.setTimeout(() => {
      setIntroVisible(false);
      setIntroPhase("idle");
    }, 4300);

    return () => window.clearTimeout(timer);
  }, [introPhase, introVisible]);

  const mascotCopy = useMemo(() => {
    if (mascotMood === "happy") return "奶黄包收到了你的点击，正在加糖。";
    if (mascotMood === "working") return "奶黄包正在把项目烤得更香。";
    return "点一点奶黄包，它会给页面加一点甜。";
  }, [mascotMood]);

  function replayIntro() {
    const replayPreference: CstdMotionPreference = "enabled";
    const shouldReplayIntro = shouldPlayCstdIntroReplay({ reducedMotion: prefersReducedMotion, motionPreference: replayPreference });
    setMotionPreference(replayPreference);
    window.localStorage.setItem(CSTD_MOTION_PREFERENCE_KEY, replayPreference);
    if (shouldReplayIntro) beginIntroPlayback();
  }

  function toggleMotion() {
    const nextPreference: CstdMotionPreference = motionPreference === "disabled" ? "enabled" : "disabled";
    setMotionPreference(nextPreference);
    window.localStorage.setItem(CSTD_MOTION_PREFERENCE_KEY, nextPreference);
    if (nextPreference === "disabled") {
      setIntroVisible(false);
      setIntroPhase("idle");
    }
  }

  function beginIntroPlayback() {
    setIntroVisible(true);
    setIntroPhase("playing");
    void playCstdIntroSound();
  }

  function skipIntro() {
    setIntroVisible(false);
    setIntroPhase("idle");
  }

  function pokeMascot() {
    setMascotMood("happy");
    window.setTimeout(() => setMascotMood("working"), 900);
    window.setTimeout(() => setMascotMood("curious"), 2200);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fff6df] text-[#2f241d]">
      <AnimatePresence>{introVisible ? <CstdIntro phase={introPhase} onSkip={skipIntro} onStart={beginIntroPlayback} /> : null}</AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(47,36,29,.04) 1px, transparent 1px), linear-gradient(180deg, rgba(47,36,29,.04) 1px, transparent 1px), radial-gradient(circle at 75% 15%, rgba(255,231,236,.8), transparent 28%), radial-gradient(circle at 12% 72%, rgba(223,248,237,.9), transparent 30%), linear-gradient(135deg, #fffaf0 0%, #fff2c7 48%, #f9fff4 100%)",
          backgroundSize: "32px 32px, 32px 32px, auto, auto, auto",
        }}
      />
      <FloatingBits motionDisabled={motionDisabled} />

      <div className={cstdPageShellClassName}>
        <header className="flex flex-wrap items-center justify-between gap-4 py-5 sm:py-7">
          <Link href="https://custard.top/" className="group inline-flex items-center gap-3 no-underline" aria-label="CSTD 首页">
            <motion.span
              className="grid h-12 w-12 place-items-center rounded-xl border-2 border-[#2f241d] bg-[#f6bf3f] text-sm font-black shadow-[6px_6px_0_rgba(47,36,29,.12)]"
              whileHover={motionDisabled ? undefined : { rotate: -4, y: -2 }}
            >
              C
            </motion.span>
            <span>
              <span className="block text-base font-black tracking-[0.18em]">CSTD</span>
              <span className="mt-0.5 block text-xs font-semibold text-[#7b6656]">custard.top</span>
            </span>
          </Link>

          <nav className={cstdHeaderNavClassName} aria-label="项目导航">
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="https://rocodex.custard.top">RocoDex</NavLink>
            <NavLink href="https://shoot.custard.top">Photography</NavLink>
          </nav>
        </header>

        <section className={cstdHeroSectionClassName}>
          <motion.div
            initial={motionDisabled ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10"
          >
            <p className="font-black uppercase tracking-[0.22em] text-[#d98528]">Custard studio</p>
            <div className="mt-4 overflow-hidden">
              <motion.h1
                className="text-[clamp(3.45rem,20vw,5.4rem)] font-black leading-[0.8] tracking-[0.03em] text-[#2f241d] drop-shadow-[7px_7px_0_rgba(246,191,63,.34)] sm:text-[clamp(4.6rem,17vw,10rem)] sm:leading-[0.78] sm:drop-shadow-[9px_9px_0_rgba(246,191,63,.38)]"
                initial={motionDisabled ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.08, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
              >
                CSTD
              </motion.h1>
            </div>
            <motion.p
              className="mt-4 max-w-full break-all text-[clamp(1.45rem,7.4vw,2.25rem)] font-black leading-tight sm:mt-5 sm:max-w-3xl sm:text-[clamp(1.45rem,5.4vw,3.45rem)]"
              initial={motionDisabled ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
            >
              <span className="block">奶黄包的奇思</span>
              <span className="block">妙想实验田</span>
            </motion.p>
            <motion.p
              className="mt-4 max-w-full break-all text-sm leading-7 text-[#6f5b4a] sm:mt-5 sm:max-w-2xl sm:text-lg sm:leading-8"
              initial={motionDisabled ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              从一只软乎乎的奶黄包出发，孵化技术、设计、文化与游戏的混合实验。这里收纳正在生长的产品、视觉练习和小型工具，每个项目都带一点甜糯的手作痕迹。
            </motion.p>

            <motion.div
              className={cstdHeroActionsClassName}
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              <HeroButton href="#projects" primary>
                看项目
              </HeroButton>
              <HeroButton href="https://rocodex.custard.top">打开 RocoDex</HeroButton>
            </motion.div>

            <motion.div
              className="mt-5 grid max-w-2xl grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3"
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {noteItems.map(([value, label]) => (
                <div key={value} className="min-w-0 rounded-lg border border-dashed border-[#cdb58c] bg-white/65 p-3 shadow-[3px_3px_0_rgba(47,36,29,.05)]">
                  <strong className="block break-all text-lg font-black sm:text-2xl">{value}</strong>
                  <span className="mt-1 block text-[0.68rem] font-medium text-[#7b6656] sm:text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.aside
            className={cstdMascotAsideClassName}
            initial={motionDisabled ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            aria-label="奶黄包互动角色"
          >
            <motion.div
              className="absolute right-0 top-0 hidden rounded-xl border-2 border-[#2f241d] bg-[#ffe7ec] px-4 py-2 text-sm font-black text-[#be4563] shadow-[6px_6px_0_rgba(47,36,29,.12)] md:block"
              animate={motionDisabled ? undefined : { rotate: [5, 2, 5], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            >
              soft launch
            </motion.div>
            <motion.div
              className="absolute left-3 top-10 hidden rounded-xl border-2 border-[#2f241d] bg-[#dff8ed] px-4 py-2 text-sm font-black text-[#047857] shadow-[6px_6px_0_rgba(47,36,29,.12)] sm:block"
              animate={motionDisabled ? undefined : { rotate: [-5, -1, -5], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            >
              fresh build
            </motion.div>

            <CstdCustardStage
              mascotCopy={mascotCopy}
              mascotMood={mascotMood}
              motionDisabled={motionDisabled}
              onMoodChange={setMascotMood}
              onPoke={pokeMascot}
            />
          </motion.aside>
        </section>

        <section id="projects" className="pb-16 pt-2 sm:pb-24">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.18em] text-[#d98528]">Projects</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">正在发酵的项目</h2>
            </div>
            <MotionControls motionPreference={motionPreference} onToggle={toggleMotion} onReplay={replayIntro} />
          </div>

          <div className={cstdProjectGridClassName}>
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} motionDisabled={motionDisabled} />
            ))}
          </div>
        </section>

        <footer className="border-t border-[#ead6ad] py-8 text-center text-sm font-medium text-[#7b6656]">
          Made with <span className="font-black text-[#d98528]">custard</span> by custard · custard.top
        </footer>
      </div>
    </main>
  );
}

function CstdIntro({
  onSkip,
  onStart,
  phase,
}: {
  onSkip: () => void;
  onStart: () => void;
  phase: CstdIntroPhase;
}) {
  const introPlaying = phase === "playing";

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#fff4cf]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(246,191,63,.5), transparent 23%), radial-gradient(circle at 22% 70%, rgba(223,248,237,.85), transparent 28%), radial-gradient(circle at 78% 22%, rgba(255,231,236,.82), transparent 24%), linear-gradient(90deg, rgba(47,36,29,.05) 1px, transparent 1px), linear-gradient(180deg, rgba(47,36,29,.05) 1px, transparent 1px)",
          backgroundSize: "auto, 34px 34px, 34px 34px",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[-8%] top-[16%] h-24 w-[116%] rounded-full border-y border-[#ead6ad]/80 bg-white/20 blur-sm"
        animate={introPlaying ? { x: ["-8%", "9%", "-6%"], opacity: [0.2, 0.8, 0.18] } : { opacity: 0.28 }}
        transition={{ duration: 3.6, ease: "easeInOut" }}
      />
      {Array.from({ length: 18 }, (_, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="absolute rounded-sm border border-[#2f241d]/35 shadow-[4px_4px_0_rgba(47,36,29,.06)]"
          style={{
            background: ["#f6bf3f", "#dff8ed", "#ffe7ec", "#fffaf0"][index % 4],
            height: 8 + (index % 3) * 5,
            left: `${8 + ((index * 17) % 86)}%`,
            top: `${14 + ((index * 23) % 74)}%`,
            width: 8 + (index % 4) * 4,
          }}
          initial={{ opacity: 0, scale: 0.4, y: 16, rotate: -18 }}
          animate={
            introPlaying
              ? { opacity: [0, 0.95, 0], scale: [0.4, 1, 0.7], y: [16, -36 - (index % 4) * 20], rotate: [-18, 120 + index * 18] }
              : { opacity: 0 }
          }
          transition={{ delay: 1.95 + index * 0.025, duration: 1.35, ease: "easeOut" }}
        />
      ))}
      {introPlaying ? <IntroSoundWaves /> : null}
      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 top-5 rounded-full border border-[#ead6ad] bg-white/80 px-4 py-2 text-sm font-black text-[#7b6656] shadow-sm transition hover:border-[#d98528] hover:text-[#2f241d]"
      >
        跳过
      </button>
      <div className="relative grid w-[min(90vw,620px)] place-items-center">
        {introPlaying ? (
          <motion.div key="playing" className="relative min-h-[460px] w-full">
            <motion.div
              className="absolute left-1/2 top-[42%] z-30 -mt-[236px] -translate-x-1/2 rounded-full border border-[#f6bf3f]/70 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d98528] shadow-[6px_6px_0_rgba(47,36,29,.08)]"
              initial={{ opacity: 0, y: 8, scale: 0.88 }}
              animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8], scale: [0.88, 1.05, 1, 0.96] }}
              transition={{ duration: 1.45, ease: "easeOut" }}
            >
              已唤醒
            </motion.div>
            <motion.div
              className="absolute left-1/2 top-[42%] -ml-36 -mt-36 h-72 w-72 rounded-[40px] border-[10px] border-[#2f241d] bg-[#f0b34a] shadow-[18px_18px_0_rgba(47,36,29,.12)] sm:-ml-40 sm:-mt-40 sm:h-80 sm:w-80"
              initial={{ scaleX: 0.08, scaleY: 0.72, borderRadius: 999 }}
              animate={{ scaleX: [0.08, 1, 1.08, 1], scaleY: [0.72, 1, 0.95, 1], borderRadius: ["999px", "42px", "52px", "40px"] }}
              transition={{ duration: 1.45, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <motion.div
              className="absolute left-1/2 top-[42%] -ml-[165px] -mt-[165px] h-[330px] w-[330px] rounded-[48px] border-[12px] border-[#2f241d] bg-[#fffaf0] shadow-[22px_22px_0_rgba(97,61,22,.1)] sm:-ml-[180px] sm:-mt-[180px] sm:h-[360px] sm:w-[360px]"
              initial={{ rotate: 0, scale: 0.92 }}
              animate={{ rotate: [0, -2, 2, 0], scale: [0.92, 1, 1, 1.03] }}
              transition={{ delay: 1.1, duration: 1.35, ease: "easeInOut" }}
            />
            <motion.img
              src="/cstd-mascot.svg"
              alt=""
              className="absolute left-1/2 top-[42%] z-10 -ml-36 -mt-40 w-72 drop-shadow-[14px_16px_0_rgba(47,36,29,.12)] sm:-ml-40 sm:-mt-44 sm:w-80"
              initial={{ y: 70, opacity: 0, rotate: -12, scale: 0.6 }}
              animate={{ y: [70, -26, 0, -12, 0], opacity: 1, rotate: [-12, 7, 0, -3, 0], scale: [0.6, 1.12, 0.96, 1.05, 1] }}
              transition={{ delay: 0.28, duration: 1.95, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <div className="absolute left-1/2 top-[42%] z-20 mt-[188px] -translate-x-1/2">
              <motion.div
                className="rounded-xl border-2 border-[#2f241d] bg-[#dff8ed] px-6 py-3 text-2xl font-black tracking-[0.16em] text-[#047857] shadow-[8px_8px_0_rgba(47,36,29,.12)]"
                initial={{ opacity: 0, scale: 2.8, rotate: -16 }}
                animate={{ opacity: [0, 1, 1], scale: [2.8, 0.94, 1.08], rotate: [-16, 4, 0], x: [0, -5, 5, 0] }}
                transition={{ delay: 2.04, duration: 0.68, ease: [0.18, 0.9, 0.24, 1] }}
              >
                CSTD
              </motion.div>
            </div>
            <div className="absolute left-1/2 top-[42%] mt-[270px] w-80 -translate-x-1/2 text-center">
              <motion.p
                className="text-sm font-black uppercase tracking-[0.22em] text-[#d98528]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.55, duration: 0.42 }}
              >
                custard is ready
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" className="grid place-items-center text-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48 }}>
            <motion.img
              src="/cstd-mascot.svg"
              alt=""
              className="w-64 drop-shadow-[14px_16px_0_rgba(47,36,29,.12)] sm:w-80"
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-[#d98528]">tap to wake the custard</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-[#2f241d] sm:text-6xl">CSTD</h2>
            <button
              type="button"
              onClick={onStart}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#2f241d] bg-[#0f8f64] px-7 text-base font-black text-white shadow-[7px_7px_0_rgba(47,36,29,.14)] transition hover:-translate-y-0.5 hover:bg-[#0d7d59]"
            >
              开启 CSTD
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function IntroSoundWaves() {
  const waveDelays = [0.04, 0.18, 0.34, 0.52];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {waveDelays.map((delay, index) => (
        <motion.span
          key={delay}
          className="absolute left-1/2 top-[42%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d98528]/55"
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: [0, 0.58, 0], scale: [0.25, 1.2 + index * 0.22, 1.75 + index * 0.28] }}
          transition={{ delay, duration: 1.05, ease: "easeOut" }}
        />
      ))}
      {Array.from({ length: 14 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-[42%] h-2.5 w-2.5 rounded-sm border border-[#2f241d]/25"
          style={{ background: ["#f6bf3f", "#dff8ed", "#ffe7ec", "#fffaf0"][index % 4] }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.cos((index / 14) * Math.PI * 2) * (100 + (index % 4) * 24),
            y: Math.sin((index / 14) * Math.PI * 2) * (78 + (index % 3) * 18),
            rotate: 120 + index * 22,
            scale: [0.4, 1.15, 0.7],
          }}
          transition={{ delay: 0.12 + index * 0.018, duration: 1.25, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function FloatingBits({ motionDisabled }: { motionDisabled: boolean }) {
  const bits = [
    "left-[7%] top-[22%] h-4 w-4 rotate-12 bg-[#ffe7ec]",
    "right-[16%] top-[34%] h-5 w-5 -rotate-6 bg-[#dff8ed]",
    "left-[18%] bottom-[18%] h-3 w-3 rotate-45 bg-[#e3f2ff]",
    "right-[8%] bottom-[24%] h-4 w-4 rotate-12 bg-[#fff0c9]",
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {bits.map((classes, index) => (
        <motion.span
          key={classes}
          className={`absolute rounded-sm border border-[#2f241d]/40 shadow-[4px_4px_0_rgba(47,36,29,.06)] ${classes}`}
          animate={motionDisabled ? undefined : { y: [0, index % 2 ? 14 : -14, 0], rotate: [0, index % 2 ? 10 : -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 + index, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cstdNavLinkClassName}
    >
      {children}
    </Link>
  );
}

function HeroButton({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg border px-5 text-sm font-black no-underline shadow-[4px_4px_0_rgba(47,36,29,.08)] transition hover:-translate-y-0.5 sm:w-auto ${
        primary ? "border-[#1b4332] bg-[#0f8f64] text-white hover:bg-[#0d7d59]" : "border-[#b8d7f5] bg-[#e3f2ff] text-[#2563eb] hover:border-[#2563eb]"
      }`}
    >
      {children}
    </Link>
  );
}

function MotionControls({
  motionPreference,
  onToggle,
  onReplay,
}: {
  motionPreference: CstdMotionPreference;
  onToggle: () => void;
  onReplay: () => void;
}) {
  const introEnabled = motionPreference !== "disabled";

  return (
    <div className="grid w-full grid-cols-2 gap-2 rounded-xl border border-[#ead6ad] bg-white/65 p-2 shadow-[5px_5px_0_rgba(47,36,29,.06)] sm:w-auto sm:flex sm:flex-wrap">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={introEnabled}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#fff0c9] px-2 text-xs font-black text-[#8a4b15] transition hover:bg-[#ffe08a] sm:px-3"
      >
        {introEnabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {getCstdIntroControlLabel(motionPreference)}
      </button>
      <button
        type="button"
        onClick={onReplay}
        disabled={!introEnabled}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#dff8ed] px-2 text-xs font-black text-[#047857] transition hover:bg-[#c8f3df] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        播放开场
      </button>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  motionDisabled,
}: {
  project: (typeof projects)[number];
  index: number;
  motionDisabled: boolean;
}) {
  const Icon = project.icon;
  const toneClasses = {
    mint: "from-[#dff8ed]/90 text-[#047857]",
    rose: "from-[#ffe7ec]/90 text-[#be4563]",
    sky: "from-[#e3f2ff]/90 text-[#2563eb]",
  }[project.tone];

  return (
    <motion.article
      className="group relative overflow-hidden rounded-xl border-2 border-[#ead6ad] bg-white/78 shadow-[0_18px_42px_rgba(97,61,22,.1)] backdrop-blur-sm sm:shadow-[0_22px_55px_rgba(97,61,22,.12)]"
      initial={motionDisabled ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.08, duration: 0.58, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={motionDisabled ? undefined : { y: -6, rotate: index === 1 ? 0.4 : -0.3 }}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,#f6bf3f_0_24px,#dff8ed_24px_48px,#ffe7ec_48px_72px,#e3f2ff_72px_96px)]" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/40"
        initial={{ x: "-120%" }}
        whileHover={motionDisabled ? undefined : { x: "520%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="relative p-4 sm:p-6 xl:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${toneClasses} to-white shadow-inner`}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-[#dff8ed] px-2 py-1 text-xs font-black text-[#047857]">{project.status}</span>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-black text-[#7b6656]">{project.kicker}</span>
            </div>
            <h3 className="mt-3 text-xl font-black tracking-tight sm:text-2xl xl:text-3xl">{project.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5b4a] sm:mt-4 sm:text-base">{project.description}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          {project.metrics.map(([value, label]) => (
            <div key={value} className="rounded-lg border border-[#ead6ad] bg-white/72 p-3 sm:rounded-xl sm:p-4">
              <strong className="block text-lg font-black sm:text-2xl">{value}</strong>
              <span className="mt-1 block text-xs font-semibold text-[#7b6656]">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
          <HeroButton href={project.href}>
            {project.action}
          </HeroButton>
          {"softHref" in project && project.softHref ? <HeroButton href={project.softHref}>{project.softAction}</HeroButton> : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              className="rounded-md bg-[#fff0c9] px-2.5 py-1 text-xs font-black text-[#8a4b15]"
              whileHover={motionDisabled ? undefined : { y: -2, rotate: -1 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
