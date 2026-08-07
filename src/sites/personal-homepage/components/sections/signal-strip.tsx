"use client";

import { memo } from "react";

const heroSignals = [
  { index: "01", label: "PRODUCT", detail: "Interface and product systems", color: "#f4c95d" },
  { index: "02", label: "EDGE", detail: "Cloud delivery and operations", color: "#55c2c8" },
  { index: "03", label: "AI", detail: "Creation and research tools", color: "#ef7868" },
  { index: "04", label: "DATA", detail: "Models, pipelines and evidence", color: "#8bcaa8" },
  { index: "05", label: "RESEARCH", detail: "Learning in public", color: "#f2efe7" },
] as const;

function SignalStrip({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      data-cstd-signal-strip
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      className="relative z-20 overflow-x-auto border-y border-white/10 bg-[#0d0f12] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="mx-auto grid min-w-[900px] max-w-[1540px] grid-cols-5 px-5 md:px-10 lg:px-16">
        {heroSignals.map((signal) => (
          <li
            key={signal.index}
            data-cstd-signal={signal.label.toLowerCase()}
            className="border-r border-white/10 px-4 py-6 first:border-l"
          >
            <div className="flex items-center gap-3 font-mono">
              <span className="text-[10px] font-bold text-[#666c70]">{signal.index}</span>
              <span aria-hidden="true" className="h-1.5 w-1.5" style={{ backgroundColor: signal.color }} />
              <span className="text-[11px] font-black text-[#f2efe7]">{signal.label}</span>
            </div>
            <p className="mt-2 text-xs text-[#7f8589]">{signal.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const MemoizedSignalStrip = memo(SignalStrip);
