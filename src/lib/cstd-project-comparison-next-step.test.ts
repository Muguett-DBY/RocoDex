import { describe, expect, test } from "vitest";
import { cstdProjectGuides } from "./cstd-project-guide";
import {
  alignCstdProjectComparisonIds,
  getCstdProjectComparisonNextStep,
} from "./cstd-project-comparison-next-step";
import { cstdProjects } from "./cstd-projects";

const aiGuide = cstdProjectGuides.find((guide) => guide.id === "ai-creation")!;

describe("getCstdProjectComparisonNextStep", () => {
  test("opens the direct case study and live project when the goal target is selected", () => {
    const selectedProjects = cstdProjects.filter((project) => ["design", "crm"].includes(project.id));

    expect(getCstdProjectComparisonNextStep(aiGuide, cstdProjects, selectedProjects)).toEqual({
      kind: "focus",
      eyebrow: "Decision next",
      title: "优先查看私人 AI 创作工作台",
      detail: aiGuide.reason,
      primaryLabel: "查看目标直达案例",
      secondaryLabel: "打开工作台",
      project: {
        id: "design",
        title: "私人 AI 创作工作台",
        href: "https://design.custard.top",
        action: "打开工作台",
      },
    });
  });

  test("offers to align the comparison when the goal target is missing", () => {
    const selectedProjects = cstdProjects.filter((project) => ["crm", "alpha"].includes(project.id));

    expect(getCstdProjectComparisonNextStep(aiGuide, cstdProjects, selectedProjects)).toMatchObject({
      kind: "align",
      title: "对比缺少私人 AI 创作工作台",
      primaryLabel: "补入目标直达项目",
      project: { id: "design" },
    });
  });

  test("returns to goal selection instead of guessing without a guide", () => {
    expect(getCstdProjectComparisonNextStep(null, cstdProjects, cstdProjects.slice(0, 2))).toEqual({
      kind: "select-goal",
      eyebrow: "Decision next",
      title: "先选择目标路径",
      detail: "选择目标后，这里会给出直达案例和线上项目入口。",
      primaryLabel: "选择目标路径",
      project: null,
    });
  });

  test("falls back safely when a guide target is absent from the catalog", () => {
    expect(
      getCstdProjectComparisonNextStep(
        { goal: "未知目标", reason: "未知原因", projectId: "missing" },
        cstdProjects,
        cstdProjects.slice(0, 2),
      ),
    ).toMatchObject({
      kind: "select-goal",
      title: "目标项目暂不可用",
      project: null,
    });
  });
});

describe("alignCstdProjectComparisonIds", () => {
  test("keeps the direct target first and retains one existing reference", () => {
    expect(alignCstdProjectComparisonIds(["crm", "alpha"], "design")).toEqual(["design", "crm"]);
    expect(alignCstdProjectComparisonIds(["design", "crm"], "design")).toEqual(["design", "crm"]);
    expect(alignCstdProjectComparisonIds(["design"], "design")).toEqual(["design"]);
  });
});
