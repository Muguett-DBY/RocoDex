"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";
import type { CstdLocale } from "../../content/content-types";
import { CstdChapterLink } from "../site/cstd-chapter-link";
import { CstdLink } from "../site/cstd-link";
import { CstdLanguageSwitcher } from "../site/cstd-language-switcher";
import { ThemeSwitcher } from "../theme-switcher";

/* ============================================================================
   CSTD Editorial · 默认主页（atelier 主题槽位）的正式滚动版式。
   Chaptered editorial grammar：纸面章节、入场落位、页边批注、folio 页码
   导航。动效体系为单一 GSAP 编排（editorial-motion.ts，动态 import 进异步
   chunk）：扉页/章题升幕、双 pin 擦洗、铜线绘制、编号落墨、计数与图版揭示、
   folio 页码轨全部由 ScrollTrigger 驱动——本页不挂载任何自制滚动引擎，
   CSS 不消费滚动驱动变量。零视频、零滚动劫持：全部动效为
   transform/opacity/clip-path，原生文档流滚动；无 JS 时初始 DOM 即终态。

   内容数据由服务端（personal-homepage.tsx）准备好以 props 传入，内容注册表
   不进客户端包。历史留档：scrollcraft/builds/cstd-editorial/（引擎时代构建，
   不部署）。
   ========================================================================== */

export type EditorialWork = {
  slug: string;
  kicker: string;
  title: string;
  year: string;
  summary: string;
  technologies: readonly string[];
  path: string;
  featured: boolean;
};

export type EditorialNote = {
  slug: string;
  title: string;
  summary: string;
  dateLabel: string;
  publishedAt: string;
  path: string;
};

export type EditorialProfile = {
  name: string;
  summary: string;
};

/* 作品界面图版（图 04/05）：与案例页 VERIFIED SURFACE 同源的本项目自有生产界面截图；
   slug 不匹配则不渲染（内容注册表变更时优雅降级为纯文字卡） */
const WORK_PLATES: Record<string, { src: string; width: number; height: number; plate: keyof EditorialCopy["plates"] }> = {
  "rocodex-platform": { src: "/cstd-projects/rocodex.png", width: 1280, height: 800, plate: "rocodex" },
  "alpha-research-system": { src: "/cstd-projects/alpha.png", width: 1280, height: 800, plate: "alpha" },
};

/* 无 JS 兜底：动效隐藏态只由 JS 设置（GSAP from 的起始值），noscript 下内容
   天然完整可读——唯一要收走的是 folio（页码轨失去滚动跟踪后是死重） */
const NOSCRIPT_FALLBACK_CSS = `
[data-cstd-home-editorial] .folio{display:none!important}
`;

type FolioItem = { id: string; mark: { zh: string; en: string }; label: { zh: string; en: string } };

const FOLIO: readonly FolioItem[] = [
  { id: "ch-title", mark: { zh: "扉", en: "0" }, label: { zh: "扉页", en: "Title" } },
  { id: "ch-method", mark: { zh: "壹", en: "I" }, label: { zh: "方法", en: "Method" } },
  { id: "ch-work", mark: { zh: "贰", en: "II" }, label: { zh: "作品", en: "Work" } },
  { id: "ch-notes", mark: { zh: "叁", en: "III" }, label: { zh: "札记", en: "Notes" } },
  { id: "ch-lab", mark: { zh: "肆", en: "IV" }, label: { zh: "实验室", en: "Labs" } },
  { id: "ch-colophon", mark: { zh: "末", en: "V" }, label: { zh: "版权页", en: "Colophon" } },
];

export type EditorialPlate = {
  no: string;
  caption: string;
  source: string;
  alt: string;
};

