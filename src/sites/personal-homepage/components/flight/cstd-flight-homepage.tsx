"use client";

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";
import type { CstdLocale } from "../../content/content-types";
import { CstdLink } from "../site/cstd-link";
import { CstdLanguageSwitcher } from "../site/cstd-language-switcher";
import { ThemeSwitcher } from "../theme-switcher";

/* ============================================================================
   CSTD Flight · 默认主页（atelier 主题槽位）的 worldflight 滚动旅程。
   独立 HTML 原型位于 /cstd-flight/prototype.html（scroll-craft 构建，验证留档）。
   引擎（scrollcraft.js/css）不改动，按 data-sc-* 属性驱动本组件的真实 DOM。

   签名动作「证据并网」：城市电网 rail + 并网台账，数字全部来自
   generatedCstdProofMesh（7 作品 / 31 证据 / 各项覆盖率与验收日期）。
   ========================================================================== */

const ASSET = "/cstd-flight/assets";

type LegSpec = {
  n: number;
  img: string;
  w: number;
  linger: number;
  label: { zh: string; en: string };
};

const LEGS: readonly LegSpec[] = [
  { n: 1, img: "departure-city", w: 1.08, linger: 0.3, label: { zh: "启程", en: "Departure" } },
  { n: 2, img: "neural-gate", w: 1.08, linger: 0.3, label: { zh: "神经门", en: "Neural Gate" } },
  { n: 3, img: "method-bench", w: 1.08, linger: 0.3, label: { zh: "工作台", en: "Workbench" } },
  { n: 4, img: "evidence-foundry", w: 1.08, linger: 0.3, label: { zh: "证据铸造", en: "Evidence Foundry" } },
  { n: 5, img: "core-world", w: 1.72, linger: 0.35, label: { zh: "穹顶核心", en: "Dome Core" } },
  { n: 6, img: "knowledge-loom", w: 1.08, linger: 0.3, label: { zh: "知识织廊", en: "Knowledge Loom" } },
  { n: 7, img: "quiet-archive", w: 1.08, linger: 0.3, label: { zh: "档案长廊", en: "Quiet Archive" } },
  { n: 8, img: "observatory-core", w: 1.08, linger: 0.3, label: { zh: "观测台", en: "Observatory" } },
  { n: 9, img: "night-workstation", w: 1.08, linger: 0.25, label: { zh: "工作站", en: "Workstation" } },
];

const TOTAL_TRACK = LEGS.reduce((sum, leg) => sum + leg.w, 0);

function legStart(index: number) {
  let c0 = 0;
  for (let i = 0; i < index; i += 1) c0 += LEGS[i].w;
  return c0;
}

type ProjectLedger = { name: { zh: string; en: string }; cov: number; arts: number; date: string };

const PROJECTS: readonly ProjectLedger[] = [
  { name: { zh: "RocoDex 双站平台", en: "RocoDex dual-site platform" }, cov: 100, arts: 7, date: "2026-08-09" },
  { name: { zh: "DCF Quantum", en: "DCF Quantum" }, cov: 80, arts: 4, date: "2026-08-09" },
  { name: { zh: "CSTD Alpha 研究系统", en: "CSTD Alpha research system" }, cov: 80, arts: 5, date: "2026-08-09" },
  { name: { zh: "墨尔本行人×微气候", en: "Melbourne pedestrians × microclimate" }, cov: 72, arts: 5, date: "2026-09-06" },
  { name: { zh: "CFZZS 招商 CRM", en: "CFZZS industrial CRM" }, cov: 80, arts: 3, date: "2026-08-09" },
  { name: { zh: "CSTD Design 工作台", en: "CSTD Design workbench" }, cov: 72, arts: 3, date: "2026-08-09" },
  { name: { zh: "奶黄包摄影体验", en: "Custard portrait experience" }, cov: 80, arts: 4, date: "2026-08-09" },
];

const NOSCOPE_FALLBACK_CSS = `
[data-cstd-home-flight] [data-sc-copy]{opacity:1!important;pointer-events:auto!important}
[data-cstd-home-flight] .fx-copy{position:static!important;inset:auto!important;max-width:44rem!important;margin:1.5rem auto!important;text-align:left!important;background:rgba(5,7,9,.86);border:1px solid rgba(242,239,231,.16);padding:1.25rem 1.5rem}
[data-cstd-home-flight] .fx-anchor{translate:none!important}
[data-cstd-home-flight] .grid-rail,[data-cstd-home-flight] .ledger{display:none!important}
[data-cstd-home-flight] [data-sc-spacer]{display:none}
`;

