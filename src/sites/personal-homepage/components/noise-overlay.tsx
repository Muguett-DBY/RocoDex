"use client";

import { useEffect, useRef } from "react";
import * as m from "framer-motion/m";
import { useAnimationFrame, useMotionValue } from "framer-motion";

const NOISE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

type NoiseOverlayProps = {
  /** 不透明度，默认极低做胶片质感 */
  opacity?: number;
  /** 混合模式 */
  blendMode?: "overlay" | "soft-light" | "multiply" | "screen";
  /** 动画位移幅度（px），0 则静止 */
  drift?: number;
  /** calm 模式：静止 */
  staticMode?: boolean;
  className?: string;
};

/**
 * 噪点覆盖层：SVG feTurbulence 颗粒 + 缓慢漂移，胶片/数据质感。
 * 全站固定层使用，pointer-events-none。
 */
export function NoiseOverlay({
  opacity = 0.05,
  blendMode = "overlay",
  drift = 6,
  staticMode = false,
  className = "",
}: NoiseOverlayProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const elapsedRef = useRef(0);

  useAnimationFrame((time, delta) => {
    if (staticMode) return;
    elapsedRef.current += delta;
    const t = elapsedRef.current / 1000;
    x.set(Math.sin(t * 0.35) * drift);
    y.set(Math.cos(t * 0.28) * drift);
  });

  // 清理：staticMode 下立即静止（无 spring 惯性，避免覆盖层位移被截图捕获）
  useEffect(() => {
    elapsedRef.current = 0;
    x.set(0);
    y.set(0);
  }, [staticMode, x, y]);

  return (
    <m.div
      aria-hidden="true"
      data-cstd-noise
      className={`pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundSize: "160px 160px",
        opacity,
        mixBlendMode: blendMode,
        x,
        y,
      }}
    />
  );
}
