"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { memo } from "react";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
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
      className="relative z-10 flex min-h-svh items-center overflow-hidden border-b border-[#24e0ff]/18 px-5 pb-16 pt-28 md:px-10 lg:px-16 lg:pb-20"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[72%] bg-[linear-gradient(90deg,rgba(5,7,9,0.98),rgba(5,7,9,0.8)_58%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#050709,transparent)]" />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="max-w-[58rem]">
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
            className="cstd-glitch-title mt-7 w-fit text-[4.8rem] font-black leading-[0.82] text-[#f2efe7] md:text-[7.25rem] lg:text-[8.5rem]"
          >
            奶黄包
          </h1>
          <p className="mt-4 font-mono text-xl font-black leading-tight text-[#24e0ff] md:text-3xl">
            PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER
          </p>

          <p className="mt-8 max-w-4xl text-3xl font-semibold leading-[1.08] text-[#f2efe7] md:text-5xl lg:text-[3.5rem]">
            {narrative.thesis.zh}
            <span className="mt-1 block text-[#f4d431]">复杂，但必须清楚；炫酷，但必须能跑。</span>
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#b7c0c3] md:text-lg">
            奶黄包的个人技术工作室。这里展示真实系统、工程判断与可复现证据，不把主页做成另一套项目管理工具。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#proof"
              className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              查看代表作品
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
            <CstdLink
              href="/about"
              className="inline-flex h-12 items-center gap-3 border border-[#24e0ff]/50 bg-[#061015]/78 px-5 font-mono text-sm font-bold text-[#d8fbff] transition-colors hover:border-[#24e0ff] hover:bg-[#24e0ff] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
            >
              认识奶黄包
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
          </div>
        </div>

        <dl data-cstd-hero-summary className="mt-14 grid max-w-5xl border-y border-white/14 sm:grid-cols-3">
          {signatureSignals.map((signal) => (
            <div key={signal.value} className="border-b border-white/14 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <dt className="font-mono text-[9px] font-black text-[#24e0ff]">{signal.value}</dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-[#d7dddf]">{signal.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export const MemoizedNeuralGate = memo(NeuralGate);
