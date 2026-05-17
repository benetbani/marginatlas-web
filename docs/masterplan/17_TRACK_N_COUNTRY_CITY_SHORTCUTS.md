# 17 · Track N — Country Page City Shortcuts

> When a user clicks "Spain" they almost always want Madrid, Barcelona,
> Valencia, Seville, Bilbao, Málaga, Zaragoza, Murcia, Palma — not a
> hierarchical drill into the 17 comunidades autónomas. The country page
> should put 6-9 city tiles above the fold and let the region drill
> stay accessible-but-secondary.
>
> Depends on Track M (top-100 cities list).

---

## 1 · Goal

Every country landing page gets a **"Top cities" tile section** of 6-12
quick-pick tiles surfacing the highest-attention cities for that country.
Click-through goes directly to the city cell view.

### Strategic rationale (founder direction)

- "Just we are going to give the person some, like, uh, nine buttons, okay, for the nine biggest cities in Spain"
- Removes hierarchy friction (no need to figure out which region a city sits in)
- City-search-volume reality reflected in UX
- Region drill stays available; cities are the new default-prominent entry

---

## 2 · Targets

| Metric | Current | Target |
|---|---|---|
| Country pages with city shortcuts | 0 / 38 | **38 / 38** |
| Tier-1 cities surfaced on their country page | n/a | 100% |
| Tier-2 cities surfaced on their country page | n/a | 80% |
| Click-through resolves to a working cell | n/a | 95%+ |
| Time-to-cell from country page (clicks) | 2-3 clicks (country → region → cell) | **1 click** (country → city directly) |

---

## 3 · The component

`src/components/CountryCityShortcuts.tsx`:

```tsx
import { getCitiesForCountry, type CityEntry } from "@/lib/cities";
import { getCellSnapshot } from "@/lib/cells";
import Link from "next/link";

type Props = { iso2: string; primaryIndustry?: string };

export async function CountryCityShortcuts({ iso2, primaryIndustry }: Props) {
  const cities = getCitiesForCountry(iso2)
    .sort((a, b) => a.tier - b.tier || b.population - a.population)
    .slice(0, 12);

  if (cities.length === 0) return null;

  // For each city, pre-fetch the headline snapshot for the primary industry
  // (defaults to "restaurants" — universally relatable).
  const industrySlug = primaryIndustry || "restaurants";
  const snapshots = await Promise.all(
    cities.map(c => getCellSnapshot(c.country, c.slug, industrySlug))
  );

  return (
    <section className="my-12">
      <h2 className="text-xl font-semibold text-cocoa-900 mb-3">
        Top cities in {cities[0].country_name}
      </h2>
      <p className="text-sm text-ink-600 mb-6">
        Skip the region drill — pick a city directly.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city, i) => (
          <Link
            key={city.id}
            href={`/${iso2.toLowerCase()}/${city.slug}/${industrySlug}`}
            className="rounded-xl border border-parchment bg-cream-100 hover:border-atlas-600 hover:shadow-warm transition p-4"
          >
            <div className="text-base font-semibold text-cocoa-900">
              {city.name}
            </div>
            {snapshots[i]?.found && (
              <div className="text-xs text-ink-600 mt-1">
                ~{Math.round((snapshots[i].n_enterprises || 0) / 1000)}k {industrySlug.replace(/-/g, " ")}
              </div>
            )}
            {city.tier === 1 && (
              <div className="text-[10px] uppercase tracking-wider text-atlas-700 mt-2">
                Global metropolis
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
```

### Tile data shown

| Field | Source |
|---|---|
| City name | `CityEntry.name` |
| Default industry headline (e.g. ~12k restaurants) | `getCellSnapshot(country, city.slug, "restaurants")` |
| Tier-1 chip | `CityEntry.tier === 1` |
| Click target | `/{country}/{city.slug}/restaurants` |

### Why "restaurants" as default

- Universal — every economy has them
- Easy mental anchor (~10-50k per major city)
- Already well-covered in `regional_cells`

Founder can swap to a country-specific "signature industry" later
(e.g. ES = restaurants, JP = restaurants, IN = software_development,
DE = metal_products_mfg).

---

## 4 · Step-by-step

### T-N.1 · Add the component

Write `src/components/CountryCityShortcuts.tsx` per spec above.

### T-N.2 · Wire into the country page

`src/app/[country]/page.tsx`:

```tsx
import { CountryCityShortcuts } from "@/components/CountryCityShortcuts";

// In the page component, after the hero + tagline:
<CountryCityShortcuts iso2={iso2} />
```

