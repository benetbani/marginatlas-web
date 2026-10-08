/**
 * src/lib/home/us_restaurants.ts
 *
 * WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3; his idea of 2026-10-08, "US biggest winners and
 * losers ranking of top 5 cities bottom 5"). One trade held (full-service restaurants, private establishments), the US metros the
 * site has city pages for, less any the export holds out with its reason (Detroit today: plan decision 12; the slice's `held_out`,
 * recorded and never drawn), so the metros ranked are the slice's `metros`; two counts a metro (the first and the last year on
 * disk), from data/home/us_restaurants.json (never typed). Ranked by the restaurants a metro added or lost, so the order can be
 * read off the two printed counts; never a percent and never a composite (PART 9 clause 15; his ruling 11). The five that added
 * most and the five that lost most; the metro that added most leads, its count added the section's figure and one of the home's
 * three loud moments (it leads a measured ranking), and a tie at the top features nobody and the section is not drawn.
 */
import usJson from "../../../data/home/us_restaurants.json";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type Metro = { slug: string; name: string; y_from: number; y_to: number };
type Export = { from: number; to: number; metros: Metro[] };

/** The metros drawn at each end of the ranking. */
export const US_ENDS = 5;

export type UsRestaurantsRow = { key: string; name: string; from: number; to: number; a: string; b: string; aProv: Provenance; bProv: Provenance };
export type UsRestaurants = { from: number; to: number; count: number; lead: { key: string; figure: string; words: string; prov: Provenance }; added: UsRestaurantsRow[]; lost: UsRestaurantsRow[] };

const count = (n: number) => n.toLocaleString("en-US");

export function buildUsRestaurants(): UsRestaurants | null {
  const d = usJson as unknown as Export;
  const change = (m: Metro) => m.y_to - m.y_from;
  const added = d.metros.filter((m) => change(m) > 0).sort((a, b) => change(b) - change(a) || a.name.localeCompare(b.name));
  const lost = d.metros.filter((m) => change(m) < 0).sort((a, b) => change(a) - change(b) || a.name.localeCompare(b.name));
  if (added.length < US_ENDS || lost.length < US_ENDS || change(added[0]) === change(added[1])) return null;
  const at = (m: Metro, year: number): Provenance => ({ src: `home/us_restaurants.json:${m.slug}:${year}`, kind: "counted" });
  const row = (m: Metro): UsRestaurantsRow => ({ key: m.slug, name: m.name, from: m.y_from, to: m.y_to, a: count(m.y_from), b: count(m.y_to), aProv: at(m, d.from), bProv: at(m, d.to) });
  const lead = added[0];
  const C = COPY.home.usRestaurants;
  return {
    from: d.from,
    to: d.to,
    count: d.metros.length,
    lead: {
      key: lead.slug,
      figure: count(change(lead)),
      words: C.words.replace("{from}", String(d.from)).replace("{n}", String(d.metros.length)).replace("{city}", lead.name),
      prov: { src: `home/us_restaurants.json:${lead.slug}:${d.to} less ${d.from}`, kind: "worked out" },
    },
    added: added.slice(0, US_ENDS).map(row),
    lost: lost.slice(0, US_ENDS).map(row),
  };
}
