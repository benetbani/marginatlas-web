# MASTER CITIES-FIX-2 PROMPT — Margin Atlas

**Date authored:** 2026-05-25 (second cities pass after founder review of the first batch).
**Purpose:** A single executable prompt that fixes every issue the founder identified in today's second-round city-page review, plus the H1 mobile wrap, the homepage table redesign, the lingering navigator button bug, and the global "Industry" / "Category" terminology rename.

**Tone of execution:** No circumvention. Every target below has a hard pass / fail. The agent does not stop until every metric passes or until a specific blocker is escalated with file paths + line numbers.

**Forbidden moves:**
- Hand-waving "this is more or less how it works" when the founder specifically called out a bug.
- Hardcoding industry margins or saturation values when the cell database has the real numbers.
- Renaming URL slugs (`/industries/restaurants` stays; only UI labels change).
- Showing country-level numbers labeled as city numbers anywhere.
- Adding apologetic copy. The "How we know this" methodology link is sufficient.

**Required moves:**
- Every target has an explicit verifier (a script, a grep, or a list of pages to walk).
- Every per-city stat is sourced (hand-curated or extrapolated with a documented formula).
- Every "guiding word" gradient has a defined break table that lives in code, not magic numbers in components.
- Every rename of "Industry" → "Activity" updates the UI label only, never the data identifier.

---

## SECTION 0 — Canvas (what the founder said today)

Read these notes before doing anything else. Every section below is a faithful expansion of one of these complaints.

1. **Mobile H1 wraps to 3 rows.** The city-page `<h1>` (and likely the homepage hero too) is too aggressive on small screens. Should never wrap to 3 lines on a 375px viewport.
2. **H1 rotating words shift the whole headline.** Only the swapping word should change position. The static prefix should never move horizontally as the swap happens.
3. **Main homepage table is too simplistic.** The navigator form looks dumb. Needs a real design upgrade.
4. **The button still does not work** (the navigator submit button on the homepage). After multiple prior fixes.
5. **"Industry" should be renamed to "Activity"** everywhere in user-facing copy.
6. **"Category" should be renamed to "Sector"** everywhere in user-facing copy.
7. **Each city should have 8 stat cards inside the hero image, not 5.** Padding too generous on the current 5. Need 3 more metrics.
8. **Gross salary should be per MONTH, not per year.** Easier to grok.
9. **Each number must be paired with a guiding word.** Example: "HDI 0.735 — medium". A short descriptor that tells the user what the number means in plain language.
10. **Guiding words must be color-graded** dark red (very bad) to dark green (very good). Continuous gradient, not just five buckets.
11. **Most profitable activities are wrong.** The current list ranks sole-practitioner-by-design activities (consultants, freelancers) at the top — these have nominally high margins because they have no employees, no overhead, no real costs. Founder calls this "massively wrong". Those categories must be excluded.
12. **Least profitable activities all show 3% net margin.** Hardcoded fallback bug. We need real margins from our cell database, not a default.
13. **Saturation: businesses per THOUSAND people, not per million.** And drop the "country total" column (no purpose) and probably the "per million" column too.
14. **All of the above must be addressed in one coordinated pass** with the same quality + ambition as the previous master prompts.

---

## SECTION 1 — H1 mobile wrap (city page + homepage)

**Goal:** the H1 on every page never wraps to more than 2 lines at any viewport from 320px to 1920px.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 1.1 | City-page H1 line count at 375px | **<= 2 lines** for every city name in the database | screenshot pass on the 5 longest city names |
| 1.2 | Homepage H1 line count at 375px | **<= 2 lines** | screenshot pass |
| 1.3 | Font-size scale at 320px | text-3xl or smaller (no text-5xl on the smallest viewport) | grep |
| 1.4 | `text-balance` applied | yes, to every H1 | grep |
| 1.5 | Long city-name handling | hyphenation-aware via `hyphens: auto` AND `overflow-wrap: anywhere` as a last resort | grep |

### Required deliverables

- Audit every `<h1>` in `src/app/` and tighten the mobile font-size class. City-page H1 currently `text-4xl md:text-5xl lg:text-6xl`; needs `text-3xl md:text-5xl lg:text-6xl` plus `text-balance hyphens-auto`.
- Same audit on the homepage H1.

### Acceptance criteria

- All 5 targets pass.
- Founder loads `/cities/saint-petersburg`, `/cities/sao-paulo`, `/cities/santo-domingo` on a 375px mobile and sees a clean 1-line or 2-line title.

---

## SECTION 2 — H1 rotating-word static container

