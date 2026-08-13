import { createCstdManifest } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return Response.json(createCstdManifest("en"), {
    headers: {
      "cache-control": "public, max-age=0, s-maxage=86400",
      "content-language": "en-AU",
      "content-type": "application/manifest+json; charset=utf-8",
    },
  });
}
