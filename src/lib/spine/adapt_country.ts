/**
 * src/lib/spine/adapt_country.ts , the COUNTRY-page real-data adapter.
 *
 * The sibling of adapt_city.ts / adapt_industry.ts / adapt_hood.ts, and the one
 * that feeds every figure on the rebuilt country page (walk-reform Tasks 10-18).
 * Server only, pure (no "use client"): awaited from the RSC country route
 * (src/app/[country]/page.tsx) behind isSpineReformEnabledFor("country"), never
 * called from a client island.
 *
 * HONESTY RAIL (absolute). Every figure below is read from a named module, and
 * the module that PRODUCES it is cited in a comment beside the field. A field
 * with no honest source is left UNDEFINED; a block with nothing honest to say is
 * left undefined entirely and the section self-omits. Nothing is fabricated,
 * nothing is defaulted to zero, and no page-local composite is invented: the
 * five composites the 2026-08-27 inventory named (the eight-tile grade board,
 * the hexagon lenses, the wallet rung, the footing word, the 0-100 ease score)
 * are NOT carried forward in any form. Nor is the banned trivia they printed:
 * no GDP per capita, no population, no net wealth anywhere in this file.
 *
 * EVERY BLOCK CARRIES `_meta.confidence`, one of "measured" | "modeled" |
 * "placeholder", and its value is the WEAKEST confidence of any fact the block
 * carries, never the confidence of its headline fact alone (finding I1, the
 * 2026-08-28 review round: hero used to report "measured" whenever the take
 * computed even when a support fact, sales tax for a tier-B profile, was
 * "modeled", so 60 countries got a measured block hiding a modeled fact
 * inside; the same rule now applies to every block, not hero alone). This is
 * plan correction 4: the legacy country route rendered from lib accessors, so
 * scripts/verify_sample_tags.ts (which reads seeds) could not see it, and the
 * fabricated figures on it passed the chain untouched.
 *
 * A SEED ALONE DOES NOT PUT THE PAGE BACK UNDER THE GATE, and saying so here
 * was wrong (finding C1, same review round). verify_sample_tags.ts walks JSON
 * files under src/lib/spine-seeds/; this file is a runtime function awaited
 * from a route, and a JSON walk cannot see a runtime function no matter how
 * honest its tags are. Two changes make the claim true instead of
 * aspirational: scripts/verify_country_seed_confidence.mjs is a new STATIC
 * gate that parses THIS file's source directly and fails if any block lacks
 * `_meta.confidence` or if the file ever reads a payroll figure from
 * country_profile_v2 again; and verify_sample_tags.ts's "countries" render
 * group now resolves to src/components/spine/country/country-view.tsx, the
 * real body, instead of the workshop preview that always carried SampleTag
 * regardless of what the real page would ever render. A modeled figure
 * printed as real is the worst defect in the system (rulebook v2 rule 4), so
 * where this file is unsure it says "modeled".
 *
 * THE FIVE PLAN CORRECTIONS THIS FILE IMPLEMENTS (2026-08-28 brief):
 *
 * 1. ONE SOURCE FOR THE TAX QUANTITIES. Two modules hold an employer payroll
 *    rate and they disagree for 76 of the 130 countries that hold both. The
 *    decision, recorded: src/lib/tax/country_rates.ts wins, site-wide, for BOTH
 *    the government-take hero and the trades funnel, because src/lib/tax.ts (the
 *    tax source the finance engine behind the funnel already reads) imports the
 *    SAME file, src/lib/tax/country_rates_2024.json. So the hero rate and the
 *    rate inside the money block's arithmetic are one number, not two. Nothing
 *    in this file reads a payroll rate from the country profile. Where the tax
 *    module lacks a country (65 of 195), the hero take self-omits.
 *    The same decision extends to the BUSINESS TAX rate for the same reason:
 *    the hero, the peers table and the funnel all use `cit` from that one file,
 *    never the separate small-business effective rate, so one page never
 *    computes one quantity two ways (rulebook v2 rule 8).
 *    CORRECTED 2026-08-28 (finding I2): the rule had a gap. The `hiring`
 *    block's loaded multiplier still read profile.fully_loaded_labor_multiplier,
 *    built from the excluded country_profile_v2 payroll table, and printed it
 *    beside employer_payroll_pct from this file's one true source, so the two
 *    payroll figures on one page could disagree (Cyprus: 8.4 percent beside a
 *    multiplier that adds 36.9 percent). It is now payroll_only_multiplier,
 *    1 + employerSocial from src/lib/tax/country_rates.ts, so the whole page
 *    carries exactly one payroll number, not two that happen to sit near
 *    each other.
 * 2. CITY COORDINATES. No row in src/lib/cities/top100.json carries a latitude
 *    or a longitude (counted: 0 of 102), so the map had nothing to plot. The
 *    coordinates come from src/lib/cities/coordinates_curated.json, a curated
 *    public-atlas file created with this adapter. `cities.map_points` is present
 *    only at THREE OR MORE coordinate-carrying cities and undefined otherwise,
 *    so the map self-omits rather than drawing a thin scatter (142 of 195
 *    countries return zero cities and must still render an honest page).
 * 3. THREE CONNECTS. Three ratified sections have their data sitting in an
 *    already-imported module and render on no page in the repo: what customers
 *    earn (the wage spread), what premises cost (rent + electricity), and the
 *    cost of borrowed money (the lending rate). They are carried here as the
 *    `customers` and `premises` blocks.
 * 4. `_meta.confidence` on every block, no exceptions (see above).
 * 5. THE FUNNEL COVERAGE IS COUNTED AT BUILD TIME, not guessed offline, and the
 *    count rides on the seed as `money.coverage` so a section task can render an
 *    honest "n of 6" rather than assuming six.
 *
 * TWO OWNERSHIP DECISIONS, because two ratified replacement files overlap and a
 * figure printed twice on one page is the defect they both exist to remove:
 *
 *   - THE WAGE MEDIAN. design/replacements/spending-power.md (Task 14) and
 *     design/replacements/talent-pool.md (Task 17) both draw on the wage table.
 *     talent-pool.md settles it in its own words: the customer block owns the
 *     p25 / median / p75 SPREAD, the staff block leads on the legal floor and
 *     the loaded multiplier. Both figures are carried (the panel judged the
 *     floor-beside-typical-pay pair an honest form), and the two section tasks
 *     must not print the median as a headline twice.
 *   - CURRENCY MOVEMENT AND INFLATION. design/replacements/six-lenses.md gives
 *     them to the Stability LENS (Task 13); design/replacements/ground-under-you.md
 *     gives them to the ground read (Task 17). They cannot be printed twice, so
 *     the lens owns them and the `ground` block carries only the two
 *     institutional indices, which is the half of ground-under-you.md that has
 *     no other home. Recorded here so the split is a decision, not an accident.
 *
 * WHAT IS DELIBERATELY ABSENT, each for a named reason:
 *   - the gut check, the opportunity gap, the owner's-day block: cut in the
 *     inventory on the two sanctioned grounds, so no field feeds them.
 *   - a net margin on the money rows: the replacement decision asks for what an
 *     owner KEEPS and what it costs to open, two figures with named units, and
 *     nothing else. Adding a margin here would mean deriving a second money
 *     figure from the same waterfall on a surface that only needs one.
 *   - the signature-sector BLURBS: the source file's blurbs carry parenthetical
 *     editorial written for the data team ("explicit exception to the
 *     no-banks/insurance rule"), which is an internal note, not reader copy. The
 *     three LABELS are carried; the blurbs are not.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { getCellBySlug, withBudget, slugify } from "@/lib/cells";
import { getCitiesForCountry, type CityEntry } from "@/lib/cities";
import { getCityCostOfLivingIndex } from "@/lib/cities/city_tier";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { getWageDecileConfidence } from "@/lib/economic_profile/wage_deciles";
import { isKeepCredible } from "@/lib/finance/keep_credibility";
import { getCountryRates, getTypicalFormationCostUsd } from "@/lib/tax/country_rates";
import { getVatRow, getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { getCountrySignature } from "@/lib/countries/country_signature";
import { PEER_GROUPS } from "@/lib/countries/country_view";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import coordinatesJson from "../cities/coordinates_curated.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import formationJson from "../../../data/legal/business_formation_costs_v1.json";

/* ------------------------------------------------------------------------- */
/* Types.                                                                     */
/* ------------------------------------------------------------------------- */

