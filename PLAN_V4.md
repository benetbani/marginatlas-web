# Margin Atlas — Plan v4.0
## Comprehensive correction plan after the v3.0 round

> Written 2026-05-16, after live review of v3.0 surfaced six structural problems:
> sector dropdown is alphabetical (ugly), banking + mining still appear (corp_only
> filter is industry-level only, not sector-level), bundles are wrong (gyms +
> museums in the same sector), the home image sits on the right (it should not),
> the navigator looks tired and undersized, and "Coming soon" tiles dilute the
> first-frame impression.
>
> Format: 30 numbered steps. Each step has up to 10 sub-steps. No filler. Each
> sub-step is independently shippable or independently verifiable.

---

## Index

- [Part I · Immediate fires (steps 1-5)](#part-i--immediate-fires)
- [Part II · Curated master menu + sector restructure (steps 6-10)](#part-ii--curated-master-menu--sector-restructure)
- [Part III · Visual refresh (steps 11-15)](#part-iii--visual-refresh)
- [Part IV · Featured cells + entry points (steps 16-19)](#part-iv--featured-cells--entry-points)
- [Part V · Data coverage — the real problem (steps 20-26)](#part-v--data-coverage--the-real-problem)
- [Part VI · Infrastructure, growth, moat (steps 27-30)](#part-vi--infrastructure-growth-moat)
- [Appendix A · Curated 16-category master menu spec](#appendix-a--curated-16-category-master-menu-spec)
- [Appendix B · Sector audit (current vs proposed)](#appendix-b--sector-audit-current-vs-proposed)

---

# PART I — Immediate fires

## Step 1 · Cloudflare DNS resolution
*Goal: marginatlas.com loads in a browser within 10 minutes.*
- 1.1 Open Cloudflare → marginatlas.com → DNS → Records.
- 1.2 Delete the `A marginatlas.com 192.64.119.209` (Namecheap parking) row.
- 1.3 Delete the `CNAME www parkingpage.namecheap.com` row.
- 1.4 Add `CNAME @ 33b3dbcd78a448ad.vercel-dns-017.com` with grey cloud (DNS only).
- 1.5 Add `CNAME www 33b3dbcd78a448ad.vercel-dns-017.com` with grey cloud.
- 1.6 Confirm 3 MX records (route1/2/3.mx.cloudflare.net) untouched.
- 1.7 Confirm 2 TXT records (DKIM + SPF) untouched.
- 1.8 Vercel → Domains → click Refresh on both rows.
- 1.9 Wait up to 10 minutes for propagation; reload `https://marginatlas.com`.
- 1.10 If 522 persists past 10 minutes, verify both Vercel CNAMEs are still grey-cloud, not orange.

## Step 2 · Actually hide corp-only sectors (the banking-still-visible bug)
*Root cause: the audience filter exists at the industry level only. The sector dropdown still shows "Finance, insurance & real estate" because its child industries include a mix of corp + smb. Fix at the sector layer.*
- 2.1 In `src/lib/taxonomy.ts`, add `sectorHasVisibleIndustries(sectorId, gate)` helper.
- 2.2 Add `visibleSectors(gate)` that returns sectors with at least one smb_core / smb_friendly child.
- 2.3 Update `NavigatorForm.tsx` sector dropdown to call `visibleSectors(gate)` not `SECTORS_ALPHA`.
- 2.4 Update `GlobalSearch.tsx` sector results to filter through `visibleSectors`.
- 2.5 Hide the "Finance, insurance & real estate" sector entirely when only Real Estate sub-industries remain.
- 2.6 Promote Real Estate to its own top-level sector (see Step 7).
- 2.7 Hide "Mining & energy" by default — every child is corp_only.
- 2.8 Hide the corp_only top-level sectors from the sectors index page (`/sectors`).
- 2.9 Add a "Show large-firm sectors" toggle on `/sectors` that flips the gate for that page only.
- 2.10 Verify on the live site: navigator + search + sectors index return zero references to banking, oil, mining, pharma, telecom, hospitals when not in Pro mode.

## Step 3 · Kill the "Coming soon" placeholder tiles on the home grid
*Reason the founder gave: "What's the point of coming soon? It looks broken."*
- 3.1 Audit all 12 featured tiles in `src/app/page.tsx` against the live data layer.
- 3.2 For each featured tile that returns no cell from `getCellBySlug`, replace it with one that does.
- 3.3 Substitute Italy → use `IT` country level + `clothing-stores` (the measured parent), not the sub-niche.
- 3.4 Substitute Bangalore → use `IN` country level + `software-development` (the parent).
- 3.5 Substitute Toronto → use `CA` country level + `residential-construction`.
- 3.6 Substitute Barcelona → use `ES` country level + `hotels-lodging`.
- 3.7 Substitute Brazil → use `BR` country level + `food-beverage-mfg`.
- 3.8 Substitute Melbourne → use `AU` country level + `restaurants`.
- 3.9 Substitute Germany → use `DE` country level + `metal-products-manufacturing`.
- 3.10 Add a build-time guard: any tile that returns `found: false` from cell-snapshot fails the build with a clear error. No tile ships with a placeholder again.

## Step 4 · Replace alphabetical sector ordering with a curated master menu
*The alphabetical order opens with "Administrative" and feels random. The user's mental model leads with food, retail, beauty, trades.*
- 4.1 Define the canonical 16-sector menu in [Appendix A](#appendix-a--curated-16-category-master-menu-spec).
- 4.2 Add `display_order` integer to each entry in `sectors.json`.
- 4.3 Replace `SECTORS_ALPHA` usage in NavigatorForm + GlobalSearch + `/sectors` with `SECTORS_BY_DISPLAY_ORDER`.
- 4.4 Drop alphabetical sort from `industriesAlpha()` for sector-grouped views; sort by `display_order` within sector first, then by name.
- 4.5 Update `SECTORS_ORDERED` to match `display_order` (the existing `order` field becomes `display_order`).
- 4.6 Verify the first three menu entries are visceral SMB anchors (Food & drink, Retail & shops, Beauty & wellness).
- 4.7 Verify the last three menu entries are the less-glamorous-but-real categories (Construction, Farming, Other services).
- 4.8 Verify the menu does not start with "Administrative" or any abstract-sounding category.
- 4.9 Verify there is no "Mining" or "Banking" entry visible in default mode.
- 4.10 Verify alphabetical sort is preserved within country and region dropdowns (those still alphabetize).

## Step 5 · Fix the bad sector bundles (gyms + museums + theaters together)
*Right now Arts, Sports & Entertainment is one bucket; that breaks search and routing.*
- 5.1 Split "Arts, sports & entertainment" into:
  - **Beauty & wellness** (gyms, yoga, fitness, personal training already there + new home)
  - **Events & entertainment** (theaters, music venues, casinos, amusement)
  - **Cultural** (museums, libraries, galleries)
- 5.2 Move `sports_fitness` + `yoga_pilates` + `personal_training` + `martial_arts` into Beauty & wellness sector.
- 5.3 Move `performing_arts` + `gambling_amusement` into Events & entertainment.
- 5.4 Move `museums_cultural` into a new Cultural sector OR fold it under Education (small museums often function educationally).
- 5.5 Split "Personal services":
  - Hairdressers, salons, spas, etc. → Beauty & wellness
  - Auto repair, repair shops → Repair services (new)
  - Funeral homes, dry cleaning → Other local services
- 5.6 Split "Information, software & media":
  - Software dev + IT services → Software & tech
  - Media + publishing → Creative & media
  - Broadcasting + telecom → corp_only / hidden
- 5.7 Split "Healthcare":
  - Doctors, dentists, vets, small clinics → Health & wellness clinics (small)
  - Hospitals → corp_only / hidden
  - Childcare → Education & instruction
  - Nursing/elderly → Local services
- 5.8 Move `florist_shops` from `general_merchandise` → Retail & shops.
- 5.9 Update every industry's `sector_id` to its new home; verify no orphans.
- 5.10 Run a verification script that asserts every visible industry routes to a visible sector and no sector has zero visible children.

---

# PART II — Curated master menu + sector restructure

## Step 6 · Implement the 16-sector master menu structure
- 6.1 Rewrite `sectors.json` to match Appendix A exactly.
- 6.2 New sector IDs: `food_drink`, `retail_shops`, `beauty_wellness`, `trades_home`, `hospitality`, `professional_services`, `software_tech`, `real_estate`, `transport_small`, `manufacturing_artisan`, `construction`, `farming_food_production`, `health_clinics`, `education_instruction`, `creative_media`, `events_entertainment`, `repair`, `pet_services`, `other_local`.
- 6.3 Each entry includes: `id`, `name`, `display_order`, `icon` (emoji), `tagline` (one-line), `examples` array, `audience_default` ("visible" / "hidden"), `header_color` (hex from cream/atlas family).
- 6.4 Add `tagline` field to render under sector name in the master menu, e.g. "Where everyone eats" for Food & drink.
- 6.5 Migrate every industry's `sector_id` to a new sector ID — write a script that maps old → new and verifies no industry is left without a sector.
- 6.6 Keep the old sector IDs as aliases in a `legacy_sector_aliases` map so any existing URL `/sectors/agriculture` still resolves.
- 6.7 Verify `INDUSTRY_BY_ID[id].sector_id` resolves to a non-null sector for every industry.
- 6.8 Verify the SECTORS export length is at least 16 and at most 20.
- 6.9 Verify each visible sector has at least 3 visible industries.
- 6.10 Run `npx tsc --noEmit` and verify no type errors after the rewrite.

## Step 7 · Real Estate becomes its own top-level sector
- 7.1 Create new sector `real_estate` with `display_order` 8.
- 7.2 Move `real_estate_agencies` and `property_leasing` and `insurance_brokers` (small local) into it.
- 7.3 Update sector icon to 🏘️.
- 7.4 Update sector tagline to "Agencies, leasing, local insurance brokers".
- 7.5 Drop the old "Finance, insurance & real estate" sector entirely from the visible set.
- 7.6 Drop `banking`, `investment_securities`, large `insurance` from any default-visible sector.
- 7.7 Add a Pro-mode visible sector `finance_corp` with the corp_only set; only renders when `gate.revealCorp` is true.
- 7.8 The `/sectors/finance_real_estate` URL should 301 redirect to `/sectors/real_estate` if the old slug is requested.
- 7.9 Update the cell page breadcrumb to show the new sector name on cells whose sector_id was migrated.
- 7.10 Add a one-line note in the Pro-only finance sector header explaining segmentation by firm size.

## Step 8 · Mining & energy becomes Pro-only
- 8.1 Mark sector `mining_energy` audience_default = "hidden".
- 8.2 Remove from default `visibleSectors` output.
- 8.3 Allow `?show_large=1` or `atlas_pro=1` cookie to render it.
- 8.4 The `/sectors/mining_energy` URL still works for direct hits with the AudienceCaveat banner.
- 8.5 Surface a small "For larger firms" section on the `/sectors` index when the gate is open.
- 8.6 Move `crop_farming`, `livestock_farming`, `fishing_aquaculture`, `forestry_logging` out of `agriculture` sector into a new `farming_food_production` sector.
- 8.7 Add `craft_beer_mfg`, `coffee_roasters`, `specialty_food_production`, `artisan_bakery_wholesale` into the same `farming_food_production` sector to give it density.
- 8.8 The new `farming_food_production` lands at `display_order` 12.
- 8.9 Verify no SMB user sees mining or oil & gas on the navigator.
- 8.10 Verify a Pro user with `?pro=1` does see them, with the caveat banner.

## Step 9 · Restructure the "Other services" catch-all
- 9.1 Drop `funeral_services` into `other_local`.
- 9.2 Drop `dry_cleaning_laundry` into `other_local`.
- 9.3 Drop `tailoring_alterations` into Beauty & wellness OR repair.
- 9.4 Drop `shoe_repair`, `watch_jewelry_repair` into the new `repair` sector.
- 9.5 Drop `locksmiths`, `appliance_repair`, `electronics_repair` into `repair`.
- 9.6 Drop `auto_repair_shops` and `auto_body_shops` into `repair`.
- 9.7 Drop `bike_repair` into `repair`.
- 9.8 The `repair` sector taglines as "Cars, bikes, electronics, locks, alterations".
- 9.9 The `other_local` sector taglines as "Funeral, dry cleaning, smaller niches".
- 9.10 Verify both new sectors have at least 5 visible industries before shipping.

## Step 10 · Build a verification script for the new taxonomy
- 10.1 New file: `scripts/verify_taxonomy.ts` that runs as part of CI.
- 10.2 Asserts every industry's `sector_id` maps to a real sector.
- 10.3 Asserts every sub-niche's `parent_id` maps to a real measured industry.
- 10.4 Asserts every visible sector has at least 3 visible children.
- 10.5 Asserts no visible sector has the word "Finance" or "Mining" or "Energy" in its name (default mode).
- 10.6 Asserts the first 3 sectors by `display_order` are SMB-friendly anchors.
- 10.7 Asserts every legacy sector ID resolves via `legacy_sector_aliases`.
- 10.8 Run the script in `package.json` `prebuild` so a misconfigured taxonomy fails the Vercel build.
- 10.9 Output a one-page report listing every sector and its child industry count.
- 10.10 Add a `pnpm verify` (or `npm run verify`) command for local dev.

---

# PART III — Visual refresh

## Step 11 · Move the home hero image away from the right side
*Founder direction: "the image should not be on the right side, that's wrong."*
- 11.1 Strip the right-side image column from `src/app/page.tsx` hero grid.
- 11.2 Move the hero image to a wide thin banner ABOVE the headline (full-width, ~280px tall, low-saturation atlas illustration).
- 11.3 Or alternative: drop the image from the hero entirely and use a subtle warm-cream gradient mask as the hero background.
- 11.4 The headline expands to full width.
- 11.5 The navigator below the headline expands to full width.
- 11.6 Reserve the right column visual concept only for cell pages (where it actually adds context).
- 11.7 Cap hero text at ~880px width on huge screens to avoid awkward line lengths.
- 11.8 Keep the image-on-right pattern on `/about-data`, `/you`, `/not-found` — those work because the text column is short.
- 11.9 Verify on a 1920×1080 screen the navigator dominates the visible space.
- 11.10 Verify on a 1366×768 laptop the navigator and one row of featured tiles fit above the fold.

## Step 12 · Make the navigator dominate
*Founder direction: "the menu should be occupying more space."*
- 12.1 Increase the navigator card padding from `p-6` to `p-8 md:p-10`.
- 12.2 Increase field heights from default to 48-52px.
- 12.3 Increase font size of field labels from 12px to 13-14px.
- 12.4 Increase the "Find the numbers →" CTA from `px-6 py-3` to `px-8 py-4`, and the font from default to `text-base font-semibold`.
- 12.5 Add a soft amber gradient ring around the navigator card on focus / hover.
- 12.6 Make the navigator card width = full container width on the hero (currently constrained by grid).
- 12.7 Reorganize the 6 fields to a 3-column-on-desktop, 2-on-tablet, 1-on-mobile layout.
- 12.8 Add a one-line "examples" hint under the CTA: "e.g. restaurants in California · cafés in Italy · plumbers in Texas".
- 12.9 Add a "Random cell" secondary button next to the primary CTA, surfacing serendipity.
- 12.10 Add micro-animation: when a field is filled, a subtle moss-100 check chip appears for 1s.

## Step 13 · Add a sector master-menu grid below the navigator
*Founder direction: "there should be a master menu and the things should be categorized in a way that makes sense for the human mind."*
- 13.1 New component `src/components/SectorMasterMenu.tsx`.
- 13.2 Renders the 16 visible sectors as a 4-column grid on desktop, 2-column on tablet, 1-column on mobile.
- 13.3 Each tile: large emoji icon (40px), sector name, one-line tagline, bottom 4 example industry chips.
- 13.4 Each tile is a link to `/sectors/[id]`.
- 13.5 Subtle warm-cream tile backgrounds (`bg-cream-100`), parchment border, hover lifts to atlas-600 border + warm shadow.
- 13.6 Tiles in 16-category visual order (per Appendix A), not alphabetical.
- 13.7 First row anchors: Food & drink, Retail & shops, Beauty & wellness, Trades & home services.
- 13.8 Place this section right under the featured-cells grid on the home page.
- 13.9 Title: "Browse by category".
- 13.10 Subtitle: "Pick the broad area, then drill into specific small-business industries inside it."

## Step 14 · Improve typography of menus and dropdowns
*Founder direction: "the menu looks very tired."*
- 14.1 Switch ComboField label font weight from `font-medium` to `font-semibold` and color to `cocoa-700`.
- 14.2 Increase field input height from 38px to 44px.
- 14.3 Add a subtle inner shadow on the dropdown popover for depth.
- 14.4 Replace the default chevron in dropdowns with a custom amber `▾` glyph at `atlas-600`.
- 14.5 Add a thin top accent strip to selected dropdown items (`border-l-2 border-atlas-500`).
- 14.6 Change the unselected option text color from `ink-700` to `cocoa-700` for warmer feel.
- 14.7 Add a focus ring `ring-2 ring-atlas-500/40` on field focus.
- 14.8 Add `letter-spacing: -0.01em` to all dropdown headers to tighten.
- 14.9 Rename the "Find the numbers →" CTA to either "Show me the numbers →" or "Open the cell →" (test both).
- 14.10 Apply the same treatment to ComboField on Compare and /you pages.

## Step 15 · First-frame data preview
*Founder direction: "the table should be clearly visible."*
- 15.1 Add a "First-look numbers" mini-strip directly beneath the navigator before scroll.
- 15.2 Strip shows 4 quick stats from the most-popular cell currently visited site-wide (or a daily rotation): typical revenue, firms, employees, wage.
- 15.3 If no analytics yet, default to "Restaurants in California" or rotate through the featured 12.
- 15.4 Strip is 1 row tall on desktop, ~140px height; not a full table, but visible and tactile.
- 15.5 "See full cell →" link routes to that cell's page.
- 15.6 New endpoint `/api/popular-cell-snapshot` returns the rotating cell.
- 15.7 Cache the rotating cell at the edge for 60 seconds — refreshes naturally without manual deploys.
- 15.8 Verify on a 1366×768 viewport this strip is visible above the fold along with hero + navigator.
- 15.9 If we have to choose, sacrifice the featured-tiles grid above-the-fold to keep this strip + navigator above the fold.
- 15.10 Mobile: this strip stacks vertically and shows just typical revenue + firms (the two most relevant numbers).

---

# PART IV — Featured cells + entry points

## Step 16 · Audit the 12 featured tiles, fix every broken one
*Founder direction: "for a lot of them, you're just saying coming soon."*
- 16.1 Run a manual diagnostic: hit `/api/cell-snapshot` for all 12 tiles and log which return `found: true`.
- 16.2 Any tile that returns `found: false` gets its sub-niche slug swapped for the parent industry slug.
- 16.3 Rebuild the 12-tile list against the actually-measured industries:
  - 🇺🇸 Restaurants — California (`/us/california/restaurants`)
  - 🇺🇸 Real estate agencies — New York (`/us/new-york/real-estate-agencies`)
  - 🇺🇸 Software development — California
  - 🇺🇸 Management consulting — Washington DC
  - 🇺🇸 Hairdressers & beauty — Florida
  - 🇺🇸 Construction — Texas
  - 🇺🇸 Auto repair shops — Texas
  - 🇩🇪 Metal products manufacturing — Germany
  - 🇫🇷 Hotels & lodging — France
  - 🇮🇹 Restaurants — Italy
  - 🇯🇵 Restaurants — Japan
  - 🇮🇳 Software development — India
- 16.4 The new list uses only measured parent industries, no sub-niches that might be unmapped.
- 16.5 No "Coming soon" chip should ever appear on the live home page.
- 16.6 Add an end-to-end test: the home page should not contain the string "Coming soon".
- 16.7 If a tile's data is genuinely missing (e.g. extrapolated_cells lookup fails), the tile is removed from the list at build time, not shown as a placeholder.
- 16.8 Tile titles read like search queries: "Restaurants in California", not "Restaurants — California".
- 16.9 Tile region tagline shows the flag and the geo name on one line.
- 16.10 Tile typical revenue is the single piece of data shown — no "n_enterprises" clutter.

## Step 17 · Add a "Random cell" entry point
- 17.1 New route `/random` that 307-redirects to a random cell from the top-200 most-populous list.
- 17.2 Button on the navigator: "Surprise me →" that calls `/random`.
- 17.3 The picker uses a deterministic-per-day rotation so caches stay warm.
- 17.4 Build a server util `getRandomCellUrl()` that wraps `getTopCells(200)` and picks one.
- 17.5 The util excludes corp_only cells unless gate is open.
- 17.6 Add a small button to every cell page footer: "Show me a different cell".
- 17.7 Track click-through in analytics (later).
- 17.8 Cache `/random` for 5 minutes at the edge so the random pick rotates naturally.
- 17.9 Verify that `/random` never returns 404.
- 17.10 Verify that `/random` never returns a corp_only cell when not in Pro mode.

## Step 18 · Sector landing pages get a real treatment
- 18.1 Each `/sectors/[id]` page becomes a destination, not a stub.
- 18.2 Hero with sector emoji icon, name, tagline, and a wide thin banner image (or placeholder).
- 18.3 "Top industries in this sector" — top 12 by typical revenue.
- 18.4 "Best-data countries for this sector" — top 6 by coverage quality.
- 18.5 "Featured cells" — 6 cherry-picked cells under this sector.
- 18.6 "Compare cells in this sector" — pre-fills /compare with 4 cells from this sector.
- 18.7 SmartImage placeholder for SEC-1.
- 18.8 Breadcrumb: Home → Sectors → [name].
- 18.9 Schema.org markup: `Thing` typed as `Industry` with members linked.
- 18.10 Verify all 16 sector landing pages return 200 and render with at least 3 industry tiles.

## Step 19 · Make the home page tactile, not stale
- 19.1 Replace the static "What you'll see" 3-card section with a single rotating "Cell of the week" card.
- 19.2 The card shows a real, hand-curated cell each week with a one-line note ("This week: New York real estate agencies — typical revenue jumped 12% YoY.").
- 19.3 Replace the static stats strip ("219 countries / 150+ industries / 780k cells") with live numbers pulled from the database at build time.
- 19.4 Add a "Recently updated" strip showing the most-recently-updated cells (their `updated_at` field — once we track it).
- 19.5 Replace the newsletter sign-up text with a more specific value prop: "Monthly cell of the month — pick a benchmark you didn't know you needed."
- 19.6 Add a footer testimonial slot (empty until we have one — placeholder Quote glyph).
- 19.7 Add a "How was this built?" subtle link in the footer that opens `/about-data` (our generic page).
- 19.8 Add an "Explore" footer column with quick-pick links to top sectors.
- 19.9 Make footer columns rebalance from 4 to 5 to add the new Explore column.
- 19.10 Verify the home page Lighthouse Performance score stays ≥ 85 after all the additions.

---

# PART V — Data coverage — the real problem

## Step 20 · Diagnose what's actually missing in extrapolated_cells
*Founder direction: "the extrapolation doesn't seem to have worked. The data is massively, massively lacking."*
- 20.1 Write `scripts/audit_extrapolated_coverage.py` that pulls Supabase counts per (country, industry) pair.
- 20.2 Output: a per-country CSV showing how many of the ~140 SMB industries have at least one row.
- 20.3 Output: a per-industry CSV showing how many of the 219 countries have data.
- 20.4 Identify the 20 worst-covered countries.
- 20.5 Identify the 20 worst-covered SMB industries.
- 20.6 Cross-tab: which (country, industry) pairs are completely missing.
- 20.7 Diagnose: is the missingness from the regression failing, or from the source parquet not having those industries?
- 20.8 Generate a coverage heatmap PNG (industry × country grid, color = quality_score or "missing").
- 20.9 Save to `delivery/atlas-global-v1.19.0/coverage_audit.csv` and commit alongside the SQL migration.
- 20.10 Decide: do we re-run extrapolation with better fallbacks, or do we accept partial coverage and document it?

## Step 21 · Fix the extrapolation gaps with a smarter fallback
- 21.1 Re-examine `phase_c_extrapolation.py` regression logic.
- 21.2 For (industry × size_band) pairs with insufficient anchor countries (< 5), fall back to (industry only) regression.
- 21.3 For industries with no anchor countries at all, fall back to global mean × GDP-per-capita scalar.
- 21.4 For countries with no GDP/capita data, use the regional median.
- 21.5 Re-run extrapolation; expect 219 countries × 80 industries × 7 size bands = ~120k rows minimum.
- 21.6 Lower the quality_score threshold to acknowledge wider but lower-confidence coverage.
- 21.7 Push the new extrapolated_cells.parquet to `/delivery/atlas-global-v1.20.0/`.
- 21.8 Re-run `scripts/upload_extrapolated_cells.py` to refresh Supabase.
- 21.9 Verify per Step 20.1 that no country has fewer than 50 industry rows now.
- 21.10 Verify the live cell page for /br/brazil/restaurants and /in/india/software-development renders with real predicted revenue.

## Step 22 · Build the sub-national ingest pipeline framework
*Founder direction: "the data is lacking for like, even in the countries that we have covered."*
- 22.1 New `scripts/ingest/` directory with a per-country sub-folder.
- 22.2 Each ingest module exports `fetch()`, `normalize()`, `write()` functions.
- 22.3 Common output schema: `(country, geo_id, geo_level, geo_name, industry_id, year, size_band, n_enterprises, n_employees, rev_p10, rev_p25, rev_p50, rev_p75, rev_p90, payroll_per_employee, quality_score, coverage_tier, coverage_source)`.
- 22.4 New Supabase table `regional_cells` (mirrors `cells_master` schema) for non-US sub-national data.
- 22.5 Cells fall through: cells_master (US states) → regional_cells (non-US sub-national) → extrapolated_cells (country level).
- 22.6 Update `getCellBySlug` to query regional_cells when geo is not a US state and a country-level fallback exists.
- 22.7 Update `cellUrl()` to handle non-US sub-national URLs (e.g. `/de/bavaria/restaurants`).
- 22.8 Add a route at `/[country]/[geo]` that returns a region landing page once data exists for that region.
- 22.9 Build an ingest CI workflow (`.github/workflows/ingest-{country}.yml`) that runs the per-country ingest on a monthly cron.
- 22.10 Document the ingest contract in `docs/ingest-contract.md`.

## Step 23 · US counties via Census ZBP
- 23.1 Pull ZBP county-level CSVs from Census API.
- 23.2 Map county FIPS → friendly geo_id (`US-{state-fips}-{county-fips}`).
- 23.3 Map NAICS-6 → industry_id via existing taxonomy.
- 23.4 Roll county-level firm counts and employment up to size-band columns.
- 23.5 Synthesize p10/p50/p90 using the same shape-transfer technique applied at the state level.
- 23.6 Write to `regional_cells` with `geo_level = "county"`.
- 23.7 Build sample county pages: Los Angeles County, Cook County, Maricopa County, Harris County.
- 23.8 Verify URL pattern `/us/california/los-angeles-county/restaurants` resolves and renders.
- 23.9 Add to sitemap (county-level cells multiply page count from 5,000 → ~150,000).
- 23.10 Cap sitemap at 50,000 per file with multi-file sitemap index.

## Step 24 · EU NUTS-2 via Eurostat regional SBS
- 24.1 Identify Eurostat dataset family `sbs_r_nuts06_r2` for regional structural business statistics.
- 24.2 Map NUTS-2 codes → friendly slugs (e.g. `DE21 → bavaria`, `FR10 → ile-de-france`, `ITC4 → lombardy`).
- 24.3 Map NACE-4 → industry_id via existing crosswalk.
- 24.4 Pull all NUTS-2 cells for available years.
- 24.5 Apply shape-transfer where percentile data is missing.
- 24.6 Write to `regional_cells` with `geo_level = "nuts2"`.
- 24.7 Verify cells render at `/de/bavaria/metal-products-manufacturing`, `/fr/ile-de-france/restaurants`, `/it/lombardy/clothing-stores`.
- 24.8 Update featured-tiles list to use these now-real city/region anchors (Step 16's substitutions become real, not country-level fallbacks).
- 24.9 Add to sitemap.
- 24.10 Smoke-test the top 50 NUTS-2 + top 12 industries combo (600 cells).

## Step 25 · JP prefectures, FR départements, DE Bundesländer, etc.
- 25.1 JP prefectures via e-Stat economic census; geo_level = "prefecture", 47 entries.
- 25.2 FR départements via INSEE Sirene + REE; geo_level = "departement", ~95 entries.
- 25.3 DE Bundesländer via Destatis 47415 series; 16 entries.
- 25.4 UK NUTS / ITL via ONS Business Register; ~12 entries.
- 25.5 CA provinces via StatCan Business Register; 13 entries.
- 25.6 AU states & territories via ABS Business Indicators; 8 entries.
- 25.7 BR states via IBGE Cadastro Central de Empresas; 27 entries.
- 25.8 IN states via MCA + MSME data; 28 entries.
- 25.9 Each ingest writes to `regional_cells` with the correct `geo_level`.
- 25.10 Verify each top-3 region per country renders a real cell for the top-5 SMB industries (24 × 5 = 120 verification cells).

## Step 26 · Coverage transparency surface on each country page
- 26.1 Add a "Coverage map" section to every country landing page.
- 26.2 Render a small table: industry × geo_level grid with a check / dash glyph showing what's covered.
- 26.3 Show per-country metric: "X / 140 SMB industries covered at country level".
- 26.4 Show per-country metric: "Y regions with sub-national data".
- 26.5 If country has no sub-national data, the section says "Country-level only — sub-national coming."
- 26.6 If country has full sub-national data, the section celebrates with a moss-tinted check icon.
- 26.7 Provide a download link per country: "Get the full country dataset (CSV)".
- 26.8 The download link routes to `/api/country-export?iso2=DE` returning a clean CSV.
- 26.9 Lock the download link to authenticated users (Step 28) when ready.
- 26.10 Verify the coverage section renders correctly for US, DE, FR, JP, IN, BR, AU, CA.

---

# PART VI — Infrastructure, growth, moat

## Step 27 · Anthropic API key in Vercel + activate /ask
- 27.1 Vercel → Project → Settings → Environment Variables.
- 27.2 Add new env var: name `ANTHROPIC_API_KEY`, value the founder's key already in `.env.local`.
- 27.3 Apply to Production, Preview, and Development.
- 27.4 Trigger a new deployment.
- 27.5 Once deployed, hit `/ask` with a real query: "What does a typical bakery in California earn?".
- 27.6 Verify the agentic loop runs (4 turns max) and returns a synthesized answer.
- 27.7 Verify the system prompt enforces no-source-disclosure and lead-with-headline-number.
- 27.8 Add a usage cap: per IP per hour, 10 free queries; above that, sign-in required.
- 27.9 Track Anthropic spend; alert if monthly burn > $100 until pricing model is set.
- 27.10 Add a "Try Ask Atlas →" CTA on the home page now that it's live.

## Step 28 · Auth via Supabase Auth + saved-cells migration
- 28.1 Enable Supabase Auth providers: email magic link + Google OAuth.
- 28.2 Add `/sign-in` page with both providers.
- 28.3 Build a small auth context provider in Next.js.
- 28.4 New table `user_saved_cells` (user_id, cell_url, label, created_at).
- 28.5 On first sign-in after using local saves, prompt to migrate `localStorage` saved cells to the user account.
- 28.6 Update `CellActions.tsx` to use the API for saves when authenticated, fall back to localStorage when not.
- 28.7 Free tier cap remains 5 saves; Pro tier unlimited.
- 28.8 Update `/saved` page to read from API when signed in.
- 28.9 Add a header avatar → menu → Sign out.
- 28.10 Add a "Sync to my account" prompt when localStorage has > 0 cells and the user signs in.

## Step 29 · Stripe integration for Pro tier
- 29.1 Stripe → create Product "Pro" with monthly $78 + annual $624 prices.
- 29.2 Create Product "Starter" with monthly $38 + annual $304.
- 29.3 Create Product "Enterprise" — invoice-only, no Stripe checkout for now.
- 29.4 New `/api/checkout` endpoint that creates a Stripe Checkout session per tier.
- 29.5 New `/api/webhook/stripe` endpoint that handles `checkout.session.completed` to flip the user's `is_pro` flag in Supabase.
- 29.6 New table `user_subscriptions` mirroring Stripe subscription state.
- 29.7 Replace the `?pro=1` URL flag with a real `isPro()` server check on every gated route.
- 29.8 The pricing page CTAs route to `/api/checkout?tier=pro|starter`.
- 29.9 7-day free trial via Stripe trial period.
- 29.10 Cancel from `/account/billing` opens a Stripe customer portal session.

## Step 30 · SEO push, sitemap expansion, content marketing
- 30.1 Generate the multi-file sitemap once county data lands (Step 23).
- 30.2 Add JSON-LD `Dataset` schema to every cell page (already present, verify it survives).
- 30.3 Add `BreadcrumbList` schema to every page that has a breadcrumb.
- 30.4 Add canonical link tags to every cell + sub-niche page (sub-niches canonical to parent until they have direct data).
- 30.5 Submit sitemap to Google Search Console.
- 30.6 Submit sitemap to Bing Webmaster.
- 30.7 Generate Open Graph images on the fly per cell (Vercel OG image with the cell's headline numbers).
- 30.8 Build a `/blog` post schedule (founder-driven once tone is locked): one post per week, picking a new cell as a story.
- 30.9 Optional growth: Reddit + HN soft launch when the data feels good ("Show HN: I built an atlas of small-business benchmarks for 219 countries").
- 30.10 Track organic traffic in Vercel Analytics or Plausible; aim for 1k uniques / day within 90 days of public launch.

---

# Appendix A — Curated 16-category master menu spec

The order below is the visual order. Alphabetical sort is intentionally rejected.

| # | Sector | Icon | Tagline | Audience |
|---|---|---|---|---|
| 1 | Food & drink | 🍽️ | Where everyone eats | visible |
| 2 | Retail & shops | 🛍️ | Brick-and-mortar small retail | visible |
| 3 | Beauty & wellness | 💇 | Salons, spas, gyms, fitness studios | visible |
| 4 | Trades & home services | 🛠️ | Plumbers, electricians, painters, HVAC | visible |
| 5 | Hospitality | 🏨 | Hotels, B&Bs, hostels, short-term rentals | visible |
| 6 | Professional services | 💼 | Lawyers, accountants, consultants, marketers | visible |
| 7 | Software & tech | 💻 | Web dev, custom software, IT services, MSPs | visible |
| 8 | Real estate | 🏘️ | Agencies, leasing, local insurance brokers | visible |
| 9 | Transport (small) | 🚚 | Trucking, taxis, delivery, courier | visible |
| 10 | Manufacturing & artisan | 🏭 | Custom mfg, craft food, small-batch goods | visible |
| 11 | Construction | 🏗️ | Residential, light commercial, specialty trades | visible |
| 12 | Farming & food production | 🌾 | Farms, ranches, fisheries, craft producers | visible |
| 13 | Health & clinics | 🩺 | Doctors, dentists, vets, small clinics | visible |
| 14 | Education & instruction | 🎓 | Tutoring, music, language, dance, driving | visible |
| 15 | Creative & media | 🎨 | Photo, video, design, indie publishing | visible |
| 16 | Repair services | 🔧 | Cars, bikes, electronics, locks, alterations | visible |
| 17 | Pet services | 🐕 | Vets, grooming, pet retail, daycare | visible |
| 18 | Events & entertainment | 🎉 | Theaters, music venues, event producers | visible |
| 19 | Other local services | ✨ | Funeral, dry cleaning, smaller niches | visible |
| 20 | Cultural | 🏛️ | Museums, libraries, galleries (small) | visible |
| 21 | Mining & energy | ⛏️ | Oil & gas, utilities, mining | hidden (Pro) |
| 22 | Heavy industry | 🏢 | Pharma, chemicals, semiconductors, aerospace | hidden (Pro) |
| 23 | Finance (corp) | 🏦 | Banking, asset mgmt, large insurance | hidden (Pro) |
| 24 | Telecom & broadcasting | 📡 | Carriers, TV/radio | hidden (Pro) |
| 25 | Higher ed & hospitals | 🏛️ | Universities, hospitals, large institutions | hidden (Pro) |

Visible default: 20 sectors. Hidden behind Pro / `?show_large=1`: 5 sectors.

---

# Appendix B — Sector audit (current vs proposed)

| Current sector | Status | Proposed |
|---|---|---|
| `agriculture` (Farming, fishing & forestry) | KEEP, rename | `farming_food_production` (#12) |
| `mining_energy` | HIDE | Move to Pro-only `mining_energy` (#21) |
| `manufacturing` | SPLIT | Most goes to `manufacturing_artisan` (#10); pharma/chem/semi/aero/auto/heavy goes to Pro-only `heavy_industry` (#22) |
| `construction` | KEEP | `construction` (#11) |
| `wholesale` | KEEP | Wholesale folds into Retail or stays as a sub-category (decide later); for now KEEP |
| `retail` | RESHAPE | Becomes `retail_shops` (#2); ecommerce stays inside |
| `transport_logistics` | RESHAPE | Becomes `transport_small` (#9), large freight folded into corp_only `transport_corp` |
| `hotels_food` | SPLIT | Restaurants → Food & drink (#1); Hotels → Hospitality (#5); Catering split between |
| `information_media` | SPLIT | Software → Software & tech (#7); Media → Creative & media (#15); Broadcasting/telecom → Pro-only `telecom_broadcasting` (#24) |
| `finance_real_estate` | SPLIT | Real estate → Real estate (#8); Banking/Investment/Insurance → Pro-only `finance_corp` (#23) |
| `professional_services` | KEEP, rename | `professional_services` (#6) |
| `admin_support` | DROP, redistribute | Travel agencies → Hospitality; Cleaning + landscaping → Trades & home services (#4); Office support / call centers → corp_only |
| `education` | RESHAPE | Becomes `education_instruction` (#14); Higher education → Pro-only `higher_ed_hospitals` (#25) |
| `healthcare` | SPLIT | Clinics/dentists/vets → Health & clinics (#13); Hospitals → Pro-only `higher_ed_hospitals`; Childcare → Education |
| `arts_entertainment` | SPLIT | Theatre/casinos/amusement → Events & entertainment (#18); Sports/yoga/fitness → Beauty & wellness (#3); Museums → Cultural (#20) |
| `personal_services` | SPLIT | Hair/beauty/spas → Beauty & wellness (#3); Auto repair + repair shops → Repair services (#16); Funeral/dry cleaning → Other local services (#19) |
| (none) | NEW | Pet services (#17) |
| (none) | NEW | Cultural (#20) |
| (none) | NEW | Trades & home services (#4) |
| (none) | NEW | Repair services (#16) |
| (none) | NEW | Other local services (#19) |
| (none) | NEW | Events & entertainment (#18) |
| (none) | NEW | Manufacturing & artisan (#10) |

Net result: 16 visible sectors with clean SMB-first ordering. Five Pro-only sectors hidden behind the gate. Zero alphabetical orphans.

---

# Execution order recommendation

1. **Step 1** — DNS fix (founder action, ~5 minutes total).
2. **Step 27.1-27.4** — Set ANTHROPIC_API_KEY in Vercel (founder action, ~2 minutes).
3. **Steps 2 + 4 + 5** — Hide corp-only sectors + curated order + bundle fixes (engineering, ~1 day).
4. **Steps 3 + 16** — Kill "Coming soon" tiles by swapping to measured industries (~2 hours).
5. **Steps 11 + 12 + 13 + 14 + 15** — Visual refresh + master menu grid + first-frame data preview (~1.5 days).
6. **Steps 6-10** — Full taxonomy rewrite to 16-sector model + verification script (~1 day).
7. **Step 20** — Coverage audit script + diagnosis report (~half day).
8. **Step 21** — Re-run extrapolation with smarter fallbacks (~half day, depends on Step 20).
9. **Steps 22-25** — Sub-national ingest pipelines (multi-week, parallel per country).
10. **Step 26** — Coverage transparency on country pages (~half day).
11. **Steps 27.5-27.10** — Wire /ask UI changes, usage caps, monitoring (~half day).
12. **Steps 17, 18, 19** — Random cell, sector landings, home tactility (~1 day).
13. **Step 28** — Auth + saved-cells migration (~1.5 days).
14. **Step 29** — Stripe integration (~1.5 days).
15. **Step 30** — SEO + content marketing (continuous, founder-driven once tone is locked).

Total engineering effort across all 30 steps: ~12-15 working days, plus the multi-week ingest work (Steps 22-25) which can run in parallel.

---

# What the founder still owns

- DNS execution (Step 1)
- ANTHROPIC_API_KEY paste into Vercel (Step 27.1)
- Editorial tone decision (still blocking blog + per-cell narrative — out of this plan's scope)
- Image asset commission for the 18 surfaces in PLAN_V3.md §11
- Stripe account creation + product setup (Step 29.1-29.3)
- Final sign-off on the 20 visible sectors in Appendix A

---

*End of Plan v4.0.*
