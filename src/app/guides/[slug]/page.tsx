import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AttributeBadges } from "@/components/attribute-badges";
import { CopyShareLink } from "@/components/copy-share-link";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { guideBuilds } from "@/data/guide-builds";
import { guideConfidenceLabel } from "@/lib/display-labels";
import { getGuideBuildBySlug, guideBuildSlug } from "@/lib/seo-pages";

type GuideDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guideBuilds.map((build) => ({ slug: guideBuildSlug(build) }));
}

export async function generateMetadata({ params }: GuideDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const build = getGuideBuildBySlug(guideBuilds, slug);
  return {
    title: build ? `${build.name} 攻略 - 洛克图鉴` : "攻略未找到 - 洛克图鉴",
    description: build ? `${build.name} 的 PVE/PVP 评级、定位、配招建议和资料来源。` : undefined,
  };
}

export default async function GuideDetailPage({ params }: GuideDetailProps) {
  const { slug } = await params;
  const build = getGuideBuildBySlug(guideBuilds, slug);
  if (!build) notFound();

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Link href="/guides" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">返回攻略中心</Link>
          <CopyShareLink />
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50 to-sky-50">
            <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-lg bg-white p-3">
                <Image src={build.image} alt={`${build.name} 立绘`} width={144} height={144} className="max-h-32 w-auto object-contain" />
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="emerald">PVP {build.pvpTier}</Badge>
                  <Badge tone="blue">PVE {build.pveTier}</Badge>
                  <Badge tone={build.confidence === "unknown" ? "amber" : "emerald"}>{guideConfidenceLabel[build.confidence]}</Badge>
                  <Badge tone="slate">更新 {build.updatedAt}</Badge>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{build.name}</h1>
                <div className="mt-3"><AttributeBadges attributes={build.attributes} /></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoGrid title="定位与场景" items={[...build.roles, ...build.scenes]} />
            <InfoGrid title="配招" items={build.moves.values} />
            <InfoGrid title="性格与天分" items={[build.nature.value, ...build.talent.values]} />
            <InfoGrid title="培养说明" items={[...build.buildNotes, ...build.reviewNotes]} />
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {build.sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700">
                  {source.publisher ? `${source.publisher} · ` : ""}{source.title}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </PageShell>
  );
}

function InfoGrid({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-slate-950">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {(items.length > 0 ? items : ["待复核"]).map((item) => <Badge key={item} tone={item.includes("待复核") ? "amber" : "slate"}>{item}</Badge>)}
      </div>
    </section>
  );
}
