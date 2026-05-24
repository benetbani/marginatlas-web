/**
 * CityCharacter (Plan v32 Sprint G).
 *
 * Editorial panel for a city/geo overview page. Renders a deep
 * character read of the city's small-business economy, with:
 *   - one paragraph of economic identity
 *   - the defining industries (clickable chips)
 *   - cost quirks vs the country average
 *   - one line on who the typical owner is
 *   - optional surprise note
 *   - optional neighborhood archetypes strip
 *
 * Self-suppresses when the city has no entry in city_character.ts.
 * Most cities won't have one in v1 (15 cities curated).
 */

import * as React from "react";
import { getCityCharacter } from "@/lib/places/city_character";
import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";

type Props = {
  /** Same geo_id used on the cell pages (e.g. "US-CITY-new-york"). */
  geoId: string | null | undefined;
  /** Country ISO2; used for industry links (lowercase in URL). */
  countryIso2: string;
};

export function CityCharacter({ geoId, countryIso2 }: Props) {
  const char = getCityCharacter(geoId);
  if (!char) return null;

  const country = countryIso2.toLowerCase();

  return (
    <section
      aria-labelledby="city-character-heading"
      className="my-10 md:my-12 rounded-2xl border border-ink-200 bg-white p-6 md:p-8 lg:p-10"
    >
      <div className="max-w-4xl">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700 mb-2">
          The city, read economically
        </div>
        <h2
          id="city-character-heading"
          className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-ink-900 leading-tight"
        >
          {char.display_name}
        </h2>

        {/* Economic identity */}
        <p className="mt-4 md:mt-5 text-base md:text-lg text-ink-800 leading-relaxed">
          {char.economic_identity}
        </p>

        {/* Defining industries */}
        {char.defining_industries.length > 0 && (
          <div className="mt-6 md:mt-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-700 mb-2">
              What defines this city
            </div>
            <ul className="flex flex-wrap gap-2">
              {char.defining_industries.map((id) => {
                const ind = INDUSTRY_BY_ID[id];
                if (!ind) return null;
                return (
                  <li key={id}>
                    <a
                      href={`/${country}/${(geoId ?? "").toLowerCase()}/${industryToSlug(id)}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-cream-50 border border-parchment hover:border-atlas-500 text-sm text-ink-900 transition-colors"
                    >
                      {ind.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Cost quirks */}
        <div className="mt-6 md:mt-8">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-700 mb-2">
            What costs more, what costs less
          </div>
          <p className="text-sm md:text-base text-ink-800 leading-relaxed">
            {char.cost_quirks}
          </p>
        </div>

        {/* Owner archetype */}
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-700 mb-2">
            Who typically opens here
          </div>
          <p className="text-sm md:text-base text-ink-800 leading-relaxed">
            {char.owner_archetype}
          </p>
        </div>

        {/* Surprise */}
        {char.surprise && (
          <div className="mt-6 md:mt-7 border-l-4 border-atlas-500 pl-4 py-1 bg-cream-50 rounded-r-md">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700 mb-1">
              Unexpected
            </div>
            <p className="text-sm md:text-base text-ink-800 leading-relaxed italic">
              {char.surprise}
            </p>
          </div>
        )}
      </div>

      {/* Neighborhoods strip */}
      {char.neighborhoods && char.neighborhoods.length > 0 && (
        <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-ink-100">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-700 mb-3">
            The neighborhoods
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {char.neighborhoods.map((n) => (
              <li
                key={n.name}
                className="border border-ink-100 rounded-md p-4"
              >
                <div className="font-display text-base md:text-lg font-semibold text-ink-900 leading-tight mb-1">
                  {n.name}
                </div>
                <p className="text-sm text-ink-700 leading-relaxed">
                  {n.blurb}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
