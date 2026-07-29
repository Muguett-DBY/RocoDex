import type { CstdProject } from "./cstd-projects";

export type CstdShowcaseProject = {
  project: CstdProject & { preview: NonNullable<CstdProject["preview"]> };
  number: string;
};

export function getCstdShowcaseProjects(projects: readonly CstdProject[]): CstdShowcaseProject[] {
  return projects
    .filter(
      (project): project is CstdProject & { preview: NonNullable<CstdProject["preview"]> } =>
        project.status === "Live" && Boolean(project.preview) && /^https?:\/\//.test(project.href),
    )
    .map((project, index) => ({
      project,
      number: String(index + 1).padStart(2, "0"),
    }));
}