**Goal:** the homepage H1 has a rotating-word animation. The static prefix must NEVER move horizontally when the word swaps. Only the swapping word's position changes.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 2.1 | Static prefix horizontal position | constant across all rotating values | inspect during animation |
| 2.2 | Rotating word container width | **`min-width` set to the WIDEST candidate word** so the headline never reflows | grep |
| 2.3 | Rotating word vertical animation only | yes; horizontal position absolute or flex-fixed | inspect |
| 2.4 | No layout shift CLS contribution | CLS = 0 from the H1 rotation | Lighthouse |

### Required deliverables

- Find the homepage hero rotating-word component (likely in `src/app/page.tsx` or `src/components/HomepageHero.tsx`).
- Compute the widest candidate word at build time and set `min-width: ${widest}ch` on the container.
- Use `position: absolute` for the swapping word inside a positioned wrapper so the surrounding text never shifts.

### Acceptance criteria

- All 4 targets pass.
- Founder records a screen-cap of the homepage on desktop and on mobile; no horizontal jitter on the static prefix during rotation.

---

## SECTION 3 — Homepage navigator table redesign

**Goal:** the homepage main table (the navigator form) no longer reads as a generic SaaS form. It looks editorial, dense, and on-brand.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 3.1 | Form has a visual hierarchy beyond a flat grid | yes (grouped sections, dividers, or labeled blocks) | screenshot |
| 3.2 | Field labels have brand typography | font-display for label headers, not generic sans | grep |
| 3.3 | Form has a calm decorative element (e.g. atlas-paper background, faint compass rose, atlas-style border) | yes | screenshot |
| 3.4 | Field affordances are richer than plain `<select>` | combo / autocomplete with examples, OR plain select but with brand-styled chevron + spacing | inspect |
| 3.5 | The two primary actions ("Show me the numbers" + "Surprise me") sit in a clear hierarchy with proper button vocabulary | yes | inspect |
| 3.6 | Mobile layout: form sections stack cleanly without scroll trap | yes | screenshot at 375px |

### Required deliverables

- Redesign `src/components/NavigatorForm.tsx`. Keep the native HTML form submit (do not bring back JS routing).
- Group the 6 fields into 2 visual sections: "Where" (country, region, city) and "What" (sector, activity, size). Each section gets a small header.
- Add an atlas-paper background to the form card. Border and shadow match the cell pages.
- Replace the plain `<select>` chevron with the brand chevron.
- Ensure the primary button is visually distinct and the secondary "Surprise me" reads as a soft alternative.

### Acceptance criteria

- All 6 targets pass.
- Founder loads the homepage and the navigator no longer reads as "generic CRO".

---

## SECTION 4 — Navigator button: actually fix it this time

**Goal:** clicking "Show me the numbers" on the homepage successfully routes to a cell page. Across browsers, viewports, and cache states.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 4.1 | Click navigates within 2 seconds on a warm cache | yes | manual + smoke |
| 4.2 | Click navigates within 5 seconds on a cold cache | yes | manual + smoke |
| 4.3 | Form submission is a native HTML GET with `action="/api/go"` | yes (already in place; verify it actually deployed) | view-source |
| 4.4 | Fallback `/random` route when no activity is picked | yes (already in place; verify) | manual |
| 4.5 | Production deploy is the latest commit | yes | Vercel dashboard inspection |

### Diagnosis protocol (run BEFORE more code changes)

1. Open the deployed homepage. View page source. Search for `action="/api/go"`. Is the latest code actually shipped?
2. Open DevTools → Network tab. Click the button. What request fires?
3. If the request fires but stalls: read the Vercel function log for `/api/go`. Is the redirect being computed?
4. If no request fires: there is a JS error blocking the form. The Console tab will show it.
5. Hard-purge Vercel cache once. Hard-refresh browser. Retry.

### Required deliverables

- A passing run of `npm run audit:cell-smoke -- --base=https://www.marginatlas.com` after deploy.
- A short note in `docs/strategy/2026-05-25-navigator-button-postmortem-2.md` if a real bug is found.

### Acceptance criteria

- All 5 targets pass.
- Founder clicks the button 5 times from a cold incognito window and lands on a cell page each time.

---

## SECTION 5 — Terminology rename: Industry → Activity, Category → Sector