type FlightCopy = {
  mailto: string;
  cta: string;
  navAria: string;
  railHead: string;
  ledgerTitle: string;
  ledgerEn: string;
  ledgerHint: string;
  role: string;
  heroH1: ReactNode;
  heroSub: string;
  gateH2: string;
  gateBody: string;
  methodH2: string;
  method: { term: string; desc: string }[];
  foundryH2: string;
  foundryBody: string;
  foundryApproach: string;
  peakH1: string;
  cardDcfKicker: string;
  cardDcfLine: string;
  cardRocoKicker: string;
  cardRocoLine: string;
  cardMetaCov: string;
  cardMetaDate: string;
  cardLink: string;
  peakNote: string;
  notesH2: string;
  notesBody: string;
  notesLink: string;
  archiveH2: string;
  archiveBody: string;
  archiveLink: string;
  obsH2: string;
  obsBody: string;
  obsLink: string;
  finaleRole: string;
  finaleH1: ReactNode;
  finaleTally: string;
  footSite: string;
  ledgerLines: { idx: string; text: string; close?: boolean }[];
};

function flightCopy(locale: CstdLocale): FlightCopy {
  const zh = locale === "zh";
  return {
    mailto: "mailto:cstd@custard.top?subject=" + encodeURIComponent("CSTD 协作 / Collaboration"),
    cta: zh ? "谈一次协作" : "Start a collaboration",
    navAria: zh ? "首页直达" : "Homepage shortcuts",
    railHead: zh ? "城市电网" : "CITY GRID",
    ledgerTitle: zh ? "并网台账" : "GRID LEDGER",
    ledgerEn: "GRID LEDGER",
    ledgerHint: zh ? "飞越各区，验收数据在此并网" : "Districts energize the ledger as you fly",
    role: zh ? "研究工程师 · 化工训练 → 软件系统 · 人工智能博 0" : "Research engineer · ChemE → software · AI PhD Year 0",
    heroH1: zh ? (
      <>把代码、研究与交付证据，<br />建成一座工程城市。</>
    ) : (
      <>Code, research, and delivery evidence,<br />built into one engineering city.</>
    ),
    heroSub: zh ? "欢迎飞越我建造的这座城。滚动就是你的飞行摇杆。" : "Welcome aboard the city I built. Scroll is your flight stick.",
    gateH2: zh ? "先画边界，再做衡算。" : "Draw the boundary, then balance the system.",
    gateBody: zh
      ? "化工训练教我三件事：任何系统先问谁负责，再算吞吐与瓶颈，并且把每一次实验的条件记下来。后来，我把这套习惯原样带进了数据、权限、状态与发布。"
      : "Chemical engineering taught me three things: ask who owns a system before balancing it, measure throughput and bottlenecks before optimizing, and record the conditions of every experiment. I brought those habits straight into data, permissions, state, and releases.",
    methodH2: zh ? "三条方法，并网运行。" : "Three methods, grid-tied.",
    method: zh
      ? [
          { term: "边界", desc: "谁负责，走哪条路，出了错能走回去" },
          { term: "衡算", desc: "吞吐、延迟、瓶颈，先测量再优化" },
          { term: "实验记录", desc: "条件、误差、异常，全部写进交付物" },
        ]
      : [
          { term: "Boundary", desc: "who owns it, which path, a route back when it fails" },
          { term: "Balance", desc: "throughput, latency, bottleneck: measure first" },
          { term: "Lab record", desc: "conditions, error, anomalies, shipped with the work" },
        ],
    foundryH2: zh ? "每个结论都要携带来路。" : "Every conclusion carries its lineage.",
    foundryBody: zh
      ? "数据口径、运行清单、可复现测试。数据没有版本，结论就不可能被审计。"
      : "Data definitions, run manifests, reproducible tests. Without versioned data, no conclusion can be audited.",
    foundryApproach: zh ? "正在接近核心" : "APPROACHING THE CORE",
    peakH1: zh ? "穹顶之下，七项交付全部在网。" : "Under the dome, all seven deliveries are on the grid.",
    cardDcfKicker: zh ? "确定性金融计算 / 本地软件" : "Deterministic finance / local software",
    cardDcfLine: zh
      ? "三情景估值从黑盒答案，变成可复算、可追踪、可安装的研究工具。"
      : "Three-scenario valuation turned from a black box into a reproducible, traceable, installable research tool.",
    cardRocoKicker: zh ? "双站点平台 / OpenNext" : "Dual-site platform / OpenNext",
    cardRocoLine: zh
      ? "你正在飞越的这座城，就部署在它与图鉴共享的同一个 Cloudflare Worker 上。"
      : "The city you are flying over is deployed on the same Cloudflare Worker it shares with the encyclopedia.",
    cardMetaCov: zh ? "覆盖" : "coverage",
    cardMetaDate: zh ? "验收" : "verified",
    cardLink: zh ? "查看案例" : "View case",
    peakNote: zh
      ? "其余五项已并入左下台账。点击右侧电网任意节点，可以回访任何一座区。"
      : "The other five are in the ledger, bottom-left. Any grid node on the right flies you back to its district.",
    notesH2: zh ? "笔记即城市的织线。" : "Notes are the loom of the city.",
    notesBody: zh
      ? "从确定性内核、可观测管线，到一次部署里的宿主边界，八篇长文把方法写成能翻回去的档案。"
      : "From deterministic cores and observable pipelines to host boundaries in one deployment: eight long-form notes turn method into an archive you can flip back through.",
    notesLink: zh ? "进入笔记" : "Read the notes",
    archiveH2: zh ? "时间线：从课程到系统。" : "Timeline: from coursework to systems.",
    archiveBody: zh
      ? "课程、实验、发布与复盘，每一段迁移都收进长廊。这座城不是一次建成的，它是逐格并网成的。"
      : "Courses, experiments, releases, and retrospectives all live in this corridor. The city was not built in one pass; it was tied in, district by district.",
    archiveLink: zh ? "看时间线" : "See the timeline",
    obsH2: zh ? "观测台：能力在图上展开。" : "Observatory: capability, mapped.",
    obsBody: zh
      ? "数据系统、研究模型、产品表面、边缘运行与 AI 创作，构成这座城的全部机组。"
      : "Data systems, research models, product surfaces, edge operations, and AI creation make up the full plant of this city.",
    obsLink: zh ? "打开星图" : "Open the map",
    finaleRole: zh ? "工作站 · 灯亮着" : "Workstation · lights on",
    finaleH1: zh ? (
      <>这座城建好了，<br />下一步和你一起造。</>
    ) : (
      <>The city is built.<br />Let's build the next one together.</>
    ),
    finaleTally: zh ? "台账已结清 · 7 作品 · 31 份证据 · 7/7 verified" : "Ledger settled · 7 works · 31 artifacts · 7/7 verified",
    footSite: "CUSTARD · custard.top",
    ledgerLines: zh
      ? [
          { idx: "00", text: "启程 · 城市上线" },
          { idx: "01", text: "身份并网 · 化工 → 软件系统" },
          { idx: "02", text: "方法并网 · 3 条原则" },
          { idx: "03", text: "口径并网 · 7 项目 / 31 证据" },
          { idx: "05", text: "笔记并网 · 8 篇长文" },
          { idx: "06", text: "档案并网 · 双站点同部署" },
          { idx: "07", text: "观测并网 · 能力面上线" },
          { idx: "08", text: "结清 · 7 作品 · 31 证据 · 7/7 verified", close: true },
        ]
      : [
          { idx: "00", text: "Departure · city online" },
          { idx: "01", text: "Identity tied-in · ChemE → software" },
          { idx: "02", text: "Method tied-in · 3 principles" },
          { idx: "03", text: "Acceptance spec · 7 projects / 31 artifacts" },
          { idx: "05", text: "Notes tied-in · 8 long-form" },
          { idx: "06", text: "Archive tied-in · dual-site deploy" },
          { idx: "07", text: "Observatory tied-in · capability map online" },
          { idx: "08", text: "Settled · 7 works · 31 artifacts · 7/7 verified", close: true },
        ],
  };
}

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: HTMLElement | Document) => {
        destroy: () => void;
        clips: unknown[];
      };
    };
    __sc?: unknown;
  }
}

