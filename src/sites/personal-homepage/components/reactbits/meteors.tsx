"use client";

import { useId } from "react";

// 用 useId 做确定性种子：SSR 与客户端生成完全一致的位置（hydration 安全），
// 同一页面内各流星仍各有"随机感"。
function seededMeteors(seed: string, count: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const rand = () => {
    hash = (hash * 1103515245 + 12345) >>> 0;
    return hash / 4294967296;
  };
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${rand() * 100}%`,
    delay: `${rand() * 6}s`,
    duration: `${3.5 + rand() * 4}s`,
    size: 1 + rand() * 1.6,
  }));
}

type MeteorsProps = {
  /** 流星数量 */
  count?: number;
  /** calm 模式：不渲染流星 */
  disabled?: boolean;
  className?: string;
};

/**
 * Meteors（ReactBits 风格）：深色背景上从顶部随机位置斜向飞落的流星。
 * 纯 CSS 动画（transform + opacity，合成器线程）；calm 下整体不渲染。
 */
export function Meteors({ count = 10, disabled = false, className = "" }: MeteorsProps) {
  const seed = useId();
  const meteors = seededMeteors(seed, Math.max(1, Math.min(count, 16)));

  if (disabled) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-[-10%] h-px w-[140px] rotate-[215deg]"
          style={{
            left: meteor.left,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(252,238,10,0.85) 55%, rgba(5,217,232,0.9) 100%)",
            boxShadow: "0 0 8px rgba(252,238,10,0.45)",
            transform: `translateY(0) rotate(215deg) scaleY(${meteor.size})`,
            animation: `cstd-meteor ${meteor.duration} linear ${meteor.delay} infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
