/* 像素对比：我的复拍（DOM 已证）vs 交付 after/*.png —— 证明交付截图即所声称状态 */
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const pairs = [
  ["E:/DEV/RocoDex/lab/refactor/final2/f2-02.png", "E:/DEV/RocoDex/lab/refactor/after/02-title-rule-mid.png"],
  ["E:/DEV/RocoDex/lab/refactor/final2/f2-03.png", "E:/DEV/RocoDex/lab/refactor/after/03-method-ink-mid.png"],
  ["E:/DEV/RocoDex/lab/refactor/final2/f2-04.png", "E:/DEV/RocoDex/lab/refactor/after/04-data-count-mid.png"],
  ["E:/DEV/RocoDex/lab/refactor/final2/f2-05.png", "E:/DEV/RocoDex/lab/refactor/after/05-notes-drift-mid.png"],
];

const b64 = (p) => "data:image/png;base64," + readFileSync(p).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [mine, theirs] of pairs) {
  const r = await page.evaluate(async ({ a, b }) => {
    const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
    const [ia, ib] = [await load(a), await load(b)];
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height);
    const c = new OffscreenCanvas(w, h), c2 = new OffscreenCanvas(w, h);
    const g = c.getContext("2d"), g2 = c2.getContext("2d");
    g.drawImage(ia, 0, 0); g2.drawImage(ib, 0, 0);
    const da = g.getImageData(0, 0, w, h).data, db = g2.getImageData(0, 0, w, h).data;
    let sum = 0, hot = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3;
      sum += d; if (d > 8) hot++;
    }
    return { w: ia.width, h: ia.height, w2: ib.width, h2: ib.height, meanDiff: +(sum / (da.length / 4)).toFixed(3), hotPct: +(100 * hot / (da.length / 4)).toFixed(3) };
  }, { a: b64(mine), b: b64(theirs) });
  console.log(mine.split("/").pop(), "vs", theirs.split("/").pop(), JSON.stringify(r));
}
await browser.close();
