const manifest = {
  name: "CSTD // Custard Engineering Studio",
  short_name: "CSTD",
  description: "Custard's evidence-driven personal engineering studio.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#050709",
  theme_color: "#f4d431",
  icons: [
    { src: "/cstd-mascot.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
  ],
} as const;

export const dynamic = "force-static";

export function GET() {
  return Response.json(manifest, {
    headers: {
      "cache-control": "public, max-age=0, s-maxage=86400",
      "content-type": "application/manifest+json; charset=utf-8",
    },
  });
}
