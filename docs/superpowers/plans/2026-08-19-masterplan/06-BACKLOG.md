# 06 — THE BACKLOG

> The ordered work queue. **The loop takes the top unblocked item, and updates
> this file at S11.** Every item names ONE section or ONE named list of sections.
>
> Format: `[ ] ID · surface/section · the defect with its number · verify`

**Legend:** `[ ]` open · `[~]` in flight · `[x]` done (keep, with commit hash) ·
`[?]` blocked on a founder decision.

---

## P0 — REPAIR THE INSTRUMENTS FIRST

Rationale, and it is not negotiable: the audit found the design rulebook has been
enforced **against the workshop rather than the site**. Improving the homepage
while the gates measure dev routes buys no protection at all. These are cheap and
they make everything after them trustworthy. Charter §0.3: measure before you
change.

- [ ] **P0-1 · gates/scan-roots · Ten design gates scan bodies no reader can
      reach** — the `dev/spine-*` two-file wrappers and the flag-OFF `home2-view`.
      The 2026-07-11 rulebook is enforced against the workshop.
      *Verify:* point them at reader-facing routes; expect NEW failures, and treat
      each as a real finding rather than raising a baseline.
- [ ] **P0-2 · gates/route-chrome-contract · The gate passes `/world` and
      `/industries`, which render neither `SiteChrome` nor `SpineShell`** — both
      files merely mention the word in a comment. A gate that passes on a comment
      is not a gate.
      *Verify:* make it assert the rendered tree, then see which routes actually fail.
- [ ] **P0-3 · gates/section-order · `verify_section_order` reads ONE section id
      on the country page against a 22-item list.** The industry page is written
      to that limitation on purpose, in its own comments.
      *Verify:* count ids the gate actually resolves per page type; publish the number.
- [ ] **P0-4 · gates/strip-comments · 12 gates roll their own comment detection**
      instead of the tested `strip_comments`, which had a live defect that blinded
      the chain for 195 lines of one file.
      *Verify:* one shared implementation; re-run the full chain.
- [ ] **P0-5 · gates/ratchets · Four of seven ratchets can be silently raised.**
      *Verify:* add the refuse-to-raise guard that `verify_no_cream` already has.
- [ ] **P0-6 · gates/contrast · `verify_token_contrast.mjs` measures an assumed
      opaque card**, but `--card` is `rgba(255,255,255,.955)` over a fixed photo
      with a 50% `mix-blend-mode: multiply` noise layer above. **It validates a
      surface that never renders.**
      *Verify:* sample real composited pixels. Expensive; the only proposal that
      catches a defect the chain is structurally blind to.
- [ ] **P0-7 · gates/a11y · `scripts/audit/a11y_static_audit.ts` is written and
      NOT wired into prebuild.** The cheapest accessibility win available.
- [ ] **P0-8 · docs · Three documents state a wrong gate count** (`CLAUDE.md` 95,
      verification protocol 31, chain 102). A stale number is read with trust.

---

## P1 — THE HOMEPAGE (the founder's stated priority)

Target: **11 bands / 764 words → 10 bands / 615 words**, per `01-DESIGN-STANDARD`
§5. One band per tick. **Never touch the H1.**

- [ ] **P1-0 · home/rhythm · Section padding is SaaS-scale, and it is the single
      dial behind "too tall".** Editorial runs 32–64px; ours runs SaaS-scale.
      *Do:* 56px desktop / 40px mobile. *Expect:* roughly a third of page height
      removed without deleting a word. **Do this first — it is one change and it
      re-frames every band below it.**
- [ ] **P1-1 · home/band-7 · "How a number is made" does not exist**, and it is
      the moat: held vs modelled vs extrapolated, plus the 48,114 estimates
      deliberately not ingested. 90 words.
- [ ] **P1-2 · home/band-4 · The catalog reads as a list, not an object.**
      Apply the five moves: a claim as the title, a visible membership rule, a
      **ratio not a count**, one visual of the whole set, five names on the
      surface. Keep the empty "declining" plate; it is the strongest thing there.
- [ ] **P1-3 · home/band-2 · "The reading"** must land a real table for a real
      place and trade in the first two screenfuls. 74% of viewing time is there.
- [ ] **P1-4 · home/band-5 · The world map is too large** (founder ruling).
      Contained, not full-bleed.
- [ ] **P1-5 · home/bands-8-9 · Compress `audience` and `blog-rail`** to 55 and 60
      words.
- [ ] **P1-6 · home/band-3 · "The holdings"**, one line, absorbing `ledger`.
- [ ] **P1-7 · home/all · tabular figures on every number** on the page.

