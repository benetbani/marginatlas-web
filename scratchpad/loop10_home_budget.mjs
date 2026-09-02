/* Measure a final page's visual-idea budget: what it DECLARES against what it DRAWS.
   A "drawing" is any element carrying a drawn mark that stands for a figure:
   an svg with data geometry, a fill sized by a style width/height, a role=img
   whose accessible name states a number, or a repeated pip. Prints one row each. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(300);
const out = await p.evaluate(() => {
  const decl = [...document.querySelectorAll("[data-idea]")].map((e) => ({
    idea: e.getAttribute("data-idea"),
    tag: e.tagName.toLowerCase(),
    text: (e.textContent || "").trim().slice(0, 70),
  }));
  const drawings = [];
  const seen = new Set();
  const push = (el, kind, note) => {
    if (seen.has(el)) return;
    seen.add(el);
    const sec = el.closest("section") || el.closest("[id]");
    drawings.push({
      kind,
      note,
      sectionId: sec ? sec.id || "" : "",
      heading: (() => {
        const s = el.closest("section");
        const h = s && s.querySelector("h2,h3");
        return h ? h.textContent.trim().slice(0, 55) : "";
      })(),
      aria: (el.getAttribute("aria-label") || "").slice(0, 90),
      cls: (el.getAttribute("class") || "").slice(0, 90),
      declared: !!el.closest("[data-idea]"),
    });
  };
  // 1. inline-styled fills (width:%/px or height:%/px on a coloured child)
  for (const el of document.querySelectorAll("[style]")) {
    const s = el.getAttribute("style") || "";
    if (/(^|;)\s*(width|height)\s*:\s*[\d.]+(%|px)/.test(s)) {
      const cls = el.getAttribute("class") || "";
      if (/bg-|border|rounded/.test(cls)) push(el, "fill", s.slice(0, 60));
    }
  }
  // 2. role=img whose name carries a digit
  for (const el of document.querySelectorAll('[role="img"]')) {
    const a = el.getAttribute("aria-label") || "";
    if (/\d/.test(a)) push(el, "role=img", "");
  }
  // 3. svgs with more than a glyph path (data geometry)
  for (const el of document.querySelectorAll("svg")) {
    const n = el.querySelectorAll("rect,circle,line,polyline,path,ellipse").length;
    if (n >= 2) push(el, "svg", `${n} shapes`);
  }
  return { decl, drawings, sections: [...document.querySelectorAll("section")].length };
});
console.log("DECLARED:", out.decl.length);
for (const d of out.decl) console.log("  ", d.idea, d.tag, JSON.stringify(d.text));
console.log("SECTIONS:", out.sections);
console.log("DRAWINGS:", out.drawings.length);
for (const d of out.drawings) console.log("  ", d.declared ? "[declared]" : "[UNDECLARED]", d.kind, "|", d.heading, "|", d.note, "|", d.aria, "|", d.cls);
await b.close();
