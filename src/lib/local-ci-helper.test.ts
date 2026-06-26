import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

describe("local CI helper", () => {
  test("documents a Windows-safe clean install path for locked Next SWC binaries", () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const helper = readFileSync(join(process.cwd(), "scripts", "stop-local-next.ps1"), "utf8");

    expect(packageJson.scripts["ci:local"]).toContain("stop-local-next.ps1");
    expect(packageJson.scripts["ci:local"]).toContain("npm ci");
    expect(helper).toContain("$repoRoot");
    expect(helper).toContain("Get-CimInstance Win32_Process");
    expect(helper).toContain("CommandLine -like \"*$repoRoot*\"");
    expect(helper).toContain("next");
  });
});
