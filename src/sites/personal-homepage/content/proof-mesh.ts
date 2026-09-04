import { generatedCstdProofMesh } from "./generated/content-registry";
import { CSTD_RELEASE } from "./release";
import { createCstdUrl } from "../infrastructure/origin";

export type CstdProofFreshness = "current" | "aging" | "stale";

export const cstdProofMesh = generatedCstdProofMesh;

export const cstdProofMeshManifest = {
  schemaVersion: 2,
  release: CSTD_RELEASE,
  verifiedAt: cstdProofMesh.map((entry) => entry.verifiedAt).sort().at(-1) ?? "2026-08-09",
  totals: {
    projects: cstdProofMesh.length,
    artifacts: cstdProofMesh.reduce((sum, entry) => sum + entry.artifactCount, 0),
    verified: cstdProofMesh.filter((entry) => entry.status === "verified").length,
  },
  related: {
    graph: createCstdUrl("/graph.json"),
    status: createCstdUrl("/status.json"),
    studio: createCstdUrl("/studio.json"),
    releases: createCstdUrl("/releases.json"),
    feed: createCstdUrl("/feed.json"),
    observatory: createCstdUrl("/observatory.json"),
    contentHealth: createCstdUrl("/content-health.json"),
    performance: createCstdUrl("/performance.json"),
    experience: createCstdUrl("/experience.json"),
  },
  entries: cstdProofMesh,
} as const;

export function getCstdProofFreshness(verifiedAt: string, now = new Date()): CstdProofFreshness {
  const verifiedTime = Date.parse(`${verifiedAt}T00:00:00Z`);
  if (!Number.isFinite(verifiedTime)) return "stale";
  const ageDays = Math.max(0, (now.getTime() - verifiedTime) / 86_400_000);
  if (ageDays <= 45) return "current";
  if (ageDays <= 120) return "aging";
  return "stale";
}
