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
    thesis: { zh: "把复杂问题编译成真正运行的系统。", en: "Compile complex problems into systems that actually run." },
    description: { zh: "奶黄包的个人技术工作室。从产品表面、系统边界到发布证据，沿完整交付链路进入这座城市。", en: "Custard's personal engineering studio. Enter through the complete delivery chain, from product surfaces and boundaries to release evidence." },
    action: { zh: "沿交付链路进入", en: "Enter the delivery path" },
    systemOrder: ["product-surfaces", "edge-operations", "data-systems", "ai-creation", "research-models"],
    projectOrder: ["rocodex", "crm", "alpha"],
  },
  {
    id: "researcher",
    label: { zh: "研究深潜者", en: "Researcher" },
    shortLabel: { zh: "研究", en: "Research" },
    thesis: { zh: "让模型、数据与 AI 的每一步都可复现。", en: "Keep every model, dataset, and AI step reproducible." },
    description: { zh: "奶黄包的个人技术工作室。优先进入量化研究、数据血缘与证据优先 AI，查看结论如何被约束。", en: "Custard's personal engineering studio. Start with quantitative research, data lineage, and evidence-first AI to inspect how conclusions are constrained." },
    action: { zh: "沿证据链路进入", en: "Enter the evidence path" },
    systemOrder: ["research-models", "data-systems", "ai-creation", "edge-operations", "product-surfaces"],
    projectOrder: ["alpha", "rocodex", "crm"],
  },
  {
    id: "collaborator",
    label: { zh: "产品合作者", en: "Collaborator" },
    shortLabel: { zh: "合作", en: "Collaborate" },
    thesis: { zh: "先看价值、决策与交付，再决定一起做什么。", en: "See value, decisions, and delivery before deciding what to build together." },
    description: { zh: "奶黄包的个人技术工作室。以真实产品表面和业务结果开场，再深入实现、研究与运行证据。", en: "Custard's personal engineering studio. Begin with real product surfaces and outcomes, then inspect implementation, research, and runtime evidence." },
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

export function getNarrativeLabel(mode: CstdNarrativeMode, locale: CstdLocale) {
  return getCstdNarrative(mode).label[locale];
}

export function getCstdNarrativeSharePath(mode: CstdNarrativeMode) {
  if (mode === "researcher") return "/for/research";
  if (mode === "collaborator") return "/for/collaboration";
  return "/for/builder";
}

export function parseCstdNarrativeShareSlug(slug: string): CstdNarrativeMode | null {
  if (slug === "builder") return "builder";
  if (slug === "research" || slug === "researcher") return "researcher";
  if (slug === "collaboration" || slug === "collaborator") return "collaborator";
  return null;
}
