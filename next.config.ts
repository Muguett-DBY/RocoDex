import type { NextConfig } from "next";

const cstdImmutableAssetRoots = [
  "cstd-archive",
  "cstd-districts",
  "cstd-materials",
  "cstd-persona",
  "cstd-stage",
  "cstd-themes",
  "cstd-universe",
  "cstd-world",
  "fonts/cstd",
] as const;

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_678_400,
    unoptimized: true,
  },
  async headers() {
    return cstdImmutableAssetRoots.map((root) => ({
      source: `/${root}/:path*`,
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }));
  },
};

export default nextConfig;
