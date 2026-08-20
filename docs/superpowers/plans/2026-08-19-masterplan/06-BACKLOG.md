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

- [~] **P0-1 · gates/scan-roots · 11 gates name a workshop path, 0 scan only the workshop**
      **RECOUNTED 2026-08-20, tick 19, across all 105 chain gates, and the
      headline above is retired.** 11 gates name a `dev/` or `_design/` path and
      **every one of them also names reader-facing files**. "The rulebook is
      enforced against the workshop rather than the site" was true before tick 8
      and has not been true since. What remained was one line, now fixed
      (`c470d017`): `verify_bar_budget`'s country group listed ONLY
      `src/app/dev/spine/page.tsx`, so **the country page a reader gets had no bar
      budget at all**. The reader page is added alongside, not substituted; it
      contributes 0 by both detectors, group reads 3/8 either way.
      **`home2-view.tsx` IS DELIBERATELY LEFT COVERED BY ALL SIX GATES.** The
      backlog called it "the flag-off home2-view" and that is a local default, not
      a fact: `isHomeReformEnabled()` reads a Vercel env var this repo cannot see.
      If it is on in production that file is the live homepage, so dropping
      coverage would strip enforcement from the page the founder is looking at.
      **STILL OPEN:** `verify_sample_tags`, `verify_v2_scales`,
      `verify_spacing_scale`, `verify_paragraph_budget` each name workshop paths
      ALONGSIDE real ones. That inflates their counts with prototype files and can
      red a build over a page no reader visits, which is a different and smaller
      defect than the one this item was opened for. Decide per gate whether the
      workshop belongs in the same verdict as the site.
      *Original headline, kept:* — the `dev/spine-*` two-file wrappers and the flag-OFF `home2-view`. — **FIVE OF THEM REPOINTED 2026-08-19, tick 8.** `verify_no_eyebrow`,
      `verify_no_bold_display`, `verify_subsection_icons` and `verify_bar_budget`
      now read `spine/cell|city|industry/*-view.tsx` and `NeighborhoodExplorer`
      instead of the `dev/spine-*` route wrappers, which are 23 to 27 lines
      holding ONE JSX element each (100 lines of wrapper against 3,695 lines of
      body). Dry-run first: zero new failures, and the vocabulary is present in
      the bodies (Rail 3-13, Movement 5-8, Head 0-10 per file), so the pass is
      real rather than vacuous. `bar_budget` also listed
      `NeighborhoodExplorer.tsx` TWICE in the hood group, double-counting its
      bars: hood read 2/2, at budget, on a phantom. It now reads 1/2. With real
      bodies the same gate reads **cell 3/3 and industry 3/3, exactly at
      budget**, so one more horizontal bar on either page fails the build.
      STILL OPEN: `verify_sample_tags` (dev/spine + NeighborhoodExplorer),
      `verify_v2_scales`, `verify_spacing_scale` and `verify_paragraph_budget`
      (dev/cell2, dev/home3, dev/hood2, dev/industry2, spine2, city2, country2),
      and the flag-off `home2-view.tsx`, which every one of the four repointed
      gates still names.
      *Original:* — the `dev/spine-*` two-file wrappers and the flag-OFF `home2-view`.
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
- [ ] **P0-4 · gates/strip-comments · 17 gates roll their own, 4 of 21 converted**
      Recounted 2026-08-20 (tick 14) over all 104 chain entries: 15
      import the shared module (14 in chain), 24 roll their own (21 in chain), and
      `verify_retired_claims.ts` does both. Four distinct re-derivations, not one:
      `startsWith("//")`, a line-start regex, a naive non-greedy block-comment
      strip, and hand-rolled `inBlock` state. **The four patterns were written out
      as literal regexes here until 2026-08-20 and all of them had been silently
      corrupted**: a `node -e` edit ate the backslashes, so the file instructed
      future work with `/^s*///` and `//*[sS]*?*//g`, neither of which is the
      pattern it claimed to name. Described in prose now, deliberately. Use the
      Write or Edit tool for anything containing a regex; the shell-quoted
      one-liner has now cost this three times in three ticks.
      **THE BLOCKER IS GONE BUT READ THIS BEFORE CONVERTING ANYTHING.** The shared
      module used to eat every URL (`8bd4aa1b`), so a blanket conversion would have
      blinded the three gates whose whole subject is URLs , `canonical-urls`,
      `sitemap-no-redirects` and `find_dead_links` , which work today precisely
      BECAUSE they roll their own. That is fixed; the lesson is that this item
      cannot be executed as a find-and-replace.
      **THE `isCommentLine` GROUP IS 8 FILES AND 4 ARE DONE.** `no_bold_display`
      (`da0b65d1`), then `no_em_dashes`, `no_source_agencies`, `banned_patterns`
      (`b9d3326f`). **The trap is now gone**: `stripCommentLines(lines)` strips a
      whole file once, in order, and returns an array to index by line number, so
      the ordering requirement lives in the module rather than at every call site.
      Tested, 17/17 (`d6ca02fd`).
      **THE REMAINING 4 SPLIT INTO TWO SHAPES AND ONLY ONE IS MECHANICAL.**
      `verify_v34_research_rules` iterates lines and converts like the four done.
      `verify_bar_budget`, `verify_no_eyebrow` and `verify_subsection_icons` DO NOT
      ITERATE LINES AT ALL: they scan raw source for a tag, compute which line the
      match landed on, and ask whether THAT line is a comment. There is no current
      line, so the per-line stripper cannot answer them; hand them the array and
      index it. That property is the fourth test in `d6ca02fd`.
      Each converted gate must DETECT on the code half and REPORT plus opt out on
      the RAW line: every one of these carries an `// allow-*` marker that is
      itself a comment and does not survive stripping.
      Measured for the group across `src/`: **42 lines of real code invisible**
      (any line starting `/*` or ending `*/}`) and **9,033 lines of prose scanned**
      as code. Convert in pattern groups, not all at once, and run the chain
      between groups so a flipped verdict is attributable.
      *Verify:* one shared implementation; re-run the full chain per group.
