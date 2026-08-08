"use client";

import { memo } from "react";

const heroSignals = [
  { index: "01", label: "PRODUCT", detail: "SURFACE / INTERFACE / SHIP", color: "#f4d431" },
  { index: "02", label: "EDGE", detail: "CLOUD / AUTH / OPERATIONS", color: "#24e0ff" },
  { index: "03", label: "AI", detail: "AGENTS / STREAMS / CREATION", color: "#ff3b30" },
  { index: "04", label: "DATA", detail: "MODELS / PIPELINES / PROOF", color: "#3dff8f" },
  { index: "05", label: "RESEARCH", detail: "Learning in public", color: "#f2efe7" },
] as const;

function SignalStrip({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      data-cstd-signal-strip
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      className="relative z-20 overflow-x-auto border-y border-[#f4d431]/30 bg-[#070a0c] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,#f4d431_0_12px,transparent_12px_24px)] opacity-80" />
      <ol className="mx-auto grid min-w-[900px] max-w-[1540px] grid-cols-5 px-5 md:px-10 lg:px-16">
        {heroSignals.map((signal) => (
          <li
            key={signal.index}
            data-cstd-signal={signal.label.toLowerCase()}
            className="group border-r border-white/10 px-4 py-6 transition-colors hover:bg-white/[0.035] first:border-l"
          >
            <div className="flex items-center gap-3 font-mono">
              <span className="text-[10px] font-bold text-[#666c70]">{signal.index}</span>
              <span aria-hidden="true" className="h-1.5 w-1.5" style={{ backgroundColor: signal.color }} />
              <span className="text-[11px] font-black text-[#f2efe7] transition-transform group-hover:translate-x-1">{signal.label}</span>
            </div>
            <p className="mt-2 font-mono text-[9px] font-bold text-[#68757b]">{signal.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const MemoizedSignalStrip = memo(SignalStrip);
