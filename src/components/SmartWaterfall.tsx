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
import type { CostStack } from "@/lib/types/deepening";
import { getCityRentMultiplier } from "@/lib/qa/city_rent_multipliers";

type Props = {
  iso2: string;
  industryId: string;
  sizeBand?: "small" | "medium" | "large";
  grossRevenue: number;
  cityTier?: 1 | 2 | 3;
  // Plan v32 Sprint G — when a cell has a populated cost_stack (from
  // Phase 1 deepening), the waterfall overrides the heuristic engine's
  // line values with the sourced numbers. The engine still computes the
  // tax + net-profit math from those overrides.
  costStackOverride?: CostStack | null;
  // Cell's geo_id, used to apply city-level rent multipliers (London,
  // NYC, Tokyo etc. pay materially more rent than the country average).
  geoId?: string | null;
};

/** Map the 8-line CostStack onto the 11-line waterfall engine lines.
 *  payroll_total is split 80/20 between direct_labor and
 *  employer_social (employer-side contributions average ~20% of wages
 *  across the pilot countries — closer to 14% in the UK, ~28% in
 *  France, ~15% in the US once FICA + state UI + unemployment are
 *  rolled in). Country-specific split deferred to Phase 2. */
function overrideLinesFromCostStack(
  baseLines: ReturnType<typeof estimateCostStructure>["lines"],
  stack: CostStack,
  grossRevenue: number,
  cityRentMult: number = 1,
): ReturnType<typeof estimateCostStructure>["lines"] {
  const splitWages = 0.8;
  const splitEmployerSocial = 0.2;

  function withValue(
    base: ReturnType<typeof estimateCostStructure>["lines"][keyof ReturnType<typeof estimateCostStructure>["lines"]],
    usd: number | undefined,
  ): ReturnType<typeof estimateCostStructure>["lines"][keyof ReturnType<typeof estimateCostStructure>["lines"]] {
    if (usd == null || !isFinite(usd)) return base;
    return {
      ...base,
      usd,
      share_of_revenue: grossRevenue > 0 ? usd / grossRevenue : 0,
      confidence: stack.grade === "A" ? "A" : stack.grade === "B" ? "B" : "C",
      provenance: `From this cell's sourced cost stack (grade ${stack.grade ?? "C"}, refreshed ${stack.refreshed_at ?? "unknown date"}).`,
    };
  }

  const cogs = withValue(baseLines.cogs, stack.cost_of_goods_sold);
  const direct_labor = withValue(
    baseLines.direct_labor,
    stack.payroll_total != null ? stack.payroll_total * splitWages : undefined,
  );
  const employer_social = withValue(
    baseLines.employer_social,
    stack.payroll_total != null ? stack.payroll_total * splitEmployerSocial : undefined,
  );
  // Scale rent by the city-level multiplier (London 2.2x, NYC 2.5x, etc.).
  // The cost_stack stored on the cell is country-level by default; we
  // boost it at render time when the cell is a known expensive city.
  const rent = withValue(
    baseLines.rent,
    stack.rent_occupancy != null ? stack.rent_occupancy * cityRentMult : undefined,
  );
  const energy = withValue(baseLines.energy, stack.utilities);
  const marketing = withValue(baseLines.marketing, stack.marketing_acquisition);
  const insurance = withValue(baseLines.insurance, stack.insurance_professional);
  // equipment_maintenance + regulatory_licensing fold into other_overhead;
  // software_tech keeps its engine estimate.
  const otherCombined =
    (stack.equipment_maintenance ?? 0) + (stack.regulatory_licensing ?? 0);
  const other_overhead = withValue(
    baseLines.other_overhead,
    otherCombined > 0 ? otherCombined : undefined,
  );

  // Recompute subtotals
  const gross_revenue = baseLines.gross_revenue;
  const gross_profit_usd = gross_revenue.usd - cogs.usd;
  const operating_profit_usd =
    gross_profit_usd -
    direct_labor.usd -
    employer_social.usd -
    rent.usd -
    energy.usd -
    marketing.usd -
    baseLines.software_tech.usd -
    insurance.usd -
    other_overhead.usd;
  const corporate_tax_usd = baseLines.corporate_tax.usd > 0
    ? operating_profit_usd * baseLines.corporate_tax.share_of_revenue / (baseLines.operating_profit.share_of_revenue || 1)
    : 0;
  const net_profit_usd = operating_profit_usd - corporate_tax_usd;

  return {
    ...baseLines,
    cogs,
    direct_labor,
    employer_social,
    rent,
    energy,
    marketing,
    insurance,
    other_overhead,
    gross_profit: {
      ...baseLines.gross_profit,
      usd: gross_profit_usd,
      share_of_revenue: grossRevenue > 0 ? gross_profit_usd / grossRevenue : 0,
    },
    operating_profit: {
      ...baseLines.operating_profit,
      usd: operating_profit_usd,
      share_of_revenue: grossRevenue > 0 ? operating_profit_usd / grossRevenue : 0,
    },
    corporate_tax: {
      ...baseLines.corporate_tax,
      usd: corporate_tax_usd,
      share_of_revenue: grossRevenue > 0 ? corporate_tax_usd / grossRevenue : 0,
    },
    net_profit: {
      ...baseLines.net_profit,
      usd: net_profit_usd,
      share_of_revenue: grossRevenue > 0 ? net_profit_usd / grossRevenue : 0,
    },
  };
}

