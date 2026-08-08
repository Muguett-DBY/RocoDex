"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
};

export type CstdVisualMode = "full" | "balanced" | "calm";

const pointCount: Record<CstdVisualMode, number> = {
  full: 62,
  balanced: 34,
  calm: 0,
};

export function SignalField({ mode }: { mode: CstdVisualMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let frame = 0;
    let width = 1;
    let height = 1;
    let pointerX = 0.68;
    let pointerY = 0.35;
    let points: Point[] = [];

    const createPoints = () => {
      points = Array.from({ length: pointCount[mode] }, (_, index) => ({
        x: ((index * 47) % 101) / 100,
        y: ((index * 71) % 97) / 96,
        vx: (((index * 13) % 9) - 4) * 0.000035,
        vy: (((index * 17) % 9) - 4) * 0.000028,
        phase: index * 0.73,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / Math.max(width, 1);
      pointerY = event.clientY / Math.max(height, 1);
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (document.visibilityState !== "hidden") {
        const maxDistance = mode === "full" ? 150 : 112;

        for (const point of points) {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x < -0.04) point.x = 1.04;
          if (point.x > 1.04) point.x = -0.04;
          if (point.y < -0.04) point.y = 1.04;
          if (point.y > 1.04) point.y = -0.04;
        }

        for (let index = 0; index < points.length; index += 1) {
          const point = points[index];
          const x = point.x * width + (pointerX - 0.5) * Math.sin(point.phase) * 10;
          const y = point.y * height + (pointerY - 0.5) * Math.cos(point.phase) * 8;
          const pulse = 0.55 + Math.sin(time * 0.0012 + point.phase) * 0.25;

          context.beginPath();
          context.fillStyle = index % 7 === 0 ? `rgba(244,212,49,${pulse})` : `rgba(36,224,255,${pulse * 0.65})`;
          context.arc(x, y, index % 11 === 0 ? 2.1 : 1.2, 0, Math.PI * 2);
          context.fill();

          for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
            const next = points[nextIndex];
            const nextX = next.x * width;
            const nextY = next.y * height;
            const distance = Math.hypot(nextX - x, nextY - y);
            if (distance > maxDistance) continue;
            context.beginPath();
            context.strokeStyle = `rgba(36,224,255,${(1 - distance / maxDistance) * 0.075})`;
            context.lineWidth = 0.7;
            context.moveTo(x, y);
            context.lineTo(nextX, nextY);
            context.stroke();
          }
        }
      }
      frame = document.visibilityState === "hidden" ? 0 : window.requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      } else if (mode !== "calm" && !frame) {
        frame = window.requestAnimationFrame(render);
      }
    };

    createPoints();
    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (mode !== "calm") frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mode]);

  return <canvas ref={canvasRef} data-cstd-signal-field aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-80" />;
}
