export type Confidence = "confirmed" | "partial" | "unknown";

export type AvailabilityStatus = "available" | "event-limited" | "unavailable" | "unknown";

export type TriState = boolean | "unknown";

export type CreatureAttribute =
  | "普通"
  | "草"
  | "火"
  | "水"
  | "光"
  | "地"
  | "冰"
  | "龙"
  | "电"
  | "毒"
  | "虫"
  | "武"
  | "翼"
  | "萌"
  | "幽"
  | "恶"
  | "机械"
  | "幻";

export type FormStage = "Ⅰ阶" | "Ⅱ阶" | "最终形态" | "地区形态" | "首领形态" | "待确认";

export type ImageStatus = "placeholder" | "source-linked" | "local";

export type ImageReviewStatus = "needs-review" | "approved-local" | "rejected";

export type SourceKind = "dex-list" | "creature-page" | "image-file" | "manual-note";

export interface Source {
  title: string;
  url: string;
  kind: SourceKind;
  note?: string;
}

export interface CreatureImage {
  url: string;
  sourceUrl: string;
  status: ImageStatus;
  sourceNote: string;
}

export interface CreatureForm {
  formId: string;
  name: string;
  stage: FormStage;
  image: string;
  sourceUrl: string;
  imageSourceUrl: string;
  imageLicenseNote: string;
  imageReviewStatus: ImageReviewStatus;
  imageStatus: ImageStatus;
  sourceNote: string;
}

export interface CreatureSkill {
  name: string;
  level?: string;
  attribute?: CreatureAttribute | "待确认";
  category?: string;
  power?: string;
  description?: string;
  sourceUrl?: string;
  confidence: Confidence;
}

export interface Creature {
  id: string;
  name: string;
  attributes: CreatureAttribute[];
  forms: CreatureForm[];
  obtainMethods: string[];
  captureLocations: string[];
  evolutionMethods: string[];
  isCatchable: TriState;
  isEventLimited: TriState;
  availabilityStatus: AvailabilityStatus;
  skills: CreatureSkill[];
  description: string;
  sources: Source[];
  updatedAt: string;
  confidence: Confidence;
  sourceNote: string;
}

export interface CreatureFilters {
  query?: string;
  attribute?: CreatureAttribute | "all";
  isCatchable?: "all" | "true" | "false" | "unknown";
  isEventLimited?: "all" | "true" | "false" | "unknown";
  availabilityStatus?: AvailabilityStatus | "all";
  obtainMethod?: string;
  sort?: "id-asc" | "id-desc" | "name-asc" | "name-desc";
}

export interface DataGap {
  creatureId: string;
  creatureName: string;
  category: "image" | "facts";
  field: string;
  reason: string;
}
