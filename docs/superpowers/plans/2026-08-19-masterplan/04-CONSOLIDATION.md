# 04 — VERTICALITY: the surface map, and the rule against sister pages

> Founder's ruling, 2026-08-19, verbatim: *"remember we only go vertically, so
> never create 2 similar sister pages, we are clearing design and sections now."*

---

## 1. The rule, stated so it can be checked

**We go DEEP on the surfaces that exist. We do not go WIDE.**

Three operative consequences:

1. **No new page type may be created** that answers a question an existing page
   type already answers. The eight real page types (home, country, geo, cell,
   sub-cell, industry, city, neighbourhood) plus the tertiary set are the whole
   inventory. Adding a ninth is out of scope for every tick unless the founder
   asks for it by name.
2. **Where two surfaces already overlap, one is wrong.** Converge on the better
   one. This is the charter's §7 cohesion instruction applied to information
   architecture rather than to visuals.
3. **A section may not be duplicated across surfaces to "fill" a thin page.** A
   thin page is a signal that the page should merge upward, not a hole to pack.

**Review-gate check R11** enforces this per unit of work: *did this change create
a second way to solve a problem an existing surface already solves?*

### A vocabulary warning, because the repo already owns this phrase

**Do not use "sister page" in code, comments or gates for this concept.** The
repo already uses "sister page" to mean the OPPOSITE — two instances of the SAME
template that are *required* to match each other (e.g. two city pages). Reusing
the phrase for "two overlapping surfaces, one must die" would invert the meaning
of existing comments and gates.

The founder's 2026-08-19 phrasing is quoted above and is the ruling. In this
repo's own language, call the thing being banned a **DUPLICATE SURFACE**, and
call the remedy **convergence**. Two instances of one template are good; two
templates answering one question are the defect.

---

## 2. Why this rule exists here specifically

The repo serves **102 page routes: 49 reader-facing, 50 workbench** (47 `/dev`
plus 3 non-routable `_design`) **and 3 admin**. `CLAUDE.md` says 56, which is
stale. Fifty workbench routes against forty-nine real ones is the shape of a
project that has been building sideways.

**Measured section counts per reader-facing page type** (rendered, not declared —
counted by the 2026-08-19 internal audit):

| Page type | Sections | Note |
|---|---|---|
| cell | **34** | 18 page-level + 16 inside `CellDecisionStack` |
| country | 24 declared / **18 renderable** | 7 can never render, see below |
| sub-cell | 24 | |
| city | 16 | |
| home | 11 bands | 764 words measured |
| industry | 10 | |
| region | 6 · `/extremes` 6 · `/coverage` 5 · `/decide` 5 · `/calculator` 5 · `/opening` 5 | |
| `/blog` 4 · `/learn` 4 · `/cities` 4 · `/world` 4 | | |
| `/margin-index` 3 · `buy-or-start` 3 | | |
| both industry indexes 2 · neighborhood hub 2 · `/countries` 2 | | |

**Correction to an earlier reading of this repo.** The `PAGE_SECTION_ORDER`
registry lists 7 entries for the cell page and 26 for country, which invites the
conclusion that depth is inverted against the ratified page-value ranking. It is
not. That registry is a partial skeleton — its own comments say the gate only
sees literal `<section id=>` blocks — and the *rendered* counts above show the
cell page is the deepest surface on the site, which is correct and should stay
that way. **The registries are unreliable as a census; render and count.**

**Seven country-page sections can never render at all**, gated behind
`notHeld<T>()` at `src/app/[country]/page.tsx:784-793`. A section that is
declared, gated as agreed, and structurally unreachable is worse than an absent
one: it passes the contract gate while showing the reader nothing.

---

## 3. Candidate overlap clusters

**Anything that deletes or redirects a URL needs the founder's explicit
approval.** The charter's existing constraint is "no URL slug renames", and
removing a route is strictly more destructive than renaming one.

### 3.0 MEASURED duplicates — evidence, not inference

These were confirmed by reading the components, not by comparing URLs. They are
the real backlog; the name-based clusters below are secondary.

| # | The duplicate | Evidence |
|---|---|---|
| **D1** | **sub-cell ≈ cell** | The sub-cell page is the cell page's entire `CellDecisionStack`, minus 10 chrome elements. Not a similar page — the same stack. |
| **D2** | **two industry indexes are one template twice** | `/industries` and `/[country]/industries` render the same template. |
| **D3** | **the district dataset renders THREE times** | Across the city page and its neighbourhood hub. One dataset, three presentations. |
| **D4** | **`opening` and `buy-or-start`** | Byte-identical `generateStaticParams`. |
| **D5** | **`/world` and `/countries` are one job** | Two pipelines carrying **three incompatible region taxonomies that share no bucket name**. The taxonomy conflict is the bigger defect: the site cannot answer "which region is this in" consistently. |
| **D6** | **`/extremes` take-home lens ≈ `/margin-index`** | Two leaderboard codebases answering one question. Supersedes the guess below that `/margin-index` is safely distinct. |

