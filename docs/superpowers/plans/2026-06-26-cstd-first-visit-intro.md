# CSTD First-Visit Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CSTD intro a first-visit experience that repeat visitors can replay on demand.

**Architecture:** Keep decision logic in the existing pure motion helper and storage orchestration in the landing component. Preserve the current animation and controls while changing only when the overlay appears automatically.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Framer Motion

---

### Task 1: Define the intro decision

**Files:**
- Modify: `src/lib/cstd-motion.test.ts`
- Modify: `src/lib/cstd-motion.ts`

- [ ] Change the existing automatic-intro test to expect first-visit-only behavior.
- [ ] Run `npm test -- src/lib/cstd-motion.test.ts` and confirm the repeat-visit and reduced-motion assertions fail.
- [ ] Update `shouldPlayCstdIntro` to return false when `introSeen === "true"`, reduced motion is requested, or motion is disabled.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Persist intro completion

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [ ] Read `CSTD_INTRO_SEEN_KEY` during preference initialization.
- [ ] Pass the stored value into `shouldPlayCstdIntro`.
- [ ] Record the seen flag when the visitor starts or directly skips the intro.
- [ ] Rename the skip action to `直接浏览项目`.
- [ ] Run `npm run lint`, `npm test`, and `npm run build`.

### Task 3: Validate and release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Verify fresh, repeat, replay, mobile, and console behavior in the browser.
- [ ] Inspect `git status`, `git diff`, and staged diff for scope and secrets.
- [ ] Commit with `feat: streamline personal homepage entry`.
- [ ] Push `main`, check GitHub Actions and Vercel status, then record the result.
