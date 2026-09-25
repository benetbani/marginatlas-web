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
 *
 * THE WORLD'S OWN FIGURES STAND IN THE FOOT (2026-09-23, the afternoon after
 * this card shipped). "6 to 12 months" with nothing beside it is the fault
 * briefs/VISUAL-CHOICE.md section 0 names in its second example: a figure with
 * no reference is not a fact a reader can use, because twelve months is
 * neither long nor short until something says so. So the foot carries two
 * companions worked from the same field across the whole bank, scanned once
 * per process and held: the world's usual band (the median of the 198 quick
 * ends and the median of the 198 slow ends, 9 to 18 months) and how many
 * countries can take longer than this one (182 of 198 for the United Kingdom,
 * which is what makes its 6 to 12 a fast market rather than a number).
 * The scan reads the shard files directly rather than through the store: the
 * store keeps every fact it is handed, and loading 198 countries to read two
 * numbers each would carry the whole bank for the sake of four figures.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  /** The world's own figures under the hairline, so the months above have something to stand against. */
  second: Array<{ figure: string; words: string }>;
  /** The market for buyers as one sentence (never a word in a figure's slot, PART 5), or null. */
  climate: string | null;
  /** The file's own word for the market for buyers (active, steady or thin), for a label, or null. */
  climateWord: string | null;
  /** The usual span anywhere, as numbers (the medians of the quick and the slow ends over every shard), or null. */
  usual: { lo: number; hi: number } | null;
  basis: string;
  foot: string;
  tag: FactTag;
};

/** Months as a person says them: "6 months", "1 month". */
const monthsText = (v: number) => `${Math.round(v)} ${Math.round(v) === 1 ? COPY.countryExit.month : COPY.countryExit.months}`;

/** THE WORLD'S SALE TIMES, scanned once per process and held. */
type WorldExit = { usualLow: number; usualHigh: number; highs: number[]; count: number };
let WORLD: WorldExit | null | undefined;
function worldExit(): WorldExit | null {
  if (WORLD !== undefined) return WORLD;
  WORLD = null;
  try {
    const dir = resolve(process.cwd(), "data", "facts", "country");
    const lows: number[] = [];
    const highs: number[] = [];
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".json")) continue;
      const shard = JSON.parse(readFileSync(resolve(dir, name), "utf8")) as { facts?: Array<{ metric?: string; value?: unknown; tag?: string }> };
      if (!Array.isArray(shard?.facts)) continue;
      let lo: number | null = null;
      let hi: number | null = null;
      for (const f of shard.facts) {
        /* THIS READ GOES AROUND THE STORE (one scan of every shard, which the
           store would hold for every query after it), so it keeps the store's
           law itself: a placeholder is not a sale time and never enters the
           world's band. The chain's `placeholder-never-printed` gate lists
           this file and reds it if the filter goes. */
        if (f?.tag === "placeholder") continue;
        if (f?.metric === COUNTRY_EXIT_METRICS.monthsLow && typeof f.value === "number") lo = f.value;
        if (f?.metric === COUNTRY_EXIT_METRICS.monthsHigh && typeof f.value === "number") hi = f.value;
      }
      if (lo != null && hi != null && lo > 0 && hi >= lo) { lows.push(lo); highs.push(hi); }
    }
    /* A SCAN THAT FOUND ALMOST NOTHING SAYS NOTHING: a median of three shards
       is not the world, and the card draws its foot only where the scan read
       a real bank. */
    if (lows.length < 20) return WORLD;
    const median = (a: number[]) => { const v = [...a].sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
    WORLD = { usualLow: median(lows), usualHigh: median(highs), highs: highs.sort((a, b) => a - b), count: lows.length };
  } catch {
    WORLD = null;
  }
  return WORLD;
}

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
  const w = worldExit();
  const second = w
    ? [
        { figure: `${Math.round(w.usualLow)} to ${monthsText(w.usualHigh)}`, words: C.world.usual },
        { figure: `${w.highs.filter((h) => h > mHi.value).length} of ${w.count}`, words: C.world.longer },
      ]
    : [];
  return {
    iso2: code,
    second,
    marks: [
      { key: "quick", label: C.marks.quick, value: mLo.value, lead: true },
      { key: "slow", label: C.marks.slow, value: mHi.value },
    ],
    climate: climateWord ? (C.climateLine as Record<string, string>)[climateWord] ?? null : null,
    /* The file's word itself, for the lean card's label (2026-09-25). */
    climateWord: climateWord ?? null,
    usual: w ? { lo: w.usualLow, hi: w.usualHigh } : null,
    basis: C.basis,
    foot: C.foot,
    tag,
  };
}

export const exitMonthsText = monthsText;
