import { describe, expect, it } from "vitest";

import { cstdProjectGuides, getCstdProjectGuide, getCstdProjectGuideSummary } from "./cstd-project-guide";
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
});
