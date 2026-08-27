import { serializeCstdLlms } from "@/sites/personal-homepage/server";

export function GET() {
  return new Response(serializeCstdLlms(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