type EditorialCopy = {
  mailto: string;
  navAria: string;
  folioAria: string;
  skipToContent: string;
  navWork: string;
  navNotes: string;
  navTopics: string;
  navMap: string;
  navVoxel: string;
  ctaHeader: string;
  statement: React.ReactNode;
  exploreWork: string;
  aboutMe: string;
  roleField: string;
  roleCraft: string;
  titleFoot: string;
  methodH2: React.ReactNode;
  methodLede: string;
  methodSteps: { title: string; detail: string; signal: string }[];
  methodNote: React.ReactNode;
  workH2: string;
  workLede: string;
  workNote: React.ReactNode;
  censusCases: string;
  censusLabel: string;
  viewCase: string;
  countUnitZh: string;
  countHead: React.ReactNode;
  dataBody: string;
  dataToolsLabel: string;
  figureNo: string;
  figureCaption: string;
  figureSource: string;
  plates: { heatmap: EditorialPlate; sensitivity: EditorialPlate; rocodex: EditorialPlate; alpha: EditorialPlate };
  insideAnalysis: string;
  notesH2: string;
  notesLede: string;
  notesNote: React.ReactNode;
  allNotes: string;
  labH2: React.ReactNode;
  labLede: string;
  labNote: React.ReactNode;
  labInstruments: { name: string; line: string }[];
  colophonBrand: string;
  colophonMark: string;
  colophonDomain: string;
  colophonH2: React.ReactNode;
  colophonLede: React.ReactNode;
  colophonCta: string;
  navNow: string;
  navResume: string;
  backToTop: string;
  colophonSmall: string;
};

