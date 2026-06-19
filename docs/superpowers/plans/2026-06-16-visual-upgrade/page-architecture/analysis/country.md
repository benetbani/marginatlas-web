# Section analysis: Country (e.g. United Kingdom)

## Who is on this page and what they came for

This page is the country-level fork in the road. **P1 (the prospective owner)** lands here to settle a binary before spending another minute: *is this country itself a yes or a no for opening a small business?* They want to know what it costs to set up, what the state takes from what they earn and from every wage, and whether the place is stable and easy enough to operate. **P3 (investor/lender/PE)** and **P4 (advisor/broker)** arrive for like-for-like structural benchmarks across jurisdictions (tax burden, payroll on-cost, formation cost, ease) they can cite. **P5 (SEO arrival)** often hits this page on "is it expensive to start a business in the UK" queries and wants a fast, shareable, true answer. **P2 (buyer)** is the weakest fit here, they need the cell page, not the country. The one question this page must answer: **"What will the state and the system cost me to run a business in this country, and is that a place I can actually operate?"**

## Section-by-section audit

### 0a/0b. Global navbar + breadcrumb / world-map motif band
- **Job (T2):** Orient and let the reader escape to Countries/Industries/Cities/Compare; the lit world-map ties the page to the atlas. All personas.
- **Useful or slop (T1):** Useful chrome, not content. The world-map motif is the one bit that risks decoration-for-its-own-sake, but it earns its keep as wayfinding (you are *here* in the world) and brand signature.
- **Cringe check (T3):** A generic glowing-dot world map is the cringe. Make it specific: the country region rendered in the engraving line-style (matching the hero backdrop), not a stock SVG globe. The terracotta highlight should be the *only* colour in the band.
- **Best visual (T4):** Keep the thin lit-region band. Alternative (a full hero-width map) wastes the most valuable real estate above the fold. The thin band is correct.
- **Redundancy/Depth/Honesty:** No redundancy; honest. Depth is fine for chrome.
- **VERDICT: KEEP.**

### 1. Hero / masthead (country name + the one anchor number)
- **Job (T2):** Name the country, state the one fixed promise of the page, and hand over the single most defensible, like-for-like-safe headline figure. P1/P5 primarily; P3/P4 read the anchor.
- **Useful or slop (T1):** Useful, this is the page's spine. The anchor (19% typical SMB tax burden) is exactly the kind of one-number-that-ranks-safely the site needs. The answer line ("the wage floor and the payroll on-cost, not the headline tax, decide what an owner keeps") is the single best sentence on the page: it reframes the naive question and previews the real story.
- **Cringe check (T3):** Risk: the anchor being *tax* makes the page feel like an accountancy brochure, and tax is the thing the answer line itself says *doesn't* matter most. There is a real tension, the hero leads with the metric the page then de-emphasises. Sharpen by either (a) keeping tax as anchor but making the caption explicitly say "the headline number, and the one that matters least, here is why ↓", turning the tension into a hook, or (b) testing a two-figure hero (tax % beside payroll on-cost %) so the hero already tells the true story. Recommend (a): one anchor, honest tension surfaced.
- **Best visual (T4):** Large Newsreader number over faded engraving is right for a single defensible figure. Do **not** add a chart here. The engraving must stay genuinely faded (current 0.05 opacity is correct) so it reads as texture, not content.
- **Redundancy/Depth/Honesty:** The anchor repeats inside the decisive `dl` (19% appears twice). Spec already de-dups via `anchorPromotedFrom`, hold that line. Honest, like-for-like-safe.
- **VERDICT: KEEP, REFORM the anchor caption** to surface the tension as a hook.

