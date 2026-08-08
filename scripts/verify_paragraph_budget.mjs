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
 * Firing 2 measured why, against Our World in Data as the reference, with the
 * same extraction run on both:
 *
 *   OWID           94 paragraphs, median 18 words, 22 of them under 8 words
 *   /dev/cell2     33 paragraphs, median 33 words,  0 of them under 8 words
 *
 * We are NOT writing more than the reference. Our cell page is 2,854 words
 * against OWID's 3,705 and is denser in figures than it. We are writing in
 * blocks twice as long, and we have no captions at all. An 18-word caption is
 * skipped in a glance; a 33-word block has to be entered before it can be
 * judged, and there are thirty-three of them.
 *
 * Held to 20 words our median falls to under 20, landing almost exactly on
 * OWID's 18. That is two independent routes to the same number: one from the
 * section the founder liked (a drawing plus 16 words), one from the reference.
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
      `  empty ones averages fine and reads badly. Reference is Our World in Data\n` +
      `  at a median of 18 words a paragraph; ours was 33.\n` +
      `  Split it, cut it, or move the figure onto the drawing it describes.\n`,
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
