/**
 * verify_art_direction , the measurable half of E:\atlas\design\ART-DIRECTION.md.
 *
 * The art direction was ratified 2026-08-25 after the founder found seven faults
 * that 116 gates could not see. Its section J lists which of its rules are
 * machine-checkable and which are judgment; this file is section J's first
 * column. The judgment half is checked by opening the picture, and nothing here
 * substitutes for that.
 *
 * ONE FILE, SEVERAL NAMED CHECKS. Each reports its own count and its own
 * offenders, so a failure says which RULE broke rather than which script.
 *
 * BLIND SPOTS, all of them, stated before any number here is quoted:
 *
 *   - It reads the four BUILT London pages, not the live routes. A section that
 *     only renders for a different city is invisible to it.
 *   - Chrome reports a laid-out rect for content inside a CLOSED <details> that
 *     it never paints. Everything here skips collapsed disclosures, because a
 *     first version of this measurement counted fourteen overlaps and twelve
 *     were that.
 *   - Ink coverage measures EXTENT, top drawn thing to bottom drawn thing, not
 *     density. A card with content only at its two ends reads as full here and
 *     looks empty to a person.
 *   - Terracotta is counted by computed colour, so a mark that is terracotta by
 *     virtue of an image or a gradient is not counted.
 *   - It cannot tell a section that is full width BY DESIGN from one that is
 *     full width by neglect. That is what the hero attribute is for.
 *
 * Usage: node scripts/verify_art_direction.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/art_direction_baseline.json";

const collect = () => {
  /* The accent, as the tokens define it. Counted by computed colour rather than
     by class, because a class tells you what was WRITTEN and this asks what
     RENDERS. Declared inside the collector because this function is serialised
     into the page and cannot see anything from this file's scope. */
  const TERRA = ["rgb(251, 132, 105)", "rgb(194, 65, 12)"];
  const inDeadDetails = (e) => {
    const d = e.closest("details");
    return !!d && !d.open && !e.closest("summary");
  };
  const cards = [...document.querySelectorAll("div")].filter(
    (e) => getComputedStyle(e).backdropFilter !== "none",
  );
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));

  const sections = outer.map((c) => {
    const cb = c.getBoundingClientRect();

    /* E1, prose budget. Runs of 30+ characters carrying a space are sentences;
       a label, a figure and a unit are not. */
    let prose = 0;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const own = [...e.childNodes]
        .filter((x) => x.nodeType === 3 && x.textContent.trim())
        .map((x) => x.textContent.trim())
        .join(" ");
      if (own.length >= 30 && /\s/.test(own)) prose += own.length;
    }

    /* E2, ink coverage. */
    let top = cb.bottom;
    let bot = cb.top;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const s = getComputedStyle(e);
      const drawn =
        [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) ||
        e.tagName === "svg" ||
        s.backgroundColor !== "rgba(0, 0, 0, 0)";
      const b = e.getBoundingClientRect();
      if (drawn && b.height > 2) {
        top = Math.min(top, b.top);
        bot = Math.max(bot, b.bottom);
      }
    }
    const ink = Math.max(0, bot - top);

    /* C2, accent budget. A mark counts once whether it is coloured text, a fill
       or a border on a data element. */
    let accents = 0;
    for (const e of c.querySelectorAll("*")) {
      if (inDeadDetails(e)) continue;
      const s = getComputedStyle(e);
      /* A COMPARED SET MARKS ONE BEST PER ROW BY DESIGN. C1 requires it, so
         counting table cells against a two-per-section budget put the rule in
         conflict with itself: a three-row comparison is correct and read as three
         violations. Cells are exempt; loose marks are not. */
      if (e.closest("td, th")) continue;
      const own = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim());
      if (own && TERRA.includes(s.color)) accents++;
      else if (TERRA.includes(s.backgroundColor)) accents++;
    }

    /* A5, a bordered box inside a bordered card. */
    let nestedBoxes = 0;
    for (const e of c.querySelectorAll("div")) {
      const s = getComputedStyle(e);
      const b = e.getBoundingClientRect();
      if (s.borderTopWidth === "0px" || parseFloat(s.borderTopLeftRadius) < 6) continue;
      if (b.width < 200 || b.height < 60) continue;
      if (b.width > cb.width - 8) continue; // the card's own inner wrapper
      nestedBoxes++;
    }

    return {
      w: Math.round(cb.width),
      h: Math.round(cb.height),
      prose,
      inkPct: cb.height > 0 ? Math.round((ink / cb.height) * 100) : 100,
      accents,
      nestedBoxes,
      label: (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 36),
    };
  });

  /* C2 page budget, and H4 front repetition. */
  const pageAccents = sections.reduce((a, s) => a + s.accents, 0);

  const seen = new Map();
  for (const e of document.querySelectorAll("*")) {
    if (inDeadDetails(e)) continue;
    const own = [...e.childNodes]
      .filter((x) => x.nodeType === 3 && x.textContent.trim())
      .map((x) => x.textContent.trim())
      .join(" ")
      .replace(/\s+/g, " ");
    if (own.length < 4) continue;
    /* THE HONESTY TAG IS NOT REPETITION. "sample" marks every section whose
       figures are modelled, and it is REQUIRED to appear on each of them. H4 is
       about the page telling a reader the same THING twice, not about a chrome
       marker doing its job. */
    if (/^sample$/i.test(own)) continue;
    const top = e.getBoundingClientRect().top + window.scrollY;
    if (top > 900) continue;
    /* A REPEAT INSIDE ONE SECTION IS THE FORM WORKING. A tier band names its two
       poles and marks the value, so the word "Deep" legitimately appears three
       times inside one card; counting that told the reader nothing and buried the
       real finding, which was a figure printed in three DIFFERENT sections of the
       first screen. Keyed by the section a run sits in, and only a run that
       crosses sections counts. */
    const card = e.closest("[data-hero='1']") || e.closest("div[style*='backdrop']") || e.closest("main > div") || document.body;
    if (!seen.has(own)) seen.set(own, { ys: new Set(), cards: new Set() });
    seen.get(own).ys.add(Math.round(top));
    seen.get(own).cards.add(card);
  }
  const frontRepeats = [...seen.entries()]
    .filter(([, v]) => v.cards.size > 1)
    .map(([t, v]) => [t, v.ys])
    .filter(([, ys]) => ys.size > 1)
    .map(([t, ys]) => `"${t.slice(0, 36)}" at ${[...ys].sort((a, b) => a - b).join(", ")}`);

  return { sections, pageAccents, frontRepeats };
};

