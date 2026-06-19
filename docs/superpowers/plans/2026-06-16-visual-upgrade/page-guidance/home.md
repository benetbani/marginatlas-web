# Home page , architecture guidance

## Who is here, and the decision they make
Three readers land here cold, almost always from search or a shared link. The **prospective owner / operator** (P1, the soul of the audience) is asking "before I sink my savings into this trade in this place, what does it actually earn and what would I keep?" The **curious professional** (P2: a lender, a franchise scout, a journalist, a relocating worker) is asking "is this a real, trustworthy source, or another content farm guessing numbers?" The **buyer / client** (P3: a PE associate, a consultant, a market-entry team) is asking "is the coverage deep and honest enough to pay for?" The home page must answer all three in the first two screens, then reward the scroll with proof.

## The page's one job
Convince a cold visitor, in one scroll, that Margin Atlas tells the honest truth about what a small business earns and what its owner keeps, anywhere, and send them into the first real number.

## The hero
**Full-bleed treatment.** A single warm, full-width band: `linear-gradient(to bottom, --atlas-50, --cream-75)` over the locked **stylized world-map motif** (the dotted graticule, `pattern52`, cocoa-300 at ~8% opacity), the map drifting off the right edge so it reads as texture, never a chart. This is the one place the world image lives at full strength; it signals "every place on earth" without faking a choropleth. One real place photograph is NOT used in the home hero (a single city would mislead about scope); the map motif IS the home's place-image equivalent. A rotating question sits as the H1 in Newsreader (`clamp(30px,4.2vw,46px)`), cycling four real catalog questions on a 4s motion-safe fade (no carousel mechanics): "What does a London restaurant actually keep?" / "What does it cost to open a salon in Texas?" / "Which city is kindest to a new cafe?" / "What does a plumber in Sydney take home?" The subtitle is widened to one calm line: "Real benchmarks for small businesses, place by place: what they earn, and what the owner keeps." The **search bar is the hero's primary action**, not a button: a wide input with a placeholder that matches the rotating question ("Try: restaurant, London") and a single dark `btn-dark` submit. One CTA on the screen, and it is the search.

**The at-a-glance scorecard (home variant).** The home does not have a single "place" to score, so its hero scorecard is a **coverage-and-proof scorecard**, the home's equivalent of the country 8-metric vital signs, built on the locked L3 lead+supporting pattern. Six tiles, the first spanning two columns as the focal lead:

| Tile | Value | Read (good/bad signal) | Weight |
| --- | --- | --- | --- |
| **Benchmarks held** (LEAD) | e.g. 41,000+ | moss "growing weekly" | focal, 2-col, atlas-tinted |
| Countries covered | 55 | neutral "and counting" | supporting |
| Cities scored | e.g. 120 | neutral "the only scored entity" | supporting |
| Trades tracked | e.g. 90 | neutral | supporting |
| What it costs to read | Free | moss "free to read" | supporting, moss accent |
| Numbers we won't fake | 0 guessed | moss "held or modeled, never invented" | supporting |

The LEAD is the benchmark count (the proof of scale); the second-strongest signal is "Free to read." Every count is real or it does not appear; if a count is soft, the tile collapses out rather than rounding up. The exact figures come from the live inventory at build, not hand-typed.

## The metric-rating system on this page
Home is a marketing page, so the rating system works on two registers. **Register one (coverage tiles, above):** good/bad shown by the moss accent on the two tiles that are genuinely a selling point (free, never-faked) and calm neutral ink on the factual counts, so a reader instantly sees what is a *promise* versus a *fact*. **Register two (the live example tiles, section 3):** this is where the real metric-rating discipline lives, because these tiles carry actual benchmark numbers. Each example metric gets the locked **gradient-spectrum read** (gray-bad left to moss-good right, atlas marker at the true position) plus a one-word calibrated label (weak / fair / strong / excellent). The decisive number in each tile (the take-home or the margin, the thing that changes a decision) LEADS at `28px` Newsreader; the supporting context (revenue, count) is `14px` Inter. Cost numbers never get moss; only the kept/positive number does. This is the home's promise made literal: "we tell you if a number is good or bad," demonstrated three times before the reader has scrolled past the fold-and-a-half.

