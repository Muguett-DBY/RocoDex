import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Cpu, FlaskConical, ShieldCheck } from "lucide-react";
import type { CstdLocale } from "../../content/content-types";
import { cstdLabs, getCstdLab, getLabPath } from "../../content/labs";
import { InteractiveLab } from "../labs/interactive-lab";
import { CstdLink } from "../site/cstd-link";
import { CstdSiteChrome } from "../site/cstd-site-chrome";
import { StructuredData } from "../site/structured-data";
import { CstdPageHero } from "./page-hero";

const labHero = {
  src: "/cstd-universe/cstd-skill-reactor-v1.webp",
  alt: { zh: "可操作的技术实验反应堆", en: "An interactive technical experiment reactor" },
  position: "50% 48%",
} as const;

export const cstdLabStaticParams = cstdLabs.map((entry) => ({ slug: entry.slug }));

export function CstdLabIndexPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? {
    eyebrow: "03 / INTERACTIVE LAB",
    title: "不要只读结论。亲手改变系统状态。",
    summary: "四个轻量实验把架构、异步任务、确定性估值和渲染预算变成可操作界面。所有逻辑都在浏览器本地运行。",
    open: "进入实验",
  } : {
    eyebrow: "03 / INTERACTIVE LAB",
    title: "Do not just read the conclusion. Change the system state.",
    summary: "Four lightweight experiments turn architecture, background jobs, deterministic valuation, and render budgets into interfaces you can operate. Everything runs locally in the browser.",
    open: "Open lab",
  };

  return (
    <CstdSiteChrome locale={locale} page="lab-index">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={labHero} compact />
        <section className="bg-[#080a0c]/92 px-5 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-px bg-white/15 md:grid-cols-2">
            {cstdLabs.map((lab) => (
              <CstdLink key={lab.slug} href={getLabPath(lab, locale)} className="group relative min-h-[31rem] overflow-hidden bg-[#080a0c] p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff] md:p-8">
                <Image src={lab.image.src} alt={lab.image.alt[locale]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-28 transition-[transform,opacity] duration-700 group-hover:scale-105 group-hover:opacity-48" />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.15),rgba(5,7,9,0.98)_80%)]" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between font-mono text-[9px] font-black"><span className="text-[#f4d431]">LAB / {lab.number}</span><FlaskConical aria-hidden="true" className="h-4 w-4 text-[#24e0ff]" /></div>
                  <div className="mt-auto pt-32">
                    <h2 className="text-4xl font-semibold text-white md:text-5xl">{lab.title[locale]}</h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#a6b0b3]">{lab.summary[locale]}</p>
                    <p className="mt-5 border-l-2 border-[#24e0ff] pl-4 text-xs leading-6 text-[#d5dbdd]">{lab.principle[locale]}</p>
                    <span className="mt-7 inline-flex items-center gap-3 border-b border-[#f4d431] pb-2 font-mono text-[9px] font-black text-white transition-[gap,color] group-hover:gap-5 group-hover:text-[#f4d431]">{copy.open} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
                  </div>
                </div>
              </CstdLink>
            ))}
          </div>
        </section>
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "CollectionPage", name: copy.title, url: `https://custard.top${locale === "en" ? "/en/lab" : "/lab"}`, hasPart: cstdLabs.map((lab) => ({ "@type": "SoftwareApplication", name: lab.title[locale], applicationCategory: "EducationalApplication", url: `https://custard.top${getLabPath(lab, locale)}` })) }} />
    </CstdSiteChrome>
  );
}

