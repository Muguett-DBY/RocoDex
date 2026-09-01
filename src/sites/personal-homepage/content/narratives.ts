import type { CstdLocale, LocalizedText } from "./content-types";
import { cstdSystems, type CstdSystem } from "./systems";

export type CstdNarrativeMode = "builder" | "researcher" | "collaborator";

export type CstdNarrative = Readonly<{
  id: CstdNarrativeMode;
  label: LocalizedText;
  shortLabel: LocalizedText;
  thesis: LocalizedText;
  description: LocalizedText;
  action: LocalizedText;
  systemOrder: readonly CstdSystem["id"][];
  projectOrder: readonly string[];
}>;

export const cstdNarratives: readonly CstdNarrative[] = [
  {
    id: "builder",
    label: { zh: "工程建造者", en: "Builder" },
    shortLabel: { zh: "建造", en: "Build" },
    thesis: { zh: "我更关心东西能不能在真实环境里跑起来。", en: "I care whether a thing survives contact with a real environment." },
    description: { zh: "从界面开始，把数据、权限、失败和发布一起做完。这里放的是已经运行过的产品，以及做产品时留下的判断。", en: "Start with the interface, then carry data, permissions, failure, and release all the way through. This is a record of products that ran and the decisions behind them." },
    action: { zh: "沿交付链路进入", en: "Enter the delivery path" },
    systemOrder: ["product-surfaces", "edge-operations", "data-systems", "ai-creation", "research-models"],
    projectOrder: ["rocodex", "crm", "alpha"],
  },
  {
    id: "researcher",
    label: { zh: "研究深潜者", en: "Researcher" },
    shortLabel: { zh: "研究", en: "Research" },
    thesis: { zh: "先把资料、口径和不确定性摆到桌面上。", en: "Put sources, definitions, and uncertainty on the table first." },
    description: { zh: "从一条数据怎么来的开始看，再看它如何进入模型、界面和决定。这里更在意能不能回头检查，而不是答案听起来多漂亮。", en: "Start with where a datum came from, then follow it into a model, an interface, and a decision. The point is being able to check the work later, not making an answer sound impressive." },
    action: { zh: "沿证据链路进入", en: "Enter the evidence path" },
    systemOrder: ["research-models", "data-systems", "ai-creation", "edge-operations", "product-surfaces"],
    projectOrder: ["alpha", "rocodex", "crm"],
  },
  {
    id: "collaborator",
    label: { zh: "产品合作者", en: "Collaborator" },
    shortLabel: { zh: "合作", en: "Collaborate" },
    thesis: { zh: "从一个具体问题开始，做到有人愿意继续用。", en: "Start with a concrete problem and make something people choose to keep using." },
    description: { zh: "先说清楚谁在什么场景里需要什么，再决定做多少技术。案例会把取舍、交付和后续维护放在同一张桌上。", en: "First make clear who needs what, and in which situation; then choose the amount of technology that earns its place. The cases put trade-offs, delivery, and maintenance side by side." },
    action: { zh: "沿价值链路进入", en: "Enter the value path" },
    systemOrder: ["product-surfaces", "ai-creation", "edge-operations", "research-models", "data-systems"],
    projectOrder: ["crm", "rocodex", "alpha"],
  },
] as const;

export function getCstdNarrative(mode: CstdNarrativeMode) {
  return cstdNarratives.find((entry) => entry.id === mode) ?? cstdNarratives[0];
}

export function getNarrativeSystems(mode: CstdNarrativeMode) {
  const order = getCstdNarrative(mode).systemOrder;
  return order
    .map((id) => cstdSystems.find((system) => system.id === id))
    .filter((system) => system !== undefined) as readonly CstdSystem[];
}

export function getCstdNarrativeSharePath(mode: CstdNarrativeMode, locale: CstdLocale = "zh") {
  const path = mode === "researcher" ? "/for/research" : mode === "collaborator" ? "/for/collaboration" : "/for/builder";
  return locale === "en" ? `/en${path}` : path;
}

export function parseCstdNarrativeShareSlug(slug: string): CstdNarrativeMode | null {
  if (slug === "builder") return "builder";
  if (slug === "research" || slug === "researcher") return "researcher";
  if (slug === "collaboration" || slug === "collaborator") return "collaborator";
  return null;
}
