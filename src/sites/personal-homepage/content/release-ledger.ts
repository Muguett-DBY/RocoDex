import { cstdTimeline } from "./timeline";

export const cstdReleaseLedger = {
  schemaVersion: 1,
  release: "CSTD-17.0",
  policy: "Only shipped or repository-verifiable events are listed.",
  related: {
    studio: "https://custard.top/studio.json",
    proof: "https://custard.top/proof.json",
    observatory: "https://custard.top/observatory.json",
    contentHealth: "https://custard.top/content-health.json",
    performance: "https://custard.top/performance.json",
    experience: "https://custard.top/experience.json",
  },
  entries: cstdTimeline.filter((entry) => entry.kind === "release" || entry.kind === "diagnosis"),
} as const;
