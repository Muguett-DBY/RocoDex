import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

describe("local CI helper", () => {
  test("stops local servers before reinstalling the locked dependencies", () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["ci:local"]).toContain("stop-local-next.ps1");
    expect(packageJson.scripts["ci:local"]).toContain("npm ci");
  });

  test("uses checkout-scoped Next and Wrangler process checks for local cleanup", () => {
    const scripts = join(process.cwd(), "scripts");
    const runtime = readFileSync(join(scripts, "local-production-runtime.psm1"), "utf8");
    const start = readFileSync(join(scripts, "start-local-production.ps1"), "utf8");
    const stop = readFileSync(join(scripts, "stop-local-next.ps1"), "utf8");

    expect(runtime).toContain("node_modules\\next\\dist\\bin\\next");
    expect(runtime).toContain("node_modules\\wrangler\\bin\\wrangler.js");
    expect(runtime).toContain("node_modules\\wrangler\\wrangler-dist\\cli.js");
    expect(runtime).toContain("$current.CreationDate -eq $process.CreationDate");
    expect(start).toContain('"{0}" dev');
    expect(start).toContain("$_.OwningProcess -in $ownedIds");
    expect(stop).toContain("Stop-CustardRuntimeTree");
    expect(stop).not.toContain("Stop-Process -Id");
    expect(stop).toContain("Enter-CustardLocalServerLock");
  });
});
