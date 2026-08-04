"use client";

import { useState } from "react";
import { clsx } from "clsx";

type ShinyTextProps = {
  text: string;
  disabled?: boolean;
  /** 一轮扫过耗时（秒） */
  speed?: number;
  className?: string;
  /** 基底文字色 */
  color?: string;
  /** 光泽色 */
  shineColor?: string;
  /** 光泽带宽度（相对文字宽度百分比） */
  shineWidth?: number;
  /** 往返扫（true）还是单向循环（false） */
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  /** 首轮延迟（秒） */
  delay?: number;
};

/**
 * 金属光泽扫过文字：纯 CSS keyframes（transform 合成器线程），
 * 零主线程开销；calm 模式直接关闭动画。
 */
export function ShinyText({
  text,
  disabled = false,
  speed = 2.4,
  className = "",
  color = "inherit",
  shineColor = "#ffd97a",
  shineWidth = 34,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}: ShinyTextProps) {
  const [isPaused, setIsPaused] = useState(false);

  const animationActive = !disabled && !isPaused;

  return (
    <span
      data-cstd-shiny
      className={clsx("relative inline-block overflow-hidden", className)}
      style={{ color }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <span className="relative z-10">{text}</span>
      {/* 光泽层：CSS transform 扫过（合成器线程），background-clip: text 只显示在文字内 */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 z-20 w-full"
        style={{
          backgroundImage: `linear-gradient(105deg, transparent 0%, transparent ${100 - shineWidth}%, ${shineColor} 50%, transparent ${100 - shineWidth / 2}%, transparent 100%)`,
          backgroundSize: `${100 + shineWidth}% 100%`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0% 0%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: animationActive
            ? `cstd-shine-sweep ${speed}s ease-in-out ${delay}s infinite ${yoyo ? "alternate" : ""} ${direction === "right" ? "reverse" : ""}`
            : undefined,
          willChange: animationActive ? "transform" : undefined,
        }}
      >
        {text}
      </span>
    </span>
  );
}
