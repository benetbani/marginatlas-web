# Cell page , architecture guidance

## Who is here, and the decision they make
The dominant reader is a **prospective owner-operator** weighing whether to open this exact trade in this exact place: they want one honest answer, "what would I take in, and what would I keep?" Behind them sit a **current operator** benchmarking their own numbers against the typical room, and an **adviser or curious analyst** (accountant, lender, journalist) who needs the spread and the method, not just the headline. Every one of them is really asking a single question: *is the money in this worth the risk and the hours, and how sure can I be?*

## The page's one job
Tell a person weighing this trade in this place, in one breath, what the business takes in and what the owner actually keeps, then back that answer with enough honest depth that they can act on it.

## The hero
Full-bleed masthead band, warm `linear-gradient(to bottom, --atlas-50, --cream-75)` over a **faint stylized place image of the city** (London skyline at low opacity, the world-map motif retired here in favour of a real place photo per the binding principle), bottom hairline, `--shadow-card` on the figure. The cell hero is NOT a generic 8-tile country scorecard; it is **the answer, framed good/bad**. It carries:

- **THE GAP, leading (focal point, oversized Newsreader, atlas-700):** the page leads with the relationship between what comes in and what stays, not revenue alone. Hero number = **$503K typical revenue a year**, with the take-home as its immediate one-beat echo directly beneath: "The owner keeps about **$48K** of it , a thin 10% line." The *gap* (in vs kept) is the emotional and editorial lead; revenue is the size, take-home is the truth.
- **The distribution curve under the number:** a density silhouette (atlas line, gradient fill .22 to .02) with a dashed TYPICAL marker computed at `(503 − 252) / (905 − 252) = 38.44%`, low/typical/high ticks ($252K / $503K / $905K) below, typical tick in atlas. This says "you are looking at a spread of real comparable rooms, not one made-up figure."
- **The 5-stat at-a-glance scorecard with ratings (L3 scorecard grammar), one focal lead + four supporting**, each with a calibrated read:
  - **Take-home a year , $48K** , read: *thin* (amber). LEAD-2 (the decision number, in the atlas-tinted focal tile beside the hero number).
  - **Net margin , 10%** , read: *slim, wages-and-rent business* (amber).
  - **Difficulty to break in , Hard** , read: *hard* (amber/atlas marker), a mini gradient-spectrum chip.
  - **Break-even , 95 covers/day** , read: *typical room runs 140* (moss, you clear it with headroom).
  - **Payback , about 6 years on $350K to open** , read: *slow* (amber).

The hero is the GAP + the curve as the focal point; the 5-stat scorecard is the supporting "five decision numbers in one breath." Restaurants is a place where almost every metric reads amber/fair, and that honesty is the point: the page must not dress a thin-margin trade as a strong one.

## The metric-rating system on this page
Good/bad is signalled three consistent ways, never by a 4-level pip (banned, L6):

1. **A calibrated word + color read on every scorecard and KPI number** (weak / fair / strong / excellent, or thin / slim / hard / slow), colored moss = good, amber = caution, ink/cocoa = neutral. A non-business reader sees "$48K , thin" and instantly knows a half-million-dollar room keeps very little.
2. **The L5 gradient spectrum** (gray bad-left to moss good-right, atlas marker at true position) for any *quality* rating: difficulty to break in, each risk's severity orientation, the owner's pay vs a salaried job.
3. **Position on a computed track** for anything with a real scale: break-even below/above the typical day, wages on one shared scale, the kept slice in the donut.

**Decisive metrics lead** (bigger, first, atlas-tinted focal tile): the GAP, take-home, net margin. **Supporting metrics are smaller** (calm tiles, neutral): covers/day, average spend, payroll headcount, startup total. The rule the page must never break: the take-home and the margin are the truth of this trade and always read first and loudest; revenue is the *size*, not the *answer*, and is never allowed to read as success on its own.

