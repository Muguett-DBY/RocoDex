import { cstdTimeline } from "./timeline";

export const cstdReleaseLedger = {
  schemaVersion: 1,
  release: "CSTD-8.0",
  policy: "Only shipped or repository-verifiable events are listed.",
  related: {
    studio: "https://custard.top/studio.json",
    proof: "https://custard.top/proof.json",
  },
  entries: cstdTimeline.filter((entry) => entry.kind === "release" || entry.kind === "diagnosis"),
} as const;
