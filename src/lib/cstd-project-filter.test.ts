import { describe, expect, test } from "vitest";
import {
  cstdProjectFilters,
  filterCstdProjects,
  getCstdProjectControlSummary,
  getCstdProjectFilterSummary,
  hasActiveCstdProjectControls,
  type CstdProjectFilter,
} from "./cstd-project-filter";

const sampleProjects = [
  { title: "RocoDex", category: "data", description: "中文精灵资料库", tags: ["PVP", "Next.js"] },
  { title: "Photo", category: "creative", description: "南京写真", tags: ["Portrait"] },
  { title: "Alpha", category: "research", description: "A 股估值研究", tags: ["AI Research"] },
  { title: "CRM", category: "operations", description: "产业园招商线索", tags: ["D1", "RBAC"] },
  { title: "Lab", category: "incubating", description: "动效实验", tags: ["Prototype"] },
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

    expect(filtered.map((project) => project.title)).toEqual(["CRM"]);
    expect(sampleProjects).toHaveLength(5);
  });

  test("returns every project for the all filter", () => {
    expect(filterCstdProjects(sampleProjects, "all")).toEqual(sampleProjects);
  });

  test("summarizes the active filtered count for assistive and visible text", () => {
    const filter: CstdProjectFilter = "creative";

    expect(getCstdProjectFilterSummary(sampleProjects, filter)).toBe("当前显示 1 / 5 个项目");
  });

  test("searches projects across title, description, and tags", () => {
    expect(filterCstdProjects(sampleProjects, "all", "南京").map((project) => project.title)).toEqual(["Photo"]);
    expect(filterCstdProjects(sampleProjects, "all", "rbac").map((project) => project.title)).toEqual(["CRM"]);
    expect(filterCstdProjects(sampleProjects, "all", "  A 股  ").map((project) => project.title)).toEqual(["Alpha"]);
  });

  test("combines category filters with project search", () => {
    expect(filterCstdProjects(sampleProjects, "operations", "招商").map((project) => project.title)).toEqual(["CRM"]);
    expect(filterCstdProjects(sampleProjects, "creative", "招商")).toEqual([]);
    expect(getCstdProjectFilterSummary(sampleProjects, "creative", "招商")).toBe("没有匹配项目，可清空搜索或切换分类");
  });

  test("summarizes active controls for responsive project toolbar", () => {
    expect(getCstdProjectControlSummary("all", "")).toBe("浏览全部项目");
    expect(getCstdProjectControlSummary("creative", "")).toBe("筛选：创作影像");
    expect(getCstdProjectControlSummary("all", " 南京 ")).toBe("搜索：南京");
    expect(getCstdProjectControlSummary("operations", " CRM ")).toBe("筛选：运营系统 · 搜索：CRM");
    expect(hasActiveCstdProjectControls("all", "")).toBe(false);
    expect(hasActiveCstdProjectControls("all", "CRM")).toBe(true);
    expect(hasActiveCstdProjectControls("research", "")).toBe(true);
  });
});
