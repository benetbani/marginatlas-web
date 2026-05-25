/**
 * /dev/lock-states — Storybook spike for the v34 Phase A lock primitives.
 *
 * Renders every primitive in every tier state so the founder + I can
 * eyeball them in a single view. Gated by `?dev=1` query param so it
 * cannot be hit accidentally from prod search.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 6 Phase A.
 */
import {
  LockPill,
  BlurredOverlay,
  TruncatedTease,
  RedactedNumber,
  GhostBar,
} from "@/components/monetization";

export const dynamic = "force-static";

type Search = { dev?: string };

export default async function LockStatesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  if (sp?.dev !== "1") {
    return (
      <div className="max-w-prose mx-auto py-16 text-ink-700">
        Not found. (Append <code>?dev=1</code> to view this page.)
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          v34 lock-state primitives
        </h1>
        <p className="mt-2 text-ink-700">
          Reference page for the five Phase A primitives. Click any
          primitive to dispatch <code>atlas:open-paywall</code>; the
          listener mounts in Phase B.
        </p>
      </header>

      {/* LockPill */}
      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">
          LockPill
        </h2>
        <div className="flex gap-3 items-center">
          <LockPill
            tier="basic"
            entry="cell_distribution_p25_p75"
            ariaLabel="Lower-mid quartile, click to unlock with Basic"
          />
          <LockPill
            tier="premium"
            entry="export_csv"
            ariaLabel="Export to CSV, click to unlock with Premium"
          />
        </div>
      </section>

      {/* BlurredOverlay */}
      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">
          BlurredOverlay
        </h2>
        <BlurredOverlay
          tier="basic"
          entry="cell_distribution_p25_p75"
          cta="See the full distribution with Basic"
          headline="The middle quartiles"
        >
          <div className="h-40 bg-cream-100 rounded-lg p-4">
            <div className="text-2xl font-display text-ink-900">
              $1,250,000
            </div>
            <div className="mt-2 text-ink-700">
              Median annual revenue for the cell. (Placeholder content
              behind the blur.)
            </div>
          </div>
        </BlurredOverlay>
      </section>

      {/* TruncatedTease */}
      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">
          TruncatedTease
        </h2>
        <TruncatedTease
          count={87}
          unit="cities"
          tier="basic"
          entry="industry_truncated_regions"
        />
      </section>

      {/* RedactedNumber */}
      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">
          RedactedNumber
        </h2>
        <p className="text-ink-800">
          The lower-mid quartile sits at{" "}
          <RedactedNumber
            tier="basic"
            entry="cell_distribution_p25_p75"
            ariaLabel="Lower-mid quartile revenue, click to unlock with Basic"
          />{" "}
          and the upper-mid at{" "}
          <RedactedNumber
            tier="basic"
            entry="cell_distribution_p25_p75"
            ariaLabel="Upper-mid quartile revenue, click to unlock with Basic"
          />
          .
        </p>
      </section>

      {/* GhostBar (inside an SVG) */}
      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-3">
          GhostBar (SVG primitive)
        </h2>
        <svg
          width={480}
          height={140}
          viewBox="0 0 480 140"
          className="border border-ink-200 rounded bg-white"
        >
          {/* Faux visible bars (p10, p50, p90) */}
          <rect x={20} y={80} width={60} height={40} fill="#16AEB5" />
          <rect x={200} y={40} width={60} height={80} fill="#16AEB5" />
          <rect x={400} y={70} width={60} height={50} fill="#16AEB5" />
          {/* Locked p25 + p75 */}
          <GhostBar
            x={110}
            y={60}
            width={60}
            height={60}
            tier="basic"
            entry="cell_distribution_p25_p75"
            ariaLabel="Lower-mid quartile, click to unlock with Basic"
          />
          <GhostBar
            x={290}
            y={50}
            width={60}
            height={70}
            tier="basic"
            entry="cell_distribution_p25_p75"
            ariaLabel="Upper-mid quartile, click to unlock with Basic"
          />
        </svg>
      </section>

      <footer className="pt-8 border-t border-ink-200 text-sm text-ink-700">
        See <code>docs/strategy/2026-05-25-monetization-mega-plan-v34.md</code>
        Part 2 for geometry + colour rules.
      </footer>
    </div>
  );
}
