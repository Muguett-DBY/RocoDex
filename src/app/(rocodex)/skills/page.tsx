import type { Metadata } from "next";
import { CopyShareLink } from "@/components/copy-share-link";
import { PageShell } from "@/components/page-shell";
import { SkillExplorer } from "@/components/skill-explorer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "技能筛选 - 洛克图鉴",
  description: "按技能名、属性和可信度筛选《洛克王国世界》精灵技能资料。",
};

export default function SkillsPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="emerald">玩家工具</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">技能筛选</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">从当前 seed data 中查找技能。待确认技能会保留可信度标记，不会补猜效果。</p>
          </div>
          <CopyShareLink />
        </div>
        <SkillExplorer />
      </main>
    </PageShell>
  );
}
