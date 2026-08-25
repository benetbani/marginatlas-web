/**
 * probe_chart_conventions , WHAT EVERY CHART ON THE FOUR PAGES ACTUALLY DRAWS.
 *
 * NOT A GATE. Facts per chart, verdict left to a person looking at a crop, for
 * the same reason the table probe works that way: four instruments written this
 * week were wrong on their first reading, and one of the RULES was wrong too.
 *
 * Two of the nine chart conventions are held by a gate. These pages are half
 * charts, so the other seven are the largest unchecked surface left after the
 * tables.
 *
 *   G1  direct labels on the marks; a legend only at four or more series
 *   G2  one axis line, hairline; no ticks unless the scale is non-obvious
 *   G3  no gridlines; exactly one reference line where a reference exists
 *   G4  bars 9px, dots 6px, AT EVERY SIZE. Marks do not scale with the box.
 *   G5  no smoothed curves
 *   G8  worse reads low and left, better high and right
 *   G9  a chart that needs a caption to be understood is the wrong chart
 *
 * G4 IS THE ONE THIS CAN TEST HARDEST, and it is worth saying why. A drawing that
 * stretches uniformly takes its marks and its text with it, so the same dot is
 * one size in a half band and another on a phone, for no reason a reader could
 * name. Rendering the same chart at two widths and comparing mark sizes finds
 * that in one run. One chart on this site already carries a written note about
 * having been fixed for exactly this, which is the argument for checking the
 * rest.
 *
 * WHAT IT CANNOT SEE. It cannot tell a gridline from a reference line by looking,
 * so G3 is reported as "parallel rules inside the plot" and a person decides.
 * It cannot tell whether a caption is load-bearing, so G9 is reported as "a chart
 * with prose beside or beneath it" and nothing more. It cannot read direction, so
 * G8 is not attempted here at all.
 *
 * Usage: node scripts/probe_chart_conventions.mjs
 */
import { eachPageAtWidths } from "./lib/measure_pages.mjs";

