# Auth Storage Outage Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make direct credentials login attempts fail safely when account storage is unavailable.

**Architecture:** Keep the existing Auth.js credentials provider and add a narrow catch around storage lookup only. Test by mocking Auth.js initialization and invoking the captured `authorize` callback directly.

**Tech Stack:** NextAuth/Auth.js credentials provider, Vitest module mocks, existing storage error helper.

---

### Task 1: Red Test

**Files:**
- Create: `src/lib/auth.test.ts`
- Modify: `src/lib/auth.ts`

- [ ] Mock `next-auth`, `next-auth/providers/credentials`, `@/lib/db`, and `bcryptjs`.
- [ ] Import `src/lib/auth.ts` and capture the credentials provider config.
- [ ] Assert known storage-unavailable errors resolve to `null` and call `console.warn`.
- [ ] Assert unknown lookup errors still reject.
- [ ] Run `npx vitest run src/lib/auth.test.ts` and confirm it fails before the fix.

### Task 2: Fix

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] Import `isStorageUnavailableError`.
- [ ] Wrap only the `findUserByUsername` call in `try/catch`.
- [ ] On known storage outage, warn and return `null`.
- [ ] Re-throw unknown errors.
- [ ] Re-run focused auth tests and confirm they pass.

### Task 3: Verification And Stage Closure

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Run full local gates: lint, typecheck, test, build, E2E, audit, diff check.
- [ ] Run browser smoke for the login outage state and recovery link.
- [ ] Update logs, commit, push `main`, watch GitHub Actions, check Vercel, and record remote evidence.
