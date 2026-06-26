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
    expect(workflow).toContain("actions/setup-node@v6");
    expect(workflow).toContain("node-version: 22");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run lint");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm run build");
  });
});
