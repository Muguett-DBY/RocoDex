import { describe, expect, test } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { cstdBroadcasts, cstdEditorialAssets, cstdVisualAssets } from "./asset-manifest";

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
    expect(cstdVisualAssets.filter((asset) => asset.src.endsWith("-v2.webp"))).toHaveLength(3);
  });

  test("provides modern and compatibility video sources for each primary project", () => {
    expect(Object.keys(cstdBroadcasts)).toEqual(["rocodex", "alpha", "crm"]);
    for (const broadcast of Object.values(cstdBroadcasts)) {
      expect(broadcast.webm).toMatch(/\.webm$/);
      expect(broadcast.mp4).toMatch(/\.mp4$/);
    }
  });

  test("versions every CSTD 9.0 editorial visual and keeps it deployable", () => {
    expect(cstdEditorialAssets).toHaveLength(4);
    expect(new Set(cstdEditorialAssets.map((asset) => asset.purpose)).size).toBe(4);
    for (const asset of cstdEditorialAssets) {
      expect(asset.src).toMatch(/^\/cstd-universe\/.+-v3\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", asset.src.slice(1)))).toBe(true);
    }
  });
});
