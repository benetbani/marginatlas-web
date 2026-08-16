"use client";

/**
 * ActivityPlacePicker: the hero action of the global ACTIVITY page
 * (/industries/restaurants, /industries/cafes-coffee, ...).
 *
 * Founder feedback (2026-06-06): a visitor who clicked their own line of work
 * does not want the place-agnostic worldwide shape first. They want to pick
 * THEIR place and see the real numbers. So this picker leads the page, directly
 * under the activity title: pick a COUNTRY, then a CITY in that country, press
 * Go, and land on that activity's cell page for that exact place.
 *
 * It builds the same URL the navigator and the cell route already speak:
 *
 *     /{countryIso}/{citySlug}/{activitySlug}
 *
 * e.g. /us/los-angeles/restaurants. The city slugs are the curated friendly
 * slugs from CITY_FRIENDLY_DISPLAY_LABEL, which is exactly the slug universe
 * the cell route resolves (src/lib/cells/geo.ts reads CITY_FRIENDLY_TO_GEO_ID,
 * the same generated map). No new data source is invented: the country list is
 * the shared COUNTRIES taxonomy, the cities are the shared generated city map,
 * and the field is the shared ComboField the navigator uses.
 *
 * Client-safe by construction: it imports only next/navigation, React, the
 * ComboField, and two pure lib maps (taxonomy + generated city aliases). No
 * Supabase, no server-only module.
 */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComboField, type ComboOption } from "@/components/ComboField";
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { CITY_FRIENDLY_DISPLAY_LABEL } from "@/lib/cities/city_aliases_generated";

/**
 * Countries we can offer a city for. The generated city map is keyed by ISO-2
 * upper; intersect it with the display taxonomy so the country dropdown only
 * lists places that actually resolve to a covered city (no dead ends), while
 * still showing the proper country name. Computed once at module load.
 */
const COUNTRY_OPTIONS: ComboOption[] = COUNTRIES.filter((c) => {
  const cities = CITY_FRIENDLY_DISPLAY_LABEL[c.code.toUpperCase()];
  return cities && Object.keys(cities).length > 0;
}).map((c) => ({
  value: c.code,
  label: c.name,
  keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
}));

/**
 * The city options for one country, alphabetised by display label. Reads the
 * curated friendly-slug map for that ISO-2; the value is the slug that goes in
 * the URL, the label is the human name. Returns an empty list for an unknown or
 * city-less country, which disables the field.
 */
function cityOptionsForCountry(countryCode: string): ComboOption[] {
  const cities = CITY_FRIENDLY_DISPLAY_LABEL[countryCode.toUpperCase()];
  if (!cities) return [];
  return Object.entries(cities)
    .map(([slug, label]) => ({
      value: slug,
      label,
      keywords: [slug, label.toLowerCase()],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function ActivityPlacePicker({
  activityId,
  activityName,
}: {
  /** Taxonomy id for the activity, turned into the URL slug at submit. */
  activityId: string;
  /** Human activity name, used only in the helper copy. */
  activityName: string;
}) {
  const router = useRouter();
  const [country, setCountry] = useState("US");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cities depend on the chosen country. Recomputed when the country changes;
  // the city selection is cleared by the country onChange below so a stale city
  // from the previous country can never ride along into the URL.
  const cityOptions = useMemo(() => cityOptionsForCountry(country), [country]);

  const activitySlug = industryToSlug(activityId);

  function go() {
    try {
      // A city is required: without it there is no cell to route to. Guard
      // quietly rather than guessing a city the visitor did not pick.
      if (!city) return;
      const cc = country.toLowerCase();
      const path = `/${cc}/${city}/${activitySlug}`;
      setIsLoading(true);
      router.push(path);
      // Clear the spinner if navigation never completes (back button, etc.).
      // The real transition UI is Next.js loading.tsx.
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch (err) {
      // Defensive: a hard navigation if the router push throws, so the button
      // is never a dead end.
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("ActivityPlacePicker submit failed", err);
        window.location.href = `/${country.toLowerCase()}/${city}/${activitySlug}`;
      }
    }
  }

  const ready = Boolean(country && city);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="rounded-2xl border border-ink-200 bg-white p-5 shadow-[0_1px_2px_rgba(33,24,16,0.04)] md:p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-700 md:text-[11px]">
          See it for your place
        </div>
      </div>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-cocoa-700/85">
        Pick a country and a city to see real revenue, cost stack, and survival
        numbers for {activityName.toLowerCase()} there. The same line of work
        reads very differently once local rent, wages, and tax land on it.
      </p>

      {/* Country, then city, then Go. Stacked on mobile; the two fields sit
          side by side from sm with the button on its own row, so the controls
          stay comfortably tappable on a phone. */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ComboField
          id="activity-place-country"
          label="Country"
          required
          options={COUNTRY_OPTIONS}
          value={country}
          onChange={(v) => {
            setCountry(v);
            setCity("");
          }}
          placeholder="Pick or type a country"
        />
        <ComboField
          id="activity-place-city"
          label="City"
          required
          options={cityOptions}
          value={city}
          onChange={setCity}
          disabled={cityOptions.length === 0}
          placeholder={
            cityOptions.length === 0 ? "No covered city" : "Pick or type a city"
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={!ready || isLoading}
          aria-busy={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-atlas-700 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-atlas-800 active:bg-atlas-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span
                aria-hidden="true"
                className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              Loading...
            </>
          ) : (
            <>
              Go <span aria-hidden="true">&rarr;</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