export function CstdFlightHomepage({ locale = "zh" }: { locale?: CstdLocale }) {
  const copy = useMemo(() => flightCopy(locale), [locale]);
  const flightRef = useRef<HTMLDivElement>(null);
  const railLegsRef = useRef<HTMLOListElement>(null);
  const railPctRef = useRef<HTMLParagraphElement>(null);
  const railHeadRef = useRef<HTMLParagraphElement>(null);
  const ledgerLinesRef = useRef<HTMLOListElement>(null);
  const ledgerHintRef = useRef<HTMLParagraphElement>(null);
  const ledgerRef = useRef<HTMLElement>(null);
  const scrimPeakRef = useRef<HTMLDivElement>(null);
  const scrimLeftRef = useRef<HTMLDivElement>(null);
  const scrimRightRef = useRef<HTMLDivElement>(null);

  const scrollToLeg = useCallback(
    (index: number, fraction = 0.16) => {
      const flight = flightRef.current;
      if (!flight) return;
      const top = flight.getBoundingClientRect().top + (window.scrollY || 0);
      const y = top + (legStart(index) + fraction * LEGS[index].w) * window.innerHeight;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    },
    [],
  );

  const scrollToTrack = useCallback((trackVh: number) => {
    const flight = flightRef.current;
    if (!flight) return;
    const top = flight.getBoundingClientRect().top + (window.scrollY || 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + trackVh * window.innerHeight, behavior: reduce ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const flight = flightRef.current;
    const railLegs = railLegsRef.current;
    const railPct = railPctRef.current;
    const railHead = railHeadRef.current;
    const ledgerLines = ledgerLinesRef.current;
    const ledgerHint = ledgerHintRef.current;
    const ledger = ledgerRef.current;
    if (!flight || !railLegs || !railPct || !railHead || !ledgerLines || !ledgerHint || !ledger) return;

    let destroyed = false;
    let api: { destroy: () => void } | null = null;
    const cleanups: (() => void)[] = [];

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- 电网 rail 节点 ---- */
    const items = Array.from(railLegs.querySelectorAll<HTMLLIElement>(".grid-rail__leg"));
    const fill = document.createElement("div");
    fill.className = "grid-rail__fill";
    railLegs.appendChild(fill);
    const tip = document.createElement("div");
    tip.className = "grid-rail__tip";
    railLegs.appendChild(tip);
    items.forEach((li, i) => {
      const btn = li.querySelector("button");
      if (!btn) return;
      const onJump = () => scrollToLeg(i);
      btn.addEventListener("click", onJump);
      cleanups.push(() => btn.removeEventListener("click", onJump));
    });
    cleanups.push(() => {
      fill.remove();
      tip.remove();
    });

    /* ---- 台账（真实数据） ---- */
    const stamped = new Set<string>();
    const totalLines = 8 + PROJECTS.length;
    const stampLine = (id: string, html: string, close: boolean, delay: number) => {
      if (stamped.has(id) || destroyed) return;
      stamped.add(id);
      const li = document.createElement("li");
      li.className = "ledger__line" + (close ? " is-close" : "");
      li.innerHTML = html;
      if (!reduce && delay) li.style.animationDelay = `${delay}ms`;
      ledgerLines.appendChild(li);
      ledgerLines.scrollTop = ledgerLines.scrollHeight;
      ledgerHint.textContent = `${copy.ledgerHint.split("·")[0].trim()} · ${stamped.size} / ${totalLines}`;
    };
    const stampDistrict = (i: number) => {
      const label = LEGS[i].label[locale];
      const district = copy.ledgerLines.find((line, di) => {
        const order = [0, 1, 2, 3, -1, 4, 5, 6, 7];
        return order[i] === di;
      });
      if (i === 4) {
        PROJECTS.forEach((p, k) => {
          stampLine(
            `p${k}`,
            `<span class="ledger__idx">04</span><b>${p.name[locale]}</b><span>${copy.cardMetaCov} ${p.cov} · ${p.arts} · ${p.date}</span><span class="ledger__ok">verified</span>`,
            false,
            k * 90,
          );
        });
        return;
      }
      if (!district) return;
      stampLine(
        `d${i}`,
        `<span class="ledger__idx">${district.idx}</span><b>${label}</b><span>${district.text.replace(`${label} · `, "").replace(label, "")}</span>${district.close ? '<span class="ledger__ok">verified</span>' : ""}`,
        !!district.close,
        0,
      );
    };

    /* ---- 遮罩窗口（与文案窗口同律） ---- */
    const WIN_PEAK: [number, number, number, number][] = [
      [0.316, 0.39, 0.18, 0.38],
      [0.424, 0.578, 0.19, 0.24],
      [0.9376, 1.0, 0.5, 0],
    ];
    const WIN_LEFT: [number, number, number, number][] = [
      [0.0, 0.0646, 0, 0.65],
      [0.212, 0.3, 0.18, 0.2],
      [0.706, 0.774, 0.18, 0.2],
    ];
    const WIN_RIGHT: [number, number, number, number][] = [
      [0.116, 0.198, 0.18, 0.2],
      [0.602, 0.668, 0.18, 0.2],
      [0.812, 0.878, 0.18, 0.2],
    ];
    const ramp = (pr: number, from: number, to: number, rIn: number, rOut: number) => {
      const win = Math.max(to - from, 0.001);
      const inEnd = from + win * rIn;
      const outStart = to - win * rOut;
      const smooth = (x: number) => {
        const c = x < 0 ? 0 : x > 1 ? 1 : x;
        return c * c * (3 - 2 * c);
      };
      if (pr < from) return 0;
      if (pr < inEnd) return smooth((pr - from) / Math.max(inEnd - from, 0.001));
      if (pr <= outStart) return 1;
      return smooth(1 - (pr - outStart) / Math.max(to - outStart, 0.001));
    };
    const windowsOpacity = (wins: [number, number, number, number][], pr: number) =>
      wins.reduce((m, w) => Math.max(m, ramp(pr, w[0], w[1], w[2], w[3])), 0);

    /* ---- 每帧读取 ---- */
    let queued = false;
    let lastSeg = -1;
    let flightTop = flight.getBoundingClientRect().top + (window.scrollY || 0);
    const frame = () => {
      queued = false;
      const vh = window.innerHeight;
      const y = window.scrollY || 0;
      const t = Math.min(Math.max((y - flightTop) / Math.max(vh, 1), 0), TOTAL_TRACK);
      const pr = t / TOTAL_TRACK;

      fill.style.height = `${(pr * 100).toFixed(2)}%`;
      tip.style.top = `calc(0.55rem + ${pr.toFixed(4)} * (100% - 1.1rem))`;
      tip.style.opacity = pr > 0.001 && pr < 0.999 ? "1" : "0";
      railPct.textContent = `${Math.round(pr * 100)}%`;

      let current = 0;
      for (let i = 0; i < LEGS.length; i += 1) if (t >= legStart(i)) current = i;
      if (current !== lastSeg) {
        lastSeg = current;
        items.forEach((li, k) => {
          li.classList.toggle("is-current", k === current);
          li.classList.toggle(
            "is-passed",
            k < current || (k === current && t > legStart(k) + 0.15 * LEGS[k].w),
          );
        });
        railHead.innerHTML = `${LEGS[current].label[locale]}<br><span>${current + 1} / ${LEGS.length} · ${copy.railHead}</span>`;
        ledger.classList.toggle("is-peak", current === 4);
      }

      if (scrimPeakRef.current) scrimPeakRef.current.style.opacity = windowsOpacity(WIN_PEAK, pr).toFixed(3);
      if (scrimLeftRef.current) scrimLeftRef.current.style.opacity = windowsOpacity(WIN_LEFT, pr).toFixed(3);
      if (scrimRightRef.current) scrimRightRef.current.style.opacity = windowsOpacity(WIN_RIGHT, pr).toFixed(3);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
    const onResize = () => {
      flightTop = flight.getBoundingClientRect().top + (window.scrollY || 0);
      onScroll();
    };
    window.addEventListener("resize", onResize, { passive: true });
    cleanups.push(() => window.removeEventListener("resize", onResize));

    /* ---- waypoint：飞越某区即并网（含落地/回滚补齐） ---- */
    const onWaypoint = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      for (let i = 0; i <= detail.index; i += 1) stampDistrict(i);
    };
    flight.addEventListener("sc:waypoint", onWaypoint);
    cleanups.push(() => flight.removeEventListener("sc:waypoint", onWaypoint));

    /* ---- 键盘：聚焦不可见文案块内的链接时滚到可读位置 ---- */
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      const block = target?.closest?.("[data-sc-copy]") as HTMLElement | null;
      if (!block || !flight.contains(block)) return;
      if (parseFloat(getComputedStyle(block).opacity || "1") > 0.6) return;
      const raw = (block.getAttribute("data-sc-window") || "").trim();
      let pr: number;
      if (raw === "hero") pr = 0.02;
      else if (raw === "finale") pr = 0.985;
      else {
        const spec = raw.split(/\s+/).map(Number);
        pr = Number.isNaN(spec[0]) ? 0.02 : (spec[0] + (Number.isNaN(spec[1]) ? spec[0] : spec[1])) / 2;
      }
      flightTop = flight.getBoundingClientRect().top + (window.scrollY || 0);
      window.scrollTo({
        top: Math.max(0, flightTop + pr * TOTAL_TRACK * window.innerHeight - window.innerHeight * 0.35),
        behavior: reduce ? "auto" : "smooth",
      });
    };
    document.addEventListener("focusin", onFocusIn);
    cleanups.push(() => document.removeEventListener("focusin", onFocusIn));

    /* ---- 装载引擎（scrollcraft.js 不改动）；游戏主题激活时卸载，回默认时重挂 ---- */
    const isFlightTheme = () => {
      const attr = document.documentElement.getAttribute("data-cstd-theme");
      return attr === null || attr === "atelier";
    };
    let booted = false;
    let engineLoaded = Boolean(window.ScrollCraft);
    const boot = () => {
      if (destroyed || booted || !engineLoaded || !isFlightTheme()) return;
      booted = true;
      api = window.ScrollCraft!.mount(document.body);
      (window as { __sc?: unknown }).__sc = api;
      frame();
    };
    const relayout = () => window.dispatchEvent(new Event("resize"));
    window.addEventListener("load", relayout);
    cleanups.push(() => window.removeEventListener("load", relayout));
    if (document.fonts?.ready) document.fonts.ready.then(relayout);
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
      script.src = "/cstd-flight/scrollcraft.js";
      script.async = true;
      script.addEventListener("load", () => {
        engineLoaded = true;
        boot();
      });
      document.head.appendChild(script);
      cleanups.push(() => script.remove());
    }
    const themeObserver = new MutationObserver(() => (isFlightTheme() ? boot() : unboot()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-cstd-theme"] });
    cleanups.push(() => themeObserver.disconnect());
    boot();

    return () => {
      destroyed = true;
      try {
        api?.destroy();
      } catch {
        /* teardown after detatch is idempotent */
      }
      if ((window as { __sc?: unknown }).__sc === api) (window as { __sc?: unknown }).__sc = undefined;
      while (cleanups.length) cleanups.pop()!();
    };
  }, [copy, locale, scrimLeftRef, scrimPeakRef, scrimRightRef, scrollToLeg]);

  const mailto = copy.mailto;
  const navLinks = [
    { href: getLocalizedCstdHref("/work", locale), label: locale === "zh" ? "作品" : "Work" },
    { href: getLocalizedCstdHref("/notes", locale), label: locale === "zh" ? "笔记" : "Notes" },
    { href: getLocalizedCstdHref("/map", locale), label: locale === "zh" ? "星图" : "Map" },
  ];

  return (
    <div data-cstd-home-flight className="flight">
      {/* 字体自托管于 /cstd-flight/fonts（见 cstd-flight.css 的 @font-face），不引入第三方域 */}
      <link rel="stylesheet" precedence="sc-engine" href="/cstd-flight/scrollcraft.css" />
      <link rel="stylesheet" precedence="sc-page" href="/cstd-flight/cstd-flight.css" />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: NOSCOPE_FALLBACK_CSS }} />
      </noscript>

      {/* 顶部栏：品牌 + 直达 + 主题/语言切换 + 唯一 CTA */}
      <header className="fx-bar">
        <a className="fx-bar__mark" href="#top" onClick={(e) => { e.preventDefault(); scrollToTrack(0); }}>
          CUSTARD<span className="fx-bar__dot" aria-hidden="true" />
          <span className="fx-bar__host">custard.top</span>
        </a>
        <nav aria-label={copy.navAria} className="fx-bar__nav">
          {navLinks.map((link) => (
            <CstdLink key={link.href} href={link.href} className="fx-bar__link">
              {link.label}
            </CstdLink>
          ))}
        </nav>
        <div className="fx-bar__tools">
          <ThemeSwitcher locale={locale} />
          <CstdLanguageSwitcher locale={locale} compact />
          <a className="fx-bar__cta" href={mailto}>{copy.cta}</a>
        </div>
      </header>

      {/* 签名动作：城市电网（连续世界语法的 map 导航） */}
      <nav className="grid-rail" aria-label={copy.navAria}>
        <p className="grid-rail__head" ref={railHeadRef}>
          {copy.railHead}
          <br />
          <span>CITY GRID</span>
        </p>
        <ol className="grid-rail__legs" ref={railLegsRef}>
          {LEGS.map((leg, i) => (
            <li key={leg.n} className="grid-rail__leg">
              <button type="button" data-label={leg.label[locale]} aria-label={`${leg.label[locale]} · ${i + 1}/${LEGS.length}`}>
                <span>{leg.label[locale]}</span>
                <i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <p className="grid-rail__pct" ref={railPctRef}>0%</p>
      </nav>

      {/* 签名动作：并网台账 */}
      <aside className="ledger" ref={ledgerRef} aria-live="off">
        <header className="ledger__head">
          <span className="ledger__live" aria-hidden="true" />
          <h2>
            {copy.ledgerTitle} <span className="ledger__en">{copy.ledgerEn}</span>
          </h2>
        </header>
        <ol className="ledger__lines" ref={ledgerLinesRef} />
        <p className="ledger__hint" ref={ledgerHintRef}>{copy.ledgerHint}</p>
      </aside>

      <div
        ref={flightRef}
        data-sc-mode="worldflight"
        data-sc-seam="0.16"
        data-sc-lerp="0.12"
        id="top"
      >
        <div data-sc-world aria-hidden="true">
          {LEGS.map((leg) => (
            <div
              key={leg.n}
              data-sc-segment
              data-sc-w={leg.w}
              data-sc-linger={leg.linger}
              data-sc-waypoint={leg.label[locale]}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 引擎海报：固定舞台内的帧保持器 */}
              <img className="sc-world__poster" src={`${ASSET}/p${leg.n}.webp`} alt="" decoding="async" />
              {/* eslint-disable-next-line jsx-a11y-x/media-has-caption -- 无声擦洗媒体（encode 已剥轨），世界层整体 aria-hidden */}
              <video data-sc-src={`${ASSET}/leg${leg.n}.mp4`} data-sc-src-mobile={`${ASSET}/leg${leg.n}-m.mp4`} />
            </div>
          ))}
        </div>

        <div data-sc-world-copy>
          <div className="fx-scrim fx-scrim--band sc-world__scrim" aria-hidden="true" />
          <div className="fx-scrim fx-scrim--peak" ref={scrimPeakRef} aria-hidden="true" />
          <div className="fx-scrim fx-scrim--left" ref={scrimLeftRef} aria-hidden="true" />
          <div className="fx-scrim fx-scrim--right" ref={scrimRightRef} aria-hidden="true" />

          <div className="fx-copy fx-copy--hero" data-sc-copy data-sc-window="hero">
            <div className="fx-anchor">
              <p className="fx-role">{copy.role}</p>
              <h1 className="fx-h1">{copy.heroH1}</h1>
              <p className="fx-sub">{copy.heroSub}</p>
            </div>
          </div>

          <div className="fx-copy fx-copy--trail" data-sc-copy data-sc-window="0.116 0.198 0.18 0.2">
            <div className="fx-anchor">
              <h2 className="fx-h2">{copy.gateH2}</h2>
              <p className="fx-body">{copy.gateBody}</p>
            </div>
          </div>

          <div className="fx-copy fx-copy--lead" data-sc-copy data-sc-window="0.212 0.300 0.18 0.2">
            <div className="fx-anchor">
              <h2 className="fx-h2">{copy.methodH2}</h2>
              <ul className="fx-list">
                {copy.method.map((item) => (
                  <li key={item.term}>
                    <b>{item.term}</b>
                    <span>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fx-copy fx-copy--center" data-sc-copy data-sc-window="0.316 0.390 0.18 0.38">
            <div className="fx-anchor">
              <h2 className="fx-h2">{copy.foundryH2}</h2>
              <p className="fx-body fx-body--centered">{copy.foundryBody}</p>
              <p className="fx-approach">{copy.foundryApproach}</p>
            </div>
          </div>

          <div className="fx-copy fx-copy--center fx-copy--peakhead" data-sc-copy data-sc-window="0.424 0.498 0.18 0.25">
            <div className="fx-anchor">
              <h2 className="fx-h1">{copy.peakH1}</h2>
            </div>
          </div>

          <div className="fx-copy fx-copy--center fx-copy--cards" data-sc-copy data-sc-window="0.472 0.578 0.2 0.22">
            <div className="fx-anchor">
              <div className="fx-cardwrap">
                <div className="fx-card">
                  <p className="fx-card__kicker">{copy.cardDcfKicker}</p>
                  <h3 className="fx-card__name">DCF Quantum</h3>
                  <p className="fx-card__line">{copy.cardDcfLine}</p>
                  <p className="fx-card__meta">
                    {copy.cardMetaCov} 80 · 4 · 2026-08-09 {copy.cardMetaDate}
                  </p>
                  <CstdLink className="fx-card__link" href={getLocalizedCstdHref("/work/dcf-quantum", locale)}>
                    {copy.cardLink}
                  </CstdLink>
                </div>
                <div className="fx-card">
                  <p className="fx-card__kicker">{copy.cardRocoKicker}</p>
                  <h3 className="fx-card__name">{PROJECTS[0].name[locale]}</h3>
                  <p className="fx-card__line">{copy.cardRocoLine}</p>
                  <p className="fx-card__meta">
                    {copy.cardMetaCov} 100 · 7 · 2026-08-09 {copy.cardMetaDate}
                  </p>
                  <CstdLink className="fx-card__link" href={getLocalizedCstdHref("/work/rocodex-platform", locale)}>
                    {copy.cardLink}
                  </CstdLink>
                </div>
              </div>
            </div>
          </div>

          <div className="fx-copy fx-copy--center fx-copy--peaknote" data-sc-copy data-sc-window="0.532 0.586 0.25 0.3">
            <div className="fx-anchor">
              <p className="fx-small">{copy.peakNote}</p>
            </div>
          </div>

          <div className="fx-copy fx-copy--trail" data-sc-copy data-sc-window="0.602 0.668 0.18 0.2">
            <div className="fx-anchor">
              <h2 className="fx-h2">{copy.notesH2}</h2>
              <p className="fx-body">{copy.notesBody}</p>
              <CstdLink className="fx-inline-link" href={getLocalizedCstdHref("/notes", locale)}>
                {copy.notesLink}
              </CstdLink>
            </div>
          </div>

          <div className="fx-copy fx-copy--lead" data-sc-copy data-sc-window="0.706 0.774 0.18 0.2">
            <div className="fx-anchor">
              <h2 className="fx-h2">{copy.archiveH2}</h2>
              <p className="fx-body">{copy.archiveBody}</p>
              <CstdLink className="fx-inline-link" href={getLocalizedCstdHref("/resume", locale)}>
                {copy.archiveLink}
              </CstdLink>
            </div>
          </div>

          <div className="fx-copy fx-copy--trail" data-sc-copy data-sc-window="0.812 0.878 0.18 0.2">
            <div className="fx-anchor">
              <h2 className="fx-h2">{copy.obsH2}</h2>
              <p className="fx-body">{copy.obsBody}</p>
              <CstdLink className="fx-inline-link" href={getLocalizedCstdHref("/map", locale)}>
                {copy.obsLink}
              </CstdLink>
            </div>
          </div>

          <div className="fx-copy fx-copy--center fx-copy--finale" data-sc-copy data-sc-window="finale">
            <div className="fx-anchor">
              <p className="fx-role">{copy.finaleRole}</p>
              <h2 className="fx-h1">{copy.finaleH1}</h2>
              <a className="fx-cta" href={mailto}>{copy.cta}</a>
              <p className="fx-tally">{copy.finaleTally}</p>
              <footer className="fx-foot">
                <span>{copy.footSite}</span>
                <a href="https://github.com/Muguett-DBY">GitHub · Muguett-DBY</a>
                <a href="https://rocodex.custard.top">rocodex.custard.top</a>
              </footer>
            </div>
          </div>
        </div>

        <div data-sc-spacer aria-hidden="true" />
      </div>
    </div>
  );
}
