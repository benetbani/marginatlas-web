# 20 · Track Q — Optional-Hierarchy Navigation UX

> Founder direction: "the person can pick whatever part of the whole
> chain… he can pick the country, and we are going to search like on
> interface that has to do with the country in general and like now push
> him to select an industry. But if he selects the city immediately…"
>
> Right now the navigator is rigid: country → region → industry. This
> track makes every level optional and lets users land anywhere.

---

## 1 · Goal

The navigator and URL space become **fluid**:

- Drop in at country level → see industries, top cities, top regions
- Drop in at region level → see sub-regions, cities in region, industries
- Drop in at city level → see neighborhoods, industries
- Drop in at neighborhood → see industries

At any level, the user can either:
- **Narrow down** (pick a deeper level)
- **Pivot to industry** (skip remaining geo steps and see "industry × current location" cell)

The current cell page should suggest the next-most-useful jump rather
than dead-ending.

---

## 2 · Targets

| Metric | Current | Target |
|---|---|---|
| Country page entry depth (clicks to a cell) | 2-3 | **1** (via Track N city shortcuts) |
| Region pages | None or stub | **Per-country region pages with sub-tile grids** |
| City pages | Mostly redirects | **Standalone city pages with industry + neighborhood grids** |
| Neighborhood pages (tier-1 cities) | None | **From Track O** |
| Navigator can skip levels | No | **Yes** |
| Breadcrumb collapses on skipped levels | n/a | **Yes** |
| Industry selector available at every level | Only at cell level | **Country / region / city all have inline industry picker** |

---

## 3 · The four levels

| Level | URL pattern | Page content |
|---|---|---|
| **Country** | `/{country}` | Hero + top cities (Track N) + top regions + top industries (national avg) + signature stats |
| **Region** | `/{country}/{region}` | Hero + cities in region + sub-regions + top industries (regional avg) |
| **City** | `/{country}/{city}` | Hero + neighborhoods (if tier-1) + top industries + Cell snapshot for default industry |
| **Cell** | `/{country}/{geo}/{industry}` | Full cell page (existing) |

Plus the new 4-segment route from Track O:
- **Neighborhood cell**: `/{country}/{city}/{neighborhood}/{industry}`

---

## 4 · Step-by-step

### T-Q.1 · Audit current `[country]` page

`src/app/[country]/page.tsx` currently renders a basic country
landing. Audit what exists:

```bash
grep -n "country" src/app/[country]/page.tsx | head -20
```

Add:
- `CountryCityShortcuts` (Track N) above the fold
- "Top regions" tile grid below
- "Top industries (national)" below regions
- Inline `IndustryPicker` that routes to `/{country}/all/{industry}` (national-level cell) — see T-Q.3

### T-Q.2 · Create `[country]/[geo]/page.tsx` (region landing)

Currently `[country]/[geo]/page.tsx` doesn't exist (only the cell page
at `[country]/[geo]/[industry]/page.tsx`). Add it:

```tsx
// src/app/[country]/[geo]/page.tsx
import { getRegionTopIndustries, getRegionCities, getRegionSubRegions } from "@/lib/cells";

export default async function RegionPage({ params }: { params: Promise<{ country: string; geo: string }> }) {
  const { country, geo } = await params;
  const [industries, cities, subRegions] = await Promise.all([
    getRegionTopIndustries(country, geo, 12),
    getRegionCities(country, geo),  // returns cities in this region (from Track M list)
    getRegionSubRegions(country, geo),  // e.g. Bavaria → its 7 Regierungsbezirke
  ]);

  return (
    <div>
      <Hero country={country} geo={geo} />
      {cities.length > 0 && <CityGrid cities={cities} />}
      {subRegions.length > 0 && <SubRegionGrid subRegions={subRegions} />}
      <TopIndustries items={industries} country={country} geo={geo} />
      <InlineIndustryPicker country={country} geo={geo} />
    </div>
  );
}
```

### T-Q.3 · Create `[country]/[city]/page.tsx` (city landing)

When a URL like `/us/new-york` is hit and `new-york` is in the
Track M city list, render the city landing:

```tsx
// src/app/[country]/[city]/page.tsx
// (Conflicts with [country]/[geo] — Next.js resolves by checking parallel routes;
//  use middleware or a single route that dispatches based on slug type.)
```

**Implementation note**: Next.js doesn't allow two parallel dynamic
routes at the same depth. The clean solution is a single
`[country]/[geo]/page.tsx` that:
1. Checks if `geo` is a city slug (in Track M list)
2. Checks if `geo` is a region slug (in Eurostat NUTS / US state list)
3. Renders the appropriate layout

So Track Q.3 expands the existing `[country]/[geo]/page.tsx` to be
a dispatcher.

```tsx
export default async function GeoPage({ params }) {
  const { country, geo } = await params;
  const cityEntry = lookupCity(country, geo);
  if (cityEntry) return <CityLanding city={cityEntry} />;
  const regionEntry = lookupRegion(country, geo);
  if (regionEntry) return <RegionLanding region={regionEntry} />;
  notFound();
}
```

### T-Q.4 · Inline industry picker

`src/components/InlineIndustryPicker.tsx` — a compact combobox shown
at the bottom of country / region / city pages:

```tsx
<div className="my-12 rounded-xl border border-parchment bg-cream-100 p-6">
  <h3 className="text-lg font-semibold mb-2">Or pick an industry directly</h3>
  <p className="text-sm text-ink-600 mb-4">
    Skip the {currentLevelLabel} — see the data for {industryName} in {locationName}.
  </p>
  <ComboField
    label=""
    placeholder="Search industries..."
    onSelect={(industryId) => router.push(`/${country}/${geo}/${industryToSlug(industryId)}`)}
  />
</div>
```