/** The three honest tiers. Anything not "measured" renders a visible SampleTag. */
export type SpineConfidence = "measured" | "modeled" | "placeholder";

type CuratedCoordinate = { iso2: string; name: string; lat: number; lng: number };
const CURATED_COORDS = (coordinatesJson as { cities: Record<string, CuratedCoordinate> }).cities;

/** The per-legal-tier registration table (data/legal/business_formation_costs_v1.json). */
type FormationTier = {
  tier?: string;
  local_term?: string;
  setup_cost_usd?: number;
  setup_days?: number;
  complexity_score?: number;
};
const FORMATION =
  (formationJson as { countries?: Record<string, FormationTier[]> }).countries ?? {};

/**
 * WHERE A CITY CARD ACTUALLY LANDS, and the first two candidates were both dead.
 *
 * A row in src/lib/cities/top100.json carries a geo code as its slug
 * ("gb-e09000001"), and the two routes that look like they take it do not:
 * /[country]/[geo] resolves through getRegionsForCountry, which for the United
 * Kingdom returns four admin regions and none of the four city codes, and
 * /[country]/[geo]/industries resolves through the admin-1 table with the same
 * result. Both would have shipped a card that answers a click with a 404. The
 * only proven destination for a city as a PLACE is the metropolis page at
 * /cities/[slug], which resolves from data/cities/city_list_v1.json.
 *
 * The two files key differently, so they are joined on a normalised name
 * (parenthetical qualifiers dropped, punctuation stripped). COUNTED, not
 * assumed: 101 of the 102 top100 rows join to a city page; the one that does not
 * gets a card with NO href rather than a dead one, because a card that does
 * nothing is better than a card that lies about where it goes.
 */
type CityListRow = { slug: string; name: string; iso2: string };
const CITY_PAGE_BY_ISO = (() => {
  const out: Record<string, CityListRow[]> = {};
  for (const c of (cityListJson as { cities: CityListRow[] }).cities) {
    const k = String(c.iso2 || "").toUpperCase();
    if (!out[k]) out[k] = [];
    out[k].push(c);
  }
  return out;
})();
function normalizePlaceName(value: string): string {
  let out = "";
  let depth = 0;
  for (const ch of String(value).toLowerCase()) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (depth === 0 && ch >= "a" && ch <= "z") out += ch;
    else if (depth === 0 && ch >= "0" && ch <= "9") out += ch;
  }
  return out;
}
/** The metropolis-page href for a covered city, or undefined when none joins. */
function cityPageHref(iso2: string, cityName: string): string | undefined {
  const pool = CITY_PAGE_BY_ISO[iso2] ?? [];
  const target = normalizePlaceName(cityName);
  const hit =
    pool.find((c) => normalizePlaceName(c.name) === target) ??
    pool.find((c) => normalizePlaceName(c.slug) === target);
  return hit ? `/cities/${hit.slug}` : undefined;
}

/* ------------------------------------------------------------------------- */
/* Small honest helpers.                                                      */
/* ------------------------------------------------------------------------- */

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
/** A stored decimal rate (0.138) as a percent figure (13.8), or undefined. */
function asPct(v: number | null | undefined): number | undefined {
  return isNum(v) ? Math.round(v * 1000) / 10 : undefined;
}
/** A whole-number percent already stored as a percent (63.5), or undefined. */
function asWhole(v: number | null | undefined, dp = 1): number | undefined {
  if (!isNum(v)) return undefined;
  const f = Math.pow(10, dp);
  return Math.round(v * f) / f;
}
function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  const s = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

/**
 * Finding I1 (2026-08-28 review round). A block's confidence is the WEAKEST
 * confidence of any fact it carries, never the confidence of its headline
 * fact alone: hero used to report "measured" whenever the take computed even
 * when a support fact (sales tax, a tier-B profile fallback) was "modeled",
 * so 60 countries got a measured block hiding a modeled fact inside.
 * "measured" beats "modeled" beats "placeholder", so the weakest one present
 * wins. Applied to every block that assembles from more than one source
 * (hero, lenses, hiring); a single-source block still calls this with a
 * one-element list, so the rule is uniform rather than special-cased per
 * block. An empty list defaults to "placeholder": a block asserting a
 * confidence about zero facts should never claim to be measured.
 */
const CONFIDENCE_WEAKNESS: Record<SpineConfidence, number> = {
  measured: 0,
  modeled: 1,
  placeholder: 2,
};
function weakestConfidence(confidences: SpineConfidence[]): SpineConfidence {
  if (confidences.length === 0) return "placeholder";
  return confidences.reduce((worst, c) =>
    CONFIDENCE_WEAKNESS[c] > CONFIDENCE_WEAKNESS[worst] ? c : worst,
  );
}

/* ------------------------------------------------------------------------- */
/* World reference values, computed ONCE at module scope from held data only.  */
/* ------------------------------------------------------------------------- */

/**
 * Rulebook v2 rule 8: one fixed site-wide formula per figure, never a hand-picked
 * benchmark. Each pool below is every country in src/lib/taxonomy.ts that HOLDS
 * the figure; a country with no value contributes nothing rather than a zero.
 * Built once at load, from JSON already in memory.
 */
