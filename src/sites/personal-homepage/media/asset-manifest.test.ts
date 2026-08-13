import { describe, expect, test } from "vitest";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { cstdBroadcasts, cstdEditorialAssets, cstdThemeFontAssets, cstdThemeMaterialAssets, cstdThemeWorldAssets, cstdVisualAssets } from "./asset-manifest";

describe("CSTD media manifest", () => {
  test("maps one original visual to every directed scene", () => {
    expect(cstdVisualAssets).toHaveLength(6);
    expect(new Set(cstdVisualAssets.map((asset) => asset.sceneId)).size).toBe(6);
    expect(
      cstdVisualAssets
        .filter((asset) => "priority" in asset && asset.priority)
        .map((asset) => asset.sceneId),
    ).toEqual(["hero"]);
    expect(cstdVisualAssets.every((asset) => asset.src.startsWith("/cstd-"))).toBe(true);
    expect(cstdVisualAssets.find((asset) => asset.sceneId === "hero")?.src).toBe("/cstd-universe/cstd-custard-core-v5.webp");
    expect(cstdVisualAssets.filter((asset) => asset.src.endsWith("-v4.webp"))).toHaveLength(2);
    for (const asset of cstdVisualAssets) {
      const filePath = path.join(process.cwd(), "public", asset.src.slice(1));
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(320_000);
    }
  });

  test("provides modern and compatibility video sources for each primary project", () => {
    expect(Object.keys(cstdBroadcasts)).toEqual(["rocodex", "alpha", "crm"]);
    for (const broadcast of Object.values(cstdBroadcasts)) {
      expect(broadcast.webm).toMatch(/\.webm$/);
      expect(broadcast.mp4).toMatch(/\.mp4$/);
    }
  });

  test("versions every CSTD 17.0 editorial visual and keeps it deployable", () => {
    expect(cstdEditorialAssets).toHaveLength(7);
    expect(new Set(cstdEditorialAssets.map((asset) => asset.purpose)).size).toBe(7);
    for (const asset of cstdEditorialAssets) {
      expect(asset.src).toMatch(/^\/cstd-universe\/.+-v[345]\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", asset.src.slice(1)))).toBe(true);
    }
  });

  test("keeps every visual world asset deployable and inside the scene budget", () => {
    expect(Object.keys(cstdThemeWorldAssets)).toEqual(["ink-protocol", "press-room", "pixel-quest"]);
    for (const asset of Object.values(cstdThemeWorldAssets)) {
      const filePath = path.join(process.cwd(), "public", asset.slice(1));
      expect(asset).toMatch(/^\/cstd-themes\/.+-v1\.webp$/);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(320_000);
    }
  });

  test("keeps every theme foundation asset versioned, deployable, and budgeted", () => {
    expect(Object.keys(cstdThemeMaterialAssets)).toEqual(["neon-district", "ink-protocol", "press-room", "pixel-quest"]);
    expect(Object.keys(cstdThemeFontAssets)).toEqual(["neon-district", "ink-protocol", "press-room", "pixel-quest"]);

    for (const asset of Object.values(cstdThemeMaterialAssets)) {
      const filePath = path.join(process.cwd(), "public", asset.slice(1));
      expect(asset).toMatch(/^\/cstd-materials\/.+-v1\.webp$/);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(320_000);
    }

    for (const asset of Object.values(cstdThemeFontAssets).flat()) {
      const filePath = path.join(process.cwd(), "public", asset.slice(1));
      expect(asset).toMatch(/^\/fonts\/cstd\/.+-v1\.woff2$/);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(450_000);
    }
  });
});
