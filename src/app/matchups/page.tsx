import type { Metadata } from "next";
import { CopyShareLink } from "@/components/copy-share-link";
import { MatchupExplorer } from "@/components/matchup-explorer";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "属性克制查询 - 洛克图鉴",
  description: "查询《洛克王国世界》精灵属性克制、弱点和抗性。",
};

export default function MatchupsPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="blue">玩家工具</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">属性克制查询</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">快速判断攻击属性对防守属性的倍率，并查看弱点、抗性和有效打击面。</p>
          </div>
          <CopyShareLink />
        </div>
        <MatchupExplorer />
      </main>
    </PageShell>
  );
}
