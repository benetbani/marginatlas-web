# Country page , architecture guidance

## Who is here, and the decision they make
Three readers dominate. The **prospective founder or expat** ("could I run my small business in this country?") wants to know if the place is a yes or a no before drilling into a city or a trade. The **operator expanding across borders** ("is the UK cheaper to staff and faster to open than Germany?") wants a like-for-like read against neighbours. The **analyst, journalist, or curious browser** (P3/P4) wants to skim the country's economic shape and follow a link to the thing they actually care about. All three are asking one question: *what does it cost, what do I keep, and how hard is it here.*

## The page's one job
Tell a reader, in one calm scroll, whether this country is a viable place to start and run a small business, and hand them off to the city or trade where they will find the real number.

## The hero
**Full-bleed place image, restored.** A real photograph of the country (London rooftops / Westminster skyline for the UK exemplar) runs edge to edge as the masthead background, darkened with a warm `ink-900`-to-transparent gradient scrim (top-left anchored) so white text clears WCAG AA. The faded graticule world-map motif and the lit terracotta locator pin sit *on top* of the photo at low opacity (texture, never foreground; it never encodes a value). This is the #1 fix: the current build ships a graticule-only engraving with no image, which reads flat and generic. Shadcnblocks base: `hero` block (image-background variant), re-skinned to tokens.

Over the image, left-aligned: flag chip + eyebrow ("Small-business economics, United Kingdom"), the country name in Newsreader (the one serif moment), the fixed subtitle, and the answer line. Then the **8-metric at-a-glance scorecard** rides directly in the hero band as a horizontal strip of tiles (frosted `cream-50`/.9 over the image bottom), each carrying its calibrated read. The recovered 8, with ratings:

| # | Metric | Value | Rating / read |
|---|--------|-------|---------------|
| 1 | **GDP per capita** | $49K | **Strong** (moss) , deep enough wallet that price, not affordability, is the question |
| 2 | **Average salary** | $44K | **Strong** (moss) , sets what skilled staff expect, well over the floor |
| 3 | **Net wealth / adult** | $172K | **Excellent** (moss-700) , customers can spend through a slow patch |
| 4 | **Days to start** | 4 | **Strong** (moss) , paperwork is quick; the lease and first hire are the real start line |
| 5 | **Ease of business** | 83/100 | **Strong** (moss) , day-to-day admin rarely blocks a one-person shop |
| 6 | **Minimum wage** | $25K/yr | **neutral** (cocoa) , set by law, rises most years |
| 7 | **Population** | 68.3M | **neutral** (cocoa) , the home market, large before any online reach |
| 8 | **Cost of living** | 78/100 | **Fair** (amber-leaning) , a pricier place to live, which feeds wage demands |

**The 1 to 2 that LEAD:** the single biggest hero number stays the **typical small-business tax burden (19%)** seated beside the country name as the one anchor figure (it is the defensible, cross-geography-safe answer; raw money cannot rank across borders). Within the scorecard strip itself, **Net wealth/adult (Excellent)** and **Days to start (Strong)** lead by size, because together they answer "can customers pay" and "can I get going" , the two things the hero must settle in three seconds. The other six are supporting tiles at a smaller step.

> Honesty rail: every neutral tile (population, min wage, cost of living) is framed "against the global baseline, never a verdict." A country never scores its own cities; the scorecard reads vital signs, not a grade.

## The metric-rating system on this page
Good/bad is signalled **three coordinated ways, never by color alone** (WCAG): (1) a one-word read , **weak / fair / strong / excellent** , in the tile; (2) a small directional glyph (up / level) before that word; (3) a quiet per-tile background band-tint on a single **clay to cocoa to moss** meaning scale, very low opacity. Neutral metrics (population, min wage, cost of living-as-a-fact) carry **no rung color** , just a cocoa "level / baseline" read , so the reader is never tricked into thinking "big population = good."

The **4-level pip / segmented meter is BANNED site-wide (L6)**. Where a *rated quality* appears (the country-shape lenses, character, ground risk), it uses the **L5 gradient spectrum** (gray-bad left to moss-good right, atlas marker at the true position), not pips. The scorecard's word+glyph+tint is the only "rating" that is not a spectrum, because it labels a snapshot value, not a quality on a continuum.

