# Margin Atlas , Product Direction (commercial) , ratified 2026-06-22

Founder 40-question product-brainstorm. This is the commercial + product layer above the visual system (`EXECUTION-CONSTITUTION.md`, `VISUAL-DIRECTION-AND-SEO.md`). It defines what we sell, to whom, the worldview, the new surfaces, and the build order. It also drives new requirements for the data-filling track (POPs, zones, immigration, intel).

## 1. Positioning
- **Primary user:** the **operator deciding WHERE to open or expand** a business (entrepreneur / expansion team). Everything optimises for this person.
- **Core job we're paid for:** a **decision engine** , "where should I open X?" The dataset becomes one ranked answer. Intel and data feed the decision.
- **Worldview: strongly opinionated, anchored in numbers.** We name the Western/EU tax-and-cost penalty and surface overlooked geographies (Gulf, SE Asia, LatAm, Africa). Honest realism, never ideology, every claim backed by a figure. This contrarian POV is a brand + SEO/AEO moat, not a risk.
- **Brand promise:** **"Where business actually pays."**

## 2. Product surface (new pages & tools)
- **The recommender (flagship tool):** pick a trade + what you care about (margin / low tax / easy hiring / cheap rent) -> a ranked shortlist of places. The reason to visit and to pay. Build a **working prototype scoped to UK cities + a few trades** in this vertical.
- **Custom dashboards / watchlist (premium retention):** save the places + trades you're weighing, compare side-by-side, get **alerts** when tax/rent/rules change.
- **New page types committed (all four):**
  - **Special-zones & regimes explorer** , free zones, cantons, SEZs, tax havens; a browsable explorer PLUS "where it's different here" flags on the pages they affect.
  - **Immigration-for-founders** , visa/residency routes to run a business, with cost/time/ease rating, ranked by ease, per country.
  - **POPs , population profiles** (see 3).
  - **Reports (PDF) + data API** , the paid tiers + a backlink/AEO engine.
- **Gold-mine intel:** every place/trade page carries 2-4 **flavored, non-obvious intelligence cards** (e.g. "Singapore: the electronics transit point Asia->Europe"). Woven into every page; the screenshot/share + AEO fuel.

## 3. POPs (population types) , a new ownable data layer
- **~8-10 capped archetypes** (e.g. high-earning professionals, wealthy/HNW residents, middle-class families, students/young renters, low-income locals, recent migrants, affluent expats, tourists, retirees, creatives).
- **Each archetype = a blend of wealth tier + life-stage + origin, plus a spending-power read** (what they actually spend, which is what an operator needs).
- **Shown as a composition mix per place** (e.g. Shoreditch = creatives 30 / young professionals 25 / tourists 20 / students 15 / other) with a tap-through profile per archetype.
- **Lives on city + neighbourhood pages** (the site-selection layer).
- Sensitive content: factual, numbers-only, describe-never-judge.

## 4. City maps , the spatial decision engine
- **A real MapLibre vector map, brand-styled** (greyscale + terracotta), with **toggleable data layers: rent / footfall / POPs / saturation** by area.
- **Interaction:** click a district -> its data panel; toggle the layer to re-colour the map.
- **Countries:** a light locator/region map for context only; the heavy interactive map is a **city/neighbourhood** feature where it drives decisions.

## 5. Missing topics (now in scope)
- **Special zones/regimes:** explorer + page flags (4 above).
- **Immigration-for-founders:** routes ranked by ease (4 above).
- **Tax depth:** keep the headline total burden, but **break out property/recurring taxes explicitly** (corporate + property + capital gains + the blend), property called out.
- **Sub-national variation:** flag the key **"where it's different here"** exceptions (Zug vs Geneva, UAE free zone vs mainland) as callouts now; full sub-national pages later.

