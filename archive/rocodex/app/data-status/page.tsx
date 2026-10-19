import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { creatures } from "@/data/creatures";
import { getCreatureStats, getDataGaps } from "@/lib/creature-query";
import { getRecentlyVerifiedCreatures, getSourceReviewItems, getUsefulMissingData } from "@/lib/source-review";

export default function DataStatusPage() {
  const stats = getCreatureStats(creatures);
  const gaps = getDataGaps(creatures);
  const recent = getRecentlyVerifiedCreatures(creatures, 6);
  const reviewItems = getSourceReviewItems(creatures).slice(0, 10);
  const usefulMissing = getUsefulMissingData(creatures, 6);

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Badge tone="amber">数据状态</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">资料可信度与待补全项</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          这里集中展示 seed data 的完整度。未确认资料不会被补猜，统一显示为“待确认”。
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard title="总收录" value={String(stats.total)} />
          <StatusCard title="已确认" value={String(stats.byConfidence.confirmed)} />
          <StatusCard title="部分确认" value={String(stats.byConfidence.partial)} />
          <StatusCard title="图片缺口" value={String(stats.gapTotals.image)} />
          <StatusCard title="资料缺口" value={String(stats.gapTotals.facts)} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>玩家最关心的补全进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["捕捉地点", "获得方式", "进化方式", "技能", "图片"].map((field) => {
                const missing = stats.gapTotals.byField[field] ?? 0;
                const complete = Math.max(stats.total - missing, 0);
                return <ProgressRow key={field} label={field} complete={complete} total={stats.total} />;
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>优先查看的待确认项</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {usefulMissing
                .map((gap) => (
                  <Link
                    key={`${gap.creatureId}-${gap.field}`}
                    href={gap.href}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <span className="font-semibold text-slate-900">NO.{gap.creatureId} {gap.creatureName}</span>
                    <Badge tone="amber">{gap.field}</Badge>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>最近补充过资料</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recent.map((item) => (
                <Link key={item.creatureId} href={item.href} className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-emerald-300 hover:bg-emerald-50">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-950">NO.{item.creatureId} {item.creatureName}</span>
                    <span className="text-slate-500">{item.updatedAt}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.verifiedFields.map((field) => <Badge key={field} tone="emerald">{field}</Badge>)}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>来源复核队列</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewItems.map((item) => (
                <a key={`${item.creatureId}-${item.field}`} href={item.sourceUrl} target="_blank" rel="noreferrer" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-emerald-300 hover:bg-emerald-50">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-950">NO.{item.creatureId} {item.creatureName}</span>
                    <Badge tone="amber">{item.field}</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.reason}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card className="mt-6 overflow-hidden">
          <CardHeader>
            <CardTitle>待人工确认的数据</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>编号</Th>
                  <Th>精灵</Th>
                  <Th>类别</Th>
                  <Th>字段</Th>
                  <Th>原因</Th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((gap, index) => (
                  <tr key={`${gap.creatureId}-${gap.field}-${index}`}>
                    <Td>
                      <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href={`/creatures/${gap.creatureId}`}>
                        NO.{gap.creatureId}
                      </Link>
                    </Td>
                    <Td>{gap.creatureName}</Td>
                    <Td>{gap.category === "image" ? "图片" : "资料"}</Td>
                    <Td>
                      <Badge tone="amber">{gap.field}</Badge>
                    </Td>
                    <Td>{gap.reason}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </PageShell>
  );
}

function ProgressRow({ label, complete, total }: { label: string; complete: number; total: number }) {
  const percent = total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">
          {complete}/{total} · {percent}%
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function StatusCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}
