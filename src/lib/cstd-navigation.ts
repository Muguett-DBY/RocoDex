export const cstdNavigationItems = [
  { href: "#project-directory", label: "Projects" },
  { href: "https://rocodex.custard.top", label: "RocoDex" },
  { href: "https://shoot.custard.top", label: "Photography" },
  { href: "https://alpha.custard.top", label: "Alpha" },
  { href: "https://design.custard.top", label: "Design" },
  { href: "https://cfzzs.custard.top", label: "CRM" },
] as const;

export function getCstdMobileNavigationToggleState(open: boolean) {
  return {
    expanded: open,
    label: open ? "关闭项目导航" : "打开项目导航",
  };
}