## The full section list (LONG, in order)

The page runs in four movements: **OPEN** (nav, hero, three proofs), **HOW IT WORKS** (anatomy, map, method, the honest read), **WHO + WHY YOU'D PAY** (like-for-like demo, audience, pricing), **STAY** (newsletter, blog, footer). Accent dividers (locked, sparing) mark the three movement boundaries.

---

### 1. Navbar (mega-menu)
- **Role:** Site-wide wayfinding and the standing "this is a real catalog" signal; the dropdowns preview breadth before the reader scrolls.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: the mega-menus do real work, previewing the catalog so a P3 buyer sees depth in two seconds.
- **Shows:** Logo lockup ("Margin **Atlas**", Atlas in atlas-700). Centered nav with dropdown panels: **Countries** (top 6 + "All countries"), **Industries** (top 6 + "All trades"), **Cities** (top scored cities + "All cities"), **Compare** (two-slot picker). Inline search affordance. One dark CTA pill ("Start free" or "Get the data").
- **Visual:** Locked **L13 classic navbar** built from shadcnblocks `navbar1`; sticky, `rgba(cream-75,.86)` + blur, bottom hairline. Dropdowns use the one line-icon family per item. Exactly one CTA.
- **Group/placement:** OPEN (chrome).

### 2. Hero
- **Role:** Land the promise and route the reader into a real number via search, the page's one job in one screen.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: rotating real catalog questions + a working search is the front door, not decoration.
- **Shows:** Rotating H1 question, widened subtitle, hero search input (the primary CTA), and the six-tile coverage scorecard described above.
- **Visual:** Full-bleed `atlas-50 → cream-75` band over the world-map motif (`pattern52`); shadcnblocks `hero2`/`hero` shell adapted; the scorecard uses locked **L3 lead+supporting tiles**. `--shadow-card` on the focal benchmark-count tile only. The map motif never encodes data (honesty rail).
- **Group/placement:** OPEN (the masthead, the one full-bleed exception).

### 3. Live example tiles (the proof triptych)
- **Role:** Prove the product is real and counterintuitive in three numbers, and demonstrate the good/bad rating the whole site promises.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? It would be if it said "restaurants exist" or "wages are rising"; instead each tile is a *surprising, decision-relevant* read with a rating, so it earns its place hard.
- **Shows:** Three DIFFERENT number-types, deliberately counterintuitive, each re-headlined as an insight not a stat:
  1. A **take-home gap**: "A London restaurant turns over £503K and the owner keeps £48K." Lead = the £48K kept (excellent vs weak spectrum marker), supporting = the £503K revenue.
  2. A **difficulty/score**: "The kindest big US city to a new cafe scores 71/100, the harshest 38." Lead = the spread, with the score-good spectrum.
  3. A **multiplier/cost surprise**: "Rent on the busiest London street runs 2x or more the city norm, but revenue lifts only 1.4x." Lead = the squeeze, framed as the trap.
- **Visual:** A 3-up of shadcnblocks `stats-card1` / `chart-card1`, but the three tiles are **deliberately NOT identical** (rule against identical card grids): tile 1 carries a mini money-split echo, tile 2 a small score spectrum, tile 3 a tiny diverging bar. Each carries the locked **L5 gradient-spectrum read** + one calibrated word. Kept/positive = moss; cost = cocoa; the subject number = atlas. Each tile deep-links to its real cell/city/neighbourhood page.
- **Group/placement:** OPEN (proof). First accent divider after this, opening HOW IT WORKS.

