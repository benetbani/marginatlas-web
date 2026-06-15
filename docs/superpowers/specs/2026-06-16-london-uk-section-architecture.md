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

## Round 2 (next): the visual treatment per section
For each section above, how its data is drawn (the hardest part). Decided in a
second interview and appended here, then implemented. The five Phase-0 primitives
(LikeForLikeBars, ThresholdGauge, TimelineRibbon, SeverityGlyph, TierBar) plus the
existing chart family (RangeStrip, MoneyGoesBreakdown, the engraved gauges, radar,
scatter, comparison bars) are the vocabulary. Sections whose data is genuinely not
held render their honest sample/empty state (no fabrication), but the visual frame
is built so it fills when the data lands.
