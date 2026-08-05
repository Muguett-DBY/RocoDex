"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";

type TiltFrameProps = {
  children: ReactNode;
  /** 最大倾斜角度（deg） */
  rotateAmplitude?: number;
  /** hover 缩放 */
  scaleOnHover?: number;
  /** 3D 透视距离 */
  perspective?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * 3D 倾斜帧：鼠标驱动 rotateX/rotateY，弹性回正。
 * ReactBits TiltedCard 改造版——包裹任意 children（可配 next/image），LazyMotion 兼容。
 */
export function TiltFrame({
  children,
  rotateAmplitude = 7,
  scaleOnHover = 1.02,
  perspective = 900,
  disabled = false,
  className = "",
}: TiltFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.6 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.6 });
  const scale = useSpring(1, { stiffness: 180, damping: 24, mass: 0.5 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    rotateX.set((-offsetY / (rect.height / 2)) * rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  return (
    <div ref={ref} style={{ perspective }} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <m.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        whileTap={disabled ? undefined : { scale: 0.975 }}
        className="h-full w-full"
      >
        {children}
      </m.div>
    </div>
  );
}
