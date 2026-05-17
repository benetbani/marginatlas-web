# 03 · Decision Log

> Every significant architectural, product, or operational decision
> with the WHY behind it. Stable IDs (`D-NNN`) so other files can
> reference them.
>
> Status legend: **active** = still in force; **superseded** = replaced
> by a later decision; **deferred** = waiting on founder input.

---

## A · Branding and visual identity

### D-001 · Burnt amber + warm graphite is the palette
- **What:** Atlas brand colours are burnt amber (`#D97706`, `#C2410C`), warm graphite (`#1A1A1A`), warm off-white (`#FAFAF7`).
- **Why:** Founder explicit: "aquamarine has no place in this". That colour family belongs to Tesseract Stock Agent (a sibling product).
- **When:** Session 1
- **Status:** active

### D-002 · Expanded palette to 8 in-family tones
- **What:** Added `cream-50` to `cream-500`, `moss-100/500/700`, `clay-100/500/700`, `cocoa-700/900`, `parchment`. Plus expanded `atlas` to 50/100/200/300/400/500/600/700/800/900 stops.
- **Why:** Founder said site looked "bland" with only two expressive colours. Stayed strictly inside warm-earth-tone family — no cool colours except a single sparse deep teal at `#0F766E`.
- **When:** Session 2 (Plan v3 §10)
- **Status:** active

### D-003 · Hero image NOT on the right side
- **What:** Home page hero is full-width with navigator below; no image to the right of the headline.
- **Why:** Founder explicit: "the image should not be on the right side, that's wrong".
- **When:** Session 3
- **Status:** active. Note: cell pages, country pages, /you, /about-data, /not-found DO use right-side images.

### D-004 · Navigator dominates the home hero
- **What:** Navigator card is full container width, padding `p-8 md:p-10`, field heights 48-52px, CTA `px-8 py-4 text-base font-semibold` reading "Show me the numbers →".
- **Why:** Founder explicit: "the menu should be occupying more space".
- **When:** Session 3
- **Status:** active

### D-005 · SmartImage uses cream-gradient placeholders with emoji glyph
- **What:** Until founder commissions real images, every image surface renders a `cream-100 → cream-300` gradient with a centred sector emoji.
- **Why:** Avoid stock-photo cliché; keep the look consistent with the palette; ship the layout now, swap in real images later as one-line changes.
- **When:** Session 2 (Plan v3 §11)
- **Status:** active

### D-006 · Sector dropdown uses CURATED display order, NOT alphabetical
- **What:** Sectors render in this fixed order: Food & drink, Retail & shops, Beauty & wellness, Trades & home services, Hospitality, Professional services, Software & tech, Real estate, Transport (small), Manufacturing & artisan, Construction, Farming & food production, Health & clinics, Education & instruction, Creative & media, Repair services, Pet services, Events & entertainment, Cultural, Other local services.
- **Why:** Alphabetical opened with "Administrative" which felt random. Founder: "you go in the alphabetic method, but in this case, the alphabetic method is not good… should have a master menu".
- **When:** Session 3 (Plan v4 §4)
- **Status:** active. CI verifies first 3 sectors are `food_drink`, `retail_shops`, `beauty_wellness`.

### D-007 · Country dropdown IS alphabetical
- **What:** `COUNTRIES` is sorted by display name.
- **Why:** Country dropdowns are long; alphabetical is the universally expected pattern. Quality tier kept as a field but used only for the per-country coverage badge.
- **When:** Session 3
- **Status:** active

### D-008 · Sector master menu grid uses per-sector `header_color` from the warm palette
- **What:** Each sector tile has a unique background colour drawn from cream/parchment/atlas variants.
- **Why:** Adds visual differentiation without leaving the palette family.
- **When:** Session 3
- **Status:** active

### D-009 · Subtle warm gradient under the hero
- **What:** `body` background has `linear-gradient(180deg, var(--hero-fade) 0%, var(--background) 600px)` where `--hero-fade` is `cream-100`.
- **Why:** Adds depth without competing with content.
- **When:** Session 2
- **Status:** active

---

## B · Product positioning

