# 18 · Track O — Neighborhood Deep-Dive for Tier-1 Cities

> "How much does a pharmacy make in the Bronx?" — that's the golden
> ticket. For the world's biggest cities, users want neighborhood-level
> granularity, not just metro-area aggregates. This track drills.

---

## 1 · Goal

For tier-1 cities (per Track M), expose **neighborhood / borough /
ward-level cells** wherever the source data permits. URL pattern:

```
/{country}/{city}/{neighborhood}/{industry}
```

e.g. `/us/new-york/the-bronx/pharmacies`,
`/gb/london/southwark/legal-services`,
`/jp/tokyo/shibuya/cafes-coffee-shops`.

---

## 2 · Targets

| City | Country | Neighborhood unit | Count | Source |
|---|---|---|---|---|
| New York | US | 5 boroughs + ~70 NTAs | ~75 | Census ZBP + ZIP-level OR NYC OpenData |
| London | GB | 33 boroughs + 500 MSOAs | ~530 | UK NOMIS (Track E) |
| Tokyo | JP | 23 special wards | 23 | JP e-Stat (already in Phase 8 — verify) |
| Paris | FR | 20 arrondissements | 20 | France Sirene (Track H) — or commune codes 75101-75120 |
| São Paulo | BR | 96 distritos | 96 | IBGE SIDRA (extend Phase 15) |
| Moscow | RU | 12 administrative okrugs | 12 | Rosstat OR derived from regional_cells extrapolation |
| Istanbul | TR | 39 ilçes | 39 | TÜİK OR derived |
| Mexico City | MX | 16 alcaldías | 16 | INEGI (Track I.1) |
| Buenos Aires | AR | 15 comunas | 15 | INDEC (Track I.2) |
| Berlin | DE | 12 Bezirke | 12 | Eurostat NUTS-3 (DE300-DE3xx) — verify |
| Madrid | ES | 21 distritos | 21 | INE DIRCE (Track D.5) — extend |
| Barcelona | ES | 10 distritos | 10 | INE DIRCE — extend |

Total potential: ~870 new neighborhood-level cells × ~30 industries = **~26,000 new rows**.

---

## 3 · Per-city strategy

### O.1 · New York City (5 boroughs + NTAs)

**Boroughs (5):** Manhattan, Bronx, Brooklyn, Queens, Staten Island.
Each has a FIPS county equivalent:
- Manhattan = NY-061 → US-36-061 (already in regional_cells via US Census)
- Bronx = NY-005 → US-36-005
- Brooklyn = NY-047 → US-36-047
- Queens = NY-081 → US-36-081
- Staten Island = NY-085 → US-36-085

**Already covered** by Phase 10 US Census. Just need URL aliases:
`/us/new-york/the-bronx/pharmacies` resolves to `/us/us-36-005/pharmacies`.

**Approach**: add an `NYC_BOROUGH_ALIAS` map in `src/lib/cities.ts`:

```typescript
export const NYC_BOROUGH_ALIAS: Record<string, string> = {
  manhattan: "us-36-061",
  bronx: "us-36-005",
  "the-bronx": "us-36-005",
  brooklyn: "us-36-047",
  queens: "us-36-081",
  "staten-island": "us-36-085",
};
```

Then `getRegionalCell` (or a new wrapper) resolves the alias before
the geo_id lookup.

**Optional NTA layer (~70 neighborhoods)**: NYC OpenData publishes
business counts by NTA (Neighborhood Tabulation Area). Heavy lift —
defer to a future pass.

### O.2 · London (33 boroughs)

**Already in scope of Track E (UK NOMIS LAD).** All 33 London
boroughs are LADs with codes E09000001 - E09000033. Track E lands
these natively.

**Action**: ensure Track E spot-checks include all 33 London boroughs.
Add URL alias map for human slugs:

```typescript
export const LONDON_BOROUGH_ALIAS: Record<string, string> = {
  westminster: "gb-e09000033",
  southwark: "gb-e09000028",
  camden: "gb-e09000007",
  // ... 33 entries
};
```

### O.3 · Tokyo (23 special wards)

**Phase 8 e-Stat already lands these.** Codes JP-13101 (Chiyoda)
through JP-13123 (Edogawa). Verify each renders. Add alias map:

