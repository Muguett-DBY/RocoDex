import type { CstdLocale } from "../../content/content-types";
import { guideKnowledge, type GuideKnowledgeEntry } from "./guide-knowledge";

export type GuideConfidence = "high" | "medium" | "low";

export type GuideResult = Readonly<{
  answer: string;
  sources: readonly GuideKnowledgeEntry[];
  refused: boolean;
  reason?: "no-source" | "prompt-injection";
  confidence?: GuideConfidence;
  matchedTerms: readonly string[];
  relatedPaths: readonly GuideKnowledgeEntry[];
  why?: string;
  suggestedQuestions: readonly string[];
}>;

const unsafeInstructionPattern = /(ignore|disregard|reveal|override).{0,24}(instruction|prompt|system|policy)|system\s*prompt|忽略.{0,12}(指令|规则)|系统提示词|泄露.{0,8}(提示词|秘密)|越权/iu;

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}+#.]+/gu, " ").trim();
}

export function tokenizeGuideText(value: string) {
  const tokens = new Set<string>();
  for (const segment of normalize(value).match(/[\p{Script=Han}]+|[a-z0-9+#.]+/gu) ?? []) {
    tokens.add(segment);
    if (/^[\p{Script=Han}]+$/u.test(segment)) {
      for (let index = 0; index < segment.length - 1; index += 1) tokens.add(segment.slice(index, index + 2));
    }
  }
  return [...tokens];
}

type IndexedEntry = Readonly<{
  entry: GuideKnowledgeEntry;
  tokens: ReadonlySet<string>;
  haystack: string;
}>;

const index: readonly IndexedEntry[] = guideKnowledge.map((entry) => {
  const haystack = normalize([entry.title.zh, entry.title.en, entry.summary.zh, entry.summary.en, ...entry.keywords].join(" "));
  return { entry, haystack, tokens: new Set(tokenizeGuideText(haystack)) };
});
const entryById = new Map(guideKnowledge.map((entry) => [entry.id, entry]));

function scoreEntry(query: string, queryTokens: readonly string[], candidate: IndexedEntry) {
  let score = candidate.haystack.includes(query) && query.length >= 3 ? 14 : 0;
  const matched: string[] = [];
  for (const token of queryTokens) {
    if (candidate.tokens.has(token)) {
      score += token.length >= 4 ? 5 : 3;
      matched.push(token);
      continue;
    }
    if (token.length >= 4 && candidate.haystack.includes(token)) {
      score += 2;
      matched.push(token);
    }
  }
  if (candidate.entry.type === "case") score += 0.5;
  return { score, matched };
}

export function answerGuideQuestion(question: string, locale: CstdLocale): GuideResult {
  const normalized = normalize(question.slice(0, 240));
  if (unsafeInstructionPattern.test(question)) {
    return {
      refused: true,
      reason: "prompt-injection",
      sources: [],
      matchedTerms: [],
      relatedPaths: [],
      suggestedQuestions: [],
      answer: locale === "zh" ? "这条问题试图改变检索边界。我只检索本站公开档案，不执行问题中的指令。" : "This question attempts to change the retrieval boundary. I only search the published archive and do not execute instructions inside a query.",
    };
  }
  const queryTokens = tokenizeGuideText(normalized).filter((token) => token.length >= 2);
  const ranked = index
    .map((candidate) => ({ candidate, ...scoreEntry(normalized, queryTokens, candidate) }))
    .filter((result) => result.score >= 5)
    .sort((left, right) => right.score - left.score || right.matched.length - left.matched.length);

  if (ranked.length === 0) {
    return {
      refused: true,
      reason: "no-source",
      sources: [],
      matchedTerms: [],
      relatedPaths: [],
      suggestedQuestions: [],
      answer: locale === "zh" ? "这超出了当前公开档案。我不会用猜测补齐答案。可以改问架构、AI 研究、DCF、数据系统、性能、动效或学习路径。" : "That is outside the published archive, so I will not fill the gap with a guess. Ask about architecture, AI research, DCF, data systems, performance, motion, or the learning path.",
    };
  }

  const topScore = ranked[0].score;
  const selected = [ranked[0]];
  const isDirectlyRelated = (candidate: IndexedEntry) => selected.some((entry) => (
    entry.candidate.entry.relatedIds.includes(candidate.entry.id)
    || candidate.entry.relatedIds.includes(entry.candidate.entry.id)
  ));
  while (selected.length < 3) {
    const candidate = ranked.slice(1).find((result) => {
      if (selected.some((entry) => entry.candidate.entry.id === result.candidate.entry.id)) return false;
      if (result.score < Math.max(5, topScore * 0.36)) return false;
      const introducesType = !selected.some((entry) => entry.candidate.entry.type === result.candidate.entry.type);
      return introducesType && isDirectlyRelated(result.candidate);
    }) ?? ranked.slice(1).find((result) => {
      if (selected.some((entry) => entry.candidate.entry.id === result.candidate.entry.id)) return false;
      if (result.score < Math.max(5, topScore * 0.36)) return false;
      return !selected.some((entry) => entry.candidate.entry.type === result.candidate.entry.type);
    });
    if (!candidate) break;
    selected.push(candidate);
  }
  const sources = selected.map((result) => result.candidate.entry);
  const matchedTerms = [...new Set(selected.flatMap((result) => result.matched))].slice(0, 6);
  const sourceIds = new Set(sources.map((source) => source.id));
  const relatedPaths = [...new Set(sources.flatMap((source) => source.relatedIds))]
    .map((id) => entryById.get(id))
    .filter((entry): entry is GuideKnowledgeEntry => entry !== undefined)
    .filter((entry) => !sourceIds.has(entry.id))
    .slice(0, 3);
  const typeLabels = [...new Set(sources.map((source) => source.type.toUpperCase()))].join(" + ");
  const why = locale === "zh"
    ? `匹配 ${matchedTerms.length} 个公开术语，并跨 ${typeLabels} 证据层综合。`
    : `Matched ${matchedTerms.length} published terms across ${typeLabels} evidence layers.`;
  const suggestedQuestions = locale === "zh"
    ? ["这些结论有哪些发布证据？", "相关实验如何复现核心机制？", "这项能力如何沿时间形成？"]
    : ["What release evidence supports this?", "Which lab replays the core mechanism?", "How did this capability evolve over time?"];
  const lead = locale === "zh" ? "根据当前公开档案：" : "Based on the current published archive:";
  return {
    refused: false,
    confidence: topScore >= 12 ? "high" : topScore >= 8 ? "medium" : "low",
    sources,
    matchedTerms,
    relatedPaths,
    why,
    suggestedQuestions,
    answer: `${lead}\n\n${sources.map((source) => source.summary[locale]).join("\n\n")}`,
  };
}