function editorialCopy(locale: CstdLocale): EditorialCopy {
  const zh = locale === "zh";
  const noteLink = (href: string, label: string) => (
    <CstdLink href={getLocalizedCstdHref(href, locale)}>{label}</CstdLink>
  );
  return {
    mailto: "mailto:cstd@custard.top?subject=" + encodeURIComponent(zh ? "CSTD 协作" : "CSTD collaboration"),
    navAria: zh ? "首页直达" : "Homepage shortcuts",
    folioAria: zh ? "章节导航" : "Chapters",
    skipToContent: zh ? "跳到正文" : "Skip to content",
    navWork: zh ? "作品" : "Work",
    navNotes: zh ? "笔记" : "Notes",
    navTopics: zh ? "主题" : "Topics",
    navMap: zh ? "星图" : "Map",
    navVoxel: zh ? "作品城" : "Voxel world",
    ctaHeader: zh ? "谈一次协作" : "Start a collaboration",
    statement: zh ? <>从数据里找到线索，<br />把想法做成产品。</> : <>Find the story in the data.<br />Build something useful.</>,
    exploreWork: zh ? "浏览精选作品" : "Explore the work",
    aboutMe: zh ? "认识我" : "A little about me",
    roleField: zh ? "人工智能 · 博 0" : "Artificial Intelligence · PhD Year 0",
    roleCraft: zh ? "分析 · 系统 · 交付" : "Analysis · Systems · Delivery",
    titleFoot: zh ? "真实问题。清晰思考。可验证的作品。" : "Real questions. Clear thinking. Verifiable work.",
    methodH2: zh ? <>复杂的问题，<br />清楚地做。</> : <>Complex questions.<br />Clear work.</>,
    methodLede: zh ? "从对齐事实开始，以可以检验的结果收尾。" : "Start with the facts. Finish with something you can check.",
    methodSteps: zh
      ? [
          { title: "拆解", detail: "先把问题问清楚：数据从哪来，数字怎么算，哪些限制必须考虑。", signal: "先弄清事实，再谈方案" },
          { title: "构建", detail: "选合适的工具，把解法做出来：一段分析脚本、一个界面，或者一套完整的系统。", signal: "工具跟着问题走" },
          { title: "验证", detail: "把结果重新算一遍，把流程再跑一遍，再检查产品是否真的好用。做到了什么，还有哪些不足，都说清楚。", signal: "结果要经得起检查" },
        ]
      : [
          { title: "Deconstruct", detail: "Split the problem into checkable pieces: where the data lives, what the definitions are, which constraints hold.", signal: "Facts before plans" },
          { title: "Build", detail: "Use the simplest suitable tools to build the solution: a pipeline, an interface, or a system.", signal: "Tools serve the question" },
          { title: "Verify", detail: "Recompute the result, rerun the process, and check that the product works well. Be clear about what holds up and what still needs work.", signal: "Results you can check" },
        ],
    methodNote: zh ? (
      <>这套方法源自化工训练：先画边界，再做衡算，实验记录优先。{noteLink("/notes/chemical-engineering-to-software-systems", "读相关札记")}</>
    ) : (
      <>The method comes from chemical engineering: draw the boundary, balance the system, keep the lab record. {noteLink("/notes/chemical-engineering-to-software-systems", "Read the note")}</>
    ),
    workH2: zh ? "用作品说话。" : "The work speaks.",
    workLede: zh ? "一份城市数据分析，两个产品系统。可以看结果，也可以看过程。" : "An urban data study and two product systems. Explore the results and the work behind them.",
    workNote: zh ? (
      <>作品 01 的全部脚本可以重跑：下载、清洗、建模、绘图。{noteLink("/work", "全部作品")}</>
    ) : (
      <>Every script behind Work 01 reruns end to end: download, clean, model, plot. {noteLink("/work", "All projects")}</>
    ),
    censusCases: zh ? "个已发布案例" : "published cases",
    censusLabel: zh ? "作品普查" : "Work census",
    viewCase: zh ? "查看案例" : "View case",
    countUnitZh: zh ? "行开放数据，" : "rows of open data,",
    countHead: zh ? <>让城市的节奏可见。</> : <>a city, made legible.</>,
    dataBody: zh
      ? "行人如何穿过墨尔本？温度、风和空气质量又怎样参与其中？三份官方开放数据，经过清洗、空间连接与建模，形成一条可以重跑的分析管线。"
      : "How do people move through Melbourne? What changes with temperature, wind, and air quality? Three official open datasets, cleaned, spatially joined, and modelled into one rerunnable pipeline.",
    dataToolsLabel: zh ? "分析工具" : "Analysis tools",
    figureNo: zh ? "图 01" : "FIG. 01",
    figureCaption: zh ? "墨尔本 CBD · 环境因素与行人活动的回归分析" : "Melbourne CBD · regression analysis of environment and pedestrian activity",
    figureSource: zh ? "数据源：City of Melbourne 开放数据" : "Source: City of Melbourne open data",
    /* 图版条目（图 02–05）：全部为本项目自有真实资产——作品 01 的分析副图与 02/03 的生产界面实录 */
    plates: zh
      ? {
          heatmap: { no: "图 02", caption: "墨尔本 CBD · 行人活动的空间密度", source: "数据源：City of Melbourne 开放数据", alt: "墨尔本 CBD 行人活动空间密度热力图" },
          sensitivity: { no: "图 03", caption: "行人流量对温度区间的敏感性", source: "数据源：City of Melbourne 开放数据", alt: "行人流量对温度区间的敏感性分析图" },
          rocodex: { no: "图 04", caption: "RocoDex · 双站平台界面", source: "界面实录：本项目生产环境", alt: "RocoDex 双站平台的生产界面" },
          alpha: { no: "图 05", caption: "CSTD Alpha · 研究系统界面", source: "界面实录：本项目生产环境", alt: "CSTD Alpha 公司研究系统的生产界面" },
        }
      : {
          heatmap: { no: "FIG. 02", caption: "Melbourne CBD · spatial density of pedestrian activity", source: "Source: City of Melbourne open data", alt: "Spatial density heatmap of pedestrian activity in Melbourne CBD" },
          sensitivity: { no: "FIG. 03", caption: "Temperature sensitivity of pedestrian flow", source: "Source: City of Melbourne open data", alt: "Sensitivity analysis of pedestrian flow across temperature bands" },
          rocodex: { no: "FIG. 04", caption: "RocoDex · dual-site platform interface", source: "Interface capture: this project in production", alt: "RocoDex dual-site platform production interface" },
          alpha: { no: "FIG. 05", caption: "CSTD Alpha · research system interface", source: "Interface capture: this project in production", alt: "CSTD Alpha research system production interface" },
        },
    insideAnalysis: zh ? "走进这份分析" : "Inside the analysis",
    notesH2: zh ? "思考，留下来。" : "Thinking, kept.",
    notesLede: zh ? "关于系统、数据和做事方式的技术札记。" : "Notes on systems, data, and the way the work gets done.",
    notesNote: zh ? (
      <>札记按主题收在星图里，可以顺着线索读。{noteLink("/map", "去看星图")}</>
    ) : (
      <>Notes are indexed by theme on the map; follow a thread. {noteLink("/map", "Open the map")}</>
    ),
    allNotes: zh ? "全部札记" : "All notes",
    labH2: zh ? <>让结论，<br />经得起再运行。</> : <>A conclusion worth<br />putting to the test.</>,
    labLede: zh
      ? "估值怎么算，系统出了问题怎么处理？在实验室里动手试一试：从 DCF 模型到故障演练，看看输入变化后，结果为什么会变。"
      : "How does a valuation change? What happens when a system fails? Try a DCF model or a failure drill, change the inputs, and see why the result moves.",
    labNote: zh ? (
      <>实验室里的每个模型都可以改输入、看输出。{noteLink("/lab", "探索实验室")}</>
    ) : (
      <>Every model in the lab takes your inputs and shows its work. {noteLink("/lab", "Explore the labs")}</>
    ),
    labInstruments: zh
      ? [
          { name: "DCF 估值模型", line: "改一组假设，看估值怎么动" },
          { name: "故障演练", line: "把系统摁坏，练一次恢复" },
          { name: "回归实验台", line: "系数重算，图表重画" },
        ]
      : [
          { name: "DCF valuation model", line: "Change an assumption, watch the valuation move" },
          { name: "Failure drills", line: "Break the system on purpose, practice the recovery" },
          { name: "Regression bench", line: "Recompute the coefficients, redraw the charts" },
        ],
    colophonBrand: zh ? "奶黄包 · 个人工作室" : "CUSTARD · PERSONAL STUDIO",
    colophonMark: zh ? "奶黄包" : "CUSTARD",
    colophonDomain: "custard.top",
    colophonH2: zh ? <>好的想法，<br />值得被做出来。</> : <>Good ideas deserve<br />to become real.</>,
    colophonLede: zh ? (
      <>如果你在找一个能把分析做成产品的人，可以从这里继续认识我。</>
    ) : (
      <>If you are looking for someone who turns analysis into products, there is more to the story.</>
    ),
    colophonCta: zh ? "继续认识我" : "More about me",
    navNow: zh ? "现在" : "Now",
    navResume: zh ? "履历" : "Résumé",
    backToTop: zh ? "回到顶部" : "Back to top",
    colophonSmall: zh ? "© 2026 奶黄包 · 滚动编排由 GSAP ScrollTrigger 驱动，无视频。" : "© 2026 Custard · Scroll choreography by GSAP ScrollTrigger. No video.",
  };
}

