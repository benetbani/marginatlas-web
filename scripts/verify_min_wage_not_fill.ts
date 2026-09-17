/**
 * verify_min_wage_not_fill , no printed minimum salary is the 0.45 fill.
 *
 * Plan step 43 (plan-2026-09-17/05-DATA-AND-LAUNCH.md), built with plan step
 * 31's second dispatch on 2026-09-17. `minimum_wage_annual_usd` in
 * data/economic_indicators/country_profile_v2.json equals exactly 0.45 times
 * `median_wage_full_time_usd`, to the dollar, on 148 of its 197 rows (146 of
 * the 195 in the taxonomy; the plan said 171, the measured number wins): a
 * constant ratio is the fingerprint of a fill, not a statutory floor, and
 * with the sample mark switched off it would print as one. The at-a-glance
 * card (src/lib/spine/glance_rows.ts) withholds the cell wherever the figure
 * is within a dollar of 0.45 times the median or the row is not tier A; this
 * gate is what keeps that true after the next edit to the builder.
 *
 * WHAT IT DOES. Calls the glance builder for every row the profile holds
 * (197, including the two outside the taxonomy), offline, and for every
 * PRINTED minimum reads the profile's own median a second time, here, and
 * reds if the printed figure is within a dollar of 0.45 times it, naming the
 * country and the two figures; reds too if the row is not tier A, the second
 * clause of the rule. Prints how many countries print the cell, so the count
 * in the report is measured and not remembered.
 *
 * BLIND SPOT, stated: this cannot tell a statutory minimum from any OTHER
 * formula. A tier A row at 0.46 times the median passes it, and the tier A
 * rows it does let through include countries with no statutory national
 * minimum wage at all (the 01 brief names Austria among them); it catches
 * the one fingerprint the file is known to carry and nothing else.
 *
 * PLANTED ONCE (2026-09-17): the builder was made to print the United
 * States' 0.45 row and this gate named it (US: 26460 against a median of
 * 58800, the profile's line 51), then the plant was removed.
 */
import { listCountryProfiles, getCountryProfile } from "@/lib/economic_profile";
import { buildGlance, isMinWageFill, MIN_WAGE_FILL_RATIO } from "@/lib/spine/glance_rows";
import { red, lineOfKey } from "./lib/red";

const RULE = "min-wage-not-fill";
const FILE = "data/economic_indicators/country_profile_v2.json";

let reds = 0;
let printed = 0;
let rows = 0;
for (const p of listCountryProfiles()) {
  const iso2 = p.iso2.toUpperCase();
  rows++;
  const g = buildGlance(iso2);
  const minimum = g?.figures.minimum ?? null;
  const cell = g?.cells.find((c) => c.key === "minimum") ?? null;
  if ((minimum == null) !== (cell == null)) {
    reds++;
    red({ rule: RULE, file: "src/lib/spine/glance_rows.ts", detail: `${iso2}: the minimum cell and its figure disagree (figure ${minimum}, cell ${cell ? "drawn" : "absent"})`, remedy: "print the cell from the figure and nothing else" });
    continue;
  }
  if (minimum == null) continue;
  printed++;
  const median = getCountryProfile(iso2).median_wage_full_time_usd;
  const line = lineOfKey(FILE, iso2);
  if (isMinWageFill(minimum, median)) {
    reds++;
    red({ rule: RULE, file: FILE, line, detail: `${iso2} prints a minimum salary of ${minimum} against a median of ${median}, which is ${MIN_WAGE_FILL_RATIO} times the median within a dollar, the fill's fingerprint`, remedy: "withhold the cell in glance_rows.ts; a constant ratio is not a statutory floor" });
  }
  if (p.tier !== "A") {
    reds++;
    red({ rule: RULE, file: FILE, line, detail: `${iso2} prints a minimum salary of ${minimum} from a tier ${p.tier} row, which is interpolated, not measured`, remedy: "withhold the cell in glance_rows.ts where the row is not tier A" });
  }
}

console.log(`min-wage-not-fill: ${rows} profile rows rebuilt through the glance builder; the minimum salary prints on ${printed}; ${reds === 0 ? "none at the 0.45 fingerprint, none off tier A" : `${reds} red(s) above`}`);
if (reds > 0) process.exit(1);
