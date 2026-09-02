import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const page_ = process.argv[2], needle = process.argv[3], w = Number(process.argv[4] || 1280);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${page_}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 1200 } });
await p.goto(url, { waitUntil: "load" });
const out = await p.evaluate((needle) => {
  const h = [...document.querySelectorAll("h3,h2")].find((e) => e.textContent.trim().toLowerCase().includes(needle.toLowerCase()));
  if (!h) return null;
  let card = h;
  for (let i = 0; i < 8 && card; i++) { card = card.parentElement; if (card && /rounded-\[/.test(card.className || "")) break; }
  const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  const kids = [...card.children].map((c) => ({ tag: c.tagName, cls: (c.className || "").toString().slice(0, 50), box: r(c), text: c.textContent.trim().slice(0, 46) }));
  const cs = getComputedStyle(card);
  return { card: r(card), padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft], kids };
}, needle);
console.log(JSON.stringify(out, null, 1));
await b.close();
