import { Network, Orbit, Route, Waypoints } from "lucide-react";
import { cstdKnowledgeGraphStats } from "../../content/knowledge-graph";
import type { CstdLocale } from "../../content/content-types";
import { KnowledgeConstellation } from "../site/knowledge-constellation";
import { CstdSiteChrome } from "../site/cstd-site-chrome";
import { StructuredData } from "../site/structured-data";
import { CstdPageHero } from "./page-hero";

const mapHero = {
  src: "/cstd-districts/data-systems-v1.webp",
  alt: { zh: "数据流与知识节点构成的 CSTD 全局图谱", en: "The CSTD global map formed by data streams and knowledge nodes" },
  position: "50% 48%",
} as const;

export function CstdMapPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? {
    eyebrow: "06 / KNOWLEDGE CONSTELLATION",
    title: "所有项目、札记与实验，共享同一张技术星图。",
    summary: "从五个系统区域出发，沿案例证据、技术札记、可复现实验与成长节点自由穿行。每条边都来自公开内容关系，不是随机装饰。",
    title2: "知识不是目录，是可以继续走下去的路径。",
    body: "选择节点会切换区域主视觉、上下文与关联链路。图谱只呈现已发布内容，Ask CSTD 2.0 也使用同一组关系提供多源答案。",
  } : {
    eyebrow: "06 / KNOWLEDGE CONSTELLATION",
    title: "Every project, note, and lab shares one technical constellation.",
    summary: "Start from five system districts and travel through case evidence, field notes, reproducible labs, and learning moments. Every edge comes from a published content relationship.",
    title2: "Knowledge is not a directory. It is a path you can continue.",
    body: "Selecting a node changes the district visual, context, and related route. The graph contains only published material, and Ask CSTD 2.0 uses the same relationships for multi-source answers.",
  };
  const metrics = [
    { value: cstdKnowledgeGraphStats.nodes, label: locale === "zh" ? "公开节点" : "published nodes", icon: Orbit },
    { value: cstdKnowledgeGraphStats.edges, label: locale === "zh" ? "证据关系" : "evidence edges", icon: Route },
    { value: cstdKnowledgeGraphStats.systems, label: locale === "zh" ? "系统区域" : "system districts", icon: Network },
    { value: cstdKnowledgeGraphStats.evidenceNodes, label: locale === "zh" ? "案例 / 札记 / 实验" : "cases / notes / labs", icon: Waypoints },
  ];

  return (
    <CstdSiteChrome locale={locale} page="map">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={mapHero} />
        <section className="border-b border-white/12 bg-[#080a0c] px-5 py-16 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1540px] gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <div><p className="font-mono text-[9px] font-black text-[#f4d431]">CSTD / GRAPH SCHEMA 01</p><h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">{copy.title2}</h2><p className="mt-5 max-w-xl text-sm leading-7 text-[#9aa4a8]">{copy.body}</p></div>
            <dl className="grid grid-cols-2 border-l border-t border-white/12 md:grid-cols-4">{metrics.map(({ value, label, icon: Icon }) => <div key={label} className="border-b border-r border-white/12 p-5"><dt className="flex items-center gap-2 font-mono text-[8px] font-black text-[#68757b]"><Icon aria-hidden="true" className="h-3.5 w-3.5" />{label.toUpperCase()}</dt><dd className="mt-4 text-3xl font-semibold text-[#24e0ff]">{value}</dd></div>)}</dl>
          </div>
        </section>
        <KnowledgeConstellation locale={locale} />
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "CollectionPage", name: copy.title, description: copy.summary, url: `https://custard.top${locale === "en" ? "/en/map" : "/map"}` }} />
    </CstdSiteChrome>
  );
}