const WORLD = (() => {
  const takes: number[] = [];
  const wages: number[] = [];
  const days: number[] = [];
  const lending: number[] = [];
  const fx: number[] = [];
  const inflation: number[] = [];
  for (const c of COUNTRIES) {
    // Government take: src/lib/tax/country_rates.ts, the one payroll + business
    // tax source (plan correction 1). Only countries holding BOTH contribute.
    const rates = getCountryRates(c.code);
    if (isNum(rates.cit) && isNum(rates.employerSocial)) {
      takes.push((rates.cit + rates.employerSocial) * 100);
    }
    // Days to register: src/lib/economics/country_metrics.ts (152 of 195 hold it).
    const snap = getCountryEconomicsSnapshot(c.code);
    if (isNum(snap.daysToStart)) days.push(snap.daysToStart);
    // The profile pool. getCountryProfile returns a generic fallback for a
    // country it does not hold, so a row only counts when its own iso2 matches.
    const p = getCountryProfile(c.code);
    if (p.iso2.toUpperCase() !== c.code) continue;
    if (isNum(p.median_wage_full_time_usd) && p.median_wage_full_time_usd > 0) {
      wages.push(p.median_wage_full_time_usd);
    }
    if (isNum(p.bank_lending_rate_pct)) lending.push(p.bank_lending_rate_pct * 100);
    if (isNum(p.exchange_rate_volatility_pct)) fx.push(p.exchange_rate_volatility_pct * 100);
    if (isNum(p.inflation_5y_avg_pct)) inflation.push(p.inflation_5y_avg_pct * 100);
  }
  return {
    takePool: takes,
    takeMedian: median(takes),
    wagePool: wages,
    wageMedian: median(wages),
    daysPool: days,
    lendingPool: lending,
    fxPool: fx,
    inflationPool: inflation,
  };
})();

/**
 * Where a value sits among every country that holds the same figure, 0 to 100.
 * A RANK, never a composite: it is like-for-like by construction, which is what
 * rule 10 asks for, and it introduces no weight, no divisor and no break table.
 * `invert` flips a burden so high always reads good (rule 29A).
 */
function rankPct(value: number | undefined, pool: number[], invert = false): number | undefined {
  if (!isNum(value) || pool.length < 20) return undefined;
  const below = pool.filter((v) => v < value).length;
  const pct = Math.round((below / pool.length) * 100);
  return invert ? 100 - pct : pct;
}

/* ------------------------------------------------------------------------- */
/* The six everyday trades (rulebook v2 rule 32, the fixed fill set).          */
/* ------------------------------------------------------------------------- */

/**
 * The ratified everyday set as taxonomy ids. The slug each resolves to is
 * derived with industryToSlug (src/lib/taxonomy.ts), the same call the live cell
 * links use, so a rename in the taxonomy can never silently break the funnel and
 * a slug is never typed by hand here.
 */
const EVERYDAY_TRADE_IDS = [
  "restaurants",
  "grocery_stores",
  "hairdressers_beauty",
  "sports_fitness",
  "auto_repair_shops",
  "cafes_coffee",
] as const;

/* ------------------------------------------------------------------------- */
/* The adapter.                                                               */
/* ------------------------------------------------------------------------- */

/**
 * Build the real-data spine country seed for one ISO-2 country code.
 *
 * Written for ANY country, not for the United Kingdom. The UK is the only page
 * the flag will open first, and it is the exemplar precisely so a mechanism that
 * is wrong elsewhere cannot hide behind a country whose figures happen to agree
 * (rulebook v2 rule 21, universality: every block self-omits cleanly rather than
 * printing a hole, a zero or an invented stand-in).
 *
 * Returns undefined when the code does not resolve to a country in the taxonomy,
 * so the route can notFound() exactly as the non-spine page does.
 */
