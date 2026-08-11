import Image from "next/image";
import { ArrowUpRight, BrainCircuit } from "lucide-react";
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

export function KnowledgeLens({ observatory }: { observatory: CstdHomepageObservatory }) {
  const answers = lenses.map((lens) => ({
    ...lens,
    pathLength: findCstdKnowledgePath(lens.source, lens.target).length,
    result: answerGuideQuestion(lens.question, "zh"),
  }));

  return (
    <section data-cstd-chapter="path" data-cstd-scene="path" data-cstd-knowledge-lens aria-labelledby="knowledge-lens-heading" className="relative z-20 overflow-hidden border-b border-white/10 bg-[#07090b] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28">
      <Image src="/cstd-universe/cstd-knowledge-loom-v3.webp" alt="工程札记通过引用关系连接成知识网络" fill sizes="100vw" className="object-cover object-[62%_50%] opacity-12" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99),rgba(5,7,9,0.94)_58%,rgba(5,7,9,0.82))]" />

      <div className="relative mx-auto max-w-[1320px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#24e0ff]"><BrainCircuit aria-hidden="true" className="h-4 w-4" /> 05 / TECH NOTES</p>
            <h2 id="knowledge-lens-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">技术分享不堆术语，<span className="block text-[#f4d431]">只讲做过的判断。</span></h2>
          </div>
          <p className="text-sm leading-7 text-[#aeb8bb] md:text-base md:leading-8">每个答案都来自本站公开案例和札记。问题、结论与来源同屏，读者不需要先学会操作另一套工具。</p>
        </header>

        <div className="mt-12 border-t border-white/14">
          {answers.map(({ question, pathLength, result }, index) => {
            const source = result.sources[0];
            const paragraphs = result.answer.split("\n\n").map((paragraph) => paragraph.trim()).filter(Boolean);
            const excerpt = (paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs).join(" ");
            return (
              <article key={question} data-cstd-knowledge-card className="group grid gap-4 border-b border-white/14 py-7 md:grid-cols-[3rem_minmax(14rem,0.8fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-7 lg:py-8">
                <span className="sr-only">SOURCE LINKED</span>
                <span className="font-mono text-[11px] font-black text-[#f4d431]">0{index + 1}</span>
                <h3 className="text-xl font-semibold leading-tight text-white md:text-2xl">{question}</h3>
                <p className="line-clamp-2 text-sm leading-7 text-[#9da8ab]">{excerpt}</p>
                {source ? (
                  <CstdLink href={source.href.zh} aria-label="阅读来源" title={`${question} / ${pathLength} 个关联节点`} className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-[#24e0ff] transition-colors group-hover:border-[#24e0ff]/60 hover:bg-[#24e0ff] hover:text-[#050709]">
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </CstdLink>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6" data-cstd-content-health data-cstd-content-health-score={observatory.content.score}>
          <span className="font-mono text-[11px] font-black text-[#7f8b90]">CONTENT HEALTH / <span className="text-white">{observatory.content.score}</span></span>
          <div className="flex flex-wrap gap-6 font-mono text-[11px] font-black">
            <CstdLink href="/notes" className="text-[#f4d431] hover:text-white">全部札记</CstdLink>
            <CstdLink href="/map" className="text-[#aeb8bb] hover:text-white">知识图谱</CstdLink>
            <CstdLink href="/graph.json" className="text-[#24e0ff] hover:text-white">GRAPH.JSON</CstdLink>
          </div>
        </div>
      </div>
    </section>
  );
}
