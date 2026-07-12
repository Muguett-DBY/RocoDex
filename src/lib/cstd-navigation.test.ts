import { describe, expect, test } from "vitest";
import { cstdNavigationItems, getCstdMobileNavigationToggleState } from "./cstd-navigation";

describe("CSTD project navigation", () => {
  test("keeps the project destinations in a stable discovery order", () => {
    expect(cstdNavigationItems).toEqual([
      { href: "#project-directory", label: "Projects" },
      { href: "https://rocodex.custard.top", label: "RocoDex" },
      { href: "https://shoot.custard.top", label: "Photography" },
      { href: "https://alpha.custard.top", label: "Alpha" },
      { href: "https://design.custard.top", label: "Design" },
      { href: "https://cfzzs.custard.top", label: "CRM" },
    ]);
  });

  test("describes the mobile menu state for assistive technology", () => {
    expect(getCstdMobileNavigationToggleState(false)).toEqual({
      expanded: false,
      label: "打开项目导航",
    });
    expect(getCstdMobileNavigationToggleState(true)).toEqual({
      expanded: true,
      label: "关闭项目导航",
    });
  });
});
