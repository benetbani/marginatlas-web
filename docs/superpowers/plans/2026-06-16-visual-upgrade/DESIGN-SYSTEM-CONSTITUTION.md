# Design System Constitution , Margin Atlas

> THE single source of truth for the visual system. The one rule that kills drift and hallucination: **nothing gets built unless it is locked here first.** I do not invent; I port what this file says. Decisions are locked through the 3-options cadence (I show 3 brand-accurate options, the founder picks, the winner is recorded here with its exact values). Started 2026-06-18. Standing law still binds (honesty boundary, tokens only, no em-dashes, no source-agency names, one accent).

## Operating model
- One open decision at a time (or in batches of section-types), each shown as **3 excellent, brand-accurate options** in a standalone HTML the founder opens.
- Founder picks one (or a blend). The winner is written into the Decision Log below with exact values + rationale.
- Only once a decision is locked may it appear in a page build. Pages become a mechanical port of locked decisions.

---

## Decision Log (locked, append-only)

### L1 , Layout architecture = BENTO (2026-06-18)
A 4-column bento grid of small tiles. A "section" is a **cluster of tiles** under a small kicker, never a lone full-width band (masthead + the one closing line are the only full-width exceptions). 2 to 4 tiles per horizontal band. One focal point per cluster. Chosen from the 3 bento options (Option B, SaaS bento). Source: `country-bento-options.html`.

### L2 , Foundation finish = "Soft" / Foundation B (2026-06-18)
Chosen from `design-foundations-round1.html` (A Crisp / B Soft / C Editorial). Exact locked values:

- **Grid:** 4 columns, 12px gap; collapses 4 to 2 (<=680px) to 1 (<=440px).
- **Tile:** background `--cream-50`; border `1px solid --cream-300`; radius **14px**; resting elevation `--shadow-subtle` (tiles read lifted); padding **16px**. `--shadow-card` only for raised/interactive tiles (calculator).
- **Focal tile:** spans 2 columns; `linear-gradient(to bottom, --atlas-50, --cream-50)`.
- **Type (Inter sans dominant):**
  - eyebrow / kicker: 10px, 700, .15em, uppercase, `--atlas-700`
  - tile / cluster head: **17px, 600**, `--ink-900`
  - stat number: **24px**, 500, `--ink-900`, tabular
  - body / label / read: 12.5px, 400-500, `--ink-700`
  - caption / footnote: 11px, `--ink-500`
- **Serif (Newsreader):** RETIRED from page chrome (2026-06-18: founder chose the all-sans masthead 7A). The system is **all-sans (Inter)**. Newsreader may appear only as an optional one-line editorial closer if the founder later asks; default is sans everywhere.
- **Numbers:** `tabular-nums lining-nums` (.num) on every figure.
- **Accent:** one terracotta (atlas); moss = positive/kept only; amber = caution only; cocoa/ink/cream carry the mass. Accent marks the subject only.

(Tokens themselves are the proven `:root` map from `cell-london-restaurants.html` and `00-global-standards.md` section 2.1, unchanged.)

### L3 , Scorecard section type = "lead + supporting, with reads" (2026-06-18)
Option 1C layout (one focal lead stat in an atlas-tinted tile, supporting stats in small tiles) + the 1B contextual reads (a small glyph + one or two words per supporting stat, e.g. "heavier than peers", "fast"). Source: `design-sections-batch1.html`.

### L4 , Ranked comparison section type = bars (2026-06-18)
Option 2A: horizontal bars, label + bar + value, ONE shared scale, subject bar in atlas, peers in cocoa. Source: `design-sections-batch1.html`.

### L5 , Rating section type = GRADIENT SPECTRUM (2026-06-18)
Option 3B, corrected. A continuous track per row with:
- **Oriented poles:** the negative/worse pole ALWAYS on the LEFT, the positive/better pole ALWAYS on the RIGHT, every row, no exceptions. (e.g. tax burden = Heavy left, Light right; contracts = Weak left, Strong right.)
- **Colored gradient track:** left = neutral gray (`--cocoa-300`) fading to right = positive `--moss-600`. Never a flat single-color track (reads bland).
- **Marker:** a dot in `--atlas-700` at the true position (where the situation actually stands), computed.
- Serves character, difficulty, severity, climate, anywhere a quality is rated.

