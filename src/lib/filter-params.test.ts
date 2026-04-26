import { describe, expect, it } from "vitest";
import {
  buildCreatureFilterParams,
  buildGuideFilterParams,
  buildPvpFilterParams,
  parseCreatureFilterParams,
  parseGuideFilterParams,
  parsePvpFilterParams,
} from "@/lib/filter-params";

describe("filter params", () => {
  it("parses creature filters from shareable URL params and drops invalid values", () => {
    const filters = parseCreatureFilterParams(
      new URLSearchParams("q=%E7%81%AB&attribute=%E7%81%AB&catchable=true&event=invalid&availability=available&obtain=%E6%8D%95%E6%8D%89&sort=name-desc"),
    );

    expect(filters).toEqual({
      query: "火",
      attribute: "火",
      isCatchable: "true",
      isEventLimited: "all",
      availabilityStatus: "available",
      obtainMethod: "捕捉",
      sort: "name-desc",
    });
  });

  it("serializes creature filters without default values", () => {
    const params = buildCreatureFilterParams({
      query: "喵喵",
      attribute: "all",
      isCatchable: "all",
      isEventLimited: "unknown",
      availabilityStatus: "all",
      obtainMethod: "all",
      sort: "id-desc",
    });

    expect(params.toString()).toBe("q=%E5%96%B5%E5%96%B5&event=unknown&sort=id-desc");
  });

  it("parses guide filters with pvp defaults", () => {
    const filters = parseGuideFilterParams(new URLSearchParams("mode=pve&q=%E6%8E%A7%E5%9C%BA&tier=S&confidence=analysis&role=%E8%BE%93%E5%87%BA"));

    expect(filters).toEqual({
      mode: "pve",
      query: "控场",
      attribute: "all",
      role: "输出",
      tier: "S",
      confidence: "analysis",
    });
  });

  it("serializes guide filters without defaults", () => {
    const params = buildGuideFilterParams({
      mode: "pvp",
      query: "",
      attribute: "水",
      role: "all",
      tier: "未评级",
      confidence: "all",
    });

    expect(params.toString()).toBe("attribute=%E6%B0%B4&tier=%E6%9C%AA%E8%AF%84%E7%BA%A7");
  });

  it("parses and serializes pvp filters with current meta defaults", () => {
    const parsed = parsePvpFilterParams(new URLSearchParams("freshness=archived&sourceTier=community&strength=T1&archetype=%E5%86%B0%E6%8E%A7"));
    const serialized = buildPvpFilterParams(parsed);

    expect(parsed).toEqual({
      freshness: "archived",
      sourceTier: "community",
      strength: "T1",
      archetype: "冰控",
    });
    expect(serialized.toString()).toBe("freshness=archived&sourceTier=community&strength=T1&archetype=%E5%86%B0%E6%8E%A7");
  });
});
