import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyShareLink } from "@/components/copy-share-link";
import { CreatureCard } from "@/components/creature-card";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";
import { getSeoLandingPage, seoLandingPages } from "@/lib/seo-pages";

type DiscoverLandingProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: DiscoverLandingProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);
  return {
    title: page ? `${page.title} - 洛克图鉴` : "发现页未找到 - 洛克图鉴",
    description: page?.description,
  };
}

export default async function DiscoverLandingPage({ params }: DiscoverLandingProps) {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);
  if (!page) notFound();

  const selected = page.selectCreatures(creatures, guideBuilds);

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="emerald">发现</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{page.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{page.description}</p>
          </div>
          <CopyShareLink />
        </div>
        {selected.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {selected.map((creature) => <CreatureCard key={creature.id} creature={creature} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            当前资料中还没有匹配条目。后续数据复核后会自动显示。
          </div>
        )}
      </main>
    </PageShell>
  );
}
