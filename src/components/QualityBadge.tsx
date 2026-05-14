import { Tooltip } from "./Tooltip";

type Props = {
  qualityScore: number | null | undefined;
  coverageTier: string | null | undefined;
  coverageSource: string | null | undefined;
};

/**
 * QualityBadge — converts technical (coverage_tier, quality_score) into a
 * star rating + plain-English source line.
 *
 * Hides the underlying tier letter and the 0–100 number from the user.
 */
export function QualityBadge({ qualityScore, coverageTier, coverageSource }: Props) {
  const score = qualityScore ?? 50;
  const tier = (coverageTier || "M").toUpperCase();

  // Tier letter → user-facing rating
  let stars = 3;
  let label = "Estimated";
  if (tier === "P" || score >= 90) {
    stars = 5;
    label = "Highest confidence";
  } else if (tier === "S" || score >= 80) {
    stars = 4;
    label = "High confidence";
  } else if (tier === "M" || score >= 65) {
    stars = 3;
    label = "Modeled";
  } else if (tier === "T") {
    stars = 2;
    label = "Aggregated";
  } else {
    stars = 2;
    label = "Estimated";
  }

  // Clean up the source label
  const friendlySource = (() => {
    const s = (coverageSource || "").toLowerCase();
    if (s.includes("susb") || s.includes("census")) return "U.S. Census Bureau";
    if (s.includes("eurostat")) return "Eurostat (European Commission)";
    if (s.includes("destatis")) return "Destatis (Germany)";
    if (s.includes("statcan")) return "Statistics Canada";
    if (s.includes("abs")) return "Australian Bureau of Statistics";
    if (s.includes("e-stat") || s.includes("estat")) return "e-Stat (Japan)";
    if (s.includes("sirene") || s.includes("insee")) return "INSEE (France)";
    if (s.includes("gus")) return "GUS (Poland)";
    if (s.includes("ssb")) return "SSB (Norway)";
    if (s.includes("ibge") || s.includes("sidra")) return "IBGE (Brazil)";
    if (s.includes("singstat")) return "SingStat (Singapore)";
    if (s.includes("oecd")) return "OECD";
    if (s.includes("world bank") || s.includes("worldbank")) return "World Bank";
    return coverageSource || "—";
  })();

  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-2 flex items-center">
        Data quality
        <Tooltip text="Higher rating means the numbers come from a direct survey or census; lower rating means they're estimated from related data." />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-2xl text-atlas-500">
          {"★".repeat(stars)}
          <span className="text-slate-300">{"★".repeat(5 - stars)}</span>
        </div>
        <div className="text-sm font-medium text-ink-900">{label}</div>
      </div>
      <div className="mt-3 text-xs text-ink-700/70">
        Source: {friendlySource}
      </div>
    </div>
  );
}
