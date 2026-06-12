# Pipelines Control Panel (2026-06-12)

> The one page that runs the whole program. Two pipelines build marginatlas.com to a
> masterpiece standard: **Fable** designs and structures (the elite, taste-bound work),
> **Sonnet** fills and replicates (the data work at scale). They are complementary by
> design and share one contract. You drive both by choosing which to run next. The single
> decision you make is at the bottom of this page.

This is a runbook, not a spec. The full specs are `docs/brand/pipeline-fable.md` and
`docs/brand/pipeline-sonnet.md`; the constitution is `docs/brand/design-system.md`; the
brand is `docs/brand/brand-identity.md`; the roadmap is
`docs/superpowers/plans/2026-06-12-atlas-master-execution-plan.md`. When anything here and a
spec disagree, the spec wins and this page gets corrected.

---

## The one-line mental model

**Fable owns how it looks and how it reads. Sonnet owns how many.**

Fable ships a TEMPLATE + the KIT + the CONTRACTS (the fence). Sonnet fills INSTANCES inside
that fence, fast, without lowering the bar. Fable runs on a frontier model because the work
is taste-bound; Sonnet runs on a cheaper, faster model because the work is bounded by Fable's
contracts. Neither may cross into the other's lane.

```
  FABLE (frontier)                         SONNET (claude-sonnet-4-6)
  the architect                            the cartographer
  ----------------------------------       ----------------------------------
  design system, tokens, font              (reads, never writes)
  the cartographic kit                     (reads, never writes)
  the Atlas Page Kit (components)          (reads as spec, never overrides)
  the page TEMPLATES (one per type)        (fills the data they render)
  the editorial CONTRACTS + validators     (obeys them; failing items requeue)
  3-5 gold exemplars per slot              (matches their bar; never edits them)
        |                                          ^
        |   handoff: TEMPLATE + KIT + CONTRACTS    |   escalation: contract-gaps.md
        +------------------------------------------+
```

---

## Pipeline 1: FABLE (the design / structure / elite-content pipeline)

**What it does.** Reforms the real Next.js pages of marginatlas.com to a masterpiece
standard, building the reusable templates, the Atlas Page Kit, the cartographic identity
system, and the elite template-content (section formulas, microcopy patterns, the editorial
content contracts + gold exemplars). It does the non-replicable, taste-bound work only: front
-end craft, visual hierarchy, branding, section design, voice patterns, originality devices,
and the signature-font decision. It NEVER generates per-cell data at scale.

**Which model.** Fable (frontier), every iteration. The master plan's "fabled-model strategy"
assigns Fable to design / voice / bug-root-cause / originality seeds. Do not delegate Fable
iterations to a cheaper model; that is what Sonnet is for.

**Exact starting point.** Phase 1 (Foundation), queue item 1: the token reconciliation pass.
The runner reads `docs/brand/_pipeline/fable-state.md`, takes the top pending unblocked item,
and runs the eight-step iteration protocol (read state, read authority, plan + dry-run-and-show,
implement, self-review against the constitution, verify with permission, record, stop). One
work item per run. If `fable-state.md` does not yet exist, the first run creates it from the
Phase 1 queue defined in pipeline-fable.md section 3.

  Launch line: `Run the next Fable pipeline item per docs/brand/pipeline-fable.md.`

**The five phases (each closed only by a founder gate):**

| Phase | Builds | Gate output |
|---|---|---|
| P1 Foundation | tokens reconciled, stale-palette sweep, the font showcase + decision, the motif kit, icon + pictogram families, the chart grammar, the spots, all catalogued | zero banned hexes; kit renders in `/_design`; font chosen or interim accepted |
| P2 Kit + flagship | the Atlas Page Kit primitives; the editorial CONTRACTS + validators + gold exemplars; the sub-type system; the flagship BUSINESS template on real cells | every slot has a schema + exemplars + a gate; flagship shipped after founder try |
| P3 City + Country + Industry | the three aggregate templates (City real-data; Country + Industry architecture-first with designed labeled placeholders) | three templates live on preview, founder approved |
| P4 Neighborhood + Learn + Compare + new types | the remaining mapped templates + one exemplar per new page type (sub-niche, venue, special-zone, theme) | full template family + instantiation specs |
| P5 Homepage + motion + coherence | homepage finish, the site-wide motion pass, the coherence sweep, the handoff package finalized | Sonnet unblocked; a 5-instance pilot validates end-to-end |

