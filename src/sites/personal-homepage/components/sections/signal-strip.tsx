"use client";

import { memo } from "react";
import { clsx } from "clsx";
import * as m from "framer-motion/m";

const heroSignals = [
  "PRODUCT ENGINEERING",
  "AI CREATION",
  "DATA SYSTEMS",
  "EDGE DELIVERY",
  "RESEARCH MODELS",
] as const;

function SignalStrip({ reducedMotion }: { reducedMotion: boolean }) {
  const content = [...heroSignals, ...heroSignals];

  return (
    <div
      data-cstd-signal-strip
      className="relative z-20 h-[8svh] min-h-16 overflow-hidden border-y border-[#2a2d33] bg-[#0b0c0e] text-[#33ff66] font-mono"
    >
      {[0, 1].map((track) => (
        <m.div
          key={track}
          data-cstd-signal-track={track}
          className={clsx(
            "flex h-1/2 w-max items-center border-[#2a2d33]",
            track === 0 ? "border-b" : "bg-[#101214] text-[#5b8dff]",
          )}
          animate={reducedMotion ? undefined : { x: track === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: track === 0 ? 24 : 31, ease: "linear", repeat: Infinity }}
        >
          {content.map((signal, index) => (
            <span key={`${track}-${signal}-${index}`} className="flex items-center whitespace-nowrap px-4 text-[10px] font-bold tracking-[0.08em] md:text-xs">
              <span className="rounded-sm border border-current/40 bg-current/[0.07] px-2 py-0.5">[{track === 0 ? "OK" : "LOG"}] {signal}</span>
              <span aria-hidden="true" className="mx-3 text-current/40">▸</span>
            </span>
          ))}
        </m.div>
      ))}
    </div>
  );
}

export const MemoizedSignalStrip = memo(SignalStrip);
