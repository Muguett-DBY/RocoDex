"use client";

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";

type MagnetProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** 鼠标进入磁吸范围的额外扩张距离（px） */
  padding?: number;
  /** 关闭磁吸（calm 模式用） */
  disabled?: boolean;
  /** 磁吸强度：位移 = 距离 / strength，越小越黏 */
  magnetStrength?: number;
  wrapperClassName?: string;
  innerClassName?: string;
};

/**
 * 磁吸：鼠标靠近时元素被弹簧物理"吸"向指针，离开后弹性归位。
 * framer-motion useSpring 实现——无 CSS transition 硬切，全程丝滑。
 */
export function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: MagnetProps) {
  const [isActive, setIsActive] = useState(false);
  const magnetRef = useRef<HTMLDivElement>(null);

  // 目标值：指针位置或 0；弹簧物理跟踪目标
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 220, damping: 18, mass: 0.55 });
  const y = useSpring(targetY, { stiffness: 220, damping: 18, mass: 0.55 });

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      const element = magnetRef.current;
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - event.clientX);
      const distY = Math.abs(centerY - event.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        targetX.set((event.clientX - centerX) / magnetStrength);
        targetY.set((event.clientY - centerY) / magnetStrength);
      } else {
        setIsActive(false);
        targetX.set(0);
        targetY.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, disabled, magnetStrength, targetX, targetY]);

  return (
    <div ref={magnetRef} className={`inline-flex ${wrapperClassName}`} {...props}>
      <m.div
        className={`inline-block ${innerClassName}`}
        style={{
          x,
          y,
          scale: isActive && !disabled ? 1.03 : 1,
          transition: "scale 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
