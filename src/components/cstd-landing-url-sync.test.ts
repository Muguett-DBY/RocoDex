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
    expect(source).toContain('const comparisonSection = document.getElementById("project-comparison");');
    expect(source).toContain('comparisonSection.scrollIntoView({ block: "start" });');
    expect(source).toContain("if (!comparisonCompletionHandoffPendingRef.current) return;");
    expect(source).toContain('document.getElementById("project-comparison-heading")?.focus({ preventScroll: true });');
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

  test("uses full restored project view state to suppress the automatic intro", () => {
    expect(source).toContain("hasActiveCstdProjectViewState(window.location.search)");
    expect(source).toContain("hasProjectViewState");
    expect(source).not.toContain("parseCstdProjectViewState(window.location.search).projectId !== null");
    expect(source).not.toContain("hasProjectFocus");
  });

  test("surfaces restored comparison links in the comparison header", () => {
    expect(source).toContain("projectViewStateRestoredFromUrl");
    expect(source).toContain("const hasRestoredProjectViewState = hasActiveCstdProjectViewState(window.location.search);");
    expect(source).toContain("setProjectViewStateRestoredFromUrl(hasRestoredProjectViewState && viewState.compareProjectIds.length > 0);");
    expect(source).toContain("restoredFromUrl={projectViewStateRestoredFromUrl}");
    expect(source).toContain('aria-label="分享视图恢复状态"');
  });

  test("makes restored comparison links actionable from the comparison header", () => {
    expect(source).toContain("getCstdProjectComparisonRestoredContinuation");
    expect(source).toContain("const restoredContinuation = context.receipt ? getCstdProjectComparisonRestoredContinuation({");
    expect(source).toContain('aria-label="分享对比恢复下一步"');
    expect(source).toContain("restoredContinuation.label");
    expect(source).toContain("inline-flex min-h-11 w-full");
    expect(source).toContain("onClick={handleNextStep}");
  });

  test("surfaces restored directory and project-focus links in their existing surfaces", () => {
    expect(source).toContain("projectDirectoryRestoredFromUrl");
    expect(source).toContain("projectFocusRestoredFromUrl");
    expect(source).toContain("setProjectDirectoryRestoredFromUrl(hasRestoredProjectViewState && (viewState.filter !== \"all\" || viewState.query.length > 0));");
    expect(source).toContain("setProjectFocusRestoredFromUrl(hasRestoredProjectViewState && viewState.projectId !== null);");
    expect(source).toContain("getCstdProjectDirectoryRestoredReceipt");
    expect(source).toContain("getCstdProjectFocusRestoredReceipt");
    expect(source).toContain('statusLabel="筛选视图恢复状态"');
    expect(source).toContain('statusLabel="分享案例恢复状态"');
  });

  test("clears restored-link receipts after manual state changes", () => {
    expect(source).toContain("clearRestoredProjectViewReceipts();");
    expect(source).toContain("setProjectDirectoryRestoredFromUrl(false);");
    expect(source).toContain("setProjectFocusRestoredFromUrl(false);");
    expect(source).toContain("setProjectViewStateRestoredFromUrl(false);");
  });

  test("makes restored directory and focus entry points actionable", () => {
    expect(source).toContain("getCstdProjectDirectoryRestoredAction");
    expect(source).toContain("getCstdProjectFocusRestoredAction");
    expect(source).toContain("projectDirectoryRestoredAction");
    expect(source).toContain("selectedProjectRestoredAction");
    expect(source).toContain('nextLabel="恢复筛选下一步"');
    expect(source).toContain('nextLabel="恢复案例下一步"');
    expect(source).toContain("onClick={handleRestoredDirectoryAction}");
    expect(source).toContain("restoredAction={selectedProjectRestoredAction}");
  });

  test("uses one accessible handoff pattern for restored entry points", () => {
    expect(source).toContain("function RestoredEntryHandoff");
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('statusLabel="筛选视图恢复状态"');
    expect(source).toContain('nextLabel="恢复筛选下一步"');
    expect(source).toContain('statusLabel="分享案例恢复状态"');
    expect(source).toContain('nextLabel="恢复案例下一步"');
  });

  test("completes restored case copy and continuation inside the handoff", () => {
    expect(source).toContain("getCstdProjectBriefCopyPresentation");
    expect(source).toContain("copyPresentation={briefCopyPresentation}");
    expect(source).toContain("fallbackText={projectBriefText}");
    expect(source).toContain("secondaryAction={{");
    expect(source).toContain("href: project.href");
    expect(source).toContain('aria-label={`${statusLabel}手动复制文本`}');
    expect(source).toContain("!restoredReceipt && briefCopyResult");
  });
});