function collect() {
  const out = [];

  function cardOf(el) {
    let c = el.parentElement;
    while (c && getComputedStyle(c).backdropFilter === "none") c = c.parentElement;
    return c;
  }
  function labelOf(card, el) {
    const rail = card ? card.querySelector("h2, h3, [class*=rail]") : null;
    return ((rail && rail.textContent) || (el.textContent || "")).trim().replace(/\s+/g, " ").slice(0, 40);
  }

  for (const svg of document.querySelectorAll("svg")) {
    const r = svg.getBoundingClientRect();
    /* Icons and glyphs are not charts. A chart has a box worth measuring. */
    if (r.width < 60 || r.height < 30) continue;
    const card = cardOf(svg);

    const rects = [...svg.querySelectorAll("rect")].filter((e) => {
      const b = e.getBoundingClientRect();
      return b.width > 1 && b.height > 1;
    });
    const circles = [...svg.querySelectorAll("circle")];
    const lines = [...svg.querySelectorAll("line")];
    const paths = [...svg.querySelectorAll("path")];

    const curved = paths.filter((p) => /[CcSsQqTt]/.test(p.getAttribute("d") || "")).length;

    /* Mark sizes, rounded to a tenth so sub-pixel layout noise does not read as
       a difference between widths. */
    const round = (n) => Math.round(n * 10) / 10;
    const bar = rects.map((e) => {
      const b = e.getBoundingClientRect();
      return round(Math.min(b.width, b.height));
    });
    const dot = circles.map((e) => round(e.getBoundingClientRect().width));

    /* Horizontal rules inside the plot: candidates for gridlines. */
    const horiz = lines.filter((e) => {
      const b = e.getBoundingClientRect();
      return b.height <= 2 && b.width > r.width * 0.5;
    }).length;

    const texts = [...svg.querySelectorAll("text")].length;
    const viewBox = svg.getAttribute("viewBox") || "";
    const preserve = svg.getAttribute("preserveAspectRatio") || "(default)";

    out.push({
      kind: "svg",
      label: labelOf(card, svg),
      w: Math.round(r.width),
      h: Math.round(r.height),
      viewBox,
      preserve,
      rects: rects.length,
      circles: circles.length,
      paths: paths.length,
      curved,
      horizRules: horiz,
      texts,
      bar,
      dot,
    });
  }

  /* Div-drawn marks: this site builds several charts out of positioned spans
     rather than SVG, and those obey the same rule. A mark is a small element with
     a background that sits inside a card. */
  for (const card of document.querySelectorAll("div")) {
    if (getComputedStyle(card).backdropFilter === "none") continue;
    if ([...card.querySelectorAll("div")].some((d) => getComputedStyle(d).backdropFilter !== "none")) continue;
    if (card.querySelector("svg")) continue;
    const marks = [];
    for (const e of card.querySelectorAll("span, div")) {
      if (e.children.length || (e.textContent || "").trim()) continue;
      const s = getComputedStyle(e);
      if (s.backgroundColor === "rgba(0, 0, 0, 0)") continue;
      const b = e.getBoundingClientRect();
      const min = Math.min(b.width, b.height);
      if (min < 2 || min > 24) continue;
      marks.push({ min: Math.round(min * 10) / 10, round: parseFloat(s.borderRadius) >= b.width / 2 - 0.5 });
    }
    if (marks.length < 2) continue;
    const rail = card.querySelector("h2, h3, [class*=rail]");
    out.push({
      kind: "div-marks",
      label: ((rail && rail.textContent) || card.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
      marks: marks.map((m) => m.min),
      dots: marks.filter((m) => m.round).length,
    });
  }

  return out;
}

const runs = await eachPageAtWidths([1280, 375], collect);
const [wide, narrow] = runs;

const key = (c) => `${c.kind}|${c.label}`;
const narrowBy = new Map();
for (const { name, result } of narrow.result) {
  for (const c of result) narrowBy.set(`${name}|${key(c)}`, c);
}

console.log("\n  every chart on the four pages, at 1280px, with its marks compared against 375px\n");
let n = 0;
for (const { name, result } of wide.result) {
  for (const c of result) {
    n++;
    const page = name.replace("-london", "").replace("london-", "");
    const other = narrowBy.get(`${name}|${key(c)}`);
    const notes = [];

    if (c.kind === "svg") {
      console.log(`  ${page} / ${c.label}`);
      console.log(`    ${c.w}x${c.h}px, viewBox "${c.viewBox || "none"}", preserveAspectRatio ${c.preserve}`);
      console.log(`    ${c.rects} bars, ${c.circles} dots, ${c.paths} paths, ${c.texts} text nodes`);
      if (c.curved) notes.push(`G5 ${c.curved} path(s) using curve commands`);
      if (c.horizRules > 1) notes.push(`G3 ${c.horizRules} full-width rules inside the plot`);
      if (c.viewBox && c.preserve === "(default)" && (c.rects || c.circles)) {
        notes.push("G4 a viewBox with default aspect handling: the drawing scales, and marks scale with it");
      }
      if (other) {
        const cmp = (a, b, what) => {
          if (!a.length || !b.length) return;
          const A = [...new Set(a)].sort((x, y) => x - y);
          const B = [...new Set(b)].sort((x, y) => x - y);
          if (A.join(",") !== B.join(",")) notes.push(`G4 ${what} measure ${A.join("/")} at 1280 and ${B.join("/")} at 375`);
        };
        cmp(c.bar, other.bar, "bars");
        cmp(c.dot, other.dot, "dots");
      } else {
        notes.push("not present at 375, so its marks could not be compared");
      }
    } else {
      console.log(`  ${page} / ${c.label}`);
      console.log(`    ${c.marks.length} drawn marks, ${c.dots} of them round`);
      if (other) {
        const A = [...new Set(c.marks)].sort((x, y) => x - y);
        const B = [...new Set(other.marks)].sort((x, y) => x - y);
        if (A.join(",") !== B.join(",")) notes.push(`G4 marks measure ${A.join("/")} at 1280 and ${B.join("/")} at 375`);
      }
    }

    if (notes.length) notes.forEach((x) => console.log(`      ${x}`));
    else console.log("      nothing to look at");
    console.log("");
  }
}
console.log(`  ${n} chart(s) examined at 1280px. Every line is a FACT, not a verdict.\n`);
