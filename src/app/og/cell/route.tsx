/**
 * /og/cell — dynamic OG image for any cell URL (DD.1).
 *
 * Usage:
 *   <meta property="og:image" content="/og/cell?country=us&geo=california&industry=restaurants" />
 *
 * Renders a 1200x630 image with the cell's revenue + industry + region.
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

  try {
    const cell = await getCellBySlug(country, geo, industry, {});
    if (cell) {
      const indName = cell.industry_name || cell.industry_description || industry;
      const geoName = cell.geo_name || geo;
      title = `${indName}: ${geoName}`;
      subtitle = `Typical revenue, employment & wage`;
      median = formatMoney(cell.revenue_per_firm);
      detail =
        cell.rev_p10 && cell.rev_p90
          ? `Range ${formatMoney(cell.rev_p10)} – ${formatMoney(cell.rev_p90)}`
          : `${indName} in ${geoName}`;
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
          background: "linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
          color: "#2A1810",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              background: "#B82F0F",
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
              color: "#2A1810",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              marginTop: 16,
              color: "#5C453A",
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
              borderLeft: "6px solid #B82F0F",
              alignSelf: "flex-start",
            }}
          >
            <div style={{ fontSize: 20, color: "#5C453A" }}>
              Typical revenue
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: "#B82F0F",
                lineHeight: 1.1,
                marginTop: 4,
              }}
            >
              {median}
            </div>
            {detail ? (
              <div style={{ fontSize: 20, color: "#5C453A", marginTop: 4 }}>
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
            marginTop: 32,
            color: "#5C453A",
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