**The handoff contract (what Fable guarantees to Sonnet).** At each page-type gate Fable
delivers: the live founder-approved TEMPLATE (one parameterized `page.tsx` that reads instance
data); the typed editorial CONTRACTS (`src/lib/editorial/contracts.ts` + per-slot specs in
`docs/brand/editorial-contracts/*.md`: schema, length bounds, required citations of real data
fields, banned vocabulary, register spec, self-omit condition); 3 to 5 GOLD EXEMPLARS per slot
(the quality bar, read-only); the VALIDATORS in the gate suite
(`scripts/verify_editorial_contracts.ts`, `scripts/verify_pipeline_lanes.ts`); the patterns
doc and the sub-type curation rules; and the instantiation specs for the new page types. The
`FILL:<field_name>` convention marks every unfilled field for Sonnet to resolve.

**Current status.** NOT STARTED. The specs, the design-system constitution, the three audits,
and the visual-asset integration map are all written and mutually coherent (this control pass
verified that). The kit, contracts, validators, and templates do not exist yet; `src/lib/
editorial/` holds only `blurbs.ts` today; `scripts/verify_editorial_contracts.ts` and
`scripts/verify_pipeline_lanes.ts` are not yet created (Fable builds them at the P2 gate).
Next action is the very first P1 run.

---

## Pipeline 2: SONNET (the data / replication pipeline)

**What it does.** Takes a finished Fable template for a page type plus a target (a country,
city, industry, business category, neighborhood, or a pair) and produces a filled page: real
validated data in every field that can have it, labeled placeholders in the fields that
cannot, and lightly written Atlas-voice copy for the narrative slots. It does NOT redesign, add
sections, rearrange component order, or write CSS/tokens. It composes Fable's templates with
the Atlas data layer (Supabase, the cost engine, the extrapolation layer, the `src/lib/` domain
functions) and fans out across the target catalog.

**Which model.** `claude-sonnet-4-6` for the copy generation in narrative fields. Numeric
fields are never sent to the model; they resolve entirely from `src/lib/` accessors. The Fable
(frontier) model is never used for bulk replication.

**Exact starting point.** The first-run checklist in pipeline-sonnet.md section 17, beginning
with a dry run: `npx tsx scripts/pipeline/sonnet/run_loop.ts --dry-run --tier 1
--max-iterations 5`. This requires that at least one Fable template for the target page type is
merged to `main` (the hard precondition). If no template exists yet, Sonnet cannot start.
After the dry run, you open the 5 fill-reports, confirm no fabricated numbers and passing copy,
show the founder 3 filled pages on a Vercel preview, then run tier 1 unattended.

  Launch line: `Start the Sonnet data-fill loop per docs/brand/pipeline-sonnet.md, section 17.`

**The loop, in one breath.** A target catalog (the cross-product of geographies x industries x
page types) is built and sorted into 6 priority tiers (big economies with real data first, long
tail last) by `catalog_builder.ts`, stored as a queue of JSON descriptors. Each iteration pops
one (page-type, target) pair, loads the Fable template, resolves the data via the precedence
chain (trusted-local cell -> extrapolated+labeled -> baseline+labeled -> null/self-omit), runs
the per-iteration validation checklist (no raw values, no em-dashes, no source-agency names, no
fabricated numbers, distinctness guard, like-for-like guard, narrative quality, self-omit
confirmed), writes the output, writes a fill-report, and moves the queue entry to `done/`. The
loop is resumable: restart and it skips `done/`, retries `failed/` once.

**What Sonnet writes (the instance write set, the two buckets).** Identical to the Fable
handoff contract:
- **Editorial copy bucket:** `data/editorial/<page-type>/<slug>.json` (the contract-shaped
  narrative slots), plus `data/editorial/subtypes/<category>.json` for new page types.
- **Page-data bucket:** `data/seeds/<page-type>/`, Supabase `cells` row upserts (business pages
  are parameterized, not per-file), `content/blog/` front matter (Learn), and the narrow set of
  pre-existing content accessors that already hold instance data (`src/lib/content/
  narratives.ts`, `src/lib/cities/neighborhood_flavor.ts`).