```typescript
export const TOKYO_WARD_ALIAS: Record<string, string> = {
  shibuya: "jp-13113",
  shinjuku: "jp-13104",
  minato: "jp-13103",
  // ... 23 entries
};
```

### O.4 · Paris (20 arrondissements)

**Pending Track H (France Sirene).** Commune codes 75101-75120.

If Sirene is structurally unavailable (founder's recollection),
alternative: INSEE REE (Répertoire des Entreprises et Établissements)
publishes lighter per-commune counts via API without the 6 GB download.
Investigate as O.4.a if H stays blocked.

### O.5 · São Paulo distritos (96)

**Requires extending Phase 15 (BR IBGE) to municipio + sub-municipal.**
IBGE table 9319 (CEMPRE per distrito) — confirm availability.

### O.6 · Moscow (12 okrugs)

**No primary source available** unless founder authorises Rosstat
registration. Default: derive from extrapolated city overlay
(Phase 18 Moscow row) × per-okrug population share. Tier 'X' badge.

### O.7 · Istanbul (39 ilçes)

**TÜİK (Turkish Statistical Institute)** publishes business demography
at ilçe level. Free public API. ~3 hours engineering.

### O.8 · Mexico City (16 alcaldías)

**INEGI DENUE** at municipio level includes Mexico City alcaldías
(municipal codes 09001-09016). Track I.1 should grab these.

### O.9 · Buenos Aires (15 comunas)

**Buenos Aires city government OpenData portal** publishes business
counts per comuna. Track I.2 extension.

### O.10 · Berlin / Madrid / Barcelona (Bezirke / distritos)

- **Berlin**: Eurostat NUTS-3 codes DE300-DE3xx already split Berlin into 12 Bezirke. Verify Phase 1 captured them.
- **Madrid / Barcelona**: INE DIRCE (Track D.5) should include distrito-level when probed correctly.

---

## 4 · Step-by-step

### T-O.1 · Build the master alias map

`src/lib/cities/neighborhoods.json`:

```json
{
  "tokyo": {
    "city_geo_id": "JP-13000",
    "neighborhoods": [
      { "slug": "shibuya", "geo_id": "JP-13113", "name": "Shibuya" },
      { "slug": "shinjuku", "geo_id": "JP-13104", "name": "Shinjuku" }
    ]
  },
  "new-york": {
    "city_geo_id": "US-CITY-new-york",
    "neighborhoods": [
      { "slug": "manhattan", "geo_id": "US-36-061", "name": "Manhattan" },
      { "slug": "the-bronx", "geo_id": "US-36-005", "name": "The Bronx" }
    ]
  }
}
```

### T-O.2 · Add the 4-segment route

Create `src/app/[country]/[city]/[neighborhood]/[industry]/page.tsx`
that:
1. Looks up `country/city` in neighborhoods.json
2. Resolves neighborhood slug to geo_id
3. Calls `getRegionalCell(country, geo_id, industry)` directly (skipping `regionalSlugToGeoId` since alias provides the geo_id)
4. Renders the same cell page UI

**Route conflict**: Next.js routes `[country]/[geo]/[industry]` and
`[country]/[city]/[neighborhood]/[industry]` are parallel. The latter
has more segments so it wins for 4-segment URLs.

### T-O.3 · Update navigator + global search

When a user types "Bronx" in the navigator, the autocomplete:
1. Matches `the-bronx` in NYC_BOROUGH_ALIAS
2. Pre-fills country=US, city=new-york, neighborhood=the-bronx
3. Suggests industries

`src/components/GlobalSearch.tsx` extends.

### T-O.4 · Wire into city pages

City landing pages get a "Neighborhoods" section:

```tsx
<NeighborhoodGrid city="new-york" industry="restaurants" />
```

Renders the 5 boroughs as tiles, each pointing at
`/us/new-york/{borough}/restaurants`.

### T-O.5 · Spot-check 8 critical URLs

| URL | Expected |
|---|---|
| `/us/new-york/manhattan/pharmacies` | Real data, tier P |
| `/us/new-york/the-bronx/pharmacies` | Real data, tier P |
| `/gb/london/westminster/legal-services` | After Track E lands |
| `/gb/london/southwark/restaurants` | After Track E |
| `/jp/tokyo/shibuya/cafes-coffee-shops` | Real data, tier P (already covered) |
| `/jp/tokyo/shinjuku/restaurants` | Real data |
| `/br/sao-paulo/centro/restaurants` | Pending Track O.5 extension |
| `/mx/mexico-city/cuauhtemoc/restaurants` | After Track I.1 |

### T-O.6 · Mark cities with `neighborhood_drill: true` in Track M list

Update `top100.json` so the 11 cities in O.2-O.10 above have
`neighborhood_drill: true`. Other tier-1 cities default to false until
their neighborhood data is added.

---

## 5 · Verification gate

| Check | Pass criterion |
|---|---|
| O.1 Alias map | `neighborhoods.json` exists with ≥ 5 cities, ≥ 100 neighborhoods total |
| O.2 Route file | 4-segment route renders without errors |
| O.3 Search autocomplete | Typing "Bronx" surfaces a result |
| O.4 City page integration | NYC + Tokyo city pages show neighborhood grid |
| O.5 Spot-check | ≥ 5/8 URLs render real data |
| O.6 Track M coverage | 11 cities have `neighborhood_drill: true` |
| `tsc --noEmit` | Clean |
| `verify_taxonomy.ts` | Clean |

When all eight pass: **O is DONE.** Move to Track P.

---

## 6 · Time estimate

| Task | Time |
|---|---|
| O.1 Alias map (all 11 cities + research) | 4-6 hours |
| O.2 New route | 2 hours |
| O.3 Search integration | 2 hours |
| O.4 City page neighborhood grid | 2 hours |
| O.5 Spot-check + fix | 2 hours |
| O.6 Track M sync | 30 min |
| **Total** | 13-15 hours |

This is a multi-session track. Recommend doing O.1 + O.2 first
(structural), then layering O.4 + O.5 in a second session.

---

## 7 · Sequencing within Track O

| Sub-track | Dependencies | When |
|---|---|---|
| O.1 NYC boroughs | None (US Census already done) | First |
| O.3 Tokyo wards | None (Phase 8 already done) | Second |
| O.10 Berlin / Madrid / Barcelona | Track D + Eurostat verification | After D |
| O.2 London boroughs | Track E (UK NOMIS) | After E |
| O.7 Istanbul | Independent (TÜİK) | Standalone, parallel to E/G |
| O.8 Mexico City | Track I.1 | After I.1 |
| O.9 Buenos Aires | Track I.2 | After I.2 |
| O.4 Paris | Track H (Sirene) OR INSEE REE fallback | Conditional |
| O.5 São Paulo distritos | Phase 15 extension | Standalone |
| O.6 Moscow | Extrapolation only (no primary) | Standalone |

NYC + Tokyo can land immediately on existing data. Use them as the
proof-of-concept before chasing the harder cities.

---

## 8 · Known gotchas

- **Slug conflicts**: "Brooklyn" could be the NYC borough OR a town in any other state. The 4-segment route disambiguates via city prefix.
- **Neighborhood naming variations**: "The Bronx" vs "Bronx" — accept both via alias map.
- **Non-Latin scripts**: Tokyo wards have kanji names; use Romanised slugs but include kanji in `language_search_terms`.
- **Source mismatch within a city**: Tokyo wards via e-Stat are at municipality-code level (5-digit JIS), whereas Tokyo prefecture is JP-13000. Make sure the alias map uses the right codes.
- **Data sparsity**: even in NYC, some borough × industry combos have < 5 firms (suppressed). Drop those URLs from sitemap.
- **No "Coming soon"**: cities without ingest yet just don't show in NeighborhoodGrid. Don't placeholder.

---

## 9 · What this unlocks

- The "golden ticket" use case: "pharmacy in the Bronx" — direct hit
- Massive SEO depth (~26k new cells across 11 cities)
- Distinguishes the atlas from country-level competitors (Bloomberg etc. have nothing below MSA for SMBs)
- Founder's "data about the neighborhoods of the cities itself" vision realised
- Sets the pattern for future expansion (Mumbai mohallas, Cairo districts, etc.)
