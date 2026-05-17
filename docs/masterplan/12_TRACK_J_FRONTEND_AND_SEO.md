# 12 · Track J — Frontend + SEO Polish

> Post-ingest housekeeping. Sitemap regen, quality badges, OG
> images, and a few discoverability wins.

---

## 1 · Goal

Make the 220,000+ new cells from Tracks B-I actually discoverable.

A row in Supabase that no one can find is wasted work.

---

## 2 · Targets

| Task | Target | Gate |
|---|---|---|
| J.1 Sitemap regen | Top 10,000 cells across regional_cells | `/sitemap.xml` ≥ 10k URLs |
| J.2 Coverage badge enhancements | Tooltip on every QualityBadge | Visual check |
| J.3 Last-updated line on cell pages | Shows the cell's `year` field | Visual check |
| J.4 OG image per cell (stretch) | Dynamic per-cell social cards | Twitter/Slack preview correct |
| J.5 Country page enrichment | New countries land on `/browse` and `/[country]` | All new countries reachable |
| J.6 Featured tiles refresh | Use newly-landed cells where helpful | Home page shows fresh data |

---

## 3 · T-J.1 · Sitemap regeneration

### Current state

`src/app/sitemap.ts` includes only:

- Static pages (home, about-data, browse, compare, ask, pricing, blog)
- US state-level cells from `cells_master` (top 5,000)

Misses 179k → 400k regional_cells.

### Steps

#### T-J.1.1 — Update `sitemap.ts`

