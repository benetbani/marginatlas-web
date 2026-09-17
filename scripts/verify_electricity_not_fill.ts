/**
 * verify_electricity_not_fill , no printed electricity rate is the file's fill.
 *
 * MODEL.md 8.2, `06 running-costs`, and PART 9 clause 46 (R11), built with
 * plan step 31's fourth dispatch on 2026-09-18. `electricity_usd_per_kwh_commercial`
 * in data/economic_indicators/country_profile_v2.json holds exactly 0.13 on
 * 52 of its rows (52 of the 195 in the taxonomy; 45 tier B or C and seven
 * tier A: FI MX NG ZA KR SE US), and 0.13 is also GLOBAL_ELECTRICITY_REFERENCE
 * in src/lib/cost_engine/engine.ts: one value shared by a quarter of the
 * atlas is the fingerprint of a fill, and with the sample mark switched off
 * it would print as a rate on 52 pages. The power-and-living-costs card
 * (src/lib/spine/running_costs_rows.ts) withholds the cell wherever the rate
 * is within a tenth of a cent of the fill, tier A rows included, because a
 * rate equal to the fill cannot be told from it; this gate is what keeps
 * that true after the next edit to the builder.
 *
 * WHAT IT DOES. Calls the builder for every row the profile holds (197,
 * including the two outside the taxonomy), offline, and for every PRINTED
 * rate reads the profile's own field a second time, here, and reds if the
 * printed figure is within a tenth of a cent of 0.13, naming the country
 * and the figure; reds too if a printed rate from a row that is not tier A
 * is not marked modelled (the interpolated rows say so, the second clause
 * of the card's rule); and reds if the cell and its figure disagree, or if
 * the withheld line is printed without a withheld rate or a rate is withheld
 * without its line (both directions, the way MarkList's count is held).
 * Prints how many countries print the cell and how many withhold it, so the
 * counts in the report are measured and not remembered.
 *
 * BLIND SPOT, stated: this cannot tell a fill from any OTHER interpolated
 * value. A tier B row at 0.14 (fifteen countries sit there) passes it, and
 * so does every four-place interpolation; it catches the one value the file
 * is known to fill with and nothing else. It cannot distinguish a measured
 * 0.13 from a filled 0.13 either, which is why the seven tier A rows are
 * withheld with the rest rather than let through.
 *
 * PLANTED ONCE (2026-09-18): the builder was made to print the fill rows
 * and this gate named them (52 reds, the first "AO prints an electricity
 * rate of 0.13, within a tenth of a cent of the fill 0.13"), then the plant
 * was removed.
 */
import { listCountryProfiles, getCountryProfile } from "@/lib/economic_profile";
import { buildRunningCosts, isElectricityFill, ELECTRICITY_FILL_USD_PER_KWH } from "@/lib/spine/running_costs_rows";
import { COPY } from "@/lib/spine/copy";
import { red, lineOfKey } from "./lib/red";

const RULE = "electricity-not-fill";
const FILE = "data/economic_indicators/country_profile_v2.json";
/** The withheld line's fixed opening, before its counted `{n}`. */
const FILL_LINE_HEAD = COPY.runningCosts.withheld.electricityFill.split("{n}")[0];

let reds = 0;
let printed = 0;
let withheld = 0;
let withheldTierA = 0;
let rows = 0;
for (const p of listCountryProfiles()) {
  const iso2 = p.iso2.toUpperCase();
  rows++;
  const r = buildRunningCosts(iso2);
  if (!r) {
    reds++;
    red({ rule: RULE, file: "src/lib/spine/running_costs_rows.ts", detail: `${iso2}: the profile holds the row and the builder returns nothing`, remedy: "build the card for every held row; withhold a figure with its line, never the card" });
    continue;
  }
  const rate = r.figures.electricity;
  const cell = r.cells.find((c) => c.key === "electricity") ?? null;
  if ((rate == null) !== (cell == null)) {
    reds++;
    red({ rule: RULE, file: "src/lib/spine/running_costs_rows.ts", detail: `${iso2}: the electricity cell and its figure disagree (figure ${rate}, cell ${cell ? "drawn" : "absent"})`, remedy: "print the cell from the figure and nothing else" });
    continue;
  }
  const line = r.withheld.some((s) => s.startsWith(FILL_LINE_HEAD));
  if (rate == null) {
    withheld++;
    if (p.tier === "A") withheldTierA++;
    if (!line) {
      reds++;
      red({ rule: RULE, file: "src/lib/spine/running_costs_rows.ts", detail: `${iso2}: the electricity rate is withheld and no line says so`, remedy: "a withheld figure carries its stated line (PART 5); never drop it in silence" });
    }
    continue;
  }
  if (line) {
    reds++;
    red({ rule: RULE, file: "src/lib/spine/running_costs_rows.ts", detail: `${iso2}: the electricity rate prints and the withheld line prints too`, remedy: "a line beside a printed figure apologises for nothing; print one of the two" });
  }
  printed++;
  const onFile = getCountryProfile(iso2).electricity_usd_per_kwh_commercial;
  const jsonLine = lineOfKey(FILE, iso2);
  if (isElectricityFill(rate) || isElectricityFill(onFile)) {
    reds++;
    red({ rule: RULE, file: FILE, line: jsonLine, detail: `${iso2} prints an electricity rate of ${rate}, within a tenth of a cent of the fill ${ELECTRICITY_FILL_USD_PER_KWH}`, remedy: "withhold the cell in running_costs_rows.ts; a value shared by 52 countries is a fill, not a rate" });
  }
  if (p.tier !== "A" && cell!.confidence !== "modeled") {
    reds++;
    red({ rule: RULE, file: FILE, line: jsonLine, detail: `${iso2} prints an electricity rate of ${rate} from a tier ${p.tier} row, interpolated, and the cell is not marked modelled`, remedy: "mark the cell modelled in running_costs_rows.ts where the row is not tier A" });
  }
}

console.log(`electricity-not-fill: ${rows} profile rows rebuilt through the running-costs builder; the electricity rate prints on ${printed} and is withheld on ${withheld} (${withheldTierA} of them tier A); ${reds === 0 ? "none printed at the fill, every interpolated one marked modelled" : `${reds} red(s) above`}`);
if (reds > 0) process.exit(1);
