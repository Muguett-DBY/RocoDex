"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

type ConfettiBurstProps = {
  /** calm 模式：不撒彩纸 */
  disabled?: boolean;
};

/**
 * ConfettiBurst（ReactBits 风格彩蛋）：canvas-confetti 双色爆发。
 * 事件驱动（用户主动触发），calm 下空操作。
 */
export function ConfettiBurst({ disabled = false }: ConfettiBurstProps) {
  const fire = useCallback(() => {
    if (disabled) return;
    const defaults = { spread: 70, ticks: 90, zIndex: 200, colors: ["#33ff66", "#5b8dff", "#febc2e", "#d7d7d7"] };
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.3, y: 0.6 } });
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.6 } });
  }, [disabled]);

  return (
    <button
      type="button"
      onClick={fire}
      aria-label="撒彩纸庆祝"
      className="flex h-10 items-center gap-2 rounded-md border border-[#33ff66]/40 bg-[#33ff66]/[0.06] px-4 font-mono text-xs font-bold text-[#33ff66] transition-colors hover:bg-[#33ff66] hover:text-[#0b0c0e] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33ff66]"
    >
      <span aria-hidden="true">🎉</span> celebrate
    </button>
  );
}
