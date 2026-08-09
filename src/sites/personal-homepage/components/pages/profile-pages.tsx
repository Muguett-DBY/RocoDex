import { ArrowUpRight, BookOpen, BriefcaseBusiness, Download, FileJson2, FlaskConical, MapPin, Radio, Sparkles } from "lucide-react";
import type { CstdLocale } from "../../content/content-types";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { cstdProfile } from "../../content/profile";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../../content/technical-notes";
import { cstdTimeline } from "../../content/timeline";
import { CstdCapabilityTimeline } from "../site/capability-timeline";
import { CstdLink } from "../site/cstd-link";
import { CstdSiteChrome } from "../site/cstd-site-chrome";
import { PrintButton } from "../site/print-button";
import { StructuredData } from "../site/structured-data";
import { CstdPageHero } from "./page-hero";

const profileHero = {
  src: "/cstd-universe/cstd-night-workstation-v1.webp",
  alt: { zh: "奶黄包的夜间技术工作站", en: "Custard's night engineering workstation" },
  position: "50% 50%",
} as const;

const aboutHero = {
  src: "/cstd-archive/cstd-archive-studio-v1.webp",
  alt: { zh: "温和而精密的个人技术工作室", en: "A warm and precise personal engineering studio" },
  position: "50% 45%",
} as const;

const nowHero = {
  src: "/cstd-universe/cstd-departure-city-v1.webp",
  alt: { zh: "持续向前的信号城市", en: "A signal city continuing forward" },
  position: "50% 45%",
} as const;

function localePath(path: string, locale: CstdLocale) {
  return locale === "en" ? `/en${path}` : path;
}

export function CstdEnglishHubPage() {
  const locale: CstdLocale = "en";
  const featuredCases = cstdCaseStudies.slice(0, 3);
  const featuredNotes = cstdTechnicalNotes.slice(0, 3);

  return (
    <CstdSiteChrome locale={locale} page="english-hub">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow="CSTD / ENGLISH ARCHIVE" title="Systems that run. Decisions that remain inspectable." summary={cstdProfile.intro.en} image={profileHero} />
        <section className="border-b border-white/12 bg-[#080a0c] px-5 py-20 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] font-black text-[#f4d431]"><BriefcaseBusiness aria-hidden="true" className="h-4 w-4" /> FEATURED SYSTEMS</div>
              <div className="mt-7 border-t border-white/15">
                {featuredCases.map((entry) => <CstdLink key={entry.slug} href={getCaseStudyPath(entry, locale)} className="group flex items-center justify-between gap-5 border-b border-white/15 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]"><div><p className="font-mono text-[8px] font-black text-[#69757a]">{entry.kicker.en.toUpperCase()}</p><p className="mt-2 text-2xl font-semibold text-white">{entry.title.en}</p></div><ArrowUpRight aria-hidden="true" className="h-5 w-5 text-[#f4d431] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></CstdLink>)}
              </div>
              <CstdLink href="/en/work" className="mt-7 inline-flex items-center gap-3 border-b border-[#f4d431] pb-2 font-mono text-[9px] font-black">ALL CASE STUDIES <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
            </div>
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] font-black text-[#24e0ff]"><BookOpen aria-hidden="true" className="h-4 w-4" /> LATEST FIELD NOTES</div>
              <div className="mt-7 border-t border-white/15">
                {featuredNotes.map((note) => <CstdLink key={note.slug} href={getTechnicalNotePath(note, locale)} className="group block border-b border-white/15 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]"><p className="font-mono text-[8px] font-black text-[#69757a]">{note.category.en.toUpperCase()} / {note.readingMinutes} MIN</p><p className="mt-2 text-2xl font-semibold leading-tight text-white transition-colors group-hover:text-[#24e0ff]">{note.title.en}</p></CstdLink>)}
              </div>
              <CstdLink href="/en/notes" className="mt-7 inline-flex items-center gap-3 border-b border-[#24e0ff] pb-2 font-mono text-[9px] font-black">ALL TECHNICAL NOTES <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
            </div>
          </div>
        </section>
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "ProfilePage", name: "Custard / CSTD", url: "https://custard.top/en", mainEntity: { "@type": "Person", name: "Custard", jobTitle: cstdProfile.title.en, homeLocation: { "@type": "Place", name: cstdProfile.location.en } } }} />
    </CstdSiteChrome>
  );
}

