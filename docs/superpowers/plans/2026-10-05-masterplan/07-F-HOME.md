# Phase F, steps 32 to 37: the home page (milestone 3)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md`. Tick boxes here; record each
> step in `LEDGER.md`.

**His rulings:** 11 ("a place-and-trade search, then the UK's headline answers; the recommender later, ranked by one real figure,
never a composite"); 23 ("a quiet band after the search and the UK answers: what Pro opens, the price, one button"); milestone 3
("the two criticised sections, 'What the atlas can see' and 'What an answer looks like', replaced; built to the UK page's
standard"); 2026-08-16 (the hero's h1 "How much does a [business] make in [city]?", "it was just perfect"); 2026-10-04 (the band
page; abandon the bento); 2026-09-22 refusals (no modal, drawer, toast, carousel, loader, filter chips, pagination). His notes on
the old home page: the hover over-bar (removed 2026-09-25, commit 30021d84), blog blocks with no placeholder image, the state-by-
state and world-map sections (archived 2026-09-25), "What the atlas can see" (no images, unclear), "The same question asked in five
countries" (no icons), "What an answer looks like" (badly executed): a reformation.

**What exists** (the map of 2026-10-05):
- `src/app/page.tsx` (783 lines) has two branches: the live one (flag off) in `SiteChrome` with hero + `NavigatorForm`,
  `Specimen` ("What an answer looks like", Supabase), `ExampleTiles` ("The same question, asked in 5 countries", Supabase),
  `AtlasLedger` ("What the atlas holds", read by the launch check's item (i)), `CatalogPlates` ("What the atlas can see"),
  `NeighborhoodCards` (Paris, Tokyo...), `AudienceBand` (links "The Margin Index", a coined index) with `UpgradeTeaser` ("Every
  benchmark is free to read", Basic $37 / Premium $77), the blog rail (six cards, all on a grey Positano photo, all six posts
  with a "retire" verdict in BLOG.md's research), `HomeNewsletter`. The flagged branch (`isHomeReformEnabled()`,
  `NEXT_PUBLIC_HOME_REFORM`) draws `src/components/home/home2-view.tsx`, whose "Free vs paid" says all reading is free and whose
  "The Margin Index" contradicts ruling 11: it is replaced, not kept.
- Search: `NavigatorForm.tsx` (country, city, business; defaults to US / Los Angeles / restaurants; the UK holds only London,
  Manchester, Birmingham and Edinburgh, not Bristol, Glasgow or Leeds; "Anywhere in the UK" lands on `/gb/gb/<trade>`; never
  lands on `/gb`, a city page or a district); `GlobalSearch.tsx` is a ⌘K modal dialog (in `HeaderSearch` on every page): a modal
  his refusals forbid; `/api/go` is a no-JS redirect with slug checks.
- The UK's headline answers, already built and gated: `buildHeroBoard("GB")` (the answer: total tax burden 18% on $52K of profit,
  a sole trader), `buildLondonTradeSales()` (what London's trades take, $220K the middle trade), `buildSurvival("GB")` (38% of new
  firms still trading after five years), `buildCityCards` for the UK's cities (London $62K, Manchester $48K, Birmingham $48K,
  Leeds $49K). The home prints each with the same name and value as its page, never a second number for the same thing.
- The editorial feed (`E:/atlas/registers/uk/tables/editorial_feed.json`, built 2026-10-04) and its seven formats wait for his word
  (HOMEPAGE-EDITORIAL.md; QUEUE `home:editorial` PARKED): not built tonight. Its doc's figures drifted from the feed; any later
  build reads the feed.
- The harness touch list for a new surface (12 places): the view folder (`src/components/spine/home/`), `LOUD_SEATS` and
  `SPINE_PAGES` (`scripts/lib/loud_seats.ts:37`), `render_page.tsx` (a `case "home"`), `scripts/harness/pages.json` (stem
  `home-gb`), `FLOOR_BY_SURFACE` in `check_model_laws.mjs` (and the floor census, which copies the floors: rerun it), the census
  rows (`census.ts --write`), `LINK_FLOOR`/`surfaceOf` in `check_page_links.mjs`, `expectedAnswer` in `verify_doors.ts`,
  `page_renders.mjs` (drop `home` from `FROZEN` and map the new stem in `BASELINE_KEYS`: four gates still judge the 2026-09-08
  render), the ratchets at zero for a new page, the five source gates with file lists (`verify_no_eyebrow.ts`,
  `verify_subsection_icons.ts`, `verify_bar_budget.ts`, `verify_no_bold_display.ts`, `verify_banned_patterns.ts`), counts.

