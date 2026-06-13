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
import { colors } from "@/lib/design-tokens";

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
  // Institutional innovation / R&D capacity (0-10, higher = stronger
  // research base, R&D investment, patent output, and innovation
  // institutions). This is the INSTITUTIONAL-OUTPUT counterpart to the
  // cultural `innovation` spectrum above: culture.innovation measures an
  // attitude (tradition-bound vs embraces-new-ideas), whereas this measures
  // what the country's institutions actually produce. Modeled directional
  // value, anchored to the global innovation-index family.
  innovation_capacity: number;
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

// A city override may be partial in two dimensions: any top-level field
// may be absent, AND any object field (culture / government) may itself
// be partial. So Culture and Government are Partial<> on the nested
// object as well as optional at the parent level.
type PartialCitySignature = {
  foreign_born_pct?: number;
  foreign_owned_pct?: number;
  commercial_streets?: CommercialStreet[];
  signature_sectors?: SignatureSector[];
  culture?: Partial<Culture>;
  government?: Partial<Government>;
  notes?: string;
};

const FILE = signatureJson as { cities: Record<string, PartialCitySignature> };
const COUNTRY_FILE = countrySignatureJson as { countries: Record<string, CitySignature> };

/** What the panel renders. On the city page (cityScoped) demographics and sectors
 * come ONLY from the city's own entry, so a city without curated data shows no
 * country clone; culture and government are hidden there and may be absent. On the
 * country page the full country baseline applies. */
type ResolvedSignature = {
  foreign_born_pct?: number;
  foreign_owned_pct?: number;
  signature_sectors: SignatureSector[];
  commercial_streets?: CommercialStreet[];
  culture?: Culture;
  government?: Government;
  notes?: string;
};

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
function resolveSignature(
  citySlug: string,
  iso2: string,
  cityScoped: boolean,
): ResolvedSignature | null {
  const country = COUNTRY_FILE.countries[iso2.toUpperCase()];
  const city = FILE.cities[citySlug];
  if (!country && !city) return null;

  if (cityScoped) {
    // City page: demographics and sectors come ONLY from the city's own entry,
    // never the country baseline, so a city without curated data shows no generic
    // clone (those blocks simply omit). Culture and government are hidden here.
    if (!city) return null;
    return {
      foreign_born_pct: city.foreign_born_pct,
      foreign_owned_pct: city.foreign_owned_pct,
      signature_sectors: city.signature_sectors ?? [],
      commercial_streets: city.commercial_streets,
      notes: city.notes,
    };
  }

  if (!country) {
    // City-only entry. Must be complete on its own — narrow by hand.
    const c = city as CitySignature;
    if (!c.culture || !c.government || !c.signature_sectors) return null;
    return c;
  }
  if (!city) {
    return { ...country, commercial_streets: undefined };
  }
  // Merge: country baseline + per-field city overrides. Nested objects
  // (culture, government) are also merged field-by-field so a city can
  // override e.g. only `openness_to_foreigners` and inherit the rest.
  return {
    foreign_born_pct: city.foreign_born_pct ?? country.foreign_born_pct,
    foreign_owned_pct: city.foreign_owned_pct ?? country.foreign_owned_pct,
    commercial_streets: city.commercial_streets,
    signature_sectors: city.signature_sectors ?? country.signature_sectors,
    culture: { ...country.culture, ...city.culture },
    government: { ...country.government, ...city.government },
    notes: city.notes ?? country.notes,
  };
}

// ---------------------------------------------------------------------------
// Spectrum + score bars
// ---------------------------------------------------------------------------

