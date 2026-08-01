/**
 * /og/industry , dynamic OG image for a trade page (/industries/{slug}).
 *
 * Usage:
 *   <meta property="og:image" content="/og/industry?industry=restaurants" />
 *
 * WHAT IT PRINTS, AND WHY THAT FIGURE. The trade page's masthead leads on the
 * median typical revenue across the US-state cohort (industry_view.ts, the
 * `hasBand` branch). This card prints that same number, from that same
 * resolver, formatted through that same formatter. A card that leads on a
 * different number than the page it points at is worse than a card with no
 * number, so nothing here recomputes anything: the figure comes out of
 * resolveIndustryHeadlineBand, which is also what the page's mapper and
 * constants come from.
 *
 * WHEN IT PRINTS NOTHING. Two cases, both silent about the figure rather than
 * dashed:
 *   1. No band. Fewer than five US states carry a revenue for the trade, so
 *      summarizeActivityPlaces refuses to defend a p10..p90 and returns
 *      all-null. This is not rare: of ten trades probed, six had no band at all.
 *   2. No provenance. See below.
 *
 * WHY THE PAGE'S FALLBACK ANCHOR IS NOT ON THIS CARD. When no band exists the
 * page still shows an anchor: the kept share, how much of every $100 of sales
 * reaches the owner, taken from the curated table in
 * src/lib/finance/industry_margins.json. That figure has no derived provenance
 * anywhere in the codebase; the table carries a `notes` string per trade and
 * nothing that says how the ratio was arrived at. Printing it here would mean
 * authoring a confidence sentence, which is the one thing this card family
 * exists to prevent. So the card falls back to a titled card with no number
 * while the page keeps its structural anchor, which is allowed to stand on a
 * page that surrounds it with the whole cost stack.
 *
 * Node.js runtime, matching /og/cell and /og/default. See /og/cell/route.tsx
 * for the Edge bundle-size history that forced the switch; this route imports
 * the same cell layer, so the same reasoning applies to it directly.
 */
import { ImageResponse } from "next/og";
import { slugToIndustry, industryToSlug } from "@/lib/taxonomy";
import { resolveIndustryHeadlineBand } from "@/lib/industries/headline_band";
// The page's own formatter, not a local copy. The trade page renders its
// masthead anchor through formatWithSpec(n, "usd-compact"); a local formatter
// here would agree on $397K and disagree on $1.2M vs $1.23M, and the card would
// then be quietly printing a different number than the page for every trade
// whose median clears a million. numberFormat.ts has no imports of its own.
import { formatWithSpec } from "@/components/kit/numberFormat";
// The canonical tier derivation, the same one the pages, the CSV export and
// /og/cell use.
import {
  deriveCoverageTier,
  type CoverageTier,
} from "@/components/CoverageIndicator";
// What each tier MEANS, shared so this card and the export cannot drift.
import { COVERAGE_TIER_COPY } from "@/lib/coverage_tier_copy";
import {
  CARD_SIZE,
  OgFrame,
  OgBrand,
  OgTitle,
  OgFigure,
  OgFooter,
} from "../_card";

export const runtime = "nodejs";

/**
 * Tier strength, strongest first. Used only to order tiers, never to average
 * them: the four words are ordinal, and there is no such thing as a figure
 * halfway between regional and estimated.
 */
const TIER_STRENGTH: CoverageTier[] = [
  "measured",
  "regional",
  "estimated",
  "modeled",
];

/**
 * The provenance of a MEDIAN, derived from the provenance of the rows behind it.
 *
 * The figure on this card is not one cell's number, it is the median of up to
 * twenty-four states' numbers, so deriveCoverageTier cannot be applied to it
 * directly. What is true of a median is what is true of at least half its
 * inputs, so the tier returned here is the one at the median position when the
 * contributors are ordered strongest-first: at least half the states behind the
 * figure were measured to that standard or better.
 *
 * Two rules that are deliberately NOT used:
 *   - Not the strongest tier. One measured state among twenty modeled ones
 *     would let the card claim measurement it does not have.
 *   - Not the weakest. A single thin state among twenty measured ones would
 *     drag every trade to "modeled", which makes the sentence uninformative
 *     and therefore ignorable. On the real slates this is not hypothetical:
 *     restaurants resolve twelve measured states and exactly one modeled.
 *
 * Null when nothing contributed, which the caller must read as "print no
 * figure" rather than "print an unqualified one".
 */
function deriveBandTier(
  contributors: Array<Parameters<typeof deriveCoverageTier>[0]>,
): CoverageTier | null {
  if (contributors.length === 0) return null;
  const ranked = contributors
    .map((c) => TIER_STRENGTH.indexOf(deriveCoverageTier(c)))
    .sort((a, b) => a - b);
  return TIER_STRENGTH[ranked[Math.floor(ranked.length / 2)]] ?? null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const industry = url.searchParams.get("industry") || "restaurants";

  let title = "Margin Atlas";
  let subtitle = "Small-business benchmarks worldwide";
  let figure = "";
  let detail = "";
  // Stays empty unless a figure is actually printed, and a figure is only
  // printed when this is non-empty. The two move together on purpose.
  let provenance = "";

  try {
    // The slug arriving here is already the RESOLVED activity slug: the page's
    // generateMetadata does the margin-table resolution (a trade with its own
    // measured row wins over its parent) and builds this URL from the result,
    // so the card never has to repeat that resolution and cannot disagree with
    // the page about which trade it is showing.
    const ind = slugToIndustry(industry);
    if (ind) {
      title = ind.name;
      subtitle = "Margin structure and cost stack";

      const { summary, contributors } = await resolveIndustryHeadlineBand(
        ind.id,
        industryToSlug(ind.id),
      );
      const median = summary.revenue.median;
      const tier = deriveBandTier(contributors);

      // Guard on the FIGURE and on the TIER together. A median with no
      // contributors to qualify it, or contributors with no median, both mean
      // no figure block: never a dash, never a bare confident number.
      if (median != null && tier != null) {
        subtitle = "Typical revenue, margin structure, and cost stack";
        figure = formatWithSpec(median, "usd-compact");
        // `across`, not `short`. The figure above is a median over states, so
        // the cell card's "in this place" would be pointing at nothing. Same
        // assertion, correct noun. See coverage_tier_copy.ts.
        provenance = COVERAGE_TIER_COPY[tier].across;
        detail =
          summary.revenue.p10 != null && summary.revenue.p90 != null
            ? `Range ${formatWithSpec(summary.revenue.p10, "usd-compact")} – ${formatWithSpec(summary.revenue.p90, "usd-compact")}`
            : "";
      }
    }
  } catch {
    // fall through to defaults
  }

  const hasFigure = Boolean(figure && provenance);

  return new ImageResponse(
    (
      <OgFrame>
        <OgBrand />
        <OgTitle title={title} subtitle={subtitle} />
        {hasFigure ? (
          <OgFigure
            label="Typical revenue a year, across the US markets we measure"
            value={figure}
            provenance={provenance}
            detail={detail}
          />
        ) : null}
        <OgFooter marginTop={hasFigure ? 32 : "auto"} />
      </OgFrame>
    ),
    CARD_SIZE
  );
}
