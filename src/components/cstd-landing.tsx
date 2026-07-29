"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, Bot, Building2, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, ExternalLink, GitCompareArrows, Menu, Pause, Play, RotateCcw, Search, Sparkles, TrendingUp, Volume2, VolumeX, X, type LucideIcon } from "lucide-react";
import { playCstdIntroSound, setCstdAudioVolume, startCstdBgm, stopCstdBgm } from "@/lib/cstd-intro-sound";
import { getCstdLinkTargetProps } from "@/lib/cstd-link-target";
import { shouldApplyCstdMascotMoodChange, type CstdMascotMood } from "@/lib/cstd-mascot-mood";
import { cstdNavigationItems, getCstdMobileNavigationToggleState } from "@/lib/cstd-navigation";
import { getCstdProjectCardPreview, getCstdProjectFocusButtonLabel } from "@/lib/cstd-project-card";
import { getCstdProjectCapabilityIndex } from "@/lib/cstd-project-capability-index";
import {
  CSTD_PROJECT_COMPARISON_LIMIT,
  buildCstdProjectComparisonBrief,
  didCompleteCstdProjectComparison,
  getCstdProjectComparison,
  getCstdProjectComparisonControl,
  toggleCstdProjectComparison,
  type CstdProjectComparison as CstdProjectComparisonData,
} from "@/lib/cstd-project-comparison";
import { getCstdProjectComparisonContext, getCstdProjectComparisonRestoredContinuation } from "@/lib/cstd-project-comparison-context";
import { getCstdProjectComparisonFit, type CstdProjectComparisonFit } from "@/lib/cstd-project-comparison-fit";
import {
  getCstdProjectComparisonHandoff,
  type CstdProjectComparisonHandoff,
} from "@/lib/cstd-project-comparison-handoff";
import {
  alignCstdProjectComparisonIds,
  getCstdProjectComparisonNextStep,
  type CstdProjectComparisonNextStep,
} from "@/lib/cstd-project-comparison-next-step";
import { getCstdProjectComparisonScanSummary, type CstdProjectComparisonScanItem } from "@/lib/cstd-project-comparison-scan";
import {
  buildCstdProjectBrief,
  buildCstdProjectLinkDirectory,
  copyCstdProjectLink,
  getCstdProjectBriefCopyPresentation,
  getCstdProjectEvidenceChecklist,
  getCstdProjectEvidenceChecklistSummary,
  getCstdProjectFocusNavigation,
  type CstdProjectBriefCopyPresentation,
  type CstdProjectCopyResult,
} from "@/lib/cstd-project-focus";
import { cstdProjects, type CstdProjectIconKey } from "@/lib/cstd-projects";
import { getCstdProjectEvidenceOverview } from "@/lib/cstd-project-evidence-overview";
import { buildCstdProjectPortfolioBrief } from "@/lib/cstd-project-portfolio-brief";
import { getCstdProjectProofTimeline } from "@/lib/cstd-project-proof-timeline";
import {
  getCstdProjectWorkflowAction,
  getCstdProjectWorkflowSummary,
  type CstdProjectWorkflowAction,
  type CstdProjectWorkflowSummaryItem,
} from "@/lib/cstd-project-workflow-summary";
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
  getCstdProjectControlBadges,
  getCstdProjectControlSummary,
  getCstdProjectFilterSummary,
  hasActiveCstdProjectControls,
  type CstdProjectFilter,
} from "@/lib/cstd-project-filter";
import {
  cstdProjectGuides,
  getCstdProjectGuide,
  getCstdProjectGuideCopyPresentation,
  getCstdProjectGuideDirectoryContinuation,
  getCstdProjectGuideRestoredReceipt,
  getCstdProjectGuideSummary,
  type CstdProjectGuideId,
} from "@/lib/cstd-project-guide";
import { getCstdProjectLayout } from "@/lib/cstd-project-layout";
import {
  buildCstdProjectGuideShareHref,
  buildCstdProjectViewHref,
  getCstdProjectDirectoryRestoredAction,
  getCstdProjectDirectoryRestoredReceipt,
  getCstdProjectFocusRestoredAction,
  getCstdProjectFocusRestoredReceipt,
  hasActiveCstdProjectViewState,
  isCstdProjectGuideShareRestored,
  parseCstdProjectViewState,
  type CstdProjectFocusRestoredAction,
  type CstdProjectRestoredReceipt,
  type CstdProjectViewHash,
} from "@/lib/cstd-project-view-state";
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
  cstdProjectDetailsBodyClassName,
  cstdProjectDetailsDesktopClassName,
  cstdProjectDetailsDisclosureClassName,
  cstdProjectDetailsMetaClassName,
  cstdProjectDetailsSummaryClassName,
  cstdProjectEvidenceClassName,
  cstdProjectEvidenceShareGridClassName,
  cstdProjectCardActionRailClassName,
  cstdProjectCardPrimaryActionClassName,
  cstdProjectCardSecondaryActionClassName,
  cstdProjectComparisonClassName,
  cstdProjectComparisonColumnsClassName,
  cstdProjectFocusActionRailClassName,
  cstdProjectFocusBodyClassName,
  cstdProjectFocusChecklistGridClassName,
  cstdProjectGridClassName,
  cstdProjectGuideActionRailClassName,
  cstdProjectGuideClearActionClassName,
  cstdProjectGuideHeaderActionsClassName,
  cstdProjectGuideMatchLayoutClassName,
  cstdProjectGuidePrimaryActionClassName,
  cstdProjectGuideSecondaryActionClassName,
  cstdProjectGuideWideActionClassName,
  cstdProjectHeadingClassName,
  cstdProjectMetricGridClassName,
  cstdProjectMetricLabelClassName,
  cstdProjectMetricTileClassName,
  cstdProjectMetricValueClassName,
  cstdProjectProofTimelineGridClassName,
  cstdRestoredEntryActionClassName,
  cstdRestoredEntryActionsClassName,
  cstdRestoredEntryNextClassName,
  cstdRestoredEntryShellClassName,
  cstdProjectToolbarActionsClassName,
  cstdProjectToolbarClassName,
  cstdProjectWorkflowSummaryGridClassName,
} from "@/lib/cstd-mobile-layout";

type MascotMood = CstdMascotMood;
type CstdIntroPhase = "idle" | "playing";
type CstdAudioPreference = "enabled" | "disabled";

const CSTD_AUDIO_PREFERENCE_KEY = "cstd.audioPreference";
const CSTD_BGM_NORMAL_VOLUME = 0.12;
const CSTD_BGM_DUCKED_VOLUME = 0.035;
const useCstdClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const projectIcons: Record<CstdProjectIconKey, LucideIcon> = {
  sparkles: Sparkles,
  camera: Camera,
  "trending-up": TrendingUp,
  bot: Bot,
  building: Building2,
  rotate: RotateCcw,
};

const noteItems = [
  ["05", "个产品在线"],
  ["347", "只精灵资料"],
  ["01", "个人独立工作室"],
] as const;

const cstdProjectComparisonFitLabelClassNames: Record<CstdProjectComparisonFit["items"][number]["kind"], string> = {
  direct: "bg-[#dff8ed] text-[#047857]",
  reference: "bg-[#fff0c9] text-[#8a4b15]",
  unscoped: "bg-[#e3f2ff] text-[#2563eb]",
};

const cstdProjectComparisonScanToneClassNames: Record<CstdProjectComparisonScanItem["tone"], string> = {
  direct: "border-[#9bd9bf] bg-[#dff8ed]/80 text-[#047857]",
  reference: "border-[#f2d18d] bg-[#fff0c9]/80 text-[#8a4b15]",
  evidence: "border-[#b8d7f5] bg-[#e3f2ff]/80 text-[#2563eb]",
  unscoped: "border-[#d8c8ad] bg-white/80 text-[#6f5b4a]",
};

const cstdRestoredEntryToneClassNames = {
  directory: {
    shell: "border-[#b8d7f5] bg-[#e3f2ff]/72 text-[#2563eb]",
    detail: "text-[#315b7f]",
    next: "border-[#b8d7f5]",
    button: "border-[#2563eb] text-[#2563eb] hover:bg-[#f2f8ff] focus-visible:outline-[#2563eb]",
  },
  focus: {
    shell: "border-[#9bd9bf] bg-[#dff8ed]/78 text-[#047857]",
    detail: "text-[#355b4a]",
    next: "border-[#9bd9bf]",
    button: "border-[#1b4332] text-[#0f8f64] hover:bg-[#f7fffb] focus-visible:outline-[#0f8f64]",
  },
} as const;

const cstdRestoredEntryFeedbackClassNames: Record<CstdProjectBriefCopyPresentation["tone"], string> = {
  success: "text-[#047857]",
  warning: "text-[#8a4b15]",
};

const projectEvidenceOverview = getCstdProjectEvidenceOverview(cstdProjects);
const projectProofTimeline = getCstdProjectProofTimeline(cstdProjects);
const projectCapabilityIndex = getCstdProjectCapabilityIndex(cstdProjects);
const projectGuideSummary = getCstdProjectGuideSummary(cstdProjectGuides, cstdProjects);
const heroPreviewProjects = cstdProjects.filter((project) => project.status === "Live" && project.preview);

function getCstdClipboardWriter() {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return undefined;
  return (text: string) => navigator.clipboard.writeText(text);
}

