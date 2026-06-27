import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

function readJson(path: string) {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as Record<string, unknown>;
}

describe("CSTD Three.js compatibility policy", () => {
  test("pins Three.js before the Clock deprecation used by React Three Fiber", () => {
    const packageJson = readJson("package.json") as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const packageLock = readJson("package-lock.json") as {
      packages: Record<string, { version?: string }>;
    };

    expect(packageJson.dependencies.three).toBe("0.182.0");
    expect(packageJson.devDependencies["@types/three"]).toBe("0.182.0");
    expect(packageLock.packages["node_modules/three"]?.version).toBe("0.182.0");
    expect(packageLock.packages["node_modules/@types/three"]?.version).toBe("0.182.0");
  });
});
