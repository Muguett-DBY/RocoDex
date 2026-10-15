/* ============================================================================
   editorial-motion — 默认正式主页的单一 GSAP 动效编排模块
   ----------------------------------------------------------------------------
   页面全部滚动/入场/计数/揭示/pin 动效的唯一住所。由组件 useEffect 动态
   import 装载：gsap 与编排代码同入异步 chunk，不进首屏 entry。

   结构契约（违反任何一条即为回归）：
   · 初始 DOM 即终态——隐藏态只由 JS（from/fromTo 的起始值）设置；无 JS、
     chunk 装载失败或 prefers-reduced-motion 下内容完整可读。
   · prefers-reduced-motion: reduce → 零注册（gsap.matchMedia 整组不挂），
     系统切换时 GSAP 自动 revert 并在恢复时重建。
   · 动效只用 transform/opacity/clip-path；零视频、零滚动劫持（原生滚动）。
   · 全部 ScrollTrigger 按 DOM 顺序自上而下创建，pin 最先建；章 flow 时间线
     挂 refreshPriority:-1（全局 refresh 按 _sortY 排序且先 revert 全部 pin，
     不压后会把含 pin 的章量短一个 pin 行程）。
   · 章 flow 时间线与退役引擎的 flow p 数学恒等：引擎 p =
     clamp01((y+vh−top)/(height+vh))（scrollcraft.js read()），与
     start:'top bottom'/end:'bottom top' 的 ScrollTrigger progress 同式。
     但引擎的章高不含 GSAP pin spacer（其 layout 先于 pin 创建），spacer 计入
     后章 p 的后段窗口会平移出 pin 行程——所以数据章的 147 万计数与图版揭示
     不用旧窗口常数，改挂 .data-spread 自己的 pin 行程（结构保证在屏可见）；
     章头早期窗口（普查计数/行线/落墨/漂移/金线）远离 pin 段，照旧移植。
   · 主题互斥：html[data-cstd-theme] 非 atelier → 全部触发器挂起（disable，
     spacer 保留）；返回 → enable + refresh 重量算。
   ========================================================================== */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import type { CstdLocale } from "../../content/content-types";

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* 引擎时代 --sc-ease-out 的精确复刻（cubic-bezier(0.23,1,0.32,1)）：入场与
   状态过渡共用，视觉节奏与已验收基准一致 */
const EASE_OUT = CustomEase.create("ed-out", "0.23,1,0.32,1");
/* 引擎计数/揭示窗的 smoothstep（scrollcraft.js smooth()）：t*t*(3-2t) */
const SMOOTHSTEP = (t: number) => t * t * (3 - 2 * t);

/* 引擎 formatNum 语义：模板驱动小数位与千分位（"1,470,000" 模板带逗号） */
function formatNum(value: number, template: string): string {
  const dot = template.indexOf(".");
  const decimals = dot > -1 ? template.length - dot - 1 : 0;
  let out = value.toFixed(decimals);
  if (/,/.test(template) || Math.abs(value) >= 10_000) {
    const bits = out.split(".");
    bits[0] = bits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    out = bits.join(".");
  }
  return out;
}

/* 分字掩码：CJK 真逐字、拉丁逐词；掩码整体 aria-hidden，原文进 aria-label
   （读屏完整性——视觉分字不得破碎语义）。同一元素只切一次。 */
function splitIntoMasks(el: HTMLElement, unit: "char" | "word") {
  if (el.dataset.edSplit) return;
  el.dataset.edSplit = "1";
  const fullText = (el.textContent ?? "").trim();
  const fragment = document.createDocumentFragment();
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const units =
        unit === "char"
          ? text.match(/[\u4e00-\u9fff\u3400-\u4dbf]|[\u3000-\u303f\uff00-\uffef]+|[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*|\s+|[^\s]/g) ?? [text]
          : text.split(/(\s+)/);
      for (const piece of units) {
        if (!piece) continue;
        if (!piece.trim()) {
          fragment.appendChild(document.createTextNode(piece));
          continue;
        }
        const mask = document.createElement("span");
        mask.className = "ed-word";
        mask.setAttribute("aria-hidden", "true");
        const inner = document.createElement("span");
        inner.className = "ed-word__in";
        inner.textContent = piece;
        mask.appendChild(inner);
        fragment.appendChild(mask);
      }
    } else {
      const clone = node.cloneNode(true);
      if (clone instanceof HTMLElement) clone.setAttribute("aria-hidden", "true");
      fragment.appendChild(clone);
    }
  });
  el.textContent = "";
  el.appendChild(fragment);
  el.setAttribute("aria-label", fullText);
}

