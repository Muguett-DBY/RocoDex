export type SiteNavigationItem = {
  href: string;
  label: string;
  description: string;
  relatedHrefs: string[];
};

export const siteNavigationItems: SiteNavigationItem[] = [
  {
    href: "/creatures",
    label: "精灵列表",
    description: "浏览精灵资料、属性、技能和可培养目标。",
    relatedHrefs: ["/guides", "/collection"],
  },
  {
    href: "/guides",
    label: "攻略",
    description: "按玩法和场景查找培养、通关和队伍思路。",
    relatedHrefs: ["/creatures", "/pvp-teams"],
  },
  {
    href: "/pvp-teams",
    label: "PVP阵容",
    description: "查看阵容组合、核心定位和对战搭配。",
    relatedHrefs: ["/matchups", "/skills"],
  },
  {
    href: "/matchups",
    label: "克制",
    description: "快速判断属性克制、弱点和对局风险。",
    relatedHrefs: ["/creatures", "/pvp-teams"],
  },
  {
    href: "/skills",
    label: "技能",
    description: "检索技能效果、标签和适合搭配的精灵。",
    relatedHrefs: ["/creatures", "/pvp-teams"],
  },
  {
    href: "/compare",
    label: "对比",
    description: "并排比较精灵定位、属性和关键能力。",
    relatedHrefs: ["/collection", "/creatures"],
  },
  {
    href: "/discover",
    label: "发现",
    description: "从推荐、标签和新入口探索图鉴内容。",
    relatedHrefs: ["/creatures", "/guides"],
  },
  {
    href: "/rkti",
    label: "洛克测试",
    description: "用测试题快速定位适合当前目标的内容。",
    relatedHrefs: ["/guides", "/creatures"],
  },
  {
    href: "/data-status",
    label: "数据状态",
    description: "查看图鉴数据覆盖、来源和更新状态。",
    relatedHrefs: ["/creatures", "/about"],
  },
  {
    href: "/about",
    label: "关于",
    description: "了解 RocoDex 的项目定位、数据边界和维护方式。",
    relatedHrefs: ["/data-status", "/creatures"],
  },
];

export const siteHomeNavigationItem: SiteNavigationItem = {
  href: "/",
  label: "首页",
  description: "回到 RocoDex 的主要入口和项目概览。",
  relatedHrefs: ["/creatures", "/guides"],
};

export const collectionNavigationItem: SiteNavigationItem = {
  href: "/collection",
  label: "我的收藏",
  description: "管理已收藏的精灵，并继续进行对比或查阅。",
  relatedHrefs: ["/compare", "/creatures"],
};

const siteNavigationContextItems: SiteNavigationItem[] = [
  siteHomeNavigationItem,
  ...siteNavigationItems,
  collectionNavigationItem,
];

export type SiteNavigationLinkState = {
  current: boolean;
  ariaCurrent?: "page";
};

export type SiteNavigationContext = {
  current: SiteNavigationItem;
  relatedItems: SiteNavigationItem[];
};

export type MobileNavigationSummary = Pick<SiteNavigationItem, "label" | "description">;

export type MobileNavigationRouteState = {
  open: boolean;
  pathname: string | null | undefined;
};

export function getMobileNavigationToggleState(open: boolean) {
  return {
    expanded: open,
    label: open ? "关闭主导航" : "打开主导航",
  };
}

export function isMobileNavigationOpenForPath(
  state: MobileNavigationRouteState,
  currentPathname: string | null | undefined,
) {
  return state.open && normalizeSitePathname(state.pathname) === normalizeSitePathname(currentPathname);
}

export function shouldDismissMobileNavigation(key: string) {
  return key === "Escape";
}

export function getMobileNavigationSummary(
  pathname: string | null | undefined,
): MobileNavigationSummary | null {
  const context = getSiteNavigationContext(pathname);

  if (!context) {
    return null;
  }

  return {
    label: context.current.label,
    description: context.current.description,
  };
}

export function normalizeSitePathname(pathname: string | null | undefined) {
  const input = pathname?.trim() || "/";
  let path = input;

  try {
    if (/^https?:\/\//i.test(input)) {
      path = new URL(input).pathname;
    }
  } catch {
    path = input;
  }

  const queryIndex = path.search(/[?#]/);
  if (queryIndex >= 0) {
    path = path.slice(0, queryIndex);
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return path.length > 1 ? path.replace(/\/+$/, "") : "/";
}

export function getActiveSiteNavigationItem(pathname: string | null | undefined) {
  const normalizedPathname = normalizeSitePathname(pathname);

  return siteNavigationContextItems
    .filter((item) => pathMatchesNavigationItem(normalizedPathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export function getSiteNavigationLinkState(
  item: Pick<SiteNavigationItem, "href">,
  pathname: string | null | undefined,
): SiteNavigationLinkState {
  const activeItem = getActiveSiteNavigationItem(pathname);
  const current = activeItem?.href === item.href;

  return {
    current,
    ariaCurrent: current ? "page" : undefined,
  };
}

export function getSiteNavigationContext(pathname: string | null | undefined): SiteNavigationContext | null {
  const current = getActiveSiteNavigationItem(pathname);

  if (!current) {
    return null;
  }

  const relatedItems = current.relatedHrefs
    .map((href) => siteNavigationContextItems.find((item) => item.href === href))
    .filter((item): item is SiteNavigationItem => Boolean(item));

  return { current, relatedItems };
}

function pathMatchesNavigationItem(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
