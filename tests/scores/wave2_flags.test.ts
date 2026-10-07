/**
 * Run: npx tsx tests/scores/wave2_flags.test.ts
 * The margin-index flag defaults OFF so (a would-be) /margin-index stays the old surface until the founder flips it after the
 * dev-route eyeball. The home reform defaults ON since 2026-10-07 (his ruling "Measure, then go live", after the visual gates
 * passed on the rebuilt home): unset is ON, and NEXT_PUBLIC_HOME_REFORM=0 (off, false, no) turns it off.
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
  assert(isHomeReformEnabled() === true, "home-reform unset -> ON (the default since 2026-10-07)");
  process.env.NEXT_PUBLIC_MARGIN_INDEX = "1";
  process.env.NEXT_PUBLIC_HOME_REFORM = "on";
  assert(isMarginIndexEnabled() === true, "margin-index '1' -> ON");
  assert(isHomeReformEnabled() === true, "home-reform 'on' -> ON");
  process.env.NEXT_PUBLIC_MARGIN_INDEX = "off";
  assert(isMarginIndexEnabled() === false, "margin-index 'off' -> OFF");
  for (const off of ["0", "off", "false", "no"]) {
    process.env.NEXT_PUBLIC_HOME_REFORM = off;
    assert(isHomeReformEnabled() === false, `home-reform '${off}' -> OFF (the one way to turn the rebuilt home off)`);
  }
  process.env.NEXT_PUBLIC_HOME_REFORM = "";
  assert(isHomeReformEnabled() === true, "home-reform empty -> the default, ON");
  process.env.NEXT_PUBLIC_HOME_REFORM = "maybe";
  assert(isHomeReformEnabled() === true, "home-reform an unknown value -> the default, ON");
  delete process.env.NEXT_PUBLIC_MARGIN_INDEX;
  delete process.env.NEXT_PUBLIC_HOME_REFORM;
}

if (failures > 0) {
  console.error(`\nwave2_flags.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("wave2_flags.test: PASS. The margin-index flag defaults off, the home reform defaults on (=0 turns it off), both parse both polarities.");
