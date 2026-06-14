/**
 * CountryCharacter - the country page's "character" section (content-map #6).
 *
 * Replaces the old CountrySignaturePanel, which reused the CITY signature panel
 * (a 12-column 7/5 grid built for city data) on a country and read as a botched
 * "zombie". This is a dedicated, country-scale layout: a clean People row, then
 * a balanced two-column read of culture (spectrums) and government (scores),
 * with the signature sectors as chips. Same data source as before
 * (country_signature_v1.json); only the presentation is new.
 *
 * Returns null when we hold no character entry for the country (the page wraps
 * it with the always-present SectionEmpty placeholder).
 *
 * Tokens only; no raw color (the spectrum gradient pulls from design-tokens),
 * no em-dashes, no source-agency names.
 */
import * as React from "react";
import { colors } from "@/lib/design-tokens";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { SectionEmpty } from "@/components/kit";
import {
  getCountrySignature,
  type CountrySignature,
  type CountryCulture as Culture,
  type CountryGovernment as Government,
} from "@/lib/countries/country_signature";

const CULTURE_ROWS: Array<{ key: keyof Culture; left: string; right: string }> = [
  { key: "punctuality", left: "Loose on time", right: "Strict on time" },
  { key: "openness_to_foreigners", left: "Insular", right: "Welcoming" },
  { key: "innovation", left: "Tradition-bound", right: "Embraces new ideas" },
  { key: "communication_directness", left: "Indirect", right: "Direct" },
  { key: "corruption_rejection", left: "Corruption tolerated", right: "Rejects corruption" },
  { key: "ambition_chest_beating", left: "Humble", right: "Self-promoting" },
];
const GOV_ROWS: Array<{ key: keyof Government; label: string }> = [
  { key: "tax_predictability", label: "Tax predictability" },
  { key: "low_bribery", label: "Low bribery" },
  { key: "task_efficiency", label: "Task efficiency" },
  { key: "time_efficiency", label: "Time efficiency" },
  { key: "judicial_impartiality", label: "Judicial impartiality" },
  { key: "innovation_capacity", label: "Innovation and R&D capacity" },
];

function isNum(n: number | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function SpectrumRow({ value, left, right }: { value: number; left: string; right: string }) {
  const v = Math.max(1, Math.min(10, value));
  const positionPct = ((v - 1) / 9) * 90 + 5;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.08em]">
        <span className="text-atlas-700">{left}</span>
        <span className="text-ink-700">{right}</span>
      </div>
      <div
        className="relative h-3 overflow-visible rounded-full"
        style={{
          background: `linear-gradient(90deg, ${colors.atlas[600]} 0%, ${colors.atlas[200]} 30%, ${colors.cream[300]} 50%, ${colors.ink[300]} 70%, ${colors.graphite} 100%)`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute top-1/2 h-6 w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-ink-900 shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
          style={{ left: `${positionPct}%` }}
        />
      </div>
    </div>
  );
}

function ScoreRow({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(10, value));
  const tone = v >= 7 ? "bg-moss-600" : v >= 4 ? "bg-amber-500" : "bg-clay-500";
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.08em] text-cocoa-700/80">
        <span>{label}</span>
        <span className="font-semibold tabular-nums text-ink-900">{v}/10</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-cream-200">
        <div className={"h-full " + tone} style={{ width: `${(v / 10) * 100}%` }} />
      </div>
    </div>
  );
}

export function CountryCharacter({
  iso2,
  countryName,
  id = "character",
}: {
  iso2: string;
  countryName: string;
  id?: string;
}) {
  const sig: CountrySignature = getCountrySignature(iso2) ?? {};
  const hasPeople = isNum(sig.foreign_born_pct) || isNum(sig.foreign_owned_pct);
  const hasCulture = !!sig.culture;
  const hasGov = !!sig.government;
  const sectors = sig.signature_sectors ?? [];
  // Always present: when we hold no character read for this country, render the
  // calm placeholder rather than dropping the section (founder rule 2026-06-13).
  if (!hasPeople && !hasCulture && !hasGov && sectors.length === 0) {
    return (
      <SectionEmpty
        id={id}
        eyebrow="Character"
        heading={`What makes ${countryName} distinct`}
        place={countryName}
      />
    );
  }

  return (
    <section
      id={id}
      aria-label={`The character of ${countryName}`}
      className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
    >
      {/* Header: the title leads on the left, the two people-percentage stats
          sit compact at the top-right (founder 2026-06-14), so the section never
          opens with a half-empty full-width row of dead space. */}
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
        <div className="min-w-0">
          <SectionEyebrow className="mb-1">Character</SectionEyebrow>
          <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl">
            What makes {countryName} distinct
          </h2>
        </div>
        {hasPeople ? (
          <div className="flex flex-wrap gap-x-7 gap-y-2 sm:justify-end">
            {isNum(sig.foreign_born_pct) ? (
              <div className="text-left sm:text-right">
                <div className="font-display text-2xl font-semibold tabular-nums leading-none text-ink-900 md:text-3xl">
                  {sig.foreign_born_pct}%
                </div>
                <div className="mt-1 text-xs leading-snug text-cocoa-700">born outside the country</div>
              </div>
            ) : null}
            {isNum(sig.foreign_owned_pct) ? (
              <div className="text-left sm:text-right">
                <div className="font-display text-2xl font-semibold tabular-nums leading-none text-ink-900 md:text-3xl">
                  {sig.foreign_owned_pct}%
                </div>
                <div className="mt-1 text-xs leading-snug text-cocoa-700">of local firms foreign-owned</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Signature sectors: a tight chip row, not a half-width grid column. */}
      {sectors.length > 0 ? (
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
            What stands out
          </div>
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <span
                key={s.label}
                title={s.blurb}
                className="inline-flex items-center rounded-full border border-parchment bg-cream-100 px-3 py-1 text-sm font-medium text-cocoa-700"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Culture + government, balanced two-column */}
      {(hasCulture || hasGov) ? (
        <div className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {hasCulture ? (
            <div>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                Culture, as locals feel it
              </div>
              <div className="flex flex-col gap-5">
                {CULTURE_ROWS.map((r) =>
                  isNum(sig.culture![r.key]) ? (
                    <SpectrumRow key={r.key} value={sig.culture![r.key]} left={r.left} right={r.right} />
                  ) : null,
                )}
              </div>
            </div>
          ) : null}
          {hasGov ? (
            <div>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                Government, from a business desk
              </div>
              <div className="flex flex-col gap-5">
                {GOV_ROWS.map((r) =>
                  isNum(sig.government![r.key]) ? (
                    <ScoreRow key={r.key} value={sig.government![r.key]} label={r.label} />
                  ) : null,
                )}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-cocoa-500">
                Higher is better in all six. Modeled and directional.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
