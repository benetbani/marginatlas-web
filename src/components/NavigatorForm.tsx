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

const US_STATES = [
  { value: "alabama", label: "Alabama" },
  { value: "alaska", label: "Alaska" },
  { value: "arizona", label: "Arizona" },
  { value: "arkansas", label: "Arkansas" },
  { value: "california", label: "California" },
  { value: "colorado", label: "Colorado" },
  { value: "connecticut", label: "Connecticut" },
  { value: "delaware", label: "Delaware" },
  { value: "district-of-columbia", label: "District of Columbia" },
  { value: "florida", label: "Florida" },
  { value: "georgia", label: "Georgia" },
  { value: "hawaii", label: "Hawaii" },
  { value: "idaho", label: "Idaho" },
  { value: "illinois", label: "Illinois" },
  { value: "indiana", label: "Indiana" },
  { value: "iowa", label: "Iowa" },
  { value: "kansas", label: "Kansas" },
  { value: "kentucky", label: "Kentucky" },
  { value: "louisiana", label: "Louisiana" },
  { value: "maine", label: "Maine" },
  { value: "maryland", label: "Maryland" },
  { value: "massachusetts", label: "Massachusetts" },
  { value: "michigan", label: "Michigan" },
  { value: "minnesota", label: "Minnesota" },
  { value: "mississippi", label: "Mississippi" },
  { value: "missouri", label: "Missouri" },
  { value: "montana", label: "Montana" },
  { value: "nebraska", label: "Nebraska" },
  { value: "nevada", label: "Nevada" },
  { value: "new-hampshire", label: "New Hampshire" },
  { value: "new-jersey", label: "New Jersey" },
  { value: "new-mexico", label: "New Mexico" },
  { value: "new-york", label: "New York" },
  { value: "north-carolina", label: "North Carolina" },
  { value: "north-dakota", label: "North Dakota" },
  { value: "ohio", label: "Ohio" },
  { value: "oklahoma", label: "Oklahoma" },
  { value: "oregon", label: "Oregon" },
  { value: "pennsylvania", label: "Pennsylvania" },
  { value: "rhode-island", label: "Rhode Island" },
  { value: "south-carolina", label: "South Carolina" },
  { value: "south-dakota", label: "South Dakota" },
  { value: "tennessee", label: "Tennessee" },
  { value: "texas", label: "Texas" },
  { value: "utah", label: "Utah" },
  { value: "vermont", label: "Vermont" },
  { value: "virginia", label: "Virginia" },
  { value: "washington", label: "Washington" },
  { value: "west-virginia", label: "West Virginia" },
  { value: "wisconsin", label: "Wisconsin" },
  { value: "wyoming", label: "Wyoming" },
];

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

  // Region options — depends on country
  const regionOptions: ComboOption[] = useMemo(() => {
    if (country === "US") return US_STATES;
    return [{ value: "", label: "Country-level (sub-national coming)" }];
  }, [country]);

  // Subdivision (county, etc.) — placeholder for now
  const subdivisionOptions: ComboOption[] = useMemo(
    () => [{ value: "", label: "All subdivisions" }],
    []
  );

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
    if (!industry) {
      alert("Pick an industry to find the data you're looking for.");
      return;
    }
    const cc = country.toLowerCase();
    // Non-US countries: use country name as the geo slug (matches getExtrapolatedCell)
    let r = region;
    if (!r) {
      if (cc === "us") {
        r = "california";
      } else {
        const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;
        r = countryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      }
    }
    const indSlug = industryToSlug(industry);
    router.push(`/${cc}/${r}/${indSlug}`);
  }

  function surpriseMe() {
    router.push("/random");
  }

  return (
    <div className="rounded-3xl bg-white p-6 md:p-8 lg:p-10 border border-parchment shadow-[0_1px_2px_rgba(76,39,18,0.04),_0_8px_32px_rgba(76,39,18,0.06)]">
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
          disabled={country !== "US"}
          tooltip="First-level administrative division: like US states or French regions."
        />
        <ComboField
          id="subdivision"
          label="Subdivision"
          options={subdivisionOptions}
          value={subdivision}
          onChange={setSubdivision}
          disabled={!region}
          tooltip="Counties, municipalities, or NUTS-3 areas (when available)."
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
            onClick={submit}
            className="px-8 py-4 rounded-xl bg-atlas-500 hover:bg-atlas-600 active:bg-atlas-700 text-cream-50 font-semibold text-base shadow-sm transition"
          >
            Show me the numbers →
          </button>
        </div>
      </div>
    </div>
  );
}