**Goal:** every USER-FACING string says "Activity" instead of "Industry" and "Sector" instead of "Category". Data identifiers, table names, URL slugs, and API params stay as `industry_id`, `/industries/...`, etc. (renaming those is a separate SEO project).

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 5.1 | "Industry" rendered to user | **0** occurrences in JSX text, button labels, headings, breadcrumbs, meta titles | grep + new prebuild gate |
| 5.2 | "industries" rendered to user (case-insensitive, in copy) | **0** | grep + gate |
| 5.3 | "Category" rendered to user | **0** | grep + gate |
| 5.4 | "Activity" / "Activities" replace every former Industry label | yes | grep |
| 5.5 | "Sector" / "Sectors" replace every former Category label | yes | grep |
| 5.6 | URL routes unchanged | `/industries/{slug}`, `/sectors/{slug}` keep working | curl smoke |
| 5.7 | Data field names unchanged | `industry_id`, `industry_name`, `INDUSTRY_BY_ID` stay | grep |
| 5.8 | Breadcrumb on cell page reads "Activity" not "Industry" | yes | inspect |
| 5.9 | Header nav still says "Industries" link text but routes to /industries | DEFERRED DECISION: see open question 1 below | n/a |

### Required deliverables

- A `scripts/verify_terminology.ts` prebuild gate that fails on `>Industry<`, `>Industries<`, `>Category<`, `>Categories<` rendered to user (with per-line `// allow-legacy-term` opt-out for headlines that intentionally use the SEO term).
- Find/replace pass across:
  - `src/components/NavigatorForm.tsx` (field labels)
  - `src/app/page.tsx` (browse-by-category section)
  - `src/components/Breadcrumb.tsx`
  - Every page metadata `title:` and `description:`
  - The pricing-page feature matrix
  - The paywall-modal microcopy lexicon
  - The "across the world" / "top countries" headings
- Decision on the header nav (open question 1).

### Acceptance criteria

- All 8 targets pass.
- New prebuild gate is wired and prevents regressions.
- Founder walks 10 random pages and never sees "Industry" or "Category" as a user-facing label.

---

## SECTION 6 — 8 stat cards on the city hero (the missing 3)

**Goal:** every city page hero overlays exactly **8** city-specific stat cards in a tight, low-padding strip. Each card has a number and a colored guiding word.

### The 8 cards (locked order, left to right, top to bottom)

| # | Card label | Source field | Notes |
|---|---|---|---|
| 1 | Metro population | `city.pop_m` | Already populated for 252 cities |
| 2 | Metro GDP | `city.gdp_b` | Already populated for 252 cities |
| 3 | Gross salary / month | `city.avg_gross_salary_usd_year / 12`, rounded | Founder fix: monthly, not yearly |
| 4 | HDI | `city.hdi` | Already populated |
| 5 | Gini | `city.gini` | Already populated |
| 6 | Cost of living | `city.cost_of_living_index` (new field, NYC=100) | NEW |
| 7 | Unemployment | `city.unemployment_pct` (new field) | NEW |
| 8 | Tourism / year | `city.tourist_arrivals_m` (new field, in millions) | NEW |

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 6.1 | Exactly 8 cards rendered per city | yes | inspect |
| 6.2 | Card padding | `p-2 md:p-2.5` (was `p-3 md:p-4` — too generous) | grep |
| 6.3 | Card font sizes | label `text-[9px] md:text-[10px]`; number `text-base md:text-xl` | grep |
| 6.4 | Card layout | 2 cols mobile, 4 cols tablet, 8 cols desktop | grep |
| 6.5 | Each card has a guiding word | yes (see Section 7) | inspect |
| 6.6 | Gross salary displayed per month | yes | inspect |
| 6.7 | 3 new fields populated for all 252 cities | hand-curate top 50, extrapolate rest | data audit |

### Required deliverables

- Extend `scripts/data/cities/enrich_city_metrics.py` to fill 3 new fields:
  - `cost_of_living_index` — Numbeo COL index, NYC = 100. Hand-curate top 50 cities; extrapolate the rest as `(country GDP/capita / 65000) * 100` with a tier bump.
  - `unemployment_pct` — country-level unemployment from World Bank; city-specific where national stats office publishes it.
  - `tourist_arrivals_m` — UNWTO international arrivals at the city level; for non-tourist cities, fall back to country / 5 as a rough estimate.
- Rewrite the city hero overlay to render 8 cards in an 8-col grid (responsive to 2/4/8).
- Tighten padding and typography on `<StatOverlayCard>`.

### Acceptance criteria

- All 7 targets pass.
- Founder loads 5 random cities and sees 8 cards overlaid on the photo, each with a number and a colored guiding word.

---

## SECTION 7 — Guiding-word gradient (the descriptor + color system)

