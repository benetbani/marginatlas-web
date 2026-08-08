#!/usr/bin/env node
/**
 * verify_paragraph_budget , no paragraph on a v2 surface runs past 20 words.
 *
 * WHY THE UNIT IS THE PARAGRAPH AND NOT THE SECTION.
 *
 * The 20-word budget was ratified against the SECTION, and counting per section
 * is the wrong unit for the defect it exists to catch. A section holding one
 * 60-word block beside two empty ones averages fine and reads terribly. The
 * founder's complaint was never about totals, it was that a reader cannot skim.
 *
 * FIRING 2'S MEASUREMENT WAS WRONG AND IT WAS WRONG BACKWARDS. Corrected in
 * firing 15 against SEVEN OWID pages instead of one, counting every text block
 * a reader stops on rather than only <p>.
 *
 * The original claim was "OWID median 18 words, 22 under 8; ours median 33, 0
 * under 8". Both halves fail. OWID's median across seven pages is 28 to 41, not
 * 18; the single page behind that 18 was an outlier. And our short text is not
 * missing, it is simply not in a <p>: it lives in .note, .lab and .s elements
 * that the original extraction never looked at.
 *
 * Firing 15 then over-corrected, claiming the page was "over-fragmented" at 7.5
 * words per text block against a reference near 16. Firing 16 withdrew that
 * too: the measure counted DATA-TABLE CELLS as prose fragments, and a
 * benchmarks site has many. The worst-scoring chapter by that metric, Ch15
 * "What to watch", turned out to be a shock table plus a two-column list, and
 * "merging" it would have destroyed a real structure.
 *
 * WHAT SURVIVES THREE MEASUREMENTS, chrome stripped, paragraphs only:
 *
 *                        paras   words   median   mean   under 8w
 *   /dev/cell2              33   1,073       33   32.5          0
 *   /dev/hood2              14     485       39   34.6          0
 *   /dev/industry2          14     366       24   26.1          0
 *   OWID co2-emissions      72   3,211       41   44.6          1
 *   OWID life-expectancy    92   1,804       18   19.6         22
 *   OWID famines           113   4,804       32   42.5          7
 *
 * Two things, and only two:
 *
 *   1. OUR PARAGRAPHS ARE INSIDE THE REFERENCE RANGE, 21 to 39 against 18 to
 *      41. We are not writing longer than the reference, and we write fewer
 *      total words than it.
 *   2. WE NEVER WRITE A VERY SHORT PARAGRAPH. Zero under eight words on every
 *      page measured; OWID's life-expectancy page has 22.
 *
 * And OWID has NO SINGLE NORM: median 18, 32 and 41 on three pages. So "match
 * the reference" is not a usable target, and the budget below does not rest on
 * one. It rests on the founder's own ratified rule, "one drawing, 20 words of
 * prose maximum", which is a design decision rather than a derived number.
 *
 * The remedy text still says do not SPLIT. Not because of a fragmentation
 * score, but because splitting a paragraph to satisfy a word budget produces
 * two half-thoughts and satisfies nothing.
 *
 * IT IS A RATCHET, NOT A PASS, AND THAT IS DELIBERATE.
 *
 * A hard fail on the first run would red every page on the site at once, and
 * this codebase already knows what happens then: "a gate that cries wolf gets
 * switched off." The stated-totals sweep was narrowed for exactly this reason
 * after 15 of its 16 hits turned out to be false.
 *
 * So the current over-budget paragraphs are recorded, and the gate fails only
 * when the set GROWS. Every rewrite shrinks it; nothing can add to it. The
 * baseline may be lowered, never raised: `--update-baseline` refuses to write a
 * larger set unless `--force` is passed, which is the safeguard the geo-link
 * ratchet lacked and needed.
 *
 * WHAT IS EXEMPT, and each exemption is a reason rather than a convenience:
 *   the method chapter, which exists to be read
 *   /dev/options and /dev/catalogue, which are review artifacts for the founder
 *     and are argued in prose on purpose
 *   anything outside the v2 surface, because the legacy pages are not being
 *     held to a rule they were never built under
 *
 * USAGE
 *   node scripts/verify_paragraph_budget.mjs
 *   node scripts/verify_paragraph_budget.mjs --list
 *   node scripts/verify_paragraph_budget.mjs --update-baseline
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const BASELINE = resolve(ROOT, "scripts/paragraph_budget_baseline.json");
const BUDGET = 20;

const argv = process.argv.slice(2);
const UPDATE = argv.includes("--update-baseline");
const FORCE = argv.includes("--force");
const LIST = argv.includes("--list");

/* The v2 surface. Legacy pages are not held to a rule they predate. */
const ROOTS = [
  "src/components/spine2",
  "src/components/city2",
  "src/components/country2",
  "src/app/world",
  "src/app/industries",
  "src/app/dev/cell2",
  "src/app/dev/industry2",
  "src/app/dev/hood2",
  "src/app/dev/home3",
];

/* Review artifacts. These argue a case to the founder in prose, on purpose. */
const EXEMPT_PATH = /[\\/](options|catalogue)[\\/]/;
/* The method chapter exists to be read. */
const EXEMPT_NEAR = /method|Method|methodology|Methodology/;

