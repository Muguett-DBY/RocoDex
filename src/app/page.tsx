import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, BookOpen, Database, GitCompare, ScrollText, Search, Shield, ShieldAlert, Sparkles, Swords } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { creatures } from "@/data/creatures";
import { getCreatureStats } from "@/lib/creature-query";

export default function Home() {
  const stats = getCreatureStats(creatures);

  return (
    <PageShell>
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <Badge tone="emerald" className="w-fit">
                非官方中文资料库 MVP
              </Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                洛克图鉴 / RocoDex
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                面向《洛克王国世界》的中文精灵资料整理项目。当前版本聚焦前 50 个图鉴编号、搜索筛选、详情页和数据可信度标记。
              </p>
              <div className="mt-8 max-w-2xl">
                <HomeSearch />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="/creatures">
                  查看精灵列表 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950" href="/about">
                  阅读非官方声明
                </Link>
              </div>
            </div>
            <div className="grid content-end gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <Database className="h-5 w-5 text-emerald-600" />
                  <CardTitle>精灵收录</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-950">{stats.total}</p>
                  <p className="mt-2 text-sm text-slate-600">覆盖 NO.001 至 NO.050</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <CardTitle>形态展示</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-950">{creatures.flatMap((item) => item.forms).length}</p>
                  <p className="mt-2 text-sm text-slate-600">含鸭吉吉多形态</p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2">
                <CardHeader>
                  <ShieldAlert className="h-5 w-5 text-blue-600" />
                  <CardTitle>资料状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">
                    图片先使用统一占位图；未核验字段显示“待确认”，并在数据状态页集中列出。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TaskLink
              href="/creatures"
              icon={BookOpen}
              title="查精灵"
              description="按名称、编号、属性、获得方式和捕捉状态快速筛选。"
            />
            <TaskLink
              href="/guides"
              icon={ScrollText}
              title="看强度榜"
              description="查看 PVE / PVP 评级、定位、配招和资料可信度。"
            />
            <TaskLink
              href="/pvp-teams"
              icon={Swords}
              title="找PVP阵容"
              description="默认展示当前 META，并清楚区分历史阵容。"
            />
            <TaskLink
              href="/data-status"
              icon={ShieldAlert}
              title="查看待确认资料"
              description="集中查看捕捉地点、获得方式、技能和图片审查缺口。"
            />
            <TaskLink
              href="/matchups"
              icon={Shield}
              title="查属性克制"
              description="快速判断弱点、抗性和攻击倍率。"
            />
            <TaskLink
              href="/skills"
              icon={Search}
              title="筛选技能"
              description="按技能名、属性和可信度查找技能。"
            />
            <TaskLink
              href="/compare"
              icon={GitCompare}
              title="对比精灵"
              description="并排比较评级、获得状态和技能完整度。"
            />
            <TaskLink
              href="/discover"
              icon={Sparkles}
              title="发现推荐"
              description="打开 PVP、PVE、新手和可捕捉专题页。"
            />
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function TaskLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}
