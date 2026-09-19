/**
 * src/lib/spine/hood_premium_rows.ts
 *
 * WHERE VISITORS CROWD IN, `02 premium` (MODEL.md 8.8; plan step 35,
 * 2026-09-19), on MarkList (B3) with no marks: the seven districts ranked by
 * `tourism_intensity`, annual visitors per resident, overnight and
 * day-trippers (`data/economics/neighborhood_intensity_v1.json`, the file's
 * own `convention`; `year` 2023 and `source_quality` A or B on London's
 * seven), the headline the set's middle in ink (MarkList's own law, never
 * loud), the basis naming the size of the set, the year and the source
 * quality in a person's words. A defined, sourced, dated figure about a real
 * place: 8.8 struck the earlier idea of ranking the engine's constant table
 * as "the engine's own input dressed as a finding". Pure over
 * hood_scheme.ts's rows, synchronous.
 *
 * EVERY ROW CARRIES A FIGURE, or is withheld with the count and the reason
 * (MarkList's second clause): a district whose intensity row holds no
 * `tourism_intensity` is counted in the withheld line, never blank. None on
 * London's seven. Four members is the floor (clause 22): under four the
 * builder returns null and the band re-pairs.
 *
 * EVERY ROW IS A DOOR to the district's own page (PART 5, LINKS LOOK LIKE
 * LINKS: MarkList draws the arrow and the hover on a row with an href), the
 * one row form on this page that can carry a door lawfully; 8.8 named no
 * door for this block because no district page existed when it was
 * written. The href comes from the one resolver that says which place pages
 * exist (page_targets.ts `districtPageTarget`), so a row never promises a
 * page the route would refuse.
 *
 * THE NOTATION: the file holds whole numbers on London's seven (22, 45, 24,
 * 6, 3, 4, 8) and decimals elsewhere; a column prints one decimal count
 * (PART 5), so the rows print whole numbers when every value is whole and
 * one decimal otherwise, the same `fmt` on the headline.
 */
import { COPY } from "@/lib/spine/copy";
import { countWord } from "@/lib/spine/district_rows";
import { spineHoodDistricts } from "@/lib/spine/hood_scheme";
import { districtPageTarget } from "@/lib/geo/page_targets";
import { MARK_LIST_FLOOR, type MarkRow } from "@/components/spine/archetypes/MarkList";

export type HoodPremiumData = {
  kicker: string;
  headline: { label: string; value: number };
  basis: string;
  head: { name: string; value: string };
  rows: MarkRow[];
  fmt: (v: number) => string;
  withheld: number;
  withheldLine: string | null;
  /** The rows' year and source quality, for the stories' captions. */
  year: number | null;
  qualities: string[];
  /** Sourced and dated on every row: the opener's mark is off. */
  tagged: false;
};

/** The LOWER median, MarkList's own: with an even count the lower of the two middle members. */
function middleOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** One decimal count per column: whole numbers when every value is whole, one decimal otherwise. */
export function visitorsFmt(values: number[]): (v: number) => string {
  const whole = values.every((v) => Number.isInteger(v));
  return (v: number) => (whole ? String(Math.round(v)) : v.toFixed(1));
}

/** Null when the city is not admitted or fewer than four districts hold a visitor figure. */
export function buildHoodPremium(citySlug: string): HoodPremiumData | null {
  const rows = spineHoodDistricts(citySlug);
  if (!rows) return null;
  const held = rows.filter((d) => d.tourism != null);
  if (held.length < MARK_LIST_FLOOR) return null;
  const values = held.map((d) => d.tourism!.value);
  const fmt = visitorsFmt(values);
  const ranked = held.slice().sort((a, b) => b.tourism!.value - a.tourism!.value || a.name.localeCompare(b.name));
  const withheld = rows.length - held.length;
  const year = held.map((d) => d.tourism!.year).find((y) => y != null) ?? null;
  const qualities = [...new Set(held.map((d) => d.tourism!.quality).filter((q): q is string => !!q))].sort();
  const districtLevel = qualities.every((q) => q === "A" || q === "B");
  const basis = fill(year != null ? (districtLevel ? COPY.hoodPremium.basisYear : COPY.hoodPremium.basisYearEstimate) : COPY.hoodPremium.basis, { count: countWord(rows.length), year: String(year ?? "") });
  return {
    kicker: COPY.hoodPremium.kicker,
    headline: { label: fill(COPY.markList.middleOfDrawn, { n: countWord(held.length) }), value: middleOf(values) },
    basis,
    head: { name: COPY.hoodPremium.head.name, value: COPY.hoodPremium.head.value },
    /* The href and the promise from the one resolver, together: a row with no district page carries neither. */
    rows: ranked.map((d) => {
      const page = districtPageTarget(citySlug, d.slug);
      return { key: d.slug, name: d.name, value: d.tourism!.value, href: page?.href, lands: page?.answers };
    }),
    fmt,
    withheld,
    withheldLine: withheld === 0 ? null : fill(withheld === 1 ? COPY.hoodPremium.withheldOne : COPY.hoodPremium.withheldMany, { n: countWord(withheld) }),
    year,
    qualities,
    tagged: false,
  };
}
