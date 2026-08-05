"use client";

import { useCallback, useRef, useState } from "react";
import { clsx } from "clsx";

type FocusTitleProps = {
  text: string;
  /** 非聚焦区域的模糊半径（px） */
  blurRadius?: number;
  /** calm 模式：全聚焦静态 */
  disabled?: boolean;
  className?: string;
};

/**
 * TrueFocus（ReactBits 风格）：标题文字随鼠标聚焦——光标附近清晰，远处模糊。
 * 桌面 hover 特效；calm 下全聚焦。
 */
export function FocusTitle({ text, blurRadius = 6, disabled = false, className = "" }: FocusTitleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [focus, setFocus] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setFocus({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => setFocus(null), []);

  const mask = focus
    ? `radial-gradient(circle 120px at ${focus.x}px ${focus.y}px, black 30%, transparent 100%)`
    : undefined;

  return (
    <span
      ref={containerRef}
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
      className={clsx("relative inline-block", className)}
    >
      {/* 模糊层（背景；仅 hover 时开 blur，避免常驻 paint 成本） */}
      <span
        aria-hidden="true"
        className="inline-block"
        style={{ filter: disabled || !focus ? "none" : `blur(${blurRadius}px)` }}
      >
        {text}
      </span>
      {/* 清晰层（mask 跟随光标） */}
      {!disabled ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-block"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
