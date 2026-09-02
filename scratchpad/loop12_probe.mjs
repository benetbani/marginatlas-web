import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2], sel = process.argv[3], w = Number(process.argv[4] || 1280);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 1400 } });
await p.goto(pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href, { waitUntil: "load" });
const out = await p.evaluate((sel) => {
  const card = document.querySelector(sel);
  if (!card) return null;
  const rows = [];
  const walk = (n) => {
    for (const c of n.children) {
      const t = [...c.childNodes].filter((x) => x.nodeType === 3).map((x) => x.textContent.trim()).join(" ").trim();
      const cs = getComputedStyle(c); const r = c.getBoundingClientRect();
      if (t) rows.push({ t: t.slice(0, 34), size: cs.fontSize, w: cs.fontWeight, col: cs.color, box: `${Math.round(r.width)}x${Math.round(r.height)}` });
      walk(c);
    }
  };
  walk(card);
  const cr = card.getBoundingClientRect();
  return { card: `${Math.round(cr.width)}x${Math.round(cr.height)}`, rows };
}, sel);
console.log(JSON.stringify(out, null, 1));
await b.close();
