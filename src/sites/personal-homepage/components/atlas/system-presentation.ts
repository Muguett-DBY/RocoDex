import { Bot, Boxes, CloudCog, DatabaseZap, Microscope, type LucideIcon } from "lucide-react";
import type { CstdSystem, CstdSystemIcon } from "../../content/systems";

export const cstdSystemIcons: Record<CstdSystemIcon, LucideIcon> = {
  product: Boxes,
  edge: CloudCog,
  ai: Bot,
  research: Microscope,
  data: DatabaseZap,
};

export const cstdSystemAccents: Record<CstdSystemIcon, string> = {
  product: "#f4d431",
  edge: "#24e0ff",
  ai: "#ff3b30",
  research: "#3dff8f",
  data: "#e8edf0",
};

export const cstdAtlasCoordinates: Record<CstdSystem["id"], { x: number; y: number }> = {
  "product-surfaces": { x: 86, y: 74 },
  "edge-operations": { x: 390, y: 60 },
  "ai-creation": { x: 430, y: 222 },
  "research-models": { x: 84, y: 236 },
  "data-systems": { x: 254, y: 286 },
};