## The full section list (LONG, in order)
This is the flagship and the depth bar. Twenty real beats plus chrome, grouped into five movements. Each section is its own bordered card (§3.1), one focal point each, two-column or stacked chosen per section, deliberately varied so no two adjacent cards share a silhouette.

---

### MOVEMENT I , THE ANSWER (what it takes in, what you keep)

### 1. Masthead
- **Role:** deliver the answer , the gap between revenue and take-home , as the first and only thing on screen one.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it is the entire reason the page exists, and it leads with the gap (in vs kept), not a vanity revenue number.
- **Shows:** hero revenue $503K, take-home echo $48K, the distribution curve (p10/typical/p90), the 5-stat scorecard with reads.
- **Visual:** oversized Newsreader number + density curve (L8) + L3 scorecard, full-bleed place image. Hierarchy: the number and curve own the left; the scorecard rides right, take-home tile atlas-tinted as the lead-supporting.
- **Group:** Movement I, the one full-bleed exception.

### 2. At-a-glance verdict (the five decision numbers)
- **Role:** restate the five numbers a buyer actually decides on, in one calm row, before any chart , revenue, take-home, difficulty, break-even, payback.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No, because each number carries a good/bad read and a decision rides on it; it is the scannable contract for the whole page. (It is the reformed KPI row, NOT a second hero.)
- **Shows:** the same five as the hero scorecard, but as a horizontal commitment row with reads.
- **Visual:** `stats-card1` 5-stat tile row, each with its calibrated read word + color; tabular figures. No icons-as-decoration. Distinct from the hero by being a flat, quiet, full-width strip (no place image, no big serif).
- **Group:** Movement I. This is the bridge from the hero into the working page.

### 3. Make-it-yours calculator
- **Role:** let the reader replace the typical room with *their* room and watch take-home move , the one interactive beat, and the proof the numbers are a model you can interrogate.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it converts a passive benchmark into the reader's own scenario, and showing the arithmetic chain is the honesty differentiator.
- **Shows:** a REVENUE lever (covers/day or average spend) plus rent, staff, owner's draw; a switch (count owner's draw as cost); a live result; and the visible math chain (covers × spend × days = revenue; minus cost lines = take-home).
- **Visual:** raised card (`--shadow-card`), sliders + `switch` + live result line + a small visible "the arithmetic" readout. The result line is the one terracotta moment. Computed slider fills (fill% = thumb left% = position on each min/max domain).
- **Group:** Movement I, mounted directly under the verdict so the reader can immediately make the answer theirs.

### 4. The honest take
- **Role:** the page's single editorial diagnosis , what kind of business this really is , plus the three levers that change the outcome and the break-in score.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: this is the irreplaceable judgment a spreadsheet cannot give ("a wages-and-rent business, not a high-margin one").
- **Shows:** verdict line; three lever bullets (each a number or a mechanism, never a platitude); the break-in difficulty as a gradient spectrum anchored to a stated peer set; a modeled-figures note.
- **Visual:** calm accent panel (`cta10` shell, buttons omitted) two-column , verdict + bullets left, the L5 gradient-spectrum break-in marker right (London exemplar marker computed near "Hard"). Newsreader verdict at accent-panel weight. Distinct treatment: this is the one warm-tinted prose card, a deliberate palate change from the data cards around it.
- **Group:** Movement I closes here, on the human read of the answer.

---

### MOVEMENT II , WHO PAYS YOU AND WHERE IT GOES (the mechanics)

### 5. In plain terms
- **Role:** translate the abstract dollars into the three physical facts of running the room, so a non-operator can picture the day.
- **Sanity verdict:** SUPPORTING. Is this pathetic? It would be as bare stat cards; it earns its place by being *tangible units* (covers a day, average spend, people on payroll) that the calculator's revenue lever maps onto, with the avg-spend definition fixed ("per cover, food and drink, before service").
- **Shows:** ~116 covers/day, ~$12 average spend per cover, 12 people on payroll.
- **Visual:** three icon unit cards (one icon family, atlas-50 chips). Distinct because it is the only icon-unit grid on the page; kept to three, never a generic feature grid.
- **Group:** Movement II opens on the texture of the trade.

