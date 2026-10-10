/**
 * src/lib/home/picker.ts
 *
 * THE HOME PICKER'S DATA, IN TWO PARTS (plan docs/superpowers/plans/2026-10-10-home-reform, Task 2; the ship audit's 3.2: the picker
 * shipped the whole taxonomy and the city tables, about 57 KB gzip of source, to every visitor on the first paint, to draw three
 * words):
 *
 *   homePickerSeed()      what the form paints before anything loads: the three fields' values and labels, the four fields the
 *                         no-script form sends to /api/go, and the examples' links. The server works it out and passes it as a prop.
 *   the option builders   the lists, the no-script fields for any pick, and the destination: src/components/NavigatorForm.tsx loads
 *                         this module with import() on first use (a pointer entering the form, or a focus inside it).
 *
 * One module for both, so the seed's labels are the lists' own; tests/home/picker.test.ts holds them equal, and holds the form to
 * no static import of this module or of what it reads.
 */
import { COUNTRIES, industryToSlug, visibleIndustries, type Gate } from "@/lib/taxonomy";
import { getDefaultRegionForCountry } from "@/lib/regions/default_region_by_country";
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "@/lib/home/search_cascade";
import { homeDestination, homeTryLinks, homeTryCityLabel } from "@/lib/home/destination";

/** An option as the picker's fields take it (src/components/ComboField.tsx ComboOption, the same shape). */
export type PickerOption = { value: string; label: string; examples?: string[]; keywords?: string[] };

/** The four fields the no-script form sends to /api/go (src/app/api/go/route.ts reads country, subdivision and industry). */
export type PickerHidden = { country: string; region: string; subdivision: string; industry: string };

/** What the form paints before its lists load. */
export type PickerSeed = {
  country: PickerOption;
  city: PickerOption;
  business: PickerOption;
  hidden: PickerHidden;
  tries: Array<{ word: string; href: string }>;
  tryCity: string;
};

/** Every country, by name. */
export function countryOptions(): PickerOption[] {
  return COUNTRIES.map((c) => ({ value: c.code, label: c.name, keywords: [c.code.toLowerCase(), c.name.toLowerCase()] }));
}

/** A leading "Anywhere in {country}" (value "") and the country's cities (each slug a page's address, the UK's its seven). */
export function cityOptions(country: string): PickerOption[] {
  const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;
  const anywhere: PickerOption = { value: "", label: `Anywhere in ${countryName}` };
  return [anywhere, ...getCitiesForCountryCode(country).map((c) => ({ value: c.slug, label: c.label, keywords: [c.slug, c.label.toLowerCase()] }))];
}

/** The forgiving activity list, behind the audience gate, alphabetical; not narrowed by city (activities are not city-specific). */
export function businessOptions(gate: Gate): PickerOption[] {
  return visibleIndustries(gate)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ value: i.id, label: i.name, examples: i.examples, keywords: i.keywords }));
}

/** The no-script fields for a pick: the city carries the place; with no city, the country's curated default region. */
export function hiddenFields(country: string, city: string, business: string): PickerHidden {
  return {
    country: country.toLowerCase(),
    region: (city ? "" : getDefaultRegionForCountry(country) || "").toLowerCase(),
    subdivision: city.toLowerCase(),
    industry: business ? industryToSlug(business) : "",
  };
}

/** The form's own case, restaurants in London (CASCADE_PREFILLS[0]), as the first paint draws it. */
export function homePickerSeed(): PickerSeed {
  const p = CASCADE_PREFILLS[0];
  const pick = (options: PickerOption[], value: string): PickerOption => ({ value, label: options.find((o) => o.value === value)?.label ?? "" });
  return {
    country: pick(countryOptions(), p.country),
    city: pick(cityOptions(p.country), p.city),
    business: pick(businessOptions({ revealMixed: false, revealCorp: false }), p.business),
    hidden: hiddenFields(p.country, p.city, p.business),
    tries: homeTryLinks(),
    tryCity: homeTryCityLabel(),
  };
}

/* What the loaded form reads besides the builders: the case it opens on where no seed was passed, the destination a search lands on,
   and the examples' links. */
export { CASCADE_PREFILLS, homeDestination, homeTryLinks, homeTryCityLabel };
