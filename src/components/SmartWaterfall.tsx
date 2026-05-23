/**
 * Plan v29 Phase 7 — Smart Waterfall display.
 *
 * Renders the 13-line cost structure from estimateCostStructure() with
 * per-line tooltips showing provenance and confidence. Includes a
 * "what changes here" sidebar surfacing the 2-3 most divergent lines
 * from the global industry baseline.
 *
 * Server component. Tooltips are native title attributes + a small CSS
 * hover layer — zero client JS.
 *
 * Universal terms only (R-002).
 */
import { estimateCostStructure } from "@/lib/cost_engine/engine";
import { fmtMoney } from "@/lib/format/money";

type Props = {
  iso2: string;
  industryId: string;
  sizeBand?: "small" | "medium" | "large";
  grossRevenue: number;
  cityTier?: 1 | 2 | 3;
};

const LINE_ORDER: Array<{ key: keyof ReturnType<typeof estimateCostStructure>["lines"]; label: string; isSubtotal?: boolean; sign: "+" | "-" | "=" }> = [
  { key: "gross_revenue", label: "Gross revenue", sign: "+" },
  { key: "cogs", label: "Cost of goods sold", sign: "-" },
  { key: "gross_profit", label: "Gross profit", isSubtotal: true, sign: "=" },
  { key: "direct_labor", label: "Direct labor", sign: "-" },
  { key: "employer_social", label: "Employer social contributions", sign: "-" },
  { key: "rent", label: "Rent and occupancy", sign: "-" },
  { key: "energy", label: "Energy and utilities", sign: "-" },
  { key: "marketing", label: "Marketing and sales", sign: "-" },
  { key: "software_tech", label: "Software and tech", sign: "-" },
  { key: "insurance", label: "Insurance", sign: "-" },
  { key: "other_overhead", label: "Other overhead", sign: "-" },
  { key: "operating_profit", label: "Operating profit", isSubtotal: true, sign: "=" },
  { key: "corporate_tax", label: "Corporate income tax", sign: "-" },
  { key: "net_profit", label: "Net profit", isSubtotal: true, sign: "=" },
];

const CONFIDENCE_COLOR: Record<"A" | "B" | "C" | "D", string> = {
  A: "bg-emerald-500",
  B: "bg-sky-500",
  C: "bg-amber-500",
  D: "bg-stone-400",
};

export function SmartWaterfall({ iso2, industryId, sizeBand = "medium", grossRevenue, cityTier = 2 }: Props) {
  if (!grossRevenue || grossRevenue <= 0) return null;

  const result = estimateCostStructure({
    iso2,
    industryId,
    sizeBand,
    grossRevenue,
    cityTier,
  });

  return (
    <section className="py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Where every dollar goes
      </div>
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-2">
        <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
          Cost structure
        </h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${CONFIDENCE_COLOR[result.confidence_tier]}`} aria-hidden />
          <span className="text-xs text-cocoa-700/70 font-medium">
            Confidence {result.confidence_score}/100
          </span>
        </div>
      </div>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Each line is country-aware. Hover any row for the reasoning.
        Numbers are estimates; orientation, not financial advice.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-8">
        {/* Main waterfall */}
        <div className="rounded-2xl border border-parchment bg-white overflow-hidden">
          <div className="divide-y divide-parchment">
            {LINE_ORDER.map(({ key, label, isSubtotal, sign }) => {
              const line = result.lines[key];
              const isProfit = key === "gross_profit" || key === "operating_profit" || key === "net_profit";
              const isRevenue = key === "gross_revenue";
              const isCost = sign === "-";
              return (
                <div
                  key={key}
                  className={`group relative grid grid-cols-[1fr,auto,auto] items-center gap-3 px-4 md:px-5 py-3 ${isSubtotal ? "bg-cream-50 font-medium" : ""}`}
                  title={line.provenance}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${CONFIDENCE_COLOR[line.confidence]} shrink-0`} aria-hidden />
                    <span className={`text-sm md:text-base truncate ${isSubtotal ? "text-ink-900 font-semibold" : "text-ink-800"}`}>
                      {label}
                    </span>
                  </div>
                  <span className="text-xs text-cocoa-700/60 tabular-nums shrink-0">
                    {(line.share_of_revenue * 100).toFixed(1)}%
                  </span>
                  <span
                    className={`font-display text-base md:text-lg tabular-nums shrink-0 text-right min-w-[100px] ${
                      isRevenue ? "text-ink-900 font-semibold"
                      : isProfit ? "text-atlas-700 font-semibold"
                      : isCost ? "text-cocoa-700/80"
                      : "text-ink-900"
                    }`}
                  >
                    {isCost && line.usd > 0 ? "-" : ""}
                    {fmtMoney(Math.abs(line.usd))}
                  </span>
                  {/* Hover tooltip */}
                  <div className="absolute left-4 right-4 top-full z-10 hidden group-hover:block">
                    <div className="bg-ink-900 text-cream-100 text-xs leading-relaxed rounded-lg px-3 py-2 shadow-lg max-w-xl">
                      {line.provenance}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {result.margin_clamped && (
            <div className="px-4 md:px-5 py-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-900">
              Net margin was capped to the realistic ceiling for this category.
              The raw model output exceeded what this kind of business
              typically clears in the real world; the displayed value is
              the upper-band estimate.
            </div>
          )}
        </div>

        {/* What changes here sidebar */}
        <aside className="rounded-2xl border border-parchment bg-cream-50 p-5">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-3">
            What changes here
          </div>
          <p className="text-sm text-cocoa-700/80 mb-4">
            Compared to the global industry baseline:
          </p>
          {result.notable_divergences.length > 0 ? (
            <ul className="space-y-3">
              {result.notable_divergences.map((d) => (
                <li key={d.line} className="text-sm">
                  <div className="font-semibold text-ink-900 capitalize mb-0.5">
                    {d.line.replace(/_/g, " ")}{" "}
                    <span className={`text-xs font-medium ${d.vs_global_share_pp >= 0 ? "text-cocoa-700" : "text-atlas-700"}`}>
                      {d.vs_global_share_pp >= 0 ? "+" : ""}{d.vs_global_share_pp}pp
                    </span>
                  </div>
                  <div className="text-xs text-cocoa-700/70 leading-relaxed">
                    {d.reason}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-cocoa-700/70">
              All lines land within typical range for this category.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
