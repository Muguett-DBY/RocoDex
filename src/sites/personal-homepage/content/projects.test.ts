import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { cstdCaseStudies, getCaseStudyPath } from "./case-studies";
import { cstdProjects } from "./projects";

describe("CSTD project evidence", () => {
  test("provides complete case-study evidence for every live project", () => {
    const liveProjects = cstdProjects.filter((project) => project.status === "Live");

    expect(liveProjects.map((project) => project.id)).toEqual(["photography"]);
    for (const project of liveProjects) {
      expect(project.evidence.role.length).toBeGreaterThan(4);
      expect(project.evidence.problem.length).toBeGreaterThan(8);
      expect(project.evidence.outcome.length).toBeGreaterThan(8);
      expect(project.evidence.current.length).toBeGreaterThan(4);
    }
  });

  test("retains a first-party visual preview for every completed project", () => {
    const completedProjects = cstdProjects.filter((project) => project.status !== "Next");

    for (const project of completedProjects) {
      expect(project.preview?.src).toMatch(/^\/cstd-projects\/[a-z-]+\.png$/);
      expect(project.preview?.alt.length).toBeGreaterThan(8);
      expect(existsSync(path.join(process.cwd(), "public", project.preview!.src.slice(1)))).toBe(true);
    }
  });

  test("routes offline project cards to their retained case studies", () => {
    const offlineProjects = cstdProjects.filter((project) => project.status === "Offline");

    expect(offlineProjects.map((project) => project.id)).toEqual(["alpha", "design", "crm"]);
    for (const project of offlineProjects) {
      const caseStudy = cstdCaseStudies.find((entry) => entry.projectId === project.id)!;
      expect(project.href).toBe(getCaseStudyPath(caseStudy, "zh"));
      expect(caseStudy.liveHref).toBeUndefined();
      expect(caseStudy.artifacts.some((artifact) => artifact.kind === "production")).toBe(false);
    }
  });

  test("keeps stable unique project ids for future deep links", () => {
    const ids = cstdProjects.map((project) => project.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["photography", "alpha", "design", "crm", "incubator"]);
  });
});
