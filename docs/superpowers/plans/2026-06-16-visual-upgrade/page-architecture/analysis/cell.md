# Section analysis: Cell (a trade in a place, e.g. restaurants in London) , the flagship

## Who is on this page and what they came for

This is the conversion crucible. P5 (the curious SEO arrival, "how much does a restaurant make in London") and P1 (the prospective owner) land here in roughly equal volume; P1 arrives in a high-stakes, slightly anxious mindset ("am I about to risk my savings on this?"), while P5 arrives idle and shareable. P2 (the buyer pricing an existing room), P3 (the lender/PE analyst underwriting), and P4 (the advisor citing a number for a client) also land here, but they want the *evidence layer* below the fold, not the headline. The single question this page must answer in one breath: **what does this exact trade in this exact place take in, and what would I actually keep, and is it hard enough that I should walk away?** Everything else is supporting testimony for that one verdict.

## Section-by-section audit

### Global: Full navbar (navbar1)
- **Job (T2):** site chrome and escape hatches (other trades, other places, compare). All personas.
- **Useful or slop (T1):** Useful, but the current mockup nav is generic ("Countries / Industries / Cities / Compare" + "Get the data"). The "Get the data" dark button is the most decision-relevant affordance and it is undersold and undefined.
- **Cringe check (T3):** "Get the data" reads as a SaaS placeholder. It implies a paywall/product that the rest of the page does not set up. Either make it concrete ("Compare two places" / "See the method") or drop it. A generic nav CTA competing for the eye is exactly the slop the spec warns against.
- **Best visual (T4):** Sticky blurred bar is correct. The one upgrade: the topic dropdowns should preview *adjacent cells* (other trades here, same trade nearby) since lateral movement is the real navigation pattern for this page.
- **Redundancy / Depth / Honesty:** No redundancy. Honest. Depth fine for chrome.
- **VERDICT: KEEP** (reform the nav CTA from "Get the data" to a concrete action; make dropdowns cell-aware).

