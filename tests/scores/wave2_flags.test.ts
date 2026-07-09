/**
 * Run: npx tsx tests/scores/wave2_flags.test.ts
 * The Wave 2 page flags default OFF so live / and (a would-be) /margin-index stay
 * the old surfaces until the founder flips them after the dev-route eyeball.
 */
import { isMarginIndexEnabled, isHomeReformEnabled } from "@/lib/feature_flags";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

{
  delete process.env.NEXT_PUBLIC_MARGIN_INDEX;
  delete process.env.NEXT_PUBLIC_HOME_REFORM;
  assert(isMarginIndexEnabled() === false, "margin-index unset -> OFF");
  assert(isHomeReformEnabled() === false, "home-reform unset -> OFF");
  process.env.NEXT_PUBLIC_MARGIN_INDEX = "1";
  process.env.NEXT_PUBLIC_HOME_REFORM = "on";
  assert(isMarginIndexEnabled() === true, "margin-index '1' -> ON");
  assert(isHomeReformEnabled() === true, "home-reform 'on' -> ON");
  process.env.NEXT_PUBLIC_MARGIN_INDEX = "off";
  assert(isMarginIndexEnabled() === false, "margin-index 'off' -> OFF");
  delete process.env.NEXT_PUBLIC_MARGIN_INDEX;
  delete process.env.NEXT_PUBLIC_HOME_REFORM;
}

if (failures > 0) {
  console.error(`\nwave2_flags.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("wave2_flags.test: PASS. Wave 2 flags default off, parse both polarities.");
