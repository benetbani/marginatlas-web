# Industry page , architecture guidance

## Who is here, and the decision they make
Three readers dominate. The **would-be owner / career-changer** ("I'm thinking of opening a restaurant somewhere") wants to know whether this trade is even worth the leap before they pick a city. The **operator or buyer evaluating a deal** ("is a 7% margin normal, or is this listing lying to me?") wants the structural truth to sanity-check a real business. The **curious researcher / journalist** ("how does a restaurant actually make money?") wants the cost shape explained cleanly. All three are asking one question: *is this kind of business good, and how does the money actually behave before I commit to a place?*

## The page's one job
Explain, for one trade with no place picked yet, how the business makes money and how little of each sale survives to the owner, so the reader leaves with the cost shape in their head and a place picker to turn the model into real numbers.

## The hero
**Full-bleed place image of the trade, not a place:** a warm, real photograph of the *craft* itself, a restaurant pass mid-service, a line cook plating, the front-of-house at dusk, treated with the standing image rail (a `linear-gradient(to bottom, rgba(ink-900,.55), rgba(ink-900,.75))` scrim so white type holds WCAG AA over it, the world-map motif suppressed here because the photo carries identity). This is the one thing that tells the reader instantly "this is restaurants" before a single number loads. It distinguishes the *industry* hero from the *cell* hero: the cell shows a place (a London street), the industry shows a trade (a kitchen anywhere).

**Over the image sits the structural at-a-glance scorecard**, the industry's equivalent of the country's 8-metric scorecard, built as the L3 lead+supporting pattern (L10 compact bento, all-sans, tabular figures). Four structural vitals, each with a calibrated read:

| Metric | Exemplar (Restaurants) | Rating / read | Role |
| --- | --- | --- | --- |
| **Typical margin** (net, % of revenue) | **7%** | **Weak** (gray-amber on the spectrum; most trades sit 8 to 15) | **LEADS** |
| **Kept per $100 of sales** | **$7** | **Thin** (the same truth in dollars, moss-tinted as "the survivor" but flagged low) | **LEADS (paired)** |
| **One-year survival** | **80 in 100** | **Fair** (better than retail's ~75; honestly mid) | Supporting |
| **Capital to start** | **Light, asset-light** | **Favorable** (moss; the one genuinely good structural fact) | Supporting |

The two that LEAD are **typical margin** and **kept-per-$100**, shown as one paired focal tile (they are the same fact in two registers, the % for the analyst, the $7 for the layperson), so the reader's first read is the punchline: *this trade is margin-poor.* The hero anchor number underneath is the **typical-revenue band** ($1.0M typical across the US cohort) on the signature RangeStrip, with a single Newsreader verdict thesis above it: *"Restaurants run on volume, and almost none of it survives the kitchen."* No place. No tier/confidence chip (an activity carries no single confidence read). The **place picker is the one primary CTA** ("Pick a city, see real numbers"). When the revenue band is too thin to defend, the hero swaps the anchor for the kept-share fallback (moss structural ratio, never invented-dollar styling).

## The metric-rating system on this page
Good/bad is signalled by **the L5 gradient spectrum** (gray=worse left to moss=better right, atlas marker at the true position) and by **a one-word calibrated read** beside each lead figure, never by a 4-level pip (banned, L6) and never by color alone (WCAG, and the word does the work for color-blind readers). The calibration baseline is *other small-business trades*, so a non-business reader instantly knows 7% is weak (most trades keep more) and "asset-light" is favorable.

**Decisive vs supporting hierarchy:** the two decisive metrics are **margin** and **kept-per-$100**, because they are the whole thesis of the page and they LEAD the hero (biggest type, paired focal tile, first read). **Survival** and **capital** are supporting (smaller tiles, single read each). Everything downstream, the funnel, the per-$100 split, the margin table, must reconcile to the *same canonical split* (35 + 33 + 12 + 13 + 7 = 100, gross 65 to net 7), so the rating you see in the hero is the rating the whole page proves. The accent budget holds: terracotta marks the subject only; moss only the kept slice; amber only a caution read; cocoa/ink carry the cost mass.

## The full section list (LONG, in order)

The page runs in four movements: **(I) The verdict** (hero, honest take), **(II) The mechanics of the money** (how it makes money, the split, the table, the spread), **(III) Where and how it varies** (states, operator profile, cousins), **(IV) The hand-off** (deeper trades, method, close, wayfinding). Loud data cards alternate with quiet narrative cards so no three quantitative cards ever stack into a wall.

### 0. Global navbar
- Role: site-wide wayfinding and the topic dropdowns, so the reader can leave for a city, country, or comparison at any time.
- Sanity verdict: ESSENTIAL (chrome). Not pathetic: it carries a **job-matched CTA, "Find your city," not a generic "Get the data,"** because the industry reader's next step is always a place.
- Shows: logo, Countries / Industries / Cities / Compare dropdowns, search, one dark CTA pill.
- Visual: shadcnblocks `navbar1`, L13 classic centered, cream-75 blurred, hairline bottom.
- Group: chrome.

### 1. Hero , verdict + structural scorecard
- Role: deliver the whole thesis in one screen, this trade is margin-poor, asset-light, and you must pick a place to make it real.
- Sanity verdict: ESSENTIAL. Not pathetic: it leads with the *gap* (sells big, keeps little), the one counterintuitive thing even a smart reader pauses on.
- Shows: trade photo, verdict thesis, the 4-metric structural scorecard with ratings, the typical-revenue band, the place picker.
- Visual: full-bleed image + L10 compact-bento scorecard (L3 lead+supporting with reads) + RangeStrip; one terracotta CTA. Margin/kept LEAD as a paired focal tile.
- Group: I , The verdict.

### 2. The honest take
- Role: the single editorial judgment a model can't fabricate, what actually kills operators in this specific trade.
- Sanity verdict: ESSENTIAL. Not pathetic: it is trade-specific and falsifiable (*"a few points of food waste or one extra body on the rota flips a thin margin negative, and rent does not care how many covers you served"*), never generic risk boilerplate.
- Shows: one Newsreader verdict line + up to two plain watch-out points.
- Visual: shadcnblocks `cta10` reskinned as a calm atlas-50 accent panel, buttons omitted; stacked, generous air, no icons. Distinct from every data card by being text-only on warm ground.
- Group: I , The verdict.

### 3. How it makes money (the flow of a sale)
- Role: the page's signature move, watch $100 of sales visibly shrink to $7 as it flows through each cost stage.
- Sanity verdict: ESSENTIAL (the distinctive section, give it the most room). Not pathetic: it makes an abstract margin *felt*, which a number alone never does.
- Shows: ordered stages, $100 in, $65 survives direct costs, $19 survives running costs, $7 kept, with each stage tone-read (input load Light, operating overhead High, capital Light, kept Thin).
- Visual: **L11 FUNNEL** (stacked horizontal bars of decreasing width, 100 to 65 to 19 to 7, kept bar in moss, cost stages cocoa/ink, computed widths). Two-column: text lead left, funnel right. The good/bad read rides each stage label.
- Group: II , The mechanics of the money.

### 4. Where the money goes (per $100)
- Role: the snapshot, the precise composition of where each dollar goes, in one canonical breakdown.
- Sanity verdict: ESSENTIAL. Not pathetic: it isolates and emphasizes the kept slice (the whole point), and decomposes the funnel's running-cost block into the lines an operator actually pulls (payroll, rent, everything else).
- Shows: Cost of goods $35, Payroll $33, Rent & premises $12, Everything else $13, Owner keeps $7.
- Visual: **L7 DONUT + legend** with the kept slice in moss and emphasized, center label ("$7 kept of $100"), full legend with every slice and value. Cost mass cocoa/ink. Distinct from the funnel (a ring, not bars). Stacked.
- Group: II , The mechanics of the money.

### 5. The margin, cut by cut
- Role: the precise accounting walk for the analyst/buyer who wants the exact arithmetic, not a shape.
- Sanity verdict: ESSENTIAL. Not pathetic: the gap between gross (65%) and net (7%) is a genuine punchline a reader carries away.
- Shows: Revenue $100, less direct costs, Gross $65 (65%), less running costs, Operating $19 (19%), less rent & tax, Net $7 (7%).
- Visual: **L15 zebra data-table** (`data-table1`), columns = stage / what it takes / what survives / % of revenue; subject net row tinted atlas-50 with a left rule; one-line punch caption beneath ("a hundred dollars of sales walks out as roughly $7"). A table, not bars, deliberately breaks the rhythm. Stacked.
- Group: II , The mechanics of the money.

### 6. Good operator vs bad operator (the spread)
- Role: show how wide the outcome gap is, the same trade can clear a healthy margin or bleed, depending on the operator, not the place.
- Sanity verdict: ESSENTIAL (NEW, Job G reborn as variance). Not pathetic: it answers the buyer's real fear, "is the listing's number normal or a fantasy?" by showing the honest band of outcomes.
- Shows: net margin spread on the operator axis (e.g. a struggling operator ~2% to a strong operator ~14%), typical marked.
- Visual: **L8 distribution curve** (atlas line, gradient fill, dashed marker at typical, low/typical/high ticks, typical tick in atlas). Crucially on **margin, not revenue**, so it doesn't restate the hero band. Stacked. The left tail reads amber (caution), the typical reads atlas, the right reads moss.
- Group: II , The mechanics of the money.

### 7. Where it earns most (US states)
- Role: the one legitimate geography rank, where in the US an owner keeps the most after tax.
- Sanity verdict: ESSENTIAL. Not pathetic: it is the only honest cross-place ranking on the page and it routes the reader to a real cell.
- Shows: US states ranked by modeled after-tax take-home (New York $118K, California $111K, Florida $96K, Texas $92K, Illinois $84K, Ohio $74K), each row opening that state's restaurant cell.
- Visual: **L4 ranked comparison bars**, one shared scale, computed widths, subject-neutral (no crown), with a **find-my-state** affordance and the load-bearing honesty rail ("one currency, one tax system, US states only, not a league table across borders"). Optional faint US-map motif watermark, never over the bars. Stacked.
- Group: III , Where and how it varies.

### 8. Pay by role (what a team costs)
- Role: turn "labor is the biggest controllable cost" into the actual roles and their pay bands, the levels-not-ranges rule.
- Sanity verdict: SUPPORTING. Not pathetic *because* it shows levels: line cook / sous / head chef / FOH / GM each on one shared scale with the spread, never a bare "low to high." Cut to a collapse strip only if no role bands resolve for the trade.
- Shows: each role's pay band (floor to typical to high) on one scale, owner's own typical pay marked on the same scale for honesty.
- Visual: shared-scale **dumbbell / floating-range rows** (the `data-table1` + min/median/max marker pattern from global-standards §6), median dot in atlas, all roles on ONE domain so a head chef's bar is honestly longer. Tagged "illustrative US exemplar." Stacked.
- Group: III , Where and how it varies.

### 9. A typical operator + what it takes to start
- Role: the plain-language operator profile and the cost/time to get in (Job E, survive the slow start).
- Sanity verdict: SUPPORTING. Not pathetic: every row is a decision input (capital to start, months to break even, one-year survival, owner-dependence), no vanity "active businesses 2.7M" filler.
- Shows: survives direct cost 65%, reaches owner 7¢/$1, capital Light, still open after one year 80 in 100, plus a modeled time-to-breakeven.
- Visual: **PlainTerms** term/value rows with the line-icon family + a slim **timeline ribbon** for first-year phases (break-even node in atlas). No chart soup. Stacked, airy. Self-omits below 2 facts.
- Group: III , Where and how it varies.

### 10. How the cousins compare
- Role: structural side-by-side of sibling trades, so the reader sees how *this* trade's kept slice differs from its neighbours, explicitly not a ranking.
- Sanity verdict: SUPPORTING (CUT-IF-THIN). Not pathetic: it reframes "is a cafe better than a restaurant?" honestly by showing the *shape* of each, not a winner.
- Shows: kept-slice small-multiples for restaurants vs cafes vs bars vs bakeries (e.g. each trade's owner-keeps %), with an explicit "different shapes, not a league table" rail.
- Visual: **small multiples of the kept slice** (four tiny donuts or kept-bars on one scale), cocoa mass, moss kept, none in the subject accent (so no trade reads as "winning"). Two-column or grid. Distinct from every prior visual by being repeated-tiny, not single-large.
- Group: III , Where and how it varies.

### 11. Go deeper (related activities)
- Role: the taxonomy rail into sibling trades, real wayfinding, not a ranking.
- Sanity verdict: SUPPORTING. Not pathetic: each tile carries a real glyph + concrete examples (espresso bars, gastropubs), so it informs, not decorates.
- Shows: Cafes, Bars & nightclubs, Retail bakeries, Pubs & taverns, each with examples.
- Visual: sibling-tile grid (`feature43`-style, the one icon family), two-column, **visually distinct from section 10** (these are navigational tiles with no numbers; the cousins section had numbers). Group/placement straddles III→IV.
- Group: IV , The hand-off.

### 12. How we get to the number (trust layer)
- Role: the site-wide method/confidence note, quiet honesty about held vs modeled.
- Sanity verdict: ESSENTIAL (site-wide trust layer, monetizable). Not pathetic: it is the credibility backbone of a numbers product.
- Shows: a one-line "modeled from the US cohort, no single place" note + an expandable method detail. No source-agency names.
- Visual: small expandable note, no chart. Quiet.
- Group: IV , The hand-off.

### 13. One thing to remember (closer)
- Role: the single shareable, forward-looking verdict, distinct from the honest-take diagnosis.
- Sanity verdict: ESSENTIAL. Not pathetic: it is the instruction, not a restatement (*"High margin on paper, thin once the bills are paid. The operators who fail treat a workable margin as a forgiving one."*).
- Shows: one closing line + a muted "model last checked" date.
- Visual: an optional one-line Newsreader editorial closer (the only sanctioned serif moment) on warm ground, maximum air. Quiet.
- Group: IV , The hand-off.

### 14. Related + footer
- Role: one closing wayfinding zone + full chrome, never three link grids in a row.
- Sanity verdict: ESSENTIAL (chrome). Not pathetic: links carry preview metrics, not bare names.
- Shows: the cross-page hand-offs below, newsletter capture, link columns, legal/exemplar caveat.
- Visual: L14 newsletter-forward dark `footer7`. Quiet.
- Group: IV , The hand-off.

**Mockup-only honesty demonstrations** (not the live page): one collapse strip folding unheld London-rich sections (cost to open, through-the-year, operator voices) into a single "still filling in" strip, and a thin-trade variant where the hero leads with the kept-share fallback.

## Related links and cross-page hand-offs
- **The place picker (hero) and every "Where it earns most" row** hand off DOWN to the **cell** (`/[country]/[city]/[industry]`), the industry model made real for one place. This is the primary conversion path and must be the loudest link on the page.
- **"See how restaurants compare across every city we measure"** (hero secondary link) hands off to a **city-comparison** view.
- **Section 10 (cousins) and Section 11 (go deeper)** hand off SIDEWAYS to **sibling industry pages** (`/industries/cafes`, `/bars`, `/bakeries`, `/pubs`), framed as taxonomy, never ranking.
- **The honesty rail + state rows** hand off to **country** (`/us`) for the tax/rules context that explains *why* states differ.
- **Navbar dropdowns + footer** carry the standing Countries / Cities / Compare routes.
- **Trust layer (12)** links to the methodology page.
- The founder wants MORE links: every state row, every cousin tile, every sibling trade, and the picker are all live; the page should feel like a junction, not a dead end. Each link tile carries a preview metric (a kept-% or a take-home figure), never a bare name.

## What was WRONG in the rejected build, and the fix
- **The hero dropped the scorecard and its ratings.** A reader couldn't tell at a glance whether 7% was good or bad. **Fix:** restore the 4-metric structural scorecard (margin, kept-per-$100, survival, capital) with calibrated reads, margin + kept LEADING as a paired focal tile.
- **Pathetic / no-signal cards.** Anything like "asset-light: yes" or a bare "net margin 7%" with no orientation told a smart reader nothing. **Fix:** every metric now carries a good/bad read against the cross-trade baseline, and worthless qualitative cards are cut.
- **Bare ranges instead of levels.** A pay treatment that said only "low to high" is banned. **Fix:** Section 8 shows roles (line cook → GM) on one shared scale with the owner's own pay marked, the levels-not-ranges rule.
- **Equal-weight tile mush + bar soup.** The quantitative sections risked reading as four identical bar charts. **Fix:** four deliberately distinct shapes, funnel (4), donut (5), table (6 is a table), distribution curve (the spread), ranked bars (7), small-multiples (10), no two alike, with loud/quiet rhythm.
- **The "good vs bad operator" spread was missing.** The page couldn't answer the buyer's real question (is this number normal?). **Fix:** Section 6, a distribution on *margin*, not a restatement of the revenue band.
- **Too short, too few links.** **Fix:** a 14-beat page in four movements with state rows, cousins, siblings, and the picker all live as hand-offs.

## Open questions for the founder
1. **The hero image source:** do we have a licensed, brand-warm trade photo per industry, or should the industry hero fall back to the world-map-motif + scorecard treatment (no photo) until imagery is sourced? This gates whether the full-bleed image ships now or in a second pass.
2. **Pay-by-role (Section 8):** is role-level pay data held for restaurants beyond the London exemplar? If only the exemplar exists, do we ship it tagged "illustrative US exemplar," or collapse it to the "still filling in" strip until US role bands are real?
3. **Cousins (Section 10):** confirm the four sibling kept-% values are real/modeled to a defensible standard, since putting them side by side, even explicitly un-ranked, invites a "which is best" read; if any is thin, I cut that tile rather than show a soft number.