/* 计数设备：data-ed-count="0 1,470,000" + data-ed-count-at="0.1 0.8"（窗口
   取宿主时间线的相对进度）。代理对象按 smoothstep 插值，onUpdate 写
   textContent（中间值对读屏隐藏由 aria-hidden 承担，sr-only 终值常驻标记）。 */
function attachCounters(scope: ParentNode, tl: gsap.core.Timeline, filter?: (el: HTMLElement) => boolean) {
  scope.querySelectorAll<HTMLElement>("[data-ed-count]").forEach((el) => {
    if (filter && !filter(el)) return;
    const spec = (el.getAttribute("data-ed-count") || "").trim().split(/\s+/);
    const num = (token: string) => parseFloat(String(token).replace(/,/g, "")) || 0;
    const from = num(spec[0] || "0");
    const template = spec[1] || "0";
    const target = num(template);
    const at = (el.getAttribute("data-ed-count-at") || "0.1 0.55").trim().split(/\s+/).map(parseFloat);
    const startAt = Number.isFinite(at[0]) ? Math.max(0, at[0]) : 0.1;
    const endAt = Number.isFinite(at[1]) ? Math.min(1, Math.max(at[1], startAt + 0.001)) : 0.55;
    const proxy = { value: from };
    tl.fromTo(
      proxy,
      { value: from },
      {
        value: target,
        duration: endAt - startAt,
        ease: SMOOTHSTEP,
        onUpdate: () => {
          const out = formatNum(proxy.value, template);
          if (el.textContent !== out) el.textContent = out;
        },
      },
      startAt,
    );
  });
}

