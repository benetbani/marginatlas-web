# Section analysis: Neighbourhood overview (a district, e.g. West End)

## Who is on this page and what they came for

The dominant arrival is **P1, the prospective owner who has already narrowed to a city** and is now choosing a pitch inside it ("I want to open a restaurant in London, is the West End the right part of town or will the rent eat me alive?"), plus a meaningful **P5 SEO tail** ("what's the West End like for business / is Soho good for a bar"). **P4 advisors/brokers** dip in for a fast, citable district read; **P2 buyers** use it as a sanity layer on a leasehold they are valuing ("is this a genuinely premium pitch or am I paying for a postcode?"). The single question this page must answer is the one the spec already names: **"If I open here instead of elsewhere in this city, which trades does this district lift, which does it squeeze, and what does that lift cost me?"** Crucially, this is the *only* page on the site that operates with **no absolute money at all**, the read is purely relative to the district's own city, so the page's hardest job is making "no pound figure" feel like discipline rather than a missing feature.

---

## Section-by-section audit

### 0a / 0b / F — Global chrome (navbar, breadcrumb, footer)
- **Job (T2):** Orientation and escape hatches; the breadcrumb is the spine of the geo hierarchy (Home / GB / London / All neighbourhoods / West End). Serves every persona.
- **Useful or slop (T1):** Useful, but the breadcrumb is doing more work here than on any other page type. On a district, "where am I in the hierarchy" is itself a question the reader has, so the breadcrumb is genuinely load-bearing, not just chrome.
- **Cringe check (T3):** The mockup ships a *reduced* navbar ("Get the data" dark button, flat nav words) and a single-column footer; both must upgrade to real `navbar1`/`footer7`. Risk: shipping the reduced version makes the page feel like an unfinished prototype next to the city page.
- **Best visual (T4):** Breadcrumb is correct as quiet inline text. One refinement: the breadcrumb should expose the **city overview** and **all-neighbourhoods index** as the two highest-value upward links, since those are exactly where a district reader bounces next.
- **Redundancy/Depth/Honesty:** Footer disclaimer (modeled-relative, no absolute money) is non-negotiable and correctly placed. No honesty issue.
- **VERDICT:** KEEP. Enforce the full navbar1/footer7 upgrade; treat the breadcrumb as a first-class navigation element, not decoration.

### 1 — District hero / `headline` (answer-first, multiplier gauge)
- **Job (T2):** In one screen, name the district, name the trade it rewards most, and show that lift as a relative multiple, no money. Serves P1/P5 instantly; gives P4 the citable headline.
- **Useful or slop (T1):** Useful, this is the whole point of the page. The answer-first verdict ("Hotels earn about 2x or more versus the rest of London here") is exactly what a P1 came for.
- **Cringe check (T3):** Two real risks. (1) The big Newsreader hero number is **"2x+"**, which is visually underwhelming as a hero figure and reads as vague where every other page type's hero number is concrete (a /100 score, a take-home). A reader's first reaction may be "2x what? where's the money?" (2) The gauge is geometrically elaborate (hatched ceiling band, pinned baseline, two key captions) for what resolves to a single fact: "top trade pins to the ceiling." On a district where the top trade is *not* clamped (a quieter neighbourhood), the gauge will be more honest and more interesting; on the West End it is almost all ceiling. Make it sharp by ensuring the **verdict line carries the meaning** and the gauge stays subordinate, and by making the hero number the *trade-named* lift ("Hotels 2x+") not a bare "2x+".
- **Best visual (T4):** The multiplier gauge is defensible but debatable. Alternatives: (a) a **two-marker gauge** showing both the top trade AND a suppressed trade ("Hotels 2x+ … Doctors, less than half") so the hero instantly communicates the page's real insight, that a district *lifts some and squeezes others*, which a single up-marker hides; (b) drop the gauge entirely and let the verdict + pills own the hero, moving all magnitude into the `thrives` bars below. The single-marker gauge as specced over-engineers a one-fact instrument. **Pick: keep the gauge but add the suppressed-trade marker** so the hero shows the lift-AND-squeeze duality in one read; that is the genuinely surprising, decision-grade framing.
- **Redundancy (T5):** The gauge's single fact is fully restated by the top row of the `thrives` bars (§3). The two-marker version earns its place by previewing the *spread*; a single-marker version is near-redundant with §3's first bar.
- **Depth/Honesty (T6/T7):** Honesty model is excellent: 1.0x pinned, clamp band hatched, "relative read by design" note. The three-weight pill row (price tier / economic tags / character word) is a smart, specific resolution of the tag-collision risk. Keep all of it.
- **VERDICT:** REFORM. Add a **second marker for the most-squeezed trade** to the gauge so the hero communicates lift-and-squeeze, not just lift; make the hero number trade-labelled ("Hotels 2x+"); keep the pinned-baseline honesty model and pill row verbatim.

