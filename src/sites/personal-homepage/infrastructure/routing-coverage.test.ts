import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";

import {
  PERSONAL_SITE_DYNAMIC_PAGE_PREFIXES,
  PERSONAL_SITE_PUBLIC_EXACT_PATHS,
  PERSONAL_SITE_PUBLIC_PAGE_ROOTS,
} from "./routing";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const zhRouteGroup = path.join(repositoryRoot, "src/app/(personal)/cstd");
const enRouteGroup = path.join(repositoryRoot, "src/app/(personal-en)/cstd/en");

type PublicRoute = { publicPath: string; file: string; dynamic: boolean };

function collectRoutes(routeDirectory: string, pathPrefix: string): PublicRoute[] {
  if (!existsSync(routeDirectory)) return [];
  const routes: PublicRoute[] = [];
  const groupPagePath = path.join(routeDirectory, "page.tsx");
  if (existsSync(groupPagePath)) {
    routes.push({ publicPath: pathPrefix || "/", file: toPosix(groupPagePath), dynamic: pathPrefix.includes("[") });
  }
  for (const entry of readdirSync(routeDirectory)) {
    const entryPath = path.join(routeDirectory, entry);
    if (!statSync(entryPath).isDirectory()) continue;
    const publicPath = toPosix(`${pathPrefix}/${entry}`);
    if (existsSync(path.join(entryPath, "page.tsx"))) {
      routes.push({ publicPath, file: toPosix(path.join(entryPath, "page.tsx")), dynamic: publicPath.includes("[") });
    }
    if (existsSync(path.join(entryPath, "route.ts"))) {
      routes.push({ publicPath, file: toPosix(path.join(entryPath, "route.ts")), dynamic: false });
    }
    routes.push(...collectRoutes(entryPath, publicPath));
  }
  return routes;
}

function isCoveredByAllowlist(publicPath: string, dynamic: boolean) {
  if (dynamic) {
    return PERSONAL_SITE_DYNAMIC_PAGE_PREFIXES.some((prefix) => publicPath.startsWith(prefix));
  }
  return PERSONAL_SITE_PUBLIC_PAGE_ROOTS.has(publicPath)
    || PERSONAL_SITE_PUBLIC_EXACT_PATHS.has(publicPath);
}

describe("personal site route allowlist coverage", () => {
  const allRoutes = [...collectRoutes(zhRouteGroup, ""), ...collectRoutes(enRouteGroup, "/en")];

  test("found the expected personal site route tree", () => {
    expect(allRoutes.length).toBeGreaterThan(20);
    expect(allRoutes.some((route) => route.publicPath === "/work")).toBe(true);
    expect(allRoutes.some((route) => route.publicPath === "/en/work")).toBe(true);
    expect(allRoutes.some((route) => route.publicPath === "/work/[slug]" && route.dynamic)).toBe(true);
  });

  test("every zh and en page or JSON route is reachable through the host allowlist", () => {
    const uncovered = allRoutes.filter(({ publicPath, dynamic }) => {
      if (publicPath === "/") return false; // the zh entry path is rewritten by the entry rule
      return !isCoveredByAllowlist(publicPath, dynamic);
    });

    expect(uncovered, [
      "New personal site routes must be added to PERSONAL_SITE_PUBLIC_PAGE_ROOTS",
      "(or a dynamic prefix in PERSONAL_SITE_DYNAMIC_PAGE_PREFIXES) in infrastructure/routing.ts,",
      "otherwise the host edge serves the proxy 404 before Next ever sees them:",
      ...uncovered.map((route) => `${route.publicPath} (${route.file})`),
    ].join("\n")).toEqual([]);
  });

  test("the allowlist does not reference routes that no longer exist", () => {
    const knownPaths = new Set(allRoutes.map((route) => route.publicPath));
    const dynamicPrefixes = new Set(
      allRoutes
        .filter((route) => route.dynamic)
        .map((route) => `${route.publicPath.split("/[")[0]}/`),
    );

    const staleRoots = [...PERSONAL_SITE_PUBLIC_PAGE_ROOTS].filter((publicPath) => !knownPaths.has(publicPath));
    expect(staleRoots, `Allowlist roots without a backing route: ${staleRoots.join(", ")}`).toEqual([]);

    const stalePrefixes = PERSONAL_SITE_DYNAMIC_PAGE_PREFIXES.filter((prefix) => !dynamicPrefixes.has(prefix));
    expect(stalePrefixes, `Dynamic prefixes without a backing dynamic route: ${stalePrefixes.join(", ")}`).toEqual([]);
  });
});

function toPosix(value: string) {
  return value.replaceAll("\\", "/");
}
