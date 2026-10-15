/* folio-truth — 线上验收员-1：裁决 contrast-live 报告的 7 项 folio.is-dark 违规是否为
   fixed 元素假阳性。主探针（与实测员同法）沿祖先链取底，folio 是 position:fixed，
   祖先链落在 body 纸白上；但其 is-dark 态本就是为版权页墨牌（--ed-ink-plate #242b27）
   翻浅字而设。本探针在三处独立取证（zh-desktop y=8064 / en-desktop y=8316）：
     1) elementFromPoint（临时关掉 folio 指针事件）——folio 文字底下真实命中的元素
        及其背景，是否 [data-colophon] 墨牌；
     2) 隐藏 folio 文字后截取 folio 轨道区域，页内 canvas 采样平均色——墨牌底的真实
        像素（应为 #242b27 邻域）；
     3) 用采样底重算真实对比率：非激活项为 rgb(248 245 239 / 55%) 折算、激活项
        #f8f5ef 实底。
   端口纪律：仅访问 https://custard.top。运行（从 E:\DEV\RocoDex）：
   node lab/contrast/folio-truth.mjs */
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/* 注意：本 playwright-core 的 evaluate 不把"字符串形态的箭头函数"当函数调用，
   故采样器必须以真函数传入。 */
const sampleB64 = (page, b64) => page.evaluate((b64) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => {
    try {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; n++; }
      resolve({ avg: [Math.round(r/n), Math.round(g/n), Math.round(b/n)], n });
    } catch (err) { resolve({ error: String(err) }); }
  };
  img.onerror = () => resolve(null);
  img.src = "data:image/png;base64," + b64;
}), b64);

const ratioOf = (fg, bg) => {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const l1 = 0.2126 * f(fg[0]) + 0.7152 * f(fg[1]) + 0.0722 * f(fg[2]);
  const l2 = 0.2126 * f(bg[0]) + 0.7152 * f(bg[1]) + 0.0722 * f(bg[2]);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
};
const blend = (fg, a, bg) => fg.map((v, i) => Math.round(v * a + bg[i] * (1 - a)));

const CASES = [
  { name: "zh-desktop", url: "https://custard.top/", y: 8064, viewport: { width: 1440, height: 900 } },
  { name: "en-desktop", url: "https://custard.top/en", y: 8316, viewport: { width: 1440, height: 900 } },
];

const browser = await chromium.launch();
const report = {};
for (const c of CASES) {
  const ctx = await browser.newContext({ viewport: c.viewport, locale: c.name.startsWith("zh") ? "zh-CN" : "en-AU" });
  const page = await ctx.newPage();
  await page.goto(c.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => document.fonts ? document.fonts.ready : null).catch(() => {});
  await page.waitForTimeout(1500);
  await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), c.y);
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => {
    const folio = document.querySelector("nav.folio");
    const cs = folio ? getComputedStyle(folio) : null;
    const items = [...document.querySelectorAll(".folio__item")];
    return {
      folioFound: !!folio,
      isDark: folio?.classList.contains("is-dark") ?? null,
      folioPosition: cs?.position ?? null,
      folioRect: folio ? (() => { const r = folio.getBoundingClientRect(); return { x: +r.x.toFixed(0), y: +r.y.toFixed(0), w: +r.width.toFixed(0), h: +r.height.toFixed(0) }; })() : null,
      itemColors: items.map((it) => ({ text: it.textContent.replace(/\\s+/g, " ").trim().slice(0, 10), active: it.classList.contains("is-active"), color: getComputedStyle(it.querySelector("b") ?? it).color })),
      colophonTop: document.querySelector("[data-colophon]")?.getBoundingClientRect().top ?? null,
      viewportH: innerHeight,
    };
  });

  /* 1) elementFromPoint：关掉 folio 指针事件后逐项探底 */
  const under = await page.evaluate(() => {
    const folio = document.querySelector("nav.folio");
    const prev = folio.style.pointerEvents;
    folio.style.pointerEvents = "none";
    const out = [...document.querySelectorAll(".folio__item")].map((it) => {
      const r = it.getBoundingClientRect();
      const hit = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2)));
      const ucs = hit ? getComputedStyle(hit) : null;
      return {
        text: it.textContent.replace(/\\s+/g, " ").trim().slice(0, 10),
        hitTag: hit ? hit.tagName.toLowerCase() + (hit.className && typeof hit.className === "string" ? "." + hit.className.split(/\\s+/).slice(0, 2).join(".") : "") : null,
        inColophon: !!hit?.closest?.("[data-colophon]"),
        hitBg: ucs?.backgroundColor ?? null,
      };
    });
    folio.style.pointerEvents = prev;
    return out;
  });

  /* 2) 隐藏 folio 全部文字，截 folio 轨道区域采样真实底色 */
  const rail = state.folioRect;
  const clip = { x: Math.max(0, rail.x - 6), y: Math.max(0, rail.y - 6), width: Math.min(rail.w + 12, 400), height: Math.min(rail.h + 12, 700) };
  await page.evaluate(() => { document.querySelectorAll(".folio__item b, .folio__item span, .folio__item u, .folio__item i").forEach((el) => { el.style.visibility = "hidden"; }); });
  await page.waitForTimeout(120);
  const buf = await page.screenshot({ clip });
  await page.evaluate(() => { document.querySelectorAll(".folio__item b, .folio__item span, .folio__item u, .folio__item i").forEach((el) => { el.style.visibility = ""; }); });
  const sample = await sampleB64(page, buf.toString("base64"));
  await page.screenshot({ path: join(HERE, "shots-live", `folio-truth--${c.name}.png`), clip }).catch(() => {});

  /* 3) 真实对比率：以采样底为准重算（非激活 55% 折算 / 激活实底 #f8f5ef） */
  const bg = sample?.avg ?? null;
  const paper = [248, 245, 239];
  const truths = bg
    ? {
        inactiveFgBlended: blend(paper, 0.55, bg),
        inactiveRatio: ratioOf(blend(paper, 0.55, bg), bg),
        activeFg: [248, 245, 239],
        activeRatio: ratioOf([248, 245, 239], bg),
        plateTheoretical: ratioOf([248, 245, 239], [36, 43, 39]),
      }
    : null;

  report[c.name] = { scrollY: c.y, state, under, sample, truths };
  await ctx.close();
}
await browser.close();
writeFileSync(join(HERE, "folio-truth.json"), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
