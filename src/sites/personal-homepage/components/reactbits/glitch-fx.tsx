"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

type GlitchFxProps = {
  children: React.ReactNode;
  /** 故障触发间隔（ms）内的随机延迟上界 */
  interval?: number;
  /** calm 模式：静态文本，无故障 */
  disabled?: boolean;
  className?: string;
  as?: "span" | "h2" | "h3" | "p";
};

/**
 * GlitchFx（ReactBits 风格）：RGB 分裂 + 位移/裁切闪烁。
 * 事件驱动 interval，calm 下静态渲染。
 */
export function GlitchFx({
  children,
  interval = 1800,
  disabled = false,
  className = "",
  as: Tag = "span",
}: GlitchFxProps) {
  const [active, setActive] = useState(false);
  const [jitter, setJitter] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (disabled) return;
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        if (!disabled) {
          setJitter({
            a: Math.random(),
            b: Math.random(),
            c: Math.random(),
            d: Math.random(),
          });
          setActive(true);
          setTimeout(() => {
            setActive(false);
            schedule();
          }, 260);
        }
      }, 120 + Math.random() * interval);
    };
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [disabled, interval]);

  const clipGreen = `inset(${jitter.a * 60}% 0 ${jitter.b * 60}% 0)`;
  const clipBlue = `inset(${jitter.c * 60}% 0 ${jitter.d * 60}% 0)`;

  return (
    <Tag className={clsx("relative inline-block", className)}>
      {/* 主层 */}
      <span className="relative z-10 inline-block">{children}</span>
      {/* RGB 分裂层 */}
      {active ? (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 inline-block text-[#33ff66]"
            style={{
              clipPath: clipGreen,
              transform: `translate(${-2 - jitter.a * 3}px, ${-1 - jitter.b * 2}px)`,
            }}
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 inline-block text-[#5b8dff]"
            style={{
              clipPath: clipBlue,
              transform: `translate(${2 + jitter.c * 3}px, ${1 + jitter.d * 2}px)`,
            }}
          >
            {children}
          </span>
        </>
      ) : null}
    </Tag>
  );
}
