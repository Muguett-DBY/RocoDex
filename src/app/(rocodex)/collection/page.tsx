import type { Metadata } from "next";
import { CollectionWorkspace } from "@/components/collection-workspace";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { parseSharedCollectionIds } from "@/lib/creature-collection";

export const metadata: Metadata = {
  title: "我的收藏 - 洛克图鉴",
  description: "在当前浏览器保存培养候选精灵，并快速发起对比。",
};

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ ids?: string | string[] }> }) {
  const params = await searchParams;
  const sharedIds = parseSharedCollectionIds(params.ids);

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Badge tone="emerald">本地工作台</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">我的收藏</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          保存培养候选、组合对比清单。收藏只保存在当前浏览器，不需要登录，也不会上传账号或设备信息。
        </p>
        <div className="mt-8">
          <CollectionWorkspace sharedIds={sharedIds} />
        </div>
      </main>
    </PageShell>
  );
}
