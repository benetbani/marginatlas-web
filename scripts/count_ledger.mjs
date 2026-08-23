/**
 * count_ledger , count the ledger's rows by status.
 *
 * The summary line in LEDGER.md was hand-typed and drifted: on 2026-08-23 it
 * claimed 7 replaced, 13 blocked and 17 to go against a real 5, 12 and 20. The
 * loop reads that line to decide how much is left, so a wrong line is a wrong
 * plan. This repo has already paid for hand-typed counts once: the gate count
 * alone reached ten different values across 32 files by being typed confidently.
 *
 * WHAT THIS CANNOT DISTINGUISH: a row whose status cell contains two words it
 * recognises. Those are reported separately rather than guessed at.
 *
 *   node scripts/count_ledger.mjs
 */
import { readFileSync } from "node:fs";

const rows = readFileSync("docs/loop/shadcn-upgrade/LEDGER.md", "utf8")
  .split("\n")
  .filter((l) => /^\| \d+[ab]? \|/.test(l));

const tally = { TODO: 0, BLOCKED: 0, "KEPT/FIXED": 0, "REPLACED/RETIRED": 0, VOID: 0 };
const odd = [];

for (const line of rows) {
  const status = line.replace(/\*/g, "").split("|").slice(1, -1).pop().trim();
  if (status.includes("TODO")) tally.TODO++;
  else if (status.includes("VOID")) tally.VOID++;
  else if (status.includes("BLOCKED") && !status.includes("FIXED")) tally.BLOCKED++;
  else if (status.includes("DONE-REPLACED") || status.includes("RETIRED")) tally["REPLACED/RETIRED"]++;
  else if (status.includes("DONE-KEPT") || status.includes("FIXED") || status.includes("LOCKED"))
    tally["KEPT/FIXED"]++;
  else odd.push(status);
}

console.log(`\n  ${rows.length} rows`);
for (const [k, v] of Object.entries(tally)) console.log(`    ${k.padEnd(18)} ${v}`);
if (odd.length) {
  console.log(`\n  ${odd.length} status cell(s) this counter does not recognise:`);
  for (const o of odd) console.log(`    ${o}`);
}
console.log("");