export function CstdAboutPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? {
    eyebrow: "04 / OPERATOR PROFILE",
    title: "在研究、产品与视觉之间，保持同一套工程诚实。",
    summary: cstdProfile.intro.zh,
    trajectory: "学习与系统轨迹",
    trajectoryBody: "化工训练提供边界、守恒和实验直觉；数据科学与软件工程把它们变成可运行产品。",
    capability: "正在使用的能力面",
    principle: "工作原则",
    timeline: "能力如何一步步形成",
    principles: ["先确认事实与边界，再选择工具。", "确定性内核负责结论，AI 负责解释和探索。", "动效服从性能预算，发布必须有端到端证据。"],
  } : {
    eyebrow: "04 / OPERATOR PROFILE",
    title: "The same engineering honesty across research, product, and visual systems.",
    summary: cstdProfile.intro.en,
    trajectory: "Learning and systems trajectory",
    trajectoryBody: "Chemical engineering supplied intuition about boundaries, balances, and experiments; data science and software engineering turned it into running products.",
    capability: "Current capability surface",
    principle: "Working principles",
    timeline: "How the capability surface evolved",
    principles: ["Confirm facts and boundaries before choosing tools.", "Deterministic cores own conclusions; AI explains and explores.", "Motion obeys a performance budget, and releases require end-to-end evidence."],
  };

  return (
    <CstdSiteChrome locale={locale} page="about">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={aboutHero} compact />
        <section className="border-b border-black/15 bg-[#f1eee5] px-5 py-20 text-[#0a0c0e] md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] font-black text-[#0b6473]"><MapPin aria-hidden="true" className="h-4 w-4" /> {cstdProfile.location[locale].toUpperCase()}</div>
              <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">{copy.trajectory}</h2>
              <p className="mt-5 text-base leading-8 text-black/65">{copy.trajectoryBody}</p>
            </div>
            <div className="border-t border-black/20">
              {cstdProfile.education.map((entry) => <div key={entry.period} className="grid gap-4 border-b border-black/20 py-6 md:grid-cols-[8rem_14rem_1fr]"><span className="font-mono text-[9px] font-black text-black/75">{entry.period}</span><strong className="text-sm">{entry.school}</strong><p className="text-sm leading-7 text-black/65">{entry.detail[locale]}</p></div>)}
            </div>
          </div>
        </section>

        <section className="border-b border-white/12 bg-[#080a0c] px-5 py-20 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1320px]">
            <p className="font-mono text-[9px] font-black text-[#24e0ff]">{copy.capability.toUpperCase()}</p>
            <div className="mt-8 grid gap-px bg-white/15 md:grid-cols-2">
              {cstdProfile.capabilities.map((capability, index) => <div key={capability.value} className="bg-[#0a0c0e] p-6 md:p-8"><span className="font-mono text-[9px] font-black text-[#f4d431]">0{index + 1}</span><h2 className="mt-5 text-2xl font-semibold">{capability.label[locale]}</h2><p className="mt-4 font-mono text-xs leading-7 text-[#8f9ba0]">{capability.value}</p></div>)}
            </div>
          </div>
        </section>

        <section className="border-b border-white/12 bg-[#050709] px-5 py-20 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1320px]"><p className="font-mono text-[9px] font-black text-[#3dff8f]">06 / CAPABILITY TIMELINE</p><h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">{copy.timeline}</h2><div className="mt-10"><CstdCapabilityTimeline locale={locale} /></div></div>
        </section>

        <section className="bg-[#f4d431] px-5 py-20 text-black md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.65fr_1.35fr]"><div><div className="flex items-center gap-3 font-mono text-[9px] font-black"><Sparkles aria-hidden="true" className="h-4 w-4" /> {copy.principle.toUpperCase()}</div></div><ol className="border-t border-black/30">{copy.principles.map((principle, index) => <li key={principle} className="grid grid-cols-[3rem_1fr] border-b border-black/30 py-5"><span className="font-mono text-[9px] font-black text-black/75">0{index + 1}</span><span className="text-xl font-semibold leading-8 md:text-2xl">{principle}</span></li>)}</ol></div>
        </section>
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "ProfilePage", name: cstdProfile.name[locale], url: `https://custard.top${localePath("/about", locale)}`, mainEntity: { "@type": "Person", name: cstdProfile.name[locale], jobTitle: cstdProfile.title[locale], description: cstdProfile.intro[locale], homeLocation: { "@type": "Place", name: cstdProfile.location[locale] }, knowsAbout: cstdProfile.capabilities.map((entry) => entry.value) } }} />
    </CstdSiteChrome>
  );
}

