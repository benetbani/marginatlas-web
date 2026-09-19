/**
 * src/lib/spine/hood_take_rows.ts
 *
 * THE ANSWER, `00 take` (MODEL.md 8.8; plan step 35, 2026-09-19), on
 * AnswerCard with its docked KvGrid, for the hub and for every district page
 * (the district page is the hub's spine in focus: the same card, `focus`
 * set). Pure over hood_scheme.ts's rows, synchronous, no seed and no
 * database, so the stories and the copy gates build it by the slug.
 *
 * ONE NOTATION FOR THE RENT FIGURE ON THE WHOLE PAGE, the city page's own
 * law (district_rows.ts, his rulings of 2026-09-07 and 2026-09-10): every
 * district's shop rent is measured against the CHEAPEST district of the set,
 * which is drawn, named and ranked on the same page, printed as `rentMult`
 * ("2.50x", two decimals, the multiplier trailing). The engine's own figure
 * (`rent_mult`, a multiple of the model's neutral district, "x1.20 the city
 * rate" on the old masthead) is never printed: its base is drawn nowhere,
 * and "no notation makes an invisible base checkable" (PART 5). 8.8's own
 * bracket on this row says clause 15 and PART 5 bar that multiple and holds
 * the hero PROVISIONAL until a measured rent lands (item 15); rebasing on the
 * cheapest district is what the city's card already does with the same
 * numbers, and the ratio between two districts is the only thing the model
 * claims (district_rows.ts, "why rebasing is honest here").
 *
 * WHAT THE 40 IS, and why it is not "the lightest district's multiple" as
 * 8.8 and the step's brief name it. Rebased on the cheapest district, the
 * lightest district's own figure is one times itself, 1.00x, by
 * construction: a page whose answer is "1.00x" is the base printed as an
 * answer, his 2026-09-07 fault ("the city average times one which is the
 * baseline") in the hero's clothes. The figure that carries the page's
 * finding, "where rent runs lightest, and heaviest" (8.8's own title for
 * this block), is the DEAREST district's rent against the cheapest: 2.50x on
 * London, the West End against South London, both ends named in the label
 * and the spread in the figure. That is the hub's 40. On a district page the
 * 40 is the district's own rent against the cheapest (the City of London
 * 2.47x); on the cheapest district's own page that figure is again 1.00x, so
 * that page prints the hub's answer, the spread above it, which is the one
 * honest reading of "what does opening here cost against the rest". Recorded
 * for the controller in the dispatch's report; 8.8's row and its loud-moment
 * ledger name the figure as the lightest district's.
 *
 * THE COMPANIONS, 8.8's three (the cheapest district's figure, the dearest's,
 * the district count) LESS the one the 40 already prints (M1: one figure once
 * in a band; the old masthead's own note, "you are repeating the front part",
 * his words of 2026-08-25). So the hub holds the cheapest's 1.00x, named as
 * the reference under a label that names it (PART 5's reference row, in a
 * cell), and the count; a district page holds all three unless its 40 is the
 * dearest's (the dearest's own page, and the cheapest's, whose 40 is the
 * spread). The count prints as a figure (a cell holds a figure).
 *
 * THE IDENTITY: the hub's h1 is the city, the flag beside it, the country
 * nowhere in words (clause 11: the place named once); a district page's h1
 * is the district and the crumb under it names the city once and the country
 * once, the trade page's own precedent (PART 3). The subtitle says what the
 * figure is about, one line, no conclusion.
 *
 * THE FOOT is the provenance line the old masthead printed under itself,
 * folded into the card (8.8): the rents modelled, the visitor counts' year.
 * `confidence` is "modeled" on every page: the figure is the engine's
 * composition (item 70), so the answer's label carries the sample tag behind
 * his switch.
 */
import { COPY } from "@/lib/spine/copy";
import { rentMult, countWord } from "@/lib/spine/district_rows";
import { hoodCity, spineHoodDistricts, type HoodDistrict } from "@/lib/spine/hood_scheme";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

