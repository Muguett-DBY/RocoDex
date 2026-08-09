"use client";

import { ArrowUpRight, BrainCircuit, GitBranch, Pause, Play, ShieldCheck } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { findCstdKnowledgePath, getCstdKnowledgeNode } from "../../content/knowledge-graph";
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

function KnowledgeLens() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeNode, setActiveNode] = useState(0);
  const lens = lenses[selected];
  const result = useMemo(() => answerGuideQuestion(lens.question, "zh"), [lens.question]);
  const path = useMemo(() => findCstdKnowledgePath(lens.source, lens.target), [lens.source, lens.target]);

  useEffect(() => {
    if (!playing || path.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveNode((current) => {
        if (current >= path.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 760);
    return () => window.clearInterval(timer);
  }, [path.length, playing]);

  return (
    <section id="path" data-cstd-chapter="path" data-cstd-scene="path" data-cstd-knowledge-lens aria-labelledby="knowledge-lens-heading" className="relative z-20 border-b border-[#3dff8f]/25 bg-[#07100d]/84 px-5 py-24 text-[#f2efe7] md:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1540px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#3dff8f]"><BrainCircuit aria-hidden="true" className="h-4 w-4" /> 04 / KNOWLEDGE INTELLIGENCE</p>
            <h2 id="knowledge-lens-heading" className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.92] md:text-7xl">不做悬浮聊天框。<span className="block text-[#24e0ff]">让答案直接长在证据路径上。</span></h2>
          </div>
          <p className="text-base leading-8 text-[#aeb9b5]">固定问题触发浏览器本地检索；回答只来自本站公开内容，并解释匹配原因、置信度与知识图中的连接路径。</p>
        </header>

        <div className="mt-14 grid gap-10 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-16">
          <div className="border-t border-white/15">
            {lenses.map((entry, index) => (
              <button key={entry.question} type="button" aria-pressed={index === selected} onClick={() => { setSelected(index); setPlaying(false); setActiveNode(0); }} className="grid w-full grid-cols-[2.5rem_1fr] gap-3 border-b border-white/15 py-5 text-left text-[#909da0] transition-colors hover:text-white aria-pressed:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#f4d431]">
                <span className="font-mono text-[9px] font-black">0{index + 1}</span>
                <span className="text-sm font-semibold leading-6">{entry.question}</span>
              </button>
            ))}
            <div className="mt-7 flex flex-wrap gap-5 font-mono text-[9px] font-black">
              <CstdLink href="/map" className="text-[#3dff8f] hover:text-white">完整知识图</CstdLink>
              <CstdLink href="/topics" className="text-[#f4d431] hover:text-white">主题路径</CstdLink>
              <CstdLink href="/graph.json" className="text-[#24e0ff] hover:text-white">GRAPH.JSON</CstdLink>
            </div>
          </div>

          <div>
            <div className="border-l-2 border-[#f4d431] bg-[#050709]/74 px-5 py-6 md:px-8 md:py-8">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] font-black">
                <span className="flex items-center gap-2 text-[#f4d431]"><BrainCircuit aria-hidden="true" className="h-4 w-4" /> LOCAL INDEX RESPONSE</span>
                <span className="flex items-center gap-2 border-l border-white/15 pl-3 text-[#3dff8f]"><ShieldCheck aria-hidden="true" className="h-4 w-4" /> {result.confidence?.toUpperCase()} CONFIDENCE</span>
              </div>
              {result.answer.split("\n\n").map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-[#d5dcda]">{paragraph}</p>)}
              <p className="mt-6 flex items-start gap-3 border-t border-white/12 pt-5 text-xs leading-6 text-[#95a29f]"><GitBranch aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#24e0ff]" /> {result.why}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {result.sources.map((source) => <CstdLink key={source.id} href={source.href.zh} className="inline-flex items-center gap-2 border-b border-[#24e0ff]/55 pb-1 text-xs text-[#24e0ff] hover:text-white">{source.title.zh}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></CstdLink>)}
              </div>
            </div>

            <div className="mt-8 border-y border-white/15 py-6" data-cstd-graph-path data-cstd-graph-active={activeNode}>
              <div className="flex items-center justify-between gap-5">
                <p className="font-mono text-[9px] font-black text-[#3dff8f]">EVIDENCE PATH / {path.length} NODES</p>
                <button type="button" onClick={() => { if (activeNode >= path.length - 1) setActiveNode(0); setPlaying((current) => !current); }} aria-label={playing ? "暂停路径播放" : "播放证据路径"} title={playing ? "暂停路径播放" : "播放证据路径"} className="flex h-9 w-9 items-center justify-center border border-[#3dff8f]/45 text-[#3dff8f] hover:bg-[#3dff8f] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#3dff8f]">
                  {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
              <ol className="mt-6 grid gap-2 md:grid-cols-3">
                {path.map((nodeId, index) => {
                  const node = getCstdKnowledgeNode(nodeId);
                  if (!node) return null;
                  return (
                    <li key={nodeId} data-cstd-graph-path-node={nodeId} data-cstd-graph-path-active={index <= activeNode ? "true" : "false"} className="min-h-28 border border-white/12 bg-[#050709]/55 p-4 transition-[background-color,border-color,transform] data-[cstd-graph-path-active=true]:-translate-y-1 data-[cstd-graph-path-active=true]:border-[#3dff8f]/60 data-[cstd-graph-path-active=true]:bg-[#0a1511]">
                      <p className="font-mono text-[8px] font-black text-[#a1afab]">0{index + 1} / {node.type.toUpperCase()}</p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-[#d7dfdc]">{node.title.zh}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedKnowledgeLens = memo(KnowledgeLens);