Place it **above** the existing "Top industries" list, since cities
have higher search volume than industries-by-country.

### T-N.3 · Per-country signature industry mapping (optional)

```typescript
// src/lib/cities/signature_industries.ts
export const COUNTRY_SIGNATURE_INDUSTRY: Record<string, string> = {
  // Founder can fill in country-specific anchors over time
  DE: "metal_products_mfg",
  IN: "software_development",
  IT: "clothing_stores",
  FR: "cafes_coffee",
  US: "restaurants",
  // Default for missing: "restaurants"
};
```

Optional — defer if founder has no opinion.

### T-N.4 · Verify city URLs resolve

After M.3 maps cities to geo_ids, verify each tile URL renders. Test
matrix:

| Country | Top tile | Expected URL | Expected render |
|---|---|---|---|
| ES | Madrid | `/es/madrid/restaurants` | Real data when ES LAU lands (Track D.5) |
| GB | London | `/gb/gb-e09000033/restaurants` | After UK NOMIS (Track E) |
| DE | Berlin | `/de/de30/restaurants` | Real data (already via Eurostat NUTS-2) |
| FR | Paris | `/fr/fr-75056/restaurants` | After France Sirene (Track H) — fallback to FR1 NUTS-2 |
| BR | São Paulo | `/br/br-city-sao-paulo/restaurants` | Real data (Phase 18b) |
| JP | Tokyo | `/jp/jp-13000/restaurants` | Real data (Phase 8) |

If a city's URL doesn't resolve yet (Track D/E/H/I pending), the tile
still renders — but with a "Estimated — full data coming" small chip
instead of the count.

### T-N.5 · Add fallback rendering for missing cells

`getCellSnapshot` returns `{ found: false }` if no data. The tile
renders the city name + "Estimated" chip in that case. No "Coming
soon" tile (R-016).

### T-N.6 · Mobile responsive layout

Test on 360px width: 2-column grid. Test on 768px: 3-column. Test on
1024px+: 4-column.

### T-N.7 · Track CTR (later)

Add basic analytics: which city tiles are clicked most often. Use the
data to refine tier assignment in M.2 over time.

---

## 5 · Verification gate

| Check | Pass criterion |
|---|---|
| N.1 Component exists | `src/components/CountryCityShortcuts.tsx` written |
| N.2 Wired into country page | `src/app/[country]/page.tsx` imports + renders |
| N.3 Signature industries (optional) | Either documented or deferred |
| N.4 URL resolution | At least 30 of 38 countries have ≥ 6 tiles that render real data |
| N.5 Graceful fallback | Cities without data show "Estimated" chip (not "Coming soon") |
| N.6 Mobile responsive | 2/3/4-column grid scales correctly |
| `tsc --noEmit` | Clean |
| `verify_taxonomy.ts` | Clean |

When all eight pass: **N is DONE.** Move to Track O.

---

## 6 · Time estimate

| Task | Time |
|---|---|
| N.1 Component | 1.5 hours |
| N.2 Wire in | 30 min |
| N.3 Signature industries | 30 min (or skip) |
| N.4 URL verification | 1 hour |
| N.5 Fallback | 30 min (mostly already in `FeaturedCellTile` pattern) |
| N.6 Mobile responsive | 30 min |
| **Total** | 3-5 hours |

---

## 7 · Known gotchas

- **Country with < 6 covered cities**: render whatever exists (e.g. NZ has Auckland, Wellington, Christchurch — 3 tiles is fine). Don't pad with placeholders.
- **City name disambiguation**: "Cordoba" exists in both Spain and Argentina. CityEntry.country resolves it; URL slug includes country prefix.
- **Non-Latin scripts**: "Tokyo" is the Romanised slug; the display name in CityEntry.name can stay "Tokyo" OR add a local-script variant via language_search_terms.
- **Caching**: each country page renders 6-12 city snapshots — that's 6-12 Supabase queries per page. Use Next.js `revalidate = 86400` (24h) since city data changes rarely. ISR caches the page.
- **Race with Track M**: if Track M isn't done, this track can't work. Block this track on M.5 (locked list).

---

## 8 · What this unlocks

- 38 country pages get a high-conversion entry point above the fold
- New SEO surface area: `/country` pages become richer (more internal links to high-volume city URLs)
- Justifies the Track M city list curation effort
- Sets the pattern for Track Q (optional hierarchy) — city is a first-class navigation level
- Founder's "9 buttons for Spain" vision realised
