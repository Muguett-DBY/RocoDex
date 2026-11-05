import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

function readJson(path: string) {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as Record<string, unknown>;
}


type Version = readonly [number, number, number];

function parseStableVersion(value: string | undefined): Version | null {
  const match = value?.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
  if (!match) return null;
  const parts = [Number(match[1]), Number(match[2]), Number(match[3])] as const;
  return parts.every(Number.isSafeInteger) ? parts : null;
}

function compareVersions(left: Version, right: Version): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

function isAllowedVersion(
  spec: string | undefined,
  baseline: string,
  kind: "exact" | "caret",
): boolean {
  if (!spec || (kind === "caret") !== spec.startsWith("^")) return false;
  const version = parseStableVersion(kind === "caret" ? spec.slice(1) : spec);
  const minimum = parseStableVersion(baseline);
  if (!version || !minimum || version[0] !== minimum[0]) return false;
  if (version[0] === 0 && version[1] !== minimum[1]) return false;
  return compareVersions(version, minimum) >= 0;
}

function resolvesCaret(spec: string, locked: string | undefined): boolean {
  if (!spec.startsWith("^")) return false;
  const requested = parseStableVersion(spec.slice(1));
  const resolved = parseStableVersion(locked);
  if (!requested || !resolved || compareVersions(resolved, requested) < 0) return false;
  if (resolved[0] !== requested[0]) return false;
  if (requested[0] !== 0) return true;
  if (resolved[1] !== requested[1]) return false;
  return requested[1] !== 0 || resolved[2] === requested[2];
}

describe("toolchain version policy", () => {
  test("keeps the toolchain pinned, compatible, and above its tested baseline", () => {
    const packageJson = readJson("package.json") as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      engines?: Record<string, string>;
      overrides?: Record<string, string>;
      packageManager?: string;
    };
    const packageLock = readJson("package-lock.json") as {
      packages: Record<string, {
        version?: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      }>;
    };

    expect(packageJson.engines?.node).toBe("24.x");
    expect(packageJson.packageManager).toBe("npm@12.0.2");
    expect(packageLock.packages[""]?.dependencies).toEqual(packageJson.dependencies);
    expect(packageLock.packages[""]?.devDependencies).toEqual(packageJson.devDependencies);

    const exact = {
      dependencies: {
        next: "16.4.2",
        three: "0.185.1",
      },
      devDependencies: {
        "@next/eslint-plugin-next": "16.4.2",
        "@playwright/test": "1.63.0",
        "@tailwindcss/postcss": "4.3.3",
        "@types/three": "0.185.4",
        eslint: "10.11.0",
        "eslint-plugin-jsx-a11y-x": "0.2.0",
        "eslint-plugin-react-hooks": "7.1.1",
        "typescript-eslint": "8.70.1",
        tailwindcss: "4.3.3",
        vitest: "4.1.12",
      },
    };
    const caret = {
      dependencies: {
        react: "19.3.0",
        "react-dom": "19.3.0",
        "framer-motion": "13.4.4",
      },
      devDependencies: {
        "@types/node": "24.19.0",
        "@webgpu/types": "0.1.74",
      },
    };

    for (const [kind, requirements] of [["exact", exact], ["caret", caret]] as const) {
      for (const section of ["dependencies", "devDependencies"] as const) {
        for (const [name, baseline] of Object.entries(requirements[section])) {
          const spec = packageJson[section][name];
          const locked = packageLock.packages["node_modules/" + name]?.version;
          expect(isAllowedVersion(spec, baseline, kind), name + " manifest").toBe(true);
          if (kind === "exact") {
            expect(locked, name + " lock").toBe(spec);
          } else {
            expect(resolvesCaret(spec, locked), name + " lock").toBe(true);
          }
        }
      }
    }

    expect(packageJson.dependencies.react).toBe(packageJson.dependencies["react-dom"]);
    expect(packageLock.packages["node_modules/react"]?.version).toBe(
      packageLock.packages["node_modules/react-dom"]?.version,
    );
    expect(packageJson.devDependencies["@tailwindcss/postcss"]).toBe(
      packageJson.devDependencies.tailwindcss,
    );
    expect(packageLock.packages["node_modules/@tailwindcss/node"]?.version).toBe(
      packageJson.devDependencies.tailwindcss,
    );
    expect(packageJson.overrides).toMatchObject({
      postcss: "8.5.26",
      sharp: "0.35.5",
    });
    expect(packageLock.packages["node_modules/postcss"]?.version).toBe(
      packageJson.overrides?.postcss,
    );
    expect(packageLock.packages["node_modules/sharp"]?.version).toBe(
      packageJson.overrides?.sharp,
    );
  });

  test("allows compatible updates but rejects downgrades and unpinned versions", () => {
    expect(isAllowedVersion("16.4.3", "16.4.2", "exact")).toBe(true);
    expect(isAllowedVersion("16.4.1", "16.4.2", "exact")).toBe(false);
    expect(isAllowedVersion("^16.4.3", "16.4.2", "exact")).toBe(false);
    expect(isAllowedVersion("17.0.0", "16.4.2", "exact")).toBe(false);
    expect(isAllowedVersion("0.186.0", "0.185.1", "exact")).toBe(false);
    expect(isAllowedVersion("^19.3.1", "19.3.0", "caret")).toBe(true);
    expect(resolvesCaret("^19.3.1", "19.4.0")).toBe(true);
    expect(resolvesCaret("^19.3.1", "19.3.0")).toBe(false);
    expect(resolvesCaret("^0.1.74", "0.2.0")).toBe(false);
    expect(resolvesCaret("^0.0.1", "0.0.2")).toBe(false);
  });

  test("pins approved install scripts for native tooling used by Next and ESLint", () => {
    const packageJson = readJson("package.json") as {
      allowScripts?: Record<string, boolean>;
    };

    expect(packageJson.allowScripts).toMatchObject({
      "esbuild@0.28.2": true,
      "sharp@0.35.5": true,
      "unrs-resolver@1.12.2": true,
      "workerd@1.20261023.1": true,
    });
  });

  test("keeps the local production launcher aligned with the hosted runtime", () => {
    const packageJson = readJson("package.json") as {
      scripts?: Record<string, string>;
    };
    const launcher = readFileSync(
      join(process.cwd(), "scripts", "start-local-production.ps1"),
      "utf8",
    );
    const stopLauncher = readFileSync(
      join(process.cwd(), "scripts", "stop-local-next.ps1"),
      "utf8",
    );

    expect(packageJson.scripts?.["start:local"]).toContain("start-local-production.ps1");
    expect(packageJson.scripts?.["stop:local"]).toContain("stop-local-next.ps1");
    expect(launcher).toContain("-WindowStyle Hidden");
    expect(launcher).toContain('Join-Path $repositoryRoot "output\\local-production"');
    expect(launcher).not.toContain('Join-Path $repositoryRoot ".next"');
    expect(launcher).toContain('"$baseUrl/"');
    expect(stopLauncher).toContain('Join-Path $repoRoot "output\\local-production"');
    expect(stopLauncher).toContain('"production-server.pid"');
  });
});
