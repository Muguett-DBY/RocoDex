import { describe, expect, test } from "vitest";
import { getCstdProjectComparison } from "./cstd-project-comparison";
import { getCstdProjectComparisonFit } from "./cstd-project-comparison-fit";
import { cstdProjectGuides } from "./cstd-project-guide";
import { getCstdProjectComparisonScanSummary } from "./cstd-project-comparison-scan";
import { cstdProjects } from "./cstd-projects";

const aiGuide = cstdProjectGuides.find((guide) => guide.id === "ai-creation")!;

describe("getCstdProjectComparisonScanSummary", () => {
  test("summarizes a direct match, reference project, and aligned evidence count", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["design", "crm"]);
    const fit = getCstdProjectComparisonFit(aiGuide, comparison.projects);

    expect(getCstdProjectComparisonScanSummary(comparison, fit)).toEqual([
      {
        id: "direct",
        label: "目标命中",
        value: "私人 AI 创作工作台",
        tone: "direct",
      },
      {
        id: "reference",
        label: "横向参照",
        value: "产业园区招商 CRM",
        tone: "reference",
      },
      {
        id: "evidence",
        label: "证据维度",
        value: "5 项已对齐",
        tone: "evidence",
      },
    ]);
  });

  test("keeps scan labels unscoped before a goal is selected", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["design", "crm"]);
    const fit = getCstdProjectComparisonFit(null, comparison.projects);

    expect(getCstdProjectComparisonScanSummary(comparison, fit)[0]).toEqual({
      id: "direct",
      label: "目标命中",
      value: "先选择目标",
      tone: "unscoped",
    });
    expect(getCstdProjectComparisonScanSummary(comparison, fit)[1]).toEqual({
      id: "reference",
      label: "横向参照",
      value: "2 个待判断项目",
      tone: "unscoped",
    });
  });

  test("states when the direct project is absent from the comparison", () => {
    const comparison = getCstdProjectComparison(cstdProjects, ["crm", "alpha"]);
    const fit = getCstdProjectComparisonFit(aiGuide, comparison.projects);

    expect(getCstdProjectComparisonScanSummary(comparison, fit)[0]).toEqual({
      id: "direct",
      label: "目标命中",
      value: "未包含直达项目",
      tone: "unscoped",
    });
  });
});