### 6. Who eats here / demand
- **Role:** name the customer and the day-part this trade lives or dies on , the one demand truth specific to restaurants.
- **Sanity verdict:** SUPPORTING (CUT-IF-THIN). Is this pathetic? Not when it carries a real split; it would be pathetic as "consumer spend: High," so it must show a *shape* (local vs visitor, or weekday-lunch vs weekend-dinner) that changes where you'd site and staff.
- **Shows:** a trade-specific day-part or local-vs-visitor split (e.g. dinner-led, weekend-weighted, visitor share in central districts).
- **Visual:** a single horizontal split bar (one scale, subject atlas, mass cocoa). If unheld for a place, it folds into the collapse strip, never a sample card.
- **Group:** Movement II.

### 7. Where the money goes (the donut)
- **Role:** the canonical per-$100 split , the single most-looked-at chart, showing how a busy room keeps so little.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it is the visual proof of the gap, and the kept slice is the focal point.
- **Shows:** Cost of goods $30, Payroll $33, Rent and premises $15, Everything else $12, Owner keeps $10 (sum = 100).
- **Visual:** DONUT + legend (L7, founder override retained) with the owner-kept slice in moss (`--chart-2`), center label "$10 kept of $100," every slice labeled in the legend with its dollar value; PLUS the 100% companion stacked bar beside/below it (the honesty pairing the founder mandated, carrying depletion the donut alone hides). Cost mass cocoa/ink, one accent rule holds. Computed arcs (value/100 × 360°). Two-column: donut + companion bar left, legend + kept callout right.
- **Group:** Movement II, the anchor chart.

### 8. What would move your margin most (sensitivity)
- **Role:** answer "if I could change one thing, what moves take-home most?" , a forward sensitivity, NOT a restatement of the cost ranking.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No, and this is the fix for the old slop: the rejected build re-ranked the same cost lines a second time (bar soup). This instead shows *leverage* , a 5% price rise vs a 5% rent cut vs one fewer cover-shortfall , each as its effect on take-home.
- **Shows:** the top levers ranked by impact on net (e.g. +5% average spend lifts take-home most; rent and payroll are the squeeze).
- **Visual:** ranked sensitivity bars on one shared scale, cocoa mass, the single most-powerful lever marked atlas. Distinct from #7 by being a leverage chart, not a composition chart.
- **Group:** Movement II closes on the actionable read of the split.

---

### MOVEMENT III , IS IT WORTH IT (the owner's reality)

### 9. What the owner keeps, vs a salary
- **Role:** put take-home in opportunity-cost terms , per hour and against a steady job , the brutal honesty beat.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: this is the most decision-changing comparison on the page (a $48K take-home on 60-hour weeks vs a salaried head-chef wage).
- **Shows:** take-home per hour, and take-home vs a comparable salaried role, with a good/bad read.
- **Visual:** a per-hour / vs-salary comparison , two small numbers with a gradient-spectrum read (is the owner ahead of, or behind, just taking a job?). Distinct, compact, sobering.
- **Group:** Movement III opens on "is it actually worth it."

