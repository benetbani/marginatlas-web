/**
 * Run: npx tsx tests/scores/recommender_flag.test.ts
 * The recommender flag defaults OFF so live /decide stays the old page until the
 * founder flips NEXT_PUBLIC_RECOMMENDER after the eyeball.
 */
import { isRecommenderEnabled } from "@/lib/feature_flags";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

{
  delete process.env.NEXT_PUBLIC_RECOMMENDER;
  assert(isRecommenderEnabled() === false, "unset -> OFF (old /decide stays live)");
  process.env.NEXT_PUBLIC_RECOMMENDER = "1";
  assert(isRecommenderEnabled() === true, "explicit 1 -> ON");
  process.env.NEXT_PUBLIC_RECOMMENDER = "off";
  assert(isRecommenderEnabled() === false, "explicit off -> OFF");
  delete process.env.NEXT_PUBLIC_RECOMMENDER;
}

if (failures > 0) {
  console.error(`\nrecommender_flag.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("recommender_flag.test: PASS. Recommender flag defaults off, parses both polarities.");
