"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ComponentType, type PointerEvent, type ReactNode } from "react";
import type { CstdLocale } from "../../content/content-types";
import { setCstdMotionMode, useCstdMotionMode } from "../../experience/motion-store";
import { useCstdDocumentVisibility } from "../../experience/runtime-hooks";
import { useCstdTheme } from "../../experience/theme-store";
import type { AtelierShaderProps } from "./atelier-shader";

export function AtelierMaterial({ locale, children }: { locale: CstdLocale; children: ReactNode }) {
  const isZh = locale === "zh";
  const theme = useCstdTheme();
  const motion = useCstdMotionMode();
  const documentVisible = useCstdDocumentVisibility();
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const [Renderer, setRenderer] = useState<ComponentType<AtelierShaderProps> | null>(null);
  const onReady = useCallback(() => setStatus((current) => current === "unavailable" ? current : "ready"), []);
  const onUnavailable = useCallback(() => setStatus("unavailable"), []);
  const active = enabled && inView && documentVisible && theme === "atelier" && motion === "full" && status !== "unavailable";

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || status !== "loading") return;
    const timeout = window.setTimeout(() => setStatus("unavailable"), 15_000);
    return () => window.clearTimeout(timeout);
  }, [active, status]);

  async function toggleMaterial() {
    if (enabled && motion === "full") {
      setEnabled(false);
      return;
    }
    if (!navigator.gpu) {
      setStatus("unavailable");
      return;
    }
    setCstdMotionMode("full");
    setEnabled(true);
    if (Renderer) return;
    setStatus("loading");
    try {
      // The shader engine is fetched only after the visitor asks for moving light.
      const shaderModule = await import("./atelier-shader");
      setRenderer(() => shaderModule.AtelierShader);
    } catch {
      setStatus("unavailable");
    }
  }

  function followLight(event: PointerEvent<HTMLDivElement>) {
    if (!active || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--atelier-tilt-x", `${-y * 3}deg`);
    event.currentTarget.style.setProperty("--atelier-tilt-y", `${x * 4}deg`);
  }

  const label = status === "unavailable"
    ? (isZh ? "静态光影" : "Still light")
    : status === "loading" && enabled && motion === "full"
      ? (isZh ? "光影准备中" : "Preparing the light")
      : enabled && motion === "full"
        ? (isZh ? "暂停光影" : "Pause the light")
        : (isZh ? "让光影流动" : "Set the light in motion");

  return (
    <figure className="atelier-material" data-atelier-material={active ? status : "static"}>
      <div ref={stageRef} className="atelier-material-stage" onPointerMove={followLight} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--atelier-tilt-x", "0deg"); event.currentTarget.style.setProperty("--atelier-tilt-y", "0deg"); }}>
        <div className="atelier-material-shadow" aria-hidden="true" />
        {children}
        {active && Renderer ? <div className="atelier-material-live" aria-hidden="true"><Renderer onReady={onReady} onUnavailable={onUnavailable} /></div> : null}
      </div>
      <figcaption className="atelier-material-caption">
        <span>{isZh ? "秩序之中，保留想象。" : "A little order. A little imagination."}</span>
        <button
          type="button"
          onClick={() => void toggleMaterial()}
          aria-pressed={enabled && motion === "full" && status !== "unavailable"}
          aria-busy={active && status === "loading"}
          disabled={status === "unavailable"}
          data-atelier-material-toggle
        >
          {enabled && motion === "full" && status !== "unavailable" ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {label}
        </button>
      </figcaption>
    </figure>
  );
}
