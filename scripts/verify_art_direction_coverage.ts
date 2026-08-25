/**
 * verify_art_direction_coverage , THE COVERAGE CLAIM MUST MATCH WHAT RUNS.
 *
 * Section J of the art direction says which of its 55 rules a gate holds. That
 * claim drifted THREE TIMES IN ONE DAY on 2026-08-25: section J itself first
 * said fifteen when seven ran, a design spec said thirteen, the founder sheet
 * said fifteen, and a hand "correction" named two rules (C1, H8) that appear
 * only inside comments explaining why OTHER checks carve out exemptions.
 *
 * A coverage claim nobody verifies is worse than no claim, because it stops
 * anyone looking. So this gate reads the claim and checks it against behaviour.
 *
 * IT DERIVES THE TRUTH FROM WHAT A GATE CAN EMIT, NOT FROM WHAT IT DECLARES.
 * A declaration would drift exactly like the prose does. Rule ids are read out
 * of the finding lines each gate prints, with comments stripped first , that
 * strip is the whole reason a grep miscounted C1 and H8 as enforced.
 *
 * Three faults it catches:
 *   1. A gate section J names does not exist.
 *   2. A gate section J names is not in the prebuild chain, so the rule is
 *      documented as held and is held by nothing. This is the one that has
 *      actually happened, to 59 gates at once, on 2026-08-19.
 *   3. A rule enforced but undocumented, or documented but unenforced.
 *
 * BLIND SPOT: for a gate whose findings never name a lettered rule (the frost
 * floor, the band ban), this can only check that the gate exists and runs. It
 * cannot confirm the gate checks the rule the table attributes to it. Those
 * rows are reported as unverifiable rather than passed silently.
 *
 * Usage: npx tsx scripts/verify_art_direction_coverage.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { stripCommentLines } from "./lib/strip_comments";

const DOC = "E:/atlas/design/ART-DIRECTION.md";
const CHAIN = "scripts/prebuild_all.ts";
const fail: string[] = [];
const note: string[] = [];

if (!existsSync(DOC)) {
  console.log(`x verify_art_direction_coverage: the art direction is not at ${DOC}`);
  process.exit(1);
}
const doc = readFileSync(DOC, "utf8");

const jStart = doc.indexOf("## J.");
const jEnd = doc.indexOf("## K.", jStart);
if (jStart < 0 || jEnd < 0) {
  console.log("x verify_art_direction_coverage: section J is missing from the art direction.");
  process.exit(1);
}
const section = doc.slice(jStart, jEnd);

type Row = { ruleId: string | null; label: string; gate: string };
const claimed: Row[] = [];
/* TOLERATE THE CARRIAGE RETURN, both in the split and at the end of the row.
   The document is checked out CRLF, the row regex anchored on the closing pipe,
   and every row failed to match: the gate reported the table missing entirely
   rather than reporting a mismatch. It found that fault on its own document
   within the hour of being written. */
for (const line of section.split(/\r?\n/)) {
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([a-z0-9-]+)\s*\|\s*\w+\s*\|\s*$/);
  if (!m) continue;
  if (/^Rule$/i.test(m[1]) || /^-+$/.test(m[1])) continue;
  const ruleId = (m[1].match(/^([A-L]\d+)\b/) || [])[1] || null;
  claimed.push({ ruleId, label: m[1], gate: m[2] });
}
if (!claimed.length) {
  console.log("x verify_art_direction_coverage: section J has no gated table any more.");
  process.exit(1);
}

const chain = existsSync(CHAIN) ? readFileSync(CHAIN, "utf8") : "";
const byGate = new Map<string, Row[]>();
for (const c of claimed) {
  if (!byGate.has(c.gate)) byGate.set(c.gate, []);
  byGate.get(c.gate)!.push(c);
}

/* Rule ids a gate can actually print, taken from its finding lines with comments
   stripped. A gate that names no rule id is not a fault; it is unverifiable. */
function emitted(file: string): Set<string> {
  const lines = stripCommentLines(readFileSync(file, "utf8").split(/\r?\n/));
  const ids = new Set<string>();
  for (const line of lines) {
    if (/rule:\s*"[A-L]\d+"/.test(line)) {
      for (const m of line.matchAll(/rule:\s*"([A-L]\d+)"/g)) ids.add(m[1]);
      continue;
    }
    if (!/(lines\.push|console\.log|findings\.push)/.test(line)) continue;
    for (const id of line.match(/\b[A-L]\d+\b/g) || []) ids.add(id);
  }
  return ids;
}

for (const [gate, rows] of byGate) {
  const base = `scripts/verify_${gate.replace(/-/g, "_")}`;
  const file = [".mjs", ".ts", ".js"].map((e) => base + e).find(existsSync);
  if (!file) {
    fail.push(`section J names the gate "${gate}" and no such gate exists`);
    continue;
  }
  /* MATCH THE WHOLE FILENAME, NOT A SUBSTRING OF IT. Renaming the frost gate to
     verify_frost_reads_DISABLED took it out of the chain and this check did not
     notice, because the old name is a prefix of the new one. Caught by the
     negative test, which is the only reason it is not still here. */
  const named = new RegExp(file.replace(/[.]/g, "[.]") + "[\"'`\s,)]").test(chain);
  if (chain && !named) {
    fail.push(
      `the gate "${gate}" is not in the prebuild chain, so ${rows
        .map((r) => r.ruleId || r.label)
        .join(", ")} is documented as held and is held by nothing`,
    );
    continue;
  }
  const can = emitted(file);
  if (!can.size) {
    note.push(
      `${gate}: names no rule id in its findings, so its ${rows.length} row${rows.length > 1 ? "s" : ""} can only be checked as far as existing and running`,
    );
    continue;
  }
  for (const r of rows) {
    if (r.ruleId && !can.has(r.ruleId)) {
      fail.push(`section J credits "${gate}" with ${r.ruleId} and that gate never emits it`);
    }
  }
  const documented = new Set(rows.map((r) => r.ruleId).filter(Boolean));
  for (const id of can) {
    if (!documented.has(id) && !claimed.some((c) => c.ruleId === id)) {
      fail.push(`"${gate}" enforces ${id} and section J does not say so, so the coverage claim understates itself`);
    }
  }
}

const total = (doc.match(/^\*\*[A-L]\d+/gm) || []).length;
const lettered = new Set(claimed.map((c) => c.ruleId).filter(Boolean)).size;

if (fail.length) {
  console.log("x verify_art_direction_coverage: section J does not describe what runs.");
  fail.forEach((f) => console.log(`     ${f}`));
  process.exit(1);
}
note.forEach((n) => console.log(`  note  ${n}`));
console.log(`PASS verify_art_direction_coverage. ${lettered} of ${total} rules gated, and section J says so.\n`);
