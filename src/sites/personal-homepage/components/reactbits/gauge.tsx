"use client";

import { useEffect, useState } from "react";

type GaugeProps = {
  /** 当前值（0-100） */
  value: number;
  /** 标签 */
  label: string;
  /** 单位后缀 */
  unit?: string;
  /** calm 模式：静态显示最终值 */
  disabled?: boolean;
};

/**
 * Gauge（ReactBits 风格）：SVG 圆弧仪表，anime.js 弹性动画到目标值。
 * calm 下直接显示最终值（无动画）。
 */
export function Gauge({ value, label, unit = "", disabled = false }: GaugeProps) {
  const [display, setDisplay] = useState(disabled ? value : 0);

  // 动态加载 anime.js（与页面共享依赖，不进初始预算）
  useEffect(() => {
    let cancelled = false;
    let anim: { pause?: () => void } | null = null;
    void import("animejs").then(({ animate }) => {
      if (cancelled) return;
      const state = { v: disabled ? value : 0 };
      anim = animate(state, {
        v: value,
        duration: 1300,
        ease: "outExpo",
        onUpdate: () => {
          if (!cancelled) setDisplay(Math.round(state.v));
        },
      });
    });
    return () => {
      cancelled = true;
      anim?.pause?.();
    };
  }, [disabled, value]);

  const clamped = Math.max(0, Math.min(100, display));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center gap-1 font-mono">
      <div className="relative">
        <svg viewBox="0 0 120 120" className="h-24 w-24 md:h-28 md:w-28" aria-hidden="true">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1c1f24" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#cstd-gauge-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 60 60)"
            style={{ transition: disabled ? "none" : "stroke-dashoffset 0.1s linear" }}
          />
          <defs>
            <linearGradient id="cstd-gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#33ff66" />
              <stop offset="100%" stopColor="#5b8dff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[#d7d7d7]">
            {clamped}
            <span className="text-[10px] text-[#8a8f98]">{unit}</span>
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold tracking-[0.18em] text-[#8a8f98]">{label}</span>
    </div>
  );
}
