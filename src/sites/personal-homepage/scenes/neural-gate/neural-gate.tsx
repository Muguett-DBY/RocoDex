"use client";

import { ArrowDown, Command, Zap } from "lucide-react";
import { clsx } from "clsx";
import { lazy, memo, Suspense } from "react";
import type { CstdSystem } from "../../content/systems";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";

const LazyNarrativeSwitcher = lazy(() => import("../../components/site/narrative-switcher").then((module) => ({ default: module.NarrativeSwitcher })));
const LazyCstdAtlasPanel = lazy(() => import("../../components/atlas/cstd-atlas-panel").then((module) => ({ default: module.CstdAtlasPanel })));

const gateSignals = [
  { code: "A-01", label: "PRODUCT", x: "74%", y: "29%", color: "#f4d431" },
  { code: "A-02", label: "AI / AGENT", x: "83%", y: "48%", color: "#24e0ff" },
  { code: "A-03", label: "DATA / EDGE", x: "68%", y: "67%", color: "#ff3b30" },
] as const;

function NeuralGate({
  overdrive,
  onOpenConsole,
  onToggleOverdrive,
  activeSystemId,
  onSelectSystem,
  narrativeMode,
  onNarrativeChange,
}: {
  overdrive: boolean;
  onOpenConsole: () => void;
  onToggleOverdrive: () => void;
  activeSystemId: CstdSystem["id"];
  onSelectSystem: (id: CstdSystem["id"]) => void;
  narrativeMode: CstdNarrativeMode;
  onNarrativeChange: (mode: CstdNarrativeMode) => void;
}) {
  const narrative = getCstdNarrative(narrativeMode);
  return (
    <section
      id="top"
      data-cstd-hero
      data-cstd-chapter="hero"
      data-cstd-scene="hero"
      aria-labelledby="cstd-hero-title"
      className="relative z-10 min-h-svh border-b border-[#24e0ff]/20 lg:h-[185svh]"
    >
      <div className="relative flex min-h-svh items-center overflow-hidden px-5 pb-14 pt-24 md:px-10 lg:sticky lg:top-0 lg:px-16">
        <div aria-hidden="true" className="cstd-gate-depth-lines absolute inset-0 hidden lg:block" />
        <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
          {gateSignals.map((signal) => (
            <span
              key={signal.code}
              className="cstd-gate-signal absolute flex items-center gap-2 font-mono text-[9px] font-black"
              style={{ left: signal.x, top: signal.y, color: signal.color }}
            >
              <span className="h-1.5 w-1.5 bg-current shadow-[0_0_14px_currentColor]" />
              {signal.code} / {signal.label}
            </span>
          ))}
        </div>

        <div className="relative mx-auto grid w-full max-w-[1540px] gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(29rem,0.78fr)] lg:items-center lg:gap-14 xl:gap-20">
          <div className="max-w-6xl">
            <p className="cstd-gate-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-black uppercase text-[#f4d431] md:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-[#3dff8f] shadow-[0_0_18px_rgba(61,255,143,0.7)]" />
              <span>CSTD NEURAL GATE / ACCESS GRANTED</span>
              <span aria-hidden="true" className="hidden h-px w-20 bg-[#f4d431]/55 sm:block" />
              <span className="whitespace-nowrap">SYD 22:47</span>
            </p>

            <div className="cstd-gate-title-stack mt-8">
              <h1
                id="cstd-hero-title"
                aria-label="CSTD"
                data-text="CSTD"
                className="cstd-glitch-title cstd-gate-monogram w-fit text-[6rem] font-black leading-[0.76] tracking-[0] text-[#f2efe7] md:text-[9rem] lg:text-[9rem] xl:text-[11rem]"
              >
                CSTD
              </h1>
              <p aria-hidden="true" className="cstd-gate-secondary mt-2 font-mono text-4xl font-black leading-[0.82] text-[#24e0ff] md:text-6xl lg:text-8xl">
                NEURAL<br />CITY
              </p>
            </div>

            <p className="cstd-gate-code mt-7 font-mono text-[11px] font-black text-[#24e0ff] md:text-sm">
              CODE / SHIP / VERIFY / EVOLVE
            </p>
            <p key={narrative.id} className="cstd-gate-statement cstd-narrative-copy mt-5 max-w-4xl text-3xl font-semibold leading-[1.04] text-[#f2efe7] md:text-5xl lg:text-6xl">
              {narrative.thesis.zh}
              <span className="block text-[#f4d431]">每一束光，都对应一份可检查证据。</span>
            </p>
            <p key={`${narrative.id}-detail`} className="cstd-gate-copy cstd-narrative-copy mt-6 max-w-2xl text-base leading-8 text-[#b0b8bb] md:text-lg">
              {narrative.description.zh}
            </p>

            <div className="cstd-gate-actions mt-7"><Suspense fallback={<div aria-hidden="true" className="h-[4.5rem] w-[17rem] border border-white/12 bg-[#050709]/55" />}><LazyNarrativeSwitcher mode={narrativeMode} onChange={onNarrativeChange} /></Suspense></div>

            <div className="cstd-gate-actions mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#systems"
                className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#ffe95f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
              >
                {narrative.action.zh}
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={onOpenConsole}
                className="inline-flex h-12 items-center gap-3 border border-[#24e0ff]/50 bg-[#061015]/70 px-5 font-mono text-sm font-bold text-[#d8fbff] transition-colors hover:border-[#24e0ff] hover:bg-[#24e0ff] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
              >
                <Command aria-hidden="true" className="h-4 w-4" />
                CYBERDECK
              </button>
              <button
                type="button"
                aria-pressed={overdrive}
                onClick={onToggleOverdrive}
                className={clsx(
                  "inline-flex h-12 items-center gap-3 border px-5 font-mono text-sm font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]",
                  overdrive
                    ? "border-[#ff3b30] bg-[#ff3b30] text-[#050709]"
                    : "border-[#ff3b30]/50 bg-[#1a0909]/70 text-[#ff6a60] hover:bg-[#ff3b30] hover:text-[#050709]",
                )}
              >
                <Zap aria-hidden="true" className="h-4 w-4" />
                {overdrive ? "解除红色警戒" : "进入红色警戒"}
              </button>
            </div>
          </div>

          <Suspense fallback={<div aria-hidden="true" className="relative aspect-[10/11] min-h-[30rem] border border-[#24e0ff]/25 bg-[#050709]/55"><div className="absolute inset-6 border border-white/10" /><div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-black text-[#24e0ff]">LINKING 05 DISTRICTS</div></div>}>
            <LazyCstdAtlasPanel activeSystemId={activeSystemId} onSelectSystem={onSelectSystem} overdrive={overdrive} />
          </Suspense>
        </div>

        <a
          href="#systems"
          aria-label="进入技能反应堆"
          className="absolute bottom-6 left-5 flex items-center gap-3 font-mono text-[10px] font-black uppercase text-[#a5aaad] transition-colors hover:text-[#f4d431] md:left-10 lg:left-16"
        >
          Scroll / open the gate
          <span aria-hidden="true" className="h-px w-12 bg-current" />
        </a>
      </div>
    </section>
  );
}

export const MemoizedNeuralGate = memo(NeuralGate);
