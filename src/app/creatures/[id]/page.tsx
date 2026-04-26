import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AttributeBadges } from "@/components/attribute-badges";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { creatures } from "@/data/creatures";
import { buildEvolutionChain } from "@/lib/evolution-chain";
import { getCreatureById } from "@/lib/creature-query";
import { availabilityStatusLabel, confidenceLabel, triStateLabel } from "@/lib/display-labels";
import { getAttributeMatchupProfile } from "@/lib/matchup";

type CreatureDetailProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return creatures.map((creature) => ({ id: creature.id }));
}

export async function generateMetadata({ params }: CreatureDetailProps): Promise<Metadata> {
  const { id } = await params;
  const creature = getCreatureById(creatures, id);
  return {
    title: creature ? `${creature.name} - 洛克图鉴` : "精灵未找到 - 洛克图鉴",
  };
}

export default async function CreatureDetailPage({ params }: CreatureDetailProps) {
  const { id } = await params;
  const creature = getCreatureById(creatures, id);

  if (!creature) notFound();

  const primaryForm = creature.forms[0];
  const evolutionChain = buildEvolutionChain(creatures, creature.id);
  const matchupProfile = getAttributeMatchupProfile(creature.attributes);

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Link href="/creatures" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          返回精灵列表
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-8">
              <Image
                src={primaryForm.image}
                alt={`${creature.name} 立绘`}
                width={320}
                height={320}
                className="h-full max-h-80 w-auto object-contain"
                priority
              />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">{primaryForm.sourceNote}</p>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <p className="font-semibold">图片审查状态：待人工确认</p>
              <p className="mt-1">{primaryForm.imageLicenseNote}</p>
              <a className="mt-2 inline-flex items-center gap-1 font-semibold text-amber-900 underline" href={primaryForm.imageSourceUrl} target="_blank" rel="noreferrer">
                图片来源页面 <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Badge tone="emerald">NO.{creature.id}</Badge>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{creature.name}</h1>
              <div className="mt-4">
                <AttributeBadges attributes={creature.attributes} />
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 sm:grid-cols-3">
              <TrustItem label="资料可信度" value={confidenceLabel[creature.confidence]} />
              <TrustItem label="可获得状态" value={availabilityStatusLabel[creature.availabilityStatus]} />
              <TrustItem label="待确认项" value={`${pendingFieldCount(creature)} 项`} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem label="资料可信度" value={confidenceLabel[creature.confidence]} />
              <InfoItem label="数据更新时间" value={creature.updatedAt} />
              <InfoItem label="是否可捕捉" value={triStateLabel(creature.isCatchable)} />
              <InfoItem label="是否活动限定" value={triStateLabel(creature.isEventLimited)} />
              <InfoItem label="绝版状态" value={availabilityStatusLabel[creature.availabilityStatus]} />
              <InfoItem label="形态数量" value={`${creature.forms.length} 个`} />
            </div>

            <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">{creature.description}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <DetailBlock title="形态列表">
            <div className="grid gap-3 sm:grid-cols-2">
              {creature.forms.map((form) => (
                <div key={form.formId} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <Image src={form.image} alt={`${form.name} 立绘`} width={64} height={64} className="h-16 w-16 rounded-md object-contain" />
                  <div>
                    <p className="font-semibold text-slate-950">{form.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{form.stage}</p>
                    <Badge tone="amber" className="mt-2">
                      图片待审查
                    </Badge>
                    <a className="mt-2 block text-xs font-semibold text-emerald-700 hover:text-emerald-800" href={form.imageSourceUrl} target="_blank" rel="noreferrer">
                      来源文件页
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock title="获得与进化">
            <FieldList label="捕捉地点" values={creature.captureLocations} />
            <Separator />
            <FieldList label="获得方式" values={creature.obtainMethods} />
            <Separator />
            <FieldList label="进化方式" values={creature.evolutionMethods} />
            <Separator />
            <div>
              <p className="text-xs font-semibold text-slate-500">进化链</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {evolutionChain.map((step) => (
                  <Link key={step.id} href={step.href} className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
                    NO.{step.id} {step.name}
                  </Link>
                ))}
              </div>
            </div>
          </DetailBlock>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <DetailBlock title="技能列表">
            <div className="space-y-3">
              {creature.skills.map((skill) => (
                <div key={`${skill.name}-${skill.level ?? "none"}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{skill.name}</p>
                    <Badge tone={skill.confidence === "confirmed" ? "emerald" : "amber"}>{confidenceLabel[skill.confidence]}</Badge>
                    {skill.level ? <Badge tone="slate">{skill.level}</Badge> : null}
                    {skill.attribute ? <Badge tone="blue">{skill.attribute}</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{skill.description ?? "待确认"}</p>
                </div>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock title="数据来源">
            <div className="space-y-3">
              {creature.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="flex items-center gap-2 font-semibold text-slate-950">
                    {source.title}
                    <ExternalLink className="h-4 w-4" />
                  </span>
                  {source.note ? <span className="mt-2 block leading-6 text-slate-600">{source.note}</span> : null}
                </a>
              ))}
              <p className="text-xs leading-5 text-slate-500">{creature.sourceNote}</p>
            </div>
          </DetailBlock>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <DetailBlock title="属性弱点">
            <FieldList label="受到克制" values={matchupProfile.weakTo.length > 0 ? matchupProfile.weakTo : ["暂无特殊弱点"]} />
            <Separator />
            <FieldList label="抵抗属性" values={matchupProfile.resists.length > 0 ? matchupProfile.resists : ["暂无特殊抗性"]} />
          </DetailBlock>
          <DetailBlock title="输出打击面">
            <FieldList label="有效打击" values={matchupProfile.strongInto.length > 0 ? matchupProfile.strongInto : ["暂无特殊克制"]} />
            <Separator />
            <FieldList label="被抵抗" values={matchupProfile.resistedBy.length > 0 ? matchupProfile.resistedBy : ["暂无特殊抵抗"]} />
          </DetailBlock>
        </section>
      </main>
    </PageShell>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function TrustItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-blue-700">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function pendingFieldCount(creature: NonNullable<ReturnType<typeof getCreatureById>>) {
  let count = 0;
  if (creature.forms.some((form) => form.imageReviewStatus === "needs-review" || form.imageStatus === "placeholder")) count += 1;
  if (creature.captureLocations.includes("待确认")) count += 1;
  if (creature.obtainMethods.includes("待确认")) count += 1;
  if (creature.evolutionMethods.includes("待确认")) count += 1;
  if (creature.skills.some((skill) => skill.name === "待确认" || skill.confidence === "unknown")) count += 1;
  return count;
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function FieldList({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} tone={value === "待确认" ? "amber" : "emerald"}>
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}
