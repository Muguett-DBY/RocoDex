import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
const sourceRoot = path.join(repositoryRoot, "src");

function sourcePath(relativePath: string) {
  return path.join(sourceRoot, relativePath);
}

function readSource(relativePath: string) {
  return readFileSync(sourcePath(relativePath), "utf8");
}

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(entryPath);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

describe("site architecture boundaries", () => {
  it("keeps each website behind an explicit route group", () => {
    expect(existsSync(sourcePath("app/(personal)/cstd/page.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(personal-en)/cstd/en/page.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(personal)/layout.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(personal-en)/layout.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(rocodex)/page.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(rocodex)/layout.tsx"))).toBe(true);
  });

  it("gives every site-owned root document the correct language and providers", () => {
    expect(readSource("app/(personal)/layout.tsx")).toContain('<html lang="zh-CN"');
    expect(readSource("app/(personal-en)/layout.tsx")).toContain('<html lang="en-AU"');
    expect(readSource("app/(personal)/layout.tsx")).not.toContain("AuthProvider");
    expect(readSource("app/(personal-en)/layout.tsx")).not.toContain("AuthProvider");
    expect(readSource("app/(rocodex)/layout.tsx")).toContain('<html lang="zh-CN"');
    expect(readSource("app/(rocodex)/layout.tsx")).toContain("AuthProvider");
    expect(existsSync(sourcePath("app/layout.tsx"))).toBe(false);
  });

  it("keeps unmatched RocoDex paths inside its authenticated root document", () => {
    expect(readSource("app/(rocodex)/[...not-found]/page.tsx")).toContain("notFound()");
    expect(readSource("app/(rocodex)/not-found.tsx")).toContain("RocoDexNotFound");
    expect(readSource("app/(rocodex)/layout.tsx")).toContain("AuthProvider");
  });

  it("owns personal homepage code inside one site module", () => {
    const expectedFiles = [
      "sites/personal-homepage/index.ts",
      "sites/personal-homepage/routes.ts",
      "sites/personal-homepage/metadata.ts",
      "sites/personal-homepage/server.ts",
      "sites/personal-homepage/components/personal-homepage.tsx",
      "sites/personal-homepage/components/homepage-runtime.tsx",
      "sites/personal-homepage/components/immersive-scene.tsx",
      "sites/personal-homepage/content/projects.ts",
      "sites/personal-homepage/content/systems.ts",
      "sites/personal-homepage/infrastructure/routing.ts",
      "sites/personal-homepage/infrastructure/sitemap.ts",
      "app/(personal)/cstd/llms.txt/route.ts",
      "app/(personal-en)/cstd/en/llms.txt/route.ts",
      "sites/shared/robots.ts",
      "sites/shared/sitemap.ts",
    ];

    expect(expectedFiles.filter((file) => !existsSync(sourcePath(file)))).toEqual([]);
  });

  it("keeps RocoDex route ownership explicit without moving its stable domain modules", () => {
    expect(existsSync(sourcePath("sites/rocodex/metadata.ts"))).toBe(true);
    expect(existsSync(sourcePath("sites/rocodex/sitemap.ts"))).toBe(true);

    const rootLevelRocoDexRoutes = [
      "app/page.tsx",
      "app/creatures",
      "app/guides",
      "app/pvp-teams",
      "app/collection",
      "app/compare",
    ];

    expect(rootLevelRocoDexRoutes.filter((route) => existsSync(sourcePath(route)))).toEqual([]);
  });

  it("exposes personal homepage internals only through public entry points", () => {
    const personalSiteRoot = sourcePath("sites/personal-homepage");
    const privateImport = /@\/sites\/personal-homepage\/(?:components|content|domain|infrastructure)\//;
    const violations = collectSourceFiles(sourceRoot)
      .filter((file) => !file.startsWith(personalSiteRoot))
      .filter((file) => privateImport.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(repositoryRoot, file).replaceAll("\\", "/"));

    expect(violations).toEqual([]);
  });

  it("does not let personal homepage production code import RocoDex modules", () => {
    const personalSiteRoot = sourcePath("sites/personal-homepage");
    const forbiddenImports = /from\s+["']@\/(?:components|data|hooks|lib|types)\//;
    const violations = collectSourceFiles(personalSiteRoot)
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .filter((file) => forbiddenImports.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(repositoryRoot, file).replaceAll("\\", "/"));

    expect(violations).toEqual([]);
  });

  it("keeps WebGL dependencies inside the personal homepage lazy scene", () => {
    const scenePath = sourcePath("sites/personal-homepage/components/immersive-scene.tsx");
    const postprocessingPath = sourcePath("sites/personal-homepage/components/immersive-postprocessing.tsx");
    const allowedWebglEntries = new Set([scenePath, postprocessingPath]);
    const heavyRuntimeImport = /(?:from\s+|import\s*\()\s*["'](?:@react-three\/(?:fiber|postprocessing)|postprocessing|three)["']/;
    const violations = collectSourceFiles(sourceRoot)
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .filter((file) => !allowedWebglEntries.has(file))
      .filter((file) => heavyRuntimeImport.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(repositoryRoot, file).replaceAll("\\", "/"));

    expect(violations).toEqual([]);

    const sceneSource = readFileSync(scenePath, "utf8");
    const runtimeSource = readSource("sites/personal-homepage/components/scene-runtime.tsx");
    expect(runtimeSource).toContain('import("./immersive-scene")');
    expect(runtimeSource).toContain("{ ssr: false }");
    expect(sceneSource).toContain('import("./immersive-postprocessing")');
  });

  it("removes the former personal-site files from generic RocoDex folders", () => {
    const legacyFiles = [
      "components/cstd-landing.tsx",
      "components/cstd-immersive-scene.tsx",
      "lib/cstd-link-target.ts",
      "lib/cstd-projects.ts",
      "lib/cstd-robots.ts",
      "lib/cstd-routing.ts",
      "lib/cstd-systems.ts",
    ];

    expect(legacyFiles.filter((file) => existsSync(sourcePath(file)))).toEqual([]);
  });
});