**Goal:** every stat card has a one-word descriptor below the number, colored on a continuous dark-red-to-dark-green gradient depending on how "good" the value is for that metric.

### Color stops (continuous gradient)

```
0.00 → #7F1D1D (dark red, "very bad")
0.25 → #DC2626 (red, "bad")
0.50 → #CA8A04 (amber, "medium")
0.75 → #16A34A (green, "good")
1.00 → #14532D (dark green, "very good")
```

Interpolate linearly between these stops in HSL.

### Per-metric break tables (locked)

```typescript
// src/lib/cities/guiding_word.ts
export const BREAKS: Record<Metric, Array<[number, string]>> = {
  metro_pop_m:           [[0.5, "small"], [3, "mid-sized"], [10, "large"], [20, "mega"]],
  metro_gdp_b:           [[20, "small"], [100, "mid-sized"], [500, "large"], [1500, "powerhouse"]],
  gross_salary_usd_mo:   [[800, "low"], [2000, "below average"], [4000, "average"], [7000, "high"]],
  hdi:                   [[0.55, "very low"], [0.70, "low"], [0.80, "medium"], [0.90, "high"]],
  gini:                  [[55, "very high"], [45, "high"], [35, "moderate"], [28, "low"]], // INVERTED: lower is better
  cost_of_living_index:  [[40, "very cheap"], [60, "cheap"], [85, "moderate"], [120, "expensive"]],
  unemployment_pct:      [[15, "very high"], [10, "high"], [6, "moderate"], [4, "low"]], // INVERTED
  tourist_arrivals_m:    [[1, "niche"], [5, "popular"], [15, "tourist hub"], [30, "global magnet"]],
};
```

For each metric, the function maps `value` → `0.0-1.0` position on the gradient + picks the correct descriptor word from the break table. INVERTED metrics (Gini, unemployment, sometimes cost of living) flip the gradient direction so "low Gini" is dark green.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 7.1 | Descriptor word renders on every card | yes | inspect |
| 7.2 | Color matches the gradient stop for the value | yes | screenshot diff |
| 7.3 | Direction is correct for inverted metrics | yes (low Gini = green, high unemployment = red) | unit test |
| 7.4 | Word is one or two words max | yes | grep |
| 7.5 | Color contrast against the cream-50/95 backdrop passes WCAG AA | yes | a11y test |

### Required deliverables

- `src/lib/cities/guiding_word.ts` with `BREAKS` table + `getGuidingWord(metric, value)` → `{ word, color }`.
- Update `StatOverlayCard` to render `{value}` then `{guidingWord}` underneath, colored.

### Acceptance criteria

- All 5 targets pass.
- Founder walks Moscow, NYC, Lagos, and Reykjavik. Each card on each city has a sensible word + color.

---

## SECTION 8 — Most profitable activities: filter out sole-practitioner-by-design

**Goal:** the "top 5 most profitable activities" list never ranks consultancy, freelance, sole-trader-only activities at the top. Those have nominally high margins because they have no employees, no overhead, no inventory — not because the business model is "more profitable".

### Filter rules

Drop any activity from the ranking where:
- `is_sole_practitioner === true` in the industry taxonomy, OR
- The activity name matches the pattern: `consult|freelance|independent|sole-trader|solo|contractor|gig`, OR
- The industry has `audience !== "smb_core" && audience !== "smb_friendly"` (corp_only and mixed_caution drop out).

Plus exclude the bottom of the size spectrum: activities where the typical firm has < 2 employees on average.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 8.1 | Sole-practitioner-by-design activities in top 5 | **0** | inspect Top 5 on 5 random cities |
| 8.2 | Filter is documented in code | yes (constant + comment) | grep |
| 8.3 | Filter does not break the bottom 5 (least profitable) | yes — the LEAST profitable bucket can include sole-practitioner if their net margin is genuinely low | inspect |

### Required deliverables

- Add a `solo_design: boolean` flag to the industry taxonomy where applicable.
- Update `src/components/cities/TopProfitableActivities.tsx` to filter using the flag + the name pattern + the audience field.

---

## SECTION 9 — Least profitable activities: use real margins, not the 3% fallback

**Goal:** the bottom-5 ranking shows REAL net margins from our cell database, not a hardcoded fallback. If we don't have a real margin for an industry, exclude it entirely; never show "3%".

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 9.1 | Any row showing `3.0%` net margin | **0** | inspect |
| 9.2 | Bottom 5 shows real measured margins | yes | inspect |
| 9.3 | Activities with no real margin data excluded from BOTH lists | yes | inspect |
| 9.4 | Net margin source is `industry_margins.json` `net_margin` field where present, else cells_master per-cell median where available | yes | code review |

