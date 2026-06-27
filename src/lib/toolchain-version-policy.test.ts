import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

function readJson(path: string) {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as Record<string, unknown>;
}

describe("toolchain version policy", () => {
  test("pins the Next and Vitest patch releases used by local and CI verification", () => {
    const packageJson = readJson("package.json") as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      engines?: Record<string, string>;
      packageManager?: string;
    };
    const packageLock = readJson("package-lock.json") as {
      packages: Record<string, { version?: string }>;
    };

    expect(packageJson.engines?.node).toBe(">=22 <27");
    expect(packageJson.packageManager).toBe("npm@11.17.0");
    expect(packageJson.dependencies.next).toBe("16.2.9");
    expect(packageJson.devDependencies["eslint-config-next"]).toBe("16.2.9");
    expect(packageJson.devDependencies["@tailwindcss/postcss"]).toBe("4.3.1");
    expect(packageJson.devDependencies.tailwindcss).toBe("4.3.1");
    expect(packageJson.devDependencies.vitest).toBe("4.1.9");
    expect(packageLock.packages["node_modules/next"]?.version).toBe("16.2.9");
    expect(packageLock.packages["node_modules/eslint-config-next"]?.version).toBe("16.2.9");
    expect(packageLock.packages["node_modules/@tailwindcss/node"]?.version).toBe("4.3.1");
    expect(packageLock.packages["node_modules/@tailwindcss/postcss"]?.version).toBe("4.3.1");
    expect(packageLock.packages["node_modules/tailwindcss"]?.version).toBe("4.3.1");
    expect(packageLock.packages["node_modules/vitest"]?.version).toBe("4.1.9");
  });
});
