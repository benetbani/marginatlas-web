# Neighbourhood / district page , architecture guidance

## Who is here, and the decision they make
Three readers dominate. A **prospective operator** choosing where in a city to sign a lease, asking "does this district lift or squeeze my trade, and is the lift worth the rent." An **existing owner or expansion scout** sanity-checking whether a flashy footfall area actually pays, asking "is this a real edge or a rent trap." A **curious local or analyst** orienting themselves, asking "what is this district actually good at versus the rest of town." All three want a relative verdict, not a pound figure: the district only means anything against its own city.

## The page's one job
Tell a would-be operator, in relative terms only, which trades this district lifts and which it squeezes, and make the rent-versus-revenue squeeze impossible to miss so a 2x footfall lift is never mistaken for a 2x profit lift.

## The hero
Full-bleed **district place image** (the street-life of the place: West End = a lit theatre-and-traffic Soho/Shaftesbury Avenue dusk shot), warm-graded toward the paper palette with a `linear-gradient(to bottom, rgba(atlas-50,.7), cream-75)` scrim at the base so the breadcrumb, H1, verdict line, and gauge sit on legible cream, never floating white text on a busy photo. A faint world-map/locator glyph rides top-right at low opacity as the brand signature. This is the one full-bleed exception; everything below is card-per-section.

The at-a-glance scorecard for a district is **NOT** the country 8-metric vital-signs grid (a district has no GDP, no population-as-home-market, no absolute money by design). Its equivalent scorecard is **the two-marker multiplier read plus a three-weight character pill row** , the district's vital signs are relational:

- **THE LEAD (one, biggest):** the top-trade lift, trade-labelled, as the single Newsreader hero figure: **"Hotels 2x+"** with caption "the top trade's revenue versus the rest of London, a relative read, never a pound figure." Signal: this is the green/good end.
- **THE SECOND LEAD (paired against it):** the most-squeezed trade, named, in cocoa: **"Home cleaning 0.7x."** This pairing is the whole point , a district is good at some things AT THE COST of others, and showing only the lift would be a lie of omission.
- **The instrument carrying both:** the **two-marker multiplier gauge** (0.4x..3.0x track, city baseline pinned at 1.0x in ink, lift marker in atlas at the clamp, squeeze marker as a hollow cocoa dot left of baseline, hatched "clamped beyond here" band past 2.0x). Good = right of baseline; bad/squeeze = left of baseline. The baseline tick is the literal good/bad fulcrum.
- **The supporting at-a-glance reads (smaller, the pill row, three weights one accent):** price tier ("Cost: Luxury", atlas-tinted, this is the only one that is itself a good/bad signal , luxury cost = caution), economic tags ("Tourist zone", "Nightlife", "Transit hub", quiet cream, neutral context), and the one character word ("Theatre and tourist heart", ink chip with atlas dot, identity not rating).

No CTA button at hero altitude. The call to action is the clickable trade rows below that deepen into per-trade cells.

## The metric-rating system on this page
Good/bad on this page is **positional, against the 1.0x city baseline**, not a four-word scale and never a pip. The fulcrum is 1.0x = "the rest of the city." That single pinned tick does all the rating work: anything right of it is a lift (the atlas/good side), anything left of it is a squeeze (the cocoa/quiet-loss side). This is the L12 diverging-bars grammar applied as the page's spine, and it is more honest than a "strong/weak" label because a lift can still be a squeeze once rent is in the frame , which the page then proves.

The decisive metric is **the trade lift/squeeze multiple** (it leads the hero, owns the diverging bars, and recurs as the rep-trade row in the versus-next-door table). The second decisive metric is **the rent multiple**, because it is the one that turns a "good" lift into a bad deal , so the squeeze section pairs the two on one scale and the H2 states the verdict outright. Supporting, smaller reads: the character pills, the demographic skew, the weekly footfall shape (a relative shape, never a number). The honest-but-counterintuitive rule that governs all signalling here: **a number to the right of baseline is not automatically "good."** Moss is therefore used sparingly on this page (it implies kept money, which this altitude never shows); the good/bad cue is the baseline-relative POSITION plus the rent-pairing, not a green slice.

