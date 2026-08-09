"use client";

import { Pause, Play, Zap } from "lucide-react";
import { clsx } from "clsx";

export function HomepageControls({
  overdrive,
  reducedMotion,
  onToggleOverdrive,
  onToggleMotion,
}: {
  overdrive: boolean;
  reducedMotion: boolean;
  onToggleOverdrive: () => void;
  onToggleMotion: () => void;
}) {
  return (
    <>
      <button
        type="button"
        data-cstd-overdrive-toggle
        aria-pressed={overdrive}
        aria-label={overdrive ? "切换到平衡视觉" : "开启增强视觉"}
        title={overdrive ? "切换到平衡视觉" : "开启增强视觉"}
        onClick={onToggleOverdrive}
        className={clsx(
          "flex h-9 w-9 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]",
          overdrive
            ? "border-[#24e0ff] bg-[#24e0ff] text-[#050709] shadow-[0_0_22px_rgba(36,224,255,0.28)]"
            : "border-white/18 text-[#aab3b6] hover:border-[#24e0ff] hover:text-[#24e0ff]",
        )}
      >
        <Zap aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        type="button"
        data-cstd-motion-toggle
        aria-pressed={!reducedMotion}
        aria-label={reducedMotion ? "开启增强动效" : "切换到平静模式"}
        title={reducedMotion ? "开启增强动效" : "切换到平静模式"}
        onClick={onToggleMotion}
        className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#a5aaad] transition-colors hover:border-[#f4d431]/60 hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
      >
        {reducedMotion ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
      </button>
    </>
  );
}
