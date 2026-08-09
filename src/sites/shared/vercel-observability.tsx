"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const LazyAnalytics = lazy(() => import("@vercel/analytics/next").then((module) => ({ default: module.Analytics })));
const LazySpeedInsights = lazy(() => import("@vercel/speed-insights/next").then((module) => ({ default: module.SpeedInsights })));

export function VercelObservability({ enabled }: { enabled: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }
    const timeoutId = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!enabled || !ready) return null;
  return <Suspense fallback={null}><LazyAnalytics /><LazySpeedInsights /></Suspense>;
}
