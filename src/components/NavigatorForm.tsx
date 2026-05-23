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
import { CITIES_BY_STATE } from "@/lib/cities/city_aliases_generated";
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
      [{ value: "", label: "Any category" } as ComboOption].concat(
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
        alert("Pick an industry to find the data you're looking for.");
        return;
      }
      const cc = country.toLowerCase();
      // Resolve region slug. If the user didn't pick one explicitly, use
      // the first option for that country (which is always present per
      // getRegionsForCountry — country-level fallback as last resort).
      let r = region;
      if (!r) {
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
      const indSlug = industryToSlug(industry);
      // Plan v21 Block 3 — if a subdivision is selected, navigate to
      // that finer-grained URL (e.g. `/us/us-06-037/restaurants` for
      // Los Angeles County). Otherwise stay at the region level.
      const targetGeo = subdivision || r;
      const path = `/${cc}/${targetGeo}/${indSlug}`;
      router.push(path);
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
      router.push("/random");
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
      className="rounded-2xl bg-white p-6 md:p-8 lg:p-10 border-2 border-ink-200 hover:border-ink-300 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <ComboField
          id="sector"
          label="Category"
          options={sectorOptions}
          value={sector}
          onChange={(v) => {
            setSector(v);
            setIndustry("");
          }}
          tooltip="Broad small-business category. Pick one to narrow the industry list below."
        />
        <ComboField
          id="industry"
          label="Industry"
          required
          options={industryOptions}
          value={industry}
          onChange={setIndustry}
          placeholder="Type a name or example: restaurants, barbers, plumbers…"
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
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-cocoa-700/70">
          Try: restaurants in California · cafés in Italy · plumbers in Texas · clothing boutiques in France
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={surpriseMe}
            className="px-6 py-4 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink-900 text-base font-medium border border-parchment transition"
          >
            Surprise me ✦
          </button>
          <button
            type="submit"
            className="px-8 py-4 rounded-xl bg-atlas-500 hover:bg-atlas-600 active:bg-atlas-700 text-cream-50 font-semibold text-base shadow-sm transition"
          >
            Show me the numbers →
          </button>
        </div>
      </div>
    </form>
  );
}
