"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, type JSAnimation } from "animejs";

type CountUpProps = {
  value: number;
  /** 滚动时长（ms） */
  duration?: number;
  /** 缓动 */
  ease?: string;
  /** 千分位分隔 */
  format?: boolean;
  prefix?: string;
  suffix?: string;
  /** 进入视口触发阈值 */
  threshold?: number;
  disabled?: boolean;
  className?: string;
};

function renderValue(current: number, format: boolean, prefix: string, suffix: string) {
  const digits = format ? current.toLocaleString("en-US") : String(current);
  return `${prefix}${digits}${suffix}`;
}

/**
 * 数字滚动：进入视口时从 0 滚动到目标值。
 * anime.js 实现，IntersectionObserver 触发一次。
 */
export function CountUp({
  value,
  duration = 1400,
  ease = "outExpo",
  format = false,
  prefix = "",
  suffix = "",
  threshold = 0.4,
  disabled = false,
  className = "",
}: CountUpProps) {
  const [display, setDisplay] = useState(() =>
    disabled ? renderValue(value, format, prefix, suffix) : "0",
  );
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  const updateDisplay = useCallback(
    (current: number) => {
      setDisplay(renderValue(current, format, prefix, suffix));
    },
    [format, prefix, suffix],
  );

  useEffect(() => {
    if (disabled || startedRef.current) return;

    const element = ref.current;
    if (!element) return;

    let animation: JSAnimation | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return;
          startedRef.current = true;
          observer.disconnect();

          animation = animate(
            { v: 0 },
            {
              v: value,
              duration,
              ease,
              onUpdate: (self) => {
                const current = Math.round((self.targets[0] as { v: number }).v);
                updateDisplay(current);
              },
            },
          );
        });
      },
      { threshold },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.pause();
    };
  }, [value, duration, ease, threshold, disabled, updateDisplay]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
