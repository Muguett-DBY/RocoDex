import { ArrowRight, ArrowUpRight, FileText, FlaskConical, MapPin } from "lucide-react";
import Image from "next/image";

import type { CstdLocale } from "../../content/content-types";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { cstdProfile } from "../../content/profile";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../../content/technical-notes";
import { CstdLink } from "../../components/site/cstd-link";
import { AtelierMethod } from "../../components/theme-signature-experience";
import { AtelierReveal } from "./atelier-reveal";

const melbourneArt = {
  src: "/cstd-archive/cstd-archive-melbourne-heatmap-v1.webp",
  alt: { zh: "墨尔本 CBD 行人活动的星期×小时热力图", en: "Weekday-by-hour heatmap of Melbourne CBD pedestrian activity" },
};

function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e6e73]">
        <span aria-hidden="true" className="h-px w-10 bg-[#1d1d1f]/40" /> {index} / {label}
      </p>
      <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.024em] text-[#1d1d1f] md:text-5xl lg:text-[3.6rem]">
        {title}
      </h2>
    </div>
  );
}

export function AtelierHomepage({ locale }: { locale: CstdLocale }) {
  const latestNotes = [...cstdTechnicalNotes].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)).slice(0, 3);
  const isZh = locale === "zh";

  const workTitle = isZh ? "把分析、系统与产品，做成可核验的作品。" : "Analysis, systems, and products you can verify.";
  const workCases = [
    { slug: "melbourne-pedestrian-microclimate", wide: true },
    { slug: "rocodex-platform", wide: false },
    { slug: "alpha-research-system", wide: false },
  ]
    .map(({ slug, wide }) => ({ entry: cstdCaseStudies.find((candidate) => candidate.slug === slug)!, wide }))
    .filter((item) => Boolean(item.entry));

  const melbourne = cstdCaseStudies.find((entry) => entry.slug === "melbourne-pedestrian-microclimate")!;

  return (
    <div data-cstd-home-atelier className="relative z-10 bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Hero */}
      <section id="top" data-cstd-scene="hero" data-cstd-atelier-section="hero" className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-6 pb-16 pt-32 md:px-10 lg:px-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_46%_at_72%_30%,rgb(255_255_255/92%),transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-[1200px]">
          <AtelierReveal>
            <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e6e73]">
              <span aria-hidden="true" className="h-px w-10 bg-[#1d1d1f]/50" />
              {isZh ? "CSTD / 个人工作室 · 墨尔本" : "CSTD / PERSONAL STUDIO · MELBOURNE"}
            </p>
            <h1 className="mt-7 text-[3.4rem] font-bold leading-[0.98] tracking-[-0.03em] text-[#1d1d1f] md:text-[5.6rem] lg:text-[7rem]">
              {cstdProfile.name[locale]}
            </h1>
            <p className="mt-4 max-w-3xl text-xl font-semibold leading-snug tracking-[-0.012em] text-[#1d1d1f] md:text-2xl">
              {cstdProfile.title[locale]}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#55555c] md:text-lg md:leading-9">
              {cstdProfile.intro[locale]}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CstdLink href="#work" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1d1d1f] px-6 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.03]">
                {isZh ? "查看作品" : "See the work"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
              <CstdLink href={locale === "en" ? "/en/about" : "/about"} className="inline-flex h-12 items-center gap-2 rounded-full border border-[#1d1d1f]/25 px-6 text-sm font-bold text-[#1d1d1f] transition-colors hover:border-[#1d1d1f]/60">
                {isZh ? "认识我" : "About me"} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
            </div>
          </AtelierReveal>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-8 mx-auto flex w-fit items-center gap-2 text-[#6e6e73]">
          <span className="h-8 w-px animate-pulse bg-[#1d1d1f]/30" />
        </div>
      </section>

      {/* Stats band */}
      <section aria-label={isZh ? "关键数字" : "Key numbers"} className="border-y border-[#1d1d1f]/10 bg-white">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-y-8 px-6 py-12 md:grid-cols-4 md:px-10">
          {[
            { value: "7", label: isZh ? "已发布案例" : "published cases" },
            { value: "81", label: isZh ? "项公开证据" : "public proofs" },
            { value: "8", label: isZh ? "篇技术札记" : "technical notes" },
            { value: "100", label: isZh ? "内容健康度" : "content health" },
          ].map((stat, index) => (
            <AtelierReveal key={stat.label} delay={index * 60}>
              <div className="text-center md:text-left">
                <p className="text-4xl font-bold tracking-[-0.02em] text-[#1d1d1f] md:text-5xl">{stat.value}</p>
                <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#6e6e73]">{stat.label}</p>
              </div>
            </AtelierReveal>
          ))}
        </div>
      </section>

      {/* Method — the quiet three-step interaction */}
      <section id="method" data-cstd-scene="systems" data-cstd-atelier-section="method" className="border-b border-[#1d1d1f]/10 bg-[#f5f5f7] px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <AtelierReveal>
            <SectionHeading index="01" label={isZh ? "工作方式" : "Working method"} title={isZh ? "三步，把一件事做完" : "Three steps, one finished thing"} />
          </AtelierReveal>
          <AtelierReveal delay={80}>
            <div data-cstd-theme-encounter data-cstd-theme-encounter-theme="atelier" className="cstd-theme-encounter cstd-atelier-method !border-x-0 !border-t-0">
              {/* reuse of the interactive method island; the encounter CSS gates visibility by theme,
                  so the inline display keeps it present inside this atelier-native composition */}
              <div className="cstd-encounter-inner !w-full !max-w-none !px-0">
                <AtelierMethod locale={locale} />
              </div>
            </div>
          </AtelierReveal>
        </div>
      </section>

      {/* Selected work */}
      <section id="work" data-cstd-scene="proof" data-cstd-atelier-section="work" className="bg-white px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <AtelierReveal>
            <SectionHeading index="02" label={isZh ? "精选作品" : "Selected work"} title={workTitle} />
          </AtelierReveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {workCases.map(({ entry, wide }, index) => (
              <AtelierReveal key={entry.slug} delay={index * 70} className={index === 0 && wide ? "md:col-span-2" : ""}>
                <CstdLink
                  href={getCaseStudyPath(entry, locale)}
                  className="group relative block h-[22rem] overflow-hidden rounded-2xl border border-[#1d1d1f]/8 bg-[#e8eaee] md:h-[26rem]"
                >
                  <Image src={entry.image.src} alt={entry.image.alt[locale]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" style={{ objectPosition: entry.image.position ?? "50% 50%" }} />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(29,29,31,0.92)_72%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">{entry.year} · {entry.kicker[locale]}</p>
                      <h3 className="mt-2 text-2xl font-bold tracking-[-0.014em] text-white md:text-3xl">{entry.title[locale]}</h3>
                      <p className="mt-2 hidden max-w-xl text-sm leading-6 text-white/78 md:block">{entry.summary[locale]}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1d1d1f] transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                </CstdLink>
              </AtelierReveal>
            ))}
          </div>
          <AtelierReveal delay={120}>
            <div className="mt-10">
              <CstdLink href={locale === "en" ? "/en/work" : "/work"} className="inline-flex items-center gap-2 text-sm font-bold text-[#0066cc] transition-colors hover:text-[#1d1d1f]">
                {isZh ? "进入作品档案" : "Enter the work archive"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
            </div>
          </AtelierReveal>
        </div>
      </section>

      {/* Data feature: Melbourne */}
      <section data-cstd-atelier-section="data" className="border-y border-[#1d1d1f]/10 bg-[#f5f5f7] px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-2">
          <AtelierReveal>
            <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e6e73]">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" /> {isZh ? "数据分析 / 开放数据" : "DATA ANALYSIS / OPEN DATA"}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#1d1d1f] md:text-[2.6rem]">
              {isZh ? "147 万行开放数据，一条可重跑的分析管线。" : "1.47 million rows of open data, one rerunnable pipeline."}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#55555c]">
              {isZh
                ? "把墨尔本 CBD 的行人计数、传感器位置与微气候三份官方数据清洗、空间连接并建模：温度、PM2.5 与风在控制城市节奏后仍与活动相关，脆弱性在不同地段、工作日与周末并不相同。"
                : "Cleaning, spatially joining, and modelling pedestrian counts, sensor locations, and microclimate from the City of Melbourne: temperature, PM2.5, and wind stay associated with activity after controls, and vulnerability shifts by place, weekday, and weekend."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CstdLink href={getCaseStudyPath(melbourne, locale)} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1d1d1f] px-6 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.03]">
                {isZh ? "阅读完整分析" : "Read the analysis"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
              <span className="font-mono text-[11px] font-bold text-[#6e6e73]">R · data.table · ggplot2 · lm</span>
            </div>
          </AtelierReveal>
          <AtelierReveal delay={100}>
            <CstdLink href={getCaseStudyPath(melbourne, locale)} className="group relative block h-[24rem] overflow-hidden rounded-2xl border border-[#1d1d1f]/8 bg-white shadow-[0_2px_4px_rgb(0_0_0/4%),0_24px_60px_rgb(0_0_0/10%)] md:h-[28rem]">
              <Image src={melbourneArt.src} alt={melbourneArt.alt[locale]} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
              <span className="absolute bottom-5 left-5 rounded-full bg-white/92 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#1d1d1f]">
                {isZh ? "星期 × 小时活动热力图" : "Weekday × hour heatmap"}
              </span>
            </CstdLink>
          </AtelierReveal>
        </div>
      </section>

      {/* Notes */}
      <section id="notes" data-cstd-scene="path" data-cstd-atelier-section="notes" className="bg-white px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <AtelierReveal>
            <SectionHeading index="03" label={isZh ? "技术札记" : "Technical notes"} title={isZh ? "把判断写下来，让它们可查。" : "Write the judgement down. Keep it checkable."} />
          </AtelierReveal>
          <div className="mt-12 border-t border-[#1d1d1f]/10">
            {latestNotes.map((note, index) => (
              <AtelierReveal key={note.slug} delay={index * 60}>
                <CstdLink href={getTechnicalNotePath(note, locale)} className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b border-[#1d1d1f]/10 py-7 transition-colors hover:bg-[#f5f5f7]">
                  <span className="font-mono text-[11px] font-bold text-[#6e6e73]">{note.publishedAt.slice(0, 7)}</span>
                  <span>
                    <span className="block text-lg font-bold tracking-[-0.01em] text-[#1d1d1f] md:text-xl">{note.title[locale]}</span>
                    <span className="mt-1.5 block max-w-3xl text-sm leading-6 text-[#6e6e73]">{note.summary[locale]}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#6e6e73] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#0066cc]" />
                </CstdLink>
              </AtelierReveal>
            ))}
          </div>
          <AtelierReveal delay={120}>
            <div className="mt-10">
              <CstdLink href={locale === "en" ? "/en/notes" : "/notes"} className="inline-flex items-center gap-2 text-sm font-bold text-[#0066cc] transition-colors hover:text-[#1d1d1f]">
                {isZh ? "进入技术札记" : "Enter the notes archive"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
            </div>
          </AtelierReveal>
        </div>
      </section>

      {/* Labs strip */}
      <section className="border-y border-[#1d1d1f]/10 bg-[#f5f5f7] px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-8">
          <AtelierReveal>
            <div className="max-w-xl">
              <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e6e73]">
                <FlaskConical aria-hidden="true" className="h-3.5 w-3.5" /> {isZh ? "可执行实验" : "Executable labs"}
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-0.018em] text-[#1d1d1f] md:text-3xl">
                {isZh ? "结论不靠口头，靠可以重跑的实验。" : "Conclusions do not run on words. They run on experiments."}
              </h2>
            </div>
          </AtelierReveal>
          <AtelierReveal delay={80}>
            <CstdLink href={locale === "en" ? "/en/lab" : "/lab"} className="inline-flex h-12 items-center gap-2 rounded-full border border-[#1d1d1f]/25 px-6 text-sm font-bold text-[#1d1d1f] transition-colors hover:border-[#1d1d1f]/60">
              {isZh ? "进入实验室" : "Enter the labs"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
          </AtelierReveal>
        </div>
      </section>

      {/* Contact / finale */}
      <section id="contact" data-cstd-scene="finale" data-cstd-atelier-section="contact" className="bg-white px-6 pb-28 pt-24 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <AtelierReveal>
            <SectionHeading index="04" label={isZh ? "开放联络" : "Open contact"} title={isZh ? "如果你在找一个会把分析做成产品的人。" : "If you are looking for someone who ships analysis as products."} />
          </AtelierReveal>
          <AtelierReveal delay={80}>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                { href: locale === "en" ? "/en/about" : "/about", title: isZh ? "关于我" : "About", detail: isZh ? "工程路径、工作原则与能力面。" : "The engineering path, principles, and capability surface." },
                { href: locale === "en" ? "/en/now" : "/now", title: isZh ? "现在" : "Now", detail: isZh ? "此刻正在构建与学习的内容。" : "What is being built and learned right now." },
                { href: locale === "en" ? "/en/resume" : "/resume", title: isZh ? "技术履历" : "Résumé", detail: isZh ? "机器可读与可打印的完整履历。" : "The machine-readable, printable record." },
              ].map((card, index) => (
                <AtelierReveal key={card.title} delay={index * 60}>
                  <CstdLink href={card.href} className="group flex h-full flex-col justify-between rounded-2xl border border-[#1d1d1f]/10 bg-[#f5f5f7] p-7 transition-all duration-300 hover:border-[#0066cc]/40 hover:bg-white hover:shadow-[0_18px_44px_rgb(0_0_0/8%)]">
                    <div>
                      <h3 className="flex items-center justify-between gap-3 text-xl font-bold text-[#1d1d1f]">
                        {card.title}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#6e6e73] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#0066cc]" />
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#55555c]">{card.detail}</p>
                    </div>
                    <FileText aria-hidden="true" className="mt-8 h-4 w-4 text-[#6e6e73]" />
                  </CstdLink>
                </AtelierReveal>
              ))}
            </div>
          </AtelierReveal>
          <AtelierReveal delay={140}>
            <p className="mt-14 max-w-2xl text-sm leading-7 text-[#6e6e73]">
              {isZh
                ? "这个站本身就是最完整的作品：双语内容管线、可复现分析、四套主题与自动化验证，全部在这一个 Next.js 部署里。"
                : "The site itself is the most complete work: a bilingual content pipeline, reproducible analysis, four visual worlds, and automated verification in one Next.js deployment."}
            </p>
          </AtelierReveal>
        </div>
      </section>
    </div>
  );
}
