# CSTD Project Card Scan Design

## Goal

Make the CSTD project directory easier to scan after the shareable case-study panel exists.

## Problem

- Each project card repeats full role, problem, outcome, and current-status evidence.
- Six long cards make mobile browsing feel like a document instead of a directory.
- Repeated visible `查看案例` buttons have the same accessible name.

## Decision

- Keep complete evidence in the focused case-study panel.
- Keep cards as overview tiles with only role and current-status preview.
- Give each case-study button a project-specific accessible name while preserving the short visible label.

## Acceptance

- Project card helper returns exactly two preview rows.
- Repeated case-study buttons expose project-specific labels to automation and assistive tech.
- Focused case-study panels still expose the problem and delivered outcome.
- Desktop and 390 px mobile render without horizontal overflow or console errors.
