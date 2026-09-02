import { describe, expect, it } from "vitest";
import type { CstdThemeId } from "../experience/theme-store";
import { getVoxelThemeLayout, voxelPortfolioExhibitIds } from "./voxel-landmarks";

const themes: readonly CstdThemeId[] = ["neon-district", "underworld-forge", "astral-covenant"];

describe("CSTD voxel portfolio landmarks", () => {
  it("places every portfolio exhibit exactly once in every world", () => {
    for (const theme of themes) {
      const layout = getVoxelThemeLayout(theme);
      expect(layout.landmarks.map((entry) => entry.id).sort()).toEqual([...voxelPortfolioExhibitIds].sort());
      expect(new Set(layout.landmarks.map((entry) => `${entry.x},${entry.z}`)).size).toBe(voxelPortfolioExhibitIds.length);
      expect(layout.landmarks.every((entry) => Math.abs(entry.x) <= layout.mapRadius && Math.abs(entry.z) <= layout.mapRadius)).toBe(true);
      expect(layout.landmarks.some((entry) => Math.hypot(layout.spawn[0] - entry.x, layout.spawn[1] - entry.z) <= entry.radius)).toBe(true);
    }
  });

  it("uses a distinct spatial composition for each theme", () => {
    const signatures = themes.map((theme) => getVoxelThemeLayout(theme).landmarks.map(({ id, x, z }) => `${id}:${x},${z}`).join("|"));
    expect(new Set(signatures).size).toBe(themes.length);
  });
});