### 4. Anatomy of one benchmark
- **Role:** Show the *depth* behind a single number so the reader understands a cell is a dossier, not a stat; this is the section that converts "nice site" into "I need this."
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it is the single best argument for the product, the X-ray of one cell.
- **Shows:** One annotated, miniature cell-card (the London restaurant exemplar, clearly the real flagship) with four call-outs pointing at its parts: the median + the distribution spread, the per-$100 money split, the honest-read snippet, and the confidence/method chip. Labels: "the typical number," "the full spread, not one figure," "where every pound goes," "and a plain-English honest read."
- **Visual:** Stacked two-column: left rail eyebrow + H2 + lead ("Every dot on the map is a dossier like this one"); right = the annotated cell miniature using the real locked primitives shrunk down (distribution curve from **L8**, donut from **L7**, a verdict line). Callout leaders in 1px cocoa, labels in atlas eyebrow style. This is an authored, bespoke figure, the antithesis of a card grid.
- **Group/placement:** HOW IT WORKS.

### 5. World map city picker
- **Role:** Make coverage tangible and *honest*: show where data actually is, let the reader click into a place, and state the real count instead of implying global completeness.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No, but it would become pathetic if it faked a fully-lit world; the honest density + count is what makes it credible.
- **Shows:** The stylized world map with **muted dots at real covered metros**, a few **terracotta accent pins** on the deepest-coverage cities (London, the US flagships), an honest one-line count ("Real data in 120 cities across 55 countries, and filling in weekly"), and a **plain list fallback** below for accessibility and for places without a pin.
- **Visual:** Locked world-map motif promoted to interactive here (its one foreground use). Muted dots = cocoa-300; accent pins = atlas, reserved for genuine depth only (honesty: a pin must mean real data, never a placeholder). The map never shades countries by a measured value. List fallback is a simple zebra-free link column. Hover on a dot shows the city + its one headline metric.
- **Group/placement:** HOW IT WORKS.

### 6. How we get to the number (trust strip)
- **Role:** Disarm the "you're just guessing" objection in one calm strip; the site-wide trust layer's home appearance.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: for P2/P3 this is the section that decides trust; it is the opposite of pathetic, it is the credibility spine.
- **Shows:** A three-step micro-diagram, "raw signals → blended typical + spread → an honest read," with one line on what "held vs modeled" means and a link to full Methodology. No source-agency names (hard constraint).
- **Visual:** Stacked, full-width, three-node horizontal **micro-flow** (shadcnblocks stepper/timeline shape), each node a chip with the one line-icon family. Calm cocoa/ink, one atlas tick on the final "honest read" node. Quiet, not loud, this is reassurance, not a sales pitch.
- **Group/placement:** HOW IT WORKS.

### 7. The honest read (pull-quote)
- **Role:** Show the irreplaceable editorial judgment, the human voice no scraper has; the emotional turn of the page.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it is the brand's soul, the one place we say the quiet part out loud.
- **Shows:** One Newsreader pull-quote in the voice of the product, e.g. "A high revenue can hide a thin business. We tell you what is left after the rent, the staff, and the tax, even when the number is uncomfortable." Attributed to the editorial stance, not a fake person (honesty: no fabricated operator quotes).
- **Visual:** Airy, single-focal card on warm `atlas-50` ground, Newsreader `clamp(20px,2.6vw,28px)`, max 26ch measure, generous padding. The deliberate breath between the dense how-it-works cards and the who/pricing movement. Second accent divider after this, opening WHO + WHY YOU'D PAY.
- **Group/placement:** HOW IT WORKS → bridge.

### 8. Like-for-like demo (state / place comparison)
- **Role:** Demonstrate the one legitimate comparison the site makes, and the honesty of it ("here's the gap, and here's *why*"), so the reader trusts every later ranking.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it is a working demo of the core analytical move, with the why-line that separates us from a league-table content farm.
- **Shows:** Same trade, same currency, a handful of US states (or UK regions) on **take-home**, not revenue, with a one-line "why the gap" beneath ("lower rent and no state income tax lift the kept figure, even on similar sales").
- **Visual:** Locked **L4 ranked bars**, one shared scale, subject in atlas, peers in cocoa, **no crown** (honesty: not a winner). A leading caveat: "read each on its own terms, not a league table." Two-column: left = the why-line + caveat, right = the bars.
- **Group/placement:** WHY YOU'D PAY.

