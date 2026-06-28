import { describe, expect, test } from "vitest";
import { cstdProjectGuides } from "./cstd-project-guide";
import { getCstdProjectComparisonFit } from "./cstd-project-comparison-fit";
import { cstdProjects } from "./cstd-projects";

const designProject = cstdProjects.find((project) => project.id === "design")!;
const crmProject = cstdProjects.find((project) => project.id === "crm")!;
const alphaProject = cstdProjects.find((project) => project.id === "alpha")!;
const aiGuide = cstdProjectGuides.find((guide) => guide.id === "ai-creation")!;

describe("getCstdProjectComparisonFit", () => {
  test("marks the guide project as the direct match and other projects as references", () => {
    expect(getCstdProjectComparisonFit(aiGuide, [designProject, crmProject])).toEqual({
      summary: "整理 AI 创作素材：私人 AI 创作工作台是当前目标直达项目",
      items: [
        {
          projectId: "design",
          title: "私人 AI 创作工作台",
          kind: "direct",
          label: "目标直达",
          detail: "用私人工作台连接对话、图片、视频和素材库。",
        },
        {
          projectId: "crm",
          title: "产业园区招商 CRM",
          kind: "reference",
          label: "横向参照",
          detail: "当前目标不直接指向该项目；保留用于对照业务建模、权限设计与全栈交付的交付证据。",
        },
      ],
    });
  });

  test("states when the direct match is not in the comparison", () => {
    expect(getCstdProjectComparisonFit(aiGuide, [crmProject, alphaProject]).summary).toBe(
      "整理 AI 创作素材：当前对比未包含目标直达项目",
    );
  });

  test("keeps every project unscoped until a goal is selected", () => {
    expect(getCstdProjectComparisonFit(null, [designProject, crmProject])).toEqual({
      summary: "尚未选择目标路径，当前仅按项目证据横向对照",
      items: [
        {
          projectId: "design",
          title: "私人 AI 创作工作台",
          kind: "unscoped",
          label: "待选目标",
          detail: "先选择目标路径，再判断该项目是否直接匹配。",
        },
        {
          projectId: "crm",
          title: "产业园区招商 CRM",
          kind: "unscoped",
          label: "待选目标",
          detail: "先选择目标路径，再判断该项目是否直接匹配。",
        },
      ],
    });
  });
});
