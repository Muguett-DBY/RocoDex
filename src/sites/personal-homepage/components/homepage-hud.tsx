"use client";

import type { RefObject } from "react";

export function HomepageHud({
  reducedMotion,
  coordinateRef,
  depthRef,
  chapterRef,
  pulseRef,
}: {
  reducedMotion: boolean;
  coordinateRef: RefObject<HTMLSpanElement | null>;
  depthRef: RefObject<HTMLSpanElement | null>;
  chapterRef: RefObject<HTMLParagraphElement | null>;
  pulseRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <>
      <div aria-hidden="true" className="cstd-boot-sequence pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[#050709]">
        <div className="font-mono text-center"><p className="text-[10px] font-black text-[#24e0ff]">CSTD NEURAL LINK</p><p className="mt-2 text-3xl font-black text-[#f4d431]">BOOT://01</p></div>
      </div>
      <div aria-hidden="true" data-cstd-global-hud className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
        <div data-cstd-speed-lines className="cstd-speed-lines absolute inset-0 opacity-0" />
        <div className="cstd-hud-scan absolute inset-x-0 top-0 h-px bg-[#24e0ff]/70 shadow-[0_0_18px_rgba(36,224,255,0.75)]" />
        <div className="absolute left-4 top-24 hidden h-28 w-px bg-[#f4d431]/60 lg:block" />
        <div className="absolute left-3 top-56 hidden -rotate-90 origin-left font-mono text-[9px] font-bold tracking-[0] text-[#f4d431]/70 lg:block">CSTD // NEURAL BUS</div>
        <div className="absolute bottom-7 right-6 hidden items-center gap-3 border-r-2 border-[#24e0ff] pr-3 font-mono text-[9px] font-bold text-[#8f9ba0] lg:flex">PTR <span ref={coordinateRef} className="text-[#24e0ff]">500:420</span></div>
        <div data-cstd-crosshair className={`cstd-crosshair fixed hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 ${reducedMotion ? "lg:!hidden" : "lg:block"}`} style={{ left: "var(--cstd-pointer-x, 50%)", top: "var(--cstd-pointer-y, 42%)" }} />
        <span ref={pulseRef} className="cstd-click-pulse fixed h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-0" />
        <div data-cstd-neural-dive className="absolute bottom-7 left-6 hidden items-end gap-4 font-mono lg:flex">
          <div><p className="text-[8px] font-black text-[#68757b]">NEURAL DIVE / DEPTH</p><p className="mt-1 text-lg font-black text-[#f4d431]"><span ref={depthRef}>0000M</span></p></div>
          <span aria-hidden="true" className="mb-1 h-8 w-px bg-[#24e0ff]/45" />
          <p ref={chapterRef} className="mb-1 text-[9px] font-black text-[#24e0ff]">STUDIO</p>
        </div>
      </div>
    </>
  );
}
