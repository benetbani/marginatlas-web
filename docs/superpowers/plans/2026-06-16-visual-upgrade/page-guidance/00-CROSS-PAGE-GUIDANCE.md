# Cross-page guidance

This is the binding layer that sits above the six per-page docs. Where a page doc and this doc conflict, this doc wins. Its job is to make the seven page types feel like one product built by one hand: one rating system, one hero pattern, one section library, one honesty contract, one rhythm. The six docs already agree on most of this; my job here is to rule on the seams, kill the duplication, and hand the founder a small set of decisions.

## The metric-rating / good-bad system (THE spec)

This is the system the founder said was missing from the pilot. It is the single most load-bearing decision in the whole product, so it is specced first and exactly. Every number on the site is rated by the same machine.

### The core rule

A number alone is not allowed. Every key metric ships as a triple: **value + calibrated read + signal**, and good/bad is always carried by at least two of the three channels, never by color alone (WCAG AA, and color-blind readers must get the verdict from the word).

The three channels:

1. **The calibrated word.** A one-word read drawn from one of exactly two vocabularies (no third scale is permitted anywhere on the site):
   - **"More is better" metrics** (margin, take-home, wealth, demand, survival, GDP per capita, score): **weak / fair / strong / excellent**.
   - **"Less is better" / cost-and-friction metrics** (rent, cost to open, months to break even, days to start where slow is bad, cost of living): **friendly / fair / dear / steep / slow**. Pick the word that fits the axis; "slow" for time, "steep"/"dear" for money, "friendly" as the good pole.
   - **Neutral facts** (population, minimum wage as a legal fact, economic tags): **no rated word at all.** They get a contextual label ("the home market", "set by law") in cocoa, never a rung color. A neutral metric that cannot earn a good/bad read is a candidate for the pathetic filter (below), not for a fake rating.

2. **The color.** A fixed, tiny palette, used only as reinforcement:
   - **moss** = good / kept / positive only.
   - **amber** = caution.
   - **terracotta (atlas)** = the *subject* marker only (this place, this trade), never "good".
   - **cocoa / ink / cream** = the mass, the neutral, the supporting.
   - Rule the docs already imply, now made binding: **cost numbers never get moss.** Only the kept/positive number is allowed the good color. The neighbourhood doc is right that moss must be withheld entirely on relative pages (a lift is not kept money) — generalize that: moss appears only where real retained money or a genuinely-good rated quality is shown.

