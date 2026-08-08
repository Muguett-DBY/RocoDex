import { Bot, Boxes, CloudCog, DatabaseZap, Microscope, type LucideIcon } from "lucide-react";
import type { CstdSystem, CstdSystemIcon } from "../../content/systems";
import { cstdDistrictAccents } from "../../content/district-tokens";

export const cstdSystemIcons: Record<CstdSystemIcon, LucideIcon> = {
  product: Boxes,
  edge: CloudCog,
  ai: Bot,
  research: Microscope,
  data: DatabaseZap,
};

export const cstdSystemAccents: Record<CstdSystemIcon, string> = {
  product: cstdDistrictAccents["product-surfaces"],
  edge: cstdDistrictAccents["edge-operations"],
  ai: cstdDistrictAccents["ai-creation"],
  research: cstdDistrictAccents["research-models"],
  data: cstdDistrictAccents["data-systems"],
};

export const cstdAtlasCoordinates: Record<CstdSystem["id"], { x: number; y: number }> = {
  "product-surfaces": { x: 86, y: 74 },
  "edge-operations": { x: 390, y: 60 },
  "ai-creation": { x: 430, y: 222 },
  "research-models": { x: 84, y: 236 },
  "data-systems": { x: 254, y: 286 },
};
