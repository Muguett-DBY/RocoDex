# CSTD Restored Directory And Focus Receipts Design

## Goal

Extend the restored-link receipt pattern beyond comparison links so shared filtered directory URLs and focused project URLs explain that the view was recovered from the link.

## User-Facing Behavior

- A filtered directory link such as `/cstd?category=operations&q=CRM#projects` shows a compact `筛选视图已恢复` receipt inside the existing Project index toolbar.
- A focused project link such as `/cstd?project=design#project-focus` shows a compact `分享案例已恢复` receipt inside the existing Project case study header.
- Plain `/cstd` visits and manual in-page interactions do not show these receipts.
- Manual changes to search, filters, focus, guide, or comparison state clear restored receipts so the UI does not continue claiming a manually changed state was restored from the original link.

## Constraints

- Keep the work inside existing CSTD homepage decision and evidence surfaces.
- Do not add a new stacked homepage panel.
- Preserve the existing URL state contract for `category`, `q`, `goal`, `project`, and `compare`.
- Keep the receipt text compact and mobile-safe with wrapping.

## Verification

- Pure helper tests for directory and focus receipt content.
- Source-contract tests for landing wiring and manual reset behavior.
- Desktop and 390 px mobile browser checks for directory, focus, and plain visits.
