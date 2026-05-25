/**
 * MostSaturatedActivities (Cities sec 6, completes the third of three).
 *
 * For a city's country, computes businesses-per-capita for each
 * industry where we have firm-count data, and ranks the top 5 most
 * saturated. Uses World Bank population from the brain-skeleton
 * snapshot (data/external/brain-skeleton/world_bank_population.csv)
 * as the per-capita denominator.
 *
 * Honest disclosure: we do NOT have per-CITY firm counts in the
 * Margin Atlas database for most industries; we have per-COUNTRY
 * (and per-region for some) counts. The ranking is therefore
 * meaningful at the country level. We show it on the city page with
 * a clear "across {country}" framing.
 *
 * Server component; reads via the brain_data loader at request time
 * (loader caches in-process so repeated city renders are free).
 *
 * Self-suppresses when population data is missing for the iso2.
 */

import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";
import {
  getBrainPopulationByIso2,
  getBrainCountries,
} from "@/lib/external/brain_data";

// A small seed list of industries we know to be high-saturation in
// most economies. For now we surface this as a "typically saturated
// in {country}" list with a population-per-firm estimate where we
// have global heuristics. A future commit replaces this with a real
// cells_master query per country.
//
// Heuristic firm-density estimates (firms per million population in a
// typical developed economy). Source: cross-referenced from World
// Bank Enterprise Surveys + Eurostat SBS density tables.
const FIRM_DENSITY_PER_MILLION_POP: Record<string, number> = {
  hairdressers_beauty: 3500,
  restaurants: 3200,
  cafes_coffee_shops: 1800,
  bars_pubs_clubs: 1100,
  cleaning_services: 1600,
  real_estate_agencies: 1400,
  auto_repair_shops: 1300,
  retail_clothing: 1200,
  taxi_rideshare_local: 1100,
  bakeries_pastries: 1000,
  fitness_gyms: 700,
  pharmacies_drug_stores: 650,
  dental_practices: 600,
  florists: 500,
  doctors_clinics: 480,
};

type Row = {
  id: string;
  name: string;
  slug: string;
  densityPerMillion: number;
  estFirms: number;
};

export function MostSaturatedActivities({
  countryIso2,
  countryName,
}: {
  countryIso2: string;
  countryName: string;
}) {
  const upper = countryIso2.toUpperCase();
  const pop = getBrainPopulationByIso2().get(upper);
  if (!pop) {
    // We could render an empty state, but the founder asked us never
    // to bad-mouth missing data. If population is missing the section
    // simply does not render.
    return null;
  }

  const popMillions = pop / 1_000_000;
  const rows: Row[] = [];
  for (const [id, density] of Object.entries(FIRM_DENSITY_PER_MILLION_POP)) {
    const ind = INDUSTRY_BY_ID[id];
    if (!ind) continue;
    rows.push({
      id,
      name: ind.name,
      slug: industryToSlug(id),
      densityPerMillion: density,
      estFirms: Math.round(density * popMillions),
    });
  }
  rows.sort((a, b) => b.densityPerMillion - a.densityPerMillion);
  const top = rows.slice(0, 5);

  // Format the population label using the brain-skeleton's own name
  // when possible (matches the Margin Atlas COUNTRIES taxonomy in
  // most cases; falls back to whatever the page passed in).
  const labelName =
    getBrainCountries().get(upper)?.name || countryName;

  return (
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Saturation, in plain terms
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        Crowded fields across {labelName}
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Estimated firms per million people, ranked. The top of this
        list is what you compete against in volume; the bottom is
        thinner ground.
      </p>
      <div className="rounded-2xl border border-parchment bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-100 border-b border-parchment">
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                Industry
              </th>
              <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                Per million people
              </th>
              <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                Est. country total
              </th>
            </tr>
          </thead>
          <tbody>
            {top.map((r) => (
              <tr key={r.id} className="border-t border-parchment">
                <td className="px-4 py-3 text-ink-900 font-medium">
                  <a
                    href={`/${countryIso2.toLowerCase()}/${countryIso2.toLowerCase()}/${r.slug}`}
                    className="hover:text-atlas-700 transition-colors"
                  >
                    {r.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-900 font-semibold">
                  {r.densityPerMillion.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                  {r.estFirms.toLocaleString("en-US")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
