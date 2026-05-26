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
  acceptance_of_corruption: number;
  ambition_chest_beating: number;
};
type Government = {
  tax_predictability: number;
  low_bribery: number;
  task_efficiency: number;
  time_efficiency: number;
  judicial_impartiality: number;
};
type CitySignature = {
  foreign_born_pct: number;
  foreign_owned_pct: number;
  signature_sectors: SignatureSector[];
  culture: Culture;
  government: Government;
  notes?: string;
};

const FILE = signatureJson as { cities: Record<string, CitySignature> };

// ---------------------------------------------------------------------------
// Spectrum + score bars
// ---------------------------------------------------------------------------

/**
 * Spectrum bar: 10 segments. Active segment gets the atlas-700 fill,
 * the rest stay parchment. "Closer to one side" — labels left + right.
 */
function SpectrumBar({
  value,
  leftLabel,
  rightLabel,
}: {
  value: number; // 1-10
  leftLabel: string;
  rightLabel: string;
}) {
  const v = Math.max(1, Math.min(10, Math.round(value)));
  return (
    <div>
      <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wide text-cocoa-700/65 mb-1.5">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => {
          const active = i + 1 === v;
          return (
            <div
              key={i}
              className={
                "h-2 flex-1 rounded-sm " +
                (active ? "bg-atlas-700" : "bg-cream-200")
              }
            />
          );
        })}
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
  const sig = FILE.cities[citySlug];
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

        {/* Block 3: culture spectrums */}
        <div className="md:col-span-7 atlas-card p-5 md:p-6">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/65 mb-4">
            Culture, as locals feel it
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <SpectrumBar value={sig.culture.punctuality} leftLabel="Loose on time" rightLabel="Strict on time" />
            <SpectrumBar value={sig.culture.openness_to_foreigners} leftLabel="Insular" rightLabel="Welcoming" />
            <SpectrumBar value={sig.culture.innovation} leftLabel="Tradition-bound" rightLabel="Embraces new ideas" />
            <SpectrumBar value={sig.culture.communication_directness} leftLabel="Indirect" rightLabel="Direct" />
            <SpectrumBar value={sig.culture.acceptance_of_corruption} leftLabel="Rejects corruption" rightLabel="Tolerated" />
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
