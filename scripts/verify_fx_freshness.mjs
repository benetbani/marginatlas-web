#!/usr/bin/env node
/**
 * verify_fx_freshness , the DISPLAY exchange rates must not go stale silently.
 *
 * THE GATE THE CODE ALREADY PROMISED. src/lib/finance/fx.ts has carried the line
 * "The verify_fx_freshness gate (TODO) will flag rates older than 6 months"
 * since it was written. It was never built, and on 2026-08-08 the display rates
 * in src/lib/currency.ts were found 2.7 months old with three of five past the
 * file's own "refresh on >5% drift" rule: EUR was 6.1% high, AUD 5.6%, GBP 4.9%.
 * A reader switching a live cell page to euros was reading figures 6% wrong.
 * Fixing the rates without this gate just schedules the same defect for winter.
 *
 * WHY THIS CHECKS ONE FILE AND DELIBERATELY IGNORES THE OTHER.
 *
 * The two FX modules do different jobs and only one of them should ever be
 * refreshed:
 *
 *   src/lib/currency.ts     DISPLAY. Converts a stored USD figure into the
 *                           currency a reader picked, now. Current rate is the
 *                           only correct rate, so age is a defect.
 *
 *   src/lib/finance/fx.ts   PARSE-TIME. Pins AUD at the rate the Australian
 *                           source data was read at, so a published benchmark
 *                           keeps the value it had when it was captured. Its
 *                           2024-12-31 date is CORRECT and refreshing it would
 *                           silently restate every AU figure. Its own comment
 *                           says "locked at parse time".
 *
 * So fx.ts being nineteen months old is not staleness, it is the point. The
 * "review cadence: quarterly" line in that file contradicts its own purpose and
 * is what made this look like a defect at first glance. Numbeo splits the same
 * two jobs the same way: it stores each input at the rate on the day of input
 * and displays at a near-hourly current rate.
 *
 * TWO THRESHOLDS, because the two files that state a cadence disagree.
 * currency.ts says "refresh quarterly"; fx.ts's TODO says six months. Warn at
 * the quarter, fail at six months: the build does not break the morning a
 * quarter turns, and it cannot be ignored forever.
 *
 * Run: node scripts/verify_fx_freshness.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const DISPLAY = "src/lib/currency.ts";
const WARN_DAYS = 92;
const FAIL_DAYS = 183;

const src = readFileSync(resolve(ROOT, DISPLAY), "utf8");

/* The refresh stamp. Kept as a comment beside the rates rather than as an
   exported constant, because it documents an edit rather than feeding one. */
const m = src.match(/Refreshed\s+(\d{4})-(\d{2})-(\d{2})/);
if (!m) {
  console.error(
    `x verify_fx_freshness: no "Refreshed YYYY-MM-DD" stamp found in ${DISPLAY}.\n` +
      `  The rate table must carry the date it was last checked, or nothing can\n` +
      `  tell a fresh rate from a forgotten one.`,
  );
  process.exit(1);
}

const stamped = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
const now = new Date();
const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
const days = Math.floor((today - stamped) / 86_400_000);

if (days < 0) {
  console.error(`x verify_fx_freshness: ${DISPLAY} is stamped ${m[0]}, which is in the future.`);
  process.exit(1);
}

const head = `verify_fx_freshness: display rates stamped ${m[1]}-${m[2]}-${m[3]}, ${days} day(s) old.`;

if (days >= FAIL_DAYS) {
  console.error(
    `x ${head}\n` +
      `  Past the ${FAIL_DAYS}-day limit. Refresh the USD_TO table in ${DISPLAY}\n` +
      `  against mid-market rates and move the "Refreshed" stamp with it.\n` +
      `  Do NOT touch src/lib/finance/fx.ts: its rate is pinned at parse time on\n` +
      `  purpose and refreshing it would restate every Australian figure.`,
  );
  process.exit(1);
}

if (days >= WARN_DAYS) {
  console.log(`  ${head}`);
  console.log(`  Past the ${WARN_DAYS}-day review cadence. Not failing until ${FAIL_DAYS}.`);
  process.exit(0);
}

console.log(`${head} Within the ${WARN_DAYS}-day cadence.`);
process.exit(0);
