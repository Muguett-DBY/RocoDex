const allowedMetricName = /^(?:LCP|CLS|INP|page_view|client_error|atlas_district|graph_node|case_film_beat|case_act_share|case_failure_drill|case_replay|knowledge_path|lab_loaded|lab_conflict|route_transition|guide_(?:answer|refusal)|narrative_(?:builder|researcher|collaborator)|visual_(?:full|balanced|calm)|reading_(?:studio|quiet)|theme_(?:neon-district|underworld-forge|astral-covenant)|signature_(?:breach|boon|roll))$/;

type QuotaWindow = { startedAt: number; count: number };
const quotaByIdentity = new Map<string, QuotaWindow>();

function hashCstdTelemetryIdentity(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function consumeCstdTelemetryQuota(identity: string, now = Date.now(), limit = 30) {
  const key = hashCstdTelemetryIdentity(identity || "anonymous");
  const current = quotaByIdentity.get(key);
  if (!current || now - current.startedAt >= 60_000) {
    quotaByIdentity.set(key, { startedAt: now, count: 1 });
    return { allowed: true, retryAfterSeconds: 0 } as const;
  }
  current.count += 1;
  if (quotaByIdentity.size > 1_000) {
    for (const [candidate, window] of quotaByIdentity) {
      if (now - window.startedAt >= 60_000) quotaByIdentity.delete(candidate);
    }
  }
  return current.count <= limit
    ? { allowed: true, retryAfterSeconds: 0 } as const
    : { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((60_000 - (now - current.startedAt)) / 1_000)) } as const;
}

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
