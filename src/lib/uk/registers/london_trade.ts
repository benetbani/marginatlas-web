/**
 * src/lib/uk/registers/london_trade.ts
 *
 * A London trade's register figures, the one place a page builder reads them (plan 06, task A1; his ruling of 2026-10-04:
 * London is Greater London, E12000007). Server-side only: turnover.json is two megabytes.
 *
 * What it gives: the count of enterprises and local units on the register, and the median, tenths and quartiles of yearly sales read
 * once from the band counts (`bandQuantile`, never the slice's stored quantiles, which are rounded to the 100 already), with
 * the share under 100,000 pounds. A quantile in an open band (under 50,000 or over 50,000,000 pounds) carries only its edge,
 * since the register cannot place a business inside it.
 *
 * WHAT IT REFUSES, from the trade-to-code file's own definitions (E:/atlas/registers/uk/trades_sic.json, "match"):
 *  - "approx", the nearest code holding the trade among unrelated activities ("a figure from it is a broad bracket, not the
 *    trade"): no figure, so no page prints a bracket as the trade's own.
 *  - "shared", one code for this trade and others on the site: the figure is the whole group's and the page must say so, so a
 *    shared code prints only with its group's plain name from SHARED_GROUP, and a code without a name there prints nothing.
 *  - the register's own floor: a trade with under 40 London businesses ("thin") has its counts but no quantile.
 */
import turnoverJson from "../../../../data/uk/registers/turnover.json";
import { bandCdf, bandQuantile } from "../pnl/banded";

type Row = {
  enterprises: number;
  local_units: number;
  median_range_k: [number, number] | null;
  thin: boolean;
  turnover_bands_k: number[] | null;
};
type TurnoverFile = { trades: Record<string, { sic: string[]; match: "exact" | "shared" | "approx" | "none"; by_geography: Record<string, Row> }> };
const TURNOVER = turnoverJson as unknown as TurnoverFile;
export const LONDON_GEOGRAPHY = "E12000007";
/** The register's open bands: under 50,000 and over 50,000,000 pounds of yearly sales. */
export const OPEN_BELOW_GBP = 50_000;
export const OPEN_ABOVE_GBP = 50_000_000;

/** A shared code's group, as a singular noun phrase a page can put after "the middle" ("the middle hair or beauty business").
 *  Keyed by the trade's codes joined with "+", in the slice's order. Each name is the official code's own name in plain
 *  words (trades_sic.json's notes): never the trade's name, since the figure is the group's. */
export const SHARED_GROUP: Readonly<Record<string, string>> = {
  "43220": "plumbing or heating business",
  "43330": "floor or wall fitter",
  "45200": "motor repair business",
  "47760": "flower, plant or pet shop",
  "47782": "optician",
  "55100": "hotel or guest house",
  "56102": "cafe or unlicensed restaurant",
  "56103": "takeaway or food stand",
  "56302": "pub or bar",
  "56302+56301": "pub, bar or club",
  "85510": "sports coaching business",
  "85520": "arts, music or dance school",
  "85590": "tutoring or training school",
  "86900": "therapy or health clinic",
  "93130": "gym or fitness studio",
  "93130+85510": "gym or sports coach",
  "93130+93110": "gym or sports venue",
  "96020": "hair or beauty business",
  "96040": "spa, massage or tanning business",
};

export type LondonTradeRegister = {
  sic: string[];
  match: "exact" | "shared";
  /** The code's group for a shared code (a singular noun phrase), or null when the code is the trade's own. */
  group: string | null;
  enterprises: number;
  localUnits: number;
};

/** A quantile of yearly sales: a figure in pounds, or only the edge of the open band it falls in. */
export type SalesQuantile = { open: false; gbp: number } | { open: "below" | "above"; edgeGbp: number };

export type LondonTradeSales = {
  /** The bottom and top tenths (his N9 of 2026-08-30: a spread is the tenths and the typical, never quarters). */
  q10: SalesQuantile;
  q25: SalesQuantile;
  q50: SalesQuantile;
  q75: SalesQuantile;
  q90: SalesQuantile;
  /** The median in pounds, or null when it falls in an open band (then it prints only in words). */
  medianGbp: number | null;
  /** The median's range from the register's rounding (counts rounded to 5), in pounds, or null when the file holds none. */
  medianRangeGbp: [number, number] | null;
  /** The share of the trade's London businesses taking under 100,000 pounds a year (a band edge: every band shape agrees). */
  shareUnder100k: number;
};

/** Pounds from the slice's thousands, to the penny (280.659 x 1000 is 280,659, not 280,658.99999999997). */
const gbp = (k: number) => Math.round(k * 1000 * 100) / 100;

function londonRow(slug: string): { trade: TurnoverFile["trades"][string]; row: Row } | null {
  const trade = TURNOVER.trades[slug];
  const row = trade?.by_geography[LONDON_GEOGRAPHY];
  return trade && row ? { trade, row } : null;
}

export function londonTradeRegister(slug: string): LondonTradeRegister | null {
  const found = londonRow(slug);
  if (!found) return null;
  const { trade, row } = found;
  if (trade.match !== "exact" && trade.match !== "shared") return null;
  const group = trade.match === "shared" ? SHARED_GROUP[trade.sic.join("+")] ?? null : null;
  if (trade.match === "shared" && group === null) return null;
  return { sic: trade.sic, match: trade.match, group, enterprises: row.enterprises, localUnits: row.local_units };
}

function quantile(bands: number[], q: number): SalesQuantile | null {
  const found = bandQuantile(bands, q);
  if (!found) return null;
  if (found.openBelow) return { open: "below", edgeGbp: OPEN_BELOW_GBP };
  if (found.openAbove) return { open: "above", edgeGbp: OPEN_ABOVE_GBP };
  return { open: false, gbp: gbp(found.k) };
}

export function londonTradeSales(slug: string): LondonTradeSales | null {
  if (!londonTradeRegister(slug)) return null;
  const { row } = londonRow(slug)!;
  const bands = row.turnover_bands_k;
  if (row.thin || !bands || bands.every((c) => c === 0)) return null;
  const q10 = quantile(bands, 0.1);
  const q25 = quantile(bands, 0.25);
  const q50 = quantile(bands, 0.5);
  const q75 = quantile(bands, 0.75);
  const q90 = quantile(bands, 0.9);
  const under = bandCdf(bands, 100);
  if (!q10 || !q25 || !q50 || !q75 || !q90 || under === null) return null;
  return {
    q10,
    q25,
    q50,
    q75,
    q90,
    medianGbp: q50.open === false ? q50.gbp : null,
    medianRangeGbp: row.median_range_k ? [gbp(row.median_range_k[0]), gbp(row.median_range_k[1])] : null,
    shareUnder100k: under,
  };
}
