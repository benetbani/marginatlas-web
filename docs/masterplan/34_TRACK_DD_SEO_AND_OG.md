# 34 · Track DD — SEO + OG Images + Structured Data

> Per-cell discoverability. Currently sitemap covers ~30k URLs but each
> cell page has thin meta tags and no rich social previews.

---

## 1 · Goal

Every cell page becomes individually discoverable and shareable:
- Rich JSON-LD (Dataset, Article, BreadcrumbList, FAQ)
- Dynamic OG image per cell (revenue + city + industry)
- Per-cell canonical + alternate hreflang scaffolding
- Internal linking improvements (related cells, related cities)

---

## 2 · Sub-tracks

### DD.1 — OG image generation per cell

Use Next.js `opengraph-image.tsx` API to render per-cell OG cards.

`src/app/[country]/[geo]/[industry]/opengraph-image.tsx`:
```tsx
export const runtime = "edge";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }) {
  const cell = await getCellBySlug(params.country, params.geo, params.industry);
  if (!cell) return new Response(null, { status: 404 });
  return new ImageResponse(<CellOgCard cell={cell} />, size);
}
```

Layout: cream-gradient background, atlas amber accent, big revenue
number, city/country tag, quality dots.

Cost: ~$5/million renders on Vercel edge; likely free tier sufficient.

Effort: 3 hr.

### DD.2 — JSON-LD enrichment

Current cell page emits Dataset + Breadcrumbs schema. Add:
- `Article` schema (when editorial content lands)
- `FAQPage` schema with auto-generated Q&A pairs:
  - "What is the typical revenue for X in Y?"
  - "How many X are there in Y?"
  - "What's the after-tax owner take-home for X in Y?"
- `Organization` already on layout — verify it includes contact info

Effort: 2 hr.

### DD.3 — Per-cell meta descriptions

Current: generic "Typical revenue, employment, and wages for {industry}
in {region}".

Replace with templated dynamic copy:
"In {region}, the typical {industry} earns ${rev_p50}, with the
bottom 10% under ${p10} and top 10% over ${p90}. {n_firms} firms,
{avg_employees} employees on average. {year} data, quality {q}/10."

160 chars max for SERP.

Effort: 1.5 hr.

### DD.4 — Internal linking

Currently cell pages link to: same-industry-across-states OR
same-industry-across-countries. Extend to:
- Related industries in same sector (3-5 links)
- Nearby geographic units (neighbor counties/regions/cities)
- Sector parent page
- Country parent page

Effort: 2 hr.

### DD.5 — Canonical + hreflang scaffolding

When localized versions ship (Track MM), each cell needs:
```html
<link rel="canonical" href="https://marginatlas.com/es/madrid/cafes-coffee">
<link rel="alternate" hreflang="es" href="https://marginatlas.com/es/es/madrid/cafes-coffee">
<link rel="alternate" hreflang="en" href="https://marginatlas.com/en/madrid/cafes-coffee">
```

For now (single language): add canonical tags pointing at
non-trailing-slash URL.

Effort: 1 hr.

### DD.6 — Robots.txt per-route tuning

Block low-quality cells (quality_10 < 4) from indexing:
```
User-agent: *
Disallow: /*?quality=low
```

Actually better: add `<meta name="robots" content="noindex">` to cell
pages with quality_10 < 4. Don't waste crawler budget on weak cells.

Effort: 45 min.

### DD.7 — Submit to search engines

After Track DD ships:
- Google Search Console — add property, submit sitemap
- Bing Webmaster — same
- Yandex Webmaster (Russia matters)
- Baidu (if China matters)

Founder action: ~30 min total. Document in instructions.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| DD.1 OG images | 3 hr |
| DD.2 JSON-LD enrichment | 2 hr |
| DD.3 Meta descriptions | 1.5 hr |
| DD.4 Internal linking | 2 hr |
| DD.5 Canonical + hreflang | 1 hr |
| DD.6 Robots.txt + noindex | 45 min |
| DD.7 Submit to SE (founder) | — |
| **Total engineering** | **~10 hr** |

---

## 4 · Verification gate

- OG image renders for sample cell URLs
- JSON-LD validates via Google Rich Results Test
- Lighthouse SEO score ≥ 95
- All cells with quality_10 < 4 have noindex meta tag

---

## 5 · What this unlocks

- Per-cell SERP results show rich social previews
- Higher CTR from organic search
- Google sees the data structure, not just text
- Foundation for multi-language rollout (Track MM)
