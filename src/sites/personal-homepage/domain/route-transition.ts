export type CstdRouteTransitionKind = "work" | "reading" | "path" | "execute" | "district";

function normalizeCstdPath(value: string) {
  const path = value.split(/[?#]/, 1)[0] || "/";
  const withoutInternalPrefix = path === "/cstd" ? "/" : path.startsWith("/cstd/") ? path.slice(5) : path;
  return withoutInternalPrefix === "/en" ? "/" : withoutInternalPrefix.startsWith("/en/") ? withoutInternalPrefix.slice(3) : withoutInternalPrefix;
}

export function getCstdRouteTransitionKind(from: string, to: string): CstdRouteTransitionKind {
  const source = normalizeCstdPath(from);
  const target = normalizeCstdPath(to);
  if (source.startsWith("/work") || target.startsWith("/work")) return "work";
  if (source.startsWith("/notes") || target.startsWith("/notes")) return "reading";
  if (source.startsWith("/topics") || target.startsWith("/topics") || source === "/map" || target === "/map") return "path";
  if (source.startsWith("/lab") || target.startsWith("/lab")) return "execute";
  return "district";
}

export function createCstdNavigationSnapshot(from: string, to: string, scrollY: number, at = Date.now()) {
  return {
    schemaVersion: 1,
    from,
    to,
    kind: getCstdRouteTransitionKind(from, to),
    scrollY: Math.max(0, Math.round(scrollY)),
    at,
  } as const;
}
