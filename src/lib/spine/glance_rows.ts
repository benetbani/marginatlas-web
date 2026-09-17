/**
 * src/lib/spine/glance_rows.ts
 *
 * AT A GLANCE, the country page's `01 glance` (MODEL.md 8.2; plan step 31,
 * second dispatch, 2026-09-17, which also closes plan steps 42 and 43): the
 * country's own figures, each in its own unit, no rank and no verdict. Pure
 * over the files, synchronous, no database, so the archetype harness and the
 * prebuild gate can build every country. Five cells at most, in this order,
 * each with its file and field:
 *
 *  - GDP PER PERSON: the published snapshot FIRST,
 *    data/external/brain-skeleton/world_bank_gdp_per_capita.csv (iso2, year,
 *    value; the World Bank series, latest year per country, 193 of 195,
 *    183 of them 2024), read through getBrainGdpPerCapitaWithYearByIso2() so
 *    the year reaches the foot; the profile's `gdp_per_capita_usd_nominal`
 *    (data/economic_indicators/country_profile_v2.json) ONLY where the
 *    snapshot has no row, which is TW (tier A, hand-anchored) and YE (tier B,
 *    modelled). Step 42: the page used to prefer the profile, and for
 *    Nigeria the profile is double the measured figure. No year is printed
 *    for a profile figure, so the foot never calls it measured.
 *  - AVERAGE SALARY: the pay pair's average from buildPayBars(), the ONE
 *    builder the staff-cost card draws (R7's discipline applied to pay):
 *    the profile's `median_wage_full_time_usd`, never read here a second
 *    time. Measured where the profile row is tier A (50), modelled
 *    otherwise (145); the foot says so. The words are his (ruling 14 of
 *    2026-09-04, COPY.pay.average), so one figure has one name on the page.
 *  - NET WEALTH PER ADULT: data/economics/net_wealth_per_adult_usd_v1.json
 *    `values_usd_median_per_adult` (124 curated) and nothing else. The
 *    regional fallback country_metrics.ts applies to the other 71 is a fill
 *    value and is WITHHELD with a stated line (R11, PART 9 clause 46).
 *  - MINIMUM SALARY (step 43): the pay pair's minimum from the same
 *    builder, the profile's `minimum_wage_annual_usd`. 146 of the 195 rows
 *    equal exactly 0.45 times the median within a dollar (measured
 *    2026-09-17; the plan said 171), the fingerprint of a fill: WITHHELD
 *    wherever the figure is within a dollar of 0.45 times the median OR the
 *    row is not tier A, and, with the average, wherever the staff-cost card
 *    withholds the pair under ruling 14 (Egypt: 4,000 against 4,200). Prints
 *    on 24 countries. Defended by scripts/verify_min_wage_not_fill.ts, which
 *    rebuilds every profile row and reds a printed minimum at the fingerprint.
 *  - TIME TO REGISTER: the hero's own LLC cell from buildHeroFacts(), the
 *    LLC row's `setup_days` in data/legal/business_formation_costs_v1.json
 *    (152 of 195), the figure the how-to page prints; never `daysToStart`
 *    in country_metrics.ts, which picks the sole-trader row and differs from
 *    the hero on 132 of the 152 (measured 2026-09-17). One builder, so the
 *    glance can never contradict the masthead two hundred pixels above it.
 *
 * "Ease of operating" is NOT here although 8.2's `01` row lists it: `17
 * footing` prints `ease_of_doing_business_index`, and one figure prints once
 * on a page (PART 5, M1). Cost of living is `06 running-costs`' (the 01
 * brief's section 2.7).
 *
 * The withheld line names each cell the card does not hold and why, with
 * the count (PART 5: a label never stands where a number goes). The foot
 * carries the snapshot's year and names the modelled cells, because the
 * sample mark is switched off and the foot is the only line left that can.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { getBrainGdpPerCapitaWithYearByIso2 } from "@/lib/external/brain_data";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import netWealthJson from "../../../data/economics/net_wealth_per_adult_usd_v1.json";

const NET_WEALTH_CURATED = (netWealthJson as { values_usd_median_per_adult: Record<string, number> }).values_usd_median_per_adult;

const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** The fingerprint of the fill: a minimum within a dollar of 0.45 times the median. */
export const MIN_WAGE_FILL_RATIO = 0.45;
export const MIN_WAGE_FILL_TOLERANCE_USD = 1;
export const isMinWageFill = (minimum: number, median: number): boolean => Math.abs(minimum - MIN_WAGE_FILL_RATIO * median) <= MIN_WAGE_FILL_TOLERANCE_USD;

export type GlanceData = {
  iso2: string;
  cells: KvCell[];
  /** The raw figures behind the cells, null where withheld or not held; the gate reads these. */
  figures: { gdp: number | null; salary: number | null; wealth: number | null; minimum: number | null; days: number | null };
  /** The snapshot's year, or null where the profile stands in. */
  gdpYear: number | null;
  withheld: string | null;
  /** The units of the cells printed, or null where only the GDP cell prints. */
  basis: string | null;
  foot: string | null;
  /** The weakest cell on the card, for the opener's mark. */
  confidence: "measured" | "modeled";
};

