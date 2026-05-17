# Master Plan Progress

> Updated continuously during execution. Single source of truth for
> what's landed and what's pending. The next session reads this to
> resume.

## Track status

| Track | Status | Rows added | Completed at |
|---|---|---|---|
| A.1 DNS | DONE | — | Founder confirmed 2026-05-17 |
| A.2 Tone | DEFERRED (Lorem Ipsum filler authorized for tone-dependent slots) | — | — |
| A.3 ANTHROPIC key | DONE (in .env.local; Vercel paste deferred with tone) | — | Founder confirmed 2026-05-17 |
| A.4 Sirene CSV | OPEN (not confirmed downloaded; Track H stays gated) | — | — |
| A.5 Images | DEFERRED (founder will provide later) | — | — |
| B NAICS expansion | DONE | 73 → 86 codes; 202 → 206 industries | 2026-05-17 |
| C.1 Canada retry | PARTIAL — +2,162 rows (target was 12k; single-snapshot table 33-10-1095) | +2,162 | 2026-05-17 |
| C.3 US re-execute | DONE | +6,867 rows (US total 87,573 → 92,707) | 2026-05-17 |
| **B-014 critical fix** | DONE — regional_cells now reachable from data layer | n/a (5 functions added + sitemap rewrite) | 2026-05-17 |
| J.1 Sitemap regen | DONE (includes top 10k regional_cells) | n/a | 2026-05-17 |
| D.2 Netherlands | PENDING | — | — |
| D.5 Spain | PENDING | — | — |
| D.8 Italy | PENDING | — | — |
| E.2 UK LAD | PENDING | — | — |
| E.3 UK MSOA | PENDING (stretch) | — | — |
| F OECD | PENDING | — | — |
| G.2 Australia | PENDING | — | — |
| G.4 New Zealand | PENDING | — | — |
| H France | BLOCKED-A.4 | — | — |
| I.1 Mexico | PENDING | — | — |
| I.2 Argentina | PENDING | — | — |
| I.3 Chile | PENDING | — | — |
| I.4 Colombia | PENDING | — | — |
| I.5 Peru | PENDING | — | — |
| J.1 Sitemap | PENDING | — | — |
| J.2 Quality badges | PENDING | — | — |
| J.3 Last-updated | PENDING | — | — |
| J.4 OG images | DEFERRED (stretch) | — | — |
| J.5 Country pages | PENDING | — | — |
| J.6 Featured tiles | PENDING | — | — |
| K Verification | PENDING | n/a | — |
| L Handoff refresh | PENDING | n/a | — |
| **M Top-100 cities list** (Wave 2) | PENDING | n/a | — |
| **N Country city shortcuts** (Wave 2) | PENDING | n/a | — |
| **O Neighborhood drill-down** (Wave 2) | PENDING | n/a | — |
| **P Tax overlay** (Wave 2) | PENDING | n/a | — |
| **Q Optional-hierarchy UX** (Wave 2) | PENDING | n/a | — |

## Notes per track

### Track B (DONE)
- Approach: scripted edit via `E:\atlas\scripts\taxonomy\expand_naics_3.py`.
- 9 codes added to existing industries, 4 new corp_only transport industries, 5 codes explicitly skipped (521/533/551/813/814).
- 202 → 206 industries, 73 → 86 NAICS-3 codes covered.
- verify_taxonomy.ts + tsc --noEmit both clean.
- Audit: `E:\atlas\delivery\taxonomy\naics_3_audit.json`.

### Track C.1 (PARTIAL)
- Handoff doc said correct table was 33-10-0418. **It was wrong** — that table is "Level of challenge" survey data, not business counts.
- 33-10-0036 also wrong (CAD exchange rate). 33-10-0095 also wrong (goods purchased).
- Correct table found via `getAllCubesListLite` filter: **33-10-1095** (Canadian Business Counts, with employees, December 2025 — latest snapshot).
- Also fixed SIZE_BAND_MAP: source uses "1 to 4 employees" not "1 to 4".
- Result: **+2,162 rows** (target was 12,000). Single-snapshot table caps yield. To hit 12k, would need to stack multiple semi-annual snapshots (33101014, 33100764, 33100806, etc.) — deferred.

### Track C.3 (DONE)
- 663 incremental API calls completed in ~24 min (51 states × 13 new NAICS-3 codes).
- Pushed 6,867 new rows. US row count: 87,573 → 92,707 (delta +5,134 unique after dedup with existing).
- Total regional_cells: 179,409 → 186,640 (+7,231 across C.1 + C.3).

