"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { clsx } from "clsx";

type SpotlightCardProps = {
  children: ReactNode;
  /** 光斑颜色（中心色） */
  spotlightColor?: string;
  /** 光斑直径 */
  size?: number;
  /** 光斑不透明度峰值 */
  opacity?: number;
  disabled?: boolean;
  className?: string;
  spotlightClassName?: string;
};

/**
 * 聚光卡片：琥珀色径向光斑跟随鼠标在卡片表面滑动。
 * Aceternity Spotlight 思路的 framer-motion 实现，LazyMotion 兼容。
 */
export function SpotlightCard({
  children,
  spotlightColor = "rgba(244, 183, 47, 0.16)",
  size = 560,
  opacity = 1,
  disabled = false,
  className = "",
  spotlightClassName = "",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);
  const x = useSpring(rawX, { stiffness: 190, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 190, damping: 28, mass: 0.5 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set(event.clientX - rect.left);
    rawY.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    rawX.set(-999);
    rawY.set(-999);
  }

  return (
    <div
      ref={ref}
      data-cstd-spotlight
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx("group relative overflow-hidden", className)}
    >
      <m.div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute left-0 top-0 z-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          spotlightClassName,
        )}
        style={{
          width: size,
          height: size,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 68%)`,
          opacity: disabled ? 0 : opacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
