# City page , architecture guidance

## Who is here, and the decision they make
The dominant reader is the prospective owner in scouting mode, deciding whether this metro is worth committing capital and years to before they ever pick a trade; their question is "is this a friendly, deep market to open a small business in, and what will the place itself, the rent, the footfall, the competition, do to my odds?" Behind them, the curious or search arrival wants a satisfying, shareable verdict on "how good is London for business," and the analyst or advisor wants a fast market read on a metro they are underwriting or briefing a client on. Everyone is answering the same one question at a different depth, so the page is a market briefing built around a single verdict, not a trade-level P&L (that lives one click down on the cell).

## The page's one job
Tell an operator, in one scrollable briefing, whether this metro is a friendly and deep market to open a small business in, who they would be selling to, and what the place itself will do to their odds, anchored on the one number Atlas gives a city: its Business Climate Score.

## The hero
Full-bleed masthead on the warm `linear-gradient(to bottom, atlas-50, cream-75)` ground with the faint stylized world-map motif behind it at low opacity (the one place that motif appears on the page) and a small country-flag locator glyph. It is the one full-bleed exception to the card-per-section frame. Two movements share the band:

1. The verdict moment (the LEAD): the country eyebrow (United Kingdom, Union Jack), the verdict sentence the score generates ("London is a strong place to start a small business, if you can fund a slow start"), and the one Newsreader hero number on the entire page, the Business Climate Score (78), sitting on its 0-to-100 ScoreBand with faint peer-city ticks (Paris 74, Amsterdam 73, Berlin 71, Dublin 69). The caption names the one tension that produced the number ("Business Climate Score. Deep demand, expensive ground."). Cities are the ONLY scored entity, so this number is load-bearing and gets the page's single biggest type.