## 6. The POV in practice
- **A recurring "honest take" verdict on every page**, PLUS a flagship **"Margin Index"** , a ranking that re-orders the world by **what an owner actually keeps** (tax + cost + margin), deliberately surfacing overlooked winners over high-tax Western defaults. Linkable, citable, on-brand centrepiece. **The UK ranks honestly low (high tax) and we say so** , even on home turf, the honesty holds.
- **Tone:** sharp, plain, evidence-first. "Western Europe taxes a business owner ~45% of profit; here's where you keep far more."
- **Sensitivity:** factual, numbers-only, describe never judge. The edge is on economics, not people.

## 7. Monetization
- **Generous free overview pages (SEO/AEO growth engine) + paid depth & tools.** The place/trade pages are largely free and crawlable; the recommender, dashboards, deep intel, zones, immigration and reports are paid.
- **#1 upgrade trigger:** the **decision tools** (recommender + dashboards). The tool is the product; the pages are the funnel.
- **Pricing:** subscription tiers , **Free / Pro / Team-Business**.
- **B2B:** a **Team/Business tier** (seats, API, exports, alerts) , likely where the real revenue is. Build individual tiers first, design for the upsell.

## 8. Homepage
- **Job:** the **decision-engine front door** , search + recommender front and centre, with the Margin Index and intel as proof.
- **Hero:** the cartographic world + command search + "Where business actually pays."
- **Below the hero:** a live recommender demo + the Margin Index (overlooked winners) + sample gold-mine intel cards + how-it-works/pricing.
- **Lead with the contrarian thesis** , one bold, numbers-backed hook ("The West taxes a business owner ~45%. Here's where you keep far more.").

## 9. This vertical's scope (what we execute NOW)
**London / UK + the homepage. One vertical, not horizontal fill.** New layers to prototype now: the **London interactive city map** and **POPs for London neighbourhoods** first; a **working UK-scoped recommender**; the Margin Index showing the **UK honestly low**; and **deep gold-mine intel** for UK/London as the proof-of-concept that sets the bar.

## 10. Build order
**Map -> POPs -> recommender -> gold-mine woven in -> homepage -> Margin Index.**
- Map tech: a **real MapLibre prototype** (live vector tiles, brand-styled) , needs internet when opened.
- Every build runs the locked QC (visual self-QC + build/critique/fix gate). Standalone HTML the founder opens.

## 11. New requirements this creates for the DATA track
(Flag to the data-filling conversation , see `DATA-FILLING-HANDOFF.md`.)
- **POPs**: archetype taxonomy + per-place composition mix + spending-power per archetype (city + neighbourhood granularity).
- **Maps**: per-district geometry + rent / footfall / saturation by area.
- **Zones & regimes**: sub-national zones with their tax/rule deltas.
- **Immigration**: visa/residency routes per country (cost, time, ease).
- **Tax depth**: property/recurring tax broken out per country.
- **Gold-mine intel**: 2-4 verified, non-obvious intelligence facts per place/trade.
- **Margin Index inputs**: the "what an owner keeps" composite per place (already mostly in the schema: tax_burden + costs + margin).

## 12. City neighbourhood map , ratified build spec (2026-06-23)
Founder interview (10 decisions), recommendations hardened by a 5-lens pressure-test (cartography / product / UX / data / monetization); 8 of 10 held at full consensus. London first, the scheme generalises to every city.

