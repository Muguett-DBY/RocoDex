import type { NextRequest } from "next/server";
import { buildRobotsTxt } from "@/lib/cstd-robots";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  return new Response(buildRobotsTxt(host), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
