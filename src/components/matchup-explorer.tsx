"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { getAttributeMatchupProfile, getEffectiveness, matchupAttributes } from "@/lib/matchup";
import type { CreatureAttribute } from "@/types/creature";

export function MatchupExplorer() {
  const [attacker, setAttacker] = useState<CreatureAttribute>("火");
  const [defender, setDefender] = useState<CreatureAttribute>("草");
  const profile = useMemo(() => getAttributeMatchupProfile([defender]), [defender]);
  const effectiveness = getEffectiveness(attacker, defender);

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>属性克制查询</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label>
            <span className="mb-2 block text-xs font-semibold text-slate-500">攻击属性</span>
            <Select value={attacker} onChange={(event) => setAttacker(event.target.value as CreatureAttribute)}>
              {matchupAttributes.map((attribute) => (
                <option key={attribute} value={attribute}>
                  {attribute}
                </option>
              ))}
            </Select>
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-slate-500">防守属性</span>
            <Select value={defender} onChange={(event) => setDefender(event.target.value as CreatureAttribute)}>
              {matchupAttributes.map((attribute) => (
                <option key={attribute} value={attribute}>
                  {attribute}
                </option>
              ))}
            </Select>
          </label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs font-semibold text-slate-500">倍率</p>
            <p className="mt-1 text-3xl font-bold text-slate-950">{effectiveness}x</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ProfileCard title={`${defender} 属性弱点`} items={profile.weakTo} tone="rose" />
        <ProfileCard title={`${defender} 属性抗性`} items={profile.resists} tone="blue" />
        <ProfileCard title={`${defender} 可有效打击`} items={profile.strongInto} tone="emerald" />
        <ProfileCard title={`${defender} 输出被抵抗`} items={profile.resistedBy} tone="amber" />
      </div>
    </section>
  );
}

function ProfileCard({ title, items, tone }: { title: string; items: CreatureAttribute[]; tone: "emerald" | "amber" | "blue" | "rose" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.length > 0 ? items.map((item) => <Badge key={item} tone={tone}>{item}</Badge>) : <Badge tone="slate">暂无特殊关系</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
