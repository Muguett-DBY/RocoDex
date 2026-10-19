import { getRocoDexSitemapEntries } from "@/sites/rocodex/sitemap";
import { serializeSitemap } from "@/sites/shared/sitemap";

export const dynamic = "force-static";
export function GET() {
  return new Response(serializeSitemap(getRocoDexSitemapEntries()), { headers: { "content-type": "application/xml; charset=utf-8" } });
}
