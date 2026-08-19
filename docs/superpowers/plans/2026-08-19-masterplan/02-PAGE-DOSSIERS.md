# 02 — PAGE DOSSIERS

> One entry per reader-facing surface: what it renders **now** (measured, not
> declared), what is wrong with it, and what a tick should do to it.
>
> **Counts are from rendering, never from a registry.** `PAGE_SECTION_ORDER`
> lists 7 cell sections; the cell page renders 34. Registries in this repo are
> partial skeletons and their own comments say so.

**49 reader-facing routes** against **50 workbench routes** (47 `/dev` + 3
`_design`) and 3 admin. That ratio is itself the finding.

---

## The spine surfaces

### HOME — 11 bands, 764 words

**Priority: highest.** Full target order and per-band word budgets are in
`01-DESIGN-STANDARD.md` §5. Target: **10 bands, 615 words.**

| Do | Why |
|---|---|
| Section padding to 56/40px | Editorial rhythm is 32–64px; ours is SaaS-scale. Removes ~⅓ of height with no words cut. **Do this first.** |
| Build band 7, "How a number is made" | The moat. Held vs modelled vs extrapolated, plus the 48,114 estimates deliberately not ingested. Nobody else publishes this. |
| Catalog reads as an object, not a list | Claim as title, visible membership rule, **ratio not count**, one visual of the whole set, five names on the surface |
| Shrink the world map | Founder ruling. Contained, not full-bleed. |
| **Never touch the H1** | Settled and locked |

### CELL — 34 sections (18 page-level + 16 in `CellDecisionStack`)

**The deepest surface on the site, and correctly so** — it is the flagship by the
ratified page-value ranking. Do not thin it. Vertical work here means: the answer
figure higher, comparison anchors on every number, ranges instead of prose
hedges, and elements replacing sentences.

**Its duplicate is the sub-cell page (24 sections) — the same `CellDecisionStack`
minus 10 chrome elements.** See `04-CONSOLIDATION.md` D1. Converging these two is
worth more than any polish applied to either separately.

### COUNTRY — 24 declared, **18 renderable**

**Seven sections can never render**, gated behind `notHeld<T>()` at
`src/app/[country]/page.tsx:784-793`. A section that is declared, contract-gated
as agreed, and structurally unreachable passes the gate while showing the reader
nothing. **Decide per section: make it reachable, or retire it from the contract.
Do not leave it in limbo.**

The charter records country as **blocked on data, not design**: there is no
honest country-level source for the hero. Improve the design; never fabricate the
data.

### CITY — 16 sections

**The district dataset renders three times** across this page and the
neighbourhood hub (D3). One dataset, three presentations, is the clearest
"clearing sections" candidate on the site.

### INDUSTRY — 10 sections

Two live defects already located, both in `06-BACKLOG.md`: an aria-label saying
"All trades average" over a **median** (P3-4), and the same trade printing `$9`
in one block and `8.6%` in another, 6 of 6 rows disagreeing (P3-5).

### NEIGHBOURHOOD HUB — 2 sections · REGION — 6

The thinnest real surfaces. Thin is not automatically wrong, but two sections is
below the point where a page justifies its own URL. Before deepening either, ask
whether its content belongs on the city page — that is the vertical move.

---

## The tertiary surfaces, grouped by their duplicate

| Surface | Sections | Note |
|---|---|---|
| `/world` · `/countries` | 4 · 2 | **One job, three incompatible region taxonomies sharing no bucket name.** Fix the taxonomy before the pages. |
| `/extremes` · `/margin-index` | 6 · 3 | **NOT duplicates** - disjoint design systems (zero `atlas-card` in one, zero `spine-scope` in the other), different ranking algorithms, different resolvers. The real near-duplicate is `/margin-index` and `/dev/decide-v2`. See backlog P2-4 / P2-4b. |
| `/decide` · `/calculator` | 5 · 5 | **The recommender the ratified strategy names for `/decide` is imported by zero decide files.** The headline tool is not wired to its own page. |
| `/blog` · `/learn` | 4 · 4 | Two content systems; blog is index-heavy and article-thin, learn is the reverse |
| `/industries` · `/[country]/industries` | 2 · 2 | One template twice |
| `opening` · `buy-or-start` | 5 · 3 | Byte-identical `generateStaticParams` |
| `/cities` | 4 | Founder-ruled broken; reduced 20,459px → 5,152px, but **what it should BE was never settled** |
| `/coverage` | 5 | |
| `/browse` | — | **Already converged: 308 to `/world`.** The precedent for every row above. |

---

## What "clearing design and sections" means per surface

