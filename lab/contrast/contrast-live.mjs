/* contrast-live — 线上验收员-1：对 https://custard.top 刚部署版本的全页可见文字 WCAG 2.2 对比度实测。
   方法与实测员 scrollcraft/builds/cstd-editorial/lab/contrast/contrast-audit.mjs 完全一致
   （页内引擎 ENGINE_INSTALL / merge / pump / 步进 / 违规复测 / 媒体衬底采样逐字复制），
   仅三处 Node 侧差异，均不改变测量方法：
     1) 输出目录改为 lab/contrast/（本探针住所，JSON + shots-live/）；
     2) goto 后记录 link[rel=stylesheet] href 指纹（CDN 强刷核验：应含 cstd-editorial.css?v=7）；
     3) 可选 CLI 变体过滤（node contrast-live.mjs zh-desktop）便于分段跑。
   端口纪律：仅访问远程 https://custard.top，不启动任何本地服务、不占用任何本地端口。
   运行（从 E:\DEV\RocoDex）：node lab/contrast/contrast-live.mjs */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, "shots-live");
mkdirSync(SHOTS, { recursive: true });

const ONLY = process.argv[2] ?? null;

const VARIANTS = [
  { name: "zh-desktop", url: "https://custard.top/", locale: "zh-CN", viewport: { width: 1440, height: 900 }, dsf: 1 },
  { name: "en-desktop", url: "https://custard.top/en", locale: "en-AU", viewport: { width: 1440, height: 900 }, dsf: 1 },
  { name: "zh-mobile", url: "https://custard.top/", locale: "zh-CN", viewport: { width: 390, height: 844 }, dsf: 2 },
  { name: "en-mobile", url: "https://custard.top/en", locale: "en-AU", viewport: { width: 390, height: 844 }, dsf: 2 },
].filter((v) => !ONLY || v.name === ONLY);

