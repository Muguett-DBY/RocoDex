"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RefreshCw, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttributeBadges } from "@/components/attribute-badges";
import { dimensions, type DimensionScores, type RktiResult } from "@/data/rkti";
import { creatures } from "@/data/creatures";

export function RktiResultCard({ result, scores, onRetake }: { result: RktiResult; scores: DimensionScores; onRetake: () => void }) {
  const [copied, setCopied] = useState(false);

  const creature = useMemo(
    () => creatures.find((c) => c.id === result.creatureId),
    [result.creatureId],
  );

  const handleShare = async () => {
    const text = `我在洛克图鉴完成了洛克测试，我的本命精灵是 ${creature?.name ?? "未知精灵"}（${result.typeName}）。来测测你的！`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
          洛克测试结果
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          你的本命精灵
        </h1>
      </div>

      {/* Creature Card */}
      {creature ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row">
            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-8 sm:w-72">
              <Image
                src={creature.forms[0].image}
                alt={`${creature.name} 立绘`}
                width={220}
                height={220}
                className="h-auto max-h-48 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-semibold text-slate-500">NO.{creature.id}</p>
              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-950">{creature.name}</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-sm font-semibold text-emerald-700">
                  {result.typeName}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {result.typeDesc}
              </p>
              <div className="mt-3">
                <AttributeBadges attributes={creature.attributes} />
              </div>
              {creature.description ? (
                <p className="mt-3 text-xs leading-5 text-slate-500 italic">
                  {creature.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          精灵数据加载中...
        </div>
      )}

      {/* Dimension Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-950">维度分析</h3>
        <div className="space-y-3">
          {dimensions.map((dim) => {
            const rawScore = scores[dim.key];
            const maxPerDim = 8;
            const pct = Math.min(Math.abs(rawScore) / maxPerDim, 1);
            const isLeft = rawScore > 0;
            return (
              <div key={dim.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{dim.label}</span>
                  <span className="text-slate-500">
                    {isLeft ? dim.left : dim.right}
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: isLeft ? `${pct * 100}%` : "0%" }}
                  />
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: !isLeft ? `${pct * 100}%` : "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personality */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-950">性格分析</h3>
        <div className="space-y-3">
          {result.personality.map((paragraph, i) => (
            <p key={i} className="text-sm leading-7 text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Battle Analysis */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-950">战斗分析</h3>
        <p className="text-sm leading-7 text-slate-700">{result.battleAnalysis}</p>
      </div>

      {/* Team Role */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-950">队伍定位</h3>
        <p className="text-sm leading-7 text-slate-700">{result.teamRole}</p>
      </div>

      {/* Train Advice */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-950">培养建议</h3>
        <p className="text-sm leading-7 text-slate-700">{result.trainAdvice}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={handleShare}>
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? "已复制" : "分享结果"}
        </Button>
        <Button variant="ghost" onClick={onRetake}>
          <RefreshCw className="h-4 w-4" />
          重新测试
        </Button>
      </div>

      <p className="text-center text-xs text-slate-400">
        测试结果基于选项权重计算，仅供娱乐参考。实际精灵强度请参考游戏内数据与社区攻略。
      </p>
    </div>
  );
}
