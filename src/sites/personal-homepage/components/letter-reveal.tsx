"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { animate, stagger } from "animejs";

type LetterRevealProps = {
  children: ReactNode;
  /** 每个字符间隔（ms） */
  staggerDelay?: number;
  /** 单字符动画时长（ms） */
  duration?: number;
  /** 入场延迟（ms） */
  delay?: number;
  /** 初始位移 Y（%） */
  fromY?: number;
  /** 初始旋转（deg） */
  fromRotate?: number;
  /** 初始倾斜（deg） */
  fromSkew?: number;
  /** 方向：自下而上（默认）或自上而下 */
  from?: "bottom" | "top";
  /** immediate = 挂载即播；view = 进入视口触发 */
  trigger?: "immediate" | "view";
  threshold?: number;
  ease?: string;
  disabled?: boolean;
  className?: string;
  /** 包裹每个字符的额外 class */
  charClassName?: string;
};

/**
 * 逐字 reveal：文本拆成字符，从遮罩中依次弹出（anime.js stagger）。
 * 用于巨型标题/章节标题，自下而上带轻微旋转，出场极有冲击力。
 */
export function LetterReveal({
  children,
  staggerDelay = 38,
  duration = 900,
  delay = 0,
  fromY = 118,
  fromRotate = 4,
  fromSkew = 7,
  from = "bottom",
  ease = "outExpo",
  trigger = "immediate",
  threshold = 0.3,
  disabled = false,
  className = "",
  charClassName = "",
}: LetterRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const play = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-letter-reveal-unit]"),
    );
    if (targets.length === 0) return;

    const sign = from === "bottom" ? 1 : -1;

    // 先写死隐藏态，避免首帧闪动
    targets.forEach((target) => {
      target.style.opacity = "0";
      target.style.transform = `translateY(${sign * fromY}%) rotate(${fromRotate}deg) skewY(${fromSkew}deg)`;
      target.style.willChange = "transform, opacity";
    });

    const frame = window.requestAnimationFrame(() => {
      animate(targets, {
        opacity: [0, 1],
        translateY: [sign * fromY, 0],
        rotate: [fromRotate, 0],
        skewY: [fromSkew, 0],
        duration,
        delay: stagger(staggerDelay, { start: delay }),
        ease,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [from, fromY, fromRotate, fromSkew, duration, staggerDelay, delay, ease]);

  useLayoutEffect(() => {
    if (disabled || trigger !== "immediate") return undefined;
    return play();
  }, [disabled, trigger, play]);

  useEffect(() => {
    if (disabled || trigger !== "view") return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          play();
        });
      },
      { threshold },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [disabled, trigger, threshold, play]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${className}`}
      aria-label={typeof children === "string" ? children : undefined}
    >
      {splitChars(children).map((unit, index) => (
        <span
          key={`${unit}-${index}`}
          aria-hidden="true"
          data-letter-reveal-unit
          className={`inline-block whitespace-pre ${charClassName}`}
          style={{ transformOrigin: "50% 100%" } as CSSProperties}
        >
          {unit}
        </span>
      ))}
    </span>
  );
}

function splitChars(children: ReactNode): string[] {
  const text = typeof children === "string" ? children : String(children ?? "");
  return Array.from(text);
}
