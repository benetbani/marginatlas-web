/**
 * CountryStatsStrip — "Operating conditions" strip.
 *
 * Consolidation (2026-06-07): the tax + registration tiles (headline VAT/GST,
 * typical small-business tax, time to launch) were removed from this strip.
 * Those figures now live once, in the CountryTaxReality panel, which carries
 * the richest worked-figure treatment. The strip keeps only its non-tax
 * operating signal: inflation over the last 12 months. It self-omits when
 * that signal is absent, so it never renders an empty band.
 *
 * useless-tile-ok: JSDoc names the removed tiles, none are rendered
 *
 * Server component, no client JS.
 */

import { getCountryEconomicsSnapshot, fmtPct } from "@/lib/economics/country_metrics";
import { getGuidingWord, type Metric } from "@/lib/cities/guiding_word";
import { StatCard } from "@/components/ui/stat-card";

type Props = {
  iso2: string;
};

export function CountryStatsStrip({ iso2 }: Props) {
  const key = iso2.toUpperCase();
  const snap = getCountryEconomicsSnapshot(key);

  type Tile = {
    label: string;
    value: string;
    sub?: string;
    metric: Metric | null;
    rawForGuidingWord: number | null;
  };

  const tiles: Tile[] = [
    {
      label: "Inflation, 12 mo",
      value: fmtPct(snap.inflationPctYoy, 1),
      sub: "Year over year",
      metric: "inflation_pct_yoy",
      rawForGuidingWord: snap.inflationPctYoy,
    },
  ];

  // Self-omit when the only signal here has no value, so the band never
  // renders empty after the tax/registration tiles moved out.
  const hasSignal = tiles.some((t) => t.rawForGuidingWord != null);
  if (!hasSignal) return null;

  return (
    <section className="py-6">
      <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-3">
        Operating conditions
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiles.map((t) => {
          const guiding =
            t.metric != null && t.rawForGuidingWord != null
              ? getGuidingWord(t.metric, t.rawForGuidingWord)
              : null;
          // Prefer guiding word when present; fall back to t.sub.
          const sub = guiding?.word || t.sub;
          const subColor = guiding?.color;
          return (
            <StatCard
              key={t.label}
              label={t.label}
              value={t.value}
              sub={sub}
              subColor={subColor}
              variant="soft"
              size="lg"
            />
          );
        })}
      </div>
    </section>
  );
}
