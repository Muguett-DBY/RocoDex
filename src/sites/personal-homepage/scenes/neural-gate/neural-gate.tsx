import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { CstdChapterLink } from "../../components/site/cstd-chapter-link";
import { CstdLink } from "../../components/site/cstd-link";
import { ThemeChapterLabel, ThemeCopy } from "../../components/theme-copy";
import { ThemeHeroArtifact } from "../../components/theme-hero-artifact";
import type { CstdLocale } from "../../content/content-types";
import { cstdProfile } from "../../content/profile";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";

const signatureSignals = [
  { value: "01", label: { zh: "产品工程", en: "Product engineering" } },
  { value: "02", label: { zh: "AI 与数据系统", en: "AI and data systems" } },
  { value: "03", label: { zh: "发布与验证", en: "Release and verification" } },
] as const;

type HeroThemeCopy = Readonly<{
  kicker: string;
  role: string;
  thesis: string;
  accent: string;
  description: string;
}>;

const heroCopy: Record<CstdLocale, Record<"neon" | "ink" | "press" | "pixel", HeroThemeCopy>> = {
  zh: {
    neon: { kicker: "CSTD / PERSONAL STUDIO", role: "PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER", thesis: "我把问题拆开，", accent: "直到它能在现实里运行。", description: "我做产品，也做背后的系统。界面、AI、数据和发布都要经得住真实使用，而不是只在演示里好看。" },
    ink: { kicker: "奶黄包 · 工程手卷", role: "产品工程 · 智能系统 · 造物求真", thesis: "先把问题说清，", accent: "再把系统做成。", description: "一卷一卷记录我怎么做决定：什么该保留，什么要舍弃，哪里必须留下证据。" },
    press: { kicker: "THE LEAD / PROFILE", role: "INDEPENDENT PRODUCT ENGINEER / SYSTEMS DESK", thesis: "今日头条：", accent: "一个人把复杂系统做完。", description: "本期记录一名产品工程师如何在产品、AI、数据和发布之间来回切换，并把结果交到真实用户手里。" },
    pixel: { kicker: "NEW GAME / PLAYER 01", role: "CLASS / PRODUCT ENGINEER + SYSTEM BUILDER", thesis: "主线任务：", accent: "把想法做成能用的东西。", description: "拿产品、AI、数据和工程当装备，从第一个草图开始，打通实现、修 bug 和上线验收。" },
  },
  en: {
    neon: { kicker: "CSTD / PERSONAL STUDIO", role: "PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER", thesis: "I take problems apart", accent: "until they work in the real world.", description: "I build products and the systems behind them. Interfaces, AI, data, and release all have to survive real use, not just a polished demo." },
    ink: { kicker: "CUSTARD · ENGINEERING SCROLL", role: "PRODUCT ENGINEERING · INTELLIGENT SYSTEMS · CRAFT", thesis: "Name the problem clearly;", accent: "then make the system.", description: "Each scroll records a decision: what stayed, what changed, and where the evidence had to remain visible." },
    press: { kicker: "THE LEAD / PROFILE", role: "INDEPENDENT PRODUCT ENGINEER / SYSTEMS DESK", thesis: "Today's lead:", accent: "one person ships a complex system.", description: "This issue follows a product engineer across product, AI, data, and release work, then into the hands of people who use the result." },
    pixel: { kicker: "NEW GAME / PLAYER 01", role: "CLASS / PRODUCT ENGINEER + SYSTEM BUILDER", thesis: "Main quest:", accent: "turn an idea into something useful.", description: "Use product, AI, data, and engineering as your kit. Start with a sketch, then work through implementation, bug fixes, and release checks." },
  },
};

