"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type MagnetProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** 鼠标进入磁吸范围的额外扩张距离（px） */
  padding?: number;
  /** 关闭磁吸（calm 模式用） */
  disabled?: boolean;
  /** 磁吸强度：位移 = 距离 / strength，越小越黏 */
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
};

/**
 * 磁吸：鼠标靠近时元素被"吸"向指针，离开后弹性归位。
 * 零依赖（ReactBits Magnet 适配版）。
 */
export function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
  inactiveTransition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: MagnetProps) {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

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
        setPosition({
          x: (event.clientX - centerX) / magnetStrength,
          y: (event.clientY - centerY) / magnetStrength,
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, disabled, magnetStrength]);

  const transitionStyle: CSSProperties = {
    transition: isActive ? activeTransition : inactiveTransition,
  };

  return (
    <div ref={magnetRef} className={`inline-flex ${wrapperClassName}`} {...props}>
      <div
        className={`inline-block ${innerClassName}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, ...transitionStyle }}
      >
        {children}
      </div>
    </div>
  );
}