function isCstdManagedFocusTarget(element: Element | null): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;
  return element.id === "project-guide-heading"
    || element.id === "project-comparison-heading"
    || element.id.startsWith("project-focus-");
}

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
  const desktopCustardStageEnabled = useDesktopCustardStage();
  const initialized = useRef(false);
  const projectFocusRef = useRef<HTMLElement>(null);
  const projectFocusHeadingPendingRef = useRef(false);
  const comparisonResultFocusPendingRef = useRef(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [introPhase, setIntroPhase] = useState<CstdIntroPhase>("idle");
  const [motionPreference, setMotionPreference] = useState<CstdMotionPreference>("enabled");
  const [audioPreference, setAudioPreference] = useState<CstdAudioPreference>("enabled");
  const [activeProjectFilter, setActiveProjectFilter] = useState<CstdProjectFilter>("all");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectViewStateSynced, setProjectViewStateSynced] = useState(false);
  const [comparisonGoalHandoffPending, setComparisonGoalHandoffPending] = useState(false);
  const [projectDirectoryRestoredFromUrl, setProjectDirectoryRestoredFromUrl] = useState(false);
  const [projectGuideRestoredFromUrl, setProjectGuideRestoredFromUrl] = useState(false);
  const [projectFocusRestoredFromUrl, setProjectFocusRestoredFromUrl] = useState(false);
  const [projectViewStateRestoredFromUrl, setProjectViewStateRestoredFromUrl] = useState(false);
  const [projectDecisionContextFirst, setProjectDecisionContextFirst] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<CstdProjectGuideId | null>(null);
  const [comparedProjectIds, setComparedProjectIds] = useState<string[]>([]);
  const [projectCopyResult, setProjectCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectBriefCopyResult, setProjectBriefCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [portfolioCopyResult, setPortfolioCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [comparisonBriefCopyResult, setComparisonBriefCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectLinkDirectoryCopyResult, setProjectLinkDirectoryCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectDirectoryCopyResult, setProjectDirectoryCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectGuideCopyResult, setProjectGuideCopyResult] = useState<CstdProjectCopyResult | null>(null);
  const [projectGuideShareUrl, setProjectGuideShareUrl] = useState("");
  const [bgmActive, setBgmActive] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>("curious");
  const mascotHappyUntilRef = useRef(0);
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
    const hasProjectViewState = hasActiveCstdProjectViewState(window.location.search);
    const shouldShowIntro = shouldPlayCstdIntro({
      hasProjectViewState,
      reducedMotion,
      motionPreference: preference,
      introSeen,
    });
    setMotionPreference(preference);
    setAudioPreference(audioPreference);
    setIntroVisible(shouldShowIntro);
    setIntroPhase("idle");
  }, [reducedMotion]);

  useCstdClientLayoutEffect(() => {
    const syncViewState = () => {
      const viewState = parseCstdProjectViewState(window.location.search);
      const hasRestoredProjectViewState = hasActiveCstdProjectViewState(window.location.search);
      setActiveProjectFilter(viewState.filter);
      setProjectSearchQuery(viewState.query);
      setSelectedGuideId(viewState.guideId);
      setSelectedProjectId(viewState.projectId);
      setComparedProjectIds(viewState.compareProjectIds);
      setProjectGuideCopyResult(null);
      setProjectGuideShareUrl("");
      setProjectDirectoryRestoredFromUrl(hasRestoredProjectViewState && (viewState.filter !== "all" || viewState.query.length > 0));
      setProjectGuideRestoredFromUrl(isCstdProjectGuideShareRestored(viewState));
      setProjectFocusRestoredFromUrl(hasRestoredProjectViewState && viewState.projectId !== null);
      setProjectViewStateRestoredFromUrl(hasRestoredProjectViewState && viewState.compareProjectIds.length > 0);
      setProjectDecisionContextFirst(viewState.guideId !== null || viewState.compareProjectIds.length > 0);
      setProjectViewStateSynced(true);
    };
    syncViewState();
    const handlePopState = () => {
      if (isCstdManagedFocusTarget(document.activeElement)) {
        document.activeElement.blur();
      }
      projectFocusHeadingPendingRef.current = false;
      comparisonResultFocusPendingRef.current = false;
      setComparisonGoalHandoffPending(false);
      syncViewState();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId || window.location.hash !== "#project-focus") return;
    const frame = window.requestAnimationFrame(() => {
      projectFocusRef.current?.scrollIntoView({ behavior: motionDisabled ? "auto" : "smooth", block: "start" });
      if (!projectFocusHeadingPendingRef.current) return;

      document.getElementById(`project-focus-${selectedProjectId}`)?.focus({ preventScroll: true });
      projectFocusHeadingPendingRef.current = false;
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
  const projectControlBadges = useMemo(() => getCstdProjectControlBadges(activeProjectFilter, projectSearchQuery), [activeProjectFilter, projectSearchQuery]);
  const hasProjectControlState = useMemo(() => hasActiveCstdProjectControls(activeProjectFilter, projectSearchQuery), [activeProjectFilter, projectSearchQuery]);
  const projectDirectoryRestoredReceipt = useMemo(
    () =>
      projectDirectoryRestoredFromUrl
        ? getCstdProjectDirectoryRestoredReceipt({
            filter: activeProjectFilter,
            query: projectSearchQuery,
            visibleProjectCount: visibleProjects.length,
          })
        : null,
    [activeProjectFilter, projectDirectoryRestoredFromUrl, projectSearchQuery, visibleProjects.length],
  );
  const projectDirectoryRestoredAction = useMemo(
    () =>
      projectDirectoryRestoredReceipt
        ? getCstdProjectDirectoryRestoredAction({
            firstProjectTitle: visibleProjects[0]?.title ?? null,
            visibleProjectCount: visibleProjects.length,
          })
        : null,
    [projectDirectoryRestoredReceipt, visibleProjects],
  );
  const projectComparison = useMemo(() => getCstdProjectComparison(cstdProjects, comparedProjectIds), [comparedProjectIds]);
  const selectedGuide = useMemo(() => getCstdProjectGuide(selectedGuideId), [selectedGuideId]);
  const projectComparisonFit = useMemo(
    () => getCstdProjectComparisonFit(selectedGuide, projectComparison.projects),
    [projectComparison.projects, selectedGuide],
  );
  const projectComparisonScanSummary = useMemo(
    () => getCstdProjectComparisonScanSummary(projectComparison, projectComparisonFit),
    [projectComparison, projectComparisonFit],
  );
  const projectComparisonNextStep = useMemo(
    () => getCstdProjectComparisonNextStep(selectedGuide, cstdProjects, projectComparison.projects),
    [projectComparison.projects, selectedGuide],
  );
  const projectWorkflowSummary = useMemo(
    () =>
      getCstdProjectWorkflowSummary({
        compareCount: projectComparison.projects.length,
        compareLimit: CSTD_PROJECT_COMPARISON_LIMIT,
        guideGoal: selectedGuide?.goal ?? null,
        liveEvidenceCount: cstdProjects.filter((project) => project.status === "Live").length,
        totalProjectCount: cstdProjects.length,
        visibleProjectCount: visibleProjects.length,
      }),
    [projectComparison.projects.length, selectedGuide?.goal, visibleProjects.length],
  );
  const projectWorkflowAction = getCstdProjectWorkflowAction({
    compareCount: projectComparison.projects.length,
    compareLimit: CSTD_PROJECT_COMPARISON_LIMIT,
    guideCount: projectGuideSummary.goalCount,
    hasGuide: Boolean(selectedGuide),
  });
  const selectedProject = useMemo(
    () => cstdProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId],
  );
  const selectedProjectComparisonHandoff = useMemo(
    () => getCstdProjectComparisonHandoff(selectedGuide, selectedProject, projectComparison.projects),
    [projectComparison.projects, selectedGuide, selectedProject],
  );
  const selectedProjectRestoredReceipt = useMemo(
    () => (projectFocusRestoredFromUrl && selectedProject ? getCstdProjectFocusRestoredReceipt(selectedProject.title) : null),
    [projectFocusRestoredFromUrl, selectedProject],
  );
  const selectedProjectRestoredAction = useMemo(
    () => (projectFocusRestoredFromUrl && selectedProject ? getCstdProjectFocusRestoredAction(selectedProject.title) : null),
    [projectFocusRestoredFromUrl, selectedProject],
  );
  const selectedProjectNavigation = useMemo(
    () => (selectedProject ? getCstdProjectFocusNavigation(cstdProjects, selectedProject.id) : { previous: null, next: null }),
    [selectedProject],
  );
  const projectViewHref = useMemo(
    () =>
      buildCstdProjectViewHref(
        typeof window === "undefined" ? "/cstd" : window.location.pathname,
        {
          filter: activeProjectFilter,
          query: projectSearchQuery,
          guideId: selectedGuideId,
          projectId: selectedProjectId,
          compareProjectIds: comparedProjectIds,
        },
        selectedProjectId ? "project-focus" : "projects",
      ),
    [activeProjectFilter, comparedProjectIds, projectSearchQuery, selectedGuideId, selectedProjectId],
  );
  const mobileNavigationToggle = getCstdMobileNavigationToggleState(mobileNavOpen);

  useEffect(() => {
    if (!projectViewStateSynced || window.location.hash !== "#project-guide") return;
    const frame = window.requestAnimationFrame(() => {
      const guideSection = document.getElementById("project-guide");
      if (!guideSection) return;

      guideSection.scrollIntoView({
        behavior: comparisonGoalHandoffPending && !motionDisabled ? "smooth" : "auto",
        block: "start",
      });
      if (!comparisonGoalHandoffPending) return;

      document.getElementById("project-guide-heading")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [comparisonGoalHandoffPending, motionDisabled, projectViewStateSynced, selectedGuideId]);

  useEffect(() => {
    if (!projectViewStateSynced || projectComparison.projects.length === 0) return;
    if (window.location.hash !== "#project-comparison") return;
    const frame = window.requestAnimationFrame(() => {
      const comparisonSection = document.getElementById("project-comparison");
      if (!comparisonSection) return;

      comparisonSection.scrollIntoView({ block: "start" });
      if (!comparisonResultFocusPendingRef.current) return;

      document.getElementById("project-comparison-heading")?.focus({ preventScroll: true });
      comparisonResultFocusPendingRef.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [projectComparison.projects.length, projectViewStateSynced, selectedGuideId, selectedProjectId]);

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
    mascotHappyUntilRef.current = Date.now() + 900;
    setMascotMood("happy");
    window.setTimeout(() => setMascotMood("working"), 900);
    window.setTimeout(() => setMascotMood("curious"), 2200);
  }

  function handleMascotMoodChange(nextMood: MascotMood) {
    if (!shouldApplyCstdMascotMoodChange({ nextMood, now: Date.now(), happyUntil: mascotHappyUntilRef.current })) {
      return;
    }

    setMascotMood(nextMood);
  }

  function clearRestoredProjectViewReceipts() {
    setProjectDirectoryRestoredFromUrl(false);
    setProjectGuideRestoredFromUrl(false);
    setProjectFocusRestoredFromUrl(false);
    setProjectViewStateRestoredFromUrl(false);
  }

  function focusProject(projectId: string) {
    projectFocusHeadingPendingRef.current = true;
    const href = buildCstdProjectViewHref(
      window.location.pathname,
      {
        filter: activeProjectFilter,
        query: projectSearchQuery,
        guideId: selectedGuideId,
        projectId,
        compareProjectIds: comparedProjectIds,
      },
      "project-focus",
    );
    window.history.pushState(null, "", href);
    setProjectCopyResult(null);
    setProjectBriefCopyResult(null);
    setSelectedProjectId(projectId);
    setProjectDirectoryCopyResult(null);
    clearRestoredProjectViewReceipts();
  }

  function closeProjectFocus() {
    const shouldReturnToComparison = selectedProjectComparisonHandoff !== null;
    comparisonResultFocusPendingRef.current = shouldReturnToComparison;
    window.history.pushState(
      null,
      "",
      buildCstdProjectViewHref(
        window.location.pathname,
        {
          filter: activeProjectFilter,
          query: projectSearchQuery,
          guideId: selectedGuideId,
          projectId: null,
          compareProjectIds: comparedProjectIds,
        },
        shouldReturnToComparison ? "project-comparison" : "projects",
      ),
    );
    setSelectedProjectId(null);
    setProjectCopyResult(null);
    setProjectBriefCopyResult(null);
    setProjectDirectoryCopyResult(null);
    setProjectGuideCopyResult(null);
    setProjectGuideShareUrl("");
    clearRestoredProjectViewReceipts();
  }

  function updateProjectDirectoryControls(filter: CstdProjectFilter, query: string) {
    window.history.replaceState(
      null,
      "",
      buildCstdProjectViewHref(window.location.pathname, {
        filter,
        query,
        guideId: selectedGuideId,
        projectId: null,
        compareProjectIds: comparedProjectIds,
      }),
    );
    setActiveProjectFilter(filter);
    setProjectSearchQuery(query);
    setSelectedProjectId(null);
    setProjectCopyResult(null);
    setProjectBriefCopyResult(null);
    setProjectDirectoryCopyResult(null);
    setProjectGuideCopyResult(null);
    setProjectGuideShareUrl("");
    clearRestoredProjectViewReceipts();
  }

  function resetProjectControls() {
    updateProjectDirectoryControls("all", "");
  }

  function browseProjectCategory(filter: CstdProjectFilter) {
    updateProjectDirectoryControls(filter, "");
    window.requestAnimationFrame(() => {
      document.getElementById("project-directory")?.scrollIntoView({
        behavior: motionDisabled ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function handleRestoredDirectoryAction() {
    if (!projectDirectoryRestoredAction) return;
    if (projectDirectoryRestoredAction.kind === "reset") {
      resetProjectControls();
      return;
    }

    const firstProject = visibleProjects[0];
    if (firstProject) focusProject(firstProject.id);
  }

  function toggleProjectComparison(projectId: string) {
    const nextComparedProjectIds = toggleCstdProjectComparison(comparedProjectIds, projectId);
    const shouldHandoff = didCompleteCstdProjectComparison(comparedProjectIds, nextComparedProjectIds);
    comparisonResultFocusPendingRef.current = shouldHandoff;
    if (shouldHandoff) {
      updateProjectComparison(nextComparedProjectIds, "project-comparison");
      return;
    }
    updateProjectComparison(nextComparedProjectIds);
  }

  function updateProjectComparison(
    nextComparedProjectIds: string[],
    hash: CstdProjectViewHash = selectedProjectId ? "project-focus" : "projects",
  ) {
    window.history.pushState(
      null,
      "",
      buildCstdProjectViewHref(
        window.location.pathname,
        {
          filter: activeProjectFilter,
          query: projectSearchQuery,
          guideId: selectedGuideId,
          projectId: selectedProjectId,
          compareProjectIds: nextComparedProjectIds,
        },
        hash,
      ),
    );
    setComparedProjectIds(nextComparedProjectIds);
    setComparisonBriefCopyResult(null);
    setProjectDirectoryCopyResult(null);
    clearRestoredProjectViewReceipts();
  }

  function alignProjectComparisonToGoal(projectId: string) {
    const nextIds = alignCstdProjectComparisonIds(comparedProjectIds, projectId);
    updateProjectComparison(nextIds, "project-comparison");
  }

  function removeProjectFromComparison(projectId: string) {
    const nextComparedProjectIds = toggleCstdProjectComparison(comparedProjectIds, projectId);
    if (nextComparedProjectIds.length === 0) {
      updateProjectComparison(nextComparedProjectIds);
      return;
    }
    updateProjectComparison(nextComparedProjectIds, "project-comparison");
  }

  function focusProjectGuide() {
    setComparisonGoalHandoffPending(true);
    window.history.pushState(
      null,
      "",
      buildCstdProjectViewHref(
        window.location.pathname,
        {
          filter: activeProjectFilter,
          query: projectSearchQuery,
          guideId: selectedGuideId,
          projectId: selectedProjectId,
          compareProjectIds: comparedProjectIds,
        },
        "project-guide",
      ),
    );
  }

  function selectProjectGuide(guideId: CstdProjectGuideId | null) {
    const shouldReturnToComparison =
      guideId !== null && window.location.hash === "#project-guide" && comparedProjectIds.length > 0;
    comparisonResultFocusPendingRef.current = shouldReturnToComparison;
    setComparisonGoalHandoffPending(false);
    window.history.pushState(
      null,
      "",
      buildCstdProjectViewHref(
        window.location.pathname,
        {
          filter: activeProjectFilter,
          query: projectSearchQuery,
          guideId,
          projectId: null,
          compareProjectIds: comparedProjectIds,
        },
        shouldReturnToComparison ? "project-comparison" : "projects",
      ),
    );
    setSelectedGuideId(guideId);
    setSelectedProjectId(null);
    setComparisonBriefCopyResult(null);
    setProjectDirectoryCopyResult(null);
    setProjectGuideCopyResult(null);
    setProjectGuideShareUrl("");
    clearRestoredProjectViewReceipts();
  }

  async function copyProjectGuideLink() {
    const href = buildCstdProjectGuideShareHref(window.location.pathname, selectedGuideId);
    if (!href) return;

    const url = `${window.location.origin}${href}`;
    setProjectGuideShareUrl(url);
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      url,
    );
    setProjectGuideCopyResult(result);
  }

  async function copyProjectFocusLink() {
    if (!selectedProject) return;
    const href = buildCstdProjectViewHref(
      window.location.pathname,
      {
        filter: activeProjectFilter,
        query: projectSearchQuery,
        guideId: selectedGuideId,
        projectId: selectedProject.id,
        compareProjectIds: comparedProjectIds,
      },
      "project-focus",
    );
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      `${window.location.origin}${href}`,
    );
    setProjectCopyResult(result);
  }

  async function copyProjectBrief() {
    if (!selectedProject) return;
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      buildCstdProjectBrief(selectedProject),
    );
    setProjectBriefCopyResult(result);
  }

  async function copyPortfolioBrief() {
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      buildCstdProjectPortfolioBrief(cstdProjects),
    );
    setPortfolioCopyResult(result);
  }

  async function copyProjectLinkDirectory() {
    const directory = buildCstdProjectLinkDirectory(cstdProjects, window.location.origin, window.location.pathname);
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      directory,
    );
    setProjectLinkDirectoryCopyResult(result);
  }

  async function copyProjectDirectoryView() {
    const href = `${window.location.origin}${projectViewHref}`;
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      href,
    );
    setProjectDirectoryCopyResult(result);
  }

  async function copyProjectComparisonBrief() {
    const context = getCstdProjectComparisonContext({
      guideGoal: selectedGuide?.goal ?? null,
      projectTitles: projectComparison.projects.map((project) => project.title),
    });
    const href = buildCstdProjectViewHref(
      window.location.pathname,
      {
        filter: activeProjectFilter,
        query: projectSearchQuery,
        guideId: selectedGuideId,
        projectId: null,
        compareProjectIds: comparedProjectIds,
      },
      "project-comparison",
    );
    const result = await copyCstdProjectLink(
      getCstdClipboardWriter(),
      buildCstdProjectComparisonBrief({
        comparison: projectComparison,
        fit: projectComparisonFit,
        goalLabel: context.goalLabel,
        projectLabel: context.projectLabel,
        url: `${window.location.origin}${href}`,
      }),
    );
    setComparisonBriefCopyResult(result);
  }

  const hasProjectDecisionContext = projectDecisionContextFirst;
  const projectDecisionContent = (
    <>
      {projectViewStateSynced ? (
        <ProjectWorkflowSummary action={projectWorkflowAction} items={projectWorkflowSummary} />
      ) : null}

      <ProjectGuide
        comparedProjectIds={comparedProjectIds}
        guideSummary={projectGuideSummary}
        motionDisabled={motionDisabled}
        projectGuideCopyResult={projectGuideCopyResult}
        projectGuideRestoredFromUrl={projectGuideRestoredFromUrl}
        projectGuideShareUrl={projectGuideShareUrl}
        selectedGuideId={selectedGuideId}
        onBrowseCategory={browseProjectCategory}
        onCopyGuide={copyProjectGuideLink}
        onFocus={focusProject}
        onSelect={selectProjectGuide}
        onToggleComparison={toggleProjectComparison}
      />

      {projectComparison.projects.length > 0 ? (
        <ProjectComparison
          comparison={projectComparison}
          copyResult={comparisonBriefCopyResult}
          fit={projectComparisonFit}
          guideGoal={selectedGuide?.goal ?? null}
          nextStep={projectComparisonNextStep}
          restoredFromUrl={projectViewStateRestoredFromUrl}
          scanSummary={projectComparisonScanSummary}
          onAlign={alignProjectComparisonToGoal}
          onClear={() => updateProjectComparison([])}
          onCopyBrief={copyProjectComparisonBrief}
          onFocus={focusProject}
          onRemove={removeProjectFromComparison}
          onSelectGoal={focusProjectGuide}
        />
      ) : null}
    </>
  );

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f4f3ed] text-[#2f241d]">
      <AnimatePresence>{introVisible ? <CstdIntro phase={introPhase} onSkip={skipIntro} onStart={beginIntroPlayback} /> : null}</AnimatePresence>

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
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#202820] lg:block" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-[#f6bf3f]" />

          <motion.div
            initial={motionDisabled ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10 self-center"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#f6bf3f] sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-[#4ee0a5] shadow-[0_0_0_5px_rgba(78,224,165,.12)]" />
                Independent product studio
              </p>
              <button
                type="button"
                onClick={pokeMascot}
                onPointerEnter={() => handleMascotMoodChange("working")}
                onPointerLeave={() => handleMascotMoodChange("curious")}
                aria-label="点击奶黄包互动"
                title="点一点奶黄包"
                className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/30 bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6bf3f] lg:hidden"
              >
                <motion.img
                  src="/cstd-mascot.svg"
                  alt=""
                  className="h-12 w-12 object-contain"
                  animate={motionDisabled ? undefined : { y: [0, -2, 0], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                />
                <span className="sr-only">{mascotCopy}</span>
              </button>
            </div>

            <div className="mt-3 overflow-hidden sm:mt-4">
              <motion.h1
                className="text-[clamp(4rem,21vw,5.6rem)] font-black leading-[0.78] tracking-[0.03em] text-[#f6bf3f] sm:text-[clamp(5rem,12vw,9rem)] sm:leading-[0.76]"
                initial={motionDisabled ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.08, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
              >
                CSTD
              </motion.h1>
            </div>
            <motion.p
              className="mt-4 max-w-3xl text-[clamp(1.65rem,8vw,2.4rem)] font-black leading-[1.08] text-white sm:mt-5 sm:text-[clamp(2rem,4vw,3.4rem)]"
              initial={motionDisabled ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
            >
              <span className="block">把灵感，做成</span>
              <span className="block text-[#aaf0d5]">真正能用的产品。</span>
            </motion.p>
            <motion.p
              className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[#d8d3c8] sm:mt-5 sm:text-base sm:leading-7"
              initial={motionDisabled ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              独立完成产品设计、全栈开发与持续运营。这里收纳游戏数据、影像服务、投资研究、AI 创作与业务系统，每一个都已经可以打开使用。
            </motion.p>

            <motion.div
              className={cstdHeroActionsClassName}
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              <HeroButton href="#project-grid" primary hero wideOnMobile>
                浏览全部项目
              </HeroButton>
              <HeroButton href="https://rocodex.custard.top" hero>RocoDex</HeroButton>
              <HeroButton href="https://shoot.custard.top" hero>摄影作品</HeroButton>
            </motion.div>

            <motion.div
              className="mt-5 grid max-w-2xl grid-cols-3 divide-x divide-white/20 border-y border-white/20 py-3 sm:mt-6"
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {noteItems.map(([value, label]) => (
                <div key={`${value}-${label}`} className="min-w-0 px-2 first:pl-0 sm:px-4">
                  <strong className="block break-words text-lg font-black text-white sm:text-2xl">{value}</strong>
                  <span className="mt-1 block break-words text-[0.62rem] font-bold leading-4 text-[#aaa397] sm:text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.aside
            className={`${cstdMascotAsideClassName} hidden lg:block`}
            initial={motionDisabled ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            aria-label="奶黄包互动角色"
          >
            <motion.div
              className="absolute right-0 top-8 hidden rounded-lg border border-white/25 bg-[#f46d8b] px-4 py-2 text-sm font-black text-white shadow-[6px_6px_0_rgba(0,0,0,.22)] md:block"
              animate={motionDisabled ? undefined : { rotate: [5, 2, 5], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            >
              05 products live
            </motion.div>
            <motion.div
              className="absolute left-0 top-20 hidden rounded-lg border border-white/25 bg-[#aaf0d5] px-4 py-2 text-sm font-black text-[#173d31] shadow-[6px_6px_0_rgba(0,0,0,.22)] sm:block"
              animate={motionDisabled ? undefined : { rotate: [-5, -1, -5], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            >
              designed + shipped
            </motion.div>

            {desktopCustardStageEnabled ? (
              <CstdCustardStage
                audioEnabled={audioPreference !== "disabled"}
                mascotCopy={mascotCopy}
                mascotMood={mascotMood}
                motionDisabled={motionDisabled}
                onMoodChange={handleMascotMoodChange}
                onPoke={pokeMascot}
              />
            ) : null}
          </motion.aside>

          <ProjectPreviewRail projects={heroPreviewProjects} motionDisabled={motionDisabled} />
        </section>

        <section id="projects" className="pb-16 pt-10 sm:pb-24 sm:pt-16">
          <div className="mb-7 grid gap-6 border-b-2 border-[#2f241d] pb-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.18em] text-[#d05f23]">Selected work · 2026</p>
              <h2 className={cstdProjectHeadingClassName}>已经做出来的东西</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5b4a] sm:text-base">
                五个真实上线产品，不是概念稿。先看生产界面，再按目标筛选、横向对比或进入完整案例。
              </p>
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex min-w-32 items-center justify-between gap-4 rounded-lg border-2 border-[#2f241d] bg-[#f6bf3f] px-4 py-3 text-[#181511] shadow-[5px_5px_0_#2f241d]">
                <span className="text-4xl font-black leading-none">{String(heroPreviewProjects.length).padStart(2, "0")}</span>
                <span className="text-right text-[0.65rem] font-black uppercase leading-4 tracking-[0.14em]">
                  Live
                  <br />
                  products
                </span>
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
          </div>

          {hasProjectDecisionContext ? projectDecisionContent : null}


          <div id="project-directory" className="mb-7 scroll-mt-24 overflow-hidden rounded-xl border-2 border-[#2f241d] bg-[#1e1b16] p-4 text-white shadow-[8px_8px_0_#d8cdb9] sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6bf3f]">Project console</p>
              <p className="text-xs font-bold text-[#c9c1b5]" aria-live="polite">
                {projectFilterSummary}
              </p>
            </div>
            <div className={cstdProjectToolbarClassName}>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#8be0be]">当前视图</p>
                <p className="mt-1 break-words text-base font-black text-white" aria-live="polite">
                  {projectControlSummary}
                </p>
                {projectControlBadges.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5" aria-label="当前项目目录条件">
                    {projectControlBadges.map((badge) => (
                      <span key={`${badge.label}-${badge.value}`} className="inline-flex max-w-full items-center gap-1 rounded-md border border-white/15 bg-white/8 px-2 py-1 text-[0.68rem] font-black text-[#d8d1c6]">
                        <span className="shrink-0 text-[#f6bf3f]">{badge.label}</span>
                        <span className="min-w-0 truncate text-white">{badge.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
                {projectDirectoryRestoredReceipt ? (
                  <RestoredEntryHandoff
                    receipt={projectDirectoryRestoredReceipt}
                    action={projectDirectoryRestoredAction}
                    tone="directory"
                    statusLabel="筛选视图恢复状态"
                    nextLabel="恢复筛选下一步"
                    actionIcon={ArrowDownRight}
                    onClick={handleRestoredDirectoryAction}
                  />
                ) : null}
              </div>
              <div className={cstdProjectToolbarActionsClassName}>
                <button
                  type="button"
                  onClick={copyProjectDirectoryView}
                  className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#f6bf3f] bg-[#f6bf3f] px-3 text-xs font-black text-[#181511] transition hover:-translate-y-0.5 hover:bg-[#ffd66d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6bf3f] sm:w-auto"
                >
                  <Copy className="h-3.5 w-3.5" />
                  复制当前视图
                </button>
                {hasProjectControlState ? (
                  <button
                    type="button"
                    onClick={resetProjectControls}
                    aria-label="重置项目搜索和筛选"
                    className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-transparent px-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6bf3f] sm:w-auto"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    重置
                  </button>
                ) : null}
              </div>
            </div>
            {projectDirectoryCopyResult ? (
              <p className="mt-2 text-xs font-bold text-[#8be0be]" aria-live="polite">
                {
                  {
                    copied: "当前项目视图链接已复制",
                    unsupported: "当前浏览器不支持自动复制，请手动复制",
                    failed: "当前项目视图链接复制失败，请手动复制",
                  }[projectDirectoryCopyResult]
                }
              </p>
            ) : null}
            {projectDirectoryCopyResult && projectDirectoryCopyResult !== "copied" ? (
              <textarea
                aria-label="当前项目视图链接"
                readOnly
                value={
                  typeof window === "undefined"
                    ? ""
                    : `${window.location.origin}${projectViewHref}`
                }
                className="mt-2 min-h-20 w-full resize-y rounded-lg border border-[#b8d7f5] bg-[#f2f8ff] p-3 text-xs font-semibold leading-5 text-[#315b7f] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
              />
            ) : null}
            <label className="mt-4 flex min-h-12 items-center gap-3 rounded-lg border border-white/20 bg-white/8 px-4 text-sm transition focus-within:border-[#8be0be] focus-within:bg-white/12 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#8be0be]">
              <Search className="h-4 w-4 shrink-0 text-[#8be0be]" />
              <span className="sr-only">搜索项目</span>
              <input
                value={projectSearchQuery}
                onChange={(event) => updateProjectDirectoryControls(activeProjectFilter, event.target.value)}
                placeholder="搜索项目、标签或问题，例如 CRM、南京、估值"
                className="min-w-0 flex-1 bg-transparent font-semibold text-white outline-none placeholder:text-[#aaa397]"
              />
              {projectSearchQuery ? (
                <button
                  type="button"
                  onClick={() => updateProjectDirectoryControls(activeProjectFilter, "")}
                  aria-label="清空项目搜索"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#c9c1b5] transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {cstdProjectFilters.map((filter) => {
                const selected = activeProjectFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => updateProjectDirectoryControls(filter.id, projectSearchQuery)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] ${
                      selected
                        ? "border-[#f6bf3f] bg-[#f6bf3f] text-[#181511] shadow-[3px_3px_0_rgba(246,191,63,.22)]"
                        : "border-white/20 bg-white/5 text-[#e9e3da] hover:-translate-y-0.5 hover:border-[#8be0be] hover:bg-white/10"
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
                comparisonHandoff={selectedProjectComparisonHandoff}
                restoredAction={selectedProjectRestoredAction}
                restoredReceipt={selectedProjectRestoredReceipt}
                onClose={closeProjectFocus}
                onCopyBrief={copyProjectBrief}
                onCopy={copyProjectFocusLink}
                onNavigate={focusProject}
              />
            ) : null}
          </AnimatePresence>

          <div id="project-grid" className={`${cstdProjectGridClassName} scroll-mt-24`}>
            {visibleProjects.length > 0 ? (
              visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  comparedProjectIds={comparedProjectIds}
                  index={index}
                  motionDisabled={motionDisabled}
                  onFocus={focusProject}
                  onToggleComparison={toggleProjectComparison}
                />
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

          <div className="mt-5">
            {hasProjectDecisionContext ? null : projectDecisionContent}
            <ProjectSupportingEvidence
              portfolioCopyResult={portfolioCopyResult}
              projectLinkDirectoryCopyResult={projectLinkDirectoryCopyResult}
              onCopyPortfolio={copyPortfolioBrief}
              onCopyProjectLinks={copyProjectLinkDirectory}
              onFocusProject={focusProject}
            />
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      if (dialog.open) dialog.close();
      if (previouslyFocusedElement && previouslyFocusedElement !== document.body && previouslyFocusedElement.isConnected) {
        previouslyFocusedElement.focus();
      }
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      (introPlaying ? skipButtonRef : startButtonRef).current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [introPlaying]);

  return (
    <motion.dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cstd-intro-title"
      onCancel={(event) => {
        event.preventDefault();
        onSkip();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;

        const firstControl = skipButtonRef.current;
        const lastControl = introPlaying ? firstControl : startButtonRef.current;
        if (!firstControl || !lastControl) return;

        const focusLeavesStart = event.shiftKey && document.activeElement === firstControl;
        const focusLeavesEnd = !event.shiftKey && document.activeElement === lastControl;
        if (!focusLeavesStart && !focusLeavesEnd) return;

        event.preventDefault();
        (event.shiftKey ? lastControl : firstControl).focus();
      }}
      className="fixed inset-0 z-50 m-0 grid h-full max-h-none w-full max-w-none place-items-center overflow-hidden border-0 bg-[#181511] p-0 text-white backdrop:bg-transparent"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.018, filter: "blur(12px)" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <h2 id="cstd-intro-title" className="sr-only">CSTD 开场动画</h2>
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[38%] bg-[#202820]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2 bg-[#f6bf3f]" />
      {introPlaying ? <CinematicSteam active /> : null}
      {introPlaying ? <IntroSoundWaves /> : null}
      {introPlaying ? <CinematicSugarBurst delay={2.28} /> : null}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={onSkip}
        className="absolute right-4 top-4 z-30 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur transition hover:border-[#f6bf3f] hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6bf3f] sm:right-5 sm:top-5"
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
            <motion.img
              src="/cstd-mascot.svg"
              alt=""
              className="relative w-64 drop-shadow-[14px_16px_0_rgba(0,0,0,.28)] sm:w-80"
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            <p className="relative mt-4 text-sm font-black uppercase tracking-[0.2em] text-[#aaf0d5]">independent product studio</p>
            <h2 aria-hidden="true" className="mt-2 text-5xl font-black tracking-[0.03em] text-[#f6bf3f] sm:text-7xl">CSTD</h2>
            <p className="mt-2 text-sm font-bold text-[#d8d3c8]">五个产品在线，等你打开。</p>
            <button
              ref={startButtonRef}
              type="button"
              onClick={onStart}
              className="group relative mt-6 inline-flex min-h-12 items-center justify-center overflow-hidden rounded-lg border-2 border-[#f6bf3f] bg-[#f6bf3f] px-7 text-base font-black text-[#181511] shadow-[7px_7px_0_rgba(246,191,63,.18)] transition hover:-translate-y-0.5 hover:bg-[#ffd469] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6bf3f]"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/24 transition group-hover:left-full" />
              开启 CSTD
            </button>
          </motion.div>
        )}
      </div>
    </motion.dialog>
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

function useDesktopCustardStage() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateEnabled = () => setEnabled(mediaQuery.matches);

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => mediaQuery.removeEventListener("change", updateEnabled);
  }, []);

  return enabled;
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
  const targetProps = getCstdLinkTargetProps(href);

  return (
    <Link
      href={href}
      {...targetProps}
      onClick={() => {
        const samePageTargetId = href.startsWith("#") && window.location.hash === href ? href.slice(1) : null;
        onNavigate?.();
        if (!samePageTargetId) return;

        window.requestAnimationFrame(() => {
          document.getElementById(samePageTargetId)?.scrollIntoView({ block: "start" });
        });
      }}
      className={`${cstdNavLinkClassName} ${mobile ? "w-full justify-start px-4" : "justify-center"}`}
    >
      {children}
    </Link>
  );
}

function HeroButton({
  href,
  children,
  hero = false,
  primary = false,
  wideFrom320 = false,
  wideOnMobile = false,
}: {
  href: string;
  children: ReactNode;
  hero?: boolean;
  primary?: boolean;
  wideFrom320?: boolean;
  wideOnMobile?: boolean;
}) {
  const targetProps = getCstdLinkTargetProps(href);
  const toneClassName = hero
    ? primary
      ? "border-[#f6bf3f] bg-[#f6bf3f] text-[#181511] shadow-[5px_5px_0_rgba(246,191,63,.2)] hover:bg-[#ffd469] focus-visible:outline-[#f6bf3f]"
      : "border-white/35 bg-white/10 text-white shadow-none hover:border-white/70 hover:bg-white/16 focus-visible:outline-white"
    : primary
      ? "border-[#1b4332] bg-[#0f8f64] text-white hover:bg-[#0d7d59] focus-visible:outline-[#0f8f64]"
      : "border-[#b8d7f5] bg-[#e3f2ff] text-[#2563eb] hover:border-[#2563eb] focus-visible:outline-[#2563eb]";

  return (
    <Link
      href={href}
      {...targetProps}
      className={`inline-flex min-h-12 min-w-0 w-full items-center justify-center gap-2 rounded-lg border px-3 text-center text-sm font-black no-underline shadow-[4px_4px_0_rgba(47,36,29,.08)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:px-5 ${toneClassName} ${wideOnMobile ? "col-span-2" : ""} ${wideFrom320 ? "min-[320px]:col-span-2" : ""}`}
    >
      {children}
    </Link>
  );
}

function ProjectPreviewRail({
  projects,
  motionDisabled,
}: {
  projects: readonly (typeof cstdProjects)[number][];
  motionDisabled: boolean;
}) {
  return (
    <motion.div
      className="relative z-10 mt-3 min-w-0 lg:col-span-2 lg:mt-0"
      initial={motionDisabled ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.58, duration: 0.55 }}
    >
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-[0.64rem] font-black uppercase tracking-[0.18em] text-[#aaa397] sm:text-xs">
          Live product windows
        </p>
        <span className="hidden text-xs font-bold text-[#aaa397] sm:block">真实生产界面 · 点击打开</span>
      </div>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
        aria-label="已上线项目预览"
      >
        {projects.map((project) => {
          if (!project.preview) return null;
          const targetProps = getCstdLinkTargetProps(project.href);

          return (
            <motion.div
              key={project.id}
              className="min-w-[82%] snap-start sm:min-w-[44%] lg:min-w-0"
              whileHover={motionDisabled ? undefined : { y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={project.href}
                {...targetProps}
                aria-label={`打开 ${project.title} 生产站点`}
                className="group block overflow-hidden rounded-lg border border-white/25 bg-[#f4f3ed] text-[#181511] no-underline shadow-[6px_6px_0_rgba(0,0,0,.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f6bf3f]"
              >
                <span className="relative block h-36 overflow-hidden border-b border-[#2f241d]/20 bg-white sm:h-40 lg:h-28">
                  <Image
                    src={project.preview.src}
                    alt={project.preview.alt}
                    fill
                    priority={project.id === "rocodex"}
                    sizes="(max-width: 639px) 82vw, (max-width: 1023px) 44vw, 244px"
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                    style={{ objectPosition: project.preview.position }}
                  />
                </span>
                <span className="flex min-h-11 items-center gap-2 px-3 py-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#0f8f64]" />
                  <span className="min-w-0 flex-1 truncate text-xs font-black">{project.title}</span>
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#6f5b4a]" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
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
    <div className="grid w-full grid-cols-2 gap-2 rounded-lg border-2 border-[#2f241d] bg-[#25211b] p-2 shadow-[5px_5px_0_#d8cdb9] sm:w-auto sm:grid-cols-[auto_auto_auto]">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={introEnabled}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#f6bf3f] px-2 text-xs font-black text-[#181511] transition hover:bg-[#ffd66d] sm:px-3"
      >
        {introEnabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {getCstdIntroControlLabel(motionPreference)}
      </button>
      <button
        type="button"
        onClick={onAudioToggle}
        aria-pressed={audioEnabled}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#cce7ff] px-2 text-xs font-black text-[#174d7a] transition hover:bg-[#e3f2ff] sm:px-3"
      >
        {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        声音：{audioLabel}
      </button>
      <button
        type="button"
        onClick={onReplay}
        disabled={!introEnabled}
        className="col-span-2 inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#8be0be] px-2 text-xs font-black text-[#153f31] transition hover:bg-[#a8ecd1] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1 sm:px-3"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        播放开场
      </button>
      <span className="col-span-2 inline-flex min-h-7 items-center justify-center rounded-md border border-white/10 bg-white/5 px-2 text-[0.68rem] font-black text-[#c9c1b5] sm:col-span-3">
        {audioEnabled ? (bgmActive ? "奶油音乐轻轻播放中" : "奶油音乐待播放") : "声音已关闭"}
      </span>
    </div>
  );
}

function ProjectSupportingEvidence({
  portfolioCopyResult,
  projectLinkDirectoryCopyResult,
  onCopyPortfolio,
  onCopyProjectLinks,
  onFocusProject,
}: {
  portfolioCopyResult: CstdProjectCopyResult | null;
  projectLinkDirectoryCopyResult: CstdProjectCopyResult | null;
  onCopyPortfolio: () => void;
  onCopyProjectLinks: () => void;
  onFocusProject: (projectId: string) => void;
}) {
  return (
    <>
      <ProjectCapabilityIndex onFocus={onFocusProject} />

      <div
        id="project-evidence"
        className="relative left-1/2 mt-10 w-dvw -translate-x-1/2 scroll-mt-24 border-y-2 border-[#2f241d] bg-[#181511] px-[max(24px,calc((100dvw-1280px)/2))] py-10 text-white sm:py-14"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6bf3f]">Evidence overview</p>
            <p className="mt-2 max-w-2xl text-xl font-black leading-8 text-white sm:text-3xl">{projectEvidenceOverview.summary}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[30rem]">
            {projectEvidenceOverview.stats.map((stat, index) => (
              <div key={stat.label} className="border-l-2 border-[#f6bf3f] bg-white/5 px-4 py-3">
                <strong className={`block text-3xl font-black ${index === 1 ? "text-[#8be0be]" : index === 2 ? "text-[#9bc8ff]" : "text-[#f6bf3f]"}`}>
                  {stat.value}
                </strong>
                <span className="mt-1 block text-xs font-black text-[#c9c1b5]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={cstdProjectEvidenceShareGridClassName} aria-label="项目分享中心">
          <div className="flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-white/15 bg-white/5 p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f6bf3f]">Portfolio brief</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#d8d1c6]">把已上线项目、当前状态、交付证据和链接复制成一段组合摘要。</p>
            </div>
            <button
              type="button"
              onClick={onCopyPortfolio}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-[#0f8f64] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
            >
              {portfolioCopyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              复制项目组合摘要
            </button>
            {portfolioCopyResult ? (
              <p role="status" className="text-xs font-semibold leading-5 text-[#d8d1c6]">
                {{
                  copied: "项目组合摘要已复制",
                  unsupported: "浏览器不支持自动复制，请手动复制摘要",
                  failed: "组合摘要复制失败，请手动复制",
                }[portfolioCopyResult]}
              </p>
            ) : null}
          </div>
          <div className="flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-[#7eb7f2]/45 bg-[#17314a] p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9bc8ff]">Deep links</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#d5eaff]">需要发给别人看时，可以直接复制每个项目的案例深链。</p>
            </div>
            <button
              type="button"
              onClick={onCopyProjectLinks}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#2563eb] bg-white px-4 text-sm font-black text-[#2563eb] transition hover:-translate-y-0.5 hover:bg-[#f2f8ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
            >
              {projectLinkDirectoryCopyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              复制项目深链目录
            </button>
            {projectLinkDirectoryCopyResult ? (
              <p role="status" className="text-xs font-semibold leading-5 text-[#d5eaff]">
                {{
                  copied: "项目深链目录已复制",
                  unsupported: "浏览器不支持自动复制，请手动复制项目深链目录",
                  failed: "项目深链目录复制失败，请手动复制",
                }[projectLinkDirectoryCopyResult]}
              </p>
            ) : null}
          </div>
        </div>
        {portfolioCopyResult && portfolioCopyResult !== "copied" ? (
          <textarea
            aria-label="项目组合摘要文本"
            readOnly
            value={buildCstdProjectPortfolioBrief(cstdProjects)}
            className="mt-3 min-h-44 w-full resize-y rounded-lg border border-[#ead6ad] bg-[#fffaf0] p-3 text-xs font-semibold leading-5 text-[#4f3d31] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
          />
        ) : null}
        {projectLinkDirectoryCopyResult && projectLinkDirectoryCopyResult !== "copied" ? (
          <textarea
            aria-label="项目深链目录文本"
            readOnly
            value={typeof window === "undefined" ? "" : buildCstdProjectLinkDirectory(cstdProjects, window.location.origin, window.location.pathname)}
            className="mt-3 min-h-36 w-full resize-y rounded-lg border border-[#b8d7f5] bg-[#f2f8ff] p-3 text-xs font-semibold leading-5 text-[#315b7f] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
          />
        ) : null}
        <div className="mt-5 border-t border-white/15 pt-5" aria-label={projectProofTimeline.summary}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8be0be]">Proof timeline</p>
            <p className="text-xs font-bold text-[#c8d7cd]">{projectProofTimeline.summary}</p>
          </div>
          <ol className={cstdProjectProofTimelineGridClassName}>
            {projectProofTimeline.items.map((item, index) => (
              <li key={item.projectId} className="min-w-0 border-l border-white/15 px-3 py-2 first:border-[#8be0be]">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-[#8be0be] px-2 text-xs font-black text-[#153f31]">{index + 1}</span>
                <p className="mt-3 text-sm font-black leading-5 text-white">{item.title}</p>
                <p className="mt-1 text-xs font-black leading-5 text-[#8be0be]">{item.signal}</p>
                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-[#c8d7cd]">{item.proof}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

function ProjectWorkflowSummary({
  action,
  items,
}: {
  action: CstdProjectWorkflowAction;
  items: readonly CstdProjectWorkflowSummaryItem[];
}) {
  return (
    <nav className="mb-5" aria-label="项目决策导览">
      <div className={cstdProjectWorkflowSummaryGridClassName}>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-label={`${item.label}：${item.value}，${item.detail}`}
            className="group flex min-h-32 min-w-0 flex-col rounded-lg border border-[#ead6ad] bg-white/72 p-3 text-[#2f241d] no-underline shadow-[5px_5px_0_rgba(47,36,29,.05)] transition hover:-translate-y-0.5 hover:border-[#d98528] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] motion-reduce:transform-none"
          >
            <span className="flex items-center justify-between gap-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#d98528]">
              {item.label}
              <ArrowDownRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
            </span>
            <span className="mt-2 min-w-0 break-words text-lg font-black leading-6">{item.value}</span>
            <span className="mt-auto pt-1 text-xs font-semibold leading-5 text-[#6f5b4a]">{item.detail}</span>
          </a>
        ))}
      </div>
      <div className="mt-3 flex min-w-0 flex-col gap-3 rounded-lg border-2 border-[#2f241d] bg-[#2f241d] p-3 text-white shadow-[6px_6px_0_rgba(47,36,29,.1)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd98a]">下一步</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#fff6df]">{action.detail}</p>
        </div>
        <a
          href={action.href}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#ffd98a] bg-[#fff6df] px-4 text-sm font-black text-[#2f241d] no-underline transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none sm:w-auto"
        >
          {action.label}
          <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </nav>
  );
}

function ProjectGuide({
  comparedProjectIds,
  guideSummary,
  motionDisabled,
  projectGuideCopyResult,
  projectGuideRestoredFromUrl,
  projectGuideShareUrl,
  selectedGuideId,
  onBrowseCategory,
  onCopyGuide,
  onFocus,
  onSelect,
  onToggleComparison,
}: {
  comparedProjectIds: readonly string[];
  guideSummary: ReturnType<typeof getCstdProjectGuideSummary>;
  motionDisabled: boolean;
  projectGuideCopyResult: CstdProjectCopyResult | null;
  projectGuideRestoredFromUrl: boolean;
  projectGuideShareUrl: string;
  selectedGuideId: CstdProjectGuideId | null;
  onBrowseCategory: (filter: CstdProjectFilter) => void;
  onCopyGuide: () => void;
  onFocus: (projectId: string) => void;
  onSelect: (guideId: CstdProjectGuideId | null) => void;
  onToggleComparison: (projectId: string) => void;
}) {
  const selectedGuide = getCstdProjectGuide(selectedGuideId);
  const selectedProject = selectedGuide ? cstdProjects.find((project) => project.id === selectedGuide.projectId) ?? null : null;
  const directoryContinuation = getCstdProjectGuideDirectoryContinuation(selectedGuide, cstdProjects);
  const comparisonControl = selectedProject ? getCstdProjectComparisonControl(comparedProjectIds, selectedProject.id) : null;
  const guideCopyPresentation = selectedGuide ? getCstdProjectGuideCopyPresentation(projectGuideCopyResult, selectedGuide.goal) : null;
  const guideCopyToneClassName = guideCopyPresentation?.tone === "warning" ? "text-[#8a4b15]" : "text-[#047857]";
  const guideRestoredReceipt = getCstdProjectGuideRestoredReceipt(
    projectGuideRestoredFromUrl ? selectedGuide : null,
    selectedProject?.title ?? null,
  );

  return (
    <div
      id="project-guide"
      className="mb-7 scroll-mt-24 overflow-hidden rounded-xl border-2 border-[#2f241d] bg-[#18352a] p-4 shadow-[8px_8px_0_#c8d7cd] sm:p-5"
      aria-label={guideSummary.summary}
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8be0be]">Goal guide</p>
          <h3
            id="project-guide-heading"
            tabIndex={-1}
            className="mt-1 rounded-sm text-xl font-black text-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-[#f6bf3f] sm:text-2xl"
          >
            按目标找项目
          </h3>
        </div>
        <p className="text-xs font-semibold text-[#c8d7cd]">{guideSummary.summary}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {cstdProjectGuides.map((guide, guideIndex) => {
          const project = cstdProjects.find((item) => item.id === guide.projectId);
          if (!project) return null;
          const selected = selectedGuideId === guide.id;

          return (
            <button
              key={guide.id}
              type="button"
              onClick={() => onSelect(guide.id)}
              aria-pressed={selected}
              className={`group min-w-0 rounded-lg border p-4 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6bf3f] ${
                selected
                  ? "border-[#f6bf3f] bg-[#f6bf3f] shadow-[5px_5px_0_rgba(0,0,0,.22)]"
                  : "border-white/15 bg-white/5 hover:border-[#8be0be] hover:bg-white/10"
              }`}
              aria-label={`${guide.goal}，匹配${project.title}`}
            >
              <span className={`block text-[0.65rem] font-black uppercase tracking-[0.16em] ${selected ? "text-[#73561c]" : "text-[#8be0be]"}`}>
                Route 0{guideIndex + 1}
              </span>
              <span className={`mt-2 block min-w-0 text-sm font-black ${selected ? "text-[#181511]" : "text-white"}`}>{guide.goal}</span>
              <span className={`mt-2 block min-w-0 text-xs font-semibold leading-5 ${selected ? "text-[#5b461b]" : "text-[#c8d7cd]"}`}>
                {guide.reason}
              </span>
              <span className={`mt-3 inline-flex min-h-7 items-center rounded-md px-2 text-xs font-black ${selected ? "bg-[#181511] text-[#f6bf3f]" : "bg-[#8be0be] text-[#153f31]"}`}>
                {project.title}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence initial={false}>
        {selectedGuide && selectedProject ? (
          <motion.section
            key={selectedGuide.id}
            aria-labelledby="project-match-heading"
            aria-live="polite"
            className="mt-3 overflow-hidden rounded-xl border-2 border-[#0f8f64] bg-[#eefbf4] shadow-[7px_7px_0_rgba(47,36,29,.07)]"
            initial={motionDisabled ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={motionDisabled ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className={cstdProjectGuideMatchLayoutClassName}>
              <div className="relative min-w-0 pr-24">
                <div className={cstdProjectGuideHeaderActionsClassName}>
                  <button
                    type="button"
                    onClick={onCopyGuide}
                    aria-label="复制目标路径"
                    title="复制目标路径"
                    className={cstdProjectGuideClearActionClassName}
                  >
                    {projectGuideCopyResult === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(null)}
                    aria-label="清除目标匹配"
                    title="清除目标匹配"
                    className={cstdProjectGuideClearActionClassName}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#047857]">推荐匹配</p>
                <h4 id="project-match-heading" className="mt-1 text-xl font-black text-[#2f241d] sm:text-2xl">
                  {selectedProject.title}
                </h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#416354]">{selectedGuide.reason}</p>
                {guideRestoredReceipt ? (
                  <div aria-label="分享目标恢复状态" aria-live="polite" className="mt-3 rounded-lg border border-[#9bd9bf]/70 bg-white/62 px-3 py-2">
                    <p className="text-xs font-black text-[#047857]">{guideRestoredReceipt.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#355b4a]">{guideRestoredReceipt.detail}</p>
                  </div>
                ) : null}
                {guideCopyPresentation ? (
                  <p role="status" className={`mt-2 text-xs font-black leading-5 ${guideCopyToneClassName}`}>
                    {guideCopyPresentation.message}
                  </p>
                ) : null}
                {guideCopyPresentation?.requiresManualCopy && projectGuideShareUrl ? (
                  <input
                    aria-label="目标路径链接"
                    className="mt-2 h-11 w-full rounded-lg border border-[#b7decf] bg-white/82 px-3 text-xs font-semibold text-[#315b7f] outline-none focus:border-[#0f8f64] focus:ring-2 focus:ring-[#0f8f64]/20"
                    readOnly
                    value={projectGuideShareUrl}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                ) : null}
                <dl className="mt-3 grid gap-2 border-t border-[#b7decf] pt-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <dt className="text-xs font-black text-[#047857]">当前状态</dt>
                    <dd className="mt-1 text-sm font-semibold leading-6 text-[#2f241d]">{selectedProject.evidence.current}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-black text-[#047857]">已交付</dt>
                    <dd className="mt-1 text-sm font-semibold leading-6 text-[#2f241d]">{selectedProject.evidence.outcome}</dd>
                  </div>
                </dl>
              </div>
              <div className={cstdProjectGuideActionRailClassName}>
                <button
                  type="button"
                  onClick={() => onFocus(selectedProject.id)}
                  className={`${cstdProjectGuidePrimaryActionClassName} border-[#1b4332] bg-[#0f8f64] text-white hover:bg-[#0d7d59] focus-visible:outline-[#0f8f64]`}
                >
                  查看案例 <ArrowDownRight className="h-4 w-4" />
                </button>
                {comparisonControl ? (
                  <button
                    type="button"
                    onClick={() => onToggleComparison(selectedProject.id)}
                    aria-label={`${comparisonControl.label}：${selectedProject.title}`}
                    aria-pressed={comparisonControl.selected}
                    disabled={comparisonControl.disabled}
                    className={`${cstdProjectGuideSecondaryActionClassName} focus-visible:outline-[#0f8f64] disabled:cursor-not-allowed disabled:opacity-55 ${
                      comparisonControl.selected
                        ? "border-[#1b4332] bg-[#dff8ed] text-[#047857]"
                        : "border-[#1b4332] bg-white text-[#0f8f64] hover:-translate-y-0.5 hover:bg-[#eefbf4]"
                    }`}
                  >
                    {comparisonControl.selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
                    {comparisonControl.label}
                  </button>
                ) : null}
                <Link
                  href={selectedProject.href}
                  className={`${cstdProjectGuideSecondaryActionClassName} border-[#b8d7f5] bg-white text-[#2563eb] no-underline hover:border-[#2563eb] focus-visible:outline-[#2563eb]`}
                >
                  打开项目 <ExternalLink className="h-4 w-4" />
                </Link>
                {directoryContinuation ? (
                  <button
                    type="button"
                    onClick={() => onBrowseCategory(directoryContinuation.category)}
                    aria-label={directoryContinuation.summary}
                    className={`${cstdProjectGuideWideActionClassName} border-[#b8d7f5] bg-[#f2f8ff] text-[#315b7f] hover:border-[#2563eb] focus-visible:outline-[#2563eb]`}
                  >
                    <Search className="h-4 w-4" />
                    浏览{directoryContinuation.categoryLabel} · {directoryContinuation.projectCount}
                  </button>
                ) : null}
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ProjectCapabilityIndex({ onFocus }: { onFocus: (projectId: string) => void }) {
  return (
    <div className="mb-5 rounded-xl border-2 border-[#2f241d] bg-[#dcecff] p-4 shadow-[7px_7px_0_#b8cee8] sm:p-5" aria-label={projectCapabilityIndex.summary}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98528]">Capability index</p>
          <h3 className="mt-1 text-xl font-black text-[#2f241d] sm:text-2xl">按能力看项目</h3>
        </div>
        <p className="text-xs font-bold text-[#7b6656]">{projectCapabilityIndex.summary}</p>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {projectCapabilityIndex.lanes.map((lane) => (
          <div key={lane.id} className="min-w-0 border-l-2 border-[#2563eb] px-3 py-1">
            <p className="text-sm font-black text-[#2f241d]">{lane.label}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#6f5b4a]">{lane.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lane.projects.map((project) => (
                <button
                  key={`${lane.id}-${project.id}`}
                  type="button"
                  onClick={() => onFocus(project.id)}
                  className="inline-flex min-h-8 items-center rounded-md border border-[#b7decf] bg-white px-2.5 text-xs font-black text-[#047857] transition hover:-translate-y-0.5 hover:border-[#0f8f64] hover:bg-[#eefbf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
                >
                  {project.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectComparison({
  comparison,
  copyResult,
  fit,
  guideGoal,
  nextStep,
  restoredFromUrl,
  scanSummary,
  onAlign,
  onClear,
  onCopyBrief,
  onFocus,
  onRemove,
  onSelectGoal,
}: {
  comparison: CstdProjectComparisonData;
  copyResult: CstdProjectCopyResult | null;
  fit: CstdProjectComparisonFit;
  guideGoal: string | null;
  nextStep: CstdProjectComparisonNextStep;
  restoredFromUrl: boolean;
  scanSummary: CstdProjectComparisonScanItem[];
  onAlign: (projectId: string) => void;
  onClear: () => void;
  onCopyBrief: () => void;
  onFocus: (projectId: string) => void;
  onRemove: (projectId: string) => void;
  onSelectGoal: () => void;
}) {
  const context = getCstdProjectComparisonContext({
    guideGoal,
    projectTitles: comparison.projects.map((project) => project.title),
    restoredFromUrl,
  });
  const restoredContinuation = context.receipt ? getCstdProjectComparisonRestoredContinuation({
    restoredFromUrl,
    nextStep,
  }) : null;
  const copyMessage = {
    copied: "对比摘要已复制",
    failed: "复制失败，请稍后重试",
    unsupported: "当前浏览器不支持复制",
  }[copyResult ?? "copied"];
  const fitItemsByProjectId = useMemo(() => new Map(fit.items.map((item) => [item.projectId, item])), [fit.items]);

  function handleNextStep() {
    if (nextStep.kind === "focus") {
      onFocus(nextStep.project.id);
      return;
    }
    if (nextStep.kind === "align") {
      onAlign(nextStep.project.id);
      return;
    }
    onSelectGoal();
  }

  return (
    <section id="project-comparison" className={`${cstdProjectComparisonClassName} scroll-mt-24`} aria-labelledby="project-comparison-heading">
      <div className="flex flex-col gap-3 border-b border-[#b7decf] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#047857]">Decision view</p>
          <h3
            id="project-comparison-heading"
            tabIndex={-1}
            className="mt-1 rounded-sm text-lg font-black text-[#1b4332] focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-[#0f8f64]"
          >
            项目对比
          </h3>
          <p className="mt-1 text-xs font-bold text-[#4c6b5d]" aria-live="polite">
            {comparison.summary}
          </p>
          <p className="mt-2 max-w-3xl break-words text-xs font-semibold leading-5 text-[#4c6b5d]">
            <span className="font-black text-[#047857]">{context.goalLabel}</span>
            <span aria-hidden="true"> · </span>
            <span>{context.projectLabel}</span>
          </p>
          {context.receipt ? (
            <div
              aria-label="分享视图恢复状态"
              aria-live="polite"
              className="mt-2 max-w-3xl rounded-lg border border-[#9bd9bf] bg-[#dff8ed]/70 px-3 py-2 text-xs font-bold leading-5 text-[#047857]"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span className="font-black">{context.receipt.label}</span>
                <span className="min-w-0 break-words text-[#355b4a]">{context.receipt.detail}</span>
              </div>
              {restoredContinuation ? (
                <div className="mt-2 grid min-w-0 gap-2 rounded-md border border-[#9bd9bf]/70 bg-white/58 p-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" aria-label="分享对比恢复下一步">
                  <p className="min-w-0">
                    <span className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#047857]">建议下一步</span>
                    <span className="mt-0.5 block min-w-0 break-words text-xs font-bold leading-5 text-[#355b4a]">{restoredContinuation.detail}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-[#0f8f64] px-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] sm:w-auto"
                  >
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    {restoredContinuation.label}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <ul className="mt-3 grid min-w-0 grid-cols-1 gap-2 min-[520px]:grid-cols-3" aria-label="对比扫读摘要">
            {scanSummary.map((item) => (
              <li key={item.id} className={`min-w-0 border px-3 py-2 ${cstdProjectComparisonScanToneClassNames[item.tone]}`}>
                <span className="block text-[0.68rem] font-black uppercase tracking-[0.12em]">{item.label}</span>
                <span className="mt-1 block min-w-0 break-words text-sm font-black leading-5">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onCopyBrief}
              className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#0f8f64] bg-[#047857] px-3 text-xs font-black text-white transition hover:bg-[#036747] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] sm:w-auto"
            >
              {copyResult === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              复制摘要
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-white px-3 text-xs font-black text-[#0f8f64] transition hover:bg-[#f7fffb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] sm:w-auto"
            >
              <X className="h-3.5 w-3.5" />
              清空对比
            </button>
          </div>
          {copyResult ? (
            <p className="text-xs font-bold text-[#4c6b5d]" aria-live="polite">
              {copyMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <div className="mt-4 border-y border-[#9bd9bf] bg-[#eefbf4]/78 px-3 py-3 min-[390px]:py-4 sm:px-4" role="group" aria-label="对比下一步">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#047857]">{nextStep.eyebrow}</p>
              <p className="mt-1 break-words text-base font-black text-[#1b4332]">{nextStep.title}</p>
              <p className="mt-1 max-w-3xl break-words text-sm font-semibold leading-6 text-[#355b4a]">{nextStep.detail}</p>
            </div>
            <div className="grid w-full shrink-0 grid-cols-1 gap-2 min-[320px]:grid-cols-2 lg:w-auto">
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1b4332] bg-[#0f8f64] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] lg:w-auto"
              >
                <ArrowDownRight className="h-4 w-4" />
                {nextStep.primaryLabel}
              </button>
              {nextStep.kind === "focus" ? (
                <Link
                  href={nextStep.project.href}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#2563eb] bg-white px-4 text-sm font-black text-[#2563eb] no-underline transition hover:-translate-y-0.5 hover:bg-[#e3f2ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] lg:w-auto"
                >
                  <ExternalLink className="h-4 w-4" />
                  {nextStep.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <ul className={cstdProjectComparisonColumnsClassName} aria-label="已选对比项目">
          {comparison.projects.map((project) => {
            const fitItem = fitItemsByProjectId.get(project.id);

            return (
              <li key={project.id} className="flex min-w-0 items-center justify-between gap-3 border-b border-[#b7decf] bg-white/68 px-3 py-2.5">
                <span className="min-w-0">
                  {fitItem ? (
                    <span className={`mb-1 inline-flex rounded-md px-2 py-1 text-[0.68rem] font-black ${cstdProjectComparisonFitLabelClassNames[fitItem.kind]}`}>
                      {fitItem.label}
                    </span>
                  ) : null}
                  <span className="block min-w-0 break-words text-sm font-black text-[#1b4332]">{project.title}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(project.id)}
                  aria-label={`移出对比：${project.title}`}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#4c6b5d] transition hover:bg-[#dff8ed] hover:text-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-y border-[#b7decf] bg-[#fffaf0]/70" role="group" aria-label="目标匹配判断">
          <div className="border-b border-[#b7decf] px-3 py-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d98528]">Goal fit</p>
            <p className="mt-1 text-sm font-black text-[#1b4332]">目标判断</p>
            <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#4c6b5d]">{fit.summary}</p>
          </div>
          <ul className={`${cstdProjectComparisonColumnsClassName} gap-0`} aria-label="目标匹配项目">
            {fit.items.map((item) => (
              <li key={item.projectId} className="min-w-0 border-b border-[#b7decf] px-3 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-1 text-[0.68rem] font-black ${cstdProjectComparisonFitLabelClassNames[item.kind]}`}>{item.label}</span>
                  <span className="min-w-0 break-words text-sm font-black text-[#1b4332]">{item.title}</span>
                </div>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-[#355b4a]">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        {comparison.ready ? (
          <dl className="mt-4 border-t border-[#b7decf]">
            {comparison.rows.map((row) => (
              <div key={row.label} className="grid min-w-0 gap-2 border-b border-[#b7decf] py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-3">
                <dt className="text-xs font-black text-[#047857]">{row.label}</dt>
                <dd className={cstdProjectComparisonColumnsClassName}>
                  {row.values.map((value, index) => {
                    const project = comparison.projects[index];
                    return (
                      <div key={project.id} className="min-w-0 break-words text-sm font-semibold leading-6 text-[#355b4a]">
                        <span className="mb-1 block text-[0.68rem] font-black text-[#047857] sm:sr-only">{project.title}</span>
                        {value}
                      </div>
                    );
                  })}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm font-bold text-[#4c6b5d]" role="status">
            再选择 1 个已上线项目即可对比
          </p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  comparedProjectIds,
  index,
  motionDisabled,
  onFocus,
  onToggleComparison,
}: {
  project: (typeof cstdProjects)[number];
  comparedProjectIds: readonly string[];
  index: number;
  motionDisabled: boolean;
  onFocus: (projectId: string) => void;
  onToggleComparison: (projectId: string) => void;
}) {
  const Icon = projectIcons[project.icon];
  const isLive = project.status === "Live";
  const evidencePreview = getCstdProjectCardPreview(project);
  const comparisonControl = getCstdProjectComparisonControl(comparedProjectIds, project.id);
  const layout = getCstdProjectLayout({
    index,
    hasPreview: Boolean(project.preview),
    status: project.status,
  });
  const isFeature = layout === "feature";
  const isIncubator = layout === "incubator";
  const articleLayoutClassName = {
    feature: "md:col-span-2 xl:col-span-8 only:xl:col-span-12",
    standard: "xl:col-span-4",
    incubator: "md:col-span-2 xl:col-span-12",
  }[layout];
  const mediaLayoutClassName = isFeature
    ? "h-40 sm:h-56 xl:h-64"
    : "h-40 sm:h-52 xl:h-48";
  const contentLayoutClassName = isIncubator
    ? "relative p-4 pt-5 sm:p-6 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(420px,.78fr)] xl:items-start xl:gap-x-12 xl:p-8"
    : `relative p-4 pt-5 sm:p-6 ${isFeature ? "xl:p-8" : "xl:p-6"}`;
  const toneClasses = {
    mint: "bg-[#dff8ed] text-[#047857]",
    rose: "bg-[#ffe7ec] text-[#be4563]",
    teal: "bg-[#d9f6f2] text-[#0f766e]",
    violet: "bg-[#ede9fe] text-[#6d28d9]",
    amber: "bg-[#fff0c9] text-[#b45309]",
    sky: "bg-[#e3f2ff] text-[#2563eb]",
  }[project.tone];
  const toneBandClasses = {
    mint: "bg-[#20b486]",
    rose: "bg-[#f46d8b]",
    teal: "bg-[#25b6a4]",
    violet: "bg-[#8b6de9]",
    amber: "bg-[#e49a2f]",
    sky: "bg-[#5c9df5]",
  }[project.tone];

  return (
    <motion.article
      data-project-layout={layout}
      className={`group relative min-w-0 overflow-hidden rounded-lg border-2 border-[#2f241d] bg-white shadow-[7px_7px_0_rgba(47,36,29,.1)] transition-shadow sm:shadow-[9px_9px_0_rgba(47,36,29,.12)] xl:h-full ${articleLayoutClassName} ${
        isIncubator ? "xl:bg-[#edf5ff]" : ""
      }`}
      initial={motionDisabled ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.08, duration: 0.58, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={motionDisabled ? undefined : { y: -6 }}
    >
      <div className={`absolute inset-x-0 top-0 z-20 h-2 ${toneBandClasses}`} />
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/40"
        initial={{ x: "-120%" }}
        whileHover={motionDisabled ? undefined : { x: "520%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {project.preview ? (
        <div className={`relative hidden overflow-hidden border-b-2 border-[#2f241d] bg-[#f4f3ed] sm:block ${mediaLayoutClassName}`}>
          <Image
            src={project.preview.src}
            alt={project.preview.alt}
            fill
            sizes={isFeature ? "(max-width: 1279px) 50vw, 90vw" : "(max-width: 1279px) 50vw, 31vw"}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
            style={{ objectPosition: project.preview.position }}
          />
          <span className="absolute bottom-3 left-3 rounded-md border border-[#2f241d] bg-[#f6bf3f] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#2f241d] shadow-[3px_3px_0_rgba(47,36,29,.18)]">
            Production
          </span>
        </div>
      ) : null}
      <div className={contentLayoutClassName}>
        <div className={`flex flex-col gap-4 sm:flex-row sm:items-start ${isIncubator ? "xl:col-start-1 xl:row-span-3 xl:row-start-1" : ""}`}>
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${toneClasses} shadow-inner`}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#dff8ed] px-2 py-1 text-xs font-black text-[#047857]">{project.status}</span>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-black text-[#7b6656]">{project.kicker}</span>
              <span className="ml-auto hidden text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9a8776] xl:inline">
                {isIncubator ? "Studio queue" : `Project 0${index + 1}`}
              </span>
            </div>
            <h3 className={`mt-3 font-black tracking-tight ${isFeature ? "text-2xl sm:text-3xl xl:text-4xl" : "text-xl sm:text-2xl"}`}>
              {project.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5b4a] sm:mt-4 sm:text-base">{project.description}</p>
          </div>
        </div>

        <ul
          aria-label={`${project.title} 项目指标`}
          className={`${cstdProjectMetricGridClassName} ${isIncubator ? "xl:col-start-2 xl:row-start-1 xl:mt-0" : ""}`}
        >
          {project.metrics.map(([value, label]) => (
            <li key={value} className={cstdProjectMetricTileClassName}>
              <strong className={cstdProjectMetricValueClassName}>{value}</strong>
              <span className={cstdProjectMetricLabelClassName}>{label}</span>
            </li>
          ))}
        </ul>

        <div className={`${cstdProjectCardActionRailClassName} ${isIncubator ? "xl:col-start-2 xl:row-start-2" : ""}`}>
          {isLive ? (
            <HeroButton href={project.href} primary wideFrom320>
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
              {project.action}
            </HeroButton>
          ) : null}
          <button
            type="button"
            onClick={() => onFocus(project.id)}
            aria-label={getCstdProjectFocusButtonLabel(project)}
            className={`${isLive ? cstdProjectCardSecondaryActionClassName : cstdProjectCardPrimaryActionClassName} ${
              isLive ? "border-[#1b4332] bg-white text-[#0f8f64] hover:bg-[#eefbf4]" : "border-[#1b4332] bg-[#0f8f64] text-white hover:bg-[#0d7d59]"
            }`}
          >
            <ArrowDownRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            查看案例
          </button>
          {isLive ? (
            <button
              type="button"
              onClick={() => onToggleComparison(project.id)}
              aria-label={`${comparisonControl.label}：${project.title}`}
              aria-pressed={comparisonControl.selected}
              disabled={comparisonControl.disabled}
              className={`${cstdProjectCardSecondaryActionClassName} disabled:cursor-not-allowed disabled:opacity-55 ${
                comparisonControl.selected
                  ? "border-[#1b4332] bg-[#dff8ed] text-[#047857]"
                  : "border-[#1b4332] bg-white text-[#0f8f64] hover:bg-[#eefbf4]"
              }`}
            >
              {comparisonControl.selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
              {comparisonControl.label}
            </button>
          ) : null}
          {"softHref" in project && project.softHref ? (
            <HeroButton href={project.softHref} wideFrom320>
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
              {project.softAction}
            </HeroButton>
          ) : null}
          {!isLive ? (
            <HeroButton href={project.href} wideFrom320>
              {project.action}
            </HeroButton>
          ) : null}
        </div>

        <details aria-label={`${project.title} 项目详情`} className={cstdProjectDetailsDisclosureClassName}>
          <summary className={cstdProjectDetailsSummaryClassName}>
            <span className="min-w-0 whitespace-nowrap">项目详情</span>
            <span className={cstdProjectDetailsMetaClassName}>
              证据 {evidencePreview.length} · 技术 {project.tags.length}
            </span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className={cstdProjectDetailsBodyClassName}>
            <ProjectCardSupportingDetails project={project} evidencePreview={evidencePreview} motionDisabled={motionDisabled} compact />
          </div>
        </details>

        <div
          data-cstd-project-details="desktop"
          className={`${cstdProjectDetailsDesktopClassName} ${isIncubator ? "xl:col-start-2 xl:row-start-3" : ""}`}
        >
          <ProjectCardSupportingDetails project={project} evidencePreview={evidencePreview} motionDisabled={motionDisabled} />
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCardSupportingDetails({
  project,
  evidencePreview,
  motionDisabled,
  compact = false,
}: {
  project: (typeof cstdProjects)[number];
  evidencePreview: ReturnType<typeof getCstdProjectCardPreview>;
  motionDisabled: boolean;
  compact?: boolean;
}) {
  return (
    <>
      <dl className={compact ? "grid gap-2 text-sm" : cstdProjectEvidenceClassName}>
        {evidencePreview.map((item) => (
          <ProjectEvidence key={item.label} label={item.label} value={item.value} />
        ))}
      </dl>

      <div className={compact ? "mt-3 flex flex-wrap gap-2" : "mt-5 flex flex-wrap gap-2"}>
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
    </>
  );
}

function RestoredEntryHandoff({
  receipt,
  action,
  copyPresentation = null,
  fallbackText = "",
  secondaryAction = null,
  tone,
  statusLabel,
  nextLabel,
  actionIcon: ActionIcon,
  onClick,
}: {
  receipt: CstdProjectRestoredReceipt;
  action: { label: string; detail: string } | null;
  copyPresentation?: CstdProjectBriefCopyPresentation | null;
  fallbackText?: string;
  secondaryAction?: { href: string; label: string } | null;
  tone: keyof typeof cstdRestoredEntryToneClassNames;
  statusLabel: string;
  nextLabel: string;
  actionIcon: LucideIcon;
  onClick: () => void;
}) {
  const toneClassNames = cstdRestoredEntryToneClassNames[tone];
  const PrimaryActionIcon = copyPresentation?.tone === "success" ? Check : ActionIcon;
  const actionGroupClassName = secondaryAction ? cstdRestoredEntryActionsClassName : "grid w-full grid-cols-1 gap-2 sm:w-auto";

  return (
    <div aria-label={statusLabel} aria-live="polite" className={`${cstdRestoredEntryShellClassName} ${toneClassNames.shell}`}>
      <div className="flex min-w-0 items-start gap-2.5">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/80" aria-hidden="true">
          <Check className="h-3.5 w-3.5" />
        </span>
        <p className="min-w-0">
          <span className="block font-black">{receipt.label}</span>
          <span className={`mt-0.5 block min-w-0 break-words ${toneClassNames.detail}`}>{receipt.detail}</span>
        </p>
      </div>
      {action ? (
        <div className={`${cstdRestoredEntryNextClassName} ${toneClassNames.next}`} aria-label={nextLabel}>
          <p className="min-w-0">
            <span className="block text-[0.68rem] font-black uppercase text-[#6f5b4a]">建议下一步</span>
            <span className={`mt-0.5 block min-w-0 break-words ${toneClassNames.detail}`}>{action.detail}</span>
          </p>
          <div className={actionGroupClassName}>
            <button type="button" onClick={onClick} className={`${cstdRestoredEntryActionClassName} ${toneClassNames.button}`}>
              <PrimaryActionIcon className="h-3.5 w-3.5" />
              {copyPresentation?.actionLabel ?? action.label}
            </button>
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                target="_blank"
                rel="noreferrer"
                className={`${cstdRestoredEntryActionClassName} ${toneClassNames.button} no-underline`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
          {copyPresentation ? (
            <p role="status" className={`min-w-0 break-words text-xs font-semibold leading-5 sm:col-span-2 ${cstdRestoredEntryFeedbackClassNames[copyPresentation.tone]}`}>
              {copyPresentation.message}
            </p>
          ) : null}
          {copyPresentation?.requiresManualCopy && fallbackText.length > 0 ? (
            <textarea
              aria-label={`${statusLabel}手动复制文本`}
              readOnly
              value={fallbackText}
              onFocus={(event) => event.currentTarget.select()}
              className="min-h-32 min-w-0 resize-y rounded-lg border border-[#ead6ad] bg-[#fffaf0] p-3 text-xs font-semibold leading-5 text-[#4f3d31] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] sm:col-span-2"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ProjectFocus({
  project,
  briefCopyResult,
  copyResult,
  focusRef,
  motionDisabled,
  navigation,
  comparisonHandoff,
  restoredAction,
  restoredReceipt,
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
  comparisonHandoff: CstdProjectComparisonHandoff | null;
  restoredAction: CstdProjectFocusRestoredAction | null;
  restoredReceipt: CstdProjectRestoredReceipt | null;
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
  const briefCopyPresentation = getCstdProjectBriefCopyPresentation(briefCopyResult);
  const projectBriefText = briefCopyPresentation?.requiresManualCopy ? buildCstdProjectBrief(project) : "";
  const evidenceChecklist = getCstdProjectEvidenceChecklist(project);
  const evidenceChecklistSummary = getCstdProjectEvidenceChecklistSummary(evidenceChecklist);
  const visibleRestoredReceipt = comparisonHandoff ? null : restoredReceipt;

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
      <div className="relative border-b border-[#ead6ad] bg-[#f6bf3f]/18 p-4 sm:p-6">
        <div className="flex min-w-0 items-start gap-3 pr-12">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#0f8f64] shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-[#d98528]">Project case study</p>
            <h3
              id={`project-focus-${project.id}`}
              tabIndex={-1}
              className="mt-1 rounded-sm break-words text-2xl font-black focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-[#0f8f64] sm:text-3xl"
            >
              {project.title}
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#6f5b4a]">{project.evidence.current}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭案例焦点"
          className="absolute right-4 top-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ead6ad] bg-white text-[#2f241d] transition hover:border-[#d98528] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>
        {comparisonHandoff ? (
          <div
            aria-label="目标案例交接状态"
            aria-live="polite"
            className="mt-4 grid min-w-0 gap-3 border-t border-[#e3c778] pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          >
            <p className="min-w-0">
              <span className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#047857]">
                {comparisonHandoff.eyebrow}
              </span>
              <span className="mt-1 block text-sm font-black text-[#2f241d]">{comparisonHandoff.label}</span>
              <span className="mt-1 block min-w-0 break-words text-xs font-semibold leading-5 text-[#6f5b4a]">
                {comparisonHandoff.detail}
              </span>
            </p>
            <HeroButton href={comparisonHandoff.href} primary>
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
              {comparisonHandoff.actionLabel}
            </HeroButton>
          </div>
        ) : visibleRestoredReceipt ? (
          <RestoredEntryHandoff
            receipt={visibleRestoredReceipt}
            action={restoredAction}
            tone="focus"
            statusLabel="分享案例恢复状态"
            nextLabel="恢复案例下一步"
            actionIcon={Copy}
            onClick={onCopyBrief}
            copyPresentation={briefCopyPresentation}
            fallbackText={projectBriefText}
            secondaryAction={{
              href: project.href,
              label: project.action,
            }}
          />
        ) : null}
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
          {!visibleRestoredReceipt && briefCopyResult ? (
            <p role="status" className="text-xs font-semibold leading-5 text-[#6f5b4a]">
              {briefCopyMessage}
            </p>
          ) : null}
          {!visibleRestoredReceipt && briefCopyPresentation?.requiresManualCopy && projectBriefText.length > 0 ? (
            <textarea
              aria-label="案例摘要文本"
              readOnly
              value={projectBriefText}
              onFocus={(event) => event.currentTarget.select()}
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
