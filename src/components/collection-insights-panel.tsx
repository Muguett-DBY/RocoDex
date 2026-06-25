import type { ReactNode } from "react";
import { BarChart3, CheckCircle2, ClipboardList, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CollectionInsights } from "@/lib/collection-insights";

type CollectionInsightsPanelProps = {
  insights: CollectionInsights;
};

export function CollectionInsightsPanel({ insights }: CollectionInsightsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">收藏洞察</p>
            <CardTitle className="mt-1 dark:text-white">培养准备度概览</CardTitle>
          </div>
          <Badge tone={insights.compareReady ? "emerald" : "amber"}>
            {insights.compareReady ? "可进入对比" : "继续收藏候选"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InsightStat icon={<ClipboardList className="h-4 w-4" />} label="有效收藏" value={`${insights.validCount}/${insights.savedCount}`} />
          <InsightStat icon={<CheckCircle2 className="h-4 w-4" />} label="已匹配攻略" value={`${insights.guideMatchedCount}`} />
          <InsightStat icon={<BarChart3 className="h-4 w-4" />} label="PVP 已评级" value={`${insights.pvpRatedCount}`} />
          <InsightStat icon={<ShieldQuestion className="h-4 w-4" />} label="关联阵容" value={`${insights.recommendedTeamCount}`} />
        </div>

        <CoverageGroup title="属性覆盖" items={insights.attributes} emptyLabel="暂无有效属性" />
        <CoverageGroup title="角色覆盖" items={insights.roles} emptyLabel="暂无攻略角色" />

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">下一步</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {insights.nextActions.map((action) => (
              <li key={action}>• {action}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950/40">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function CoverageGroup({ title, items, emptyLabel }: { title: string; items: { name: string; count: number }[]; emptyLabel: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <Badge key={item.name} tone="blue">
              {item.name} × {item.count}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">{emptyLabel}</span>
        )}
      </div>
    </div>
  );
}
