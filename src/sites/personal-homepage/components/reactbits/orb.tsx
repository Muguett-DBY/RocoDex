"use client";

import { useMemo } from "react";

type OrbProps = {
  /** calm 模式：静态不呼吸 */
  disabled?: boolean;
  className?: string;
};

/**
 * Orb（ReactBits 风格）：多层模糊光球背景，缓慢漂移呼吸。
 * 纯 CSS 合成器动画；calm 下静态渲染（无动画）。
 */
export function Orb({ disabled = false, className = "" }: OrbProps) {
  const layers = useMemo(
    () => [
      { size: 340, x: 12, y: 18, color: "rgba(252,238,10,0.16)", delay: 0, duration: 11 },
      { size: 240, x: 68, y: 62, color: "rgba(5,217,232,0.12)", delay: 2.4, duration: 9 },
      { size: 190, x: 42, y: 84, color: "rgba(255,42,109,0.08)", delay: 4.8, duration: 13 },
    ],
    [],
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {layers.map((layer, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            width: layer.size,
            height: layer.size,
            left: `${layer.x}%`,
            top: `${layer.y}%`,
            background: `radial-gradient(circle at 35% 35%, ${layer.color}, transparent 68%)`,
            filter: "blur(60px)",
            transform: "translate(-50%, -50%)",
            animation: disabled ? undefined : `cstd-orb-drift ${layer.duration}s ease-in-out ${layer.delay}s infinite alternate`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
