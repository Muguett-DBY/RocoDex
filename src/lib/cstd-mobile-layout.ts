export const cstdPageShellClassName =
  "mx-auto w-[calc(100%_-_48px)] max-w-[342px] sm:w-[min(1160px,calc(100%_-_32px))] sm:max-w-none";

export const cstdHeaderNavClassName = "grid w-full grid-cols-3 gap-2 sm:w-auto sm:flex sm:flex-wrap";

export const cstdNavLinkClassName =
  "inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-[#ead6ad] bg-white/70 px-2 text-xs font-black text-[#2f241d] no-underline shadow-[3px_3px_0_rgba(47,36,29,.06)] transition hover:-translate-y-0.5 hover:border-[#d98528] hover:bg-white sm:px-3 sm:text-sm";

export const cstdHeroSectionClassName =
  "grid min-h-0 items-start gap-7 pb-10 pt-2 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-14 lg:pb-16 lg:pt-3";

export const cstdHeroActionsClassName =
  "mt-6 grid w-full grid-cols-1 gap-3 sm:mt-8 sm:w-auto sm:max-w-none sm:flex sm:flex-wrap";

export const cstdMascotAsideClassName = "relative min-h-0 lg:min-h-[560px]";

export const cstdMascotShellClassName =
  "group relative left-1/2 top-0 grid w-[min(100%,240px)] -translate-x-1/2 place-items-center overflow-hidden rounded-[24px] border-2 border-[#ead6ad] bg-white/55 p-3 shadow-[10px_10px_0_rgba(97,61,22,.08)] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f8f64] sm:w-[min(100%,300px)] sm:rounded-[28px] sm:p-4 lg:absolute lg:top-20 lg:w-[min(100%,420px)] lg:rounded-[36px] lg:p-5 lg:shadow-[18px_18px_0_rgba(97,61,22,.08)]";

export const cstdProjectGridClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-3";

export const cstdProjectCards = [
  {
    title: "洛克图鉴 / RocoDex",
    kicker: "Data app",
  },
  {
    title: "奶黄包摄影",
    kicker: "Photography",
  },
  {
    title: "更多项目孵化中",
    kicker: "Incubating",
  },
] as const;