- **Unit:** curated **named commercial districts**, 15-25 per city, at one consistent scale (Shoreditch, Mayfair), never each city's admin units / boroughs.
- **Equivalence rule:** include by **local name + a commercial core + a soft size cap** (size is a tie-breaker, not the gate). Keeps a London and a New York district genuinely comparable. Needs a written curation rubric so analyst edges don't drift.
- **Marker:** **hybrid**, a filled polygon of the real district shape where we hold a trustworthy boundary, a small styled point as an honest placeholder where we do not yet (migrated to polygon over time). This is the fix for "circles too big".
- **Encoding:** **colour (heat) + the printed number** on each district. Collision rules: numbers above a zoom threshold or for the top districts, the rest on hover. Colour-only fallback if a layer's numbers are too rough to print.
- **Layers:** rent / footfall / spending power / saturation / **POPs**, all five behind the toggle, **Rent on first paint**. Fallback: Rent + POPs only if footfall and saturation prove too thin citywide.
- **Panel:** click a district to open a **right sidebar (desktop) / bottom sheet (mobile)**; the map stays in view; needs a collapse control + recenter-on-select. Contents = 3-4 metrics + POP mix + one gold-mine intel line.
- **Empty state:** a tight **"best for X" city overview** (use-case framed: best for premium retail / nightlife) + a click prompt, never an absolute league table.
- **Map and page:** the map is the **index / discovery surface**, the panel is a **preview**, a **deep-link** opens the full crawlable neighbourhood page. One district record powers both surfaces.
- **Coverage / honesty:** curated 15-25; **grey / hatch + "not held"** for missing data (never fabricated); a coverage floor gates a city's launch.
- **Premium:** **Rent map free** (earns the crawl + the first aha); **POPs / saturation / gold-mine intel / compare = Pro**. Show one POP mix free as a teaser and A/B-test where the paywall converts.
- **Base + scope:** positron greyscale + terracotta brand style; this is a **city / neighbourhood** feature, countries get only a light locator map.

**Open data dependencies (data track):** the curated district list + boundary polygons per city; per-district rent / footfall / spending / saturation; the POP composition mix per district; one gold-mine intel fact per district. London is the filled exemplar first (invented specifics permitted for London only).

## 13. Ratified design + monetization decisions (2026-06-23)
Founder interview, 40 questions (4 options each), recommendations generated and baited by a 5-topic brainstorm. The founder took the recommended pick on 39 of 40 (the single override is flagged). The design half (assets / disclosure / glass) ultimately belongs in the design constitution; recorded here as the single ratified source.

**Visual assets.** Build the **gold-mine intel card** visual language FIRST (the style wedge, reused by the map sidebar + recommender). Per-page spot illustrations in **engraved single-color line** style. POP archetypes as **engraved glyphs** (no faces), legible at 16px. Standardise icons on **Phosphor + a tiny custom domain set**, drop Lucide. Social / OG images = **dynamic per-page**, rendered with the page's real headline number + Margin Index rank. Empty / loading = **chart-shaped skeletons** + an honest "not held" line. Signature comparison visual = **slope dot-plot** (who keeps more, how the rank flips). All illustration / motif work = **coded tokenized SVG** in-repo (no bought art, no AI art).

**Disclosure model ("design hides things").** Above the fold = **verdict + exactly 3 proof numbers**. Below it, **each section's headline stays visible, the body collapses**. Depth ladder = **3 rungs: facade, click-panel, full page** (mirrors the map). Signal more with a **live count** ("+9 metrics"), never a bare chevron. Primary trigger = **click** (persistent panel), not hover. Thin data = **name the gap** out loud (visible honesty). Free users reach the **panel, but the tool / full intel is gated** (the deepest rung is the upsell). Detail lives in a **right-docked sidebar**.

**Glass rules (refines the law).** Glass allowed **only on chrome that floats over moving / scrolling content** (map controls, sticky nav on scroll, modals); static cards stay flat. Recipe = **warm cream-tinted frost** (~85-92%), not neutral white. Blur = **light 6-8px**. **Never behind a number (hard ban).** Map panel = **solid opaque body, glass only on its floating chrome**. Dark base map = **one recipe, auto light / dark fill swap**. Glass is **never a premium / tier signal**. Unsupported / low-power = **solid tinted fill fallback** (zero layout shift).

**New premium tools.** First new paid tool = a **what-if margin modeller** (drag rent / wages / price / volume, watch margin move), scoped to **3-4 levers** (no full P&L). **Team-Business tier defined by seats + shared workspaces.** "Benchmark your P&L" verdict = **ranked diagnosis** (name the worst lines). Premium alerts trigger on **rule / tax / visa changes**. AI = **grounded, cited data Q&A** (narrow, refuses to fabricate). Expansion tool = an **expansion sequencer** (where next and in what order). Fresh-data lever = **priority refresh on watched places + a visible "as of" date** (no live-data claim).

