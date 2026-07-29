import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("./cstd-landing.tsx", import.meta.url), "utf8");

describe("CSTD visual showcase", () => {
  test("renders the generated studio hero and the curated shipped-work exhibition", () => {
    expect(source).toContain('src="/cstd-studio-hero.png"');
    expect(source).toContain("getCstdShowcaseProjects(cstdProjects)");
    expect(source).toContain('aria-label="作品索引"');
    expect(source).toContain("data-cstd-project={project.id}");
    expect(source).toContain("useReducedMotion()");
  });

  test("keeps direct project links behind the shared external-link policy", () => {
    expect(source).toContain("const targetProps = getCstdLinkTargetProps(project.href);");
    expect(source).toContain("{...targetProps}");
  });

  test("does not restore the removed portfolio-tool workflows", () => {
    expect(source).not.toContain("project-directory");
    expect(source).not.toContain("project-comparison");
    expect(source).not.toContain("project-guide");
    expect(source).not.toContain("project-focus");
    expect(source).not.toContain("startCstdBgm");
    expect(source).not.toContain('role="dialog"');
  });
});
