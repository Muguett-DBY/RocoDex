import { CopyShareLink } from "@/components/copy-share-link";
import { CreatureExplorer } from "@/components/creature-explorer";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { creatures } from "@/data/creatures";
import { paramsFromSearchParams, parseCreatureFilterParams } from "@/lib/filter-params";

type CreaturesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CreaturesPage({ searchParams }: CreaturesPageProps) {
  const params = await searchParams;
  const initialFilters = parseCreatureFilterParams(paramsFromSearchParams(params));

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <Badge tone="blue" className="w-fit">
              精灵列表
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">前 50 只精灵</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              支持按中文名称、编号、捕捉地点、获得方式关键词搜索，并可按属性、捕捉状态、活动限定和绝版状态筛选。
            </p>
          </div>
          <CopyShareLink />
        </div>
        <CreatureExplorer creatures={creatures} initialFilters={initialFilters} />
      </main>
    </PageShell>
  );
}
