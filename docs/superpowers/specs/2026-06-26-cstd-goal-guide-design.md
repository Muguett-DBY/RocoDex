# CSTD Goal Guide Design

## Goal

Help visitors choose a project by intent before they know the project names.

## Problem

- The project directory is clear after filtering, but it still assumes visitors know which project they want.
- New visitors may arrive with a goal such as research, AI creation, game data, or CRM operations.
- The homepage needs a low-cost routing layer that reuses existing project focus behavior.

## Decision

- Add a compact goal guide above the project index.
- Keep each guide item as a button that focuses the matching project case study.
- Use existing project IDs so the guide cannot drift from the real directory.

## Acceptance

- Every guide item targets an existing project.
- The guide covers RocoDex, CSTD Alpha, the AI creation workspace, and the CRM.
- Clicking a guide item opens the same shareable focus panel as project cards.
- Mobile remains within viewport width.
