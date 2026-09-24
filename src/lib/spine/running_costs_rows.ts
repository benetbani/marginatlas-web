/**
 * src/lib/spine/running_costs_rows.ts
 *
 * POWER AND LIVING COSTS, the country page's `06 running-costs` (MODEL.md
 * 8.2; plan step 31, fourth dispatch, 2026-09-18). KvGrid holds the seat of
 * the fact-card-with-a-focal, candidate 1 of FORM-CATALOG's CANDIDATES
 * AWAITING HIS CLICK, exactly as `01 glance` does: two cells at the head
 * rung, nothing at 30, no placement line (the composition's `data-placement`
 * slot is owed to the one site-wide builder, R2, and stays empty until his
 * click). Pure over the files, synchronous, no database, so the archetype
 * harness and the prebuild gate can build every country. Two cells at most,
 * in this order, each with its file and field:
 *
 *  - ELECTRICITY PER KILOWATT HOUR: `electricity_usd_per_kwh_commercial` in
 *    data/economic_indicators/country_profile_v2.json, `countries.{ISO2}`,
 *    through getCountryProfile(); the file's convention says dollars, 2024
 *    reference year. Held above zero on 195 of 195. Measured where the row
 *    is tier A (the file's "hand-anchored" top 50), modelled where it is B
 *    or C ("regional-cluster + GDP-tier interpolation"); the foot says so in
 *    words. Printed with two places always (`usdCents`, the composition's
 *    missing law): "$0.27", "$0.07", never the file's four-place
 *    interpolation signature and never `usd`'s "$0".
 *    THE FILL IS WITHHELD, NEVER PRINTED (R11, PART 9 clause 46). 52 of the
 *    195 rows hold exactly 0.13, which is also GLOBAL_ELECTRICITY_REFERENCE
 *    in src/lib/cost_engine/engine.ts (its line 218; read, not imported: the
 *    constant is private to the engine and this file must not depend on the
 *    engine's module). 45 of the 52 are tier B or C and seven are tier A
 *    (FI MX NG ZA KR SE US). ALL 52 ARE WITHHELD, the tier A seven with the
 *    rest, because the file carries no per-field flag and a rate equal to
 *    the fill to the tenth of a cent cannot be told from the fill by a
 *    reader, by this builder or by the gate that defends it: this
 *    measurement cannot distinguish a measured 0.13 from the filled 0.13.
 *    The same rule already governs the glance's minimum salary (a tier A
 *    row at the 0.45 fingerprint is withheld there too, and the US was the
 *    row that gate was planted on). The withheld line counts the countries
 *    sharing the value off the file, so the reader is told why. Defended by
 *    scripts/verify_electricity_not_fill.ts, which rebuilds every profile
 *    row and reds a printed rate within a tenth of a cent of the fill.
 *  - COST OF LIVING: `cost_of_living_index` per city in
 *    data/cities/city_list_v1.json (`cities[].cost_of_living_index`, mirrored
 *    from data/economics/cost_of_living_index_v1.json, whose convention is a
 *    scalar with New York at 100, living costs with rent, as of 2025).
 *    There is no country field anywhere under data/ or src/lib; the country
 *    figure is getCountryCostOfLivingIndex() in
 *    src/lib/economics/country_metrics.ts, the population-weighted mean of
 *    the country's covered cities' values (`pop_m`, 0.5 where a city has
 *    none), read here and never recomputed (one builder for one figure).
 *    Held for 105 of 195; 70 of those stand on ONE city's number. Printed as
 *    a whole number: the inputs are integers and a weighted mean at one
 *    decimal claims a precision they do not have. MODELLED ALWAYS, the
 *    brief's own verdict: the city values may be anchored, but the country
 *    number is a weighting this repo chose, and the foot says how many
 *    cities it stands on (the count reads the same file with the same
 *    filter the mean uses, finite and above zero, so the two cannot
 *    disagree on which cities count). WITHHELD with a stated line on the 90
 *    countries with no covered city.
 *
 * Measured over the 195 on 2026-09-18: both cells print on 91, electricity
 * alone on 52, the cost of living alone on 14 (the electricity withheld for
 * the fill), neither on 38, where the card draws its opener and its two
 * stated lines and no figure (PART 5: withheld, never dropped).
 *
 * The basis names a unit for every cell the card prints and for none it
 * withholds; the foot names in words what is modelled, because the sample
 * mark is switched off and the foot is the only line left that can (the
 * glance's idiom).
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { getCountryCostOfLivingIndex, costOfLivingOnCityScale, allCountryCostOfLivingIndices } from "@/lib/economics/country_metrics";
import { levelOf, type HeroLevel } from "@/lib/spine/hero_board";
import { listCountryProfiles } from "@/lib/economic_profile";
import { usdCents } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import profileJson from "../../../data/economic_indicators/country_profile_v2.json";
import cityListJson from "../../../data/cities/city_list_v1.json";

const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** The file's fill value for the commercial electricity rate: 0.13, the number
 *  GLOBAL_ELECTRICITY_REFERENCE holds in src/lib/cost_engine/engine.ts. */
export const ELECTRICITY_FILL_USD_PER_KWH = 0.13;
/** A tenth of a cent: a rate this close to the fill cannot be told from it. */
export const ELECTRICITY_FILL_TOLERANCE = 0.001;
export const isElectricityFill = (rate: number): boolean => Math.abs(rate - ELECTRICITY_FILL_USD_PER_KWH) < ELECTRICITY_FILL_TOLERANCE;

