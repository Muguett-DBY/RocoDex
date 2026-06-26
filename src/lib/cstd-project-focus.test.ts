import { describe, expect, test, vi } from "vitest";
import {
  buildCstdProjectBrief,
  buildCstdProjectDirectoryHref,
  buildCstdProjectFocusHref,
  buildCstdProjectLinkDirectory,
  copyCstdProjectLink,
  getCstdProjectEvidenceChecklist,
  getCstdProjectEvidenceChecklistSummary,
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

  test("builds a copyable directory of project focus links", () => {
    const projects = [
      { id: "design", title: "私人 AI 创作工作台", status: "Live" },
      { id: "crm", title: "产业园区招商 CRM", status: "Live" },
      { id: "incubator", title: "更多项目孵化中", status: "Next" },
    ] as const;

    expect(buildCstdProjectLinkDirectory(projects, "https://custard.top", "/")).toBe(
      "custard.top 项目深链目录\n私人 AI 创作工作台：https://custard.top/?project=design#project-focus\n产业园区招商 CRM：https://custard.top/?project=crm#project-focus",
    );
    expect(buildCstdProjectLinkDirectory(projects, "https://rocodex.custard.top", "/cstd")).toContain(
      "https://rocodex.custard.top/cstd?project=crm#project-focus",
    );
  });

  test("builds a complete evidence checklist for focused projects", () => {
    const project = {
      evidence: {
        current: "生产环境持续验证与迭代",
        role: "业务建模、权限设计与全栈交付",
        problem: "招商线索分散，权限边界不清晰。",
        outcome: "交付覆盖线索全周期和角色权限的运营系统。",
      },
    };

    expect(getCstdProjectEvidenceChecklist(project)).toEqual([
      { label: "角色", value: "业务建模、权限设计与全栈交付", complete: true },
      { label: "问题", value: "招商线索分散，权限边界不清晰。", complete: true },
      { label: "交付", value: "交付覆盖线索全周期和角色权限的运营系统。", complete: true },
      { label: "现状", value: "生产环境持续验证与迭代", complete: true },
    ]);
  });

  test("summarizes checklist completeness for the focus panel header", () => {
    expect(
      getCstdProjectEvidenceChecklistSummary([
        { label: "角色", value: "产品", complete: true },
        { label: "问题", value: "资料分散", complete: true },
        { label: "交付", value: "上线", complete: true },
        { label: "现状", value: "维护中", complete: true },
      ]),
    ).toBe("4 / 4 项证据完整");
  });
});