const LINE_ORDER: Array<{ key: keyof ReturnType<typeof estimateCostStructure>["lines"]; label: string; isSubtotal?: boolean; sign: "+" | "-" | "=" }> = [
  { key: "gross_revenue", label: "Total revenue", sign: "+" },
  { key: "cogs", label: "Cost of goods", sign: "-" },
  { key: "gross_profit", label: "After cost of goods", isSubtotal: true, sign: "=" },
  { key: "direct_labor", label: "Pay for the team", sign: "-" },
  { key: "employer_social", label: "Employer taxes on pay", sign: "-" },
  { key: "rent", label: "Rent", sign: "-" },
  { key: "energy", label: "Energy and utilities", sign: "-" },
  { key: "marketing", label: "Marketing", sign: "-" },
  { key: "software_tech", label: "Software and tools", sign: "-" },
  { key: "insurance", label: "Insurance", sign: "-" },
  { key: "other_overhead", label: "Other costs", sign: "-" },
  { key: "operating_profit", label: "Profit before tax", isSubtotal: true, sign: "=" },
  { key: "corporate_tax", label: "Tax on profit", sign: "-" },
  { key: "net_profit", label: "Profit kept", isSubtotal: true, sign: "=" },
];

const CONFIDENCE_COLOR: Record<"A" | "B" | "C" | "D", string> = {
  A: "bg-emerald-500",
  B: "bg-sky-500",
  C: "bg-amber-500",
  D: "bg-stone-400",
};

export function SmartWaterfall({ iso2, industryId, sizeBand = "medium", grossRevenue, cityTier = 2, costStackOverride, geoId }: Props) {
  if (!grossRevenue || grossRevenue <= 0) return null;

  const cityRentMult = getCityRentMultiplier(geoId);

  const baseResult = estimateCostStructure({
    iso2,
    industryId,
    sizeBand,
    grossRevenue,
    cityTier,
  });

  // Plan v32 Sprint G — if the cell ships with a real cost_stack,
  // swap the sourced lines into the engine's structure. The engine
  // still owns the tax math; we just override the cost lines.
  // City rent multiplier additionally boosts the rent line for
  // known expensive metros (London, NYC, Tokyo, etc.).
  const usedOverride = !!costStackOverride;
  const result = usedOverride
    ? { ...baseResult, lines: overrideLinesFromCostStack(baseResult.lines, costStackOverride!, grossRevenue, cityRentMult) }
    : baseResult;

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