export function CstdNowPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? { eyebrow: "05 / NOW SIGNAL", title: "此刻正在构建什么。", summary: cstdProfile.now.focus.zh, building: "正在构建", learning: "正在学习", updated: "最后更新", archive: "浏览技术档案", recent: "最近的交付、诊断与研究节点" } : { eyebrow: "05 / NOW SIGNAL", title: "What I am building now.", summary: cstdProfile.now.focus.en, building: "Building", learning: "Learning", updated: "Last updated", archive: "Browse the technical archive", recent: "Recent releases, diagnoses, and research steps" };
  return (
    <CstdSiteChrome locale={locale} page="now">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={nowHero} compact />
        <section className="border-b border-white/12 bg-[#080a0c] px-5 py-20 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
            <div><div className="flex items-center gap-3 font-mono text-[9px] font-black text-[#3dff8f]"><Radio aria-hidden="true" className="h-4 w-4" /> SIGNAL LIVE</div><p className="mt-4 font-mono text-[8px] font-black text-[#68757b]">{copy.updated.toUpperCase()} / {cstdProfile.now.updatedAt}</p></div>
            <div className="grid gap-12 md:grid-cols-2">
              <div><h2 className="text-3xl font-semibold text-white">{copy.building}</h2><ul className="mt-6 border-t border-white/15">{cstdProfile.now.building.map((item) => <li key={item[locale]} className="border-b border-white/15 py-5 text-sm leading-7 text-[#aeb7ba]">{item[locale]}</li>)}</ul></div>
              <div><h2 className="text-3xl font-semibold text-white">{copy.learning}</h2><ul className="mt-6 border-t border-white/15">{cstdProfile.now.learning.map((item) => <li key={item[locale]} className="border-b border-white/15 py-5 text-sm leading-7 text-[#aeb7ba]">{item[locale]}</li>)}</ul></div>
            </div>
          </div>
        </section>
        <section className="border-b border-white/12 bg-[#050709] px-5 py-20 md:px-10 lg:px-16"><div className="mx-auto max-w-[1320px]"><p className="font-mono text-[9px] font-black text-[#24e0ff]">CHANGELOG / VERIFIED PATH</p><h2 className="mt-5 max-w-3xl text-3xl font-semibold text-white md:text-5xl">{copy.recent}</h2><div className="mt-10"><CstdCapabilityTimeline locale={locale} compact /></div></div></section>
        <CstdLink href={localePath("/notes", locale)} className="group block bg-[#f4d431] px-5 py-16 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-black md:px-10 lg:px-16"><div className="mx-auto flex max-w-[1320px] items-center justify-between gap-8"><div className="flex items-center gap-4"><BookOpen aria-hidden="true" className="h-6 w-6" /><span className="text-2xl font-semibold md:text-4xl">{copy.archive}</span></div><ArrowUpRight aria-hidden="true" className="h-7 w-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div></CstdLink>
      </main>
    </CstdSiteChrome>
  );
}

