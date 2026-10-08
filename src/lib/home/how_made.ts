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
