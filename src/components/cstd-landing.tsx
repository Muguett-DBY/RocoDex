"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Building2, Camera, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Menu, Pause, Play, RotateCcw, Search, Sparkles, TrendingUp, Volume2, VolumeX, X, type LucideIcon } from "lucide-react";
import { cstdHomepageCapabilities, cstdHomepageUpdates, getCstdHomepageCapabilitySummary, getCstdHomepageUpdateSummary } from "@/lib/cstd-homepage-updates";
import { playCstdIntroSound, setCstdAudioVolume, startCstdBgm, stopCstdBgm } from "@/lib/cstd-intro-sound";
import { cstdNavigationItems, getCstdMobileNavigationToggleState } from "@/lib/cstd-navigation";
import { getCstdProjectCardPreview, getCstdProjectFocusButtonLabel } from "@/lib/cstd-project-card";
import {
  buildCstdProjectBrief,
  buildCstdProjectDirectoryHref,
  buildCstdProjectFocusHref,
  buildCstdProjectLinkDirectory,
  copyCstdProjectLink,
  getCstdProjectEvidenceChecklist,
  getCstdProjectEvidenceChecklistSummary,
  getCstdProjectFocusNavigation,
  parseCstdProjectFocus,
  type CstdProjectCopyResult,
} from "@/lib/cstd-project-focus";
import { cstdProjects, type CstdProjectIconKey } from "@/lib/cstd-projects";
import { getCstdProjectEvidenceOverview } from "@/lib/cstd-project-evidence-overview";
import { buildCstdProjectPortfolioBrief } from "@/lib/cstd-project-portfolio-brief";
import { getCstdProjectProofTimeline } from "@/lib/cstd-project-proof-timeline";
import {
  CSTD_INTRO_SEEN_KEY,
  CSTD_MOTION_PREFERENCE_KEY,
  type CstdMotionPreference,
  getCstdIntroControlLabel,
  shouldPlayCstdIntro,
  shouldPlayCstdIntroReplay,
} from "@/lib/cstd-motion";
import {
  cstdProjectFilters,
  filterCstdProjects,
  getCstdProjectControlSummary,
  getCstdProjectFilterSummary,
  hasActiveCstdProjectControls,
  type CstdProjectFilter,
} from "@/lib/cstd-project-filter";
import { cstdProjectGuides } from "@/lib/cstd-project-guide";
import {
  cstdHeaderNavClassName,
  cstdHeaderClassName,
  cstdHeroActionsClassName,
  cstdHeroSectionClassName,
  cstdMascotAsideClassName,
  cstdMascotShellClassName,
  cstdMobileNavClassName,
  cstdNavLinkClassName,
  cstdPageShellClassName,
  cstdProjectEvidenceClassName,
  cstdProjectFocusActionRailClassName,
  cstdProjectFocusBodyClassName,
  cstdProjectFocusChecklistGridClassName,
  cstdProjectGridClassName,
  cstdProjectMetricGridClassName,
  cstdProjectMetricLabelClassName,
  cstdProjectMetricTileClassName,
  cstdProjectMetricValueClassName,
} from "@/lib/cstd-mobile-layout";

type MascotMood = "curious" | "happy" | "working";
type CstdIntroPhase = "idle" | "playing";
type CstdAudioPreference = "enabled" | "disabled";

const CSTD_AUDIO_PREFERENCE_KEY = "cstd.audioPreference";
const CSTD_BGM_NORMAL_VOLUME = 0.12;
const CSTD_BGM_DUCKED_VOLUME = 0.035;

const projectIcons: Record<CstdProjectIconKey, LucideIcon> = {
  sparkles: Sparkles,
  camera: Camera,
  "trending-up": TrendingUp,
  bot: Bot,
  building: Building2,
  rotate: RotateCcw,
};

const noteItems = [
  ["05", "个在线项目"],
  ["347", "只精灵资料"],
  ["Mix", "技术 / 设计 / 研究"],
] as const;

