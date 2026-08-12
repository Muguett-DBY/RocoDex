import type { NextRequest } from "next/server";
import { createCstdJsonFeed } from "@/sites/personal-homepage/server";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "zh";
  return Response.json(createCstdJsonFeed(locale), {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "content-language": locale === "en" ? "en-AU" : "zh-CN",
    },
  });
}
