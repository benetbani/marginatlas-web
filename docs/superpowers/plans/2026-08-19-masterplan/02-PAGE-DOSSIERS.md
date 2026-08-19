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
| `/extremes` · `/margin-index` | 6 · 3 | Two leaderboard codebases, one question |
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

## Pending

Target section ORDERS per page type — informed by how the best data and reference
pages sequence answer, evidence and context — land in
`../../research/2026-08-19-reference-page-architecture.md`. Fold them into this
file when that annex is read, and record any conflict with the gated section
contract rather than silently preferring one.