const homepageUpdateSummary = getCstdHomepageUpdateSummary(cstdHomepageUpdates);
const homepageCapabilitySummary = getCstdHomepageCapabilitySummary(cstdHomepageCapabilities);
const projectEvidenceOverview = getCstdProjectEvidenceOverview(cstdProjects);
const projectProofTimeline = getCstdProjectProofTimeline(cstdProjects);

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
  const projectFocusRef = useRef<HTMLElement>(null);
  const [introVisible, setIntroVisible] = useState(false);
  const [introPhase, setIntroPhase] = useState<CstdIntroPhase>("idle");
  const [motionPreference, setMotionPreference] = useState<CstdMotionPreference>("enabled");
  const [audioPreference, setAudioPreference] = useState<CstdAudioPreference>("enabled");
  const [activeProjectFilter, setActiveProjectFilter] = useState<CstdProjectFilter>("all");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectCopyResult, setProjectCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectBriefCopyResult, setProjectBriefCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [portfolioCopyResult, setPortfolioCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectLinkDirectoryCopyResult, setProjectLinkDirectoryCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [bgmActive, setBgmActive] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>("curious");
  const prefersReducedMotion = reducedMotion ?? true;
  const motionDisabled = prefersReducedMotion;

  useEffect(() => {
    if (reducedMotion === null) return;
    if (initialized.current) return;
    initialized.current = true;

    const storedPreference = window.localStorage.getItem(CSTD_MOTION_PREFERENCE_KEY);
    const preference: CstdMotionPreference = storedPreference === "disabled" ? "disabled" : "enabled";
    const storedAudioPreference = window.localStorage.getItem(CSTD_AUDIO_PREFERENCE_KEY);
    const audioPreference: CstdAudioPreference = storedAudioPreference === "disabled" ? "disabled" : "enabled";
    const introSeen = window.localStorage.getItem(CSTD_INTRO_SEEN_KEY);
    const hasProjectFocus = parseCstdProjectFocus(window.location.search) !== null;
    const shouldShowIntro = shouldPlayCstdIntro({
      hasProjectFocus,
      reducedMotion,
      motionPreference: preference,
      introSeen,
    });
    setMotionPreference(preference);
    setAudioPreference(audioPreference);
    setIntroVisible(shouldShowIntro);
    setIntroPhase("idle");
  }, [reducedMotion]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSelectedProjectId(parseCstdProjectFocus(window.location.search));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!selectedProjectId || window.location.hash !== "#project-focus") return;
    const frame = window.requestAnimationFrame(() => {
      projectFocusRef.current?.scrollIntoView({ behavior: motionDisabled ? "auto" : "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [motionDisabled, selectedProjectId]);

  useEffect(() => {
    if (!introVisible) return;
    if (introPhase !== "playing") return;
    const timer = window.setTimeout(() => {
      setIntroVisible(false);
      setIntroPhase("idle");
    }, 5600);

    return () => window.clearTimeout(timer);
  }, [introPhase, introVisible]);

  useEffect(() => {
    if (audioPreference === "disabled" || !bgmActive) return;

    const syncVolumeToVisibility = () => {
      setCstdAudioVolume(document.hidden ? CSTD_BGM_DUCKED_VOLUME : CSTD_BGM_NORMAL_VOLUME);
    };

    syncVolumeToVisibility();
    document.addEventListener("visibilitychange", syncVolumeToVisibility);

    return () => document.removeEventListener("visibilitychange", syncVolumeToVisibility);
  }, [audioPreference, bgmActive]);

  const mascotCopy = useMemo(() => {
    if (mascotMood === "happy") return "奶黄包收到了你的点击，正在加糖。";
    if (mascotMood === "working") return "奶黄包正在把项目烤得更香。";
    return "点一点奶黄包，它会给页面加一点甜。";
  }, [mascotMood]);
  const visibleProjects = useMemo(() => filterCstdProjects(cstdProjects, activeProjectFilter, projectSearchQuery), [activeProjectFilter, projectSearchQuery]);
  const projectFilterSummary = useMemo(() => getCstdProjectFilterSummary(cstdProjects, activeProjectFilter, projectSearchQuery), [activeProjectFilter, projectSearchQuery]);
  const projectControlSummary = useMemo(() => getCstdProjectControlSummary(activeProjectFilter, projectSearchQuery), [activeProjectFilter, projectSearchQuery]);
  const hasProjectControlState = useMemo(() => hasActiveCstdProjectControls(activeProjectFilter, projectSearchQuery), [activeProjectFilter, projectSearchQuery]);
  const selectedProject = useMemo(
    () => cstdProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId],
  );
  const selectedProjectNavigation = useMemo(
    () => (selectedProject ? getCstdProjectFocusNavigation(cstdProjects, selectedProject.id) : { previous: null, next: null }),
    [selectedProject],
  );
  const mobileNavigationToggle = getCstdMobileNavigationToggleState(mobileNavOpen);

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

  function toggleAudio() {
    if (audioPreference === "disabled") {
      const nextPreference: CstdAudioPreference = "enabled";
      setAudioPreference(nextPreference);
      window.localStorage.setItem(CSTD_AUDIO_PREFERENCE_KEY, nextPreference);
      void startCstdBgm(CSTD_BGM_NORMAL_VOLUME).then(setBgmActive);
      return;
    }

    if (!bgmActive) {
      void startCstdBgm(CSTD_BGM_NORMAL_VOLUME).then(setBgmActive);
      return;
    }

    const nextPreference: CstdAudioPreference = "disabled";
    setAudioPreference(nextPreference);
    window.localStorage.setItem(CSTD_AUDIO_PREFERENCE_KEY, nextPreference);
    stopCstdBgm();
    setBgmActive(false);
  }

  function beginIntroPlayback() {
    window.localStorage.setItem(CSTD_INTRO_SEEN_KEY, "true");
    setIntroVisible(true);
    setIntroPhase("playing");
    if (audioPreference === "disabled") return;

    void playCstdIntroSound();
    void startCstdBgm(CSTD_BGM_NORMAL_VOLUME).then(setBgmActive);
  }

  function skipIntro() {
    window.localStorage.setItem(CSTD_INTRO_SEEN_KEY, "true");
    setIntroVisible(false);
    setIntroPhase("idle");
  }

  function pokeMascot() {
    setMascotMood("happy");
    window.setTimeout(() => setMascotMood("working"), 900);
    window.setTimeout(() => setMascotMood("curious"), 2200);
  }

  function focusProject(projectId: string) {
    const href = buildCstdProjectFocusHref(projectId, window.location.pathname);
    window.history.replaceState(null, "", href);
    setProjectCopyResult(null);
    setProjectBriefCopyResult(null);
    setSelectedProjectId(projectId);
  }

  function closeProjectFocus() {
    window.history.replaceState(null, "", buildCstdProjectDirectoryHref(window.location.pathname));
    setSelectedProjectId(null);
    setProjectCopyResult(null);
    setProjectBriefCopyResult(null);
  }

  function resetProjectControls() {
    setProjectSearchQuery("");
    setActiveProjectFilter("all");
  }

  async function copyProjectFocusLink() {
    if (!selectedProject) return;
    const href = buildCstdProjectFocusHref(selectedProject.id, window.location.pathname);
    const result = await copyCstdProjectLink(
      navigator.clipboard ? (text) => navigator.clipboard.writeText(text) : undefined,
      `${window.location.origin}${href}`,
    );
    setProjectCopyResult(result);
  }

  async function copyProjectBrief() {
    if (!selectedProject) return;
    const result = await copyCstdProjectLink(
      navigator.clipboard ? (text) => navigator.clipboard.writeText(text) : undefined,
      buildCstdProjectBrief(selectedProject),
    );
    setProjectBriefCopyResult(result);
  }

  async function copyPortfolioBrief() {
    const result = await copyCstdProjectLink(
      navigator.clipboard ? (text) => navigator.clipboard.writeText(text) : undefined,
      buildCstdProjectPortfolioBrief(cstdProjects),
    );
    setPortfolioCopyResult(result);
  }

  async function copyProjectLinkDirectory() {
    const directory = buildCstdProjectLinkDirectory(cstdProjects, window.location.origin, window.location.pathname);
    const result = await copyCstdProjectLink(
      navigator.clipboard ? (text) => navigator.clipboard.writeText(text) : undefined,
      directory,
    );
    setProjectLinkDirectoryCopyResult(result);
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
        <header className={cstdHeaderClassName}>
          <div className="flex items-center justify-between gap-3">
            <Link href="https://custard.top/" className="group inline-flex min-w-0 items-center gap-3 no-underline" aria-label="CSTD 首页">
              <motion.span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-[#2f241d] bg-[#f6bf3f] text-sm font-black shadow-[5px_5px_0_rgba(47,36,29,.12)] sm:h-12 sm:w-12 sm:shadow-[6px_6px_0_rgba(47,36,29,.12)]"
                whileHover={motionDisabled ? undefined : { rotate: -4, y: -2 }}
              >
                C
              </motion.span>
              <span className="min-w-0">
                <span className="block text-base font-black tracking-[0.18em]">CSTD</span>
                <span className="mt-0.5 block text-xs font-semibold text-[#7b6656]">custard.top</span>
              </span>
            </Link>

            <nav className={cstdHeaderNavClassName} aria-label="项目导航">
              <CstdNavigationLinks />
            </nav>

            <button
              type="button"
              aria-expanded={mobileNavigationToggle.expanded}
              aria-controls="cstd-mobile-navigation"
              aria-label={mobileNavigationToggle.label}
              onClick={() => setMobileNavOpen((open) => !open)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#2f241d] bg-white/85 text-[#2f241d] shadow-[4px_4px_0_rgba(47,36,29,.1)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0f8f64] sm:hidden"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {mobileNavOpen ? (
              <motion.nav
                id="cstd-mobile-navigation"
                aria-label="移动项目导航"
                className={cstdMobileNavClassName}
                initial={motionDisabled ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={motionDisabled ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <CstdNavigationLinks mobile onNavigate={() => setMobileNavOpen(false)} />
              </motion.nav>
            ) : null}
          </AnimatePresence>
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
              从一只软乎乎的奶黄包出发，孵化技术、设计、投资研究、文化与游戏的混合实验。这里收纳正在生长的产品、视觉练习和小型工具，每个项目都带一点甜糯的手作痕迹。
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
              <HeroButton href="https://alpha.custard.top">打开 Alpha</HeroButton>
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

            <motion.div
              className="mt-4 max-w-2xl rounded-xl border border-[#ead6ad] bg-white/68 p-3 shadow-[5px_5px_0_rgba(47,36,29,.05)] sm:mt-5 sm:p-4"
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.5 }}
              aria-label={homepageUpdateSummary}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d98528]">Latest updates</p>
                <p className="text-xs font-bold text-[#7b6656]">{homepageUpdateSummary}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {cstdHomepageUpdates.map((update) => (
                  <div key={update.label} className="min-w-0 rounded-lg border border-[#ead6ad] bg-[#fffaf0]/84 p-2.5">
                    <p className="text-sm font-black text-[#2f241d]">{update.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#6f5b4a]">{update.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-[#d6eadf] bg-[#eefbf4]/82 p-3" aria-label={homepageCapabilitySummary}>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#047857]">Capability checklist</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cstdHomepageCapabilities.map((capability) => (
                    <span key={capability.label} className="inline-flex min-h-8 items-center gap-1.5 rounded-md bg-white/82 px-2.5 text-xs font-black text-[#1b4332]" title={capability.detail}>
                      <Check className="h-3.5 w-3.5 text-[#0f8f64]" />
                      {capability.label}
                    </span>
                  ))}
                </div>
              </div>
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
              audioEnabled={audioPreference !== "disabled"}
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
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5b4a] sm:text-base">
                工具、影像与研究类项目分开放置，方便从主站快速进入。
              </p>
            </div>
            <MotionControls
              audioPreference={audioPreference}
              bgmActive={bgmActive}
              motionPreference={motionPreference}
              onAudioToggle={toggleAudio}
              onReplay={replayIntro}
              onToggle={toggleMotion}
            />
          </div>

          <ProjectGuide onFocus={focusProject} />

          <div className="mb-5 rounded-xl border-2 border-[#2f241d] bg-[#fffaf0]/84 p-4 shadow-[7px_7px_0_rgba(47,36,29,.08)] sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98528]">Evidence overview</p>
                <p className="mt-2 text-lg font-black leading-7 text-[#2f241d]">{projectEvidenceOverview.summary}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 lg:w-[28rem]">
                {projectEvidenceOverview.stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-[#ead6ad] bg-white/78 p-3">
                    <strong className="block text-2xl font-black text-[#0f8f64]">{stat.value}</strong>
                    <span className="mt-1 block text-xs font-black text-[#7b6656]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-[#ead6ad] bg-white/72 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold leading-6 text-[#6f5b4a]">把已上线项目、当前状态、交付证据和链接复制成一段组合摘要。</p>
              <button
                type="button"
                onClick={copyPortfolioBrief}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-[#0f8f64] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
              >
                {portfolioCopyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                复制项目组合摘要
              </button>
            </div>
            {portfolioCopyResult ? (
              <p role="status" className="mt-2 text-xs font-semibold leading-5 text-[#6f5b4a]">
                {{
                  copied: "项目组合摘要已复制",
                  unsupported: "浏览器不支持自动复制，请手动复制摘要",
                  failed: "组合摘要复制失败，请手动复制",
                }[portfolioCopyResult]}
              </p>
            ) : null}
            {portfolioCopyResult && portfolioCopyResult !== "copied" ? (
              <textarea
                aria-label="项目组合摘要文本"
                readOnly
                value={buildCstdProjectPortfolioBrief(cstdProjects)}
                className="mt-3 min-h-44 w-full resize-y rounded-lg border border-[#ead6ad] bg-[#fffaf0] p-3 text-xs font-semibold leading-5 text-[#4f3d31] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
              />
            ) : null}
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[#b8d7f5] bg-[#e3f2ff]/74 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold leading-6 text-[#315b7f]">需要发给别人看时，可以直接复制每个项目的案例深链。</p>
              <button
                type="button"
                onClick={copyProjectLinkDirectory}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#2563eb] bg-white px-4 text-sm font-black text-[#2563eb] transition hover:-translate-y-0.5 hover:bg-[#f2f8ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
              >
                {projectLinkDirectoryCopyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                复制项目深链目录
              </button>
            </div>
            {projectLinkDirectoryCopyResult ? (
              <p role="status" className="mt-2 text-xs font-semibold leading-5 text-[#6f5b4a]">
                {{
                  copied: "项目深链目录已复制",
                  unsupported: "浏览器不支持自动复制，请手动复制项目深链目录",
                  failed: "项目深链目录复制失败，请手动复制",
                }[projectLinkDirectoryCopyResult]}
              </p>
            ) : null}
            {projectLinkDirectoryCopyResult && projectLinkDirectoryCopyResult !== "copied" ? (
              <textarea
                aria-label="项目深链目录文本"
                readOnly
                value={typeof window === "undefined" ? "" : buildCstdProjectLinkDirectory(cstdProjects, window.location.origin, window.location.pathname)}
                className="mt-3 min-h-36 w-full resize-y rounded-lg border border-[#b8d7f5] bg-[#f2f8ff] p-3 text-xs font-semibold leading-5 text-[#315b7f] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
              />
            ) : null}
            <div className="mt-4 rounded-lg border border-[#d6eadf] bg-[#eefbf4]/78 p-3" aria-label={projectProofTimeline.summary}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#047857]">Proof timeline</p>
                <p className="text-xs font-bold text-[#4c6b5d]">{projectProofTimeline.summary}</p>
              </div>
              <ol className="mt-3 grid gap-2 lg:grid-cols-5">
                {projectProofTimeline.items.map((item, index) => (
                  <li key={item.projectId} className="min-w-0 rounded-lg border border-[#b7decf] bg-white/82 p-3">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#0f8f64] px-2 text-xs font-black text-white">{index + 1}</span>
                    <p className="mt-2 text-sm font-black leading-5 text-[#1b4332]">{item.title}</p>
                    <p className="mt-1 text-xs font-black leading-5 text-[#047857]">{item.signal}</p>
                    <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-[#4c6b5d]">{item.proof}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-[#ead6ad] bg-white/68 p-3 shadow-[6px_6px_0_rgba(47,36,29,.05)] backdrop-blur-sm sm:p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98528]">Project index</p>
              <p className="text-xs font-bold text-[#7b6656]" aria-live="polite">
                {projectFilterSummary}
              </p>
            </div>
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[#ead6ad] bg-[#fffaf0]/78 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9a5a18]">当前视图</p>
                <p className="mt-1 break-words text-sm font-black text-[#2f241d]" aria-live="polite">
                  {projectControlSummary}
                </p>
              </div>
              {hasProjectControlState ? (
                <button
                  type="button"
                  onClick={resetProjectControls}
                  aria-label="重置项目搜索和筛选"
                  className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-white px-3 text-xs font-black text-[#0f8f64] transition hover:-translate-y-0.5 hover:bg-[#eefbf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  重置
                </button>
              ) : null}
            </div>
            <label className="mt-3 flex min-h-11 items-center gap-2 rounded-lg border border-[#ead6ad] bg-white/82 px-3 text-sm shadow-inner focus-within:border-[#0f8f64] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#0f8f64]">
              <Search className="h-4 w-4 shrink-0 text-[#0f8f64]" />
              <span className="sr-only">搜索项目</span>
              <input
                value={projectSearchQuery}
                onChange={(event) => setProjectSearchQuery(event.target.value)}
                placeholder="搜索项目、标签或问题，例如 CRM、南京、估值"
                className="min-w-0 flex-1 bg-transparent font-semibold text-[#2f241d] outline-none placeholder:text-[#9a8776]"
              />
              {projectSearchQuery ? (
                <button
                  type="button"
                  onClick={() => setProjectSearchQuery("")}
                  aria-label="清空项目搜索"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#7b6656] transition hover:bg-[#fff0c9] hover:text-[#2f241d]"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {cstdProjectFilters.map((filter) => {
                const selected = activeProjectFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveProjectFilter(filter.id)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] ${
                      selected
                        ? "border-[#1b4332] bg-[#0f8f64] text-white shadow-[4px_4px_0_rgba(47,36,29,.1)]"
                        : "border-[#ead6ad] bg-white/76 text-[#2f241d] hover:-translate-y-0.5 hover:border-[#d98528]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {selectedProject ? (
              <ProjectFocus
                key={selectedProject.id}
                project={selectedProject}
                briefCopyResult={projectBriefCopyResult}
                copyResult={projectCopyResult}
                focusRef={projectFocusRef}
                motionDisabled={motionDisabled}
                navigation={selectedProjectNavigation}
                onClose={closeProjectFocus}
                onCopyBrief={copyProjectBrief}
                onCopy={copyProjectFocusLink}
                onNavigate={focusProject}
              />
            ) : null}
          </AnimatePresence>

          <div className={cstdProjectGridClassName}>
            {visibleProjects.length > 0 ? (
              visibleProjects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} motionDisabled={motionDisabled} onFocus={focusProject} />
              ))
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[#d7c19d] bg-white/72 p-6 text-center md:col-span-2 xl:col-span-3">
                <p className="text-lg font-black text-[#2f241d]">没有找到匹配项目</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#6f5b4a]">试试清空搜索词，或切换到全部分类继续浏览。</p>
                <button
                  type="button"
                  onClick={resetProjectControls}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#1b4332] bg-[#0f8f64] px-4 text-sm font-black text-white transition hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
                >
                  重置项目筛选
                </button>
              </div>
            )}
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
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#fff4cf] text-[#2f241d]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.018, filter: "blur(12px)" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,216,121,.72), transparent 20%), radial-gradient(circle at 30% 28%, rgba(255,255,255,.86), transparent 22%), radial-gradient(circle at 22% 72%, rgba(223,248,237,.86), transparent 28%), radial-gradient(circle at 78% 22%, rgba(255,231,236,.84), transparent 25%), linear-gradient(90deg, rgba(47,36,29,.045) 1px, transparent 1px), linear-gradient(180deg, rgba(47,36,29,.045) 1px, transparent 1px)",
          backgroundSize: "auto, auto, auto, auto, 34px 34px, 34px 34px",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-[-20%] top-[6%] h-28 rotate-[-5deg] rounded-full border-y border-white/70 bg-white/24 blur-xl"
        animate={introPlaying ? { x: ["-7%", "9%", "-4%"], opacity: [0.18, 0.72, 0.2] } : { opacity: 0.26 }}
        transition={{ duration: 4.8, ease: "easeInOut" }}
      />
      <CinematicSteam active={introPlaying} />
      {introPlaying ? <IntroSoundWaves /> : null}
      {introPlaying ? <CinematicSugarBurst delay={2.28} /> : null}
      <button
        type="button"
        onClick={onSkip}
        className="absolute right-4 top-4 z-30 rounded-full border border-[#ead6ad] bg-white/82 px-4 py-2 text-sm font-black text-[#7b6656] shadow-sm backdrop-blur transition hover:border-[#d98528] hover:text-[#2f241d] sm:right-5 sm:top-5"
      >
        直接浏览项目
      </button>
      <div className="relative grid min-h-[520px] w-[min(94vw,760px)] place-items-center sm:min-h-[630px]">
        {introPlaying ? (
          <motion.div key="playing" className="relative h-[520px] w-full sm:h-[630px]">
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-[47%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd66f]/35 blur-3xl sm:h-[460px] sm:w-[460px]"
              initial={{ opacity: 0, scale: 0.62 }}
              animate={{ opacity: [0, 0.96, 0.78, 0.98], scale: [0.62, 1.05, 0.92, 1.16] }}
              transition={{ duration: 4.9, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-1/2 top-[7%] z-30 -translate-x-1/2 rounded-full border border-[#f6bf3f]/70 bg-white/82 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#d98528] shadow-[6px_6px_0_rgba(47,36,29,.08)] sm:text-xs"
              initial={{ opacity: 0, y: 8, scale: 0.88 }}
              animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8], scale: [0.88, 1.04, 1, 0.96] }}
              transition={{ duration: 1.52, ease: "easeOut" }}
            >
              custard premiere
            </motion.div>
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-[58%] h-24 w-[360px] -translate-x-1/2 rounded-[100%] bg-[#8a4b15]/16 blur-xl sm:w-[520px]"
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: [0, 0.46, 0.34], scaleX: [0.5, 1.04, 0.96] }}
              transition={{ delay: 0.18, duration: 1.7, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-1/2 top-[54%] h-[112px] w-[360px] -translate-x-1/2 rounded-[48%_52%_42%_46%/52%_52%_48%_48%] border-[7px] border-[#2f241d] bg-gradient-to-b from-[#eafff7] via-[#dff8ed] to-[#aee8d8] shadow-[16px_18px_0_rgba(47,36,29,.12)] sm:h-[136px] sm:w-[500px] sm:border-[9px]"
              initial={{ y: 92, scaleX: 0.78, opacity: 0 }}
              animate={{ y: [92, 0, 0, 4], scaleX: [0.78, 1.04, 0.98, 1], opacity: 1 }}
              transition={{ delay: 0.16, duration: 1.15, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <motion.div
              className="absolute left-1/2 top-[34%] z-20 h-[90px] w-[315px] -translate-x-1/2 rounded-[50%] border-[7px] border-[#2f241d] bg-gradient-to-b from-[#fffaf0] via-[#ffe7b1] to-[#f6bf3f] shadow-[12px_14px_0_rgba(47,36,29,.1)] sm:h-[112px] sm:w-[430px] sm:border-[9px]"
              initial={{ y: 54, rotate: 0, opacity: 0 }}
              animate={{ y: [54, 0, -96, -126], rotate: [0, 0, -8, -16], opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.1, duration: 1.6, ease: [0.18, 0.9, 0.24, 1] }}
            >
              <span className="absolute left-1/2 top-[-24px] h-12 w-24 -translate-x-1/2 rounded-full border-[6px] border-[#2f241d] bg-[#fffaf0] sm:top-[-30px] sm:h-16 sm:w-32" />
            </motion.div>
            <motion.img
              src="/cstd-mascot.svg"
              alt=""
              className="absolute left-1/2 top-[37%] z-10 w-60 -translate-x-1/2 -translate-y-1/2 drop-shadow-[14px_16px_0_rgba(47,36,29,.12)] sm:w-80"
              initial={{ y: 118, opacity: 0, rotate: -12, scale: 0.52, filter: "blur(3px)" }}
              animate={{
                y: [118, -34, 2, -18, 0, -10, 0],
                opacity: 1,
                rotate: [-12, 8, 0, -3, 0, 2, 0],
                scale: [0.52, 1.12, 0.96, 1.05, 1, 1.03, 1],
                filter: ["blur(3px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"],
              }}
              transition={{ delay: 0.62, duration: 2.85, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <div className="absolute left-1/2 top-[37%] z-20 mt-[164px] -translate-x-1/2 sm:mt-[212px]">
              <motion.div
                className="rounded-xl border-2 border-[#2f241d] bg-[#fffaf0] px-6 py-3 text-2xl font-black tracking-[0.14em] text-[#047857] shadow-[8px_8px_0_rgba(47,36,29,.12)] sm:px-8 sm:text-3xl"
                initial={{ opacity: 0, scale: 3.2, rotate: -18, y: -8 }}
                animate={{ opacity: [0, 1, 1], scale: [3.2, 0.9, 1.1], rotate: [-18, 5, 0], x: [0, -7, 7, 0], y: [-8, 0, 0] }}
                transition={{ delay: 2.34, duration: 0.72, ease: [0.18, 0.9, 0.24, 1] }}
              >
                CSTD
              </motion.div>
            </div>
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-[-12%] bottom-[-8%] z-40 h-[46%] rounded-t-[55%] border-t-2 border-white/80 bg-gradient-to-t from-[#fffaf0] via-[#fff4cf] to-[#fffaf0]/78 shadow-[0_-18px_55px_rgba(246,191,63,.24)]"
              initial={{ y: "112%" }}
              animate={{ y: ["112%", "112%", "0%"] }}
              transition={{ delay: 4.28, duration: 0.82, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <div className="absolute left-1/2 top-[37%] z-50 mt-[254px] w-80 -translate-x-1/2 text-center sm:mt-[316px]">
              <motion.p
                className="text-xs font-black uppercase tracking-[0.2em] text-[#d98528] sm:text-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.35, duration: 0.44 }}
              >
                warm launch sequence
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" className="grid place-items-center text-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48 }}>
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f6bf3f]/35 bg-white/24 shadow-[0_0_70px_rgba(246,191,63,.24)]"
              animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.62, 0.9, 0.62] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            />
            <motion.img
              src="/cstd-mascot.svg"
              alt=""
              className="relative w-64 drop-shadow-[14px_16px_0_rgba(47,36,29,.12)] sm:w-80"
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            <p className="relative mt-4 text-sm font-black uppercase tracking-[0.2em] text-[#d98528]">tap to wake the custard</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-[#2f241d] sm:text-6xl">CSTD</h2>
            <button
              type="button"
              onClick={onStart}
              className="group relative mt-6 inline-flex min-h-12 items-center justify-center overflow-hidden rounded-xl border-2 border-[#2f241d] bg-[#0f8f64] px-7 text-base font-black text-white shadow-[7px_7px_0_rgba(47,36,29,.14)] transition hover:-translate-y-0.5 hover:bg-[#0d7d59]"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/24 transition group-hover:left-full" />
              开启 CSTD
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function IntroSoundWaves() {
  const waveDelays = [0.18, 0.32, 2.34, 2.48, 3.68, 4.28];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {waveDelays.map((delay, index) => (
        <motion.span
          key={delay}
          className="absolute left-1/2 top-[43%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d98528]/45 sm:h-72 sm:w-72"
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: [0, 0.58, 0], scale: [0.25, 1.05 + index * 0.12, 1.55 + index * 0.18] }}
          transition={{ delay, duration: index > 3 ? 1.35 : 1.05, ease: "easeOut" }}
        />
      ))}
      {Array.from({ length: 18 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-[43%] h-2.5 w-2.5 rounded-sm border border-[#2f241d]/25 shadow-[3px_3px_0_rgba(47,36,29,.06)]"
          style={{ background: ["#f6bf3f", "#dff8ed", "#ffe7ec", "#fffaf0"][index % 4] }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.cos((index / 18) * Math.PI * 2) * (116 + (index % 4) * 28),
            y: Math.sin((index / 18) * Math.PI * 2) * (86 + (index % 3) * 22),
            rotate: 120 + index * 22,
            scale: [0.4, 1.15, 0.7],
          }}
          transition={{ delay: 2.34 + index * 0.018, duration: 1.28, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function CinematicSteam({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: 8 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute bottom-[22%] h-40 w-6 rounded-full border-l border-white/50 bg-white/10 blur-[1px]"
          style={{ left: `${20 + index * 8}%` }}
          initial={{ opacity: 0, y: 42, rotate: -10 + index * 3 }}
          animate={
            active
              ? { opacity: [0, 0.62, 0], y: [42, -120 - (index % 3) * 18], x: [0, index % 2 ? 24 : -24], rotate: [-10 + index * 3, 12 - index * 2] }
              : { opacity: [0.14, 0.3, 0.14], y: [18, -16, 18] }
          }
          transition={{ repeat: active ? 0 : Infinity, delay: active ? 0.2 + index * 0.07 : index * 0.18, duration: active ? 2.45 : 4.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CinematicSugarBurst({ delay }: { delay: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: 24 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-[43%] rounded-sm border border-[#2f241d]/30 shadow-[4px_4px_0_rgba(47,36,29,.06)]"
          style={{
            background: ["#f6bf3f", "#dff8ed", "#ffe7ec", "#e3f2ff", "#fffaf0"][index % 5],
            height: 7 + (index % 3) * 5,
            width: 7 + (index % 4) * 4,
          }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: -18, scale: 0.32 }}
          animate={{
            opacity: [0, 0.96, 0],
            x: Math.cos((index / 24) * Math.PI * 2) * (130 + (index % 5) * 26),
            y: Math.sin((index / 24) * Math.PI * 2) * (94 + (index % 4) * 22) - 18,
            rotate: 160 + index * 19,
            scale: [0.32, 1.05, 0.66],
          }}
          transition={{ delay: delay + index * 0.012, duration: 1.38, ease: "easeOut" }}
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

function CstdNavigationLinks({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  return cstdNavigationItems.map((item) => (
    <NavLink key={item.href} href={item.href} mobile={mobile} onNavigate={onNavigate}>
      {item.label}
    </NavLink>
  ));
}

function NavLink({
  href,
  children,
  mobile,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  mobile: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`${cstdNavLinkClassName} ${mobile ? "w-full justify-start px-4" : "justify-center"}`}
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
  audioPreference,
  bgmActive,
  motionPreference,
  onAudioToggle,
  onToggle,
  onReplay,
}: {
  audioPreference: CstdAudioPreference;
  bgmActive: boolean;
  motionPreference: CstdMotionPreference;
  onAudioToggle: () => void;
  onToggle: () => void;
  onReplay: () => void;
}) {
  const introEnabled = motionPreference !== "disabled";
  const audioEnabled = audioPreference !== "disabled";
  const audioLabel = !audioEnabled ? "关" : bgmActive ? "开" : "待播";

  return (
    <div className="grid w-full grid-cols-2 gap-2 rounded-xl border border-[#ead6ad] bg-white/65 p-2 shadow-[5px_5px_0_rgba(47,36,29,.06)] sm:w-auto sm:grid-cols-[auto_auto_auto]">
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
        onClick={onAudioToggle}
        aria-pressed={audioEnabled}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#e3f2ff] px-2 text-xs font-black text-[#2563eb] transition hover:bg-[#d5eaff] sm:px-3"
      >
        {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        声音：{audioLabel}
      </button>
      <button
        type="button"
        onClick={onReplay}
        disabled={!introEnabled}
        className="col-span-2 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#dff8ed] px-2 text-xs font-black text-[#047857] transition hover:bg-[#c8f3df] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1 sm:px-3"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        播放开场
      </button>
      <span className="col-span-2 inline-flex min-h-7 items-center justify-center rounded-lg bg-white/70 px-2 text-[0.68rem] font-black text-[#7b6656] sm:col-span-3">
        {audioEnabled ? (bgmActive ? "奶油音乐轻轻播放中" : "奶油音乐待播放") : "声音已关闭"}
      </span>
    </div>
  );
}

function ProjectGuide({ onFocus }: { onFocus: (projectId: string) => void }) {
  return (
    <div className="mb-5">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f8f64]">Goal guide</p>
          <h3 className="mt-1 text-xl font-black text-[#2f241d] sm:text-2xl">按目标找项目</h3>
        </div>
        <p className="text-xs font-semibold text-[#7b6656]">4 条路径</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cstdProjectGuides.map((guide) => {
          const project = cstdProjects.find((item) => item.id === guide.projectId);
          if (!project) return null;

          return (
            <button
              key={guide.goal}
              type="button"
              onClick={() => onFocus(guide.projectId)}
              className="group min-w-0 rounded-lg border border-[#ead6ad] bg-white/72 p-4 text-left shadow-[5px_5px_0_rgba(47,36,29,.05)] transition hover:-translate-y-0.5 hover:border-[#0f8f64] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
              aria-label={`${guide.goal}，查看${project.title}案例`}
            >
              <span className="block min-w-0 text-sm font-black text-[#2f241d]">{guide.goal}</span>
              <span className="mt-2 block min-w-0 text-xs font-semibold leading-5 text-[#6f5b4a]">{guide.reason}</span>
              <span className="mt-3 inline-flex min-h-7 items-center rounded-md bg-[#dff8ed] px-2 text-xs font-black text-[#047857]">
                {project.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  motionDisabled,
  onFocus,
}: {
  project: (typeof cstdProjects)[number];
  index: number;
  motionDisabled: boolean;
  onFocus: (projectId: string) => void;
}) {
  const Icon = projectIcons[project.icon];
  const evidencePreview = getCstdProjectCardPreview(project);
  const toneClasses = {
    mint: "from-[#dff8ed]/90 text-[#047857]",
    rose: "from-[#ffe7ec]/90 text-[#be4563]",
    teal: "from-[#d9f6f2]/90 text-[#0f766e]",
    violet: "from-[#ede9fe]/90 text-[#6d28d9]",
    amber: "from-[#fff0c9]/90 text-[#b45309]",
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
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-[#dff8ed] px-2 py-1 text-xs font-black text-[#047857]">{project.status}</span>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-black text-[#7b6656]">{project.kicker}</span>
            </div>
            <h3 className="mt-3 text-xl font-black tracking-tight sm:text-2xl xl:text-3xl">{project.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5b4a] sm:mt-4 sm:text-base">{project.description}</p>
          </div>
        </div>

        <div className={cstdProjectMetricGridClassName}>
          {project.metrics.map(([value, label]) => (
            <div key={value} className={cstdProjectMetricTileClassName}>
              <strong className={cstdProjectMetricValueClassName}>{value}</strong>
              <span className={cstdProjectMetricLabelClassName}>{label}</span>
            </div>
          ))}
        </div>

        <dl className={cstdProjectEvidenceClassName}>
          {evidencePreview.map((item) => (
            <ProjectEvidence key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>

        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => onFocus(project.id)}
            aria-label={getCstdProjectFocusButtonLabel(project)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-[#0f8f64] px-5 text-sm font-black text-white shadow-[4px_4px_0_rgba(47,36,29,.08)] transition hover:-translate-y-0.5 hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] sm:w-auto"
          >
            查看案例
          </button>
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

function ProjectFocus({
  project,
  briefCopyResult,
  copyResult,
  focusRef,
  motionDisabled,
  navigation,
  onClose,
  onCopyBrief,
  onCopy,
  onNavigate,
}: {
  project: (typeof cstdProjects)[number];
  briefCopyResult: CstdProjectCopyResult | null;
  copyResult: CstdProjectCopyResult | null;
  focusRef: RefObject<HTMLElement | null>;
  motionDisabled: boolean;
  navigation: {
    previous: (typeof cstdProjects)[number] | null;
    next: (typeof cstdProjects)[number] | null;
  };
  onClose: () => void;
  onCopyBrief: () => void;
  onCopy: () => void;
  onNavigate: (projectId: string) => void;
}) {
  const Icon = projectIcons[project.icon];
  const copyMessage = {
    copied: "案例链接已复制",
    unsupported: "浏览器不支持自动复制，请复制当前地址",
    failed: "复制失败，请手动复制当前地址",
  }[copyResult ?? "copied"];
  const briefCopyMessage = {
    copied: "案例摘要已复制",
    unsupported: "浏览器不支持自动复制，请手动复制摘要",
    failed: "摘要复制失败，请手动复制",
  }[briefCopyResult ?? "copied"];
  const projectBriefText = buildCstdProjectBrief(project);
  const evidenceChecklist = getCstdProjectEvidenceChecklist(project);
  const evidenceChecklistSummary = getCstdProjectEvidenceChecklistSummary(evidenceChecklist);

  return (
    <motion.section
      ref={focusRef}
      id="project-focus"
      aria-labelledby={`project-focus-${project.id}`}
      className="scroll-mt-24 mb-6 overflow-hidden rounded-xl border-2 border-[#2f241d] bg-[#fffaf0]/96 shadow-[10px_10px_0_rgba(47,36,29,.1)]"
      initial={motionDisabled ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={motionDisabled ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.24 }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#ead6ad] bg-[#f6bf3f]/18 p-4 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#0f8f64] shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-[#d98528]">Project case study</p>
            <h3 id={`project-focus-${project.id}`} className="mt-1 text-2xl font-black sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#6f5b4a]">{project.evidence.current}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭案例焦点"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ead6ad] bg-white text-[#2f241d] transition hover:border-[#d98528] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={cstdProjectFocusBodyClassName}>
        <div className="grid gap-5">
          <dl className="grid gap-4">
            <ProjectEvidence label="负责" value={project.evidence.role} />
            <ProjectEvidence label="解决问题" value={project.evidence.problem} />
            <ProjectEvidence label="已交付" value={project.evidence.outcome} />
          </dl>
          <div className="rounded-xl border border-[#ead6ad] bg-white/72 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d98528]">证据清单</p>
              <p className="text-xs font-black text-[#0f8f64]">{evidenceChecklistSummary}</p>
            </div>
            <ul className={cstdProjectFocusChecklistGridClassName}>
              {evidenceChecklist.map((item) => (
                <li key={item.label} className="flex min-w-0 items-start gap-2 rounded-lg bg-[#fffaf0] p-3">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${item.complete ? "bg-[#dff8ed] text-[#047857]" : "bg-[#ffe7ec] text-[#be4563]"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black text-[#2f241d]">{item.label}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-[#6f5b4a]">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={cstdProjectFocusActionRailClassName}>
          <p className="text-sm font-black text-[#2f241d]">继续查看</p>
          <div className="grid gap-2">
            <ProjectFocusNavigationButton direction="previous" project={navigation.previous} onNavigate={onNavigate} />
            <ProjectFocusNavigationButton direction="next" project={navigation.next} onNavigate={onNavigate} />
          </div>
          <HeroButton href={project.href}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {project.action}
          </HeroButton>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#b8d7f5] bg-[#e3f2ff] px-4 text-sm font-black text-[#2563eb] transition hover:border-[#2563eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
          >
            {copyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            复制案例链接
          </button>
          {copyResult ? (
            <p role="status" className="text-xs font-semibold leading-5 text-[#6f5b4a]">
              {copyMessage}
            </p>
          ) : null}
          <button
            type="button"
            onClick={onCopyBrief}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#ead6ad] bg-white px-4 text-sm font-black text-[#2f241d] transition hover:-translate-y-0.5 hover:border-[#d98528] hover:bg-[#fff7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
          >
            {briefCopyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            复制案例摘要
          </button>
          {briefCopyResult ? (
            <p role="status" className="text-xs font-semibold leading-5 text-[#6f5b4a]">
              {briefCopyMessage}
            </p>
          ) : null}
          {briefCopyResult && briefCopyResult !== "copied" ? (
            <textarea
              aria-label="案例摘要文本"
              readOnly
              value={projectBriefText}
              className="min-h-36 resize-y rounded-lg border border-[#ead6ad] bg-[#fffaf0] p-3 text-xs font-semibold leading-5 text-[#4f3d31] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
            />
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}

function ProjectFocusNavigationButton({
  direction,
  project,
  onNavigate,
}: {
  direction: "previous" | "next";
  project: (typeof cstdProjects)[number] | null;
  onNavigate: (projectId: string) => void;
}) {
  if (!project) {
    return (
      <div className="flex min-h-12 items-center gap-2 rounded-lg border border-dashed border-[#ead6ad] bg-[#fffaf0]/70 px-3 text-xs font-black text-[#9a8776]">
        {direction === "previous" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span>{direction === "previous" ? "已经是第一个项目" : "已经是最后一个项目"}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`${direction === "previous" ? "查看上一个项目" : "查看下一个项目"}：${project.title}`}
      onClick={() => onNavigate(project.id)}
      className="group flex min-h-12 items-center gap-2 rounded-lg border border-[#ead6ad] bg-white px-3 text-left transition hover:-translate-y-0.5 hover:border-[#d98528] hover:bg-[#fff7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
    >
      {direction === "previous" ? <ChevronLeft className="h-4 w-4 shrink-0 text-[#d98528]" /> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9a5a18]">
          {direction === "previous" ? "上一个项目" : "下一个项目"}
        </span>
        <span className="mt-0.5 block truncate text-sm font-black text-[#2f241d]">{project.title}</span>
      </span>
      {direction === "next" ? <ChevronRight className="h-4 w-4 shrink-0 text-[#d98528]" /> : null}
    </button>
  );
}

function ProjectEvidence({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-3">
      <dt className="font-black text-[#d98528]">{label}</dt>
      <dd className="m-0 min-w-0 leading-6 text-[#5f4b3d]">{value}</dd>
    </div>
  );
}