### D-010 · The atlas is for SMBs, NOT for public-company analysts
- **What:** Default UI only exposes industries where small/medium businesses participate meaningfully.
- **Why:** Founder explicit multiple times: "this thing was made for the small guy, not for the banks". Bimodal industries (banking has $10M boutique RIAs + Goldman Sachs in the same bucket) produce meaningless averages.
- **When:** Session 3
- **Status:** active

### D-011 · Banking, oil & gas, pharma, telecom, large insurance hidden by default
- **What:** Five sectors (`mining_energy`, `heavy_industry`, `finance_corp`, `telecom_broadcasting`, `higher_ed_hospitals`) have `audience_default: "hidden"`.
- **Why:** Same reasoning as D-010. They become visible only with `?pro=1` or `atlas_pro=1` cookie.
- **When:** Session 3
- **Status:** active

### D-012 · 25 sectors total: 20 visible + 5 Pro-only
- **What:** See `src/lib/taxonomy/sectors.json` for the full list. Display order in D-006.
- **Why:** Three years of founder iteration converged on this set; CI script (`verify_taxonomy.ts`) enforces it.
- **When:** Session 3 (Plan v4 §6)
- **Status:** active

### D-013 · 202 industries total: 180 visible + 22 hidden
- **What:** `industries.json` has 202 entries with `audience: "smb_core" | "smb_friendly" | "mixed_caution" | "corp_only"`.
- **Why:** Migrated 193 existing v3 industries + added 9 sub-niches to thin sectors (pet_services, cultural, hospitality, construction).
- **When:** Session 3
- **Status:** active

### D-014 · First 3 visible sectors MUST be food_drink, retail_shops, beauty_wellness
- **What:** CI `verify_taxonomy.ts` fails the build if these aren't the first three.
- **Why:** These are the visceral SMB anchors. The founder explicit: don't open with "Administrative".
- **When:** Session 3
- **Status:** active (CI-enforced)

### D-015 · Sub-niches without direct data resolve to parent via PARENT_FALLBACK_MAP
- **What:** `taxonomy.ts` exports `PARENT_FALLBACK_MAP` mapping 25+ uncovered parent industries to their closest covered industry (e.g. `clothing_stores → textile_apparel_mfg`).
- **Why:** Coverage audit revealed 73 NAICS-3 codes mapped but only 44 in `extrapolated_cells`; without fallback, 102 industries would 404.
- **When:** Session 3
- **Status:** active

### D-016 · `resolveToMeasuredIndustry` walks parent_id → fallback_map → self
- **What:** Multi-level resolution chain with visited-set cycle guard.
- **Why:** Some sub-niches have parent_id; some don't but have a fallback; chain handles both.
- **When:** Session 3
- **Status:** active

### D-017 · No "Coming soon" placeholder tiles on home
- **What:** `FeaturedCellTile` returns `null` if its cell has no data; the tile is dropped from the grid entirely.
- **Why:** Founder explicit: "what's the point of coming soon? It looks broken."
- **When:** Session 3 (Plan v4 §16)
- **Status:** active

### D-018 · Featured tiles use measured parent industries, not sub-niches
- **What:** The 12 featured tiles point to URLs like `/us/california/restaurants`, not `/us/california/boutique-clothing`.
- **Why:** Sub-niches may not resolve; parent always does.
- **When:** Session 3
- **Status:** active

---

## C · Pricing and business model

### D-020 · Pricing: $38 / $78 / $150 monthly
- **What:** Starter $38, Pro $78, Enterprise from $150.
- **Why:** Founder dictated. Lower-priced relative to IBISWorld ($1k+/yr) to capture solo operators.
- **When:** Session 1
- **Status:** active

### D-021 · Annual = 8 × monthly (4 months free, 33% discount)
- **What:** Annual price = 8 × monthly. Marketing copy says "4 months free" and "save 33%".
- **Why:** Founder dictated. Common SaaS pattern.
- **When:** Session 1
- **Status:** active

### D-022 · 7-day Pro trial on Starter and Pro
- **What:** CTAs say "Start 7-day Pro trial" — both Starter and Pro start in trial mode at Pro level.
- **Why:** Standard pattern; founder agreed.
- **When:** Session 1
- **Status:** active. Not wired yet — Stripe integration is Phase R (deferred).

