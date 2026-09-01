import { describe, expect, test } from "vitest";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { cstdEditorialAssets, cstdThemeFontAssets, cstdThemeMaterialAssets, cstdThemeStageAssets, cstdThemeWorldAssets, cstdVisualAssets } from "./asset-manifest";

describe("CSTD media manifest", () => {
  test("maps one original visual to every directed scene", () => {
    expect(cstdVisualAssets).toHaveLength(5);
    expect(new Set(cstdVisualAssets.map((asset) => asset.sceneId)).size).toBe(5);
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

  test("ships one dedicated, generated stage asset for every visual world", () => {
    expect(Object.keys(cstdThemeStageAssets)).toEqual(["neon-district", "ink-protocol", "press-room", "pixel-quest", "underworld-forge"]);
    for (const asset of Object.values(cstdThemeStageAssets)) {
      const filePath = path.join(process.cwd(), "public", asset.src.slice(1));
      expect(asset.src).toMatch(/^\/cstd-stage\/.+-v[12]\.webp$/);
      expect(asset.alt.zh.length).toBeGreaterThan(8);
      expect(asset.alt.en.length).toBeGreaterThan(8);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(320_000);
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
    expect(Object.keys(cstdThemeWorldAssets)).toEqual(["ink-protocol", "press-room", "pixel-quest", "underworld-forge"]);
    for (const asset of Object.values(cstdThemeWorldAssets)) {
      const filePath = path.join(process.cwd(), "public", asset.slice(1));
      expect(asset).toMatch(/^\/cstd-themes\/.+-v1\.webp$/);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(320_000);
    }
  });

  test("keeps every theme foundation asset versioned, deployable, and budgeted", () => {
    expect(Object.keys(cstdThemeMaterialAssets)).toEqual(["neon-district", "ink-protocol", "press-room", "pixel-quest", "underworld-forge"]);
    expect(Object.keys(cstdThemeFontAssets)).toEqual(["neon-district", "ink-protocol", "press-room", "pixel-quest", "underworld-forge"]);

    for (const asset of Object.values(cstdThemeMaterialAssets)) {
      const filePath = path.join(process.cwd(), "public", asset.slice(1));
      expect(asset).toMatch(/^\/cstd-materials\/.+-v1\.webp$/);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(320_000);
    }

    expect(cstdThemeFontAssets["neon-district"].zh).toEqual(["/fonts/cstd/neon-display-v1.woff2"]);
    expect(cstdThemeFontAssets["neon-district"].en).toEqual(["/fonts/cstd/neon-latin-v1.woff2"]);
    expect(cstdThemeFontAssets["ink-protocol"].zh).toEqual(["/fonts/cstd/ink-display-v1.woff2", "/fonts/cstd/ink-text-v1.woff2"]);
    expect(cstdThemeFontAssets["ink-protocol"].en).toEqual(["/fonts/cstd/ink-latin-v1.woff2", "/fonts/cstd/ink-latin-italic-v1.woff2"]);
    expect(cstdThemeFontAssets["underworld-forge"].zh).toEqual(["/fonts/cstd/underworld-display-v1.woff2", "/fonts/cstd/press-serif-v1.woff2"]);
    expect(cstdThemeFontAssets["underworld-forge"].en).toEqual(["/fonts/cstd/underworld-display-v1.woff2"]);

    const fontAssets = new Set(Object.values(cstdThemeFontAssets).flatMap((locales) => Object.values(locales).flat()));
    for (const asset of fontAssets) {
      const filePath = path.join(process.cwd(), "public", asset.slice(1));
      expect(asset).toMatch(/^\/fonts\/cstd\/.+-v1\.woff2$/);
      expect(existsSync(filePath)).toBe(true);
      expect(statSync(filePath).size).toBeLessThanOrEqual(450_000);
    }
  });
});
