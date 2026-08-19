# 01 — THE DESIGN STANDARD

> The site's ratified design and UX standard, grounded in external research
> conducted 2026-08-19. Where a rule here has evidence, the evidence is named.
> Where it is a founder ruling, it is quoted.
>
> Depth lives in the research annexes. This file is what a tick applies:
> - `../../research/2026-08-19-homepage-architecture-and-psychology.md` (750 lines, 18 homepages fetched, 11 psychology mechanisms)
> - `../../research/2026-08-19-ui-ux-guidelines.md` (1,378 lines, 262 rules, 113 sources)
> - `../../research/2026-08-19-reference-page-architecture.md` (data/reference page structure)
> - `../../research/2026-08-19-internal-state-audit.md` (what this repo actually is)

---

## 0. The register: premium editorial almanac, not SaaS tool

Every structural decision below follows from this one choice, and the choice is
already ratified. Three consequences, each measured:

1. **The proof is the data.** Observable's hero band is six live charts and
   **zero words**; Our World in Data leads with "14,082 charts"; Nomad List's
   hero *is* the grid. That is the model. Stripe's gradient is not.
2. **Editorial vertical rhythm, not SaaS.** Measured section padding elsewhere:
   The Verge 32-64px, Wired 48px; against Linear/Raycast/Framer/Resend 96px and
   Vercel 192px.
   **CORRECTED, tick 6: this site is ALREADY at the editorial end, and tighter
   than the range.** `ToneBand` renders `py-8 md:py-10` = **32px mobile / 40px
   desktop**. An earlier draft of this file said "adopt 56px desktop" and that
   was **backwards** - it would have added roughly 320px at desktop and failed
   `verify_spacing_scale`, whose scale is derived from the founder's mockup and
   **stops at 40**.
   **So vertical rhythm is NOT the dial behind "too tall" here.** It was already
   pulled, in `4ff9d677`, which removed 1,216px (18% of page height) by
   collapsing four competing rhythms into one. Look for height elsewhere: word
   count, band count, and per-band computed height.
   **General finding, local measurement.** The research about other sites was
   correct and the instruction derived from it for THIS site was wrong, because
   nobody measured this site first.
3. **Numbers must look measured, not written.** Tabular lining figures on every
   figure. Stripe mandates this on every money cell.

---

## 1. THE WORD BUDGET. The founder's "cut text" made numeric.

**Median band across 18 studied homepages: ~90 words** (range 45–120). Exactly
one band per page exceeds 200, and it is almost always a testimonial wall.

**Median homepage body: ~1,285 words** — but the pages that read as *confident*
are far shorter: **Arc 180, Vercel ~400, Notion 575, Clerk 720.** Stripe's 2,485
is the outlier, not the target.

**Our homepage today: 11 bands, 617 words** (measured IN A BROWSER at 1280,
tick 8; 613 at 375). **The 615 target is already met.**

**CORRECTED, tick 8.** This line said 764 and the target said 615, which framed
the whole P1 track as a word-cutting job. 764 came from the SSR instrument, which
strips tags and counts what remains, including markup that never paints at a given
width. `innerText` counts what a reader can see. **A tick that had started cutting
toward 615 would have been cutting below the target while believing it was
approaching it.** Height, not words, is the open problem: see
`docs/loop/artifacts/home-paint-census-2026-08-19.md` section 3.

| Rule | Value |
|---|---|
| Standard band budget | **90 words**, hard ceiling **120** |
| Whole homepage | **615 words** |
| First screen | **7 headline words, 15 subhead words, 2 CTAs** (studied median; nobody exceeds 12 headline words) |
| A lede | **two lines maximum** |
| A paragraph that restates its own heading | **delete entirely** |

**The evidence behind cutting text, and it is strong.** 79% of readers scan, 16%
read word by word; readers consume roughly **20–28% of your words**; they read
half the information only on pages of **111 words or fewer** (NN/g; Weinreich et
al. 2008). Design for layer-cake and spotted scanning, not for reading.

