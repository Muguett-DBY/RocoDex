"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { CreatureCard } from "@/components/creature-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { availabilityStatusLabel } from "@/lib/display-labels";
import { buildCreatureFilterParams, defaultCreatureFilters, parseCreatureFilterParams } from "@/lib/filter-params";
import { filterCreatures, getUniqueAttributes, getUniqueObtainMethods } from "@/lib/creature-query";
import type { AvailabilityStatus, Creature, CreatureAttribute, CreatureFilters } from "@/types/creature";

export function CreatureExplorer() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => parseCreatureFilterParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [filters, setFilters] = useState<CreatureFilters>({ ...defaultCreatureFilters, ...initialFilters });
  const pathname = usePathname();
  const router = useRouter();

  const attributes = useMemo(() => getUniqueAttributes(creatures), [creatures]);
  const obtainMethods = useMemo(() => getUniqueObtainMethods(creatures), [creatures]);
  const results = useMemo(() => filterCreatures(creatures, filters), [creatures, filters]);
  const activeFilters = getActiveCreatureFilters(filters);

  const initialRender = useRef(true);
  const hasLoadedInitialFilters = useRef(false);

  useEffect(() => {
    let active = true;
    import("@/data/creatures").then((module) => {
      if (active) setCreatures(module.creatures);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hasLoadedInitialFilters.current) return;
    setFilters({ ...defaultCreatureFilters, ...initialFilters });
    hasLoadedInitialFilters.current = true;
  }, [initialFilters]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const params = buildCreatureFilterParams(filters);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  const resetFilters = () => {
    setFilters(defaultCreatureFilters);
  };

  const updateFilter = <K extends keyof CreatureFilters>(key: K, value: CreatureFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  if (creatures.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        正在加载图鉴数据...
      </div>
    );
  }

  return (
    <section className="space-y-6">
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
              placeholder="名称、编号、地点、获得方式"
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
          <Select value={filters.isCatchable} onChange={(event) => updateFilter("isCatchable", event.target.value as CreatureFilters["isCatchable"])}>
            <option value="all">捕捉状态</option>
            <option value="true">可捕捉</option>
            <option value="false">不可捕捉</option>
            <option value="unknown">待确认</option>
          </Select>
          <Select value={filters.isEventLimited} onChange={(event) => updateFilter("isEventLimited", event.target.value as CreatureFilters["isEventLimited"])}>
            <option value="all">活动限定</option>
            <option value="true">是</option>
            <option value="false">否</option>
            <option value="unknown">待确认</option>
          </Select>
          <Select value={filters.availabilityStatus} onChange={(event) => updateFilter("availabilityStatus", event.target.value as AvailabilityStatus | "all")}>
            <option value="all">绝版状态</option>
            <option value="available">可获得</option>
            <option value="event-limited">活动限定</option>
            <option value="unavailable">可能绝版</option>
            <option value="unknown">待确认</option>
          </Select>
          <Select className="xl:col-span-2" value={filters.obtainMethod} onChange={(event) => updateFilter("obtainMethod", event.target.value)}>
            <option value="all">全部获得方式</option>
            {obtainMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>
          <Select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value as CreatureFilters["sort"])}>
            <option value="id-asc">编号升序</option>
            <option value="id-desc">编号降序</option>
            <option value="name-asc">名称升序</option>
            <option value="name-desc">名称降序</option>
          </Select>
          <Button
            type="button"
            variant="secondary"
            onClick={resetFilters}
          >
            重置筛选
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">已选筛选</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => updateFilter(filter.key, defaultCreatureFilters[filter.key])}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              aria-label={`移除筛选 ${filter.label}`}
            >
              {filter.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          当前显示 <span className="font-semibold text-slate-950">{results.length}</span> / {creatures.length} 只精灵
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((creature) => (
            <CreatureCard key={creature.id} creature={creature} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          <p className="font-semibold text-slate-800">没有找到匹配的精灵</p>
          <p className="mt-2 text-sm">可以先移除属性、获得方式或可信度相关筛选，再保留关键词搜索。</p>
          <Button className="mt-4" type="button" variant="secondary" onClick={resetFilters}>
            清空全部筛选
          </Button>
        </div>
      )}
    </section>
  );
}

function getActiveCreatureFilters(filters: CreatureFilters) {
  const items: { key: keyof CreatureFilters; label: string }[] = [];
  if (filters.query) items.push({ key: "query", label: `关键词：${filters.query}` });
  if (filters.attribute && filters.attribute !== "all") items.push({ key: "attribute", label: `属性：${filters.attribute}` });
  if (filters.isCatchable && filters.isCatchable !== "all") items.push({ key: "isCatchable", label: `可捕捉：${triStateFilterLabel(filters.isCatchable)}` });
  if (filters.isEventLimited && filters.isEventLimited !== "all") items.push({ key: "isEventLimited", label: `活动限定：${triStateFilterLabel(filters.isEventLimited)}` });
  if (filters.availabilityStatus && filters.availabilityStatus !== "all") items.push({ key: "availabilityStatus", label: `绝版状态：${availabilityStatusLabel[filters.availabilityStatus]}` });
  if (filters.obtainMethod && filters.obtainMethod !== "all") items.push({ key: "obtainMethod", label: `获得方式：${filters.obtainMethod}` });
  if (filters.sort && filters.sort !== "id-asc") items.push({ key: "sort", label: `排序：${sortLabel(filters.sort)}` });
  return items;
}

function triStateFilterLabel(value: "true" | "false" | "unknown") {
  if (value === "unknown") return "待确认";
  return value === "true" ? "是" : "否";
}

function sortLabel(value: NonNullable<CreatureFilters["sort"]>) {
  const labels: Record<NonNullable<CreatureFilters["sort"]>, string> = {
    "id-asc": "编号升序",
    "id-desc": "编号降序",
    "name-asc": "名称升序",
    "name-desc": "名称降序",
  };
  return labels[value];
}