---

## Step 32: the home page's frame on the band page, in the harness

**Files:** Create `src/components/spine/home/home-view.tsx` (zones from `src/components/spine/zones.tsx`, PART 10); Modify
`src/app/page.tsx` (the flagged branch draws the new view; `home2-view.tsx` and the modules only it imports are deleted after a
search for other importers); the twelve harness places above.

- [ ] **The frame:** the first zone holds the h1 his ruling kept (with its rotating word) and the search (step 33 fills it); then
  zones for the UK answers (34), the UK's cities (35), what the atlas holds (35), Pro (35), the notebook and the newsletter (36).
  No chapters (a home page is not a reading in chapters); one 40 on the page, at the UK's answer (PART 4).
- [ ] **The harness surface** `home`, page `home-gb`, through all twelve places; `FLOOR_BY_SURFACE.home` set to the block count
  the finished page will hold (count it at step 37 and set it then; until then the page is under its floor and the ledger says
  so); `LOUD_SEATS` declared for three moments (the 40, the search's button, the Pro band's button), each checked at step 37.
- [ ] **Verify:** `tsc`; render `home gb`; `pages-fresh`; `census-fresh` (write); the five source gates. **Commit:** `32: the home page's frame on the band page, rendered and read by the harness`.

## Step 33: the place-and-trade search, UK first, and no modal anywhere

**Files:** Modify `NavigatorForm.tsx`, `src/lib/home/search_cascade.ts`, `src/lib/cities/city_aliases_generated.ts` (or its
generator), `src/app/api/go/route.ts`; Create `src/lib/home/destination.ts` (pure) and `tests/home/destination.test.ts`; Create
`src/app/(site)/search/page.tsx` (server-rendered results, noindex); Modify `GlobalSearch.tsx` / `HeaderSearch.tsx` (the header's
search becomes a link to `/search`; the dialog is deleted).

- [ ] **Where a search lands, one tested function** `homeDestination(country, city, trade)`, answering only pages that exist,
  checked against the lists the routes check (`countryPageTarget`, `geoPageTarget`, `cityPathFor`, the trade list, the cell
  route's own rule for which places hold trade pages): GB + London + a trade: `/gb/london/<trade>`; GB + another UK city + a
  trade: that trade's page in the city if the route holds it, else the city's page; GB alone: `/gb`; a UK city alone:
  `/cities/<city>`; "Anywhere in the UK" + a trade: the London trade page is a different place, so the trade's industry page;
  any other country: today's behaviour. The test walks all seven UK cities against six trades and asserts every answer is a page
  that exists (the same lists), never `/gb/gb/...`.
- [ ] **The form, UK first:** defaults GB, London, restaurants; the UK's seven cities (Bristol, Glasgow and Leeds added from
  `data/cities/city_list_v1.json` through the alias generator, not typed); the "Try" line's examples in the UK, from rule 32's six
  trades (`scripts/verify_trade_set.ts` reads that line: keep it green). The combobox list is a form control in the page's flow,
  the hero he kept; nothing opens over the page.
- [ ] **`/search`:** a GET form (works without script) listing matching UK places and trades as rows of doors, then other
  countries; `robots` noindex; no pagination (the list is short by construction: at most a screen of rows, the rest by narrowing).
  The header's ⌘K dialog goes; the header's search control links to `/search`.
- [ ] **Verify:** the test, `tsc`, `trade-set`, `dead-links`, `doors`, `main-landmark`, `route-chrome-contract`, `page-metadata`.
  **Commit:** `33: the search lands on pages that exist, UK first; no modal search`.

## Step 34: the UK's headline answers

**Files:** `home-view.tsx`; a small pure module `src/lib/spine/home_answers.ts` (calls the existing builders, returns what the
view draws, with provenance); a test (rule `home-answers`).

- [ ] **The band:** three sections at the level of three (`1-1-1`, PART 10.5): the UK's answer (the tax burden at 40, the page's
  one 40, its line as the UK page words it), what London's trades take (the middle trade's sales at 30, three rows), who is still
  trading (38 of 100 after five years at 30). Each section is a door to the section it summarises (`/gb#take`,
  `/gb#trades`, `/gb#years`), with `data-lands` (the doors gate).
