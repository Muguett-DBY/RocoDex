import { serializeCstdResume } from "@/sites/personal-homepage/server";

export function GET() {
  return Response.json(serializeCstdResume("en"), {
    headers: { "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