- [ ] **P0-15 · gates/hex-detector · the hex gate cannot see a percent-encoded colour**
      Its pattern matches a literal `#` followed by six or three hex digits at a
      word boundary, so it needs the `#` character itself. `src/app/globals.css:707` carries
      `fill='%23241b11'` inside an SVG data URI, where `%23` IS `#`. Found at tick
      14 while fixing the visibility hole that had also been hiding it: two
      independent reasons the same live colour was invisible, and closing one left
      the other standing.
      *Do:* decode percent-encoding before matching, or match `%23` as an alternate
      opener. **Expect new findings and do not raise the baseline to absorb them.**
      *Verify:* the gate reports globals.css:707; then count what else appears.
- [ ] **P0-16 · gates/scan-sets · duplicate entries double-count violations**
      `verify_bar_budget` listed `NeighborhoodExplorer.tsx` twice (found tick 8) and
      so did `verify_no_bold_display` (found tick 15, fixed in `da0b65d1`). Both
      lists are copies of each other, so the other copies are suspect and nobody has
      looked. A duplicate cannot flip a verdict; it doubles that file's printed
      COUNT, which is what a ratchet baseline is set from.
      *Do:* one pass over every hand-written scan list in the chain, asserting each
      is a set. Consider making the gates share one list rather than eight copies.
      *Verify:* count entries against unique entries per gate; publish both numbers.
- [ ] **P0-17 · gates/a11y-depth · the a11y gate covers four patterns, not accessibility**
      `a11y-static` went green at tick 17 across 696 files, and that green says only
      "no violation of four one-line patterns". Nothing in the chain sees colour
      contrast, keyboard reachability, focus order, focus traps, target size, or
      dynamic ARIA. Readiness G22 and G23 are UNMEASURED and this gate does not
      touch them.
      *Do:* decide whether axe-core in a headless browser is worth the chain cost,
      or whether these belong in the render harness instead. **A gate that needs a
      browser can fail on a blip, and the corollary in CLAUDE.md says a gate that
      fails on a blip gets switched off.** That argues for the harness.
      *Verify:* whichever path, negative-test it before trusting a green.
