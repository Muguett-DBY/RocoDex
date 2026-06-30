import { describe, expect, it } from "vitest";

import {
  cstdProjectGuides,
  getCstdProjectGuide,
  getCstdProjectGuideCopyMessage,
  getCstdProjectGuideCopyPresentation,
  getCstdProjectGuideDirectoryContinuation,
  getCstdProjectGuideRestoredReceipt,
  getCstdProjectGuideSummary,
} from "./cstd-project-guide";
import { cstdProjects } from "./cstd-projects";

describe("CSTD project guide", () => {
  it("routes every visitor goal to an existing project", () => {
    const projectIds = new Set(cstdProjects.map((project) => project.id));

    expect(cstdProjectGuides.length).toBeGreaterThanOrEqual(4);
    expect(cstdProjectGuides.every((guide) => projectIds.has(guide.projectId))).toBe(true);
  });

  it("covers the homepage's core visitor intents", () => {
    expect(cstdProjectGuides.map((guide) => guide.projectId)).toEqual(
      expect.arrayContaining(["rocodex", "photography", "alpha", "design", "crm"]),
    );
    expect(cstdProjectGuides.map((guide) => guide.goal).join(" ")).toContain("招商");
    expect(cstdProjectGuides.map((guide) => guide.goal).join(" ")).toContain("AI 创作");
    expect(cstdProjectGuides.map((guide) => guide.goal).join(" ")).toContain("写真");
  });

  it("uses stable ids and resolves a selected goal safely", () => {
    expect(cstdProjectGuides.map((guide) => guide.id)).toEqual([
      "game-data",
      "portrait-shooting",
      "company-research",
      "ai-creation",
      "park-operations",
    ]);
    expect(getCstdProjectGuide("ai-creation")?.projectId).toBe("design");
    expect(getCstdProjectGuide("unknown")).toBeNull();
    expect(getCstdProjectGuide(null)).toBeNull();
  });

  it("summarizes live project coverage for first-scan guide copy", () => {
    expect(getCstdProjectGuideSummary(cstdProjectGuides, cstdProjects)).toEqual({
      allLiveProjectsCovered: true,
      goalCount: 5,
      label: "5 条路径",
      liveProjectCount: 5,
      matchedLiveProjectCount: 5,
      summary: "5 条目标路径覆盖 5 / 5 个上线项目",
      uncoveredLiveProjectTitles: [],
    });
  });

  it("builds a directory continuation from the selected goal", () => {
    expect(getCstdProjectGuideDirectoryContinuation(getCstdProjectGuide("portrait-shooting"), cstdProjects)).toEqual({
      category: "creative",
      categoryLabel: "创作影像",
      projectCount: 2,
      projectTitle: "奶黄包摄影",
      summary: "在 2 个创作影像项目中继续比较",
    });
    expect(getCstdProjectGuideDirectoryContinuation(getCstdProjectGuide("game-data"), cstdProjects)).toMatchObject({
      category: "data",
      categoryLabel: "数据工具",
      projectCount: 1,
      summary: "在项目目录中查看数据工具",
    });
    expect(getCstdProjectGuideDirectoryContinuation(null, cstdProjects)).toBeNull();
  });

  it("presents goal-share clipboard outcomes at the point of action", () => {
    expect(getCstdProjectGuideCopyMessage(null, "预约南京写真或情侣约拍")).toBeNull();
    expect(getCstdProjectGuideCopyMessage("copied", "预约南京写真或情侣约拍")).toBe(
      "预约南京写真或情侣约拍的目标路径已复制",
    );
    expect(getCstdProjectGuideCopyMessage("unsupported", "预约南京写真或情侣约拍")).toBe(
      "浏览器不支持自动复制，请手动复制下方目标路径",
    );
    expect(getCstdProjectGuideCopyMessage("failed", "预约南京写真或情侣约拍")).toBe(
      "目标路径复制失败，请手动复制下方链接",
    );
  });

  it("marks failed goal-share copy outcomes as manual-copy warnings", () => {
    expect(getCstdProjectGuideCopyPresentation("copied", "预约南京写真或情侣约拍")).toEqual({
      message: "预约南京写真或情侣约拍的目标路径已复制",
      requiresManualCopy: false,
      tone: "success",
    });
    expect(getCstdProjectGuideCopyPresentation("unsupported", "预约南京写真或情侣约拍")).toEqual({
      message: "浏览器不支持自动复制，请手动复制下方目标路径",
      requiresManualCopy: true,
      tone: "warning",
    });
    expect(getCstdProjectGuideCopyPresentation("failed", "预约南京写真或情侣约拍")).toEqual({
      message: "目标路径复制失败，请手动复制下方链接",
      requiresManualCopy: true,
      tone: "warning",
    });
  });

  it("explains restored goal-share links without changing their URL contract", () => {
    expect(getCstdProjectGuideRestoredReceipt(getCstdProjectGuide("portrait-shooting"), "奶黄包摄影")).toEqual({
      detail: "预约南京写真或情侣约拍已从分享链接恢复，当前推荐奶黄包摄影。",
      label: "目标路径已恢复",
    });
    expect(getCstdProjectGuideRestoredReceipt(null, "奶黄包摄影")).toBeNull();
    expect(getCstdProjectGuideRestoredReceipt(getCstdProjectGuide("portrait-shooting"), "")).toBeNull();
  });
});
