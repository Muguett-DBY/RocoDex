import { describe, expect, it } from "vitest";

import {
  buildCstdProjectViewHref,
  getCstdProjectDirectoryRestoredReceipt,
  getCstdProjectFocusRestoredReceipt,
  hasActiveCstdProjectViewState,
  parseCstdProjectViewState,
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
});