/* ---------- 页内引擎（一次性安装到 window.__audit；与实测员探针逐字一致） ---------- */
const ENGINE_INSTALL = `(() => {
  const SKIP = new Set(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","TITLE","LINK","META","IFRAME","SVG","PATH","HEAD"]);
  const parse = (c) => {
    if (!c) return null;
    const m = /rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?\\)/.exec(String(c));
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const css = (c) => c ? ("rgb(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + ")") : null;

  const ownText = (el) => {
    let s = "";
    for (const n of el.childNodes) if (n.nodeType === 3) s += n.textContent;
    return s.replace(/\\s+/g, " ").trim();
  };
  const pathOf = (el) => {
    const parts = [];
    let n = el, depth = 0;
    while (n && n.nodeType === 1 && depth < 4) {
      let p;
      if (n.id) { p = "#" + n.id; parts.unshift(p); break; }
      p = n.tagName.toLowerCase();
      if (n.parentElement) {
        const sameTag = [...n.parentElement.children].filter((c) => c.tagName === n.tagName);
        if (sameTag.length > 1) p += ":nth-of-type(" + (sameTag.indexOf(n) + 1) + ")";
      }
      if (n.classList.length) p += "." + [...n.classList].slice(0, 2).join(".");
      parts.unshift(p);
      n = n.parentElement; depth++;
    }
    let ch = el.closest ? el.closest("section[id]") : null;
    return { path: parts.join(" > "), chapter: ch ? ch.id : (el.closest("section") ? "section" : "body") };
  };
  /* 有效背景：沿祖先链合成 rgba；命中 url() 背景图即媒体；全链无 alpha=1 时 elementFromPoint 探底 */
  const bgOf = (el) => {
    const layers = [];
    let media = null, approx = false;
    /* fixed 子树（如 folio）浮在任意内容之上：祖先链止于 fixed 根，
       盒内无实底则走 elementFromPoint 探真实衬底——走出 fixed 子树去问
       DOM 祖先的底色会把纸面误当衬底（曾造成 folio 7 项 1:1 假阳性） */
    let fixedRoot = null;
    for (let n = el.parentElement; n && n.nodeType === 1; n = n.parentElement) {
      if (getComputedStyle(n).position === "fixed") { fixedRoot = n; break; }
    }
    const boundary = fixedRoot ? fixedRoot.parentElement : null;
    for (let n = el; n && n.nodeType === 1 && n !== boundary; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const bi = cs.backgroundImage;
      if (bi && bi !== "none") {
        media = { kind: /url\\(/.test(bi) ? "bg-image" : "css-gradient", host: n.tagName.toLowerCase() + (n.classList.length ? "." + [...n.classList].slice(0, 2).join(".") : "") };
        return { bg: null, media, approx: false, under: null };
      }
      const c = parse(cs.backgroundColor);
      const op = parseFloat(cs.opacity || "1");
      if (c && c.a > 0) {
        layers.push(c.a < 1 || op < 1 ? { ...c, a: c.a * op } : c);
        if (c.a === 1) {
          let base = layers.pop();
          for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
          return { bg: base, media: null, approx: false, under: null };
        }
      }
    }
    /* 链上无实底：取文字下方实际衬底（fixed 元素如 folio 的真实处境） */
    const r = el.getBoundingClientRect();
    const px = Math.min(innerWidth - 1, Math.max(0, r.left + Math.min(r.width / 2, 40)));
    const py = Math.min(innerHeight - 1, Math.max(0, r.top + Math.min(r.height / 2, 12)));
    /* 命中需穿过整个 fixed 根（folio 自身包装会接住命中导致白底兜底假阳性） */
    const peRoot = fixedRoot ?? el;
    const prevPE = peRoot.style.pointerEvents;
    peRoot.style.pointerEvents = "none";
    const under = document.elementFromPoint(px, py);
    peRoot.style.pointerEvents = prevPE;
    if (under && under !== el && !el.contains(under) && !under.contains(el)) {
      const ut = under.tagName;
      const ucs = getComputedStyle(under);
      if (["IMG","VIDEO","CANVAS","PICTURE"].includes(ut)) return { bg: null, media: { kind: ut.toLowerCase(), host: (under.className && typeof under.className === "string" ? "." + under.className.split(/\\s+/).slice(0, 2).join(".") : under.tagName.toLowerCase()) }, approx: false, under: null };
      if (ucs.backgroundImage && ucs.backgroundImage !== "none") return { bg: null, media: { kind: /url\\(/.test(ucs.backgroundImage) ? "bg-image" : "css-gradient", host: under.tagName.toLowerCase() }, approx: false, under: null };
      let ubgEl = under;
      let uc = null;
      while (ubgEl && ubgEl.nodeType === 1) {
        const cand = parse(getComputedStyle(ubgEl).backgroundColor);
        if (cand && cand.a === 1) { uc = cand; break; }
        ubgEl = ubgEl.parentElement;
      }
      if (uc && uc.a === 1) {
        let base = uc;
        for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
        return { bg: base, media: null, approx: false, under: css(uc) };
      }
    }
    /* 兜底：视作白底（标记 approx） */
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return { bg: base, media: null, approx: true, under: null };
  };
  const measureEl = (el) => {
    const cs = getComputedStyle(el);
    const text = ownText(el);
    if (!text) return null;
    if (cs.display === "none" || cs.visibility === "hidden") return null;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;
    if (rect.bottom <= 0 || rect.top >= innerHeight || rect.right <= 0 || rect.left >= innerWidth) return null;
    let op = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const o = parseFloat(getComputedStyle(n).opacity || "1");
      if (!isNaN(o)) op *= o;
    }
    if (op < 0.55) return null; /* 入场动画进行中——本步跳过，稍后步再测 */
    /* 词幕升起等 scrub 中间帧非静息态：transform 存在且纵向位移非零时跳过
       （GSAP 静息态为 identity 矩阵或 none，两者都保留测量） */
    {
      const tf = cs.transform;
      if (tf && tf !== "none") {
        const m = tf.match(/^matrix(([^)]+))/);
        if (m) {
          const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
          const ty = parts[5] ?? 0;
          if (Math.abs(ty) > 0.5) return null;
        }
      }
    }
    let fg = parse(cs.webkitTextFillColor && cs.webkitTextFillColor !== "currentColor" && cs.webkitTextFillColor !== "rgba(0, 0, 0, 0)" ? cs.webkitTextFillColor : cs.color);
    if (!fg) return null;
    if (op < 1) fg = { ...fg, a: fg.a * op };
    const { bg, media, approx, under } = bgOf(el);
    const fs = parseFloat(cs.fontSize);
    const fw = parseInt(cs.fontWeight, 10) || 400;
    const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const { path, chapter } = pathOf(el);
    const folio = el.closest(".folio");
    const stateLabel = folio ? (folio.classList.contains("is-dark") ? "folio is-dark" : "folio") : (el.closest(".pin-spacer") ? "pin 段" : "");
    let effFg = fg, ratioV = null;
    if (!media) {
      effFg = fg.a < 1 ? over(fg, bg) : fg;
      ratioV = +ratio(effFg, bg).toFixed(2);
    }
    return {
      key: path + "|" + text.slice(0, 24), path, chapter, text: text.slice(0, 48),
      color: css(effFg), colorRaw: cs.color, bg: css(bg), bgUnder: under, approx,
      media, fontSize: fs, fontWeight: fw, large, ratio: ratioV, opacityFolded: op < 1,
      stateLabel, rect: { x: +rect.x.toFixed(1), y: +rect.y.toFixed(1), w: +rect.width.toFixed(1), h: +rect.height.toFixed(1) },
    };
  };
  const all = () => {
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      if (SKIP.has(el.tagName)) continue;
      let e = null;
      try { e = measureEl(el); } catch (err) { e = null; }
      if (e) out.push(e);
    }
    return out;
  };
  window.__audit = {
    scan: all,
    find(key) {
      for (const el of document.querySelectorAll("body *")) {
        if (SKIP.has(el.tagName)) continue;
        let e = null;
        try { e = measureEl(el); } catch (err) { e = null; }
        if (e && e.key === key) return e;
      }
      return null;
    },
    hideText(key) {
      for (const el of document.querySelectorAll("body *")) {
        if (SKIP.has(el.tagName)) continue;
        const t = ownText(el);
        if (!t) continue;
        const { path } = pathOf(el);
        if (path + "|" + t.replace(/\\s+/g, " ").trim().slice(0, 24) === key) {
          const prev = el.style.visibility;
          el.style.visibility = "hidden";
          const r = el.getBoundingClientRect();
          el.dataset.auditPrevVis = prev;
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        }
      }
      return null;
    },
    showText(key) {
      for (const el of document.querySelectorAll("body *")) {
        if (SKIP.has(el.tagName)) continue;
        const t = ownText(el);
        if (!t) continue;
        const { path } = pathOf(el);
        if (path + "|" + t.replace(/\\s+/g, " ").trim().slice(0, 24) === key && el.dataset.auditPrevVis !== undefined) {
          el.style.visibility = el.dataset.auditPrevVis;
          delete el.dataset.auditPrevVis;
          return true;
        }
      }
      return false;
    },
    sample(b64) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = img.width; c.height = img.height;
            const ctx = c.getContext("2d", { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);
            const d = ctx.getImageData(0, 0, c.width, c.height).data;
            let r = 0, g = 0, b = 0, n = 0, minL = 1, maxL = 0;
            const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
            for (let i = 0; i < d.length; i += 16) { /* 每 4 像素采 1 */
              if (d[i + 3] < 200) continue;
              r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
              const L = 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]);
              if (L < minL) minL = L;
              if (L > maxL) maxL = L;
            }
            if (!n) return resolve(null);
            resolve({ avg: css({ r: r / n, g: g / n, b: b / n }), lumMin: +minL.toFixed(4), lumMax: +maxL.toFixed(4), n });
          } catch (err) { resolve({ error: String(err) }); }
        };
        img.onerror = () => resolve(null);
        img.src = "data:image/png;base64," + b64;
      });
    },
  };
  return true;
})()`;

