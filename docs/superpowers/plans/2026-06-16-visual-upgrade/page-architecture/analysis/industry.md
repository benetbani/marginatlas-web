# Section analysis: Industry / activity (a trade, no place picked)

## Who is on this page and what they came for

This is the **top-of-funnel decision page**: someone has a trade in mind but no location yet. The dominant arrivals are **P5 (the SEO/curious searcher)** typing "how much does a restaurant make" or "are restaurants profitable," and **P1 (the prospective owner)** in the earliest dreaming-not-deciding phase ("I want to open a cafe someday, is this a money trap?"). **P3/P4** (analysts, advisors) use it as a fast structural primer before they drill into a specific market. **P2 (the buyer)** is least served here because valuation needs a real place and real revenue, not a place-stable model.

The single question this page must answer: **"How does this kind of business actually make money, and how little of each sale survives to me?"** It is a *cost-shape* page, not a *dollars* page. Its job is to leave one mental model in the reader's head (the sale shrinks as it flows) and one action in their hand (pick a place to make it real). Everything that does not serve "teach the shape, then convert to a place" is suspect.

## Section-by-section audit

### 0. Global chrome — top navbar
- **Job (T2):** Orient and let any persona jump to Countries/Industries/Cities/Compare or search; carry the primary CTA. Serves all personas.
- **Useful or slop (T1):** Useful, non-negotiable chrome. In the current mockup it is under-built versus spec (a flat 4-link `nav` with "Get the data," no dropdowns, no search). For a page whose entire conversion mechanic is "navigate to a place," the search box is not decoration, it is the second-most-important control after the place picker.
- **Cringe check (T3):** "Get the data" is a generic SaaS CTA that misreads the page intent: this visitor wants an *answer*, not a dataset. Risk is reading like a B2B data vendor. Sharpen the CTA to the actual job ("Find your city" / "Price my market") or drop it from this page's navbar entirely so the in-hero place picker is the only call.
- **Best visual (T4):** Sticky blurred bar is correct. Add the real search affordance (typeahead over trades + places) — on a no-place page, search IS the place picker's twin.
- **Redundancy/Depth/Honesty:** No redundancy. Honest. Depth fine.
- **VERDICT: KEEP** (reform: build the spec'd dropdowns + search; retarget or remove the "Get the data" CTA so it matches searcher intent).

### 1. Hero — verdict model read
- **Job (T2):** In one screen, deliver the opinionated verdict + one honest anchor number + the place picker. This is THE page; it serves P5 (satisfying answer) and P1 (decision frame + next step).
- **Useful or slop (T1):** Essential and well-built. The verdict thesis ("Restaurants run on volume, and almost none of it survives the kitchen.") is genuinely good — opinionated, specific, no number, memorable. The RangeStrip with the typical tick at a true 30.9% (not centered) is an honesty signal most sites fake.
- **Cringe check (T3):** Two real risks. (1) The "$1.0M typical revenue" anchor invites the exact wrong takeaway from a margin-poor page — a dreamer reads "a million dollars" and hears success, when the page's whole thesis is "almost none survives." The revenue number and the "keeps 7¢" caption fight each other. Consider leading the eye with the *kept* figure even on rich trades, or visually pairing $1.0M with $7-kept so the anchor can never be misread as the prize. (2) "across the US markets we measure" is honest but slightly corporate; keep it, it is load-bearing.
- **Best visual (T4):** Quiet Newsreader H1 + one display number + RangeStrip + stat tiles + picker is the right pattern. The strongest possible upgrade: a tiny inline "$100 → $7" micro-glyph beside the anchor so the shrink is felt in the hero, not deferred to section 7. Debated alternative (big gauge/donut for margin) — rejected, brand bans pies and a gauge would over-dramatize a single ratio.
- **Redundancy/Depth/Honesty:** The three stat tiles (net margin 7%, survives direct 65%, take-home $32K–$190K) pre-state sections 3/4/7 — mild redundancy, but acceptable as a "headline then detail" pattern. Honesty is the page's best feature here (no tier chip, no London fill, real geometry).
- **VERDICT: KEEP** (reform: defuse the revenue-anchor misread by binding the $1.0M and the 7¢-kept into one visual unit so the shrink is unmissable on screen one).

### 2. The honest take
- **Job (T2):** The "what they won't tell you" gut-check before you commit. Pure P1, with P5 appeal (shareable truth).
- **Useful or slop (T1):** Useful and on-brand — this is the section that makes the page feel *honest* rather than promotional. "Rent does not care how many covers you served" is the kind of line that earns attention (passes T1's "rewards attention" arm even where it doesn't change a decision).
- **Cringe check (T3):** Risk is genericness on thin trades ("be careful, margins are tight" applies to everything). The fix is that every honest-take must name the *specific* failure mode of THIS trade (food waste, the rota, the lease) — the restaurant copy does this; the template must enforce trade-specific watch-outs, never platitudes. When unheld it must collapse, never emit a generic warning.
- **Best visual (T4):** A calm serif accent panel (no chart) is exactly right — this is a quiet text moment between two data blocks, and its quietness is the design.
- **Redundancy/Depth/Honesty:** Slight thematic overlap with the one-thing close (both are editorial verdicts). Distinct enough: honest-take = watch-outs up front, one-thing = the parting mantra. Honest.
- **VERDICT: KEEP** (reform: enforce trade-specific watch-outs in the data contract; ban generic risk copy).

### 3. How it makes money (model anatomy / flow diagram)
- **Job (T2):** Teach the cost *shape* — the distinctive promise of the whole page. Core P5 (the satisfying "oh, that's how") and P1 (the mental model).
- **Useful or slop (T1):** This is the page's reason to exist. BUT there is a critical execution gap: the architecture doc commits a **flow-of-money diagram** ($100 → $65 → $19 → $7, money visibly shrinking node to node) and flags it as the single most important, most-room section. The actual mockup ships a **2×2 grid of qualitative signal words** (Light / High / Light / Thin) — the *old locked spec*, NOT the founder's ratified override. As built, it is the weakest of the four data sections, not the strongest: "Light / High / Light / Thin" is abstract, the four cards read as a generic feature grid, and Stage 3 (Capital = "Light") sits awkwardly mid-flow because capital is not a sale-flow stage.
- **Cringe check (T3):** The signal-word grid is the most "AI-made-that" thing on the page — four uniform cards with one adjective each. The flow diagram is the de-cringe: money you can *watch* shrink is concrete and surprising; adjectives are not.
- **Best visual (T4):** The **flow diagram wins decisively.** It is the only visual that shows *motion/causation* (the sale getting smaller as it passes through stages), which is precisely the mental model the page sells. Alternatives: signal-word grid (current — too abstract, cut); Sankey (too data-viz-heavy for a non-expert, and overkill for 4 stages). Pick: a coded left-to-right flow with shrinking connectors, mobile-stacked top-to-bottom.
- **Redundancy/Depth/Honesty:** As-is, the signal-word grid risks redundancy with the per-$100 bar and cost-drivers (all "what eats the money"). The flow diagram differentiates by being the *narrative* version. Honest (qualitative tone-coloring, no fabricated numbers).
- **VERDICT: REFORM** (replace the shipped signal-word grid with the ratified flow-of-money diagram; drop "Capital to start" out of the sale-flow sequence and relocate it to the typical-operator facts where it belongs — capital is a starting condition, not a stage the sale flows through).

### 4. Where the money goes (per $100)
- **Job (T2):** The single clearest "where does it all go" picture. P5 (shareable), P1 (concrete), P3/P4 (the structural split).
- **Useful or slop (T1):** High-value. The 100-unit bar with the kept slice in moss is the most screenshot-able object on the page and the clearest single answer to the implicit question.
- **Cringe check (T3):** Low cringe risk. One refinement: in the mockup, two of five segments (Rent $12, Everything else $13) carry no in-bar label and rely on the legend — at a glance the bar reads as three blocks. Direct-label at least the kept slice prominently and consider labeling all segments above a width threshold.
- **Best visual (T4):** 100-unit horizontal stacked bar is the correct, brand-legal pick (never a pie). The kept slice should be visually *isolated* (a gap or heavier border) so "this sliver is yours" lands instantly — right now $7 of moss just sits at the end of a cocoa run.
- **Redundancy/Depth/Honesty (T5/T6/T7):** **This is the page's biggest redundancy problem.** Per-$100 (section 4), the margin/cost-stack (section 7), and cost-drivers (section 8) are *the same canonical split shown three times* — as a bar, as a waterfall, and as ranked levers. That is by design (one source of truth) but from the customer's seat it can read as padding. Depth is good (place-stable framing). Honest.
- **VERDICT: KEEP** (reform: isolate the kept slice; label all visible segments. This is the canonical split's best single view — keep it as the hero of the "money" trio and make the other two earn their place against it; see Cut/Merge).

### 5. A typical operator (plain terms)
- **Job (T2):** Translate the model into plain "what this means for me" facts. P1 primarily.
- **Useful or slop (T1):** Borderline. As built it is the **thinnest section on the page** — four rows, two of which (survives 65%, reaches owner 7¢) are *verbatim repeats* of the hero tiles and the per-$100/waterfall. Only "Still open after one year, 80 in 100" and "Capital, Light" add anything new. A page whose hero already shows net margin, survives-direct, and take-home does not need a section to restate two of them as a list.
- **Cringe check (T3):** Risk: it reads as a recap, which feels like filler. The fix is to make it the home of facts that appear *nowhere else*: first-year survival, capital to start, time-to-breakeven, how seasonal the cashflow is, how owner-dependent the model is. Loaded with genuinely new structural facts, it becomes the "can I survive the slow start?" answer P1 explicitly came for.
- **Best visual (T4):** Plain term/value rows (no chart) is right — these are heterogeneous facts, not a comparable series. Keep dl rows.
- **Redundancy/Depth/Honesty (T5/T6/T7):** Heavy redundancy with hero tiles as currently filled. Shallow. Honest (no fabricated headcount — good restraint).
- **VERDICT: REFORM** (strip the two duplicated rows; repopulate with non-redundant survival facts: first-year survival, capital to start, time-to-breakeven, seasonality, owner-dependence. This is where the page should answer P1's "can I survive the slow start?" — currently it doesn't).

### 6. Where it earns most (US states, ranked bars)
- **Job (T2):** The one legitimate geography comparison — where does this trade take home most, like-for-like. P1 (where to look), P3/P4 (benchmark), P5 (interesting).
- **Useful or slop (T1):** Genuinely useful and the page's strongest bridge to conversion (every row is a doorway to a cell page). The after-tax take-home ordering is the right metric (not revenue, not margin — what the owner *keeps*).
- **Cringe check (T3):** Low. The honesty rail ("one currency, one tax system, so we do not rank across borders") is load-bearing and should stay verbatim — it is also a quiet credibility flex. One risk: only 6 states shown; a curious reader wants "where does my state rank?" — add a "see all states" expansion or a find-my-state control.
- **Best visual (T4):** Ranked horizontal bars (leaderboard shape) is correct and deliberately distinct from the per-$100 bar. Debated alternative: a US choropleth map — tempting and on-brand (world-map motif), BUT a map hides the precise ordering and exact take-home values that P1/P3 need, and color-encoding dollars is less legible than length. Pick: ranked bars as primary; a small map could be a secondary "at a glance" companion only if it never replaces the ranking.
- **Redundancy/Depth/Honesty (T5/T6/T7):** No redundancy. Good depth (real data, GATE-id). Honesty is exemplary and non-negotiable.
- **VERDICT: KEEP** (reform: add find-my-state / see-all-states so the reader can locate their own market; consider a quiet companion map but never instead of the bars).

### 7. The cost stack, cut by cut (waterfall / table)
- **Job (T2):** The deepest read — gross → operating → net, the gap is the punchline. P3/P4 (the real margin walk), P1 (the sobering truth).
- **Useful or slop (T1):** Useful for the analytical personas, but here is the **central tension of the page**: the architecture doc's ratified override says this should be a **TABLE** (stage / takes / survives / % of revenue), explicitly NOT a waterfall. The mockup ships a **vertical waterfall** (the old locked spec). And the waterfall is showing *the same canonical split* as the per-$100 bar in section 4 and the flow diagram in section 3. So the page risks three views of one number.
- **Cringe check (T3):** Three-bars-in-a-row "bar soup" is the named QA risk, and as built the page flirts with it: per-$100 bar (§4), waterfall bars (§7), where-it-earns bars (§6). The waterfall and the flow diagram (§3) are especially close conceptually (both narrate the shrink). The de-cringe is to make these two clearly different jobs: flow diagram = the *intuitive story* (for P5/P1), the cut-by-cut = the *precise accounting* (for P3/P4) — and a TABLE reads as "accounting" far better than a second set of bars.
- **Best visual (T4):** **The table wins** (aligning with the ratified override). A waterfall is beautiful but it is the third bar-shape on the page and it duplicates the flow diagram's narrative. A table (gross/operating/net, with % of revenue) is shape-distinct from every other section, signals "precise figures" to analysts, and the gross-vs-net gap can still be the punch line in the caption. Keep ONE bar-based shrink visual (the flow diagram) and make the cut-by-cut the rigorous table.
- **Redundancy/Depth/Honesty (T5/T6/T7):** Redundant with §3 and §4 as currently a third bar view. Deepest data on the page. Honest.
- **VERDICT: REFORM** (convert the shipped waterfall to the ratified table; let the flow diagram own the *story* of the shrink and the table own the *precise* margin walk — that division kills the bar-soup risk and gives each a distinct persona).

### 8. What moves the cost (cost-driver levers)
- **Job (T2):** "What can I actually control" — the largest non-kept lines as levers. P1 (operating focus).
- **Useful or slop (T1):** **Weakest section on the page.** It openly admits "No new numbers" — it is the per-$100 cost lines (§4) re-sorted into ranked bars. From the customer's seat: a fourth view of the same four numbers, now as a *fourth* bar shape. The "all pointing down" framing adds a connotation, not information.
- **Cringe check (T3):** High cringe risk — this is the most padding-like section. "The levers that decide the margin" sounds actionable but delivers a re-rank of CoGS $35 / Payroll $33 / etc. that the reader already saw in the per-$100 bar two sections up. It reads as section-count inflation toward the "almanac density" target.
- **Best visual (T4):** If kept, the only justification is to add *real lever information* the per-$100 bar lacks: how much each line *varies* operator-to-operator (which lever is actually controllable vs fixed), or a typical good-vs-bad operator spread per line. Bars alone, re-sorted, are not enough. Best visual for "controllability" would be a range-per-lever (a small spread bar showing how much room each line has), which is genuinely new.
- **Redundancy/Depth/Honesty (T5/T6/T7):** **Maximally redundant** with §4 — same numbers, by the doc's own admission. Thin. Honest (almost too honest — it tells you it has nothing new).
- **VERDICT: MERGE into §4** (fold "what moves the cost" into the per-$100 section as a one-line "the two biggest levers are food and labor at $68 of every $100" call-out, OR REFORM it into a genuinely new "how much each lever varies" spread. As a standalone re-ranked bar of identical numbers, it should be CUT).

### 9. Go deeper (related activities)
- **Job (T2):** Lateral navigation to sibling trades; a taxonomy rail. P5 (browse), P1 (compare adjacent ideas).
- **Useful or slop (T1):** Useful as navigation/SEO and as a graceful exit. Low risk because it is honest about being a *family*, not a *ranking*.
- **Cringe check (T3):** Low. The "not a league table, none beats another" caveat is the right honesty guard. Risk would be if tiles implied ranking by order — keep them visually uniform (they are).
- **Best visual (T4):** Uniform tile grid with pictograms is correct. Alternatives (a taxonomy tree) over-engineer a simple "here are the cousins."
- **Redundancy/Depth/Honesty (T5/T6/T7):** No redundancy. Light but appropriately so (it is a hand-off, not a data section). Honest.
- **VERDICT: KEEP** (no change; ensure pictograms are real per-trade glyphs, not the restaurant glyph reused).

### 10. One thing to remember
- **Job (T2):** The parting mantra — the page exhales on one line. P5 (shareable), P1 (the thing they remember).
- **Useful or slop (T1):** Useful as rhythm and memorability. "The operators who fail treat a workable margin as a forgiving one" is a strong, specific close that rewards attention (passes T1's entertainment arm).
- **Cringe check (T3):** Risk is overlap with honest-take and the verdict thesis — three editorial lines can blur. Keep this one as the *forward-looking caution* (what trips operators), distinct from honest-take (current watch-outs) and the thesis (the model read). The `lastChecked` date here is a quiet, real credibility signal.
- **Best visual (T4):** Single serif line, max air — correct. No alternative needed.
- **Redundancy/Depth/Honesty:** Mild editorial overlap (manageable). Honest.
- **VERDICT: KEEP** (ensure it is forward-looking and distinct from the thesis and honest-take so the three editorial moments don't echo).

### 11. Global chrome — rich footer
- **Job (T2):** Site-wide link columns, newsletter, legal. All personas.
- **Useful or slop (T1):** Standard chrome; the mockup ships a thin single-paragraph footer, not the spec'd multi-column `footer7`. For SEO and cross-navigation the rich version matters.
- **VERDICT: KEEP** (reform: build the spec'd multi-column footer; the mockup's thin footer is a placeholder).

### Mockup-only honesty demonstrations (collapse strip + thin-trade variant)
- **Job (T2):** Prove the template degrades gracefully on thin trades without faking data — for the founder's review, not the live page.
- **Verdict:** **KEEP in the mockup only** (correctly scoped). These are the single best argument that the honesty system is real; they should never ship as live page sections but must remain in the design artifact.

## What is MISSING — new sections to ADD

1. **"Could I survive the slow start?" — the ramp/runway read.** P1's most acute fear is the slow opening months, and the page never addresses time. *Job:* show how long until a typical operator breaks even and how lumpy the cashflow is. *Persona:* P1 (core). *Best visual:* a simple ramp line (months to breakeven) or a 3-tier "lean months → steady → mature" strip. This is the single biggest gap for the core persona — the page teaches the *steady-state* shape but says nothing about *getting there alive*.

2. **"What you need to bring" — capital + skill to start.** The page mentions capital only as the word "Light" buried in a signal card. *Job:* state typical startup capital band, and how skill/owner-dependent the trade is. *Persona:* P1 (the go/no-go gate), P2 (build-vs-buy). *Best visual:* a short PlainTerms block (fold into the reformed §5 typical-operator).

3. **"How this trade compares to its cousins" — a structural compare, honestly framed.** Sibling tiles (§9) only link out; they never let you *compare* the shape. *Job:* show, for the family of sibling trades, the kept-per-$100 side by side (NOT a ranking, NOT cross-geography — a like-for-like structural fact). *Persona:* P1 (deciding between adjacent ideas), P5 (interesting). *Best visual:* small multiples of the kept-slice across siblings, with an explicit "this is structure, not a league table" rail. (Carefully bounded by the no-cross-business-ranking rule — framed as "the cousins make money differently," never "X is better.")

4. **"Where this number comes from" — a methodology/confidence note.** P3/P4 (and skeptical P1) need to trust the figures before they cite them. The page has no "how we know" anywhere. *Job:* one calm line on what the model is built from and how current it is, without naming source agencies. *Persona:* P3/P4 (citability), trust for all. *Best visual:* a quiet expandable note near the cut-by-cut table or footer. (The `lastChecked` date is a start; this extends it.)

5. **A defused "what good vs bad looks like" spread.** The page shows *the typical* operator but not the *range* of outcomes. *Job:* show how wide the gap is between a struggling and a thriving operator of the same trade (kept-per-$100 low vs high). *Persona:* P1 (is the upside worth it?), P2 (what am I buying). *Best visual:* a spread bar (the same RangeStrip primitive reused) for *margin*, not revenue. This is also the natural home for the reformed cost-drivers idea (which lines vary most).

## What to CUT or MERGE

- **CUT/MERGE §8 "What moves the cost"** into §4. By its own admission it adds no new numbers — it is the per-$100 split re-sorted into a fourth bar shape. As a standalone section it is section-count inflation that worsens the bar-soup risk. Either fold its insight into a one-line call-out under the per-$100 bar, or rebuild it into the genuinely-new "how much each lever varies" spread (point 5 above) — but do not keep it as identical numbers re-ranked.
- **REFORM (do not cut) the §3 / §4 / §7 trio so they stop being one number shown thrice.** Assign each a distinct job and shape: §3 flow diagram = the *story* of the shrink (P5/P1); §4 per-$100 bar = the *single clearest snapshot* (everyone); §7 table = the *precise accounting* (P3/P4). Three shapes, three jobs, three personas — that is the cure for bar soup, and it is exactly what the ratified overrides already call for but the mockup hasn't implemented.
- **TRIM §5 typical-operator's duplicated rows** (survives 65%, reaches owner 7¢ already appear in the hero). Replace with net-new survival facts, or the section is a recap.
- **WATCH the three editorial moments** (thesis, honest-take §2, one-thing §10). None should be cut, but they must be differentiated (model read / current watch-outs / forward caution) or they read as the same voice three times.

## The reformed, re-ordered section list (final recommendation)

1. **Navbar** (chrome) — orient + search + a *job-matched* CTA ("Find your city," not "Get the data"). *Sticky blurred bar with real dropdowns + search.*
2. **Hero — verdict + honest anchor + place picker** — the page in one screen; bind the revenue anchor to the kept figure so the shrink can't be misread. *Quiet Newsreader H1 + one display number + RangeStrip + stat tiles + place picker.*
3. **The honest take** — trade-specific watch-outs before you commit; ban generic risk copy. *Calm serif accent panel, no chart.*
4. **How it makes money (flow of a sale)** — THE distinctive section; the sale visibly shrinks $100→$65→$19→$7. *Flow-of-money diagram (replaces the signal-word grid); capital removed from the flow.*
5. **Where the money goes (per $100)** — the single clearest snapshot; isolate the kept slice; absorb the cost-driver call-out. *100-unit horizontal stacked bar, kept slice visually isolated; one-line "biggest levers" note folded in.*
6. **The margin, cut by cut** — the precise accounting walk for analysts; the gross-to-net gap is the punch. *Table (gross/operating/net, % of revenue) — replaces the waterfall to kill bar soup.*
7. **A typical operator + what it takes to start** — *net-new* survival facts only; the "can I survive the slow start?" answer. *PlainTerms rows: first-year survival, capital to start, time-to-breakeven, seasonality, owner-dependence.* (NEW capital/ramp content merged in.)
8. **The spread — good vs bad operator** (NEW) — how wide the outcome gap is, and which lever drives it; rehouses the cost-drivers idea as something genuinely new. *Spread bar on kept-per-$100 (RangeStrip primitive reused), margin not revenue.*
9. **Where it earns most (US states)** — the one legitimate geography rank + conversion doorways; add find-my-state. *Ranked horizontal bars, US states only, after-tax take-home, honesty rail verbatim; optional companion map, never instead of bars.*
10. **How the cousins compare** (NEW, optional) — structural side-by-side of sibling trades, explicitly not a ranking. *Small multiples of the kept slice across siblings + "structure, not a league table" rail.*
11. **Go deeper (related activities)** — lateral/SEO hand-off; real per-trade glyphs. *Uniform sibling-tile grid.*
12. **Where this comes from** (NEW) — quiet methodology/confidence note for citability; extends `lastChecked`. *Small expandable note, no source-agency names.*
13. **One thing to remember** — forward-looking caution, distinct from the thesis and honest-take; the page exhales. *Single serif line, max air, lastChecked.*
14. **Footer** (chrome) — build the spec'd multi-column footer. *footer7 multi-column.*

The net move: keep the strong honest spine, **fix the §3/§7 visuals to match the founder's ratified overrides (flow diagram + table) — the mockup currently ships the superseded signal-word grid and waterfall**, dissolve the redundant cost-drivers section, repurpose the recap-heavy typical-operator into the missing "can I survive the start?" answer, and add the structural-compare / good-vs-bad / methodology pieces that the monetizable personas (P1 depth, P2, P3/P4) actually need.

Key source files (absolute): the page architecture `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\page-architecture\industry.md`, the locked spec `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\07-industry.md`, and the live exemplar mockup `E:\atlas\industry-restaurants.html` (which still renders the pre-override signal-word grid + waterfall, not the ratified flow diagram + table).
