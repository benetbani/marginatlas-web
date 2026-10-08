/**
 * src/lib/home/firms_last.ts
 *
 * WHERE NEW FIRMS LAST, THE UK'S CITIES (plan 2026-10-08, home sections, section 1; his idea of 2026-10-08, "Midtier city
 * opportunities Leeds, Austin, Lublin, Malaga", built for the UK's cities, where the data holds it). Like for like: one cohort (the
 * firms born in the table's year), one measure (of 100, still trading five years on), one country's cities with a page, every figure
 * from data/home/city_survival.json (the business demography tables through scripts/data/home/export_home.py; never typed).
 *
 * The cities run highest first. The highest is the section's figure and one of the home's three loud moments (LOUD_SEATS in
 * home-view.tsx): it leads a measured ranking, the reason his featuring rule asks for, so a tie at the top features nobody and the
 * section is not drawn. A city the publisher stars (over 500 businesses at one postcode, Birmingham today) is held out by the
 * export with that reason, recorded and never printed. The UK's own share is the bars' tick, the figure the home's ring prints
 * rounded, so a reader sees which cities stand above it without a word.
 */
import cityJson from "../../../data/home/city_survival.json";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type City = { slug: string; name: string; births: number; survived: number; pct: number };
type Export = { cohort: number; year: number; uk: { pct: number }; cities: City[]; held_out: City[] };

/** Four members or no ranking (HOMEPAGE-EDITORIAL.md's rule, MarkList's floor). */
export const FIRMS_LAST_FLOOR = 4;

export type FirmsLastRow = { key: string; name: string; value: number; display: string; href: string; prov: Provenance };
export type FirmsLast = { lead: { key: string; figure: string; words: string; prov: Provenance }; rows: FirmsLastRow[]; uk: { value: number; label: string }; cohort: number; year: number };

const one = (v: number) => v.toFixed(1);

export function buildFirmsLast(): FirmsLast | null {
  const d = cityJson as unknown as Export;
  const rows = [...d.cities].sort((a, b) => b.pct - a.pct || a.name.localeCompare(b.name));
  if (rows.length < FIRMS_LAST_FLOOR || !Number.isFinite(d.uk?.pct) || rows[0].pct === rows[1].pct) return null;
  const C = COPY.home.firmsLast;
  const stamp = (key: string): Provenance => ({ src: `home/city_survival.json:${key}`, kind: "worked out" });
  const lead = rows[0];
  return {
    lead: { key: lead.slug, figure: one(lead.pct), words: C.words.replace("{city}", lead.name).replace("{cohort}", String(d.cohort)).replace("{year}", String(d.year)), prov: stamp(lead.slug) },
    rows: rows.map((r) => ({ key: r.slug, name: r.name, value: r.pct, display: one(r.pct), href: `/cities/${r.slug}`, prov: stamp(r.slug) })),
    uk: { value: d.uk.pct, label: C.ukKey },
    cohort: d.cohort,
    year: d.year,
  };
}
