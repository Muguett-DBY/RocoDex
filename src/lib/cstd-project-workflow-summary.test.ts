import { describe, expect, test } from "vitest";

import { getCstdProjectWorkflowAction, getCstdProjectWorkflowSummary } from "./cstd-project-workflow-summary";

describe("CSTD project workflow summary", () => {
  test("summarizes the active goal, evidence, comparison, and share state", () => {
    expect(
      getCstdProjectWorkflowSummary({
        compareCount: 2,
        compareLimit: 2,
        guideGoal: "整理 AI 创作素材",
        liveEvidenceCount: 5,
        totalProjectCount: 6,
        visibleProjectCount: 3,
      }),
    ).toEqual([
      {
        id: "goal",
        href: "#project-guide",
        label: "目标路径",
        value: "整理 AI 创作素材",
        detail: "已匹配推荐项目",
      },
      {
        id: "evidence",
        href: "#project-evidence",
        label: "证据底座",
        value: "5 个上线项目",
        detail: "角色、问题、结果可核对",
      },
      {
        id: "comparison",
        href: "#project-comparison",
        label: "对比决策",
        value: "2 / 2",
        detail: "对比矩阵已就绪",
      },
      {
        id: "directory",
        href: "#project-directory",
        label: "当前目录",
        value: "3 / 6",
        detail: "筛选、目标和对比可分享",
      },
    ]);
  });

  test("shows next actions when no goal or complete comparison is selected", () => {
    const summary = getCstdProjectWorkflowSummary({
      compareCount: 1,
      compareLimit: 2,
      guideGoal: null,
      liveEvidenceCount: 5,
      totalProjectCount: 6,
      visibleProjectCount: 6,
    });

    expect(summary[0]).toMatchObject({
      value: "先选目标",
      detail: "按意图进入项目路径",
    });
    expect(summary[2]).toMatchObject({
      href: "#project-comparison",
      value: "1 / 2",
      detail: "再选 1 个项目",
    });
  });

  test("routes an empty comparison summary to the project directory", () => {
    const summary = getCstdProjectWorkflowSummary({
      compareCount: 0,
      compareLimit: 2,
      guideGoal: null,
      liveEvidenceCount: 5,
      totalProjectCount: 6,
      visibleProjectCount: 6,
    });

    expect(summary[2]).toMatchObject({
      href: "#project-directory",
      value: "0 / 2",
    });
  });
});

describe("CSTD project workflow action", () => {
  test("starts with goal matching when no goal is selected", () => {
    expect(
      getCstdProjectWorkflowAction({
        compareCount: 0,
        compareLimit: 2,
        hasGuide: false,
      }),
    ).toEqual({
      href: "#project-guide",
      label: "先选择访问目标",
      detail: "从 4 条目标路径开始",
    });
  });

  test("returns to the recommendation when a goal has no comparison project", () => {
    expect(
      getCstdProjectWorkflowAction({
        compareCount: 0,
        compareLimit: 2,
        hasGuide: true,
      }),
    ).toEqual({
      href: "#project-guide",
      label: "加入推荐项目",
      detail: "把当前匹配放入对比矩阵",
    });
  });

  test("sends an incomplete comparison to the directory", () => {
    expect(
      getCstdProjectWorkflowAction({
        compareCount: 1,
        compareLimit: 2,
        hasGuide: true,
      }),
    ).toEqual({
      href: "#project-directory",
      label: "再选 1 个对比项目",
      detail: "从项目目录补齐决策证据",
    });
  });

  test("opens the comparison matrix when it is ready", () => {
    expect(
      getCstdProjectWorkflowAction({
        compareCount: 2,
        compareLimit: 2,
        hasGuide: true,
      }),
    ).toEqual({
      href: "#project-comparison",
      label: "查看对比矩阵",
      detail: "并排核对角色、问题与结果",
    });
  });
});
