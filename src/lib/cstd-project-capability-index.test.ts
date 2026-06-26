import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import { getCstdProjectCapabilityIndex } from "./cstd-project-capability-index";

describe("CSTD project capability index", () => {
  test("groups live projects into useful portfolio capability lanes", () => {
    const index = getCstdProjectCapabilityIndex(cstdProjects);

    expect(index.summary).toBe("3 条能力线覆盖产品工程、AI 创作研究和运营系统");
    expect(index.lanes.map((lane) => lane.label)).toEqual(["产品工程", "AI 创作与研究", "运营系统"]);
    expect(index.lanes[0].projectIds).toEqual(["rocodex", "crm"]);
    expect(index.lanes[1].projectIds).toEqual(["design", "alpha"]);
    expect(index.lanes[2].projectIds).toEqual(["crm"]);
    expect(index.lanes.every((lane) => lane.projects.every((project) => project.status === "Live"))).toBe(true);
  });
});