### P1b — the most text-bloated surface on the site is not the homepage

- [ ] **P1b-1 · `/extremes` renders ~1,640 words of AUTHORED prose** (hand-counted
      across the hero, 4 catalog collections, 13 leaderboard intros and their
      fixed notes, and the closing note). That is **2× `/compare`** (831 measured)
      and **26× `/margin-index`** (63). The take-home lens alone is **644 words**.
      The page's own doc-comment calls this a *"warmer, more editorial voice"*,
      so this is deliberate — which makes it a founder question, not a defect.
      *Do:* apply the 90-word band budget to the 13 leaderboard intros, which are
      the bulk, and keep the editorial hero. *Verify:* re-count; target under 700.
- [ ] **P1b-2 · a source comment calls `/decide` "the recommender"**
      (`src/components/home/AudienceBand.tsx:25`) and it is not. `/decide` uses
      `generateFounderDecision` and `getNeighborhoodNetMargin` — a
      within-one-city neighbourhood ranking — and imports none of `recommend.ts`.
      It sits in the same footer "Tools" column as three pages that *do* share
      ranking machinery, so auditing by footer grouping produces a wrong answer.
      **Fix the comment; it is a trap that has already misled one audit.**
      Related to P3-2, which is the same confusion from the other end.

---

## P2 — DUPLICATE SURFACES (converge, never delete)

Procedure in `04-CONSOLIDATION.md` §4. **`/browse` → `/world` 308 is the
first-party precedent: redirect, do not delete.** Any URL change goes to
`DECISIONS-NEEDED.md` first.

- [ ] **P2-1 · `/world` + `/countries` · three incompatible region taxonomies
      sharing no bucket name.** The taxonomy conflict outranks the page overlap:
      the site cannot currently answer "which region is this in" consistently.
      **Fix the taxonomy first; the page convergence follows from it.**
- [ ] **P2-2 · sub-cell ≈ cell** — the sub-cell page is the cell page's entire
      `CellDecisionStack` minus 10 chrome elements.
- [ ] **P2-3 · the district dataset renders THREE times** across the city page and
      its neighbourhood hub.
- [x] **P2-4 · `/extremes` ≈ `/margin-index` — WITHDRAWN, not a duplicate.**
      A component-level audit refuted this. They share `buildAcrossCities` for a
      *subset* of boards, and nothing else: `leaderboards.ts` never imports
      `recommend_core.ts` or `composite.ts`; `/extremes` ranks raw metrics per
      board while `/margin-index` ranks `keepPct` and shows composite only as a
      badge; the 7 take-home boards use a different resolver entirely
      (`getSameIndustryAcrossStates`, US **states**, not cities). They also use
      **disjoint design systems** — zero `atlas-card` in margin-index, zero
      `spine-scope`/`var(--terra` in extremes. Kinship, not duplication.
      *Kept as a record so it is not "rediscovered" a third time.*
- [ ] **P2-4b · the REAL near-duplicate: `/margin-index` ↔ `/dev/decide-v2`.**
      Identical `rankPlacesForTrade(ind.id, {budgetUsd:null})` call, identical
      `DecisionRow`/`DecisionRowHeader`/`MarginIndexBadge`/`KitIndexStyles`
      import quartet. They differ only in sort key (composite vs keep%) and
      monetization (decide-v2 adds a paywalled `LockVeil`; margin-index is
      deliberately free). `/dev/` is robots-disallowed, so this is a duplicate
      one level below production rather than a live one.
      **Do not silently converge it — it may be the intended paid-tier
      evolution. Route to `DECISIONS-NEEDED.md`.**
- [ ] **P2-5 · the two industry indexes are one template twice.**
- [ ] **P2-6 · `opening` and `buy-or-start` share a byte-identical
      `generateStaticParams`.**
- [ ] **P2-7 · `/blog` + `/learn` are two content systems.** Note the asymmetry:
      blog is index-heavy (441 lines) and article-thin (74); learn is the reverse.
      Two teams solved one pair of problems in opposite directions.

---

## P3 — CORRECTNESS AND DEAD WEIGHT

- [ ] **P3-1 · country · seven sections can NEVER render**, gated behind
      `notHeld<T>()` at `src/app/[country]/page.tsx:784-793`. A section that is
      declared, gated as agreed, and structurally unreachable passes the contract
      gate while showing the reader nothing. **Decide per section: make it
      reachable, or retire it from the contract. Do not leave it in limbo.**