**Annual conversion.** Frame the discount as **"2 months free"**. Lead every annual prompt with **price-lock loss-aversion** ("lock this rate before it rises"). Annual-only gate = **full Margin Index history**. Ship **monthly-drip, use-it-or-lose-it credits**. Run a **capped founding-member cohort** (frozen rate + badge). Cadence value = an annual **"State of Margins"** report + **quarterly deep-dives**. Ask for the upgrade **right after a win** (a saved recommendation or a fired alert). **FOUNDER OVERRIDE: no money-back guarantee** (he chose to stand on the product over the recommended 30-day refund).

## 14. POPs (population profiles) , ratified spec (2026-06-23)
Self-answered 40-question interview, stress-tested by 5 adversarial lenses (replicability, common-sense, data-feasibility, ethics, coherence; 57 issues resolved). Built to the founder's hard constraint: ONE fixed, globally-replicable system, never hand-tuned per city.

**The fixed 8 (frozen, same everywhere).** Six resident life-stage / economic bands + one residual + Visitors as a flow:
1. **Students** , enrolled in tertiary / further education.
2. **Young professionals** , working-age ~25-39, no dependent children.
3. **Families** , household has dependent children.
4. **Established earners** , ~40-59, no children at home, not retired.
5. **Retirees** , 60+ / out of the workforce.
6. **Lower-income residents** , bottom local income band (the one deliberate economic exception; shown with its threshold number, never a "poor area" label, never a map dominant colour, no intel card).
7. **Other / Unclassified** , the structural residual (no glyph, no spend, never dominates a district).
8. **Visitors** , tourists + business travellers, a daytime FLOW shown as a "+X% daytime flow" chip BESIDE the resident bar, never stacked inside the 100%.

**The one rule (replicable anywhere).** Assign each resident to exactly one of the six bands by a single global priority decision-tree on age + activity-status + income-band (student > children-in-household > age / earner band > lower-income exception); leftover is Other; add Visitors separately from a tourism-intensity proxy. One fixed table, only the input numbers change. Affluence is NOT an archetype, it is an attached spending-power index. Origin is excluded entirely.

**Method.** The mix is a true headcount partition of residents (shares to 100 by largest-remainder), NOT a global-normalised blend. Spending-power index per archetype = modelled discretionary spend / city median (=100), via a national-accounts to regional-relativity to archetype-multiplier ladder, PPP-adjusted; that index is the only place a global reference is used. Place headline = absolute discretionary spend-DENSITY vs city + the top spend contributor (share x spend), NOT a sum of city-relative indices (which just tracks headcount).

**Granularity (the honest scope).** Bound to the §12 curated-district unit, >=5k-resident privacy floor. GLOBAL DEFAULT = one CITY-level mix per city. Sub-district (neighbourhood) POP bars render ONLY where a public small-area census exists (UK OA/LSOA, US tracts, parts of EU), flagged "district-resolution"; elsewhere the neighbourhood bar is suppressed and only the city read shows. No population-downscaling engine in v1. **This means: per-district POPs (the map POP layer) is a rich-country feature; for most of the world POPs is a city-level read. London is fully covered (UK small-area census).**

**Display.** One horizontal 100%-stacked resident bar (largest-first, glyph + label + integer %, Top-5 + Other, but the single highest spend-contributor is always surfaced). Visitors as a separate flow chip. Per-archetype spend chips + a templated "what they spend here" line (expenditure shares only, no lifestyle adjectives). Map POP layer = colour-by-dominant (printed share %, "<25% = mixed hatch"); Lower-income and Other can NEVER be a district's dominant fill (mixed hatch instead, detail in panel) so the map is never a deprivation / redlining choropleth. Engraved single-colour glyphs (object / role, never a face or cultural symbol), categorical palette (no good-to-bad ramp), one locked {name -> glyph -> hue} table. Numbers on flat opaque panels. Every bar carries an "as of <vintage>" stamp.

