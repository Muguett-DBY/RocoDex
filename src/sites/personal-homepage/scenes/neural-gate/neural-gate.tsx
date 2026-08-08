"use client";

import { ArrowDown, Command, RadioTower, Zap } from "lucide-react";
import { clsx } from "clsx";
import { memo } from "react";
import { cstdProofs, cstdSystems } from "../../content/systems";

const gateSignals = [
  { code: "A-01", label: "PRODUCT", x: "74%", y: "29%", color: "#f4d431" },
  { code: "A-02", label: "AI / AGENT", x: "83%", y: "48%", color: "#24e0ff" },
  { code: "A-03", label: "DATA / EDGE", x: "68%", y: "67%", color: "#ff3b30" },
] as const;

function NeuralGate({
  overdrive,
  onOpenConsole,
  onToggleOverdrive,
}: {
  overdrive: boolean;
  onOpenConsole: () => void;
  onToggleOverdrive: () => void;
}) {
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

        <div className="relative mx-auto grid w-full max-w-[1540px] gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-20">
          <div className="max-w-6xl">
            <p className="cstd-gate-eyebrow flex items-center gap-3 font-mono text-[10px] font-black uppercase text-[#f4d431] md:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-[#3dff8f] shadow-[0_0_18px_rgba(61,255,143,0.7)]" />
              CSTD NEURAL GATE / ACCESS GRANTED
              <span aria-hidden="true" className="hidden h-px w-20 bg-[#f4d431]/55 sm:block" />
              SYD 22:47
            </p>

            <div className="cstd-gate-title-stack mt-8">
              <h1
                id="cstd-hero-title"
                aria-label="CSTD"
                data-text="CSTD"
                className="cstd-glitch-title cstd-gate-monogram w-fit text-[6rem] font-black leading-[0.76] tracking-[0] text-[#f2efe7] md:text-[9rem] lg:text-[11rem] xl:text-[13rem]"
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
            <p className="cstd-gate-statement mt-5 max-w-4xl text-3xl font-semibold leading-[1.04] text-[#f2efe7] md:text-5xl lg:text-6xl">
              穿过一座由真实系统点亮的城市。
              <span className="block text-[#f4d431]">每一束光，都对应一次交付。</span>
            </p>
            <p className="cstd-gate-copy mt-6 max-w-2xl text-base leading-8 text-[#b0b8bb] md:text-lg">
              奶黄包的个人技术工作室。产品工程、AI 工作流、数据系统、边缘交付与量化研究在这里汇入同一条可验证的运行链路。
            </p>

            <div className="cstd-gate-actions mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#systems"
                className="inline-flex h-12 items-center gap-3 bg-[#f4d431] px-5 font-mono text-sm font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_70%,calc(100%-14px)_100%,0_100%)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#ffe95f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
              >
                进入神经城市
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

          <aside className="cstd-gate-monitor border-y border-[#24e0ff]/30 bg-[#050709]/72 px-5 py-6 font-mono backdrop-blur-md" aria-label="城市运行状态">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[9px] font-black text-[#24e0ff]">
                <RadioTower aria-hidden="true" className="h-3.5 w-3.5" /> CITY TELEMETRY
              </p>
              <span className={clsx("text-[9px] font-black", overdrive ? "text-[#ff5a50]" : "text-[#3dff8f]")}>{overdrive ? "REDLINE" : "NOMINAL"}</span>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-1">
              <div className="border-l-2 border-[#f4d431] pl-3">
                <dt className="text-[9px] text-[#777d81]">DISTRICTS</dt>
                <dd className="mt-1 text-2xl font-black">{cstdSystems.length}</dd>
              </div>
              <div className="border-l-2 border-[#24e0ff] pl-3">
                <dt className="text-[9px] text-[#777d81]">BROADCASTS</dt>
                <dd className="mt-1 text-2xl font-black">{cstdProofs.length}</dd>
              </div>
              <div className="border-l-2 border-[#ff3b30] pl-3">
                <dt className="text-[9px] text-[#777d81]">UPLINK</dt>
                <dd className="mt-1 text-sm font-black text-[#3dff8f]">LIVE</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-[#24e0ff]/20 pt-4 text-[9px] font-bold leading-5 text-[#718087]">
              <p>WORLD CLOCK: NATIVE SCROLL</p>
              <p>CAMERA BUS: SYNCHRONIZED</p>
              <p>QUALITY: PERFORMANCE ADAPTIVE</p>
            </div>
          </aside>
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
