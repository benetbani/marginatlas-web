import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const CANDS = ["What an owner keeps, trade by trade", "What an owner keeps, by trade", "What an owner keeps"];
const b = await chromium.launch();
const lineTexts = (el) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const rows = new Map();
  while (walker.nextNode()) { const node = walker.currentNode; const t = node.textContent;
    for (let i = 0; i < t.length; i++) { const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
      const rect = r.getBoundingClientRect(); if (!rect.width && !rect.height) continue;
      const key = Math.round(rect.top); rows.set(key, (rows.get(key) || "") + t[i]); } }
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, s]) => s);
};
for (const w of [1280, 900, 768, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const res = await p.evaluate(({ CANDS, src }) => {
    const lineTexts = eval("(" + src + ")");
    const h = document.querySelector('#money h3');
    return CANDS.map(c => { h.textContent = c; return { c, lines: lineTexts(h) }; });
  }, { CANDS, src: lineTexts.toString() });
  console.log("=== " + w + " ===");
  for (const r of res) console.log("  " + JSON.stringify(r.lines));
  await p.close();
}
await b.close();
