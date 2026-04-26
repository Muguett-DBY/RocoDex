import { describe, expect, it } from "vitest";
import { creatures } from "@/data/creatures";
import { getRecentlyVerifiedCreatures, getSourceReviewItems, getUsefulMissingData } from "@/lib/source-review";

describe("source review helpers", () => {
  it("prioritizes review items for player-useful creature facts", () => {
    const items = getSourceReviewItems(creatures);

    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toMatchObject({ creatureId: expect.any(String), priority: expect.any(Number) });
    expect(items.some((item) => item.field === "技能")).toBe(true);
    expect(items.every((item) => item.sourceUrl.startsWith("https://wiki.biligame.com/rocom/"))).toBe(true);
  });

  it("lists recently verified creatures before older partial records", () => {
    const recent = getRecentlyVerifiedCreatures(creatures, 5);

    expect(recent).toHaveLength(5);
    expect(recent[0].updatedAt >= recent[1].updatedAt).toBe(true);
    expect(recent.every((item) => item.verifiedFields.length > 0)).toBe(true);
  });

  it("summarizes useful missing data by field with direct creature links", () => {
    const missing = getUsefulMissingData(creatures, 4);

    expect(missing).toHaveLength(4);
    expect(missing[0].href).toMatch(/^\/creatures\/\d{3}$/);
    expect(["捕捉地点", "获得方式", "进化方式", "技能"]).toContain(missing[0].field);
  });
});
