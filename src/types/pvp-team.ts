export type RecommendationBasis = "source-derived" | "analysis-derived";

export type PvpStrength = "T0" | "T1" | "T2";
export type SourceFreshness = "current" | "archived";
export type SourceTier = "official" | "guide" | "community" | "needs-review";
export type LineupCompleteness = "complete" | "analysis-expanded" | "candidate";

export type PvpArchetype =
  | "全能"
  | "冰控"
  | "幽灵"
  | "火攻"
  | "毒伤"
  | "星陨"
  | "平衡"
  | "虫队"
  | "爆发"
  | "冲段"
  | "减能"
  | "速攻";

export interface PvpSource {
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
  tier: SourceTier;
  note?: string;
}

export interface RecommendedNature {
  value: string;
  sourceBasis: RecommendationBasis;
  reason: string;
}

export interface RecommendedTalent {
  priority: string[];
  sourceBasis: RecommendationBasis;
  reason: string;
}

export interface PvpMove {
  name: string;
  sourceBasis: RecommendationBasis;
}

export interface PvpTeamMember {
  name: string;
  image: string;
  imageSourceUrl: string;
  imageReviewStatus: "needs-review" | "approved-local" | "rejected";
  role: string;
  moves: PvpMove[];
  nature: RecommendedNature;
  talent: RecommendedTalent;
  note?: string;
}

export interface PvpTeam {
  id: string;
  name: string;
  strength: PvpStrength;
  archetype: PvpArchetype;
  suitableFor: string;
  summary: string;
  playstyle: string[];
  counters: string[];
  risks: string[];
  members: PvpTeamMember[];
  sources: PvpSource[];
  confidence: "confirmed" | "partial";
  metaDate: string;
  sourceFreshness: SourceFreshness;
  verifiedAfter: string;
  sourceTier: SourceTier;
  lineupCompleteness: LineupCompleteness;
  sourceConflict?: string;
  analysisDisclaimer: string;
}