export function CstdEditorialHomepage({
  locale = "zh",
  profile,
  works,
  notes,
  census,
}: {
  locale?: CstdLocale;
  profile: EditorialProfile;
  works: readonly EditorialWork[];
  notes: readonly EditorialNote[];
  census: { cases: number };
}) {
  const copy = useMemo(() => editorialCopy(locale), [locale]);
  const rootRef = useRef<HTMLDivElement>(null);
  /* 正式视图的固定件（skip link 与 folio）：游戏主题激活时卸载（而非仅隐藏），
     不占 fixed 元素预算、不留可访问树残影 */
  const [chromeMounted, setChromeMounted] = useState(true);

  const featured = works.find((work) => work.featured) ?? works[0];
  const zh = locale === "zh";

  /* ---- 唯一的客户端 effect：固定件互斥 + 动态装载 GSAP 编排 ----
     editorial-motion 与 gsap 一同落入异步 chunk，不进首屏 entry；装载等
     字体就位后自建/自回收（gsap.context + matchMedia）。依赖 chromeMounted：
     folio/skip 随主题切换卸载重挂，固定件重挂后触发器必须重新绑到新节点。 */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let destroyMotion: (() => void) | undefined;

    const isEditorialTheme = () => {
      const attr = document.documentElement.getAttribute("data-cstd-theme");
      return attr === null || attr === "atelier";
    };
    setChromeMounted(isEditorialTheme());
    const themeObserver = new MutationObserver(() => setChromeMounted(isEditorialTheme()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-cstd-theme"] });

    void import("./editorial-motion").then(({ mountEditorialMotion }) => {
      if (cancelled) return;
      destroyMotion = mountEditorialMotion(root, locale);
    });

    return () => {
      cancelled = true;
      themeObserver.disconnect();
      destroyMotion?.();
    };
  }, [locale, chromeMounted]);

  const navLinks = [
    { href: getLocalizedCstdHref("/work", locale), label: copy.navWork },
    { href: getLocalizedCstdHref("/notes", locale), label: copy.navNotes },
    { href: getLocalizedCstdHref("/topics", locale), label: copy.navTopics },
    { href: getLocalizedCstdHref("/map", locale), label: copy.navMap },
  ];

  const renderWorkPlate = (slug: string) => {
    const spec = WORK_PLATES[slug];
    if (!spec) return null;
    const meta = copy.plates[spec.plate];
    return (
      <figure className="plate">
        {/* images.unoptimized 下 next/image 不产出 srcset；单档 1280w 源对栏内 ~460px 显示约 2.8x DPR 覆盖 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={spec.src} alt={meta.alt} width={spec.width} height={spec.height} loading="lazy" decoding="async" className="plate-img" />
        <figcaption>
          <span className="fig-no">{meta.no}</span>
          {meta.caption}
          <span className="fig-source">{meta.source}</span>
        </figcaption>
      </figure>
    );
  };

  return (
    <div ref={rootRef} data-cstd-home-editorial className="ed">
      {/* 手工样式表链接是有意为之：React precedence 提升保证加载顺序稳定（无 next/css 参与的零构建链路）。
          样式表带版本参数：/cstd-scroll/* 是 immutable 一年缓存且文件名无哈希，
          内容更新必须换版本号强制浏览器回源（见 docs/MAINTENANCE.md）。 */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" precedence="sc-page" href="/cstd-scroll/cstd-editorial.css?v=6" />
      {/* 首屏衬线字体声明式预载（可变字重，覆盖全部标题/正文强调）：
          font-display:swap 下 LCP 记录的是字体换绘后的重绘时刻，慢 4G 上
          原本要等 CSS 链路才发现字体请求；预载让它与 CSS 并行到达。 */}
      <link rel="preload" href="/fonts/cstd/press-serif-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_FALLBACK_CSS }} />
      </noscript>

      {/* 跳到正文：首枚可聚焦元素，键盘用户免于逐个穿过顶栏控件（样式在 .ed-skip）；
          随固定件一起在游戏主题下卸载，不占 fixed 预算 */}
      {chromeMounted ? <a href="#top" className="ed-skip">{copy.skipToContent}</a> : null}

      {/* 顶部栏：品牌 + 直达 + 主题/语言切换 + 唯一 CTA */}
      <header className="ed-bar" data-cstd-home-header>
        <a className="ed-bar__mark" href="#top">
          {zh ? "奶黄包" : "CUSTARD"}
          <span className="ed-bar__host">custard.top</span>
        </a>
        <nav aria-label={copy.navAria} className="ed-bar__nav">
          {navLinks.map((link) => (
            <CstdLink key={link.href} href={link.href} className="ed-bar__link">
              {link.label}
            </CstdLink>
          ))}
        </nav>
        <div className="ed-bar__tools">
          <ThemeSwitcher locale={locale} />
          <CstdLanguageSwitcher locale={locale} compact />
          <a className="ed-bar__cta" href={copy.mailto}>{copy.ctaHeader}</a>
        </div>
      </header>

      {/* folio 页码导航（章节编辑部的导航；游戏主题激活时随固定件卸载） */}
      {chromeMounted ? (
        <nav className="folio" aria-label={copy.folioAria} data-folio-nav>
          {FOLIO.map((item) => (
            <CstdChapterLink key={item.id} href={`#${item.id}`} className="folio__item" data-folio={item.id}>
              <b>{item.mark[locale]}</b>
              <span>{item.label[locale]}</span>
              <i aria-hidden="true"><u /></i>
            </CstdChapterLink>
          ))}
        </nav>
      ) : null}

      {/* main 地标：游戏壳内的 <main> 被互斥规则 display:none 移出可访问树，
          任一时刻页面只暴露一个 main；tabindex=-1 让 skip link 能把焦点真正移交正文 */}
      <main id="top" tabIndex={-1}>
        {/* 扉 · title page */}
        <section className="chapter ch-title" id="ch-title">
          <div className="ch-wrap">
            <div className="title-lift">
              {/* 扉页题签：SSR 直出可见（LCP 不等任何脚本），水合后由 GSAP
                  from 落位——隐藏态只在编排装载后存在 */}
              <div className="ed-stack title-stack">
                <h1 className="ed-display-xl">
                  {profile.name}<span className="ed-fullstop" aria-hidden="true">.</span>
                </h1>
                <p className="ed-statement">{copy.statement}</p>
                <p className="ed-summary">{profile.summary}</p>
                <p className="title-actions">
                  <CstdChapterLink href="#ch-work" className="ed-button">{copy.exploreWork}</CstdChapterLink>
                  <CstdLink href={getLocalizedCstdHref("/about", locale)} className="ed-textlink">{copy.aboutMe}</CstdLink>
                </p>
                <p className="title-role"><span>{copy.roleField}</span><span>{copy.roleCraft}</span></p>
              </div>
            </div>
            <p className="title-foot">
              {copy.titleFoot}
              <i className="ed-rule" aria-hidden="true" />
            </p>
          </div>
        </section>

        {/* 壹 · 方法 */}
        <section className="chapter ch-method" id="ch-method">
          <div className="ch-wrap">
            <div className="ed-stack" data-ed-in="70">
              <h2 className="ed-display-lg">{copy.methodH2}</h2>
              <div className="anno">
                <p className="ed-lede">{copy.methodLede}</p>
                <aside className="mnote"><i className="ed-rule" aria-hidden="true" /><p>{copy.methodNote}</p></aside>
              </div>
            </div>
            <ol className="method-list">
              {copy.methodSteps.map((step, index) => (
                <li key={step.title} className="ed-stack" data-ed-in="60">
                  <span className="method-no">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.detail}</p></div>
                  <small>{step.signal}</small>
                  <i className="ed-rule" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 贰 · 作品（峰）：整章一条 flow scrub，计数/揭示/视差按章 p 擦洗 */}
        <section className="chapter ch-work" id="ch-work">
          <div className="ch-wrap">
            <div className="ed-stack ch-head" data-ed-in="70">
              <h2 className="ed-display-lg">{copy.workH2}</h2>
              <div className="anno">
                <p className="ed-lede">{copy.workLede}</p>
                <aside className="mnote"><i className="ed-rule" aria-hidden="true" /><p>{copy.workNote}</p></aside>
              </div>
              <p className="work-census" aria-label={copy.censusLabel}>
                {/* 滚动计数会把中间值擦写进无障碍名称：动画数字对读屏隐藏，旁挂常驻终值 */}
                <span aria-hidden="true" data-ed-count="0 7" data-ed-count-at="0.06 0.26">{census.cases}</span>
                <span className="sr-only">{census.cases}</span> {copy.censusCases}
              </p>
            </div>

            {featured ? (
              <article className="work work--featured ed-stack" data-ed-in="60">
                <p className="work-kicker">
                  <span className="work-no">{String(works.indexOf(featured) + 1).padStart(2, "0")}</span>
                  {featured.kicker}
                </p>
                <h3 className="work-title">{featured.title}</h3>
                <p className="work-meta"><span>{featured.year}</span>{featured.technologies.map((technology) => <span key={technology}>{technology}</span>)}</p>
                <p className="work-summary">{featured.summary}</p>
                <CstdLink href={featured.path} className="ed-textlink">{copy.insideAnalysis}</CstdLink>
              </article>
            ) : null}

            <div className="work-duo">
              {works.filter((work) => work !== featured).map((work) => (
                <article key={work.slug} className="work ed-stack" data-ed-in="60">
                  <p className="work-kicker">
                    <span className="work-no">{String(works.indexOf(work) + 1).padStart(2, "0")}</span>
                    {work.kicker}
                  </p>
                  <h3 className="work-title">{work.title}</h3>
                  <p className="work-meta"><span>{work.year}</span>{work.technologies.map((technology) => <span key={technology}>{technology}</span>)}</p>
                  <p className="work-summary">{work.summary}</p>
                  <CstdLink href={work.path} className="ed-textlink">
                    {copy.viewCase}<span aria-hidden="true"> →</span>
                  </CstdLink>
                  {renderWorkPlate(work.slug)}
                </article>
              ))}
            </div>

            {featured ? (
              <div className="data-spread">
                <div className="data-copy">
                  {/* 数据时刻拆两档：数字独占一行大字（计数原样），量词句降档续行。
                      计数窗为 .data-spread pin 行程的相对进度（0.1–0.8）：
                      元素被 pin 钉在屏上，可见性是结构保证 */}
                  <h3 className="data-count">
                    <span className="sr-only">1,470,000 </span>
                    <span className="ed-nums" aria-hidden="true" data-ed-count="0 1,470,000" data-ed-count-at="0.1 0.8">1,470,000</span>
                  </h3>
                  <p className="data-count-line">{copy.countUnitZh}{copy.countHead}</p>
                  <p>{copy.dataBody}</p>
                  <p className="data-tools" aria-label={copy.dataToolsLabel}>{featured.technologies.join(" · ")}</p>
                </div>
                <figure className="data-figure">
                  <div className="data-figure-inner">
                    {/* images.unoptimized 下 next/image 不产出 srcset；手工分档（960/1536/2580）
                        让手机按视口取小图，width/height 兜住布局抖动，lazy 保持折下加载。
                        图版满内容宽后桌面显示宽约 988px：1536w≈1.55x、2580w 覆盖 2x DPR。 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/cstd-archive/cstd-archive-melbourne-coefficients-v1.webp"
                      srcSet={[
                        "/cstd-archive/cstd-archive-melbourne-coefficients-v1-960w.webp 960w",
                        "/cstd-archive/cstd-archive-melbourne-coefficients-v1-1536w.webp 1536w",
                        "/cstd-archive/cstd-archive-melbourne-coefficients-v1.webp 2580w",
                      ].join(", ")}
                      sizes="(min-width: 1100px) 68vw, 92vw"
                      width={2580}
                      height={1380}
                      loading="lazy"
                      decoding="async"
                      alt={zh ? "温度、PM2.5、风速和周末因素与墨尔本行人活动的回归系数图" : "Regression coefficients relating temperature, PM2.5, wind speed, and weekends to Melbourne pedestrian activity"}
                      className="data-figure-img"
                    />
                  </div>
                  <figcaption>
                    <span className="fig-no">{copy.figureNo}</span>
                    {copy.figureCaption}
                    <span className="fig-source">{copy.figureSource}</span>
                  </figcaption>
                </figure>
                {/* 副图对（图 02/03）：同一分析管线的真实产物，主图给整体回归、副图给空间与敏感性两面证据 */}
                <div className="data-pair" data-ed-in="60">
                  {[
                    { src: "/cstd-archive/cstd-archive-melbourne-heatmap-v1.webp", width: 2700, height: 1440, meta: copy.plates.heatmap },
                    { src: "/cstd-archive/cstd-archive-melbourne-heat-sensitivity-v1.webp", width: 2700, height: 1560, meta: copy.plates.sensitivity },
                  ].map((entry) => (
                    <figure key={entry.src} className="plate">
                      {/* 科学图版不裁切：各自自然比例、顶对齐，轴标完整 */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.src} alt={entry.meta.alt} width={entry.width} height={entry.height} loading="lazy" decoding="async" className="plate-img" />
                      <figcaption>
                        <span className="fig-no">{entry.meta.no}</span>
                        {entry.meta.caption}
                        <span className="fig-source">{entry.meta.source}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* 叁 · 札记 */}
        <section className="chapter ch-notes" id="ch-notes">
          <div className="ch-wrap">
            <div className="ed-stack ch-head" data-ed-in="70">
              <h2 className="ed-display-lg">{copy.notesH2}</h2>
              <div className="anno">
                <p className="ed-lede">{copy.notesLede}</p>
                <aside className="mnote"><i className="ed-rule" aria-hidden="true" /><p>{copy.notesNote}</p></aside>
              </div>
            </div>
            <div className="note-list">
              {notes.map((note) => (
                <CstdLink key={note.slug} href={note.path} className="note ed-stack" data-ed-in="60">
                  <time dateTime={note.publishedAt}>{note.dateLabel}</time>
                  <div data-ed-drift><h3>{note.title}</h3><p>{note.summary}</p></div>
                  <span aria-hidden="true">↗</span>
                  <i className="ed-rule" aria-hidden="true" />
                </CstdLink>
              ))}
            </div>
          </div>
        </section>

        {/* 肆 · 实验室：h2 走章题升幕 scrub（替代一次性入场） */}
        <section className="chapter ch-lab" id="ch-lab">
          <div className="ch-wrap">
            <div className="ed-stack">
              <h2 className="ed-display-lg">{copy.labH2}</h2>
              <div className="anno" data-ed-in="70">
                <p className="ed-lede">{copy.labLede}</p>
                <aside className="mnote"><i className="ed-rule" aria-hidden="true" /><p>{copy.labNote}</p></aside>
              </div>
            </div>
            {/* 仪器目录：『动手试一试』的实物索引。编号列（LAB 01…）与名称下的刻度线
                构成账行以外的第二视觉维度，与叁章纯文字账行拉开密度 */}
            <div className="lab-list" data-ed-in="60">
              {copy.labInstruments.map((instrument, index) => (
                <CstdLink key={instrument.name} href={getLocalizedCstdHref("/lab", locale)} className="lab-row">
                  <span className="lab-no">{`LAB ${String(index + 1).padStart(2, "0")}`}</span>
                  <span className="lab-name"><b>{instrument.name}</b><i aria-hidden="true" /></span>
                  <span>{instrument.line}</span>
                  <span aria-hidden="true">→</span>
                </CstdLink>
              ))}
            </div>
          </div>
        </section>

        {/* 末 · 版权页 */}
        <section className="chapter ch-colophon" id="ch-colophon" data-colophon>
          <div className="ch-wrap">
            <div className="ed-stack" data-ed-in="70">
              <p className="colophon-brand">{copy.colophonBrand}</p>
              <h2 className="ed-display-lg">{copy.colophonH2}</h2>
              <p className="ed-lede">
                {copy.colophonLede}{" "}
                <CstdLink href={getLocalizedCstdHref("/about", locale)} className="colophon-cta">{copy.colophonCta}</CstdLink>
              </p>
            </div>
            {/* 名字回归：合卷前的最后一眼落在品牌上（金点收句，域名旁注） */}
            <p className="colophon-mark">
              {copy.colophonMark}
              <span className="colophon-mark__dot" aria-hidden="true">.</span>
              <span className="colophon-mark__domain">{copy.colophonDomain}</span>
            </p>
            <footer className="colophon-foot">
              <i className="ed-rule" aria-hidden="true" />
              <nav aria-label={copy.navAria}>
                <CstdLink href={getLocalizedCstdHref("/now", locale)}>{copy.navNow}</CstdLink>
                <CstdLink href={getLocalizedCstdHref("/resume", locale)}>{copy.navResume}</CstdLink>
                {/* 内链补口：/voxel 全站仅 sitemap 可达，此处给真实可抓取入口 */}
                <CstdLink href={getLocalizedCstdHref("/voxel", locale)}>{copy.navVoxel}</CstdLink>
                <CstdChapterLink href="#top"><span aria-hidden="true">↑ </span>{copy.backToTop}</CstdChapterLink>
              </nav>
              <p className="colophon-small">{copy.colophonSmall}</p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
