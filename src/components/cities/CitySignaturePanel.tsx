/**
 * CitySignaturePanel — what makes this city itself.
 *
 * Five blocks rendered as one editorial section on the city page:
 *   1. Demographics: % foreign-born + % foreign-owned firms
 *   2. Three signature sectors (NOT banks; characterise the city vs
 *      comparable metros)
 *   3. Cultural spectrums (6 dimensions, 1-10 spectrum bar, "closer
 *      to one side" — not "good/bad")
 *   4. Government & institutions (5 dimensions, 0-10 score bar, higher
 *      is better for business)
 *
 * Data: data/cities/city_signature_v1.json. Per-city curated.
 * Renders null when the city has no entry.
 *
 * Founder direction 2026-05-26: ship NYC first as the gold-standard
 * sample, then scale to the top 50 cities.
 */
import signatureJson from "../../../data/cities/city_signature_v1.json";
import countrySignatureJson from "../../../data/cities/country_signature_v1.json";
import { INDUSTRIES, industryToSlug } from "@/lib/taxonomy";

type SignatureSector = {
  label: string;
  industry_slug: string;
  blurb: string;
};
type Culture = {
  punctuality: number;
  openness_to_foreigners: number;
  innovation: number;
  communication_directness: number;
  corruption_rejection: number;
  ambition_chest_beating: number;
};
type Government = {
  tax_predictability: number;
  low_bribery: number;
  task_efficiency: number;
  time_efficiency: number;
  judicial_impartiality: number;
};
type CommercialStreet = {
  name: string;
  area: string;
  sells: string;
};
type CitySignature = {
  foreign_born_pct: number;
  foreign_owned_pct: number;
  commercial_streets?: CommercialStreet[];
  signature_sectors: SignatureSector[];
  culture: Culture;
  government: Government;
  notes?: string;
};

// A city override may be partial: e.g. just commercial_streets while
// inheriting culture / government / sectors from the country baseline.
type PartialCitySignature = Partial<CitySignature>;

const FILE = signatureJson as { cities: Record<string, PartialCitySignature> };
const COUNTRY_FILE = countrySignatureJson as { countries: Record<string, CitySignature> };

/**
 * Resolve a city's signature data. Priority:
 *   1. Country-level baseline from country_signature_v1.json (always
 *      starts here so culture/gov/sectors are populated by default).
 *   2. City override merges any non-undefined fields on top.
 *   3. null (panel renders nothing) if neither country nor city has data.
 *
 * Partial overrides are supported — a city can ship just
 * commercial_streets and inherit everything else from its country.
 */
function resolveSignature(citySlug: string, iso2: string): CitySignature | null {
  const country = COUNTRY_FILE.countries[iso2.toUpperCase()];
  const city = FILE.cities[citySlug];
  if (!country && !city) return null;
  if (!country) {
    // City-only entry. Must be complete on its own — narrow by hand.
    const c = city as CitySignature;
    if (!c.culture || !c.government || !c.signature_sectors) return null;
    return c;
  }
  if (!city) {
    return { ...country, commercial_streets: undefined };
  }
  // Merge: country baseline + per-field city overrides.
  return {
    foreign_born_pct: city.foreign_born_pct ?? country.foreign_born_pct,
    foreign_owned_pct: city.foreign_owned_pct ?? country.foreign_owned_pct,
    commercial_streets: city.commercial_streets,
    signature_sectors: city.signature_sectors ?? country.signature_sectors,
    culture: city.culture ?? country.culture,
    government: city.government ?? country.government,
    notes: city.notes ?? country.notes,
  };
}

// ---------------------------------------------------------------------------
// Spectrum + score bars
// ---------------------------------------------------------------------------

/**
 * Spectrum bar — 2026-05-26 redesign per founder direction.
 *
 * One row per dimension:
 *  - Left label (red tint) = the "Pakistan-like" / loose-traditional end
 *  - Right label (blue tint) = the "US-like" / strict-modern end
 *  - Track is a gradient red → neutral → blue
 *  - The city's position is a bold vertical bar handle (looks like a
 *    toggle switch dropped onto the track)
 *
 * `invert=true` flips the displayed position so that high data values
 * land on the LEFT (used for acceptance_of_corruption: value 10 =
 * tolerates = Pakistan-like = left side).
 */