### 2 — The honest take / `honest-take`
- **Job (T2):** Reset the reader's money expectation and state the page's three structural truths in a human voice. The conscience of the page. Serves P1 above all (manages the "where's the dollar figure" reflex).
- **Useful or slop (T1):** Useful and, on this page type, *essential*, it is the section that converts "missing money" into "deliberate discipline." Without it the relative-only read feels broken.
- **Cringe check (T3):** The three points are good and specific (visitors are the pull; a few streets over reads differently; revenue lift ≠ profit lift). Risk: it reads as a generic disclaimer if the points are templated across districts. Sharpen by making at least one point **district-specific** (the West End's is "the pull here is visitors"; a financial district's would be "the pull here is the weekday office, and it vanishes at the weekend"). That single tailored sentence is what makes it feel written, not generated.
- **Best visual (T4):** Calm accent panel (atlas left-stripe, serif verdict, plain bullets) is the right call, this should read as prose, not a chart. No better alternative.
- **Redundancy (T5):** Point 3 (revenue lift ≠ profit lift) is echoed in `operating-cost` (§5) and `one-thing` (§11). That repetition is *intentional and good* on this page (the honesty contract says state it in three places), but the three statements should be phrased differently so it reads as reinforcement, not copy-paste.
- **Depth/Honesty (T7):** Strong. The "modeled not measured" caveat body is exactly right.
- **VERDICT:** KEEP. Require one district-specific point so it never reads as boilerplate.

### 3 — What thrives here / `thrives` (ranked bars + decomposition)
- **Job (T2):** The workhorse. Rank every relevant trade by how much the district lifts or squeezes it, clickable into per-trade cells. The decomposition card explains *why* one trade lifts. Serves P1 (which trade), P3/P4 (the structural read).
- **Useful or slop (T1):** Highly useful, this is the section that actually changes a decision. The clickable rows-into-cells is the real CTA of the page.
- **Cringe check (T3):** The single biggest cringe risk on the whole page lives here: **"2x or more" appearing on four identical full-width bars in a row** screams fabricated. The spec's defence (rail-clamp, no crown, lead-mark reserved for one trade) is correct but the *visual* still shows four maxed-out identical bars. Sharpen by **introducing visible gradation within the "2x or more" tier** even when all pin, e.g. order them by the *underlying* (unclamped) model value with subtle bar-length differences within the clamped band, OR group the clamped winners under a single "At the ceiling" subhead and only bar the spread between winners and the squeezed trades. A flat wall of four identical max bars is the thing that makes this page look generated.
- **Best visual (T4):** Ranked horizontal bars are correct for "rank trades by relative magnitude." The decomposition mini-grid (commuter / tourism / character, qualitative bands) is a genuinely good, honest secondary instrument. Alternative considered: a **dumbbell/diverging bar** centred on the 1.0x baseline with lifts going right and squeezes going left, this would make "lifts some, squeezes others" a single shape rather than two separate visual zones, and pairs beautifully with the proposed two-marker hero. **Pick: a diverging (centre-baseline) bar set**, winners right of 1.0x, squeezed trades left, which is both more honest (the baseline is visible in the chart, not just implied) and more legible than a wall of full-width bars.
- **Redundancy (T5):** Top bar overlaps the hero gauge; resolved if the hero goes two-marker (preview) and this becomes the full diverging detail. Decomposition does not overlap anything.
- **Depth/Honesty (T7):** The decomposition's explicit "scoped to ONE trade, never a claim about the district" guard is excellent and should be preserved verbatim. Qualitative bands (Moderate/Very high/Strong) instead of fake "1.00x" parts is the right honesty move.
- **VERDICT:** REFORM. Move to a **diverging centre-baseline bar** so lift-and-squeeze is one shape and the wall-of-identical-bars cringe dies; keep the decomposition card exactly as specced.

