import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const require = createRequire(import.meta.url);
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs.js") as {
  getRootDirs: (context: { cwd: string; settings: { next?: { rootDir: string | string[] } } }) => string[];
};

describe("Next ESLint root directory discovery", () => {
  test("uses the working directory when no override is configured", () => {
    expect(getRootDirs({ cwd: process.cwd(), settings: {} })).toEqual([process.cwd()]);
  });

  test("resolves directory globs and brace alternatives through the scoped replacement", () => {
    const rootDir = join(process.cwd(), "src", "{app,sites}");
    const result = getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir } } });
    expect(result.map((path) => resolve(path)).sort()).toEqual(
      [resolve("src/app"), resolve("src/sites")].sort(),
    );
  });

  test("supports multiple roots and ignores unmatched patterns", () => {
    const rootDir = [join(process.cwd(), "src", "sites"), join(process.cwd(), "missing-root-*")];
    const result = getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir } } });
    expect(result.map((path) => resolve(path))).toEqual([resolve("src/sites")]);
  });
});
