"use client";

import { useEffect } from "react";

type MetricPayload = {
  name: string;
  value: number;
  page: string;
  rating?: "good" | "needs-improvement" | "poor";
};

type RenderTier = "full" | "lite" | "image" | "archive";

function getRenderTier(): RenderTier {
  const root = document.querySelector<HTMLElement>("[data-cstd-immersive-runtime]");
  const tier = root?.dataset.cstdImmersiveRuntime;
  if (tier === "full" || tier === "lite" || tier === "image") return tier;
  return "archive";
}

type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput: boolean;
};

function ratingFor(name: string, value: number): MetricPayload["rating"] {
  if (name === "LCP") return value <= 1800 ? "good" : value <= 2500 ? "needs-improvement" : "poor";
  if (name === "INP") return value <= 150 ? "good" : value <= 200 ? "needs-improvement" : "poor";
  if (name === "CLS") return value <= 0.03 ? "good" : value <= 0.1 ? "needs-improvement" : "poor";
  return undefined;
}

function sendMetric(payload: MetricPayload) {
  if (process.env.NODE_ENV !== "production") return;
  if (window.location.hostname !== "custard.top" && window.location.hostname !== "www.custard.top") return;
  const body = JSON.stringify({
    ...payload,
    value: Math.round(payload.value * 1000) / 1000,
    path: window.location.pathname.slice(0, 180),
    device: window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
    renderTier: getRenderTier(),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/cstd-vitals", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/cstd-vitals", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
}

export function CstdTelemetry({ page }: { page: string }) {
  useEffect(() => {
    const observers: PerformanceObserver[] = [];
    let cls = 0;
    let lcp = 0;
    let inp = 0;

    const pageViewTimer = window.setTimeout(() => sendMetric({ name: "page_view", value: 1, page }), 1500);

    const observe = (type: string, callback: PerformanceObserverCallback) => {
      try {
        const observer = new PerformanceObserver(callback);
        observer.observe({ type, buffered: true });
        observers.push(observer);
      } catch {
        // Older browsers simply omit the unsupported signal.
      }
    };

    observe("largest-contentful-paint", (list) => {
      lcp = list.getEntries().at(-1)?.startTime ?? lcp;
    });
    observe("layout-shift", (list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
    });
    observe("event", (list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > inp) inp = entry.duration;
      }
    });

    const onPageHide = () => {
      if (lcp > 0) sendMetric({ name: "LCP", value: lcp, page, rating: ratingFor("LCP", lcp) });
      sendMetric({ name: "CLS", value: cls, page, rating: ratingFor("CLS", cls) });
      if (inp > 0) sendMetric({ name: "INP", value: inp, page, rating: ratingFor("INP", inp) });
    };
    const onCustomMetric = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: unknown; value?: unknown }>).detail;
      if (typeof detail?.name !== "string" || typeof detail.value !== "number") return;
      sendMetric({ name: detail.name.slice(0, 40), value: detail.value, page });
    };
    const onClientError = () => sendMetric({ name: "client_error", value: 1, page });

    window.addEventListener("pagehide", onPageHide, { once: true });
    window.addEventListener("cstd:metric", onCustomMetric);
    window.addEventListener("error", onClientError);
    window.addEventListener("unhandledrejection", onClientError);
    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.clearTimeout(pageViewTimer);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("cstd:metric", onCustomMetric);
      window.removeEventListener("error", onClientError);
      window.removeEventListener("unhandledrejection", onClientError);
    };
  }, [page]);

  return null;
}