**Decisive vs supporting hierarchy across the whole page:** the *decisive* beats , the hero anchor (tax), the scorecard's two lead tiles, the **cost-and-rules-to-set-up** block, and **hire/payroll** , get full `--shadow-card`, larger type, and front placement. Supporting beats (market reach, ground risk, break-in, character) get lighter shadow and a smaller step. Nothing is equal-weight; the page must read as authored, with a clear spine of "what it costs, what you keep, how hard."

## The full section list (LONG, in order)
Global chrome wraps everything: the full **navbar** (`navbar1`: logo + Countries/Industries/Cities/Compare dropdowns + search + one dark CTA) and the rich **footer** (`footer7`). A sticky **section-anchor rail** sits under the hero so the long page is navigable. The body is grouped into seven movements: **The answer**, **The shape**, **Cost and keep**, **People**, **The market and the field**, **Place and character**, **The close**.

---

### 1. Hero / masthead + 8-metric scorecard
- Role: settle viability in three seconds , the place, the one anchor number, the at-a-glance vital signs.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , it is the only place the 8 calibrated reads live and the one full-bleed brand moment.
- Shows: country name, flag, anchor (19% tax), the 8 scorecard metrics with ratings.
- Visual: full-bleed place photo + warm scrim + faint map motif; Newsreader country name + anchor; frosted scorecard strip (`stats-card1` re-skinned) with word+glyph+tint reads, two lead tiles enlarged. **Movement: The answer.**

### 2. Sticky section-anchor rail
- Role: make a long page navigable for skimmers; jump-to spine.
- Sanity verdict: **SUPPORTING.** Not pathetic: a long almanac page needs wayfinding or P3/P4 bounce.
- Shows: At a glance / Country shape / Cost to set up / What you keep / Hire / Market / Vs neighbours / Cost trend / Cities / Easiest / Locals / Honest take.
- Visual: thin sticky cream-75 blurred bar, hairline bottom, active-section highlight in atlas. **Movement: The answer.**

### 3. The country shape (seven structural lenses)
- Role: one qualitative character read of the whole economy, de-duped against the scorecard, so the reader gets the "feel" before the mechanics.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes only because it is a *profile, never a score* (radar rejected; an aggregate would imply a verdict and cities are the only scored entity).
- Shows: seven lenses , Reward, Cost to run, Ease of entry, People, Demand, Edge, Risk , each with a one-word read and a one-line why.
- Visual: **L5 gradient-spectrum rows** (gray-bad to moss-good, atlas marker), one row per lens, the single best lens (Demand, Excellent) carrying the lone accent. NOT pips. Distinct from every card grid: it is a stacked spectrum stack. **Movement: The shape.**

### 4. Cost and rules to set up (THE decisive beat)
- Role: the spine , what it actually costs and takes to register and start trading. This is why most readers came.
- Sanity verdict: **ESSENTIAL (heaviest card on the page).** Pathetic check: passes overwhelmingly , it changes the start decision directly.
- Shows: a register-and-trade stepper (4 days typical, $0 to $120 fee); held facts dl (business tax 19%, payroll on-cost 14%, time-to-go 4 days, sales tax 20% customer-carried); and the **formation-cost table by tier**.
- Visual: **redesigned as grouped formation tiers, not a flat table.** Three tier cards , *Sole trader* (Free / $0, "fastest, simplest, you are the business"), *Private limited company* ($15 / $120 all-in, "limited liability, the default for hiring"), *Limited partnership* ($15 / $180, "two-plus owners sharing the trade") , each showing **what it costs + who it suits** as a labelled mini-card, with the stepper ribbon above. `data-table1` for the precise figures folded beneath a hairline for the reader who wants the exact numbers. Full `--shadow-card`, generous padding. **Movement: Cost and keep.**