### D-023 · No payment processing yet
- **What:** All pricing-page CTAs link to `/sign-up?tier=X` which doesn't exist yet.
- **Why:** Founder said wait. Auth + Stripe is post-launch work.
- **When:** Session 1
- **Status:** deferred

---

## D · Methodology and sources lockdown

### D-030 · NEVER reveal source agencies in user-visible text
- **What:** All `coverage_source` strings are generic ("National business statistics", "European business statistics", etc.). QualityBadge component maps specific agency names to these generic labels.
- **Why:** Founder explicit: "avoid putting methodology and sources of information out there… don't broadcast where the raw data lives publicly". Competitive moat against LLM-powered competitors reverse-engineering our sources.
- **When:** Session 2 (Plan v3 §A lockdown)
- **Status:** active

### D-031 · QualityBadge component generizes source strings
- **What:** Maps inputs like "US Census SUSB", "Eurostat sbs_r_nuts06_r2", "Destatis 47415" to generic labels.
- **Why:** Same as D-030.
- **When:** Session 2
- **Status:** active

### D-032 · Schema.org JSON-LD stripped of source-leaking fields
- **What:** Removed `measurementTechnique`, `license`, `sameAs` from the Dataset schema.
- **Why:** Those fields would leak provenance to scrapers and SEO crawlers.
- **When:** Session 2
- **Status:** active

### D-033 · robots.txt blocks AI training crawlers
- **What:** GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, ChatGPT-User, PerplexityBot, cohere-ai, FacebookBot, Meta-ExternalAgent, Diffbot all set to `Disallow: /`.
- **Why:** Don't feed competitors' models for free.
- **When:** Session 2
- **Status:** active

### D-034 · Edge middleware enforces crawler block + rate limit
- **What:** `middleware.ts`: AI crawlers get 451, bare scrapers (curl/wget with no Accept-Language) get 403, IPs over 60 req/min get 429.
- **Why:** Defence in depth — robots.txt is honour-system; middleware is enforced.
- **When:** Session 2
- **Status:** active

### D-035 · /methodology page redirects to /about-data
- **What:** The `/methodology` route renders a `redirect("/about-data")` server component. Footer links updated.
- **Why:** Same lockdown — generic "About the data" page that doesn't name agencies.
- **When:** Session 2
- **Status:** active

### D-036 · sitemap drops methodology URL, adds /about-data and others
- **What:** `sitemap.ts` lists home, about-data, browse, compare, ask, blog, plus top-5000 cells.
- **Why:** Sitemap is public; don't direct crawlers to anything that names sources.
- **When:** Session 2
- **Status:** active

---

## E · Editorial and AI content

### D-040 · Editorial tone is NOT decided
- **What:** No per-cell narrative paragraphs, no country editorial blurbs, no sector deep-dives, no blog voice locked.
- **Why:** Founder explicitly hasn't decided. Plan v3 Phases B.5, G, H deferred.
- **When:** Sessions 1-4 (recurring)
- **Status:** deferred

### D-041 · /ask AI route stays in preview-stub mode
- **What:** `/api/ask` returns a fixed message saying "Ask Atlas is in private preview" — does NOT call Anthropic.
- **Why:** `ANTHROPIC_API_KEY` exists in `.env.local` but NOT in Vercel env. Founder gated this behind the editorial-tone decision.
- **When:** Session 3
- **Status:** active (gated)

### D-042 · /ask model fixed to claude-sonnet-4-5
- **What:** `src/app/api/ask/route.ts` constant `MODEL = "claude-sonnet-4-5"`.
- **Why:** Founder direction: "not the heaviest one and not the lightest one".
- **When:** Session 3
- **Status:** active

### D-043 · /ask rate-limited at 10 questions per IP per hour
- **What:** In-memory per-edge-instance bucket.
- **Why:** Cost control. Free tier promise.
- **When:** Session 3
- **Status:** active

### D-044 · Cell page narrative uses neutral factual phrasing
- **What:** "A typical X here brings in about $Y per year. There are N of them, employing roughly M people."
- **Why:** No editorial voice until D-040 is resolved.
- **When:** Session 1
- **Status:** active

