import { describe, expect, it } from "vitest";

import { buildCstdProjectViewHref, parseCstdProjectViewState } from "./cstd-project-view-state";

describe("CSTD project view state", () => {
  it("parses directory, goal, and focused project state from one URL", () => {
    expect(
      parseCstdProjectViewState("?category=operations&q=CRM&goal=park-operations&project=crm"),
    ).toEqual({
      filter: "operations",
      query: "CRM",
      guideId: "park-operations",
      projectId: "crm",
    });
  });

  it("drops invalid values without discarding a valid search query", () => {
    expect(parseCstdProjectViewState("?category=nope&q=%20AI%20&goal=nope&project=nope")).toEqual({
      filter: "all",
      query: "AI",
      guideId: null,
      projectId: null,
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
        },
        "project-focus",
      ),
    ).toBe("/cstd?category=creative&q=AI&goal=ai-creation&project=design#project-focus");

    expect(
      buildCstdProjectViewHref("/", {
        filter: "all",
        query: "",
        guideId: null,
        projectId: null,
      }),
    ).toBe("/#projects");
  });
});
