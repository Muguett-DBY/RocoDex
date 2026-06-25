import { cstdProjects } from "./cstd-projects";

export type CstdProjectCopyResult = "copied" | "unsupported" | "failed";

export function parseCstdProjectFocus(search: string) {
  const projectId = new URLSearchParams(search).get("project");
  if (!projectId) return null;
  return cstdProjects.some((project) => project.id === projectId) ? projectId : null;
}

export function buildCstdProjectFocusHref(projectId: string, pathname: string) {
  const params = new URLSearchParams({ project: projectId });
  return `${pathname}?${params.toString()}#project-focus`;
}

export function buildCstdProjectDirectoryHref(pathname: string) {
  return `${pathname}#projects`;
}

export async function copyCstdProjectLink(
  writeText: ((text: string) => Promise<void>) | undefined,
  url: string,
): Promise<CstdProjectCopyResult> {
  if (!writeText) return "unsupported";
  try {
    await writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
