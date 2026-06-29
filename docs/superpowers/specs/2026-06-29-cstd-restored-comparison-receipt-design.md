# CSTD Restored Comparison Receipt Design

## Problem

Stage 5 fixed restored CSTD project-state links so the intro no longer blocks direct comparison links. After that fix, a clean visitor lands immediately inside the comparison matrix, but the surface still does not explicitly say that the goal and selected projects were restored from the shared URL.

## Goal

Make restored comparison links self-explanatory at the point of arrival, without adding another homepage panel or changing the URL-state contract.

## Design

- Extend the existing comparison context model with an optional receipt.
- The receipt appears only when the current project view state was restored from a valid URL state.
- Render the receipt inside the existing comparison header, below the goal/project context line and above the scan summary.
- Keep manual in-page comparisons unchanged, so users building a comparison from the default page do not see a misleading "restored" message.

## Copy

- Label: `分享视图已恢复`
- Detail with goal: `目标路径与 2 个对比项目已从链接恢复，可直接查看判断。`
- Detail without goal: `手动选择与 2 个对比项目已从链接恢复，可直接查看判断。`

## Acceptance

- Direct comparison links show the restored-state receipt on desktop and mobile.
- Plain `/cstd` first visits and manually built comparisons do not show the receipt.
- The receipt wraps safely on 390 px mobile.
- Existing comparison context, fit, next action, copy brief, and URL hash behavior stay unchanged.