export function buildGlance(iso2In: string): GlanceData | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  const profileHeld = profile.iso2.toUpperCase() === iso2;
  const pay = buildPayBars(iso2);

  const cells: KvCell[] = [];
  const modelled: string[] = [];
  /* Each entry is one reason and the number of cells it withholds. */
  const missing: Array<{ reason: string; cells: number }> = [];
  /* THE PAY PAIR'S OWN VERDICT BINDS HERE TOO (ruling 14, PAY_RATIO_FLOOR):
     where the staff-cost card withholds the pair because the average is not
     ten percent above the minimum, this card prints neither, for the same
     reason, or the page would show on one card the pair the card below
     refuses. Two cells, one reason. */
  const payDisagrees = pay?.withheld != null;

  /* GDP per person: the snapshot with its year, the profile only where the snapshot has no row. */
  const snap = getBrainGdpPerCapitaWithYearByIso2().get(iso2) ?? null;
  let gdp: number | null = null;
  let gdpYear: number | null = null;
  let gdpConfidence: KvCell["confidence"] = "measured";
  if (snap && isPos(snap.value)) {
    gdp = snap.value;
    gdpYear = snap.year > 0 ? snap.year : null;
  } else if (profileHeld && isPos(profile.gdp_per_capita_usd_nominal)) {
    gdp = profile.gdp_per_capita_usd_nominal;
    gdpConfidence = profile.tier === "A" ? "measured" : "modeled";
    if (gdpConfidence === "modeled") modelled.push(COPY.glance.cells.gdp);
  }
  if (gdp != null) cells.push({ key: "gdp", label: COPY.glance.cells.gdp, value: usd(gdp), confidence: gdpConfidence });

  /* Average salary: the pay pair's average, one builder with the staff-cost card. */
  const avgRow = pay?.rows.find((r) => r.key === "average") ?? null;
  const salary = !payDisagrees && avgRow && isPos(avgRow.value) ? avgRow.value : null;
  if (salary != null) {
    const c: KvCell["confidence"] = pay!.confidence === "measured" ? "measured" : "modeled";
    if (c === "modeled") modelled.push(`the ${COPY.pay.average.toLowerCase()}`);
    cells.push({ key: "salary", label: COPY.pay.average, value: usd(salary), confidence: c });
  } else if (payDisagrees) missing.push({ reason: COPY.glance.reasons.payDisagree, cells: 2 });
  else missing.push({ reason: COPY.glance.reasons.salary, cells: 1 });

  /* Net wealth per adult: the curated map only; the regional fill is withheld. */
  const wealth = isPos(NET_WEALTH_CURATED[iso2]) ? NET_WEALTH_CURATED[iso2] : null;
  if (wealth != null) cells.push({ key: "wealth", label: COPY.glance.cells.wealth, value: usd(wealth), confidence: "measured" });
  else missing.push({ reason: COPY.glance.reasons.wealth, cells: 1 });

  /* Minimum salary: printed only where it is not the 0.45 fill and the row is tier A. */
  const minRow = pay?.rows.find((r) => r.key === "minimum") ?? null;
  const minimumHeld = minRow && isPos(minRow.value) ? minRow.value : null;
  const minimumHonest = minimumHeld != null && salary != null && pay!.confidence === "measured" && !isMinWageFill(minimumHeld, salary);
  const minimum = minimumHonest ? minimumHeld : null;
  if (minimum != null) cells.push({ key: "minimum", label: COPY.pay.minimum, value: usd(minimum), confidence: "measured" });
  else if (!payDisagrees) missing.push({ reason: COPY.glance.reasons.minimum, cells: 1 });

  /* Time to register: the hero's LLC cell, the same string the masthead prints. */
  const llcTime = buildHeroFacts(iso2).cells.find((c) => c.key === "llc-time") ?? null;
  const days = llcTime ? parseInt(llcTime.value, 10) : NaN;
  if (llcTime && Number.isFinite(days) && days > 0) cells.push({ key: "time", label: COPY.glance.cells.time, value: llcTime.value, confidence: "measured" });
  else missing.push({ reason: COPY.glance.reasons.time, cells: 1 });

  if (cells.length === 0) return null;

  /* The basis names a unit for every cell the card prints and for none it withholds. */
  const unitParts: string[] = [];
  if (salary != null) unitParts.push(COPY.glance.units.salary);
  if (wealth != null) unitParts.push(COPY.glance.units.wealth);
  if (cells.some((c) => c.key === "time")) unitParts.push(COPY.glance.units.time);
  const basis = unitParts.length > 0 ? `${unitParts.join("; ")}.`.replace(/^./, (ch) => ch.toUpperCase()) : null;

  const withheldCount = missing.reduce((n, m) => n + m.cells, 0);
  const withheld = missing.length > 0 ? fill(COPY.glance.withheld, { n: String(withheldCount), reasons: missing.map((m) => m.reason).join("; ") }) : null;

  const footParts: string[] = [];
  if (gdpYear != null) footParts.push(fill(COPY.glance.footYear, { year: String(gdpYear) }));
  if (modelled.length > 0) {
    const what = modelled.length === 1 ? modelled[0] : `${modelled.slice(0, -1).join(", ")} and ${modelled[modelled.length - 1]}`;
    const sentence = fill(COPY.glance.footModelled, { what, verb: modelled.length === 1 ? "is" : "are" });
    footParts.push(sentence.charAt(0).toUpperCase() + sentence.slice(1));
  }
  const foot = footParts.length > 0 ? footParts.join(" ") : null;

  return {
    iso2,
    cells,
    figures: { gdp, salary, wealth, minimum, days: Number.isFinite(days) && days > 0 ? days : null },
    gdpYear,
    withheld,
    basis,
    foot,
    confidence: cells.some((c) => c.confidence === "modeled") ? "modeled" : "measured",
  };
}