### D-045 · /ask system prompt enforces source lockdown
- **What:** System prompt instructs Claude to use generic "compiled business statistics" phrasing, not name the agency.
- **Why:** Same lockdown as D-030.
- **When:** Session 3
- **Status:** active (when /ask is live)

---

## F · Infrastructure

### D-050 · Supabase Pro tier ($25/mo, 8 GB storage)
- **What:** Upgraded from free 500 MB cap to Pro 8 GB.
- **Why:** Free tier was about to burst at Phase 4 of sub-national ingest. Pro gives 16× headroom, connection pooling, daily backups, no auto-pause when idle. Cheapest sane infrastructure decision in the project — $300/year vs. the cost of multi-day engineering work to build a hybrid R2-overflow path.
- **When:** Session 4
- **Status:** active

### D-051 · Cloudflare R2 stays at $0.01/mo, public access disabled
- **What:** R2 bucket exists but is now private (was public during the early data-sharing phase).
- **Why:** Methodology lockdown (D-030 family).
- **When:** Session 2
- **Status:** active

### D-052 · Hugging Face dataset made private
- **What:** Same lockdown.
- **When:** Session 2
- **Status:** active

### D-053 · GitHub atlas-data repo made private
- **What:** The data-mirror repo on GitHub set to private.
- **When:** Session 2
- **Status:** active

### D-054 · DNS not yet fixed (founder action pending)
- **What:** `marginatlas.com` currently returns Cloudflare 522 because DNS points at the Namecheap parking page. Founder needs to delete 2 records, add 2 Vercel CNAMEs with grey cloud.
- **When:** Sessions 3-4
- **Status:** **OPEN** — see B-001

### D-055 · RAM cap 600 MB RSS per Python script
- **What:** `scripts/ingest/common/ram_guard.py` wraps every pipeline.
- **Why:** Founder said "do not exceed 70% RAM" repeatedly. The dev machine blocks under high memory pressure.
- **When:** Session 3
- **Status:** active

### D-056 · Sequential execution within and across ingest pipelines
- **What:** No parallel API calls. One country at a time. One phase at a time.
- **Why:** Same RAM + rate-limit reasoning.
- **When:** Session 3
- **Status:** active

### D-057 · Supabase upserts batched at 500 rows
- **What:** `common/upload_to_supabase.py` defaults to `batch_size=500`.
- **Why:** Sweet spot for PostgREST — large enough to amortise HTTP overhead, small enough to fit comfortably in the request body limit.
- **When:** Session 3
- **Status:** active

### D-058 · Idempotent upserts via `Prefer: resolution=merge-duplicates`
- **What:** Default header on every PostgREST POST.
- **Why:** PK conflicts merge rather than fail. Pipelines can be re-run safely.
- **When:** Session 3
- **Status:** active

### D-059 · Resume support via per-pipeline progress.json
- **What:** Each ingest writes `delivery/regional/<phase>/progress.json` after every unit of work.
- **Why:** Long-running pipelines (US Census = ~2 hours) need to survive interruption.
- **When:** Session 3
- **Status:** active

---

## G · Sub-national ingest specifics

### D-060 · Korea KOSIS = PERMANENTLY SKIPPED
- **What:** No Korea sub-national ingest.
- **Why:** KOSIS registration requires a Korean mobile phone number. Confirmed dead-end for non-Korean founders.
- **When:** Session 4
- **Status:** active (permanent)

### D-061 · Germany Destatis Kreis = DUPLICATE OF EUROSTAT
- **What:** Destatis token works but free tier only exposes Germany + Länder tables. Kreis tables paid-only.
- **Why:** Phase 1 Eurostat already covers Germany at NUTS-1/2/3. Paying for Destatis would duplicate.
- **When:** Session 4
- **Status:** active (mark DUPLICATE; no further work)

### D-062 · EU ingest fetches all geos at once per (indic, year)
- **What:** Eurostat strategy: query each (indicator, year) combination without geo filter; the response includes all 280+ NUTS-2/3 regions in ~30K observations.
- **Why:** Per-country queries returned 0 results when filtered by `geo=DE` (Eurostat returns only the country-aggregate). Whole-Europe fetches paginate naturally via the NACE-letter filter.
- **When:** Session 4 (Phase 1)
- **Status:** active

