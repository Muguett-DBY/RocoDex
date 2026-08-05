"use client";

const NOISE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

type NoiseOverlayProps = {
  /** 不透明度，默认极低做胶片质感 */
  opacity?: number;
  /** 混合模式；normal = 普通透明层（性能最佳） */
  blendMode?: "normal" | "overlay" | "soft-light" | "multiply" | "screen";
  /** 兼容旧接口：静止（实现上本就静态，恒为 true 语义） */
  staticMode?: boolean;
  className?: string;
};

/**
 * 噪点覆盖层：SVG feTurbulence 颗粒，纯静态零动画开销。
 * 胶片/数据质感，pointer-events-none。
 */
export function NoiseOverlay({
  opacity = 0.05,
  blendMode = "normal",
  staticMode = true,
  className = "",
}: NoiseOverlayProps) {
  return (
    <div
      aria-hidden="true"
      data-cstd-noise
      className={`pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundSize: "160px 160px",
        opacity: staticMode ? opacity : opacity,
        mixBlendMode: blendMode === "normal" ? undefined : blendMode,
      }}
    />
  );
}
