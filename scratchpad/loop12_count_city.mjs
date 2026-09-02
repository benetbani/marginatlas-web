/* C9: enumerate EVERY data-bearing drawing on a final page, including role=img with no
   digit in its name (the tier bands), pip rows, inline fills and svgs with geometry.
   Prints the card (nearest [id] Box) each one sits in, so the per-card clause can be
   counted rather than guessed. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2];
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(250);
const out = await p.evaluate(() => {
  const rows = [];
  const seen = new Set();
  const card = (el) => {
    let n = el.parentElement;
    while (n) {
      const c = n.getAttribute && (n.getAttribute("class") || "");
      if (n.id || /rounded-\[14px\]/.test(c)) return (n.id ? "#" + n.id : "") + " " + c.slice(0, 40);
      n = n.parentElement;
    }
    return "(no card)";
  };
  const push = (el, kind, note) => {
    if (seen.has(el)) return; seen.add(el);
    rows.push({ kind, note, card: card(el), aria: (el.getAttribute("aria-label") || "").slice(0, 100),
      idea: el.closest("[data-idea]") ? el.closest("[data-idea]").getAttribute("data-idea") : null,
      cls: (el.getAttribute("class") || "").slice(0, 70) });
  };
  for (const el of document.querySelectorAll('[role="img"]')) push(el, "role=img", "");
  for (const el of document.querySelectorAll("[style]")) {
    const s = el.getAttribute("style") || "";
    if (/(^|;)\s*(width|height)\s*:\s*[\d.]+(%|px)/.test(s)) {
      const cls = el.getAttribute("class") || "";
      if (/bg-|border|rounded/.test(cls)) push(el, "fill", s.slice(0, 50));
    }
  }
  for (const el of document.querySelectorAll("svg")) {
    const n = el.querySelectorAll("rect,circle,line,polyline,path,ellipse").length;
    const cls = el.getAttribute("class") || "";
    if (n >= 2 && !/ma-glyph|spine-ic/.test(cls)) push(el, "svg", `${n} shapes`);
  }
  return rows;
});
console.log("DATA-BEARING CANDIDATES:", out.length);
for (const r of out) console.log(` ${r.idea ? "[" + r.idea + "]" : "[UNDECLARED]"} ${r.kind} | card=${r.card} | ${r.aria} | ${r.cls} | ${r.note}`);
await b.close();