### 5. What an owner actually keeps
- Role: show, illustratively, where the money goes from revenue to take-home , the country-level shape of Job A, hard-linked down to the cell for the live number.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , it is the one place "what you keep" is made concrete, and it sets up every downstream link.
- Shows: an illustrative take-home walk (revenue to costs to tax to kept), explicitly tagged "one illustration, the real number lives in a trade and a city."
- Visual: **L7 donut + legend** (kept slice in moss, emphasized, center label "keeps ~£X of £100"), with a hard down-link to `cell-london-restaurants.html` for the real figure. No page above the cell prints take-home as if it owned it. **Movement: Cost and keep.**

### 6. Hire and the cost of a team (LEVELS, not a bare range)
- Role: the second decisive cost , what staff really cost, the canonical home of the payroll-on-cost figure.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , staffing cost is the beat that most surprises a new owner.
- Shows: pay by **level** , wage floor (~$13/hr, ~$25K/yr), typical skilled ($44K), senior/experienced ($60K+) , each as a row on one shared scale with the spread; plus employer on-cost (~14%) and the "the floor is rarely the rate you pay" beat.
- Visual: **shared-scale dumbbell / floating-range rows** (junior, mid, senior) with the median marked, paired with **L4 ranked comparison bars** for payroll on-cost vs neighbours (UK 14% atlas, peers cocoa, France=100% scale, no leader mark). This fixes the rejected "24K to 60K" bare range. **Movement: People.**

### 7. The market you can reach (merged)
- Role: one honest read of demand , how big and how moneyed the reachable market is , absorbing the old "who has money" + "how far you reach."
- Sanity verdict: **SUPPORTING (cut if thin).** Pathetic check: passes ONLY merged and trivia-filtered , raw "population 68.3M" alone is pathetic and is killed; this earns its place by combining reach + spending-power into a decision read.
- Shows: reachable population as context (not a hero number), concentration (where the customers cluster), and a spending-power read blended from wealth + pay + local cost.
- Visual: a single compact **band / proportion strip** (reach + concentration on one scale), spending-power as a one-line calibrated read, no fabricated spend-mix split. **Movement: The market and the field.**

### 8. Versus the neighbours
- Role: the one legitimate country-vs-country comparison , like-for-like facts against bordering economies.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , it is the cross-border operator's core question.
- Shows: a facts table , business tax, payroll on staff, cost to register, time to register , for UK + IE/FR/DE/NL, rows leading with payroll (the figure that actually decides).
- Visual: **L15 zebra data-table**, UK column tinted atlas-50 with a left atlas rule, **never crowned** a winner (`noLeaderMark`); optional inline magnitude bars per cell. Fixed caveat: "not adjusted for local prices, read each column on its own terms, not a league table." **Movement: The market and the field.**

### 9. How costs have moved
- Role: the honest, decision-relevant replacement for the rejected "momentum" lens , is the cost of operating rising or steady.
- Sanity verdict: **SUPPORTING.** Pathetic check: passes only as a *trend* , the rejected flat statement "minimum wage rising steadily" is KILLED; a sparkline of the actual minimum-wage / payroll-cost path earns the tile because it shows the slope a low-pay model is fighting.
- Shows: minimum-wage and/or employer-cost trajectory over recent years.
- Visual: a single quiet **`spark` trend tile** (one atlas line, direct-labelled "rising ~X%/yr"), no busy axis. **Movement: The market and the field.**

### 10. Cities
- Role: the primary forward path , send the reader to where the real, scored number lives.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , it is the main hand-off and the only route to a scored entity.
- Shows: uniform city cards (London, Manchester, Birmingham, Edinburgh, Glasgow, Bristol, Leeds, Cardiff), one neutral fact each.
- Visual: **uniform equal-weight cards, NEVER ranked**, no climate-dot ranking signal (a country never scores its own cities); a quiet city-link chip row beneath. **Movement: The market and the field.**

### 11. Easiest to break into
- Role: a country-level steer on which trades are most accessible , the soft entry path into a cell.
- Sanity verdict: **SUPPORTING.** Pathetic check: passes , it ranks *activities within the country* (allowed), not places against places.
- Shows: backed activities in full with a readiness read; others as plain chips; rank numbers dropped until data supports them.
- Visual: a divided list , backed rows show a readiness **spectrum** + link to a trusted-local cell; ungated rows are plain chips reading "readiness fills in with a local cell." **Movement: The market and the field.**

