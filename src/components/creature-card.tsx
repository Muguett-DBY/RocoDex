import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Creature } from "@/types/creature";
import { AttributeBadges } from "@/components/attribute-badges";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { availabilityStatusLabel, confidenceLabel, triStateLabel } from "@/lib/display-labels";

export function CreatureCard({ creature }: { creature: Creature }) {
  const primaryForm = creature.forms[0];

  return (
    <Link href={`/creatures/${creature.id}`} className="group block">
      <Card className="h-full overflow-hidden transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-6">
          <Image
            src={primaryForm.image}
            alt={`${creature.name} 立绘`}
            width={220}
            height={220}
            className="h-full max-h-44 w-auto object-contain"
          />
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500">NO.{creature.id}</p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">{creature.name}</h3>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
          </div>
          <AttributeBadges attributes={creature.attributes} />
          <div className="flex flex-wrap gap-2">
            <Badge tone={creature.confidence === "confirmed" ? "emerald" : "amber"}>{confidenceLabel[creature.confidence]}</Badge>
            <Badge tone="slate">{creature.forms.length} 个形态</Badge>
            <Badge tone={creature.isCatchable === true ? "emerald" : creature.isCatchable === "unknown" ? "amber" : "slate"}>
              可捕捉：{triStateLabel(creature.isCatchable)}
            </Badge>
          </div>
          <div className="space-y-1 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600">
            <p>获得：{creature.obtainMethods.slice(0, 2).join(" / ")}</p>
            <p>状态：{availabilityStatusLabel[creature.availabilityStatus]} · 更新 {creature.updatedAt}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
