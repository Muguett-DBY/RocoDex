"use client";

import { Pause, Play, Volume2, VolumeX, Zap } from "lucide-react";
import { clsx } from "clsx";

export function HomepageControls({
  overdrive,
  ambienceOn,
  reducedMotion,
  onToggleOverdrive,
  onToggleAmbience,
  onToggleMotion,
}: {
  overdrive: boolean;
  ambienceOn: boolean;
  reducedMotion: boolean;
  onToggleOverdrive: () => void;
  onToggleAmbience: () => void;
  onToggleMotion: () => void;
}) {
  return (
    <>
      <button
        type="button"
        data-cstd-overdrive-toggle
        aria-pressed={overdrive}
        aria-label={overdrive ? "关闭超载模式" : "启动超载模式"}
        title={overdrive ? "关闭 OVERDRIVE" : "启动 OVERDRIVE"}
        onClick={onToggleOverdrive}
        className={clsx(
          "flex h-9 w-9 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]",
          overdrive
            ? "border-[#ff3b30] bg-[#ff3b30] text-[#050709] shadow-[0_0_22px_rgba(255,59,48,0.45)]"
            : "border-[#ff3b30]/40 text-[#ff5a50] hover:bg-[#ff3b30] hover:text-[#050709]",
        )}
      >
        <Zap aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        type="button"
        data-cstd-ambience-toggle
        aria-pressed={ambienceOn}
        aria-label={ambienceOn ? "关闭环境声场" : "开启环境声场"}
        title={ambienceOn ? "关闭环境声场" : "开启环境声场"}
        onClick={onToggleAmbience}
        className={clsx(
          "hidden h-9 w-9 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff] sm:flex",
          ambienceOn
            ? "border-[#24e0ff] bg-[#24e0ff] text-[#050709]"
            : "border-white/15 text-[#a5aaad] hover:border-[#24e0ff]/70 hover:text-[#24e0ff]",
        )}
      >
        {ambienceOn ? <Volume2 aria-hidden="true" className="h-4 w-4" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
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
