import { createCstdJsonFeed } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return Response.json(createCstdJsonFeed("en"), {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "content-language": "en-AU",
    },
  });
}
