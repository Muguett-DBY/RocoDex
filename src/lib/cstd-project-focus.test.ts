import { describe, expect, test, vi } from "vitest";
import {
  buildCstdProjectDirectoryHref,
  buildCstdProjectFocusHref,
  copyCstdProjectLink,
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
});
