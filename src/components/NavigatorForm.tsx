"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { ComboField, type ComboOption } from "./ComboField";
import {
  COUNTRIES,
  industryToSlug,
  visibleIndustries,
  type Gate,
} from "@/lib/taxonomy";
import { getDefaultRegionForCountry } from "@/lib/regions/default_region_by_country";
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "@/lib/home/search_cascade";
import { elevation } from "@/lib/design-tokens";

/**
 * NavigatorForm: the homepage search, reworked into a three-field guided cascade
 * (country to city to business) per the homepage reform SP3. The submit mechanic
 * is unchanged (router.push to `/{country}/{geo}/{industry}`, with the native
 * action="/api/go" fallback for no-JS), per the founder's standing directive.
 *
 * What changed from the six-field Navigator:
 *  - Three visible fields, in order: Country, City, Business. Region, sector,
 *    and size are gone from the UI. The region is resolved behind the scenes: a
 *    picked city slug IS the URL geo, and "Anywhere in {country}" resolves to
 *    that country's curated default region, so the result link still works.
 *  - The form pre-fills with a rotating real example so it never reads blank;
 *    the rotation stops for good on the first user interaction.
 *  - Business is NOT narrowed by city (activities are not city-specific in the
 *    data), so the full forgiving activity list stays available.
 *
 * The card chrome (top rule, header strip, footer CTAs, Surprise me) is reused.
 */

/** Client-side gate read. Matches lib/audience.ts on the server. */
function readClientGate(): Gate {
  if (typeof window === "undefined") return { revealMixed: false, revealCorp: false };
  const params = new URLSearchParams(window.location.search);
  const cookie = document.cookie || "";
  const cookiePro = /(?:^|;\s*)atlas_pro=1(?:;|$)/.test(cookie);
  const showLarge = params.get("show_large") === "1" || params.get("show_large") === "true";
  const showMixed = params.get("show_mixed") === "1" || params.get("show_mixed") === "true";
  const pro = params.get("pro") === "1" || params.get("pro") === "true" || cookiePro;
  return {
    revealCorp: pro || showLarge,
    revealMixed: pro || showMixed || showLarge,
  };
}