### 10. Break-even
- **Role:** the threshold , how full you must be to stop losing money , wired to the calculator.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: break-even is the number that keeps owners awake; the good/bad is built in (you clear it, or you don't).
- **Shows:** break-even 95 covers/day, typical day 140, capacity 180. Sentence: "You cover your costs at about 95 covers a day; a typical room runs nearer 140."
- **Visual:** threshold gauge , amber below the line, moss above, lone atlas tick at break-even (52.78%), quiet ink tick at the typical day (77.78%). Both ticks labeled. Floor ≥ 2/day so a degenerate place never prints nonsense.
- **Group:** Movement III.

### 11. What to watch (risks)
- **Role:** the trade-specific operating realities a buyer must price in, neutral tone, never alarmist.
- **Sanity verdict:** SUPPORTING. Is this pathetic? Not when rows are specific to restaurants (rent reset on renewal, holding kitchen staff, a quiet calendar stretch, a supplier/energy shock); generic risk copy is banned.
- **Shows:** four ordered rows graded serious / watch / rare, each with one calm note.
- **Visual:** severity ladder , a 3-bar glyph per row (serious = atlas, watch = amber, rare = cocoa), title, one-line note. Distinct row-grid silhouette. Never badmouth the trade; frame as realities.
- **Group:** Movement III closes on the downside.

---

### MOVEMENT IV , THE NUMBERS BEHIND IT (pay, cost, time, exit)

### 12. Pay by role + the owner's own pay
- **Role:** show what the trade pays its people , by role, with the spread , and put the owner's own draw on the same scale.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No, and it fixes a named slop: bare ranges. This shows LEVELS by role (head chef / server / kitchen porter), each low–median–high on ONE shared scale, with the owner's draw plotted alongside , the punchline that the owner can earn less than their head chef.
- **Shows:** Head chef $45K/$60K/$78K, Server $26K/$31K/$36K, Kitchen porter $23K/$24K/$26K, owner's draw marked on the same $0–$80K scale.
- **Visual:** shared-scale dumbbell/floating-range rows, median as the atlas dot, the shared scale stated in a caveat so a head chef's bar is honestly longer. The owner's-pay marker is the editorial twist. Distinct dumbbell silhouette.
- **Group:** Movement IV opens on the cost of a team.

### 13. Getting in (cost to open + first year)
- **Role:** the capital and the timeline to open, grouped with payback , what it takes to even start.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: this is half the buy/no-buy decision; grouping cost-to-open with the first-year ramp (instead of two thin cards) is the richness fix.
- **Shows:** total to open $350K (Fit-out $180K, Kitchen kit $90K, Deposits/legal $40K, Opening float $40K), plus the first-year phases with break-even and payback (~6 years).
- **Visual:** a stacked startup cost bar (computed segments summing to total, cocoa/ink, atlas total figure) ABOVE a timeline ribbon of four phases (Mo 1-3 open, Mo 3-6 the fragile months "~30 in 100 don't make it past here," Mo 6-9 break-even = lone atlas node, Mo 9+ a steady room). Two distinct visuals grouped under one card. Survival figures stated as ranges, never false precision.
- **Group:** Movement IV.

### 14. Through the year (seasonality)
- **Role:** the cash-flow shape across twelve months and the one takeaway (build a buffer for the trough).
- **Sanity verdict:** SUPPORTING. Is this pathetic? Not when it carries a real busiest/quietest read; a flat curve would be cut.
- **Shows:** 12-month index (trough Jan/Feb, peaks summer + December) + the cash-flow takeaway.
- **Visual:** gradient area chart (L8/area shape), single atlas series, stripped axes, direct busiest (Dec, atlas dot) / quietest (Jan, ink dot) labels. Distinct full-width serene area. Modeled monthly pattern tagged directional.
- **Group:** Movement IV.

### 15. What it could sell for / exit
- **Role:** the often-forgotten back end , what a buyer would pay for this business , so the reader sees the asset, not just the wage.
- **Sanity verdict:** ESSENTIAL (NEW, founder-approved). Is this pathetic? No: it adds the dimension every other benchmark site omits, and it carries a hard caveat so it never reads as a promise.
- **Shows:** a valuation-multiple range (e.g. a small multiple of owner earnings or of revenue, stated as a range), with the explicit caveat that restaurant goodwill is thin and the fit-out, lease and location carry most of the price.
- **Visual:** a valuation-multiple range strip (RangeStrip family) with a typical marker and a prominent caveat rail. Distinct, restrained, one figure plus its honest band.
- **Group:** Movement IV closes on the exit.

---

### MOVEMENT V , CONTEXT, TRUST, AND WHERE NEXT

### 16. The same business nearby (like-for-like)
- **Role:** the one peer comparison this page is allowed , the same trade in comparable places , framed as orientation, never a league table.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: "how does this place compare for the same trade" is a top reader question; the anti-ranking framing is what keeps it honest.
- **Shows:** London $503K (subject), Edinburgh $412K, Bristol $392K, Manchester $352K, Birmingham $342K , same trade, same currency.
- **Visual:** like-for-like bars, subject atlas, peers neutral cocoa, computed widths (London 100% down to Birmingham 68%), with a load-bearing honesty rail ("same trade, same currency, not price-adjusted; read each on its own terms, not a league table"). Districts suppressed (no district-vs-city). Distinct ranked-rows silhouette but explicitly not crowned.
- **Group:** Movement V opens on context.

### 17. Versus the world
- **Role:** one calm global-baseline read when a worldwide figure is genuinely held; otherwise it self-collapses.
- **Sanity verdict:** CUT-IF-THIN. Is this pathetic? It would be as a fabricated world number, so the rule is: a real global-median tick or nothing. Demote to the industry page if it rarely holds for cells.
- **Shows:** subject vs a global-median tick (when held).
- **Visual:** score-band-style single track with a global-median tick, OR the collapse strip. Never a made-up world figure.
- **Group:** Movement V.

### 18. How sure are we (method + confidence)
- **Role:** the site-wide trust layer , show which numbers are held and which are modeled, and link to the method.
- **Sanity verdict:** ESSENTIAL (NEW, founder-approved, site-wide). Is this pathetic? No: on a numbers product, "how do you know this" is the trust differentiator and the thing that makes the modeled figures defensible.
- **Shows:** per-section confidence chips (held / modeled), a one-line method note, a link to the full methodology. No source-agency names.
- **Visual:** a quiet expandable method note + small per-section confidence chips. Distinct calm low-contrast treatment, no chart.
- **Group:** Movement V, the trust beat before the close.

### 19. One thing to remember (closer)
- **Role:** the single shareable, forward-looking verdict , distinct from the honest-take's diagnosis.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No, as long as it adds a forward instruction, not a restatement: "A busy room, a thin margin , the lever is pricing power, not volume."
- **Visual:** a Newsreader closing line on warm ground, narrow measure. The one optional serif moment. Distinct, quiet, singular.
- **Group:** Movement V.

### 20. Related + compare CTA
- **Role:** the single wayfinding zone , where to go next , with preview metrics so links are data-bearing, not bare.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? Not when each link tile carries a preview number; bare link grids are the slop.
- **Shows:** other trades in this place (with a preview take-home), the same trade in nearby places (with a preview revenue), and one Compare CTA.
- **Visual:** data-bearing link tiles + ONE terracotta "Compare two places" CTA (the page's only marketing button). Zebra-free, distinct tile grid.
- **Group:** Movement V closes the page into the wider atlas.

### , Collapse strip (mechanism, not a numbered beat)
- **Role:** absorb every unheld/sample section into ONE calm "still filling in" band, so a thin (non-London) cell never reads as a wall of dashes.
- **Visual:** one low-contrast `cream-100` strip listing unheld section names as muted chips + one honest line. The mockup renders the full London flow once AND one collapse-strip rendition so the behavior is visible.

### , Chrome
- Navbar (L13, classic centered, Countries/Industries/Cities/Compare + search + one dark CTA) and the newsletter-forward dark footer (L14), site-wide.

## Related links and cross-page hand-offs
The founder wants MORE links; they live in three deliberate places so the page never stacks link grids:

- **Breadcrumb (masthead):** Home / GB / London / Restaurants , each segment a live upward hand-off (country page, city page, industry page). This is first-class navigation, not decoration.
- **Inline, contextual, throughout:** the like-for-like bars (#16) link each peer place to *its own* cell (Restaurants in Manchester, Edinburgh, Bristol). The pay-by-role and donut cards link "see the full method" into #18. The honest-take's break-in score links to the city page (the only scored entity) for the wider climate read. The wages owner-draw twist links to the industry page's national pay shape.
- **The single wayfinding zone (#20):** data-bearing tiles , "Other businesses here" to Cafes/bars/bakeries in London (each with a preview take-home), "The same trade elsewhere" to nearby cities (each with a preview revenue), the **Compare two places** CTA (the cross-cell comparison tool), and a soft link up to the Industry page ("Restaurants, nationally") and the Country page ("Doing business in the UK"). 

The cross-page law (redundancy): this cell OWNS take-home in real dollars, the ramp/runway, the calculator, and the day-part demand slice. It hands difficulty/score UP to the city, structural shape UP to the industry, and rules-to-set-up UP to the country , and links accordingly rather than restating them.

## What was WRONG in the rejected build, and the fix
- **Bare ranges on pay.** The rejected pattern showed pay as "low to high." FIX: section 12 shows LEVELS by role (head chef / server / porter), each low–median–high on one shared scale, with the owner's own draw plotted alongside , the editorial punchline that the owner can out-earn nobody.
- **Bar soup / restatement loop on cost.** The old build ranked the cost lines, then re-ranked the same lines as "cost drivers" , the same number three times. FIX: the donut (#7) is the one composition chart; #8 becomes a forward SENSITIVITY (what moves margin most), a genuinely new frame, not a re-rank.
- **Pathetic equal-weight cards.** Numbers were laid out as identical tiles with no good/bad signal, so a reader couldn't tell $48K was *thin*. FIX: the 5-stat scorecard and KPI row carry a calibrated read (thin / slim / hard / slow) and color on every metric; decisive numbers (the GAP, take-home, margin) lead bigger and first, supporting numbers sit smaller.
- **Revenue dressed as success.** Leading with $503K alone flatters a thin-margin trade. FIX: the hero leads with the GAP (in vs kept) , $503K in, $48K kept, a 10% line , so the truth, not the size, is the headline.
- **Dropped depth beats.** The valuation/exit beat and the method/confidence layer were missing. FIX: both ship (sections 15 and 18), exit with a hard caveat, confidence as the site-wide trust layer.
- **Placeholder ghosts on thin cells.** Unheld sections rendered as empty or sample cards. FIX: one calm collapse strip absorbs all of them; the mockup demonstrates it.
- **Identical card grids.** FIX: the page runs five movements with deliberately varied silhouettes , density curve, donut + companion bar, sensitivity bars, threshold gauge, severity ladder, dumbbell rows, stacked-bar + timeline ribbon, gradient area, range strip, like-for-like bars , no two adjacent cards repeat a shape, and the airy prose cards (honest-take, closer) break the data cadence.

## Open questions for the founder
1. **The exit/valuation beat (#15): which multiple base?** Restaurants trade thin on goodwill; do you want the range expressed as a multiple of owner earnings (cleaner for the reader) or a multiple of revenue (more common in trade listings), and do we hold a real UK restaurant multiple yet, or does this ship modeled-and-tagged for the London exemplar only?
2. **The "who eats here" demand slice (#6): which axis is the truth for restaurants?** Day-part (lunch vs dinner, weekday vs weekend) or local-vs-visitor? Pick one canonical axis so every cell renders the same shape rather than mixing per-place.
3. **The hero scorecard count: 5 or the full almanac 8?** The country hero carries 8; the cell's natural decision set is 5 (revenue, take-home, difficulty, break-even, payback). I have specced 5 as the lead row because the other three almanac slots (population, ease-of-business, etc.) are not cell-level decisions. Confirm 5 is right for the cell, or name the 3 you want added.