- [ ] **P0-5 · gates/ratchets · Four of seven ratchets can be silently raised.**
      *Verify:* add the refuse-to-raise guard that `verify_no_cream` already has.
- [ ] **P0-6 · gates/contrast · `verify_token_contrast.mjs` measures an assumed
      opaque card**, but `--card` is `rgba(255,255,255,.955)` over a fixed photo
      with a 50% `mix-blend-mode: multiply` noise layer above. **It validates a
      surface that never renders.**
      *Verify:* sample real composited pixels. Expensive; the only proposal that
      catches a defect the chain is structurally blind to.
- [x] **P0-7 · gates/a11y · the a11y audit is wired, and it was not a gate** ,
      DONE 2026-08-20, tick 17 (`e6e082a2`). The item said "wire it in" and that
      instruction was wrong twice. The file held **no `process.exit` at all**, so
      registering it as written would have added a sixth check that cannot go red.
      And its only non-zero check was **100% false positives**: three
      `input-no-label` findings, all `<label><input/></label>`, the implicit
      association, invisible to a line-by-line detector. Fixed the detector, added
      `stripCommentLines`, deleted a ninth private copy of the `isCommentLine`
      shape, made it a hard gate at zero, registered it. Chain 104 -> 105.
      Negative-tested against a fixture: all four checks fire, eight valid patterns
      stay silent. **It is a SOURCE scan.** It cannot see contrast, focus order,
      focus traps, dynamic ARIA, or a label associated across a component boundary.
- [ ] **P0-8 · docs · The gate count is stated at ~78 line locations across 32
      files at TEN different values** (25, 26, 31, 53, 58, 95, 98, 99, 101, 102).
      The true count is **102**, counted over the `GATES` array in
      `scripts/prebuild_all.ts` with `strip_comments` applied first: 102 entries,
      102 unique names. *A naive `grep -c '{ name: "'` also returns 102 today but
      agrees by luck - 35 comment blocks open inside that array.*
      `docs/loop/STATE.md` contradicted itself (102 at `:16`, 101 at `:66`/`:68`)
      until tick 5 fixed it. A stale number is read with trust.
      **Do not just correct them.** `docs/loop/artifacts/org-proposal.md` move M1
      is the fix: one script prints the counts, every document that states one
      carries a generated block instead, and a `--check` gate fails the chain when
      a block is stale. Blast radius: 1 script + 1 gate + 5 documents, 0
      references to repoint. After it, no document states a number, it only
      carries one. Copy cog's `--check-fail-msg` exactly so the failure names the
      command that fixes it.
- [ ] **P0-10 · `npm run prebuild:serial` RUNS 43 GATES, NOT 102.** It is a
      hand-maintained `&&` string in `package.json` (43 segments, counted).
      `CLAUDE.md` documents it as *"same gates, single-process (use if parallel is
      flaky)"*. **It is not the same gates - it is a second, divergent chain**, and
      the Windows flake that makes an operator reach for it is exactly when they
      would get 43/102 coverage and a green result. This is not staleness; it is a
      second instrument that reports like the first.
      *Do:* generate the serial chain from the same `GATES` array, or delete it and
      document `--concurrency 1` instead. *Verify:* both chains report the same
      count.
- [ ] **P0-11 · `DESIGN.md` §0.1 is INVERTED, not stale.** It says "0 shipping
      routes are v2" and "not live anywhere". Its own named instrument,
      `node scripts/audit_generation_seam.mjs`, re-run 2026-08-19, reports 102
      routes with **1 v2-only and 7 carrying v2**. Naming your instrument is
      necessary and not sufficient - nobody re-ran it.
- [ ] **P0-12 · the cream ratchet reads 517 across 177 files in two documents**
      (charter `:429`, cohesion audit `:144`). It is **33 across 16**. The stale
      number makes finished work look undone, which is the costly direction of
      this error: it invites a tick to redo a completed purge.
