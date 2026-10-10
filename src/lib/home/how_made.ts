/**
 * src/lib/home/how_made.ts
 *
 * HOW FIGURES ARE MADE (plan 2026-10-08, home sections, section 4; his ideas of 2026-10-08, "the deep techniques used to derive
 * data", "unmatched archival capability" and "the global coverage", merged as the audit found them honest). Each technique shown by
 * a figure it produced: a year of company notices matched by name to the company register (the focal, and the names matched of
 * the names they held, so the match rate is on the card), and London's trades' takings read from the official counts by turnover
 * band (the London trade pages that print a takings figure, of those served: the taxonomy's trade slugs that are not retired, the
 * list the sitemap and the home's search go by). No count of countries and no line that the pages print estimates: his ruling of
 * 2026-10-07 is that the home's 195 counter is wrong, so the global coverage is not built. Counts of distinct records and of
 * reachable pages only, never cells or slots (src/lib/coverage/report.ts says why). Quiet: no accent. The notices from
 * data/home/method.json; the rest worked out from this repo's own files, never typed.
 */
import methodJson from "../../../data/home/method.json";
import { londonTradeSales } from "@/lib/uk/registers/london_trade";
import { SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { RETIRED } from "@/lib/taxonomy/retired";
import { hasOwn } from "@/lib/own";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type Export = { notices: number; names: number; matched_names: number };

export type HowMadeRow = { key: "matched" | "trades"; label: string; value: string; note: string; prov: Provenance };
export type HowMade = { notices: { figure: string; words: string; prov: Provenance }; rows: HowMadeRow[]; link: { href: string; label: string } };

const n = (v: number) => v.toLocaleString("en-US");

export function buildHowMade(): HowMade | null {
  const m = methodJson as unknown as Export;
  if (![m.notices, m.names, m.matched_names].every((v) => Number.isInteger(v) && v > 0)) return null;
  /* The London trade pages served: every trade slug of the taxonomy that is not retired, the list the sitemap and the home's search
     go by (src/app/sitemap.ts, src/lib/home/destination.ts). */
  const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !hasOwn(RETIRED, s));
  /* Of them, the pages that print a takings figure: where the trade's register median falls in a closed band of the band counts. A
     median in an open band prints an edge in words, and is not counted. */
  const trades = served.filter((s) => londonTradeSales(s)?.q50.open === false).length;
  if (trades === 0) return null;
  const C = COPY.home.howMade;
  return {
    notices: { figure: n(m.notices), words: C.words, prov: { src: "home/method.json:notices", kind: "counted" } },
    rows: [
      { key: "matched", label: C.matched.label, value: `${n(m.matched_names)} of ${n(m.names)}`, note: C.matched.note, prov: { src: "home/method.json:matched_names of names", kind: "counted" } },
      { key: "trades", label: C.trades.label, value: `${n(trades)} of ${n(served.length)}`, note: C.trades.note, prov: { src: "uk/registers/turnover.json:London trades with takings read from the band counts, of the trade pages served", kind: "counted" } },
    ],
    link: { href: "/about-data", label: C.link },
  };
}

/* THE JOIN AND THE PAGES READ, APART (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 2; the home's spec of
   2026-10-09, section 6: how figures are made gives way, "its join figures become proof 1; 'London trade pages 111 of 138' moves to
   About the figures (#reading)"). The same counts buildHowMade reads, each said on its own. */

export type JoinCount = { value: number; figure: string; prov: Provenance };
export type Joins = { notices: JoinCount; names: JoinCount; matched: JoinCount; /** The names found, of 100 names: the first proof's ring. */ share: number };

/** The year of notices and their match by name to the register (data/home/method.json), or null where the counts do not nest. */
export function buildJoins(): Joins | null {
  const m = methodJson as unknown as Export;
  if (![m.notices, m.names, m.matched_names].every((v) => Number.isInteger(v) && v > 0) || m.matched_names > m.names || m.names > m.notices) return null;
  const count = (key: "notices" | "names" | "matched_names", value: number): JoinCount => ({ value, figure: n(value), prov: { src: `home/method.json:${key}`, kind: "counted" } });
  return { notices: count("notices", m.notices), names: count("names", m.names), matched: count("matched_names", m.matched_names), share: (m.matched_names / m.names) * 100 };
}

export type PagesRead = { printing: number; served: number; prov: Provenance };

/** The London trade pages that print a takings figure read from the band counts, of the trade pages served: the count the home's card
 *  printed until plan 2026-10-09, said on About the figures' #reading since. */
export function londonPagesRead(): PagesRead | null {
  const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !hasOwn(RETIRED, s));
  const printing = served.filter((s) => londonTradeSales(s)?.q50.open === false).length;
  if (printing === 0) return null;
  return { printing, served: served.length, prov: { src: "uk/registers/turnover.json:London trades with takings read from the band counts, of the trade pages served", kind: "counted" } };
}
