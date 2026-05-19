/**
 * Plan v14 Phase C.3 — generates up to 5 FAQ entries per cell page from
 * cell data. Each FAQ question matches one of the canonical search-phrase
 * variants in the phrase universe (scripts/seo/build_phrase_universe.py),
 * with a data-backed answer drawn from the cell's revenue + margin numbers.
 *
 * Source-agency hygiene (R-002): NEVER mention PwC, BizMiner, KPMG,
 * Eurostat, etc. in the answer text. The user-visible copy must be agency-
 * free; methodology pages elsewhere handle attribution.
 */
import { clampMargin } from "@/lib/finance/margin_floor";

type Cell = {
  geo_name: string | null;
  industry_name?: string | null;
  industry_id?: string | null;
  revenue_per_firm?: number | null;
  rev_p10?: number | null;
  rev_p50?: number | null;
  rev_p90?: number | null;
};

type Margins = {
  gross_margin?: number | null;
  operating_margin?: number | null;
  net_margin?: number | null;
};

function fmt(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function generateFAQs(
  cell: Cell,
  margins: Margins
): Array<{ question: string; answer: string }> {
  const ind = (cell.industry_name || "").toLowerCase();
  const indSingular = ind.endsWith("s") ? ind.slice(0, -1) : ind;
  const article = /^[aeiou]/i.test(indSingular) ? "an" : "a";
  const loc = cell.geo_name || "";

  const faqs: Array<{ question: string; answer: string }> = [];

  // No geo or no industry — no FAQs. Bail out so we don't emit malformed
  // sentences ("How much does a make in ?").
  if (!loc || !ind) return faqs;

  if (cell.revenue_per_firm) {
    faqs.push({
      question: `How much does ${article} ${indSingular} make in ${loc}?`,
      answer: `The typical ${indSingular} in ${loc} generates approximately ${fmt(cell.revenue_per_firm)} in annual revenue per location. The bottom 20% earn less than ${fmt(cell.rev_p10)} while the top 10% exceed ${fmt(cell.rev_p90)}.`,
    });
  }

  if (margins.net_margin != null) {
    const netPct = (clampMargin(margins.net_margin, "net") * 100).toFixed(1);
    faqs.push({
      question: `What's the typical profit margin for ${ind} in ${loc}?`,
      answer: `${ind.charAt(0).toUpperCase() + ind.slice(1)} in ${loc} typically operate at around ${netPct}% net margin after taxes and interest.`,
    });
  }

  if (cell.rev_p90 && cell.rev_p10) {
    faqs.push({
      question: `Is owning ${article} ${indSingular} profitable in ${loc}?`,
      answer: `Yes, generally. Top-performing ${ind} in ${loc} earn over ${fmt(cell.rev_p90)} annually, several times more than the bottom quintile. Profitability depends heavily on location quality, operator experience, and cost discipline.`,
    });
  }

  if (cell.revenue_per_firm) {
    faqs.push({
      question: `What's the average revenue for ${ind} in ${loc}?`,
      answer: `Average revenue per location for ${ind} in ${loc} is approximately ${fmt(cell.revenue_per_firm)}, based on the most recent business benchmark data.`,
    });
  }

  if (margins.gross_margin != null && margins.operating_margin != null) {
    const grossPct = (clampMargin(margins.gross_margin, "gross") * 100).toFixed(0);
    const opPct = (clampMargin(margins.operating_margin, "operating") * 100).toFixed(0);
    faqs.push({
      question: `What are the typical cost structures for ${ind} in ${loc}?`,
      answer: `${ind.charAt(0).toUpperCase() + ind.slice(1)} in ${loc} typically run a ${grossPct}% gross margin and around ${opPct}% operating margin before taxes. Cost of goods, labor, and rent are the largest line items.`,
    });
  }

  return faqs;
}
