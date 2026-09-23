/**
 * src/lib/spine/country_exit_rows.ts
 *
 * WHAT A BUSINESS HERE SELLS FOR, the country page's `17 exit` (2026-09-23,
 * brief NEW-SECTIONS-2026-09-23.md row C3).
 *
 * THE PAIN, and it is the one nobody answers for free: a person deciding where
 * to open is deciding where to be stuck. Every guide tells them how to start
 * and none tells them what the thing is worth at the end or how long it takes
 * to find a buyer. This card is that, and it is the reason the page is worth
 * reading twice.
 *
 * WHERE THE FIGURES COME FROM, with their coverage, measured 2026-09-23 by
 * `scripts/audit/unused_fields.mjs` and read by nothing under `src/` until
 * this builder, on the country shard (`data/facts/country/<ISO2>.json`):
 *  - `risk_exit.exit.multiple_low` and `multiple_high` (198 of 198): what a
 *    business sells for as a multiple of its yearly earnings, the low and the
 *    high of the usual band. The United Kingdom is 2 to 3.5.
 *  - `risk_exit.exit.time_to_sell_months_low` and `_high` (198 of 198): how
 *    long a sale takes from listing to money, 6 to 12 months for the United
 *    Kingdom.
 *  - `risk_exit.exit.climate` (198 of 198), one of three words the file uses:
 *    active, steady, thin. It is the market for buyers, not a score.
 * Every one of them carries the tag `held` on the shards read so far, which is
 * the bank's word for a figure that was gathered rather than modelled.
 *
 * THE PRICE IS NOT DRAWN, AND THE REASON IS HIS RULE, not an oversight. The
 * file holds the sale price as a multiple of a year's earnings (2 to 3.5 for
 * the United Kingdom), and MODEL 8.6 clause 15 says a sale price is shown in
 * currency and NEVER as a multiple: a multiple is a professional's unit and
 * the reader of this page is opening their first business. Turning it into
 * currency needs a typical earnings figure per country, which this bank does
 * not hold, so the price waits on DATA-REQUIREMENTS rather than printing in a
 * unit the site has already ruled against. The copy gate caught the word in a
 * head the first time this card was written, which is the rule working.
 *
 * WHAT THE CARD DRAWS instead is the half the file can answer honestly: how
 * long a sale takes, which is a figure in months, and how many buyers there
 * are, which is a sentence.
 *
 * WITHHOLDING: the track draws only when both ends are held and the high is
 * not below the low.
 */
import { countryFigure, loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import { queryFacts } from "@/lib/facts/store";
import type { FactTag } from "@/lib/facts/types";
import { COPY } from "@/lib/spine/copy";

export const COUNTRY_EXIT_METRICS = {
  low: "risk_exit.exit.multiple_low",
  high: "risk_exit.exit.multiple_high",
  monthsLow: "risk_exit.exit.time_to_sell_months_low",
  monthsHigh: "risk_exit.exit.time_to_sell_months_high",
  climate: "risk_exit.exit.climate",
} as const;

export type CountryExitData = {
  iso2: string;
  /** How long a sale takes, as two marks on one track: the quick end and the slow end, in months. */
  marks: Array<{ key: string; label: string; value: number; lead?: boolean }>;
  /** The market for buyers as one sentence (never a word in a figure's slot, PART 5), or null. */
  climate: string | null;
  basis: string;
  foot: string;
  tag: FactTag;
};

/** Months as a person says them: "6 months", "1 month". */
const monthsText = (v: number) => `${Math.round(v)} ${Math.round(v) === 1 ? COPY.countryExit.month : COPY.countryExit.months}`;

function word(iso2: string, metric: string): string | null {
  if (!loadCountryShard(iso2)) return null;
  const f = queryFacts({ entityId: countryEntityId(iso2), metrics: [metric], rowKey: "" })[0];
  return f && typeof f.value === "string" && f.value.trim() ? f.value.trim() : null;
}

export function buildCountryExit(iso2: string): CountryExitData | null {
  const code = countryEntityId(iso2);
  if (!code) return null;
  const C = COPY.countryExit;
  const mLo = countryFigure(code, COUNTRY_EXIT_METRICS.monthsLow);
  const mHi = countryFigure(code, COUNTRY_EXIT_METRICS.monthsHigh);
  if (!mLo || !mHi || !(mLo.value > 0) || !(mHi.value >= mLo.value)) return null;
  const climateWord = word(code, COUNTRY_EXIT_METRICS.climate);
  const tag: FactTag = [mLo.tag, mHi.tag].some((t) => t !== "held") ? "modeled" : "held";
  return {
    iso2: code,
    marks: [
      { key: "quick", label: C.marks.quick, value: mLo.value, lead: true },
      { key: "slow", label: C.marks.slow, value: mHi.value },
    ],
    climate: climateWord ? (C.climateLine as Record<string, string>)[climateWord] ?? null : null,
    basis: C.basis,
    foot: C.foot,
    tag,
  };
}

export const exitMonthsText = monthsText;
