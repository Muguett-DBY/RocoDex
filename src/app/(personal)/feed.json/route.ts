import { createCstdJsonFeed } from "@/sites/personal-homepage/server";

export function GET() {
  return Response.json(createCstdJsonFeed("zh"), {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "content-language": "zh-CN",
    },
  });
}

export const dynamic = "force-static";
