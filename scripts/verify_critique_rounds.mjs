#!/usr/bin/env node
/**
 * verify_critique_rounds , A ROUND MAY ONLY IMPROVE ON THE ONE BEFORE IT.
 *
 * The whole point of writing rounds down is that round N+1 starts from N. Without
 * something enforcing that, the record is a diary: pleasant to keep, and no
 * obstacle to making the same mistake twice.
 *
 * WHAT IT HOLDS:
 *
 *   1. wrong + weak, summed across the round, MAY ONLY FALL. This is the ratchet.
 *      Findings can move between dimensions and sections; the total cannot grow.
 *   2. A node judged `wrong` in the previous round must carry a verdict in this
 *      one. Silence on a known fault reads as a fix and is not one.
 *   3. `unjudged` must be explained. It is a real verdict, and it is also the
 *      category that hides things: a card that quietly stopped drawing would move
 *      from good to unjudged while the fault count FELL.
 *   4. Coverage may not fall. If a round judged 90 nodes, the next cannot judge 40
 *      and call the drop in findings progress.
 *
 * WHAT IT CANNOT SEE, stated because the number will be quoted: it cannot tell a
 * genuine improvement from a lenient judge. Two rounds by different standards are
 * not comparable, and nothing here detects that. The notes are the only defence,
 * which is why a weak or wrong verdict without one is refused at recording time.
 *
 * Usage: node scripts/verify_critique_rounds.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

const DIR = "E:/atlas/design/critique";

if (!existsSync(DIR)) {
  console.log("PASS verify_critique_rounds. No critique rounds recorded yet.\n");
  process.exit(0);
}

const rounds = readdirSync(DIR)
  .filter((f) => /^round-\d{4}-\d{2}-\d{2}\.json$/.test(f))
  .sort();

if (rounds.length < 2) {
  console.log(`PASS verify_critique_rounds. ${rounds.length} round(s) recorded; a ratchet needs two.\n`);
  process.exit(0);
}

const load = (f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
const prev = load(rounds[rounds.length - 2]);
const cur = load(rounds[rounds.length - 1]);

const open = (r) => r.counts.wrong + r.counts.weak;
const fail = [];

if (open(cur) > open(prev)) {
  fail.push(
    `open findings rose from ${open(prev)} to ${open(cur)} (${prev.date} to ${cur.date}). ` +
    `This may only come DOWN. Do not re-baseline it: if the earlier round was lenient, say so in the round note rather than moving the line.`,
  );
}

if (cur.nodesCovered < prev.nodesCovered) {
  fail.push(
    `coverage fell from ${prev.nodesCovered} to ${cur.nodesCovered} nodes. ` +
    `A smaller round finding fewer faults is not a better round.`,
  );
}

/* Every node the previous round called wrong must be spoken about again. */
const wasWrong = new Set(prev.entries.filter((e) => e.verdict === "wrong").map((e) => `${e.node}|${e.dim}`));
const nowSpoken = new Set(cur.entries.map((e) => `${e.node}|${e.dim}`));
const silent = [...wasWrong].filter((k) => !nowSpoken.has(k));
if (silent.length) {
  fail.push(`${silent.length} finding(s) called WRONG last round carry no verdict this round: ${silent.slice(0, 4).join(", ")}. Silence on a known fault reads as a fix.`);
}

const unexplained = cur.entries.filter((e) => e.verdict === "unjudged" && !e.note);
if (unexplained.length) {
  fail.push(`${unexplained.length} unjudged verdict(s) carry no explanation. Say what evidence is missing.`);
}

if (fail.length) {
  console.log("x verify_critique_rounds: this round does not improve on the last one.");
  fail.forEach((f) => console.log(`     ${f}`));
  process.exit(1);
}

const fixed = [...wasWrong].filter((k) => {
  const e = cur.entries.find((x) => `${x.node}|${x.dim}` === k);
  return e && e.verdict === "good";
}).length;

console.log(
  `PASS verify_critique_rounds. ${cur.date}: ${open(cur)} open findings over ${cur.nodesCovered} nodes, ` +
  `down from ${open(prev)} over ${prev.nodesCovered} on ${prev.date}. ${fixed} of last round's wrongs are now good.\n`,
);
