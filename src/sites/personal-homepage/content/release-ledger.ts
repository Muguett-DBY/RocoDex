import { cstdTimeline } from "./timeline";
import { CSTD_RELEASE } from "./release";
import { createCstdUrl } from "../infrastructure/origin";

export const cstdReleaseLedger = {
  schemaVersion: 1,
  release: CSTD_RELEASE,
  policy: "Only shipped or repository-verifiable events are listed.",
  related: {
    studio: createCstdUrl("/studio.json"),
    proof: createCstdUrl("/proof.json"),
    observatory: createCstdUrl("/observatory.json"),
    contentHealth: createCstdUrl("/content-health.json"),
    performance: createCstdUrl("/performance.json"),
    experience: createCstdUrl("/experience.json"),
  },
  entries: cstdTimeline.filter((entry) => entry.kind === "release" || entry.kind === "diagnosis"),
} as const;
