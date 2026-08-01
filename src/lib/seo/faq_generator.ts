/**
 * Generates up to 5 FAQ entries per cell page from
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
  if (n == null || !isFinite(n)) return "-";
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
      answer: `${ind.charAt(0).toUpperCase() + ind.slice(1)} in ${loc} typically keep around ${netPct}% of what they take, after tax and interest.`,
    });
  }

  if (cell.rev_p90 && cell.rev_p10) {
    faqs.push({
      /* This answered "Yes, generally", and then argued it from what the TOP
         TENTH earns. That establishes nothing about the median owner, which is
         the person asking. It was also the site making an unconditional promise
         about someone's livelihood, in a machine-readable field an answer engine
         quotes verbatim and a reader never sees, so nobody could judge it.

         The honest answer to this question is the spread, and the fact that
         revenue is not what an owner keeps. That is the argument the whole site
         exists to make. */
      question: `Is owning ${article} ${indSingular} profitable in ${loc}?`,
      answer: `It varies more than one figure can carry. The strongest ${ind} in ${loc} take over ${fmt(cell.rev_p90)} a year and the weakest fifth take under ${fmt(cell.rev_p10)}, and what an owner keeps out of either depends on rent, staffing and the site itself. Revenue is not profit.`,
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
      answer: `${ind.charAt(0).toUpperCase() + ind.slice(1)} in ${loc} typically keep about ${grossPct}% after the cost of goods, and around ${opPct}% before tax. The biggest line items are materials, paying the team, and rent.`,
    });
  }

  return faqs;
}
