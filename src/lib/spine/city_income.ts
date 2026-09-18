/**
 * src/lib/spine/city_income.ts
 *
 * THE ONE BUILDER FOR A CITY'S TYPICAL INCOME (MODEL.md 8.3, `06 runway` and
 * `07 earnings`: "the typical pay printed here and `07 earnings`' middle mark
 * come from ONE builder (R7's discipline, applied to pay)"; DATA-REQUIREMENTS
 * item 24; plan step 32's fourth dispatch, 2026-09-18). Until this file the
 * city page printed FOUR incomes for one city: the masthead read the city
 * list's `avg_gross_salary_usd_year` (64,800 on London, a mean), the earnings
 * strip printed 0.88 times that mean (57,000, an invention sanctioned as a
 * stopgap in city_view.ts and deleted with this file), the peers row read the
 * 64,800 again, and the runway card printed `owner_col.median_salary_usd_mo`
 * times twelve (48,756). Every reader of a city's income calls this builder
 * now: the masthead's answer and the peers' income column (adapt_city.ts),
 * the earnings strip's middle mark (range_rows.ts) and the runway's income
 * (fact_rows.ts). One figure, one tag, one basis, whatever card prints it.
 *
 * THE FIELD, CHOSEN ONCE, AND WHY THE BANK'S MEDIAN IS NOT IT. The figure is
 * `owner_col.median_salary_usd_mo` times twelve, off data/facts/city/
 * <ISO2>-<slug>.json through cityFigure(): 252 of 252 hold it, 247 held and
 * 5 modelled (Abuja, Kathmandu, Rosario, Tirana, Valparaiso), 0 absent,
 * counted 2026-09-18. It is one key family from one research pass, and the
 * drops' method prose names it as a person's salary on every file read
 * (London: the earnings survey's resident full-time median, 46,414 GBP
 * gross, less 2025-26 tax and national insurance, 4,063 USD a month). The
 * brief for this dispatch asked for the bank's `income.median_income_usd`
 * first, where held; READ BEFORE ACTED ON: 51 shards hold it held, and by
 * the method prose behind them 29 are a HOUSEHOLD income (Atlanta 92,000,
 * the metro's median household), 6 a per-head DISPOSABLE income across all
 * residents (Xi'an 6,640, below its own monthly salary times twelve), 15 a
 * person's pay (London 61,266 among them) and 1 unclassified. The shard
 * cannot tell the three apart: its `methodId` is the blanket "researched"
 * and the drop's prose never reaches it (item 26). Printing that field as
 * "customer pay" would print a household's income as one person's on 29
 * cities (clause 32, a figure shown as something it is not), so the bank's
 * income block is read by nothing on the page until the shard carries a
 * marker for the quantity, and London's held pair (61,266 median, 86,366
 * mean, gross) stays in the bank unread. Item 24 carries the requirement.
 *
 * WHAT THE BASIS CAN AND CANNOT SAY. The shard carries no gross-or-net marker
 * on the salary row either (item 24, sharpened on the third dispatch: a
 * regex over the 252 drops reads 110 net-only, 64 gross-only, 54 both words,
 * 25 neither), so `basis` is "unstated" on every city and no reader prints
 * "before tax" or "take-home"; the words say "pay, a year" and neither.
 * "Typical", never "median", in every string: the figure is modelled on five
 * cities and one word serves every city.
 *
 * THE COUNTRY'S TYPICAL IS THE FALLBACK AND NO CITY REACHES IT TODAY: where
 * a shard holds no salary the builder returns the country's median full-time
 * pay off the profile (the same field `buildPayBars` draws as the average
 * salary and `buildCustomersStrip` as the typical), `from: "country"`, so a
 * reader names it as the country's (M5: "on a city with no held pay the
 * whole strip is the country's and the basis says so"). Counted 2026-09-18:
 * 252 of 252 read the city branch, 0 the country's.
 *
 * Server only: the shard is read from the file system.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityFigure } from "@/lib/facts/city_shard";
import type { FactTag } from "@/lib/facts/types";
import { getCountryProfile } from "@/lib/economic_profile";
import { COUNTRIES } from "@/lib/taxonomy";

type CityRow = { slug: string; name: string; iso2: string };
const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

export type CityTypicalIncome = {
  slug: string;
  iso2: string;
  name: string;
  /** The country's name, for a reader that names the country's figure as the country's. */
  countryName: string;
  /** A year, whole dollars. */
  value: number;
  /** The shard's tag on the figure it came from; the country's is measured on a tier A profile and modelled otherwise. */
  tag: FactTag;
  /** True when the tag is not held: the reader's sample flag, and the word "modelled" in its line since the mark is off site-wide. */
  sample: boolean;
  /** Whether the figure is before or after tax. "unstated" on every city today: the shard carries no marker (item 24). */
  basis: "gross" | "net" | "unstated";
  /** The city's own figure, or the country's typical standing in and named as such. */
  from: "city" | "country";
  /** The file and field, for the gates and the record. */
  field: string;
};

/** The city's typical pay a year, from the one field, or the country's named as the country's; null only when the slug is not a listed city or neither side holds a figure. */
export function cityTypicalIncome(slug: string): CityTypicalIncome | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const countryName = String(COUNTRIES.find((c) => c.code === iso2)?.name ?? iso2);
  const salary = cityFigure(iso2, slug, "owner_col.median_salary_usd_mo");
  if (salary && isPos(salary.value)) {
    return {
      slug,
      iso2,
      name: city.name,
      countryName,
      value: Math.round(salary.value * 12),
      tag: salary.tag,
      sample: salary.tag !== "held",
      basis: "unstated",
      from: "city",
      field: `owner_col.median_salary_usd_mo x 12, data/facts/city/${iso2}-${slug}.json`,
    };
  }
  const p = getCountryProfile(iso2);
  if (p.iso2.toUpperCase() !== iso2 || !isPos(p.median_wage_full_time_usd)) return null;
  const tag: FactTag = p.tier === "A" ? "held" : "modeled";
  return {
    slug,
    iso2,
    name: city.name,
    countryName,
    value: Math.round(p.median_wage_full_time_usd),
    tag,
    sample: tag !== "held",
    basis: "unstated",
    from: "country",
    field: "median_wage_full_time_usd, the country profile",
  };
}
