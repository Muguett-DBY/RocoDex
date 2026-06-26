import type { cstdProjects } from "./cstd-projects";

type CstdProject = (typeof cstdProjects)[number];

const proofTimelineOrder = ["crm", "design", "alpha", "rocodex", "photography"] as const;

export type CstdProjectProofTimelineItem = {
  projectId: string;
  title: string;
  signal: string;
  proof: string;
  href: string;
};

export type CstdProjectProofTimeline = {
  summary: string;
  items: CstdProjectProofTimelineItem[];
};

export function getCstdProjectProofTimeline(projects: readonly CstdProject[]): CstdProjectProofTimeline {
  const liveProjects = projects.filter((project) => project.status === "Live");
  const orderedProjects = proofTimelineOrder
    .map((projectId) => liveProjects.find((project) => project.id === projectId))
    .filter((project): project is CstdProject => Boolean(project));

  return {
    summary: `${orderedProjects.length} 个线上项目都有可追溯的当前状态与交付证据`,
    items: orderedProjects.map((project) => ({
      projectId: project.id,
      title: project.title,
      signal: project.evidence.current,
      proof: project.evidence.outcome,
      href: project.href,
    })),
  };
}
