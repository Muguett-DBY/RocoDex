import { cstdReleaseLedger } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return Response.json(cstdReleaseLedger, {
    headers: {
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "content-language": "en-AU",
    },
  });
}
