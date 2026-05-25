"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { ComboField, type ComboOption } from "./ComboField";
import {
  COUNTRIES,
  SIZE_BANDS,
  industryToSlug,
  visibleSectors,
  visibleIndustriesInSector,
  visibleIndustries,
  type Gate,
} from "@/lib/taxonomy";
import { getRegionsForCountry, getSubdivisionsForRegion } from "@/lib/regions/regions-by-country";
import { getDefaultRegionForCountry } from "@/lib/regions/default_region_by_country";
import { CITIES_BY_STATE } from "@/lib/cities/city_aliases_generated";
// CitiesFix2 §3: navigator table redesign. Visual upgrades only; the
// submit mechanic (router.push + ComboField state) is preserved exactly
// as it was, per the founder's "do not change the submit mechanic"
// directive. The visual changes are:
//  - card chrome wrapped in atlas-paper-card (paper texture, edge fade)
//  - 6 fields grouped into two editorial sections, "Where" + "What",
//    each with a font-display heading and small ordinal cue
//  - on desktop, the two sections sit side by side with a vermillion
//    hairline divider between them; on mobile they stack with a
//    horizontal hairline between the two blocks
//  - the form has a brand top rule (vermillion accent bar) and an
//    editorial caption row at the bottom of the card with the
//    sample-prompt copy and the two CTAs aligned end-of-line
// Plan v13 Wave 4a — emoji flagFromIso2 removed from dropdown labels
// (ComboField input is a plain text field and can't host the SVG CountryFlag
// image without an invasive rewrite). Flags still render on the destination
// pages via <CountryFlag>.

