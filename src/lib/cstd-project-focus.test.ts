import { describe, expect, test, vi } from "vitest";
import {
  buildCstdProjectBrief,
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

  test("builds a shareable project brief from focus evidence", () => {
    const project = {
      title: "产业园区招商 CRM",
      href: "https://cfzzs.custard.top",
      evidence: {
        current: "生产环境持续验证与迭代",
        role: "业务建模、权限设计与全栈交付",
        problem: "招商线索分散，权限边界不清晰。",
        outcome: "交付覆盖线索全周期和角色权限的运营系统。",
      },
    };

    expect(buildCstdProjectBrief(project)).toBe(
      "产业园区招商 CRM\n当前：生产环境持续验证与迭代\n负责：业务建模、权限设计与全栈交付\n解决问题：招商线索分散，权限边界不清晰。\n已交付：交付覆盖线索全周期和角色权限的运营系统。\n链接：https://cfzzs.custard.top",
    );
  });
});
