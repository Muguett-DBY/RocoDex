"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { compareCreatures } from "@/lib/creature-compare";
import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild } from "@/types/guide";

export function CreatureCompareTool({ initialIds = ["001", "005", "008"] }: { initialIds?: string[] }) {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [guideBuilds, setGuideBuilds] = useState<GuideCreatureBuild[]>([]);
  const [ids, setIds] = useState<string[]>(initialIds);
  const comparison = useMemo(() => compareCreatures(creatures, guideBuilds, ids), [creatures, guideBuilds, ids]);

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

  if (creatures.length === 0 || guideBuilds.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        正在加载对比数据...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>选择 2-4 只精灵对比</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {ids.map((id, index) => (
              <Select
                key={`${index}-${id}`}
                value={id}
                onChange={(event) => setIds((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
              >
                {creatures.map((creature) => (
                  <option key={creature.id} value={creature.id}>
                    NO.{creature.id} {creature.name}
                  </option>
                ))}
              </Select>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled={ids.length >= 4} onClick={() => setIds((current) => [...current, creatures.find((creature) => !current.includes(creature.id))?.id ?? creatures[0].id])}>
              增加对比
            </Button>
            <Button type="button" variant="secondary" disabled={ids.length <= 2} onClick={() => setIds((current) => current.slice(0, -1))}>
              减少一项
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {comparison.creatures.map((creature) => (
          <Card key={creature.id}>
            <CardHeader>
              <CardTitle>
                <Link href={creature.href} className="hover:text-emerald-700">NO.{creature.id} {creature.name}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="属性" value={creature.attributes.join(" / ")} />
              <Row label="可捕捉" value={creature.catchable} />
              <Row label="获得状态" value={creature.availability} />
              <Row label="PVP" value={creature.pvpTier} />
              <Row label="PVE" value={creature.pveTier} />
              <Row label="已核技能" value={`${creature.verifiedSkillCount} 个`} />
              <div className="flex flex-wrap gap-2">
                {creature.roles.slice(0, 3).map((role) => <Badge key={role} tone="slate">{role}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
