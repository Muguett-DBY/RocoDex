import type { cstdProjects } from "./cstd-projects";

type CstdProject = (typeof cstdProjects)[number];

export function getCstdProjectCardPreview(project: CstdProject) {
  return [
    { label: "负责", value: project.evidence.role },
    { label: "现在", value: project.evidence.current },
  ];
}

export function getCstdProjectFocusButtonLabel(project: CstdProject) {
  return `查看${project.title}案例`;
}