- [ ] **P0-13 · `CLAUDE.md:33`'s `<latest>-session-handoff.md` glob CANNOT resolve
      to the newest handoff.** The four newest are named
      `HANDOFF-marginatlas-<date>.md`, which the pattern does not match. Three
      documents each name a different "current" handoff. Proposal move M4.
- [ ] **P0-14 · gate 102 does not catch `var()` naming an UNSET sibling.**
      Found tick 8 while building the paint instrument. `globals.css` declares
      `--font-body: var(--font-sans), Inter, ui-sans-serif, ...` on `:root`. The
      names after the `var()` are **font-family fallbacks, not var() fallbacks**,
      so if `--font-sans` is unset the whole declaration is invalid at
      computed-value time and does NOT step to `Inter`. **Measured: `--font-body`
      computed to the empty string and every element fell to the browser
      default**, costing 69px of page height. `verify_no_self_referential_css_vars`
      catches a property naming *itself*, not one naming an unset sibling. Same
      silent symptom, one step away.
      **Latent, not live:** next/font always injects the slot in production. It
      becomes live the moment the loader does not run.
      *Do:* extend the gate to COUNT declarations of this shape and report them
      first. **Do not edit a live font declaration on a hunch** - measure how many
      exist before changing any.
- [ ] **P0-9 · docs · `docs/design-system/TOKENS.md` carries 25 references to
      moss, amber, teal and cream** — ramps deleted 2026-08-17 and enforced
      against by `verify_palette_membership` and `verify_no_cream`. `CLAUDE.md`
      calls this file "authority for any UI work". It is not stale, it is a
      document the chain actively contradicts, reached through the prescribed
      reading order. **Do not delete: 17 files reference it, including live code
      at `src/app/_design/page.tsx`.** Supersede with a banner (proposal M3).

---

## P1 — THE HOMEPAGE (the founder's stated priority)

**The word target is already met and this track has been re-aimed, tick 8.**
Measured in a browser: **617 words at 1280, 613 at 375**, against a 615 target.
The 764 figure everything was planned against was an SSR tag-strip count that
includes markup no reader sees at any one width.

**The open problem is HEIGHT, and it is three bands.** At 375 the page is
**9,848px**, and `neighborhoods` (1,568px), `catalog-plates` (1,142px) and
`audience` (1,127px) carry **3,837px of it, 39%, for 208 words between them**.
That is a component-stacking problem, not a spacing or a word problem. One band
per tick. **Never touch the H1.**

- [x] **P1-0 · home/rhythm · WITHDRAWN, tick 6. The premise was false and the
      change would have done the opposite of its own goal.**
      It claimed our section padding is SaaS-scale and proposed 56px desktop.
      **Measured instead of assumed:** `ToneBand` in `src/app/page.tsx:140`
      renders `py-8 md:py-10` = **32px mobile / 40px desktop**, which is already
      at the tight end of the editorial 32-64px range the research names, not the
      SaaS 96-192 end.
      **It would also have failed a gate.** `scripts/verify_spacing_scale.ts:32`
      defines `SCALE = {2,4,6,8,10,12,14,16,18,20,22,26,32,40}`. **There is no
      56.** The scale was derived from the founder's own mockup and stops at 40,
      so 40 is a ratified ceiling rather than a current value to raise.
      **And the work was already done.** Commit `4ff9d677`, "ten bands, four
      rhythms, and 18 percent of the page was padding", consolidated four
      competing rhythms into this one and removed **1,216px, 18% of page height**.
      Raising 40 to 56 across 10 non-flush bands would have added roughly 320px
      back at desktop.
      **The lesson, and it is why this entry is kept rather than deleted:** a
      general research finding ("editorial rhythm is 32-64px") was applied to this
      page without measuring this page. The finding was true and the instruction
      derived from it was backwards.
- [x] **P1-0b · DONE tick 8.** `artifacts/home-paint-census-2026-08-19.md`.
      11/11 bands paint at both widths, **0 compute `position: static`**, no
      horizontal scroll, page 5,933px at 1280 and 9,848px at 375. It also
      corrected the word count (617, not 764) and found the height concentration
      in three bands. Instrument: `scripts/spikes/render_home_to_scratch.tsx`.
      **Gap:** no screenshots, the Browser pane would not composite.
