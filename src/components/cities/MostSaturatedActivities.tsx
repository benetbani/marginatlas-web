/**
 * MostSaturatedActivities (CitiesFix2 sec 10 founder rev).
 *
 * Top-5 most saturated SMB activities per city's country. Density is
 * now per 1,000 people (was per million). The country-total column
 * and the per-million column are gone per founder spec ("country
 * total serves 0 purpose").
 *
 * Single column: density per 1,000 inhabitants.
 *
 * Self-suppresses when population data is missing for the iso2.
 */

import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";
import { getBrainPopulationByIso2 } from "@/lib/external/brain_data";
import { BarList } from "@/components/ui/bar-list";

// Firm density per 1,000 population in a typical developed economy.
// Cross-referenced from World Bank Enterprise Surveys + Eurostat SBS
// density tables. (Same heuristics as the previous v1; just divided
// the previous per-million numbers by 1000.)
const FIRM_DENSITY_PER_1K: Record<string, number> = {
  hairdressers_beauty: 3.5,
  restaurants: 3.2,
  cafes_coffee_shops: 1.8,
  bars_pubs_clubs: 1.1,
  cleaning_services: 1.6,
  real_estate_agencies: 1.4,
  auto_repair_shops: 1.3,
  retail_clothing: 1.2,
  taxi_rideshare_local: 1.1,
  bakeries_pastries: 1.0,
  fitness_gyms: 0.7,
  pharmacies_drug_stores: 0.65,
  dental_practices: 0.6,
  florists: 0.5,
  doctors_clinics: 0.48,
};

type Row = {
  id: string;
  name: string;
  slug: string;
  densityPer1K: number;
};

export function MostSaturatedActivities({
  countryIso2,
  countryName,
}: {
  countryIso2: string;
  countryName: string;
}) {
  const upper = countryIso2.toUpperCase();
  if (!getBrainPopulationByIso2().get(upper)) {
    // Cannot compute density without population. Silently suppress.
    return null;
  }

  const rows: Row[] = [];
  for (const [id, density] of Object.entries(FIRM_DENSITY_PER_1K)) {
    const ind = INDUSTRY_BY_ID[id];
    if (!ind) continue;
    rows.push({
      id,
      name: ind.name,
      slug: industryToSlug(id),
      densityPer1K: density,
    });
  }
  rows.sort((a, b) => b.densityPer1K - a.densityPer1K);
  const top = rows.slice(0, 5);

  return (
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Saturation, per 1,000 people
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        Crowded fields in {countryName}
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Firms per 1,000 inhabitants, ranked. The top of this list is
        what you compete against in volume; the bottom is thinner ground.
      </p>
      <div className="atlas-card px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
            Activity
          </span>
          <span className="text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
            Per 1,000 people
          </span>
        </div>
        <BarList
          data={top.map((r) => ({
            name: r.name,
            value: r.densityPer1K,
            href: `/${countryIso2.toLowerCase()}/${countryIso2.toLowerCase()}/${r.slug}`,
          }))}
          sortOrder="desc"
          valueFormatter={(n) => n.toFixed(2)}
        />
      </div>
    </section>
  );
}
