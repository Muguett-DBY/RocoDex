import { describe, expect, it } from "vitest";
import { getVoxelPortfolio } from "./voxel-portfolio";
import { voxelPortfolioExhibitIds } from "./voxel-landmarks";

describe("CSTD voxel portfolio content", () => {
  it("projects the complete published portfolio into compact localized exhibits", () => {
    const chinese = getVoxelPortfolio("zh");
    const english = getVoxelPortfolio("en");

    expect(chinese.exhibits.map((entry) => entry.id)).toEqual(voxelPortfolioExhibitIds);
    expect(english.exhibits.map((entry) => entry.id)).toEqual(voxelPortfolioExhibitIds);
    expect(chinese.exhibits.filter((entry) => entry.kind === "work")).toHaveLength(6);
    expect(chinese.capabilities).toHaveLength(4);
    expect(chinese.exhibits.every((entry) => entry.title && entry.summary && entry.href && entry.technologies.length > 0)).toBe(true);
    expect(english.exhibits.every((entry) => entry.href.startsWith("/en/"))).toBe(true);
    expect(english.exhibits[0]?.title).not.toBe(chinese.exhibits[0]?.title);
  });
});
