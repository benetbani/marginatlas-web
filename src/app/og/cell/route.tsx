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

export const runtime = "nodejs";

/**
 * Palette. Terracotta plus cool neutrals, per the palette law in
 * docs/superpowers/plans/2026-06-16-visual-upgrade/EXECUTION-CONSTITUTION.md
 * section 1. This card previously painted its text in #2A1810 and #5C453A,
 * both browns, which that law bans.
 *
 * These are literals rather than reads from src/lib/design-tokens.ts because
 * that file holds no cool-neutral family. Its ink and cocoa ramps are the warm
 * brown-black ladder from the 2026-06-04 Warm Atlas reformation (ink-900 is
 * #211810), so importing a token here would swap one brown for another and
 * leave the violation in place. The greys below are the constitution's own
 * ramp. src/app/og/ is excluded from verify_hardcoded_hex precisely because
 * image routes carry raw colour; see scripts/verify_hardcoded_hex.ts.
 */
const INK = "#0e1116"; // grey-900, primary text
const MUTED = "#6b7785"; // grey-500, secondary text and captions
const TERRACOTTA = "#c11c00"; // atlas-600, the only accent, unchanged

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
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #ffffff 0%, #f7f6f4 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              background: TERRACOTTA,
              borderRadius: 6,
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            Margin Atlas
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 60, flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: INK,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              marginTop: 16,
              color: MUTED,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>

        {median ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              padding: "20px 28px",
              background: "rgba(255,255,255,0.7)",
              borderRadius: 16,
              borderLeft: `6px solid ${TERRACOTTA}`,
              alignSelf: "flex-start",
            }}
          >
            <div style={{ fontSize: 20, color: MUTED }}>
              Typical revenue
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: TERRACOTTA,
                lineHeight: 1.1,
                marginTop: 4,
              }}
            >
              {median}
            </div>
            {/* Provenance, directly under the figure it qualifies. Placed
                above the range so the first thing read after the number is
                how the number was produced. */}
            {provenance ? (
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: MUTED,
                  marginTop: 8,
                }}
              >
                {provenance}
              </div>
            ) : null}
            {detail ? (
              <div style={{ fontSize: 20, color: MUTED, marginTop: 4 }}>
                {detail}
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // The figure block above carries marginTop:auto, so when it renders
            // it absorbs the free space and this footer just trails it by 32.
            // When revenue is withheld that block is absent, nothing absorbs
            // the space, and the footer rode up under the subtitle leaving the
            // bottom third of the card empty. In that state the footer takes
            // the auto itself.
            marginTop: median ? 32 : "auto",
            color: MUTED,
            fontSize: 18,
          }}
        >
          <span>marginatlas.com</span>
          <span>Small businesses worldwide</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