**Sensitivity (binding allow-list).** Archetypes derivable ONLY from age, income / expenditure band, activity / employment status, student enrolment, tourism intensity. BANNED as input and output: race, ethnicity, religion, national origin / foreign-born / migrant-stock, length-of-residence / newcomer, sexual orientation, and dense proxies (surname, country-of-birth, language). Describe-never-judge, mechanically linted: every POP string reduces to [archetype] + [share %] + [spend read]; banned constructs = evaluative adjectives (good / bad / desirable / up-and-coming), trajectory verbs (gentrifying / declining), prescriptions about who should live somewhere. Never rank people, only business-vs-place economics. Aggregate-only (>=5k), purpose-bound (commercial demand intel, NOT tenant-screening / lending / insurance / employment), EU/GDPR as the global floor. A build-time assertion fails anything not derivable from the allow-list.

**Confidence.** One 3-tier label per place: Measured (place inputs present) / Modelled (inherited from city / national, flagged) / Proxied (coarse national fallback); below that, an explicit empty state ("population mix not held for this district") with the bar OMITTED, never zeros, never a borrowed-neighbour mix. Other > 25% flags "low-resolution". Composite headline carries the weakest contributing tier.

**Recommender + intel integration.** Operator declares target archetype(s); each place scores by (share x spend-power) into a 0-100 audience-match sub-score (no hand-authored "this trade wants these people" table). Gold-mine intel = at most one POP card per place, restricted to life-stage + Visitors (suppressed for Lower-income / Other).

**Open data needs (data track).** City-level age + activity-status + income / expenditure bands per curated city (the global default); national household final-consumption expenditure + category split (the spend ladder); sub-national income / regional-GDP multipliers where held; tourism intensity per city (the Visitors chip); public small-area census ONLY for the rich-country neighbourhood upgrade. Per-place _meta records which rung supplied each number.

**Top residual risks (honest):** (1) neighbourhood POPs is a rich-country subset, not a 195-country deliverable; the global product is a city skeleton for most non-OECD cities. (2) the Lower-income band stays the highest-judgement-risk label despite the guards. (3) sub-city joint age x activity x income distributions are rarer than marginals; the modelled IPF step can bias band sizes and is flagged. (4) district-level Visitors needs footfall data we do not hold (shows 0 until sourced).

## 15. System-architecture decisions (2026-06-23)
Self-served 40-question interview through three roles (data analyst / editorial strategist / business analyst), each pick recommended-first; founder took the recommendation on all but one (flagged). These are the build rails; the full sequenced **master plan is at `docs/superpowers/plans/2026-06-23-master-plan.md`**.

**Data architecture.** 4-tier per-entity JSON (country / city / district / cell) with parent-refs; map inputs (POPs / tourism / rent / footfall / saturation) as first-class city/district blocks (same `_meta` / confidence / `as_of`); derived scores (Margin Index, audience-match, spend-density) batched into `derived/` artifacts, recomputed by input-hash; vintage = block `_meta` + a derived rollup (min/median `as_of` + confidence floor); per-feature coverage manifest gates launches; ONE central coverage resolver enforces "not held" everywhere; versioned migration scripts; tourism stored as a modeled intensity score + raw inputs (real footfall slots in later, additive); POPs in one block tagged by resolution (district where census exists, else city); reuse the drops to validate to ingest pipeline; Margin Index = pure derived artifact; a canonical district registry (slug + polygon + city_ref) is the join key; serving = static content pages + Supabase for accounts / state / tools.

