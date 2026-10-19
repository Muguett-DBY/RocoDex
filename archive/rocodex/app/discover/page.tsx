import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seoLandingPages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "发现页 - 洛克图鉴",
  description: "按玩家常见问题浏览 RocoDex：强度榜、可捕捉、活动限定和新手推荐。",
};

export default function DiscoverPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Badge tone="emerald">发现</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">按玩家问题浏览</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">这些页面面向搜索和分享场景，把常见问题直接整理成可打开的入口。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {seoLandingPages.map((page) => (
            <Link key={page.slug} href={page.href} className="group block">
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    {page.title}
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">{page.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