export function mountEditorialMotion(root: HTMLElement, locale: CstdLocale): () => void {
  let destroyed = false;
  let built = false;
  let fontsSettled = false;
  let context: gsap.Context | null = null;
  let matchMedia: gsap.MatchMedia | null = null;
  let themeObserver: MutationObserver | null = null;

  /* 绝不在 display:none 的树上建触发器：editorial 树被游戏主题互斥隐藏时，
     量算是全零的退化几何（pin 无行程、refresh 抛错）。构建只发生在
     editorial 主题下；游戏主题激活则挂起等待，主题观察器负责回来时再建
     或恢复（enable + refresh 重量算）。 */
  const isEditorial = () => {
    const attr = document.documentElement.getAttribute("data-cstd-theme");
    return attr === null || attr === "atelier";
  };
  const maybeBuild = () => {
    if (destroyed || built || !fontsSettled || !isEditorial()) return;
    build();
  };

  /* 分字掩码要量行盒，必须等真实字体就位（沿用引擎 layout 的时序约束） */
  const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  fontsReady.then(() => {
    fontsSettled = true;
    maybeBuild();
  });

  const onTheme = () => {
    if (isEditorial()) {
      if (built) ScrollTrigger.getAll().forEach((trigger) => {
        trigger.enable();
        trigger.refresh();
      });
      else maybeBuild();
    } else if (built) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false));
    }
  };
  themeObserver = new MutationObserver(onTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-cstd-theme"] });
  onTheme();

  function build() {
    if (built) return;
    built = true;
    context = gsap.context(() => {
      const chapters = Array.from(root.querySelectorAll<HTMLElement>(".chapter"));
      const folio = root.querySelector<HTMLElement>(".folio");

      matchMedia = gsap.matchMedia();
      matchMedia.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---- 扉页入场时间线（装载后一次性，非 scrub；不触碰 .ed-summary：
           LCP 元素 SSR 直出，全程不动） ---- */
        const h1 = root.querySelector<HTMLElement>(".ch-title h1");
        if (h1) {
          splitIntoMasks(h1, locale === "zh" ? "char" : "word");
          gsap.fromTo(
            h1.querySelectorAll(".ed-word__in"),
            { yPercent: 118 },
            { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: locale === "zh" ? 0.05 : 0.06, delay: 0.15 },
          );
        }
        const actions = root.querySelector<HTMLElement>(".ch-title .title-actions");
        if (actions) gsap.fromTo(actions, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", delay: 0.55 });
        const role = root.querySelector<HTMLElement>(".ch-title .title-role");
        if (role) gsap.fromTo(role, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", delay: 0.7 });
        const foot = root.querySelector<HTMLElement>(".ch-title .title-foot");
        if (foot) gsap.fromTo(foot, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power3.inOut", delay: 0.45 });

        /* 扉页题签块落位（原 data-ed-enter 页面 IO）：题签直接子元素逐个升落。
           actions/role 不在此列——它们由上面的入场时间线独占（双重驱动会在
           0.55–0.86s 窗口内互踩透明度）。 */
        const stack = root.querySelector<HTMLElement>(".ch-title .title-stack");
        if (stack) {
          const items = [h1, root.querySelector(".ch-title .ed-statement"), root.querySelector(".ch-title .ed-summary")].filter(
            (el): el is HTMLElement => el instanceof HTMLElement,
          );
          if (items.length) {
            gsap.from(items, {
              opacity: 0,
              y: 14,
              duration: 0.62,
              ease: EASE_OUT,
              stagger: 0.08,
              scrollTrigger: { trigger: stack, start: "top 95%", once: true },
            });
          }
        }

        /* ---- pin 先建：创建时序上，pin spacer 拉长文档后，其下各章的触发器
           （章题升幕/入场/flow）初始量算才含 spacer。全局 refresh 按
           _sortY（触发器文档位置）排序且先 revert 全部 pin——章 flow 的
           trigger（章顶）会排到自己章内 pin（更深的 _sortY）之前而量短，
           refreshPriority:-1 把 flow 压到全部 pin 之后量算（排序键为
           priority×−1e6＋sortY，−1 即排最后）。 ---- */
        const methodList = root.querySelector<HTMLElement>("#ch-method .method-list");
        if (methodList) {
          ScrollTrigger.create({ trigger: methodList, start: "top 14%", end: "+=105%", pin: true, pinType: "transform", anticipatePin: 1 });
        }
        const dataSpread = root.querySelector<HTMLElement>(".data-spread");
        if (dataSpread) {
          ScrollTrigger.create({ trigger: dataSpread, start: "top 12%", end: "+=95%", pin: true, pinType: "transform", anticipatePin: 1 });
          /* 数据时刻（147 万计数 + 图版揭示）挂 pin 自己的行程：与上面 pin 同
             trigger/start/end 的 scrub 时间线，progress ≡ pin 行程相对进度
             （0=pin 起步、1=pin 收尾）——元素被 pin 钉在屏上，动效必然可见，
             可见性是结构保证而非几何标定。计数窗 [0.1, 0.8]、揭示 [0.05, 0.7]。 */
          const dataAnchor = { done: 0 };
          const dataTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: dataSpread, start: "top 12%", end: "+=95%", scrub: true },
          });
          attachCounters(dataSpread, dataTl);
          const figure = dataSpread.querySelector<HTMLElement>(".data-figure");
          if (figure) {
            dataTl.fromTo(
              figure,
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: SMOOTHSTEP, immediateRender: true },
              0.05,
            );
          }
          dataTl.set(dataAnchor, { done: 1 }, 1);
        }

        chapters.forEach((chapter) => {
          /* 章题逐词升幕（scrub 可逆；CJK 按字、拉丁按词） */
          chapter.querySelectorAll<HTMLElement>("h2.ed-display-lg").forEach((h2) => {
            splitIntoMasks(h2, locale === "zh" ? "char" : "word");
            gsap.fromTo(
              h2.querySelectorAll(".ed-word__in"),
              { yPercent: 120 },
              {
                yPercent: 0,
                ease: "none",
                stagger: 0.04,
                scrollTrigger: { trigger: h2, start: "top 88%", end: "top 42%", scrub: 0.6 },
              },
            );
          });

          /* 章 flow 时间线：progress ≡ 退役引擎的 flow p（含 pin spacer 的章高）。
             时间线总时长锚定为 1，窗口值直接作 position/duration。 */
          const anchor = { done: 0 };
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: true, refreshPriority: -1 },
          });

          /* folio 页码轨：每章 u 细线 scaleY = 章 flow p（<1200px 视口 folio
             display:none，tween 空转为无害） */
          if (folio) {
            const bar = folio.querySelector<HTMLElement>(`[data-folio="${chapter.id}"] u`);
            if (bar) tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
          }

          if (chapter.classList.contains("ch-title")) {
            /* 扉页视差：rate −0.3 × (p−0.5) × 100px 的两端口径（±15px） */
            const lift = chapter.querySelector<HTMLElement>(".title-lift");
            if (lift) tl.fromTo(lift, { y: 15 }, { y: -15, duration: 1 }, 0);
            /* 扉页铜线滚动绘制：[0.50, 0.92] */
            const rule = chapter.querySelector<HTMLElement>(".title-foot .ed-rule");
            if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.42, transformOrigin: "0px 50%" }, 0.5);
          }

          if (chapter.classList.contains("ch-method")) {
            /* 方法行『落墨』：行线铜色 scaleX + 编号自下而上填充；
               三行窗前置于阅读位（读到即全墨） */
            const windows = [0.04, 0.2, 0.38];
            chapter.querySelectorAll<HTMLElement>(".method-list li").forEach((li, index) => {
              const w0 = windows[index];
              if (w0 === undefined) return;
              const rule = li.querySelector<HTMLElement>(".ed-rule");
              if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.16, transformOrigin: "0px 50%" }, w0);
              const no = li.querySelector<HTMLElement>(".method-no");
              if (no) tl.fromTo(no, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.16 }, w0);
            });
          }

          if (chapter.classList.contains("ch-work")) {
            /* 普查计数 7：章头早期在屏，[0.06, 0.26] 章 flow 窗口照旧。
               147 万大计数与图版揭示不在此线——挂 .data-spread 的 pin 行程
               （见 pin 块：pin 内相对进度，钉在屏上必然可见）。 */
            attachCounters(chapter, tl, (el) => !el.closest(".data-spread"));
            /* 图版视差：rate −0.4 × (p−0.5) × 100px（±20px），全章缓漂 */
            const inner = chapter.querySelector<HTMLElement>(".data-figure-inner");
            if (inner) tl.fromTo(inner, { y: 20 }, { y: -20, duration: 1 }, 0);
          }

          if (chapter.classList.contains("ch-notes")) {
            /* 札记行『入档』：行线铜色铺开 + 标题/摘要块 10px 落位 */
            const windows = [0.1, 0.26, 0.42];
            chapter.querySelectorAll<HTMLElement>(".note-list .note").forEach((note, index) => {
              const w0 = windows[index];
              if (w0 === undefined) return;
              const rule = note.querySelector<HTMLElement>(".ed-rule");
              if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.16, transformOrigin: "0px 50%" }, w0);
              const drift = note.querySelector<HTMLElement>("[data-ed-drift]");
              if (drift) tl.fromTo(drift, { x: 10 }, { x: 0, duration: 0.16 }, w0);
            });
          }

          if (chapter.classList.contains("ch-colophon")) {
            /* 墨色版牌页脚金线绘制：[0.30, 0.64] */
            const rule = chapter.querySelector<HTMLElement>(".colophon-foot .ed-rule");
            if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.34, transformOrigin: "0px 50%" }, 0.3);
          }

          tl.set(anchor, { done: 1 }, 1);
        });

        /* ---- 各章一次性入场（原引擎 IO：rootMargin −12% ≈ start 'top 88%'）----
           data-ed-in 的数值 = 同级子元素阶梯（毫秒），缺省整组单一入场 */
        root.querySelectorAll<HTMLElement>("[data-ed-in]").forEach((group) => {
          const staggerMs = parseFloat(group.getAttribute("data-ed-in") || "");
          const staggered = Number.isFinite(staggerMs) && staggerMs > 0;
          const targets: Element[] = staggered ? Array.from(group.children) : [group];
          if (!targets.length) return;
          gsap.from(targets, {
            opacity: 0,
            y: 14,
            duration: 0.62,
            ease: EASE_OUT,
            stagger: staggered ? staggerMs / 1000 : 0,
            scrollTrigger: { trigger: group, start: "top 88%", once: true },
          });
        });

        /* ---- 页边批注落位（签名动作）：正文块升起 + 内嵌铜线生长 ---- */
        root.querySelectorAll<HTMLElement>(".mnote").forEach((note) => {
          const rule = note.querySelector<HTMLElement>(".ed-rule");
          const tl = gsap.timeline({ scrollTrigger: { trigger: note, start: "top 94%", once: true } });
          tl.from(note, { opacity: 0, y: 10, duration: 0.62, ease: EASE_OUT });
          if (rule) tl.from(rule, { scaleY: 0, duration: 0.7, ease: EASE_OUT, transformOrigin: "50% 0%" }, 0.12);
        });

        /* ---- 版权页收束：整块随进入从微缩放落定 ---- */
        const colophonWrap = root.querySelector<HTMLElement>(".ch-colophon .ch-wrap");
        if (colophonWrap) {
          gsap.fromTo(
            colophonWrap,
            { scale: 0.985, autoAlpha: 0.92 },
            { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: ".ch-colophon", start: "top 90%", end: "top 30%", scrub: 0.6 } },
          );
        }
      });

      /* ---- folio 状态轨（非动效：减速下照常工作；class 切换无位移） ---- */
      if (folio) {
        chapters.forEach((chapter) => {
          ScrollTrigger.create({
            trigger: chapter,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => folio.querySelector(`[data-folio="${chapter.id}"]`)?.classList.toggle("is-active", self.isActive),
            onRefresh: (self) => folio.querySelector(`[data-folio="${chapter.id}"]`)?.classList.toggle("is-active", self.isActive),
          });
        });
        const colophon = root.querySelector<HTMLElement>("[data-colophon]");
        if (colophon) {
          /* 开墨态改为逐帧几何真值（对比度修复的收口，零 tween 改动）：
             之前的 ScrollTrigger 开墨窗在布局未定型时（pin 占位插入、图片/
             字体加载改变几何）可能用过期 start/end 误翻 is-dark，且此后无
             refresh 纠偏——冷载/快滚会留下"纸白字压纸面 1.0:1"的整列不可见。
             现在每帧用实时 rect 判定：版权页墨牌完整覆盖 folio 盒（顶缘被压过、
             底缘未离开）才开墨，几何变化即刻自纠，无需任何 settle 兜底。 */
          const setFolioDark = () => {
            const vh = window.innerHeight;
            const rect = colophon.getBoundingClientRect();
            /* 逐项开墨：每个章码按自己视口纵位下的实际衬底独立翻色——
               墨牌边界穿过 folio 盒的任何滚动位置都不再有色/底错配
               （nav 级 is-dark 保留，供整列暗态选择器与既有断言）。 */
            folio.classList.toggle("is-dark", rect.top <= vh / 2 && rect.bottom >= vh / 2);
            folio.querySelectorAll<HTMLElement>(".folio__item").forEach((item) => {
              const r = item.getBoundingClientRect();
              const cy = r.top + r.height / 2;
              const onPlate = rect.top <= cy && rect.bottom >= cy;
              if (item.classList.contains("is-dark") !== onPlate) item.classList.toggle("is-dark", onPlate);
            });
          };
          ScrollTrigger.create({
            trigger: document.documentElement,
            start: 0,
            end: "max",
            onUpdate: setFolioDark,
            onRefresh: setFolioDark,
          });
          setFolioDark();
        }
      }
    }, root);
  }

  return () => {
    destroyed = true;
    themeObserver?.disconnect();
    themeObserver = null;
    matchMedia?.revert();
    matchMedia = null;
    context?.revert();
    context = null;
  };
}
