import type { NextRequest } from "next/server";
import { isPersonalSiteHost, parseCstdMetric } from "@/sites/personal-homepage/server";

export async function POST(request: NextRequest) {
  if (!isPersonalSiteHost(request.headers.get("host") ?? "")) return new Response(null, { status: 404 });
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

  console.info("[cstd-vital]", JSON.stringify(metric));
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}
