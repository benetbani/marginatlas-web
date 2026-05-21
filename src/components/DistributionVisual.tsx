/**
 * Plan v23 Part 2 — distribution as visual, not a tile grid.
 *
 * Replaces the 3-column tile grid (Bottom 10% / Typical / Top 10%) with
 * a single horizontal band chart. Each band is sized proportionally to
 * its share of the distribution; on hover/tap the exact figure surfaces.
 *
 * Server component. Pure SVG. No client cost.
 */
import { Money } from "@/components/Money";

type Props = {
  p10: number | null;
  p50: number | null;
  p90: number | null;
  /** Optional ceiling for the chart's x-axis. Defaults to p90 × 1.1. */
  maxValue?: number | null;
};

export function DistributionVisual({ p10, p50, p90, maxValue }: Props) {
  // Render only the bands we have data for.
  const have = [p10, p50, p90].every((v) => v != null && isFinite(v));
  if (!have) return null;
  const lo = p10!;
  const mid = p50!;
  const hi = p90!;
  const ceil = maxValue ?? hi * 1.1;

  // Three bands: 0→p10 (Bottom 10%), p10→p90 (the middle 80%), p90→ceil (Top 10%).
  const bandLo = (lo / ceil) * 100;
  const bandMid = ((hi - lo) / ceil) * 100;
  const bandHi = ((ceil - hi) / ceil) * 100;
  // Position the "Typical" anchor inside the middle band
  const midPos = (mid / ceil) * 100;

  return (
    <section id="distribution" className="py-12 md:py-16">
      <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 mb-3">
        The spread
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-ink-900 leading-[1.08] max-w-3xl">
        Where every business lands
      </h2>
      <p className="mt-3 text-base md:text-lg text-ink-800 max-w-2xl leading-relaxed">
        Most businesses cluster in the middle. The tails are real, and
        much wider than people assume.
      </p>

      <div className="mt-8 md:mt-10 max-w-4xl">
        {/* The bands */}
        <div className="relative h-24 md:h-28 rounded-2xl overflow-hidden border border-parchment flex">
          <div
            className="bg-cream-200 flex items-center justify-center text-[10px] md:text-xs uppercase tracking-wider text-cocoa-700/70 font-semibold"
            style={{ width: `${bandLo}%` }}
            title={`Bottom 10% earn around $${lo.toLocaleString()}`}
          >
            <span className="hidden md:block">Bottom 10%</span>
          </div>
          <div
            className="bg-atlas-100 flex items-center justify-center text-xs md:text-sm text-atlas-900 font-medium relative"
            style={{ width: `${bandMid}%` }}
            title={`The middle 80% earn between $${lo.toLocaleString()} and $${hi.toLocaleString()}`}
          >
            <span>The middle 80%</span>
          </div>
          <div
            className="bg-atlas-300 flex items-center justify-center text-[10px] md:text-xs uppercase tracking-wider text-atlas-900 font-semibold"
            style={{ width: `${bandHi}%` }}
            title={`Top 10% earn above $${hi.toLocaleString()}`}
          >
            <span className="hidden md:block">Top 10%</span>
          </div>
          {/* Typical marker */}
          <div
            className="absolute top-0 bottom-0 border-l-2 border-atlas-700"
            style={{ left: `${midPos}%` }}
            title={`Typical: $${mid.toLocaleString()}`}
          >
            <div className="absolute -top-6 left-0 -translate-x-1/2 text-[10px] uppercase tracking-wider text-atlas-700 font-bold whitespace-nowrap">
              Typical
            </div>
          </div>
        </div>

        {/* Anchor labels under the bands */}
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm md:text-base">
          <div>
            <div className="text-xs uppercase tracking-wider text-cocoa-700/60 font-semibold">
              Bottom 10% earn around
            </div>
            <div className="font-display text-2xl md:text-3xl text-ink-900 tabular-nums mt-1">
              <Money usd={lo} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-atlas-700 font-bold">
              Typical
            </div>
            <div className="font-display text-2xl md:text-3xl text-ink-900 tabular-nums mt-1">
              <Money usd={mid} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-cocoa-700/60 font-semibold">
              Top 10% earn above
            </div>
            <div className="font-display text-2xl md:text-3xl text-ink-900 tabular-nums mt-1">
              <Money usd={hi} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
