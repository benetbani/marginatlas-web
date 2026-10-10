/**
 * src/lib/home/how_made.ts
 *
 * HOW FIGURES ARE MADE, AS TWO COUNTS (plan 2026-10-08, home sections, section 4, which built the home's card; plan
 * docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 2 and 10, which retired it: "its join figures become proof 1; 'London
 * trade pages 111 of 138' moves to About the figures (#reading)"). A year of company notices matched by name to the company register
 * (data/home/method.json), and London's trades' takings read from the official counts by turnover band (the London trade pages that print
 * a takings figure, of those served: the taxonomy's trade slugs that are not retired, the list the sitemap and the home's search go by).
 * Counts of distinct records and of reachable pages only, never cells or slots (src/lib/coverage/report.ts says why); no count of
 * countries (his ruling of 2026-10-07). Never typed.
 */
import methodJson from "../../../data/home/method.json";
import { londonTradeSales } from "@/lib/uk/registers/london_trade";
import { SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { RETIRED } from "@/lib/taxonomy/retired";
import { hasOwn } from "@/lib/own";
import type { Provenance } from "@/lib/spine/provenance";

type Export = { notices: number; names: number; matched_names: number; source?: string };

const n = (v: number) => v.toLocaleString("en-US");

/** The months a year of notices ran over, as the file's source line says them: "published 2025-10-01 to 2026-09-30". */
const PUBLISHED = /published (\d{4}-\d{2})-\d{2} to (\d{4}-\d{2})-\d{2}/;

export type JoinCount = { value: number; figure: string; prov: Provenance };
export type Joins = {
  notices: JoinCount;
  names: JoinCount;
  matched: JoinCount;
  /** The names found, of 100 names: the first proof's ring. */
  share: number;
  /** The first and the last month of the year of notices ({ first: "2025-10", last: "2026-09" }), or null where the file's source line
   *  names no dates. The archive's second proof draws the months inside it, so its columns are the notices the first proof prints
   *  (the closing cleanup of plan 2026-10-10, the home reformed to ship, item 10). */
  span: { first: string; last: string } | null;
};

/** The year of notices and their match by name to the register (data/home/method.json), or null where the counts do not nest. */
export function buildJoins(): Joins | null {
  const m = methodJson as unknown as Export;
  if (![m.notices, m.names, m.matched_names].every((v) => Number.isInteger(v) && v > 0) || m.matched_names > m.names || m.names > m.notices) return null;
  const count = (key: "notices" | "names" | "matched_names", value: number): JoinCount => ({ value, figure: n(value), prov: { src: `home/method.json:${key}`, kind: "counted" } });
  const dates = typeof m.source === "string" ? PUBLISHED.exec(m.source) : null;
  return { notices: count("notices", m.notices), names: count("names", m.names), matched: count("matched_names", m.matched_names), share: (m.matched_names / m.names) * 100, span: dates ? { first: dates[1], last: dates[2] } : null };
}

export type PagesRead = { printing: number; served: number; prov: Provenance };

/** The trade pages served: the taxonomy's trade slugs that are not retired, the list the sitemap and the home's search go by. The one
 *  list every count of "of the pages served" stands against (londonPagesRead here, the band's two trade counts in site_counts.ts). */
export function servedTrades(): string[] {
  return Object.keys(SLUG_TO_INDUSTRY).filter((s) => !hasOwn(RETIRED, s));
}

/** The London trade pages that print a takings figure read from the band counts, of the trade pages served: About the figures' #reading
 *  prints it since plan 2026-10-09. A median in an open band prints an edge in words, and is not counted. */
export function londonPagesRead(): PagesRead | null {
  const served = servedTrades();
  const printing = served.filter((s) => londonTradeSales(s)?.q50.open === false).length;
  if (printing === 0) return null;
  return { printing, served: served.length, prov: { src: "uk/registers/turnover.json:London trades with takings read from the band counts, of the trade pages served", kind: "counted" } };
}
