# MASTER COUNTRY-PAGE REBUILD PROMPT — Margin Atlas

**Date authored:** 2026-05-25.
**Trigger:** Founder reviewed `/al` (Albania) and called the country page "irrelevant" end-to-end. Same pattern repeats on every country page. Plus an unresolved H1 rotating-word jitter on the homepage.
**Scope:** `/[country]/page.tsx` and every component it pulls in. Plus the homepage hero rotator. Everything else stays as it is.

**Tone of execution:** No circumvention. Every founder complaint has a named root cause below and a hard pass/fail target. The agent does not stop until every metric verifies or until a specific blocker is escalated with file paths and line numbers.

---

## SECTION 0 — Canvas (what the founder said today, verbatim summary)

1. **"Industries covered 44, cities ranked 0 — nobody cares."** The 5-tile hero strip is filled with internal coverage metadata, not facts a user actually wants.
2. **"Median typical revenue $41M — completely unrealistic."** The number is real-data-shaped but it is wrong by 1-2 orders of magnitude.
3. **"Top SMB sector — just wrong."** The "top sector" tile pulls the first entry from `topIndustries`, which itself is broken (see #4).
4. **"Average software development company in Albania makes $43M."** Same root cause as #2 — `getTopIndustriesForCountry` for non-US orders by `predicted_rev_per_firm DESC` and keeps the MAX value per industry, not the median. Plausibility suppression filters individual catastrophic rows but does not change the sort order or the max-keeping aggregation.
5. **"Corporate income tax" terminology is wrong for SMBs.** Most small businesses are sole proprietors / pass-through / micro-LLCs. Headline CIT is the wrong frame.
6. **"Employer social rate 16.9% — that doesn't work that way."** Too granular, wrong frame for a country card.
7. **"Owner take vs pre-tax 85% — unrealistic."** Assumes corporate form, ignores payroll tax, VAT cascade, regional surcharges, sole-prop social contributions.
8. **"Rate source — kind of specific, which you should never mention."** This is `"Country-specific" / "Regional benchmark fallback"` — internal data-quality metadata. Must not be a user-facing tile.
9. **"Regions are not even clickable."** The regions list IS rendered with `<Link>` but visually does not read as clickable, and the destinations on under-covered countries are nearly empty.
10. **"Cities not clickable. I'm clicking at Lyon."** Lyon is being silently dropped from `CountryCityShortcuts` because `getCellBySlug('fr','lyon','restaurants')` returns null. Or the user is clicking it in the regions list expecting city behavior.
11. **"Whole site has this persistent issue."** Need a site-wide pass to find every "count / metadata / fake-statistic" tile and replace it with information that matters to a person evaluating starting a business.
12. **"H1 popping up strangely."** Screenshot shows "How much does a [pharmacy] make in [New York]?" with the two rotating words rendered absolutely-positioned and visually dislocated from the static prefix — "New York" wraps and floats next to the trailing `?`.
13. **Founder's requested replacements for the hero tiles:**
    - Nominal GDP per capita
    - Average monthly salary
    - Net wealth per citizen
    - "Statistics that would actually matter for someone looking at this kind of page" — i.e. customer-economics for a small-business operator.

---

## Forbidden moves

- Hand-waving "this is more or less how it works" when the founder named the bug.
- Renaming URL slugs. `/[country]/[geo]/[industry]` and `industry_id` data fields stay exactly as they are.
- Removing the regions list to "fix" the clickability complaint. The regions list is correct in concept; the destinations need filling, the visual affordance needs strengthening.
- Adding "Coming soon" / "Estimated" / "Best-effort" / "Beta" / "Preview" / "Approximate" anywhere. R-016 still applies.
- Adding source-agency names ("World Bank", "Eurostat", "OECD", "Credit Suisse", "Numbeo", "Wage Indicator", etc.) to any user-visible string. R-002 still applies.
- Adding em-dashes to source files. R-020 still applies.
- Adding `dark:` selectors anywhere. Atlas is light-only.
- Touching `app/api/*`, `lib/supabase/*`, `lib/budget.ts`, the cell-page submit mechanic, or the Visual Upgrade §1 in-flight branch.
- Removing the H1 rotation entirely. The rotation is core brand. Only fix the layout bug.

---

## Required moves

- Every "count" tile is replaced or reframed into something a user actually cares about.
- Every figure on the page has a verifier: a documented derivation, a sanity floor, or a hard fallback to an empty state.
- Every region listed on the country page leads to a page that either has real data OR shows the editorial empty state (never blank / never broken).
- Every city listed leads to a real cell page.
- The H1 rotator does not push the static prefix around AND does not visually break the line on any viewport from 320px to 1920px.
- Site-wide audit script flags any other "count-of-things" tile, internal-metadata tile, or fake-statistic tile.

---

## SECTION 1 — Hero tiles rebuild (the 5-tile at-a-glance row)

**File:** `src/components/CountryAtAGlance.tsx`.
**Goal:** Replace all 5 tiles with country-economics that a person evaluating starting a small business actually wants.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 1.1 | Tile 1: Nominal GDP per capita | USD, current-year value, from `brain-skeleton/world_bank_gdp_per_capita.csv` | grep + spot-check 5 countries |
| 1.2 | Tile 2: Average monthly salary | USD, gross, monthly, computed as `avg_gross_salary_usd_year / 12` from city/country aggregate; fallback formula = GDP/cap × salary_share_of_GDPpc table (~0.45 OECD median, ~0.30 EM median, ~0.18 LIC median) | spot-check 10 countries against external reference |
| 1.3 | Tile 3: Net wealth per adult | USD, latest year, from a hand-curated table `data/economics/net_wealth_per_adult_usd_v1.json` seeded from public reports (do not name the source in UI) | grep |
| 1.4 | Tile 4: Self-employment share | % of workforce that is self-employed / informal-included, from `brain-skeleton/informal_share.csv` + ILO STAT supplement | grep |
| 1.5 | Tile 5: Days to start a business | typical Sole-Trader days for the country from `data/legal/business_formation_costs_v1.json` (fallback: median of LLC days if no Sole-Trader tier; fallback 2: regional median; fallback 3: hide tile) | grep |
| 1.6 | No tile shows a count of things we cover | zero | grep for "industries covered" or "cities ranked" or "industries we cover" |
| 1.7 | No tile shows internal metadata | zero | grep for "rate source", "data-quality", "fallback", "verified" in any tile copy |
| 1.8 | Each tile has a guiding word in atlas-gradient color (dark red to dark green) per the existing `src/lib/cities/guiding_word.ts` system | yes | grep |
| 1.9 | When data is missing for a tile, the tile renders an editorial em-state ("not yet measured") NOT a zero / "n/a" / 0% | yes | spot-check 5 low-coverage countries |
| 1.10 | Below the 5 tiles: drop the "Full scorecard" link to `/coverage/{iso}` (it's been the metadata-soaked page); keep only the "Snapshot" sub-line | yes | grep |

### Why these five

| Tile | Why it matters for a small-business prospector |
|---|---|
| GDP per capita | Sets the rough purchasing-power ceiling for any business's customers |
| Avg monthly salary | Tells the operator (a) what to pay employees and (b) what local customers can afford on a typical purchase |
| Net wealth per adult | Tells the operator how much savings the local customer base has (high salary + low wealth → cash-flow customers; high wealth → premium goods market) |
| Self-employment share | Tells the operator whether they will be joining a sea of competitors or a relatively concentrated market |
| Days to start | First operational question every prospector asks; ties into the business-formation data we already have |

### Required deliverables

- Rewrite `CountryAtAGlance.tsx` with the new 5 tiles. Each tile imports its data from a single typed helper `src/lib/economics/country_metrics.ts` so the source is one place.
- New file `src/lib/economics/country_metrics.ts` exporting `getCountryEconomicsSnapshot(iso2)` → `{ gdpPerCapita, avgMonthlySalary, netWealthPerAdult, selfEmploymentShare, daysToStart }`. Each field has its own fallback chain documented in the source.
- New file `data/economics/net_wealth_per_adult_usd_v1.json` with ~70 hand-curated entries.
- Plumb guiding words through each tile.

### Acceptance criteria

- All 10 targets pass.
- Founder loads `/al`, `/fr`, `/de`, `/us`, `/jp`, `/ng`, `/br` and sees 5 informative tiles on every page.

---

## SECTION 2 — Tax overlay strip rebuild (the 4-tile second row)

**File:** `src/components/CountryStatsStrip.tsx`.
**Goal:** Replace the corporate-form tax framing with SMB-relevant cost-of-doing-business framing.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 2.1 | Drop "Corporate income tax" tile | replaced | grep |
| 2.2 | Drop "Employer social rate" tile | replaced | grep |
| 2.3 | Drop "Owner take vs pre-tax" tile | replaced | grep |
| 2.4 | Drop "Rate source" tile | removed entirely | grep |
| 2.5 | New tile 1: "Headline VAT / GST" | standard rate from country_rates_2024.json | grep |
| 2.6 | New tile 2: "Typical small-business tax" | If country has a presumptive / micro / simplified regime (most do): show that effective rate; else show the standard sole-trader marginal rate at median revenue. Document the table in `src/lib/tax/smb_effective_rates.ts`. | grep |
| 2.7 | New tile 3: "Time to launch" | median days from formation data | grep |
| 2.8 | New tile 4: "Inflation, last 12mo" | CPI year-over-year from `brain-skeleton/world_bank_cpi.csv` (latest) | grep |
| 2.9 | Drop the long "Headline rates only" footnote | replace with one short line: "Operators rarely pay headline rates. Open a cell page for the full after-tax breakdown." | grep |
| 2.10 | Section title "Tax overlay" → "Cost of doing business" | grep |

### Required deliverables

- Rewrite `CountryStatsStrip.tsx`.
- New file `src/lib/tax/smb_effective_rates.ts` with ~70 entries: `{ iso2: { regime: "micro" | "simplified" | "presumptive" | "standard", effective_rate: number, local_name: string }}`. Local name examples: "Régime micro-entreprise" (FR), "Forfettario" (IT), "Simplificado" (ES), "Lump-sum" (PL), "Simples Nacional" (BR).
- Add the local regime name as the tile's sub-line ("Régime micro-entreprise — 22% effective").

### Acceptance criteria

- All 10 targets pass.
- A French operator sees Régime micro on `/fr`. A Brazilian operator sees Simples Nacional on `/br`. Etc.

---

## SECTION 3 — Top SMB industries — fix the $43M bug

**Files:** `src/lib/cells.ts` (lines 754-820, function `getTopIndustriesForCountry`), `src/app/[country]/page.tsx` (the call site).
**Goal:** No country page ever shows a "typical revenue" figure that is 5x+ above the real-world median for that activity in that country.

### Root cause (already diagnosed, do not re-investigate)

For non-US path:
- The Supabase query orders by `predicted_rev_per_firm DESC` and limits to 200 rows.
- The aggregation loop keeps the **MAX** revenue per industry_id (`if (!seen.has(id) || (seen.get(id) || 0) < rev) seen.set(id, rev)`).
- FX correction and plausibility suppression are applied AFTER this max-aggregation. Plausibility suppression caps individual catastrophic values but the function still returns the highest non-catastrophic value per industry_id, not a typical one.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 3.1 | Aggregation switches from MAX to MEDIAN per industry_id | yes | grep |
| 3.2 | Order by `n_enterprises DESC` (not revenue) to surface the most-relevant SMB industries first, not the highest-revenue tail | yes | grep |
| 3.3 | Every returned row has its `revenue_per_firm` cross-checked against `industry_baselines.ts` × country GDP-per-capita scaling; if the value exceeds 3× the baseline expected for the country, the row's `revenue_per_firm` is nulled (the row stays in the list, the number is hidden) | yes | unit test |
| 3.4 | Every returned row has a hard floor: if `n_enterprises` < 50 for that country × industry, the row is dropped (statistical noise) | yes | grep |
| 3.5 | Albania `/al` no longer shows software development at $43M | verify in production | manual |
| 3.6 | Founder loads `/al`, `/ng`, `/vn`, `/ke`, `/eg`, `/pk` and every typical-revenue figure on the page passes the smell test | manual | spot-check |
| 3.7 | Unit test: `tests/cells/top_industries_plausibility.test.ts` with 12 spot-check assertions across diverse countries | yes | run test |

### Required deliverables

- Edit `getTopIndustriesForCountry` to:
  1. Replace the `seen.set(id, rev)` max-keeping pass with an array-collecting pass and then take the median.
  2. Order the final list by `n_enterprises DESC`.
  3. Add the baseline cross-check.
  4. Add the `n_enterprises >= 50` floor.
- New unit test under `tests/cells/`.

### Acceptance criteria

- All 7 targets pass.
- The unit test goes into the prebuild chain as gate #12.

---

## SECTION 4 — Regions and cities: make them visibly clickable AND lead somewhere real

**Files:** `src/app/[country]/page.tsx` (regions list, lines 194-211), `src/components/CountryCityShortcuts.tsx`.
**Goal:** Every region tile and every city tile renders as visually clickable AND navigates to a page that has real data or a graceful editorial empty state. No tile is shown if its destination is empty.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 4.1 | Region tile visual affordance: border thickens on hover, atlas-700 caret appears on the right edge, cursor changes to pointer (already implicit but verify) | yes | grep + screenshot |
| 4.2 | Region tile sub-line: shows "{n} activities" if any cells exist for that region; else shows "Overview" (no cell count) | yes | grep |
| 4.3 | Region click destination `/{iso}/{region-slug}` page MUST render with the new editorial empty state component (`src/components/empty/RegionUnmappedEmpty.tsx`) when no cell data exists, NOT a 404 and NOT a blank page | yes | smoke-test |
| 4.4 | City tile (CountryCityShortcuts): every rendered tile leads to a cell page that returns 200, never 404 | yes | smoke-test |
| 4.5 | If a city has no resolvable cell, it is silently dropped (already happens — verify still holds) | yes | grep |
| 4.6 | Lyon specifically resolves: `/fr/lyon/restaurants` returns 200 with real data | yes | smoke-test on production |
| 4.7 | Default industry for "Top cities" tiles changes from hardcoded "restaurants" to the country's actual top SMB industry from §3 | yes | grep |
| 4.8 | Region tile: drop the generic `text-sm` look and bump to the same paper-card styling used elsewhere on the country page | yes | grep |

### Required deliverables

- Audit Lyon specifically. If `getCellBySlug('fr','lyon','restaurants')` returns null, find out why and ship the fix. Likely cause: city slug mismatch with `regional_cells` or `extrapolated_cells`. Possibly Lyon resides under `auvergne-rhone-alpes` parent geo, not directly under `fr/lyon`. The fix is either:
  - Add Lyon-as-direct-city extrapolation row, OR
  - Have `CountryCityShortcuts` resolve via the city's parent admin1 + neighborhood scheme when no direct cell exists.
- Add `src/components/empty/RegionUnmappedEmpty.tsx`. Editorial empty state: short paragraph explaining what this region is, a link back to the country page, and the navigator form scoped to that region.
- Wire it into `src/app/[country]/[geo]/page.tsx` to render when no cell data exists.

### Acceptance criteria

- Founder loads `/fr`, clicks Lyon in the cities strip, lands on a page with real Lyon restaurant data. Same for Bordeaux, Marseille, Toulouse, Nice.
- Founder loads `/fr`, clicks "Auvergne-Rhône-Alpes" in the regions list, lands on a page with either real data OR the new editorial empty state.

---

## SECTION 5 — Top SMB industries section copy + tile design

**File:** `src/app/[country]/page.tsx` lines 138-184 (the `industry-mix-grid` section).
**Goal:** The "Top small-business industries in X" section is rebuilt to be (a) accurate (depends on §3) and (b) more useful per-tile.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 5.1 | Each tile shows: sector icon, activity name, "{N} firms" (count of enterprises, not revenue), typical revenue per firm (now correct from §3) | yes | grep |
| 5.2 | Tile order = by n_enterprises DESC (not by revenue) | yes | grep |
| 5.3 | Section title changes from "Top small-business industries in X" to "What people actually run in X" | yes | grep |
| 5.4 | Section subtitle: replace "Most-covered SMB categories" with "Activities ranked by how many businesses operate them locally." | yes | grep |
| 5.5 | Tile sub-line for typical revenue uses the same guiding-word system as §1 (dark-red to dark-green) keyed on percentile vs OECD median for that activity | yes | grep |
| 5.6 | Tile that fails the §3 plausibility floor shows count only, no revenue | yes | grep |

### Acceptance criteria

- Section reads as a curated index of "what people do here", not a leaderboard of biggest revenues.

---

## SECTION 6 — Homepage H1 rotating-word layout bug

**Files:** `src/components/HomepageHero.tsx`, `src/components/RotatingWords.tsx` (plural).
**Goal:** The H1 never visually breaks: the static text "How much does a … make in …?" stays on one or two lines depending on viewport, and the two rotating words appear inline at their natural positions, never floating offset.

### Root cause (already diagnosed)

`RotatingWords` (the plural component used in HomepageHero) renders the active word as `absolute left-1/2 -translate-x-1/2` over an invisible spacer. When the H1's outer line breaks mid-sentence (e.g. the second rotator pushes onto a second line at certain viewports), the absolutely-positioned word is positioned relative to its `inline-block` span, which can fall on a different line than the surrounding text after wrap. Result: "New York" appears on a separate row from "make in", floating next to the `?`.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 6.1 | At 320px, 375px, 414px, 768px, 1024px, 1440px viewports, the H1 wraps to ≤ 3 lines with no rotator dislocated | yes | screenshot pass |
| 6.2 | Rotating word never appears on a different visual line from its surrounding inline static text | yes | screenshot |
| 6.3 | Static prefix and trailing `?` are positionally stable across rotations (no horizontal jitter) | yes | record |
| 6.4 | H1 mobile font-size capped: `text-3xl sm:text-5xl md:text-6xl` (drop from `text-[40px] sm:text-[64px]` which is too aggressive on small viewports) | yes | grep |
| 6.5 | `text-balance` applied | yes | grep |
| 6.6 | `whitespace-nowrap` on each rotating word's container so a multi-word rotator like "software studio" or "New York" never breaks mid-word | yes | grep |
| 6.7 | The rotator's invisible spacer + active word both render INSIDE the same inline-block, with no `position: absolute` escape from the line box | yes | inspect |

### Required deliverables

- Rewrite `RotatingWords.tsx` so the active word is rendered inside a stable inline-block with `whitespace-nowrap`. Replace the `absolute left-1/2 -translate-x-1/2` pattern with a grid stack: spacer in the cell, active word also in the cell (same grid cell), both contained.
  Pattern:
  ```
  <span class="relative inline-grid grid-flow-row whitespace-nowrap align-baseline">
    <span class="invisible col-start-1 row-start-1">{widest}</span>
    {words.map((w, idx) => (
      <span class="col-start-1 row-start-1 transition-opacity duration-300"
            style={{opacity: idx === i ? 1 : 0}}>{w}</span>
    ))}
  </span>
  ```
  This keeps the active word in the line box of the surrounding text. The grid stack means all candidate words share the same cell — only opacity changes. No absolute positioning, no line-box escape.
- Adjust `HomepageHero.tsx` H1 sizing.
- Verify the same component is used everywhere (city page uses `RotatingWord` singular — leave that one alone unless it has the same bug).

### Acceptance criteria

- Founder records a screen-cap of the homepage on mobile + desktop. No rotator floats.

---

## SECTION 7 — Site-wide "useless tile" audit

**Goal:** The persistent issue the founder named — "fake stats / counts of things / internal metadata as user-facing content" — gets a systematic sweep across the whole site, not just the country page.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 7.1 | Build a script `scripts/audit/find_useless_tiles.ts` that walks every component under `src/components/` and `src/app/` and flags labels matching: `/\b(industries|cities|countries|regions|sectors)\s+(covered|ranked|tracked|listed|indexed)/i`, `/\brate source\b/i`, `/\bfallback\b/i`, `/\bdata.quality\b/i`, `/\b(verified|measured|estimated|approximate)\b\s*[:=]/i` | runs clean except for whitelisted exceptions | run script |
| 7.2 | For each flagged tile, the audit emits a CSV at `coverage/useless-tiles.csv` listing `{file, line, label, current_value_pattern}` | yes | grep |
| 7.3 | The CSV is reviewed and every flagged tile is either: (a) replaced with a content-bearing tile, (b) moved to `/coverage/{iso}` where data-quality metadata belongs, or (c) explicitly whitelisted with a `data-keep-useless` comment + reason | yes | manual review |
| 7.4 | The script is added to the prebuild chain as gate #13, failing the build on any new un-whitelisted match | yes | run prebuild |

### Required deliverables

- New audit script.
- New CSV report.
- Per-flagged-tile resolution (replace / move / whitelist).
- Prebuild gate.

### Acceptance criteria

- No country page, city page, or cell page renders an internal-metadata tile.
- The script is wired into `package.json`'s prebuild and fails on any new violation.

---

## SECTION 8 — Quality checks (mandatory after every section)

After every section commit:

1. `npx tsc --noEmit` — zero errors.
2. `npm run prebuild` — all 10 (becoming 13) gates green.
3. `npm run build` — production build succeeds.
4. `npm run audit:cell-smoke` — cell-page smoke against production passes.
5. Screenshot before + after into `docs/country-page-rebuild-screenshots/`.
6. Manual eyeball on `/al`, `/fr`, `/de`, `/us`, `/jp`, `/ng`, `/br`, `/pk`, `/eg`.

After the whole rebuild is shipped:

7. `npm run audit:reality` — v24/v25 reality audit still green.
8. `npm run audit:monetization` — coverage HTML report still green.
9. 24h production smoke — load 10 random country pages, no JS errors in Sentry.
10. Lighthouse on `/`, `/al`, `/fr/lyon/restaurants` — CLS = 0, LCP < 2.5s.

---

## SECTION 9 — Execution order (sequential)

This is sequential because §1, §2, §3 all touch the country page in overlapping regions, and §3 must land before §5 (which depends on §3's output shape).

1. **§3** Fix `getTopIndustriesForCountry` first. This unblocks everything else. Single commit.
2. **§1** Hero tiles rebuild + new `country_metrics.ts` lib + `net_wealth_per_adult_usd_v1.json`. One commit.
3. **§2** Tax overlay strip rebuild + `smb_effective_rates.ts`. One commit.
4. **§5** Top industries section copy + tile design. One commit.
5. **§4** Regions + cities clickability + empty-state component + Lyon fix. One commit per sub-fix (~3 commits).
6. **§6** Homepage H1 rotator layout fix. One commit.
7. **§7** Useless-tile audit. Script + CSV + resolution + gate. Two commits (script-first, then resolutions).
8. **§8** Final quality checks. Zero new commits expected.

---

## SECTION 10 — Acceptance criteria (the founder's pass/fail)

The whole rebuild is considered shipped when:

- Founder loads `/al`, `/fr`, `/de`, `/us`, `/jp`, `/ng`, `/br` and reports each page is "actually useful".
- No "industries covered N / cities ranked N" tile visible anywhere on the site.
- No "rate source" or "fallback" or "data quality" tile visible anywhere.
- No country page shows a typical-revenue figure that the founder calls "made up".
- Every region and every city listed is visibly clickable and leads to a page that loads.
- Homepage H1 rotation does not visually break on any viewport from 320px to 1920px.
- The 13-gate prebuild chain is green.
- 24h production smoke clean.

---

## SECTION 11 — Out-of-scope (deferred)

- Per-region data backfill (would require ingesting subnational stats office data per country; that is a quarter-long pipeline project, tracked separately).
- Adding net wealth Gini, household disposable income, and savings rate (would be Phase 2 of country economics; doc them but don't ship them in this pass).
- The visual upgrade §1 (shadcn foundation) was already in flight — do NOT entangle this work with that branch. Land this rebuild on `main` first; the shadcn pass can re-skin the new tiles in a later commit.
- The data-expansion research deliverable (Africa SME sourcing, micro-coverage, AOV, breakeven) — separate doc, separate pass.

---

## Approval gate

This is the design. Before any code lands:

1. Founder reviews this document.
2. Any section the founder wants to change, drop, or add gets edited inline.
3. Founder approves with "execute" (the established pattern).
4. Then, and only then, the agent starts at SECTION 3 (the bug fix that unblocks everything).

Approval requested.
