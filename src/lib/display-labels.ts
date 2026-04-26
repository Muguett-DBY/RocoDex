import type { AvailabilityStatus, Confidence } from "@/types/creature";
import type { GuideConfidence } from "@/types/guide";
import type { SourceFreshness, SourceTier } from "@/types/pvp-team";

export const availabilityStatusLabel: Record<AvailabilityStatus, string> = {
  available: "可获得",
  "event-limited": "活动限定",
  unavailable: "可能绝版",
  unknown: "待确认",
};

export const confidenceLabel: Record<Confidence, string> = {
  confirmed: "已确认",
  partial: "部分确认",
  unknown: "待确认",
};

export const guideConfidenceLabel: Record<GuideConfidence, string> = {
  confirmed: "已确认",
  partial: "部分确认",
  analysis: "本站分析",
  unknown: "待复核",
};

export const sourceFreshnessLabel: Record<SourceFreshness, string> = {
  current: "当前",
  archived: "历史",
};

export const sourceTierLabel: Record<SourceTier, string> = {
  official: "官方",
  guide: "攻略站",
  community: "社区",
  "needs-review": "待复核",
};

export function triStateLabel(value: boolean | "unknown") {
  if (value === "unknown") return "待确认";
  return value ? "是" : "否";
}
