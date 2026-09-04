import { CSTD_RELEASE, cstdTopics } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ schemaVersion: 1, release: CSTD_RELEASE, entries: cstdTopics }, {
    headers: { "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
