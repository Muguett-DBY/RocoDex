/* regression-live — 线上验收员-1：https://custard.top 部署后回归探针。
   覆盖（ask 第 3 条）：
     A. zh 桌面：六章滚动编排——双 pin 存活、147 万计数在 pin 行程内走值、
        章题升幕（h2 逐词 yPercent 120→0，scrub 中段有值、落位归零）；
     B. en 桌面：双语（html lang / h1 文案 / 六章结构）；
     C. zh 移动 390×844：横向无溢出 + 六章 + pin 存活；
     D. 游戏主题抽查：切 neon-district，霓虹黄底深字元素实测（header 印记
        bg #f4d431 / 字 #050709），页内算 WCAG 比值；
     全程收集 console error / pageerror / 404（过滤口径与 e2e/support/browser.ts
     captureBrowserIssues 一致）。
   滚动几何（chapterY / pinTravel / pump）逐字取自 lab/refactor/final2/probe.mjs
   （视觉终审员-2 已核验的同一套标定）。
   端口纪律：仅访问远程 https://custard.top，不启动任何本地服务。
   运行（从 E:\DEV\RocoDex）：node lab/contrast/regression-live.mjs */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, "shots-live");
mkdirSync(SHOTS, { recursive: true });

const scrollTo = (page, top) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
const pump = async (page, frames = 12) => {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  }, frames);
};
const chapterY = async (page, selector, p) => page.evaluate(({ selector, p }) => {
  const el = document.querySelector(selector);
  const rect = el.getBoundingClientRect();
  const y = rect.top + scrollY + p * (rect.height + innerHeight) - innerHeight;
  return Math.max(0, Math.min(y, document.documentElement.scrollHeight));
}, { selector, p });
const pinTravel = async (page, progress) => page.evaluate((progress) => {
  const spread = document.querySelector(".data-spread");
  if (!spread) return null;
  const box = spread.closest(".pin-spacer") ?? spread;
  const pinStart = box.getBoundingClientRect().top + scrollY - innerHeight * 0.12;
  return Math.max(0, Math.min(pinStart + innerHeight * 0.95 * progress, document.documentElement.scrollHeight));
}, progress);

/* h2 逐词 yPercent：兼容 GSAP 的 translate(0px, N%) / translateY(N%) 两种内联写法；
   内联 transform 被清除视为 0（升幕落位）。
   注意：本 playwright-core 的 evaluate 不把"字符串形态的箭头函数"当函数调用
   （_debug-eval.mjs 实测 r1/r3=undefined），故此处必须传真函数。 */
const h2YPercent = (page, sel) => page.evaluate((sel) => {
  const h2 = document.querySelector(sel);
  if (!h2) return null;
  const words = [...h2.querySelectorAll(".ed-word__in")];
  const pct = (el) => {
    const t = el.style.transform || "";
    const m = /translate\(([^,()]*),\s*([-\d.]+)%\)/.exec(t) || /translateY\(([-\d.]+)%\)/.exec(t);
    return m ? (m[2] !== undefined ? parseFloat(m[2]) : parseFloat(m[1])) : 0;
  };
  return { count: words.length, ys: words.map((w) => +pct(w).toFixed(1)).slice(0, 10) };
}, sel);

const captureIssues = (page) => {
  const issues = [];
  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      const text = message.text();
      if (text.includes("GL Driver Message") && text.includes("GPU stall due to ReadPixels")) return;
      if (text.includes("You have Reduced Motion enabled on your device")) return;
      if (text.includes("/_next/static/css/app/layout.css") && text.includes("was preloaded using link preload but not used")) return;
      const source = message.location().url;
      issues.push(`console.${message.type()}: ${text}${source ? ` @ ${source}` : ""}`);
    }
  });
  page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) issues.push(`response: ${response.status()} ${response.url()}`);
  });
  return issues;
};

const report = { startedAt: new Date().toISOString(), url: "https://custard.top", sections: {} };
const browser = await chromium.launch();

