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
  /** anime.js 缓动，默认 spring 物理（轻微果冻回弹） */
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
  ease = "spring(1, 110, 16)",
  trigger = "immediate",
  threshold = 0.3,
  disabled = false,
  className = "",
  charClassName = "",
}: LetterRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const playedRef = useRef(false);

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
      animationRef.current?.pause();
      animationRef.current = animate(targets, {
        opacity: [0, 1],
        translateY: [sign * fromY, 0],
        rotate: [fromRotate, 0],
        skewY: [fromSkew, 0],
        duration,
        delay: stagger(staggerDelay, { start: delay }),
        ease,
        onComplete: () => {
          // 动画完成：锁死最终态并释放合成层提示（杜绝 spring 残余振荡）
          targets.forEach((target) => {
            target.style.transform = "translateY(0) rotate(0deg) skewY(0deg)";
            target.style.opacity = "1";
            target.style.willChange = "auto";
          });
          animationRef.current = null;
        },
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [from, fromY, fromRotate, fromSkew, duration, staggerDelay, delay, ease]);

  // 锁死最终态：disabled（如切 calm）时立即停止动画并归零，
  // 避免动画跨模式切换继续播放导致画面漂移（e2e 帧对比依赖静止）
  const lockFinal = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    animationRef.current?.pause();
    animationRef.current = null;
    container
      .querySelectorAll<HTMLElement>("[data-letter-reveal-unit]")
      .forEach((target) => {
        target.style.transform = "translateY(0) rotate(0deg) skewY(0deg)";
        target.style.opacity = "1";
        target.style.willChange = "auto";
      });
  }, []);

  useLayoutEffect(() => {
    if (disabled) {
      lockFinal();
      return undefined;
    }
    if (trigger !== "immediate" || playedRef.current) return undefined;
    playedRef.current = true;
    return play();
  }, [disabled, trigger, play, lockFinal]);

  useEffect(() => {
    if (disabled || trigger !== "view") return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || playedRef.current) return;
          observer.disconnect();
          playedRef.current = true;
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