### 2. Scorecard (8 metrics, band-tinted)
- **Job (T2):** A 10-second economic vital-signs panel, how rich, how productive, how big, how easy. All personas; P3/P4 lean on it hardest.
- **Useful or slop (T1):** Useful and the highest information-density beat on the page. The per-cell word read ("Strong"/"Excellent") is what makes it skimmable rather than a number dump.
- **Cringe check (T3):** Two real risks. (1) **The "Strong/Excellent" word reads on price-regime metrics are dangerously close to scoring a country**, which the constitution forbids (cities are the only scored entity). Calling UK GDP/cap "Strong" is defensible as a global-baseline read, but it walks the line. Tighten the framing: the reads must mean "high vs the global baseline of all countries," never "good place to start," and the caption must say so once. (2) **Cost of living = 132 "Above the global baseline of 100" is a non-read**, the reader can't tell if high CoL is good (rich customers) or bad (expensive to operate). Make every neutral metric earn its tile with a *so-what*, not a restated definition.
- **Best visual (T4):** Stat-card grid is correct for 8 independent scalars; a chart would force false comparison between unlike units. Keep. The band-tint wash is a good quiet signal *if* it stays subtle, the current mockup actually drops the tint and only shows pips, which is fine and arguably cleaner. Recommend: keep the pip + word, make the tint barely-there or drop it.
- **Redundancy/Depth/Honesty:** Population repeats in "How far you reach" (68.3M twice). GDP/cap repeats in vs-world. Both are acceptable (different framing) but the page should pick *one* home for population, recommend it lives in reach, not the scorecard, or vice versa. Honesty: the scoring-tone risk above is the one to watch.
- **VERDICT: KEEP, REFORM** the neutral-metric reads (add so-what) and lock the "vs global baseline, never a verdict" framing.

### 3. The country shape: nine lenses (radar in mockup / matrix in newer plan)
- **Job (T2):** A qualitative one-glance character profile across the nine questions an owner runs through. P1/P5.
- **Useful or slop (T1):** This is the section most at risk of being slop. Nine derived 0..1 lenses (two of them admitted SAMPLE) presented as a single shape is **the densest, least decision-grade thing on the page.** A P1 cannot *do* anything with "Edge: Strong." It rewards attention only if it reads as an honest character sketch, not a verdict, and the bar for that is high.
- **Cringe check (T3):** The radar (current mockup) is the cringe incarnate: a nine-spoke polygon reads as a composite *score*, the exact thing the site bans, and "Momentum/Path = SAMPLE" spokes on a polygon look like the shape is literally dented by missing data. The newer page-architecture file is **right to reject the radar.** The discrete nine-row strength matrix (Option 1) is far safer: categorical rungs (weak→excellent), no aggregate, no shape-as-verdict, sample lenses cleanly tagged.
- **Best visual (T4):** Strongly endorse the plan's pivot. Radar = reject. Recommend the **nine-row strength matrix**, but go further: cut the two SAMPLE lenses (Momentum, Path) *out of this card entirely* rather than shipping two of nine rows tagged "sample", a profile that is 22% admitted-placeholder undermines the other seven. A seven-lens honest matrix beats a nine-lens one with two ghosts. Alternative considered: kill the section outright and fold its real content into the scorecard reads (overlap is real). Recommend keep-but-shrink to seven real lenses.
- **Redundancy/Depth/Honesty:** **Heavy overlap with the scorecard** (Reward/Cost/Entry/People largely restate GDP/CoL/days/wages). Honesty: borderline, the matrix framing saves it; the radar does not.
- **VERDICT: REFORM** — drop the radar for the seven-real-lens matrix, remove the two sample lenses, and audit overlap with the scorecard so the two cards say genuinely different things.

### 4. Cost and rules to set up (decisive: stepper + dl + formation table)
- **Job (T2):** The page's heaviest beat, the literal answer to "what will it cost me to set up and operate, and what does the state take." P1 core; P3/P4 cite it.
- **Useful or slop (T1):** The most useful section on the page. Stepper (4 days, $0–$120), the four held figures (tax/payroll/time/sales tax), and the formation-cost-by-legal-tier table are all decision-grade. The sales-tax gloss ("customer carries it, not the owner's burden") is exactly the kind of misconception-correcting depth that builds trust.
- **Cringe check (T3):** The single-station stepper is a fake stepper, one step is not a process, it's a stat. Either make it a real multi-station flow (choose structure → register → register for tax/VAT → first hire obligations) or drop the stepper chrome and present "register and trade" as a lead stat with the days/fee inline. Recommend the real multi-station flow; it's genuinely more useful and stops the chrome from looking like padding.
- **Best visual (T4):** Stepper + `dl` + folded table is a strong, correct stack. The `dl` of four figures with plain-words glosses is the best pattern on the page, replicate that gloss discipline elsewhere. Keep.
- **Redundancy/Depth/Honesty:** Tax % repeats the hero anchor (de-dup already specced). Could deepen with one line of "what these add up to on a worked example" but that risks fabrication, leave the worked example to the cell page and add a down-link (the "what restaurants keep" link already does this well). Honest.
- **VERDICT: KEEP, REFORM the stepper** into a real multi-station setup flow (or demote to an inline lead stat).

