import { describe, expect, test, vi } from "vitest";
import {
  buildCstdProjectDirectoryHref,
  buildCstdProjectFocusHref,
  copyCstdProjectLink,
  getCstdProjectFocusNavigation,
  parseCstdProjectFocus,
} from "./cstd-project-focus";

describe("CSTD project focus", () => {
  test("parses only known project ids", () => {
    expect(parseCstdProjectFocus("?project=crm")).toBe("crm");
    expect(parseCstdProjectFocus("?project=unknown")).toBeNull();
    expect(parseCstdProjectFocus("")).toBeNull();
  });

  test("builds focus links for both the custom-domain root and repository route", () => {
    expect(buildCstdProjectFocusHref("crm", "/")).toBe("/?project=crm#project-focus");
    expect(buildCstdProjectFocusHref("design", "/cstd")).toBe("/cstd?project=design#project-focus");
    expect(buildCstdProjectDirectoryHref("/cstd")).toBe("/cstd#projects");
  });

  test("normalizes clipboard success, unsupported, and failure outcomes", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await expect(copyCstdProjectLink(writeText, "https://custard.top/?project=crm#project-focus")).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("https://custard.top/?project=crm#project-focus");
    await expect(copyCstdProjectLink(undefined, "https://custard.top/")).resolves.toBe("unsupported");
    await expect(copyCstdProjectLink(vi.fn().mockRejectedValue(new Error("denied")), "https://custard.top/")).resolves.toBe("failed");
  });

  test("returns adjacent focus navigation without wrapping the project list", () => {
    const projects = [
      { id: "rocodex", title: "RocoDex" },
      { id: "photography", title: "Photo" },
      { id: "crm", title: "CRM" },
    ] as const;

    expect(getCstdProjectFocusNavigation(projects, "rocodex")).toEqual({
      previous: null,
      next: { id: "photography", title: "Photo" },
    });
    expect(getCstdProjectFocusNavigation(projects, "photography")).toEqual({
      previous: { id: "rocodex", title: "RocoDex" },
      next: { id: "crm", title: "CRM" },
    });
    expect(getCstdProjectFocusNavigation(projects, "crm")).toEqual({
      previous: { id: "photography", title: "Photo" },
      next: null,
    });
    expect(getCstdProjectFocusNavigation(projects, "unknown")).toEqual({
      previous: null,
      next: null,
    });
  });
});
