/**
 * src/lib/spine/city_calendar_rows.ts
 *
 * WHEN THIS CITY SPENDS, the city page's `19 calendar` (2026-09-23, brief
 * NEW-SECTIONS-2026-09-23.md row Y1; his standard: a pain point with its
 * figure and the computation named).
 *
 * THE PAIN. A reader choosing a city wants to know which months carry the
 * year, because a lease is signed in one month and the money comes in
 * another. The trade page answers it for one trade; the city page has never
 * answered it for the city itself, although every city on file holds the
 * answer.
 *
 * WHERE THE FIGURES COME FROM, with their coverage, measured 2026-09-23 by
 * `scripts/audit/unused_fields.mjs`: `demand_calendar.months[0]` through
 * `[11]` on the city shard (`data/facts/city/<ISO2>-<slug>.json`), held by
 * 252 of 252 cities and read by nothing under `src/` until this builder:
 * modelled on 251, and PLACEHOLDER ON LONDON ALONE (counted 2026-09-23 night),
 * the pattern DATA-REQUIREMENTS 23 records for London's `demand.*`,
 * `first_year.*` and `risks.list.*`. Each month is an index against the
 * city's own busiest month, which the file sets at 100 (London's stand-in
 * peaks at 95, one more sign it is not a reading).
 *
 * THE COMPUTATION, named in the basis: the swing is the busiest month's index
 * less the quietest, as a share of the busiest, which is the same arithmetic
 * the trade page's swing uses so the two cannot disagree.
 *
 * WITHHOLDING: twelve months or nothing. A part-year is a different subject
 * and a calendar with a hole in it invites a reader to fill the hole
 * themselves. AND A PLACEHOLDER IS NOT A FIGURE (the bank's own word for a
 * slot waiting on research; the crew builder's rule): one placeholder month
 * withholds the card. Until 2026-09-23 night this builder read a placeholder
 * as "modelled" and London's card printed a 37 per cent swing off the
 * stand-in, on the exemplar and on production; the view seats the earnings
 * strip where the calendar stood.
 */
import { cityFigure } from "@/lib/facts/city_shard";
import cityListJson from "../../../data/cities/city_list_v1.json";
import type { FactTag } from "@/lib/facts/types";
import type { MonthPoint } from "@/components/spine/archetypes/MonthBars";
import { COPY } from "@/lib/spine/copy";

/** The city list by slug, the gates builder's own lookup. */
type CityRow = { slug: string; name: string; iso2: string };
const BY_SLUG = new Map((cityListJson as { cities: CityRow[] }).cities.map((c) => [c.slug, c]));

export const CITY_CALENDAR_MONTHS = 12;

export type CityCalendarData = {
  slug: string;
  months: MonthPoint[];
  /** The busiest month's index over the quietest, as a share of the busiest. */
  swing: { figure: string; value: number };
  peak: number;
  trough: number;
  basis: string;
  foot: string;
  tag: FactTag;
};

export function buildCityCalendar(slug: string): CityCalendarData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const months: MonthPoint[] = [];
  let weakest: FactTag = "held";
  for (let m = 0; m < CITY_CALENDAR_MONTHS; m++) {
    const f = cityFigure(iso2, slug, `demand_calendar.months[${m}]`);
    if (!f || !(f.value > 0)) return null;
    if (f.tag === "placeholder") return null;
    months.push({ month: m, value: f.value });
    if (f.tag !== "held") weakest = "modeled";
  }
  const values = months.map((p) => p.value);
  const max = Math.max(...values), min = Math.min(...values);
  if (!(max > 0)) return null;
  const swingPct = Math.round(((max - min) / max) * 100);
  return {
    slug,
    months,
    swing: { figure: `${swingPct}%`, value: swingPct },
    peak: values.indexOf(max),
    trough: values.indexOf(min),
    basis: COPY.cityCalendar.basis,
    foot: COPY.cityCalendar.foot,
    tag: weakest,
  };
}
