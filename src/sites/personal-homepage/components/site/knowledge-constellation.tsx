"use client";

import Image from "next/image";
import { ArrowUpRight, BookOpen, Boxes, BriefcaseBusiness, FlaskConical, Orbit, Waypoints } from "lucide-react";
import { useMemo, useState } from "react";
import { cstdArtBible } from "../../content/art-bible";
import type { CstdLocale } from "../../content/content-types";
import { cstdKnowledgeGraph, getCstdKnowledgeNode, type CstdKnowledgeNode, type CstdKnowledgeNodeType } from "../../content/knowledge-graph";
import type { CstdSystem } from "../../content/systems";
import { CstdLink } from "./cstd-link";

type GraphFilter = "all" | CstdKnowledgeNodeType;
type Coordinate = Readonly<{ x: number; y: number }>;

const typeMeta = {
  system: { label: { zh: "系统", en: "Systems" }, color: "#f4d431", icon: Boxes },
  case: { label: { zh: "案例", en: "Cases" }, color: "#24e0ff", icon: BriefcaseBusiness },
  note: { label: { zh: "札记", en: "Notes" }, color: "#8ce8ff", icon: BookOpen },
  lab: { label: { zh: "实验", en: "Labs" }, color: "#ff4d43", icon: FlaskConical },
  moment: { label: { zh: "轨迹", en: "Timeline" }, color: "#3dff8f", icon: Orbit },
} as const;

const ringConfig: Record<CstdKnowledgeNodeType, { radiusX: number; radiusY: number; offset: number }> = {
  system: { radiusX: 130, radiusY: 90, offset: -Math.PI / 2 },
  case: { radiusX: 245, radiusY: 165, offset: -Math.PI / 2.25 },
  lab: { radiusX: 300, radiusY: 205, offset: Math.PI / 4 },
  note: { radiusX: 370, radiusY: 245, offset: -Math.PI / 2.5 },
  moment: { radiusX: 435, radiusY: 280, offset: Math.PI / 2.8 },
};

function createCoordinates() {
  const coordinates = new Map<string, Coordinate>();
  for (const type of Object.keys(typeMeta) as CstdKnowledgeNodeType[]) {
    const nodes = cstdKnowledgeGraph.nodes.filter((node) => node.type === type);
    const config = ringConfig[type];
    nodes.forEach((node, index) => {
      const angle = config.offset + index / nodes.length * Math.PI * 2;
      coordinates.set(node.id, { x: 500 + Math.cos(angle) * config.radiusX, y: 325 + Math.sin(angle) * config.radiusY });
    });
  }
  return coordinates;
}

const nodeCoordinates = createCoordinates();

function systemIdFor(node: CstdKnowledgeNode): CstdSystem["id"] {
  if (node.type === "system") return node.id.slice("system:".length) as CstdSystem["id"];
  return node.capabilityIds[0] ?? "product-surfaces";
}

