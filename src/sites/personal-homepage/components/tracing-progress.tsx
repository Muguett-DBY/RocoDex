"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import * as m from "framer-motion/m";

type TracingProgressProps = {
  /** 光束颜色 */
  color?: string;
  /** 头部光点尺寸 */
  dotSize?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * 光束尾迹：容器内随滚动滑动的发光竖线，头部带琥珀光点。
 * Aceternity TracingBeam 简化思路，framer-motion 实现，LazyMotion 兼容。
 */
export function TracingProgress({
  color = "#ff2a6d",
  dotSize = 14,
  disabled = false,
  className = "",
}: TracingProgressProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.72", "end 0.35"],
  });
  const y = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.4 });

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      data-cstd-tracing
      className={`pointer-events-none absolute inset-y-0 left-0 w-px ${className}`}
    >
      <m.div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, ${color}66 12%, ${color}33 88%, transparent)`,
          opacity: disabled ? 0 : 1,
        }}
      />
      <m.div
        className="absolute left-1/2 top-0"
        style={{
          x: "-50%",
          y,
          opacity: disabled ? 0 : 1,
        }}
      >
        <m.div
          className="absolute"
          style={{
            width: dotSize,
            height: dotSize,
            left: -dotSize / 2,
            top: -dotSize / 2,
            borderRadius: "9999px",
            background: color,
            boxShadow: `0 0 ${dotSize * 2.2}px ${color}cc, 0 0 ${dotSize * 5}px ${color}55`,
          }}
        />
        <m.div
          className="absolute"
          style={{
            width: dotSize * 3.4,
            height: dotSize * 3.4,
            left: -dotSize * 1.7,
            top: -dotSize * 1.7,
            borderRadius: "9999px",
            background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
          }}
        />
      </m.div>
    </div>
  );
}
