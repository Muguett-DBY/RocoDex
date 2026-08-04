"use client";

import { clsx } from "clsx";
import * as m from "framer-motion/m";

type CreamDividerProps = {
  /** 填充色：下一章节的背景色，弧线从当前章节"卷"入下一章节 */
  fill: string;
  /** 弧高（px） */
  height?: number;
  /** 弧线方向 */
  flip?: boolean;
  /** 漂浮振幅（px），0 = 静止 */
  float?: number;
  /** calm 模式：静止 */
  disabled?: boolean;
  className?: string;
};

/**
 * 奶油弧形分隔：章节之间的柔和弧线过渡。
 * CSS keyframes 漂浮（合成器线程），零主线程开销。
 */
export function CreamDivider({
  fill,
  height = 96,
  flip = false,
  float = 0,
  disabled = false,
  className = "",
}: CreamDividerProps) {
  const animate = !disabled && float > 0;

  return (
    <m.div
      aria-hidden="true"
      data-cstd-cream-divider
      className={clsx("pointer-events-none relative z-10 block w-full overflow-hidden", className)}
      style={{
        height,
        animation: animate ? "cstd-float-y 2.8s ease-in-out infinite alternate" : undefined,
        "--cstd-float-amp": `${float}px`,
      } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-full w-full"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        {/* 大圆弧：从底部边缘卷起，奶油包圆润感 */}
        <path
          d="M0,120 C 240,120 320,0 720,0 C 1120,0 1200,120 1440,120 Z"
          fill={fill}
        />
      </svg>
    </m.div>
  );
}
