import type { CstdSystem } from "./systems";

export const cstdDistrictAccents = {
  "product-surfaces": "#f4d431",
  "edge-operations": "#24e0ff",
  "ai-creation": "#ff4d43",
  "research-models": "#3dff8f",
  "data-systems": "#8ce8ff",
} as const satisfies Record<CstdSystem["id"], string>;
