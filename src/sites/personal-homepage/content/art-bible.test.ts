import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { cstdArtBible } from "./art-bible";
import { cstdSystems } from "./systems";

describe("CSTD art bible", () => {
  test("assigns a production asset and distinct visual language to every district", () => {
    expect(Object.keys(cstdArtBible).sort()).toEqual(cstdSystems.map((entry) => entry.id).sort());
    expect(new Set(Object.values(cstdArtBible).map((entry) => entry.image)).size).toBe(cstdSystems.length);
    for (const entry of Object.values(cstdArtBible)) {
      expect(entry.image).toMatch(/^\/cstd-districts\/.+-v1\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", entry.image))).toBe(true);
      expect(entry.imageAlt.zh.length).toBeGreaterThan(6);
      expect(entry.imageAlt.en.length).toBeGreaterThan(10);
    }
  });
});
