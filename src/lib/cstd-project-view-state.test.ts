import { describe, expect, it } from "vitest";

import {
  buildCstdProjectGuideShareHref,
  buildCstdProjectViewHref,
  getCstdProjectDirectoryRestoredAction,
  getCstdProjectDirectoryRestoredReceipt,
  getCstdProjectFocusRestoredAction,
  getCstdProjectFocusRestoredReceipt,
  hasActiveCstdProjectViewState,
  isCstdProjectGuideShareRestored,
  parseCstdProjectViewState,
  type CstdProjectViewHash,
} from "./cstd-project-view-state";

describe("CSTD project view state", () => {
  it("parses directory, goal, and focused project state from one URL", () => {
    expect(
      parseCstdProjectViewState("?category=operations&q=CRM&goal=park-operations&project=crm&compare=design,crm"),
    ).toEqual({
      filter: "operations",
      query: "CRM",
      guideId: "park-operations",
      projectId: "crm",
      compareProjectIds: ["design", "crm"],
    });
  });

  it("drops invalid values without discarding a valid search query", () => {
    expect(parseCstdProjectViewState("?category=nope&q=%20AI%20&goal=nope&project=nope&compare=incubator,design,design,unknown")).toEqual({
      filter: "all",
      query: "AI",
      guideId: null,
      projectId: null,
      compareProjectIds: ["design"],
    });
  });

  it("serializes only active state and preserves context for project focus", () => {
    expect(
      buildCstdProjectViewHref(
        "/cstd",
        {
          filter: "creative",
          query: "AI",
          guideId: "ai-creation",
          projectId: "design",
          compareProjectIds: ["design", "crm"],
        },
        "project-focus",
      ),
    ).toBe("/cstd?category=creative&q=AI&goal=ai-creation&project=design&compare=design%2Ccrm#project-focus");

    expect(
      buildCstdProjectViewHref("/", {
        filter: "all",
        query: "",
        guideId: null,
        projectId: null,
        compareProjectIds: [],
      }),
    ).toBe("/#projects");
  });

  it("serializes comparison matrix anchors for decision handoffs", () => {
    expect(
      buildCstdProjectViewHref(
        "/cstd",
        {
          filter: "all",
          query: "",
          guideId: "ai-creation",
          projectId: null,
          compareProjectIds: ["design", "crm"],
        },
        "project-comparison",
      ),
    ).toBe("/cstd?goal=ai-creation&compare=design%2Ccrm#project-comparison");
  });

  it("serializes the goal guide anchor without dropping comparison context", () => {
    const guideHash: CstdProjectViewHash = "project-guide";

    expect(
      buildCstdProjectViewHref(
        "/cstd",
        {
          filter: "all",
          query: "",
          guideId: null,
          projectId: null,
          compareProjectIds: ["rocodex", "photography"],
        },
        guideHash,
      ),
    ).toBe("/cstd?compare=rocodex%2Cphotography#project-guide");
  });

  it("builds a clean share link for one selected goal", () => {
    expect(buildCstdProjectGuideShareHref("/cstd", "portrait-shooting")).toBe(
      "/cstd?goal=portrait-shooting#projects",
    );
    expect(buildCstdProjectGuideShareHref("/cstd", "unknown")).toBeNull();
    expect(buildCstdProjectGuideShareHref("/cstd", null)).toBeNull();
  });

  it("identifies clean restored guide-share state without colliding with richer restored states", () => {
    expect(isCstdProjectGuideShareRestored(parseCstdProjectViewState("?goal=portrait-shooting"))).toBe(true);
    expect(isCstdProjectGuideShareRestored(parseCstdProjectViewState("?category=creative&goal=portrait-shooting"))).toBe(false);
    expect(isCstdProjectGuideShareRestored(parseCstdProjectViewState("?goal=portrait-shooting&project=photography"))).toBe(false);
    expect(isCstdProjectGuideShareRestored(parseCstdProjectViewState("?goal=portrait-shooting&compare=design,crm"))).toBe(false);
  });

  it("detects only valid active view state for automatic intro gating", () => {
    expect(hasActiveCstdProjectViewState("")).toBe(false);
    expect(hasActiveCstdProjectViewState("?category=nope&goal=nope&project=nope&compare=unknown")).toBe(false);
    expect(hasActiveCstdProjectViewState("?goal=ai-creation&compare=design,crm")).toBe(true);
    expect(hasActiveCstdProjectViewState("?q=AI")).toBe(true);
    expect(hasActiveCstdProjectViewState("?category=operations")).toBe(true);
    expect(hasActiveCstdProjectViewState("?project=design")).toBe(true);
  });

  it("builds a compact restored receipt for filtered directory links", () => {
    expect(
      getCstdProjectDirectoryRestoredReceipt({
        filter: "operations",
        query: "CRM",
        visibleProjectCount: 1,
      }),
    ).toEqual({
      label: "筛选视图已恢复",
      detail: "运营系统分类 + CRM 搜索已从链接恢复，当前显示 1 个项目。",
    });

    expect(
      getCstdProjectDirectoryRestoredReceipt({
        filter: "all",
        query: "",
        visibleProjectCount: 6,
      }),
    ).toBeNull();
  });

  it("builds a restored receipt for focused project links only when a project is valid", () => {
    expect(getCstdProjectFocusRestoredReceipt("私人 AI 创作工作台")).toEqual({
      label: "分享案例已恢复",
      detail: "私人 AI 创作工作台的案例焦点已从链接恢复，可直接查看角色、问题与交付证据。",
    });

    expect(getCstdProjectFocusRestoredReceipt("")).toBeNull();
  });

  it("builds a next action for restored filtered directory links", () => {
    expect(
      getCstdProjectDirectoryRestoredAction({
        firstProjectTitle: "产业园区招商 CRM",
        visibleProjectCount: 1,
      }),
    ).toEqual({
      label: "查看匹配案例",
      detail: "产业园区招商 CRM 是当前恢复视图的匹配项目，可直接打开案例证据。",
      kind: "focus",
    });

    expect(
      getCstdProjectDirectoryRestoredAction({
        firstProjectTitle: "私人 AI 创作工作台",
        visibleProjectCount: 3,
      }),
    ).toEqual({
      label: "查看首个匹配案例",
      detail: "当前恢复视图有 3 个项目，先打开私人 AI 创作工作台查看证据。",
      kind: "focus",
    });

    expect(
      getCstdProjectDirectoryRestoredAction({
        firstProjectTitle: null,
        visibleProjectCount: 0,
      }),
    ).toEqual({
      label: "重置筛选",
      detail: "当前恢复视图没有匹配项目，可重置后继续浏览全部案例。",
      kind: "reset",
    });
  });

  it("builds a next action for restored focused project links", () => {
    expect(getCstdProjectFocusRestoredAction("私人 AI 创作工作台")).toEqual({
      label: "复制案例摘要",
      detail: "可直接带走私人 AI 创作工作台的角色、问题与交付摘要。",
    });

    expect(getCstdProjectFocusRestoredAction("")).toBeNull();
  });
});
