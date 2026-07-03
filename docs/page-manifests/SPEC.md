# SPEC , Page Assembly System (manifest + pipeline)

Status: draft for founder approval, 2026-06-27. Governs `docs/page-manifests/*` and the page-build pipeline. Separates the **mastermind** (what each page must contain, decided once) from **execution** (assembling it, mechanical and gated).

---

## 1. Problem

Pages drift from the ratified protocol on every build. Root causes (evidenced this session):
- The protocol is **fragmented across ~10 dated docs that contradict each other** (palette, type, currency, fonts), so "the spec" is reconstructed from memory each time and hallucinated.
- Pages are built by **patching pre-protocol HTML**, inheriting the wrong section structure.
- The only pre-delivery check was **geometry** (overflow/overlap), so content violations (missing sections, wrong viz, wrong currency, duplicated jobs) reached the founder.
- The production app already has a **section-ORDER** spec (`src/lib/page-layout/section-order.ts`) + a gate (`scripts/verify_page_sections.ts`, `verify_section_order`) + a typed component kit (`src/components/kit/engraved`), but it is **order-only** (no subsection / statistic / graphic detail), **disconnected** from the reformed design manifests, and **far behind the reform** (production cell = 7 sections; the reform manifest = 20).

Net: the "what" and the "how" are tangled. There is no single, detailed, enforceable description of what each page contains, so compute is wasted re-deriving it and regressing.

## 2. Goals

1. **One strict manifest per page type = the single source of truth** (`docs/page-manifests/{country,city,neighbourhood,cell}.md`). The mastermind.
2. The manifest specifies, **per subsection**: order, the **statistic(s)**, the **graphic** (a named primitive), width, data source, honesty/format. Nothing left to interpretation.
3. A **deterministic pipeline**: manifest -> derive the section-id order -> assemble from the typed kit -> gate conformance. The spec is decided once; execution is mechanical.
4. The **same schema + pipeline apply to all four page types**.
5. **Changing a page = editing its manifest** (which re-drives the order + the gate). The schema evolves deliberately, logged in the reconciliation log, never silently.

## 3. Non-Goals

- **Not re-deciding the design.** The manifest *consolidates* ratified decisions (APPROVED-REFORM + guidance + global-standards + founder deltas), it does not invent.
- **Not auto-generating React components from the manifest (v1).** v1: the manifest governs and the gate enforces; codegen is a P2.
- **Not changing data accessors or the honesty rails.** Those (`getCellBySlug`, the empty-state contract, no-fabricated-numbers) are unchanged.
- **Not forcing production to adopt the reformed spine this pass** (see Open Questions , the reform ships behind a flag; the manifest governs the mockups first).

## 4. The manifest schema (the mastermind format)

Each page manifest is ONE markdown file with three parts:

### 4.1 Header (3 lines)
- **Hero:** the exact hero spec for this page type (photo + white-from-bottom gradient + Newsreader name + the page's hero element , table-card scorecard / score band / the GAP).
- **Section-id order:** the ordered list of `<section id>` values (this IS the page's entry in `PAGE_SECTION_ORDER`).
- **Global rules:** "per 00-README.md" (palette, fonts, USD, bento widths, viz source, no-chart-twice, redundancy law).

### 4.2 The section table , ONE ROW PER SUBSECTION (the detail that kills hallucination)
Not one row per section. One row per **subsection**, so every statistic and every graphic is pinned:

| Col | Meaning |
|---|---|
| `#` | section number . subsection letter (e.g. 3a, 3b) |
| `Section` | the parent section (a customer job) + its `<section id>` |
| `Subsection` | the specific sub-point |
| `Statistic` | the exact statistic(s) shown (e.g. "median annual revenue, USD"; "p10/median/p90 spread") |
| `Graphic` | the named primitive from the §6 chart map / kit (e.g. `RangeStrip`, `ScoreBand`, `data-table1`, `dumbbell`, `diverging track`, `donut+companion`, `vertical bars`). Exactly one named graphic per row, or "none (stat tile / prose)". |
| `Width` | full / half / third (bento: half default) |
| `Data` | the accessor or source field (e.g. `getCellBySlug().revenue`, "modeled London exemplar") |
| `Honesty` | USD, tagged modeled, anti-ranking caveat, self-omit-if-thin, etc. |

### 4.3 Footer
- **Conformance config** (machine-checkable): the section-id list, currency, the per-graphic max-count (no type > 2x), banned graphics.
- **Notes / conflicts:** redundancy-law check (no duplicate jobs), chart-repetition check, source citations per row, and the violation checklist for the current mockup.

## 5. The pipeline (spec separated from execution)

Five stages. Stages 1 is the mastermind; 2 to 5 are mechanical and gated.

1. **SPEC (mastermind, human).** Author/edit the manifest. This is the ONLY place a design decision is made. Conflicts resolve by the 00-README precedence table; changes are logged in the reconciliation log. *Compute is spent here once, deliberately.*
2. **DERIVE (mechanical).** The manifest's section-id order IS `PAGE_SECTION_ORDER[type]` in `src/lib/page-layout/section-order.ts`. The manifest is upstream; the constant is kept in sync (v1: by hand with a diff check; P1: generated).
3. **EXECUTE (mechanical).** Assemble the page by **walking the manifest top to bottom**. Each subsection maps to its named graphic primitive (mockups) or its kit component (production). The reform HTML / kit is a **parts bin**; the structure, order, width and viz come ONLY from the manifest. No improvisation, no invented sections, no substituted charts.
4. **GATE (mechanical).** Before delivery, run conformance:
   - **Order + presence:** every manifest section-id renders, in order (`verify_section_order` in production; `_qc.cjs` `CONFORMANCE` for mockups).
   - **Detail:** each subsection's named graphic is the one rendered; widths match; currency = USD; no graphic type > 2x; the five bento laws; honesty tags present.
   - **Geometry:** the existing harness (overflow / overlap / ragged at 1280/768/375).
   Any failure blocks delivery. The gate is the reason a regression cannot reach the founder.
5. **CHANGE.** To change a page, **edit the manifest first** (stage 1), then re-derive + re-execute + re-gate. The manifest is never bypassed; execution can never silently diverge.

## 6. Grounding in the existing code

The system is half-built; the spec formalizes and connects it.

| Pipeline stage | Already exists | This spec adds |
|---|---|---|
| SPEC | , (decisions scattered) | the detailed per-subsection manifest as the single upstream source |
| DERIVE | `PAGE_SECTION_ORDER` in `lib/page-layout/section-order.ts` | the manifest becomes upstream of it; a sync/diff check |
| EXECUTE | `kit/engraved` typed components, composed in route files (`app/[country]/page.tsx`, etc.) | each manifest subsection maps to a named component/primitive |
| GATE | `verify_section_order` / `verify_page_sections.ts` (order, subsequence) | extend to subsection + graphic + width + currency conformance; mirror in `_qc.cjs` for mockups |

## 7. Requirements

**P0 (this pass):**
- The schema (§4), ratified.
- All four manifests authored to the schema, subsection-level.
- The conformance gate for mockups (`_qc.cjs` `CONFORMANCE`, per page) , done for city, extend to all four.
- Build-from-manifest (parts-bin) for every page rebuild.
- Acceptance: a rebuilt page passes order + detail + geometry conformance against its manifest, or it is not delivered.

**P1 (fast follow):**
- Sync `PAGE_SECTION_ORDER` to the manifests (diff check in prebuild).
- Extend the production `verify_page_sections` to assert the named graphic per section.

**P2 (later):**
- Generate component scaffolds from the manifest (codegen).
- Production pages rebuilt to the reformed spines (behind the reform flag).

## 8. Open questions

- **Production adoption timing (founder/eng).** Production section orders are far simpler than the reformed manifests. Do the manifests govern only the standalone mockups until the reform ships, then production adopts them , or do we sync `section-order.ts` to the reformed manifests now (which would change the live pages)? *Recommended: manifests govern mockups now; production adopts at reform ship, P2.*
- **Graphic vocabulary freeze (founder).** Lock the named-graphic list (the §6 map minus moss/amber) so "Graphic" column values are a closed set the gate can check.
- **Manifest-to-component map (eng).** One table mapping each named graphic to its kit component, so EXECUTE and the GATE share one vocabulary.

## 9. Worked example (the schema, on three city subsections)

Demonstrates §4.2 , one row per subsection, statistic + graphic pinned (full version lives in `city.md`):

| # | Section (id) | Subsection | Statistic | Graphic | Width | Data | Honesty |
|---|---|---|---|---|---|---|---|
| 1a | Hero (`top`) | the score | Business Climate Score 0-100 + peer ticks | `ScoreBand` (Space Grotesk number) | full | modeled, city-level | only cities are scored; caption names the tension |
| 1b | Hero (`top`) | at-a-glance | 8 vital signs (median pay, rent character, demand depth, money-to-open, break-even...) | table-card scorecard, one calibrated word each | full | mixed accessors | USD; raw population NOT a tile (trivia filter) |
| 3a | Customer (`customer`) | who pays | median resident income + p10/p90 | `RangeStrip` (atlas median tick) | half | income spread | USD; led by the so-what |
| 3b | Customer (`customer`) | what income buys | relative cost index (national=100, city=132) | two-ended relative mini-scale | half | modeled index | "relative, not a rent quote" |
| 3c | Customer (`customer`) | resident vs visitor | footfall split % | proportion bar (never a pie) | half | modeled | "footfall share, not spend" |
| 3d | Customer (`customer`) | the year | footfall index by month | **vertical bars** (half width) | half | modeled monthly | directional; folded into the customer band, not its own movement |

Every cell above is a decision already made; the builder reads it and renders it, with nothing left to invent.