### 12. Character (rules + culture spectra, DENSER)
- Role: the qualitative "what is it like to deal with the system and the people here," the two hard people-stats up front.
- Sanity verdict: **SUPPORTING.** Pathetic check: passes once made dense , the rejected pale 5-spectrum strip was too tall and vague; this is restored as **two tight rated tables**.
- Shows: *The rules, from a business view* (6 rated rows: e.g. clean-dealing, predictability, ease of contracts, red-tape, tax-system clarity, enforcement) + *The culture, from an outsider view* (6 rated rows: welcoming, embraces-the-new, directness, formality, trust, pace), led by the two real people-stats (15% born abroad, 6% foreign-owned firms).
- Visual: **two compact `wide` table-cards of L5 gradient-spectrum rows** (oriented poles: worse left, better right, every row, atlas marker), color clearer and rows tighter than the rejected strip; the single best lens carries the lone accent. Distinct treatment from the country-shape spectra by being two grouped tables side by side. **Movement: Place and character.**

### 13. What locals know
- Role: the signature insider beats , the editorial judgment a reader cannot get from a stats table.
- Sanity verdict: **ESSENTIAL (promoted).** Pathetic check: passes , this is the irreplaceable human read.
- Shows: four real UK beats (PAYE is the slow step not registration; high-street rent understates true cost by ~a third with rates + service charge; small-premises rate relief varies a few miles apart; the first hire triggers pension auto-enrolment, budget the on-cost from payslip one).
- Visual: glyph-led list rows (one icon family), short, authored, warm ground. **Movement: Place and character.**

### 14. Versus the world
- Role: one honest global-context read, so a reader knows where this country sits worldwide without a fabricated worldwide grade.
- Sanity verdict: **SUPPORTING (collapses if thin).** Pathetic check: passes as a *single context bar*, not a verdict.
- Shows: GDP per capita subject bar ($49K) + global-median tick ($6.9K) on a fixed $0 to $60K scale.
- Visual: **L9-grammar score band** , one subject bar in atlas + an ink global-median tick; caveat "a bigger number means a richer customer, not an easier market." Folds to the "still filling in" strip until a real worldwide read is held. **Movement: The close.**

### 15. How we get to the number (trust layer)
- Role: the site-wide confidence/method beat , quiet credibility for a numbers product.
- Sanity verdict: **SUPPORTING.** Pathetic check: passes , it is the trust layer that justifies every figure; monetizable per the approved reform.
- Shows: a short held-vs-modeled note, no source-agency names.
- Visual: a small expandable method note, low contrast, no chart. **Movement: The close.**

### 16. The honest take + one quick gut-check
- Role: the page's diagnosis , the one verdict plus three derived questions from *this country's* cost structure.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , the editorial verdict is the product.
- Shows: verdict ("an easy place to start, a hard place to keep staff cheaply") + held ticks; three gut-check questions derived from the cost stack.
- Visual: a calm accent panel (Newsreader verdict, narrow measure) + three framed question cards (3-up). **Movement: The close.**