/**
 * Spectrum bar, rebranded 2026-06-08 to the site palette (country page only).
 *
 * One row per dimension:
 *  - Left label = the loose / traditional end, in the brand brick-red (atlas).
 *  - Right label = the strict / modern end, in warm dark gray (ink/graphite).
 *  - Track is a brand gradient: brick-red, through neutral, to dark gray.
 *  - The position is a bold vertical bar handle (a toggle dropped on the track).
 *
 * `invert=true` flips the displayed position so that high data values land on
 * the LEFT (used for the corruption-tolerance dimension, where a high value
 * means more tolerated, the loose end).
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
        <span className="text-atlas-700">{leftLabel}</span>
        <span className="text-ink-700">{rightLabel}</span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-visible"
        style={{
          background: `linear-gradient(90deg, ${colors.atlas[600]} 0%, ${colors.atlas[200]} 30%, ${colors.cream[300]} 50%, ${colors.ink[300]} 70%, ${colors.graphite} 100%)`,
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
  // Brand-token tone by value: positive (moss) / caution (amber) / poor (clay).
  const tone =
    v >= 7 ? "bg-moss-600" : v >= 4 ? "bg-amber-500" : "bg-clay-500";
  return (
    <div>
      {/* Same label type as the culture column so the two columns share a
          row rhythm and align (text-[11px] uppercase tracking line + h-3 bar). */}
      <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.08em] font-medium text-cocoa-700/80 mb-2">
        <span>{label}</span>
        <span className="tabular-nums font-semibold text-ink-900">
          {v}/10
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-cream-200 overflow-hidden">
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
  showInstitutions = true,
  showSectors = true,
  showStreets = true,
}: {
  citySlug: string;
  cityName: string;
  iso2: string;
  // When false, the culture-spectrum and government-score blocks are
  // suppressed. People + sectors + streets always render. These two
  // institution blocks are country-altitude reads, so the city page passes
  // false and the country page passes true.
  showInstitutions?: boolean;
  // When false, the signature-sectors block ("What stands out here") is
  // suppressed. Defaults to true so city pages are unaffected.
  showSectors?: boolean;
  // When false, the city-level commercial-streets block ("Where commerce
  // happens") is suppressed. Merge 2026-06-13 (founder): on a city WITH a
  // neighborhood scheme the neighborhoods section is the single "areas"
  // model and streets fold under each neighborhood, so the city page passes
  // false there; a city with no scheme keeps the block as its one areas list.
  showStreets?: boolean;
}) {
  const cityScoped = !showInstitutions;
  const sig = resolveSignature(citySlug, iso2, cityScoped);
  if (!sig) return null;

  const hasForeignBorn = sig.foreign_born_pct != null;
  const hasForeignOwned = sig.foreign_owned_pct != null;
  const hasDemographics = hasForeignBorn || hasForeignOwned;
  const hasSectors = sig.signature_sectors.length > 0;
  const hasStreets =
    showStreets && !!(sig.commercial_streets && sig.commercial_streets.length > 0);

  // On the city page, if nothing city-specific resolves, render nothing rather
  // than a thin or country-cloned panel.
  if (cityScoped && !hasDemographics && !hasSectors && !hasStreets) return null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Signature
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        What makes {cityName}, {cityName}
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-8 max-w-2xl">
        {showInstitutions
          ? "Demographics, the sectors that characterise the place, the cultural spectrum operators feel, and the government environment they navigate."
          : "What sets this place apart."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {/* Block 1: demographics. City-specific only (cityScoped); each stat shows
            only when present, so a city without one shows neither a clone nor a blank. */}
        {hasDemographics ? (
          <div className="md:col-span-4 atlas-card p-5 md:p-6">
            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-3">
              People
            </div>
            <div className="flex flex-col gap-4">
              {hasForeignBorn ? (
                <div>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tabular-nums leading-none">
                    {sig.foreign_born_pct}%
                  </div>
                  <div className="text-sm text-cocoa-700/80 mt-1">
                    of residents were born outside the country
                  </div>
                </div>
              ) : null}
              {hasForeignOwned ? (
                <div
                  className={
                    hasForeignBorn ? "border-t border-[rgba(76,39,18,0.06)] pt-4" : undefined
                  }
                >
                  <div className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tabular-nums leading-none">
                    {sig.foreign_owned_pct}%
                  </div>
                  <div className="text-sm text-cocoa-700/80 mt-1">
                    of local SMBs have at least one foreign owner
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Block 2: the city's distinctive trades. Renders only when the city has
            its own curated sectors, never a country clone, and showSectors is
            not explicitly set to false (country page passes false to suppress). */}
        {showSectors && hasSectors ? (
          <div className="md:col-span-8 atlas-card p-5 md:p-6">
            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-3">
              What stands out here
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
        ) : null}

        {/* Block 2.5: commercial streets and zones. Shown only when the city
            has no neighborhood scheme (showStreets); where neighborhoods exist
            they are the single areas model and streets fold under them. */}
        {hasStreets && sig.commercial_streets ? (
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

        {/* Blocks 3 + 4: institution reads (culture spectrum + government
            scores). Country-altitude per founder direction: gated behind
            showInstitutions so the city page suppresses them and only the
            country page shows them. The two columns share an identical row
            rhythm (text-[11px] label line + h-3 bar + gap-5) and identical
            eyebrow size/weight/margin, so row N of culture aligns with row N
            of government. */}
        {showInstitutions && sig.culture && sig.government ? (
          <>
            {/* Block 3: culture spectrums.
                Founder direction 2026-05-26: single column.
                Left = loose / traditional / brand brick-red tint.
                Right = strict / modern / warm dark tint.
                The vertical handle marks where the place sits.
                corruption_rejection reads left = tolerated, right = rejected. */}
            <div className="md:col-span-7 atlas-card p-5 md:p-7">
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-4">
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
            <div className="md:col-span-5 atlas-card p-5 md:p-7">
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-4">
                Government, from a business desk
              </div>
              <div className="flex flex-col gap-5">
                <ScoreBar value={sig.government.tax_predictability} label="Tax predictability" />
                <ScoreBar value={sig.government.low_bribery} label="Low bribery" />
                <ScoreBar value={sig.government.task_efficiency} label="Task efficiency" />
                <ScoreBar value={sig.government.time_efficiency} label="Time efficiency" />
                <ScoreBar value={sig.government.judicial_impartiality} label="Judicial impartiality" />
                <ScoreBar value={sig.government.innovation_capacity} label="Innovation and R&D capacity" />
              </div>
              <p className="mt-4 text-[11px] text-cocoa-700/55 leading-relaxed">
                Higher is better in all six. Modeled from business-environment indices, operator surveys, judicial-independence rankings, and the research and innovation-output record.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