**What replaces the words** (the founder's "add elements"): the number itself set
large, a mark, an icon from the existing kit, a rule, a plate, a small chart.
Never a new icon language.

---

## 2. HONESTY AS A DESIGN MATERIAL. The strongest finding in the research.

**van der Bles et al. 2020, PNAS, N=5,780, including a live BBC field test:**

| Way of expressing uncertainty | Cost to trust in the source |
|---|---|
| A **numeric range** | **d = −0.03** (essentially free) |
| **Vague verbal hedging** | **d = −0.21** (about 7× worse) |

**Therefore: replace every prose hedge with a range.** "Roughly", "around",
"typically varies" cost trust. "£38,000 to £46,000" costs nothing. This is the
cheapest credibility upgrade available to this site and it aligns exactly with
the existing self-omission doctrine.

**Precision is asymmetric.** Precise figures signal competence, but a precise
figure later found wrong destroys more trust than an imprecise one that was
further off (Pena-Marin and Bhargave 2019). **Rule: precise where measured,
ranged where modelled, and always labelled which.**

**Fogg 2003, N=2,684** — what makes people judge a site credible:

| Factor | Share |
|---|---|
| Design look | **46.1%** |
| Information structure | 28.5% |
| Information focus | 25.1% |
| **Accuracy of the information** | **14.3%** |

For a product whose entire asset is correct numbers, presentation is not
downstream of proof. **For most readers it IS the proof.** That is the
justification for treating design as the priority on a site with no traffic.

---

## 3. THE TWENTY-FIVE RULES, ranked for this site

Full list with sources in the UI/UX annex. The ranking is for a text-and-number
editorial site over a fixed photograph. **[C]** = mechanically checkable.

**Trust in figures**
1. **Never present a number alone.** Give the comparison that makes it mean
   something — a peer, a median, a prior period. A figure with no anchor is not a
   benchmark, it is trivia. *This is the one rule whose violation destroys the
   reason the site exists.*
2. **Compute contrast against the COMPOSITED background** [C], not the nominal
   token. `--card` is `rgba(255,255,255,.955)` over a fixed photograph with a
   `mix-blend-mode: multiply` noise layer at 50% above it. **The existing
   `verify_token_contrast.mjs` measures an assumed opaque card, so it validates a
   surface that never renders.** Live blind spot.
3. **`tabular-nums` on every number** in a column or a slot that can change [C].
   Cheapest credibility win available.
4. **Precise where measured, ranged where modelled, labelled which.**

**Structure and scanning**
5. Keep the primary answer figure **above the fold at every device size**.
6. **Front-load headings and links; readers see about 11 characters** [C].
7. Assume 20–28% of words are read; **headings carry the meaning**.
8. One `h1`, **no skipped heading levels**, real landmarks [C].
9. **No infinite scroll for tabular or list data** — crawlers miss below-fold
   content, which on an SEO-growth site is a commercial cost on top of the
   accessibility one.

**Responsive** — *the repo checks two widths; this is the biggest gap*
10. Verify at **320, 390, 768, 1024, 1440** and one ultra-wide [C]. **320 is the
    width WCAG reflow is specified at** (= 1280 at 400% zoom) and it is the one
    currently missing.
11. **No two-dimensional scrolling at 320px** [C]. Level AA, and the most common
    real-world failure on card-and-table layouts.
12. Survive **200% text resize** and the WCAG **text-spacing** overrides without
    clipping [C]. Card layouts with fixed heights fail both.

**Colour and contrast**
13. Body text **4.5:1**, large text **3:1**, unrounded [C]. **Because bold display
    type is banned locally, the 18.5px-bold route to the 3:1 tier does not exist
    here — the effective large-text threshold is 24px and everything below owes
    4.5:1.**
14. **Never encode meaning by colour alone** [C]. Level A. ~8% of men.
15. **One hue at varying intensity** for ordered/good-versus-bad data. Survives
    greyscale and colourblind viewing. Reference implementation:
    `src/lib/scores/band_tone.ts`.

**Targets and focus**
16. Every pointer target **≥ 24×24 CSS px** or the 24px-circle spacing exception
    [C]. Level AA in WCAG 2.2; **nothing in the repo measures it.**
17. **Sticky/fixed furniture must never fully hide the focused element** [C]. This
    site has a fixed jump rail at `z-index: 15` and a sticky mast at `z-index: 20`
    — the textbook SC 2.4.11 failure pattern.

**Charts** — *the evidence is the chart, so these are correctness rules*
18. **Start every bar and column chart at zero** [C]. The only chart rule with
    zero dissent across four sources.
19. **One scale and one panel size across all small multiples.** Per-panel scales
    silently manufacture false conclusions.
20. **Label data directly, not with a legend.** Five sources agree; it also
    removes a colour-matching step colourblind readers cannot perform.
21. Cap categorical colours at **6**, hard-fail at **8**.

**Tables**
22. **Right-align numeric columns AND give them tabular figures** — half the rule
    is useless without the other half.
23. **Freeze header rows and the identifier column** on any table taller or wider
    than the screen.

**Motion and performance**
24. Honor `prefers-reduced-motion`; animate **only `transform` and `opacity`** [C].
    `transition: all` is a one-line grep.
25. **Reserve space for every image, chart and late block** so nothing shifts [C].
    And **budget `backdrop-filter`**: `blur(26px) saturate(1.15)` per card over a
    fixed full-screen photograph is the most expensive compositing pattern on the
    page. It is the signature look, so **measure it and set a budget, do not
    remove it.**

### Honest corrections to widely-repeated rules

- **WCAG sets no minimum font size at any level.** Apple says 11pt, Material
  11sp, Butterick 15px. 16px is the *browser default*, not a standard. The one
  real 16px rule is iOS input auto-zoom, which is rendering behaviour.
- **Focus appearance (2.4.13) and animation-from-interactions (2.3.3) are AAA,
  not AA.** 44px targets are AAA (2.5.5). **Pause/Stop/Hide (2.2.2) is Level A**
  and is the strictest motion rule.
- **NN/g never states a characters-per-line number**, and has **no**
  "right-align numbers" rule. Both conventions are real but come from elsewhere.
- **Ten popular "laws" are folklore**: the Z-pattern, Miller's 7±2 as a UI cap,
  Hick's law as a reduce-options mandate, "charts persuade", disfluency, and two
  fabricated progressive-disclosure statistics. Do not cite them.

---

## 4. FORM: depth without shadow

**8 of 11 studied design systems use ZERO drop shadows.** Depth is a **3–4 step
surface ladder plus 1px hairlines**. The three exceptions spend their single
shadow on the product mockup. This matches the existing local rule (hairline
cards, 8px, no shadow) and is now externally corroborated.

**Every studied system independently writes down a ONE-ACCENT rule** (Stripe,
Linear, Framer, Raycast each state it). That validates terracotta-only — and it
means a second live hue is a **structural** defect, not a cosmetic one.

### The open palette question this raises

`moss`, `amber` and `teal` were deleted 2026-08-17. **`cocoa` was not, and it is
brown.** Charter §8 bans brown. `--cocoa-500`, `--cocoa-700` and `--cocoa-300`
are live, and `--text-muted` / `--text-faint` are both cocoa — so **the site's
entire quiet-text ladder is a banned hue**, and `--text-faint` `#87745d` is
also the colour in the charter §13 Q2 contrast question.

**Do not act on this unilaterally.** It reframes an open founder question from a
contrast decision into a palette-membership decision. Route it to
`DECISIONS-NEEDED.md`.

---

## 5. THE HOMEPAGE BAND ORDER

Ten bands, **615 words**. Every band currently in `src/app/page.tsx` survives as
itself or inside a named merge; **nothing is deleted unilaterally.**

| # | Band | Words | What it must prove | Maps from |
|---|---|---:|---|---|
| 1 | **The question** (hero) | 45 | One question, answered in a real currency amount | `hero` — **KEEP UNCHANGED, H1 locked** |
| 2 | **The reading** | 60 | The answer arrives immediately, as a real table for a real place and trade | `specimen` + main table |
| 3 | **The holdings** | 25 | Scale and recency in one line | new; absorbs `ledger` |
| 4 | **The catalog** | 140 (35/plate) | The atlas can *see* four things — including one it honestly cannot see yet | `catalog-plates`, upgraded |
| 5 | **The world** | 40 | Coverage is global; every dot is a page | `world-map`, **smaller** per founder |
| 6 | **A page, end to end** | 70 | What you actually get on arrival | `example-tiles` + `state-comparison` |
| 7 | **How a number is made** | 90 | Provenance, method, and the admission | **new — the differentiator** |
| 8 | **Who it is for** | 55 | Four named readers, one line each | `audience`, compressed |
| 9 | **Recently published** | 60 | The atlas is alive | `blog-rail`, compressed |
| 10 | **The standing invitation** | 30 | One ask, one field | `newsletter` |

**Band 7 is the moat.** No competitor publishes what is held versus modelled
versus extrapolated, nor the 48,114 estimates deliberately **not** ingested.
Admitting what we cannot see is the single most differentiating thing on the
page, and per §2 it is also the cheapest trust purchase.

**Band 4, the catalog constraint** — how a collection reads as an object rather
than a list. Five moves: a **claim** as the title, a **visible membership rule**,
a **ratio not a count** (39 of 194, never "39 countries"), **one visual showing
the whole set**, and **five names on the surface**. The empty "declining" plate
is the strongest differentiator on the page precisely because it is empty.

---

## 6. What a data product does differently

- **Logos get demoted; provenance and bylines get promoted.**
- **Lead with the artifact.** Observable: six live charts, zero words.
- **Ratios over counts.** "39 of 194" carries a claim; "39 countries" carries none.
- **The admission is an asset.** What we do not hold, said plainly, outperforms
  another feature band.