export function CstdLabDetailPage({ locale, slug }: { locale: CstdLocale; slug: string }) {
  const lab = getCstdLab(slug);
  if (!lab) notFound();
  const copy = locale === "zh" ? {
    back: "全部实验",
    live: "LIVE INSTRUMENT / 浏览器本地运行",
    noData: "不上传输入，不依赖外部 API，不写入账户数据。",
    method: "实验方法",
    methodBody: "先改变一个控制量，观察状态与输出，再重置基线。这个实验展示工程关系，不模拟生产数据。",
    fallback: "静态回退",
    fallbackBody: "即使 JavaScript 不可用，标题、原则和实验范围仍可被读取与索引。",
    next: "下一实验",
  } : {
    back: "All labs",
    live: "LIVE INSTRUMENT / LOCAL BROWSER RUNTIME",
    noData: "No inputs are uploaded, no external API is required, and no account data is written.",
    method: "Method",
    methodBody: "Change one control, observe state and output, then reset the baseline. This demonstrates engineering relationships rather than production data.",
    fallback: "Static fallback",
    fallbackBody: "Even without JavaScript, the title, principle, and scope remain readable and indexable.",
    next: "Next lab",
  };
  const index = cstdLabs.findIndex((candidate) => candidate.slug === lab.slug);
  const nextLab = cstdLabs[(index + 1) % cstdLabs.length];

  return (
    <CstdSiteChrome locale={locale} page={`lab-${lab.slug}`}>
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={`LAB ${lab.number} / ${lab.tags.join(" · ").toUpperCase()}`} title={lab.title[locale]} summary={lab.summary[locale]} image={lab.image} compact />
        <section className="border-b border-white/12 bg-[#080a0c] px-5 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/15 pb-6">
              <CstdLink href={locale === "en" ? "/en/lab" : "/lab"} className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"><ArrowLeft aria-hidden="true" className="h-4 w-4" />{copy.back}</CstdLink>
              <p className="flex items-center gap-3 font-mono text-[8px] font-black text-[#3dff8f]"><span className="h-2 w-2 animate-pulse bg-[#3dff8f]" />{copy.live}</p>
            </div>

            <div className="mt-10 border border-white/15 bg-[#0b0e11]/90 p-5 shadow-[0_36px_90px_rgba(0,0,0,0.35)] md:p-8 lg:p-10">
              <InteractiveLab lab={lab} locale={locale} />
            </div>

            <div className="mt-10 grid gap-px bg-white/15 md:grid-cols-3">
              <div className="bg-[#0a0c0e] p-6"><Cpu aria-hidden="true" className="h-5 w-5 text-[#f4d431]" /><h2 className="mt-5 text-xl font-semibold">{copy.method}</h2><p className="mt-3 text-sm leading-7 text-[#8f9ba0]">{copy.methodBody}</p></div>
              <div className="bg-[#0a0c0e] p-6"><ShieldCheck aria-hidden="true" className="h-5 w-5 text-[#24e0ff]" /><h2 className="mt-5 text-xl font-semibold">LOCAL / PRIVATE</h2><p className="mt-3 text-sm leading-7 text-[#8f9ba0]">{copy.noData}</p></div>
              <div className="bg-[#0a0c0e] p-6"><FlaskConical aria-hidden="true" className="h-5 w-5 text-[#3dff8f]" /><h2 className="mt-5 text-xl font-semibold">{copy.fallback}</h2><p className="mt-3 text-sm leading-7 text-[#8f9ba0]">{copy.fallbackBody}</p></div>
            </div>
          </div>
        </section>

        <CstdLink href={getLabPath(nextLab, locale)} className="group block bg-[#f4d431] px-5 py-16 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-black md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1320px] items-end justify-between gap-8"><div><p className="font-mono text-[9px] font-black">{copy.next.toUpperCase()}</p><p className="mt-4 text-3xl font-semibold md:text-5xl">{nextLab.title[locale]}</p></div><ArrowUpRight aria-hidden="true" className="h-8 w-8 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" /></div>
        </CstdLink>
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: lab.title[locale], description: lab.summary[locale], applicationCategory: "EducationalApplication", operatingSystem: "Web", url: `https://custard.top${getLabPath(lab, locale)}` }} />
    </CstdSiteChrome>
  );
}
