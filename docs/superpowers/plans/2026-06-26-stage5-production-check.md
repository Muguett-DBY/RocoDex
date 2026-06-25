# Stage 5 Production Check Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:verification-before-completion before recording this stage as complete. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run a production-style CHECK pass across the current RocoDex app after four improvement stages and either fix discovered issues or record evidence that no code fix was required.

**Architecture:** This is a verification/reporting stage. It should not change product behavior unless evidence shows a defect. The stage output is a committed check report plus updated orchestrator logs.

**Tech Stack:** Next.js App Router, Vitest, ESLint, GitHub CLI, Browser/IAB, Vercel commit status.

---

### Task 1: Repository and local gates

- [x] Confirm clean/synced `main` start state.
- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run `npm audit --omit=dev`.
- [x] Run source hygiene scans for debug statements, TODO/FIXME markers, and obvious secret patterns.

### Task 2: Route and browser smoke checks

- [x] Start a local production server from the built output.
- [x] HTTP-check key routes: `/`, `/creatures`, `/collection`, `/collection?ids=008,009`, `/guides`, `/pvp-teams`, `/matchups`, `/skills`, `/compare`, `/discover`, `/data-status`, `/about`, `/login`.
- [x] Browser-check key UI flows: mobile header menu, collection share import, collection compare handoff, auth-unavailable fallback.
- [x] Confirm browser console errors are `0`.
- [x] Stop the local server and remove temporary logs.

### Task 3: Report and delivery

- [x] Create `.agent/stage5-check-report.md` with commands, route results, browser results, findings, and fix decision.
- [x] Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md`.
- [x] Review diff/staged diff/secret scan.
- [ ] Commit Stage 5 report, push `main`, inspect GitHub Actions/checks/Vercel status, and record the result.
