import type { NextRequest } from "next/server";
import { consumeCstdTelemetryQuota, isPersonalSiteHost, parseCstdMetric } from "@/sites/personal-homepage/server";

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id") ?? "local";
  if (!isPersonalSiteHost(request.headers.get("host") ?? "")) return new Response(null, { status: 404 });
  const identity = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "local";
  const quota = consumeCstdTelemetryQuota(identity);
  if (!quota.allowed) return Response.json(
    { error: "rate_limited" },
    { status: 429, headers: { "retry-after": String(quota.retryAfterSeconds), "cache-control": "no-store" } },
  );
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > 2048) return Response.json({ error: "payload_too_large" }, { status: 413 });

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const metric = parseCstdMetric(value);
  if (!metric) return Response.json({ error: "invalid_metric" }, { status: 400 });

  console.info(JSON.stringify({ level: "info", message: "cstd_vital", route: "/api/cstd-vitals", requestId, durationMs: Date.now() - startedAt, metric }));
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}