export function KnowledgeConstellation({ locale }: { locale: CstdLocale }) {
  const [filter, setFilter] = useState<GraphFilter>("all");
  const [selectedId, setSelectedId] = useState("system:product-surfaces");
  const selected = getCstdKnowledgeNode(selectedId) ?? cstdKnowledgeGraph.nodes[0];
  const art = cstdArtBible[systemIdFor(selected)];
  const visibleIds = useMemo(() => new Set(cstdKnowledgeGraph.nodes.filter((node) => filter === "all" || node.type === filter || node.type === "system").map((node) => node.id)), [filter]);

  function selectNode(node: CstdKnowledgeNode) {
    setSelectedId(node.id);
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "graph_node", value: cstdKnowledgeGraph.nodes.indexOf(node) + 1 } }));
  }

  return (
    <div data-cstd-knowledge-constellation data-cstd-graph-filter={filter} className="relative overflow-hidden border-y border-white/12 bg-[#050709]">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/12 px-5 py-5 md:px-8">
        <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#24e0ff]"><Waypoints aria-hidden="true" className="h-4 w-4" /> GLOBAL KNOWLEDGE GRAPH / {cstdKnowledgeGraph.nodes.length} NODES / {cstdKnowledgeGraph.edges.length} EDGES</p>
        <div className="flex max-w-full overflow-x-auto border border-white/15" role="group" aria-label={locale === "zh" ? "图谱筛选" : "Graph filter"}>
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className="h-9 shrink-0 border-r border-white/15 px-3 font-mono text-[11px] font-black text-[#8f9ba0] last:border-r-0 hover:text-white aria-pressed:bg-white aria-pressed:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]">ALL</button>
          {(Object.keys(typeMeta) as CstdKnowledgeNodeType[]).map((type) => <button key={type} type="button" aria-pressed={filter === type} onClick={() => setFilter(type)} className="h-9 shrink-0 border-r border-white/15 px-3 font-mono text-[11px] font-black text-[#8f9ba0] last:border-r-0 hover:text-white aria-pressed:bg-white aria-pressed:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]">{typeMeta[type].label[locale].toUpperCase()}</button>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(19rem,0.42fr)_minmax(0,1.58fr)]">
        <aside className="relative min-h-[26rem] overflow-hidden border-b border-white/12 p-6 lg:min-h-[46rem] lg:border-b-0 lg:border-r lg:p-9">
          <Image key={art.image} src={art.image} alt="" fill sizes="(max-width: 1024px) 100vw, 28vw" className="object-cover opacity-36" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.18),rgba(5,7,9,0.98)_78%)]" />
          <div className="relative flex h-full min-h-[22rem] flex-col justify-end">
            <p className="font-mono text-[11px] font-black" style={{ color: typeMeta[selected.type].color }}>{selected.type.toUpperCase()} / {selected.updatedAt}</p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">{selected.title[locale]}</h3>
            <p className="mt-5 text-sm leading-7 text-[#aeb7ba]">{selected.summary[locale]}</p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] font-black text-[#7f8b90]">{selected.capabilityIds.map((id) => <span key={id} className="border border-white/12 px-2 py-1">{id.toUpperCase()}</span>)}</div>
            <CstdLink href={selected.href[locale]} className="mt-7 inline-flex w-fit items-center gap-3 border-b pb-2 font-mono text-[11px] font-black text-white transition-[gap,color] hover:gap-5" style={{ borderColor: art.accent }}>OPEN NODE <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
          </div>
        </aside>

        <div className="relative min-h-[31rem] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(36,224,255,0.1),transparent_55%)] lg:min-h-[46rem]" data-cstd-graph-canvas>
          <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(36,224,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(36,224,255,0.12)_1px,transparent_1px)] [background-size:52px_52px]" />
          <svg viewBox="0 0 1000 650" aria-hidden="true" className="absolute inset-0 h-full w-full">
            {cstdKnowledgeGraph.edges.map((edge) => {
              const source = nodeCoordinates.get(edge.source);
              const target = nodeCoordinates.get(edge.target);
              const visible = visibleIds.has(edge.source) && visibleIds.has(edge.target);
              if (!source || !target) return null;
              const active = edge.source === selected.id || edge.target === selected.id;
              return <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={active ? art.accent : "rgba(132,159,168,0.22)"} strokeWidth={active ? 2 : 0.8} strokeDasharray={active ? undefined : "5 8"} opacity={visible ? 1 : 0.05} className="transition-[opacity,stroke,stroke-width] duration-300" />;
            })}
          </svg>

          {cstdKnowledgeGraph.nodes.map((node) => {
            const coordinate = nodeCoordinates.get(node.id);
            if (!coordinate) return null;
            const active = selected.id === node.id;
            const visible = visibleIds.has(node.id);
            const meta = typeMeta[node.type];
            const Icon = meta.icon;
            return (
              <button key={node.id} type="button" data-cstd-graph-node={node.id} data-cstd-graph-node-active={active ? "true" : "false"} aria-label={`${meta.label[locale]}: ${node.title[locale]}`} aria-pressed={active} onClick={() => selectNode(node)} className="group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center border bg-[#050709] transition-[opacity,transform,background-color,border-color] hover:z-20 hover:scale-125 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431] md:h-9 md:w-9" style={{ left: `${coordinate.x / 10}%`, top: `${coordinate.y / 6.5}%`, opacity: visible ? 1 : 0.08, borderColor: active ? art.accent : `${meta.color}88`, backgroundColor: active ? art.accent : undefined, color: active ? "#050709" : meta.color }}>
                <Icon aria-hidden="true" className="h-3 w-3 md:h-4 md:w-4" />
                {(node.type === "system" || active) ? <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-28 -translate-x-1/2 text-center font-mono text-[11px] font-black text-white opacity-75 group-hover:opacity-100 md:w-36 md:text-[11px]">{node.title[locale]}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
