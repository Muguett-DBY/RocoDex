import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const workflowPath = join(process.cwd(), ".github", "workflows", "ci.yml");

describe("GitHub Actions CI workflow", () => {
  it("runs the same core gates used before pushing homepage changes", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("on:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("actions/checkout@v7");
    expect(workflow).toContain("actions/setup-node@v7");
    expect(workflow).toContain("node-version: 24");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run audit:dependencies");
    expect(workflow).toContain("npm run lint");
    expect(workflow).toContain("npm run typecheck");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm run build");
    expect(workflow).toContain("npm run verify:personal-bundle");
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
      devDependencies: Record<string, string>;
    };
    expect(workflow).toContain(`image: mcr.microsoft.com/playwright:v${packageJson.devDependencies["@playwright/test"]}-noble`);
    expect(workflow).toContain("npm run test:e2e");
  });
});
