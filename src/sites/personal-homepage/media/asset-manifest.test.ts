import { describe, expect, test } from "vitest";
import { cstdBroadcasts, cstdVisualAssets } from "./asset-manifest";

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
  });

  test("provides modern and compatibility video sources for each primary project", () => {
    expect(Object.keys(cstdBroadcasts)).toEqual(["rocodex", "alpha", "crm"]);
    for (const broadcast of Object.values(cstdBroadcasts)) {
      expect(broadcast.webm).toMatch(/\.webm$/);
      expect(broadcast.mp4).toMatch(/\.mp4$/);
    }
  });
});
