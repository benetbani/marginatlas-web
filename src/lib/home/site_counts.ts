/**
 * src/lib/home/site_counts.ts
 *
 * THE BAND'S FOUR COUNTS, "READ FROM THE RECORD" (plan docs/superpowers/plans/2026-10-10-home-reform, Task 5; the spec
 * docs/superpowers/specs/2026-10-10-home-reform-design.md, decision 7, and its critique, section 4, which printed each count with the
 * builder named below). What the UK pages draw on, counted: each count is records the UK pages read or pages that print a figure, never
 * a slot, a cell or an allocated total (src/lib/coverage/report.ts says why; the gate no-slot-counting), and none is a count of
 * countries, cities or the trades in the list (his ruling of 2026-10-07). The two trade counts stand against the trade pages served,
 * the honest half of a coverage claim.
 *   sources   every official dataset or page the UK pages print from: the items of the one sources list's publishers classed
 *             `official` (src/lib/spine/uk_sources.ts, the list About the figures prints under #sources; the coordinator's ruling of
 *             2026-10-10); a trade body's, a commercial panel's or a seller's own page is not counted, nor are the sources outside
 *             the UK (they serve /new-businesses)
 *   laws      every finite number the UK formulas read for 2026-27 (src/lib/uk/law/params_2026_27.ts): rates, thresholds, limits,
 *             ages and penalties; the two open top bands (Infinity) are bounds, not values
 *   sales     the London trade pages whose typical yearly sales are read from the register's band counts, of the pages served
 *             (londonPagesRead in src/lib/home/how_made.ts, About the figures' #reading)
 *   failures  the trades served whose UK failure rate a year is publishable (ukInsolvencyPer100 in src/lib/spine/uk_trade_typical.ts),
 *             of the same pages served
 * The month is the register slices' build month (REGISTER_BUILT, src/lib/spine/checked.ts), never today's. A count whose source does
 * not answer, or throws, is null; the band draws with all four (SITE_COUNTS_MIN) and draws nothing with fewer, so the row is always
 * four siblings (the closing cleanup of plan 2026-10-10, item 18: it once drew with three, a layout nothing tested). Every
 * figure is stamped counted, and none is typed: tests/home/site_counts.test.ts recomputes each from its source.
 */
import { UK_SOURCES } from "@/lib/spine/uk_sources";
import { UK_2026_27 } from "@/lib/uk/law/params_2026_27";
import { londonPagesRead, servedTrades } from "@/lib/home/how_made";
import { ukInsolvencyPer100 } from "@/lib/spine/uk_trade_typical";
import { REGISTER_BUILT } from "@/lib/spine/checked";
import type { Provenance } from "@/lib/spine/provenance";

export type SiteCountKey = "sources" | "laws" | "sales" | "failures";
/** The pages a trade count stands against: the "of" figure it prints at 16 beside its own. */
export type SiteCountOf = { value: number; figure: string; prov: Provenance };
export type SiteCount = { key: SiteCountKey; value: number; figure: string; prov: Provenance; of: SiteCountOf | null };
/** The band: its month as the line prints it, and its counts in the band's order. */
export type SiteCounts = { month: string; counts: SiteCount[] };

/** The band draws with all four counts and nothing with fewer: a count whose source fails draws no band, never a row of three
 *  (critique section 4: four fill the row; the three-count layout was never drawn and nothing tested it). */
export const SITE_COUNTS_MIN = 4;

const figure = (v: number) => v.toLocaleString("en-US");
const counted = (src: string): Provenance => ({ src, kind: "counted" });
const SERVED = counted("lib/taxonomy:trade pages served, the slugs not retired");

/** Every finite number in a value, through its objects and arrays. */
function finiteNumbers(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? 1 : 0;
  if (Array.isArray(v)) return v.reduce((t: number, x: unknown) => t + finiteNumbers(x), 0);
  if (v !== null && typeof v === "object") return Object.values(v as Record<string, unknown>).reduce((t: number, x) => t + finiteNumbers(x), 0);
  return 0;
}

/** One count, or null where it is not a whole number above zero, or where it outnumbers the pages it stands against. */
function count(key: SiteCountKey, value: number, prov: Provenance, of: number | null = null): SiteCount | null {
  if (!Number.isInteger(value) || value <= 0) return null;
  if (of !== null && (!Number.isInteger(of) || of < value)) return null;
  return { key, value, figure: figure(value), prov, of: of === null ? null : { value: of, figure: figure(of), prov: SERVED } };
}

const READERS: Array<() => SiteCount | null> = [
  () => count("sources", UK_SOURCES.filter((s) => s.official).reduce((t, s) => t + s.items.length, 0), counted("lib/spine/uk_sources.ts:UK_SOURCES, every item of a publisher classed official")),
  () => count("laws", finiteNumbers(UK_2026_27), counted("lib/uk/law/params_2026_27.ts:UK_2026_27, every finite value")),
  () => {
    const read = londonPagesRead();
    return read ? count("sales", read.printing, read.prov, read.served) : null;
  },
  () => {
    const served = servedTrades();
    return count("failures", served.filter((s) => ukInsolvencyPer100(s) != null).length, counted("uk/registers/failures.json:trades with a publishable UK rate, of the trade pages served"), served.length);
  },
];

/** The four counts in the band's order, each null where its source does not answer or throws. */
function siteCountsRead(): Array<SiteCount | null> {
  return READERS.map((read) => {
    try {
      return read();
    } catch {
      return null;
    }
  });
}

/** The band's month as its line prints it: the register slices' build day, never today; null without a real day. */
export function registerMonth(day: string | null = REGISTER_BUILT): string | null {
  if (!day) return null;
  const at = Date.parse(`${day}T00:00:00Z`);
  return Number.isFinite(at) ? new Date(at).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : null;
}

/** The band from its counts: all four and a month, or null, and then the home draws no band. */
export function siteCountsFrom(counts: Array<SiteCount | null>, month: string | null): SiteCounts | null {
  const held = counts.filter((c): c is SiteCount => c !== null);
  return held.length >= SITE_COUNTS_MIN && month ? { month, counts: held } : null;
}

/** The band "Read from the record": its four counts and its month, or null. */
export function buildSiteCounts(): SiteCounts | null {
  return siteCountsFrom(siteCountsRead(), registerMonth());
}
