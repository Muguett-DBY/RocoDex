import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("./cstd-landing.tsx", import.meta.url), "utf8");

describe("CSTD creative systems landing", () => {
  test("uses the generated visual system for a technical narrative", () => {
    expect(source).toContain('src="/cstd-systems-hero-v1.png"');
    expect(source).toContain('src="/cstd-systems-map-v1.png"');
    expect(source).toContain('src="/cstd-research-archive-v1.png"');
    expect(source).toContain("data-cstd-system={system.id}");
    expect(source).toContain("data-cstd-proof={proof.projectId}");
    expect(source).toContain("useReducedMotion()");
    expect(source).toContain("useScroll(");
  });

  test("turns the narrative into a responsive motion system", () => {
    expect(source).toContain("useMotionValue(");
    expect(source).toContain("useMotionTemplate`");
    expect(source).toContain("data-cstd-hero");
    expect(source).toContain("data-cstd-chapter={chapter.id}");
    expect(source).toContain("data-cstd-atlas-node={system.id}");
    expect(source).toContain("aria-pressed={activeSystemId === system.id}");
    expect(source).toContain("onPointerMove={handlePointerMove}");
  });

  test("keeps the few live product links behind the shared external-link policy", () => {
    expect(source).toContain("const targetProps = getCstdLinkTargetProps(project.href);");
    expect(source).toContain("{...targetProps}");
  });

  test("does not restore the exhibition or portfolio-tool workflows", () => {
    expect(source).not.toContain("ProjectShowcase");
    expect(source).not.toContain("ShowcaseIndex");
    expect(source).not.toContain("五个正在");
    expect(source).not.toContain("project-directory");
    expect(source).not.toContain("project-comparison");
    expect(source).not.toContain("project-guide");
    expect(source).not.toContain("project-focus");
    expect(source).not.toContain("startCstdBgm");
    expect(source).not.toContain('role="dialog"');
  });
});
