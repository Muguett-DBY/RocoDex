"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";
import type { CstdLocale } from "../../content/content-types";
import { CstdChapterLink } from "../site/cstd-chapter-link";
import { CstdLink } from "../site/cstd-link";
import { CstdLanguageSwitcher } from "../site/cstd-language-switcher";
import { ThemeSwitcher } from "../theme-switcher";

/* ============================================================================
   CSTD Editorial · 默认主页（atelier 主题槽位）的正式滚动版式。
   Chaptered editorial grammar（scroll-craft）：纸面章节、入场落位、页边批注、
   folio 页码导航；每章一个 flow act，把引擎发布的 --sc-p 接给页面 CSS——
   铜线绘制、编号落墨、札记入档、图表揭示与 147 万计数均随滚动位置擦洗。
   零视频、零滚动劫持：全部动效为 transform/opacity/clip-path，原生文档流滚动。

   内容数据由服务端（personal-homepage.tsx）准备好以 props 传入，内容注册表
   不进客户端包。独立 HTML 原型与验证留档：/cstd-scroll/prototype.html 与
   scrollcraft/builds/cstd-editorial/。引擎（scrollcraft.js/css）不改动。
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

const NOSCRIPT_FALLBACK_CSS = `
[data-cstd-home-editorial] [data-sc-in],[data-cstd-home-editorial] [data-sc-stagger]>*{opacity:1!important;transform:none!important}
[data-cstd-home-editorial] [data-sc-reveal]{clip-path:none!important}
[data-cstd-home-editorial] .mnote{opacity:1!important;transform:none!important}
[data-cstd-home-editorial] .folio{display:none!important}
`;

type FolioItem = { id: string; mark: { zh: string; en: string }; label: { zh: string; en: string } };

const FOLIO: readonly FolioItem[] = [
  { id: "ch-title", mark: { zh: "扉", en: "·" }, label: { zh: "扉页", en: "Title" } },
  { id: "ch-method", mark: { zh: "壹", en: "I" }, label: { zh: "方法", en: "Method" } },
  { id: "ch-work", mark: { zh: "贰", en: "II" }, label: { zh: "作品", en: "Work" } },
  { id: "ch-notes", mark: { zh: "叁", en: "III" }, label: { zh: "札记", en: "Notes" } },
  { id: "ch-lab", mark: { zh: "肆", en: "IV" }, label: { zh: "实验室", en: "Labs" } },
  { id: "ch-colophon", mark: { zh: "末", en: "V" }, label: { zh: "版权页", en: "Colophon" } },
];

type EditorialCopy = {
  mailto: string;
  navAria: string;
  folioAria: string;
  navWork: string;
  navNotes: string;
  navMap: string;
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
  figureCaption: string;
  insideAnalysis: string;
  notesH2: string;
  notesLede: string;
  notesNote: React.ReactNode;
  allNotes: string;
  labH2: React.ReactNode;
  labLede: string;
  labNote: React.ReactNode;
  colophonBrand: string;
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
    navWork: zh ? "作品" : "Work",
    navNotes: zh ? "笔记" : "Notes",
    navMap: zh ? "星图" : "Map",
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
    figureCaption: zh ? "墨尔本 CBD · 环境因素与行人活动的回归分析" : "Melbourne CBD · regression analysis of environment and pedestrian activity",
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
    colophonBrand: zh ? "奶黄包 · 个人工作室" : "CUSTARD · PERSONAL STUDIO",
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
    colophonSmall: zh ? "© 2026 奶黄包 · 本页滚动效果由 ScrollCraft 驱动，无视频。" : "© 2026 Custard · Scroll effects by ScrollCraft. No video.",
  };
}

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: HTMLElement | Document) => { destroy: () => void; clips: unknown[] };
    };
    __sc?: unknown;
  }
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
  const folioRef = useRef<HTMLElement>(null);
  /* folio 只属于正式视图：游戏主题激活时卸载（而非仅隐藏），不占 fixed 元素与可访问树 */
  const [folioMounted, setFolioMounted] = useState(true);

  const featured = works.find((work) => work.featured) ?? works[0];
  const zh = locale === "zh";

  useEffect(() => {
    const root = rootRef.current;
    const folio = folioRef.current;
    if (!root) return;

    let destroyed = false;
    const cleanups: (() => void)[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("ed-ready");
    cleanups.push(() => document.documentElement.classList.remove("ed-ready"));

    /* ---- 页边批注：随所属段落进入视口而落位，一次性 ----
       触发线保持浅（-6% / 0.05）：页尾章节剩余滚动余量少，触发过深会让
       快速滚到底的读者完全看不到落位过程。 */
    const notes = Array.from(root.querySelectorAll<HTMLElement>("[data-mnote]"));
    if (reduce || !("IntersectionObserver" in window)) {
      notes.forEach((n) => n.classList.add("is-set"));
    } else {
      const noteIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-set");
              noteIO.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
      );
      notes.forEach((n) => noteIO.observe(n));
      cleanups.push(() => noteIO.disconnect());
    }

    /* ---- folio：当前章高亮 + 进度细线 + 版权页墨色翻转 ---- */
    if (folio) {
      const items: { a: HTMLAnchorElement; chapter: HTMLElement; bar: HTMLElement }[] = [];
      folio.querySelectorAll<HTMLAnchorElement>(".folio__item").forEach((a) => {
        const chapter = root.querySelector(a.getAttribute("href") ?? "");
        const bar = a.querySelector("u");
        if (chapter instanceof HTMLElement && bar instanceof HTMLElement) items.push({ a, chapter, bar });
      });

      const colophon = root.querySelector("[data-colophon]");
      if (colophon && "IntersectionObserver" in window) {
        const darkIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => folio.classList.toggle("is-dark", entry.isIntersecting));
          },
          { threshold: 0.4 },
        );
        darkIO.observe(colophon);
        cleanups.push(() => darkIO.disconnect());
      }

      let ticking = false;
      let trailing = 0;
      const update = () => {
        ticking = false;
        const vh = window.innerHeight;
        const center = vh * 0.5;
        let active: (typeof items)[number] | null = null;
        items.forEach((item) => {
          const rect = item.chapter.getBoundingClientRect();
          let p = (vh - rect.top) / (rect.height + vh);
          p = Math.min(Math.max(p, 0), 1);
          (item.bar as HTMLElement).style.setProperty("--fill", p.toFixed(4));
          if (rect.top <= center && rect.bottom >= center) active = item;
        });
        items.forEach((item) => item.a.classList.toggle("is-active", item === active));
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
        // 无渲染帧的环境（如合成滚动后的无头测试）里 rAF 可能不再触发，尾随定时器保证末态确定执行
        window.clearTimeout(trailing);
        trailing = window.setTimeout(update, 150);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.clearTimeout(trailing);
      });
      update();
    }

    /* ---- stagger 入场残留清理：引擎把 transitionDelay 内联写进直接子元素且从不清除，
       会拖慢链接的 hover 反馈（.work 链接 240ms、.note 箭头 120ms）。入场过渡结束后
       清掉内联延迟——运行中的过渡不受影响，延迟的唯一职责就是这次入场。 ---- */
    const onTransitionEnd = (event: TransitionEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.style.transitionDelay) target.style.transitionDelay = "";
    };
    root.addEventListener("transitionend", onTransitionEnd);
    cleanups.push(() => root.removeEventListener("transitionend", onTransitionEnd));

    /* ---- 装载引擎（scrollcraft.js 不改动）；游戏主题激活时卸载，回默认时重挂 ---- */
    const isEditorialTheme = () => {
      const attr = document.documentElement.getAttribute("data-cstd-theme");
      return attr === null || attr === "atelier";
    };
    setFolioMounted(isEditorialTheme());
    let booted = false;
    let api: { destroy: () => void } | null = null;
    let engineLoaded = Boolean(window.ScrollCraft);
    /* 引擎脚本加载失败（网络故障/拦截）时，scrollcraft.css 仍会把入场元素压在
       opacity:0——JS 开启但引擎缺席的场景 noscript 兜底覆盖不到。失败即挂
       ed-fallback 强制呈现；引擎迟到则摘除并照常入场。 */
    const dropFallback = () => document.documentElement.classList.remove("ed-fallback");
    const boot = () => {
      if (destroyed || booted || !engineLoaded || !isEditorialTheme()) return;
      booted = true;
      dropFallback();
      api = window.ScrollCraft!.mount(document.body);
      (window as { __sc?: unknown }).__sc = api;
    };
    const unboot = () => {
      if (!booted) return;
      booted = false;
      try {
        api?.destroy();
      } catch {
        /* idempotent */
      }
      api = null;
    };
    if (!engineLoaded) {
      const script = document.createElement("script");
      script.src = "/cstd-scroll/scrollcraft.js";
      script.async = true;
      script.addEventListener("load", () => {
        engineLoaded = true;
        boot();
      });
      script.addEventListener("error", () => {
        if (!window.ScrollCraft) document.documentElement.classList.add("ed-fallback");
      });
      document.head.appendChild(script);
      /* 既不 load 也不 error 的悬置（长超时、被代理掐断）：超时兜底直接呈现 */
      const engineWatch = window.setTimeout(() => {
        if (!window.ScrollCraft) document.documentElement.classList.add("ed-fallback");
      }, 4000);
      cleanups.push(() => {
        window.clearTimeout(engineWatch);
        script.remove();
        dropFallback();
      });
    }
    const themeObserver = new MutationObserver(() => {
      const editorial = isEditorialTheme();
      setFolioMounted(editorial);
      if (editorial) boot();
      else unboot();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-cstd-theme"] });
    cleanups.push(() => themeObserver.disconnect());
    boot();

    return () => {
      destroyed = true;
      try {
        api?.destroy();
      } catch {
        /* teardown after detach is idempotent */
      }
      if ((window as { __sc?: unknown }).__sc === api) (window as { __sc?: unknown }).__sc = undefined;
      while (cleanups.length) cleanups.pop()!();
    };
  }, []);

  const navLinks = [
    { href: getLocalizedCstdHref("/work", locale), label: copy.navWork },
    { href: getLocalizedCstdHref("/notes", locale), label: copy.navNotes },
    { href: getLocalizedCstdHref("/map", locale), label: copy.navMap },
  ];

  return (
    <div ref={rootRef} data-cstd-home-editorial className="ed">
      <link rel="stylesheet" precedence="sc-engine" href="/cstd-scroll/scrollcraft.css" />
      <link rel="stylesheet" precedence="sc-page" href="/cstd-scroll/cstd-editorial.css" />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_FALLBACK_CSS }} />
      </noscript>

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

      {/* folio 页码导航（章节编辑部的导航；游戏主题激活时卸载） */}
      {folioMounted ? (
        <nav className="folio" ref={folioRef} aria-label={copy.folioAria} data-folio-nav>
          {FOLIO.map((item) => (
            <CstdChapterLink key={item.id} href={`#${item.id}`} className="folio__item" data-folio={item.id}>
              <b>{item.mark[locale]}</b>
              <span>{item.label[locale]}</span>
              <i aria-hidden="true"><u /></i>
            </CstdChapterLink>
          ))}
        </nav>
      ) : null}

      <div id="top">
        {/* 扉 · title page */}
        <section className="chapter ch-title" id="ch-title" data-sc-act="flow">
          <div className="ch-wrap">
            <div className="title-lift" data-sc-parallax="-0.3">
              <div className="sc-stack title-stack" data-sc-in data-sc-stagger="80">
                <h1 className="ed-display-xl">
                  {profile.name}<span className="ed-fullstop" aria-hidden="true">.</span>
                </h1>
                <p className="ed-statement">{copy.statement}</p>
                <p className="ed-summary">{profile.summary}</p>
                <p className="title-actions">
                  <CstdChapterLink href="#ch-work" className="ed-button">{copy.exploreWork}</CstdChapterLink>
                  <CstdLink href={getLocalizedCstdHref("/about", locale)} className="ed-textlink">
                    {copy.aboutMe}<span aria-hidden="true"> →</span>
                  </CstdLink>
                </p>
                <p className="title-role"><span>{copy.roleField}</span><span>{copy.roleCraft}</span></p>
              </div>
            </div>
            <p className="title-foot">{copy.titleFoot}</p>
          </div>
        </section>

        {/* 壹 · 方法 */}
        <section className="chapter ch-method" id="ch-method" data-sc-act="flow">
          <div className="ch-wrap">
            <div className="sc-stack" data-sc-in data-sc-stagger="70">
              <h2 className="ed-display-lg">{copy.methodH2}</h2>
              <div className="anno">
                <p className="ed-lede">{copy.methodLede}</p>
                <aside className="mnote" data-mnote><p>{copy.methodNote}</p></aside>
              </div>
            </div>
            <ol className="method-list">
              {copy.methodSteps.map((step, index) => (
                <li key={step.title} className="sc-stack" data-sc-in data-sc-stagger="60">
                  <span className="method-no">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.detail}</p></div>
                  <small>{step.signal}</small>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 贰 · 作品（峰）：整章一个 flow act，计数/揭示/视差按章 p 擦洗 */}
        <section className="chapter ch-work" id="ch-work" data-sc-act="flow">
          <div className="ch-wrap">
            <div className="sc-stack ch-head" data-sc-in data-sc-stagger="70">
              <h2 className="ed-display-lg">{copy.workH2}</h2>
              <div className="anno">
                <p className="ed-lede">{copy.workLede}</p>
                <aside className="mnote" data-mnote><p>{copy.workNote}</p></aside>
              </div>
              <p className="work-census" aria-label={copy.censusLabel}>
                <span data-sc-count="0 7" data-sc-count-at="0.06 0.26">{census.cases}</span> {copy.censusCases}
              </p>
            </div>

            {featured ? (
              <article className="work work--featured sc-stack" data-sc-in data-sc-stagger="60">
                <p className="work-kicker">{featured.kicker}</p>
                <h3 className="work-title">{featured.title}</h3>
                <p className="work-meta"><span>{featured.year}</span><span>{featured.technologies.join(" · ")}</span></p>
                <p className="work-summary">{featured.summary}</p>
                <CstdLink href={featured.path} className="ed-textlink">
                  {copy.insideAnalysis}<span aria-hidden="true"> →</span>
                </CstdLink>
              </article>
            ) : null}

            <div className="work-duo">
              {works.filter((work) => work !== featured).map((work) => (
                <article key={work.slug} className="work sc-stack" data-sc-in data-sc-stagger="60">
                  <p className="work-kicker">{work.kicker}</p>
                  <h3 className="work-title">{work.title}</h3>
                  <p className="work-meta"><span>{work.year}</span><span>{work.technologies.join(" · ")}</span></p>
                  <p className="work-summary">{work.summary}</p>
                  <CstdLink href={work.path} className="ed-textlink">
                    {copy.viewCase}<span aria-hidden="true"> →</span>
                  </CstdLink>
                </article>
              ))}
            </div>

            {featured ? (
              /* data-spread 自身不再挂 act：章级 act 会与嵌套 act 双收集同一批设备，
                 内层后写胜出会静默维持旧窗口（引擎按 querySelectorAll 含后代收集） */
              <div className="data-spread">
                <div className="data-copy">
                  <h3 className="ed-display-md">
                    <span className="sc-nums" data-sc-count="0 1,470,000" data-sc-count-at="0.50 0.74">1,470,000</span>
                    <br />{copy.countUnitZh}<br />{copy.countHead}
                  </h3>
                  <p>{copy.dataBody}</p>
                  <p className="data-tools" aria-label={copy.dataToolsLabel}>{featured.technologies.join(" · ")}</p>
                </div>
                <figure className="data-figure" data-sc-reveal="left" data-sc-reveal-at="0.48 0.70">
                  <div className="data-figure-inner" data-sc-parallax="-0.4">
                    <Image
                      src="/cstd-archive/cstd-archive-melbourne-coefficients-v1.webp"
                      alt={zh ? "温度、PM2.5、风速和周末因素与墨尔本行人活动的回归系数图" : "Regression coefficients relating temperature, PM2.5, wind speed, and weekends to Melbourne pedestrian activity"}
                      width={2580}
                      height={1380}
                      sizes="(min-width: 1100px) 44vw, 92vw"
                      className="data-figure-img"
                    />
                  </div>
                  <figcaption>{copy.figureCaption}</figcaption>
                </figure>
              </div>
            ) : null}
          </div>
        </section>

        {/* 叁 · 札记 */}
        <section className="chapter ch-notes" id="ch-notes" data-sc-act="flow">
          <div className="ch-wrap">
            <div className="sc-stack ch-head" data-sc-in data-sc-stagger="70">
              <h2 className="ed-display-lg">{copy.notesH2}</h2>
              <div className="anno">
                <p className="ed-lede">{copy.notesLede}</p>
                <aside className="mnote" data-mnote><p>{copy.notesNote}</p></aside>
              </div>
            </div>
            <div className="note-list">
              {notes.map((note) => (
                <CstdLink key={note.slug} href={note.path} className="note sc-stack" data-sc-in data-sc-stagger="60">
                  <time dateTime={note.publishedAt}>{note.dateLabel}</time>
                  <div data-ed-drift><h3>{note.title}</h3><p>{note.summary}</p></div>
                  <span aria-hidden="true">↗</span>
                </CstdLink>
              ))}
            </div>
          </div>
        </section>

        {/* 肆 · 实验室：h2 交给引擎按章 p 扫擦揭示（替代一次性入场） */}
        <section className="chapter ch-lab" id="ch-lab" data-sc-act="flow">
          <div className="ch-wrap">
            <div className="sc-stack">
              <h2 className="ed-display-lg" data-sc-reveal="up" data-sc-reveal-at="0.05 0.34">{copy.labH2}</h2>
              <div className="anno" data-sc-in data-sc-stagger="70">
                <p className="ed-lede">{copy.labLede}</p>
                <aside className="mnote" data-mnote><p>{copy.labNote}</p></aside>
              </div>
            </div>
          </div>
        </section>

        {/* 末 · 版权页 */}
        <section className="chapter ch-colophon" id="ch-colophon" data-colophon data-sc-act="flow">
          <div className="ch-wrap">
            <div className="sc-stack" data-sc-in data-sc-stagger="70">
              <p className="colophon-brand">{copy.colophonBrand}</p>
              <h2 className="ed-display-lg">{copy.colophonH2}</h2>
              <p className="ed-lede">
                {copy.colophonLede}{" "}
                <CstdLink href={getLocalizedCstdHref("/about", locale)} className="colophon-cta">{copy.colophonCta}</CstdLink>
              </p>
            </div>
            <footer className="colophon-foot">
              <nav aria-label={copy.navAria}>
                <CstdLink href={getLocalizedCstdHref("/now", locale)}>{copy.navNow}</CstdLink>
                <CstdLink href={getLocalizedCstdHref("/resume", locale)}>{copy.navResume}</CstdLink>
                <CstdChapterLink href="#top">{copy.backToTop}</CstdChapterLink>
              </nav>
              <p className="colophon-small">{copy.colophonSmall}</p>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