const RULES = [
  { key: "prose", rule: "E1", why: "over 220 characters of prose", test: (s) => s.prose > 220, show: (s) => `${s.prose} chars` },
  { key: "ink", rule: "E2", why: "under 60% ink coverage", test: (s) => s.inkPct < 60, show: (s) => `${s.inkPct}% ink of ${s.h}px` },
  { key: "accents", rule: "C2", why: "more than two accent marks", test: (s) => s.accents > 2, show: (s) => `${s.accents} accents` },
  { key: "nested", rule: "A5", why: "a bordered box inside the card", test: (s) => s.nestedBoxes > 0, show: (s) => `${s.nestedBoxes} nested` },
];

const pages = await eachPage(1440, collect);
const now = {};
let total = 0;

for (const { name, result } of pages) {
  const lines = [];
  for (const r of RULES) {
    const bad = result.sections.filter(r.test);
    now[`${name}:${r.key}`] = bad.length;
    total += bad.length;
    for (const s of bad) lines.push(`  ${r.rule}  ${r.why.padEnd(34)} ${r.show(s).padEnd(16)} "${s.label}"`);
  }
  now[`${name}:pageAccents`] = result.pageAccents > 5 ? 1 : 0;
  total += now[`${name}:pageAccents`];
  if (result.pageAccents > 5) lines.push(`  C2  ${String(result.pageAccents).padStart(2)} accent marks on the page, the budget is 5`);

  now[`${name}:frontRepeat`] = result.frontRepeats.length;
  total += result.frontRepeats.length;
  for (const f of result.frontRepeats) lines.push(`  H4  repeated in the first screen         ${f}`);

  console.log(`\n  ${name}   ${lines.length} finding(s)`);
  lines.forEach((l) => console.log("   " + l));
}

console.log(`\n  ${total} art-direction finding(s) across the four pages.\n`);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_art_direction: findings GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  console.log("\n  The rules are in E:\\atlas\\design\\ART-DIRECTION.md, sections A, C, E and H.\n");
  process.exit(1);
}
console.log("PASS verify_art_direction.\n");
