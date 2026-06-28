import { describe, expect, test } from "vitest";

import { getCstdProjectComparisonContext } from "./cstd-project-comparison-context";

describe("CSTD project comparison context", () => {
  test("summarizes a goal-backed comparison", () => {
    expect(
      getCstdProjectComparisonContext({
        guideGoal: "整理 AI 创作素材",
        projectTitles: ["私人 AI 创作工作台", "区域招商 CRM"],
      }),
    ).toEqual({
      goalLabel: "目标路径：整理 AI 创作素材",
      projectLabel: "对比项目：私人 AI 创作工作台 / 区域招商 CRM",
    });
  });

  test("keeps manual comparisons self-contained without a selected goal", () => {
    expect(
      getCstdProjectComparisonContext({
        guideGoal: null,
        projectTitles: ["私人 AI 创作工作台"],
      }),
    ).toEqual({
      goalLabel: "目标路径：手动选择",
      projectLabel: "对比项目：私人 AI 创作工作台",
    });
  });
});
