import { describe, expect, test } from "vitest";

import { getCstdProjectWorkflowSummary } from "./cstd-project-workflow-summary";

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
        label: "目标路径",
        value: "整理 AI 创作素材",
        detail: "已匹配推荐项目",
      },
      {
        id: "evidence",
        label: "证据底座",
        value: "5 个上线项目",
        detail: "角色、问题、结果可核对",
      },
      {
        id: "comparison",
        label: "对比决策",
        value: "2 / 2",
        detail: "对比矩阵已就绪",
      },
      {
        id: "directory",
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
      value: "1 / 2",
      detail: "再选 1 个项目",
    });
  });
});
