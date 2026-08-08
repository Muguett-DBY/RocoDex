import { generatedCstdProofMesh } from "./generated/content-registry";

export type CstdProofFreshness = "current" | "aging" | "stale";

export const cstdProofMesh = generatedCstdProofMesh;

export const cstdProofMeshManifest = {
  schemaVersion: 1,
  release: "CSTD-6.0",
  verifiedAt: cstdProofMesh.map((entry) => entry.verifiedAt).sort().at(-1) ?? "2026-08-09",
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