2. The at-a-glance city scorecard (the city's equivalent of the recovered country 8-metric scorecard), a strip of small bordered stat tiles, each carrying its calibrated good/bad read so a non-business reader instantly knows if the number is friendly or hostile. The eight city vital signs:

| Metric | Exemplar (London) | Read | Why it earns the tile |
|---|---|---|---|
| Business Climate Score | 78 / 100 | Strong (the lead, owns the band above) | the one verdict |
| Median resident income | $52K | Fair | how deep the everyday wallet is |
| Net wealth per adult | $220K | Strong | the premium tail that premium trades live on |
| Commercial rent character | 132 vs 100 | Dear (caution) | the first line of the budget |
| Cost of living | 78 / 100 | Fair | what a salary actually buys here |
| Demand depth | Deep | Excellent | breadth of reliable customers |
| Money to open (typical) | $90K to $260K | Steep (caution) | the cost of entry |
| Months to break even | 14 to 22 | Slow (caution) | the slow start, quantified |

The score and net-wealth tiles read positive (moss-leaning), the rent, cost-to-open, and break-even tiles read caution (amber marker), so the reader sees the page's whole thesis, deep demand against expensive, slow ground, in one glance before scrolling. Raw population is deliberately NOT a hero tile (it is city trivia a smart reader already knows or can guess); it survives only as a one-line context stat beside the band, never in big type.

## The metric-rating system on this page
Good and bad are signalled three ways, never by color alone (color is the reinforcement, not the carrier). First, position and size: the Climate Score is the lone Newsreader hero number and everything else is Inter, so nothing competes with the verdict; within the scorecard the score tile is the focal lead and the seven others are equal-weight supporting stats. Second, a one-word calibrated read under each stat (weak / fair / strong / excellent for "more is better" metrics; friendly / fair / dear / steep / slow for cost-and-friction metrics where less is better), so the orientation is in words, legible without color. Third, the locked GRADIENT SPECTRUM (L5) wherever a quality is rated: a continuous gray-to-moss track with the negative pole always LEFT and the positive pole always RIGHT, a computed atlas marker at the true position. The 4-level pip rows and segment meters are BANNED site-wide (L6), so the old "rent ●●●●" idiom is replaced by tiny gradient mini-spectra.

Decisive metrics LEAD: the Climate Score (hero), the take-home menu across trades (the payoff), and the where-to-set-up shortlist (the action) carry the most ink and the signature graphics. Supporting metrics (the customer band's income spread, the cost character, the visitor split) are smaller and ride beside a verbal frame. Quiet metrics (context stats, the change rail, the close) get the least weight. The accent budget holds: terracotta marks the subject only (the score marker, the subject bar, one CTA), moss only on a kept slice or a rising trend, amber only on a caution marker; cocoa and ink and cream carry the mass.

## The full section list (LONG, in order)
The approved-reform file compresses City to ten beats by merging three customer sections into one band and folding several into others. I keep every one of those jobs, but break the over-merged bands back into legible, distinct sections and restore the at-a-glance scorecard, so the page reads as a long, complete briefing without restatement loops. The page's rhythm alternates heavy data bands with quiet prose bands (A-B-A-B) for breathing room.

### 0. Global navbar + breadcrumb (chrome)
- Role: orient and let the reader move up to country, down to cell and neighbourhood, sideways to peers; the breadcrumb is load-bearing on a deeply nested site.
- Sanity verdict: ESSENTIAL. Not pathetic: it is the only upward and lateral nav on the page.
- Shows: logo, topic dropdowns (Countries, Industries, Cities, Compare), search, one primary CTA; Home / Cities / London crumb.
- Visual: shadcnblocks `navbar1` (classic centered, L13), sticky cream-75 blurred with a hairline bottom; mobile sheet built in. Not a card.
- Group/placement: top chrome.

### 1. Hero + Business Climate Score + at-a-glance scorecard
- Role: deliver the one-number verdict and the eight-metric glance that frames the whole page.
- Sanity verdict: ESSENTIAL. Not pathetic: this is the entire reason the page exists; the score is the site's only scored entity.
- Shows: country eyebrow + flag; verdict sentence; the score (78) on a 0-to-100 ScoreBand with peer ticks; the 8-metric scorecard with reads; one quiet context line (population 8.9M, etc.).
- Visual: one Newsreader hero number + the kit `ScoreBand` (atlas subject marker, faint ink peer ticks, gray-to-moss band ramp, "same 0 to 100 scale, only cities are scored"); the scorecard is the locked L3 lead-plus-supporting tile cluster (score tile focal/atlas-tinted, seven supporting tiles each with its one-word read). The optional re-skinned radial is CUT: a lone radial gives no peer context and reads as a vanity dial. Two-column at 1280 (verdict + score left, scorecard tiles right), stacked at 375.
- Group/placement: Movement I, the verdict.

### 2. The honest take
- Role: the editorial conscience, the one panel that tells the truth the score cannot ("rewards the capitalised, punishes the under-funded").
- Sanity verdict: ESSENTIAL. Not pathetic: this is the brand's whole differentiator versus a stats dashboard; every bullet must be falsifiable and specific to this metro, never a platitude.
- Shows: a Newsreader verdict line + up to three metro-specific bullets.
- Visual: shadcnblocks `cta10` calm accent panel (atlas-50 ground, buttons omitted), stacked, tight 60ch measure. Prose-as-signal, no chart. London-exemplar; verdict-only on thinner cities.
- Group/placement: Movement I, the verdict (the prose beat after the data hero).

### 3. Who the local customer is (income spread)
- Role: tell the operator who they are selling to, how deep and how skewed the local wallet is, the input a premium-versus-value concept needs.
- Sanity verdict: ESSENTIAL. Not pathetic: a smart reader does NOT already know the income spread; the long top tail to $140K+ is the surprising, decision-changing fact, and it leads with a so-what ("a broad middle plus a deep luxury tail, so both value and premium can find a base").
- Shows: median resident income + a second operator-legible stat (disposable or cost-adjusted spending power, replacing the abstract net-wealth-per-adult per the analysis), and the income spread p10 to median to p90.
- Visual: the kit `RangeStrip` (cocoa span, lone atlas median tick at the computed 24.1%), beside two key stats in a `chart-card1` shell. Two-column at 1280, stacked at 375. Real spread for London only; the strip self-omits elsewhere and the two stats still carry the band.
- Group/placement: Movement II, the customer.

### 4. What that income buys, and tourist money vs local money
- Role: in one band, translate nominal income into real local buying power (the cost character) AND tell the operator whether they are building for steady residents or seasonal visitors. This is the merge the analysis demands: two thin one-fact sections become one sharp band.
- Sanity verdict: SUPPORTING. Not pathetic: the bare "132 vs 100" or a lone "Residents 72%" each fails the sanity test alone; together, framed as implications, they answer "is this a rich customer or just a high-salary one, and will my trade be steady or seasonal?"
- Shows: the cost-of-the-ground character (132 vs 100 baseline, with the surprising prime-versus-side-street gap led, not the bare index), and the residents-vs-visitors footfall split (72% / 28%).
- Visual: a small two-ended relative cost mini-scale (national norm 100, this city 132, prime street ~180), explicitly labelled relative and deliberately NOT a rent quote, beside the kit `VisitorSplit` one proportion bar (resident slice atlas-accented, never a pie; note "a rough share of footfall, not spend"). Stacked card with the two reads side by side at 1280. Both modeled, both always rendered.
- Group/placement: Movement II, the customer.

### 5. How crowded the field is (saturation, NEW)
- Role: answer P1's first instinct, "how many of my trade already exist here, is the market saturated or under-served?" The biggest gap in the old page.
- Sanity verdict: ESSENTIAL (new). Not pathetic: nothing else on the page tells the operator how contested the market is; "what owners keep" is meaningless without "can I even get a foothold."
- Shows: per trade, a density-vs-norm read (over-supplied / balanced / white space), modeled.
- Visual: the locked diverging-bars idiom (L12) on a balanced-market centre line, over-supplied trades extending one way in cocoa, under-served extending the other, the subject trade in atlas; or per-trade chips on the §6 rows if data is thin. Framed as a density character, never a precise count, never a cross-city ranking. Stacked.
- Group/placement: Movement III, the payoff (sits just before the take-home menu so "how contested" reads before "what you keep").

### 6. What owners keep across trades
- Role: the payoff, what owners actually take home across the everyday trades here, with a difficulty read and a click into the full P&L. The most monetizable section.
- Sanity verdict: ESSENTIAL (a heavy data band). Not pathetic: real cell-engine numbers ranked by take-home with a break-in chip; the single most decision-grade thing after the score.
- Shows: per trade, net margin, after-tax owner take-home (as a range, not a single deterministic figure), a break-in chip, and a cell link. London rows: dental 18% $95K moderate; law 22% $88K hard; accountants 21% $72K moderate; restaurant 9% $48K hard; cafe 7% $34K easier.
- Visual: the kit `OwnerKeepTable`, ranked bars encoding take-home (computed: $95K = 100%, others scaled), tabular margin column, break-in chip (easy moss, moderate amber, hard atlas-50). The anti-ranking caveat is sacrosanct and visible ("ordered by take-home, not by what is best; different trades, read each on its own terms"); the treatment must read as "different games," not a leaderboard. Full-width stacked table, no zebra (zebra is reserved for the dense data-table idiom). Real, trusted-local only; self-omits below three rows.
- Group/placement: Movement III, the payoff.

### 7. What it takes to open here (cost-to-open + ramp, NEW)
- Role: quantify the slow start the hero promised but never costed; what you must put IN and how long until you break even.
- Sanity verdict: ESSENTIAL (new). Not pathetic: the hero literally says "if you can fund a slow start" and the old page never quantified it; this is a dangling promise made concrete, and it is Job E (survive the slow start) for the city.
- Shows: typical money-to-open range (low / mid / high) and months-to-break-even, modeled and tagged.
- Visual: a `RangeStrip` for capital-to-open (cocoa span, atlas typical marker) beside a short months-to-break-even timeline ribbon (the break-even node the lone atlas emphasis; phases, not precise dates). Two-column at 1280. Clearly tagged modeled, never false precision.
- Group/placement: Movement III, the payoff (pairs with §6: what you keep, against what you put in).

### 8. Where to set up (the suits-shortlist, merges best-areas + neighbourhoods)
- Role: turn the verdict into action, which district suits which trade, with the rent-versus-footfall trade-off, each row also the link into its neighbourhood page.
- Sanity verdict: ESSENTIAL. Not pathetic: the most actionable section for an operator; the rent/footfall reads make it a trade-off scan, not generic local-guide copy. The analysis merges best-areas (prescriptive) and neighbourhoods (exploratory) so two district treatments do not sit adjacent.
- Shows: per district, the trade it suits, a relative rent read, a relative footfall read, the why, and a neighbourhood link. Soho (restaurants/nightlife, rent high, footfall high); The City (professional, rent high, footfall weekday-skewed); Shoreditch (cafes/creative, rent mid-rising, footfall mid-high); Mayfair (luxury/advisory, rent top, footfall mid).
- Visual: a divided LIST (border-top/bottom rows, not a card grid, to stay distinct from the peer cards) with a suits pictogram from the one icon family (fork, briefcase, cup, star), and tiny rent/footfall mini-spectra (the L5 gradient, NOT 4-segment pips, which are banned), explicitly labelled "relative within London." An "Explore all neighbourhoods" tail link carries the old §8 navigation job. London-exemplar; collapses to the calm strip elsewhere.
- Group/placement: Movement IV, the action.

### 9. How the city is changing
- Role: the forward read, what trend to bet with or against (weekday office trade falling, evening and weekend rising).
- Sanity verdict: SUPPORTING (CUT-IF-THIN). Not pathetic when real: a specific, contrarian shift nobody else gives; but it is the highest fabrication risk, so it renders ONLY where a real, citable shift is held and self-omits aggressively.
- Shows: an insight verdict + a three-row up/down rail (rising in moss, falling in ink).
- Visual: the kit `ContrarianInsight` card with an up/down rail using the shared icon family; no chart (a chart would over-claim precision on a soft trend). Demoted below the action sections so an invented trend never sits high on a thin page; held in the "our read, not a forecast" register. London-exemplar only.
- Group/placement: Movement IV, the action (the forward-looking tail of it).

### 10. Rival and peer cities
- Role: answer "compared to what?" and offer lateral moves; the ONE legitimate ranking on the site, because it is cities-versus-cities on the identical 0-to-100 scale.
- Sanity verdict: ESSENTIAL (a heavy data band). Not pathetic: the only place a leader mark is honest; the step-sideways cards drive exploration.
- Shows: the subject and peers on the shared scale (London 78, Paris 74, Amsterdam 73, Berlin 71, Dublin 69) and step-sideways peer cards.
- Visual: kit `ComparisonBars` (ranked, bar width = score, London the lone atlas accent, peers cocoa) PLUS `CityPeers` step-sideways cards (flag + score + link). The VsWorld peer-median strip is CUT per the analysis: it is a redundant third take on the same data the ranked bars already show. Two visuals only (the comparison + the nav). The caveat rail is load-bearing ("only cities are scored; not adjusted for local prices, read it as a relative climate signal"). Two-column at 1280. Self-omits below two peers.
- Group/placement: Movement V, the context and close.

### 11. How we get to the number (trust layer)
- Role: the site-wide confidence/method note, a quiet "held vs modeled" read so the score and the menu are not black boxes.
- Sanity verdict: SUPPORTING. Not pathetic: it is the founder-approved monetizable trust layer that appears on every page type; it earns its place by making the honesty visible.
- Shows: a small expandable method/confidence note, no source-agency names.
- Visual: a compact expandable note with per-section confidence chips (held / modeled / exemplar). Quiet, low-contrast.
- Group/placement: Movement V, the context and close.

### 12. One thing to remember (close)
- Role: the warm last word, the single sentence the operator carries away, plus freshness and a flag-it affordance.
- Sanity verdict: ESSENTIAL. Not pathetic when non-redundant: London's close ("London gives you the demand; whether you keep any of it depends on the rent deal and the price you can hold") is distinct from the honest-take and forward-looking.
- Visual: the kit `OneThing` close card (cream-100 ground), one Newsreader closing line, the June 2026 freshness stamp, and "spot something off? flag it." Quietest card on the page; generous air above.
- Group/placement: Movement V, the context and close.

### 13. Rich multi-column footer (chrome)
- Role: site-wide wayfinding and newsletter capture.
- Sanity verdict: ESSENTIAL chrome.
- Visual: shadcnblocks `footer7` (newsletter-forward, L14), dark ink-900, brand + blurb + email capture + link columns + legal strip.
- Group/placement: bottom chrome.

Thin-city degradation: consecutive unheld sections (honest-take detail, saturation, where-to-set-up, changing) collapse into ONE calm "still filling in" strip with the section ids preserved as anchor pills; a genuinely filled section breaks the strip. On a thin city the score demotes to a quiet break-in chip, never a confident /100.

## Related links and cross-page hand-offs
The City page is the hub of the geography spine, so it links generously in three directions:
- UP to the country page from the breadcrumb and the country eyebrow (London to United Kingdom), so the reader can widen the frame.
- DOWN to cell pages from every row of the take-home menu (§6 break-in chips link to the trade's cell, e.g. restaurant to the London-restaurants cell), the deepest and most valuable hand-off; and DOWN to neighbourhood pages from every row of the where-to-set-up shortlist (§8), plus the "Explore all neighbourhoods" tail link.
- SIDEWAYS to peer city pages from the §10 step-sideways cards (Paris, Amsterdam, Berlin, Dublin), the one legitimate lateral move.
- OUT to the industry pages: each trade name in §6 can link to its industry page (the structural shape of that trade nationally), giving the analyst a second axis.
- OUT to Compare from the navbar and a closing CTA, for the reader who wants two metros side by side.
The founder wants MORE links: every trade in the take-home menu is a live link (to its cell and optionally its industry), every district in the shortlist links to its neighbourhood, every peer card links sideways, and the breadcrumb plus country eyebrow both go up. The one terracotta CTA on the page is the Compare or "Get the data" pill; all other links are quiet ink-to-atlas text links so the page is richly woven without a field of buttons.

## What was WRONG in the rejected build, and the fix
- The at-a-glance scorecard was dropped. The hero carried only the score plus three quiet trivia stats (population, salary, visitors). Fix: restore the eight-metric city scorecard over the place image, each metric with its calibrated good/bad read, score as the lead.
- Pathetic one-fact sections posing as content. "What space costs" was a bare "132 vs 100" with a caution, and "tourist money vs local money" was a single "Residents 72%" bar; each is one fact dressed as a section. Fix: merge them into one "what that income buys + steady vs seasonal" band, each led by its implication (the prime-vs-side-street gap; "build for repeat trade, not a one-time hit"), not the bare number.
- Bare ranges with no levels or denominator. Take-home was a single figure per trade with no sense of spread or of what you must put in. Fix: give take-home a typical-to-top range, and add the new cost-to-open band (§7) so every take-home number has a denominator (capital in, months to break even).
- A missing competition read. The page told you what owners keep but never how contested the market is, the operator's make-or-break first question. Fix: the new saturation section (§5), a diverging density-vs-norm read.
- Internal triple-redundancy in peers. §10 carried three peer visuals (ComparisonBars, VsWorld median strip, and cards) all saying nearly the same thing, padding that reads as slop. Fix: cut to two, the ranked bars (comparison) plus the step-sideways cards (nav); drop the VsWorld strip.
- Two adjacent district treatments. Best-areas and neighbourhoods sat back to back, both about districts, risking repeated card grids. Fix: merge into one "where to set up" divided list, distinct in shape from the peer cards, with the neighbourhood links folded into the rows.
- Banned rating idioms. The old rent/footfall reads used 4-segment pips. Fix: replace every pip/segment meter with the locked L5 gradient mini-spectrum (gray-to-moss, atlas marker).
- A vanity radial. The optional re-skinned radial in the hero gave no peer context. Fix: cut it; the number-plus-band combo carries the headline and the "where does it sit" context honestly.

## Open questions for the founder
1. The customer band's second stat: the analysis flags "net wealth per adult" as too abstract for an operator and recommends swapping it for disposable income or cost-of-living-adjusted spending power. Confirm the swap, or keep net wealth because it reads as the premium-tail signal.
2. Saturation data confidence: the new "how crowded the field is" section needs a defensible per-trade density read. If we only hold this as a coarse over/balanced/under character (not a count), is that honest enough to ship, or should it ride as a chip on the take-home rows until firmer data exists?
3. Cost-to-open and months-to-break-even are modeled, not measured. Is a clearly-tagged modeled range acceptable on the flagship city, given it directly fulfills the hero's "fund a slow start" promise, or should it stay London-exemplar only until the model is validated against real openings?
