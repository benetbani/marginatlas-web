"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { ComboField, type ComboOption } from "./ComboField";
import {
  COUNTRIES,
  SECTORS,
  SECTORS_ALPHA,
  INDUSTRIES,
  SIZE_BANDS,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  industryToSlug,
  visibleIndustries,
} from "@/lib/taxonomy";
import { flagFromIso2 } from "@/lib/countries";

/** Client-side gate read — matches lib/audience.ts on the server. */
function readClientGate(): { revealMixed: boolean; revealCorp: boolean } {
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
  const [gate, setGate] = useState({ revealMixed: false, revealCorp: false });

  // Client-side gate (Plan v3.0 §P) — re-runs at mount so ?pro=1 + cookies
  // can unhide corp_only / mixed_caution industries in the dropdown.
  useEffect(() => {
    setGate(readClientGate());
  }, []);

  // Country options — alphabetical, flag prefixed
  const countryOptions: ComboOption[] = useMemo(
    () =>
      [...COUNTRIES]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({
          value: c.code,
          label: `${flagFromIso2(c.code)}  ${c.name}`,
          keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
        })),
    []
  );

  // Region options — depends on country
  const regionOptions: ComboOption[] = useMemo(() => {
    if (country === "US") return US_STATES;
    return [{ value: "", label: "All regions (coming soon)" }];
  }, [country]);

  // Subdivision (county, etc.) — placeholder for now
  const subdivisionOptions: ComboOption[] = useMemo(
    () => [{ value: "", label: "All subdivisions" }],
    []
  );

  // Sector options — alphabetical, icon prefixed
  const sectorOptions: ComboOption[] = useMemo(
    () =>
      [{ value: "", label: "Any sector" } as ComboOption].concat(
        SECTORS_ALPHA.map((s) => ({
          value: s.id,
          label: `${s.icon || ""}  ${s.name}`.trim(),
          examples: s.examples,
          keywords: [s.id, ...s.examples.map((e) => e.toLowerCase())],
        }))
      ),
    []
  );

  // Industry options — filtered by selected sector, audience-gated, alphabetical
  const industryOptions: ComboOption[] = useMemo(() => {
    const allowed = visibleIndustries(gate);
    const pool = sector ? allowed.filter((i) => i.sector_id === sector) : allowed;
    return [...pool]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((i) => ({
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
      alert("Please pick an industry to find the data you're looking for.");
      return;
    }
    const cc = country.toLowerCase();
    const r = region || "us"; // if no region, just country level
    const indSlug = industryToSlug(industry);
    router.push(`/${cc}/${r}/${indSlug}`);
  }

  return (
    <div className="card bg-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
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
          tooltip="Where the business is located. United States has the richest data; others coming as we expand."
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
          tooltip="First-level administrative division — like US states or French regions."
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
          label="Sector"
          options={sectorOptions}
          value={sector}
          onChange={(v) => {
            setSector(v);
            setIndustry("");
          }}
          tooltip="Broad industry group, like Manufacturing or Hotels & food."
        />
        <ComboField
          id="industry"
          label="Industry"
          required
          options={industryOptions}
          value={industry}
          onChange={setIndustry}
          placeholder="Type a name or example, e.g. restaurants, barber, plumber…"
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
      <div className="mt-5 flex justify-end">
        <button
          onClick={submit}
          className="px-6 py-3 rounded-xl bg-atlas-500 hover:bg-atlas-600 text-white font-medium transition"
        >
          Find the numbers →
        </button>
      </div>
    </div>
  );
}
