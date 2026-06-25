"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Copy, GitCompare, Heart, Trash2 } from "lucide-react";
import { CreatureCard } from "@/components/creature-card";
import { CollectionInsightsPanel } from "@/components/collection-insights-panel";
import { Button } from "@/components/ui/button";
import { useCreatureCollection } from "@/hooks/use-creature-collection";
import { getCollectionGuideHref } from "@/lib/collection-guide-links";
import { summarizeCollectionInsights } from "@/lib/collection-insights";
import { buildCollectionCompareHref, buildCollectionShareHref } from "@/lib/creature-collection";
import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild } from "@/types/guide";

export function CollectionWorkspace({ sharedIds = [] }: { sharedIds?: string[] }) {
  const { ids, hydrated, addMany, clear } = useCreatureCollection();
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [guideBuilds, setGuideBuilds] = useState<GuideCreatureBuild[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importDismissed, setImportDismissed] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    let active = true;
    Promise.all([import("@/data/creatures"), import("@/data/guide-builds")]).then(([creatureModule, guideModule]) => {
      if (!active) return;
      setCreatures(creatureModule.creatures);
      setGuideBuilds(guideModule.guideBuilds);
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
  const insights = guideBuilds ? summarizeCollectionInsights(ids, creatures, guideBuilds) : null;
  const importableSharedIds = sharedIds.filter((id) => creatureById.has(id) && !ids.includes(id));
  const shareHref = buildCollectionShareHref(ids);

  const importSharedIds = () => {
    addMany(importableSharedIds);
    setImportDismissed(true);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(shareHref, window.location.origin).toString());
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  };

  if (!hydrated || creatures.length === 0 || !guideBuilds) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">正在加载收藏...</div>;
  }

  if (savedCreatures.length === 0) {
    return (
      <section className="space-y-4">
        <SharedImportBanner
          importableCount={importableSharedIds.length}
          dismissed={importDismissed}
          onDismiss={() => setImportDismissed(true)}
          onImport={importSharedIds}
        />
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
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SharedImportBanner
        importableCount={importableSharedIds.length}
        dismissed={importDismissed}
        onDismiss={() => setImportDismissed(true)}
        onImport={importSharedIds}
      />

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
            <Button type="button" variant="secondary" onClick={copyShareLink}>
              <Copy className="h-4 w-4" />
              {shareStatus === "copied" ? "已复制" : shareStatus === "failed" ? "复制失败" : "复制分享链接"}
            </Button>
          </div>
        </div>
      </div>

      {insights ? <CollectionInsightsPanel insights={insights} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedCreatures.map((creature) => {
          const selected = validSelectedIds.includes(creature.id);
          const selectionDisabled = !selected && validSelectedIds.length >= 4;
          const guideHref = guideBuilds ? getCollectionGuideHref(creature.id, guideBuilds) : null;
          return (
            <div key={creature.id} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex min-h-10 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={selectionDisabled}
                    onChange={() => toggleSelected(creature.id)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  {selected ? "已加入对比" : selectionDisabled ? "最多选择 4 项" : "选择用于对比"}
                </label>
                {guideHref ? (
                  <Link
                    href={guideHref}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <BookOpen className="h-4 w-4" />
                    查看攻略
                  </Link>
                ) : null}
              </div>
              <CreatureCard creature={creature} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SharedImportBanner({
  importableCount,
  dismissed,
  onDismiss,
  onImport,
}: {
  importableCount: number;
  dismissed: boolean;
  onDismiss: () => void;
  onImport: () => void;
}) {
  if (dismissed || importableCount === 0) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">检测到分享清单</p>
          <p className="mt-1 text-emerald-800">可导入 {importableCount} 只当前还未收藏的精灵，导入后会与本地收藏合并。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onImport}>
            导入分享清单
          </Button>
          <Button type="button" variant="secondary" onClick={onDismiss}>
            暂不导入
          </Button>
        </div>
      </div>
    </div>
  );
}