### 9. Audience band
- **Role:** Let each reader self-identify and see the product is built for them; frame buyers as clients, not subjects.
- **Sanity verdict:** SUPPORTING. Is this pathetic? It would be as four identical "we help X" tiles; it earns its place only because each card carries a *specific* job-to-be-done and a real destination link, not a slogan.
- **Shows:** Four audiences with a concrete job each: **Owners & operators** ("see what you'd keep before you commit" → a cell), **Lenders & franchises** ("benchmark a borrower's trade in their market" → a country), **Advisors & investors** ("scan a market's economics fast" → Compare), **Movers & relocators** ("compare what a trade pays across places" → a city). Consulting/PE framed as clients ("for the teams advising them"), never badmouthed or analyzed.
- **Visual:** shadcnblocks `feature43` 4-up, but broken from sameness: each card uses a *distinct* line-icon, a distinct one-line proof-metric, and a distinct destination, so it reads authored not templated. Icons from the one family; no emoji.
- **Group/placement:** WHO.

### 10. Pricing teaser (slim strip)
- **Role:** Set the money expectation honestly and low-friction: free to read, paid for depth; defer the full table to /pricing.
- **Sanity verdict:** SUPPORTING. Is this pathetic? A full three-tier table here would be premature and pushy; slimmed to a one-line strip it earns its place by removing a purchase-anxiety blocker.
- **Shows:** "Free to read every benchmark. Paid plans add export, alerts, and the full dossier depth." One link to /pricing. No tier cards, no feature matrix.
- **Visual:** A single calm horizontal strip (NOT a `pricing2` table here), one moss "Free to read" emphasis, one atlas text link to full pricing. Deliberately understated so it doesn't read as a paywall slap.
- **Group/placement:** WHY YOU'D PAY. Third accent divider after this, opening STAY.

### 11. Newsletter / free report
- **Role:** Capture the not-ready-to-buy reader with a genuine value exchange, and prove the payload is real.
- **Sanity verdict:** SUPPORTING. Is this pathetic? An empty "subscribe for updates" box would be; this earns its place by previewing a *real* per-$100 payload so the exchange is honest and concrete.
- **Shows:** One email input + button ("Get new places and trades as we add them"), beside a small real preview of what a subscriber gets (a per-$100 money-split thumbnail from a real cell).
- **Visual:** Two-column: left = the capture (shadcnblocks newsletter block), right = the real per-$100 **donut thumbnail** (L7) as the payload proof. Honesty-safe copy; one moss kept-slice in the thumbnail.
- **Group/placement:** STAY.

### 12. Blog rail
- **Role:** Show the site is alive and editorially active, and feed SEO; placed low so card grids don't stack against the audience/feature grid.
- **Sanity verdict:** SUPPORTING / CUT-IF-THIN. Is this pathetic? It is, if it's three lorem cards; it ships only when there are three real, dated, substantive posts, otherwise it collapses out entirely (no ghost cards).
- **Shows:** Three latest posts, real titles, dates, one-line decks, reading-time.
- **Visual:** shadcnblocks 3-up blog cards, varied by a real lead figure or kicker per post so they aren't identical tiles. If fewer than three real posts exist, the whole section is omitted, not padded.
- **Group/placement:** STAY.

