#!/usr/bin/env npx tsx
/**
 * verify_take_home_identity , the printed take-home may never sit below the
 * margin the same surface shows.
 *
 * WHY THIS GATE EXISTS. Two independent defects of the same shape were found on
 * 2026-08-17, both of them a surface printing an owner take-home beside a net
 * margin that the number contradicts:
 *
 *   - London's curated market file disagreed with its own margin on ALL TWENTY
 *     activities. Restaurants printed $720,000 revenue, "Net margin 5%" and
 *     "Owner take-home $48K"; 5% of $720,000 is $36,000. Gaps ran +10% to
 *     +101%, and hotels ran -19%, printing a take-home BELOW its own shown
 *     margin. The curated branch short-circuited the resolver entirely.
 *   - The homepage beats and the across-cities rows printed
 *     `estimateNetProfit().net_profit` RAW beside a margin floored at 3% by
 *     `clampMargin`. Swept over 17,496 industry x country x revenue combos they
 *     agreed 38.3% of the time. The worst case printed **$1** beside "3% net"
 *     of $150,000, which the cell page renders as $4,500.
 *
 * Both are the same mistake: deriving the figure locally instead of routing
 * through `resolveOwnerTakeHome`, which exists precisely to reconcile the two.
 *
 * WHAT THE INVARIANT ACTUALLY IS, and it is NOT what the handover said. The
 * report that prompted this gate asked for "take-home EQUALS shown-margin x
 * revenue". Reading the module first, that assertion is wrong and a gate built
 * on it would fail on correct data and be switched off inside a week:
 *
 *     base = max(structuralNetProfit, clampMargin(rawNetMargin) * revenue)
 *     result = isLargerFirm && base < annualIncome*2 ? annualIncome*2 : base
 *
 * The structural profit is allowed to EXCEED the margin floor, and the
 * larger-firm floor may lift the answer further. So equality is not the
 * contract. The contract is a floor, in one direction only:
 *
 *     take-home >= clampMargin(shown margin) * revenue
 *
 * That is exactly the direction both defects broke, and the only direction that
 * can be asserted without contradicting the resolver's own design.
 *
 * TWO PARTS, because the contract and the call sites fail differently.
 *
 * PART A, the contract. Sweeps the resolver over a parameter grid and asserts
 * the floor holds. Zero tolerance, not a ratchet: there is no legitimate input
 * for which a take-home may sit below its own shown margin.
 *
 * PART B, the bypasses. A module that DERIVES a take-home from profit or margin
 * without importing the resolver is the defect class, and both bugs were of it.
 * A file that merely RECEIVES a figure and formats it is not the defect and is
 * not counted; classification happens before counting, which is why the
 * derive-signal list is explicit rather than a bare mention of the word.
 *
 * THIS WAS A FLAT COUNT, AND THE FLAT COUNT WAS WRONG. It began at ten and
 * ratcheted to six, and there it stops forever, because those six were each
 * measured and found CLEAN. `london/market.ts` IS the correction; `cell_board`
 * receives the resolver's answer from all four callers, 244 of 244 unrounded;
 * `adapt_city` and `adapt_industry` match their own recomputed builders at a
 * worst gap of $0. They match the SHAPE, not the defect.
 *
 * A ratchet stuck at six reads as six outstanding defects when the true number
 * is zero, and both ways out of that are bad: import the resolver into a
 * formatter purely to quiet the gate, which is dishonest, or teach everyone to
 * ignore the number. So the baseline has TWO BUCKETS. `unreviewed` must be
 * EMPTY, and a module that matches the shape and has not been checked is the
 * only thing treated as a failure. `reviewed` holds the measured-clean ones
 * with their evidence, and an entry that stops matching the shape must still be
 * deleted, so it only ever counts down.
 *
 * A THIRD BLIND SPOT that comes with the reviewed bucket: a verdict is recorded
 * against a FILE, and nothing here can tell that the file has since changed
 * underneath its verdict. It proves somebody looked, not that the finding still
 * holds.
 *
 * BLIND SPOTS, stated so the pass is not over-read:
 *   - Part A proves the resolver's contract over a parameter GRID, not over the
 *     live cell population. It bounds the derivation, never the page count.
 *   - Part B reads source text. It sees a module that MENTIONS the parts, not a
 *     pixel a reader sees, and it cannot tell a derivation that renders from one
 *     behind a flag that is off.
 *   - Neither half can see a figure that arrives already wrong from stored data.
 *     That is what the London fix addressed and no source check could have.
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";
import { resolveOwnerTakeHome } from "../src/lib/finance/owner_take_home";
import { clampMargin } from "../src/lib/finance/margin_floor";

const PROJECT_ROOT = process.cwd();
const BASELINE = resolve(PROJECT_ROOT, "scripts/take_home_bypass_baseline.json");
const SELF = "scripts/verify_take_home_identity.ts";

/* ---------------------------------------------------------------- PART A */

const REVENUES = [0, 1, 25_000, 150_000, 503_000, 720_000, 4_000_000, 90_000_000];
const MARGINS = [-0.4, -0.02, 0, 0.005, 0.03, 0.05, 0.11, 0.28, 0.6];
const PROFITS = [null, -50_000, 0, 1, 4_500, 36_000, 48_000, 2_000_000];
const INDUSTRIES = [null, "restaurants", "hotels-lodging", "software-development", "specialty-trades"];
const INCOMES = [null, 0, 18_000, 64_800];