**Editorial architecture.** Gold-mine intel derived from owned data via cross-dataset synthesis (the moat is the join, not the input); provenance-bound generation (a claim renders only if bound to a held datum + `as_of`); fully templated, data-slotted prose; voice = rules + phrasebank (deterministic verdicts); AEO = verdict-first extractable claims; coverage-gated programmatic grid (no thin doorway pages); like-for-like internal linking (one axis, no cross-geo rank); build-time blocking copy lint (no em-dash / no source-agency / describe-never-judge); Margin Index = transparent reproducible methodology; per-claim `as_of`; English + local units / currency; name-the-gap honesty on thin pages.

**Business architecture.** First paywall = city map layers (rent free, rest Pro); ONE tier axis = depth of decision (free verdict / Pro tools / Team scale); north-star = paid trials from a tool-wall; **Team = shared workspaces + API/bulk** (FOUNDER SHIFT: picked API+bulk as Team's core value vs the earlier seats+spaces in §13; reconciled as workspaces = the upsell trigger, API/bulk = the ACV lever, both in Team); free = all content, gated = all tools; annual lead lever = price-lock loss-aversion; market scope = deep-UK-paid / free-world; teaser = working-partial (blur the decisive lever); first growth loop = OG/AEO share; pricing + gates behind ONE central flag layer; evidence-gated roadmap (build the next surface only after the live one clears a paid-demand threshold); Pro = flat seat (unlimited tools); revenue MVP = the "London tools bundle" (London Pro map-layers + UK recommender).

## 16. POPs v2 , categorisation RESOLVED (2026-06-23, supersedes the §14 archetype model)
Founder interview, 20 distinct decisions (deduped from a 40-question heavy brainstorm). Supersedes §14's 8-archetype (age+activity+income) model. The describe-never-judge rule, the origin ban, Visitors-as-separate-flow, and the rich-country data caveat all carry over.

**One axis, zero overlap.** People are sliced by **LIFE-STAGE / age ONLY** (a single measuring stick, so slices never overlap and always sum to 100). Wealth is NOT a category, it is an **attached spending-power read** shown on each band.

**The fixed 5 (life-stage), same everywhere:** Students · Working-age (no kids) · Families (kids at home) · Older · Everyone else (pooled remainder).

**Mutual exclusivity:** each person counted **ONCE (heads, not households)**, which kills the "father + mother + 2 kids + grandmother = 5 things" mess; assigned by a **fixed priority waterfall** (full-time student, then parent-with-kids, then working-age, then older; first match wins). Edge cases: a student living at home = **Student** (education outranks housing); a self-employed 30-something = **Working-age** (employment type is a wealth/footfall nuance, not a life-stage).

**The base = people PRESENT, not registered citizens.** The donut divides **residents + commuters MERGED** (who is here on a typical day). **Tourists ride as a separate "+X times the base" multiplier**, never inside the 100%. Frequent non-commuter visitors are **absorbed by footfall** where that data exists. Measuring stick = **resident census as the universal spine + footfall/mobility layered where held**. Catchment = a **fixed walk/drive ring** around the spot. View = one **typical-day** figure (no day/night toggle in v1).

**Viz = a hover-reactive DONUT** everywhere (replaces §14's stacked bar; the per-head spend dots are CUT). **Centre = the total present count** (the "amount"; the slices carry the "type"). **Slices = neutral GRAYS + terracotta for the dominant group** (no green, no brown). **Hover a slice = its headcount + share.** Default = **raw local shares**, with **vs-national on hover** (second layer). **Slice cap = Top N + Other.** Thin data = an honest **"mix not held here yet"** placeholder (never borrow a neighbour, never fabricate).

**Open data needs (data track):** per-catchment life-stage counts for residents + commuters (census + travel-to-work spine, footfall where held); tourism intensity for the visitor multiplier; the attached spending-power read per band. Most cities start as resident-census-only (the honest fallback).

**PALETTE HARD RULE (founder, after rejecting moss-green + a brown ramp):** the page is strictly **terracotta + neutral GRAYS**. NO green (no moss), NO brown shades. In any value/cost chart the kept/positive = TERRACOTTA, the costs/the-rest = GRAY.
