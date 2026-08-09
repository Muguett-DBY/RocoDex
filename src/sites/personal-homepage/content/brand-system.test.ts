import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { cstdBrandSystem } from "./brand-system";

describe("CSTD 17.0 brand system", () => {
  test("keeps the original neural industrialism assets versioned and deployable", () => {
    expect(cstdBrandSystem.release).toBe("CSTD-17.0");
    expect(cstdBrandSystem.originalAssets).toHaveLength(10);
    for (const asset of cstdBrandSystem.originalAssets) {
      expect(asset).toMatch(/^\/cstd-universe\/.+-v[234]\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", asset.slice(1)))).toBe(true);
    }
  });

  test("uses a balanced material and signal palette", () => {
    expect(new Set(Object.values(cstdBrandSystem.palette)).size).toBe(6);
    expect(cstdBrandSystem.materials).toContain("amber resin");
    expect(cstdBrandSystem.motionPrinciples).toHaveLength(4);
  });
});