/** Client-side gate read — matches lib/audience.ts on the server. */
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
  // Plan v32 hotfix — startTransition was suppressing Next.js's
  // built-in loading.tsx skeleton, leaving the user staring at the
  // homepage with a spinner for many seconds (looks like the button
  // is broken). Drop startTransition entirely; use a plain isLoading
  // flag that clears on a brief timeout so the button itself still
  // gives instant feedback. The actual page transition is then
  // handled by Next.js with the loading.tsx skeleton, which is
  // what we wanted from the start.
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState("US");
  const [region, setRegion] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [sector, setSector] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [gate, setGate] = useState<Gate>({ revealMixed: false, revealCorp: false });

  // Client-side gate (Plan v3.0 §P) — re-runs at mount so ?pro=1 + cookies
  // can unhide corp_only / mixed_caution industries in the dropdown.
  useEffect(() => {
    setGate(readClientGate());
  }, []);

  // Country options — alphabetical. (Flag emoji prefix removed in Wave 4a.)
  const countryOptions: ComboOption[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: c.name,
        keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
      })),
    []
  );

  // Region options — depends on country. Resolves from the per-country
  // region table (see src/lib/regions/regions-by-country.ts).
  const regionOptions: ComboOption[] = useMemo(() => {
    const name = COUNTRIES.find((c) => c.code === country)?.name || country;
    return getRegionsForCountry(country, name);
  }, [country]);

  // Plan v22 Block E — city dropdown (replaces the previous
  // subdivision dropdown). For US, region is a state slug and the cities
  // come from CITIES_BY_STATE[country][stateSlug] (curated top cities
  // with friendly slugs like "los-angeles"). For non-US, falls back to
  // getSubdivisionsForRegion which uses the geo_id parent relation.
  const subdivisionOptions: ComboOption[] = useMemo(() => {
    if (!region) return [{ value: "", label: "Pick a region first" }];
    const upper = country.toUpperCase();
    const curatedCities = CITIES_BY_STATE[upper]?.[region.toLowerCase()];
    if (curatedCities && curatedCities.length > 0) {
      return [{ value: "", label: "Any city" } as ComboOption].concat(
        curatedCities.map((slug) => ({
          value: slug,
          label: slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        })),
      );
    }
    // Non-curated fallback: regional_cells subdivision cascade
    const subs = getSubdivisionsForRegion(country, region);
    if (subs.length === 0) {
      return [{ value: "", label: "No deeper subdivisions covered" }];
    }
    return [{ value: "", label: "Any subdivision" } as ComboOption].concat(
      subs.map((s) => ({ value: s.value, label: s.label })),
    );
  }, [country, region]);

  // Sector options — curated display order, NOT alphabetical (Plan v4.0)
  const sectorOptions: ComboOption[] = useMemo(
    () =>
      [{ value: "", label: "Any sector" } as ComboOption].concat(
        visibleSectors(gate).map((s) => ({
          value: s.id,
          label: `${s.icon || ""}  ${s.name}`.trim(),
          examples: s.examples,
          keywords: [s.id, s.name.toLowerCase(), ...(s.examples || []).map((e) => e.toLowerCase())],
        }))
      ),
    [gate]
  );

  // Industry options — filtered by selected sector, audience-gated, alphabetical within sector
  const industryOptions: ComboOption[] = useMemo(() => {
    const pool = sector
      ? visibleIndustriesInSector(sector, gate)
      : visibleIndustries(gate).sort((a, b) => a.name.localeCompare(b.name));
    return pool.map((i) => ({
      value: i.id,
      label: i.name,
      examples: i.examples,
      keywords: i.keywords,
    }));
  }, [sector, gate]);

  // Size band options
  const sizeOptions: ComboOption[] = useMemo(
    () =>
      [{ value: "", label: "Any size" } as ComboOption].concat(
        SIZE_BANDS.map((s) => ({ value: s.id, label: s.label }))
      ),
    []
  );

  function submit() {
    try {
      if (!industry) {
        alert("Pick an activity to find the data you're looking for.");
        return;
      }
      const cc = country.toLowerCase();
      // Resolve region slug. v34 sanity sweep §7: if the user did not pick
      // a region, use the curated default for that country (the largest
      // economy or best-data region). This is a deliberate departure from
      // the previous "first alphabetical region" behavior which landed US
      // users on Alabama (low traffic, low data quality).
      let r = region;
      if (!r) {
        const curated = getDefaultRegionForCountry(country);
        if (curated) {
          r = curated;
        } else {
          const opts = regionOptions;
          const firstWithValue = opts.find((o) => o.value);
          if (firstWithValue) {
            r = firstWithValue.value;
          } else if (cc === "us") {
            r = "california";
          } else {
            const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;
            r = countryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          }
        }
      }
      const indSlug = industryToSlug(industry);
      // Plan v21 Block 3 — if a subdivision is selected, navigate to
      // that finer-grained URL (e.g. `/us/us-06-037/restaurants` for
      // Los Angeles County). Otherwise stay at the region level.
      const targetGeo = subdivision || r;
      const path = `/${cc}/${targetGeo}/${indSlug}`;
      setIsLoading(true);
      router.push(path);
      // Safety: clear the loading flag after 3s in case the user
      // never navigates away (back-button etc.). The actual
      // navigation UI is handled by Next.js loading.tsx.
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch (err) {
      // Defensive fallback: hard navigation if the router push throws.
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-2xl atlas-paper-card border border-ink-200 hover:border-ink-300 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_8px_28px_rgba(0,0,0,0.06)] overflow-hidden"
    >
      {/* Vermillion top rule. Anchors the card as an Atlas surface, not a
          generic SaaS form. */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full bg-gradient-to-r from-atlas-700 via-atlas-500 to-atlas-700"
      />

      {/* Card header strip. Editorial caption + meta count. Reads as
          a section title, not a marketing pitch. */}
      <div className="flex items-baseline justify-between gap-4 px-5 md:px-8 pt-5 md:pt-7 pb-3 border-b border-ink-200/60">
        <div>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
            The Navigator
          </div>
          <h2 className="mt-1 font-display text-lg md:text-xl text-ink-900 leading-tight">
            Pick a place. Pick a line of work.
          </h2>
        </div>
        <div className="hidden sm:block text-right text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-cocoa-700/70 font-medium leading-tight">
          <div>105 countries</div>
          <div>900+ activities</div>
        </div>
      </div>

      {/* Two editorial sections: WHERE (geography) and WHAT (line of work).
          Side by side on md+; stacked with a hairline divider on mobile. */}
      <div className="grid md:grid-cols-2 md:divide-x md:divide-ink-200/60 divide-y md:divide-y-0 divide-ink-200/60">
        {/* WHERE */}
        <section className="px-5 md:px-8 py-5 md:py-7">
          <header className="flex items-baseline gap-3 mb-4 md:mb-5">
            <span className="font-display text-atlas-700 text-base md:text-lg tabular-nums leading-none">
              01
            </span>
            <div className="flex-1">
              <div className="font-display text-base md:text-lg text-ink-900 leading-tight">
                Where
              </div>
              <div className="text-[11px] md:text-xs text-cocoa-700/80 leading-snug mt-0.5">
                Country, region, city.
              </div>
            </div>
          </header>
          <div className="space-y-3.5">
            <ComboField
              id="country"
              label="Country"
              required
              options={countryOptions}
              value={country}
              onChange={(v) => {
                setCountry(v);
                setRegion("");
                setSubdivision("");
              }}
              tooltip="Where the business is located. United States has state-level depth; other countries are country-level for now."
            />
            <ComboField
              id="region"
              label="Region"
              options={regionOptions}
              value={region}
              onChange={(v) => {
                setRegion(v);
                setSubdivision("");
              }}
              tooltip="First-level administrative division: like US states, French regions, or Japanese prefectures."
            />
            <ComboField
              id="subdivision"
              label="City"
              options={subdivisionOptions}
              value={subdivision}
              onChange={setSubdivision}
              disabled={!region}
              tooltip="Major cities within the picked region (when covered)."
            />
          </div>
        </section>

        {/* WHAT */}
        <section className="px-5 md:px-8 py-5 md:py-7">
          <header className="flex items-baseline gap-3 mb-4 md:mb-5">
            <span className="font-display text-atlas-700 text-base md:text-lg tabular-nums leading-none">
              02
            </span>
            <div className="flex-1">
              <div className="font-display text-base md:text-lg text-ink-900 leading-tight">
                What
              </div>
              <div className="text-[11px] md:text-xs text-cocoa-700/80 leading-snug mt-0.5">
                Sector, activity, employees.
              </div>
            </div>
          </header>
          <div className="space-y-3.5">
            <ComboField
              id="sector"
              label="Sector"
              options={sectorOptions}
              value={sector}
              onChange={(v) => {
                setSector(v);
                setIndustry("");
              }}
              tooltip="Broad small-business sector. Pick one to narrow the activity list below."
            />
            <ComboField
              id="industry"
              label="Activity"
              required
              options={industryOptions}
              value={industry}
              onChange={setIndustry}
              placeholder="Type a name or example: restaurants, barbers, plumbers"
            />
            <ComboField
              id="size"
              label="Employees"
              options={sizeOptions}
              value={size}
              onChange={setSize}
              tooltip="Number of people working at the business."
            />
          </div>
        </section>
      </div>

      {/* Footer bar. Editorial sample line + the two CTAs. */}
      <div className="border-t border-ink-200/60 bg-cream-50/60 px-5 md:px-8 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] md:text-xs text-cocoa-700/80 leading-relaxed">
            <span className="font-semibold uppercase tracking-[0.12em] text-atlas-700 mr-1.5">
              Try
            </span>
            restaurants in California
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            cafés in Italy
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            plumbers in Texas
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            clothing boutiques in France
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
                <>Show me the numbers <span aria-hidden="true">→</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
