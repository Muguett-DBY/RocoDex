import { cstdProjects } from "./cstd-projects";

export const cstdPageShellClassName =
  "mx-auto w-[calc(100%_-_48px)] max-w-[342px] sm:w-[min(1160px,calc(100%_-_32px))] sm:max-w-none";

export const cstdHeaderClassName =
  "sticky top-0 z-30 -mx-3 border-b border-[#ead6ad]/80 bg-[#fff6df]/92 px-3 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-7 sm:backdrop-blur-none";

export const cstdHeaderNavClassName = "hidden items-center gap-2 sm:flex sm:flex-wrap sm:justify-end";

export const cstdMobileNavClassName =
  "mt-3 grid gap-2 rounded-xl border border-[#ead6ad] bg-[#fffaf0]/96 p-3 shadow-[7px_7px_0_rgba(47,36,29,.08)] sm:hidden";

export const cstdNavLinkClassName =
  "inline-flex min-h-10 min-w-0 items-center rounded-lg border border-[#ead6ad] bg-white/75 px-3 text-sm font-black text-[#2f241d] no-underline shadow-[3px_3px_0_rgba(47,36,29,.06)] transition hover:-translate-y-0.5 hover:border-[#d98528] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]";

export const cstdHeroSectionClassName =
  "grid min-h-0 items-start gap-7 pb-10 pt-2 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-14 lg:pb-16 lg:pt-3";

export const cstdHeroActionsClassName =
  "mt-6 grid w-full grid-cols-1 gap-3 sm:mt-8 sm:w-auto sm:max-w-none sm:flex sm:flex-wrap";

export const cstdMascotAsideClassName = "relative min-h-0 lg:min-h-[560px]";

export const cstdMascotShellClassName =
  "group relative left-1/2 top-0 grid w-[min(100%,240px)] -translate-x-1/2 place-items-center overflow-hidden rounded-[24px] border-2 border-[#ead6ad] bg-white/55 p-3 shadow-[10px_10px_0_rgba(97,61,22,.08)] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f8f64] sm:w-[min(100%,300px)] sm:rounded-[28px] sm:p-4 lg:absolute lg:top-20 lg:w-[min(100%,420px)] lg:rounded-[36px] lg:p-5 lg:shadow-[18px_18px_0_rgba(97,61,22,.08)]";

export const cstdProjectGridClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-3";

export const cstdProjectHeadingClassName = "mt-2 max-w-full break-words text-2xl font-black tracking-tight sm:text-5xl";

export const cstdProjectWorkflowSummaryGridClassName = "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4";

export const cstdProjectMetricGridClassName = "mt-5 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3";

export const cstdProjectMetricTileClassName = "min-w-0 rounded-lg border border-[#ead6ad] bg-white/72 p-3 sm:rounded-xl sm:p-4 xl:px-2.5 xl:py-3";

export const cstdProjectMetricValueClassName = "block min-w-0 break-words text-lg font-black leading-tight sm:text-xl xl:text-lg";

export const cstdProjectMetricLabelClassName = "mt-1 block min-w-0 break-words text-xs font-semibold leading-snug text-[#7b6656]";

export const cstdProjectEvidenceClassName =
  "mt-4 grid gap-2 rounded-lg border border-[#ead6ad] bg-[#fffaf0]/72 p-3 text-sm sm:mt-5";

export const cstdProjectEvidenceShareGridClassName = "mt-4 grid items-stretch gap-3 lg:grid-cols-2";

export const cstdProjectProofTimelineGridClassName = "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5";

export const cstdProjectToolbarClassName =
  "mt-3 grid min-w-0 gap-3 rounded-lg border border-[#ead6ad] bg-[#fffaf0]/78 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center";

export const cstdProjectToolbarActionsClassName = "grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap sm:justify-end";

export const cstdProjectComparisonClassName =
  "mb-4 min-w-0 overflow-hidden rounded-xl border border-[#b7decf] bg-[#eefbf4]/82 shadow-[6px_6px_0_rgba(47,36,29,.05)]";

export const cstdProjectComparisonColumnsClassName = "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2";

export const cstdProjectFocusBodyClassName = "grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem]";

export const cstdProjectFocusChecklistGridClassName = "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2";

export const cstdProjectFocusActionRailClassName =
  "flex flex-col gap-3 rounded-xl border border-[#ead6ad] bg-white/75 p-4 lg:sticky lg:top-24 lg:self-start";

export const cstdProjectCards = cstdProjects.map(({ title, kicker }) => ({ title, kicker }));