### 4 — Who lives and shops here / `who`
- **Job (T2):** Tell the operator who the customer actually is (skew, spend behaviour, what already works). Serves P1 (will my concept land here?) and P2 (is the demand real?).
- **Useful or slop (T1):** Useful when the flavor data is curated and specific; at risk of slop when generic ("affluent shoppers" could be any premium district).
- **Cringe check (T3):** The West End lines are good and specific ("pre-theatre set menus to late-night Soho institutions", "fierce competition for a table"). The cringe risk is the *generic* version on an uncurated district. The fix is the page's own honesty grammar: self-omit to `SectionEmpty` rather than print a vague demographic. Enforce that hard, never let a templated "affluent, evening crowd" appear.
- **Best visual (T4):** The `WhatLocalsKnow` visual list (one quiet icon tile per line) is the right anti-prose-wall treatment. One critique: all three rows use the *same* icon, which is decorative rather than informative. Sharpen by giving each line a **role-distinct icon** (who they are / what they spend on / what already works) so the icons carry meaning.
- **Redundancy (T5):** Overlaps `ground` (§8, food scene) and the hero pills (character). "What already works" overlaps `thrives`. This is the most redundancy-prone section on the page. **Strong merge candidate with `ground`** (see CUT/MERGE).
- **Depth/Honesty (T7):** Honest as long as it stays curated-only. No fabricated demographics.
- **VERDICT:** REFORM toward distinct per-line icons, and flag as a **MERGE candidate with `ground`** into a single "Who's here / what it's like" texture block.

### 5 — Cost to operate / `operating-cost`
- **Job (T2):** The counterweight to the whole page: the lift is real, but here's what the rent does to it. Single most decision-changing honest beat for P1.
- **Useful or slop (T1):** Very useful, this is the section that stops a P1 from being seduced by a 2x revenue lift. The "revenue lift ≠ profit lift; the rent is the reason" framing is the page's most valuable single insight.
- **Cringe check (T3):** The mini bar (single track, 1.0x tick at 50%, rent filling the full 0..2x track) is clean. Risk: a one-row bar reads as thin/decorative next to the dense `thrives` block, the reader may not register it as the *punchline* it is. Sharpen by making the headline H2 carry the weight ("Rent runs about 2x or more versus the rest of London") and treating the bar as supporting evidence, which the spec already does.
- **Best visual (T4):** Here's the strongest reform opportunity on the page. A lone rent-vs-baseline bar shows *cost* but not the **squeeze**, the thing the reader actually needs is "rent rises faster than revenue here." Alternative: a **two-bar paired comparison** ("Revenue lift: 2x+ … Rent lift: 2x+") sitting side by side against the same 1.0x baseline, so the reader sees whether the cost lift swallows the revenue lift. That single paired visual is the honest heart of the page and is far more decision-grade than rent alone. **Pick: a paired revenue-lift-vs-rent-lift bar** against the shared baseline (still no money, still bands), turning a thin beat into the page's most important chart.
- **Redundancy (T5):** The "revenue ≠ profit" message repeats honest-take and one-thing (acceptable, see §2). The *data* (rent multiplier) is unique.
- **Depth/Honesty (T7):** Self-omit rule (no honest rent signal + no price tier → SectionEmpty) is correct. Rent as "modeled from land character" stays honest.
- **VERDICT:** REFORM into a **paired revenue-vs-rent bar** so the section visualizes the squeeze, not just the cost. This is the highest-leverage single change on the page.

