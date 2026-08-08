const allowedMetricName = /^(?:LCP|CLS|INP|page_view|client_error|atlas_district|graph_node|case_film_beat|lab_loaded|guide_(?:answer|refusal)|narrative_(?:builder|researcher|collaborator)|visual_(?:full|balanced|calm))$/;

export type CstdMetric = Readonly<{
  name: string;
  value: number;
  page: string;
  path: string;
  rating?: "good" | "needs-improvement" | "poor";
  device: "desktop" | "mobile";
  renderTier: "full" | "lite" | "image" | "archive";
}>;

export function parseCstdMetric(value: unknown): CstdMetric | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.name !== "string" || !allowedMetricName.test(candidate.name)) return null;
  if (typeof candidate.value !== "number" || !Number.isFinite(candidate.value) || candidate.value < 0 || candidate.value > 120_000) return null;
  if (typeof candidate.page !== "string" || candidate.page.length < 1 || candidate.page.length > 80) return null;
  if (typeof candidate.path !== "string" || !candidate.path.startsWith("/") || candidate.path.length > 180) return null;
  if (candidate.rating !== undefined && candidate.rating !== "good" && candidate.rating !== "needs-improvement" && candidate.rating !== "poor") return null;
  if (candidate.device !== "desktop" && candidate.device !== "mobile") return null;
  if (candidate.renderTier !== "full" && candidate.renderTier !== "lite" && candidate.renderTier !== "image" && candidate.renderTier !== "archive") return null;
  return {
    name: candidate.name,
    value: candidate.value,
    page: candidate.page,
    path: candidate.path,
    device: candidate.device,
    renderTier: candidate.renderTier,
    ...(candidate.rating ? { rating: candidate.rating } : {}),
  };
}