## The full section list (LONG, in order)

This follows the approved 13-beat reform list, expanded where the founder's "long, complete page" bar demands it, and corrected where the rejected build left thin or pathetic beats. Three movements: **the answer** (1 to 3), **the relative engine** (4 to 8, the squeeze is the spine), **the texture and the way out** (9 to 16).

### 1. Global navbar + breadcrumb
- Role: persistent chrome plus first-class UPWARD nav, the breadcrumb is the primary "zoom out to the city / all neighbourhoods" path.
- Sanity verdict: ESSENTIAL. Not pathetic: the breadcrumb is the single most-used exit on a relative page where the reader constantly needs the city for context.
- Shows: Margin Atlas logo, Countries/Industries/Cities/Compare dropdowns, search, one dark CTA. Breadcrumb: Home / GB / London / All neighbourhoods / West End.
- Visual: shadcnblocks `navbar1` re-skinned to the token map (the mockup's reduced bar must upgrade to real dropdowns + search). Breadcrumb as quiet inline eyebrow text.
- Group/placement: chrome, above the answer movement.

### 2. District hero (the answer, full-bleed)
- Role: answer the one question in one screen , top trade lifts, named trade squeezes, on one gauge.
- Sanity verdict: ESSENTIAL. Not pathetic: it leads with the GAP (lift AND squeeze), not a lone vanity multiple.
- Shows: place image, H1, two-marker verdict line, the Newsreader hero figure ("Hotels 2x+"), the two-marker multiplier gauge, the "relative read by design" note, the three-weight pill row.
- Visual: full-bleed image hero (`hero2`-class) + the re-skinned `ScoreBand`-as-multiplier-gauge (L9/L12 grammar). Good/bad = baseline-relative marker position. ONE focal point: the hero figure. The gauge is the proof beneath it.
- Group/placement: the answer (movement 1), owns the first screen.

### 3. The honest take
- Role: reframe the reader's money expectation before any chart , state out loud that a lift is not a profit, and that a West End read is not a London read.
- Sanity verdict: ESSENTIAL. Not pathetic: it carries the one district-specific, falsifiable point (Soho's back streets trade unlike Oxford Street minutes away), so it can never read as boilerplate.
- Shows: verdict line + up to 3 plain points + the modeled-not-measured caveat.
- Visual: calm accent panel (`cta10` buttons-omitted / `HonestTakeBox`, cream-100 with a 3px atlas left rule, one accent). Stacked, narrow measure. Distinct treatment: this is the page's only soft-tinted prose panel.
- Group/placement: the answer (movement 1), the conscience beat.

### 4. What thrives here (diverging bars)
- Role: the full ranked picture , every tracked trade placed left or right of the 1.0x baseline so the reader sees the district's whole shape at once.
- Sanity verdict: ESSENTIAL (the workhorse). Not pathetic: it is the only place a reader sees that the SAME catchment that lifts hotels squeezes home cleaning, on one honest scale.
- Shows: 8+ trades as diverging centre-baseline bars (lifts right in cocoa, the lone leader in atlas, squeezes left in cocoa-300, clamped lifts get a right-edge fade), then the one-trade decomposition card.
- Visual: L12 diverging bars, 1.0x at centre, computed offsets. Good/bad = side of centre, magnitude = bar length on one shared scale (a 0.7x bar is honestly shorter than a 0.85x bar). Rows clickable into cells. The nested decomposition is a distinct bordered sub-card (commuter / tourism / character bands, scoped to ONE trade on purpose). No identical-card grid: this is a bar instrument, not tiles.
- Group/placement: the relative engine (movement 2), the opening workhorse.

### 5. The squeeze (revenue lift vs rent lift) , THE SPINE
- Role: the page's highest-leverage chart , prove that the footfall lifting revenue is the same footfall lifting the rent, so the gap is what the rent eats.
- Sanity verdict: ESSENTIAL. Not pathetic: this is the single insight a smart reader does NOT already have , they think 2x footfall = 2x business; this section is the corrective.
- Shows: paired revenue-lift and rent-lift bars on one shared 1.0x baseline track; H2 = "A 2x revenue lift is not a 2x profit lift"; the "one street back" takeaway.
- Visual: paired diverging/multiplier bars (L12) on one scale, revenue in atlas, rent in ink, baseline tick shared. The good/bad signal IS the gap between the two bars: when they pin together, the lift is illusory. Distinct treatment: two bars, one track, a legend , the only paired-bar moment on the page.
- Group/placement: the relative engine (movement 2), the spine. Give it the most vertical room and an accent eyebrow tick to mark it as the page's pivot.

### 6. When the footfall arrives (weekly/season shape)
- Role: the survive-the-slow-start beat (Job E) in relative terms , when to staff up, never what a day takes.
- Sanity verdict: SUPPORTING, CUT-IF-THIN (self-omits when uncurated). Not pathetic where curated: "the West End fills late and leans on evenings and weekends" is an operating fact that changes staffing, and it carries NO money so it stays honest.
- Shows: a single relative footfall curve across the week, busiest/quietest direct-labelled.
- Visual: gradient area shape (L8 distribution-curve family / `chart-area-gradient`), single atlas series, computed coords, no money axis. Distinct treatment: the page's only curve.
- Group/placement: the relative engine (movement 2), a breather between the squeeze and the comparison.

### 7. Versus next door (like-for-like table)
- Role: the cross-district payoff , the ONLY honest cross-district comparison (same rep trade, one city, comparable prices), with a leader mark allowed because it is one city.
- Sanity verdict: ESSENTIAL. Not pathetic: it is the "should I be one district over instead" answer, and the two-axis design (rep-trade lift AND rent) means columns differ even when lifts all clamp.
- Shows: this district column-one (atlas-tinted, lead mark), up to 3 curated siblings; rows = rep-trade-vs-city, rent-vs-city, area character.
- Visual: L15 zebra `data-table1` in a horizontal-scroll rail; subject column atlas-tinted, peers neutral (never crown a peer in atlas). The two-axis design is the fix for "identical clamped 2x rows reading as fabricated": the rent row and character row separate the columns.
- Group/placement: the relative engine (movement 2), the cross-district payoff.

### 8. Who's here and what it's like
- Role: tell the operator WHO the demand is , the skew, what they spend on, what already works, plus the operator's-eye aside.
- Sanity verdict: SUPPORTING. Not pathetic: "resident demand is thin, so trades needing a local base get squeezed" is the WHY behind the diverging bars, not decoration.
- Shows: 3 visual-list lines (the crowd / what they spend on / what works) + one operator's-eye aside.
- Visual: `WhatLocalsKnow` visual list, one consistent line-icon per row in an atlas-50 chip, plus a cream-100 Newsreader aside. Distinct: an icon-list, not a chart and not a prose wall.
- Group/placement: the texture (movement 3), opening it.

### 9. Prime streets
- Role: concentrate the abstract "district lift" into named, real streets where the footfall actually sits , and where the rent gap is.
- Sanity verdict: SUPPORTING, curated-only. Not pathetic: each card carries a real rent-vs-city band and a "one block back trades on most of the same crowd for a fraction" insight , concrete and actionable.
- Shows: 2-col card grid, each street: name, what it sells, blurb, self-omitting rent/spend chips.
- Visual: feature-grid cards with quiet chips that self-omit when no real figure is held. This is the one legitimate card grid (the content IS discrete places), but each card has distinct copy and chips, never repeated icon+heading mush.
- Group/placement: the texture (movement 3).

### 10. Still filling in (collapse strip)
- Role: absorb every genuinely-thin section into ONE calm band instead of a wall of dashed cards.
- Sanity verdict: ESSENTIAL scaffolding. Not pathetic: it reads as discipline, "we will not show a fabricated number," which is itself a trust signal on a numbers product.
- Shows: one cream-100 strip listing the unheld reads (street-by-street character, resident income spread, vacancy/turnover) as quiet chips.
- Visual: the collapse strip (cream-100, hairline, no fake numbers). Distinct: deliberately the quietest band on the page.
- Group/placement: the texture (movement 3).

### 11. How we get to the number (trust layer)
- Role: the site-wide confidence/method beat , separate what is held (curated character, prime streets) from what is modeled (the multiples, the rent, the shape).
- Sanity verdict: ESSENTIAL (a monetizable site-wide layer). Not pathetic: on a page that shows no money and only relative multiples, "what is held vs modeled" is exactly the reader's trust question.
- Shows: held/modeled rows with confidence chips + the "no absolute money by design" footnote + "Modeled, June 2026."
- Visual: method note with held (moss chip) / modeled (neutral chip) rows. Distinct: a labelled two-state note, not prose.
- Group/placement: the texture (movement 3), the trust beat before the close.

### 12. One thing to remember (the close)
- Role: the warm, ACTIONABLE last word , distinct from the honest-take diagnosis; this one gives the move ("take the catchment, then sign one street back").
- Sanity verdict: ESSENTIAL. Not pathetic: it adds a forward instruction the honest-take did not, never restating.
- Shows: the verdict + the actionable move + freshness + "Flag it."
- Visual: ink-900 dark closer card, atlas-300 eyebrow, Newsreader verdict. Distinct: the only dark card on the page, the visual full-stop.
- Group/placement: the way out (movement 3).

### 13. Where to look next (wayfinding hand-off)
- Role: the ONE consolidated wayfinding zone , sibling districts (no scores), the city, all-neighbourhoods, and the compare CTA.
- Sanity verdict: ESSENTIAL. Not pathetic: it merges three former link grids into one, satisfying "more links" without three grids in a row.
- Shows: equal-weight sibling-district tiles (each with a plain character word, no scores), two hand-off tiles, one "Compare two districts" CTA.
- Visual: uniform sibling tile grid + 2 hand-off tiles + one atlas CTA. Equal-weight by design (districts are never ranked); the ONE place equal-weight tiles are correct.
- Group/placement: the way out (movement 3).

### 14. Rich footer
- Role: persistent chrome + the load-bearing relative-money disclaimer.
- Sanity verdict: ESSENTIAL. Not pathetic: it carries the honesty contract ("no absolute money at this altitude by design").
- Shows: link columns, newsletter, legal, the modeled-relative disclaimer paragraph (keep verbatim).
- Visual: shadcnblocks `footer7` re-skinned (the mockup's reduced footer must upgrade to multi-column, KEEP the disclaimer).
- Group/placement: chrome.

## Related links and cross-page hand-offs
The relative-read altitude makes wayfinding load-bearing , the reader constantly needs the city for context and the cell for the real number. Links flow in four directions:

- **UP, constantly:** the breadcrumb (city, all-neighbourhoods, country) is the primary upward path and must be first-class, not a faint trail. "London business overview" (the city page, where the absolute money and the Business Climate Score actually live) and "All London neighbourhoods" both repeat in the closing hand-off zone.
- **DOWN, the real CTA:** every trade row in the diverging bars (section 4) and every rep-trade in versus-next-door (section 7) deep-links into the per-trade neighbourhood **cell**, where the actual pounds, take-home, and break-even live. This is where the relative page hands off to the absolute one. State the hand-off explicitly ("the relative read is here; the real number is in the cell").
- **SIDEWAYS:** sibling-district tiles (section 13), equal-weight, no scores, each linking to its own district page; plus the "Compare two districts" CTA into the Compare picker (district-vs-district is a legitimate one-city comparison).
- **OUT to method:** the trust layer (section 11) links to the site-wide methodology page.

More links, not fewer: the diverging-bar rows, the table rep-trades, the prime-street cards (each could link to its street/cell), the sibling tiles, the two hand-off tiles, the compare CTA, and the breadcrumb crumbs are all live wayfinding. The rule that bounds the abundance: ONE consolidated hand-off zone at the close, never three link grids stacked.

## What was WRONG in the rejected build, and the fix

1. **"+200% everywhere" / four identical clamped 2x bars reading as fabricated.** The thrives and versus-next-door beats showed multiple trades all pinned to "2x or more," which looks invented. **Fix:** the diverging-bar grammar (lifts right, squeezes LEFT of baseline) plus carrying the squeezes (grocery 0.85x, doctors 0.8x, home cleaning 0.7x) at honest sub-baseline lengths gives the chart real variance and proves the model discriminates. In the table, the **two-axis design** (rep-trade row AND rent row AND character row) separates columns even when one row clamps. Never compute and print a raw percentage anywhere.

2. **The squeeze hidden instead of being the spine.** Earlier builds buried rent as a single quiet "cost to operate" mini-bar, so the page read as a pure good-news lift page , the exact misread the founder warns about (a lift can still be a squeeze). **Fix:** promote it to a named, full-width **squeeze section** (paired revenue-vs-rent bars, H2 stating "a 2x revenue lift is not a 2x profit lift"), and make it the page's pivot with an accent divider. The good/bad signal is the GAP between the two bars.

3. **Bare ranges instead of levels.** A relative page has no salary ladder, but the equivalent "bare range" sin is showing a lone lift multiple with no structure. **Fix:** the diverging bars show every trade as a level relative to baseline (a full distribution of trades, lifts AND squeezes), and the decomposition card breaks ONE trade's lift into its commuter / tourism / character drivers , levels, not a single number.

4. **Pathetic / worthless cards.** Any "active businesses here", "consumer spend: High" standalone tile, or a no-number qualitative grid would fail the sanity filter on a relative page. **Fix:** every kept section changes a leasing decision (lift vs squeeze, rent gap, who the crowd is, which street, which neighbour). The demographic skew lives inside "who's here" as the WHY behind the bars, never as a vanity stat tile.

5. **Equal-weight mush + repeated card grids.** The fix is the three-movement hierarchy: the hero gauge and the squeeze are the loud, leading reads; who/streets/method are smaller supporting beats; sibling tiles are the ONE intentional equal-weight grid (because districts are never ranked). Each section gets a visually distinct instrument (gauge, diverging bars, paired bars, curve, table, icon-list, cards, strip, method-rows, dark closer) , no identical icon+heading+text tiles repeated.

6. **Honesty drift risk on "good."** Earlier instincts to paint lifts in moss/green imply kept money the page never shows. **Fix:** moss is withheld on this page; good/bad is signalled by baseline-relative position and the rent pairing, with the atlas accent marking only the subject trade.

## Open questions for the founder
1. **The hero place image:** do we have (or commission) a real, rights-cleared West End image for the full-bleed hero, or do we ship a stylized map-motif hero treatment for districts until imagery is sourced? This gates whether the hero is "alive" or falls back to the dotted-map backdrop.
2. **Cell deep-links from the diverging bars:** are per-trade neighbourhood cells actually routable for every district (West End restaurants, hotels, etc.), or do we link-gate to only the trades with trusted local cells (as we did on country pages) and leave the rest as non-clickable rows? This determines whether section 4 rows are all links or a curated subset.
3. **The squeeze rent signal:** is rent-vs-city modeled from land character for ALL districts, or curated-only? If modeled everywhere it can be the page spine universally; if curated-only, the squeeze section must self-omit on thin districts and the spine moves to the diverging bars , I need to know which to spec as the default.
