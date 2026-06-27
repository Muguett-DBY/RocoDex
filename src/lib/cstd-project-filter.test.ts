import { describe, expect, test } from "vitest";
import {
  cstdProjectFilters,
  buildCstdProjectDirectoryStateHref,
  buildCstdProjectDirectoryShareUrl,
  filterCstdProjects,
  getCstdProjectControlSummary,
  getCstdProjectControlBadges,
  getCstdProjectFilterSummary,
  hasActiveCstdProjectControls,
  parseCstdProjectDirectoryState,
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

  test("builds compact badges for active project directory controls", () => {
    expect(getCstdProjectControlBadges("all", "")).toEqual([]);
    expect(getCstdProjectControlBadges("creative", "")).toEqual([{ label: "分类", value: "创作影像" }]);
    expect(getCstdProjectControlBadges("all", " 南京 ")).toEqual([{ label: "搜索", value: "南京" }]);
    expect(getCstdProjectControlBadges("operations", " CRM ")).toEqual([
      { label: "分类", value: "运营系统" },
      { label: "搜索", value: "CRM" },
    ]);
  });

  test("parses project directory state from URL parameters", () => {
    expect(parseCstdProjectDirectoryState("?category=creative&q=%E5%8D%97%E4%BA%AC")).toEqual({
      filter: "creative",
      query: "南京",
    });
    expect(parseCstdProjectDirectoryState("?category=unknown&q=%20CRM%20")).toEqual({
      filter: "all",
      query: "CRM",
    });
    expect(parseCstdProjectDirectoryState("")).toEqual({
      filter: "all",
      query: "",
    });
  });

  test("builds shareable project directory state hrefs", () => {
    expect(buildCstdProjectDirectoryStateHref("/cstd", "operations", "招商")).toBe("/cstd?category=operations&q=%E6%8B%9B%E5%95%86#projects");
    expect(buildCstdProjectDirectoryStateHref("/cstd", "all", "")).toBe("/cstd#projects");
    expect(buildCstdProjectDirectoryStateHref("/cstd", "all", " CRM ")).toBe("/cstd?q=CRM#projects");
  });

  test("builds absolute share urls for the current project directory view", () => {
    expect(buildCstdProjectDirectoryShareUrl("https://custard.top/", "/cstd", "creative", "南京")).toBe(
      "https://custard.top/cstd?category=creative&q=%E5%8D%97%E4%BA%AC#projects",
    );
    expect(buildCstdProjectDirectoryShareUrl("https://custard.top", "/cstd", "all", "")).toBe("https://custard.top/cstd#projects");
  });
});
