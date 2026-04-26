import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { creatureSourceUrls } from "@/data/creatures";

export default function AboutPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Badge tone="rose">非官方声明</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">关于洛克图鉴</h1>
        <div className="mt-6 grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle>项目说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
              <p>
                RocoDex / 洛克图鉴是一个用于学习、研究和个人资料整理的中文图鉴网站 MVP，目标是把《洛克王国世界》的精灵资料整理成易搜索、易筛选、可校对的数据结构。
              </p>
              <p>第一版只使用本地 TypeScript seed data，不接入 Supabase，不提供登录、收藏或商业功能。</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>版权与非官方说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
              <p>
                本项目不是《洛克王国》或《洛克王国世界》的官方网站，也不隶属于腾讯、魔方工作室群、哔哩哔哩或任何官方运营方。
              </p>
              <p>
                游戏名称、角色、精灵设定、图片与相关素材的权利归原权利方所有。本项目仅用于学习、研究和资料整理；如有侵权内容，后续应替换或移除。
              </p>
              <p>当前 MVP 不下载、不热链公开网页图片，仅用统一占位图，并在数据中记录来源页面便于后续人工校对。</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>数据来源</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
              <a
                href={creatureSourceUrls.list}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                洛克王国:手游WIKI_BWIKI 精灵图鉴 <ExternalLink className="h-4 w-4" />
              </a>
              <p>
                BWiki 页面标注文字与数据内容采用 CC BY-NC-SA 4.0。RocoDex 记录来源 URL，并对未完成核验的字段标记“待确认”。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageShell>
  );
}
