import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import {
  CSTD_PROJECT_COMPARISON_LIMIT,
  getCstdProjectComparison,
  getCstdProjectComparisonControl,
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
});