/* ---------------- A. zh 桌面：六章滚动编排 ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "zh-CN" });
  const page = await ctx.newPage();
  const issues = captureIssues(page);
  await page.goto("https://custard.top/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1600);

  const structure = await page.evaluate(() => ({
    css: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href")),
    theme: document.documentElement.getAttribute("data-cstd-theme"),
    chapters: [...document.querySelectorAll("[data-cstd-home-editorial] .chapter")].map((s) => s.id),
    folioItems: document.querySelectorAll("[data-cstd-home-editorial] .folio__item").length,
    spacers: document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length,
    enhancementsReady: document.querySelector("[data-cstd-kinetic-world]")?.getAttribute("data-cstd-enhancements-ready"),
    h1: document.querySelector("h1")?.textContent?.replace(/\\s+/g, " ").trim() ?? null,
    htmlLang: document.documentElement.lang,
    countSpec: document.querySelector('.data-spread [data-ed-count="0 1,470,000"]')?.getAttribute("data-ed-count-at") ?? null,
  }));

  /* 计数：pin 行程 0.45（窗 [0.1,0.8] 中点 → 约 735,000）与 0.97（收尾 → 1,470,000） */
  const counter = {};
  for (const [label, progress] of [["mid", 0.45], ["end", 0.97]]) {
    const y = await pinTravel(page, progress);
    if (y == null) { counter[label] = { error: "no .data-spread" }; continue; }
    await scrollTo(page, y); await pump(page);
    const st = await page.evaluate(() => {
      const c = document.querySelector(".data-spread .ed-nums");
      const spread = document.querySelector(".data-spread");
      const box = spread?.closest(".pin-spacer") ?? spread;
      return { text: c?.textContent ?? null, pinned: !!spread?.closest(".pin-spacer"), boxTopViewport: box ? Math.round(box.getBoundingClientRect().top) : null };
    });
    counter[label] = { y: Math.round(y), ...st };
  }
  await page.screenshot({ path: join(SHOTS, "reg--zh-counter-mid.png") }).catch(() => {});

  /* 升幕：#ch-notes h2 —— 中段（h2 top≈65vh）应有词仍在幕下（yPercent>20）；
     落位（h2 top≈30vh，越过 end 42%）后全部归零 */
  const raise = {};
  const midY = await chapterY(page, "#ch-notes", 0.34);
  await scrollTo(page, midY); await pump(page);
  raise.mid = await h2YPercent(page, "#ch-notes h2.ed-display-lg");
  await page.screenshot({ path: join(SHOTS, "reg--zh-h2-mid.png") }).catch(() => {});
  /* 落位（h2 top 越过 end 42%）：取更晚的章行进位 p=0.55，scrub 0.6 有滞后需多泵帧 */
  const settleY = await chapterY(page, "#ch-notes", 0.55);
  await scrollTo(page, settleY); await pump(page, 24);
  await page.waitForTimeout(900);
  raise.settled = await h2YPercent(page, "#ch-notes h2.ed-display-lg");

  /* 扉页铜线（额外编排证据）：ch-title p=0.71 → scaleX≈0.5 */
  const yT = await chapterY(page, ".ch-title", 0.71);
  await scrollTo(page, yT); await pump(page);
  const titleRule = await page.evaluate(() => document.querySelector(".ch-title .title-foot .ed-rule")?.style.transform ?? "");

  /* 溢出（桌面） */
  const overflowDesktop = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));

  report.sections.zhDesktop = { structure, counter, raise, titleRule, overflowDesktop, issues };
  await ctx.close();
}

/* ---------------- B. en 桌面：双语 ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-AU" });
  const page = await ctx.newPage();
  const issues = captureIssues(page);
  await page.goto("https://custard.top/en", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1600);
  const en = await page.evaluate(() => ({
    htmlLang: document.documentElement.lang,
    h1: document.querySelector("h1")?.textContent?.replace(/\\s+/g, " ").trim() ?? null,
    chapters: [...document.querySelectorAll("[data-cstd-home-editorial] .chapter")].map((s) => s.id),
    spacers: document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length,
    methodH2: document.querySelector("#ch-method h2")?.textContent?.replace(/\\s+/g, " ").trim() ?? null,
  }));
  report.sections.enDesktop = { en, issues };
  await ctx.close();
}

/* ---------------- C. zh 移动 390：无溢出 + 结构 ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "zh-CN", deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const issues = captureIssues(page);
  await page.goto("https://custard.top/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1600);
  const mob = await page.evaluate(() => ({
    chapters: [...document.querySelectorAll("[data-cstd-home-editorial] .chapter")].map((s) => s.id),
    spacers: document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  /* 滚动到底再回顶，复查收尾态溢出 */
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await scrollTo(page, height); await pump(page); await page.waitForTimeout(500);
  await scrollTo(page, 0); await pump(page); await page.waitForTimeout(500);
  mob.scrollWidthAfterTraversal = await page.evaluate(() => document.documentElement.scrollWidth);
  report.sections.zhMobile = { mob, issues };
  await ctx.close();
}