### 6 — Versus next door / `adjacent` (like-for-like table)
- **Job (T2):** The cross-district payoff: this district vs up to 3 curated siblings, same rep trade, same city, leader mark allowed. Serves P1 (is next-door better/cheaper?) and P2 (benchmark the pitch).
- **Useful or slop (T1):** Useful and *distinctive*, this is the only honest cross-district comparison on the site and the answer to "should I be one neighbourhood over." High value for the core persona.
- **Cringe check (T3):** Big risk, identical to §3: if all four columns read "2x or more" on the rep trade (as the West End exemplar does), the table is a row of four identical cells and the comparison communicates *nothing*. The character row (Tourist trade / Office and finance / etc.) is then the only differentiating content, which means the table is mislabelled, it's really a *character* comparison wearing a multiplier table's clothes. Sharpen by **choosing a rep trade where the districts actually diverge**, or by adding a **rent-vs-city row** so the table shows "same revenue lift, very different rent", which is the genuinely useful cross-district insight.
- **Best visual (T4):** A table is right for like-for-like across a fixed dimension. But given the clamping problem, a **small-multiples / parallel comparison** that pairs each sibling's revenue-lift against its rent-lift would be more revealing than a multiplier row that flattens to "2x or more" everywhere. **Pick: keep the table but make it a two-axis comparison (rep-trade lift + rent-vs-city + character)** so columns visibly differ even when the lift clamps.
- **Redundancy (T5):** Overlaps the sibling rail (§9), both list other districts. But this is the *scored/compared* version and the rail is the *equal-weight navigation* version; keep both, they serve different jobs (compare vs browse).
- **Depth/Honesty (T7):** The leader-mark-only-within-one-city rule is the correct honesty boundary and is well guarded. Self-omit when no sibling data, correct.
- **VERDICT:** REFORM. Add a **rent-vs-city row** (and/or pick a diverging rep trade) so the comparison actually discriminates; keep the one-city leader-mark honesty model.

### 7 — Prime streets / `streets (prime)`
- **Job (T2):** Curated micro-geography, the actual streets where footfall (and rent) concentrate, with self-omitting rent/spend chips. Serves P1 (where exactly do I want a door?) and P4 (specific, citable detail).
- **Useful or slop (T1):** Genuinely useful *and* entertaining when curated, this is the texture that rewards attention and makes the page feel locally authoritative. The "a site one block back trades on most of the same crowd for a fraction of the cost" line is exactly the decision-grade nuance a P1 cannot get elsewhere.
- **Cringe check (T3):** Low cringe risk because it's curated-only (no card without a real record). The risk is the opposite, it only exists for a handful of flagship districts, so most neighbourhood pages will never show it. That's acceptable (honest absence) but means this is a "London-class" section, not a universal one.
- **Best visual (T4):** 2-col card grid with quiet rent/spend chips is right, streets are discrete, card-like objects. No better alternative.
- **Redundancy (T5):** Slight overlap with `ground` (both are curated texture) but distinct enough (streets = where; ground = what it feels like).
- **Depth/Honesty (T7):** The self-omitting chip model and "curated only" gate are exemplary honesty. Keep verbatim.
- **VERDICT:** KEEP. Best texture section on the page; model honesty is the template the rest should follow.

