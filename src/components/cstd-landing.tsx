"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import {
  CSTD_INTRO_SEEN_KEY,
  CSTD_MOTION_PREFERENCE_KEY,
  type CstdMotionPreference,
  getCstdIntroControlLabel,
  getCstdPointerTilt,
  shouldPlayCstdIntro,
  shouldPlayCstdIntroReplay,
} from "@/lib/cstd-motion";

type MascotMood = "curious" | "happy" | "working";

const neutralTilt = {
  x: 0,
  y: 0,
  rotateX: 0,
  rotateY: 0,
  glowX: 50,
  glowY: 50,
};

const projects = [
  {
    title: "洛克图鉴 / RocoDex",
    kicker: "Primary project",
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
    kicker: "Photography",
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
    kicker: "Incubating",
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

export function CstdLanding() {
  const reducedMotion = usePrefersReducedMotion();
  const initialized = useRef(false);
  const [introVisible, setIntroVisible] = useState(false);
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
    setMotionPreference(preference);
    setIntroVisible(
      shouldPlayCstdIntro({
        reducedMotion,
        motionPreference: preference,
        introSeen: window.localStorage.getItem(CSTD_INTRO_SEEN_KEY),
      }),
    );
  }, [reducedMotion]);

  useEffect(() => {
    if (!introVisible) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(CSTD_INTRO_SEEN_KEY, "true");
      setIntroVisible(false);
    }, 3400);

    return () => window.clearTimeout(timer);
  }, [introVisible]);

  const mascotCopy = useMemo(() => {
    if (mascotMood === "happy") return "奶黄包收到了你的点击，正在加糖。";
    if (mascotMood === "working") return "奶黄包正在把项目烤得更香。";
    return "点一点奶黄包，它会给页面加一点甜。";
  }, [mascotMood]);

  function replayIntro() {
    const replayPreference: CstdMotionPreference = "enabled";
    setMotionPreference(replayPreference);
    window.localStorage.setItem(CSTD_MOTION_PREFERENCE_KEY, replayPreference);
    window.localStorage.setItem(CSTD_INTRO_SEEN_KEY, "false");
    setIntroVisible(shouldPlayCstdIntroReplay({ reducedMotion: prefersReducedMotion, motionPreference: replayPreference }));
  }

  function toggleMotion() {
    const nextPreference: CstdMotionPreference = motionPreference === "disabled" ? "enabled" : "disabled";
    setMotionPreference(nextPreference);
    window.localStorage.setItem(CSTD_MOTION_PREFERENCE_KEY, nextPreference);
    if (nextPreference === "disabled") setIntroVisible(false);
  }

  function skipIntro() {
    window.localStorage.setItem(CSTD_INTRO_SEEN_KEY, "true");
    setIntroVisible(false);
  }

  function pokeMascot() {
    setMascotMood("happy");
    window.setTimeout(() => setMascotMood("working"), 900);
    window.setTimeout(() => setMascotMood("curious"), 2200);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fff6df] text-[#2f241d]">
      <AnimatePresence>{introVisible ? <CstdIntro onSkip={skipIntro} /> : null}</AnimatePresence>

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

      <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
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

          <nav className="flex flex-wrap items-center gap-2" aria-label="项目导航">
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="https://rocodex.custard.top">RocoDex</NavLink>
            <NavLink href="https://shoot.custard.top">Photography</NavLink>
          </nav>
        </header>

        <section className="grid min-h-[calc(100vh-88px)] items-center gap-8 pb-12 pt-3 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 lg:pb-16">
          <motion.div
            initial={motionDisabled ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10"
          >
            <p className="font-black uppercase tracking-[0.22em] text-[#d98528]">Custard studio</p>
            <div className="mt-4 overflow-hidden">
              <motion.h1
                className="text-[clamp(4.6rem,17vw,10rem)] font-black leading-[0.78] tracking-[0.03em] text-[#2f241d] drop-shadow-[9px_9px_0_rgba(246,191,63,.38)]"
                initial={motionDisabled ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.08, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
              >
                CSTD
              </motion.h1>
            </div>
            <motion.p
              className="mt-5 max-w-3xl text-[clamp(1.45rem,5.4vw,3.45rem)] font-black leading-tight"
              initial={motionDisabled ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
            >
              奶黄包的奇思妙想实验田
            </motion.p>
            <motion.p
              className="mt-5 max-w-2xl text-base leading-8 text-[#6f5b4a] sm:text-lg"
              initial={motionDisabled ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              从一只软乎乎的奶黄包出发，孵化技术、设计、文化与游戏的混合实验。这里收纳正在生长的产品、视觉练习和小型工具，每个项目都带一点甜糯的手作痕迹。
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
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
              className="mt-6 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3"
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {noteItems.map(([value, label]) => (
                <div key={value} className="rounded-lg border border-dashed border-[#cdb58c] bg-white/65 p-3 shadow-[3px_3px_0_rgba(47,36,29,.05)]">
                  <strong className="block text-lg font-black sm:text-2xl">{value}</strong>
                  <span className="mt-1 block text-[0.68rem] font-medium text-[#7b6656] sm:text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.aside
            className="relative order-first min-h-[255px] sm:min-h-[330px] lg:order-none lg:min-h-[560px]"
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
              className="absolute left-3 top-10 rounded-xl border-2 border-[#2f241d] bg-[#dff8ed] px-4 py-2 text-sm font-black text-[#047857] shadow-[6px_6px_0_rgba(47,36,29,.12)]"
              animate={motionDisabled ? undefined : { rotate: [-5, -1, -5], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            >
              fresh build
            </motion.div>

            <InteractiveCustardModel
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

          <div className="grid gap-4 lg:grid-cols-2">
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

function InteractiveCustardModel({
  mascotCopy,
  mascotMood,
  motionDisabled,
  onMoodChange,
  onPoke,
}: {
  mascotCopy: string;
  mascotMood: MascotMood;
  motionDisabled: boolean;
  onMoodChange: (mood: MascotMood) => void;
  onPoke: () => void;
}) {
  const [tilt, setTilt] = useState(neutralTilt);

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt(
      getCstdPointerTilt({
        clientX: event.clientX,
        clientY: event.clientY,
        rectLeft: rect.left,
        rectTop: rect.top,
        rectWidth: rect.width,
        rectHeight: rect.height,
      }),
    );
  }

  function handlePointerLeave() {
    setTilt(neutralTilt);
    onMoodChange("curious");
  }

  return (
    <motion.button
      type="button"
      onClick={onPoke}
      onPointerEnter={() => onMoodChange("working")}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className="group absolute left-1/2 top-7 grid w-[min(100%,280px)] -translate-x-1/2 place-items-center overflow-hidden rounded-[28px] border-2 border-[#ead6ad] bg-white/55 p-3 shadow-[14px_14px_0_rgba(97,61,22,.08)] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f8f64] sm:top-12 sm:w-[min(100%,340px)] sm:p-4 lg:top-20 lg:w-[min(100%,420px)] lg:rounded-[36px] lg:p-5 lg:shadow-[18px_18px_0_rgba(97,61,22,.08)]"
      whileHover={motionDisabled ? undefined : { y: -6 }}
      whileTap={{ scale: 0.97 }}
      style={{ perspective: 920 }}
      aria-label="点击奶黄包互动"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255,255,255,.95), rgba(255,240,201,.42) 28%, transparent 62%)`,
        }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-9 bottom-8 h-14 rounded-full bg-[#d98528]/18 blur-xl"
        animate={motionDisabled ? undefined : { scale: [1, 1.14, 1], opacity: [0.42, 0.76, 0.42] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      />

      <motion.span
        aria-hidden="true"
        className="relative z-10 block h-[242px] w-[250px] sm:h-[300px] sm:w-[315px] lg:h-[380px] lg:w-[390px]"
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          y: !motionDisabled && mascotMood === "happy" ? [-5, -24, -5] : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.span
          className="absolute left-1/2 top-0 h-12 w-4 -translate-x-1/2 rounded-full bg-white/80"
          animate={motionDisabled ? undefined : { y: [0, -10, 0], opacity: [0.35, 0.85, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute left-[34%] top-5 h-9 w-3 -translate-x-1/2 rotate-[-18deg] rounded-full bg-white/70"
          animate={motionDisabled ? undefined : { y: [0, -8, 0], opacity: [0.25, 0.7, 0.25] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.35 }}
        />
        <motion.span
          className="absolute right-[32%] top-8 h-8 w-3 rotate-[20deg] rounded-full bg-white/70"
          animate={motionDisabled ? undefined : { y: [0, -7, 0], opacity: [0.2, 0.68, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.65 }}
        />

        <span
          className="absolute bottom-8 left-5 right-5 h-[34%] rotate-[-2deg] border-[5px] border-[#2f241d] bg-gradient-to-br from-[#e9fff7] via-[#dff8ed] to-[#b9eee0] shadow-[0_18px_0_rgba(47,36,29,.1),inset_0_-18px_26px_rgba(4,120,87,.1)] sm:border-[6px] lg:border-[7px]"
          style={{ borderRadius: "52% 48% 42% 46% / 48% 48% 58% 54%", transform: "translateZ(10px)" }}
        >
          <span className="absolute bottom-7 left-1/2 h-8 w-[58%] -translate-x-1/2 rounded-[50%] border-b-[5px] border-[#9fc9bd] opacity-65" />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-black tracking-[0.22em] text-[#2f241d] sm:text-base">CSTD</span>
        </span>

        <motion.span
          className="absolute left-[18%] top-[43%] h-4 w-16 origin-right rounded-full border-[4px] border-[#2f241d] border-r-0 bg-[#f6bf3f] sm:h-5 sm:w-20"
          animate={motionDisabled ? undefined : { rotate: mascotMood === "happy" ? [-10, -28, -10] : [-8, -15, -8] }}
          transition={{ repeat: mascotMood === "happy" ? 0 : Infinity, duration: 2.8, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute right-[18%] top-[43%] h-4 w-16 origin-left rounded-full border-[4px] border-[#2f241d] border-l-0 bg-[#f6bf3f] sm:h-5 sm:w-20"
          animate={motionDisabled ? undefined : { rotate: mascotMood === "happy" ? [10, 28, 10] : [8, 15, 8] }}
          transition={{ repeat: mascotMood === "happy" ? 0 : Infinity, duration: 2.8, ease: "easeInOut" }}
        />

        <span
          className="absolute left-1/2 top-[18%] h-[54%] w-[54%] -translate-x-1/2 border-[6px] border-[#2f241d] bg-gradient-to-br from-[#ffe38a] via-[#f6bf3f] to-[#e59b20] shadow-[inset_18px_18px_24px_rgba(255,255,255,.24),inset_-18px_-18px_24px_rgba(138,75,21,.14),0_20px_0_rgba(47,36,29,.1)] sm:border-[7px]"
          style={{
            borderRadius: "48% 54% 48% 52% / 44% 42% 58% 56%",
            transform: "translateX(-50%) translateZ(52px)",
          }}
        >
          <span
            className="absolute left-[28%] top-[35%] h-3.5 w-3.5 rounded-full bg-[#2f241d] sm:h-4 sm:w-4"
            style={{ transform: `translate(${tilt.x * 5}px, ${tilt.y * 3}px)` }}
          />
          <span
            className="absolute right-[28%] top-[35%] h-3.5 w-3.5 rounded-full bg-[#2f241d] sm:h-4 sm:w-4"
            style={{ transform: `translate(${tilt.x * 5}px, ${tilt.y * 3}px)` }}
          />
          <span className="absolute left-[20%] top-[48%] h-5 w-8 rounded-full bg-[#ff9db2]/45 blur-[1px]" />
          <span className="absolute right-[20%] top-[48%] h-5 w-8 rounded-full bg-[#ff9db2]/45 blur-[1px]" />
          <span
            className="absolute left-1/2 top-[48%] h-9 w-16 -translate-x-1/2 rounded-b-full border-b-[6px] border-[#2f241d] sm:h-10 sm:w-20"
            style={{ transform: `translate(calc(-50% + ${tilt.x * 2}px), ${tilt.y * 2}px)` }}
          />
          <span className="absolute right-[17%] top-[15%] h-9 w-7 rotate-[24deg] rounded-full bg-white/35 blur-[1px]" />
        </span>

        <motion.span
          className="absolute left-[16%] top-[33%] grid h-11 w-11 place-items-center rounded-xl border-[4px] border-[#2f241d] bg-white text-[#f6bf3f] shadow-[5px_5px_0_rgba(47,36,29,.08)] sm:h-14 sm:w-14"
          animate={motionDisabled ? undefined : { rotate: [-8, 8, -8], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
        </motion.span>
      </motion.span>

      <span className="relative z-10 mt-1 rounded-full border border-[#ead6ad] bg-[#fffaf0]/92 px-3 py-1.5 text-[0.66rem] font-black text-[#7b6656] shadow-sm sm:px-4 sm:py-2 sm:text-xs">
        {mascotCopy}
      </span>
    </motion.button>
  );
}

function CstdIntro({ onSkip }: { onSkip: () => void }) {
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
            "radial-gradient(circle at 50% 45%, rgba(246,191,63,.4), transparent 24%), linear-gradient(90deg, rgba(47,36,29,.05) 1px, transparent 1px), linear-gradient(180deg, rgba(47,36,29,.05) 1px, transparent 1px)",
          backgroundSize: "auto, 34px 34px, 34px 34px",
        }}
      />
      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 top-5 rounded-full border border-[#ead6ad] bg-white/80 px-4 py-2 text-sm font-black text-[#7b6656] shadow-sm transition hover:border-[#d98528] hover:text-[#2f241d]"
      >
        跳过
      </button>
      <div className="relative grid w-[min(90vw,560px)] place-items-center">
        <motion.div
          className="absolute h-72 w-72 rounded-[40px] border-[10px] border-[#2f241d] bg-[#f0b34a] shadow-[18px_18px_0_rgba(47,36,29,.12)]"
          initial={{ scaleX: 0.08, scaleY: 0.72, borderRadius: 999 }}
          animate={{ scaleX: [0.08, 1, 1.08, 1], scaleY: [0.72, 1, 0.95, 1], borderRadius: ["999px", "42px", "52px", "40px"] }}
          transition={{ duration: 1.45, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <motion.div
          className="absolute h-[330px] w-[330px] rounded-[48px] border-[12px] border-[#2f241d] bg-[#fffaf0]"
          initial={{ rotate: 0, scale: 0.92 }}
          animate={{ rotate: [0, -2, 2, 0], scale: [0.92, 1, 1, 1.03] }}
          transition={{ delay: 1.1, duration: 1.35, ease: "easeInOut" }}
        />
        <motion.img
          src="/cstd-mascot.svg"
          alt=""
          className="relative z-10 w-72 drop-shadow-[14px_16px_0_rgba(47,36,29,.12)]"
          initial={{ y: 52, opacity: 0, rotate: -8, scale: 0.72 }}
          animate={{ y: [52, -16, 0, -8, 0], opacity: 1, rotate: [-8, 4, 0, -2, 0], scale: [0.72, 1.06, 1, 1.03, 1] }}
          transition={{ delay: 0.34, duration: 1.85, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <motion.div
          className="relative z-20 mt-[340px] rounded-xl border-2 border-[#2f241d] bg-[#dff8ed] px-6 py-3 text-2xl font-black tracking-[0.16em] text-[#047857] shadow-[8px_8px_0_rgba(47,36,29,.12)]"
          initial={{ opacity: 0, scale: 2.6, rotate: -14 }}
          animate={{ opacity: [0, 1, 1], scale: [2.6, 1, 1.05], rotate: [-14, 3, 0] }}
          transition={{ delay: 2.0, duration: 0.58 }}
        >
          CSTD
        </motion.div>
        <motion.p
          className="absolute -bottom-14 text-center text-sm font-black uppercase tracking-[0.22em] text-[#d98528]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.45, duration: 0.42 }}
        >
          custard is ready
        </motion.p>
      </div>
    </motion.div>
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
      className="inline-flex min-h-10 items-center rounded-lg border border-[#ead6ad] bg-white/70 px-3 text-sm font-black text-[#2f241d] no-underline shadow-[3px_3px_0_rgba(47,36,29,.06)] transition hover:-translate-y-0.5 hover:border-[#d98528] hover:bg-white"
    >
      {children}
    </Link>
  );
}

function HeroButton({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-5 text-sm font-black no-underline shadow-[4px_4px_0_rgba(47,36,29,.08)] transition hover:-translate-y-0.5 ${
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
    <div className="flex flex-wrap gap-2 rounded-xl border border-[#ead6ad] bg-white/65 p-2 shadow-[5px_5px_0_rgba(47,36,29,.06)]">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={introEnabled}
        className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#fff0c9] px-3 text-xs font-black text-[#8a4b15] transition hover:bg-[#ffe08a]"
      >
        {introEnabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {getCstdIntroControlLabel(motionPreference)}
      </button>
      <button
        type="button"
        onClick={onReplay}
        disabled={!introEnabled}
        className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#dff8ed] px-3 text-xs font-black text-[#047857] transition hover:bg-[#c8f3df] disabled:cursor-not-allowed disabled:opacity-50"
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
  const featured = index === 0;
  const toneClasses = {
    mint: "from-[#dff8ed]/90 text-[#047857]",
    rose: "from-[#ffe7ec]/90 text-[#be4563]",
    sky: "from-[#e3f2ff]/90 text-[#2563eb]",
  }[project.tone];

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-xl border-2 border-[#ead6ad] bg-white/78 shadow-[0_22px_55px_rgba(97,61,22,.12)] backdrop-blur-sm ${
        featured ? "lg:col-span-2" : ""
      }`}
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
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${toneClasses} to-white shadow-inner`}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-[#dff8ed] px-2 py-1 text-xs font-black text-[#047857]">{project.status}</span>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-black text-[#7b6656]">{project.kicker}</span>
            </div>
            <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{project.title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f5b4a] sm:text-base">{project.description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {project.metrics.map(([value, label]) => (
            <div key={value} className="rounded-xl border border-[#ead6ad] bg-white/72 p-4">
              <strong className="block text-2xl font-black">{value}</strong>
              <span className="mt-1 block text-xs font-semibold text-[#7b6656]">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <HeroButton href={project.href} primary={featured}>
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