### 17. One thing to remember
- Role: the single shareable, forward-looking instruction , distinct from the honest-take diagnosis.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , the one line a reader screenshots.
- Shows: "Cheap to open here, expensive to staff. Plan the business around the second hire, not the first day." + freshness stamp + flag-it link.
- Visual: the one full-width **Newsreader closing line** (the page's serif bookend), freshness + flag-it beneath. **Movement: The close.**

### 18. Related / Compare CTA
- Role: the single closing hand-off zone , one terracotta CTA into Compare.
- Sanity verdict: **ESSENTIAL.** Pathetic check: passes , one CTA, not three link grids.
- Shows: "Set the United Kingdom side by side with up to three countries: revenue, the cost stack, what an owner keeps."
- Visual: re-skinned `cta10` calm panel, copy left, one "Open Compare" button right. **Movement: The close.**

> **Collapsed into ONE calm "still filling in" strip** (never separate sample cards posing as content): licences, cost-signature/where-the-margin-leaks, talent reality, opportunity gap, special zones, your-life-here. **Cut entirely:** "same business abroad" (Compare's job), standalone "talent," the felt-cost bars, and any no-number qualitative-word grid.

## Related links and cross-page hand-offs
The founder wants MORE links; wayfinding is woven through, not dumped at the end.
- **Down to cities** (section 10): every city card links to its city page; London is the deepest. This is the primary forward path.
- **Down to a cell** (sections 5 and 11): "what you keep" and "easiest to break into" both hard-link to a trusted-local cell (`cell-london-restaurants.html`) for the live take-home number , the country never prints it as its own.
- **Across to industries:** the easiest-to-break-into rows and the cost-and-keep block each link to the matching **industry** page ("see how restaurants are structured nationwide").
- **Sideways to neighbours** (section 8): each neighbour column links to that country's page (IE, FR, DE, NL), enabling step-sideways browsing.
- **Out to Compare** (section 18 + inline in section 8): the closing CTA and an inline "compare these four" affordance in the neighbours table.
- **Navbar dropdowns** keep Countries / Industries / Cities / Compare reachable from any scroll point; **footer** repeats the full link columns.
- The **anchor rail** (section 2) is internal wayfinding for the long scroll.

## What was WRONG in the rejected build, and the fix
- **No full-bleed place image.** The hero shipped a graticule-only engraving with the lit pin , flat, generic, no sense of place. **Fix:** restore a real full-bleed country photograph with a warm scrim, motif on top at low opacity. This is the #1 fix.
- **Scorecard reads were prose, not calibrated ratings.** The 8 tiles carried a sentence-long "so-what" each (`.sw`), which bloated height and buried the good/bad signal. **Fix:** keep the 8 metrics but compress to word + glyph + tint (Strong / Excellent / neutral); the lead two tiles enlarge; the prose drops to a single short read.
- **Giant serif section headers + lead-paragraph-per-section.** Headers at clamp(26,36) with a full lead paragraph made the page tall and "AI-essay." **Fix:** Newsreader reserved for the country name, the anchor, and the one-thing closer only; section heads drop to tile-scale; leads become one short line.
- **Hire showed a bare range.** "24K to 60K" with no structure. **Fix:** levels , junior/mid/senior dumbbell rows on a shared scale with the median marked, plus on-cost comparison bars.
- **Pathetic cards present.** Raw "population 68.3M" as a standalone big number, "consumer card spend: High," and "minimum wage rising steadily" as flat statements. **Fix:** population is demoted into the merged market read (never a lone hero); "card spend High" is cut; "min wage rising" becomes the *trend sparkline* (section 9) showing the actual slope.
- **Pips / segmented meters used for ratings.** The country-shape and character rows used 4-rung pips (`●●●○`), banned by L6 as "Lego/forks." **Fix:** every rated quality moves to the L5 gradient spectrum (oriented poles, atlas marker).
- **Character dropped to a pale, too-tall strip.** The agreed character section degraded. **Fix:** restored as two dense rated spectrum tables (rules-view + culture-view) with clearer color and tighter rows.
- **Cost-to-set-up was a flat table.** Not intuitive. **Fix:** grouped formation **tiers** (sole trader / Ltd / LP) as labelled "what it costs + who it suits" cards with the stepper ribbon, precise table folded beneath.
- **Seven separate "sample / coming soon" cards.** The prior plan rendered each unheld lens as its own ghost card , slop that reads as broken. **Fix:** collapse all unheld lenses into ONE calm "still filling in" strip per the anti-slop rule.

## Open questions for the founder
1. **Hero place image sourcing.** A real photograph is the #1 fix; do you have a licensed image source/set for country heroes, or should the hero fall back to a richer engraved-illustration treatment (still full-bleed, still a sense of place) until images are licensed?
2. **Cost-of-living rating direction.** You specified cost of living at 78/100 = "Fair," but a *higher* cost of living is worse for an operator. Should this tile rate inversely (high cost = weak/amber) so the good/bad cue is honest, or stay a neutral fact like population?
3. **"What an owner keeps" at country level (section 5).** This is an *illustrative* waterfall hard-linked to the cell. Confirm one illustrative donut is acceptable here (clearly tagged, real number lives in the cell), or should the country page carry no take-home visual at all and only link down?