Pull top 5,000 cells from `regional_cells` ranked by `n_enterprises *
quality_score` (proxy for "interesting and reliable").

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { cellUrl } from "@/lib/cells";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: "https://marginatlas.com", lastModified: new Date(), priority: 1.0 },
    { url: "https://marginatlas.com/about-data", lastModified: new Date(), priority: 0.8 },
    // ... existing entries
  ];

  // Top US state cells (existing)
  const { data: usTop } = await supabase
    .from("cells_master")
    .select("country, geo_id, geo_name, naics_6, industry_description")
    .gte("n", 100)
    .order("total_employment", { ascending: false })
    .limit(5000);
  const usUrls = (usTop || []).map(c => ({
    url: `https://marginatlas.com${cellUrl(c)}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  // NEW: top regional_cells
  const { data: regionalTop } = await supabase
    .from("regional_cells")
    .select("country, geo_id, geo_name, industry_id, quality_score, n_enterprises")
    .gte("n_enterprises", 5)
    .order("quality_score", { ascending: false })
    .limit(10000);
  const regionalUrls = (regionalTop || []).map(c => ({
    url: `https://marginatlas.com/${c.country.toLowerCase()}/${slugifyGeo(c.geo_id, c.geo_name)}/${c.industry_id.replace(/_/g, "-")}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticPages, ...usUrls, ...regionalUrls];
}
```

#### T-J.1.2 — Handle sitemap split

Vercel limit: 50,000 URLs per sitemap. We're well under (~17k
total) but plan for growth:

```typescript
// If total > 40,000, split into multiple sitemap files:
// /sitemap.xml -> index
// /sitemap-static.xml
// /sitemap-cells-1.xml (top 50k)
// /sitemap-cells-2.xml (next 50k)
```

For now: single sitemap. Add the split later if total > 40k.

#### T-J.1.3 — Verify

```bash
curl -s https://marginatlas-web-twtl.vercel.app/sitemap.xml | grep -c '<url>'
# expect: ~15,000+
```

#### T-J.1.4 — Submit to Google Search Console + Bing Webmaster

(Founder action, optional — speeds indexing by ~7 days.)

---

## 4 · T-J.2 · Coverage badge enhancements

### Current state

`QualityBadge.tsx` shows star count + source label. No tooltip
explaining what the rating means.

### Steps

#### T-J.2.1 — Add tooltip explaining tier

```tsx
// src/components/QualityBadge.tsx
import { Tooltip } from "./Tooltip";

const TIER_EXPLANATION: Record<string, string> = {
  P: "Primary — direct measurement from a national statistical office. Highest confidence.",
  S: "Secondary — re-published from primary sources by an international body. High confidence.",
  M: "Modelled — imputed using primary data + auxiliary signals. Medium confidence.",
  T: "Tabulated — count-only data; no distribution available. Limited confidence.",
  X: "Estimated — extrapolated from regional patterns. Use as directional only.",
};

export function QualityBadge({ tier, source, year }: Props) {
  const explanation = TIER_EXPLANATION[tier] || "Quality rating not classified.";
  return (
    <Tooltip content={`${explanation}\n\nSource: ${genericSource(source)}\nYear: ${year}`}>
      <div className="...">
        {/* existing star display + source label */}
      </div>
    </Tooltip>
  );
}
```

#### T-J.2.2 — Verify Tooltip component supports multiline

If existing `Tooltip.tsx` doesn't support newlines, update it to
accept `ReactNode` content rather than just `string`.

---

## 5 · T-J.3 · Last-updated line

### Current state

Cell pages don't show when the data was measured. Users don't know
if they're looking at 2018 or 2024 numbers.

### Steps

#### T-J.3.1 — Add to TypicalFirmCard or hero

```tsx
// src/app/[country]/[geo]/[industry]/page.tsx
<div className="text-sm text-ink-500 mt-2">
  Based on {cell.year} data
</div>
```

#### T-J.3.2 — Color-code freshness

```tsx
const dataAge = new Date().getFullYear() - cell.year;
const freshnessColor =
  dataAge <= 2 ? "text-moss-600" :
  dataAge <= 4 ? "text-ink-600" :
  "text-clay-600";
<div className={`text-sm ${freshnessColor} mt-2`}>
  Based on {cell.year} data {dataAge > 4 && "— consider as historical baseline"}
</div>
```

---

## 6 · T-J.4 · OG image per cell (stretch)

### Why

Sharing a cell URL on Twitter / Slack / LinkedIn currently shows
the generic site OG image. A per-cell OG image (headline +
typical revenue) materially raises click-through.

### Steps

#### T-J.4.1 — New OG image API route

```tsx
// src/app/[country]/[geo]/[industry]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getCellBySlug } from "@/lib/cells";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: Props) {
  const cell = await getCellBySlug(params.country, params.geo, params.industry);
  if (!cell) return new Response(null, { status: 404 });

  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #FAFAF7 0%, #E8DDC7 100%)",
        padding: 80,
      }}>
        <div style={{ fontSize: 28, color: "#9C5614" }}>
          Margin Atlas
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#1A1A1A", marginTop: 24 }}>
          {industryDisplayName} in {geoDisplayName}
        </div>
        <div style={{ display: "flex", gap: 80, marginTop: 60 }}>
          <Stat label="Typical revenue" value={formatCurrency(cell.revenue_per_firm)} />
          <Stat label="Firms" value={cell.n_enterprises?.toLocaleString()} />
          <Stat label="Avg employees" value={Math.round(cell.n_employees / cell.n_enterprises)} />
        </div>
        <div style={{ marginTop: "auto", color: "#737373", fontSize: 20 }}>
          marginatlas.com
        </div>
      </div>
    ),
    size
  );
}
```

#### T-J.4.2 — Test

```bash
curl -s https://marginatlas-web-twtl.vercel.app/us/california/restaurants/opengraph-image | file -
# expect: PNG image data
```

Test in Twitter / Slack / LinkedIn preview tools.

Cost note: Vercel edge image generation is metered. ~$5/million.
Likely free-tier sufficient for first 12 months.

---

## 7 · T-J.5 · Country page enrichment

### What needs updating

New countries from Tracks D + G + I + H need:

1. To appear on `/browse` country grid
2. Have a `/[country]` landing page
3. Have a curated "signature line" in `src/lib/countries.ts`

### Steps

#### T-J.5.1 — Verify each new country is in `COUNTRIES` list

```typescript
// src/lib/taxonomy.ts -> COUNTRIES
// Should include: NL, ES, IT, GB, AU, NZ, MX, AR, CL, CO, PE, FR
```

If missing: add. CI (`verify_taxonomy.ts`) flags missing entries.

#### T-J.5.2 — Add signature lines

```typescript
// src/lib/countries.ts (or wherever COUNTRY_SIGNATURE_LINES lives)
const COUNTRY_SIGNATURE_LINES = {
  NL: "Compact, urbanised, density of high-margin services.",
  ES: "Coastal hospitality belt + Madrid services hub.",
  IT: "Northern industrial corridor + central artisan economy.",
  GB: "London concentrates legal, finance, creative; regions weight industrial + retail.",
  AU: "Capital cities lead; resource regions thin in non-mining sectors.",
  NZ: "Auckland-Wellington-Christchurch triangle; rest is rural.",
  MX: "Mexico City + Monterrey + Guadalajara lead; border states industrial.",
  AR: "Buenos Aires dominates; Córdoba + Mendoza + Rosario secondary.",
  CL: "Santiago metropolitan area + mining north + agriculture south.",
  CO: "Bogotá + Medellín + Cali tier; coast Caribbean and Pacific differ.",
  PE: "Lima dominates; Cusco tourism; Arequipa + Trujillo secondary.",
  FR: "Paris-region + Lyon + Marseille + Toulouse + Nice as urban anchors.",
};
```

Founder may want to rewrite these (it's editorial copy). Until tone
is decided (B-002 / A.2), use the above neutral phrasing.

#### T-J.5.3 — Verify each landing page renders

```bash
for country in nl es it gb au nz mx ar cl co pe fr; do
  echo "GET /$country"
  curl -sI https://marginatlas-web-twtl.vercel.app/$country | head -1
