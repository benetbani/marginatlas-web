# Page Manifests , the single reconciled build spec (2026-06-27)

THE source of truth for assembling any Margin Atlas page. One manifest per page type (`country.md`, `city.md`, `neighbourhood.md`, `cell.md`). A page is assembled by **walking its manifest top to bottom**; the `*-reform.html` mockups are a **parts bin** (hero shell, card frame, chart primitives) only, never the section structure. A section is on the page **iff** the manifest lists it.

This README reconciles the protocol, which was fragmented across ~10 dated files that contradict each other. Precedence is **latest ratified decision wins**, plus explicit founder deltas logged below.

## Precedence (which source wins on what)

| Dimension | Authoritative source | Superseded |
|---|---|---|
| Section list + order | `page-architecture/00-APPROVED-REFORM-2026-06-18.md` | the order inside the per-type architecture files |
| No agreed section dropped | `00-BENTO-REFORM-PLAN` §4 audit + `brand/section-constitution.md` | , |
| Per-section visualization | `00-global-standards.md` §6 chart map + the APPROVED-REFORM viz hints | , |
| Layout (width, tiles) | `00-BENTO-REFORM-PLAN` (half-width tiles, 2-4 per band) | global-standards "big sections" |
| Type scale | `00-BENTO-REFORM-PLAN` §2 Law 3 (small) | global-standards §2.3 (big serif heads) |
| Palette | 2026-06-23 hard rule (cool greys + terracotta only) | global-standards §2.1 (warm cream + moss/amber) |
| Good/bad encoding | word + position (founder 2026-06-27, no semantic colour) | global-standards §6 moss/amber |
| Fonts | Geist + Geist Mono + Newsreader + Space Grotesk | global-standards Inter |
| Currency | USD (constitution §18 + founder 2026-06-27) | the GBP one-off |
| Build procedure | `00-BENTO-REFORM-PLAN` §4 + §6 | , |

## Global rules block (apply to every manifest row)

- **Palette:** terracotta (`--atlas-500/600/700`) + cool greys ONLY. NO moss/green, amber, brown/cocoa, cream. Terracotta = the subject/the point, once or twice per card. Good/bad is a calibrated WORD + position, never colour, never pips on a numbers product.
- **Fonts:** Geist Sans (body/labels), Geist Mono (data figures, tabular 500), Newsreader (exactly 3 serif moments: place name, honest-take verdict, the closer), Space Grotesk (hero scorecard / the one hero number).
- **Currency:** USD ($) everywhere, abbreviated ($49K not $49,000). One global yardstick.
- **Type (bento scale):** page H1 clamp(24,30); the one hero number <=46px; cluster/section heads 15-17px (NOT giant serif); body 12-13px; caption 11px; eyebrow 10-11px. Tabular figures on every number.
- **Layout (bento):** sections are **half-width (col6) by default**; full-width (col12) ONLY for the masthead, a genuinely wide table/chart, and the one-thing closer. **Never a lone full-width section that could be half.** Every band carries 2 or more cards. Card-per-section, hairline border, 8px radius, no shadow, vertical gap = horizontal gap.
- **The five laws (hard gates):** (1) bento density, 2+ cards per band, ~35-45% shorter; (2) brevity, cut words >=50%, no eyebrow+title+subtitle+lead+caption stack; (3) small type; (4) trivia filter, a stat earns a tile only if non-obvious AND decision-relevant (banned: raw population, %-urban, vague wealth words); (5) per-visual gate, useful + understandable-in-3s + relevant + faithful (computed geometry).
- **Redundancy law:** every section serves one of the eight customer jobs; no two sections serve the same job (kills neighbourhoods-vs-shortlist duplicates). A number is stated once at full weight; later mentions add a new frame.
- **No chart type more than twice per page** (the viz-variety law, formalized by the 2026-06-27 viz-fitness audit). Distinguish two classes: (1) **TRUE chart types** , a distinct chart shape: ranked-bars, 100%-stacked, dumbbell, gradient-area/spark, vertical-bars, donut, data-table, card-grid, timeline-ribbon, diverging-track, proportion-bar , **hard-capped at 2 per page**. (2) **Positional ATOMS / reused primitives** , inline rating marks like a table cell or card: the spectrum-row, the range/threshold track, the scorecard stat-tile, the readiness mini-track, the tier magnitude , these are the MOST ACCURATE encoding for "position on a scale" (Cleveland-McGill), so they are kept and not swapped for a worse chart merely to avoid repetition, BUT held to **<=2 visually-prominent presentations**, differentiated by grouping + density. Pick the viz from the §6 map by the data relationship; match encoding effectiveness (position > length > angle > area > curvature).
- **Honesty rails:** terracotta only on the subject; unheld data folds to ONE "still filling in" strip, never a blank or fabricated number; cross-place comparisons carry the "not a league table" caveat; cities are the only scored entity.
- **Hero per page type:** photo + white-from-bottom gradient + Newsreader place name + a single table-card scorecard. No big hero number EXCEPT City (the 0-100 climate score on a peer-tick band) and Cell (the revenue/take gap + distribution).