### L6 , GLOBAL BAN: no discrete 4-level pips or segmented meters (2026-06-18)
The 4-rung pip rows ("●●●○") and the 4-segment meters are BANNED site-wide. The founder's words: "they look like Lego / forks, very simplistic, very bad." Every rating uses the L5 gradient spectrum instead. This SUPERSEDES: the pip atom in the country character two-table, the country strength matrix (becomes spectrum rows), and any pip usage in the prior mockups.

### L7 , Money split section type = DONUT + legend (2026-06-18)
Option 4A. A donut (computed arcs) with the owner-kept slice in `--moss-600` and emphasized, a center label ("£10 kept of £100"), and a full legend listing every slice with its value. Cost mass in cocoa/ink/cream; one accent rule holds. The cell page may also carry the 100% companion bar (founder's earlier honesty pairing); elsewhere donut + legend is enough. Source: `design-sections-batch2.html`.

### L8 , Spread section type = DISTRIBUTION CURVE (2026-06-18)
Option 5B. A single density curve (computed path), atlas line + gradient fill (.22 to .02), a dashed marker at the typical value (computed position), baseline rule, and low / typical / high ticks below (typical tick in atlas). Source: `design-sections-batch2.html`.

### L9 , Score band section type = RADIAL GAUGE, SMALL (2026-06-18)
Option 6B, rendered MUCH SMALLER (founder note). A compact semicircle gauge (~80 to 96px wide, not a hero): background arc `--cream-300`, value arc `--atlas-600`, a marker dot, the score number centered. Because it is small, peers ride alongside as context chips / a one-line read, not as ticks on the tiny arc. Cities are the ONLY scored entity. Source: `design-sections-batch2.html`.

### Confirmed 2026-06-18: spectrum gradient ends in MOSS (good) from gray (bad); the refined scorecard (L3) and spectrum (L5) are locked as shown in `design-sections-batch2.html` top row.

### L10 , Masthead section type = COMPACT BENTO, ALL SANS (2026-06-18)
Option 7A. No giant serif hero. A focal tile (eyebrow + place name in 20px Inter 600 + one-line read) spanning 2 columns, beside a strip of 3 stat tiles. Sans throughout. This resolves the serif question (see L2): the system is all-sans. Source: `design-sections-batch3.html`.

### L11 , Flow of money section type = FUNNEL (2026-06-18)
Option 8B. Stacked horizontal bars of DECREASING WIDTH (100 to 65 to 19 to 7 percent), each labeled with its value and stage; the final kept bar in `--moss-600`, cost stages in cocoa/ink. Computed widths. Replaces the earlier shrinking-vertical-bars idea for industry. Source: `design-sections-batch3.html`.

### L12 , Diverging / multiplier section type = DIVERGING BARS (2026-06-18)
Option 9A. One shared scale, 1.0x at centre; lifts extend RIGHT (cocoa, subject atlas), squeezes extend LEFT (cocoa-300); centre rule; computed offsets (50 percentage-points per 1.0x). Capped values ("2x or more") get a right-edge fade. Axis ends labelled squeeze / 1.0x / lift. Source: `design-sections-batch3.html`.

### L9b , Confirmed: small score gauge is the locked size (2026-06-18)

### L13 , Navbar = classic (10A) (2026-06-18)
Logo left, centered nav links (Countries / Industries / Cities / Compare), search icon + one dark CTA pill right. Sticky, cream-75 blurred, hairline bottom. Source: `design-sections-batch4.html`.

### L14 , Footer = newsletter-forward (11B) (2026-06-18)
Dark ink-900. Brand + blurb + a short email capture in the wide first column, then 2 to 3 link columns, then a legal strip. Source: `design-sections-batch4.html`.

### L15 , Data table = zebra (12C) (2026-06-18)
Alternating cream rows, subject row tinted atlas-50 with a left atlas rule (no crown), right-aligned tabular numbers, 2px ink header underline. Source: `design-sections-batch4.html`.

### L16 , Icons (written rule) = one line family (2026-06-18)
One Lucide-style line-icon family, 1.8px stroke, round caps, ~20px inside a 40px `--atlas-50` rounded chip. One family only; icons clarify, never decorate; color ink/atlas per role. Provisional default, adjustable.

### L17 , Number formatting (written rule) (2026-06-18)
Tabular lining figures everywhere (.num). Currency with symbol, no decimals at scale (£503K, £48K); percentages whole or one decimal; ranges "low to high"; negatives sign-first (minus before symbol); thousands grouped (8,200); multiples "1.4x", capped "2x or more". Provisional default, adjustable.

### L18 , Motion (written rule; we govern it ourselves) (2026-06-18)
One easing `cubic-bezier(.16,1,.3,1)` (ease-out). Durations 120 / 180 / 240ms. Animate ONLY: hover (color/elevation, 180ms), a one-time scroll-reveal (12px rise + fade, 240ms, motion-safe), accordion/expand (180ms). NEVER: parallax, bounce, looping, decorative motion, carousels, charts redrawing on scroll. Honor `prefers-reduced-motion` (no transforms, instant). Provisional default, adjustable.

---

## Backlog (open decisions)

**Foundations**
- [x] Layout architecture (L1)
- [x] Foundation finish: type/radius/borders/elevation/density (L2)
- [x] Color-usage rules (covered by L2 accent rules + per-token semantics)
- [x] Icon family (L16)
- [x] Number formatting (L17)
- [x] Masthead treatment + the serif question = all-sans compact bento (L10)

**Components / section types** (decided in batches of 3 types x 3 options)
- [x] Scorecard / vital stats cluster (L3)
- [x] Ranked comparison (peers / where-it-earns / cost drivers) (L4)
- [x] Rating / character = gradient spectrum (L5); 4-level pips/segments BANNED (L6)
- [x] Money split (per-$100) = donut + legend (L7)
- [x] Range / distribution (revenue spread) = distribution curve (L8)
- [x] Score band (city climate score) = small radial gauge (L9)
- [x] Flow of money (industry) = funnel (L11)
- [x] Diverging / multiplier (neighbourhood squeeze) = diverging bars (L12)
- [x] Tables (dense data-table) = zebra (L15)
- [x] Navbar (L13) / footer (L14); buttons/badges/empty state follow the same tokens

**Motion** = L18 (locked default). **Voice** = quiet editorial, plain human copy (existing rule).

**STATUS 2026-06-18: vocabulary complete. Next = assemble the COUNTRY PILOT to this Constitution for founder sign-off, then the other 5 pages.**

**Motion** (governed ourselves; the $20 LottieFiles tool was declined 2026-06-18)
- [ ] Durations token set
- [ ] Easing curve(s)
- [ ] What animates (hover, scroll-reveal, number count-up, expand)
- [ ] What NEVER animates (the bans)
- [ ] Reduced-motion behavior

**Voice**
- [ ] Copy register, caveat phrasing, microcopy

---

## Notes
- LottieFiles "Motion System" ($20) declined 2026-06-18: it governs motion tokens (durations/easings, W3C DTCG, Figma + code export) for teams shipping rich Lottie motion. Margin Atlas motion is deliberately minimal; we govern ~6 motion tokens ourselves in this file. Revisit only if animated illustrations are ever wanted (currently banned by the restraint rules).

---

## Binding principles from the 2026-06-18 page review (founder)

The country pilot was rejected for executing without editorial judgment. These bind every page plan and build, alongside the locked vocabulary above:

1. **The sanity filter (every section earns its place).** Before a section ships, answer: "Is this pathetic? Would a smart reader already know this or not care?" Cut worthless cards. Founder's rejected examples: "minimum wage rising steadily" (worthless), "active businesses 2.7M" (pathetic), "consumer card spend: High" (pathetic). Each card needs a SPECIFIC role that changes a decision.
2. **Metric rating + good/bad signal (restore + extend).** Numbers are NOT equal weight and need orientation for a non-business reader. Every key metric carries a calibrated read (weak / fair / strong / excellent, or a good-to-bad color cue) so the reader instantly knows whether a number is good or bad. Decisive metrics lead (size/position); supporting ones are smaller. The original 8-metric scorecard had this (pip + word); it was wrongly dropped.
3. **Hero = full-bleed place image + the 8-metric scorecard.** The country/place hero spans left to right with a background image of the place, carrying the agreed 8-metric "at a glance" scorecard WITH the good/bad ratings. The 8 (country, recovered from the original): GDP per capita, average salary, net wealth per adult, days to start, ease of business, minimum wage, population (home market), cost of living. Restore, do not drop.
4. **Long pages.** Every page type is a LONG page with many sections and rich related-links. Stop trimming to short.
5. **Levels, not bare ranges.** A pay section shows levels/roles (junior / mid / senior, or by role) with the spread, never just "low to high".
6. **Visual hierarchy + grouping.** Group related sections; lead reads vs supporting; never all-equal-weight tiles; no identical card grids (impeccable + ui-ux-pro-max ban).
7. **Use the bought assets (shadcnblocks) heavily** + universal visual assets (place imagery, map motif, icons) so pages feel alive, not robotic. Do not gravitate to un-bought tools; do not invent visuals beyond the locked vocabulary; do not destroy existing work.

Detailed per-page architecture lives in `page-guidance/` (authored 2026-06-18, founder approval pending before any execution).

## Round-2 review of the country pilot (2026-06-18) , new binding rules

1. **No graphic type appears more than TWICE on a page.** Donut, bars, spectrum, table, etc. each used at most 2x. Forces variety; kills repetition.
2. **"?" help tooltips, site-wide.** Hard terms carry a small "?" that reveals a hover tooltip explaining the term. A few per page, never overdone. (e.g. "employer contributions to salary", "small business tax".)
3. **Hero scorecard cards get conditional STATUS color + a status word + size hierarchy** (research-backed: categorical color beats raw gradient). The value is colored by good/caution/neutral, a status pill carries the word + glyph, a subtle tint reinforces, and the 1-2 lead metrics are larger. Each card reads with "its own spirit", not bland black numbers.
4. **Hiring = FOUR universal levels site-wide:** Intern, Junior, Experienced, Manager. Universal across countries and trades; on one shared pay scale with medians.
5. **Literal term names:** "small business tax" (not "business tax"), "registration fee" (not "register"), "employer contributions to salary" (not "payroll on-cost"). Plain and specific, each with a "?" where useful.
6. **City cards carry 3 synthetic figures** (population + 2 relevant, e.g. typical wage, rent level), no prose subtitle.
7. **CUT from the country page:** the "what an owner keeps" donut (take-home belongs to the cell/industry, never a whole country; link down only); the "spending power" card and the "how costs have moved" card (worthless, scrapped).
8. **Country "shape" reformed:** the flat 7-row spectrum stack as the aggressive second section is removed; replaced by a compact, readable RADAR / polygon profile (founder reversal: explicitly asked for "a hexagon or a figure with more angles"), framed as a profile, never a score.
9. **"Easiest to break into" replaced by FIVE universal common business types** (Hotels, Restaurants, Medical clinics, Grocery stores, Gyms) with an ease-to-open read each, in a distinct graphic. Universal on every country page.
10. **Remove redundant subsection labels;** rely on movement headers (slightly bigger) + each card's own title. Avoid big chunks of text everywhere.
11. **Replace worthless reads with decision-relevant ones** (e.g. business survival odds over 3 years instead of "spending power: high").
12. **Pages longer, more sections, more graphic TYPES** (within the 2x rule).

## Round-3 review of the country pilot (2026-06-18) , new binding rules

1. **The radar "shape": cut the Demand lens** (it biases toward big countries and reads badly). Remaining lenses make a hexagon. Rename it (not "the shape of the economy", that label is wrong). Render it **small, occupying only the right half of its band**, paired with something on the left, not full-width.
2. **Spectrum marker = a thin BLACK vertical lever** (`--ink-900`), not the red circle. Applies to every spectrum.
3. **Culture spectrum (descriptive): orient consistently** , the Anglo-Saxon-culture pole always on the RIGHT, the opposing pole on the LEFT, every row (reserved/closed/indirect/formal/measured on the left; outgoing/welcoming/direct/casual/fast on the right, or whichever way keeps one cultural family on one side). The UK's markers should cluster on one side, not scatter.
4. **Culture spectrum track color = atlas (red) on the LEFT to gray (cocoa) on the RIGHT** (a distinct, deliberate two-tone, different from the rules' gray-to-moss good gradient). The rules spectrum keeps gray-bad-left to moss-good-right.
5. **Rules-from-a-business-view: use more literal, direct pole terms** (plainer than "greased / murky"). 
6. **Every section needs a visible section NAME** (cities shipped without one, fix). Movement headers name each section.
7. **CUT "versus the world"** (pointless: everyone knows Switzerland is rich; a GDP-vs-world bar reflects nothing useful). The "close" movement is trimmed.
8. **Critical shortage of section TYPES.** The country page (and every page type) must be MUCH longer with many more distinct sections, each a new graphic as the reader scrolls (content AND visual novelty), within the no-graphic-more-than-twice rule. Section menu brainstormed + founder-selected (in progress).

## Round-4 review of the country pilot (2026-06-19) , new binding rules + decided fixes

GLOBAL RULES (set as law, site-wide):
- **No appended phrases on titles** ("a shape not a grade", "read each on its own terms", "UK trait sits on the right"). Titles are the name only. BANNED everywhere.
- **No per-instance conclusion sentences / subtitles on repeated sections.** A section that repeats across countries cannot carry generated prose reads or a "so-what" footer. Let the visual speak. The reader infers.
- **Fewer footers (most have no value); more "?" tooltips** for terms (universal term + the local term/how-it-works, a "double referral").
- **Cut the over-use of horizontal bars.** Diversify visuals; lean on pies/donuts, gauges/radials, conditional-color tables, icon-stat cards. Horizontal bars are tiring and over-used.
- **Comparison tables: the best value in each column is dark-green (`--moss-700`)** to make the table feel alive; keep "?" on column headers.
- **Scorecard cards equal size** (the lead-bigger treatment is wrong); hero is shorter.

COUNTRY-PAGE DECIDED FIXES:
- Flag BEFORE the country name and bigger; remove the "small-business economics" eyebrow.
- **Radar / economic profile: small, on the LEFT (its own card); "what it costs to set up" on the RIGHT, bigger.** Each of the 6 axes shows a NUMBER 1 to 10 (colored), with a "1 to 10 scale" guide; bigger number = better on every axis (so "cost to run" becomes an affordability-style axis). Rename "People" (reads badly) to a workforce/talent framing.
- **REMOVE from country (a country-wide figure is wrong): "the real monthly cost to operate", the "all-in tax" waterfall, the "trading year" calendar, "will it still be trading in 3 years", "what rising wages mean".** SAVE the monthly-cost and the tax breakdown for the BUSINESS (cell) pages. The waterfall is disliked (unintuitive) , find a better tax visual on the business page.
- "Getting in / red tape": make TALLER, more local detail (good place for relevant local info).
- "The cover you can't trade without" (insurance): wrong graphic; redo with a non-bar visual, up to ~10 cover types, universal + local naming, its own section (not full-wide bar row).
- Hiring: make it HALF width (pay levels); add a NEW right-half section "how easy it is to hire" (speed, procedures, employer-vs-employee rights balance).
- "Where money & jobs are" (treemap): keep (good), but Services must NOT be terracotta and must split into sub-sectors; every sector gets a subtitle of what it includes; bigger % numbers; full-wide, this tall.
- Household budget: retitle (it is about how rich/where the customer spends, not "who your customers are"); use a PIE/donut (not a bar); relate categories to the businesses the site covers (food to grocery, essentials to pharmacy).
- Five common trades: drop the mono-color tiring bars for a livelier visual; show the open-from cost as ONE bigger number (no repeated "open from" phrase); no footer.
- Risk-by-axis: keep (a valid horizontal-bar case) but the black median tick is unclear , clarify or remove.
- Exit climate: make it LONGER (business dynamism, the private-equity scene, how easy to sell); execution TBD.
- Cities: RULE = only cities in our database; RULE = the section grows as cities are added; cards use the city SKYLINE as a background image (placeholders now), with a legible overlay (solve the dark-on-dark aesthetics).

STRATEGIC TENSION (to resolve via the 20Q interview): the page currently reads as "a nice FREE page" with little to pay for. We need 10+ more PREMIUM sections, and a decision on where advanced info (e.g. licensing) lives: derivative premium pages per country (+400-500 pages, scary) vs in-page premium gating vs pushing depth to city/business pages. Where to draw the free/paid line is the core open question.

## 20-question interview outcome (2026-06-19) , the country-page model

**Business model (R1):** ONE country page. Generous FREE overview + PREMIUM-GATED sections inline (blurred preview + an unlock prompt). NO derivative pages (no page explosion). The pay-worthy core = the LOCAL OPERATIONAL HOW-TO. Free = overview, paid = depth + tools.

**The 13 new sections to add (R2):** FREE = Payments & getting paid, Cost-competitiveness vs peers, How easy it is to hire, Talent & skills, Financing & lending climate. PREMIUM-GATED (blurred teaser + unlock) = Licensing & permits by trade, Property & premises in depth, Compliance & key deadlines, The insider operational playbook, Company structures & banking reality, Grants & incentives, Exporting & selling abroad, Local business culture in depth.

**Visualization decisions (R3-R5):**
- Radar: a colored 1-10 NUMBER at each axis tip + a "1-10" scale note; bigger = better; "People" renamed **Talent**.
- Insurance: a detailed COST-RANGE TABLE (universal name + local name, what it covers, typical annual cost, mandatory/advised), up to ~10 rows, "?" tooltips.
- Household spending: a PIE (discretionary slice emphasized; slices note which business types they map to). Retitled (it is how the customer spends, not "who your customers are").
- Cities: SKYLINE photo as the card BACKGROUND + a dark bottom gradient so name + 3 figures stay legible. Rule: only cities in our DB; the section grows as cities are added.
- Lean into: gauges/radials, pies/donuts, conditional-color tables, icon-stat cards (to cut horizontal-bar overuse).
- Five common trades: CARDS (icon + small ease dial + ONE big open-from cost number); no bar row, no repeated phrase, no footer.
- Risk-by-axis: keep bars, DROP the median tick, add a "better/worse than peers" word.
- Exit climate: liquidity dial + sale facts (multiple, time-to-sell, buyer types) + a business-dynamism / PE-scene read.
- How-easy-to-hire (right of the pay levels, half-width each): time-to-hire + notice + an employer-vs-employee rights-balance dial.
- Treemap: split Services into ~6 finer sub-sectors; every sector a subtitle of what it includes; bigger % numbers; full-wide; Services NOT terracotta.
- Paywall UI: BLURRED preview + an unlock prompt on gated sections.

This model now governs the country rebuild and, by analogy, the other page types.

## Other page types , direction (2026-06-19 interview, Round 1)

- **Build order:** City next, then the rest one at a time.
- **Low-repetition law:** near-zero repeat. A fact is shown ONCE, on the page where it is most true, and linked from elsewhere. Country owns tax/rules/setup/economy-profile/character; City owns the score + local market; Cell owns the real local money; etc. Pages link up/down, they do not restate.
- **Premium model is the SAME on every page:** generous free overview + blurred premium-gated depth.
- **CORRECTION , Industry pages are GLOBAL, Cell pages are LOCAL.** An Industry page (e.g. "Restaurants") is the WORLDWIDE structure of a trade (how the business works globally, margins, where it earns ACROSS COUNTRIES). A Cell page (e.g. restaurants in London) is the LOCAL instance with the real place-specific numbers. So industry "where it earns" compares COUNTRIES worldwide, not US states; the cell links up to the global industry page for structure.
- **Page unique ownership:** City = Business Climate Score (only scored entity) + which trades pay here + where to set up (districts) + local demand + cost-to-open here + peer cities. Cell = real revenue/take-home/money-split/calculator/break-even/wages/seasonality/exit. Industry (GLOBAL) = funnel + margins + where-it-earns-worldwide + good-vs-bad-operator + how-it-works. Neighbourhood = relative-only multipliers/squeeze/streets. Home = front door.

### City page , selected sections (2026-06-19 interview)
Auto-included: Hero (city skyline photo) + the **Business Climate Score** + a city scorecard of LOCAL stats with good/bad ratings; **What locals know**. Founder-selected NEW sections (13): what-this-city-wins-&-loses-at (diverging bar, FREE), who-walks-past-your-door (100% stacked footfall mix, FREE), local-spending-power (range/dot strip, FREE), red-flags-honestly (table+severity, FREE), saturation/how-crowded (diverging bar, PREMIUM), can-you-hire (stat cluster + wage-vs-peers bar, PREMIUM), the-demand-calendar (12-mo sparkline, FREE), cost-to-open-here (funnel, PREMIUM), where-the-money-clusters (district dot map -> neighbourhoods, FREE), rent-by-area-ranked (ordered bar, PREMIUM), peer-cities-on-a-metric (ordered bar, city-vs-city, FREE), momentum/which-way-it's-moving (sparkline trio, PREMIUM), the-starter-shortlist (trade->district photo cards -> cells + neighbourhoods, PREMIUM). DROPPED by founder (respect low-repetition): "which trades pay best here" (take-home is cell-owned; city routes via shortlist/map), the rent-to-spending squeeze, business survival odds. Full menu: `page-guidance/city-candidate-sections.md`. Chart-variety: no type used more than twice (verified in the menu's ledger). City pilot v1 delivered 2026-06-19 (`city-london-pilot.html`), founder said "go" , accepted, moving on.

### Next: CELL page (a trade in a city, e.g. restaurants in London) , the flagship
Brainstorm in progress. Cell owns the REAL money (revenue/take-home/the gap, the donut money split [donut LOCKED by founder override], the make-it-yours calculator, break-even, wages by role here, day-to-day units, this trade's seasonality, first-year survival/ramp, cost to open this trade, exit/valuation, same-trade-in-nearby-cities, what-to-watch). Links UP to city (market/score/demand , do not repeat), country (tax/rules), and the GLOBAL industry page (worldwide structure). Same free-overview + premium-gated model; same simple-chart vocabulary.

Cell sections selected (2026-06-20 interview): the 20 owned beats KEPT, plus 5 founder-selected NEW underwriting/trust additions , margin of safety (threshold gauge), payback path/capital-at-risk (cumulative area), coverage check/debt-service (two stat cards), fixed-vs-variable operating leverage (100% stacked bar), covenant watchlist (table). DROPPED: survival odds, thin-vs-strong room, confidence haircut, the defensible-figure dossier. Full menu: `page-guidance/cell-candidate-sections.md`. Cell pilot delivered 2026-06-20: `cell-london-restaurants-pilot.html` (~25 sections, image hero, the locked donut, premium sections shown for review, hover, all charts <=2 per type).

## Round-5 review of the country pilot v5 (2026-06-19) , founder loved it ("best version, exquisite"); change list

GLOBAL:
- **Premium sections: do NOT lock them for the founder now.** Keep the lock GRAPHICS (great), but render the gated content UNLOCKED so he can review it; apply real gating later.
- **"?" tooltips at column titles as much as possible** (skip only the truly obvious). The "?" gives CONTEXT, not just definitions. Tooltips are UNIVERSAL (same across countries).
- **Hover effects are mandatory and important on every graphic** , reactive on hover (the pie especially), not static.
- Fix LAYOUT CLASHES: two sections currently clash/overlap , audit and fix.

HERO: minimum wage shown in **$/month**, not $/yr.

ECONOMIC PROFILE: make it WIDER and the circle BIGGER (the setup card on the right is not dense, so give the profile more room; setup card narrower). Ensure axis NUMBERS do not touch the circle (padding). Add "?" to registration fee, time to open, and the three structures (sole trader / limited company / partnership) , universal tooltips.

GETTING IN: red-tape table narrower (left); the "banking if foreign-owned" card WIDER (~50% more) and DEEPER , 5 short bullets, and NAME the biggest banks/players (first bullet). The step table needs a strong country FLAIR (name the actual institutions: who issues the tax ID, the sales-tax body, etc.).

PEOPLE: the employer-vs-employee balance needs MORE information in the same space. **Talent & skills AND Financing & lending climate must be TALLER with much more detail** , "deep/skilled" is too simplistic for a 68M country; handle multilingualism (e.g. Balkans) and real depth. Brainstorm richer treatments for both.

MONEY: **Cost-competitiveness redone properly** , compare the country to the AVERAGE of 3 peers (UK peers = France, Germany, Netherlands) across 4 metrics: energy, rent, tax burden, licenses/permits; show more/less expensive vs the peer average per metric. **Payments & getting paid: expand, more detail, name up to 5 market-leader companies.**

COMPARISON (new structural decision): vs-neighbours and cost-competitiveness CLASH (both compare to neighbours). **Create ONE dedicated Comparison section** that holds the peer comparison (the 4-metric peer-average read + the neighbours facts), structured cleanly.

DEMAND: the treemap ("where money & jobs") is too big/dull , shrink it to **2/3 (right)**, and put **"how the customer spends" (the pie) at 1/3 (left)** in the same band. Pie gets hover.

FIVE COMMON TRADES: drop the idiotic tags (Approachable/Moderate/Regulated). Polish. Each card: the open-from cost as the BIG number, below it the portion **paid to government** (smaller), below that the **average time to open in weeks**.

OPERATING & LEGAL: expand more (room for excellence), stay understandable, universal "?". Premises table: add 2-3 more property types. Insurance table: "?" critical.

RISK: same axes but scored **x/10**; the track is a 1-10 scale; the right column shows the number (e.g. "7/10").

EXIT CLIMATE: add 2 more bullet points; make bullets a bit longer.

CITIES: right idea; use REAL city skyline PHOTOS in the card backgrounds (he wants to see the real look), not SVG silhouettes.

CHARACTER: beautiful, keep.

BEFORE the next build: founder wants 10 inspiration websites (SaaS + statistics/data-viz + section types) + a research prompt to find more. He will gather references first.

## Chart Vocabulary (FT Visual Vocabulary, simple-only) , 2026-06-19

Founder reference: the FT "Visual Vocabulary" (Schwabish/Ribecca Graphic Continuum), plus datavizcatalogue, datawrapper chart guide, data-to-viz. The taxonomy is adopted, but with one HARD constraint:

**THE SIMPLICITY RULE (binding): every chart must be readable in ~3 seconds AND legible when zoomed out / shown small.** Our graphics are viewed at a zoomed-out page scale, so we only ever use the SIMPLE member of each chart family. No single-chart infographics, no study-heavy charts, no dense legends. If a chart cannot be understood at a glance at small size, simplify it or pick a simpler type.

Pick the chart by the data RELATIONSHIP (the FT spine), then use only the approved simple form:

| Relationship | Our use | USE (simple) | AVOID (too complex at our scale) |
| --- | --- | --- | --- |
| Magnitude (compare values) | scorecard stats, scores, single reads | stat card, column, bar, simple gauge | radar (borderline, numbers must carry it), isotype, parallel coords |
| Ranking | peers, where-it-earns, drivers | ordered bar, ordered column, lollipop | proportional-symbol ranks |
| Part-to-whole | money split, spending, economy mix | pie, donut, 100% stacked bar, treemap (<=8 clear segments) | sunburst, voronoi, nested treemaps, arc |
| Deviation | vs peer average, the squeeze, good/bad | diverging bar (centre baseline), spine | surplus/deficit filled line |
| Distribution | revenue spread, pay range | range/dot strip, lollipop, simple histogram | violin, beeswarm, cumulative curve |
| Change over time | wage/cost trend | line, area, slope, sparkline | fan chart, seismogram, streamgraph, connected scatter |
| Spatial | coverage, cities | simple choropleth (rates not totals), dot map, photo cards | cartograms, contour, dot-density |
| Flow | the sale shrinking, processes | funnel, simple waterfall, step timeline | sankey, chord, network |
| Correlation | rare here | scatter (only if truly needed) | bubble, XY heatmap, connected scatter |

**Banned site-wide as too complex for a zoomed-out almanac:** violin, beeswarm, sankey, chord, network, parallel coordinates, cartograms, voronoi, sunburst, connected scatter, contour, radial/streamgraph. Combine with the existing rule: no single graphic TYPE more than twice per page.

Country-page audit vs this vocabulary: already mostly simple (stat cards, dumbbell pay, pie, diverging compare, ordered/risk bars, funnel-style steps, gauges, photo cards). The two to watch: the economy TREEMAP (currently ~12 segments , reduce to <=8 clear blocks or it gets busy zoomed out) and the RADAR (borderline; kept only because the 1-10 numbers carry it). TREEMAP simplified to 8 blocks 2026-06-19.

Confirmed comparison forms (2026-06-19, founder references): **country-vs-country = diverging bar** (DataPulse-style net gain/loss), **city-vs-city = ordered horizontal bar** (e.g. average salary, subsidy by city). Reference library: the **PolicyViz Image Catalog** (~1,874 published charts) is a browse-for-ideas source only; borrow only the simple chart types per the Simplicity Rule, never the sunburst/sankey/3D-map examples in it.
