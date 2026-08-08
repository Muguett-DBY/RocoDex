const allowedMetricName = /^(?:LCP|CLS|INP|guide_(?:answer|refusal)|visual_(?:full|balanced|calm))$/;

export type CstdMetric = Readonly<{
  name: string;
  value: number;
  page: string;
  path: string;
  rating?: "good" | "needs-improvement" | "poor";
}>;

export function parseCstdMetric(value: unknown): CstdMetric | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.name !== "string" || !allowedMetricName.test(candidate.name)) return null;
  if (typeof candidate.value !== "number" || !Number.isFinite(candidate.value) || candidate.value < 0 || candidate.value > 120_000) return null;
  if (typeof candidate.page !== "string" || candidate.page.length < 1 || candidate.page.length > 80) return null;
  if (typeof candidate.path !== "string" || !candidate.path.startsWith("/") || candidate.path.length > 180) return null;
  if (candidate.rating !== undefined && candidate.rating !== "good" && candidate.rating !== "needs-improvement" && candidate.rating !== "poor") return null;
  return {
    name: candidate.name,
    value: candidate.value,
    page: candidate.page,
    path: candidate.path,
    ...(candidate.rating ? { rating: candidate.rating } : {}),
  };
}
