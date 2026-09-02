import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2];
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(url, { waitUntil: "load" });
const out = await p.evaluate(() => {
  const cardOf = (el) => { let n = el; while (n) { if (n.id) return "#" + n.id; n = n.parentElement; } return "(none)"; };
  const fills = [];
  for (const el of document.querySelectorAll("[style]")) {
    const s = el.getAttribute("style") || "";
    if (/(^|;)\s*(width|height)\s*:\s*[\d.]+(%|px)/.test(s) || /(^|;)\s*left\s*:\s*[\d.]+%/.test(s))
      fills.push({ card: cardOf(el), style: s.slice(0, 70), cls: (el.getAttribute("class") || "").slice(0, 55) });
  }
  const tables = [...document.querySelectorAll("table")].map((t) => ({ card: cardOf(t), rows: t.querySelectorAll("tr").length, cols: t.querySelectorAll("tr")[0]?.children.length }));
  const svgs = [...document.querySelectorAll("svg")].map((s) => ({ card: cardOf(s), cls: (s.getAttribute("class")||"").slice(0,40), n: s.querySelectorAll("rect,circle,line,polyline,path,ellipse").length }));
  return { fills, tables, svgs };
});
console.log("FILLS/POSITIONED:", out.fills.length);
for (const f of out.fills) console.log("  ", f.card, "|", f.cls, "|", f.style);
console.log("TABLES:", JSON.stringify(out.tables));
console.log("SVGS non-glyph:", out.svgs.filter(s=>!/ma-glyph|spine-ic/.test(s.cls)).map(s=>`${s.card}:${s.n}`).join(" "));
await b.close();