export async function buildSpineCountrySeed(iso2: string): Promise<any> {
  const code = String(iso2 || "").toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === code);
  if (!meta) return undefined;

  const countryName = meta.name;

  /* ---- the read modules, each opened before its figures are used --------- */

  // src/lib/tax/country_rates.ts: `cit` and `employer_social` off
  // src/lib/tax/country_rates_2024.json (130 of 195 hold both). THE single
  // source for both quantities (plan correction 1).
  const rates = getCountryRates(code);
  // src/lib/economics/country_metrics.ts: daysToStart (152 of 195). Its other
  // outputs (net wealth, GDP per capita) are the banned trivia and are not read.
  const snapshot = getCountryEconomicsSnapshot(code);
  // src/lib/tax/smb_effective_rates.ts: the sales-tax row (70 of 195).
  const vatRow = getVatRow(code);
  // data/legal/business_formation_costs_v1.json, via src/lib/tax/country_rates.ts
  // (152 of 195). C31: the fee and `snapshot.daysToStart` above now come off
  // ONE row of that file, picked once by `getTypicalFormationRow` , Sole Trader,
  // else Freelancer, else LLC. Two pickers used to disagree on the 8 countries
  // with no Sole Trader tier, and the peers table printed the pair.
  const registrationCostUsd = getTypicalFormationCostUsd(code);
  // src/lib/economic_profile/index.ts over data/economic_indicators/country_profile_v2.json.
  // The file's own anchor says the top 50 are hand anchored ("Tier A") and the
  // rest are interpolated, so tier A reads measured and B/C read modeled.
  const profile = getCountryProfile(code);
  const profileHeld = profile.iso2.toUpperCase() === code;
  const profileConfidence: SpineConfidence =
    profileHeld && profile.tier === "A" ? "measured" : "modeled";
  /** A profile number, or undefined when this country's own row is not held. */
  const prof = (v: number | null | undefined): number | undefined =>
    profileHeld && isNum(v) ? v : undefined;

  /* ===================== HERO , THE GOVERNMENT TAKE ======================= */
  /* The one dominant figure (Task 10), and finding C2 (2026-08-28 review) is
     why it is named and unitised the way it now is. The old name,
     government_take_pct, and the old lens unit, pct_of_profit, both implied a
     single denominator: "38.8 of each 100 of profit." That sentence is false
     for every shop, because the figure sums a tax on PROFIT (the business tax
     rate) with a tax on WAGES (the employer payroll rate), and profit and
     wages are different bases. The field is government_take_composed_pct, the
     word "composed" is load-bearing, and the two components ride beside the
     total everywhere it appears (take_components on the hero, profit_tax_pct
     and payroll_tax_pct on the tax_burden lens) so a reader is never shown the
     sum without also being shown what it is a sum OF.

     BOTH numbers come from src/lib/tax/country_rates.ts and nowhere else, so
     the figure the hero prints and the rate the money block's arithmetic uses
     are the same number. Sales tax is named beside it and never added into it:
     the customer carries it, so it is not the owner's burden, which is the
     reason the legacy view model already gave and it is correct.

     Self-omits when either rate is missing, which is 65 of 195 countries. It
     does not fall back to the country profile: that is the source conflict plan
     correction 1 exists to settle, and a hero figure composed from two
     disagreeing tables is exactly the mechanism the rebuild is replacing. */
  const corporatePct = asPct(rates.cit);
  const payrollPct = asPct(rates.employerSocial);
  const governmentTakePct =
    corporatePct != null && payrollPct != null
      ? Math.round((corporatePct + payrollPct) * 10) / 10
      : undefined;

  /* THE ANSWER'S NEW BASIS (founder verdict 2026-08-30): "the calculations we
     should make should be on the effective tax that the business that has,
     let's say, under twenty employees is effectively paying." That is exactly
     what src/lib/tax/smb_effective_rates.ts holds (read whole before use: its
     own header says headline CIT is the wrong frame for small shops, and its
     rates are conservative reads at median SMB revenue , which makes them
     MODELED, not measured, so the block's confidence says so). 128 of 195
     countries carry a regime; the rest render no answer figure rather than
     falling back to the retired composed sum. The employer payroll rate rides
     BESIDE it as a separately named burden and is never added in: profit and
     wages are different denominators. */
  const smbRegime = getSmbRegime(code);
  const smbRatePct = smbRegime ? Math.round(smbRegime.effective_rate * 1000) / 10 : undefined;

  /* The support strip (Task 10), replacing the eight-tile grade board. Four
     published facts, each with its own unit and its own guard, and NO grade
     word anywhere: the board's Strong / Excellent / Fair adjectives came from
     hand-written break tables that exist nowhere but the page file, which is
     the defect design/replacements/country-scorecard.md replaces.

     Each fact carries its OWN confidence, so a country that has a published
     rate for one and an interpolated read for another is not flattened to a
     single tier for the whole strip. */
  type SupportFact = {
    key: string;
    label: string;
    value: number;
    unit: string;
    confidence: SpineConfidence;
    note?: string;
  };
  const support: SupportFact[] = [];
  if (isNum(snapshot.daysToStart)) {
    // src/lib/economics/country_metrics.ts, DAYS_TO_START_BY_ISO2.
    support.push({
      key: "register_days",
      label: "Time to register",
      value: Math.round(snapshot.daysToStart),
      unit: "days",
      confidence: "measured",
    });
  }
  if (isNum(registrationCostUsd)) {
    // data/legal/business_formation_costs_v1.json, the fee off the same row the
    // filing time above comes from (C31).
    support.push({
      key: "register_cost",
      label: "Cost to register",
      value: Math.round(registrationCostUsd),
      unit: "usd",
      confidence: "measured",
    });
  }
  if (corporatePct != null) {
    // src/lib/tax/country_rates.ts `cit`, with the row's own note carried so a
    // banded rate reads as a band rather than as a single flat number.
    support.push({
      key: "corporate_rate",
      label: "Business tax",
      value: corporatePct,
      unit: "pct",
      confidence: "measured",
    });
  }
  if (isNum(vatRow?.standard)) {
    // src/lib/tax/smb_effective_rates.ts, getVatRow.
    support.push({
      key: "sales_tax",
      label: "Sales tax",
      value: asPct(vatRow!.standard) as number,
      unit: "pct",
      confidence: "measured",
      note: "The customer carries it, so it is not the owner's burden.",
    });
  } else if (prof(profile.vat_gst_standard_pct) != null) {
    /* The one profile fallback in the hero strip, and it is safe because sales
       tax is NOT part of the composed take: it stands beside the take as its
       own named fact, so a fallback here cannot move the hero figure. It is
       tagged, because 145 of the profile's rows are interpolated. */
    support.push({
      key: "sales_tax",
      label: "Sales tax",
      value: asPct(profile.vat_gst_standard_pct) as number,
      unit: "pct",
      confidence: profileConfidence,
      note: "The customer carries it, so it is not the owner's burden.",
    });
  }

  /* Finding I1 (2026-08-28 review). The take itself carries no tiering
     (src/lib/tax/country_rates.ts makes no measured/modeled distinction), so
     it counts as "measured" whenever present; every support fact contributes
     its OWN confidence, so a tier-B country's fallback sales-tax fact
     correctly pulls the whole hero down to "modeled" instead of hiding inside
     a block that reads "measured". */
  const heroFactConfidences: SpineConfidence[] = [];
  if (smbRatePct != null) heroFactConfidences.push("modeled");
  for (const fact of support) heroFactConfidences.push(fact.confidence);

  const hero =
    smbRatePct != null || support.length > 0
      ? {
          _meta: {
            confidence: weakestConfidence(heroFactConfidences),
            source: "Published tax rates and registration fees for this country.",
          },
          // Finding C2: named government_take_COMPOSED_pct, not
          // government_take_pct. The figure sums a tax on profit and a tax on
          // wages, two different denominators, so no single "pct of X"
          // sentence about it is true; "composed" says so in the name itself.
          /* The answer and its named companions. rate + regime are one fact
             (the regime names what the rate IS); payroll is a SEPARATE burden
             on a separate base, shown beside and never summed. */
          effective_burden:
            smbRatePct != null && smbRegime
              ? {
                  rate_pct: smbRatePct,
                  regime_name: smbRegime.local_name,
                  payroll_pct: payrollPct,
                }
              : undefined,
          support: support.length > 0 ? support : undefined,
        }
      : undefined;

  /* ===================== CITIES AND THE MAP ============================== */
  /* Task 11. The real tradeable city set for this country from
     src/lib/cities.ts (top100.json), each city ONE clickable card, plus the
     curated coordinates plan correction 2 created. 53 countries hold at least
     one city and 142 hold none, so the whole block self-omits rather than
     rendering an empty frame, and the MAP self-omits separately below three
     coordinate-carrying cities. */
  const cityRows = getCitiesForCountry(code).slice(0, 8);
  const cities = cityRows.map((c: CityEntry) => {
    const coord = CURATED_COORDS[c.id];
    const hasCoord = coord != null && coord.iso2 === code && isNum(coord.lat) && isNum(coord.lng);
    return {
      id: c.id,
      name: c.name,
      // The geo code this city carries in the city set. Kept because the cell
      // routes take it; it is NOT a destination on its own (see cityPageHref).
      slug: c.slug,
      // Omitted when no city page joins, so a card is never a dead link.
      href: cityPageHref(code, c.name),
      region: c.region_name?.trim() || undefined,
      lat: hasCoord ? coord.lat : undefined,
      lng: hasCoord ? coord.lng : undefined,
    };
  });
  const mapPoints = cities.filter((c) => c.lat != null && c.lng != null);
  const citiesBlock =
    cities.length > 0
      ? {
          _meta: {
            confidence: "measured" as SpineConfidence,
            source: "The country's covered trading cities, with public map coordinates.",
          },
          list: cities,
          // Plan correction 2: three or more, or the map is not drawn at all.
          map_points: mapPoints.length >= 3 ? mapPoints : undefined,
        }
      : undefined;

  /* ===================== THE SIX LENSES ================================== */
  /* Task 13, replacing the hexagon. design/replacements/six-lenses.md, exactly
     its six categories and exactly the fields it names. Every lens carries ONE
     published figure with its own named unit; not one is a composite, and no
     lens substitutes an invented constant for a missing input the way the
     hexagon's reward lens did. A missing figure means that lens is dropped, and
     the block self-omits below four lenses so the grid is never a stub.

     Direction is declared per lens (rule 29A, high = good) and a burden carries
     `inverted: true` so the section task cannot accidentally render a cost as a
     virtue. The RANK is a percentile among the countries that hold the same
     figure: a position, not a score, so there is no weight to defend. */
  type Lens = {
    key: string;
    label: string;
    value: number;
    unit: string;
    inverted: boolean;
    rank_pct?: number;
    index_vs_world?: number;
    context?: Record<string, number | undefined>;
    confidence: SpineConfidence;
    // The tax_burden lens's two components, so its composed total can never
    // render without what it is a sum of (finding C2). Optional because only
    // one lens carries them; every other lens is already single-basis.
    profit_tax_pct?: number;
    profit_tax_basis?: string;
    payroll_tax_pct?: number;
    payroll_tax_basis?: string;
  };
  const lensList: Lens[] = [];

  // 1. Tax burden. The RANKED version of the hero number (the July-5
  //    ratification: reinforcing, not repeating), so it is the same composed
  //    take from src/lib/tax/country_rates.ts, never a second formula. Unit is
  //    "composed_pct", not "pct_of_profit" (finding C2): the value sums a
  //    profit-based tax and a wage-based tax, so no single denominator
  //    sentence about it is true. profit_tax_pct and payroll_tax_pct ride
  //    beside the composite as first-class fields with their bases named.
  //    RULE FOR TASK 10: the two components render beside the total, never
  //    the total alone.
  if (governmentTakePct != null) {
    lensList.push({
      key: "tax_burden",
      label: "What the state takes",
      value: governmentTakePct,
      unit: "composed_pct",
      inverted: true,
      rank_pct: rankPct(governmentTakePct, WORLD.takePool, true),
      confidence: "measured",
      profit_tax_pct: corporatePct,
      profit_tax_basis: "pct of taxable profit",
      payroll_tax_pct: payrollPct,
      payroll_tax_basis: "pct of gross wages",
    });
  }
  // 2. Ease of entry. src/lib/economics/country_metrics.ts, daysToStart.
  if (isNum(snapshot.daysToStart)) {
    lensList.push({
      key: "entry",
      label: "Time to register",
      value: Math.round(snapshot.daysToStart),
      unit: "days",
      inverted: true,
      rank_pct: rankPct(snapshot.daysToStart, WORLD.daysPool, true),
      confidence: "measured",
    });
  }
  // 3. Talent pool. src/lib/economic_profile: median full-time pay, read on the
  //    country's own terms and deliberately NOT ranked across countries, since
  //    it is a money figure and rule 10 is a hard rail.
  //    The quartile context this lens used to carry is GONE (N9, 2026-08-30):
  //    that pair is a fixed multiple of the median rather than a measurement,
  //    so it described nothing, and carrying it here kept a fabricated spread
  //    one render away from a reader. The measured spread lives on the
  //    customers card, which is why this lens stands down when that card shows.
  if (prof(profile.median_wage_full_time_usd) != null) {
    lensList.push({
      key: "talent",
      label: "What a skilled hand earns",
      value: Math.round(profile.median_wage_full_time_usd),
      unit: "usd_per_year",
      inverted: false,
      confidence: profileConfidence,
    });
  }
  // 4. Access to finance. src/lib/economic_profile, bank_lending_rate_pct,
  //    inverted (a high rate is a burden).
  if (prof(profile.bank_lending_rate_pct) != null) {
    lensList.push({
      key: "finance",
      label: "What borrowed money costs",
      value: asPct(profile.bank_lending_rate_pct) as number,
      unit: "pct",
      inverted: true,
      rank_pct: rankPct(profile.bank_lending_rate_pct * 100, WORLD.lendingPool, true),
      confidence: profileConfidence,
    });
  }
  // 5. Purchasing power. The SAME median pay as lens 3, but expressed as an
  //    INDEX against the world median, never as raw money against another
  //    country's raw money (rule 10, the exact rail node 16 was replaced for).
  if (prof(profile.median_wage_full_time_usd) != null && isNum(WORLD.wageMedian)) {
    lensList.push({
      key: "purchasing_power",
      label: "What a customer can pay",
      value: Math.round((profile.median_wage_full_time_usd / WORLD.wageMedian) * 100),
      unit: "index_world_median_100",
      inverted: false,
      index_vs_world: Math.round((profile.median_wage_full_time_usd / WORLD.wageMedian) * 100),
      confidence: profileConfidence,
    });
  }
  // 6. Stability. src/lib/economic_profile: how much the currency moves, with
  //    the five-year inflation average as its context. Both are burdens, both
  //    inverted. This lens OWNS the pair (see the ownership note in the header).
  if (prof(profile.exchange_rate_volatility_pct) != null) {
    lensList.push({
      key: "stability",
      label: "How much the money moves",
      value: asPct(profile.exchange_rate_volatility_pct) as number,
      unit: "pct",
      inverted: true,
      rank_pct: rankPct(profile.exchange_rate_volatility_pct * 100, WORLD.fxPool, true),
      context: { inflation_5y_avg_pct: asPct(profile.inflation_5y_avg_pct) },
      confidence: profileConfidence,
    });
  }
  const lenses =
    lensList.length >= 4
      ? {
          _meta: {
            // Finding I1: the weakest lens confidence, not a binary
            // all-measured check. The old ternary called the block "modeled"
            // the instant one lens was not "measured", which happened to read
            // right only because no lens has ever been tagged "placeholder";
            // weakestConfidence is correct for that case too, not by luck.
            confidence: weakestConfidence(lensList.map((l) => l.confidence)),
            source: "One published figure per lens, each with its own unit.",
          },
          list: lensList,
        }
      : undefined;

  /* ===================== THE MONEY , SIX TRADES ========================== */
  /* Task 14. What an owner keeps, per year, for the rulebook's fixed everyday
     set, at NATIONAL altitude, through the SAME pair of modules the trade pages
     use: ownerTakeHomeForCell (src/lib/scores/country_board.ts) resolves the
     cell's revenue and payroll through estimateNetProfit and then through
     resolveOwnerTakeHome, so the country page and the trade page can never
     print different take-home figures for the same trade.

     WHAT THIS BLOCK IS, STATED PLAINLY BECAUSE IT DECIDES THE TAG. The cell that
     resolves at national altitude is a country-level aggregate carrying coverage
     tier X, and the per-firm employee count and wage behind its payroll are
     filled defaults, not a local measurement. isTrustedLocalCell rejects a
     country-level cell by construction, so NO row here can ever be a trusted
     local read. The whole block is therefore "modeled", every row carries the
     same tag, and the United Kingdom is not exempt from it. That is exactly what
     design/replacements/easiest-trades.md rules.

     WHAT IS NOT HERE: the 0-to-100 ease score. It is a composite of four modeled
     archetypes with no unit, seven of its eight rows read the same word, and its
     example set was software and legal services rather than the everyday trades.
     It is replaced, not renamed.

     COVERAGE IS COUNTED, NOT ASSUMED (plan correction 5): a row with no
     defensible take-home is dropped rather than shown at zero, and the count of
     rows that did resolve rides on the block. */
  const placeGeo = code === "US" ? "california" : slugify(countryName);
  // The same two place inputs the cell board passes to the capital archetype, so
  // an opening cost shown here equals the one the trade page shows.
  const placeCostOfLiving = getCityCostOfLivingIndex(placeGeo);
  const placeAnnualIncome = isNum(snapshot.avgMonthlySalary)
    ? snapshot.avgMonthlySalary * 12
    : null;

  const tradeRows = await Promise.all(
    EVERYDAY_TRADE_IDS.map(async (industryId) => {
      const slug = industryToSlug(industryId);
      const cell = await withBudget(
        getCellBySlug(code.toLowerCase(), placeGeo, slug, { sizeBand: null, year: null }),
        null,
        6_000,
        `country-seed-take-home:${code}/${slug}`,
      );
      if (!cell) return null;
      const keeps = ownerTakeHomeForCell(cell, placeAnnualIncome);
      // src/lib/markets/startup_capital_archetypes.ts, place-adjusted. The
      // module's own header calls its figures directional, so this is modeled
      // wherever it appears and it never stands alone as a fact.
      const costToOpen = placeAdjustedStartupCapital({
        industryId,
        costOfLivingIndex: placeCostOfLiving,
        avgYearlySalary: placeAnnualIncome,
      });
      if (!isNum(keeps) || keeps <= 0) return null;
      return {
        name: cell.industry_name || cell.industry_description || industryId,
        slug,
        href: `/${code.toLowerCase()}/${placeGeo}/${slug}`,
        keeps_usd_year: Math.round(keeps),
        cost_to_open_usd: Math.round(costToOpen),
        confidence: "modeled" as SpineConfidence,
      };
    }),
  );
  const money0 = tradeRows.filter((r): r is NonNullable<typeof r> => r !== null);

  /* THE CREDIBILITY SCREEN, founder-decided 2026-08-29 and applied as ONE FIXED
     FORMULA rather than a picked list (rule 8 bans hand-picking per entity).
     The upstream engine produces keeps that are visibly wrong for some
     country-level aggregates: a UK gym owner keeping $513K, a Chad gym owner
     keeping $231K against a $3K median wage. Those figures are already live on
     the trade pages; they must not reach this page while they stand.

     The yardstick is the country's own typical full-time pay: a single everyday
     shop whose modeled keep exceeds SIX TIMES the median wage is in visibly
     wrong territory and is WITHHELD, counted, never silently dropped. Six is a
     generosity bound: a well-run single restaurant clearing two or three times
     the median is believable everywhere; past six is a chain's number wearing
     one shop's name. The founder's illustrative pass-list named auto repair,
     but at $293K, 7.6 times the UK median, it fails the very smell test he
     defined, and the formula, not the list, is what was ratified.

     Where no median exists the screen cannot run and rows pass with their
     modeled tag: a screen with no yardstick withholding figures would be
     guesswork in the other direction.

     BOTH BOUNDS NOW LIVE IN ONE PLACE, src/lib/finance/keep_credibility.ts,
     because this rule was written twice (here and in the cell view) and two
     copies of a ratified constant drift. That module also carries the low
     bound added the same day, a twentieth of the median, after the all-sizes
     blend fix moved eight pairs from a wrong the high screen hid into a wrong
     nothing was looking at. */
  const screenMedian = prof(profile.median_wage_full_time_usd);
  const moneyKept = money0.filter((r) => isKeepCredible(r.keeps_usd_year, screenMedian));
  const moneyWithheld = money0.length - moneyKept.length;
  const money =
    moneyKept.length >= 2
      ? {
          _meta: {
            confidence: "modeled" as SpineConfidence,
            source:
              "Modeled at country altitude from country and industry patterns, not a local measurement.",
          },
          altitude: "national",
          coverage: { resolved: money0.length, attempted: EVERYDAY_TRADE_IDS.length, shown: moneyKept.length },
          withheld:
            moneyWithheld > 0
              ? {
                  count: moneyWithheld,
                  reason:
                    moneyWithheld === 1
                      ? "One trade is withheld while its figure is checked upstream."
                      : String(moneyWithheld) + " trades are withheld while their figures are checked upstream.",
                }
              : undefined,
          list: moneyKept,
        }
      : undefined;

  /* ===================== WHAT CUSTOMERS EARN ============================= */
  /* Task 14's second half: pay read on the country's own terms, never ranked
     against another country's money (rule 10).

     THE MARKS ARE DECILES (N9, 2026-08-30). The founder: "we should seek to
     find the average, the top ten percent and the bottom ten percent. Instead
     you are just saying the lower quarter or the upper quarter... that's not
     very helpful." The quartile pair this block used to emit was never
     measured , recompute_wages_from_median.ts writes p25 as median x 0.65 and
     p75 as median x 1.55 for all 197 countries , so it is not passed on here
     at all, under any name.

     THE MEDIAN ALONE IS ENOUGH TO RENDER. The card states the typical figure
     whenever the country holds it, and adds the drawn spread only when real
     deciles have been researched for that country (wage_p10_usd /
     wage_p90_usd, filled from data/economics/wage_deciles_v1.json). The
     ordering guard is not decoration: a spread whose marks are out of order
     would be a data fault, and it is better to show the typical alone than a
     drawing that lies about which end is which. */
  const medianPay = prof(profile.median_wage_full_time_usd);
  const payP10 = prof(profile.wage_p10_usd);
  const payP90 = prof(profile.wage_p90_usd);
  const decilesOrdered =
    medianPay != null && payP10 != null && payP90 != null && payP10 < medianPay && medianPay < payP90;
  /* A modeled dispersion tags the card. getWageDecileConfidence answers for the
     spread only, so a measured typical is not demoted by a country that simply
     has no decile research yet. */
  const decileConfidence = decilesOrdered ? getWageDecileConfidence(code) : null;
  const customers =
    medianPay != null
      ? {
          _meta: {
            confidence:
              decileConfidence === "modeled" ? ("modeled" as SpineConfidence) : profileConfidence,
            source: "Full-time pay for this country, read on its own terms.",
          },
          median_usd: Math.round(medianPay),
          ...(decilesOrdered
            ? { p10_usd: Math.round(payP10 as number), p90_usd: Math.round(payP90 as number) }
            : {}),
          basis: "Full-time pay, a year.",
        }
      : undefined;

  /* ===================== WHAT PREMISES COST ============================== */
  /* Task 16's CONNECTs, the other two of plan correction 3: what premises cost
     to run (commercial rent by location tier, plus commercial electricity) and
     what borrowed money costs. All held for essentially every country and
     rendered nowhere today. Each field guards itself, so a country holding rent
     but no electricity shows rent alone. */
  const rentPrime = prof(profile.commercial_rent_t1_usd_per_sqm_year);
  const rentMid = prof(profile.commercial_rent_t2_usd_per_sqm_year);
  const rentEdge = prof(profile.commercial_rent_t3_usd_per_sqm_year);
  const electricity = prof(profile.electricity_usd_per_kwh_commercial);
  const lendingRate = prof(profile.bank_lending_rate_pct);
  const premises =
    rentPrime != null || electricity != null || lendingRate != null
      ? {
          _meta: {
            confidence: profileConfidence,
            source: "What space, power and borrowed money cost a business here.",
          },
          rent_prime_usd_sqm_year: rentPrime != null ? Math.round(rentPrime) : undefined,
          rent_mid_usd_sqm_year: rentMid != null ? Math.round(rentMid) : undefined,
          rent_edge_usd_sqm_year: rentEdge != null ? Math.round(rentEdge) : undefined,
          electricity_usd_per_kwh: electricity != null ? Math.round(electricity * 1000) / 1000 : undefined,
          lending_rate_pct: asPct(lendingRate),
        }
      : undefined;

  /* ===================== THE PEERS TABLE ================================= */
  /* Task 12. The ratified peer set is PEER_GROUPS in
     src/lib/countries/country_view.ts (51 countries, comparable market size, NOT
     bordering), reused rather than re-listed so there is one peer map in the
     repo. Four like-for-like set-up FACTS per country, the same four the legacy
     table carried and the founder kept: business tax, payroll on staff, cost to
     register, time to register.

     The business tax and payroll columns read from src/lib/tax/country_rates.ts,
     the same single source as the hero, so the home row of this table and the
     hero figure above it are the same number rather than two rates a reader
     could catch disagreeing.

     Self-omits for the 144 countries absent from the peer map, which is honest:
     a peer table with no peers is not a table. */
  const peerCodes = (PEER_GROUPS[code] ?? []).slice(0, 4);
  const peerFacts = [code, ...peerCodes]
    .map((pc) => {
      const pMeta = COUNTRIES.find((c) => c.code === pc);
      if (!pMeta) return null;
      const pRates = getCountryRates(pc);
      const pSnap = getCountryEconomicsSnapshot(pc);
      return {
        iso2: pc,
        name: pMeta.name,
        home: pc === code,
        effective_tax_pct: (() => {
          const r = getSmbRegime(pc);
          return r ? Math.round(r.effective_rate * 1000) / 10 : undefined;
        })(),
        payroll_pct: asPct(pRates.employerSocial),
        register_cost_usd: (() => {
          const v = getTypicalFormationCostUsd(pc);
          return isNum(v) ? Math.round(v) : undefined;
        })(),
        register_days: isNum(pSnap.daysToStart) ? Math.round(pSnap.daysToStart) : undefined,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const peers =
    peerFacts.length >= 2
      ? {
          _meta: {
            confidence: "measured" as SpineConfidence,
            source: "The same published set-up facts for each country, side by side.",
          },
          list: peerFacts,
          caveat:
            "Peers are picked for comparable size and market, not for sharing a border. Effective tax is what a small business typically pays under each country's own small-business rules, so read each column on its own terms.",
        }
      : undefined;

  /* ===================== THE CHARACTER OF THE PLACE ====================== */
  /* Task 15. The two 6-spectra tables the legacy page already renders, kept
     whole: the panel called them the ratified character form and the closest
     thing on the page to the current law, and dropping or butchering them is a
     standing founder rule. Source: getCountrySignature in
     src/lib/countries/country_signature.ts, 196 of 196 countries, all twelve
     scores present.

     TAGGED AS MODELED, and it is a change from today. These are 1-to-10 and
     0-to-10 reads hand anchored per country against published indices, not
     measurements of the country itself, so they are not "measured" in the sense
     a published tax rate is. They render untagged today because the legacy route
     is invisible to the tag gate; putting them behind a seed is what makes the
     tag possible at all. */
  const signature = getCountrySignature(code);
  const character =
    signature && signature.culture && signature.government
      ? {
          _meta: {
            confidence: "modeled" as SpineConfidence,
            source: "Country reads anchored to published governance and social indices.",
          },
          government: signature.government,
          culture: signature.culture,
          foreign_born_pct: asWhole(signature.foreign_born_pct, 0),
          /* Carried by the signature type all along and never passed; the
             founder's 2026-08-30 second batch seats it at the bottom of the
             dealing-with-the-state table. */
          foreign_owned_pct: asWhole(signature.foreign_owned_pct, 0),
          // Labels only. The source blurbs carry parenthetical notes written for
          // the data team, which is internal copy and never reaches a reader.
          signature_sectors: (signature.signature_sectors ?? [])
            .map((s) => s.label)
            .filter((l): l is string => typeof l === "string" && l.length > 0),
        }
      : undefined;

  /* ===================== STAFF: WHAT A PERSON COSTS ====================== */
  /* Task 17. The wage floor beside typical pay (the panel judged the two-bar
     form honest), the employer payroll rate FROM THE TAX MODULE (plan
     correction 1, never from the profile), and the three readings
     design/replacements/talent-pool.md puts in place of the dark TalentReality
     block: how much of the working-age population is in the labour force, how
     much of the economy runs informally, and what an employer adds on top of a
     wage. The informal share is a burden and is flagged inverted so a section
     task cannot render it as a virtue (rule 29A).

     Retention and turnover are NOT here and are not estimated: the repo holds no
     country-wide row for either, and a made-up retention score is the exact
     defect this rebuild exists to remove.

     FINDING I2 (2026-08-28 review): the multiplier used to read
     profile.fully_loaded_labor_multiplier, built from the country_profile_v2
     payroll table this file otherwise excludes (plan correction 1), and sat
     beside employer_payroll_pct from the tax module: a rival source inside a
     single-source block. Cyprus printed 8.4 percent beside a multiplier that
     adds 36.9 percent, two disagreeing stories about the same on-cost on one
     page. It is now payroll_only_multiplier, 1 + employerSocial from the SAME
     src/lib/tax/country_rates.ts source as employer_payroll_pct, and the name
     says what it excludes: pension autoenrolment, employer insurance and paid
     leave, all of which the profile's rival figure folded in and this one does
     not. Omitted, never estimated, when the tax module holds no rate. */
  const wageFloor = prof(profile.minimum_wage_annual_usd);
  const typicalPay = prof(profile.median_wage_full_time_usd);
  const labourForcePct = asWhole(prof(profile.labor_force_participation_pct));
  const informalSharePct = asWhole(prof(profile.informal_economy_share_pct));
  const payrollOnlyMultiplier =
    rates.employerSocial != null ? Math.round((1 + rates.employerSocial) * 100) / 100 : undefined;
  /* FINDING I1 (2026-08-28 review): the weakest confidence of the facts this
     block actually carries, not a special case over two of its six fields.
     The old ternary called the whole block "modeled" the instant payrollPct
     was absent, even when every other fact present was tier-A measured, and
     called it "measured" only when both payroll AND the profile tier lined
     up, which is the identical defect from the opposite direction. */
  const hiringFactConfidences: SpineConfidence[] = [];
  // employer_payroll_pct: src/lib/tax/country_rates.ts, no tiering, measured
  // whenever the country holds a rate.
  if (payrollPct != null) hiringFactConfidences.push("measured");
  if (wageFloor != null) hiringFactConfidences.push(profileConfidence);
  if (typicalPay != null) hiringFactConfidences.push(profileConfidence);
  // payroll_only_multiplier is derived from the same measured rate as
  // employer_payroll_pct, so it carries the same confidence.
  if (payrollOnlyMultiplier != null) hiringFactConfidences.push("measured");
  if (labourForcePct != null) hiringFactConfidences.push(profileConfidence);
  if (informalSharePct != null) hiringFactConfidences.push(profileConfidence);

  const hiring =
    payrollPct != null || wageFloor != null || typicalPay != null
      ? {
          _meta: {
            confidence: weakestConfidence(hiringFactConfidences),
            source: "Published payroll rates beside this country's own pay figures.",
          },
          // src/lib/tax/country_rates.ts, employer_social. Measured everywhere
          // it exists; the profile's rival figure is never read.
          employer_payroll_pct: payrollPct,
          wage_floor_usd_year: wageFloor != null ? Math.round(wageFloor) : undefined,
          typical_pay_usd_year: typicalPay != null ? Math.round(typicalPay) : undefined,
          payroll_only_multiplier: payrollOnlyMultiplier,
          labour_force_pct: labourForcePct,
          informal_share_pct: informalSharePct,
          informal_is_burden: true,
          /* THE TAG DESCRIBES THE FACTS IT SITS BESIDE, OR IT DOES NOT PRINT.
             This used to carry the profile confidence unconditionally, so a
             country in the tax module but without a profile got confidence_pay
             = modeled while wage_floor and typical_pay were absent, a tag
             describing nothing present. A body author pattern-matching on a
             confidence-shaped field would tag the wrong figure. Review finding,
             2026-08-28. */
          confidence_pay: wageFloor != null || typicalPay != null ? profileConfidence : undefined,
        }
      : undefined;

  /* ===================== THE GROUND UNDER A SHOP ========================= */
  /* Task 17's second half, replacing the footing bars. The two rows that were
     literals at 0.5 for all 195 countries are gone; what stays are the two
     institutional indices the card already held, printed as named numbers on
     their own 0-to-100 scales instead of blended into a footing word.

     The currency and inflation half of that replacement lives on the stability
     LENS instead, so neither figure is printed twice on one page. See the
     ownership note in the file header. */
  const cleanDealing = prof(profile.corruption_perception_index);
  const easyAdmin = prof(profile.ease_of_doing_business_index);
  const ground =
    cleanDealing != null || easyAdmin != null
      ? {
          _meta: {
            confidence: profileConfidence,
            source: "Two published institutional readings, each on its own 0 to 100 scale.",
          },
          clean_dealing_0_100: cleanDealing != null ? Math.round(cleanDealing) : undefined,
          easy_admin_0_100: easyAdmin != null ? Math.round(easyAdmin * 10) / 10 : undefined,
          direction: "high_good",
        }
      : undefined;

  /* ===================== GETTING SET UP ================================== */
  /* Task 16. The per-legal-tier registration table the July-5 audit marked
     "execution GOOD, keep", read from the same file the live component reads
     (data/legal/business_formation_costs_v1.json, 152 of 195 countries). Fees
     and filing times are published rules, so this is measured. */
  const formationRows = (FORMATION[code] ?? [])
    .filter((r) => typeof r.tier === "string")
    .map((r) => ({
      tier: r.tier as string,
      local_term: r.local_term || undefined,
      cost_usd: isNum(r.setup_cost_usd) ? Math.round(r.setup_cost_usd) : undefined,
      days: isNum(r.setup_days) ? Math.round(r.setup_days) : undefined,
      complexity_1_5: isNum(r.complexity_score) ? Math.round(r.complexity_score) : undefined,
    }));
  const setup =
    formationRows.length > 0
      ? {
          _meta: {
            confidence: "measured" as SpineConfidence,
            source: "Published registration fees and filing times, by legal form.",
          },
          tiers: formationRows,
        }
      : undefined;

  /* ===================== WHAT LOCALS KNOW =============================== */
  /* Task 18. The four items are hand written and exist for the United Kingdom
     alone; 194 countries render nothing here rather than a template. The content
     was judged genuinely useful and is kept, but it is restructured from four
     long sentences into LABEL plus FACT pairs so the section can be read rather
     than waded through (founder verdict 9: "just a block of text that's
     unreadable").

     TAGGED "placeholder", which is the honest word: nothing here is derived from
     a dataset. It is authored editorial standing where a sourced local-knowledge
     table does not exist yet. */
  const LOCALS_KNOW: Record<string, Array<{ label: string; fact: string }>> = {
    GB: [
      {
        label: "Registering is fast, payroll is not",
        fact: "A sole trader can register online in an afternoon. Setting up an employer scheme to run payroll is the step that actually takes time.",
      },
      {
        label: "The headline rent is not the rent",
        fact: "On a strong high street, rates and service charge can add a third again on top of the quoted figure.",
      },
      {
        label: "Small premises often pay less",
        fact: "Most counties hold a rate relief for small premises, so the same shop can cost very different amounts a few miles apart.",
      },
      {
        label: "The first hire triggers a pension",
        fact: "Hiring a first employee triggers pension auto-enrolment, so budget for the on-cost from the first payslip, not later.",
      },
    ],
  };
  const localsItems = LOCALS_KNOW[code];
  const locals_know =
    localsItems && localsItems.length > 0
      ? {
          _meta: {
            confidence: "placeholder" as SpineConfidence,
            source: "Written by hand for this country, not derived from a dataset.",
          },
          items: localsItems,
        }
      : undefined;

  /* ===================== THE HONEST TAKE ================================ */
  /* Task 18's close. The three ticked checks the panel judged the right closing
     voice, kept as data. Like the block above, they exist for the United Kingdom
     alone and are authored, so they carry the same honest tag and self-omit
     everywhere else. The legacy view model's fallback for the other 194 is a
     single templated verdict with no checks, which resolves to two distinct
     strings across the whole atlas; that is the same failure of differentiation
     the gut check was cut for, so it is not carried. */
  const HONEST_TAKE: Record<
    string,
    { verdict: string; points: string[]; body: string }
  > = {
    GB: {
      verdict:
        "An easy place to start and a hard place to keep staff cheaply.",
      points: [
        "Registering a sole trader is quick and nearly free; the real cost arrives with the first hire.",
        "The wage floor rises most years, so a low-pay model has a shrinking runway.",
        "Rent in the strong locations takes a bigger bite than the tax does.",
      ],
      body: "Most owners draw a wage closer to a senior employee than a business owner in year one, and the upside is in scale, a second site or a second van, not in the first.",
    },
  };
  const takeRow = HONEST_TAKE[code];
  const honest_take = takeRow
    ? {
        _meta: {
          confidence: "placeholder" as SpineConfidence,
          source: "Written by hand for this country, not derived from a dataset.",
        },
        verdict: takeRow.verdict,
        points: takeRow.points,
        body: takeRow.body,
      }
    : undefined;

  /* ===================== META AND PROVENANCE ============================= */
  /* One provenance line, composed from what this seed ACTUALLY carries rather
     than from a fixed string, so a thin country never claims a rich page. No
     source-agency name appears in it, per the standing constraint. */
  const provenanceParts: string[] = [];
  if (hero != null && governmentTakePct != null) {
    provenanceParts.push("Tax rates and registration fees are the published rules here");
  }
  if (money != null) {
    provenanceParts.push("the trade figures are modeled at country altitude, not measured locally");
  }
  if (profileConfidence === "modeled") {
    provenanceParts.push("the wage, premises and stability figures are interpolated for this country");
  }
  /* Sentence case, composed. The first clause is not always the tax one (a
     country with no held rates drops it), so the opening letter is raised here
     rather than assumed, which is how it printed lowercase for Chad. */
  const provenanceJoined = provenanceParts.join("; ");
  const provenance_line =
    provenanceJoined.length > 0
      ? `${provenanceJoined.charAt(0).toUpperCase()}${provenanceJoined.slice(1)}.`
      : "Only the figures this country actually holds are shown.";

  const metaBlock = {
    _meta: {
      confidence: "measured" as SpineConfidence,
      source: "Country identity from the site taxonomy.",
    },
    iso2: code,
    country_name: countryName,
    provenance_line,
  };

  return {
    meta: metaBlock,
    hero,
    cities: citiesBlock,
    lenses,
    money,
    customers,
    premises,
    peers,
    character,
    hiring,
    ground,
    setup,
    locals_know,
    honest_take,
  };
}
