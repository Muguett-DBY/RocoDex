const manifest = {
  name: "Custard // Personal Engineering Universe",
  short_name: "Custard",
  description: "Custard's identity-first portfolio of shipped systems, executable evidence, and engineering knowledge.",
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
