import type { Metadata } from "next";
import { Suspense } from "react";
import { CopyShareLink } from "@/components/copy-share-link";
import { GuideExplorer } from "@/components/guide-explorer";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "攻略中心 - 洛克图鉴",
  description: "《洛克王国世界》PVE 与 PVP 强度榜、培养建议和资料可信度整理。",
};

export default function GuidesPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="emerald">攻略中心</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">PVE与PVP强度榜</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
              默认展示 PVP 强度榜。缺少可靠培养资料的精灵保留为“未评级 / 待复核”，不会补猜性格、天分或配招。
            </p>
          </div>
          <CopyShareLink />
        </div>
        <Suspense fallback={<ExplorerLoading />}>
          <GuideExplorer />
        </Suspense>
      </main>
    </PageShell>
  );
}

function ExplorerLoading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
      正在加载攻略数据...
    </div>
  );
}
