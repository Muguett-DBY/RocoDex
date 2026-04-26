"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, Filter, Search, ShieldAlert, Sparkles } from "lucide-react";
import { AttributeBadges } from "@/components/attribute-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  filterGuideBuilds,
  getGuideStats,
  getUniqueGuideAttributes,
  getUniqueGuideRoles,
  groupGuideBuildsByTier,
  guideTierOrder,
} from "@/lib/guide-query";
import { buildGuideFilterParams, defaultGuideFilters } from "@/lib/filter-params";
import { guideConfidenceLabel } from "@/lib/display-labels";
import { guideBuildSlug } from "@/lib/seo-pages";
import type { CreatureAttribute } from "@/types/creature";
import type { GuideConfidence, GuideCreatureBuild, GuideFilters, GuideMode, GuideSourceBasis, GuideTier } from "@/types/guide";

const tierTone: Record<GuideTier, "emerald" | "blue" | "amber" | "rose" | "slate"> = {
  S: "emerald",
  A: "blue",
  B: "amber",
  C: "slate",
  D: "rose",
  未评级: "slate",
};

const confidenceTone: Record<GuideConfidence, "emerald" | "blue" | "amber" | "slate"> = {
  confirmed: "emerald",
  partial: "blue",
  analysis: "amber",
  unknown: "slate",
};

