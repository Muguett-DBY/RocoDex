import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { CstdChapterLink } from "../../components/site/cstd-chapter-link";
import { CstdLink } from "../../components/site/cstd-link";

const signatureSignals = [
  { value: "01", label: "产品工程" },
  { value: "02", label: "AI 与数据系统" },
  { value: "03", label: "发布与验证" },
] as const;

export function NeuralGate({ narrativeMode }: { narrativeMode: CstdNarrativeMode }) {
  const narrative = getCstdNarrative(narrativeMode);

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

      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="cstd-hero-copy max-w-[50rem]">
          <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#f4d431] md:text-xs">
            <span aria-hidden="true" className="h-px w-10 bg-[#f4d431]" />
            <span>CSTD / PERSONAL STUDIO</span>
          </p>

          <h1
            id="cstd-hero-title"
            aria-label="奶黄包"
            data-text="奶黄包"
            className="cstd-hero-wordmark mt-7 w-fit text-[4.35rem] font-black leading-[0.86] text-[#f2efe7] md:text-[6.5rem] lg:text-[7.75rem]"
          >
            奶黄包
          </h1>
          <p data-cstd-hero-role className="mt-4 font-mono text-sm font-black leading-tight text-[#24e0ff] md:text-lg">
            PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER
          </p>

          <p
            data-cstd-hero-thesis
            aria-label={narrative.thesis.zh}
            className="mt-10 max-w-3xl text-3xl font-semibold leading-[1.08] text-[#f2efe7] md:text-[2.8rem] lg:text-[3.1rem]"
          >
            把复杂问题，
            <span className="block text-[#f4d431]">编译成真正运行的系统。</span>
          </p>
          <p data-cstd-hero-description className="mt-5 max-w-xl text-base leading-7 text-[#aeb8bb] md:text-lg md:leading-8">
            奶黄包的个人技术工作室。用产品、AI、数据和工程判断，把想法做成真实上线、可以验证的系统。
          </p>

          <div data-cstd-hero-actions className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CstdChapterLink
              href="#proof"
              className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              查看代表作品
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </CstdChapterLink>
            <CstdLink
              href="/about"
              eagerPrefetch
              className="inline-flex h-12 items-center gap-2 border-b border-[#24e0ff]/55 px-1 font-mono text-xs font-black text-[#c9f8ff] transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
            >
              认识奶黄包
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
          </div>
        </div>

        <dl data-cstd-hero-summary className="mt-12 grid max-w-[46rem] border-t border-white/14 sm:grid-cols-3">
          {signatureSignals.map((signal) => (
            <div key={signal.value} className="flex items-baseline gap-3 border-b border-white/10 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <dt className="font-mono text-[11px] font-black text-[#f4d431]">{signal.value}</dt>
              <dd className="text-xs font-semibold text-[#aeb8bb]">{signal.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden="true" className="absolute bottom-5 right-5 hidden items-center gap-3 font-mono text-[11px] font-black text-[#697478] md:flex lg:right-16">
        <span className="h-px w-14 bg-[#24e0ff]/55" />
        NEXT / 02 CAPABILITY SYSTEM
      </div>
    </section>
  );
}