export function NeuralGate({ narrativeMode, locale }: { narrativeMode: CstdNarrativeMode; locale: CstdLocale }) {
  const narrative = getCstdNarrative(narrativeMode);
  const copy = heroCopy[locale];

  return (
    <section
      id="top"
      data-cstd-hero
      data-cstd-chapter="hero"
      data-cstd-scene="hero"
      aria-labelledby="cstd-hero-title"
      className="cstd-hero-stage relative z-10 flex min-h-svh items-center overflow-hidden border-b border-white/10 px-5 pb-14 pt-28 md:px-10 lg:min-h-[102svh] lg:px-16 lg:pb-16"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[72%] bg-[linear-gradient(90deg,rgba(5,7,9,0.99),rgba(5,7,9,0.86)_58%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#050709,transparent)]" />
      <div aria-hidden="true" className="cstd-hero-scanline absolute inset-x-0 top-[24%] h-px bg-[#24e0ff]/35" />

      <div data-cstd-hero-layout className="relative mx-auto w-full max-w-[1320px]">
        <div className="cstd-hero-copy max-w-[50rem]">
          <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#f4d431] md:text-xs">
            <span aria-hidden="true" className="h-px w-10 bg-[#f4d431]" />
            <ThemeChapterLabel
              neon={copy.neon.kicker}
              ink={copy.ink.kicker}
              press={copy.press.kicker}
              pixel={copy.pixel.kicker}
            />
          </p>

          <h1
            id="cstd-hero-title"
            aria-label={cstdProfile.name[locale]}
            data-text={cstdProfile.name[locale]}
            className="cstd-hero-wordmark mt-7 w-fit text-[4.35rem] font-black leading-[0.86] text-[#f2efe7] md:text-[6.5rem] lg:text-[7.75rem]"
          >
            {cstdProfile.name[locale]}
          </h1>
          <p data-cstd-hero-role className="mt-4 font-mono text-sm font-black leading-tight text-[#24e0ff] md:text-lg">
            <ThemeCopy
              neon={copy.neon.role}
              ink={copy.ink.role}
              press={copy.press.role}
              pixel={copy.pixel.role}
            />
          </p>

          <p
            data-cstd-hero-thesis
            data-cstd-narrative-thesis={narrative.thesis[locale]}
            className="mt-10 max-w-3xl text-3xl font-semibold leading-[1.08] text-[#f2efe7] md:text-[2.8rem] lg:text-[3.1rem]"
          >
            <ThemeCopy
              neon={<>{copy.neon.thesis}<span className="block text-[#f4d431]">{copy.neon.accent}</span></>}
              ink={<>{copy.ink.thesis}<span className="block text-[#f4d431]">{copy.ink.accent}</span></>}
              press={<>{copy.press.thesis}<span className="block text-[#f4d431]">{copy.press.accent}</span></>}
              pixel={<>{copy.pixel.thesis}<span className="block text-[#f4d431]">{copy.pixel.accent}</span></>}
            />
          </p>
          <p data-cstd-hero-description className="mt-5 max-w-xl text-base leading-7 text-[#aeb8bb] md:text-lg md:leading-8">
            <ThemeCopy
              neon={copy.neon.description}
              ink={copy.ink.description}
              press={copy.press.description}
              pixel={copy.pixel.description}
            />
          </p>

          <div data-cstd-hero-actions className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CstdChapterLink
              href="#proof"
              className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              {locale === "zh" ? "查看代表作品" : "View selected work"}
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </CstdChapterLink>
            <CstdLink
              href={getLocalizedCstdHref("/about", locale)}
              eagerPrefetch
              className="inline-flex h-12 items-center gap-2 border-b border-[#24e0ff]/55 px-1 font-mono text-xs font-black text-[#c9f8ff] transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
            >
              {locale === "zh" ? "认识奶黄包" : "Meet Custard"}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
          </div>
        </div>

        <ThemeHeroArtifact locale={locale} />

        <dl data-cstd-hero-summary className="mt-12 grid max-w-[46rem] border-t border-white/14 sm:grid-cols-3">
          {signatureSignals.map((signal) => (
            <div key={signal.value} className="flex items-baseline gap-3 border-b border-white/10 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <dt className="font-mono text-[11px] font-black text-[#f4d431]">{signal.value}</dt>
              <dd className="text-xs font-semibold text-[#aeb8bb]">{signal.label[locale]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden="true" className="absolute bottom-5 right-5 hidden items-center gap-3 font-mono text-[11px] font-black text-[#697478] md:flex lg:right-16">
        <span className="h-px w-14 bg-[#24e0ff]/55" />
        {locale === "zh" ? "下一章 / 02 能力系统" : "NEXT / 02 CAPABILITY SYSTEM"}
      </div>
    </section>
  );
}
