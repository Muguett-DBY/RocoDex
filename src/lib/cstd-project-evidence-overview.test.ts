import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import { getCstdProjectEvidenceOverview } from "./cstd-project-evidence-overview";

describe("CSTD project evidence overview", () => {
  test("summarizes live delivery evidence for homepage scanning", () => {
    const overview = getCstdProjectEvidenceOverview(cstdProjects);

    expect(overview.stats).toEqual([
      { value: "5", label: "已上线项目" },
      { value: "5", label: "完整案例证据" },
      { value: "4", label: "核心使用场景" },
    ]);
    expect(overview.summary).toBe("5 个已上线项目都有角色、问题、交付和当前状态证据");
  });
});
