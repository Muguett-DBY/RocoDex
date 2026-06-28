import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import {
  CSTD_PROJECT_COMPARISON_LIMIT,
  buildCstdProjectComparisonBrief,
  getCstdProjectComparison,
  getCstdProjectComparisonControl,
  normalizeCstdProjectComparisonIds,
  toggleCstdProjectComparison,
} from "./cstd-project-comparison";

describe("CSTD project comparison", () => {
  test("adds, removes, and limits comparison selections", () => {
    expect(toggleCstdProjectComparison([], "design")).toEqual(["design"]);
    expect(toggleCstdProjectComparison(["design"], "crm")).toEqual(["design", "crm"]);
    expect(toggleCstdProjectComparison(["design", "crm"], "rocodex")).toEqual(["design", "crm"]);
    expect(toggleCstdProjectComparison(["design", "crm"], "design")).toEqual(["crm"]);
    expect(CSTD_PROJECT_COMPARISON_LIMIT).toBe(2);
  });

  test("builds an ordered decision matrix from existing live project evidence", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["design", "crm", "unknown"]);

    expect(comparison.summary).toBe("已选择 2 / 2 个项目");
    expect(comparison.ready).toBe(true);
    expect(comparison.projects.map((project) => project.id)).toEqual(["design", "crm"]);
    expect(comparison.rows).toEqual([
      { label: "项目类型", values: ["AI creation", "CRM system"] },
      { label: "当前状态", values: ["持续扩展创作与素材能力", "生产环境持续验证与迭代"] },
      { label: "负责", values: ["产品架构、生成流程与全栈开发", "业务建模、权限设计与全栈交付"] },
      {
        label: "已交付",
        values: [
          "交付私有访问的一体化工作台，并把生成记录与素材资产纳入同一套管理流程。",
          "交付覆盖线索全周期、空间资源、导入导出、软删除恢复和角色权限的运营系统。",
        ],
      },
      { label: "技术标签", values: ["React 19 · Cloudflare Pages · D1 + R2", "React 19 · Hono · Cloudflare Pages"] },
    ]);
  });

  test("ignores incubating projects and reports an incomplete selection", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["incubator", "rocodex"]);

    expect(comparison.summary).toBe("已选择 1 / 2 个项目");
    expect(comparison.ready).toBe(false);
    expect(comparison.projects.map((project) => project.id)).toEqual(["rocodex"]);
  });

  test("keeps selected projects removable when the comparison limit is reached", () => {
    expect(getCstdProjectComparisonControl(["design", "crm"], "design")).toEqual({
      disabled: false,
      label: "移出对比",
      selected: true,
    });
    expect(getCstdProjectComparisonControl(["design", "crm"], "rocodex")).toEqual({
      disabled: true,
      label: "对比已满",
      selected: false,
    });
    expect(getCstdProjectComparisonControl(["design"], "crm")).toEqual({
      disabled: false,
      label: "加入对比",
      selected: false,
    });
  });

  test("normalizes comparison ids to unique live projects in order", () => {
    expect(normalizeCstdProjectComparisonIds(["design", "incubator", "design", "crm", "unknown", "rocodex"])).toEqual([
      "design",
      "crm",
    ]);
    expect(getCstdProjectComparisonControl(["incubator", "design"], "crm")).toEqual({
      disabled: false,
      label: "加入对比",
      selected: false,
    });
    expect(toggleCstdProjectComparison(["incubator", "design"], "crm")).toEqual(["design", "crm"]);
  });

  test("builds a copyable comparison decision brief with matrix evidence", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["design", "crm"]);

    expect(
      buildCstdProjectComparisonBrief({
        comparison,
        goalLabel: "目标路径：整理 AI 创作素材",
        projectLabel: "对比项目：私人 AI 创作工作台 / 产业园区招商 CRM",
        url: "https://custard.top/cstd?goal=ai-creation&compare=design%2Ccrm#project-comparison",
      }),
    ).toBe(
      [
        "custard.top 项目对比摘要",
        "目标路径：整理 AI 创作素材",
        "对比项目：私人 AI 创作工作台 / 产业园区招商 CRM",
        "状态：已选择 2 / 2 个项目",
        "链接：https://custard.top/cstd?goal=ai-creation&compare=design%2Ccrm#project-comparison",
        "",
        "项目类型",
        "- 私人 AI 创作工作台：AI creation",
        "- 产业园区招商 CRM：CRM system",
        "",
        "当前状态",
        "- 私人 AI 创作工作台：持续扩展创作与素材能力",
        "- 产业园区招商 CRM：生产环境持续验证与迭代",
        "",
        "负责",
        "- 私人 AI 创作工作台：产品架构、生成流程与全栈开发",
        "- 产业园区招商 CRM：业务建模、权限设计与全栈交付",
        "",
        "已交付",
        "- 私人 AI 创作工作台：交付私有访问的一体化工作台，并把生成记录与素材资产纳入同一套管理流程。",
        "- 产业园区招商 CRM：交付覆盖线索全周期、空间资源、导入导出、软删除恢复和角色权限的运营系统。",
        "",
        "技术标签",
        "- 私人 AI 创作工作台：React 19 · Cloudflare Pages · D1 + R2",
        "- 产业园区招商 CRM：React 19 · Hono · Cloudflare Pages",
      ].join("\n"),
    );
  });

  test("keeps incomplete comparison briefs honest", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["design"]);

    expect(
      buildCstdProjectComparisonBrief({
        comparison,
        goalLabel: "目标路径：手动选择",
        projectLabel: "对比项目：私人 AI 创作工作台",
        url: null,
      }),
    ).toContain("下一步：再选择 1 个已上线项目即可形成完整对比。");
  });
});
