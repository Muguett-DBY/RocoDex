export type SiteNavigationItem = {
  href: string;
  label: string;
};

export const siteNavigationItems: SiteNavigationItem[] = [
  { href: "/creatures", label: "精灵列表" },
  { href: "/guides", label: "攻略" },
  { href: "/pvp-teams", label: "PVP阵容" },
  { href: "/matchups", label: "克制" },
  { href: "/skills", label: "技能" },
  { href: "/compare", label: "对比" },
  { href: "/discover", label: "发现" },
  { href: "/rkti", label: "洛克测试" },
  { href: "/data-status", label: "数据状态" },
  { href: "/about", label: "关于" },
];

export function getMobileNavigationToggleState(open: boolean) {
  return {
    expanded: open,
    label: open ? "关闭主导航" : "打开主导航",
  };
}
