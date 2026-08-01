import { Suspense } from "react";
import { CopyShareLink } from "@/components/copy-share-link";
import { CreatureExplorer } from "@/components/creature-explorer";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

export default function CreaturesPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <Badge tone="blue" className="w-fit">
              精灵列表
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">全 347 只精灵</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              支持按中文名称、编号、捕捉地点、获得方式关键词搜索，并可按属性、捕捉状态、活动限定和绝版状态筛选。
            </p>
          </div>
          <CopyShareLink />
        </div>
        <Suspense fallback={<ExplorerLoading />}>
          <CreatureExplorer />
        </Suspense>
      </main>
    </PageShell>
  );
}

function ExplorerLoading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
      正在加载图鉴数据...
    </div>
  );
}
