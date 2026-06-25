import { describe, expect, test } from "vitest";
import { cstdProjectFilters, filterCstdProjects, getCstdProjectFilterSummary, type CstdProjectFilter } from "./cstd-project-filter";

const sampleProjects = [
  { title: "RocoDex", category: "data" },
  { title: "Photo", category: "creative" },
  { title: "Alpha", category: "research" },
  { title: "CRM", category: "operations" },
  { title: "Lab", category: "incubating" },
] as const;

describe("CSTD project filtering", () => {
  test("keeps the all filter first for the project directory", () => {
    expect(cstdProjectFilters[0]).toEqual({
      id: "all",
      label: "全部",
    });
  });

  test("filters projects by category without mutating the source list", () => {
    const filtered = filterCstdProjects(sampleProjects, "operations");

    expect(filtered).toEqual([{ title: "CRM", category: "operations" }]);
    expect(sampleProjects).toHaveLength(5);
  });

  test("returns every project for the all filter", () => {
    expect(filterCstdProjects(sampleProjects, "all")).toEqual(sampleProjects);
  });

  test("summarizes the active filtered count for assistive and visible text", () => {
    const filter: CstdProjectFilter = "creative";

    expect(getCstdProjectFilterSummary(sampleProjects, filter)).toBe("当前显示 1 / 5 个项目");
  });
});
