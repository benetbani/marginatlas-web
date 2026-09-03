/**
 * src/lib/tax/country_rates.ts
 *
 * Country-level rates for the "set-up and run cost" block on the country page:
 *   - the employer payroll / social-contribution rate (the payroll tax on staff)
 *   - the typical one-time cost to register a small business
 * Both are planning estimates only; regional / state variation is out of scope
 * here. The corporate-income-tax field is also exposed for completeness.
 */
import countryRatesJson from "./country_rates_2024.json";
import formationJson from "../../../data/legal/business_formation_costs_v1.json";

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

type RateRow = { cit?: number; employer_social?: number; notes?: string };
const RATES = (countryRatesJson as { rates: Record<string, RateRow> }).rates;

/** Corporate income tax + employer payroll rates for a country, or nulls. */
export function getCountryRates(iso2: string): {
  cit: number | null;
  employerSocial: number | null;
} {
  const r = RATES[iso2.toUpperCase()];
  return {
    cit: r && isNum(r.cit) ? r.cit : null,
    employerSocial: r && isNum(r.employer_social) ? r.employer_social : null,
  };
}

type FormationRow = {
  tier?: string;
  setup_cost_usd?: number;
  setup_days?: number;
  complexity_score?: number;
};
const FORMATION =
  (formationJson as { countries?: Record<string, FormationRow[]> }).countries ?? {};

/**
 * ================ C31, 2026-09-03: ONE PICK ORDER, NOT TWO ==================
 *
 * THE DEFECT, MEASURED BEFORE ANYTHING MOVED. The country page's peers table
 * printed "Cost to register" and "Time to register" as one country's pair, and
 * they came from TWO DIFFERENT ROWS of `business_formation_costs_v1.json`:
 * the fee from a picker here that read `Sole Trader ?? the first NON-Freelancer
 * ?? row 0`, and the filing time from a second picker in
 * `src/lib/economics/country_metrics.ts` that read
 * `Sole Trader ?? Freelancer ?? LLC ?? the minimum across all tiers`. The two
 * orders disagree wherever a country has no Sole Trader tier, which is
 * **8 of the 152 countries in the file: ES, MX, BE, GR, RO, AR, MA and TN.**
 * Belgium printed "$1,200" (its limited company) beside "7 days" (its
 * freelancer); Spain "$600" beside "7 days" where that $600 form takes 21.
 * On five of the eight the printed pair exists in no row of the file at all
 * (ES, MX, BE, MA, TN); on the other three the two tiers happen to share a
 * filing time, so the pair was a coincidence rather than a fact.
 *
 * IT WAS NOT A RARE PAGE. Counted over PEER_GROUPS: **23 of the 51 peer tables
 * in the atlas print at least one mixed row, 35 rows in total**, seven of them
 * the reader's own home row. This is the one card the founder praised
 * unprompted, so it is the last card on the site that may state a pair no
 * source holds.
 *
 * THE ONE ORDER, and it is the FILING TIME's order rather than the fee's:
 * **Sole Trader, else Freelancer, else LLC, else the lowest-complexity row.**
 * Both figures come off THE SAME ROW, which is the whole point: whatever tier
 * is chosen, the fee and the wait describe one legal form.
 *
 * WHY THE FREELANCER STEP AND NOT THE OLD "first non-Freelancer". The file's
 * own tier definitions settle it: a Sole Trader and a Freelancer are both the
 * unlimited-liability personal route, while an LLC is a categorically different
 * product because it buys the liability wall. Skipping the freelancer meant
 * comparing Germany's registered person against Belgium's limited company in
 * one column with a winner mark on it, which is the like-for-like rule broken
 * inside a single row of a comparison table, and it overstated Belgium's cost
 * of entry twelve-fold. Sole Trader still leads, because the column says
 * REGISTER and that is the tier the commercial registry actually holds, and
 * because the atlas's subject is street-visible businesses: a shop or a
 * restaurant cannot trade under a freelancer regime where a sole-trader
 * registration exists.
 *
 * THE DEAD FALLBACK IS GONE. `country_metrics`'s last resort was
 * `Math.min(...tiers.map(days))`, a minimum taken ACROSS tiers, which is a
 * cross-form figure by construction. Measured: it fires for 0 of 152 countries,
 * because every country in the file carries an LLC. It is replaced by a ROW
 * (the lowest complexity_score, ties to file order) so that the accessor can
 * only ever return facts that sit on one line of the source.
 *
 * WHAT MOVED: 8 fees, 0 filing times, and no GB figure at all.
 */
const FORMATION_ORDER = ["Sole Trader", "Freelancer", "LLC"] as const;

export type FormationPick = {
  /** The legal form the pair describes, from the file's own tier names. */
  tier: string;
  /** One-time government + notary fee, USD, or null when the row omits it. */
  costUsd: number | null;
  /** Typical filing turnaround in days, or null when the row omits it. */
  days: number | null;
};

/**
 * The ONE row every caller reads for "what it costs and how long it takes to
 * register here". Null when the country has no curated formation breakdown
 * (152 of 195 hold one).
 */
export function getTypicalFormationRow(iso2: string): FormationPick | null {
  const rows = FORMATION[iso2.toUpperCase()];
  if (!rows || rows.length === 0) return null;
  let pick: FormationRow | undefined;
  for (const tier of FORMATION_ORDER) {
    pick = rows.find((r) => r.tier === tier);
    if (pick) break;
  }
  if (!pick) {
    // The lightest form on offer, by the file's own complexity score. Ties keep
    // file order, which the file writes lightest-first.
    pick = rows.reduce(
      (a, b) => ((b.complexity_score ?? 99) < (a.complexity_score ?? 99) ? b : a),
      rows[0],
    );
  }
  if (!pick || typeof pick.tier !== "string") return null;
  return {
    tier: pick.tier,
    costUsd: isNum(pick.setup_cost_usd) ? pick.setup_cost_usd : null,
    days: isNum(pick.setup_days) ? pick.setup_days : null,
  };
}

/**
 * Typical one-time government cost to register a small business (USD), off the
 * row `getTypicalFormationRow` picks. Null when the country has no curated
 * formation breakdown.
 */
export function getTypicalFormationCostUsd(iso2: string): number | null {
  return getTypicalFormationRow(iso2)?.costUsd ?? null;
}