### D-063 · Indicators merged in-memory before upload, not per-batch
- **What:** Initial implementation flushed each (indic, year) batch to Supabase separately; PostgREST `merge-duplicates` REPLACED rather than merged fields, so V11210 (firms) and V16110 (employees) overwrote each other. Fix: accumulate all 238K raw obs in memory (~200 MB), call `merge_indicators` once to produce 43,903 final rows with all fields populated, then upload.
- **Why:** Same row must have firms + employees + payroll populated together. The merge logic only runs against rows in the same batch.
- **When:** Session 4
- **Status:** active

### D-064 · US Census CBP at county × NAICS-3 (51 states × 73 codes)
- **What:** 3,723 sequential API calls to `api.census.gov/data/2022/cbp`. Per-state save for resume. PAYANN gives payroll-per-employee in USD.
- **Why:** NAICS-3 is the right granularity (matches our taxonomy). County-level is the deepest US ingest. Tier 'P' (Primary, direct measurement).
- **When:** Session 4 (Phase 10)
- **Status:** active. Ran in ~1h50m.

### D-065 · JP Economic Census 2024 (table 0004040099) with JSIC→ISIC bridge
- **What:** 29 paginated calls × 100K obs each. JSIC 2-digit divisions mapped to industry_id via `isic_to_industry_id` (broadly correct; niche divisions need dedicated JSIC table).
- **Why:** JSIC ≈ ISIC at the 2-digit level for most divisions. Quick win; refinement is a future cleanup.
- **When:** Session 4 (Phase 8)
- **Status:** active (known imperfect)

### D-066 · BR IBGE CEMPRE table 6449 variable 2585
- **What:** SIDRA endpoint per (CNAE category × variable × year), N3 = UF level.
- **Why:** CNAE follows NACE Rev.2 at 4-digit, so existing crosswalk works. Table 6449 is the right CEMPRE table (table 1948 was wrong on first try).
- **When:** Session 4 (Phase 15)
- **Status:** active

