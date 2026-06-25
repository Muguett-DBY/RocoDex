"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GitCompare, Heart, Trash2 } from "lucide-react";
import { CreatureCard } from "@/components/creature-card";
import { Button } from "@/components/ui/button";
import { useCreatureCollection } from "@/hooks/use-creature-collection";
import { buildCollectionCompareHref } from "@/lib/creature-collection";
import type { Creature } from "@/types/creature";

export function CollectionWorkspace() {
  const { ids, hydrated, clear } = useCreatureCollection();
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    import("@/data/creatures").then((module) => {
      if (active) setCreatures(module.creatures);
    });
    return () => {
      active = false;
    };
  }, []);

  const creatureById = useMemo(() => new Map(creatures.map((creature) => [creature.id, creature])), [creatures]);
  const savedCreatures = ids.flatMap((id) => {
    const creature = creatureById.get(id);
    return creature ? [creature] : [];
  });
  const staleCount = ids.length - savedCreatures.length;
  const validSelectedIds = selectedIds.filter((id) => creatureById.has(id) && ids.includes(id));
  const compareHref = buildCollectionCompareHref(validSelectedIds);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  };

  if (!hydrated || creatures.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">正在加载收藏...</div>;
  }

  if (savedCreatures.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <Heart className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-5 text-xl font-bold text-slate-950">还没有收藏精灵</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
          在精灵列表或详情页点击心形按钮，即可建立当前浏览器里的培养候选清单。
        </p>
        <Link
          href="/creatures"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          浏览精灵列表
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">已收藏 {savedCreatures.length} 只精灵</p>
            <p className="mt-1 text-sm text-slate-600">勾选 2-4 只精灵，可直接进入并排对比。</p>
            {staleCount > 0 ? <p className="mt-1 text-xs text-amber-700">有 {staleCount} 条旧收藏已不在当前数据集中。</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {compareHref ? (
              <Link
                href={compareHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <GitCompare className="h-4 w-4" />
                对比已选 {validSelectedIds.length} 项
              </Link>
            ) : (
              <Button type="button" disabled>
                <GitCompare className="h-4 w-4" />
                至少选择 2 项
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={clear}>
              <Trash2 className="h-4 w-4" />
              清空收藏
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedCreatures.map((creature) => {
          const selected = validSelectedIds.includes(creature.id);
          const selectionDisabled = !selected && validSelectedIds.length >= 4;
          return (
            <div key={creature.id} className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={selectionDisabled}
                  onChange={() => toggleSelected(creature.id)}
                  className="h-4 w-4 accent-emerald-600"
                />
                {selected ? "已加入对比" : selectionDisabled ? "最多选择 4 项" : "选择用于对比"}
              </label>
              <CreatureCard creature={creature} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
