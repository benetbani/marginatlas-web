/**
 * /dev/distribution-states - Storybook spike for the Sanity §4
 * DistributionVisual redesign.
 *
 * Renders the chart in five states across four widths (320, 640, 1024,
 * 1440 px) so the founder can verify zero axis-label collisions at any
 * viewport. Gated by `?dev=1` so it cannot be hit accidentally from
 * production search.
 *
 * Reference: docs/strategy/2026-05-25-MASTER-SANITY-FIX-PROMPT.md §4
 */
import { DistributionVisual } from "@/components/DistributionVisual";

export const dynamic = "force-static";

type Search = { dev?: string };

const WIDTHS = [320, 640, 1024, 1440];

const STATES: Array<{
  label: string;
  caption: string;
  p10: number | null;
  p50: number | null;
  p90: number | null;
}> = [
  {
    label: "Normal wide spread",
    caption: "p10 $100K, p50 $500K, p90 $2M (typical SMB shape).",
    p10: 100_000,
    p50: 500_000,
    p90: 2_000_000,
  },
  {
    label: "Narrow spread (cleaning-services bug case)",
    caption:
      "p10 $37.5M, p50 $41.2M, p90 $46.9M. Three labels would stack on top of each other without collision avoidance.",
    p10: 37_500_000,
    p50: 41_200_000,
    p90: 46_900_000,
  },
  {
    label: "Missing p25/p75 (only p10/p50/p90)",
    caption:
      "Component never used p25/p75. Verifies it renders with just the three percentiles it does consume.",
    p10: 250_000,
    p50: 1_200_000,
    p90: 8_000_000,
  },
  {
    label: "Degenerate all-zero",
    caption:
      "p10 = p50 = p90 = 0. The component must render without NaN, $undefined, or division-by-zero artifacts.",
    p10: 0,
    p50: 0,
    p90: 0,
  },
  {
    label: "One missing entirely (p90 = null)",
    caption:
      "When p90 is null the component returns null. Verifies graceful no-render path.",
    p10: 50_000,
    p50: 200_000,
    p90: null,
  },
];

export default async function DistributionStatesPage({
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
    <div className="max-w-[1600px] mx-auto py-12 px-4 space-y-16">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          DistributionVisual states
        </h1>
        <p className="mt-2 text-ink-700 max-w-2xl">
          Sanity §4 verification page. Each state renders at four widths
          (320, 640, 1024, 1440 px). Verify zero label collisions at any
          width, atlas-only palette (no amber, no aquamarine), and
          graceful handling of missing data.
        </p>
      </header>

      {STATES.map((state) => (
        <section key={state.label} className="space-y-6">
          <div className="border-b border-ink-200 pb-3">
            <h2 className="font-display text-2xl font-semibold text-ink-900">
              {state.label}
            </h2>
            <p className="mt-1 text-sm text-ink-700">{state.caption}</p>
            <p className="mt-1 text-xs text-ink-500 tabular-nums">
              p10: {state.p10 === null ? "null" : `$${state.p10.toLocaleString()}`} ·
              p50: {state.p50 === null ? "null" : `$${state.p50.toLocaleString()}`} ·
              p90: {state.p90 === null ? "null" : `$${state.p90.toLocaleString()}`}
            </p>
          </div>

          <div className="space-y-8">
            {WIDTHS.map((w) => (
              <div key={w}>
                <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold mb-2">
                  {w}px wide
                </div>
                <div
                  className="border border-dashed border-ink-200 bg-white overflow-hidden"
                  style={{ width: `${w}px`, maxWidth: "100%" }}
                >
                  <DistributionVisual
                    p10={state.p10}
                    p50={state.p50}
                    p90={state.p90}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="pt-8 border-t border-ink-200 text-sm text-ink-700">
        Founder review checklist: (1) no label collisions at any width,
        (2) band fill uses atlas-700 at 70% opacity, (3) typical marker
        uses atlas-800, (4) no amber/aquamarine/teal, (5) degenerate
        zero state renders without $undefined or NaN, (6) p90=null
        state renders nothing (graceful no-data path).
      </footer>
    </div>
  );
}