### 13. Footer (rich, multi-column)
- **Role:** Deep wayfinding, the newsletter backstop, and the honest legal/disclosure strip.
- **Sanity verdict:** ESSENTIAL. Is this pathetic? No: it is the catalog's index and the honesty disclosure, both load-bearing.
- **Shows:** Brand column + blurb ("What a business really earns, and what the owner keeps, place by place"); **Explore** (Countries / Cities / Industries / Compare); **Product** (Pricing / The data / Methodology); **Company** (About / Blog / Contact); a newsletter capture; a legal strip carrying the exemplar/modeled caveat and copyright.
- **Visual:** Locked **L14 newsletter-forward footer** (`footer7`), ink-900 ground, atlas-300 accent on dark, the standard responsive column collapse. Honest legal strip is mandatory, not optional.
- **Group/placement:** STAY (chrome).

---

## Related links and cross-page hand-offs
The home page is the catalog's hub, so it links out more than any other page, in five deliberate channels:
- **Navbar mega-menus** (section 1): every dropdown previews top entities AND carries an "All [type]" link, so a reader reaches Countries, Industries, Cities, and Compare from the first screen.
- **The example triptych** (section 3): each of the three tiles deep-links to its *real* page, a cell, a scored city, and a neighbourhood, so the proof is also a doorway.
- **The world map + list fallback** (section 5): every dot and every list row links to a real city/country page; the few accent pins go to the deepest cells.
- **The audience band** (section 9): each of the four cards routes its reader to the page type that serves them (owner → cell, lender → country, advisor → Compare, mover → city), turning self-identification into navigation.
- **The footer** (section 13): the full index, four columns of links, plus Methodology and About for the trust-seeking reader.
- **One terracotta CTA discipline:** despite all this linking, only ONE loud CTA renders per screen (the hero search, then later the "Start free" pill); every other link is a calm text or tile link, so the accent budget is never blown.

## What was WRONG in the rejected build, and the fix
- **Pathetic equal-weight tiles.** The rejected front door used flat stat cards with no good/bad orientation ("active businesses: 2.7M", "consumer card spend: High"). **Fix:** the coverage scorecard now leads with the one number that proves scale and marks promises in moss vs facts in ink; the example triptych carries real ratings with calibrated words and spectrum markers.
- **No metric rating, no hierarchy.** Every number read as equal weight. **Fix:** register-two rating system, decisive numbers lead at 28px Newsreader with a gradient-spectrum read, supporting numbers shrink to 14px; cost never moss, kept always moss.
- **Bare ranges instead of structure.** Comparisons were "low to high" with no why. **Fix:** the like-for-like demo is on take-home (not revenue), with a mandatory "why the gap" line and the not-a-league-table caveat.
- **Dropped depth proof.** The rejected build had no "anatomy of a benchmark," so a cold reader never learned a cell is a dossier. **Fix:** section 4 restores it as a bespoke annotated figure, the single strongest conversion argument.
- **A fake-lit map.** Coverage was implied as global. **Fix:** honest density dots, accent pins only where data is genuinely deep, a real count line, and a list fallback.
- **Identical card grids stacked.** Audience, blog, and pricing all rendered as the same 3/4-up tile grid back to back. **Fix:** the blog rail moved low, pricing slimmed to a one-line strip (no table), and the audience cards each carry a distinct icon, proof-metric, and destination so no two grids read the same.
- **No honest read, no soul.** The rejected page was all robot. **Fix:** the editorial pull-quote (section 7) and the calm trust strip (section 6) carry the human, honest voice that is the brand's actual moat.

## Open questions for the founder
1. **Hero scorecard counts:** confirm whether to publish the *exact* live inventory figures (benchmarks held, cities, countries, trades) on the home hero, or rounded "growing" framings, since exact numbers must match the build inventory every deploy or they become a maintenance liability and an honesty risk.
2. **Map accent-pin threshold:** what depth-of-data bar earns a city a terracotta pin versus a muted dot? I propose "a fully-held flagship cell," but the cutoff is a judgment call that affects how full the map honestly looks.
3. **Newsletter payload:** is the per-$100 donut thumbnail an acceptable real payload to promise subscribers, or should the value exchange be a different held artifact (e.g. a monthly "new places" digest) so we never over-promise the email's contents?
