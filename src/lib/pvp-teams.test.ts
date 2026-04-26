import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { archivedPvpTeams, pvpTeams } from "@/data/pvp-teams";

const isValidPng = (imagePath: string) => {
  const fullPath = join(process.cwd(), "public", imagePath);
  if (!existsSync(fullPath)) return false;
  const bytes = readFileSync(fullPath);
  return bytes.length > 2048 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
};

describe("pvp teams data", () => {
  it("contains exactly 10 named current meta teams", () => {
    const names = new Set(pvpTeams.map((team) => team.name));

    expect(pvpTeams).toHaveLength(10);
    expect(names.size).toBe(10);
    expect(pvpTeams.every((team) => team.sourceFreshness === "current")).toBe(true);
    expect(pvpTeams.every((team) => team.verifiedAfter === "2026-04-15")).toBe(true);
    expect(Array.from(names)).toEqual(expect.arrayContaining(["爆发增益流", "冻结控场流", "星陨印记流", "毒伤持续流"]));
  });

  it("uses only sources published on or after 2026-04-15 for current meta teams", () => {
    for (const team of pvpTeams) {
      expect(team.sources.length).toBeGreaterThanOrEqual(1);
      expect(team.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(team.sources.every((source) => source.publishedAt >= "2026-04-15")).toBe(true);
      expect(team.sources.every((source) => ["official", "guide", "community", "needs-review"].includes(source.tier))).toBe(true);
    }
  });

  it("keeps older teams archived outside the default meta list", () => {
    expect(archivedPvpTeams.length).toBeGreaterThan(0);
    expect(archivedPvpTeams.every((team) => team.sourceFreshness === "archived")).toBe(true);
    expect(archivedPvpTeams.some((team) => team.sources.some((source) => source.publishedAt < "2026-04-15"))).toBe(true);
    expect(pvpTeams.some((team) => team.sources.some((source) => source.publishedAt < "2026-04-15"))).toBe(false);
  });

  it("records six members with sourced or clearly analysis-derived moves and analysis-derived builds", () => {
    for (const team of pvpTeams) {
      expect(team.members).toHaveLength(6);
      expect(["complete", "analysis-expanded"]).toContain(team.lineupCompleteness);

      for (const member of team.members) {
        expect(member.name).toBeTruthy();
        expect(member.role).toBeTruthy();
        expect(member.moves).toHaveLength(4);
        expect(member.moves.every((move) => ["source-derived", "analysis-derived"].includes(move.sourceBasis))).toBe(true);
        expect(member.nature.sourceBasis).toBe("analysis-derived");
        expect(member.talent.sourceBasis).toBe("analysis-derived");
        expect(member.imageReviewStatus).toBe("needs-review");
        expect(isValidPng(member.image), member.image).toBe(true);
      }
    }
  });

  it("marks the page-level analysis disclaimer text source", () => {
    expect(pvpTeams.every((team) => team.analysisDisclaimer.includes("本站分析"))).toBe(true);
    expect(pvpTeams.every((team) => team.metaDate === "2026-04-26")).toBe(true);
  });
});
