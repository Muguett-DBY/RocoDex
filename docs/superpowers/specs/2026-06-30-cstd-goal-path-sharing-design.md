# CSTD Goal Path Sharing Design

## Problem

Goal selection already survives in URL state, but the match panel has no direct way to share that intent. Copying the browser address can accidentally include unrelated directory search, project focus, or comparison state.

## Decision

Add a dedicated copy control beside the match-clear control. It creates a clean link containing only the validated `goal` parameter and the projects anchor. Clipboard success is announced in place; unsupported or failed clipboard access reveals a read-only full URL for manual copying.

## Acceptance

- A valid selected goal serializes to a clean, stable project-guide URL.
- Invalid or empty goal ids cannot produce a share link.
- Copy success, unsupported access, and failure have explicit live-region feedback.
- The fallback URL is visible and selectable only when automatic copying is unavailable.
- The added icon control remains 44 px and does not overlap match content.