/* ---------------- D. 游戏主题抽查：neon-district 霓虹黄底深字 ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "zh-CN" });
  const page = await ctx.newPage();
  const issues = captureIssues(page);
  await page.goto("https://custard.top/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => window.localStorage.setItem("cstd-world-theme", "neon-district"));
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.querySelector("[data-cstd-kinetic-world]")?.getAttribute("data-cstd-theme") === "neon-district", null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const neon = await page.evaluate(() => {
    const parse = (c) => {
      const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(String(c));
      return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
    };
    const lum = ({ r, g, b }) => {
      const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const root = document.querySelector("[data-cstd-kinetic-world]");
    const mark = document.querySelector("[data-cstd-header-mark]");
    const mk = mark ? getComputedStyle(mark) : null;
    const fg = mk ? parse(mk.color) : null;
    const bg = mk ? parse(mk.backgroundColor) : null;
    const ratio = fg && bg ? +(((Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05))).toFixed(2) : null;
    return {
      theme: root?.getAttribute("data-cstd-theme") ?? null,
      themeKind: root?.getAttribute("data-cstd-theme-kind") ?? null,
      markText: mark?.textContent?.trim() ?? null,
      markColor: mk?.color ?? null,
      markBg: mk?.backgroundColor ?? null,
      markVisible: mark ? mark.getBoundingClientRect().width > 0 : false,
      contrastRatio: ratio,
      overdriveToggle: !!document.querySelector("[data-cstd-overdrive-toggle]"),
      gameScenes: document.querySelectorAll("[data-cstd-home-game] [data-cstd-scene]").length,
      editorialHidden: (() => { const e = document.querySelector("[data-cstd-home-editorial]"); return e ? getComputedStyle(e).display === "none" : null; })(),
    };
  });
  await page.screenshot({ path: join(SHOTS, "reg--neon-header.png"), clip: { x: 0, y: 0, width: 1440, height: 220 } }).catch(() => {});
  /* 恢复默认主题，避免污染后续访客态（localStorage 属本探针私有 context，此处仅仪式性清理） */
  await page.evaluate(() => window.localStorage.removeItem("cstd-world-theme")).catch(() => {});
  report.sections.neonTheme = { neon, issues };
  await ctx.close();
}

await browser.close();
report.finishedAt = new Date().toISOString();
writeFileSync(join(HERE, "regression-live.json"), JSON.stringify(report, null, 1));

/* 机器判定 */
const s = report.sections;
const verdict = {
  cssV7: [s.zhDesktop?.structure?.css ?? []].flat().some((h) => /cstd-editorial\.css\?v=7/.test(h ?? "")),
  chapters6Zh: (s.zhDesktop?.structure?.chapters ?? []).length === 6,
  chapters6En: (s.enDesktop?.en?.chapters ?? []).length === 6,
  chapters6Mobile: (s.zhMobile?.mob?.chapters ?? []).length === 6,
  pinsZh: (s.zhDesktop?.structure?.spacers ?? 0) >= 2,
  pinsEn: (s.enDesktop?.en?.spacers ?? 0) >= 2,
  pinsMobile: (s.zhMobile?.mob?.spacers ?? 0) >= 2,
  counterMidRuns: (() => { const t = s.zhDesktop?.counter?.mid?.text; return t != null && t !== "0" && t !== "1,470,000"; })(),
  counterEndFinal: s.zhDesktop?.counter?.end?.text === "1,470,000",
  raiseMidActive: (() => { const ys = s.zhDesktop?.raise?.mid?.ys ?? []; return ys.length > 0 && Math.max(...ys) > 20; })(),
  raiseSettledZero: (() => { const ys = s.zhDesktop?.raise?.settled?.ys ?? []; return ys.length > 0 && ys.every((v) => v === 0); })(),
  bilingual: s.zhDesktop?.structure?.htmlLang !== s.enDesktop?.en?.htmlLang && s.zhDesktop?.structure?.h1 !== s.enDesktop?.en?.h1,
  mobileNoOverflow: (s.zhMobile?.mob?.scrollWidth ?? 999) <= 390 && (s.zhMobile?.mob?.scrollWidthAfterTraversal ?? 999) <= 390,
  desktopNoOverflow: (s.zhDesktop?.overflowDesktop?.scrollWidth ?? 9999) <= (s.zhDesktop?.overflowDesktop?.clientWidth ?? 0),
  neonYellowDark: /244, ?212, ?49/.test(s.neonTheme?.neon?.markBg ?? "") && /5, ?7, ?9/.test(s.neonTheme?.neon?.markColor ?? ""),
  neonContrast: s.neonTheme?.neon?.contrastRatio ?? null,
  consoleIssuesTotal: Object.values(s).reduce((n, sec) => n + (sec.issues?.length ?? 0), 0),
};
console.log(JSON.stringify({ ok: true, verdict, issues: Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v.issues ?? []])) }, null, 1));
