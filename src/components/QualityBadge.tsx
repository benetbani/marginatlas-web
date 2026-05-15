import { Tooltip } from "./Tooltip";

type Props = {
  qualityScore: number | null | undefined;
  coverageTier: string | null | undefined;
  coverageSource: string | null | undefined;
};

/**
 * QualityBadge — converts technical (coverage_tier, quality_score) into a
 * star rating + GENERIC source descriptor.
 *
 * Privacy goal: never reveal the specific government dataset or table code.
 * Only describe the kind of source ("national business census", "European
 * business statistics"). Competitors with LLMs cannot easily reverse-engineer
 * which agency or table.
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
  } else if (tier === "X") {
    stars = 2;
    label = "Estimated";
  } else {
    stars = 2;
    label = "Estimated";
  }

  // GENERIC source description (no specific agency, no dataset code)
  const genericSource = (() => {
    const s = (coverageSource || "").toLowerCase();
    // US sources
    if (s.includes("susb") || s.includes("census") || s.includes("cbp") || s.includes("zbp")) {
      return "National business statistics";
    }
    // European sources
    if (s.includes("eurostat") || s.includes("destatis") || s.includes("insee") ||
        s.includes("sirene") || s.includes("ine") || s.includes("statbel") ||
        s.includes("istat") || s.includes("cbs") || s.includes("ons")) {
      return "European business statistics";
    }
    // Other national stats agencies
    if (s.includes("statcan")) return "National business statistics";
    if (s.includes("abs")) return "National business statistics";
    if (s.includes("e-stat") || s.includes("estat")) return "National business census";
    if (s.includes("singstat")) return "National business statistics";
    if (s.includes("ssb")) return "National business statistics";
    if (s.includes("gus")) return "National business statistics";
    if (s.includes("ibge") || s.includes("sidra")) return "National business statistics";
    // Cross-country macro
    if (s.includes("oecd")) return "Cross-country economic indicators";
    if (s.includes("world bank") || s.includes("worldbank")) return "International economic indicators";
    // Extrapolation
    if (s.includes("extrapolated") || s.includes("regression") || s.includes("estimated from regional")) {
      return "Estimated from regional patterns";
    }
    // Shape-transfer
    if (s.includes("shape_transfer") || s.includes("transferred")) {
      return "Modeled distribution";
    }
    // Fallback
    return "Compiled government data";
  })();

  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-2 flex items-center">
        Data quality
        <Tooltip text="Higher rating means more direct measurement; lower rating means estimated from related data." />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-2xl text-atlas-500">
          {"★".repeat(stars)}
          <span className="text-ink-300">{"★".repeat(5 - stars)}</span>
        </div>
        <div className="text-sm font-medium text-ink-900">{label}</div>
      </div>
      <div className="mt-3 text-xs text-ink-700/70">
        {genericSource}
      </div>
    </div>
  );
}
