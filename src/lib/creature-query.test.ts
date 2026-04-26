import { describe, expect, it } from "vitest";
import { creatures } from "@/data/creatures";
import {
  filterCreatures,
  getCreatureStats,
  getDataGaps,
  getUniqueAttributes,
} from "@/lib/creature-query";

describe("creature seed data", () => {
  it("contains all 347 Roco Kingdom World dex entries from BWiki", () => {
    expect(creatures).toHaveLength(347);
    expect(creatures[0]).toMatchObject({ id: "001", name: "迪莫" });
    expect(creatures[346]).toMatchObject({ id: "347", name: "暮星辰" });
  });

  it("uses local images for all creatures with review-needed status", () => {
    const allForms = creatures.flatMap((creature) => creature.forms);

    expect(allForms.length).toBeGreaterThanOrEqual(300);
    expect(allForms.every((form) => form.image.startsWith("/images/creatures/"))).toBe(true);
    expect(allForms.every((form) => !form.image.endsWith("placeholder.svg"))).toBe(true);
    expect(allForms.every((form) => form.imageStatus === "local")).toBe(true);
    expect(allForms.every((form) => form.imageReviewStatus === "needs-review")).toBe(true);
  });

  it("records per-creature source pages and upgrades verified facts without guessing", () => {
    const meow = creatures.find((creature) => creature.id === "002");
    const spark = creatures.find((creature) => creature.id === "005");

    expect(creatures.every((creature) => creature.sources.some((source) => source.kind === "creature-page"))).toBe(true);
    expect(creatures.every((creature) => creature.updatedAt)).toBe(true);
    expect(meow?.captureLocations).toContain("风息山口");
    expect(meow?.description).toContain("喜欢阳光");
    expect(spark?.captureLocations).toContain("岚语峰西侧");
    expect(spark?.evolutionMethods).toEqual(["16 级进化为焰火；36 级进化为火神"]);
    expect(creatures.find((creature) => creature.id === "010")?.skills.map((skill) => skill.name)).toEqual(
      expect.arrayContaining(["防御", "拍击", "甩水"]),
    );
  });
});

describe("creature query helpers", () => {
  it("searches by Chinese name, dex id, capture location, and obtain keyword", () => {
    expect(filterCreatures(creatures, { query: "迪莫" }).map((item) => item.id)).toEqual(["001"]);
    expect(filterCreatures(creatures, { query: "001" }).map((item) => item.name)).toEqual(["迪莫"]);
    expect(filterCreatures(creatures, { query: "台地" }).map((item) => item.name)).toContain("迪莫");
    expect(filterCreatures(creatures, { query: "待确认" }).length).toBeGreaterThan(40);
  });

  it("filters by attribute, catchability, event limitation, and availability", () => {
    const grass = filterCreatures(creatures, { attribute: "草" });
    expect(grass.map((item) => item.name)).toEqual(
      expect.arrayContaining(["喵喵", "喵呜", "魔力猫", "奇丽草"]),
    );

    expect(filterCreatures(creatures, { isCatchable: "true" }).map((item) => item.name)).toContain("迪莫");
    expect(filterCreatures(creatures, { isEventLimited: "unknown" }).length).toBeGreaterThan(200);
    expect(filterCreatures(creatures, { availabilityStatus: "unknown" }).length).toBeGreaterThan(0);
    expect(filterCreatures(creatures, { availabilityStatus: "available" }).length).toBeGreaterThan(0);
  });

  it("sorts by id and name", () => {
    expect(filterCreatures(creatures, { sort: "id-desc" })[0].id).toBe("347");
    expect(filterCreatures(creatures, { sort: "name-asc" })[0].name.localeCompare(filterCreatures(creatures, { sort: "name-asc" })[1].name, "zh-Hans-CN")).toBeLessThanOrEqual(0);
  });

  it("summarizes status and data gaps for the data-status page", () => {
    const stats = getCreatureStats(creatures);
    const gaps = getDataGaps(creatures);

    expect(stats.total).toBe(347);
    expect(stats.byConfidence.partial + stats.byConfidence.confirmed + stats.byConfidence.unknown).toBe(347);
    expect(stats.gapTotals.image).toBeGreaterThan(0);
    expect(stats.gapTotals.facts).toBeGreaterThan(0);
    expect(stats.gapTotals.byField["图片"]).toBeGreaterThan(0);
    expect(stats.gapTotals.byField["捕捉地点"]).toBeLessThan(347);
    expect(getUniqueAttributes(creatures)).toEqual(expect.arrayContaining(["光", "草", "火", "水"]));
    expect(gaps.some((gap) => gap.field === "图片")).toBe(true);
    expect(gaps.some((gap) => gap.field === "技能")).toBe(true);
  });
});
