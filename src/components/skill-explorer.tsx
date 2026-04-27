"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { confidenceLabel } from "@/lib/display-labels";
import { searchCreatureSkills } from "@/lib/skill-search";
import type { Confidence, Creature, CreatureAttribute } from "@/types/creature";

const attributes: (CreatureAttribute | "all")[] = ["all", "普通", "草", "火", "水", "光", "地", "冰", "龙", "电", "毒", "虫", "武", "翼", "萌", "幽", "恶", "机械", "幻"];

export function SkillExplorer() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [query, setQuery] = useState("");
  const [attribute, setAttribute] = useState<CreatureAttribute | "all">("all");
  const [confidence, setConfidence] = useState<Confidence | "all">("all");
  const results = useMemo(() => searchCreatureSkills(creatures, { query, attribute, confidence }).slice(0, 80), [creatures, query, attribute, confidence]);

  useEffect(() => {
    let active = true;
    import("@/data/creatures").then((module) => {
      if (active) setCreatures(module.creatures);
    });
    return () => {
      active = false;
    };
  }, []);

  if (creatures.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        正在加载技能数据...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>技能筛选</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <label className="relative">
            <span className="sr-only">关键词</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="技能名、精灵名、描述" />
          </label>
          <Select value={attribute} onChange={(event) => setAttribute(event.target.value as CreatureAttribute | "all")}>
            {attributes.map((item) => (
              <option key={item} value={item}>{item === "all" ? "全部属性" : item}</option>
            ))}
          </Select>
          <Select value={confidence} onChange={(event) => setConfidence(event.target.value as Confidence | "all")}>
            <option value="all">全部可信度</option>
            <option value="confirmed">已确认</option>
            <option value="partial">部分确认</option>
            <option value="unknown">待确认</option>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {results.map((result) => (
          <Link key={`${result.creatureId}-${result.skillName}-${result.level ?? ""}`} href={result.href} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-950">{result.skillName}</span>
              <Badge tone="blue">{result.creatureName}</Badge>
              <Badge tone={result.confidence === "confirmed" ? "emerald" : "amber"}>{confidenceLabel[result.confidence]}</Badge>
              {result.skillAttribute ? <Badge tone="slate">{result.skillAttribute}</Badge> : null}
              {result.level ? <Badge tone="slate">{result.level}</Badge> : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{result.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
