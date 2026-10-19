import { serializeCstdRss } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";
export function GET() {
  return new Response(serializeCstdRss("zh"), { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