/** How many rows of the profile hold the fill, counted off the file once, for the withheld line. */
const FILL_ROW_COUNT: number = (() => {
  const rows = Object.values((profileJson as { countries: Record<string, { electricity_usd_per_kwh_commercial?: unknown }> }).countries);
  return rows.filter((r) => isPos(r.electricity_usd_per_kwh_commercial) && isElectricityFill(r.electricity_usd_per_kwh_commercial)).length;
})();

/** Covered cities holding a cost-of-living value, per country: the same filter the weighted mean applies. */
const CITY_COUNT_BY_ISO2: Map<string, number> = (() => {
  const out = new Map<string, number>();
  for (const c of (cityListJson as { cities: Array<{ iso2?: string; cost_of_living_index?: unknown }> }).cities) {
    const iso = String(c.iso2 ?? "").toUpperCase();
    if (!iso || !isPos(c.cost_of_living_index)) continue;
    out.set(iso, (out.get(iso) ?? 0) + 1);
  }
  return out;
})();

/** A small count in a person's words, digits past ten. */
const WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const spell = (n: number) => WORDS[n] ?? String(n);

export type RunningCostsData = {
  iso2: string;
  cells: KvCell[];
  /** The raw figures behind the cells, null where withheld or not held; the gate reads these. */
  figures: { electricity: number | null; living: number | null };
  /** THE PLACED READING (his rulings of 2026-09-20): each figure's level among the countries (hero_board.ts levelOf, thirds of the placement rank), and the cost of living on the city scale, 1 at the cheapest covered city and 100 at the dearest, the ends never named. */
  levels: { electricity: HeroLevel | null; living: HeroLevel | null };
  livingOnCityScale: number | null;
  /** Why each withheld figure is withheld, one sentence each, in cell order; empty when both print. */
  withheld: string[];
  /** One unit clause per printed cell; null when neither prints. */
  basis: string | null;
  /** The modelled cells named in words; null when every printed cell is measured or nothing prints. */
  foot: string | null;
  /** The weakest cell on the card, for the opener's mark. */
  confidence: "measured" | "modeled";
};

export function buildRunningCosts(iso2In: string): RunningCostsData | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  if (profile.iso2.toUpperCase() !== iso2) return null;

  const cells: KvCell[] = [];
  const withheld: string[] = [];
  const clauses: string[] = [];
  const footParts: string[] = [];

  /* Electricity: the profile's rate, two places, withheld at the fill. */
  const rateHeld = isPos(profile.electricity_usd_per_kwh_commercial) ? profile.electricity_usd_per_kwh_commercial : null;
  const electricity = rateHeld != null && !isElectricityFill(rateHeld) ? rateHeld : null;
  if (electricity != null) {
    const c: KvCell["confidence"] = profile.tier === "A" ? "measured" : "modeled";
    cells.push({ key: "electricity", label: COPY.runningCosts.cells.electricity, value: usdCents(electricity), confidence: c });
    if (COPY.runningCosts.basisElectricity) clauses.push(COPY.runningCosts.basisElectricity);
    if (c === "modeled") footParts.push(COPY.runningCosts.footElectricityModelled);
  } else {
    withheld.push(fill(COPY.runningCosts.withheld.electricityFill, { n: String(FILL_ROW_COUNT) }));
  }

  /* Cost of living: the covered cities' weighted mean, whole, modelled always. */
  const livingHeld = getCountryCostOfLivingIndex(iso2);
  const living = isPos(livingHeld) ? Math.round(livingHeld) : null;
  if (living != null) {
    cells.push({ key: "living", label: COPY.runningCosts.cells.living, value: String(living), confidence: "modeled" });
    clauses.push(COPY.runningCosts.basisLiving);
    const n = CITY_COUNT_BY_ISO2.get(iso2) ?? 1;
    footParts.push(n === 1 ? COPY.runningCosts.footLivingOneCity : fill(COPY.runningCosts.footLivingModelled, { n: spell(n) }));
  } else {
    withheld.push(COPY.runningCosts.withheld.livingNotOnFile);
  }

  /* The placement sets, once per process: every country's electricity rate off the fill, every country's cost-of-living index. */
  const electricitySet = listCountryProfiles().map((p) => p.electricity_usd_per_kwh_commercial).filter((v): v is number => isPos(v) && !isElectricityFill(v));
  const livingSet = allCountryCostOfLivingIndices();
  /* Each clause is its own short sentence now (his correction of 2026-09-24, evening): joined by a space, never a semicolon. */
  const basis = clauses.length > 0 ? clauses.join(" ") : null;
  /* The level words are read among the countries, and the foot says so once, because the cost of living's own scale is the cities' and a reader would otherwise read "41 of 100, high" as a contradiction. */
  const levelsDrawn = (electricity != null && levelOf(electricity, electricitySet) != null) || (livingHeld != null && levelOf(livingHeld, livingSet) != null);
  if (levelsDrawn) footParts.push(COPY.runningCosts.footLevels);
  const foot = footParts.filter((t) => t).length > 0 ? footParts.filter((t) => t).join(" ") : null;

  return {
    iso2,
    cells,
    figures: { electricity, living },
    levels: { electricity: electricity != null ? levelOf(electricity, electricitySet) : null, living: livingHeld != null ? levelOf(livingHeld, livingSet) : null },
    livingOnCityScale: isPos(livingHeld) ? costOfLivingOnCityScale(livingHeld) : null,
    withheld,
    basis,
    foot,
    confidence: cells.some((c) => c.confidence === "modeled") ? "modeled" : "measured",
  };
}