- [ ] **The test:** each figure equals the same builder's value on `/gb` (same name, same unit); provenance carried through.
- [ ] **Verify:** render; `harness-laws` (FOCAL, the 40 once), `harness-copy-plain`, `doors`, `provenance`. **Commit:** `34: the home page leads with the UK's answers, each the same figure its page prints`.

## Step 35: the UK's cities, what the atlas holds, and the quiet Pro band

- [ ] **The cities:** the UK's city cards (`buildCityCards`, the field look with the city photograph he kept), doors to
  `/cities/<slug>`.
- [ ] **What the atlas holds:** `AtlasLedger`'s four counts rebuilt as an open section on a zone (PART 10.3), the same figures from
  `src/lib/home/atlas_ledger.ts`; keep the markup the launch check's item (i) parses (`verify_launch_ready.ts` L542-573), or
  repoint item (i) at the new markup in the same commit.
- [ ] **Pro, quietly** (ruling 23): one zone, drawn only when `isPaywallOn()`: one line on what Pro opens ("The second half of
  every UK chapter, and four Pro sections."), the two prices through `priceLine` (never a typed `$38`: the `one-price` gate), one
  button to `/pricing`. Nothing about Pro prints while the switch is off.
- [ ] **Verify:** render (once with the paywall switch on, once off); `one-price`, `doors`, `harness-laws`, `harness-copy-plain`.
  **Commit:** `35: the UK's cities, what the atlas holds, and Pro said once, quietly`.

## Step 36: the notebook, the newsletter, and no terracotta on a hover

- [ ] **The notebook rail:** each card's image is the post's own `image:` when it has one, else the UK's photograph
  (`/countries/gb.jpeg`, from `data/cities/country_images_manifest.json`), never the Positano skyline (`city_cards.ts:106`). Which
  posts: the research's two "keep" posts (firm against establishment; median against average) until he rules on BLOG.md's keep 2,
  rewrite 10, retire 58: a list in `src/lib/home/notebook.ts`, parked for his word.
- [ ] **The newsletter band** (`HomeNewsletter`) on a zone, unchanged in what it asks.
- [ ] **No terracotta on a hover** (MODEL PART 6, FLOW.md's `verify_no_terra_hover`, specified, never built): a source gate over
  `src/components/spine/**` and the home view: no `hover:` class using the terracotta tokens; seed a ratchet at today's count for
  the older spine views (`country-view.tsx:185` is one) and zero for the home view.
- [ ] **Park** in `PARKED.md`: (1) the posts the notebook shows (BLOG.md); (2) the editorial feed's formats on the home page
  (HOMEPAGE-EDITORIAL.md; recommendation: two fresh, like-for-like formats first, "the duel" from fail-most and the ranked list,
  each checked against the 45-day rule); (3) deleting the old home branch and its components once he approves the new page.
- [ ] **Commit:** `36: the notebook on the UK's photograph, the newsletter, no terracotta hover`.

## Step 37: the home page, held to the UK page's standard

- [ ] **Count and set the floor:** the finished page's block count becomes `FLOOR_BY_SURFACE.home`; rerun the floor census
  (protocol section 5; it copies the floors) and commit `data/seo/floor_census.json`; add `home gb` to the launch check's
  exemplars (`verify_launch_ready.ts` EXEMPLARS L136-155).
- [ ] **Every gate at zero for the new page:** `harness-laws`, `harness-page-laws` (ZONE TONES, ZONE PAD, ZONE SPLIT, OPEN
  SECTION, SPLIT ROW, HEAD LINES), `harness-copy-plain`, `harness-links` (a `home` floor set at the measured count), `doors`,
  `loud-seats` (the three moments lit), `provenance`, `page-holes`, `census-fresh`, the four gates that read the frozen render
  (`verify_radius_uniform`, `verify_flag_marks`, `verify_full_width_sitewide`, `verify_form_variety`) now reading the new one.
- [ ] **Photographs** at 375, 768 and 1280, the whole page in slices and each band; one sheet
  `E:/atlas/design/loop/build/photos/m3/MILESTONE-3-SHEET.jpeg` with a before (the live home) and after. Look at every slice.
- [ ] **Commit** both repos: `37: the home page held to the UK page's standard, behind its switch`.
