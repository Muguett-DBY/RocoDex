import { getPersonalHomepageSitemapEntries } from "@/sites/personal-homepage/server";
import { serializeSitemap } from "@/sites/shared/sitemap";

export const dynamic = "force-static";
export function GET() {
  return new Response(serializeSitemap(getPersonalHomepageSitemapEntries()), { headers: { "content-type": "application/xml; charset=utf-8" } });
}