It never authors or restructures a `page.tsx`, never touches `src/components/`, `src/styles/`,
or `design-tokens.ts`, never renames slugs, never fabricates a number, and never pushes to
production directly. The `verify_pipeline_lanes.ts` gate enforces this.

**The handoff contract (what Sonnet returns up to Fable).** A fill-report per target
(`scripts/pipeline/sonnet/reports/<target_id>.json`): which fields were real-data vs labeled
placeholder vs null, which validations passed, and the internal data sources used. The
fill-report is the handshake that lets Fable read coverage and adjust template fallbacks.
When Sonnet hits a case the contract does not cover (a slot needing a new pattern, a structural
change, a category where the sub-type rules feel wrong), it appends to the single shared
escalation file `docs/brand/_pipeline/contract-gaps.md` and skips the item. Fable triages gaps
at the top of its next run; contract changes are Fable-only.

**Current status.** BLOCKED on Fable. Pipeline 2 cannot run until Fable ships and merges at
least one template + its contracts + validators (the P2 gate). The `scripts/pipeline/sonnet/`
tree does not exist yet; Fable creates it (or its first consumer does) as part of the handoff
package at P5, and the data accessors it reads (`narratives.ts`, `comparative_narratives.ts`,
`neighborhood_flavor`) already exist. Do not start Sonnet first.

---

## How they stay complementary (the boundary, in three rules)

1. **Templates are read-only inputs to Sonnet.** Sonnet reads the Fable template, never writes
   to it. A needed structural change becomes a `contract-gaps.md` entry, not a self-edit.
2. **The design system is a hard dependency, not a variable.** Sonnet imports
   `design-tokens.ts` only to validate that any value it writes is token-legal. All visual
   decisions are made upstream in Fable.
3. **The fill-report is the handshake.** Every filled page carries one; it is the contract that
   lets both pipelines evolve without stepping on each other.

There is no overlap: where both docs name `HonestTakeBox`, Fable BUILDS the component + the
honestTake contract + the gold exemplars, and Sonnet FILLS the honestTake field per target from
that target's real margin and cost data. Same word, two non-overlapping jobs.

---

## The order is fixed (why you almost always choose Fable first)

Fable must run far enough to ship a template + its contracts + validators before Sonnet has
anything to fill. The dependency is one-directional:

```
  Fable P1 (foundation) -> Fable P2 (kit + flagship BUSINESS template + contracts + validators)
                                                |
                                                v
                                   Sonnet tier 1 (business pages, big economies)
                                                |
  Fable P3/P4 (more templates) ----------------+--> Sonnet tiers 2-6 (the rest), as templates land
```

So in practice: run Fable until the first template + contracts are merged, then you may
interleave -- Fable building the next template while Sonnet fills the catalog behind the
template just shipped. Sonnet always trails Fable by at least one merged template per page type.

---

## THE DECISION (this is the whole control panel)

Read `docs/brand/_pipeline/fable-state.md` (Fable's progress) and run
`npx tsx scripts/pipeline/sonnet/stats.ts` (Sonnet's coverage), then choose ONE:

- **If no Fable template + contracts are merged to `main` yet** (today's state):
  choose **FABLE**. Say: *"Run the next Fable pipeline item per docs/brand/pipeline-fable.md."*
  Repeat each run until the flagship BUSINESS template and its contracts pass the P2 gate.

- **If at least one template + its contracts + validators are merged** and you want coverage
  on that page type at scale: choose **SONNET**. Say: *"Start the Sonnet data-fill loop per
  docs/brand/pipeline-sonnet.md, section 17."* Run the tier-1 dry run, review 5 fill-reports
  and 3 preview pages, then run the tier unattended.

- **If both are unblocked** (a template is merged and more templates are still wanted): run
  them in parallel. Keep Fable on the next template while Sonnet fills the catalog behind the
  last one. Sonnet trails Fable by one merged template per page type, never leads it.

That single choice -- **Fable or Sonnet** -- is the entire operating decision. Everything else
each pipeline does for itself, re-entrantly, from its own state file, one item at a time.
