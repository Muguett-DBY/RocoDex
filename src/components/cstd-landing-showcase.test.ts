import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("./cstd-landing.tsx", import.meta.url), "utf8");

describe("CSTD creative systems landing", () => {
  test("builds the elastic archive from dedicated generated materials", () => {
    for (const asset of [
      "cstd-archive-resin-circuit-v1.webp",
      "cstd-archive-data-film-v1.webp",
      "cstd-archive-notebook-v1.webp",
      "cstd-archive-cobalt-modules-v1.webp",
      "cstd-archive-studio-v1.webp",
    ]) {
      expect(source).toContain(asset);
    }
    expect(source).toContain("data-cstd-elastic-archive");
    expect(source).toContain("data-cstd-material-column");
    expect(source).toContain("data-cstd-image-trail");
    expect(source).toContain("data-cstd-system={system.id}");
    expect(source).toContain("data-cstd-proof={proof.projectId}");
    expect(source).toContain("useReducedMotion()");
    expect(source).toContain("useScroll(");
  });

  test("turns the archive into a responsive motion system", () => {
    expect(source).toContain("useMotionValue(");
    expect(source).toContain("useSpring(");
    expect(source).toContain("data-cstd-hero");
    expect(source).toContain("data-cstd-hero-depth");
    expect(source).toContain("data-cstd-chapter={chapter.id}");
    expect(source).toContain("onPointerMove={handlePointerMove}");
    expect(source).toContain("onViewportEnter");
  });

  test("composes every chapter into one continuous kinetic studio", () => {
    expect(source).toContain("data-cstd-header-theme={visualChapter}");
    expect(source).toContain("data-cstd-signal-strip");
    expect(source).toContain("data-cstd-signal-track");
    expect(source).toContain("function RevealHeading");
    expect(source).toContain("data-cstd-proof-reel");
    expect(source).toContain("data-cstd-learning-step={entry.year}");
    expect(source).toContain("data-cstd-research-state={activeEntry.year}");
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
