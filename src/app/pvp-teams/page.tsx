import type { Metadata } from "next";
import { CopyShareLink } from "@/components/copy-share-link";
import { PageShell } from "@/components/page-shell";
import { PvpTeamExplorer } from "@/components/pvp-team-explorer";
import { Badge } from "@/components/ui/badge";
import { archivedPvpTeams, pvpTeams } from "@/data/pvp-teams";
import { paramsFromSearchParams, parsePvpFilterParams } from "@/lib/filter-params";

export const metadata: Metadata = {
  title: "PVP阵容 - 洛克图鉴",
  description: "《洛克王国世界》2026-04-15 之后 PVP META 阵容整理。",
};

type PvpTeamsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PvpTeamsPage({ searchParams }: PvpTeamsPageProps) {
  const params = await searchParams;
  const initialFilters = parsePvpFilterParams(paramsFromSearchParams(params));

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="emerald">PVP META</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">当前版本 PVP 强势阵容</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
              当前口径：仅默认展示 2026-04-15 之后公开资料中的 PVP 阵容。攻略站、B站、微博、TapTap
              等社区资料会标明来源等级；性格、天分和部分补位为本站分析，不等同于官方或来源原文。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Badge tone="emerald">当前 META：{pvpTeams.length} 套</Badge>
              <Badge tone="amber">历史归档：{archivedPvpTeams.length} 套</Badge>
              <Badge tone="blue">最低来源日期：2026-04-15</Badge>
            </div>
          </div>
          <CopyShareLink />
        </div>
        <PvpTeamExplorer teams={[...pvpTeams, ...archivedPvpTeams]} initialFilters={initialFilters} />
      </main>
    </PageShell>
  );
}