### 0a. Masthead (hero number + distribution curve + take-home echo + 3 KPI tiles)
- **Job (T2):** Deliver the answer in one breath: typical revenue, the spread it sits in, and the take-home echo. Serves everyone; it IS the page's reason to exist.
- **Useful or slop (T1):** Maximally useful. This is the section every persona came for. No notes on existence.
- **Cringe check (T3):** Two real risks. (1) The headline "A London restaurant brings in about half a million a year" leads with revenue, which is the *vanity* number, not the decision number. For P1 the gut-punch fact is "$503K in, $48K kept" — the headline should carry the gap, not bury take-home in a sub-caption. (2) The KPI tile "Restaurants in London 8,200" is a competition/saturation signal but it is presented flatly as trivia; frame it as "how crowded is this" or it reads as filler.
- **Best visual (T4):** The ratified upgrade from a bare RangeStrip to a **distribution curve** is the right call and clearly better: a density silhouette tells a non-expert "most rooms cluster low, a few run hot" in a way a flat bar cannot, and it visually justifies the word "typical." Debate: a box-and-whisker would be more precise but reads as a statistics class; a dot-strip of real comparable places would be the *most* honest but you do not have per-place London granularity to populate it. The density curve is the correct pick — provided the label says "the spread of comparable rooms," not a fabricated probability. One refinement: place the take-home as a *second marker on the same axis economy* so the eye sees "$503K in" and "$48K kept" in one figure, not two separate widgets.
- **Redundancy / Depth / Honesty:** Take-home is intentionally repeated downstream (echo, KPI, calculator, #6) — that is fine and ratified. Honesty: gated on `moneyShown`, rounded to $1,000. Good. Depth: add a one-word saturation read to the firms tile.
- **VERDICT: KEEP + REFORM.** Promote the take-home/gap into the headline tier (lead with what you keep, not just what comes in); reframe the firms tile as a crowding signal; render the distribution curve as the ratified upgrade.

### 0b. Make-it-yours calculator
- **Job (T2):** Turn a generic benchmark into *the reader's* number. Core for P1 ("what if my rent is higher?") and P2 (stress-testing a target's economics).
- **Useful or slop (T1):** Potentially the single most useful interactive element on the site for P1. But as specced it is thin: three sliders (rent, staff, owner's draw) + a switch. Rent and staff are the same lever twice (both are cost inputs); the model does not expose the *revenue* side at all, so a P1 who thinks "but I'd do 160 covers, not 116" cannot move the needle that matters most.
- **Cringe check (T3):** The risk is a toy calculator that always returns a plausible-looking number with no shown math — that erodes trust fast for P2/P3, who will immediately ask "what's the formula?" Sharpen by exposing the *one* lever that dominates this trade's margin (covers/day or average spend) and showing the arithmetic chain ("116 covers × $12 × 365 = $508K → −costs → $48K"). A calculator that shows its working is credible; one that just animates a result is slop.
- **Best visual (T4):** Sliders + live result is right for P1. For credibility add a collapsible "how this is figured" line. Alternative considered: a full editable P&L table — too heavy, would compete with #4. Keep sliders, add the revenue lever and the visible math.
- **Redundancy / Depth / Honesty:** Honest gating (mounts only when real take-home held). Depth is the gap: add revenue-side input; show the chain. No redundancy.
- **VERDICT: KEEP + REFORM.** Add a revenue lever (covers/day or average spend), show the arithmetic, and keep it directly under the hero. This is a flagship affordance; invest in it.

### 1. The honest take (verdict + 3 levers + break-in ScoreBand)
- **Job (T2):** The "should I" verdict and the structural reason. Core for P1; the credibility anchor for P4.
- **Useful or slop (T1):** Highly useful — this is the "honest read" half of the brand promise. The break-in ScoreBand ("Hard," 78%) is exactly the survival-anxiety answer P1 needs.
- **Cringe check (T3):** The verdict copy is good and specific ("a wages-and-rent business, not a high-margin one"). The risk is the three bullets drifting toward generic ("pricing power is the lever") on cells where the data does not support a sharp claim. Rule: every bullet must name a *number or a mechanism specific to this trade-in-place*, never a platitude. The break-in score needs a "compared to what?" — 78% Hard relative to which universe? Anchor it ("harder than most UK food trades") or it floats.
- **Best visual (T4):** ScoreBand tick is correct and on-grammar. Alternative: a 2-axis "reward vs difficulty" plot would be richer but invites cross-trade ranking, which is banned. ScoreBand stays.
- **Redundancy / Depth / Honesty:** Overlaps the closing "one thing to remember" (which reuses this verdict by design) and the narrative #2. The modeled-figures disclaimer living here is the right place. Honesty: strong.
- **VERDICT: KEEP.** Tighten the bullet discipline (number-or-mechanism only); anchor the break-in score against a stated peer set.

### 2. In context (two-sentence narrative)
- **Job (T2):** A palate-cleanser prose beat restating revenue→take-home in plain words. P5 mainly.
- **Useful or slop (T1):** Borderline slop. It repeats the masthead ("$503K a year… keeps about $48K") and the honest-take verdict ("busy room, thin margin") with no new information. Three sections now say the same sentence.
- **Cringe check (T3):** This is the most "AI wrote a connective paragraph because the template had a slot" section on the page. It adds rhythm but not knowledge.
- **Best visual (T4):** Prose, no chart — appropriate IF it survives. But the better use of this slot is a *new fact*, not a restatement.
- **Redundancy (T5):** Direct overlap with masthead echo, honest-take, and the closing line. This is the clearest redundancy on the page.
- **VERDICT: MERGE / CUT.** Either cut it, or repurpose the slot: replace the restatement with one genuinely contextual sentence the page does not otherwise carry (e.g. how this room compares to the same trade's national typical, or what share of rooms here actually clear a living for the owner). A pure restatement earns no place on an almanac-dense page.

### 3. In plain terms (3 unit cards: covers/day, avg spend, payroll)
- **Job (T2):** Translate an abstract revenue figure into things a human can picture. Core for P5 and first-time P1.
- **Useful or slop (T1):** Useful and well-judged — "116 covers a day, $12 a head, 12 staff" makes $503K real. This is good translation work.
- **Cringe check (T3):** Low risk. One sharpening: "$12 average spend per cover" reads suspiciously low for a London restaurant and may trip a knowledgeable reader's BS detector (is that per item, per cover, lunch-blended?). Define the unit precisely or the whole page's credibility wobbles on one odd number.
- **Best visual (T4):** Icon-led unit cards are right — tangible, scannable, non-expert-friendly. No better alternative.
- **Redundancy / Depth / Honesty:** Modeled, gated. Honest. Depth fine. No redundancy.
- **VERDICT: KEEP.** Fix the average-spend figure/definition so it survives scrutiny.

### 4. Where the money goes (DONUT + legend, founder override)
- **Job (T2):** Show the per-$100 cost structure and that the owner keeps only the last $10. The structural heart for P1/P2/P3.
- **Useful or slop (T1):** Core and useful. The "$10 of every $100" framing is the page's most quotable, shareable insight.
- **Cringe check (T3):** Here is the audit's sharpest disagreement with the ratified decision. The founder overrode "never a pie" to make this a **donut**. A donut is the *worst common chart for a part-to-whole that is really a sequence of subtractions* — readers cannot compare arc lengths accurately, and the whole point ("each cost steps the bar down until $10 is left") is a depletion story, not a composition story. The current mockup's **waterfall** tells that story far better, and the live HTML already implements it correctly and beautifully. A donut also re-introduces a known AI-slop tell the brand explicitly banned.
- **Best visual (T4):** Ranked debate: (1) **Waterfall** — best for "watch the money deplete," already built, honest. (2) **100%-stacked single bar** — already present as the companion; clean, accurate length comparison, the kept slice pops in moss. (3) **Donut** — prettiest, least accurate, off-brand. Recommendation: **keep the waterfall as the primary**, keep the 100% bar as the companion, and *if* the founder wants the donut it should be demoted to a small decorative secondary, never the load-bearing visual. The spec itself concedes the donut is only "allowed because the owner-kept slice is unmistakably emphasized" — that conditional is a tell that the chart type is fighting the honesty rule rather than serving it.
- **Redundancy / Depth / Honesty:** Overlaps #5 (cost-drivers) by design — #5 re-ranks the same four lines. That is acceptable continuation, but see #5. Honesty: the donut needs a crutch (moss + center callout) to stay honest; the waterfall is honest by construction.
- **VERDICT: REFORM — revert to the waterfall (keep the 100% companion bar).** Flag the donut override for founder reconsideration: it is the one ratified decision that works against both the honesty rule and the data's natural shape.

### 5. What moves the cost (ranked horizontal bars)
- **Job (T2):** Rank the cost lines largest-first so the reader knows which lever matters most. P1/P3.
- **Useful or slop (T1):** Weak as a standalone section. It shows the *same four numbers* as #4 (Payroll $33, COGS $30, Rent $15, Else $12) re-sorted. The spec admits it "rides off #4." That is a confession that it is not a distinct section.
- **Cringe check (T3):** Re-displaying identical data in a second chart 200px below the first is textbook padding. A reader thinks "didn't I just see this?"
- **Best visual (T4):** Ranked bars are fine, but the question is whether the *section* should exist. If kept, it should add something #4 cannot: **sensitivity** (which line, if it moves 10%, hurts the margin most) or **vs-the-norm** (is this room's rent unusually high for the trade?). That is genuinely new and decision-grade.
- **Redundancy (T5):** Near-total overlap with #4. This is the second-clearest redundancy on the page.
- **VERDICT: MERGE into #4** (as the legend's ranking already does the job), **OR REFORM** into a distinct "what would move your margin most" sensitivity view. Do not keep it as a plain re-rank.

### 6. What the owner keeps (kept-vs-gone bar + repeated take-home)
- **Job (T2):** Land the take-home number with finality. The emotional and decision climax for P1.
- **Useful or slop (T1):** Useful as the payoff beat, but it is the *fourth* time take-home appears ($48K in hero, KPI tile, calculator, and here) and the kept-vs-gone bar is the *third* time the 10/90 split appears (waterfall kept row, 100% bar, here).
- **Cringe check (T3):** Risk of feeling like the page is padding by restating. The repetition is defensible only if this instance *adds* something — e.g. the take-home expressed against an alternative ("$48K, versus ~$55K median UK salary for the same hours" or "per hour worked"). A bare restated bar does not earn a full section.
- **Best visual (T4):** The kept-vs-gone bar is fine. The higher-value visual: take-home reframed as **opportunity cost** — what the owner earns versus a salaried job, given the hours. That is the question P1 actually loses sleep over.
- **Redundancy (T5):** High overlap with masthead echo and #4's kept slice.
- **VERDICT: REFORM.** Keep the section but give it a job the others don't: contextualize the take-home (per hour, vs a salary, vs the capital at risk) rather than restating the dollar a fourth time.

### 7. Break-even (threshold gauge)
- **Job (T2):** "Can I survive the slow start? How busy must I be to not lose money?" The survival question — core P1, and a key underwriting input for P3.
- **Useful or slop (T1):** Excellent and high-value. "Break even at 95 covers, typical day is 140" is exactly the decision-grade truth the page promises, and the amber-below/moss-above gauge encodes it honestly.
- **Cringe check (T3):** Very low. One enhancement: tie it to the calculator — let the reader see *their* break-even move when they change inputs. The gauge currently stands alone.
- **Best visual (T4):** The threshold gauge is the right pick — it shows margin of safety (the 95→140 gap) at a glance better than any bar or number. Alternative: a small break-even line chart (cost vs revenue crossing) is more "textbook correct" but less instantly legible to P5. Gauge wins.
- **Redundancy / Depth / Honesty:** No redundancy. Honest (floor ≥2/day prevents nonsense). Strong section.
- **VERDICT: KEEP.** Optionally wire it live to the calculator.

### 8. What to watch / risks (severity ladder)
- **Job (T2):** The honest risk read — "what will go wrong and how badly." Core for P1; credibility for P3/P4.
- **Useful or slop (T1):** Useful and on-brand (the "honest read" promise). The severity glyph (serious/watch/rare) is a good, calm encoding that avoids fear-mongering.
- **Cringe check (T3):** The risk is generic risks that apply to any business ("a supplier or energy shock," "holding good staff"). Each row must be *specific to this trade in this place* — "rent resets on renewal" is good and specific; "a supplier or energy shock" is generic filler that could appear on any cell. Replace generic rows with trade-specific ones (e.g. for restaurants: food hygiene rating downgrade, delivery-platform commission squeeze, alcohol licensing).
- **Best visual (T4):** Severity ladder is the right call — graded glyph + one note reads fast and stays calm. No better alternative; a risk matrix would over-engineer it.
- **Redundancy / Depth / Honesty:** No real overlap (the honest-take bullets are levers, not risks). Honest. Depth: make rows trade-specific.
- **VERDICT: KEEP.** Enforce trade-and-place specificity per row; cut any row that could appear unchanged on a different trade.

### 9. Pay by role / wages (floating range rows)
- **Job (T2):** "What will my team cost, and what does the work pay?" Core for P1 (cost planning) and P5 (the "how much does a chef make" arrivals).
- **Useful or slop (T1):** Useful — wages are a top-three cost and a top SEO draw. The shared-scale dumbbell with the honesty caveat is well-designed.
- **Cringe check (T3):** Low. The caveat ("all roles on the same $0–$80K scale… a head chef's bar is honestly longer") is a genuinely thoughtful honesty touch, not cringe. Keep it. One addition: show what the *owner* effectively pays themselves on the same scale — it dramatizes that the owner often earns less than their head chef.
- **Best visual (T4):** Floating range rows (dumbbell) on a shared scale is the right pick — it shows both the spread and the cross-role comparison honestly. Alternative (separate bars per role) would hide the cross-role truth. Dumbbell wins.
- **Redundancy / Depth / Honesty:** No overlap. Honest (shared scale stated). Add the owner's draw to the scale for punch.
- **VERDICT: KEEP.** Add the owner's effective pay onto the same wage scale.

### 10. Cost to open / startup (stacked cost bar)
- **Job (T2):** "What's the upfront check?" Core for P1 (do I have the capital?) and P2/P3 (capital-at-risk benchmark).
- **Useful or slop (T1):** Useful and decision-grade. "$350K before the first cover" is a sobering, necessary number.
- **Cringe check (T3):** Low. The improvement: connect startup cost to payback — "$350K in, $48K/yr kept = ~7 years to recoup" is the insight that makes the number mean something. Right now it floats without a payback frame.
- **Best visual (T4):** Stacked bar + legend is adequate. Better: pair it with the first-year ramp (#12) so capital-out and break-even-timing tell one money-in/money-out story. Consider co-locating #10 and #12.
- **Redundancy / Depth / Honesty:** No overlap currently, but it and #12 (first year) are two halves of the same "getting in" story sitting apart. Honest. Depth: add payback.
- **VERDICT: KEEP + REFORM.** Add a payback-period line; consider pairing with #12.

### 11. Through the year / seasonality (gradient area chart)
- **Job (T2):** "Can I survive the slow months?" — cash-flow planning. P1, and a working-capital input for P3.
- **Useful or slop (T1):** Useful for cash-flow-anxious P1; mildly decorative for others. The "quietest Jan/Feb, busiest summer + December" curve is real planning information.
- **Cringe check (T3):** Moderate risk: seasonality is the section most likely to be a generic curve that looks the same for every trade. The "so what" must be explicit: "a slow January and February can undo a thin-margin autumn — hold reserves." Without that line it is pretty but inert.
- **Best visual (T4):** Gradient area over 12 months is the right pick and the spec calls it "its sweet spot." Agreed. Alternative (bar-per-month) is choppier and no more informative. Area wins; keep axes stripped.
- **Redundancy / Depth / Honesty:** No overlap. Exemplar-gated honestly. Depth: add the cash-flow "so what."
- **VERDICT: KEEP.** Add the explicit reserve/cash-flow takeaway.

### 12. Your first year (timeline ribbon)
- **Job (T2):** "Can I survive the start?" — the ramp and when break-even lands. Core P1 survival question.
- **Useful or slop (T1):** Useful and emotionally resonant — "the fragile months, about 30 in 100 do not make it past here" is exactly decision-grade honesty.
- **Cringe check (T3):** The "30 in 100 do not make it" stat is powerful but must be real/holdable, not invented — it is the kind of survival statistic that needs a defensible source or it becomes the page's biggest honesty liability. Either hold it or soften to a non-numeric statement.
- **Best visual (T4):** Horizontal timeline ribbon with the break-even node emphasized is the right pick for a sequence-of-milestones story. No better alternative.
- **Redundancy / Depth / Honesty:** Overlaps #10 (startup) and #7 (break-even) thematically — all three are "getting in and surviving." Consider grouping. Honesty: the failure-rate stat is the watch item.
- **VERDICT: KEEP.** Verify/hold the failure-rate number or de-numericize it; consider grouping with #10 under one "getting in" arc.

### 13. The same business nearby (like-for-like bars)
- **Job (T2):** "Is this place better or worse than comparable places for this trade?" Core for P1 (location choice) and P2/P3 (benchmarking). The site's data moat made visible.
- **Useful or slop (T1):** Very useful and a strong differentiator — few competitors offer same-trade cross-city comparables with honesty rails.
- **Cringe check (T3):** Low, because the caveat rail ("same trade, same currency, not price-adjusted, not a league table") does real work. The one risk: readers WILL read it as a ranking no matter the caveat. Mitigate by ordering geographically or by the subject-centered design rather than strictly descending, so it visually resists the league-table read.
- **Best visual (T4):** Like-for-like bars with the subject in atlas is correct. Alternative: a small map with sized dots would resist ranking better but loses precise comparison. Bars win; keep the honesty rail load-bearing.
- **Redundancy / Depth / Honesty:** No overlap. This is where the cross-business-×-geography ban is most at risk — the constitution's "comparable PLACES only, same trade" rule is correctly applied. Districts suppressed. Honest.
- **VERDICT: KEEP.** Strengthen the anti-ranking visual framing.

### 14. Operator voices (quote wall)
- **Job (T2):** Qualitative texture — what running this room actually feels like. P1 (reality check), P5 (color).
- **Useful or slop (T1):** Borderline. As specced these are *illustrative exemplar quotes "drawn from the three levers above"* — i.e. the page is paraphrasing its own honest-take bullets and presenting them in quote marks. That is close to manufacturing testimony, which is the riskiest move on an honesty-first site.
- **Cringe check (T3):** High cringe + high honesty risk. Quotes with no attribution that restate the page's own analysis read as fabricated voices. Either hold *real* (even anonymized-but-genuine) operator quotes, or do not present analysis-in-quote-marks as "voices."
- **Best visual (T4):** A quote wall is fine *if the quotes are real*. If not, this slot is better used for a factual "what the day actually looks like" beat (hours, physical demand) than faux-quotes.
- **Redundancy (T5):** The three quotes map 1:1 to the three honest-take levers — direct redundancy dressed as testimony.
- **VERDICT: CUT (until real voices are held) or REFORM into "the lived reality" (factual hours/demand, no quote marks).** Presenting paraphrased analysis as operator quotes is the single biggest honesty liability on the page.

### 15. Versus the world (ScoreBand / collapse strip)
- **Job (T2):** Global anchor — "how does this place rank worldwide for this trade?" P3/P4 mostly.
- **Useful or slop (T1):** Useful when held; honestly folds into the collapse strip when not (as it does in the mockup). The honest self-omission is good behavior.
- **Cringe check (T3):** Low, precisely because it self-suppresses rather than fabricating. The risk is the section almost never having data, so it lives perpetually in the strip — at which point ask whether it belongs in the cell spine at all (it may be better as an industry-page concern).
- **Best visual (T4):** ScoreBand vs global median is the right grammar when held. Fine.
- **Redundancy / Depth / Honesty:** Overlaps #13 conceptually (both are "vs other places"); #13 is cities, this is world. Honest. If it rarely fills, it is a candidate for removal from the cell and promotion to the industry page.
- **VERDICT: KEEP (folds honestly)** but flag: if it almost never holds data on cells, **demote it** to the industry page and free the slot.

### Collapse strip
- **Job (T2):** Honest placeholder for unheld sections without a wall of dashes. All personas (trust mechanism).
- **Useful or slop (T1):** Genuinely useful infrastructure — this is the mechanism that lets a thin cell stay dignified. A real product-design win.
- **Cringe check (T3):** Low. Keep the copy honest and calm ("we will not show a fabricated number") — that line builds more trust than any filled section would.
- **Best visual (T4):** Low-contrast chip strip is correct.
- **VERDICT: KEEP.** This is load-bearing trust infrastructure.

### One thing to remember (closing line)
- **Job (T2):** A memorable, shareable closing verdict. P5 (the share), P1 (the takeaway).
- **Useful or slop (T1):** Useful as a closing beat, but it explicitly *reuses the honest-take verdict* — "pricing power, not volume" is the same claim as #1.
- **Cringe check (T3):** Acceptable as a deliberate bookend, but on an almanac-dense page that already restates the verdict in #1 and #2, a third restatement risks redundancy fatigue. It survives only because it is the *last* word and is allowed to echo.
- **Redundancy (T5):** Intentional overlap with #1; acceptable as a closer.
- **VERDICT: KEEP** (as the deliberate closer; ensure #2 is cut/repurposed so the verdict isn't said three times before this).

### 16. Related (link tiles + compare CTA)
- **Job (T2):** Lateral navigation and the one soft conversion ("compare two places"). All personas; the page's hand-off.
- **Useful or slop (T1):** Useful — lateral movement is how this page type is actually explored. The single terracotta CTA placement is disciplined.
- **Cringe check (T3):** Low. Make the tiles concrete and data-bearing ("Restaurants in Manchester — owner keeps ~$42K") rather than bare names, so the link itself previews value.
- **Best visual (T4):** Link-tile grid + one CTA is right. Adding a take-home preview to each tile turns navigation into comparison-shopping.
- **VERDICT: KEEP.** Enrich tiles with a preview metric.

### Global: Rich footer (footer7)
- **Job (T2):** Site chrome, legal, trust links (method, data). All personas; P3/P4 specifically want the method link.
- **Useful or slop (T1):** Useful. For an honesty-first product, the "Methodology" link in the footer is more important than usual and should be prominent.
- **VERDICT: KEEP.** Elevate the methodology link.

## What is MISSING , new sections to ADD

1. **How sure are we / the method-and-confidence strip.** The page makes confident claims and then quietly admits "modeled from the national pattern." P2/P3/P4 will not cite a number they cannot defend. Add a compact, honest confidence read per cell: which figures are held-local vs modeled, and a plain "how we figured this" link. **Persona:** P3/P4 (and trust for all). **Visual:** a small per-section confidence chip row or a single "real / modeled" legend keyed to the sections, not a chart. This is the highest-value missing section for monetizable depth.

2. **Owner pay vs a salary (the opportunity-cost beat).** The unspoken P1 question is "would I make more just taking a job?" $48K take-home for 60-hour weeks running $350K of risk is a *different* story than $48K salaried. **Persona:** P1 (the real decision), P2 (is the owner's add-back realistic). **Visual:** a two-bar or annotated comparison (owner take-home per hour vs a salaried equivalent), or fold into a reformed #6.

3. **What kind of owner wins here (the operator archetype).** Beyond "pricing power," who actually succeeds at this trade in this place — the under-the-radar edge (the "Edge" lens from the constitution, currently absent from the cell). **Persona:** P1, P5 (entertaining + useful). **Visual:** a short, specific 2–3 item "the edge" list, distinct from generic levers.

4. **Demand / who eats here (the customer).** The cell answers cost and reward thoroughly but barely touches *demand* — who the customer is, tourist vs local money, day-part split. For a restaurant this is decisive. **Persona:** P1 (will there be enough demand for me?). **Visual:** a small day-part or local-vs-visitor split bar. (The city page has this; the cell should carry a trade-specific slice.)

5. **Exit / what you could sell it for (the "Path" lens).** P1 wants to know the endgame; P2 IS the buyer; P3 underwrites the exit. The cell currently has no "what's it worth / can I sell it" beat. **Persona:** P2 (primary), P1, P3. **Visual:** a simple valuation-multiple range ("rooms like this change hands at ~X× owner earnings → roughly $Y"), with an honesty caveat. This directly serves the monetizable personas and is a genuine gap.

6. **At a glance / the scannable verdict card (above or in the masthead).** P5 and time-poor P1 want the whole answer in 5 seconds: revenue, take-home, difficulty, break-even, payback — five numbers in one card. The page makes you scroll to assemble this. **Persona:** P5, P1, P4. **Visual:** a compact 5-stat verdict card (extends the existing KPI tiles into a true at-a-glance).

## What to CUT or MERGE

- **#2 In context — CUT or repurpose.** Pure restatement of the masthead and the honest-take. On an almanac-dense page it is the clearest dead weight; reclaim the slot for a genuinely new contextual fact or remove it.
- **#5 What moves the cost — MERGE into #4** (the legend already ranks the lines) **or reform into a sensitivity view.** As a plain re-rank of the same four numbers shown 200px above, it is redundant.
- **#14 Operator voices — CUT until real voices are held.** Paraphrasing the page's own analysis into unattributed "quotes" is the worst honesty risk on the page; better absent than fabricated.
- **#6 Owner keeps — MERGE its restatement role, REFORM its job.** Take-home is already stated three times before it; this section earns its place only if it adds opportunity-cost context (per hour / vs salary).
- **#15 Versus the world — flag for demotion.** If it almost never holds cell-level data, move it to the industry page and free a slot.
- **The donut (#4) — do not adopt; revert to the waterfall.** It is the one ratified change that works against the data's shape and the honesty rules.

## The reformed, re-ordered section list (final recommendation)

1. **Masthead — hero number + distribution curve + take-home echo.** Lead with the gap (in vs kept), not just revenue. *Visual: oversized Newsreader number + density curve.*
2. **At-a-glance verdict card (KPI row, reformed).** Five decision numbers in one breath: revenue, take-home, difficulty, break-even, payback. *Visual: 5-stat tile row.*
3. **Make-it-yours calculator.** Add a revenue lever and show the arithmetic. *Visual: sliders + live result + visible math.*
4. **The honest take (verdict + levers + break-in score).** The "should I," with each lever number-or-mechanism specific. *Visual: accent panel + break-in ScoreBand.*
5. **In plain terms (covers/day, avg spend, payroll).** Make the number tangible; fix the spend definition. *Visual: icon unit cards.*
6. **Who eats here / demand (NEW).** Trade-specific customer and day-part read. *Visual: local-vs-visitor or day-part split bar.*
7. **Where the money goes — WATERFALL (revert) + 100% companion bar.** The depletion story, honest by construction. *Visual: waterfall + stacked bar (drop the donut).*
8. **What would move your margin most (reformed #5).** Sensitivity, not a re-rank. *Visual: ranked sensitivity bars.*
9. **What the owner keeps — vs a salary (reformed #6).** Take-home in opportunity-cost terms. *Visual: per-hour / vs-salary comparison.*
10. **Break-even (gauge), wired to the calculator.** Margin of safety. *Visual: threshold gauge.*
11. **What to watch / risks — trade-specific rows only.** The honest risk read. *Visual: severity ladder.*
12. **Pay by role + the owner's own pay.** Team cost and the work's pay. *Visual: shared-scale dumbbell rows.*
13. **Getting in: cost to open + your first year (grouped).** Capital out and when it turns, with payback. *Visual: stacked startup bar + timeline ribbon.*
14. **Through the year (seasonality) + the cash-flow takeaway.** Surviving the slow months. *Visual: gradient area chart.*
15. **What it could sell for / exit (NEW).** The endgame and the buyer's price. *Visual: valuation-multiple range with caveat.*
16. **The same business nearby (like-for-like).** Cross-place benchmark, anti-ranking framing. *Visual: like-for-like bars + honesty rail.*
17. **Versus the world (folds honestly; candidate for demotion).** Global anchor when held. *Visual: ScoreBand or collapse strip.*
18. **How sure are we / method + confidence (NEW).** What's held vs modeled; the citable trust layer. *Visual: per-section confidence chips + method link.*
19. **One thing to remember (closer).** The single shareable verdict. *Visual: Newsreader closing line.*
20. **Related + compare CTA, with preview metrics.** The hand-off. *Visual: data-bearing link tiles + one terracotta CTA.*
- *Collapse strip and operator-voices: strip retained as trust infrastructure; voices held out of the spine until real quotes exist.*

The shape of the reform: the page is strong on **cost and reward** and weak on **demand, edge, and path/exit** (three of the constitution's nine lenses are under-served on the cell). It restates the verdict and the take-home too many times and under-delivers on the two things the monetizable personas pay for — **confidence/method** and **valuation/exit**. Fix those, revert the donut to the waterfall, retire the faux operator voices, and the flagship earns its name.

Key files: spec at `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\05-cell.md`; architecture extension at `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\page-architecture\cell.md`; live mockup at `E:\atlas\cell-london-restaurants.html`; constitution at `E:\atlas\website\docs\brand\section-constitution.md`.
