import { describe, expect, test } from "vitest";
import { cstdSystems } from "./systems";

describe("CSTD creative systems", () => {
  test("separates shipped systems from study and research work", () => {
    expect(cstdSystems).toHaveLength(5);
    expect(cstdSystems.filter((system) => system.track === "shipped")).toHaveLength(3);
    expect(cstdSystems.filter((system) => system.track === "research")).toHaveLength(2);
    expect(cstdSystems.every((system) => system.stack.length >= 3)).toBe(true);
    expect(cstdSystems.every((system) => [system.title, system.district, system.summary, system.evidence, system.relation]
      .every((field) => field.zh.trim().length > 0 && field.en.trim().length > 0))).toBe(true);
    expect(cstdSystems.every((system) => system.evidenceLinks.every((link) => link.label.zh && link.label.en))).toBe(true);
  });

});
