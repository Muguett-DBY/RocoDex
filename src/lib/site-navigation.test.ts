import { describe, expect, it } from "vitest";
import { getMobileNavigationToggleState, siteNavigationItems } from "@/lib/site-navigation";

describe("site navigation metadata", () => {
  it("keeps primary navigation labels and hrefs unique", () => {
    const hrefs = siteNavigationItems.map((item) => item.href);
    const labels = siteNavigationItems.map((item) => item.label);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(labels).toEqual(expect.arrayContaining(["精灵列表", "攻略", "PVP阵容", "对比", "数据状态", "关于"]));
  });

  it("describes the mobile menu toggle state accessibly", () => {
    expect(getMobileNavigationToggleState(false)).toEqual({
      expanded: false,
      label: "打开主导航",
    });
    expect(getMobileNavigationToggleState(true)).toEqual({
      expanded: true,
      label: "关闭主导航",
    });
  });
});
