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

      {/* Plan v30 Phase 5.1 — thinner, centered, values aligned to band positions */}
      <div className="mt-8 md:mt-10 mx-auto max-w-4xl">
        {/* Value labels above the band, aligned to their positions */}
        <div className="relative h-12 mb-2">
          <div className="absolute left-0 top-0 text-left">
            <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold">
              Bottom 10%
            </div>
            <div className="font-display text-lg md:text-2xl text-ink-900 tabular-nums leading-none mt-1">
              <Money usd={lo} />
            </div>
          </div>
          <div
            className="absolute top-0"
            style={{ left: `${midPos}%`, transform: "translateX(-50%)" }}
          >
            <div className="text-[10px] uppercase tracking-wider text-atlas-700 font-bold text-center">
              Typical
            </div>
            <div className="font-display text-lg md:text-2xl text-ink-900 tabular-nums leading-none mt-1 text-center">
              <Money usd={mid} />
            </div>
          </div>
          <div className="absolute right-0 top-0 text-right">
            <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold">
              Top 10%
            </div>
            <div className="font-display text-lg md:text-2xl text-ink-900 tabular-nums leading-none mt-1">
              <Money usd={hi} />
            </div>
          </div>
        </div>

        {/* The band — slim, 24px tall, gradient amber center */}
        <div className="relative h-6 rounded-full border border-parchment bg-parchment">
          <div
            className="absolute inset-y-0 rounded-full"
            style={{
              left: `${bandLo}%`,
              right: `${bandHi}%`,
              background: "linear-gradient(90deg, #EFE0BD 0%, rgba(212,119,6,0.7) 50%, #EFE0BD 100%)",
            }}
            title={`The middle 80% earn between $${lo.toLocaleString()} and $${hi.toLocaleString()}`}
            aria-hidden="true"
          />
          {/* Typical marker — thin vertical line with halo */}
          <div
            className="absolute"
            style={{
              left: `${midPos}%`,
              top: -4,
              bottom: -4,
              width: 3,
              background: "#A55C00",
              transform: "translateX(-50%)",
              borderRadius: 2,
              boxShadow: "0 0 0 2px #FEFBF6",
            }}
            title={`Typical: $${mid.toLocaleString()}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