export function CstdResumePage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? { title: "奶黄包 / 技术履历", summary: "产品工程师、创意系统构建者。专注于可运行产品、证据优先 AI、数据系统与浏览器视觉工程。", print: "打印 / 保存 PDF", pdf: "下载 PDF", work: "代表项目", education: "教育与学习", timeline: "能力轨迹", capabilities: "能力", evidence: "详细案例与技术证据", json: "机器可读 JSON" } : { title: "Custard / Technical resume", summary: "Product engineer and creative systems builder focused on shipped products, evidence-first AI, data systems, and browser visual engineering.", print: "Print / save PDF", pdf: "Download PDF", work: "Selected work", education: "Education and learning", timeline: "Capability timeline", capabilities: "Capabilities", evidence: "Detailed cases and technical evidence", json: "Machine-readable JSON" };
  return (
    <CstdSiteChrome locale={locale} page="resume">
      <main id="cstd-main" className="cstd-resume bg-[#f1eee5] px-5 py-16 text-[#0a0c0e] md:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1080px]">
          <header className="border-b-2 border-black pb-10">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div><p className="font-mono text-[9px] font-black text-[#0b6473]">CSTD / RESUME / 2026</p><h1 className="mt-4 text-4xl font-semibold md:text-6xl">{copy.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-black/65">{copy.summary}</p></div>
              <PrintButton label={copy.print} />
            </div>
          </header>

          <section className="cstd-resume-section grid gap-8 border-b border-black/20 py-10 md:grid-cols-[13rem_1fr]"><h2 className="font-mono text-[10px] font-black text-[#0b6473]">{copy.capabilities.toUpperCase()}</h2><div className="grid gap-5 sm:grid-cols-2">{cstdProfile.capabilities.map((entry) => <div key={entry.value} className="cstd-resume-entry"><h3 className="text-sm font-semibold">{entry.label[locale]}</h3><p className="mt-2 font-mono text-[10px] leading-6 text-black/60">{entry.value}</p></div>)}</div></section>

          <section className="cstd-resume-section grid gap-8 border-b border-black/20 py-10 md:grid-cols-[13rem_1fr]"><h2 className="font-mono text-[10px] font-black text-[#0b6473]">{copy.work.toUpperCase()}</h2><div>{cstdCaseStudies.slice(0, 5).map((entry) => <div key={entry.slug} className="cstd-resume-entry grid gap-2 border-t border-black/15 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_1fr]"><span className="font-mono text-[9px] font-black text-black/75">{entry.year}</span><div><h3 className="text-lg font-semibold">{entry.title[locale]}</h3><p className="mt-2 text-sm leading-7 text-black/65">{entry.summary[locale]}</p><p className="mt-2 font-mono text-[9px] text-[#0b6473]">{entry.technologies.join(" · ")}</p></div></div>)}</div></section>

          <section className="cstd-resume-section grid gap-8 border-b border-black/20 py-10 md:grid-cols-[13rem_1fr]"><h2 className="font-mono text-[10px] font-black text-[#0b6473]">{copy.education.toUpperCase()}</h2><div>{cstdProfile.education.map((entry) => <div key={entry.period} className="cstd-resume-entry grid gap-2 border-t border-black/15 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_12rem_1fr]"><span className="font-mono text-[9px] font-black text-black/75">{entry.period}</span><strong className="text-sm">{entry.school}</strong><p className="text-sm leading-7 text-black/65">{entry.detail[locale]}</p></div>)}</div></section>

          <section className="cstd-resume-section grid gap-8 border-b border-black/20 py-10 md:grid-cols-[13rem_1fr]"><h2 className="font-mono text-[10px] font-black text-[#0b6473]">{copy.timeline.toUpperCase()}</h2><div>{cstdTimeline.slice(-4).map((entry) => <div key={entry.id} className="cstd-resume-entry grid gap-2 border-t border-black/15 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_1fr]"><span className="font-mono text-[9px] font-black text-black/75">{entry.date}</span><div><h3 className="text-sm font-semibold">{entry.title[locale]}</h3><p className="mt-2 text-sm leading-7 text-black/65">{entry.summary[locale]}</p></div></div>)}</div></section>

          <footer className="flex flex-wrap items-center justify-between gap-5 pt-8"><p className="font-mono text-[9px] font-black text-black/75">custard.top · Sydney / Nanjing</p><div className="flex flex-wrap gap-5"><a href="/cstd-resume.pdf" download className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#0b6473] hover:text-black"><Download aria-hidden="true" className="h-4 w-4" />{copy.pdf}</a><CstdLink href={locale === "en" ? "/en/resume.json" : "/resume.json"} className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#0b6473] hover:text-black"><FileJson2 aria-hidden="true" className="h-4 w-4" />{copy.json}</CstdLink><CstdLink href={localePath("/work", locale)} className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#0b6473] hover:text-black"><FlaskConical aria-hidden="true" className="h-4 w-4" />{copy.evidence}</CstdLink></div></footer>
        </div>
      </main>
    </CstdSiteChrome>
  );
}