done
# expect: all 200
```

---

## 8 · T-J.6 · Featured tiles refresh

### What

The 12 featured cells on the home page were curated when the
covered countries were limited. With new sub-national depth, some
tiles can be upgraded:

- France featured tile: currently `/fr` (country) → upgrade to `/fr/fr-75101/restaurants` (Paris 1er)
- Italy featured tile: currently `/it` (country) → upgrade to `/it/it-mi/clothing-stores` (Milano)
- Germany featured tile: currently `/de` → upgrade to `/de/de212/metal-products-manufacturing` (Munich)
- UK featured tile: currently country → upgrade to `/gb/gb-e09000033/legal-services` (Westminster)

### Steps

#### T-J.6.1 — Update `src/app/page.tsx` featured tile list

```tsx
const FEATURED_TILES = [
  { country: "us", geo: "california", industry: "restaurants" },
  { country: "us", geo: "new-york", industry: "real-estate-agencies" },
  { country: "us", geo: "california", industry: "software-development" },
  // upgraded:
  { country: "fr", geo: "fr-75101", industry: "restaurants" },  // Paris 1er
  { country: "it", geo: "it-mi", industry: "clothing-stores" },  // Milano
  { country: "de", geo: "de212", industry: "metal-products-manufacturing" },  // Munich
  { country: "gb", geo: "gb-e09000033", industry: "legal-services" },  // Westminster
  { country: "jp", geo: "jp-13000", industry: "restaurants" },  // Tokyo
  { country: "br", geo: "br-sp", industry: "restaurants" },  // São Paulo state
  { country: "au", geo: "au-101", industry: "cafes-coffee-shops" },  // Sydney inner
  { country: "in", geo: "city/bangalore", industry: "web-mobile-dev-shops" },  // Bangalore
  { country: "mx", geo: "mx-cmx", industry: "restaurants" },  // Mexico City
];
```

#### T-J.6.2 — Verify all 12 resolve

`FeaturedCellTile` returns `null` if no data — drop is automatic
(R-016 honoured). Visually confirm 12 tiles show on the home page.

---

## 9 · Verification gate

| Check | Pass criterion |
|---|---|
| J.1 Sitemap | `<url>` count ≥ 15,000 |
| J.2 QualityBadge tooltip | Visible on hover for every cell page |
| J.3 Last-updated line | Visible on every cell page |
| J.4 OG image (if pursued) | Per-cell PNG renders |
| J.5 Country landing pages | All 12 new countries return 200 |
| J.6 Featured tiles | 12 tiles render with no "Coming soon" |
| `tsc --noEmit` | Clean |
| `verify_taxonomy.ts` | Clean |
| `npm run lint` | Clean |

When all nine pass: **J is DONE.** Move to Track K.

---

## 10 · Time estimate

| Task | Time |
|---|---|
| J.1 Sitemap | 1 hour |
| J.2 Coverage badge tooltip | 30 min |
| J.3 Last-updated | 30 min |
| J.4 OG image (stretch) | 2 hours |
| J.5 Country pages | 1 hour |
| J.6 Featured tiles | 30 min |
| **Total** | 4-6 hours |

---

## 11 · Known gotchas

- **next/og at edge**: requires runtime: "edge". If founder ever wants to add custom fonts, fonts must be inlined as base64 — Vercel free tier doesn't support font fetch at edge.
- **Sitemap regen on every deploy**: each Vercel deploy re-fetches the top 10k cells from Supabase. That's 1 query per deploy — cheap, but logs it.
- **Country slug consistency**: `/au/au-101` for SA4 vs `/au/city/sydney` for city-overlay both work but render different cells. Document the resolution order in cell-page route handler.
- **Featured tile data freshness**: if a country gets new data after the featured tile is set, the tile auto-uses the latest year because `getCellBySlug` orders by year DESC.

---

## 12 · What this unlocks

- 220k new cells become Google-indexable within ~2 weeks
- Social shares show rich previews → higher CTR
- Users understand data quality at a glance via tooltips
- New countries become first-class citizens (browse, /[country], featured)
