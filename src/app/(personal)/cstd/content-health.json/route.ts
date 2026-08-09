import { cstdContentHealth } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return Response.json(cstdContentHealth, {
    headers: { "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
