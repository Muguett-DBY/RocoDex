import { describe, expect, test } from "vitest";

import { getCstdProjectComparisonContext, getCstdProjectComparisonRestoredContinuation } from "./cstd-project-comparison-context";
import { getCstdProjectComparisonNextStep } from "./cstd-project-comparison-next-step";
import { cstdProjectGuides } from "./cstd-project-guide";
import { cstdProjects } from "./cstd-projects";

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
      receipt: null,
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
      receipt: null,
    });
  });

  test("marks restored goal-backed comparison links as recovered from the URL", () => {
    expect(
      getCstdProjectComparisonContext({
        guideGoal: "整理 AI 创作素材",
        projectTitles: ["私人 AI 创作工作台", "区域招商 CRM"],
        restoredFromUrl: true,
      }),
    ).toEqual({
      goalLabel: "目标路径：整理 AI 创作素材",
      projectLabel: "对比项目：私人 AI 创作工作台 / 区域招商 CRM",
      receipt: {
        label: "分享视图已恢复",
        detail: "目标路径与 2 个对比项目已从链接恢复，可直接查看判断。",
      },
    });
  });

  test("marks restored manual comparison links without implying a selected goal", () => {
    expect(
      getCstdProjectComparisonContext({
        guideGoal: null,
        projectTitles: ["私人 AI 创作工作台"],
        restoredFromUrl: true,
      }).receipt,
    ).toEqual({
      label: "分享视图已恢复",
      detail: "手动选择与 1 个对比项目已从链接恢复，可直接查看判断。",
    });
  });

  test("turns restored comparison links into a continuation handoff", () => {
    const guide = cstdProjectGuides.find((item) => item.id === "ai-creation")!;
    const selectedProjects = cstdProjects.filter((project) => ["design", "crm"].includes(project.id));
    const nextStep = getCstdProjectComparisonNextStep(guide, cstdProjects, selectedProjects);

    expect(getCstdProjectComparisonRestoredContinuation({ restoredFromUrl: true, nextStep })).toEqual({
      label: "继续：查看目标直达案例",
      detail: "优先查看私人 AI 创作工作台",
    });
  });

  test("does not create a restored continuation for ordinary comparison sessions", () => {
    const nextStep = getCstdProjectComparisonNextStep(null, cstdProjects, cstdProjects.slice(0, 2));

    expect(getCstdProjectComparisonRestoredContinuation({ restoredFromUrl: false, nextStep })).toBeNull();
  });
});