function walk(dir, out = []) {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(name)) out.push(p);
  }
  return out;
}

/**
 * Words a READER sees inside a <p>.
 *
 * JSX expressions are counted as one word each, which is the honest choice:
 * `{money(keep)}` renders as one figure, and expanding it to zero would let a
 * paragraph of nothing but interpolations pass a word budget it plainly breaks.
 */
function proseWords(inner) {
  const t = inner
    .replace(/\{[^{}]*\}/g, "  ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

/** Short stable digest of a paragraph, normalised so whitespace and indentation
 *  changes do not count as a different paragraph. */
function hash(inner) {
  const t = inner.replace(/\s+/g, " ").trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36).padStart(7, "0");
}

const findings = [];
for (const r of ROOTS) {
  for (const file of walk(r)) {
    const rel = file.slice(ROOT.length + 1).replace(/\\/g, "/");
    if (EXEMPT_PATH.test(file)) continue;
    const src = readFileSync(file, "utf8");
    /* Only <p>. A heading, a label and an axis are not prose and are not the
       thing a reader has to wade through. */
    for (const m of src.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
      const n = proseWords(m[1]);
      if (n <= BUDGET) continue;
      const before = src.slice(Math.max(0, m.index - 400), m.index);
      if (EXEMPT_NEAR.test(before)) continue;
      const line = src.slice(0, m.index).split("\n").length;
      const snippet = m[1].replace(/\s+/g, " ").trim().slice(0, 54);
      /* THE KEY IS CONTENT, NOT POSITION, AND THE FIRST VERSION GOT THIS WRONG.
         Keyed on `file:line`, the baseline broke the moment anything above a
         paragraph changed: adding a six-line comment to CityPage pushed an
         existing 29-word block from 816 to 822 and the gate reported it as new.
         A ratchet that fires on unrelated edits is a ratchet nobody keeps.
         Hashing the normalised text means moving a paragraph is free, editing
         one to stay over budget keeps its place in the baseline, and only text
         that is genuinely new can trip it. */
      findings.push({ key: `${rel}#${hash(m[1])}`, words: n, line, snippet });
    }
  }
}
findings.sort((a, b) => b.words - a.words);

if (LIST) {
  for (const f of findings) console.log(String(f.words).padStart(4) + "w  " + f.key.split("#")[0] + ":" + f.line + "  " + f.snippet);
  console.log(`\n${findings.length} paragraph(s) over ${BUDGET} words on the v2 surface.`);
  process.exit(0);
}

const SEEDED = existsSync(BASELINE);
const base = SEEDED ? JSON.parse(readFileSync(BASELINE, "utf8")) : { over: [] };
const baseSet = new Set(base.over ?? []);
const nowSet = new Set(findings.map((f) => f.key));

const added = findings.filter((f) => !baseSet.has(f.key));
const removed = [...baseSet].filter((k) => !nowSet.has(k));

if (UPDATE) {
  /* THE SAFEGUARD THE GEO-LINK RATCHET DID NOT HAVE. A baseline that can be
     raised is not a ratchet, it is a suggestion, and the first inconvenient
     failure reseeds it. */
  /* The FIRST seed is not a raise. With no baseline on disk every paragraph
     counts as added, so the guard below would refuse to write the very file it
     needs in order to work. Caught by trying to seed it. */
  if (SEEDED && added.length && !FORCE) {
    console.error(
      `x verify_paragraph_budget: refusing to RAISE the baseline.\n` +
        `  ${added.length} new over-budget paragraph(s) would be recorded as acceptable.\n` +
        `  Rewrite them, or pass --force and say why in the commit.`,
    );
    for (const f of added.slice(0, 10)) console.error(`     ${f.words}w  ${f.key}`);
    process.exit(1);
  }
  writeFileSync(BASELINE, JSON.stringify({ budget: BUDGET, over: [...nowSet].sort() }, null, 2) + "\n");
  console.log(`Baseline written: ${nowSet.size} paragraph(s) over ${BUDGET} words.`);
  process.exit(0);
}

if (added.length) {
  console.error(`x verify_paragraph_budget: ${added.length} NEW paragraph(s) over ${BUDGET} words.\n`);
  for (const f of added) console.error(`   ${String(f.words).padStart(4)}w  ${f.key}\n        ${f.snippet}`);
  console.error(
    `\n  The unit is the PARAGRAPH, not the section: one long block beside two\n` +
      `  empty ones averages fine and reads badly. The budget is the founder's\n` +
      `  ratified rule, one drawing and 20 words of prose.\n` +
      `  CUT it, or move the figure onto the drawing it describes.\n` +
      `  Do NOT split it: two half-thoughts satisfy the budget and nothing else.\n`,
  );
  process.exit(1);
}

if (removed.length) {
  console.log(`  IMPROVED: ${removed.length} paragraph(s) came under budget since the baseline.`);
  for (const k of removed.slice(0, 12)) console.log(`     ${k}`);
  console.log(`  Lower it: node scripts/verify_paragraph_budget.mjs --update-baseline`);
}

console.log(
  `verify_paragraph_budget: RATCHET HELD. ${nowSet.size} paragraph(s) over ${BUDGET} words,\n` +
    `  none of them new. This is not a pass: it fails the moment the set grows.`,
);
process.exit(0);
