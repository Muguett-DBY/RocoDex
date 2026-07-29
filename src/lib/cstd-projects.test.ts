import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";

describe("CSTD project evidence", () => {
  test("provides complete case-study evidence for every live project", () => {
    const liveProjects = cstdProjects.filter((project) => project.status === "Live");

    expect(liveProjects).toHaveLength(5);
    for (const project of liveProjects) {
      expect(project.evidence.role.length).toBeGreaterThan(4);
      expect(project.evidence.problem.length).toBeGreaterThan(8);
      expect(project.evidence.outcome.length).toBeGreaterThan(8);
      expect(project.evidence.current.length).toBeGreaterThan(4);
    }
  });

  test("gives every live project a first-party visual preview", () => {
    const liveProjects = cstdProjects.filter((project) => project.status === "Live");

    for (const project of liveProjects) {
      expect(project.preview?.src).toMatch(/^\/cstd-projects\/[a-z-]+\.png$/);
      expect(project.preview?.alt.length).toBeGreaterThan(8);
      expect(existsSync(path.join(process.cwd(), "public", project.preview!.src.slice(1)))).toBe(true);
    }
  });

  test("keeps stable unique project ids for future deep links", () => {
    const ids = cstdProjects.map((project) => project.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["rocodex", "photography", "alpha", "design", "crm", "incubator"]);
  });
});
