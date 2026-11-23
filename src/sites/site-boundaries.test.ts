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
  it("keeps both homepage locales behind explicit route groups", () => {
    expect(existsSync(sourcePath("app/(personal)/page.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(personal-en)/en/page.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(personal)/layout.tsx"))).toBe(true);
    expect(existsSync(sourcePath("app/(personal-en)/layout.tsx"))).toBe(true);
  });

  it("gives both homepage layouts the correct language and providers", () => {
    expect(readSource("app/(personal)/layout.tsx")).toContain('<html lang="zh-CN"');
    expect(readSource("app/(personal-en)/layout.tsx")).toContain('<html lang="en-AU"');
    expect(readSource("app/(personal)/layout.tsx")).not.toContain("AuthProvider");
    expect(readSource("app/(personal-en)/layout.tsx")).not.toContain("AuthProvider");
    expect(existsSync(sourcePath("app/layout.tsx"))).toBe(false);
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
      "app/(personal)/llms.txt/route.ts",
      "app/(personal-en)/en/llms.txt/route.ts",
      "sites/shared/robots.ts",
      "sites/shared/sitemap.ts",
    ];

    expect(expectedFiles.filter((file) => !existsSync(sourcePath(file)))).toEqual([]);
  });

  it("keeps the retired encyclopedia out of the homepage export", () => {
    const retiredPaths = [
      "archive/rocodex/app",
      "src/sites/rocodex",
      "src/app/(rocodex)",
      "src/app/page.tsx",
      "src/app/creatures",
      "src/app/guides",
      "src/app/pvp-teams",
      "src/app/collection",
      "src/app/compare",
      "src/app/data-status",
      "src/app/discover",
      "src/app/matchups",
      "src/app/rkti",
      "src/app/skills",
      "public/images/creatures",
      "public/images/pvp",
    ];
    expect(retiredPaths.filter((file) => existsSync(path.join(repositoryRoot, file)))).toEqual([]);
  });

  it("exposes personal homepage internals only through public entry points", () => {
    const personalSiteRoot = sourcePath("sites/personal-homepage");
    const publicEntries = new Set([
      "@/sites/personal-homepage",
      "@/sites/personal-homepage/metadata",
      "@/sites/personal-homepage/not-found",
      "@/sites/personal-homepage/routes",
      "@/sites/personal-homepage/server",
    ]);
    const personalImport = /(?:from\s+|import\s*\(\s*)["'](@\/sites\/personal-homepage(?:\/[^"']+)*)["']/g;
    const violations = collectSourceFiles(sourceRoot)
      .filter((file) => !file.startsWith(personalSiteRoot))
      .flatMap((file) => {
        const imports = [...readFileSync(file, "utf8").matchAll(personalImport)]
          .map((match) => match[1])
          .filter((specifier): specifier is string => Boolean(specifier) && !publicEntries.has(specifier));
        return imports.map((specifier) => `${path.relative(repositoryRoot, file).replaceAll("\\", "/")}: ${specifier}`);
      });

    expect(violations).toEqual([]);
  });

  it("keeps homepage production imports out of the former encyclopedia directories", () => {
    const personalSiteRoot = sourcePath("sites/personal-homepage");
    const forbiddenImports = /from\s+["']@\/(?:components|data|hooks|lib|types)\//;
    const violations = collectSourceFiles(personalSiteRoot)
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .filter((file) => forbiddenImports.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(repositoryRoot, file).replaceAll("\\", "/"));

    expect(violations).toEqual([]);
  });

  it("keeps WebGL dependencies inside explicitly lazy personal-site experiences", () => {
    const scenePath = sourcePath("sites/personal-homepage/components/immersive-scene.tsx");
    const postprocessingPath = sourcePath("sites/personal-homepage/components/immersive-postprocessing.tsx");
    const voxelEnginePath = sourcePath("sites/personal-homepage/voxel/voxel-game-engine.ts");
    const allowedWebglEntries = new Set([scenePath, postprocessingPath, voxelEnginePath]);
    const heavyRuntimeImport = /(?:from\s+|import\s*\()\s*["'](?:@react-three\/(?:fiber|postprocessing)|postprocessing|three)["']/;
    const violations = collectSourceFiles(sourceRoot)
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .filter((file) => !allowedWebglEntries.has(file))
      .filter((file) => heavyRuntimeImport.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(repositoryRoot, file).replaceAll("\\", "/"));

    expect(violations).toEqual([]);

    const sceneSource = readFileSync(scenePath, "utf8");
    const runtimeSource = readSource("sites/personal-homepage/components/scene-runtime.tsx");
    const voxelSource = readSource("sites/personal-homepage/voxel/voxel-sandbox.tsx");
    const voxelPageSource = readSource("sites/personal-homepage/voxel/voxel-page.tsx");
    expect(runtimeSource).toContain('import("./immersive-scene")');
    expect(runtimeSource).toContain("{ ssr: false }");
    expect(sceneSource).toContain('import("./immersive-postprocessing")');
    expect(voxelSource).toContain('import("./voxel-game-engine")');
    expect(voxelSource).not.toContain('content/generated/content-registry');
    expect(voxelSource).not.toContain('content/case-studies');
    expect(voxelPageSource).toContain("getVoxelPortfolio(locale)");
  });

  it("keeps the former monolithic homepage files retired", () => {
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
