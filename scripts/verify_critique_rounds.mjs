#!/usr/bin/env node
/**
 * verify_critique_rounds , A ROUND MAY ONLY IMPROVE ON THE ONE BEFORE IT.
 *
 * The whole point of writing rounds down is that round N+1 starts from N. Without
 * something enforcing that, the record is a diary: pleasant to keep, and no
 * obstacle to making the same mistake twice.
 *
 * PER PAGE, NOT PER ROUND, and the reason is a real day. On 2026-08-27 the
 * dossier grew from four pages to seven, because the founder walked the three
 * legacy surfaces the machine had never photographed and rejected them. The next
 * round judged those three pages and found 74 open faults, which is the machine
 * doing exactly its job, and the first version of this gate read the TOTAL and
 * called it a regression: open findings rose, coverage fell, exit 1.
 *
 * A total cannot absorb a scope that widens, and design scope must be allowed to
 * widen, that is how the front door went unjudged for two months. Comparing per
 * page is also simply stricter: under a total, a regression on the city page can
 * hide inside an improvement on the home page and read as progress. Now every
 * page shared by both rounds must improve or hold on its own, and a page new to
 * the record sets its own baseline for the round after it.
 *
 * WHAT IT HOLDS:
 *
 *   1. wrong + weak PER PAGE may only fall or hold, for every page both rounds
 *      cover. Findings can move between dimensions and sections; a page's total
 *      cannot grow.
 *   2. A node judged `wrong` in the previous round must carry a verdict in this
 *      one. Silence on a known fault reads as a fix and is not one.
 *   3. `unjudged` must be explained. It is a real verdict, and it is also the
 *      category that hides things: a card that quietly stopped drawing would move
 *      from good to unjudged while the fault count FELL.
 *   4. Coverage per shared page may not fall, and a page judged once may never
 *      vanish from the record.
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

/* A NODE A FIX REMOVED MUST NOT READ AS LOST COVERAGE. The trade page shrank by
   one block between rounds because a fix merged it away; its nine verdicts retire
   into the round file with the reason, and coverage is compared against nodes
   that still exist in the newest dossier, never against a page as it used to be. */
const dossiers = readdirSync(DIR).filter((f) => /^dossier-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
const nodeUniverse = new Set();
if (dossiers.length) {
  const dz = JSON.parse(readFileSync(`${DIR}/${dossiers[dossiers.length - 1]}`, "utf8"));
  for (const p of dz.pages) for (const n of p.nodes) nodeUniverse.add(`${p.page}-${n.path}`.replace(/[^a-z0-9.-]+/gi, "-"));
}
const stillExists = (node) => nodeUniverse.size === 0 || nodeUniverse.has(node);

const openByPage = (r) => {
  const m = {};
  for (const e of r.entries) {
    if (e.verdict === "wrong" || e.verdict === "weak") m[e.page] = (m[e.page] ?? 0) + 1;
  }
  return m;
};
const coveredByPage = (r) => {
  const sets = {};
  for (const e of r.entries) { if (stillExists(e.node)) (sets[e.page] ??= new Set()).add(e.node); }
  const out = {};
  for (const [k, v] of Object.entries(sets)) out[k] = v.size;
  return out;
};

const fail = [];
const prevOpen = openByPage(prev), curOpen = openByPage(cur);
const prevCov = coveredByPage(prev), curCov = coveredByPage(cur);

for (const page of Object.keys(prevCov)) {
  if (!(page in curCov)) {
    fail.push(`the page "${page}" was judged last round and carries no verdict at all this round. A page cannot leave the record once judged.`);
    continue;
  }
  if ((curOpen[page] ?? 0) > (prevOpen[page] ?? 0)) {
    fail.push(
      `open findings on "${page}" rose from ${prevOpen[page] ?? 0} to ${curOpen[page]} (${prev.date} to ${cur.date}). ` +
      `A page may only improve or hold. Do not re-baseline: if the earlier round was lenient, say so in the round note rather than moving the line.`,
    );
  }
  if ((curCov[page] ?? 0) < prevCov[page]) {
    fail.push(`coverage on "${page}" fell from ${prevCov[page]} to ${curCov[page] ?? 0} nodes. A smaller round finding fewer faults is not a better round.`);
  }
}

/* Every node the previous round called wrong must be spoken about again. */
const wasWrong = new Set(prev.entries.filter((e) => e.verdict === "wrong" && stillExists(e.node)).map((e) => `${e.node}|${e.dim}`));
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

const open = (r) => r.counts.wrong + r.counts.weak;
const newPages = Object.keys(curCov).filter((p) => !(p in prevCov));
const fixed = [...wasWrong].filter((k) => {
  const e = cur.entries.find((x) => `${x.node}|${x.dim}` === k);
  return e && e.verdict === "good";
}).length;

console.log(
  `PASS verify_critique_rounds. ${cur.date}: ${open(cur)} open finding(s) total; every page shared with ${prev.date} improved or held. ` +
  `${fixed} of last round's wrongs are now good.` +
  (newPages.length ? ` New to the record, setting their own baselines: ${newPages.join(", ")}.` : "") + "\n",
);