**First-party precedent already exists.** `/browse` was deleted for exactly this
reason and now 308s to `/world`. The founder's ruling is not a new direction; it
is a direction this repo already took once and stopped following. Use `/browse`
as the template for every convergence: **redirect, do not delete.**

### Cluster A — Two parallel content systems. The clearest violation.

| Route | Lines |
|---|---|
| `/(site)/blog` | 441 |
| `/(site)/blog/[slug]` | 74 |
| `/(site)/learn` | 212 |
| `/(site)/learn/[slug]` | 384 |

Two index pages and two article renderers for what is, on the face of it, one job:
long-form reading. If the distinction is real (news versus evergreen education),
it must be legible to a reader in one glance from either index. If it is not
legible, these are sister pages and one system should absorb the other.

**Note the asymmetry**, which is itself a finding: the blog's INDEX is heavy (441)
and its ARTICLE is thin (74); learn is the reverse (212 index, 384 article). Two
teams solved the same two problems in opposite directions.

### Cluster B — Five decision surfaces

| Route | Lines |
|---|---|
| `/(site)/decide` | 448 |
| `/(site)/decide/[activity]/[city]` | 541 |
| `/(site)/compare` | 119 |
| `/(site)/compare/cities/[pair]` | 349 |
| `/(site)/calculator` | 123 |
| `/(site)/check` | 58 |
| `/(site)/tools` | 142 |
| `/(site)/margin-index` | 145 |

The ratified strategy names ONE headline tool: *"where to open X"* — a composite
rank from trade plus budget, leading the homepage. Against that, `/decide` is the
product and the rest are candidates to become **entry points into it** rather than
separate destinations. `/tools` at 142 lines is likely an index OF these, which
would make it a directory to a set that should be one thing.

`/margin-index` is ratified separately as a keep-leaderboard plus a per-page
badge — that is a real distinct artifact, and it is the most likely member of this
cluster to survive as its own surface.

### Cluster C — Six ways into the same lattice

| Route | Lines |
|---|---|
| `/(site)/browse` | **37** |
| `/(site)/countries` | 268 |
| `/(site)/cities` | 428 |
| `/industries` | 246 |
| `/world` | 378 |
| `/(site)/extremes` | 509 |
| `/(site)/coverage` | 58 |
| `/(site)/coverage/[iso2]` | 232 |

All of these are "find your way into the data". `/browse` at 37 lines cannot be
carrying its own weight as a top-level concept. `/world` and `/countries` both
appear to be country entry points. `/coverage` at 58 lines and `/extremes` at 509
are doing very different jobs under adjacent names.

`/cities` is already ruled broken by the founder (charter §6) and was reduced from
20,459px to 5,152px — the structural question of what it should BE was never
settled, only its length.

### Cluster D — Four trust surfaces

`/(site)/methodology` 313 · `/(site)/methodology/key-benchmarks` 152 ·
`/(site)/about-data` 191 · `/(site)/status` 198

"How we know this" is one question. It is currently answered in four places.
Provenance is a core credibility asset for a data product, and splitting it four
ways weakens it rather than deepening it.

### Cluster E — Four personal surfaces, none of them live

`/(site)/account` 117 · `/(site)/you` 90 · `/(site)/saved` 46 · `/(site)/signin` 42

Auth is not wired; `/account` renders a placeholder behind a default-off flag.
Four routes anticipating a product that does not exist yet. **Lowest priority** —
they cost nothing while dormant, and consolidating them is work that will be
redone when auth actually lands. Note them and leave them.

---

## 4. The procedure for converging two surfaces

Never delete first. In this order:

1. **PROVE the overlap.** Render both. List the sections of each. State which
   sections are the same question. Overlap is a measured claim, not an
   impression from a URL.
2. **PICK the survivor** on evidence: which is deeper, which is linked to more,
   which has the better URL for its meaning, which the founder has spoken about.
3. **MOVE what the loser holds that the survivor lacks.** Nothing may be lost
   silently. The charter forbids dropping an agreed section, and that applies
   across a merge.
4. **REDIRECT, never 404.** Even with no traffic, a dead internal link is a
   defect and the repo has a `find_dead_links --strict` gate that will catch it.
5. **ASK before the URL changes.** Route deletion goes to the founder as a
   one-line proposal with the evidence from step 1. Do not execute it on a tick.
6. **RE-RUN the link gate and the sitemap** after any route change.

---

## 5. What "going vertically" actually means for a tick

Deepening a surface, in rough order of value:

- **Answer the question harder.** The headline number, faster, with the units,
  the date, the sample size and a comparison anchor beside it.
- **Replace prose with an element.** A sentence that states a number becomes the
  number, set large, with a label. This is the founder's "add elements, cut text"
  made concrete.
- **Add a comparison the reader cannot get elsewhere.** Rank, percentile,
  versus-national, versus-similar-place. Our lattice can do this and a generic
  competitor cannot.
- **Show the distribution, not just the point.** A range or a band communicates
  honesty and is more useful than a single figure.
- **Make the next step obvious.** One clear route deeper into the lattice, not
  six.
- **Say what we do not know.** Self-omission with a reason reads as credible;
  silence reads as missing.

None of those require a new page. All of them are vertical.
