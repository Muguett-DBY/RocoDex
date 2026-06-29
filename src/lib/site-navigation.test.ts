import { describe, expect, it } from "vitest";
import {
  getActiveSiteNavigationItem,
  getMobileNavigationToggleState,
  getSiteNavigationContext,
  getSiteNavigationLinkState,
  isMobileNavigationOpenForPath,
  siteNavigationItems,
} from "@/lib/site-navigation";

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

  it("closes an open mobile menu when the current path changes", () => {
    expect(isMobileNavigationOpenForPath({ open: true, pathname: "/creatures" }, "/creatures/001")).toBe(false);
    expect(isMobileNavigationOpenForPath({ open: true, pathname: "/creatures/001" }, "/creatures/001?tab=skills")).toBe(
      true,
    );
    expect(isMobileNavigationOpenForPath({ open: false, pathname: "/guides" }, "/guides")).toBe(false);
  });

  it("resolves nested routes to their primary navigation module", () => {
    expect(getActiveSiteNavigationItem("/creatures/001")?.href).toBe("/creatures");
    expect(getActiveSiteNavigationItem("/guides/roco-quick-start")?.href).toBe("/guides");
    expect(getActiveSiteNavigationItem("/pvp-teams/balanced-core")?.href).toBe("/pvp-teams");
  });

  it("marks matching header links as the current page for exact and nested routes", () => {
    expect(getSiteNavigationLinkState({ href: "/guides", label: "攻略" }, "/guides/roco-quick-start")).toEqual({
      current: true,
      ariaCurrent: "page",
    });
    expect(getSiteNavigationLinkState({ href: "/guides", label: "攻略" }, "/creatures/001")).toEqual({
      current: false,
      ariaCurrent: undefined,
    });
  });

  it("builds page context with related next-step links including collection", () => {
    const collectionContext = getSiteNavigationContext("/collection?ids=001,002");

    expect(collectionContext?.current.href).toBe("/collection");
    expect(collectionContext?.relatedItems.map((item) => item.href)).toEqual(["/compare", "/creatures"]);

    const creatureContext = getSiteNavigationContext("/creatures/001");
    expect(creatureContext?.current.label).toBe("精灵列表");
    expect(creatureContext?.relatedItems.map((item) => item.href)).toEqual(["/guides", "/collection"]);
  });
});
