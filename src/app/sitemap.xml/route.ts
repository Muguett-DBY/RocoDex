import type { NextRequest } from "next/server";
import { getPersonalHomepageSitemapEntries, isPersonalSiteHost } from "@/sites/personal-homepage/server";
import { getRocoDexSitemapEntries } from "@/sites/rocodex/sitemap";
import { serializeSitemap } from "@/sites/shared/sitemap";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const entries = isPersonalSiteHost(host)
    ? getPersonalHomepageSitemapEntries()
    : getRocoDexSitemapEntries();

  return new Response(serializeSitemap(entries), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