### Track B-014 (DONE — critical fix)
Added to `src/lib/cells.ts`:
- `regionalSlugToGeoId(country, slug)` — handles 4 patterns including city-overlay case
- `normalizeRegionalRow()` — regional row → Cell shape
- `getRegionalCell()` + `getRegionalCellVariants()`
- `getTopRegionalCells()` + `regionalCellUrl()` for sitemap

Modified:
- `getCellBySlug` fallback chain (US: cells_master → regional_cells → null; non-US: regional_cells → extrapolated_cells)
- `getCellVariants` same chain
- `src/app/sitemap.ts` parallel fetch of US + regional top cells (~15k URLs)

Verified live on dev server (with NODE_TLS_REJECT_UNAUTHORIZED=0 to bypass local SSL chain):
- /de/de21/restaurants → "Oberbayern" ✓
- /jp/jp-13000/restaurants → "Tokyo-to" ✓
- /br/br-sp/restaurants → "São Paulo" ✓
- /ca/ca-on/restaurants → "Ontario" ✓
- /us/us-06-037/restaurants → "Los Angeles County, California" ✓

### Track J.1 (DONE)
Sitemap rewrite: parallel `getTopCells(5000)` + `getTopRegionalCells(10000)`. Total ~15k URLs.

## CRITICAL FOUND BLOCKER — B-014 · RESOLVED 2026-05-17

**Discovery:** During Track J.1 (sitemap regen) investigation, found that
`src/lib/cells.ts` `getCellBySlug` for non-US countries:

```typescript
if (country !== "US") {
  return getExtrapolatedCell(country, industrySlug, selector);  // SKIPS regional_cells
}
```

**The 179,409 sub-national rows in `regional_cells` are NEVER queried
by the website.** Every URL like `/de/de212/restaurants`, `/jp/jp-13000/restaurants`,
`/br/br-sp/restaurants` falls straight through to `extrapolated_cells`
(country-level) and 404s (because DEU/JPN/BRA are anchor countries
absent from extrapolated_cells).

**Implication for the master plan:** Tracks B-I add rows to `regional_cells`
but those rows are invisible to users until the data layer is fixed. The
"+220k rows" target is hollow without this fix.

**Required fix (next session, ~3-4 hours):**

1. Add `getRegionalCell(country, geoId, industryId, selector)` to `cells.ts`
2. Update `getCellBySlug` fallback chain:
   - US: cells_master (state) → regional_cells (county) → extrapolated_cells
   - non-US: regional_cells → extrapolated_cells
3. Add slug → geo_id resolution for non-US geos (currently only `SLUG_TO_GEO_ID` for US states)
   - EU NUTS: lower-case (`de212` → `DE212`)
   - JP: `jp-13000` → `JP-13000`
   - BR: `br-sp` → `BR-SP`
   - city overlay: `city/new-york` → `US-CITY-new-york`
4. Update `getCellVariants`, `getTopCells` similarly
5. Add `getTopRegionalCells` for sitemap
6. Then Track J.1 sitemap regen actually works

**Severity:** HIGH — blocks all downstream value of Tracks B-I until fixed.

**Why not fixed this session:** ~3-4 hours of careful work touching ~5 files
plus testing; remaining context insufficient to land safely. Documented
clearly so the next session executes it first before any further ingest.

## Session log

- **2026-05-17 session start**: founder issued "go" signal after master plan accepted. A.1 + A.3 DONE (founder); A.2 + A.5 DEFERRED with Lorem Ipsum override. Beginning sequential execution from Track B.
- **2026-05-17 mid-session**: B DONE (+13 NAICS-3 codes, +4 industries); C.1 PARTIAL (+2,162 CA rows, table mystery solved via cube list); C.3 in background (~13 new codes × 51 states); discovered B-014 critical data-layer bug.
- **2026-05-17 late-session**: C.3 DONE (+6,867 US rows); B-014 RESOLVED (5 functions added, fallback chain rewritten, verified live on 5 URLs); J.1 DONE (sitemap regen). Total regional_cells: 179,409 → 186,640. Session ending after Track L handoff refresh.
- **2026-05-18 planning extension**: Founder shared strategic direction (city-disproportionate focus, optional hierarchy, neighborhoods for tier-1, taxes exploratory). Added 5 new Wave 2 tracks (M, N, O, P, Q) to master plan. Not yet executed — pending founder go signal.