### 5. Licences (SAMPLE card / strip chip)
- **Job (T2):** Which activities need a national licence and the rough cost. P1.
- **Useful or slop (T1):** As shipped (a sample placeholder), it is **zero value today** and a small trust tax. The job-to-be-done is real and high-value, but an empty frame doesn't do it.
- **Cringe check (T3):** A "coming soon" card on a commercial product reads as unfinished. The newer plan's choice to make these *individual* visible sample cards is worse than the mockup's single strip, seven labelled empties down the page is the "wall of placeholders" the QA section itself names as the #1 risk. The mockup's single collapse strip is the right call.
- **Best visual (T4):** When held: a calm checklist. Until then: a chip in the collapse strip, not a full card.
- **Redundancy/Depth/Honesty:** Honest (clearly tagged), but thin.
- **VERDICT: MERGE into the single "still filling in" strip** (reject the newer plan's per-card expansion).

### 6. Where the margin leaks (cost-signature, SAMPLE)
- **Job (T2):** Rent vs labour vs tax, which one eats the margin. P1/P3.
- **Useful or slop (T1):** *Job* is one of the most valuable on the whole page, "where does the money actually go" is the question behind the question. But at country level the data isn't held, and a country-wide rent/labour/tax split risks being fabrication. Empty = slop today.
- **Cringe check (T3):** Same placeholder-cringe. Don't show a ghost 3-bar; that teaches the reader to distrust your bars.
- **Best visual (T4):** When held: a 100%-stacked single bar (share of cost) beats three separate bars, it reads as "the whole pie of where money goes" at a glance. Note this as the target visual.
- **Redundancy/Depth/Honesty:** Overlaps the honest-take ("rent takes a bigger bite than tax"), which already delivers this insight in prose. Honesty risk if forced.
- **VERDICT: MERGE into the strip now; promote to a stacked-bar card only when real.** The honest-take line covers the insight in the interim.

### 7. Hire (wage bullets + payroll-vs-neighbours bars)
- **Job (T2):** The cost and difficulty of staff, the largest controllable cost. P1 core; P3/P4 benchmark payroll on-cost.
- **Useful or slop (T1):** Very useful, and the answer line promised this is where the real money is, so it must deliver. The wage-floor / typical-pay / on-cost bullets plus "the floor is rarely the rate you pay" are decision-grade and honest.
- **Cringe check (T3):** The bullets are good but prose-y; the one sharpening move is to lead with the *gap* between floor ($25k) and typical skilled pay ($44k), that 76% spread is the surprising, memorable fact ("the legal floor is a fiction; budget the real rate"). Make the spread the visual hook.
- **Best visual (T4):** The payroll-on-cost `ComparisonBars` (UK/IE/FR/DE/NL, France=100%) is correct and the honesty caveat is well-placed. Consider adding the floor-vs-typical-pay as a small two-point range bar beside the bullets so the "floor is a fiction" point is *seen*, not just read.
- **Redundancy/Depth/Honesty:** Payroll on-cost (14%) repeats in the decisive `dl` and again in the neighbours table, three times total. That's too many; pick the comparison bars as its canonical home and let the table reference it. Honest (caveat present, no league table).
- **VERDICT: KEEP, REFORM** to lead with the floor-vs-typical spread and de-dup the 14% across decisive/hire/neighbours.

### 8. The talent reality (SAMPLE)
- **Job (T2):** Depth and cost of the available skill pool. P1.
- **Useful or slop (T1):** Slop as shipped (empty). The job overlaps "hire" so heavily that even when filled it may not earn a separate beat.
- **Cringe check (T3):** Placeholder cringe + conceptual overlap with hire.
- **Best visual (T4):** N/A until held; if ever held, it belongs *inside* the hire card as one more bullet/figure, not its own section.
- **Redundancy/Depth/Honesty:** Redundant with hire.
- **VERDICT: CUT as a standalone; fold the concept into hire.** Until then, strip chip.

### 9. Who has money to spend (rung read)
- **Job (T2):** Spending power of the local customer, can they pay your price. P1.
- **Useful or slop (T1):** The job is real, but "Comfortable" as a single modeled word with a caption is thin to the point of being almost slop. It tells the reader almost nothing they can act on.
- **Cringe check (T3):** A one-word rung ("Comfortable") with no comparator reads as horoscope-grade vagueness, the cringe is "AI made a vibe." Sharpen by anchoring the rung to a comparator (vs global median, vs neighbours) and a concrete proxy (median disposable income, or net wealth/adult already in the scorecard).
- **Best visual (T4):** A single rung word is the weakest possible viz. Better: a small position-on-a-band (a tick on a low→high spending-power scale with the global median marked), reusing the vs-world grammar. That makes "Comfortable" *located* rather than asserted.
- **Redundancy/Depth/Honesty:** Built from net wealth + pay + CoL, all already on the scorecard, so it's a re-derivation of shown data. Honest but redundant.
- **VERDICT: REFORM into a located band read, or MERGE into the scorecard as a derived "customer spending power" tile.**

### 10. How far you can reach (population big-figure)
- **Job (T2):** Size of the addressable home market. P1/P3.
- **Useful or slop (T1):** Borderline. A single population number set huge is honest but barely a section, the scorecard already shows 68.3M. As built it's one stat dressed as a beat.
- **Cringe check (T3):** Big number + "people, the home market" + "delivery and online reach fill in later" reads as a stat stretched to fill a card. Either give it real depth (urban vs rural split, the share within X of a major city, market concentration) or demote it.
- **Best visual (T4):** A lone big figure doesn't justify a section. If kept, pair population with a reachability nuance (e.g. % of population in the top 10 cities) so it answers "how *concentrated* and reachable" not just "how many."
- **Redundancy/Depth/Honesty:** Directly duplicates the scorecard population tile. Honest.
- **VERDICT: CUT as standalone (duplicate of scorecard), or REFORM into a "market reach & concentration" beat with real added detail.**

### 11. The opportunity gap (SAMPLE)
- **Job (T2):** Where demand outruns the supply of operators. P1/P3, genuinely high-value.
- **Useful or slop (T1):** Empty = slop today; the concept is one of the most monetizable on the site but is trade-level data the country page can't honestly hold.
- **VERDICT: MERGE into the strip; this insight properly lives on the industry/cell pages, not the country page.**

### 12. Same business, here vs abroad (SAMPLE)
- **Job (T2):** Mirror the same trade's economics across borders. P1/P3.
- **Useful or slop (T1):** Empty = slop; and it duplicates the *entire purpose of Compare* (the related CTA already sends here).
- **VERDICT: CUT; its job is Compare's. Replace any value with a stronger link to Compare.**

### 13. Special zones and structures (SAMPLE)
- **Job (T2):** Zones/structures that change the maths (free zones, enterprise zones). P1/P3.
- **Useful or slop (T1):** Empty = slop; self-omits where none exist, which for many countries is *most* of them.
- **VERDICT: MERGE into the strip; render only when a country actually has zones.**

### 14. Versus the neighbours (FACTS table)
- **Job (T2):** Like-for-like jurisdiction benchmark, the page's most load-bearing comparison. P3/P4 core; P1 sanity-check.
- **Useful or slop (T1):** Very useful. Four facts × five countries with the home column tinted (not crowned) is exactly the honest comparator P3/P4 want and the format that resists league-table cringe.
- **Cringe check (T3):** Risk is the reader mentally ranking the columns anyway. The caveat helps but is passive. Sharpen by ordering rows so the *structural story* leads (payroll on-cost first, since the answer line says that's what matters), and consider a per-row tiny inline bar so magnitude is felt without implying a winner.
- **Best visual (T4):** A facts table is correct here, charts would impose ranking. Keep the table; the optional inline magnitude bars are the only enhancement worth testing.
- **Redundancy/Depth/Honesty:** Repeats UK's own four figures from the decisive card (intentional, for comparison). The payroll-on-cost bars (section 7) and this table show the same 14%/IE/FR/DE/NL data twice, consolidate so they don't sit close together saying the same thing. Honest by construction.
- **VERDICT: KEEP, REFORM** row order to lead with payroll, and resolve the payroll-on-cost duplication with section 7.

### 15. The ground under you (factor read, 2 real + 2 sample)
- **Job (T2):** Operating-environment risk, corruption, ease, stability, currency. P1/P3.
- **Useful or slop (T1):** The two real factors (low corruption 71, ease 80) are useful and decision-relevant. The two hatched SAMPLE factors are half a section of admitted nothing.
- **Cringe check (T3):** Two real bars + two hatched "no data" bars in one card reads as a half-built section. **Cut the two sample factors** and ship a clean two-factor read (or fold corruption/ease into the scorecard, since "Ease of business 83" is *already* a scorecard tile, near-duplicate of "Ease of operating 80").
- **Best visual (T4):** Score bars are fine for two real factors. But given the overlap with the scorecard's ease tile, the stronger move is to merge: a small "operating environment" cluster (corruption + ease) rather than a standalone risk section with ghosts.
- **Redundancy/Depth/Honesty:** "Ease of operating 80" ≈ scorecard "Ease of business 83", real redundancy. Honesty: the hatched sample bars are honest but join the placeholder-fatigue problem.
- **VERDICT: REFORM** — drop the two sample factors, and either keep a tight two-factor card or MERGE corruption/ease into the scorecard cluster.

### 16. Cities (uniform equal-weight cards + chip row)
- **Job (T2):** The hand-off to the next decision layer, pick a city to get the local read. P1 core navigation.
- **Useful or slop (T1):** Useful and structurally essential, this is the page's primary forward path. Uniform cards (no ranking, climate dot fixed at 3) correctly honor "a country never scores its own cities."
- **Cringe check (T3):** The uniformity that protects honesty also makes the cards *information-free*, eight identical cards with a meaningless 3-dot climate row is decoration. The cringe is "why show me eight identical boxes." Sharpen by putting *neutral, non-ranking* facts on each card (population, region) so the cards inform without scoring, drop the fake climate dots entirely (3-for-all is a tell that the dot means nothing).
- **Best visual (T4):** A card grid is right for navigation. Remove the climate dots; add one neutral fact (city population) per card so the grid is useful, not just clickable. The duplicate chip row beneath the cards is pure redundancy, cut it; the cards are already the links.
- **Redundancy/Depth/Honesty:** The chip row duplicates the card grid exactly. Honest (no ranking).
- **VERDICT: KEEP, REFORM** — drop the meaningless climate dots and the duplicate chip row; add one neutral fact per card.

### 17. Easiest businesses to break into (ranked activities, link-gated)
- **Job (T2):** Where a newcomer can most readily get a foothold. P1/P5, high pull.
- **Useful or slop (T1):** High-value job, but as shipped it's mostly slop: four of five rows say "Readiness fills in with a local cell," i.e. a ranked list where the ranking is unexplained and the readiness is mostly absent. A list of activity names with no backing read is not decision-grade.
- **Cringe check (T3):** "Cleaning, Hairdressing, Online retail, Cafes, Trades" ranked 1–5 with no visible *why* reads as generic AI listicle. The cringe is "ranked by vibes." Either show the readiness read for every row (requires data) or, if only one row is backed, don't present it as a 1–5 ranking, present the one backed activity as a real read and the rest as a plain "also commonly started here" set.
- **Best visual (T4):** A ranked list implies a defensible order it can't currently support. Better until data exists: a small set of "common low-barrier starts here" chips (no rank numbers) plus the one link-gated readiness read shown in full. Reintroduce ranking only when most rows are backed.
- **Redundancy/Depth/Honesty:** Honesty concern, an unexplained 1–5 rank is the kind of soft ranking the site's discipline frowns on, even though it's within-country (allowed). Make the ranking basis explicit or drop the numbers.
- **VERDICT: REFORM** — drop the rank numbers until most rows carry a real readiness read; show backed activities in full, others as plain chips.

### 18. Character (culture/government spectra + 2 people-stats)
- **Job (T2):** The qualitative "what's it like to deal with business here" texture. P1/P5 (color), weakly P3.
- **Useful or slop (T1):** Borderline-entertaining rather than decision-grade. "Insular↔Welcoming 68%, Erratic↔Predictable 78%" is the kind of thing that rewards a curious P5 and humanises the page, but the precise percentages on subjective spectra are a fabrication-risk and read as false precision.
- **Cringe check (T3):** Slider thumbs at exact percents on subjective axes ("Greased↔Clean-dealing 80%") is the cringe, it dresses opinion as measurement. Sharpen by dropping the numeric position and using a qualitative thumb ("leans direct," "strongly predictable") with a one-line *why* tied to a real proxy (e.g. predictability ← the corruption/ease scores you already hold). The two people-stats (15% born abroad, 6% foreign-owned firms) are the most concrete and should lead.
- **Best visual (T4):** Spectra sliders are a good *format* but only if the position is honestly qualitative. Recommend keep the sliders, remove the false-precision percentages, lead with the two hard stats.
- **Redundancy/Depth/Honesty:** "Clean-dealing 80%" overlaps the ground-risk "low corruption 71" and "predictable" overlaps "ease", tie them together rather than restate. Honesty: the precise percents are the weak point.
- **VERDICT: KEEP, REFORM** — qualitative slider positions (no fake percents), lead with the two hard people-stats, anchor spectra to held proxies.

### 19. What locals know (glyph-led beats)
- **Job (T2):** The insider, non-obvious operating truths the figures miss. P1 core; P5 delights in these.
- **Useful or slop (T1):** Among the *most* useful and least cringe sections on the page, the four UK beats (PAYE is the slow step; rates + service charge add a third to headline rent; small-premises rate relief varies by miles; first hire triggers pension auto-enrolment) are precisely the decision-grade local truth that justifies the whole product. This is the section that proves Margin Atlas isn't a data dump.
- **Cringe check (T3):** The risk is purely scale: these are hand-written UK exemplar beats; every other country gets "calm sample." That's an honesty-clean fallback but means the section is empty for 99% of countries. Invest here, this is the differentiator worth filling first.
- **Best visual (T4):** Glyph + one-line list is perfect, do not over-design it. Resist turning these into charts.
- **Redundancy/Depth/Honesty:** Slight overlap with honest-take (rent > tax appears in both). Honest and exemplar-tagged.
- **VERDICT: KEEP (and prioritise filling it for more countries).** Promote it higher, this is a signature, not a footnote.

### 20. What your life looks like here (SAMPLE)
- **Job (T2):** The felt, day-to-day texture of operating. P1/P5.
- **Useful or slop (T1):** Empty = slop; and "felt bars" on lifestyle is the most fabrication-prone idea on the page.
- **VERDICT: CUT.** The job overlaps "what locals know" (which does it concretely and honestly); felt-bars invite invented numbers. Drop entirely, not even a strip chip.

### 21. Versus the world (ScoreBand, subject bar + global-median tick)
- **Job (T2):** Locate the country against the whole world on one ranked-safe metric. P1/P5 (context); P3 (baseline).
- **Useful or slop (T1):** Useful and the honest way to give a "how rich a market is this" gut-feel, UK $49K vs global median $6.9K is a genuinely surprising, shareable fact.
- **Cringe check (T3):** Small risk it reads as a brag bar. The caveat ("a bigger number means a richer customer, not an easier market") defuses it well, keep that caveat prominent.
- **Best visual (T4):** Subject bar + median tick on a fixed scale is the right, honest grammar (one subject, a peer tick, never two ranked bars). Keep.
- **Redundancy/Depth/Honesty:** Uses GDP/cap again (scorecard, vs-world), acceptable as it's the *contextualising* home for it. Honest.
- **VERDICT: KEEP.**

### 22. The honest take (verdict + ticks)
- **Job (T2):** The site's signature, one plain verdict line plus the structural caveats. All personas; this is the trust beat.
- **Useful or slop (T1):** Among the best sections. "An easy place to start, and a hard place to keep staff cheaply" is the whole page in nine words. The three ticks are decision-grade and honest about downside.
- **Cringe check (T3):** Almost none, this is the anti-slop section. Only risk: it overlaps the answer line (hero) and one-thing (close); make sure the three say *escalating* things, not the same thing thrice.
- **Best visual (T4):** Plain verdict + checked list is correct; no viz needed. Keep small and low as specced.
- **Redundancy/Depth/Honesty:** Overlaps hero answer line + one-thing + locals (rent>tax). Differentiate the three honest beats. Honest by definition.
- **VERDICT: KEEP.**

### 23. One quick gut-check (3 framed questions)
- **Job (T2):** Convert the reader from reading to deciding, three questions that force a self-honest answer. P1 core.
- **Useful or slop (T1):** Useful and on-brand, this is the "customer-first" conscience of the page. The three questions (can the customer pay your price weekly; is there real margin after tax+payroll; have you tested demand before signing a lease) are genuinely the right questions.
- **Cringe check (T3):** Risk: generic-but-true tips around the edge of cringe. They survive because they're specific to *this page's* economics (tax + payroll + lease). Keep them derived from the country's actual cost structure, never boilerplate.
- **Best visual (T4):** Three framed cards is right, low-key, reads as a checklist, not a chart. Keep.
- **Redundancy/Depth/Honesty:** Overlaps honest-take thematically but does a different job (questions vs verdict). Honest.
- **VERDICT: KEEP.**

### 24. One thing to remember (closing line + freshness + flag-it)
- **Job (T2):** The warm last word + the trust furniture (last-checked, coverage, flag-it). All personas.
- **Useful or slop (T1):** Useful as a close; the freshness stamp and flag-it are real trust signals (P3/P4 care about recency). "Cheap to open, expensive to staff, plan around the second hire" is a strong mnemonic.
- **Cringe check (T3):** It nearly repeats the honest-take verdict. Make the one-thing a *forward instruction* ("plan around the second hire") distinct from the honest-take's *diagnosis* ("hard to keep staff cheaply"). They're close enough now to feel doubled.
- **Best visual (T4):** Calm accent panel + meta row is right. Keep.
- **Redundancy/Depth/Honesty:** Overlaps honest-take. Honest, and the freshness/flag-it are valuable.
- **VERDICT: KEEP, REFORM** to a forward instruction distinct from honest-take; keep freshness + flag-it.

### 25. Related countries (Compare CTA)
- **Job (T2):** The monetizable forward path, push into Compare. P1/P3/P4.
- **Useful or slop (T1):** Useful as the page's primary conversion beat. The copy ("set the UK against up to three other countries: revenue, the cost stack, what an owner keeps") is concrete and sells the depth.
- **Cringe check (T3):** Generic CTA risk. It's saved by naming the exact payoff (cost stack + take-home). Keep it specific; never "Explore more."
- **Best visual (T4):** Calm accent panel + one button is correct. This is also where the cut "here vs abroad" section's value should redirect.
- **Redundancy/Depth/Honesty:** Absorbs the "same business here vs abroad" job. Honest.
- **VERDICT: KEEP** (and route the cut here-vs-abroad value into this CTA).

### F. Rich footer
- **Job (T2):** Site-wide navigation + newsletter + legal. All personas.
- **VERDICT: KEEP** (chrome).

## What is MISSING , new sections to ADD

1. **"What an owner actually keeps" — a worked take-home strip.** The whole site's promise is "what you keep," yet the country page shows costs (tax, payroll, rent) but never assembles them into a single take-home read. **Job:** turn the scattered costs into one honest "of every £100 of profit, the state takes ~£19, here's the order of the other bites" waterfall. **Persona:** P1 core, P3. **Visual:** a small waterfall or 100%-stacked bar (profit → tax → payroll burden context → what's left), clearly framed as illustrative/structural, with a hard link to the cell page for the real number. This is the missing keystone the answer line promises.

2. **"The slow start" — survival-runway beat.** P1's deepest fear (stated in the persona brief) is *"can I survive the slow start?"* No section addresses ramp/seasonality/time-to-breakeven. **Job:** set honest expectations on how long until a typical small business stands up here. **Persona:** P1 core, P5. **Visual:** a simple time-to-trade vs time-to-breakeven two-point line, or an honest prose beat if data is thin. Even a qualitative, well-caveated version beats silence on the question the persona explicitly brings.

3. **"How the cost of running here has moved" — a trend/freshness beat.** The page is a static snapshot; P3/P4 and P1 all care whether costs are *rising* (the wage floor "rises most years" is asserted in prose but never shown). **Job:** show direction of travel on the one or two metrics that move (minimum wage trajectory, tax changes). **Persona:** P1, P3. **Visual:** a tiny sparkline on minimum wage / SMB tax over recent years. This also retires the rejected "Momentum" lens honestly, by showing real movement instead of a sample spoke.

4. **A sticky in-page anchor nav / "jump to" rail.** 25 sections is a long scroll; P3/P4 want to jump to "neighbours" or "decisive" directly. **Job:** make a dense page navigable. **Persona:** P3/P4. **Visual:** a slim sticky section-anchor strip under the navbar (the density QA leans on "the sticky nav" but the mockup has none).

5. **"Is this for you?" persona router (optional, top of page).** A one-line "owner? buyer? lender?" chooser that reorders or highlights the relevant beats. **Job:** serve four personas one page without diluting. **Persona:** all. **Visual:** three quiet pills. Lower priority, but it's the clean way to monetize P3/P4 without cluttering P1's read.

## What to CUT or MERGE

- **CUT outright:** *What your life looks like here* (fabrication-prone, overlaps "what locals know"); *Same business here vs abroad* (it's literally Compare's job, route to the CTA); *Talent* (overlaps hire). *How far you reach* and *Who has money* should CUT-or-fold unless given real added depth, both currently re-derive scorecard data.
- **MERGE into the single "still filling in" strip** (and reject the newer plan's seven-separate-sample-cards expansion, it recreates the wall-of-placeholders the QA names as risk #1): Licences, Cost signature, Opportunity gap, Special zones.
- **MERGE the radar's overlap with the scorecard:** the nine-lens shape and the scorecard restate the same metrics, keep the (reformed seven-lens) matrix only if it says something the scorecard doesn't, else cut it.
- **MERGE payroll-on-cost:** it appears in decisive `dl`, the hire comparison bars, and the neighbours table, three times. Pick the comparison bars as canonical; the others reference, not repeat.
- **MERGE ground-risk into the scorecard:** "ease of operating 80" ≈ "ease of business 83"; drop the two sample risk factors entirely.
- **CUT the cities chip row** (exact duplicate of the cities grid) and **the meaningless climate dots** (3-for-all signals nothing).

## The reformed, re-ordered section list (final recommendation)

1. **Global navbar** — chrome/wayfinding.
2. **Breadcrumb + lit world-map band** — orientation + brand signature; engraving-style region, single accent.
3. **Sticky section-anchor rail** *(new)* — make 25→~18 sections navigable for P3/P4; slim jump-to strip.
4. **Hero / masthead** — country name + the one anchor number, with the caption surfacing the tax-vs-real-cost tension as a hook. The focal point.
5. **Scorecard (8 metrics)** — economic vital signs; stat-card grid, pip+word reads framed "vs global baseline, never a verdict," every neutral tile earns a so-what.
6. **The country shape (seven real lenses)** — discrete strength matrix (radar rejected), sample lenses removed, de-duped against the scorecard. Keep only if it adds beyond the scorecard.
7. *Divider: Reward & cost.*
8. **Cost and rules to set up (decisive)** — the heaviest beat; real multi-station stepper + the four-figure `dl` + formation-cost table. The page's spine.
9. **What an owner actually keeps** *(new)* — the take-home waterfall/stacked bar the answer line promises; links to the cell for the live number.
10. *Divider: People.*
11. **Hire & the cost of a team** — lead with the floor-vs-typical-pay spread (range bar) + payroll-on-cost comparison bars (the canonical home for the 14%); talent folded in.
12. *Divider: Demand.*
13. **The market you can reach** *(reformed, merged)* — population + concentration (share in top cities) + spending-power located on a band; absorbs "who has money" and "how far you reach" into one real beat (or cut if it stays thin).
14. *Divider: Comparison & edge.*
15. **Versus the neighbours** — facts table, home column tinted not crowned, rows reordered to lead with payroll, optional inline magnitude bars; the load-bearing comparison.
16. *Divider: Risk.*
17. **The ground under you** *(reformed)* — corruption + ease only (sample factors cut), or merged into the scorecard cluster.
18. **How costs have moved** *(new)* — minimum-wage / tax sparkline; the honest replacement for the rejected "Momentum" lens.
19. *Divider: The place.*
20. **Cities** — uniform cards (no ranking) + one neutral fact each; climate dots and the duplicate chip row cut. The primary forward path.
21. **Easiest to break into** *(reformed)* — backed activities shown in full with readiness; unbacked ones as plain "also commonly started here" chips; rank numbers dropped until data supports them.
22. **Character** — qualitative spectra (no false-precision percents), led by the two hard people-stats, anchored to held proxies.
23. **What locals know** — promoted; the signature insider beats; glyph list, fill for more countries first.
24. **Still filling in** — the single calm strip absorbing licences / cost-signature / opportunity / special-zones (NOT seven separate sample cards).
25. *Divider: The close.*
26. **The slow start** *(new, if data/honesty allows)* — survival-runway expectations; answers P1's explicit fear.
27. **Versus the world** — subject bar + global-median tick; the honest "how rich a market" context.
28. **The honest take** — the trust verdict + escalating ticks; small and low.
29. **One quick gut-check** — three questions derived from this country's cost structure.
30. **One thing to remember** — a *forward instruction* (distinct from the honest-take diagnosis) + freshness stamp + flag-it.
31. **Related / Compare CTA** — the monetizable forward path; absorbs the cut "here vs abroad" value.
32. **Rich footer** — chrome.

Net effect: from 25 content sections (7 of them empty samples plus several duplicates) down to ~22 beats where **every** one is either real, honestly-modeled-and-framed, or a single calm "coming soon" strip, with three new sections (take-home, slow start, cost-trend) that answer questions the current page leaves on the table, and the radar, the wall of sample cards, the duplicate population/payroll/ease reads, and the fabrication-prone "your life" / false-precision spectra removed.