- [ ] **P3-2 · `/decide` · the recommender the ratified strategy names for this
      page is imported by `/margin-index`, the flag-off homepage and a dev route,
      and by ZERO decide files.** The headline tool is not wired to its own page.
- [ ] **P3-3 · dead code · `buildCityBoard` has 0 external references;
      `buildCountryBoard` has 6, ALL from its own gate.** Evidence and method:
      `scripts/spikes/deadcode_boards_probe.tsx`. Delete module and gate together.
- [ ] **P3-4 · aria · an aria-label says "All trades average" over a MEDIAN** —
      `src/components/spine/industry/industry-view.tsx:137`.
- [ ] **P3-5 · industry · the same trade reads `$9` in one block and `8.6%` in
      another; 6 of 6 rows disagree, worst 0.5pp** — `src/lib/spine/adapt_industry.ts`.
- [ ] **P3-6 · svg · six `preserveAspectRatio="none"`** — circles draw as
      ellipses. `spine/cell-view.tsx:223`, `spine/city/chapters.tsx:62`,
      `spine/industry/forms.tsx:204`, `spine/kit.tsx:574`, `spine2/Quad.tsx:149`.
- [ ] **P3-7 · anchor · `#newsletter` carries `scroll-mt-20` (80px); the masthead
      is 85px there.** The anchor lands under the bar at 375 and 414.
- [ ] **P3-8 · spikes · five render spikes each re-derive the same harness.**
      Consolidate into ONE reusable instrument. The whole procedure depends on
      rendering; it should not be re-invented per tick.

---

## P4 — COHESION (charter §7)

Ungated entirely today. The audit measured: **7 widths, 4 card systems, 3 body
scales, 3 terracottas, 2 font pairs, 4 icon systems.**

- [ ] **P4-1 · 3 terracottas → 1.** One accent is the rule every studied design
      system writes down independently.
- [ ] **P4-2 · 4 card systems → 1.**
- [ ] **P4-3 · 7 content widths → the ratified set.**
- [ ] **P4-4 · 3 body scales → 1.**
- [ ] **P4-5 · 4 icon systems → 1.** Charter forbids inventing a new icon
      language; four existing ones is the same defect from the other direction.
- [ ] **P4-6 · 2 font pairs → 1.** Do this AFTER `2179bcb2`, which fixed the
      self-referential `--font-display`; re-measure first, because the font that
      rendered was not the font that was declared.

---

## P5 — RESPONSIVE AND ACCESSIBILITY (the standard's biggest gap)

- [ ] **P5-1 · Add 320px to every render check.** WCAG reflow is specified at 320
      (= 1280 at 400% zoom) and it is the one width never checked.
- [ ] **P5-2 · pointer targets ≥ 24×24** — Level AA, and nothing in the repo
      measures it.
- [ ] **P5-3 · focus never hidden by the sticky mast (z 20) or jump rail (z 15)** —
      textbook SC 2.4.11 failure pattern.
- [ ] **P5-4 · 200% text resize and WCAG text-spacing** without clipping.
- [ ] **P5-5 · heading hierarchy** — one h1, no skipped levels.
- [ ] **P5-6 · `backdrop-filter` budget** — measure `blur(26px) saturate(1.15)`
      per card over the fixed photo. Set a budget; do not remove the signature.

---

## BLOCKED ON THE FOUNDER

Route these to `docs/loop/DECISIONS-NEEDED.md`; **do not pre-empt them.**

- [?] **B-1 · the type floor** (charter §13 Q1). 31 nodes at 10px, 24 of them
      load-bearing spectrum labels. Recommendation on file: **B** (10 → 10.5px).
- [?] **B-2 · the quiet-text colour** (charter §13 Q2). `--text-faint` `#87745d`
      at **4.48:1** misses AA by ~0.15 across 82 of 114 nodes.
      **This has grown since it was written:** `cocoa` is a BROWN, banned by
      charter §8, and it is the entire quiet-text ladder. The question is no
      longer only contrast; it is palette membership.
- [?] **B-3 · URL changes for every P2 convergence.**
- [?] **B-4 · `{ "buildCommand": "npm run build" }` in `vercel.json`** — settles
      whether the 102 gates run on deploy at all.
- [?] **B-5 · the two Supabase migrations** (`newsletter_signups`, `corrections`)
      are written and never applied. **Now live, so signups and reader corrections
      are being silently discarded.** Must be run by hand.

---

## DONE

- [x] **fonts · `--font-display` referenced itself, so every display heading
      rendered in body sans.** Recovered from a stopped tick, verified, gated as
      102. `2179bcb2`.
