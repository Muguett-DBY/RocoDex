import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import { getCstdShowcaseProjects } from "./cstd-showcase";

describe("CSTD showcase projects", () => {
  test("keeps the homepage focused on the five shipped projects with real previews", () => {
    const showcase = getCstdShowcaseProjects(cstdProjects);

    expect(showcase.map(({ project }) => project.id)).toEqual([
      "rocodex",
      "photography",
      "alpha",
      "design",
      "crm",
    ]);
    expect(showcase.map(({ number }) => number)).toEqual(["01", "02", "03", "04", "05"]);
    expect(showcase.every(({ project }) => project.status === "Live" && project.preview)).toBe(true);
  });

  test("excludes incomplete or non-navigable projects from the exhibition", () => {
    const showcase = getCstdShowcaseProjects([
      ...cstdProjects,
      {
        ...cstdProjects[0],
        id: "no-preview",
        preview: undefined,
      },
      {
        ...cstdProjects[0],
        id: "internal-link",
        href: "#work",
      },
    ]);

    expect(showcase.map(({ project }) => project.id)).not.toContain("incubator");
    expect(showcase.map(({ project }) => project.id)).not.toContain("no-preview");
    expect(showcase.map(({ project }) => project.id)).not.toContain("internal-link");
  });
});
