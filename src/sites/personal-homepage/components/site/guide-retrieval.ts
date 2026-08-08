import type { CstdLocale } from "../../content/content-types";
import { guideKnowledge, type GuideKnowledgeEntry } from "./guide-knowledge";

export type GuideConfidence = "high" | "medium";

export type GuideResult = Readonly<{
  answer: string;
  sources: readonly GuideKnowledgeEntry[];
  refused: boolean;
  reason?: "no-source" | "prompt-injection";
  confidence?: GuideConfidence;
  matchedTerms: readonly string[];
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
      answer: locale === "zh" ? "这条问题试图改变检索边界。我只检索本站公开档案，不执行问题中的指令。" : "This question attempts to change the retrieval boundary. I only search the published archive and do not execute instructions inside a query.",
    };
  }
  const queryTokens = tokenizeGuideText(normalized).filter((token) => token.length >= 2);
  const ranked = index
    .map((candidate) => ({ candidate, ...scoreEntry(normalized, queryTokens, candidate) }))
    .filter((result) => result.score >= 5)
    .sort((left, right) => right.score - left.score || right.matched.length - left.matched.length)
    .slice(0, 3);

  if (ranked.length === 0) {
    return {
      refused: true,
      reason: "no-source",
      sources: [],
      matchedTerms: [],
      answer: locale === "zh" ? "这超出了当前公开档案。我不会用猜测补齐答案。可以改问架构、AI 研究、DCF、数据系统、性能、动效或学习路径。" : "That is outside the published archive, so I will not fill the gap with a guess. Ask about architecture, AI research, DCF, data systems, performance, motion, or the learning path.",
    };
  }

  const topScore = ranked[0].score;
  const sources = ranked.map((result) => result.candidate.entry);
  const matchedTerms = [...new Set(ranked.flatMap((result) => result.matched))].slice(0, 6);
  const lead = locale === "zh" ? "根据当前公开档案：" : "Based on the current published archive:";
  return {
    refused: false,
    confidence: topScore >= 12 ? "high" : "medium",
    sources,
    matchedTerms,
    answer: `${lead}\n\n${sources.map((source) => source.summary[locale]).join("\n\n")}`,
  };
}