export type HoodTakeData = {
  citySlug: string;
  focus: string | null;
  /** The h1: the city on the hub, the district on its page. */
  name: string;
  iso2: string;
  /** The identity crumb under a district's h1 (the city, the country); none on the hub. */
  crumb: string[];
  subtitle: string;
  answer: { label: string; value: string; basis: string; confidence: "modeled" };
  cells: KvCell[];
  foot: { text: string; modeled: true };
  /** The reference district (the cheapest) and the far end (the dearest), for the stories' captions and the gates. */
  cheapest: HoodDistrict;
  dearest: HoodDistrict;
  districts: number;
  /** Which figure the 40 is: the district's own, or the spread (the dearest against the cheapest). */
  figure: "own" | "spread";
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** Every district's rent against the cheapest, two decimals: the city card's arithmetic (district_rows.ts). */
export const againstCheapest = (d: HoodDistrict, cheapest: HoodDistrict) => +(d.rent_mult / cheapest.rent_mult).toFixed(2);

/** The rows sorted cheapest first, the founder's D1; a stable sort on the file's order for ties. */
export function byRent(rows: HoodDistrict[]): HoodDistrict[] {
  return rows.slice().sort((a, b) => a.rent_mult - b.rent_mult);
}

/** Null when the city is not admitted, or when `focus` names a district the scheme does not hold. */
export function buildHoodTake(citySlug: string, focus: string | null = null): HoodTakeData | null {
  const city = hoodCity(citySlug);
  const rows = spineHoodDistricts(citySlug);
  if (!city || !rows) return null;
  const ranked = byRent(rows);
  const cheapest = ranked[0];
  const dearest = ranked[ranked.length - 1];
  const district = focus ? rows.find((d) => d.slug === focus) ?? null : null;
  if (focus && !district) return null;
  const year = rows.map((d) => d.tourism?.year).find((y) => y != null) ?? null;
  const foot = fill(year != null ? COPY.hoodTake.footYear : COPY.hoodTake.foot, { year: String(year ?? ""), count: countWord(rows.length) });

  /* THE FIGURE: a district's own rent against the cheapest, or the spread
     (the dearest against the cheapest) on the hub and on the cheapest
     district's own page, where "own" would be one times itself. */
  const spread = !district || district.slug === cheapest.slug;
  const value = spread ? againstCheapest(dearest, cheapest) : againstCheapest(district!, cheapest);
  const label = spread
    ? fill(COPY.hoodTake.labelSpread, { dearest: dearest.name, cheapest: cheapest.name })
    : fill(COPY.cityDistricts.phoneHead.value, { district: cheapest.name });

  /* THE COMPANIONS: the cheapest's own 1.00x (PART 5's reference figure next
     to its own name, the label naming it the cheapest), the dearest's spread,
     the count, less whichever the 40 prints (the dearest's on the hub, on
     the cheapest district's page and on the dearest's own). On the cheapest
     district's own page its 1.00x stands under its own h1: measured
     2026-09-19 on the story sheet, a lone count cell docked at the half
     opened a 480 by 120 blank at 1280 (LONE STAT), and the reference's own
     figure is the one honest second companion the set holds. */
  const cells: KvCell[] = [];
  cells.push({ key: "cheapest", label: fill(COPY.hoodTake.cells.cheapest, { district: cheapest.name }), value: rentMult(1), confidence: "modeled" });
  if (!spread && district!.slug !== dearest.slug) cells.push({ key: "dearest", label: fill(COPY.hoodTake.cells.dearest, { district: dearest.name }), value: rentMult(againstCheapest(dearest, cheapest)), confidence: "modeled" });
  cells.push({ key: "count", label: COPY.hoodTake.cells.count, value: String(rows.length) });

  return {
    citySlug: city.slug,
    focus: district?.slug ?? null,
    name: district ? district.name : city.name,
    iso2: city.iso2.toLowerCase(),
    crumb: district ? [city.name, city.countryName] : [],
    subtitle: COPY.hoodTake.subtitle,
    answer: { label, value: rentMult(value), basis: fill(COPY.hoodTake.basis, { count: countWord(rows.length) }), confidence: "modeled" },
    cells,
    foot: { text: foot, modeled: true },
    cheapest,
    dearest,
    districts: rows.length,
    figure: spread ? "spread" : "own",
  };
}
