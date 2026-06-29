import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("./cstd-landing.tsx", import.meta.url), "utf8");

describe("CSTD landing URL state sync", () => {
  test("does not frame-delay initial deep-link restoration", () => {
    expect(source).toContain('const useCstdClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;');
    expect(source).toContain("useCstdClientLayoutEffect(() => {");
    expect(source).toContain("const [projectViewStateSynced, setProjectViewStateSynced] = useState(false);");
    expect(source).toContain("setProjectViewStateSynced(true);");
    expect(source).toContain("{projectViewStateSynced ? (");
    expect(source).not.toContain("requestAnimationFrame(syncViewState)");
  });

  test("guards clipboard access for browser environments without navigator", () => {
    expect(source).toContain("function getCstdClipboardWriter()");
    expect(source).toContain('if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return undefined;');
    expect(source).not.toContain("navigator.clipboard ?");
  });

  test("renders the tested goal-fit model in the comparison and copied brief", () => {
    expect(source).toContain("getCstdProjectComparisonFit(selectedGuide, projectComparison.projects)");
    expect(source).toContain("fit: projectComparisonFit");
    expect(source).toContain("fit={projectComparisonFit}");
    expect(source).toContain('aria-label="目标匹配判断"');
  });

  test("restores the comparison hash after conditional comparison content renders", () => {
    expect(source).toContain('window.location.hash !== "#project-comparison"');
    expect(source).toContain('document.getElementById("project-comparison")?.scrollIntoView({ block: "start" });');
    expect(source).toContain("[projectComparison.projects.length, projectViewStateSynced]");
  });

  test("renders a scan-first comparison summary with fit-aware selected projects", () => {
    expect(source).toContain("getCstdProjectComparisonScanSummary(projectComparison, projectComparisonFit)");
    expect(source).toContain("scanSummary={projectComparisonScanSummary}");
    expect(source).toContain('aria-label="对比扫读摘要"');
    expect(source).toContain("fitItemsByProjectId");
  });

  test("turns the comparison decision into a goal-aligned next action", () => {
    expect(source).toContain("getCstdProjectComparisonNextStep(selectedGuide, cstdProjects, projectComparison.projects)");
    expect(source).toContain("nextStep={projectComparisonNextStep}");
    expect(source).toContain('aria-label="对比下一步"');
    expect(source).toContain("onFocus={focusProject}");
    expect(source).toContain("onAlign={alignProjectComparisonToGoal}");
  });

  test("keeps comparison-originated selection changes on the comparison hash", () => {
    expect(source).toContain('updateProjectComparison(nextComparedProjectIds, "project-comparison")');
    expect(source).toContain('updateProjectComparison(nextIds, "project-comparison")');
  });
});