### D-067 · Global city overlay derived from extrapolated_cells × population/productivity factors
- **What:** Hand-curated per-country city list with `share` (city's portion of national SMB activity) and `premium` (productivity multiplier). Cells flagged tier 'X', quality ~37.
- **Why:** Gives `/ru/city/moscow/restaurants`, `/cn/city/shanghai/restaurants`, etc. meaningful (if approximate) data without per-country source ingest.
- **When:** Session 4 (Phase 18)
- **Status:** active

### D-068 · BR cities derived from BR regional_cells, NOT extrapolated_cells
- **What:** `city_overlay/fetch_br_cities.py` uses BR state-level rows from regional_cells as parents.
- **Why:** Brazil is absent from extrapolated_cells (was an anchor country in the original regression so was excluded).
- **When:** Session 4
- **Status:** active

### D-069 · France Sirene NOT executed
- **What:** Pipeline scaffolded but not run.
- **Why:** Source CSV is 6 GB; needs founder-side bandwidth before pipeline can run.
- **When:** Session 4
- **Status:** deferred (B-003)

### D-070 · OECD overlay scaffold only
- **What:** OECD SDMX endpoint URL migrated from `stats.oecd.org/SDMX-JSON/` to `sdmx.oecd.org/public/rest/data/` with new dataflow names. Old URL returns 404.
- **Why:** Needs verification of new dataflow IDs before execution.
- **When:** Session 4
- **Status:** deferred

### D-071 · "Coming soon" tiles eliminated from home
- (See D-017)

### D-072 · Featured tiles use measured parent industries
- (See D-018)

---

## H · Auth + payments

### D-080 · Pro gate via URL query + cookie (no real auth)
- **What:** `?pro=1` or `atlas_pro=1` cookie unlocks Pro-only sectors in the UI.
- **Why:** Lets the founder demo the Pro experience without building auth yet. Real auth = Phase R / PLAN_V4 §28.
- **When:** Session 3
- **Status:** active (interim)

### D-081 · Auth deferred
- **What:** No Supabase Auth wired yet.
- **Why:** Not needed until paid tiers go live.
- **When:** Session 3
- **Status:** deferred

### D-082 · Stripe deferred
- **What:** No Stripe products created, no checkout endpoints.
- **Why:** Same as D-081.
- **When:** Session 3
- **Status:** deferred

---

## I · Operational protocols

### D-090 · Verify_taxonomy.ts wired into prebuild
- **What:** `npm run prebuild` runs `npx tsx scripts/verify_taxonomy.ts` and fails the build if structural invariants are violated.
- **Why:** Prevents the first 3 sectors from being non-SMB. Prevents orphan industries. Prevents Banking from leaking into default-visible.
- **When:** Session 3
- **Status:** active

### D-091 · LF line endings warnings ignored
- **What:** Git warns about LF→CRLF on every Windows commit; this is benign.
- **Why:** Linux line endings in repo files, Windows checkout converts on commit. Standard pattern.
- **When:** All sessions
- **Status:** active

### D-092 · Commit per phase, push immediately
- **What:** Every executed phase produces a commit and a push.
- **Why:** Vercel auto-deploys, so this gives founder a live URL to verify per phase. Also resume-friendly if a phase fails.
- **When:** All sessions
- **Status:** active

### D-093 · Background `Bash run_in_background=True` for long-running scripts
- **What:** Long pipelines (US Census ~2 hours) launched via background bash, monitored via progress.json polling.
- **Why:** Lets the agent continue other work while the pipeline runs.
- **When:** Session 4
- **Status:** active

### D-094 · ScheduleWakeup for unattended monitoring
- **What:** Set wake-up intervals when waiting on long-running work the founder doesn't want to babysit.
- **Why:** Lets agent re-check progress without polling.
- **When:** Session 4
- **Status:** active

---

## J · What was tried and rejected

### R-901 · Aquamarine considered, then rejected
- **What:** Original Plan v1 used aquamarine accent.
- **Rejected when:** Founder explicit in session 2: "aquamarine has no place in this".
- **Reason:** Conflicts with Tesseract Stock Agent brand.

### R-902 · Alphabetical sector order considered, then rejected
- **What:** Plan v2 sorted sectors alphabetically.
- **Rejected when:** Founder explicit in session 3 review: "the alphabetic method is not good… should have a master menu".
- **Reason:** Opened with "Administrative" which felt random.

### R-903 · "Coming soon" tile placeholders considered, then rejected
- **What:** Plan v3 had `FeaturedCellTile` render a "Coming soon" chip for unresolved cells.
- **Rejected when:** Founder explicit in session 3: "what's the point of coming soon?".
- **Reason:** Looks broken; nothing to click.

### R-904 · Image on right of home hero considered, then rejected
- **What:** Plan v3 §11 placed a SmartImage on the right side of the home hero.
- **Rejected when:** Founder explicit in session 3 review: "the image should not be on the right side, that's wrong".
- **Reason:** Pushed the navigator too small.

### R-905 · Korea KOSIS ingest attempted, then abandoned
- **What:** Considered building KR sigungu ingest.
- **Rejected when:** KOSIS registration form requires Korean mobile phone.
- **Reason:** Founder doesn't have one; no workaround.

### R-906 · Destatis Kreis paid subscription considered, then rejected
- **What:** Destatis offers paid access to Kreis-level tables.
- **Rejected when:** Discovered Phase 1 Eurostat already covers Germany at NUTS-3 (which is approximately Kreis).
- **Reason:** Duplicate coverage at non-zero cost.

### R-907 · Multi-table OECD overlay attempted, then deferred
- **What:** Tried OECD SDMX REGION_ECONOM dataflow.
- **Rejected when:** Old endpoint returned 404; new endpoint URL pattern needs research.
- **Reason:** Time-bounded; moved on to higher-yield phases.

### R-908 · Single-region Eurostat fetch attempted, then redesigned
- **What:** First Phase 1 implementation queried `geo=DE` per country.
- **Rejected when:** Returned only the country-aggregate row, not the NUTS-2/3 children.
- **Reason:** Eurostat returns only the requested geo, not its children. Switched to all-geo sweep.
