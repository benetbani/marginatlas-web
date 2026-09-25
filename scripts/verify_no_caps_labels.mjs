#!/usr/bin/env node
/**
 * verify_no_caps_labels , WORDS A READER MUST READ ARE NOT SET IN CAPITALS (2026-09-25, his message of that evening:
 * "These 2x2 stacks in sections with capital letters etc have terrible legibility, almost unreadable and bad hierarchy, study how
 * to resolve it, resolve it").
 *
 * THE STUDY, IN THREE LINES. Capitals at 12px, tracked wide and set in bold, lose the word shapes a reader recognises and read
 * as a band of texture; in the key-value grids that band was as heavy as the figure under it, and the note beneath matched the
 * label's size, so a cell was three lines of one weight with no order. Sentence case at the body rung for the label, the figure
 * the one bold line in ink, the note a rung below, gives three rungs and one order; a card's title in sentence case at the lead
 * rung, in ink, gives the card a heading above them. The resolution landed in the same commit as this gate.
 *
 * THE RULE: no `uppercase` class and no `textTransform: "uppercase"` in the spine's components, except where a count is already
 * held below: a table's column heads (one or two words over a column, the convention that stays), the SVG marks of the kit's
 * small charts, the switched-off sample tag, and the index pages the site does not serve as data cards. A RATCHET, per file: a
 * file's count may fall and may never rise, and a file with no entry must hold none.
 *
 * WHAT IT CANNOT SEE, STATED: capitals typed into the words themselves ("PLENTY OF BUYERS" in a copy table) and a transform set
 * by a stylesheet outside src/components/spine. The copy gate reads the words; the stylesheets carry no such rule today.
 *
 *   node scripts/verify_no_caps_labels.mjs
 *   node scripts/verify_no_caps_labels.mjs --write   (lower the baseline after a fall, in the same commit)
 *   node scripts/verify_no_caps_labels.mjs --list    (name every use)
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = "src/components/spine";
const BASELINE = "scripts/caps_labels_baseline.json";
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p) && !/stories\.tsx$/.test(p)) files.push(p);
  }
})(ROOT);

/* A use is a class token `uppercase` in a string, or a textTransform of "uppercase", on a line that is not a comment. Comment lines
   are skipped by their opening mark (a line starting with //, /*, * or {/*): a comment that explains a removed capital is not one. */
const CLASS = /(?:^|[\s"'`{])uppercase(?=$|[\s"'`}])/g;
const STYLE = /textTransform\s*:\s*["']uppercase["']/g;
const uses = new Map();
const where = [];
for (const f of files) {
  const rel = relative(process.cwd(), f).split(sep).join("/");
  const lines = readFileSync(f, "utf8").split("\n");
  let inBlock = false;
  lines.forEach((line, i) => {
    const t = line.trim();
    if (inBlock) { if (t.includes("*/")) inBlock = false; return; }
    if (t.startsWith("/*") || t.startsWith("{/*")) { if (!t.includes("*/")) inBlock = true; return; }
    if (t.startsWith("//") || t.startsWith("*")) return;
    const n = (line.match(CLASS) ?? []).length + (line.match(STYLE) ?? []).length;
    if (n > 0) { uses.set(rel, (uses.get(rel) ?? 0) + n); where.push(`${rel}:${i + 1}`); }
  });
}
const total = [...uses.values()].reduce((a, b) => a + b, 0);

if (process.argv.includes("--list")) for (const w of where) console.log(`  ${w}`);

if (process.argv.includes("--write")) {
  writeFileSync(BASELINE, JSON.stringify({ why: "verify_no_caps_labels: capitals a file may still hold (table column heads, the kit's SVG marks, the sample tag, the index pages); a count may fall and never rise.", files: Object.fromEntries([...uses].sort()) }, null, 1) + "\n", "utf8");
  console.log(`wrote ${BASELINE}: ${total} use(s) in ${uses.size} file(s)`);
  process.exit(0);
}

let base;
try { base = JSON.parse(readFileSync(BASELINE, "utf8")).files; }
catch { console.error(`FAIL , no baseline at ${BASELINE}. Seed it with --write on the run that resolves the capitals.`); process.exit(1); }

const rose = [];
for (const [file, n] of uses) { const b = base[file] ?? 0; if (n > b) rose.push(`${file}: ${b} -> ${n}`); }
const fell = Object.entries(base).filter(([file, b]) => (uses.get(file) ?? 0) < b).map(([file, b]) => `${file}: ${b} -> ${uses.get(file) ?? 0}`);
console.log(`no caps labels: ${files.length} files, ${total} use(s) of capitals in ${uses.size} file(s), none new`.replace(", none new", rose.length ? "" : ", none new"));
if (rose.length) {
  console.error("\nFAIL , capitals rose where words are read:");
  for (const r of rose) console.error(`     ${r}`);
  console.error("Set the label in sentence case: a label at --t-body, a card title at --t-lead in ink, a chip's words as written.");
  console.error("Capitals stay only for a table's column heads. Never raise the baseline.");
  process.exit(1);
}
if (fell.length) console.log(`  fell: ${fell.join("; ")}. Lower the baseline with --write in the same commit.`);
console.log("PASS verify_no_caps_labels");
