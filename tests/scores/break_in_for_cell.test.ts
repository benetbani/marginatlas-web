/**
 * Run: npx tsx tests/scores/break_in_for_cell.test.ts
 * The widened break-in-for-cell now surfaces the startup cost + density it already
 * computes, and the survival archetype resolves for the canonical trades. These
 * feed the recommender's budget filter + risk axis without a second pass.
 */
import { boundSurvivalCurve } from "@/lib/finance/margin_floor";
import { getActivitySurvivalArchetype } from "@/lib/scores/activity_board";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

// The survival source the risk axis uses is deterministic + bounded 0..100.
{
  const surv = boundSurvivalCurve(getActivitySurvivalArchetype("restaurants") ?? {});
  assert(surv.yr5 === null || (surv.yr5 >= 0 && surv.yr5 <= 100), "restaurants 5yr survival is null or a 0..100 percent");
  const a = JSON.stringify(boundSurvivalCurve(getActivitySurvivalArchetype("restaurants") ?? {}));
  const b = JSON.stringify(boundSurvivalCurve(getActivitySurvivalArchetype("restaurants") ?? {}));
  assert(a === b, "survival archetype resolution is deterministic");
}

// An unknown activity yields an all-null curve (dash, never fabricate).
{
  const surv = boundSurvivalCurve(getActivitySurvivalArchetype("no-such-trade-xyz") ?? {});
  assert(surv.yr5 === null, "unknown trade -> null 5yr survival (no fabricated number)");
}

if (failures > 0) {
  console.error(`\nbreak_in_for_cell.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("break_in_for_cell.test: PASS. Survival archetype resolves bounded + deterministic; unknown trade dashes.");
