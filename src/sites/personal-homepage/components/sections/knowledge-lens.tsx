"use client";

import Image from "next/image";
import { ArrowUpRight, BrainCircuit, GitBranch, Link2 } from "lucide-react";
import { memo } from "react";
import { findCstdKnowledgePath } from "../../content/knowledge-graph";
import type { CstdHomepageObservatory } from "../../content/observatory";
import { CstdLink } from "../site/cstd-link";
import { answerGuideQuestion } from "../site/guide-retrieval";

const lenses = [
  {
    question: "你的双站架构怎么隔离？",
    source: "system:edge-operations",
    target: "note:host-boundaries-in-one-next-deployment",
  },
  {
    question: "AI 研究如何避免幻觉？",
    source: "system:ai-creation",
    target: "note:evidence-first-ai-research",
  },
  {
    question: "DCF 为什么不用模型计算？",
    source: "system:research-models",
    target: "note:deterministic-core-ai-edge",
  },
] as const;

function KnowledgeLens({ observatory }: { observatory: CstdHomepageObservatory }) {
  const answers = lenses.map((lens) => ({
    ...lens,
    pathLength: findCstdKnowledgePath(lens.source, lens.target).length,
    result: answerGuideQuestion(lens.question, "zh"),
  }));

  return (
    <section id="path" data-cstd-chapter="path" data-cstd-scene="path" data-cstd-knowledge-lens aria-labelledby="knowledge-lens-heading" className="relative z-20 overflow-hidden border-b border-[#3dff8f]/20 bg-[#07100d] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-24">
      <Image src="/cstd-universe/cstd-knowledge-loom-v3.webp" alt="工程札记通过引用关系连接成知识网络" fill sizes="100vw" className="object-cover object-[58%_50%] opacity-22" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,9,8,0.99),rgba(5,9,8,0.9)_55%,rgba(5,9,8,0.7))]" />

      <div className="relative mx-auto max-w-[1440px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#3dff8f]"><BrainCircuit aria-hidden="true" className="h-4 w-4" /> 05 / TECH NOTES</p>
            <h2 id="knowledge-lens-heading" className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.96] md:text-6xl lg:text-7xl">技术分享不堆术语，<span className="block text-[#24e0ff]">只讲做过的判断。</span></h2>
          </div>
          <p className="text-base leading-8 text-[#aeb9b5]">每个答案都来自本站公开案例和札记。问题、结论与来源同屏，读者不需要先学会操作另一套工具。</p>
        </header>

        <div className="mt-12 grid gap-4 xl:grid-cols-3">
          {answers.map(({ question, pathLength, result }, index) => {
            const source = result.sources[0];
            const paragraphs = result.answer.split("\n\n").map((paragraph) => paragraph.trim()).filter(Boolean);
            const excerpt = (paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs).join(" ");
            return (
              <article key={question} data-cstd-knowledge-card className="flex min-h-[23rem] flex-col border border-white/14 bg-[#050908] p-5 md:p-6">
                <div className="flex items-center justify-between gap-4 font-mono text-[8px] font-black">
                  <span className="text-[#3dff8f]">0{index + 1} / ENGINEERING NOTE</span>
                  <span className="flex items-center gap-1.5 text-[#8fa09a]"><GitBranch aria-hidden="true" className="h-3.5 w-3.5" /> {pathLength} NODES</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-tight text-white">{question}</h3>
                <p className="mt-5 line-clamp-5 text-sm leading-7 text-[#b7c2be]">{excerpt}</p>
                <div className="mt-auto pt-6">
                  <div className="mb-4 flex items-center gap-2 font-mono text-[8px] font-black text-[#3dff8f]"><Link2 aria-hidden="true" className="h-3.5 w-3.5" /> SOURCE LINKED</div>
                  {source ? (
                    <CstdLink href={source.href.zh} className="inline-flex items-center gap-2 border-b border-[#24e0ff]/55 pb-1 text-xs font-semibold text-[#24e0ff] hover:text-white">
                      阅读来源 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </CstdLink>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-y border-white/14 py-5" data-cstd-content-health data-cstd-content-health-score={observatory.content.score}>
          <div className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] font-black text-[#8fa09a]">
            <span className="text-white">CONTENT {observatory.content.score}/100</span>
            <span>{observatory.content.coverage.bilingualPercent}% BILINGUAL</span>
            <span>{observatory.content.coverage.relationPercent}% RELATIONS</span>
          </div>
          <div className="flex flex-wrap gap-6 font-mono text-[9px] font-black">
            <CstdLink href="/notes" className="text-[#f4d431] hover:text-white">全部札记</CstdLink>
            <CstdLink href="/map" className="text-[#3dff8f] hover:text-white">知识图谱</CstdLink>
            <CstdLink href="/graph.json" className="text-[#24e0ff] hover:text-white">GRAPH.JSON</CstdLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedKnowledgeLens = memo(KnowledgeLens);
