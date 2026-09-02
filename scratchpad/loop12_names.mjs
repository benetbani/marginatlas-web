import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2], sel = process.argv[3], w = Number(process.argv[4] || 1280);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 1400 } });
await p.goto(pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href, { waitUntil: "load" });
const out = await p.evaluate((sel) => {
  const card = document.querySelector(sel);
  const res = [];
  for (const li of card.querySelectorAll("li")) {
    for (const el of li.querySelectorAll("*")) {
      const t = el.textContent.trim();
      if (!t || el.children.length) continue;
      const r = el.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
      res.push({ t: t.slice(0, 22), w: Math.round(r.width), h: Math.round(r.height), lines: Math.round(r.height / lh) });
    }
  }
  return { card: Math.round(card.getBoundingClientRect().width), res };
}, sel);
console.log(JSON.stringify(out));
await b.close();