### Required deliverables

- Inspect `src/lib/finance/industry_margins.json` and confirm which rows have real `net_margin` values vs which fall back to `default_fallback`.
- If most rows fall back: extend the seed with hand-curated margins for the 60 industries already covered by `REVENUE_PER_FIRM_BOUNDS`. Use IBISWorld + sector-research averages.
- Update `TopProfitableActivities` to drop any row where the margin source is the default fallback.

### Acceptance criteria

- All 4 targets pass.
- Founder loads `/cities/moscow` and the Least Profitable list shows a real spread (e.g. -2% to 6%), not five rows at 3%.

---

## SECTION 10 — Saturation: per thousand, drop noise columns

**Goal:** the saturation table on every city page expresses density per 1,000 people (not per million), and drops the columns the founder called noise.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 10.1 | Density unit | businesses per **1,000** people | inspect |
| 10.2 | Table columns | Activity name + density per 1,000 ONLY | inspect |
| 10.3 | "Country total" column removed | yes | grep |
| 10.4 | "Per million" column removed | yes | grep |
| 10.5 | Per-1,000 values for typical-developed-economy seed | hairdressers ~3.5, restaurants ~3.2, cafes ~1.8, etc. | inspect |

### Required deliverables

- Rewrite `src/components/cities/MostSaturatedActivities.tsx` to:
  - Change `densityPerMillion` to `densityPerThousand` and divide all seed values by 1000.
  - Drop the "estimated country total" column.
  - 2-column table only: Activity | per 1,000 people.

### Acceptance criteria

- All 5 targets pass.

---

## SECTION 11 — Final integration sweep

After sections 1-10 are individually green:

- Run the full prebuild chain. All 10 (now 11 with the new terminology gate) prebuild gates pass.
- Walk 5 random cities, 3 sectors, the homepage, the pricing page. Confirm:
  - 8 stat cards overlay each city hero with guiding words + correct colors
  - No "Industry" / "Category" labels in user-visible text
  - Homepage H1 doesn't wrap to 3 lines on mobile
  - Homepage rotating word doesn't push the static text around
  - Homepage table looks editorial, not a generic form
  - Show-me-the-numbers button works from cold incognito
- Run the cell smoke against production.
- Commit + push the integration summary.

### Acceptance criteria for the whole prompt

- **All 10 sections green.**
- **All regression tests passing.**
- **No new prebuild violations.**
- **Production smoke green for 24 hours.**

---

## Execution order

1. Section 4 (button) — every other test depends on the site actually loading cells.
2. Section 5 (terminology rename) — touches a lot of files; do it before adding new strings.
3. Section 6 (8 cards + new fields) — depends on Section 5 for naming.
4. Section 7 (guiding words) — depends on Section 6 for the 8 cards.
5. Section 8 (filter sole-practitioner) — independent.
6. Section 9 (real margins) — depends on Section 8 filter.
7. Section 10 (saturation per-thousand) — independent.
8. Section 1 (H1 wrap) — independent, can ship in parallel.
9. Section 2 (rotating word) — independent.
10. Section 3 (table redesign) — depends on Section 5 for new labels.
11. Section 11 (integration sweep).

---

## Open questions for founder (block execution until answered)

1. **Header nav link text.** "Industries" appears in the top nav. Rename to "Activities"? Or keep the nav as "Industries" (matches the URL slug, less disruptive) and rename only body copy? Recommend: rename nav too — consistency over SEO equity for a nav link.

2. **Cost-of-living for non-tourist hubs.** For Lagos, Karachi, Kinshasa we have no Numbeo data. Two options:
   - Extrapolate from country GDP/capita (less accurate but covers all 252 cities).
   - Leave blank and show only 7 cards on those cities (honest but breaks the 8-card grid).
   Recommend: extrapolate, with the existing source-footer disclosing the fallback.

3. **Tourism for non-tourist cities.** Same question. Recommend: extrapolate from country arrivals / 5, mark as "estimate" in the source.

---

## What this prompt is NOT

- Not a wishlist.
- Not "we'll iterate later".
- Not permission to keep showing 3% margins or per-million saturation.

Every target has a hard pass / fail. If a value cannot be hit (e.g. tourism data is genuinely unfindable for a specific city), escalate with the city slug, every source tried, and a concrete request — never silently fall back to a default that misrepresents the data.

---

**End of prompt.**

**Founder: approve to execute, or push back on the open questions in section 11 first.**
