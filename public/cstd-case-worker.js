const handlers = {
  "alpha-race": (input) => {
    const jobs = Math.max(2, Math.min(8, Number(input) || 4));
    return {
      verdict: "STALE WRITE REJECTED",
      metric: `${jobs - 1}/${jobs} guarded`,
      before: { writes: jobs, accepted: jobs, staleOverwrites: jobs - 1 },
      after: { writes: jobs, accepted: 1, staleOverwrites: 0 },
      steps: [
        ["SNAPSHOT", `All ${jobs} jobs capture version 42.`],
        ["MUTATION", "A newer decision advances the record to version 43."],
        ["LATE FINISH", `${jobs - 1} stale jobs return after the current result.`],
        ["COMPARE", "The commit guard compares expected and current versions."],
        ["COMMIT", "Only the current version may publish evidence."],
      ],
    };
  },
  "dcf-cache": (input) => {
    const records = Math.max(100, Math.min(1200, Number(input) || 600));
    const naiveOps = records * 5;
    const cachedOps = records + 2;
    const saved = Math.round((1 - cachedOps / naiveOps) * 100);
    return {
      verdict: "HOT PATH ISOLATED",
      metric: `${saved}% fewer codec ops`,
      before: { parseOps: records * 3, serializeOps: records * 2, formulaRuns: records },
      after: { parseOps: 1, serializeOps: 1, formulaRuns: records },
      steps: [
        ["PROFILE", `${records} records expose repeated JSON codec work.`],
        ["FINGERPRINT", "Inputs keep a stable data and assumption fingerprint."],
        ["CACHE", "Parsed strategy payloads are retained at the scan boundary."],
        ["COMPUTE", "The deterministic DCF formula remains unchanged."],
        ["MANIFEST", "The output records cache and formula provenance."],
      ],
    };
  },
  "host-boundaries": (input) => {
    const requests = Math.max(3, Math.min(12, Number(input) || 6));
    const personal = Math.ceil(requests / 2);
    const rocodex = requests - personal;
    return {
      verdict: "CROSS-SITE IMPORTS: 0",
      metric: `${requests}/${requests} owned`,
      before: { sharedRouter: requests, ambiguous: requests, blocked: 0 },
      after: { personal, rocodex, ambiguous: 0, blocked: 1 },
      steps: [
        ["HOST", `${requests} requests enter through two public domains.`],
        ["DECIDE", "The proxy resolves rewrite, redirect, pass-through, or 404."],
        ["OWN", "Route groups bind each path to one product tree."],
        ["GUARD", "Import tests reject cross-site production dependencies."],
        ["VERIFY", "Independent browser suites accept both live surfaces."],
      ],
    };
  },
  "crm-lock": (input) => {
    const editors = Math.max(2, Math.min(10, Number(input) || 5));
    return {
      verdict: "CONFLICT RETURNED EXPLICITLY",
      metric: `${editors - 1}/${editors} stale writes blocked`,
      before: { editors, overwrites: editors - 1, conflicts: 0 },
      after: { editors, accepted: 1, conflicts: editors - 1 },
      steps: [
        ["READ", `All ${editors} editors receive record revision 18.`],
        ["DECIDE", "The first confirmed operation advances the record to revision 19."],
        ["COMPARE", "Each later mutation includes its expected revision."],
        ["REJECT", `${editors - 1} stale mutations receive an explicit conflict.`],
        ["REFRESH", "The interface reloads current truth before another decision."],
      ],
    };
  },
};

self.addEventListener("message", (event) => {
  const { requestId, scenario, input } = event.data || {};
  const handler = handlers[scenario];
  if (!handler) {
    self.postMessage({ requestId, error: "unknown_scenario" });
    return;
  }
  self.postMessage({ requestId, scenario, result: handler(input) });
});