function SpectrumBar({
  value,
  leftLabel,
  rightLabel,
  invert = false,
}: {
  value: number; // 1-10
  leftLabel: string;
  rightLabel: string;
  invert?: boolean;
}) {
  const v = Math.max(1, Math.min(10, value));
  // Position 0% (left) ... 100% (right). Step 1-10 maps to ~5% ... 95%.
  const displayed = invert ? 11 - v : v;
  const positionPct = ((displayed - 1) / 9) * 90 + 5;

  return (
    <div className="py-1">
      <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.08em] font-medium mb-2">
        <span className="text-[#B23A2A]">{leftLabel}</span>
        <span className="text-[#2A5BA8]">{rightLabel}</span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-visible"
        style={{
          background:
            "linear-gradient(90deg, rgba(178,58,42,0.55) 0%, rgba(178,58,42,0.18) 30%, rgba(232,232,232,0.85) 50%, rgba(42,91,168,0.18) 70%, rgba(42,91,168,0.55) 100%)",
        }}
      >
        {/* Switch handle: bold vertical bar like a dropped toggle. */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-[6px] rounded-[3px] bg-ink-900 shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
          style={{ left: `${positionPct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * Score bar: filled from left up to `value` of 10. Used for the
 * government section where higher = better for business.
 */
function ScoreBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(10, value));
  const pct = (v / 10) * 100;
  const tone =
    v >= 7 ? "bg-emerald-700" : v >= 4 ? "bg-amber-600" : "bg-atlas-700";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs text-cocoa-700/80 mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums font-semibold text-ink-900">
          {v}/10
        </span>
      </div>
      <div className="h-2 w-full rounded-sm bg-cream-200 overflow-hidden">
        <div className={"h-full " + tone} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: turn industry_slug into the cell-page URL
// ---------------------------------------------------------------------------

function industryHref(iso2: string, citySlug: string, industrySlug: string): string {
  // The industry_slug from data uses dashes; the taxonomy uses
  // underscores. Try both for robustness.
  const candidate = industrySlug.replace(/-/g, "_");
  const ind =
    INDUSTRIES.find((i) => industryToSlug(i.id) === industrySlug) ||
    INDUSTRIES.find((i) => i.id === candidate);
  if (!ind) return "#";
  return `/${iso2.toLowerCase()}/${citySlug}/${industryToSlug(ind.id)}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function CitySignaturePanel({
  citySlug,
  cityName,
  iso2,
}: {
  citySlug: string;
  cityName: string;
  iso2: string;
}) {
  const sig = resolveSignature(citySlug, iso2);
  if (!sig) return null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Signature
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        What makes {cityName}, {cityName}
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-8 max-w-2xl">
        Demographics, the three sectors that characterise the metro, the
        cultural spectrum operators feel, and the government environment
        they navigate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {/* Block 1: demographics */}
        <div className="md:col-span-4 atlas-card p-5 md:p-6">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-3">
            People
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tabular-nums leading-none">
                {sig.foreign_born_pct}%
              </div>
              <div className="text-sm text-cocoa-700/80 mt-1">
                of residents were born outside the country
              </div>
            </div>
            <div className="border-t border-[rgba(76,39,18,0.06)] pt-4">
              <div className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tabular-nums leading-none">
                {sig.foreign_owned_pct}%
              </div>
              <div className="text-sm text-cocoa-700/80 mt-1">
                of local SMBs have at least one foreign owner
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: signature sectors */}
        <div className="md:col-span-8 atlas-card p-5 md:p-6">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-3">
            Three sectors that say &ldquo;{cityName}&rdquo;
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sig.signature_sectors.map((s) => (
              <a
                key={s.label}
                href={industryHref(iso2, citySlug, s.industry_slug)}
                className="block group"
              >
                <div className="font-display text-lg font-semibold text-ink-900 leading-tight group-hover:text-atlas-700 transition-colors">
                  {s.label}
                </div>
                <p className="mt-2 text-sm text-cocoa-700/85 leading-relaxed">
                  {s.blurb}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Block 2.5: commercial streets and zones. Sits between
            "what the city is about" (signature sectors) and "how
            the city feels" (culture). The thematic bridge: where
            the city's commerce physically happens. */}
        {sig.commercial_streets && sig.commercial_streets.length > 0 ? (
          <div className="md:col-span-12 atlas-card p-5 md:p-6">
            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-4">
              Where commerce happens
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 gap-y-5">
              {sig.commercial_streets.map((s) => (
                <div key={s.name}>
                  <div className="font-display text-base font-semibold text-ink-900 leading-tight">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-cocoa-700/60 uppercase tracking-wide mt-0.5">
                    {s.area}
                  </div>
                  <p className="mt-2 text-sm text-cocoa-700/85 leading-relaxed">
                    {s.sells}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Block 3: culture spectrums.
            Founder direction 2026-05-26: single column, full width.
            Left = "Pakistan-like" / loose / traditional / red tint.
            Right = "US-like" / strict / modern / blue tint.
            The vertical handle marks where the city sits.
            acceptance_of_corruption is inverted (value 10 = tolerates
            = Pakistan-like = LEFT side). */}
        <div className="md:col-span-7 atlas-card p-5 md:p-7">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-5">
            Culture, as locals feel it
          </div>
          <div className="flex flex-col gap-5">
            <SpectrumBar value={sig.culture.punctuality} leftLabel="Loose on time" rightLabel="Strict on time" />
            <SpectrumBar value={sig.culture.openness_to_foreigners} leftLabel="Insular" rightLabel="Welcoming" />
            <SpectrumBar value={sig.culture.innovation} leftLabel="Tradition-bound" rightLabel="Embraces new ideas" />
            <SpectrumBar value={sig.culture.communication_directness} leftLabel="Indirect" rightLabel="Direct" />
            <SpectrumBar value={sig.culture.corruption_rejection} leftLabel="Corruption tolerated" rightLabel="Rejects corruption" />
            <SpectrumBar value={sig.culture.ambition_chest_beating} leftLabel="Humble" rightLabel="Self-promoting" />
          </div>
        </div>

        {/* Block 4: government */}
        <div className="md:col-span-5 atlas-card p-5 md:p-6">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-4">
            Government, from a business desk
          </div>
          <div className="flex flex-col gap-4">
            <ScoreBar value={sig.government.tax_predictability} label="Tax predictability" />
            <ScoreBar value={sig.government.low_bribery} label="Low bribery" />
            <ScoreBar value={sig.government.task_efficiency} label="Task efficiency" />
            <ScoreBar value={sig.government.time_efficiency} label="Time efficiency" />
            <ScoreBar value={sig.government.judicial_impartiality} label="Judicial impartiality" />
          </div>
          <p className="mt-4 text-[11px] text-cocoa-700/55 leading-relaxed">
            Higher is better in all five. Anchored to business-environment indices, operator surveys, and judicial-independence rankings.
          </p>
        </div>
      </div>
    </section>
  );
}
