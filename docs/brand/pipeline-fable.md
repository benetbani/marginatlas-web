# PIPELINE 1: The Fable Page Reformation (2026-06-12)

> The elite pipeline. A frontier model (Fable) reforms the real Next.js pages of
> marginatlas.com to a masterpiece standard in UP TO 5 PHASES, building the reusable
> TEMPLATES, the Atlas Page Kit, the cartographic system, and the elite template-content
> patterns that the Sonnet pipeline (PIPELINE 2) will fill at scale. Fable does only the
> non-replicable work: front-end craft, visual hierarchy, branding, section design,
> voice patterns, originality devices. It NEVER generates per-cell data at scale.

---

## 0. Authority stack (read in this order, every run)

1. `docs/brand/brand-identity.md`: WHO the brand is. Nothing may contradict it.
2. `docs/brand/design-system.md`: the visual constitution (color jobs, type, spacing,
   motifs, motion budget, the DO/DON'T table). The constitution wins over taste.
3. `src/lib/design-tokens.ts`: the value authority. Every literal lives here.
4. `docs/design-system/GUIDELINES.md`: the engineering rulebook (cva, forwardRef,
   layering, the third-consumer rule, the pre-merge checklist, the `/_design` catalog).
5. `docs/superpowers/specs/2026-06-11-page-content-map.md`: WHAT each page contains,
   in reading order, plus the brand/experience and design/aliveness layers.
6. `docs/superpowers/plans/2026-06-12-atlas-master-execution-plan.md`: the campaign
   roadmap this pipeline executes the design half of.
7. The design exports under `docs/brand/assets/incoming/Margin-Atlas--5/` are RAW
   MATERIAL, refined by the three audits in `docs/brand/_audit/` (asset, design,
   screenshot). Canonical set: `--5`. Sets `--17..--20` are stale page iterations:
   NEVER port from them. The audits' verdicts (ADOPT / REFINE / DROP) and the
   stale-palette conform map (asset-audit section 3) are binding.

Standing constraints, binding on every line this pipeline writes:

- Tokens only. No raw hex, px, ms, easing curve, font name, or z-index in components.
- No em-dashes in user-facing source (period, comma, colon instead).
- No source-agency names in user-facing copy.
- Plain operator voice: a sharp friend with the numbers. Never corporate, never
  consultant-speak. "What the owner keeps," "kebab shop," real units (covers, tickets).
- No fabricated data. Real data via the lib accessors, or honest labeled placeholders,
  or self-omission. Never a fake real-looking number. Never invented quotes.
- No URL slug renames. WCAG AA floor. `prefers-reduced-motion` on every animation.
- Verification discipline per the master plan: dry-run and show before data/render
  changes; preview-verify; desktop + mobile screenshots; founder try on high-stakes
  surfaces. Build/prebuild/tsc commands run only with founder permission (standing rule).

---

## 1. What this pipeline IS and IS NOT

### IS (the elite, non-replicable work)

- Reforming the real pages in `src/app/` and `src/components/` to a higher standard,
  with more imagination than the exports, following the brand and the content map.
- The reusable TEMPLATE per page type: layout, section order, hierarchy, band rhythm,
  the cartographic thread, mobile reflow, motion. Designed once, inherited everywhere.
- The Atlas Page Kit: the shared component vocabulary (master plan Phase 0.2),
  tokens-only, nullable-in silence-out, catalogued on `/_design` before use.
- The elite TEMPLATE-CONTENT: section title formulas, microcopy patterns, the
  honest-take / contrarian / myth-vs-reality CONTENT CONTRACTS (schema + gold
  exemplars), the sub-type switcher system, empty-state lines, the closing furniture.
- The cartographic identity system: motifs, icons, pictograms, spots, chart grammar,
  all conformed to tokens.
- The signature font decision (P1), executed as a slot swap.

### IS NOT (hard boundary)

- It NEVER generates per-cell editorial or data at scale. It never writes "how much
  does a bakery make in Djibouti." It writes the FRAME that sentence will live in,
  the schema that constrains it, and 3 to 5 hand-crafted gold exemplars per slot for
  flagship cells only.
- It never bulk-edits instance files under `data/editorial/` or `data/seeds/` (that is
  Sonnet's lane; see the handoff contract, section 8, for the full instance write set).
- It never invents numbers, quotes, anecdotes, or place facts. Sample content in the
  catalog is visibly marked SAMPLE and never ships on a live route.
- It is not an asset-generation pipeline (Track B delivers asset bundles; this
  pipeline integrates and conforms them).

---

## 2. The model and the loop (how to run this, trivially)

**Model: Fable (frontier), every iteration.** This pipeline exists because the work
is taste-bound: hierarchy, restraint, voice, originality. Do not delegate iterations
to cheaper models; that is what Pipeline 2 is for.

### 2.1 State

One state file drives everything: `docs/brand/_pipeline/fable-state.md`.

```
# Fable pipeline state
phase: P1
queue:                      # ordered, top item is next
  - id: P1-03
    title: Port the 7-gradation RangeStrip from atlas-components.css .rstrip
    status: pending         # pending | in_progress | blocked(<why>) | done(<commit>)
done:
  - P1-01 <commit sha> <one-line result>
decisions:                  # founder calls captured as they land
  - 2026-06-14 display face = <chosen>, slot swapped
notes:                      # gotchas for the next run
```

Each phase section below defines the initial queue. The runner never invents scope
mid-run; new ideas append to the queue with a note, for triage at the phase gate.

### 2.2 The iteration protocol (one work item per run)

Every run is the same eight steps. This is the whole loop; it can be launched with a
one-line prompt ("Run the next Fable pipeline item per docs/brand/pipeline-fable.md").

1. **Read state.** Open `fable-state.md`, take the top pending unblocked item.
2. **Read authority.** Re-read the relevant sections of the authority stack for this
   item (the design-system chapter it touches, the content-map page type, the audit
   verdicts on any export being ported).
3. **Plan briefly.** A short written micro-plan in the work log (what files, what the
   result looks like, how it will be verified). For render-affecting changes: dry-run
   and show the founder BEFORE writing to pages (standing rule).
4. **Implement.** Tokens only. cva + forwardRef + displayName for primitives. Real
   headings. Nullable inputs, silent omission. Catalog story on `/_design` for every
   new primitive BEFORE any page consumes it.
5. **Self-review against the constitution.** Walk the design-system DO/DON'T table
   and the Definition of Done (section 7 below) explicitly. Fix what fails.
6. **Verify.** With permission: `npx tsc --noEmit`, `npm run prebuild`. Vercel preview.
   Desktop (1280+) and mobile (375px) screenshots of every touched surface. Compare
   against the brand: would a stranger call this a beautiful modern almanac?
7. **Record.** Update `fable-state.md` (item -> done, sha, one-line result; append any
   discovered follow-ups to the queue). Commit with a clear message.
8. **Stop.** One item per run keeps the quality ceiling high. The loop is re-entrant;
   the next run picks up the next item cold from state.

### 2.3 Phase gates (founder checkpoints)

A phase is closed only by the founder. At each gate Fable presents: the phase DONE
checklist with evidence (screenshots, preview links, the catalog), the open decisions,
and the next phase's queue for approval. High-stakes surfaces (the flagship business
page, the homepage, anything reworking core data display) get a founder try on a
preview BEFORE production, per the master plan.

### 2.4 Escalation rules

- If an item needs data that does not exist: build the skeleton with an honest labeled
  placeholder (COUNTRY / INDUSTRY / CITY only, per the build rule) or self-omit
  (BUSINESS / NEIGHBORHOOD / LEARN / COMPARE), append a data request to
  `docs/brand/_pipeline/data-requests.md`, and move on. Never block on data; never
  fake it.
- If an item collides with the constitution: the constitution wins. If the
  constitution is wrong, propose an amendment by PR (design-system section 17), never
  a silent workaround.
- If an export asset fails the retone (looks off-brand even after the token conform):
  DROP it and design fresh. The exports are vocabulary, not gospel.

---

## 3. PHASE 1: Foundation (design system, tokens, the font, the cartographic kit)

**Objective:** the ground every later phase stands on. After P1, no later phase ever
touches tokens, fonts, motifs, icons, or chart grammar again except through them.

### Deliverables

1. **Token reconciliation pass.** `src/lib/design-tokens.ts` audited against
   design-system.md sections 3 to 7 and 11; any gap closed (the doc says the token
   file wins on values; make sure every documented scale actually exists: `tier`,
   `delta`, `sectionSpacing`, `elevation`, `duration`/`easing`, `z`). Confirm
   `tailwind.config.ts` exposes the semantic aliases (bg-background, text-muted, etc.).
2. **The stale-port cleanup (overdue, mechanical).** Finish the v2 token migration the
   design audit flags (section 6): `src/components/v2/CityHeroV2.tsx` and siblings
   swap hardcoded coverage-dot hexes (`#1F8A4C`, `#2563EB`, `#B45309`) for
   `colors.tier` / `<TierDot>`, and the white/cool-grey canvas for the cream/ink
   ladder. Repo-wide sweep for the banned export ramps (burnt orange `#9A3412`,
   `#C2410C`, `#D7642E`, `#D73A14`, `#E0451F`, `#A55C00`, `#D47706`; off-moss
   `#5F7D55`; cool greys) using the asset-audit conform map.
3. **The font decision (the open brand action).** Build the font-showcase page at
   `src/app/dev/font-showcase/` (or `/_design/type`): 3 or 4 hand-picked serif
   candidates rendered side by side ON A REAL Atlas business-page mock (masthead,
   anchor number with the split-number treatment, section heads, a pull quote, the
   italic "a year" suffix, numerals at display size), desktop and mobile. Candidates
   must be distinctive, warm, confident, timeless, with good lining figures. The
   founder FEELS and chooses; Fable executes the swap as a `--font-display` slot
   change only. Until chosen, everything binds to the slot (no hardcoded face names
   anywhere; the export `atlas-charts.js` Newsreader hardcode is the named
   anti-pattern).
4. **The cartographic motif kit, live.** Port the six motif SVGs + paper pattern from
   `Margin-Atlas--5`, retoned (marks in `parchment`, accent-dot field in `atlas-500`),
   into tokenized CSS utilities (`src/styles/homepage-visual-tokens.css` /
   `src/styles/atlas-pattern.css`, the documented homes). Ship the usage budget as
   code comments + a catalog page section: at most one motif surface per band, most
   bands none, never behind data, never stacked.
5. **The icon + pictogram families, wired.** Port `atlas-icons.js` (40 `ma-` icons)
   and `atlas-pictograms.js` (64 trade/venue marks) into the destinations named in the
   integration map (`docs/brand/visual-assets.md` section 2.3/2.4:
   `src/components/brand/icons/` and `src/components/brand/pictograms/`), as a tokenized
   icon layer that composes with the existing `src/components/icons/` + `SectorIcon` (no
   new icon dependencies; the Phosphor assumption is dropped). Accent classes bind to the
   vermillion token. Every recurring section concept gets its quiet mark.
6. **The chart grammar, consolidated.** One builder set from `atlas-dataviz.js` +
   `atlas-charts.js` (deduped, retoned, fonts and colors from tokens), implementing
   the fixed color jobs (vermillion = typical/leader/you-are-here; moss = kept;
   cocoa = costs; parchment = rails) and the chart rules (annotate the takeaway,
   honest axes, nullable-in silence-out, tier honesty top-right).
7. **The spot illustrations, staged.** `atlas-spots.js` retoned (washes to tokens) and
   registered, with the placement budget (max one spot per band; brand moments only).
8. **Catalog.** Every one of the above demonstrated on `src/app/_design/` in every
   state (the state contract, design-system 12.3).

### The loop within P1

Queue order: 1 -> 2 -> 3 (showcase built early so the founder can decide while the
rest proceeds) -> 4 -> 5 -> 6 -> 7 -> 8 rolling (catalog lands with each item).

### DONE means

- Zero banned hexes in `src/` (sweep proves it); v2 components fully on tokens.
- The motif utilities, icon families, chart builders, and spots render in the catalog,
  conformed, with usage budgets written down.
- The font showcase is live on a preview and the founder has either chosen (slot
  swapped site-wide) or explicitly deferred with the interim face accepted.
- tsc + the gate suite pass; catalog screenshots desktop + mobile archived in
  `docs/brand/_pipeline/evidence/p1/`.

### Handoff artifacts produced

The kit-level vocabulary Sonnet will never touch but will reference by name: token
names, icon ids, motif class names, chart builder APIs. Frozen at the P1 gate.

---

## 4. PHASE 2: The Atlas Page Kit + the flagship business-page template

**Objective:** the single highest-leverage build. The shared component vocabulary,
then the masterpiece BUSINESS page template every other page inherits. This is the
one surface worth over-investing in (master plan Phase 1).

### Deliverables

1. **The Atlas Page Kit** (master plan 0.2, design-system 12.2), as tokenized
   primitives with catalog stories, in dependency order:
   - `RangeStrip` (the 7-gradation spread; port the `.rstrip` spec from
     `atlas-components.css`, NOT the 3-point band; draw-on once on reveal).
   - `MoneyGoesBreakdown` (per-$100 stack + plain ruled list; `.stack` + `.pnl` spec;
     the kept row is the one vermillion/moss moment).
   - `HonestTakeBox` (THE through-line; `.verdict` spec as visual seed; sits right
     after the headline numbers on every page type).
   - `AnswerFirstMasthead` (evolves `DenseCellHero`: coordinate eyebrow + provenance
     tier chip top-right, serif question H1, the one-line plain-English verdict, the
     anchor number with split-number treatment and subtle count-up, the spread beside
     it, the `SubTypeSwitcher` mount; anchor confident, never a shout).
   - `SubTypeSwitcher` (client island at the title; niche + venue switch; quiet
     cross-fade of the readout, same chrome different reality; arrow-key accessible).
   - `StickySectionNav` (quiet jump links; compact chip row on mobile).
   - `PlainTerms`, `GutCheck`, `RightForWrongFor` (`.twocol` spec), `LocalEdge`,
     `ContrarianInsight`, `MythVsReality`, `OperatorVoices` (sourced-quote block,
     degrades gracefully until Track A lands), `CaptiveVenueNote`, `FreeZoneNote`,
     `FreshnessStamp`, `FlagIt`, `CountUpNumber`, `ScrollReveal`.
   - The comparison kit (`SplitHero`, `StatBand`/`StatRow`, `DivergentBars`,
     `EditorialBlock`, `CrossLinkRibbon`) and the score set (gauge, sub-bars, seg-10;
     cities stay the only scored entity).
2. **The CONTENT CONTRACTS (the elite template-content).** For every editorial slot,
   a typed schema + voice spec + gold exemplars, NOT scale content:
   - Location: `src/lib/editorial/contracts.ts` (zod schemas) + per-slot spec docs in
     `docs/brand/editorial-contracts/<slot>.md`.
   - Each contract defines: required fields and length bounds (e.g. honest-take
     verdict line <= 90 chars; body 40 to 80 words), which numbers from the page's
     real data MUST be cited, banned vocabulary (consultant-speak list, hype words,
     em-dash, agency names), required register (talk to "you", dry wit allowed, no
     metaphors), and the self-omit condition (when the slot must not render).
   - Slots: honestTake, verdictLine, plainTerms, gutCheck (3 fixed questions + honest
     answers), rightForWrongFor, localEdge, contrarianInsight, mythVsReality,
     operatorVoices (sourced only; source field mandatory), narrative, oneThingToRemember,
     captiveVenueNote, freeZoneNote.
   - **Gold exemplars:** Fable hand-writes 3 to 5 per slot, for FLAGSHIP cells only
     (e.g. restaurants in California, cafes in Lisbon), grounded in the real numbers
     those pages already render. These are the quality bar and few in number, by design.
   - **Validators:** `scripts/verify_editorial_contracts.ts` added to the gate suite,
     linting any instance file against its schema (lengths, banned words, citation of
     real fields, no fabricated-looking precision). This is the fence that lets Sonnet
     run fast later without lowering the bar.
3. **The microcopy pattern library.** `docs/brand/editorial-contracts/patterns.md`:
   the fixed section-name vocabulary across page types (so the jump nav reads the same
   everywhere), the H1 formulas per page type ("How much does a {trade} make in
   {place}?"), eyebrow conventions (CATEGORY · PLACE · COUNTRY), chart titles that
   assert findings not topics, empty-state lines, the authority line, the FlagIt line,
   the freshness phrasing ("checked June 2026").
4. **The sub-type system.** The switcher component (above) + the curated config schema
   (`src/lib/editorial/subtypes.ts`): per category, a HANDFUL of sub-niches whose
   economics genuinely differ, plus venue contexts where they genuinely differ. Fable
   hand-curates the flagship categories (restaurants -> pizzeria / kebab / sushi /
   fine-dining; venue: high street / mall / airport / station). The curation RULES are
   written down so Sonnet can extend per category later without inventing variants.
5. **The flagship BUSINESS page template,** composing the kit + REAL data in the
   content map's exact reading order (items 1 to 14 + the design-layer additions):
   masthead -> honest take -> narrative -> revenue picture + RangeStrip -> PlainTerms
   -> MoneyGoesBreakdown -> what the owner keeps (gated) -> break-even -> wages by
   role -> startup cost -> seasonality (real-data-gated) -> GutCheck -> realistic
   first year -> same business a short drive away (like-for-like) -> LocalEdge /
   venue / zone notes / ContrarianInsight / MythVsReality -> OperatorVoices ->
   RightForWrongFor + next step + notebook link + FreshnessStamp + FlagIt.
   Sticky nav; alternating bands; only the deepest technical sections collapsed;
   mobile reflow per design-system 13.3. Built behind a flag if needed; iterated HARD
   on preview against real cells until it reads as a masterpiece; founder try; ship.

### The loop within P2

Kit primitives land one per run (catalog first), in the dependency order above.
Contracts + patterns land alongside the components they feed (HonestTakeBox ships
with the honestTake contract and its exemplars). The flagship page is then a
composition pass, iterated on preview in multiple runs: hierarchy pass, voice pass,
density/calm pass, mobile pass, motion pass.

### DONE means

- Every kit primitive catalogued in all states; tsc + gates green.
- Every editorial slot has a schema, a spec doc, gold exemplars, and a validator gate.
- The flagship business page renders REAL cells (at least 3 economically different
  ones: a thin-margin food trade, a professional service, a capital-heavy trade)
  beautifully on desktop and 375px, with the count-up, the spread, the honest take,
  and at least one genuinely unique element per page; founder has tried it on preview
  and approved; shipped.
- No per-cell content generated beyond the named gold exemplars.

### Handoff artifacts produced

The complete contract bundle: component props APIs (typed), the editorial schemas +
validators, the patterns doc, the sub-type curation rules, and the flagship page as
the living reference implementation.

---

## 5. PHASE 3: City + Country + Industry templates

**Objective:** the three big aggregate surfaces inherit the flagship's standard.
Country and Industry are architecture-first (labeled placeholders allowed); City is
real-data.

### Deliverables

1. **CITY template** (real data, content map order): masthead + Business Climate
   Score (kept; the score set from P2) -> the board -> honest take -> who the local
   customer is -> what shop and office space costs (real-data-gated) -> tourist money
   vs local money (always on) -> what an owner keeps across the everyday trades ->
   best areas to set up -> neighbourhoods (the engraved street map stays the city
   signature, one per page) -> how the city is changing (smaller, trend-gated) ->
   rival + peer cities. Answer-first reorder; sticky nav. No duotone photo filter
   (stays dropped).
2. **COUNTRY template** (skeleton-friendly): hero -> the decisive read (tax, register
   cost, payroll; + how long it takes to get going: steps + days) -> how hard it is to
   hire (+ the wage floor sub) -> how this country compares to its neighbours
   (like-for-like, `DivergentBars`, capped to one held axis, never an absolute
   ranking) -> best + worst city -> character -> related countries. New sections
   render honest labeled `N/A` placeholders where data is missing (the build rule);
   the placeholder design itself is a designed state (calm, crosshatch "unfinished by
   design" language from the empty-state bundle), never a fake number.
3. **INDUSTRY template** (skeleton-friendly): hero -> what a typical one looks like
   (reuse `TypicalFirmCard` shape) -> where this business earns the most (ranked
   across COMPARABLE places only) -> the cost structure -> links into places + cells.
4. Each template carries the through-line set: HonestTakeBox, FreshnessStamp, FlagIt,
   the fixed section vocabulary, the motif budget, the closing furniture.
5. **Contracts extended:** city/country/industry editorial slots (e.g. the country
   decisive-read narrative, the city local-customer read) get schemas + exemplars
   (2 to 3 each, flagship places only) + validator coverage.

### The loop within P3

One page type per arc, multiple runs each: structure run (sections + data wiring or
labeled placeholders), hierarchy/voice run, mobile run, preview + founder gate per
page type. City first (real data, fastest founder feedback), then Country, then
Industry.

### DONE means

- All three templates live on preview against real routes (e.g. /cities/london, a
  major country, a flagship industry), answer-first, kit-composed, honest-take placed,
  placeholders labeled and designed (never fake), desktop + mobile verified, founder
  approved. Contracts + validators cover the new slots. No hand-filled aggregate data
  beyond what the lib accessors already provide.

### Handoff artifacts produced

Three more reference templates + their slot contracts. The placeholder convention
(what Sonnet/the data pipeline replaces later) documented per section in
`docs/brand/_pipeline/placeholder-register.md` (section id, expected data shape,
where it will come from).

---

## 6. PHASE 4: Neighborhood + Learn + Compare + the new page types

**Objective:** the remaining mapped types (real data) plus the originality surfaces
the design layer unlocked.

### Deliverables

1. **NEIGHBORHOOD template** (real data from `neighborhood_flavor_v1.json`): hero ->
   what thrives here and why -> who lives and shops here -> how pricey it is to
   operate -> compare to adjacent districts (like-for-like `.ctbl` language) -> the
   businesses here. The engraved street map language shared with City.
2. **LEARN template:** the long-form editorial bones from `DecadeArticleLayout`
   (re-skinned warm, tokenized: series eyebrow, serif title, italic deck, drop cap,
   numbered sections, accent-rule blockquote) + the content map order: question +
   headline answer -> a worked example (a real sample P&L, clearly labeled as a worked
   example, never presented as a specific business's data) -> plain-words explanation
   -> other businesses worth a look -> link to live benchmarks (gated on the 0.1 bug
   fix landing in the master plan; self-omit until then).
3. **COMPARE template:** `SplitHero` + `StatBand` + `DivergentBars` + "where each one
   wins" (balanced, honest trade-offs, never "this one is bad") + `CrossLinkRibbon`.
   The like-for-like + distinctness guard enforced in the component layer.
4. **The new page types** (each reuses the kit; each must carry one unique thing):
   - Sub-niche pages (pizzerias across places): a template instantiating the sub-type
     system across geography; strong SEO surface.
   - Venue-type pages (airport businesses, mall businesses): the captive-venue
     economics called out via `CaptiveVenueNote`.
   - Special-zone pages (e.g. free zones), where significant: `FreeZoneNote` anchored.
   - Theme pages (businesses that thrive in tourist / college / oil towns).
   - Scenario pages: explicitly LATER (lower priority, per the content map).
   Fable builds each as a TEMPLATE + one exemplar instance on a flagship subject,
   chosen where real data already exists. The long tail of instances is Sonnet's.
5. Contracts + validators extended to the new slots (thrives-here-why, worked-example,
   where-each-wins, theme-page intro).

### The loop within P4

Neighborhood -> Learn -> Compare (mapped types first, they have real data), then the
new types one per arc, each: template run, exemplar-instance run, preview + gate.

### DONE means

- All four mapped templates + at least one exemplar instance per new page type live
  on preview, verified desktop + mobile, founder approved. Every exemplar carries at
  least one genuinely unique element. Compare provably refuses non-like-for-like
  pairs. No scale instantiation happened here.

### Handoff artifacts produced

The full template family. The new-page-type instantiation specs: for each type, what
an instance needs (data inputs, editorial slots, eligibility rules e.g. "venue page
only where the venue premium is real in the data"), written so Sonnet can produce
instances without design judgment.

---

## 7. PHASE 5: Homepage + motion + final polish

**Objective:** the front door last, when the vocabulary is proven; then the
site-wide aliveness pass and the final coherence sweep.

### Deliverables

1. **HOMEPAGE finish** (master plan Phase 7): fold the parked Pass A in; answer-first
   hero; the honest US-states data story kept; sub-type-aware search (after the search
   cascade lands); a real "vs the world" anchor; the flagship-report weave; the
   marketing band reconciled to the new kit; the living world map (faint breath,
   subtle enough to miss).
2. **The motion pass, site-wide:** the sanctioned vocabulary only (design-system 11.2):
   scroll fade-and-rise once, the masthead count-up, sub-type cross-fade, range-strip
   draw-on, freshness pulse, tactile micro-confirms, calm skeletons. Budget enforced:
   one or two animated elements per view, 450ms ceiling, reduced-motion everywhere.
   Remove any animation the page works equally well without.
3. **The coherence sweep:** one run per page type re-reading every shipped template
   against the DO/DON'T table and the brand one-breath paragraph; vermillion budget
   audit (one subject per view); section-name vocabulary audit (the jump nav reads
   identically everywhere); icon/motif budget audit; numerals audit (tabular,
   right-aligned); a11y audit (focus, contrast pairs, headings outline, chart text
   summaries).
4. **The pipeline handoff package, finalized** (section 8 below) and the Sonnet
   pipeline unblocked.

### The loop within P5

Homepage in 2 to 4 runs (structure, voice, motion, founder gate: this is a
founder-try surface). Then motion sweep, then coherence sweep (one run per page
type), then the handoff package run.

### DONE means

- Homepage shipped after founder try. Motion inventory documented and within budget.
  Coherence sweep findings fixed or queued with reasons. The handoff package complete
  and the first Sonnet batch validated end-to-end through the gates (a pilot of ~5
  instances passes the validators and renders correctly in the templates with zero
  Fable intervention).

---

## 8. THE HANDOFF CONTRACT (Fable -> Sonnet, explicit)

**The one-line contract: Fable ships a TEMPLATE + the KIT + the CONTRACTS; Sonnet
fills INSTANCES. Fable owns how it looks and how it reads; Sonnet owns how many.**

### What Fable guarantees at handoff

1. **Templates** for every page type, live, founder-approved, composed from the kit,
   rendering real data via the lib accessors, self-omitting where data is thin.
2. **Typed contracts** for every editorial slot (`src/lib/editorial/contracts.ts` +
   `docs/brand/editorial-contracts/*.md`): schema, length bounds, required citations
   of real data fields, banned vocabulary, register spec, self-omit condition.
3. **Gold exemplars** (3 to 5 per slot, flagship subjects) as the quality bar.
4. **Validators in the gate suite** (`scripts/verify_editorial_contracts.ts` and
   friends): any instance that fails schema, voice lint (em-dash, agency names,
   consultant-speak list), length, or citation checks cannot ship.
5. **The patterns doc** (titles, section names, microcopy formulas) and the sub-type
   curation rules.
6. **The instantiation specs** for the new page types (eligibility, inputs, slots).

### What Sonnet does (Pipeline 2's lane)

- Writes INSTANCE artifacts only, into the data-and-copy lane, never the design layer.
  Two buckets, both documented identically in pipeline-sonnet.md section 5:
  - **Editorial copy instances:** `data/editorial/<page-type>/<slug>.json` (and, for new
    page types, instance configs e.g. `data/editorial/subtypes/<category>.json`). This is
    the canonical home for the contract-shaped narrative slots (honestTake, plainTerms,
    etc.).
  - **Page-data seeds and pre-existing data accessors:** `data/seeds/<page-type>/`,
    Supabase `cells` row upserts (business pages are parameterized, not per-file),
    `content/blog/` front matter (Learn), and the narrow set of content accessors that
    already hold instance data (`src/lib/content/narratives.ts`,
    `src/lib/cities/neighborhood_flavor.ts`).
  All conform to the contracts, grounded ONLY in the real numbers the page's data layer
  provides plus sourced material from Track A.
- Runs the validators locally per batch; failed items are requeued, never hand-waved.
- Proposes, never invents: where a slot's required real data is missing, the instance
  omits the slot (the template self-omits). No padding, no generic filler.

### What Sonnet may NEVER touch (the design layer, enforced by the lane gate)

- `src/components/**`, `src/styles/**`, `src/lib/design-tokens.ts`, the templates
  (`page.tsx` layout/structure), the kit, the contracts themselves, tokens, or any
  layout/voice spec. The boundary is design vs data: Sonnet may write instance COPY and
  DATA, never structure, components, or visual values. Enforced by review convention and
  a path gate (`scripts/verify_pipeline_lanes.ts`: a Sonnet-pipeline commit that adds or
  reorders sections, touches `src/components/`, `src/styles/`, `design-tokens.ts`, or
  edits the structural body of a template `page.tsx` fails the gate; the allowed write
  set is the two buckets above. Added to the suite at the P2 gate alongside the editorial
  validators).
- The gold exemplars (read-only references).

### The escalation channel back up

When Sonnet hits a case the contract does not cover (a slot that needs a new pattern,
a category where the sub-type rules feel wrong), it appends to
`docs/brand/_pipeline/contract-gaps.md` and skips the item. Fable triages gaps at the
top of each subsequent run; contract changes are Fable-only and versioned in the
contract files.

### The quality feedback loop

Periodically (each phase gate and monthly after), Fable samples N shipped Sonnet
instances at random, grades them against the gold exemplars, and either tightens the
contract/validator or upgrades the exemplars. The bar never silently drifts.

---

## 9. Definition of Done (every Fable item, every phase)

- Composed from tokens and the kit; zero raw literals; cva/forwardRef/displayName on
  primitives; catalog story before first use.
- Answer-first; the honest take placed; the spread shown (7 gradations) wherever a
  typical value appears; numbers below the masthead treated as equals.
- Plain operator voice; no em-dashes user-facing; no agency names; no
  consultant-speak; real data, labeled placeholder, or silence.
- One vermillion subject per view; motifs within budget; motion within budget and
  reduced-motion guarded; WCAG AA pairs verified.
- Desktop + 375px screenshots taken and archived under
  `docs/brand/_pipeline/evidence/`; preview link recorded; founder try on high-stakes
  surfaces.
- At least one genuinely unique thing on every page-level surface, or it is not done.
- State file updated; committed.

---

## 10. Anti-goals (so the loop never drifts)

- No scale data generation, ever, in this pipeline. The moment a run is about to
  write the 6th instance of anything, stop: that is Pipeline 2.
- No porting from sets 17 to 20. No new icon libraries. No second loud color. No
  giant hero stat. No fake activity, fake counters, fake precision.
- No silent constitution workarounds; amend in the open or comply.
- No skipping the catalog, the screenshots, or the state update to "save time." The
  loop's value is that any run can die and the next run loses nothing.
