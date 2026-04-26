import type { Metadata } from "next";
import { CopyShareLink } from "@/components/copy-share-link";
import { CreatureCompareTool } from "@/components/creature-compare-tool";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";

export const metadata: Metadata = {
  title: "精灵对比 - 洛克图鉴",
  description: "并排比较 2-4 只《洛克王国世界》精灵的属性、获得状态、评级和技能完整度。",
};

export default function ComparePage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="amber">玩家工具</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">精灵对比</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">并排查看基础资料、评级、获得难度和已核验技能数量，快速判断培养优先级。</p>
          </div>
          <CopyShareLink />
        </div>
        <CreatureCompareTool creatures={creatures} guideBuilds={guideBuilds} />
      </main>
    </PageShell>
  );
}