### T-Q.5 · Country-level cell ("all of country")

URL pattern: `/{country}/all/{industry}` renders a country-level cell.

E.g. `/de/all/restaurants` shows restaurants in Germany as a single
cell (sourced from `extrapolated_cells` or a country-aggregate from
regional_cells).

This handles the case where a user picks industry at country level
without drilling.

### T-Q.6 · Region-level cell ("all of region")

URL pattern: `/{country}/{geo}/all/{industry}` shows the industry for
the whole region, aggregating sub-regional cells.

Optional — defer until P.2 if complex.

### T-Q.7 · Breadcrumb adaptation

Existing breadcrumb:
```
Home › US › California › Los Angeles County › Restaurants
```

New breadcrumb adapts when levels are skipped:
```
Home › Germany › Restaurants            (country → industry)
Home › US › New York › Restaurants       (city → industry, region skipped)
Home › US › NY → Manhattan › Pharmacies  (neighborhood → industry)
```

`src/components/StructuredData.tsx` Breadcrumbs handles this — extend
to support flexible level counts.

### T-Q.8 · "Where else could you look" suggestion bar

On cell pages with weak data (tier X or low quality), suggest the next
best neighbor:

```
Limited data here. Stronger numbers in:
  · LA County (same industry, real data)
  · California (state-level estimate)
```

Existing `getNudgeNeighbor` (in cells.ts) does part of this; extend it
to be aware of the optional-hierarchy levels.

### T-Q.9 · Update GlobalSearch (Cmd+K)

Currently searches industries + sectors + countries. Add:
- Cities (from Track M)
- Regions (from existing taxonomy)
- Neighborhoods (from Track O alias map)

So typing "Bron" surfaces "The Bronx, NYC" directly.

### T-Q.10 · Update NavigatorForm

Make region + city fields optional (not required to submit). Submit
button text changes:
- All fields blank: "Pick something"
- Only country: "See [country] benchmarks" → `/{country}`
- Country + city: "See [city] benchmarks" → `/{country}/{city}`
- Country + industry: "See [industry] in [country]" → `/{country}/all/{industry}`
- Country + city + industry: "Show me the numbers →" → `/{country}/{city}/{industry}`

---

## 5 · Verification gate

| Check | Pass criterion |
|---|---|
| Q.1 Country page audit + enhancements | Renders city + region + industry sections |
| Q.2/Q.3 Geo dispatcher | `/{country}/{geo}` correctly routes to city OR region landing |
| Q.4 Inline industry picker | Present on country + region + city pages |
| Q.5 Country-level cell | `/{country}/all/{industry}` renders |
| Q.6 Region-level cell (optional) | Either implemented or documented as deferred |
| Q.7 Adaptive breadcrumb | All 4 patterns (country/region/city/neighborhood) render correctly |
| Q.8 Nudge bar | Appears when data is weak; suggests stronger neighbor |
| Q.9 GlobalSearch | Cities + regions + neighborhoods surface in autocomplete |
| Q.10 Navigator | Optional fields work; CTA text adapts |
| `tsc --noEmit` | Clean |

When all ten pass: **Q is DONE.** Track L (handoff refresh) captures
the new UX architecture.

---

## 6 · Time estimate

| Task | Time |
|---|---|
| Q.1 Country page enhancements | 2 hours |
| Q.2/Q.3 Geo dispatcher | 3 hours |
| Q.4 Inline industry picker | 1.5 hours |
| Q.5 Country-level cell route | 2 hours |
| Q.6 Region-level cell (defer) | — |
| Q.7 Adaptive breadcrumb | 1.5 hours |
| Q.8 Nudge bar extension | 1 hour |
| Q.9 GlobalSearch extension | 1.5 hours |
| Q.10 Navigator adaptation | 2 hours |
| **Total** | 14-15 hours |

Multi-session. Q.1 + Q.4 + Q.10 are the highest-impact subset for
a first pass.

---

## 7 · Dependencies

- **Track M** (city list) — required for Q.2/Q.3 dispatcher + Q.9 search
- **Track N** (city shortcuts) — Q.1 builds on top of N
- **Track O** (neighborhoods) — required for Q.7 breadcrumb 4-level form + Q.9 neighborhood search
- B-014 data layer fix — already done (session 5)
- Industry slug → cell URL helpers — already in `cells.ts`

---

## 8 · Known gotchas

- **Route conflict**: Next.js `[country]/[geo]/page.tsx` and `[country]/[geo]/[industry]/page.tsx` are both dynamic. The 2-segment route (with `geo` only) handles dispatch via slug-type detection.
- **Slug collision**: a city slug like `madrid` might also be a region slug (Madrid is both a city and a comunidad autónoma in ES). Dispatcher must prefer the more-specific match. Prefer city > region > NUTS code.
- **Generated static params**: with new levels, `generateStaticParams` needs to include city + region URLs too. Pull top-100 per Track M.
- **SEO**: each new level URL gets a canonical tag and entry in sitemap. Sitemap.ts (already updated for cells) extends to include region + city landing URLs.
- **Tracking analytics**: each level should fire a separate page-view event so we know which levels users actually land on. Defer until analytics is wired.

---

## 9 · What this unlocks

- Friction-free navigation matching how users actually search
- Founder's "parallel methodology" vision: user picks any level, gets useful content
- Each level becomes its own SEO surface (more long-tail keyword coverage)
- Sets the architecture for future levels (sub-neighborhood, ZIP-code, postcode)
- Removes the "dead-end" problem on weak-data cells (nudge bar handles)
