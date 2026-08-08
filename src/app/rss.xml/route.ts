import type { NextRequest } from "next/server";
import { isPersonalSiteHost, serializeCstdRss } from "@/sites/personal-homepage/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  if (!isPersonalSiteHost(request.headers.get("host") ?? "")) return new Response(null, { status: 404 });
  const locale = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "zh";
  return new Response(serializeCstdRss(locale), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
