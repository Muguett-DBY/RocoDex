export const cstdFailureDrillPhases = ["idle", "trigger", "containment", "outcome"] as const;

export type CstdFailureDrillPhase = (typeof cstdFailureDrillPhases)[number];

export function getNextFailureDrillPhase(phase: CstdFailureDrillPhase): CstdFailureDrillPhase {
  const index = cstdFailureDrillPhases.indexOf(phase);
  return cstdFailureDrillPhases[Math.min(index + 1, cstdFailureDrillPhases.length - 1)];
}

export function getFailureDrillProgress(phase: CstdFailureDrillPhase) {
  if (phase === "idle") return 0;
  return cstdFailureDrillPhases.indexOf(phase) / (cstdFailureDrillPhases.length - 1);
}
