import { describe, expect, it } from "vitest";
import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";
import { compareCreatures } from "@/lib/creature-compare";
import { parseComparisonIds } from "@/lib/creature-compare";
import { buildEvolutionChain } from "@/lib/evolution-chain";
import { getAttributeMatchupProfile, getEffectiveness } from "@/lib/matchup";
import { searchCreatureSkills } from "@/lib/skill-search";

describe("player decision tools", () => {
  it("calculates attribute effectiveness and matchup profiles", () => {
    expect(getEffectiveness("火", "草")).toBeGreaterThan(1);
    expect(getEffectiveness("水", "火")).toBeGreaterThan(1);

    const profile = getAttributeMatchupProfile(["火"]);
    expect(profile.strongInto).toContain("草");
    expect(profile.weakTo).toContain("水");
  });

  it("builds an evolution chain from creature evolution text", () => {
    const chain = buildEvolutionChain(creatures, "005");

    expect(chain.map((step) => step.name)).toEqual(["火花", "焰火", "火神"]);
    expect(chain[1].href).toBe("/creatures/006");
  });

  it("searches skills across creatures by name, attribute, and confidence", () => {
    const results = searchCreatureSkills(creatures, { query: "撞击", confidence: "confirmed" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toMatchObject({ creatureName: expect.any(String), skillName: expect.stringContaining("撞击") });
    expect(searchCreatureSkills(creatures, { attribute: "火" }).some((item) => item.skillAttribute === "火")).toBe(true);
  });

  it("compares two to four creatures with guide context", () => {
    const comparison = compareCreatures(creatures, guideBuilds, ["001", "005", "008"]);

    expect(comparison.creatures).toHaveLength(3);
    expect(comparison.creatures[0]).toMatchObject({
      id: "001",
      name: "迪莫",
      pvpTier: expect.any(String),
      verifiedSkillCount: expect.any(Number),
    });
  });

  it("parses a comparison query into two to four existing unique creatures", () => {
    expect(parseComparisonIds("001,005,001,999,008,010,011", creatures)).toEqual(["001", "005", "008", "010"]);
    expect(parseComparisonIds("001", creatures)).toEqual([]);
    expect(parseComparisonIds(undefined, creatures)).toEqual([]);
  });
});
