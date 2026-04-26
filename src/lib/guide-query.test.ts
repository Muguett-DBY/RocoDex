import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { guideBuilds } from "@/data/guide-builds";
import { filterGuideBuilds, getGuideStats, groupGuideBuildsByTier } from "@/lib/guide-query";
import type { GuideTier } from "@/types/guide";

const tiers: GuideTier[] = ["S", "A", "B", "C", "D", "未评级"];

const isValidLocalImage = (imagePath: string) => {
  const fullPath = join(process.cwd(), "public", imagePath);
  if (!existsSync(fullPath)) return false;
  const bytes = readFileSync(fullPath);
  return (
    bytes.length > 512 &&
    ((bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) ||
      imagePath.endsWith(".svg"))
  );
};

describe("guide builds data", () => {
  it("contains all current creature seeds and pvp-only creatures with safe defaults", () => {
    expect(guideBuilds.length).toBeGreaterThanOrEqual(80);
    expect(guideBuilds.some((build) => build.name === "迪莫")).toBe(true);
    expect(guideBuilds.some((build) => build.name === "雪影娃娃")).toBe(true);
    expect(guideBuilds.some((build) => build.name === "黑猫巫师")).toBe(true);

    for (const build of guideBuilds) {
      expect(build.name).toBeTruthy();
      expect(build.image).toBeTruthy();
      expect(isValidLocalImage(build.image), build.image).toBe(true);
      expect(tiers).toContain(build.pveTier);
      expect(tiers).toContain(build.pvpTier);
      expect(build.sources.length > 0 || build.reviewNotes.length > 0).toBe(true);
      expect(["confirmed", "partial", "analysis", "unknown"]).toContain(build.confidence);
    }
  });

  it("does not invent build details for unknown entries", () => {
    const unknownBuilds = guideBuilds.filter((build) => build.confidence === "unknown");
    expect(unknownBuilds.length).toBeGreaterThan(0);

    for (const build of unknownBuilds) {
      expect(build.pveTier).toBe("未评级");
      expect(build.pvpTier).toBe("未评级");
      expect(build.nature.sourceBasis).toBe("unknown");
      expect(build.talent.sourceBasis).toBe("unknown");
      expect(build.moves.sourceBasis).toBe("unknown");
      expect(build.reviewNotes.join("")).toContain("待复核");
    }
  });

  it("marks analysis-derived recommendations for display", () => {
    const analyzedBuilds = guideBuilds.filter(
      (build) =>
        build.nature.sourceBasis === "analysis-derived" ||
        build.talent.sourceBasis === "analysis-derived" ||
        build.moves.sourceBasis === "analysis-derived",
    );

    expect(analyzedBuilds.length).toBeGreaterThan(0);
    expect(analyzedBuilds.every((build) => build.analysisNote.includes("本站分析"))).toBe(true);
  });
});

describe("guide query helpers", () => {
  it("filters by mode tier, query, attribute, role, and confidence", () => {
    expect(filterGuideBuilds(guideBuilds, { mode: "pvp", query: "雪影" }).map((build) => build.name)).toContain("雪影娃娃");
    expect(filterGuideBuilds(guideBuilds, { mode: "pvp", tier: "S" }).every((build) => build.pvpTier === "S")).toBe(true);
    expect(filterGuideBuilds(guideBuilds, { mode: "pve", tier: "S" }).every((build) => build.pveTier === "S")).toBe(true);
    expect(filterGuideBuilds(guideBuilds, { mode: "pvp", attribute: "冰" }).every((build) => build.attributes.includes("冰"))).toBe(true);
    expect(filterGuideBuilds(guideBuilds, { mode: "pvp", role: "控场" }).some((build) => build.roles.includes("控场"))).toBe(true);
    expect(filterGuideBuilds(guideBuilds, { mode: "pvp", confidence: "unknown" }).every((build) => build.confidence === "unknown")).toBe(true);
  });

  it("groups by the selected pve or pvp tier", () => {
    const pvpGroups = groupGuideBuildsByTier(guideBuilds, "pvp");
    const pveGroups = groupGuideBuildsByTier(guideBuilds, "pve");

    expect(Object.keys(pvpGroups)).toEqual(tiers);
    expect(Object.keys(pveGroups)).toEqual(tiers);
    expect(pvpGroups.S.some((build) => build.pvpTier === "S")).toBe(true);
    expect(pveGroups["未评级"].every((build) => build.pveTier === "未评级")).toBe(true);
  });

  it("summarizes guide data quality", () => {
    const stats = getGuideStats(guideBuilds);

    expect(stats.total).toBe(guideBuilds.length);
    expect(stats.byConfidence.unknown).toBeGreaterThan(0);
    expect(stats.byMode.pvp.rated).toBeGreaterThan(0);
    expect(stats.byMode.pve.unrated).toBeGreaterThan(0);
  });
});
