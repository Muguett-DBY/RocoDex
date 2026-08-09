"use client";

import { X } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

type BootState = "checking" | "running" | "complete";

const bootSessionKey = "cstd:identity-boot-seen";

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
  const [bootState, setBootState] = useState<BootState>("checking");

  useEffect(() => {
    let timer = 0;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(bootSessionKey) === "true";
    } catch {
      // The short intro remains optional when session storage is unavailable.
    }
    const frame = window.requestAnimationFrame(() => {
      if (reducedMotion || window.location.hash.length > 1 || seen) {
        setBootState("complete");
        return;
      }

      setBootState("running");
      try {
        window.sessionStorage.setItem(bootSessionKey, "true");
      } catch {
        // Do not block entry when storage is unavailable.
      }
      timer = window.setTimeout(() => setBootState("complete"), 720);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [reducedMotion]);

  return (
    <>
      <div
        data-cstd-boot-sequence
        data-cstd-boot-state={bootState}
        aria-hidden={bootState !== "running"}
        className="cstd-boot-sequence pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[#050709]"
      >
        <div className="font-mono text-center">
          <p className="text-[10px] font-black text-[#24e0ff]">CUSTARD / IDENTITY CORE</p>
          <p className="mt-2 text-3xl font-black text-[#f4d431]">CSTD://17</p>
          <div aria-hidden="true" className="mx-auto mt-5 h-px w-36 overflow-hidden bg-white/15"><span className="cstd-boot-pulse block h-full bg-[#24e0ff]" /></div>
        </div>
        <button
          type="button"
          tabIndex={bootState === "running" ? 0 : -1}
          onClick={() => setBootState("complete")}
          className="pointer-events-auto absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-white/20 text-white/75 hover:border-[#f4d431] hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]"
          aria-label="跳过启动画面"
          title="跳过启动画面"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <div aria-hidden="true" data-cstd-global-hud className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
        <div data-cstd-speed-lines className="cstd-speed-lines absolute inset-0 opacity-0" />
        <div className="cstd-hud-scan absolute inset-x-0 top-0 h-px bg-[#24e0ff]/70 shadow-[0_0_18px_rgba(36,224,255,0.75)]" />
        <div className="absolute left-4 top-24 hidden h-28 w-px bg-[#f4d431]/60 lg:block" />
        <div className="absolute left-3 top-56 hidden -rotate-90 origin-left font-mono text-[9px] font-bold tracking-[0] text-[#f4d431]/70 lg:block">CUSTARD // CSTD CORE</div>
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
