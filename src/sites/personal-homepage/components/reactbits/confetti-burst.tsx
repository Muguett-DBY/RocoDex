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
    const defaults = { spread: 70, ticks: 90, zIndex: 200, colors: ["#fcee0a", "#05d9e8", "#ff2a6d", "#e9e6f5"] };
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.3, y: 0.6 } });
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.6 } });
  }, [disabled]);

  return (
    <button
      type="button"
      onClick={fire}
      aria-label="撒彩纸庆祝"
      className="flex h-10 items-center gap-2 rounded-md border border-[#fcee0a]/40 bg-[#fcee0a]/[0.06] px-4 font-mono text-xs font-bold text-[#fcee0a] transition-colors hover:bg-[#fcee0a] hover:text-[#0d0a16] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcee0a]"
    >
      <span aria-hidden="true">🎉</span> celebrate
    </button>
  );
}
