/**
 * THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26, rulings 14, 20, 33): one paid plan at $38 a month or $238 a year,
 * dollars everywhere, the Stripe price ids read by name, a price written one way.
 *
 * Run: npx tsx tests/monetization/pro_plan.test.ts
 */
import { PRO, proPriceId, intervalOfPrice, priceLine } from "../../src/lib/monetization/plan";
import { gateValue } from "../../src/lib/monetization/viewer_tier";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "pro-plan";
const FILE = "src/lib/monetization/plan.ts";
const REMEDY = "keep one plan, Pro, at $38 a month and $238 a year, its price ids read from STRIPE_PRICE_PRO_MONTHLY and STRIPE_PRICE_PRO_ANNUAL";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const env = { STRIPE_PRICE_PRO_MONTHLY: "price_m", STRIPE_PRICE_PRO_ANNUAL: " price_y " };
check("the plan is Pro at 38 and 238", PRO.name === "Pro" && PRO.monthlyUsd === 38 && PRO.yearlyUsd === 238);
check("the monthly price id is read by name", proPriceId("month", env) === "price_m");
check("the yearly price id is read by name, trimmed", proPriceId("year", env) === "price_y");
check("an unset price id is null (billing dormant)", proPriceId("month", {}) === null && proPriceId("year", { STRIPE_PRICE_PRO_ANNUAL: "  " }) === null);
check("a price id maps back to its interval", intervalOfPrice("price_m", env) === "month" && intervalOfPrice("price_y", env) === "year");
check("a price that is not Pro's maps to nothing", intervalOfPrice("price_basic", env) === null && intervalOfPrice(null, env) === null);
check("a price is written one way", priceLine("month") === "$38 a month" && priceLine("year") === "$238 a year");
check("a free viewer gets no gated value", gateValue(5, "pro", "free") === null);
check("a Pro viewer gets the gated value", gateValue(5, "pro", "pro") === 5);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/pro_plan: all pass");
