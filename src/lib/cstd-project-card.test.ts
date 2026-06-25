import { describe, expect, it } from "vitest";

import { cstdProjects } from "./cstd-projects";
import { getCstdProjectCardPreview, getCstdProjectFocusButtonLabel } from "./cstd-project-card";

describe("CSTD project card UI helpers", () => {
  it("returns a compact evidence preview for scan-first project cards", () => {
    const crm = cstdProjects.find((project) => project.id === "crm");

    expect(crm).toBeDefined();
    expect(getCstdProjectCardPreview(crm!)).toEqual([
      { label: "负责", value: "业务建模、权限设计与全栈交付" },
      { label: "现在", value: "生产环境持续验证与迭代" },
    ]);
  });

  it("distinguishes repeated case-study controls for assistive tech", () => {
    const rocodex = cstdProjects.find((project) => project.id === "rocodex");

    expect(rocodex).toBeDefined();
    expect(getCstdProjectFocusButtonLabel(rocodex!)).toBe("查看洛克图鉴 / RocoDex案例");
  });
});
