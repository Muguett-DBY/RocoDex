# Stage 5 CI Stability Round 2 Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Check the current GitHub Actions and deployment pipeline, then update CI action pins if the checked primary-source release state shows newer stable majors.

**Evidence before changes:**
- Branch: `main`
- Latest local HEAD before Stage 5: `5133ca2`
- Latest 10 GitHub Actions runs on `main`: success
- Latest Vercel commit status for `5133ca2`: success
- GitHub API latest releases: `actions/checkout@v7.0.0`, `actions/setup-node@v6.4.0`

## Checklist

- [x] Inspect branch, remote, recent commits, workflow, scripts, lockfile, Node/npm versions, recent GitHub Actions, and Vercel status.
- [x] Add failing static workflow expectations for current action major versions.
- [x] Upgrade `.github/workflows/ci.yml` action pins.
- [x] Run CI-equivalent local gates.
- [x] Run HTTP and Browser smoke checks.
- [x] Commit, push, and verify GitHub Actions plus Vercel.
