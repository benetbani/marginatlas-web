/**
 * /og/cell — dynamic OG image for any cell URL (DD.1).
 *
 * Usage:
 *   <meta property="og:image" content="/og/cell?country=us&geo=california&industry=restaurants" />
 *
 * Renders a 1200x630 image with the cell's revenue + industry + region, and
 * the coverage tier that says whether that revenue was measured or estimated.
 *
 * Switched from Edge to Node.js runtime. Plan v24
 * Block 11's JSON-import of cell_triage_v1.json (2.8 MB) chained into
 * this Edge bundle via cells.ts, pushing it over Vercel Hobby's 1 MB
 * Edge function cap. Vercel rejected every deploy from Plan v24 Block 1
 * through Plan v25 with: "The Edge Function 'og/cell' size is 1.15 MB
 * and your plan size limit is 1 MB."
 *
 * Node runtime caps function size at 50 MB (no concern) at the cost of
 * a slightly slower cold start (~50-100 ms). Imperceptible for OG
 * image generation. If traffic later justifies Edge, the path is to
 * decouple the triage data from cells.ts via a runtime fetch.
 */
import { ImageResponse } from "next/og";
import { getCellBySlug } from "@/lib/cells";
// The canonical tier derivation, the same one the pages and the CSV export use,
// so a link preview and the page it points at never disagree about how a figure
// was produced. It reads is_synthetic first, which is the case that matters most
// here: getCellBySlug ALWAYS returns a cell, synthesizing one from country and
// activity defaults when the lookup chain misses or the database blows its time
// budget. fill_defaults.ts states the contract in its own words: the render
// layer must read is_synthetic. This route is a render layer and until now it
// read neither is_synthetic nor coverage_tier, so a synthesized figure left the
// site as a bare confident number. Precedent for importing this into a route
// handler: src/app/api/export-csv/route.ts.
import { deriveCoverageTier } from "@/components/CoverageIndicator";
// What each tier MEANS. Shared with /api/export-csv so the card and the export
// cannot drift, which they already did once: this file's first draft glossed
// `estimated` as "country and activity averages", dropping "indicators" and
// quietly weakening the claim. See the module header.
import { COVERAGE_TIER_COPY } from "@/lib/coverage_tier_copy";
// The frame, the brand lockup, the title block, the figure block and the
// footer, shared with the other four cards so the family stays ONE design.
// The palette lives there too; see that file's header for why these are raw
// literals and not token reads.
import {
  CARD_SIZE,
  OgFrame,
  OgBrand,
  OgTitle,
  OgFigure,
  OgFooter,
} from "../_card";

export const runtime = "nodejs";

function formatMoney(v: number | null | undefined): string {
  if (v == null) return "-";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country") || "us";
  const geo = url.searchParams.get("geo") || "california";
  const industry = url.searchParams.get("industry") || "restaurants";

  let title = "Margin Atlas";
  let subtitle = "Small-business benchmarks worldwide";
  let median = "";
  let detail = "";
  // Stays empty unless a figure is actually printed. getCellBySlug is typed
  // Promise<Cell> and always synthesizes rather than returning null, so the
  // only route to the generic brand card is the catch below. The other route
  // to an empty provenance is a cell whose revenue was withheld: see the
  // suppression branch.
  let provenance = "";

  try {
    const cell = await getCellBySlug(country, geo, industry, {});
    const indName = cell.industry_name || cell.industry_description || industry;
    const geoName = cell.geo_name || geo;
    title = `${indName}: ${geoName}`;

    // Guard on the FIGURE, never on the formatted string. formatMoney(null)
    // returns "-", which is truthy, so testing `median` would have kept the
    // whole figure block on screen for a withheld cell.
    //
    // enforceSanity (src/lib/cells/fill_defaults.ts) nulls the entire revenue
    // waterfall, headline and every percentile, when a row is catastrophic or
    // a wealth-normalized outlier, and sets _revenueSuppressed so no later
    // fill step can resurrect it. That is not a rare path: a probe of 1,000
    // real regional_cells rows found 25.9% null out this way.
    //
    // What the card shows in that state, decided deliberately: NO figure
    // block at all, and a subtitle that says so. Printing "-" under the words
    // "Typical revenue" with a confident provenance sentence beneath it would
    // publish a provenance claim about a number we withheld on purpose, which
    // is worse than the bare dash this route showed before. Silence about the
    // figure, plus one line naming its absence, is the honest floor.
    if (cell.revenue_per_firm != null) {
      subtitle = `Typical revenue, employment & wage`;
      median = formatMoney(cell.revenue_per_firm);
      // Stated for every tier, not only the weak ones. A card that qualifies
      // itself only when the data is thin teaches readers that an unqualified
      // card is a measurement, which is the same trap by omission.
      provenance = COVERAGE_TIER_COPY[deriveCoverageTier(cell)].short;
      detail =
        cell.rev_p10 && cell.rev_p90
          ? `Range ${formatMoney(cell.rev_p10)} – ${formatMoney(cell.rev_p90)}`
          : `${indName} in ${geoName}`;
    } else {
      subtitle = "Revenue not published for this cell";
    }
  } catch {
    // fall through to defaults
  }

  return new ImageResponse(
    (
      <OgFrame>
        <OgBrand />
        <OgTitle title={title} subtitle={subtitle} />
        {median ? (
          <OgFigure
            label="Typical revenue"
            value={median}
            provenance={provenance}
            detail={detail}
          />
        ) : null}
        <OgFooter marginTop={median ? 32 : "auto"} />
      </OgFrame>
    ),
    CARD_SIZE
  );
}