## Manifest row template (every section is one row)

`#` | **Section** | **Job (A-H)** | **Subsections** | **Viz / component** (named, from §6) | **Width** (full/half) | **Data fields** | **Honesty / format note**

## Conformance audit (run before delivering any page; extends `_qc.cjs`)

- [ ] Every manifest section present, in manifest order; none missing.
- [ ] No section absent from the manifest (no extras, no duplicate job).
- [ ] Each section uses the manifest's named viz (no substitutions).
- [ ] Each section uses the manifest's width; no lone full-width section that should be half; every band 2+ cards.
- [ ] Currency = USD; palette greys+terracotta only (no moss/amber/brown); no chart type > 2x.
- [ ] Five laws pass (density, brevity word-count, small type, trivia filter, per-visual gate).
- [ ] Honesty: confidence/trust note present; unheld -> one strip; computed geometry; tabular figures.
- [ ] Geometry harness clean at 1280/768/375.
If any line fails, NOT delivered.

## Build procedure (from BENTO §4 + §6)

1. **Pre-build:** the manifest IS the section-list audit; confirm completeness against APPROVED-REFORM + section-constitution.
2. **Build:** walk the manifest; reform HTML = parts bin; computed geometry; word budgets + trivia filter enforced as tiles are written.
3. **Audit:** run the conformance audit above + the geometry harness.
4. **Sign-off:** deliver as the standalone HTML the founder opens; only on approval roll the standard to the next page.

## Reconciliation log (new instructions that change a manifest are recorded here)

- 2026-06-27: Currency reverted GBP -> **USD** (founder: "always use dollars"). Supersedes the earlier GBP interview answer.
- 2026-06-27: Good/bad = word + position; **no semantic colour** (moss/amber rejected). Supersedes global-standards §6 moss/amber.
- 2026-06-27: City demand-calendar viz = **vertical bars at half width** (founder), not the §6 area chart, which remains correct for the Cell seasonality beat.
- 2026-06-27: Country `fillingin` collapse-strip wash = **grey-100** (the hard palette law bans cream); the `country.md` row's earlier "cream-100" wording is superseded by the cool-greys-only rule. Applied in the country rebuild.
- 2026-06-27 (viz-fitness audit): formalized the **true-chart-types-vs-positional-atoms** framework (global rules block above); spec `docs/superpowers/specs/2026-06-27-viz-fitness-audit.md`. Two country deltas: (a) `market` (6) viz tightened from three positional reads to ONE band + a supporting line; (b) `ground` (8) viz changed from diverging-spectrum-rows to **stat-tiles + position dash** (it echoed the shape spectrum, row 2). Both pages otherwise validated , no true chart type exceeds 2x.
