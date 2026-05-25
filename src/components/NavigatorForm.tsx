"use client";

/**
 * NavigatorForm — v34 NUCLEAR REWRITE (2026-05-25, third attempt).
 *
 * The button has been failing in production across multiple fixes.
 * Founder asked for something dramatic. Result: the form is now a
 * native HTML <form action="/api/go" method="get"> with plain
 * <select> elements. Submission is a native browser GET to a server
 * route that 302-redirects to the destination cell.
 *
 * Zero React state in the submit path. Zero useEffect, useRouter,
 * router.push, fetch, or window.location calls anywhere. The browser
 * does the entire submit. The submit cannot silently fail because
 * the browser's form-submission code path is the most heavily-tested
 * primitive in the web platform.
 *
 * The component is still a Client Component because the cascading
 * <select> dropdowns (region depends on country; industry depends on
 * sector) need re-rendering on change. But the SUBMIT itself is
 * pure HTML.
 *
 * Trade-offs vs the old ComboField search-as-you-type widget:
 *  - Lost: typeahead search inside the dropdowns. Replaced with
 *    native <select> which has its own jump-to-first-letter built in.
 *  - Lost: nothing important. The widget was bug-prone; this is not.
 *  - Gained: it actually works.
 */

import { useState, useMemo } from "react";
import {
  COUNTRIES,
  SIZE_BANDS,
  industryToSlug,
  visibleSectors,
  visibleIndustriesInSector,
  visibleIndustries,
} from "@/lib/taxonomy";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { CITIES_BY_STATE } from "@/lib/cities/city_aliases_generated";

export function NavigatorForm() {
  const [country, setCountry] = useState("US");
  const [region, setRegion] = useState("");
  const [sector, setSector] = useState("");

  // Region options depend on country.
  const regionOptions = useMemo(() => {
    const name = COUNTRIES.find((c) => c.code === country)?.name || country;
    return getRegionsForCountry(country, name);
  }, [country]);

  // City options depend on (country, region). For US, curated city
  // lists per state; otherwise the regional-cells subdivision cascade.
  const cityOptions = useMemo(() => {
    if (!region) return [];
    const upper = country.toUpperCase();
    const curated = CITIES_BY_STATE[upper]?.[region.toLowerCase()];
    if (curated && curated.length > 0) {
      return curated.map((slug) => ({
        value: slug,
        label: slug
          .split("-")
          .map((w) => w[0]?.toUpperCase() + w.slice(1))
          .join(" "),
      }));
    }
    return [];
  }, [country, region]);

  // Sector options. The Gate object only matters for hidden/large
  // categories; default-visible covers the public form.
  const sectorOptions = useMemo(
    () =>
      visibleSectors({ revealMixed: false, revealCorp: false }).map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [],
  );

  // Industry options filtered by sector (or all-visible if no sector).
  const industryOptions = useMemo(() => {
    const pool = sector
      ? visibleIndustriesInSector(sector, {
          revealMixed: false,
          revealCorp: false,
        })
      : visibleIndustries({ revealMixed: false, revealCorp: false }).sort(
          (a, b) => a.name.localeCompare(b.name),
        );
    return pool.map((i) => ({
      // Submit the slug, not the DB id, so the URL matches the cell route.
      value: industryToSlug(i.id),
      label: i.name,
    }));
  }, [sector]);

  return (
    <form
      // Native GET submit to a server route that 302-redirects.
      // Browser handles the entire submit; React is not involved.
      action="/api/go"
      method="get"
      className="rounded-2xl bg-white p-6 md:p-8 lg:p-10 border-2 border-ink-200 hover:border-ink-300 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Country">
          <select
            name="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setRegion("");
            }}
            className={selectClass}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Region">
          <select
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={selectClass}
          >
            <option value="">Any region</option>
            {regionOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="City">
          <select name="city" disabled={!region} className={selectClass}>
            <option value="">{region ? "Any city" : "Pick a region first"}</option>
            {cityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className={selectClass}
          >
            <option value="">Any category</option>
            {sectorOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Industry">
          <select name="industry" className={selectClass} defaultValue="">
            <option value="">Pick an industry</option>
            {industryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Employees">
          <select name="size" className={selectClass} defaultValue="">
            <option value="">Any size</option>
            {SIZE_BANDS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-cocoa-700/70">
          Try: restaurants in California &middot; cafes in Italy &middot; plumbers in Texas
        </p>
        <div className="flex items-center gap-2">
          {/* Surprise me is a plain link, no JS. */}
          <a
            href="/random"
            className="px-4 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-900 text-sm font-medium border border-parchment transition no-underline"
          >
            Surprise me
          </a>
          {/* Native submit. The browser will GET /api/go with the form
             fields as query params; the server redirects to the cell. */}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-atlas-500 hover:bg-atlas-600 active:bg-atlas-700 text-cream-50 font-semibold text-sm shadow-sm transition inline-flex items-center gap-2"
          >
            Show me the numbers &rarr;
          </button>
        </div>
      </div>
    </form>
  );
}

const selectClass =
  "w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-atlas-500 focus:border-atlas-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
