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
      overrides?: Record<string, string>;
      packageManager?: string;
    };
    const packageLock = readJson("package-lock.json") as {
      packages: Record<string, { version?: string }>;
    };

    expect(packageJson.engines?.node).toBe("24.x");
    expect(packageJson.packageManager).toBe("npm@12.0.2");
    expect(packageJson.dependencies.next).toBe("16.2.12");
    expect(packageJson.dependencies["next-auth"]).toBe("5.0.0-beta.32");
    expect(packageJson.dependencies.react).toBe("^19.2.8");
    expect(packageJson.dependencies["react-dom"]).toBe("^19.2.8");
    expect(packageJson.dependencies["framer-motion"]).toBe("^12.43.0");
    expect(packageJson.dependencies.three).toBe("0.182.0");
    expect(packageJson.devDependencies["@next/eslint-plugin-next"]).toBe("16.2.12");
    expect(packageJson.devDependencies["@playwright/test"]).toBe("1.62.1");
    expect(packageJson.devDependencies["@tailwindcss/postcss"]).toBe("4.3.3");
    expect(packageJson.devDependencies["@types/node"]).toBe("^24.13.3");
    expect(packageJson.devDependencies["@types/three"]).toBe("0.182.0");
    expect(packageJson.devDependencies.eslint).toBe("10.8.0");
    expect(packageJson.devDependencies["eslint-plugin-jsx-a11y-x"]).toBe("0.2.0");
    expect(packageJson.devDependencies["eslint-plugin-react-hooks"]).toBe("7.1.1");
    expect(packageJson.devDependencies["typescript-eslint"]).toBe("8.65.0");
    expect(packageJson.devDependencies.tailwindcss).toBe("4.3.3");
    expect(packageJson.devDependencies.vitest).toBe("4.1.10");
    expect(packageJson.overrides).toMatchObject({
      postcss: "8.5.24",
      sharp: "0.35.3",
    });
    expect(packageLock.packages["node_modules/next"]?.version).toBe("16.2.12");
    expect(packageLock.packages["node_modules/next-auth"]?.version).toBe("5.0.0-beta.32");
    expect(packageLock.packages["node_modules/react"]?.version).toBe("19.2.8");
    expect(packageLock.packages["node_modules/react-dom"]?.version).toBe("19.2.8");
    expect(packageLock.packages["node_modules/framer-motion"]?.version).toBe("12.43.0");
    expect(packageLock.packages["node_modules/three"]?.version).toBe("0.182.0");
    expect(packageLock.packages["node_modules/@next/eslint-plugin-next"]?.version).toBe(
      "16.2.12",
    );
    expect(packageLock.packages["node_modules/@playwright/test"]?.version).toBe("1.62.1");
    expect(packageLock.packages["node_modules/@tailwindcss/node"]?.version).toBe("4.3.3");
    expect(packageLock.packages["node_modules/@tailwindcss/postcss"]?.version).toBe("4.3.3");
    expect(packageLock.packages["node_modules/@types/node"]?.version).toBe("24.13.3");
    expect(packageLock.packages["node_modules/@types/three"]?.version).toBe("0.182.0");
    expect(packageLock.packages["node_modules/eslint"]?.version).toBe("10.8.0");
    expect(packageLock.packages["node_modules/eslint-plugin-jsx-a11y-x"]?.version).toBe(
      "0.2.0",
    );
    expect(packageLock.packages["node_modules/typescript-eslint"]?.version).toBe("8.65.0");
    expect(packageLock.packages["node_modules/tailwindcss"]?.version).toBe("4.3.3");
    expect(packageLock.packages["node_modules/vitest"]?.version).toBe("4.1.10");
    expect(packageLock.packages["node_modules/postcss"]?.version).toBe("8.5.24");
    expect(packageLock.packages["node_modules/sharp"]?.version).toBe("0.35.3");
  });

  test("pins approved install scripts for native tooling used by Next and ESLint", () => {
    const packageJson = readJson("package.json") as {
      allowScripts?: Record<string, boolean>;
    };

    expect(packageJson.allowScripts).toMatchObject({
      "sharp@0.35.3": true,
      "unrs-resolver@1.12.2": true,
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

    expect(packageJson.scripts?.["start:local"]).toContain("start-local-production.ps1");
    expect(launcher).toContain('$env:AUTH_TRUST_HOST = "true"');
    expect(launcher).toContain("-WindowStyle Hidden");
    expect(launcher).toContain('"$baseUrl/cstd"');
  });
});
