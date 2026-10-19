import type { Metadata } from "next";
import { Suspense } from "react";
import { CopyShareLink } from "@/components/copy-share-link";
import { PageShell } from "@/components/page-shell";
import { PvpTeamExplorer } from "@/components/pvp-team-explorer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "PVP阵容 - 洛克图鉴",
  description: "《洛克王国世界》2026-04-15 之后 PVP META 阵容整理。",
};

export default function PvpTeamsPage() {
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
              <Badge tone="emerald">当前 META</Badge>
              <Badge tone="amber">历史归档</Badge>
              <Badge tone="blue">最低来源日期：2026-04-15</Badge>
            </div>
          </div>
          <CopyShareLink />
        </div>
        <Suspense fallback={<ExplorerLoading />}>
          <PvpTeamExplorer />
        </Suspense>
      </main>
    </PageShell>
  );
}

function ExplorerLoading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
      正在加载阵容数据...
    </div>
  );
}