Applied in this order, from `01-DESIGN-STANDARD.md`:

1. **Cut words, never sections.** Section membership is a gated contract.
2. **Replace a sentence that states a number with the number**, set large, with a
   label and a comparison anchor.
3. **Replace every prose hedge with a range.** Measured: a numeric range costs
   d = −0.03 in source trust; vague verbal hedging costs d = −0.21, about seven
   times worse.
4. **Give every figure a comparison** — peer, median, or prior period. A number
   alone is trivia, not a benchmark.
5. **Tabular figures on every number.**
6. **One accent hue.** Good-versus-bad is intensity in one hue, never two.

---

## The target section order

From `../../research/2026-08-19-reference-page-architecture.md` (20 pages fetched,
13 section orders recorded verbatim). One skeleton recurs on **every page that
works**:

> **Identity line → THE ANSWER → Decomposition → Recency proof → Peer position →
> Method → Lateral navigation.**

**The answer lands at position 3.** Nothing renders above it except the identity
line.

### Shared rules, all four page types

1. **A number alone is never the answer.** The complete unit is *number + band +
   one provenance sentence + one comparison anchor.* Independently confirmed by
   the UI/UX annex, whose #1 ranked rule is the same statement.
2. **Provenance is ONE sentence directly under the number**, in Indeed's form:
   **count, window, basis, updated** ("39.1k salaries, last 36 months, from job
   postings rather than self-reports, updated <date>"). Everyone else scatters
   these across a footer, a tooltip and a methodology page. Indeed fits all four
   in two lines.
3. Every number carries a unit, a reference date and a basis. No exceptions.
4. **Running prose in the top two screens: under 120 words** for cell, city and
   industry; under 180 for country.
5. **Every section must change a decision on THAT page, or it is cut.**
6. **Absence is a typed token in the value slot with one legend per page, never a
   deleted row.** See the open question below - this one is in tension with a
   ratified local doctrine and is NOT settled.

### CELL PAGE, the flagship. *What does the owner here actually keep?*

| # | Section | Role |
|---|---|---|
| 1 | Identity line plus data month | Frame |
| 2 | **THE ANSWER** - take-home, one number, largest type on the page. Beneath it: the low-to-high band, one provenance sentence, one anchor (this cell against the country's all-trade take-home) | **ANSWERS** |
| 3 | The funnel that produces it: revenue, costs, tax, take-home, with a value column AND a share-of-revenue column | EVIDENCE |
| 4 | Distribution: 25th / 50th / 75th, plus at most 20 words naming what separates the top quartile | EVIDENCE |
| 5 | Position row, Trading Economics form: this cell, the national figure for this trade, the best and worst covered geography in country | EVIDENCE |
| 6 | What moves the number here: at most three factors, one sentence each, **every sentence containing its own figure** | CONTEXT |
| 7 | Method and coverage: measured / estimated / absent, as a typed legend | CONTEXT |
| 8 | Lateral: same sub-industry nearby, other sub-industries here | NAVIGATION |

**CUT:** any explainer of the trade beyond one clause in the identity line; a
second hero chart restating the funnel; national market-size totals; demographic
or lifestyle tiles; **anything at all above the answer.**

Country, city and industry orders are in the annex at the same depth, each with
its own CUT list, plus 22 checkable ban statements a reviewer answers yes/no
against a rendered page.

### The comparison device worth stealing

**Trading Economics' four-column row: Last, Previous, Highest, Lowest**, every
value unit- and date-stamped. **One row replaces a chart**, and it was the
fastest-reading comparison device found anywhere in the set. Second best: a fixed
national anchor quoted inline, which becomes *learned* across pages.

### Two warnings from the admired pages

- **Levels.fyi shows no sample size next to its headline median. Do not copy
  that.** It is the most admired page in the set and it hides its coverage gap;
  it is also the only site where a reader cannot see thin data.
- **Confidence chips that encode sample VOLUME only are dishonest.** Glassdoor's
  say "we have a lot of rows" and read as a guarantee of accuracy.

### Looks modern is not reads fast

Nomad List looks 2026 and reads slow: 13 sections, 800 to 1,200 words, no single
answer. Trading Economics looks 2009 and reads fastest. Prose is inversely
proportional to lookup value: Levels.fyi 40-50 words in two screens, Trading
Economics 50-100 for the whole page, Payscale 400-500, Wikipedia 2,000+. **Fast
pages sit under 250.**

Recommended synthesis: **TE's architecture, Levels.fyi's type hierarchy, Indeed's
provenance line, Data USA's inline honesty, OWID's chart chrome.**

---
