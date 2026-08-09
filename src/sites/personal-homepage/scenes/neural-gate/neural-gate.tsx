"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { memo } from "react";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { CstdChapterLink } from "../../components/site/cstd-chapter-link";
import { CstdLink } from "../../components/site/cstd-link";

const signatureSignals = [
  { value: "PRODUCT", label: "把需求变成可发布产品" },
  { value: "AI + DATA", label: "确定性内核，智能能力在边缘" },
  { value: "SHIP", label: "测试、性能与线上验收闭环" },
] as const;

function NeuralGate({ narrativeMode }: { narrativeMode: CstdNarrativeMode }) {
  const narrative = getCstdNarrative(narrativeMode);

  return (
    <section
      id="top"
      data-cstd-hero
      data-cstd-chapter="hero"
      data-cstd-scene="hero"
      aria-labelledby="cstd-hero-title"
      className="cstd-hero-stage relative z-10 flex min-h-svh items-center overflow-hidden border-b border-[#24e0ff]/18 px-5 pb-16 pt-28 md:px-10 lg:min-h-[104svh] lg:px-16 lg:pb-20"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[68%] bg-[linear-gradient(90deg,rgba(5,7,9,0.98),rgba(5,7,9,0.82)_58%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#050709,transparent)]" />
      <div aria-hidden="true" className="cstd-hero-scanline absolute inset-x-0 top-[22%] h-px bg-[#24e0ff]/45" />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="cstd-hero-copy max-w-[54rem]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-black text-[#f4d431] md:text-xs">
            <span aria-hidden="true" className="h-2 w-2 bg-[#3dff8f] shadow-[0_0_14px_rgba(61,255,143,0.55)]" />
            <span>01 / 奶黄包 / CUSTARD</span>
            <span aria-hidden="true" className="hidden h-px w-16 bg-[#f4d431]/45 sm:block" />
            <span>SYDNEY</span>
          </p>

          <h1
            id="cstd-hero-title"
            aria-label="奶黄包"
            data-text="奶黄包"
            className="cstd-hero-wordmark mt-7 w-fit text-[4.6rem] font-black leading-[0.84] text-[#f2efe7] md:text-[7rem] lg:text-[8.75rem]"
          >
            奶黄包
          </h1>
          <p data-cstd-hero-role className="mt-4 font-mono text-lg font-black leading-tight text-[#24e0ff] md:text-2xl">
            PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER
          </p>

          <p
            data-cstd-hero-thesis
            aria-label={narrative.thesis.zh}
            className="mt-9 max-w-3xl text-3xl font-semibold leading-[1.06] text-[#f2efe7] md:text-5xl lg:text-[3.4rem]"
          >
            把复杂问题，
            <span className="block text-[#f4d431]">编译成真正运行的系统。</span>
          </p>
          <p data-cstd-hero-description className="mt-6 max-w-xl text-base leading-8 text-[#b7c0c3] md:text-lg">
            奶黄包的个人技术工作室。用产品、AI、数据和工程判断，把想法做成真实上线、可以验证的系统。
          </p>

          <div data-cstd-hero-actions className="mt-8 flex flex-wrap items-center gap-3">
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
              className="inline-flex h-12 items-center gap-3 border border-[#24e0ff]/50 bg-[#061015]/78 px-5 font-mono text-sm font-bold text-[#d8fbff] transition-colors hover:border-[#24e0ff] hover:bg-[#24e0ff] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
            >
              认识奶黄包
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
          </div>
        </div>

        <aside data-cstd-core-spec className="absolute bottom-1 right-0 hidden w-64 border-l border-[#24e0ff]/60 bg-[#050709]/88 p-5 lg:block">
          <p className="font-mono text-[9px] font-black text-[#24e0ff]">CSTD CORE / ARTIFACT 05</p>
          <p className="mt-3 text-sm font-semibold text-white">CERAMIC COMPUTE CORE</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-white/12 pt-4 font-mono text-[8px]">
            <div><dt className="text-[#67757a]">FRAME</dt><dd className="mt-1 text-[#f4d431]">112 KB</dd></div>
            <div><dt className="text-[#67757a]">DEFAULT</dt><dd className="mt-1 text-[#3dff8f]">ZERO CANVAS</dd></div>
            <div><dt className="text-[#67757a]">SIGNAL</dt><dd className="mt-1 text-white">LIVE</dd></div>
            <div><dt className="text-[#67757a]">MODE</dt><dd className="mt-1 text-white">BALANCED</dd></div>
          </dl>
        </aside>

        <dl data-cstd-hero-summary className="mt-14 grid max-w-[54rem] border-y border-white/14 sm:grid-cols-3">
          {signatureSignals.map((signal) => (
            <div key={signal.value} className="border-b border-white/14 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <dt className="font-mono text-[9px] font-black text-[#24e0ff]">{signal.value}</dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-[#d7dddf]">{signal.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden="true" className="absolute bottom-5 right-5 hidden items-center gap-3 font-mono text-[8px] font-black text-[#7f8b90] md:flex lg:right-16">
        <span className="h-px w-14 bg-[#24e0ff]/55" />
        NEXT / 02 CAPABILITY SYSTEM
      </div>
    </section>
  );
}

export const MemoizedNeuralGate = memo(NeuralGate);