export function NavigatorForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Deterministic initial example (the first curated prefill) so the server and
  // first client render match (no hydration mismatch). The rotation below takes
  // over after mount.
  const [country, setCountry] = useState(CASCADE_PREFILLS[0].country);
  const [city, setCity] = useState(CASCADE_PREFILLS[0].city);
  const [business, setBusiness] = useState(CASCADE_PREFILLS[0].business);
  const [gate, setGate] = useState<Gate>({ revealMixed: false, revealCorp: false });
  // True once the user touches any field; freezes the rotating pre-fill.
  const [touched, setTouched] = useState(false);
  const prefillIdx = useRef(0);

  // Client gate so ?pro=1 / cookies can widen the activity list.
  useEffect(() => {
    setGate(readClientGate());
  }, []);

  // Rotating pre-fill: cycle the three fields through the curated examples every
  // few seconds until the user interacts. ComboField is controlled, so setting
  // the values updates the displayed selection. The effect re-runs when
  // `touched` flips true and its cleanup clears the interval, freezing the form.
  useEffect(() => {
    if (touched) return;
    const id = window.setInterval(() => {
      prefillIdx.current = (prefillIdx.current + 1) % CASCADE_PREFILLS.length;
      const ex = CASCADE_PREFILLS[prefillIdx.current];
      setCountry(ex.country);
      setCity(ex.city);
      setBusiness(ex.business);
    }, 4000);
    return () => window.clearInterval(id);
  }, [touched]);

  const countryOptions: ComboOption[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: c.name,
        keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
      })),
    []
  );

  // City options depend on country: a leading "Anywhere in {country}" (value "")
  // plus the country's curated cities (each slug is a URL-resolving geo).
  const cityOptions: ComboOption[] = useMemo(() => {
    const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;
    const anywhere: ComboOption = { value: "", label: `Anywhere in ${countryName}` };
    const cities = getCitiesForCountryCode(country).map((c) => ({
      value: c.slug,
      label: c.label,
      keywords: [c.slug, c.label.toLowerCase()],
    }));
    return [anywhere, ...cities];
  }, [country]);

  // Business options: the full forgiving activity list (audience-gated),
  // alphabetical. NOT narrowed by city (activities are not city-specific).
  const businessOptions: ComboOption[] = useMemo(
    () =>
      visibleIndustries(gate)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((i) => ({
          value: i.id,
          label: i.name,
          examples: i.examples,
          keywords: i.keywords,
        })),
    [gate]
  );

  function submit() {
    try {
      if (!business) {
        alert("Pick a business to find the data you're looking for.");
        return;
      }
      const cc = country.toLowerCase();
      // Submit mechanic unchanged: navigate to /{country}/{geo}/{industry}.
      // geo precedence: the picked city slug (a resolving geo), else this
      // country's curated default region, else the country code itself.
      const geo = city || getDefaultRegionForCountry(country) || cc;
      const path = `/${cc}/${geo}/${industryToSlug(business)}`;
      setIsLoading(true);
      router.push(path);
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch (err) {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("NavigatorForm submit failed", err);
        window.location.href = "/random";
      }
    }
  }

  function surpriseMe() {
    try {
      setIsLoading(true);
      router.push("/random");
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch {
      if (typeof window !== "undefined") {
        window.location.href = "/random";
      }
    }
  }

  // Native-fallback geo (no-JS via /api/go): subdivision carries the city;
  // region carries the curated default when no city is picked, so the native
  // submit still lands on a cell (/api/go prefers subdivision, then region).
  const fallbackRegion = city ? "" : getDefaultRegionForCountry(country) || "";

  return (
    <form
      action="/api/go"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-2xl atlas-paper-card border border-ink-200 hover:border-ink-300 transition-colors"
      style={{ boxShadow: elevation.card }}
    >
      {/* Hidden inputs mirror state for the no-JS native submit (action="/api/go"). */}
      <input type="hidden" name="country" value={country.toLowerCase()} />
      <input type="hidden" name="region" value={fallbackRegion.toLowerCase()} />
      <input type="hidden" name="subdivision" value={city.toLowerCase()} />
      <input type="hidden" name="industry" value={business ? industryToSlug(business) : ""} />

      {/* Vermillion top rule. */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-atlas-700 via-atlas-500 to-atlas-700"
      />

      {/* Card header strip. */}
      <div className="flex items-baseline justify-between gap-4 px-5 md:px-8 pt-5 md:pt-7 pb-3 border-b border-ink-200">
        <div>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
            The Navigator
          </div>
          <h2 className="mt-1 font-display text-lg md:text-xl text-ink-900 leading-tight">
            Pick a country, a city, and a business.
          </h2>
        </div>
        <div className="hidden sm:block text-right text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-cocoa-700/70 font-medium leading-tight">
          <div>105 countries</div>
          <div>200+ activities</div>
        </div>
      </div>

      {/* Three-field cascade: Country, then City, then Business. */}
      <div className="px-5 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <ComboField
            id="country"
            label="Country"
            required
            options={countryOptions}
            value={country}
            onChange={(v) => {
              setTouched(true);
              setCountry(v);
              setCity("");
            }}
            onFocus={() => setTouched(true)}
            tooltip="Where the business is. The United States has city-level depth; many countries are country-level for now."
          />
          <ComboField
            id="city"
            label="City"
            options={cityOptions}
            value={city}
            onChange={(v) => {
              setTouched(true);
              setCity(v);
            }}
            onFocus={() => setTouched(true)}
            tooltip="A major city we cover, or leave it on Anywhere to see the country's strongest region."
          />
          <ComboField
            id="business"
            label="Business"
            required
            options={businessOptions}
            value={business}
            onChange={(v) => {
              setTouched(true);
              setBusiness(v);
            }}
            onFocus={() => setTouched(true)}
            placeholder="Type a business: restaurants, barbers, plumbers"
          />
        </div>
      </div>

      {/* Footer bar: sample line + Surprise me + submit. */}
      <div className="rounded-b-2xl border-t border-ink-200 bg-white px-5 md:px-8 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] md:text-xs text-cocoa-700/80 leading-relaxed">
            <span className="font-semibold uppercase tracking-[0.12em] text-atlas-700 mr-1.5">
              Try
            </span>
            restaurants in Los Angeles
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            law firms in the UK
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            software in San Francisco
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={surpriseMe}
              disabled={isLoading}
              aria-busy={isLoading}
              className="px-4 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-900 text-sm font-medium border border-parchment transition disabled:opacity-70 disabled:cursor-wait"
            >
              Surprise me
            </button>
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="px-5 py-2.5 rounded-full bg-atlas-700 hover:bg-atlas-800 active:bg-atlas-900 text-cream-50 font-semibold text-sm shadow-sm transition disabled:opacity-70 disabled:cursor-wait inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="inline-block w-3.5 h-3.5 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin"
                  />
                  Loading...
                </>
              ) : (
                <>Show me the numbers <span aria-hidden="true">&rarr;</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
