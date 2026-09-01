import Image from "next/image";
import { ArrowUpRight, BrainCircuit } from "lucide-react";
import { findCstdKnowledgePath } from "../../content/knowledge-graph";
import type { CstdHomepageObservatory } from "../../content/observatory";
import { CstdLink } from "../site/cstd-link";
import { answerGuideQuestion } from "../site/guide-retrieval";
import { ThemeChapterLabel, ThemeCopy } from "../theme-copy";
import type { CstdLocale } from "../../content/content-types";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";

const lenses = [
  {
    question: { zh: "你的双站架构怎么隔离？", en: "How do you isolate two sites in one deployment?" },
    source: "system:edge-operations",
    target: "note:host-boundaries-in-one-next-deployment",
  },
  {
    question: { zh: "AI 研究如何避免幻觉？", en: "How does AI research avoid hallucinated evidence?" },
    source: "system:ai-creation",
    target: "note:evidence-first-ai-research",
  },
  {
    question: { zh: "DCF 为什么不用模型计算？", en: "Why does the DCF engine avoid model-generated calculations?" },
    source: "system:research-models",
    target: "note:deterministic-core-ai-edge",
  },
] as const;

export function KnowledgeLens({ observatory, locale }: { observatory: CstdHomepageObservatory; locale: CstdLocale }) {
  const answers = lenses.map((lens) => ({
    ...lens,
    pathLength: findCstdKnowledgePath(lens.source, lens.target).length,
    result: answerGuideQuestion(lens.question[locale], locale),
  }));

  return (
    <section data-cstd-chapter="path" data-cstd-scene="path" data-cstd-knowledge-lens aria-labelledby="knowledge-lens-heading" className="relative z-20 overflow-hidden border-b border-white/10 bg-[#07090b] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28">
      <Image src="/cstd-universe/cstd-knowledge-loom-v3.webp" alt={locale === "zh" ? "工程札记通过引用关系连接成知识网络" : "Engineering notes connected into a knowledge network through citations"} fill sizes="100vw" className="object-cover object-[62%_50%] opacity-12" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99),rgba(5,7,9,0.94)_58%,rgba(5,7,9,0.82))]" />

      <div className="relative mx-auto max-w-[1320px]">
        <header data-cstd-chapter-header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#24e0ff]"><BrainCircuit aria-hidden="true" className="h-4 w-4" /> <ThemeChapterLabel neon="04 / TECH NOTES" ink={locale === "zh" ? "第四卷 / 心法" : "SCROLL IV / JUDGMENT"} press={locale === "zh" ? "栏目 D / 观点与札记" : "SECTION D / OPINION & NOTES"} pixel={locale === "zh" ? "关卡 04 / 知识房" : "LEVEL 04 / LORE LIBRARY"} underworld={locale === "zh" ? "神谕殿 / 技术札记" : "ORACLE HALL / TECH NOTES"} astral={locale === "zh" ? "第四章 / 旅途编年史" : "CHAPTER IV / TRAVEL CHRONICLE"} /></p>
            <h2 id="knowledge-lens-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">
              <ThemeCopy
                neon={locale === "zh" ? <>技术分享不堆术语，<span className="block text-[#f4d431]">只讲做过的判断。</span></> : <>Technical writing without a jargon wall.<span className="block text-[#f4d431]">Only decisions tested in practice.</span></>}
                ink={locale === "zh" ? <>行路有迹，<span className="block text-[#f4d431]">判断成章。</span></> : <>The path leaves a trace.<span className="block text-[#f4d431]">Judgment becomes a chapter.</span></>}
                press={locale === "zh" ? <>观点必须有来源，<span className="block text-[#f4d431]">判断必须能追溯。</span></> : <>Every opinion needs a source.<span className="block text-[#f4d431]">Every judgment must be traceable.</span></>}
                pixel={locale === "zh" ? <>解锁 LORE LIBRARY，<span className="block text-[#f4d431]">查看通关思路。</span></> : <>Unlock the LORE LIBRARY.<span className="block text-[#f4d431]">Inspect the strategy behind each clear.</span></>}
                underworld={locale === "zh" ? <>神谕不替人判断，<span className="block text-[#f4d431]">只留下可追的线索。</span></> : <>An oracle does not decide for you.<span className="block text-[#f4d431]">It leaves a trail you can follow.</span></>}
                astral={locale === "zh" ? <>地图不会替你选择，<span className="block text-[#f4d431]">但会标出每条走过的路。</span></> : <>A map will not choose for you.<span className="block text-[#f4d431]">It records every road already taken.</span></>}
              />
            </h2>
          </div>
          <p className="text-sm leading-7 text-[#aeb8bb] md:text-base md:leading-8">
            <ThemeCopy
              neon={locale === "zh" ? "有问题就从问题开始。答案、依据和下一步都放在眼前，不把读者赶去猜我的上下文。" : "Start with the question. The answer, its evidence, and the next step stay in view instead of making readers guess the context."}
              ink={locale === "zh" ? "札记不是心得墙，而是做过事情之后留下的回声。沿着出处读，才知道一笔从哪里起。" : "These are not mood-board reflections. They are notes left by work already done; follow the source to see where each line began."}
              press={locale === "zh" ? "本栏每条观点都标出出处。你可以从标题读到结论，也可以反过来从证据追问标题。" : "Every opinion in this column has a source. Read from headline to conclusion, or work backwards from evidence to the claim."}
              pixel={locale === "zh" ? "欢迎查攻略，但别跳过地图。每个答案都连着一个案例或札记，顺着节点继续探索。" : "Use the guide, but do not skip the map. Every answer connects to a case or note; follow the node when you want the longer route."}
              underworld={locale === "zh" ? "这些札记不预言答案，只记录问题怎样被拆开、依据从哪里来，以及下一次应该把火烧向哪里。" : "These notes predict nothing. They record how a problem was opened, where the evidence came from, and where the next fire should be aimed."}
              astral={locale === "zh" ? "这些札记像旅途中摊开的地图：写下岔路、代价和当时没选的方向，下一次出发时就不必重新迷路。" : "These notes are maps opened on the road. They mark the fork, the cost, and the route left untaken so the next journey does not begin lost."}
            />
          </p>
        </header>

        <div data-cstd-knowledge-list className="mt-12 border-t border-white/14">
          {answers.map(({ question, pathLength, result }, index) => {
            const localizedQuestion = question[locale];
            const source = result.sources[0];
            const paragraphs = result.answer.split("\n\n").map((paragraph) => paragraph.trim()).filter(Boolean);
            const excerpt = (paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs).join(" ");
            return (
              <article key={localizedQuestion} data-cstd-knowledge-card className="group grid gap-4 border-b border-white/14 py-7 md:grid-cols-[3rem_minmax(14rem,0.8fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-7 lg:py-8">
                <span className="sr-only">SOURCE LINKED</span>
                <span className="font-mono text-[11px] font-black text-[#f4d431]">0{index + 1}</span>
                <h3 className="text-xl font-semibold leading-tight text-white md:text-2xl">{localizedQuestion}</h3>
                <p className="line-clamp-2 text-sm leading-7 text-[#9da8ab]">{excerpt}</p>
                {source ? (
                  <CstdLink href={source.href[locale]} aria-label={locale === "zh" ? "阅读来源" : "Read source"} title={locale === "zh" ? `${localizedQuestion} / ${pathLength} 个关联节点` : `${localizedQuestion} / ${pathLength} linked nodes`} className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-[#24e0ff] transition-colors group-hover:border-[#24e0ff]/60 hover:bg-[#24e0ff] hover:text-[#050709]">
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
            <CstdLink href={getLocalizedCstdHref("/notes", locale)} className="text-[#f4d431] hover:text-white">{locale === "zh" ? "全部札记" : "ALL NOTES"}</CstdLink>
            <CstdLink href={getLocalizedCstdHref("/map", locale)} className="text-[#aeb8bb] hover:text-white">{locale === "zh" ? "知识图谱" : "KNOWLEDGE MAP"}</CstdLink>
            <CstdLink href={getLocalizedCstdHref("/graph.json", locale)} className="text-[#24e0ff] hover:text-white">GRAPH.JSON</CstdLink>
          </div>
        </div>
      </div>
    </section>
  );
}
