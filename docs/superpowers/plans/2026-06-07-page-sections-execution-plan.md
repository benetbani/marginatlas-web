# Page-Sections Execution Plan (autonomous, sequential, RAM-safe)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. One fresh subagent per step; the controller commits, pushes, verifies on Vercel, screenshots, fast-forwards, confirms live, then moves to the next step. Steps use `- [ ]` tracking.

**Goal:** Execute every page-section decision from `docs/superpowers/specs/2026-06-07-page-sections-design.md`, in sequence, autonomously, on branch `reform-v2/palette-brick`, shipping each step to production before the next.

**Architecture:** Subagent builds (edits + light gates only, never a full build), controller ships via Vercel. No new infrastructure; everything composes the live board kit, the break-in score, the archetype + trust modules, and the existing routes.

**Tech stack:** Next.js 15.5 App Router, React 19, TypeScript, Tailwind, Supabase, Vercel.

---

## Operating rules (apply to EVERY step)

**RAM budget (the 600MB rule).** The local machine never does heavy compilation. Subagents and the controller run ONLY: `git`, single-file `npx tsx scripts/<gate>.ts` (one modest node process), `curl`/`Invoke-WebRequest` (HTML checks), and at most one targeted screenshot. The full Next.js build + `tsc` + the 29-gate `prebuild` run **on Vercel in the cloud**, triggered by the push. NEVER run `npm run build`, `npm run prebuild`, or `npx tsc` locally (each needs multiple GB and OOMs). Prefer HTML-content extraction over screenshots; when a screenshot is needed use the mobile or a targeted shot, never a giant desktop full-page render (it OOM'd once).

**The per-step loop (the quality checks):**
1. **Build (subagent):** dispatch the step's prompt. Subagent edits files, runs the light per-file tsx gates it can, self-reviews, and does NOT commit, NOT build/tsc/prebuild. For any step that introduces NEW modeled numbers, the subagent must also produce a dry-run table and confirm every value is in-bounds and plausible.
2. **Stage precisely (controller):** `git add` only the step's named files (never `git add -A`, never `git add scripts/` wholesale). Show `git diff --cached --name-only` and confirm the exact set.
3. **Commit + push** to `reform-v2/palette-brick`.
4. **Vercel gate (cloud):** wait ~300s; `vercel ls` status. If `Error`, `vercel inspect <url> --logs` -> find the failing gate/tsc error -> fix forward (a small fix subagent or a direct edit) -> re-push. The Vercel build is the real `tsc` + 29-gate check.
5. **Verify content:** warm the changed routes with the bypass header, extract the key strings via regex (section present, no fake/duplicate/negative values), and take one targeted/mobile screenshot to eyeball layout. For data changes, re-confirm no visibly-wrong number.
6. **Ship:** `git fetch origin main`; if `git log --oneline <branchTip>..origin/main` is 0, `git push origin reform-v2/palette-brick:main`; else stop and reconcile.
7. **Confirm live** on `marginatlas.com` (follow the www redirect), then mark the step done and move to the next.

**Standing bars (never violated):** no visibly-wrong numbers (dash, never a wrong figure); tokens only (no raw hex/px/ms); no em-dashes or source-agency names in user-visible source; no URL slug renames; graceful self-omit on missing data; clean-data-tool register (numbers lead, minimal prose, warm only in short copy); precise per-file staging.

**If a step is BLOCKED** (cannot resolve after a fix attempt): log it in this plan's progress section, leave the branch == main (do not ship a broken step), and CONTINUE to the next independent step. Do not halt the whole sequence for one blocked item.

**Bypass token for preview verification:** `IyEPkYA7KNev2bootY3kFz5O1vEltR8o`.

---

## Phase 1 - Quick clarity wins (low risk, high value)

### Step 1.1 - Business page: cut the prose, reorder the bottom tail
**Files:** `src/app/[country]/[geo]/[industry]/page.tsx`; possibly `src/lib/scores/cell_board.ts`.
**Prompt:** "On the cell page (`src/app/[country]/[geo]/[industry]/page.tsx`), the founder chose NUMBERS ONLY and a usefulness-ordered tail. (1) Remove the prose blocks from the render: the editorial `narrative` section, the `LocalContextCard`, and the `IfYouOpenedToday` timeline (keep the imports/components, just stop rendering them, reversible). Keep the masthead score, the board, the 'what it takes to open' section, the comparison rails. (2) Reorder the bottom-tail sections so the most decision-useful come first: order them FailureCards ('what kills weak operators') -> AcrossStatesStrip/ComparableCitiesRibbon (same business elsewhere) -> comparable cells (other businesses here) -> RelatedIndustriesStrip -> knowledge-base footer. Remove the vestigial empty `#revenue-tiles` sr-only marker if the section-order gate still passes without it; otherwise leave it. Keep all kept copy verbatim, tokens only, no em-dashes. Run `verify_no_em_dashes`, `verify_section_order`, `find_useless_tiles`, the hex gate. Do NOT commit or build."

### Step 1.2 - Country page: collapse three tax surfaces into one
**Files:** `src/app/[country]/page.tsx`; `src/lib/scores/country_board.ts`; possibly `CountryStatsStrip`, `CountryTaxReality`.
**Prompt:** "On the country page, taxes + days-to-register appear in three places (the board 'climate' card, `CountryStatsStrip`, and `CountryTaxReality`). Consolidate into ONE strong 'What the government takes, and how hard it is to set up' section: keep the richest treatment (the `CountryTaxReality` worked-figure read is the keeper), fold the unique non-duplicate signals from the other two into it, and remove the now-redundant tax rows from the board climate card and the stats strip (leave their non-tax rows). No number changes, only de-duplication and placement. Keep the friction/survival placeholder sections as-is (founder chose to keep placeholders). Tokens only, no em-dashes. Run the light gates incl. `verify_section_order`. Do NOT commit or build."

### Step 1.3 - Region pages: index that points to its cities
**Files:** `src/app/[country]/[geo]/page.tsx`.
**Prompt:** "The `[country]/[geo]` region page currently shows a top-industries list that is actually the COUNTRY's list (same nine on every region). The founder chose: regions become a simple INDEX that points to their cities, and the wrong industry list is REPLACED with the region's cities. (1) Remove the `#top-industries` block (the country-level list). (2) Make the region's cities the primary content: ensure the `#top-cities` cities-in-this-region cards are prominent and lead the page after the hero + the best/hardest lede. (3) Keep the GeoViabilityLede, CityCharacter, neighborhoods, and the easiest-to-break-in panel. The page should read as 'here is this region, here are its cities, go in'. Self-omit cleanly where a region has no curated cities. Tokens only, no em-dashes. Run the light gates. Do NOT commit or build."

### Step 1.4 - Industry page: one place-picker, leading
**Files:** `src/app/industries/[industry]/page.tsx`.
**Prompt:** "The industry page has TWO place-pickers (the `ActivityPlacePicker` country+city dropdown near the hero, and the flat 'country chooser' chip row lower down). The founder chose: merge into ONE clear picker and lead with it. Keep `ActivityPlacePicker` as the single picker, placed as the lead action right under the hero (it already is). Remove the redundant lower 'country chooser' chip row (the 12-country chips). Keep the across-cities CTA, 'the shape before you pick a place', the model lede, the margin waterfall, the 'where it works' ranked table, 'what kills weak operators', and related activities. Net: the reader picks a place once, at the top. Tokens only, no em-dashes. Run the light gates. Do NOT commit or build."

---

## Phase 2 - Perfect the comparison page (the founder's priority)

### Step 2.1 - Comparison: merge the call-outs, tighten the side-by-side
**Files:** `src/app/industries/[industry]/across/page.tsx`.
**Prompt:** "The comparison page is the founder's #1 page to perfect. (1) MERGE the two adjacent break-in call-outs ('Where to break in' editorial verdict + 'Easiest to break in' score pick) into ONE clean lead read: the single easiest place by break-in score, with the warm one-line reason and the honest catch, linking to that place's cost-to-open page. Remove the second, redundant strip. (2) Do NOT add a 'why A beats B' sentence (founder said the table shows it). (3) Tighten the side-by-side table: confirm best-in-row emphasis is clear, the break-in row reads cleanly with band badges, the revenue-spread sub-block is legible, each column links to its cell + its cost-to-open page, and the modeled/directional disclaimer stays. (4) Make sure the thin-data fallback (fewer than 3 cities) still degrades gracefully. Clean-data-tool register, numbers lead, tokens only, no em-dashes. Run the light gates incl. `find_useless_tiles`. Do NOT commit or build."
**Extra verification:** screenshot `/industries/restaurants/across` desktop + mobile; confirm exactly ONE break-in call-out, the table reads clean, links resolve.

---

## Phase 3 - Extremes + cities directory

### Step 3.1 - Extremes: lead with cost-to-open, make it filterable
**Files:** `src/app/extremes/page.tsx`; `src/lib/extremes/leaderboards.ts`.
**Prompt:** "On `/extremes` the founder chose: lead with COST-TO-OPEN, and make the page FILTERABLE by lens. (1) Reorder so the 'What it costs to get in' (cheapest/highest-barrier) block leads the lens blocks, ahead of take-home, break-in, and density. (2) Add a lightweight client-side LENS FILTER at the top: a row of chips (Cost to open / Take-home / Break-in / Crowding) that scrolls-to or shows the chosen lens (a small client component that toggles which lens block is visible, with 'all' as default; pure presentational, no data refetch, server still renders all resolved blocks). Keep every board self-omitting when its data is thin. Keep the hero + closing note. Tokens only, no em-dashes, no 'count of things' tile phrasing. Run the light gates. Do NOT commit or build."

### Step 3.2 - Cities directory: region grouping + predictive city search
**Files:** `src/app/cities/page.tsx`; new `src/components/cities/CitySearchBox.tsx`; `src/lib/scores/city_directory` (read).
**Prompt:** "On `/cities` the founder chose: group by WORLD REGION and add a PREDICTIVE CITY-NAME SEARCH BAR. (1) Add a client `CitySearchBox` at the top (under the map): a text input with type-ahead autocomplete over the covered city names (pass the full {name, slug} list from the server as a prop; filter client-side as the user types; each suggestion links to `/cities/[slug]`). Accessible, keyboard-navigable, tokens only. (2) Group the city showcase BY WORLD REGION (Europe, Asia, Americas, Middle East and Africa, Oceania) instead of the current visitor/depth lists, with a compact card per city under each region heading; keep figures real (visitors/salary/GDP), dash where missing, self-omit a region with no cities. Keep the world map at top. No em-dashes, tokens only. Run the light gates. Do NOT commit or build. Report the region buckets + a sample of the search list."

---

## Phase 4 - City headline score + city-route consistency (bigger; dry-run the score)

### Step 4.1 - City place-attractiveness score (0-100)
**Files:** new `src/lib/scores/city_attractiveness.ts`; `src/lib/scores/city_board.ts`; `src/app/cities/[slug]/page.tsx`; `scripts/audit/dryrun_city_score.ts`.
**Prompt:** "The founder chose: CITIES get a headline 0-100 score (countries/industries do not). Build a `cityAttractivenessScore(city)` in a new pure module, composed from the signals the city board already holds, demand depth (population/income/tourism), rent pressure (inverted), market room (density inverted), and survival, each normalized 0-100 and blended with documented weights, banded forgiving/manageable/demanding/brutal like the break-in score, returning null when the core signals are missing (no wrong score). Surface it on the `/cities/[slug]` masthead using the same `BreakInMasthead`-style badge (reuse the band tones). Write `scripts/audit/dryrun_city_score.ts` printing the score + components for ~12 cities (London, NYC, Paris, Tokyo, Madrid, Berlin, Sydney, Toronto, Dubai, Mumbai, Sao Paulo, Singapore); run it; INCLUDE the table; confirm a sane spread, no NaN, nulls where data is thin. Tokens only, no em-dashes. Run the light gates. Do NOT commit or build."
**Extra verification (controller):** review the dry-run distribution for sanity before shipping; screenshot a city masthead.

### Step 4.2 - City page leads with the demand picture; consistent place experience
**Files:** `src/app/cities/[slug]/page.tsx`; `src/lib/scores/city_board.ts`.
**Prompt:** "On the city page (`/cities/[slug]`, the rich city route) the founder chose: lead with the DEMAND PICTURE. Reorder so that immediately under the masthead (score from 4.1) the city DEMAND read leads, population, income proxy, tourism/footfall, who-the-customers-are, then rent/market/survival, then the ranked activities, the signature panel, formation costs, the industry mosaic, neighborhoods, curiosities, sister cities. Keep everything self-omitting. The region page (`/[country]/[geo]`) stays the thin index from Step 1.3 and links into these rich city pages, so the two are consistent (index -> rich city). Tokens only, no em-dashes. Run the light gates. Do NOT commit or build."

---

## Phase 5 - Tools: one hub, Check for all, Decide live

### Step 5.1 - One tools hub
**Files:** new `src/app/tools/page.tsx`; nav (`src/components/` header) light touch.
**Prompt:** "The founder chose ONE tools hub for Decide / Check / Calculator. Create `/tools` (`src/app/tools/page.tsx`): a clean landing that introduces and links the three tools (Decide = what business should I start here; Check = compare your own numbers; Calculator = run your exact rent/payroll), each a compact card with a one-line description and a link to the existing route (do NOT move or rename the existing tool routes, SEO equity; this hub points to them). Add a single 'Tools' entry to the header nav pointing to `/tools` if a nav slot is clean to add (else skip the nav change and report). Tokens only, no em-dashes, no source-agency names. Run the light gates. Do NOT commit or build."

### Step 5.2 - Check expands to every business
**Files:** `src/app/check/page.tsx`; `src/components/check/CheckForm.tsx`; the verdict/compute lib.
**Prompt:** "The 'Check your numbers' tool currently offers a fixed 20-industry picker. The founder chose: expand to EVERY business we cover. Replace the hardcoded 20-item list with the full taxonomy industry list (from the canonical `industryToSlug` / taxonomy source), keeping the picker usable (grouped by sector or searchable). Ensure `computeVerdict` still resolves a typical range for any selected industry (fall back to the sector/default benchmark where a specific industry lacks one, clearly as an estimate, never a wrong number; self-omit a ratio with no benchmark). Keep the in-browser, nothing-stored privacy model. Tokens only, no em-dashes. Run the light gates. Do NOT commit or build. Report how the picker now lists all industries and how missing-benchmark cases are handled."

### Step 5.3 - Decide: real examples
**Files:** `src/app/decide/page.tsx`; `src/lib/scores/founder_decision` (read).
**Prompt:** "The `/decide` landing uses hardcoded `WORKED_EXAMPLES` cards. The founder chose: replace them with REAL, strong live picks. Replace the hardcoded examples with a small set of genuinely strong, currently-resolving activity-in-place examples pulled from the live data (highest net-margin or break-in picks that resolve cleanly today, budget-wrapped, self-omit if fewer than 3 resolve). Each card links to its live decide/cell page. Keep the rest of the decide landing. Tokens only, no em-dashes. Run the light gates. Do NOT commit or build. Report the live examples chosen."

---

## Phase 6 - Cost-to-open: the conditional dealbreaker line

### Step 6.1 - "Don't open unless..." where it's real
**Files:** `src/lib/markets/opening_archetypes.ts` or a new `src/lib/open/dealbreakers.ts`; `src/components/open/OpeningHero.tsx` or `OpeningChecklist.tsx`.
**Prompt:** "The founder chose a 'don't open unless...' line on the cost-to-open page, but ONLY where there is a genuine dealbreaker, not on every page. Define a per-industry dealbreaker map (a short modeled condition for the businesses where one truly dominates, e.g. restaurants -> 'a high-footfall location, rent under ~12% of sales'; hotels -> 'enough rooms to cover the fixed base'; gyms -> 'membership retention above the churn line'; bars -> 'a liquor license you can actually get'; dental/medical -> 'the license and the fit-out capital'; childcare -> 'the ratios and the licensing'). Only businesses in the map show the line; all others show nothing (no generic filler). Surface it as one quiet, honest line in `OpeningHero` (or at the head of the checklist). Keep it modeled-labelled, warm, no em-dashes. Run the light gates. Do NOT commit or build. Report the map + a sample render."

---

## Phase 7 - New page type: "Buy vs start" (the acquisition angle)

### Step 7.1 - Buy-vs-start page
**Files:** new `src/lib/open/buy_vs_start.ts`; new route `src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx`; new `src/components/buy/*`; `scripts/audit/dryrun_buy_vs_start.ts`; a cross-link from the cell + cost-to-open pages.
**Prompt:** "Build the founder's chosen new page type: BUY VS START, per business-and-place, 'is it smarter to buy an existing [business] in [place] or start one fresh?'. Data builder `buy_vs_start.ts` (reuse the live numbers): the START side = the cost-to-open total + time-to-open + the break-in payback (already live); the BUY side = a modeled acquisition view, a typical small-business sale price as a multiple of annual owner take-home (a modeled SDE multiple per industry, e.g. services ~2.5x, food ~2.0x, retail ~2.2x, sanity-bounded), plus 'you skip the ramp' framing, minus 'you pay for someone else's goodwill'. Output a clean side-by-side: cash needed, time to cash-flow, risk, and a one-line honest verdict that names the catch on each side. Route at `/[country]/[geo]/[industry]/buy-or-start` (bounded prerender of the flagship set + ISR, like the opening page; notFound when the cell is untrusted). Components in the clean-data-tool register. Cross-link from the cell page and the cost-to-open page. Write + run `scripts/audit/dryrun_buy_vs_start.ts` over ~10 combos; INCLUDE the table; confirm sane multiples and no wrong numbers. Tokens only, no em-dashes, no source-agency names. Run the light gates. Do NOT commit or build."
**Extra verification (controller):** review the dry-run for plausible multiples; screenshot the new page desktop + mobile before shipping.

---

## Sequencing + self-review

- **Order:** 1.1 -> 1.2 -> 1.3 -> 1.4 -> 2.1 -> 3.1 -> 3.2 -> 4.1 -> 4.2 -> 5.1 -> 5.2 -> 5.3 -> 6.1 -> 7.1. Each ships before the next starts.
- **Dependencies:** 4.2 depends on 4.1 (the city score it surfaces). 7.1 reuses the live opening + break-in numbers. Everything else is independent, so a BLOCKED step is skipped without stalling the rest.
- **Spec coverage check:** every row of the design doc maps to a step, business page (1.1), cost-to-open upfront-only is already true + dealbreaker (6.1), country tax (1.2) + climate-lead is already true + placeholders kept, region->cities (1.3), city demand-lead + score + route (4.1/4.2), cities directory (3.2), industry picker (1.4), comparison (2.1), extremes (3.1), tools (5.1-5.3), cross-cutting rules enforced in every prompt, new buy-vs-start page (7.1). The only design rows with no code step are the ones already satisfied (home shipped; "keep scaffold"; "numbers lead"; "score on businesses+cities" delivered by 4.1).
- **Risk notes:** 4.1 (city score) and 7.1 (buy-vs-start) introduce NEW modeled numbers, both get a dry-run + a controller sanity review before shipping. 3.1 and 3.2 add small client components (filter, search), verify they hydrate and degrade without JS.
