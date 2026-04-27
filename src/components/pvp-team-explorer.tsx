"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, ShieldAlert, Sparkles } from "lucide-react";
import type { PvpArchetype, PvpStrength, PvpTeam, SourceFreshness, SourceTier } from "@/types/pvp-team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { sourceFreshnessLabel, sourceTierLabel } from "@/lib/display-labels";
import { buildPvpFilterParams, defaultPvpFilters, parsePvpFilterParams, type PvpFilters } from "@/lib/filter-params";
import { pvpTeamSlug } from "@/lib/pvp-query";

const strengthTone: Record<PvpStrength, "emerald" | "amber" | "blue"> = {
  T0: "emerald",
  T1: "blue",
  T2: "amber",
};

export function PvpTeamExplorer() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => parsePvpFilterParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [teams, setTeams] = useState<PvpTeam[]>([]);
  const [filters, setFilters] = useState<PvpFilters>({ ...defaultPvpFilters, ...initialFilters });
  const pathname = usePathname();
  const router = useRouter();
  const hasLoadedInitialFilters = useRef(false);

  useEffect(() => {
    let active = true;
    import("@/data/pvp-teams").then((module) => {
      if (active) setTeams([...module.pvpTeams, ...module.archivedPvpTeams]);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hasLoadedInitialFilters.current) return;
    setFilters({ ...defaultPvpFilters, ...initialFilters });
    hasLoadedInitialFilters.current = true;
  }, [initialFilters]);

  const archetypes = useMemo(() => Array.from(new Set(teams.map((team) => team.archetype))), [teams]);
  const sourceTiers = useMemo(() => Array.from(new Set(teams.map((team) => team.sourceTier))), [teams]);
  const filtered = teams.filter((team) => {
    if (filters.freshness !== "all" && team.sourceFreshness !== filters.freshness) return false;
    if (filters.sourceTier !== "all" && team.sourceTier !== filters.sourceTier) return false;
    if (filters.strength !== "all" && team.strength !== filters.strength) return false;
    if (filters.archetype !== "all" && team.archetype !== filters.archetype) return false;
    return true;
  });
  const activeFilters = getActivePvpFilters(filters);

  const syncUrl = (nextFilters: PvpFilters) => {
    const params = buildPvpFilterParams(nextFilters);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const updateFilter = <K extends keyof PvpFilters>(key: K, value: PvpFilters[K]) => {
    setFilters((current) => {
      const nextFilters = { ...current, [key]: value };
      syncUrl(nextFilters);
      return nextFilters;
    });
  };

  if (teams.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        正在加载阵容数据...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        默认只展示 2026-04-15 之后的当前 META。切换到“历史阵容”时，卡片会继续保留黄色“历史”标记，避免旧资料被误当作当前推荐。
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <Select value={filters.freshness} onChange={(event) => updateFilter("freshness", event.target.value as SourceFreshness | "all")}>
          <option value="current">当前 META</option>
          <option value="archived">历史阵容</option>
          <option value="all">全部资料</option>
        </Select>
        <Select value={filters.sourceTier} onChange={(event) => updateFilter("sourceTier", event.target.value as SourceTier | "all")}>
          <option value="all">全部来源等级</option>
          {sourceTiers.map((item) => (
            <option key={item} value={item}>
              {sourceTierLabel[item]}
            </option>
          ))}
        </Select>
        <Select value={filters.strength} onChange={(event) => updateFilter("strength", event.target.value as PvpStrength | "all")}>
          <option value="all">全部强度</option>
          <option value="T0">T0</option>
          <option value="T1">T1</option>
          <option value="T2">T2</option>
        </Select>
        <Select value={filters.archetype} onChange={(event) => updateFilter("archetype", event.target.value as PvpArchetype | "all")}>
          <option value="all">全部体系</option>
          {archetypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <div className="flex items-center rounded-md bg-slate-50 px-3 text-sm text-slate-600">
          当前显示 <span className="mx-1 font-semibold text-slate-950">{filtered.length}</span> / {teams.length} 套
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">已选筛选</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => updateFilter(filter.key, defaultPvpFilters[filter.key])}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              aria-label={`移除筛选 ${filter.label}`}
            >
              {filter.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6">
        {filtered.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50 to-sky-50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={strengthTone[team.strength]}>{team.strength}</Badge>
                    <Badge tone="slate">{team.archetype}</Badge>
                    <Badge tone={team.sourceFreshness === "current" ? "emerald" : "amber"}>{sourceFreshnessLabel[team.sourceFreshness]}</Badge>
                    <Badge tone="blue">{sourceTierLabel[team.sourceTier]}</Badge>
                    <Badge tone={team.lineupCompleteness === "complete" ? "emerald" : "amber"}>
                      {team.lineupCompleteness === "complete" ? "完整阵容" : "分析补位"}
                    </Badge>
                    <Badge tone="amber">资料截至 {team.metaDate}</Badge>
                  </div>
                  <CardTitle className="mt-3 text-2xl">{team.name}</CardTitle>
                  <Link href={`/pvp-teams/${pvpTeamSlug(team)}`} className="mt-2 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                    打开独立阵容页
                  </Link>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{team.summary}</p>
                  {team.sourceConflict ? <p className="mt-2 max-w-3xl text-xs leading-5 text-amber-700">来源差异：{team.sourceConflict}</p> : null}
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 lg:max-w-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldAlert className="h-4 w-4" />
                    {team.analysisDisclaimer}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 md:grid-cols-3">
                <InfoBlock title="适合玩家" items={[team.suitableFor]} />
                <InfoBlock title="打法要点" items={team.playstyle} />
                <InfoBlock title="克制与风险" items={[...team.counters.map((item) => `克制：${item}`), ...team.risks.map((item) => `风险：${item}`)]} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {team.members.map((member) => (
                  <div key={`${team.id}-${member.name}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex gap-4">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-white">
                        <Image src={member.image} alt={`${member.name} 立绘`} width={96} height={96} className="max-h-24 w-auto object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">{member.name}</h3>
                          <Badge tone="blue">{member.role}</Badge>
                        </div>
                        {member.note ? <p className="mt-2 text-xs leading-5 text-slate-500">{member.note}</p> : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">配招</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {member.moves.map((move) => (
                            <Badge key={move.name} tone={move.sourceBasis === "analysis-derived" ? "amber" : "slate"}>
                              {move.name}
                              {move.sourceBasis === "analysis-derived" ? " · 本站分析" : ""}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">性格 / 天分</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{member.nature.value}</p>
                        <p className="mt-1 text-xs text-slate-600">天分优先：{member.talent.priority.join(" / ")}</p>
                        <Badge tone="amber" className="mt-2">
                          本站分析
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {team.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {source.publisher} · {source.publishedAt} · {sourceTierLabel[source.tier]}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          <p className="font-semibold text-slate-800">没有找到匹配的 PVP 阵容</p>
          <p className="mt-2 text-sm">建议先恢复“当前 META”并清除体系或来源等级筛选。</p>
          <Button
            className="mt-4"
            type="button"
            variant="secondary"
            onClick={() => {
              setFilters(defaultPvpFilters);
              syncUrl(defaultPvpFilters);
            }}
          >
            清空全部筛选
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function getActivePvpFilters(filters: PvpFilters) {
  const items: { key: keyof PvpFilters; label: string }[] = [];
  if (filters.freshness !== "current") items.push({ key: "freshness", label: `资料：${filters.freshness === "all" ? "全部资料" : sourceFreshnessLabel[filters.freshness]}` });
  if (filters.sourceTier !== "all") items.push({ key: "sourceTier", label: `来源：${sourceTierLabel[filters.sourceTier]}` });
  if (filters.strength !== "all") items.push({ key: "strength", label: `强度：${filters.strength}` });
  if (filters.archetype !== "all") items.push({ key: "archetype", label: `体系：${filters.archetype}` });
  return items;
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