3. **The instrument.** How a *rating* is drawn:
   - A rated **quality on a continuum** (difficulty to break in, the country-shape lenses, character, operator spread, owner-vs-salary) uses the **L5 gradient spectrum**: a continuous gray (bad, always LEFT) to moss (good, always RIGHT) track with a terracotta marker at the true position.
   - A rated **snapshot value in a scorecard tile** uses the word + color + a very-low-opacity background band-tint (the country doc's word+glyph+tint). It does not get a spectrum, because a scorecard tile labels a value, not a position on a quality axis.
   - **The 4-level pip / segmented meter (●●●○) is BANNED site-wide.** This is absolute. Every place the pilot or an older build used pips moves to the gradient spectrum.

### Weight: decisive leads, supporting follows

Numbers are not equal weight, and the layout must prove it. Across every page:

- **Decisive metrics** (the ones that change the buy/no-buy decision) **lead**: biggest type, first position, the atlas-tinted focal tile, full `--shadow-card`. There are at most two lead metrics per scorecard.
- **Supporting metrics** are a clear step smaller, calm, lighter shadow.
- **Quiet metrics** (context, method, the close) get the least weight.

The decisive metric per page type is fixed so the whole site reads consistently:

| Page | Lead metric(s) | The truth it must tell first |
|---|---|---|
| Home | Benchmarks held (scale) + "free to read" | this is a real, honest, free catalog |
| Country | Net wealth/adult + Days to start (in the scorecard); tax 19% as the hero anchor | can customers pay, can I start |
| Industry | Typical margin + kept-per-$100 (paired focal tile) | this trade is margin-poor |
| City | Business Climate Score (the only scored number on the site) | is this metro friendly and deep |
| Neighbourhood | Top-trade lift + most-squeezed trade (paired) | a district lifts some trades at the cost of others |
| Cell | The GAP: revenue vs take-home ($503K in, $48K kept) | what comes in is not what you keep |

The cross-page law that binds all of these: **revenue is the size, take-home/margin is the truth, and size is never allowed to read as success on its own.** The cell and industry docs state this explicitly; it is hereby the rule for every page that shows money.

### Levels, never bare ranges

Wherever a page shows pay, it shows **levels** (roles, or junior/mid/senior) on **one shared scale** with the spread and a median marker, never "low to high". The canonical instrument is the shared-scale dumbbell/floating-range row. The owner's own draw is plotted on the same scale wherever the trade has an owner (cell and industry), because "the owner can out-earn nobody" is the editorial punchline. This kills the "$24K to $60K" sin in every doc at once.

## The hero pattern (every page type)

Every page opens with the **same two-part hero**: a full-bleed place/subject image, and an at-a-glance scorecard with rated tiles over it. This is the #1 fix across all six docs — the pilot shipped flat, image-less, rating-less heroes.

### Part 1: the full-bleed image

- **Country / City / Neighbourhood: a real place photograph**, full-bleed, warm-graded toward the paper palette, with a base scrim (`ink-900`/`atlas-50` to transparent) so type clears WCAG AA. The map motif and locator pin ride *on top* at low opacity as texture, never as the foreground and never encoding a value.
- **Industry: a photograph of the craft, not a place** (a kitchen pass mid-service for restaurants). This is the deliberate distinction from the cell: the cell shows *where*, the industry shows *what*.
- **Cell: a faint place image of the city** behind the answer (London skyline, low opacity), because the cell is a trade *in a place*.
- **Home: the stylized world-map motif at full strength is the place-image equivalent.** No single city photo (it would misrepresent scope). This is the one page where the map is the hero texture.

Ruling on the recurring open question (all six docs ask it): **until licensed imagery exists, every image hero falls back to the engraved/world-map-motif treatment, still full-bleed, still scrimmed, still carrying the scorecard.** We do not block the rebuild on photography. The image is a swap-in slot; the layout ships now with the motif fallback. Image sourcing is decision #1 for the founder below. On-brand honest sourcing options, in order of preference: (a) a licensed stock set (the photo must be representative, never implying a specific claim); (b) a commissioned warm-grade set in phase 2; (c) the engraved-illustration/motif fallback indefinitely if neither lands. The image is decoration and identity only — it never carries data, so honesty is preserved regardless of source.

### Part 2: the at-a-glance scorecard

Every page has a scorecard, but the *metrics differ by what the page can honestly rate*. The country's recovered 8-metric vital-signs grid is the **canonical pattern**; each other page type carries its own equivalent, all built on the locked L3 lead-plus-supporting tile grammar with the rating system above.

- **Country (8, restored exactly as the founder specified):** GDP per capita ($49K, Strong), average salary ($44K, Strong), net wealth/adult ($172K, Excellent), days to start (4, Strong), ease of business (83/100, Strong), minimum wage ($25K/yr, neutral), population (68.3M, neutral/home market), cost of living (78/100 — see ruling below). Lead tiles: net wealth + days to start.
- **City (8):** Climate Score (lead), median income, net wealth/adult, rent character, cost of living, demand depth, money to open, months to break even.
- **Industry (4):** typical margin + kept-per-$100 (paired lead), one-year survival, capital to start.
- **Cell (5):** the GAP/take-home (lead), net margin, difficulty, break-even, payback.
- **Neighbourhood (relational, not absolute):** the two-marker multiplier gauge (top lift + most-squeezed) as the lead, plus a three-weight character pill row. A district has no GDP or population by design.
- **Home (coverage/proof, 6):** benchmarks held (lead), countries, cities, trades, "free to read", "0 guessed".

**Ruling on cost-of-living direction** (country doc's open question 2, and it affects city too): a higher cost of living is *worse for an operator*. It must rate on the "less is better" scale — **78/100 reads "dear/fair-leaning-caution" in amber, not a neutral fact.** An honest good/bad cue cannot call an operator-hostile number neutral. This overrides the country doc's "neutral" tag for that one tile.

**Ruling on the cell scorecard count:** 5 is correct, not 8. The country's other three slots (population, ease-of-business, etc.) are not cell-level decisions. Each page type carries the scorecard that matches its honest decision set; do not force 8 everywhere.

**Population is never a lead tile on any page.** It is a smart-reader-already-knows fact (the pathetic filter). It survives only as a neutral context line, never in big type. This is consistent across country (demoted into the merged market read), city (a one-line context stat), and is the rule.

## The shared section library

Several sections recur across page types. Each has **one canonical owner** that carries the full treatment; everywhere else it is a lighter echo that links to the owner. This kills cross-page restatement, the founder's "redundancy" complaint.

| Section | Canonical owner | How other pages handle it |
|---|---|---|
| **Take-home in real money** | **Cell** | Country/city/industry show it *illustratively or as a range* and hard-link DOWN to the cell for the live number. No page above the cell prints take-home as if it owned it. |
| **Business Climate Score** | **City** (the only scored entity on the site) | Country links down; cell sends difficulty UP to the city; neighbourhood notes "the score lives at the city". Nothing else prints a /100. |
| **The money split (per $100)** | **Cell** (donut + companion bar) and **Industry** (donut, structural) | Home shows a thumbnail as newsletter payload; nobody else owns it. Cell and industry use the *same* donut grammar with different data. |
| **The flow of a sale (funnel)** | **Industry** | Unique to industry; cell uses the donut, not the funnel, so the two pages don't duplicate. |
| **Pay by level/role** | **Cell** (this trade here) and **Industry** (this trade nationally) | Country shows wage *floor/typical/senior* as a country fact; city does not own pay. Cell links the owner-draw twist UP to industry. |
| **Cost to set up / cost to open** | **Country** (rules + formation tiers) + **Cell** (capital to open + ramp) + **City** (money-to-open range) | Three honest altitudes: country = legal/formation, city = typical capital band, cell = the itemized number. Each links, none restates. |
| **The honest take** | **Every page owns its own** | This is the brand soul; it is the one section that is deliberately NOT de-duplicated, because each altitude's verdict differs. Each must be falsifiable and specific, never boilerplate. |
| **Like-for-like comparison** | Owned at each altitude, but the *rule* is shared: country vs neighbours, city vs peer cities, cell vs same-trade-nearby, industry vs US states | **Cities are the ONLY entity that may be crowned with a leader mark.** Every other comparison is "read each on its own terms, not a league table", subject tinted atlas, peers cocoa, no crown. |
| **How we get to the number (trust layer)** | **Site-wide component**, identical on every page | One expandable held-vs-modeled note with confidence chips. Same component, same copy frame, no source-agency names. Monetizable. |
| **One thing to remember (closer)** | **Every page owns its own** | The one Newsreader closing line, forward-looking instruction, distinct from the honest-take diagnosis. Always paired with freshness stamp + flag-it. |
| **Navbar / footer** | **Site-wide chrome** | `navbar1` classic centered + `footer7` newsletter-forward, identical everywhere. |
| **Collapse strip ("still filling in")** | **Site-wide mechanism** | ONE calm cream strip absorbs all unheld sections. Never separate ghost/sample cards. Identical behavior on every page. |

The binding redundancy law: **a fact is owned once, at the altitude where it is most true, and linked everywhere else.** Take-home is owned by the cell. Score by the city. Structural shape by the industry. Rules by the country. Relative lift by the neighbourhood. Everything above an owned fact links down rather than restating.

## The "is this pathetic?" filter, applied

Run every candidate section and card through this gate. If it fails any line, cut it or merge it.

**The checklist (a card must pass ALL):**
1. **Would a smart reader already know this, or guess it?** (Population, "businesses exist", "card spend: High" — fail.)
2. **Does a real decision change based on this number?** If no decision moves, cut.
3. **Does it carry a good/bad signal?** A number with no rating is a stat, not a read. Either rate it or cut it.
4. **Is it specific to this place/trade, or generic boilerplate?** Generic risk copy, platitude verdicts — fail.
5. **Does it duplicate an owned section?** If another page owns it, link, don't restate.
6. **Is it a lone fact dressed as a section?** A single number is not a section; merge it into a band with its implication, or cut.

**The banned card types (failed in the pilot, banned until they carry a real role):**
- **"Population 2.7M / 68.3M" as a standalone hero number** — banned; survives only as a neutral context line.
- **"Active businesses: 2.7M"** — banned outright (pathetic, decides nothing).
- **"Consumer card spend: High" / "consumer spend: High"** — banned (qualitative no-signal stat).
- **"Minimum wage rising steadily" as a flat statement** — banned; only survives as the *trend sparkline* showing the actual slope.
- **"Asset-light: yes" / bare "net margin 7%" with no orientation** — banned; every metric must carry a calibrated read.
- **Any no-number qualitative-word grid** (the pale 5-spectrum strips) — banned; restored only as dense rated spectrum tables.
- **Bare ranges ("$24K to $60K", "low to high")** — banned; replaced by levels on a shared scale.
- **Bar soup / restatement loops** (ranking the same cost lines twice) — banned; a second look at the same data must be a genuinely new frame (e.g. sensitivity, not a re-rank).
- **Identical icon+heading+text card grids repeated** — banned; each section gets a distinct instrument.
- **Separate "sample / coming soon" ghost cards** — banned; all unheld content collapses into the one strip.
- **Revenue led alone as the headline** — banned; the hero leads with the gap or the kept figure.

The discipline the founder wants: a long page is long because it has **many sections that each earn their place**, not because it pads with pathetic tiles. Length comes from real depth, never from filler.

## Long-page rhythm

These pages are deliberately long and substantial. They stay skimmable through four shared devices.

1. **Movements.** Every page groups its sections into 4–7 named movements with a consistent spine: **the answer → the mechanics → the reality/variation → context, trust, and the close.** The reader always knows which act they are in. (Country: answer/shape/cost-and-keep/people/market/place/close. Cell: the answer/who-pays/is-it-worth-it/the-numbers/context. Same skeleton, page-specific flesh.)

2. **A sticky section-anchor rail** under the hero on the long pages (country, cell), so a skimmer can jump. Active-section highlight in atlas. This is the price of admission for length — without it, P3/P4 readers bounce.

3. **Loud/quiet cadence (A-B-A-B).** Never stack three heavy data cards in a row. Each dense data band is followed by a quiet prose band (honest-take, a closer, a pull-quote) to let the reader breathe. The airy prose cards are the deliberate palate change.

4. **Distinct silhouette per section.** No two adjacent cards share a shape. The locked instrument set rotates: density curve, donut + companion bar, funnel, diverging bars, ranked bars, threshold gauge, severity ladder, dumbbell rows, gradient area, range strip, zebra table, icon-list, spectrum stack. If two adjacent sections would draw the same shape, one must change instrument or merge. This is the single strongest defense against the "AI made that" test.

5. **Hierarchy is carried by size, weight, spacing, and contrast — never color.** Newsreader serif is rationed to exactly three moments per page: the hero name/number, the one anchor figure, and the closing line. Everything else is Inter. Section headers drop to tile scale; leads become one short line, never a paragraph-per-section essay (the pilot's "AI-essay" tell).

## Asset + liveness plan

The pages must feel alive and authored, not robotic. We do this with the bought blocks, the universal visual assets, and the locked instrument kit — never by inventing new visuals.

**Use the bought shadcnblocks heavily, re-skinned to tokens:**
- `hero` / `hero2` (image-background variant) → every page masthead.
- `stats-card1` → the scorecard tile clusters (L3 lead+supporting).
- `chart-card1` → the data-band shells around the instruments.
- `data-table1` → the zebra comparison tables and the folded precise-figure tables.
- `cta10` → the calm honest-take and closer accent panels (buttons omitted).
- `feature43` → the audience band and sibling-trade tiles (broken from sameness: distinct icon + proof-metric + destination per card).
- `pricing2` → reserved for /pricing only; the home gets a one-line strip, not a table.
- `navbar1` + `footer7` → site-wide chrome.
- newsletter block + blog 3-up → home STAY movement.

**Universal visual assets (the locked vocabulary, applied consistently):**
- **Place imagery** in every hero (with the motif fallback).
- **The stylized world-map motif** as texture in heroes (full strength only on home, where it is the hero), and promoted to one interactive foreground use on the home city-picker map (honest density dots + accent pins where data is genuinely deep, real count line, list fallback — never a fake-lit choropleth).
- **One icon family** (line icons) across all glyph-led lists, audience cards, and unit cards. No emoji, ever.
- **The instrument kit** is shared coded components, generated once and reused across pages with different data — not hand-drawn per instance. This is what makes the site cohere and what makes it maintainable.

**Buy vs build:**
- **Buy / source:** shadcnblocks ($149, already approved); place imagery (licensed set or commission); the icon family (one paid or open set).
- **Build:** the instrument kit (the charts are the soul, not buyable), the scorecard rating component, the collapse-strip mechanism, the trust-layer component, the home anatomy-of-a-benchmark bespoke figure.
- **Do not buy / do not invent:** no new visual vocabulary beyond the locked set; the "soul" charts stay in-house; nothing ports from the stale design-export sets.

## Top decisions for the founder

1. **Hero imagery (gates the "alive" feeling on every page).** Approve a licensed stock-image set now, commission a warm-grade set in phase 2, or ship the world-map-motif fallback indefinitely? The layout ships either way; this only decides whether heroes carry photos.
2. **Cost-of-living rates as caution, not neutral.** Confirm: a high cost of living rates amber on the "less is better" scale (operator-hostile), overriding the "neutral fact" tag. Applies to country and city scorecards.
3. **The cell scorecard is 5 metrics, the country's is 8, each page carries its own honest set.** Confirm we do not force 8 everywhere.
4. **Cities are the only entity that may carry a leader mark / a /100 score.** Every other comparison is "not a league table". Confirm this as the site-wide honesty law.
5. **Take-home in real money is owned by the cell only.** Country/city/industry show it illustratively-or-as-a-range and link down. Confirm no page above the cell prints take-home as its own number.
6. **Modeled-and-tagged figures may ship on flagship pages** (cost-to-open, months-to-break-even, valuation/exit, saturation), clearly labeled modeled, rather than waiting for measured data. Confirm, or hold any of these to exemplar-only.
7. **The newsletter payload is a real per-$100 donut thumbnail.** Confirm this is an acceptable honest promise, or name a different held artifact.
8. **Home hero counts come live from build inventory, exact, not rounded.** Confirm we publish exact figures (with the maintenance discipline that implies) rather than "growing" framings.
9. **The map accent-pin threshold = "a fully-held flagship cell".** Confirm the bar that earns a city a terracotta pin vs a muted dot.
10. **Newsreader serif is rationed to three moments per page** (hero name/number, anchor figure, closing line); everything else is Inter. Confirm this typographic discipline as the site-wide rule.