export function GuideExplorer({ builds, initialFilters = defaultGuideFilters }: { builds: GuideCreatureBuild[]; initialFilters?: GuideFilters }) {
  const [filters, setFilters] = useState<GuideFilters>({ ...defaultGuideFilters, ...initialFilters });
  const [selectedId, setSelectedId] = useState(builds.find((build) => build.pvpTier !== "未评级")?.id ?? builds[0]?.id ?? "");
  const pathname = usePathname();
  const router = useRouter();

  const stats = useMemo(() => getGuideStats(builds), [builds]);
  const attributes = useMemo(() => getUniqueGuideAttributes(builds), [builds]);
  const roles = useMemo(() => getUniqueGuideRoles(builds), [builds]);
  const filtered = useMemo(() => filterGuideBuilds(builds, filters), [builds, filters]);
  const groups = useMemo(() => groupGuideBuildsByTier(filtered, filters.mode), [filtered, filters.mode]);
  const selectedBuild = filtered.find((build) => build.id === selectedId) ?? filtered[0];
  const activeFilters = getActiveGuideFilters(filters);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const params = buildGuideFilterParams(filters);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  const resetFilters = () => {
    setFilters(defaultGuideFilters);
  };

  const updateFilter = <K extends keyof GuideFilters>(key: K, value: GuideFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const setMode = (mode: GuideMode) => {
    setFilters((current) => ({ ...current, mode, tier: "all" as const }));
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex rounded-md bg-slate-100 p-1">
          <Button type="button" variant={filters.mode === "pvp" ? "primary" : "ghost"} className="h-9 px-3" onClick={() => setMode("pvp")}>
            PVP强度榜
          </Button>
          <Button type="button" variant={filters.mode === "pve" ? "primary" : "ghost"} className="h-9 px-3" onClick={() => setMode("pve")}>
            PVE强度榜
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge tone="emerald">PVP已评级 {stats.byMode.pvp.rated}</Badge>
          <Badge tone="amber">PVE待补 {stats.byMode.pve.unrated}</Badge>
          <Badge tone="slate">总条目 {stats.total}</Badge>
          <Badge tone="blue">待复核 {stats.byConfidence.unknown}</Badge>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="h-4 w-4 text-emerald-600" />
          搜索与筛选
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="relative md:col-span-2">
            <span className="sr-only">关键词</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={filters.query ?? ""}
              onChange={(event) => updateFilter("query", event.target.value)}
              className="pl-10"
              placeholder="名称、编号、定位、配招"
            />
          </label>
          <Select value={filters.attribute} onChange={(event) => updateFilter("attribute", event.target.value as CreatureAttribute | "all")}>
            <option value="all">全部属性</option>
            {attributes.map((attribute) => (
              <option key={attribute} value={attribute}>
                {attribute}
              </option>
            ))}
          </Select>
          <Select value={filters.role} onChange={(event) => updateFilter("role", event.target.value)}>
            <option value="all">全部定位</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          <Select value={filters.tier} onChange={(event) => updateFilter("tier", event.target.value as GuideTier | "all")}>
            <option value="all">全部评级</option>
            {guideTierOrder.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </Select>
          <Select value={filters.confidence} onChange={(event) => updateFilter("confidence", event.target.value as GuideConfidence | "all")}>
            <option value="all">全部可信度</option>
            <option value="confirmed">已确认</option>
            <option value="partial">部分确认</option>
            <option value="analysis">本站分析</option>
            <option value="unknown">待复核</option>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">已选筛选</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => updateFilter(filter.key, defaultGuideFilters[filter.key])}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              aria-label={`移除筛选 ${filter.label}`}
            >
              {filter.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}

      {selectedBuild ? <GuideDetail build={selectedBuild} mode={filters.mode} /> : null}

      <div className="space-y-6">
        {guideTierOrder.map((tier) => {
          const tierBuilds = groups[tier];
          if (tierBuilds.length === 0) return null;

          return (
            <section key={tier} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge tone={tierTone[tier]}>{tier}</Badge>
                  <h2 className="text-lg font-bold text-slate-950">{filters.mode === "pvp" ? "PVP" : "PVE"} {tier} 档</h2>
                </div>
                <p className="text-sm text-slate-500">{tierBuilds.length} 只</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tierBuilds.map((build) => (
                  <button
                    key={build.id}
                    type="button"
                    onClick={() => setSelectedId(build.id)}
                    className="group h-full rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    <Card className={`h-full overflow-hidden transition group-hover:-translate-y-0.5 group-hover:border-emerald-300 group-hover:shadow-md ${selectedBuild?.id === build.id ? "border-emerald-300 ring-2 ring-emerald-100" : ""}`}>
                      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-4">
                        <Image src={build.image} alt={`${build.name} 立绘`} width={180} height={180} className="h-full max-h-36 w-auto object-contain" />
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-500">NO.{build.dexId}</p>
                            <h3 className="mt-1 truncate text-base font-bold text-slate-950">{build.name}</h3>
                          </div>
                          <Badge tone={tierTone[filters.mode === "pvp" ? build.pvpTier : build.pveTier]}>{filters.mode === "pvp" ? build.pvpTier : build.pveTier}</Badge>
                        </div>
                        <AttributeBadges attributes={build.attributes} />
                        <div className="flex flex-wrap gap-2">
                          <Badge tone={confidenceTone[build.confidence]}>{guideConfidenceLabel[build.confidence]}</Badge>
                          {build.roles.slice(0, 2).map((role) => (
                            <Badge key={role} tone="slate">
                              {role}
                            </Badge>
                          ))}
                          <Badge tone="blue">更新 {build.updatedAt}</Badge>
                          <Badge tone="slate">来源 {build.sources.length}</Badge>
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          <p className="font-semibold text-slate-800">没有找到匹配的攻略条目</p>
          <p className="mt-2 text-sm">建议先清除评级、定位或可信度筛选，再保留关键词。</p>
          <Button
            className="mt-4"
            type="button"
            variant="secondary"
            onClick={resetFilters}
          >
            清空全部筛选
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function getActiveGuideFilters(filters: GuideFilters) {
  const items: { key: keyof GuideFilters; label: string }[] = [];
  if (filters.mode !== "pvp") items.push({ key: "mode", label: "模式：PVE" });
  if (filters.query) items.push({ key: "query", label: `关键词：${filters.query}` });
  if (filters.attribute && filters.attribute !== "all") items.push({ key: "attribute", label: `属性：${filters.attribute}` });
  if (filters.role && filters.role !== "all") items.push({ key: "role", label: `定位：${filters.role}` });
  if (filters.tier && filters.tier !== "all") items.push({ key: "tier", label: `评级：${filters.tier}` });
  if (filters.confidence && filters.confidence !== "all") items.push({ key: "confidence", label: `可信度：${guideConfidenceLabel[filters.confidence]}` });
  return items;
}

function GuideDetail({ build, mode }: { build: GuideCreatureBuild; mode: GuideMode }) {
  const activeTier = mode === "pvp" ? build.pvpTier : build.pveTier;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50 to-sky-50">
        <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex h-36 w-36 items-center justify-center rounded-lg bg-white p-3">
            <Image src={build.image} alt={`${build.name} 立绘`} width={144} height={144} className="max-h-32 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone={tierTone[activeTier]}>{mode === "pvp" ? "PVP" : "PVE"} {activeTier}</Badge>
              <Badge tone={confidenceTone[build.confidence]}>{guideConfidenceLabel[build.confidence]}</Badge>
              <Badge tone="amber">更新 {build.updatedAt}</Badge>
            </div>
            <CardTitle className="mt-3 text-2xl">{build.name}</CardTitle>
            <Link href={`/guides/${guideBuildSlug(build)}`} className="mt-2 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              打开独立攻略页
            </Link>
            <div className="mt-3">
              <AttributeBadges attributes={build.attributes} />
            </div>
            {build.analysisNote ? (
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-800">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {build.analysisNote}
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <FieldBlock title="定位" items={build.roles} />
          <FieldBlock title="适用场景" items={build.scenes} />
          <FieldBlock title="推荐阵容" items={build.recommendedTeams.length > 0 ? build.recommendedTeams : ["待复核"]} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <BuildField title="性格" values={[build.nature.value]} basis={build.nature.sourceBasis} reason={build.nature.reason} />
          <BuildField title="天分" values={build.talent.values} basis={build.talent.sourceBasis} reason={build.talent.reason} />
          <BuildField title="配招" values={build.moves.values} basis={build.moves.sourceBasis} reason={build.moves.reason} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldBlock title="培养说明" items={build.buildNotes} />
          <FieldBlock title="克制 / 风险" items={[...build.counters.map((item) => `克制：${item}`), ...build.risks.map((item) => `风险：${item}`), ...build.reviewNotes]} />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {build.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {source.publisher ? `${source.publisher} · ` : ""}
              {source.title}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FieldBlock({ title, items }: { title: string; items: string[] }) {
  const visibleItems = items.length > 0 ? items : ["待复核"];

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <Badge key={item} tone={item.includes("待复核") ? "amber" : "slate"}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function BuildField({ title, values, basis, reason }: { title: string; values: string[]; basis: GuideSourceBasis; reason: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <Badge tone={basis === "unknown" ? "amber" : basis === "analysis-derived" ? "blue" : "emerald"}>{basisLabel(basis)}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} tone={value === "待复核" ? "amber" : "slate"}>
            {value}
          </Badge>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{reason}</p>
    </div>
  );
}

function basisLabel(basis: GuideSourceBasis) {
  if (basis === "source-derived") return "来源整理";
  if (basis === "analysis-derived") return "本站分析";
  return "待复核";
}