/* ---------- Node 侧 ---------- */
const merge = (map, entries, y) => {
  for (const e of entries) {
    e.scrollY = y;
    const prev = map.get(e.key);
    if (!prev) { e.states = [{ color: e.color, bg: e.bg, ratio: e.ratio, y, label: e.stateLabel }]; map.set(e.key, e); continue; }
    if (prev.states.length < 14 && !prev.states.some((s) => s.color === e.color && s.bg === e.bg && s.label === e.stateLabel))
      prev.states.push({ color: e.color, bg: e.bg, ratio: e.ratio, y, label: e.stateLabel });
    const pr = prev.ratio ?? Infinity, er = e.ratio ?? Infinity;
    if (er < pr) {
      for (const k of ["ratio", "color", "bg", "bgUnder", "approx", "fontSize", "fontWeight", "large", "opacityFolded", "stateLabel", "rect", "scrollY", "media", "colorRaw"]) prev[k] = e[k];
    }
  }
};

const pump = (page) => page.evaluate(async () => {
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
});

const browser = await chromium.launch();
const summaryAll = {};

for (const v of VARIANTS) {
  const t0 = Date.now();
  const ctx = await browser.newContext({ viewport: v.viewport, locale: v.locale, deviceScaleFactor: v.dsf });
  const page = await ctx.newPage();
  await page.goto(v.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => document.fonts ? document.fonts.ready : null).catch(() => {});
  await page.waitForTimeout(2000);

  /* CSS 指纹（CDN 强刷核验，Node 侧记录，不影响测量引擎） */
  const cssFingerprint = await page.evaluate(() => [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href")));
  console.log("CSS-FINGERPRINT", v.name, JSON.stringify(cssFingerprint));

  await page.evaluate(ENGINE_INSTALL);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(160, Math.round(v.viewport.height * 0.28));
  const records = new Map();
  let steps = 0;
  for (let y = 0; y <= height + step; y += step) {
    const yy = Math.min(y, height);
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), yy);
    await pump(page);
    await page.waitForTimeout(80);
    const entries = await page.evaluate(() => window.__audit.scan());
    merge(records, entries, yy);
    steps++;
  }
  /* 底部再停留一拍，收尾态 */
  await page.waitForTimeout(400);
  merge(records, await page.evaluate(() => window.__audit.scan()), height);

  const all = [...records.values()];

  /* ---- 违规复测（回到记录时 scrollY，防动画中途误报） ---- */
  const candidates = all.filter((e) => e.ratio != null && (e.large ? e.ratio < 3 : e.ratio < 4.5));
  let transient = 0;
  for (const e of candidates.slice(0, 80)) {
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), Math.min(e.scrollY, height));
    await page.waitForTimeout(280);
    const again = await page.evaluate((k) => window.__audit.find(k), e.key);
    if (!again) { e.confirm = "元素复访不可见，保留扫描值"; continue; }
    e.confirmRatio = again.ratio;
    if (again.ratio != null && (again.large ? again.ratio >= 3 : again.ratio >= 4.5)) { e.transient = true; transient++; }
  }

  /* ---- 媒体衬底采样（decorative）：隐藏文字截衬底 → 页内 canvas 解码 ---- */
  const mediaEntries = all.filter((e) => e.media);
  for (const e of mediaEntries.slice(0, 30)) {
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), Math.min(e.scrollY, height));
    await page.waitForTimeout(300);
    const rect = await page.evaluate((k) => window.__audit.hideText(k), e.key);
    if (!rect) { e.sample = { note: "复访未找到元素" }; continue; }
    const clip = {
      x: Math.max(0, Math.round(rect.x)), y: Math.max(0, Math.round(rect.y)),
      width: Math.max(4, Math.min(Math.round(rect.w), 520)), height: Math.max(4, Math.min(Math.round(rect.h), 240)),
    };
    let buf;
    try { buf = await page.screenshot({ clip }); } catch { buf = null; }
    await page.evaluate((k) => window.__audit.showText(k), e.key).catch(() => {});
    if (!buf) { e.sample = { note: "截图失败" }; continue; }
    const s = await page.evaluate((b64) => window.__audit.sample(b64), buf.toString("base64"));
    if (!s || s.error) { e.sample = s || { note: "采样失败" }; continue; }
    e.sample = s;
    /* 近似比值：前景色 vs 采样平均底；另给最差像素亮度的比值区间 */
    const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(e.color || "");
    if (m) {
      const fg = { r: +m[1], g: +m[2], b: +m[3] };
      const f = (x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
      const fgL = 0.2126 * f(fg.r) + 0.7152 * f(fg.g) + 0.0722 * f(fg.b);
      const rOf = (L) => +(L >= fgL ? (L + 0.05) / (fgL + 0.05) : (fgL + 0.05) / (L + 0.05)).toFixed(2);
      /* 平均底亮度由采样 avg 色（sRGB 分量→相对亮度）重算 */
      const am = /rgb\((\d+),(\d+),(\d+)\)/.exec(s.avg);
      if (am) {
        const aL = 0.2126 * f(+am[1]) + 0.7152 * f(+am[2]) + 0.0722 * f(+am[3]);
        e.sampledRatioAvg = +(aL >= fgL ? (aL + 0.05) / (fgL + 0.05) : (fgL + 0.05) / (aL + 0.05)).toFixed(2);
      }
      e.sampledRatioWorst = Math.min(rOf(s.lumMin), rOf(s.lumMax));
    }
  }

  /* ---- 逐章 + pin 中段 + 全页截图（布局审查素材） ---- */
  const chapters = await page.evaluate(() => [...document.querySelectorAll(".chapter[id]")].map((s) => s.id));
  for (const id of chapters) {
    await page.evaluate((cid) => document.getElementById(cid)?.scrollIntoView({ block: "start" }), id);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: join(SHOTS, v.name + "--" + id + ".png") }).catch(() => {});
  }
  await page.evaluate(() => {
    const el = document.querySelector(".data-spread");
    const box = (el && (el.closest(".pin-spacer") || el)) || null;
    if (box) scrollTo({ top: Math.max(0, box.getBoundingClientRect().top + scrollY + box.offsetHeight * 0.45 - innerHeight * 0.25), behavior: "instant" });
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(SHOTS, v.name + "--pin-mid.png") }).catch(() => {});
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(SHOTS, v.name + "--fullpage.png"), fullPage: true }).catch(() => {});

  /* ---- 汇总 ---- */
  const finalRatio = (e) => e.confirmRatio != null ? e.confirmRatio : e.ratio;
  const body = all.filter((e) => !e.media && !e.large);
  const large = all.filter((e) => !e.media && e.large);
  const deco = all.filter((e) => e.media);
  const violations = all.filter((e) => {
    if (e.media) return false;
    if (e.transient) return false;
    const r = finalRatio(e);
    return r != null && (e.large ? r < 3 : r < 4.5);
  }).sort((a, b) => finalRatio(a) - finalRatio(b));
  const ranked = all.filter((e) => !e.media && !e.transient && finalRatio(e) != null).sort((a, b) => finalRatio(a) - finalRatio(b));

  const bodyWorst = body.filter((e) => !e.transient && finalRatio(e) != null).sort((a, b) => finalRatio(a) - finalRatio(b))[0] ?? null;

  const out = {
    meta: {
      variant: v.name, url: v.url, locale: v.locale, viewport: v.viewport, docHeight: height, steps,
      startedAt: new Date().toISOString(), elapsedMs: Date.now() - t0,
      cssFingerprint,
      standard: "WCAG 2.2 SC 1.4.3（正文 4.5:1 / 大字 3:1）；SC 1.4.11 非文本 3:1 仅参考",
      method: "computed style + 祖先 rgba 逐层合成 + elementFromPoint 实底；违规项复测；媒体衬底为隐藏文字截图采样近似值",
      transientDropped: transient,
    },
    summary: {
      textElements: all.length, body: body.length, large: large.length, decorative: deco.length,
      violations: violations.length,
      bodyWorst: bodyWorst ? { key: bodyWorst.key, ratio: finalRatio(bodyWorst), color: bodyWorst.color, bg: bodyWorst.bg, fontSize: bodyWorst.fontSize } : null,
      worst3: ranked.slice(0, 3).map((e) => ({ key: e.key, ratio: finalRatio(e), color: e.color, bg: e.bg, fontSize: e.fontSize })),
    },
    violations: violations.map((e) => ({
      selector: e.path, chapter: e.chapter, text: e.text, category: e.large ? "large" : "body",
      color: e.color, bg: e.bg, bgUnder: e.bgUnder, approx: e.approx, ratio: finalRatio(e),
      fontSize: e.fontSize, fontWeight: e.fontWeight, opacityFolded: e.opacityFolded, stateLabel: e.stateLabel, scrollY: e.scrollY,
      confirmRatio: e.confirmRatio ?? null,
    })),
    decorative: deco.map((e) => ({
      selector: e.path, chapter: e.chapter, text: e.text, media: e.media, stateLabel: e.stateLabel,
      color: e.color, fontSize: e.fontSize, fontWeight: e.fontWeight,
      sampledBg: e.sample?.avg ?? null, sampledRatioAvg: e.sampledRatioAvg ?? null, sampledRatioWorst: e.sampledRatioWorst ?? null,
      sampleNote: e.sample?.note ?? null, scrollY: e.scrollY,
    })),
    allMeasurements: ranked.map((e) => ({
      selector: e.path, chapter: e.chapter, text: e.text, category: e.media ? "decorative" : (e.large ? "large" : "body"),
      color: e.color, bg: e.bg, ratio: finalRatio(e), fontSize: e.fontSize, stateLabel: e.stateLabel, states: e.states,
    })),
  };
  writeFileSync(join(HERE, "live-contrast-" + v.name + ".json"), JSON.stringify(out, null, 1));
  summaryAll[v.name] = { total: all.length, violations: violations.length, decorative: deco.length, bodyWorst: out.summary.bodyWorst, worst3: out.summary.worst3, chapters, cssFingerprint };
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ ok: true, summaryAll }, null, 1));
