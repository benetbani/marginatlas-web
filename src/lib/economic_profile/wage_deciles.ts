/**
 * Wage-decile provenance accessor.
 *
 * The profile carries wage_p10_usd / wage_p90_usd as plain numbers, because
 * that is all the render needs. This module carries the one fact the render
 * cannot infer from a number: whether that country's dispersion was READ from
 * a published decile table, or transported from a published decile RATIO onto
 * our own median. The country page's customers card tags itself from this, so
 * a spread that was modeled says so under the founder's sample rule rather
 * than passing as measured.
 *
 * The research itself, and the absolute figures behind every ratio, live in
 * data/economics/wage_deciles_v1.json. Nothing here computes a decile; the
 * arithmetic happens once, in scripts/data/apply_wage_deciles.ts.
 */
import decilesJson from "../../../data/economics/wage_deciles_v1.json";

export type WageDecileConfidence = "held" | "modeled";

type DecileRecord = {
  d1_over_d5: number;
  d9_over_d5: number;
  _meta?: { confidence?: string; source?: string; as_of?: string; method?: string };
};

type DecileFile = { countries: Record<string, DecileRecord> };

const FILE = decilesJson as unknown as DecileFile;

/**
 * How this country's decile spread was established, or null when we hold no
 * research for it (in which case the profile carries no deciles either and the
 * card shows the typical alone).
 */
export function getWageDecileConfidence(
  iso2: string | null | undefined,
): WageDecileConfidence | null {
  if (!iso2) return null;
  const rec = FILE.countries[iso2.toUpperCase()];
  if (!rec) return null;
  return rec._meta?.confidence === "held" ? "held" : "modeled";
}

/** Every country for which decile research is held. Used by the gate. */
export function listWageDecileCountries(): string[] {
  return Object.keys(FILE.countries).sort();
}

/* ======================================================================== *
 * THE WAGE-FLOOR TOLERANCE, founder ruling of 2026-09-03, queue row C52.
 *
 * THE FAULT, found while REFUSING row C30 and gated but not fixed by that run
 * (verify_wage_deciles R8): the country page prints a bottom tenth of full-time
 * pay in one card and a legal annual minimum in another, about thirteen hundred
 * pixels apart, and on seven countries the bottom tenth is the SMALLER of the
 * two. Australia states "Bottom tenth $37K" above "Wage floor $42K" and
 * explains nothing.
 *
 * THE RULING, verbatim in effect: under five percent the two figures are two
 * sources rounding differently and no reader can perceive a contradiction, so
 * the page stands unchanged. At five percent or above the page is contradicting
 * itself in public, and the contradiction must stop reaching a reader.
 *
 * THE FIVE PERCENT IS STATED HERE AND NOWHERE ELSE. The adapter withholds by
 * it and scripts/verify_wage_deciles.ts reports by it; a second literal in
 * either file would be a second ruling waiting to drift from this one.
 *
 * WHY THE PAIR AND NOT THE ONE FIGURE, argued in full in the ledger and
 * summarised here because the signature is what a later reader meets first:
 * the doubtful figure is p10 alone, but p10 is the LOW END of a brace whose
 * other end is p90 and whose notch is the median. Returning a brace with no low
 * end breaks a drawing to fix a number, and half a spread is already refused
 * one layer down by this gate's own R7 ("a row holds both deciles or neither").
 * So the spread is withheld whole, and the customers card falls to the
 * typical-alone branch it was BUILT with and that a hundred and fifty countries
 * without decile research already render. Nothing renders a zero, a dash or an
 * empty frame; the card keeps its answer, its accent and its warrant.
 *
 * WHY NOT THE FLOOR INSTEAD. The floor is a statute, the most defensible figure
 * of the four, and it is one of TWO bars measured from one shared zero whose
 * whole reading is the gap between the legal minimum and what people are
 * actually paid. Withholding a law to protect a modeled derivation inverts the
 * honesty ordering and empties a declared bar set at the same time.
 *
 * NEITHER FIGURE IS PROVEN WRONG. p10 is a published dispersion RATIO
 * transported onto a separately normalised median; the floor is a third
 * research line; a statutory minimum is usually hourly or monthly and reaches
 * the page annualised on a full-year assumption; and several of these countries
 * lawfully pay below the adult full-time minimum (junior, apprentice, trainee
 * and supported-wage rates), or set the minimum sub-nationally so that any
 * single national figure is an aggregation choice. The pair is INCONSISTENT,
 * not refuted. This function therefore decides only what a reader may be shown,
 * and asserts nothing about which number is true.
 * ======================================================================== */

/** The founder's tolerance, as a percentage of the stated legal minimum. */
export const WAGE_FLOOR_TOLERANCE_PCT = 5;

/**
 * How far a bottom decile falls below a stated annual wage floor, as a
 * percentage of that floor. Null when either figure is absent, or when the
 * decile is not below the floor and so there is nothing to measure.
 */
export function decileShortfallBelowFloorPct(
  p10: number | null | undefined,
  annualWageFloor: number | null | undefined,
): number | null {
  if (typeof p10 !== "number" || !Number.isFinite(p10)) return null;
  if (typeof annualWageFloor !== "number" || !Number.isFinite(annualWageFloor)) return null;
  if (annualWageFloor <= 0) return null;
  if (p10 >= annualWageFloor) return null;
  return ((annualWageFloor - p10) / annualWageFloor) * 100;
}

/**
 * Whether the drawn spread may be published beside this country's own stated
 * wage floor.
 *
 * A floor that the page does not state cannot be contradicted by anything the
 * page prints, so an absent floor publishes: the caller passes the SAME guarded
 * value the hiring card renders, never the raw profile field, or the two would
 * disagree about what a reader is looking at.
 */
export function mayPublishDecileSpread(
  p10: number | null | undefined,
  annualWageFloor: number | null | undefined,
): boolean {
  const shortfall = decileShortfallBelowFloorPct(p10, annualWageFloor);
  if (shortfall === null) return true;
  return shortfall < WAGE_FLOOR_TOLERANCE_PCT;
}
