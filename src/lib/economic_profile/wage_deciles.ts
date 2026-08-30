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
