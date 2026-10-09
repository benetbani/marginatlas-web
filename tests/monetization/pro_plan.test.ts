/**
 * THE ONE PRO PLAN (milestone 2; rulings 20 and 33; his decision of 2026-10-09 over ruling 14's price): one plan, Pro, at $48 a month or $456 a year, led with as "$38 a month, billed yearly".
 * Dollars everywhere, the Stripe price ids read by name, a price written one way, every other figure worked out from the two
 * prices, and the launch runbook naming the same two. His decision replaced ruling 14's $238 year.
 *
 * Run: npx tsx tests/monetization/pro_plan.test.ts
 */
import { readFileSync } from "node:fs";
import {
  PRO,
  YEARLY_BY_MONTH_USD,
  YEARLY_SAVING_USD,
  proPriceId,
  intervalOfPrice,
  priceLine,
  yearlyByMonthLine,
  yearlyHeadline,
  yearlySavingLine,
  monthToMonthLine,
} from "../../src/lib/monetization/plan";
import { gateValue } from "../../src/lib/monetization/viewer_tier";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "pro-plan";
const FILE = "src/lib/monetization/plan.ts";
const REMEDY = "keep one plan, Pro, at $48 a month and $456 a year, the year led with as $38 a month billed yearly, every figure worked out in plan.ts from those two prices, its price ids read from STRIPE_PRICE_PRO_MONTHLY and STRIPE_PRICE_PRO_ANNUAL";
let failed = 0;
/* A check may be a value or a function: a function that throws (a name the plan does not export yet) is a failed check, so one
   missing name does not hide the checks after it. */
const check = (label: string, ok: boolean | (() => boolean)) => {
  let pass = false;
  try { pass = typeof ok === "function" ? ok() : ok; } catch { pass = false; }
  if (pass) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const env = { STRIPE_PRICE_PRO_MONTHLY: "price_m", STRIPE_PRICE_PRO_ANNUAL: " price_y " };
check("the plan is Pro at 48 a month and 456 a year", PRO.name === "Pro" && PRO.monthlyUsd === 48 && PRO.yearlyUsd === 456);
check("the monthly price id is read by name", proPriceId("month", env) === "price_m");
check("the yearly price id is read by name, trimmed", proPriceId("year", env) === "price_y");
check("an unset price id is null (billing dormant)", proPriceId("month", {}) === null && proPriceId("year", { STRIPE_PRICE_PRO_ANNUAL: "  " }) === null);
check("a price id maps back to its interval", intervalOfPrice("price_m", env) === "month" && intervalOfPrice("price_y", env) === "year");
check("a price that is not Pro's maps to nothing", intervalOfPrice("price_basic", env) === null && intervalOfPrice(null, env) === null);
check("a price is written one way", priceLine("month") === "$48 a month" && priceLine("year") === "$456 a year");

/* The figures the page prints are worked out from the two prices, never typed beside them. */
check("the year by the month is worked out from the yearly price: 456 / 12 = 38", () => YEARLY_BY_MONTH_USD === PRO.yearlyUsd / 12 && YEARLY_BY_MONTH_USD === 38);
check("the saving is worked out from both prices: twelve months at 48 less 456 = 120, which is 20.8 percent", () =>
  YEARLY_SAVING_USD === PRO.monthlyUsd * 12 - PRO.yearlyUsd && YEARLY_SAVING_USD === 120 && Math.round((YEARLY_SAVING_USD / (PRO.monthlyUsd * 12)) * 1000) / 10 === 20.8);
check("the year costs less than twelve months at the monthly price, so the saving the page names is true", PRO.yearlyUsd < PRO.monthlyUsd * 12);

/* His wording of 2026-10-09: the year first, its headline, one plain line, the month one line away. */
check("the year by the month reads \"$38 a month\"", () => yearlyByMonthLine() === "$38 a month");
check("the headline reads \"$38 a month, billed yearly\"", () => yearlyHeadline() === "$38 a month, billed yearly");
check("one plain line gives the yearly total and the saving", () => yearlySavingLine() === "$456 a year, $120 less than twelve months at $48.");
check("the monthly price is one line away: \"or $48 month to month\"", () => monthToMonthLine() === "or $48 month to month");
check("each line is plain: twelve words at most, no em dash, no semicolon, none of the struck words", () =>
  [yearlyByMonthLine(), yearlyHeadline(), yearlySavingLine(), monthToMonthLine()].every((l) => words(l) <= 12 && !l.includes("\u2014") && !l.includes(";") && !/modell?ed|withheld|on file/i.test(l)));

/* The launch runbook's Stripe row names the plan's two prices, so the prices he creates on launch day are the ones the page prints. */
const runbook = readFileSync("docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md", "utf8");
check("the launch runbook's Stripe row names the plan's two prices in US dollars, the yearly one a single yearly charge", () =>
  runbook.includes(`$${PRO.monthlyUsd} every month`) && runbook.includes(`$${PRO.yearlyUsd} every year`) && !/\$38 every month|\$238 every year/.test(runbook));

check("a free viewer gets no gated value", gateValue(5, "pro", "free") === null);
check("a Pro viewer gets the gated value", gateValue(5, "pro", "pro") === 5);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/pro_plan: all pass");
