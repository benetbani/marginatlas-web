# Section ideas for marginatlas.com — research notes (2026-05-30)

What the best-loved data sites do, and the section ideas worth stealing for our
cell / city / country pages. Sources are real and cited at the bottom. The deep-
research workflow failed (harness glitch), so this was done with direct web search
+ judgment. Treat as a strong starting list, not gospel.

## What the winners do (one line each)

- **Levels.fyi** — the page IS the interactive chart: a salary distribution you can
  filter by level/location/years, with the total broken into parts (base, stock,
  bonus). A "leveling standard" abstracts company-specific titles into one comparable
  ladder. Lesson: lead with the distribution, let people slice it, decompose the headline.
- **Nomad List / nomads.com** — a city page is a stack of scored attributes (cost,
  internet, safety, climate) plus pros/cons and "is it worth it" community signal.
  Retention came from community + email + filters, added over time, not from data alone.
  Lesson: score the attributes, add a human verdict, give people a reason to come back.
- **The Pudding** — opinionated visual essays: scrollytelling, guess-then-reveal, choose-
  your-own-path. They work backwards from "what should the reader take away." Lesson:
  one strong editorial point per page beats a wall of numbers. The guess-reveal mechanic
  is theirs and it works.
- **Our World in Data** — every chart shows its source prominently, flags when data is
  combined/transformed, and has a "Learn more about this data" overlay. In-house tools
  flag anomalies. Lesson: wear your sourcing and quality openly; it builds trust, not doubt.
- **Zillow Zestimate** — the trust device is the VALUE RANGE: a wide range openly says
  "we're not sure here," a narrow one says "we're confident." They report accuracy per
  home. Lesson: show the confidence band, and let its width tell the honesty story.
- **Glassdoor "Know Your Worth"** — personalized: enter your title/location/experience,
  get YOUR market value vs the median, trended over time, private to you. Lesson: a
  "where do I land?" personal input turns a static page into a tool people return to.

## Section ideas, prioritized (tag: impact / effort)

### High impact, low effort (do these first)
1. **Signature distribution band, "where you'd land"** (cell). The Levels.fyi move:
   our DistributionVisual as the hero, p10-p90 with the median marked. HIGH / LOW
   (we already have the component; just promote it — already done in the reorder).
2. **One-line editorial verdict** under the hero (cell/city/country). The Pudding's
   "one takeaway" + our house voice. "Lisbon barbers run unusually lean for the trade."
   HIGH / LOW (derive from percentile + ranking; minimal-verdict version is ①.2-adjacent).
3. **Confidence band worn openly** (all). Zillow's lesson: show the quality/coverage as
   a visible badge + sample size + vintage year, and let a wide band say "estimate."
   HIGH / LOW (data already carries quality_score, coverage_tier, is_synthetic).
4. **"Same business, other places" rail** (cell). Already wired post-reachability-fix;
   make it a labeled, scannable rail. HIGH / LOW.
5. **Headline number decomposed** (cell). Levels.fyi breaks total comp into parts; we
   break revenue into the cost stack → take-home. We have AnnualCostStack + waterfall;
   make the decomposition the second beat after distribution. HIGH / LOW.

### High impact, medium effort
6. **Guess-the-number, then reveal** (cell). The Pudding's signature interaction, your
   Q13 pick. "What do you think a barber in Lisbon makes?" → slider → reveal + where
   their guess ranks. HIGH / MED (one client component; subtle per Q14).
7. **Atlas Score (0-100) + rarity badge** (cell). Levels-style abstraction into one
   comparable score; Nomad-style attribute scoring. Rarity badge for unusual cells
   ("rare: high margin, low scale"). HIGH / MED (define the score formula carefully).
8. **Rankings / leaderboards** (country/sector). "Most profitable small businesses in
   Spain", "toughest trades". Your Q3 retention pick. HIGH / MED (rank from existing data).
9. **Attribute scorecard** (city/country). Nomad List's stacked scores: typical revenue,
   margin health, cost level, wage level, density — each a small gauge. HIGH / MED.
10. **"Know your worth" personal input** (cell). Glassdoor's tool move: user enters their
    own revenue/margin, sees where they land in the distribution, saved to localStorage.
    HIGH / MED (ties to your Q15 my-atlas).

### Medium impact
11. **Source + methodology disclosure overlay** (all). OWID's "learn more about this
    data". MED / LOW (we have the data; needs a tidy disclosure UI; respects the no-
    source-agency-names rule by describing method, not naming agencies).
12. **Honest "not yet, see nearby" empty state** (all). OWID/Zillow honesty; this IS
    sub-project ①.2. Never a dead section. MED / MED.
13. **Comparable cities/countries ribbon** (city). Already partly built
    (ComparableCitiesRibbon). MED / LOW.
14. **Trend / direction chip** (cell). "rising / steady / softening" from the trend
    synthesizer we already have. MED / LOW.
15. **Neighborhood drill-down grid** (city). Already on the region page; make it a
    first-class section. MED / LOW.
16. **"If you opened today" scenario** (cell). We have an IfYouOpenedToday component;
    promote it. MED / LOW.
17. **Breakeven in plain units** ("orders/day to break even") (cell). Already built;
    keep it, it's concrete and loved. MED / LOW.

### Lower priority / later
18. **Saved watchlist dashboard** ("my atlas") (global). Q15. MED / MED.
19. **Stat-of-the-day on homepage** (home). Light editorial cadence. MED / MED.
20. **Choose-your-own exploration** (editorial pages). The Pudding's path mechanic. LOW / HIGH.
21. **Cross-country small-multiples** (sector). Only where data is comparable (watch the
    wrong-aggregation tail problem). LOW / MED.

## Two cautions specific to us
- **Never fake data** (your constraint): guess-reveal and scenarios must compute from
  real cell values or clearly-labeled estimates, never invented numbers.
- **Honesty is the brand** (OWID + Zillow): the confidence band and coverage badge aren't
  apologies, they're the differentiator. Lead with them, don't hide them.

## Sources
- Levels.fyi: https://www.levels.fyi/ , https://www.levels.fyi/charts.html
- Nomad List / nomads.com: https://nomads.com/ , https://practicalprogrammatic.com/examples/nomadlist
- The Pudding: https://pudding.cool/ , https://www.storybench.org/pudding-structures-stories-visual-essays/ , https://datajournalism.com/read/newsletters/visual-storytelling-inside-the-pudding
- Our World in Data: https://ourworldindata.org/faqs , https://ourworldindata.org/spotting-and-fixing-data-issues-how-we-help-improve-data-quality-on-and-off-our-publication
- Zillow Zestimate: https://www.zillow.com/zestimate/ , https://www.zillowgroup.com/news/home-in-the-range/
- Glassdoor Know Your Worth: https://www.glassdoor.com/blog/introducing-know-worth-glassdoor/
