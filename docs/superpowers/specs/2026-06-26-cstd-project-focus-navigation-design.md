# CSTD Project Focus Navigation Design

## Problem

The CSTD homepage project focus panel is useful for one selected case study, but it is a dead end. Visitors who open a shared project link or click one card must close the focus panel and rescan the directory to compare adjacent projects.

## Decision

Add previous and next project controls inside the focus panel. Navigation follows the canonical `cstdProjects` order, updates the URL through the existing focus-link builder, clears stale copy feedback, and keeps the existing focus scroll behavior.

## Acceptance

- The first project has no previous control, and the last project has no next control.
- Middle projects expose both adjacent controls with project titles.
- Clicking an adjacent control updates the selected project, visible panel title, and `?project=` URL.
- Existing close, copy, and external project actions continue to work.
- Desktop and 390px mobile layouts do not overflow.
