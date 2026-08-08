"use client";

import { ArrowUpRight, BookOpen, CalendarDays, CornerDownLeft, Search, ShieldCheck, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { CstdLocale } from "../../content/content-types";
import { CstdLink } from "./cstd-link";
import { answerGuideQuestion, type GuideResult } from "./guide-retrieval";

const suggestions = {
  zh: ["你的双站架构怎么隔离？", "AI 研究如何避免幻觉？", "DCF 为什么不用模型计算？"],
  en: ["How are the two sites isolated?", "How does AI research stay grounded?", "Why is DCF deterministic?"],
} as const;

export function TechnicalGuide({ locale, open, onClose }: { locale: CstdLocale; open: boolean; onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<GuideResult | null>(null);
  const recentRequests = useRef<number[]>([]);
  const copy = useMemo(() => locale === "zh" ? {
    eyebrow: "SOURCE-CONSTRAINED GUIDE",
    title: "只回答本站已经公开的技术事实。",
    body: "本地检索，不调用外部模型，不上传问题；每个答案都附页面来源。",
    placeholder: "问一个具体技术问题…",
    submit: "检索档案",
    sources: "来源",
    matched: "匹配依据",
    limited: "请求太快，请稍后再试。",
  } : {
    eyebrow: "SOURCE-CONSTRAINED GUIDE",
    title: "Answers only from published technical facts.",
    body: "Local retrieval, no external model and no uploaded prompt. Every answer links to its source.",
    placeholder: "Ask a specific technical question…",
    submit: "Search archive",
    sources: "Sources",
    matched: "Matched terms",
    limited: "Too many requests. Try again in a moment.",
  }, [locale]);

  function submit(rawQuestion: string) {
    const value = rawQuestion.trim().slice(0, 240);
    if (!value) return;
    const now = Date.now();
    recentRequests.current = recentRequests.current.filter((timestamp) => now - timestamp < 10_000);
    if (recentRequests.current.length >= 6) {
      setResult({ answer: copy.limited, sources: [], refused: true, matchedTerms: [] });
      return;
    }
    recentRequests.current.push(now);
    const nextResult = answerGuideQuestion(value, locale);
    setResult(nextResult);
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: nextResult.refused ? "guide_refusal" : "guide_answer", value: nextResult.sources.length } }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cstd-guide-title">
      <button type="button" aria-label={locale === "zh" ? "关闭技术向导" : "Close technical guide"} className="absolute inset-0 cursor-default" onClick={onClose} />
      <section className="relative flex h-full w-full max-w-[42rem] flex-col border-l border-[#24e0ff]/35 bg-[#07090b]/98 shadow-[-30px_0_90px_rgba(0,0,0,0.55)]">
        <header className="border-b border-white/12 px-5 py-5 md:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[9px] font-black text-[#24e0ff]">{copy.eyebrow}</p>
              <h2 id="cstd-guide-title" className="mt-3 max-w-xl text-2xl font-semibold leading-tight text-[#f2efe7] md:text-3xl">{copy.title}</h2>
            </div>
            <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-[#aab3b6] transition-colors hover:border-[#f4d431] hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]" aria-label={locale === "zh" ? "关闭" : "Close"}>
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#8f9ba0]">{copy.body}</p>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className="flex flex-wrap gap-2">
            {suggestions[locale].map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => { setQuestion(suggestion); submit(suggestion); }} className="border border-white/15 px-3 py-2 text-left text-xs text-[#b8c0c2] transition-colors hover:border-[#24e0ff]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]">
                {suggestion}
              </button>
            ))}
          </div>

          {result ? (
            <div data-cstd-guide-result className="mt-8 border-l-2 border-[#f4d431] bg-white/[0.035] px-5 py-5">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] font-black text-[#f4d431]">
                <BookOpen aria-hidden="true" className="h-4 w-4" /> ARCHIVE RESPONSE
                {result.confidence ? <span className="flex items-center gap-1.5 border-l border-white/15 pl-3 text-[#3dff8f]"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />{result.confidence.toUpperCase()} CONFIDENCE</span> : null}
              </div>
              {result.answer.split("\n\n").map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-[#d8ddde]">{paragraph}</p>)}
              {result.matchedTerms.length > 0 ? <div className="mt-5 flex flex-wrap items-center gap-2"><span className="font-mono text-[8px] font-black text-[#68757b]">{copy.matched.toUpperCase()}</span>{result.matchedTerms.map((term) => <span key={term} className="border border-white/12 px-2 py-1 font-mono text-[8px] font-black text-[#9ba6aa]">{term}</span>)}</div> : null}
              {result.sources.length > 0 ? (
                <div className="mt-6 border-t border-white/12 pt-4">
                  <p className="font-mono text-[9px] font-black text-[#778286]">{copy.sources.toUpperCase()}</p>
                  {result.sources.map((source) => (
                    <CstdLink key={source.id} href={source.href[locale]} onClick={onClose} className="group mt-3 flex items-center justify-between gap-4 border-b border-white/8 pb-3 text-sm text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]">
                      <span><span className="block">{source.title[locale]}</span><span className="mt-1 flex items-center gap-2 font-mono text-[8px] font-black text-[#68757b]"><CalendarDays aria-hidden="true" className="h-3 w-3" />{source.type.toUpperCase()} / {source.updatedAt}</span></span>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </CstdLink>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-10 border-y border-white/10 py-10 text-center">
              <Search aria-hidden="true" className="mx-auto h-7 w-7 text-[#526167]" />
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#718087]">{locale === "zh" ? "试着问：为什么同一个仓库可以承载两个网站？" : "Try asking why one repository can safely host two websites."}</p>
            </div>
          )}
        </div>

        <form className="border-t border-white/12 bg-[#0a0d10] p-5 md:p-8" onSubmit={(event) => { event.preventDefault(); submit(question); }}>
          <label className="sr-only" htmlFor="cstd-guide-question">{copy.placeholder}</label>
          <div className="flex border border-white/20 bg-black/25 focus-within:border-[#24e0ff]">
            <input id="cstd-guide-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={240} placeholder={copy.placeholder} className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-[#59666b]" />
            <button type="submit" aria-label={copy.submit} title={copy.submit} className="flex h-12 w-12 shrink-0 items-center justify-center self-center text-[#f4d431] transition-colors hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]">
              <CornerDownLeft aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
