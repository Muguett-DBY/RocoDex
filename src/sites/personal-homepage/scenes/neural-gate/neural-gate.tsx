import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { CstdChapterLink } from "../../components/site/cstd-chapter-link";
import { CstdLink } from "../../components/site/cstd-link";
import { ThemeChapterLabel, ThemeCopy } from "../../components/theme-copy";
import type { CstdLocale } from "../../content/content-types";
import { cstdProfile } from "../../content/profile";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";
import { StudioEntryConsole } from "../../components/stage/studio-entry-console";
import { ThemeStageVisual } from "../../components/stage/theme-stage-visual";

const signatureSignals = [
  { value: "01", label: { zh: "数据分析", en: "Data analysis" } },
  { value: "02", label: { zh: "数据系统与产品", en: "Data systems and products" } },
  { value: "03", label: { zh: "发布与验证", en: "Release and verification" } },
] as const;

type HeroThemeCopy = Readonly<{
  kicker: string;
  role: string;
  thesis: string;
  accent: string;
  description: string;
}>;

const heroCopy: Record<CstdLocale, Record<"atelier" | "neon" | "underworld" | "astral", HeroThemeCopy>> = {
  zh: {
    atelier: { kicker: "CSTD / 个人工作室", role: "数据科学研究生 · 分析、系统与产品", thesis: "把问题拆开、", accent: "把答案做实。", description: "我用 R、Python 和 SQL 做可复现的分析，也把分析做成能上线的产品。这个站是作品、取舍与验证过程的完整记录。" },
    neon: { kicker: "CSTD / PERSONAL STUDIO", role: "DATA SCIENCE POSTGRADUATE / ANALYSIS THAT SHIPS", thesis: "我把问题拆开，", accent: "直到它能在现实里运行。", description: "我做分析，也做分析背后的系统。数据、界面、AI 和发布都要经得住真实使用，而不是只在演示里好看。" },
    underworld: { kicker: "冥府档案 / 造物者 017", role: "数据科学研究生 / 分析铸造者", thesis: "困难的系统，", accent: "要经得住一次次归返。", description: "我把分析、AI、数据和发布放进同一座工坊：先锻出形，再过试炼，最后带着证据回到现实。" },
    astral: { kicker: "星界旅记 / 冒险者 017", role: "数据科学研究生 / 分析策士", thesis: "复杂系统，", accent: "也是一场由选择写成的冒险。", description: "我把问题、数据、代码和发布摊开在同一张冒险桌上：看清局势，组成工具，做出选择，再带着证据继续前进。" },
  },
  en: {
    atelier: { kicker: "CSTD / PERSONAL STUDIO", role: "DATA SCIENCE POSTGRADUATE · ANALYSIS, SYSTEMS, PRODUCTS", thesis: "Take the problem apart,", accent: "make the answer hold up.", description: "I run reproducible analysis in R, Python, and SQL, then ship it as products that actually run. This site keeps the work, the trade-offs, and the verification." },
    neon: { kicker: "CSTD / PERSONAL STUDIO", role: "DATA SCIENCE POSTGRADUATE / ANALYSIS THAT SHIPS", thesis: "I take problems apart", accent: "until they work in the real world.", description: "I build analysis and the systems behind it. Data, interfaces, AI, and release all have to survive real use, not just a polished demo." },
    underworld: { kicker: "UNDERWORLD ARCHIVE / MAKER 017", role: "DATA SCIENCE POSTGRADUATE / ANALYSIS ARTIFICER", thesis: "Difficult systems are forged", accent: "through trial and return.", description: "I bring analysis, AI, data, and release into one workshop: shape the method, put it through trial, then return it to the real world with evidence intact." },
    astral: { kicker: "ASTRAL JOURNAL / ADVENTURER 017", role: "DATA SCIENCE POSTGRADUATE / ANALYSIS TACTICIAN", thesis: "Complex systems are adventures", accent: "written by choices.", description: "I spread questions, data, code, and release across one campaign table: read the situation, assemble the tools, choose a route, and keep the evidence for what comes next." },
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
      className="cstd-hero-stage relative z-10 flex min-h-svh items-center overflow-hidden border-b border-white/10 px-5 pb-14 pt-28 md:px-10 lg:min-h-[104svh] lg:px-16 lg:pb-16"
    >
      <ThemeStageVisual />
      <div aria-hidden="true" data-cstd-motion-layer="ambient" className="absolute inset-y-0 left-0 w-[74%] bg-[linear-gradient(90deg,rgba(5,7,9,0.98),rgba(5,7,9,0.84)_60%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#050709,transparent)]" />
      <div aria-hidden="true" data-cstd-motion-layer="narrative" className="cstd-hero-scanline absolute inset-x-0 top-[24%] h-px bg-[#24e0ff]/35" />

      <div data-cstd-hero-layout className="relative mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,25rem)] lg:items-end lg:gap-12">
        <div className="cstd-hero-copy max-w-[50rem]" data-cstd-motion-layer="narrative">
          <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#f4d431] md:text-xs">
            <span aria-hidden="true" className="h-px w-10 bg-[#f4d431]" />
            <ThemeChapterLabel
              atelier={copy.atelier.kicker}
              neon={copy.neon.kicker}
              underworld={copy.underworld.kicker}
              astral={copy.astral.kicker}
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
              atelier={copy.atelier.role}
              neon={copy.neon.role}
              underworld={copy.underworld.role}
              astral={copy.astral.role}
            />
          </p>

          <p
            data-cstd-hero-thesis
            data-cstd-narrative-thesis={narrative.thesis[locale]}
            className="mt-10 max-w-3xl text-3xl font-semibold leading-[1.08] text-[#f2efe7] md:text-[2.8rem] lg:text-[3.1rem]"
          >
            <ThemeCopy
              atelier={<>{copy.atelier.thesis}<span className="block">{copy.atelier.accent}</span></>}
              neon={<>{copy.neon.thesis}<span className="block text-[#f4d431]">{copy.neon.accent}</span></>}
              underworld={<>{copy.underworld.thesis}<span className="block text-[#f4d431]">{copy.underworld.accent}</span></>}
              astral={<>{copy.astral.thesis}<span className="block text-[#f4d431]">{copy.astral.accent}</span></>}
            />
          </p>
          <p data-cstd-hero-description className="mt-5 max-w-xl text-base leading-7 text-[#aeb8bb] md:text-lg md:leading-8">
            <ThemeCopy
              atelier={copy.atelier.description}
              neon={copy.neon.description}
              underworld={copy.underworld.description}
              astral={copy.astral.description}
            />
          </p>

          <div data-cstd-hero-actions className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CstdChapterLink
              href="#systems"
              className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              {locale === "zh" ? "进入系统现场" : "Enter the systems field"}
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

        <div data-cstd-motion-layer="interactive" className="lg:pb-1">
          <StudioEntryConsole locale={locale} />
        </div>

        <dl data-cstd-hero-summary className="grid max-w-[46rem] border-t border-white/14 sm:grid-cols-3 lg:col-span-2">
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
