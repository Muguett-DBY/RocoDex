import { cstdStudioSnapshot } from "@/sites/personal-homepage/server";

export function GET() {
  return Response.json(cstdStudioSnapshot, {
    headers: { "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
