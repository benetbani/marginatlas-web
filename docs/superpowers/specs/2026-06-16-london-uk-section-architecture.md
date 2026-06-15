# London / UK Section Architecture — the locked contract

Status: section ORDER locked by the founder, 2026-06-16 (clickable interview).
Scope: a deep, highest-quality reformation of FIVE pages only, for London / UK:
**Home, United Kingdom (country), London (city), London restaurants (activity/cell),
London neighbourhoods (neighbourhood).** Nothing else is touched in this pass.

## The standing law (founder, 2026-06-16)
1. Each page type has a FIXED, ORDERED set of sections. Every section is ALWAYS
   present, in its own row, in this order.
2. A section is never added, removed, or reordered without the founder saying so.
3. Every section transmits its data GRAPHICALLY wherever the data allows; a text /
   bullet block is a failure state, used only where there is genuinely no better
   option, and only low on the page.
4. The visual treatment per section is decided in a second interview (round 2) and
   appended here.

The machine-enforced contract is `src/lib/page-sections.ts` + `src/lib/page-layout/
section-order.ts` + the `verify_page_sections` / `verify_section_order` gates; these
are updated to match the orders below in the same change.

---

## 1. HOME (the one page with extra brand freedom)
1. Hero — the rotating question + search
2. Pick a country — the world map
3. What a business actually keeps — live real examples
4. The same trade, state by state — like-for-like proof
5. The same numbers, block by block — neighbourhood proof
6. Built for the people who price a business — the audience
7. Free to read, paid to go deeper — pricing
8. From the notebook — a few articles
9. Get the free benchmark report — newsletter

## 2. UNITED KINGDOM (country)
1. Hero
2. At a glance — eight headline metrics
3. The country's shape — the nine lenses
4. Cost + rules to set up
5. Licences  *(moved up beside setup: all legal-to-start together)*
6. Where the margin leaks
7. Hiring + the cost of a team
8. The talent reality
9. Who has money to spend
10. How far you can reach
11. Versus the neighbours
12. The opportunity gap
13. Same business, here vs abroad
14. Special zones
15. The ground under you
16. Cities
17. Character
18. What locals know
19. What your life looks like here
20. Versus the world
21. The honest take
22. Gut-check
23. One thing to remember
24. Related countries

## 3. LONDON (city)
1. Hero + Business Climate Score
2. At a glance — metro metrics
3. Who the local customer is
4. Tourist money vs local money
5. What space costs
6. What owners keep across trades
7. Best areas to set up
8. Neighbourhoods
9. How the city is changing
10. Rival + peer cities
11. Operator voices
12. One thing to remember

## 4. LONDON RESTAURANTS (activity / cell)
0. *(above the body)* Make-it-yours calculator — directly under the masthead number
1. Masthead — typical revenue + its spread
2. The honest take
3. In plain terms — the number in tangible units
4. Where the money goes
5. What moves the cost
6. What the owner keeps
7. Break-even
8. What to watch — the risks  *(moved up, after the money block)*
9. Pay by role
10. Cost to open
11. Through the year
12. Your realistic first year
13. The same business nearby
14. Operator voices
15. Versus the world
16. The story in plain words  *(moved low: a quiet prose beat)*
17. One thing to remember
18. Related

## 5. LONDON NEIGHBOURHOODS (neighbourhood)
1. The district hero
2. Street by street
3. What thrives here and why
4. Who lives and shops here
5. Cost to operate
6. Versus next door
7. The businesses here
8. Operator voices
9. One thing to remember

---

## Round 2: the visual treatment per section (LOCKED 2026-06-16)

Vocabulary: the five Phase-0 primitives (LikeForLikeBars, ThresholdGauge,
TimelineRibbon, SeverityGlyph, TierBar) + the existing family (RangeStrip,
MoneyGoesBreakdown, the engraved gauges/dials, the nine-lens radar, the opportunity
scatter, ComparisonBars, VisitorSplit, OwnerKeepTable, the setup route-line, the
character spectrum, the seasonality bars, the wage rails). New small builds noted as
[NEW]. Data-not-held sections render their honest sample/empty state, but the visual
frame is built so it fills when the data lands [FRAME].

**HOME**
1. Hero — rotating words + search (keep) · 2. World map (keep) · 3. Example proof —
revenue ranked bars · 4. State by state — ranked bars · 5. Block by block — cards +
a price-tier badge/gauge + the known-for line · 6. Audience — icons + spot (keep) ·
7. Pricing — three tier cards, moss "included" / muted "not" bands [NEW] · 8. Blog —
a topic pill + thumbnail per post · 9. Newsletter — a sample-report preview image.

**UNITED KINGDOM**
Keep: hero skyline, at-a-glance scorecard, the nine-lens radar, the setup route-line,
hiring dials, how-far-reach, vs-neighbours table, opportunity scatter, ground bars,
cities grid, character spectrum, vs-world bars. · Margin leaks — three bars
(rent/labour/tax), the biggest flagged as "the leak" [NEW] · Honest take — verdict +
an ease-of-business gauge · Gut-check — three framed cards with a think glyph [NEW] ·
Licences — a checklist grid (icon + name + cost/days) [FRAME] · [FRAME] also: talent
reality, who-has-money spend-mix, same-business-abroad mirror bars, special zones
cards, your-life-here felt bars.

**LONDON (city)**
Keep: hero + score band, at-a-glance, tourist-vs-local split bar, owners-keep table,
neighbourhood cards, peer bars + cards, vs-peers, one-thing. · Customer/spending —
the income spread strip (on every city holding income) + a "what they spend on" bar ·
Space costs — a cost-of-living / rent gauge, prose below · Best areas — area cards
with a "suits" pictogram + one line [NEW] · Changing — a trend card with direction
markers [NEW] · Operator voices — pictogram circles.

**LONDON RESTAURANTS (cell)**
Keep: calculator + take-home spread, masthead anchor + spread, what-moves-cost
(arrows + ticks), pay-by-role rails, seasonality bars, vs-world bars. · Honest take —
verdict + a break-in difficulty gauge · In plain terms — icon-led unit cards [NEW] ·
Where money goes — per-$100 bar + a vermillion tick on the kept row · What owner
keeps — a kept-vs-gone bar [NEW] · Break-even — ThresholdGauge · What to watch —
SeverityGlyph per row · Cost to open — a stacked cost bar · First year —
TimelineRibbon · Nearby — LikeForLikeBars · Operator voices — quotes + trade
pictogram circles · The story in plain words — prose (the one justified low-text
beat) · one-thing, related — keep.

**LONDON NEIGHBOURHOODS**
Keep: street-by-street (chips + street-line motif), vs-next-door table, the-businesses
grid, one-thing. · District hero — answer-first + a top-trade multiplier gauge · What
thrives — ranked multiplier bars + pictogram (LikeForLikeBars) · Who lives + shops — a
spend breakdown + income band [FRAME] · Cost to operate — a bar vs the city baseline
(1.0x) · Operator voices — pictogram circles.

## Implementation (next)
Build, in order: (a) the small NEW shared pieces this needs that aren't yet primitives
(the kept-vs-gone bar, the icon-unit cards, the ease/difficulty + multiplier gauges,
the three-bar "leak", the framed gut-check cards, the trend-direction card, the tier
cards, the suits-area cards); (b) wire each page to its locked order via the section
manifests + gates; (c) reform each section to its visual, page by page (restaurant
first), gate-green + SEEN at 1280 + 375 + committed. The data-not-held sections keep
their honest states; never fabricate.
