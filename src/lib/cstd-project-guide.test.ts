import { describe, expect, it } from "vitest";

import { cstdProjectGuides } from "./cstd-project-guide";
import { cstdProjects } from "./cstd-projects";

describe("CSTD project guide", () => {
  it("routes every visitor goal to an existing project", () => {
    const projectIds = new Set(cstdProjects.map((project) => project.id));

    expect(cstdProjectGuides.length).toBeGreaterThanOrEqual(4);
    expect(cstdProjectGuides.every((guide) => projectIds.has(guide.projectId))).toBe(true);
  });

  it("covers the homepage's core visitor intents", () => {
    expect(cstdProjectGuides.map((guide) => guide.projectId)).toEqual(
      expect.arrayContaining(["rocodex", "alpha", "design", "crm"]),
    );
    expect(cstdProjectGuides.map((guide) => guide.goal).join(" ")).toContain("招商");
    expect(cstdProjectGuides.map((guide) => guide.goal).join(" ")).toContain("AI 创作");
  });
});
