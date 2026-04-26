import type { CreatureAttribute, ImageReviewStatus } from "@/types/creature";

export type GuideMode = "pve" | "pvp";

export type GuideTier = "S" | "A" | "B" | "C" | "D" | "未评级";

export type GuideConfidence = "confirmed" | "partial" | "analysis" | "unknown";

export type GuideSourceBasis = "source-derived" | "analysis-derived" | "unknown";

export type GuideSourceKind = "bwiki" | "pvp-meta" | "guide" | "community" | "manual-note";

export interface GuideSource {
  title: string;
  url: string;
  kind: GuideSourceKind;
  publisher?: string;
  publishedAt?: string;
  note?: string;
}

export interface GuideTextField {
  value: string;
  sourceBasis: GuideSourceBasis;
  reason: string;
}

export interface GuideListField {
  values: string[];
  sourceBasis: GuideSourceBasis;
  reason: string;
}

export interface GuideCreatureBuild {
  id: string;
  dexId: string;
  name: string;
  formName?: string;
  image: string;
  imageSourceUrl: string;
  imageReviewStatus: ImageReviewStatus;
  attributes: CreatureAttribute[];
  pveTier: GuideTier;
  pvpTier: GuideTier;
  roles: string[];
  scenes: string[];
  nature: GuideTextField;
  talent: GuideListField;
  moves: GuideListField;
  buildNotes: string[];
  recommendedTeams: string[];
  counters: string[];
  risks: string[];
  sources: GuideSource[];
  confidence: GuideConfidence;
  updatedAt: string;
  reviewNotes: string[];
  analysisNote: string;
}

export interface GuideFilters {
  mode: GuideMode;
  query?: string;
  attribute?: CreatureAttribute | "all";
  role?: string;
  tier?: GuideTier | "all";
  confidence?: GuideConfidence | "all";
}

export interface GuideStats {
  total: number;
  byConfidence: Record<GuideConfidence, number>;
  byMode: Record<GuideMode, { rated: number; unrated: number }>;
}
