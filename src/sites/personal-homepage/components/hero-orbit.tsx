"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { clsx } from "clsx";
import * as m from "framer-motion/m";

export type OrbitItem = {
  label: string;
  /** 基准位置（视口百分比，left/top） */
  left: number;
  top: number;
  /** 鼠标视差深度系数 */
  depth: number;
  /** 漂浮振幅（px） */
  float: number;
  /** 漂浮周期（秒） */
  speed: number;
  /** 相位（秒） */
  phase: number;
};

type HeroOrbitProps = {
  items: OrbitItem[];
  /** calm 模式：全部静止隐藏 */
  disabled?: boolean;
};

/**
 * Hero 浮动胶囊：信号词胶囊环绕舞台。
 * 漂浮 = CSS keyframes（合成器线程）；视差 = 事件驱动 spring（收敛即停）。
 * 零常驻 rAF，calm 模式立即隐藏。
 */
export function HeroOrbit({ items, disabled = false }: HeroOrbitProps) {
  return (
    <div
      aria-hidden="true"
      data-cstd-hero-orbit
      className="pointer-events-none absolute inset-0 z-[5] hidden lg:block"
    >
      {items.map((item) => (
        <OrbitPill key={item.label} item={item} disabled={disabled} />
      ))}
    </div>
  );
}

function OrbitPill({ item, disabled }: { item: OrbitItem; disabled: boolean }) {
  // 视差：事件驱动，spring 收敛后零开销
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 80, damping: 14, mass: 0.8 });
  const y = useSpring(targetY, { stiffness: 80, damping: 14, mass: 0.8 });

  useEffect(() => {
    if (disabled) return;
    const handlePointerMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -((event.clientY / window.innerHeight) * 2 - 1);
      targetX.set(nx * 42 * item.depth);
      targetY.set(ny * 42 * item.depth);
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [disabled, item.depth, targetX, targetY]);

  return (
    <m.span
      className={clsx(
        "absolute rounded-full border border-white/25 bg-white/[0.06] px-4 py-2 text-[10px] font-black tracking-[0.14em] text-white/85 shadow-[0_6px_16px_rgba(0,0,0,0.25)]",
        disabled && "opacity-0",
      )}
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        x,
        y,
      }}
    >
      <span
        className="block"
        style={{
          animationName: disabled ? undefined : "cstd-bob",
          animationDuration: disabled ? undefined : `${item.speed * 2.6}s`,
          animationTimingFunction: disabled ? undefined : "ease-in-out",
          animationIterationCount: disabled ? undefined : "infinite",
          animationDelay: disabled ? undefined : `-${item.phase}s`,
          "--cstd-bob-amp": `${item.float}px`,
        } as React.CSSProperties}
      >
        {item.label}
      </span>
    </m.span>
  );
}
