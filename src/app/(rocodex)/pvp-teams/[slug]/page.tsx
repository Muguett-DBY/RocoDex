import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { CopyShareLink } from "@/components/copy-share-link";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { archivedPvpTeams, pvpTeams } from "@/data/pvp-teams";
import { sourceFreshnessLabel, sourceTierLabel } from "@/lib/display-labels";
import { getPvpTeamBySlug, pvpTeamSlug } from "@/lib/pvp-query";

const allTeams = [...pvpTeams, ...archivedPvpTeams];

type PvpTeamDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allTeams.map((team) => ({ slug: pvpTeamSlug(team) }));
}

export async function generateMetadata({ params }: PvpTeamDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const team = getPvpTeamBySlug(allTeams, slug);
  return {
    title: team ? `${team.name} - PVP阵容 - 洛克图鉴` : "PVP阵容未找到 - 洛克图鉴",
    description: team?.summary,
  };
}

export default async function PvpTeamDetailPage({ params }: PvpTeamDetailProps) {
  const { slug } = await params;
  const team = getPvpTeamBySlug(allTeams, slug);
  if (!team) notFound();

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Link href="/pvp-teams" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">返回 PVP 阵容</Link>
          <CopyShareLink />
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50 to-sky-50">
            <div className="flex flex-wrap gap-2">
              <Badge tone={team.strength === "T0" ? "emerald" : team.strength === "T1" ? "blue" : "amber"}>{team.strength}</Badge>
              <Badge tone="slate">{team.archetype}</Badge>
              <Badge tone={team.sourceFreshness === "current" ? "emerald" : "amber"}>{sourceFreshnessLabel[team.sourceFreshness]}</Badge>
              <Badge tone="blue">{sourceTierLabel[team.sourceTier]}</Badge>
              <Badge tone="amber">资料截至 {team.metaDate}</Badge>
            </div>
            <CardTitle className="mt-3 text-3xl">{team.name}</CardTitle>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{team.summary}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoBlock title="适合玩家" items={[team.suitableFor]} />
              <InfoBlock title="打法要点" items={team.playstyle} />
              <InfoBlock title="克制与风险" items={[...team.counters.map((item) => `克制：${item}`), ...team.risks.map((item) => `风险：${item}`)]} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {team.members.map((member) => (
                <div key={member.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-white">
                      <Image src={member.image} alt={`${member.name} 立绘`} width={80} height={80} className="max-h-20 w-auto object-contain" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-950">{member.name}</h2>
                      <Badge tone="blue" className="mt-2">{member.role}</Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.moves.map((move) => <Badge key={move.name} tone={move.sourceBasis === "analysis-derived" ? "amber" : "slate"}>{move.name}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {team.sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700">
                  {source.publisher} · {source.publishedAt} · {sourceTierLabel[source.tier]}
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

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