function partA(): string[] {
  const failures: string[] = [];
  let checked = 0;

  for (const revenue of REVENUES)
    for (const rawNetMargin of MARGINS)
      for (const structuralNetProfit of PROFITS)
        for (const industryId of INDUSTRIES)
          for (const isLargerFirm of [false, true])
            for (const annualIncome of INCOMES) {
              const out = resolveOwnerTakeHome({
                structuralNetProfit,
                rawNetMargin,
                revenue,
                industryId,
                isLargerFirm,
                annualIncome,
              });
              const floor = clampMargin(rawNetMargin, "net", industryId) * revenue;
              checked++;
              if (out == null) continue;
              // Tolerance is a cent: this is a floating-point comparison on money,
              // not a licence for a figure to drift below its own margin.
              if (out < floor - 0.01) {
                failures.push(
                  `take-home ${out} < margin floor ${floor}  ` +
                    `[rev=${revenue} margin=${rawNetMargin} profit=${structuralNetProfit} ` +
                    `industry=${industryId} larger=${isLargerFirm} income=${annualIncome}]`,
                );
              }
            }

  if (failures.length === 0) console.log(`[take-home] contract: ${checked} combinations, floor holds in all of them.`);
  return failures;
}

/* ---------------------------------------------------------------- PART B */

/** Reaching for these means a module BUILDS the figure rather than receiving it. */
const DERIVE_SIGNALS = [
  /estimateNetProfit\s*\(/,
  /\bnet_profit\b/,
  /\bnetProfit\b/,
  /\bclampMargin\s*\(/,
  /\bnet_margin_pct\b/,
  /\brawNetMargin\b/,
];
const TAKE_HOME = /take[_]?home|ownerKeeps|owner_keeps/i;

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry).replace(/\\/g, "/");
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(p)) acc.push(p);
  }
  return acc;
}

function partB(): { bypasses: string[]; failures: string[] } {
  const bypasses: string[] = [];
  for (const file of walk("src")) {
    const state = newCommentState();
    const code = readFileSync(file, "utf-8")
      .split(/\r?\n/)
      .map((l) => stripComments(l, state))
      .join("\n");
    if (!TAKE_HOME.test(code)) continue;
    if (/resolveOwnerTakeHome/.test(code)) continue;
    if (!DERIVE_SIGNALS.some((re) => re.test(code))) continue;
    bypasses.push(file);
  }
  bypasses.sort();

  const failures: string[] = [];
  if (!existsSync(BASELINE)) {
    // A fresh baseline records everything as UNREVIEWED, which fails until
    // somebody measures each one. The gate must never bootstrap itself clean.
    writeFileSync(BASELINE, JSON.stringify({ unreviewed: bypasses, reviewed: {} }, null, 2) + "\n");
    console.log(`[take-home] bypass baseline written: ${bypasses.length} unreviewed.`);
    return { bypasses, failures };
  }

  const raw = JSON.parse(readFileSync(BASELINE, "utf-8"));
  const reviewed: Record<string, string> = raw.reviewed ?? {};
  const unreviewed: string[] = raw.unreviewed ?? [];
  const known = new Set([...Object.keys(reviewed), ...unreviewed]);

  const added = bypasses.filter((f) => !known.has(f));
  const cleared = [...known].filter((f) => !bypasses.includes(f)).sort();

  if (added.length > 0) {
    failures.push(
      `${added.length} module(s) derive a take-home without resolveOwnerTakeHome` +
        ` and have not been reviewed:\n` +
        added.map((f) => `    ${f}`).join("\n"),
    );
  }
  if (unreviewed.length > 0) {
    failures.push(
      `${unreviewed.length} entr(y/ies) sit in "unreviewed". Measure each, then either` +
        ` route it through the resolver or move it to "reviewed" WITH the evidence:\n` +
        unreviewed.map((f) => `    ${f}`).join("\n"),
    );
  }
  if (cleared.length > 0) {
    failures.push(
      `${cleared.length} entr(y/ies) no longer match the bypass shape and must be` +
        ` deleted from ${BASELINE} in this same commit, so this only counts down:\n` +
        cleared.map((f) => `    ${f}`).join("\n"),
    );
  }
  if (failures.length === 0) {
    console.log(
      `[take-home] bypasses: 0 unreviewed, ${Object.keys(reviewed).length} reviewed and measured clean.`,
    );
  }
  return { bypasses, failures };
}

/* ------------------------------------------------------------------ main */

const a = partA();
const b = partB();

if (a.length > 0) {
  console.error(`\n[take-home] FAIL: the resolver's own floor is broken in ${a.length} case(s):\n`);
  for (const f of a.slice(0, 12)) console.error(`  ${f}`);
  if (a.length > 12) console.error(`  ... and ${a.length - 12} more`);
  console.error(
    `\n  A printed take-home must never sit BELOW the dollars its own shown\n` +
      `  margin implies. That is the direction both 2026-08-17 defects broke:\n` +
      `  hotels printed -19% against its margin, and a homepage card printed $1\n` +
      `  beside "3% net" of $150,000.`,
  );
}
if (b.failures.length > 0) {
  console.error(`\n[take-home] FAIL:\n`);
  for (const f of b.failures) console.error(`  ${f}`);
  console.error(
    `\n  src/lib/finance/owner_take_home.ts exists to reconcile the structural\n` +
      `  profit with the SHOWN margin. A module that derives the figure itself\n` +
      `  prints a number the cell page will contradict. Route it through\n` +
      `  resolveOwnerTakeHome, or if it genuinely cannot, say why in the file\n` +
      `  and leave its baseline entry in place.\n` +
      `  Do NOT add an entry to make this pass.`,
  );
}

if (a.length > 0 || b.failures.length > 0) process.exit(1);
console.log(`[take-home] PASS (${SELF})`);