### 8 — On the ground / `ground`
- **Job (T2):** A knowledgeable local aside, food scene + "don't miss." Serves P5 (shareable colour) and P1 (qualitative read).
- **Useful or slop (T1):** Borderline. The "don't miss" line ("walk Soho's back streets after the theatres empty to see where locals actually eat") is genuinely good. But "the food scene" largely *restates* the `who` block's "what they spend on" line. As two separate two-column text grids (`who` and `ground` both being soft text beats), the page has two near-identical texture moments.
- **Cringe check (T3):** Risk of reading as filler / travel-guide padding rather than business intelligence. Sharpen by reframing "don't miss" as an **operator insight** (where the margin actually is) rather than a tourist tip, the back-streets line already does this; enforce that register.
- **Best visual (T4):** 2-col text grid is fine. The content barely needs its own section, though.
- **Redundancy (T5):** **High overlap with `who` (§4).** Both are curated-flavor text beats; food scene appears in both.
- **Depth/Honesty (T7):** Honest (curated-only, self-omits). Just thin.
- **VERDICT:** MERGE into `who` as a single "Who's here and what it's like" curated-texture block (skew + spend + what works + the local operator's-eye aside). Two soft text beats become one richer one.

### 9 — The businesses here / `businesses-here` (sibling rail)
- **Job (T2):** Equal-weight navigation to other districts of the same city, each with a plain character word. Pure wayfinding. Serves P1/P5 (browse the rest of the city) and SEO interlinking.
- **Useful or slop (T1):** Useful as navigation, low as *content*. It's a link grid, which is fine, but its job is hand-off, not insight.
- **Cringe check (T3):** The section label "The businesses here" is **actively misleading**, it contains no businesses, it's a list of *other districts*. This is a real clarity bug. Rename to "Other districts of [city]" or "Explore the rest of [city]."
- **Best visual (T4):** Uniform equal-weight tiles (cocoa dot + character word, no scores) is exactly right, the no-ranking discipline is correct (districts are never scored).
- **Redundancy (T5):** Overlaps both `adjacent` (§6, the *compared* siblings) and `related` (§12, the hand-off tiles). Three sections all point at "other districts / where to go next."
- **Depth/Honesty (T7):** The no-scores, no-ranking, equal-weight rule is the correct honesty stance for districts. Keep it.
- **VERDICT:** REFORM (rename to "Other districts of [city]") and **MERGE the navigation function with `related` (§12)** into one closing hand-off zone, so the page has one wayfinding moment near the end, not three scattered ones.

### 10 — Still filling in (collapse strip)
- **Job (T2):** Fold all genuinely-thin sections into one calm band rather than a wall of dashed cards. Serves the *page's credibility* across the long tail of uncurated districts.
- **Useful or slop (T1):** Useful as a *system*, this is what keeps a bare district from looking broken. On the West End exemplar it holds only one row (street-by-street), which is correct.
- **Cringe check (T3):** Low risk, this is well-designed restraint. The only risk is showing it on the filled exemplar at all (the mockup does, to demonstrate the grammar), which a casual viewer might read as "even the flagship page is incomplete." In production, on a fully-filled district it should be absent.
- **Best visual (T4):** Single bordered band of `SectionEmpty` rows is exactly the right grammar. No alternative needed.
- **Redundancy/Depth/Honesty (T5/T6/T7):** No redundancy; honesty model (dot-plus-words "Not held yet", never a fake number) is excellent.
- **VERDICT:** KEEP. This is a structural feature, not a content section; it's one of the page's best honesty mechanisms.

### 11 — One thing to remember / `one-thing`
- **Job (T2):** The warm last word + freshness stamp + flag-it. Reuses the held district verdict. Serves all personas as a memorable close.
- **Useful or slop (T1):** Useful as a close. The West End line ("one street off the main drag is often where the model actually works") is a genuinely good, specific takeaway.
- **Cringe check (T3):** Risk: it's the *third* restatement of "revenue lift ≠ profit lift." On this page that triple-statement is sanctioned by the honesty contract, but `one-thing` must add the *forward-looking* spin ("here's what to do about it"), not just repeat the warning. The "one street off the main drag" advice does this, enforce that it always carries an actionable angle, not just a caveat.
- **Best visual (T4):** Dark ink-900 card, serif verdict, atlas-300 eyebrow, the established close treatment. Right call.
- **Redundancy (T5):** Thematic overlap with honest-take and operating-cost (intentional). The freshness stamp + flag-it are unique and important (trust signals).
- **Depth/Honesty (T7):** "Modeled, June 2026" + "Flag it" is the right trust/honesty close. Keep.
- **VERDICT:** KEEP. Enforce an actionable (not merely cautionary) closing line.

### 12 — Related / hand-off
- **Job (T2):** Two tiles (all-neighbourhoods index, city overview) + a "Compare two districts" accent CTA. Wayfinding + the one explicit CTA on the page.
- **Useful or slop (T1):** Useful, "compare two districts" is a genuinely valuable action for a P1 torn between two pitches, and "city overview" is the natural zoom-out.
- **Cringe check (T3):** Low. The risk is purely that it duplicates the sibling rail's job (see §9).
- **Best visual (T4):** Two tiles + one accent button is fine. The "Compare two districts" CTA is the most valuable element and should be visually prominent.
- **Redundancy (T5):** Overlaps `businesses-here` (§9). Both are end-of-page wayfinding.
- **Depth/Honesty (T7):** No issue.
- **VERDICT:** MERGE with `businesses-here` (§9) into a single closing "Where to look next" zone: the sibling district tiles + the index/city-overview hand-offs + the compare CTA, all in one navigation moment.

---

## What is MISSING , new sections to ADD

1. **The squeeze, made explicit (the lift-vs-rent reckoning).** *Job:* answer the P1's real question, "after the rent, is the lift worth it?" Currently the page tells you revenue lifts (thrives) and rent lifts (operating-cost) in two separate places and asks the reader to do the subtraction. *Persona:* P1, P2. *Best visual:* the **paired revenue-lift-vs-rent-lift bars** (proposed in §5) promoted to its own small "net read" beat, or folded into a reformed operating-cost. This is the single most valuable thing the page could add, and it's almost free because both numbers already exist.

2. **Survive-the-slow-start / seasonality read.** *Job:* the persona brief explicitly asks "can I survive the slow start?", and a tourist-pull district like the West End has brutal seasonality and weekday/weekend swings that a financial district inverts. The page hints at this ("evening and weekend") but never makes it a section. *Persona:* P1 (cash-flow survival), P2. *Best visual:* a small **week-shape or season-shape strip** (qualitative: weekday vs weekend, peak vs trough) showing *when* the footfall actually arrives, no money, purely a relative shape. This is decision-grade and absent.

3. **Footfall vs spend honesty note (who the crowd is for *business*).** *Job:* the city page has a visitor-vs-resident split; the district page asserts "the pull here is visitors" but never quantifies the catchment mix that drives the multiplier. *Persona:* P1, P3. *Best visual:* a single **proportion bar (commuter / tourist / resident pull)** reusing the city's `VisitorSplit` grammar, scoped to the district. This would also give the hero gauge and the decomposition a shared source-of-truth visual.

4. **Concept-fit nudge ("what to open here, what not to").** *Job:* P1's literal question is "should I open *my* trade here?" The thrives bars answer it implicitly (find your trade in the list) but the page never *says* "the West End rewards crowd-trades and punishes daily-needs trades." *Persona:* P1, P5. *Best visual:* could be a one-line lead on the reformed thrives section rather than a full section, but the explicit "what fits / what fights this district" framing is currently missing.

(Deliberately NOT adding: any absolute money, any district *score*, any cross-district-x-trade ranking, all correctly forbidden by the honesty contract.)

---

## What to CUT or MERGE

- **MERGE `ground` (§8) into `who` (§4).** Two soft curated-text beats with overlapping content (food scene appears in both) is one beat too many. Combine into a single "Who's here and what it's like" texture block: skew + spend behaviour + what already works + the operator's-eye local aside ("where the margin actually is off the main drag"). One richer section beats two thin ones.
- **MERGE `businesses-here` (§9) into `related` (§12).** Three end-of-page sections (`adjacent`, `businesses-here`, `related`) all point at "other districts / where next." Collapse the two pure-navigation ones into a single closing "Where to look next" zone. Keep `adjacent` separate because it *compares* (different job); merge the two that merely *link*.
- **DOWNGRADE the hero gauge if the two-marker reform isn't taken.** As a single-marker instrument it is geometrically heavy for one fact that §3's top bar already states. If it can't be made to show lift-AND-squeeze, the honest move is to let the verdict line + pills own the hero and push all magnitude into a diverging `thrives` chart.
- **Weakest sections overall:** `ground` (thinnest, most redundant), `businesses-here` (mislabelled, redundant navigation), and the *single-marker* version of the hero gauge (over-engineered for one fact). None should be cut outright on a flagship district, but all three should be merged/reformed as above.

---

## The reformed, re-ordered section list (final recommendation)

1. **Global navbar + breadcrumb** , full `navbar1`; breadcrumb treated as first-class hierarchy navigation (city + all-neighbourhoods are the key upward links). *Visual:* sticky bar + inline crumb.
2. **District hero / `headline`** , answer-first verdict + a **two-marker multiplier gauge** (top trade AND most-squeezed trade) so the hero shows lift-and-squeeze in one read; trade-labelled hero number; three-weight pill row; "relative read by design" note. *Visual:* answer-first masthead + dual-marker ScoreBand gauge.
3. **The honest take / `honest-take`** , the conscience beat; require one district-specific point so it never reads as boilerplate. *Visual:* calm accent panel, serif verdict + plain bullets.
4. **What thrives here / `thrives`** , the workhorse, reformed to a **diverging centre-baseline bar** (lifts right of 1.0x, squeezes left) so identical clamped bars stop reading as fabricated; rows clickable into cells; the one-trade decomposition card kept verbatim. *Visual:* diverging bar set + decomposition mini-grid.
5. **Cost to operate / `operating-cost`** (reformed into **the squeeze**) , a **paired revenue-lift-vs-rent-lift bar** against the shared 1.0x baseline, the page's most decision-grade chart, with the "revenue lift ≠ profit lift" punchline as the H2. *Visual:* paired comparison bars + character clause.
6. **When the footfall arrives** (NEW, optional/curated) , a qualitative **week-shape / season-shape strip** answering "can I survive the slow start?" *Visual:* relative-shape strip (no money), self-omits when uncurated.
7. **Versus next door / `adjacent`** , the cross-district payoff, reformed to a **two-axis table** (rep-trade lift + rent-vs-city + character) so columns visibly differ even when the lift clamps; one-city leader mark preserved. *Visual:* like-for-like table inside its own scroll track.
8. **Who's here and what it's like** (MERGED `who` + `ground`) , skew + spend behaviour + what works + the operator's-eye local aside; role-distinct list icons; curated-only, self-omits. *Visual:* `WhatLocalsKnow` visual list.
9. **Prime streets / `streets (prime)`** , the best texture section; curated-only cards with self-omitting rent/spend chips. *Visual:* 2-col card grid.
10. **Still filling in (collapse strip)** , the honesty mechanism that folds thin sections into one calm band; absent on fully-filled districts. *Visual:* single bordered `SectionEmpty` band.
11. **One thing to remember / `one-thing`** , the warm, *actionable* close (advice, not just a caveat) + "Modeled, June 2026" + Flag it. *Visual:* dark ink-900 close card.
12. **Where to look next** (MERGED `businesses-here` + `related`) , the single end-of-page wayfinding zone: equal-weight sibling-district tiles (renamed from the misleading "The businesses here," no scores) + city-overview / all-neighbourhoods hand-offs + the prominent **"Compare two districts"** CTA (the page's one explicit action). *Visual:* uniform tile grid + hand-off tiles + accent button.
13. **Full footer / `footer7`** , keep the modeled-relative, no-absolute-money disclaimer verbatim. *Visual:* multi-column footer.

The through-line of the reform: the page currently *tells* you the lift in one place and the rent in another and trusts you to subtract; the strongest single move is to make **the squeeze** (lift vs rent) an explicit, visualized beat, echoed by a two-marker hero and a diverging thrives chart, so the page's hardest-won, most honest insight, "a 2x revenue lift is not a 2x profit lift, and the rent is the reason", is something you *see*, not something you have to assemble yourself. Everything else (merging the two texture beats, consolidating the three wayfinding sections, killing the wall-of-identical-clamped-bars cringe) is cleanup in service of that spine.