- [x] **P1-0b(orig) · superseded, kept for the reasoning ·** *(marker corrected
      tick 14: it was `[~]`, so `loop_status` reported a permanent in-flight item and
      override rule 3 would have sent every tick to a superseded entry.)*
      `docs/loop/10-HOMEPAGE.md` says this is the next homepage measurement and
      it has not been taken: *"the next measurement is paint, not count. An
      emitted band can still compute to zero height."* Every band now carries
      `data-band`, so this is one query per width.
      *Do:* render `/` at 1280 and 375, **reloading after the resize**, and record
      per-band `offsetHeight` plus total `scrollHeight`. Save shots to
      `docs/loop/artifacts/shots/`.
      *Why it now leads P1:* P1-0 was withdrawn because height was attributed to
      rhythm without measuring, and rhythm turned out to be already tight. **Until
      this exists, every "too tall" claim is a guess**, including the ones in this
      backlog.
      *Blind spot to state when quoting it:* a height measured on this machine
      cannot distinguish a short band from one whose data self-omitted locally.
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
- [x] **P1-5a · home/band-8 · DONE tick 11, and it was the WRONG BAND.**
      P1-5 named `audience`. Rendered and measured at 375 first: `audience` is
      1,127px = 64 band padding + 371 audience panel + 40 gap + 652 pricing
      panel, and **533 of that pricing panel is the seven-row matrix**, which is
      agreed content. **Two columns for its four cards was simulated and saves
      6px**: cards go 74px to 165px because the titles wrap, so the row count
      halves and the row height doubles. The 700px target in P1-5 is not
      reachable without dropping content, and that is now measured rather than
      assumed.
      The real offender is `neighborhoods`, 1,568px, six cards of 215-244px
      carrying **32 words between them**. Of each 215px card, **80px is a
      decorative gradient header with no text**, 37 percent, six times over.
      *Landed:* `h-12 sm:h-20` on that header. Band **1,568 to 1,376**, page
      **9,848 to 9,656** at 375, header unchanged at 80px from 640 up, desktop
      total still exactly 5,933px, no horizontal scroll, 11/11 bands paint.
- [ ] **P1-5b · home/band-7 · Two columns for the neighborhood cards at 375:
      MEASURED AT MINUS 628px, NOT LANDED, because nobody could see it.**
      Simulated in the DOM with the shorter header: the band goes 1,568 to
      **940px**, a 40 percent cut, with cards at 244-263px in two columns of
      ~135px. That is a proportion change on six cards carrying five words each,
      which is a taste question, and the Browser pane still refuses to composite
      so no screenshot exists. **Do not land it blind.** First tick that can
      screenshot: apply, shoot at 375, look, then decide.
- [ ] **P1-5 · home/bands-8-9 · SUPERSEDED by P1-5a above. Original text: the problem is height, not
      words.** `audience` is **72 words and 1,127px tall at 375**; `blog-rail` is
      67 words and 868px. Cutting 17 words off `audience` would remove perhaps
      40px of its 1,127. *Do:* make the four-panel stack shorter on a phone.
      *Verify:* re-run the paint census; target under 700px for `audience`.
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
- [x] **P3-5 · industry · the same trade read `$9` in one block and `8.6%` in another**
      DONE 2026-08-20, tick 20 (`271e3f15`). `margin_delta_pp` subtracted a ROUNDED
      base from an UNROUNDED sibling, and the consumer
      (`spine/industry/subtypes.ts:26`) resolves `keeps_pct = base + delta`, which
      reconstructed the sibling's unrounded value exactly. Measured over the margin
      table: **163 of 204 trades, 80%, print a keep that hides a rounding**, worst
      0.50pp (`fishing_aquaculture`, exact 5.50, shown $6). Fixed with one
      `Math.round`, matching the expression the benchmark block already used.
      After: 41,412 trade pairs checked through the consumer's own resolution,
      **0 disagreements**. Not seen, only computed; no screenshot exists.
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
