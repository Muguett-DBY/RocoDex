# CSTD Goal Guide Live Coverage Design

## Problem

The CSTD homepage project section has five live projects, but the goal guide only routes four visitor intents. The live photography site is only reachable through the directory card, so a visitor looking for portrait booking has no first-scan path.

## Goal

Make the project goal guide cover every live project and keep the visible path count derived from the real guide data.

## Design

- Add a portrait booking visitor intent mapped to the photography project.
- Add a guide summary helper that reports goal count, live project coverage, and uncovered live projects.
- Use the derived guide count in the project guide header and the workflow next-action copy.
- Keep the existing selected-guide, comparison, focus, URL-state, and directory behavior unchanged.

## Acceptance

- The guide routes to every live project: RocoDex, photography, Alpha, design, and CRM.
- The guide summary reports full live-project coverage.
- The workflow next action says the actual number of goal paths.
- Focused tests, lint, full tests, build, and browser verification pass.
