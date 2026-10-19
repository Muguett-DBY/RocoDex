import { createCstdManifest } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return Response.json(createCstdManifest("zh"), {
    headers: {
      "cache-control": "public, max-age=0, s-maxage=86400",
      "content-language": "zh-CN",
      "content-type": "application/manifest+json; charset=utf-8",
    },
  });
}
