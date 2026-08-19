# Contradiction census, 2026-08-19

Step 2 of `docs/loop/02-ORGANISATION-RESEARCH.md`: every document in this repo
that states a **number**, a **status**, or a **"current / latest" pointer**,
checked against the code.

**This is a census. Nothing was fixed.** Every row carries a one-line fix so
`06-REFORMATION.md` can execute without re-deriving anything.

---

## Summary

**119 rows checked. 69 contradict, 41 agree, 1 partly, 8 cannot be settled from
the repo.**

A row is one claim in one document. Where a document repeats the identical claim
on several lines, the row lists every line and counts once; expanded, the 119
rows cover roughly 180 individual statements.

The single largest class is one quantity: **the prebuild gate count**, stated at
**about 78 line locations across 32 files, at 10 different values** (25, 26, 31,
53, 58, 95, 98, 99, 101, and the correct 102) against a true value of **102**
[M35].
Second largest is the file-count block in `CLAUDE.md`, which is read first by
every session and is wrong in every figure it states.

Two documents that no session would suspect are worse than stale: they are
**inverted**. `DESIGN.md` §0.1 says "v2 ships on nothing, 0 shipping routes";
its own instrument, re-run today, says 1 v2-only and 7 carrying v2.
`docs/architecture/README.md`, named third in the `CLAUDE.md` reading order,
undercounts routes by 56 and components by 230.

---

## The true gate count, and how it was counted

**102.**

Counted programmatically over the `GATES` array in `scripts/prebuild_all.ts`,
with `scripts/lib/strip_comments` applied line by line first, so a `{ name: "…"`
written inside one of that file's long block comments cannot be counted as a
registration. The array is bounded by `const GATES: Gate[] = [` and the first
line-initial `];`. Duplicate names: none. **[M1]**

A naive `grep -c '{ name: "'` also returns 102 on this file today **[M2]**, so
the two agree, but they agree by luck rather than by construction: **35 comment
blocks open inside that array** [M34], and the first one to contain the literal
shape will split the two numbers. The stripped count is the one to quote.

The runner is the authority on itself: it prints `${GATES.length} gates` at
`scripts/prebuild_all.ts:498` and exits 1 on any non-zero gate, including under
`--no-bail` (`:548`, `:556`).

**`npm run prebuild:serial` is not the same chain.** It is a hand-maintained
`&&` string in `package.json` with **43** segments **[M3]**, so the documented
Windows fallback silently runs 42% of the gates. That is not a stale number; it
is a second, divergent chain.

---

## The table

`REC` in the verdict column means the claim is inside a document that dates
itself (a handoff, a dated plan, a tick log). It is wrong as read today but was
right when written, so the fix is a status line, not a new number.

### A. Gate counts. True value 102 [M1].

| CLAIM | FILE:LINE | STATED | ACTUAL | VERDICT | ONE-LINE FIX |
|---|---|---|---|---|---|
| prebuild gate count | `CLAUDE.md:92` | 95 gates | 102 | CONTRADICTS | Replace 95 with 102, or drop the number and point at the runner's own banner. |
| gates skipped if Vercel bypasses the hook | `CLAUDE.md:99` | all 95 gates | 102 | CONTRADICTS | Same line edit: 95 to 102. |
| scripts/ folder description | `CLAUDE.md:23` | "25-gate prebuild verifiers" | 102 registered, 87 `scripts/verify_*` files | CONTRADICTS | Change to "prebuild verifiers + audit/ + codemods", no number. |
| `prebuild:serial` equivalence | `CLAUDE.md:93` | "same gates, single-process" | 43 of 102 [M3] | CONTRADICTS | Say "a 43-gate subset, not the full chain". |
| the 2026-08-01 handoff's chain | `CLAUDE.md:123` | "the 53-gate chain" | 102 | CONTRADICTS (REC) | Add "(53 at that date; now 102)". |
| prebuild in the definition of done | `docs/verification-protocol.md:31` | 31/31 | 102/102 | CONTRADICTS | 31/31 to 102/102. |
| prebuild in the pre-delivery checklist | `docs/verification-protocol.md:79` | 31/31 | 102/102 | CONTRADICTS | 31/31 to 102/102. |
| tick verification line | `docs/loop/PROMPT.md:47` | 101/101 | 102/102 | CONTRADICTS | 101 to 102. |
| reformation verify step | `docs/loop/06-REFORMATION.md:38` | 101/101 | 102/102 | CONTRADICTS | 101 to 102. |
| homepage step verify | `docs/loop/10-HOMEPAGE.md:126` | 101/101 | 102/102 | CONTRADICTS | 101 to 102. |
| verification cost estimate | `docs/loop/03-LONGEVITY.md:47` | "101 gates" | 102 | CONTRADICTS | 101 to 102. |
| failure-class example | `docs/loop/04-FAILURE-REFLECTION.md:32` | "95 gates against a 101-gate chain" | 102 | CONTRADICTS | Make the example "95 against 102". |
| deploy-gate question | `docs/loop/DECISIONS-NEEDED.md:38` | "all 101 gates" | 102 | CONTRADICTS | 101 to 102. |
| own contradiction list, item 1 | `docs/loop/STATE.md:66` | "The chain is 101" | 102 | CONTRADICTS | 101 to 102. Note this line contradicts `STATE.md:16` in the same file. |
| own contradiction list, item 2 | `docs/loop/STATE.md:68` | "The chain is 101" | 102 | CONTRADICTS | 101 to 102. |
| gates row | `docs/loop/STATE.md:16` | 102/102 | 102 | AGREES | none |
| standing fact | `docs/loop/STATE.md:44` | 102 gates | 102 | AGREES | none |
| verification cadence | `docs/loop/00-OPERATING-RULES.md:50` | 102/102 | 102 | AGREES | none |
| problem statement | `docs/loop/02-ORGANISATION-RESEARCH.md:30,31` | 102 | 102 | AGREES | none (corrected from 101 earlier today, commit `edfab3ab`) |
| three-wrong-counts note | `docs/loop/WAKE-UP.md:21` | "the chain is 101" | 102 | CONTRADICTS (REC) | 101 to 102, or delete now that `:51` states 102. |
| verified-tonight line | `docs/loop/WAKE-UP.md:24` | "prebuild 101 gates, 100 passed" | 102 | CONTRADICTS (REC) | Date-stamp the line. |
| corrected note | `docs/loop/WAKE-UP.md:51` | "It is 102" | 102 | AGREES | none |
| backlog deploy item | `.../2026-08-19-masterplan/06-BACKLOG.md:217` | 102 gates | 102 | AGREES | none |
| org map scripts row | `docs/loop/artifacts/org-map-2026-08-19.md:24` | 102 gates | 102 | AGREES | none |
| procedure report template | `.../2026-08-19-masterplan/03-PROCEDURE.md:271` | `prebuild N/N` | 102 | AGREES | none. This is the only document in the repo that refuses to type the number, and it is the pattern the rest should copy. |
| status header | `docs/handoff/HANDOFF-marginatlas-2026-08-18.md:6` | 101/101 | 102 | CONTRADICTS (REC) | Add "(102 since 2026-08-18 tick 4)". |
| ground-truth table | `…-2026-08-18.md:72` | 101/101 | 102 | CONTRADICTS (REC) | Same. |
| Vercel bypass note | `…-2026-08-18.md:82` | all 101 gates | 102 | CONTRADICTS (REC) | Same. |
| re-hydration instruction | `…-2026-08-18.md:212` | "expect 101/101" | 102 | CONTRADICTS | This one is an instruction to a future agent, not a record. Fix the number. |
| charter verification rule | `.../2026-08-17-founder-brief-and-loop-charter.md:220` | must be 99/99 | 102 | CONTRADICTS | 99/99 to 102/102. |
| footer-defect narrative | `…-loop-charter.md:334` | "98 of 98 gates green" | 102 | CONTRADICTS (REC) | Add the date; the point of the sentence survives any count. |
| cream gate index | `…-loop-charter.md:429` | "gate 98" | position 35 of 102 [M4] | CONTRADICTS | Delete the index. Gates run in parallel and the array order is declared informational at `prebuild_all.ts:39`. |
| chain size after an addition | `…-loop-charter.md:557` | "makes the chain 98 gates" | 102 | CONTRADICTS (REC) | Date-stamp. |
| new gate's index | `…-loop-charter.md:652` | "It is gate 99" | 102-gate chain, no stable index | CONTRADICTS | Delete the index, name the gate instead. |
| archive verification | `_archive/README.md:34` | "the full 58-gate chain" | 102 | CONTRADICTS (REC) | "the full chain as it stood at the move (58 gates)". |
| foundation verification | `TODO.md:4,41,47,73,279,381` | 26/26 (6 places) | 102 | CONTRADICTS (REC) | Move `TODO.md` to a dated archive; see C10. |
| historical plan verification lines | 16 files, 38 occurrences of "31/31" [M5], incl. `.../2026-06-16-visual-upgrade/10-MASTER-IMPLEMENTATION-PLAN.md` (9), `.../2026-06-16-reformation/03-foundation-phases.md` (6), `.../05-qa-governance-phases.md` (4), `docs/handoff/2026-06-16-session-handoff.md` (3) | 31/31 | 102 | CONTRADICTS (REC) | Do not edit 38 lines. Add one status banner per dated plan directory: "historical; verification numbers are as-of the plan date". |
| working-tree vs HEAD divergence | `docs/superpowers/research/2026-08-19-internal-state-audit.md:12` and §"The 102nd gate is not committed" | "102 in the working tree and 101 at HEAD, gate 102's script is untracked" | HEAD registers 102 [M6]; `scripts/verify_no_self_referential_css_vars.ts` is tracked [M7]; committed in `2179bcb2` | CONTRADICTS | Add one line: "resolved by `2179bcb2` later the same day". |
| four-documents table | `…-internal-state-audit.md:690-697` | CLAUDE 95, protocol 31, charter 99, handoff 101, STATE 102 current | all five confirmed | AGREES | none |
| serial fallback size | `…-internal-state-audit.md:12` | serial runs 43 | 43 [M3] | AGREES | none |

### B. File, route and component counts.

| CLAIM | FILE:LINE | STATED | ACTUAL | VERDICT | ONE-LINE FIX |
|---|---|---|---|---|---|
| static pages in production | `CLAUDE.md:9` | 615 prerendered | **not settleable from the repo**: `.next/prerender-manifest.json` has `"routes": {}` and there is no `BUILD_ID`, so the only local build artifact is a dev build [M8]. `npm run build` is forbidden this tick. | UNRESOLVED | Either drop the figure or footnote it with the build date it came from. |
| TS/TSX files in src | `CLAUDE.md:10` | 322 | **688** [M9] | CONTRADICTS | 322 to 688, or generate it. |
| `.tsx` components | `CLAUDE.md:10` | 136 | **317** under `src/components/`; 460 `.tsx` anywhere under `src/` [M9] | CONTRADICTS | 136 to 317 and say which denominator. |
| routes | `CLAUDE.md:11` | 56 | **102** `page.tsx`; 118 counting the 16 `route.ts` [M9]. Non-dev `page.tsx` is 55, so 56 is not the answer under any reading. | CONTRADICTS | 56 to 102 (and note 47 of them are `/dev`). |
| layering allowlist | `CLAUDE.md:62` | 14 grandfathered violations | 14 entries in `ALLOWLIST` [M10]; the gate prints its own grandfathered count and passes | AGREES | none |
| routes, presentation layer | `docs/architecture/README.md:12` | 46 Next.js routes | 102 [M9] | CONTRADICTS | 46 to 102. This file is item 3 in the `CLAUDE.md` reading order and was last committed 2026-05-27 [M11]. |
| components, presentation layer | `docs/architecture/README.md:13` | 87 components | 317 [M9] | CONTRADICTS | 87 to 317. |
| routes under src/app | `DESIGN.md:73` | 97 | **102**, from the same instrument the block cites (`node scripts/audit_generation_seam.mjs`) [M12] | CONTRADICTS | Re-paste the instrument's current output; all six lines below move with it. |
| reachable vs internal | `DESIGN.md:74` | 49 reachable, 48 internal | 49 reachable, **53** internal [M12] | PARTLY (49 agrees, 48 contradicts) | Re-paste. |
| shipping routes not yet v2 | `DESIGN.md:75` | 48 | **47** [M12] | CONTRADICTS | Re-paste. |
| shipping routes that are v2 only | `DESIGN.md:76` | 0 | **1** [M12] | CONTRADICTS | Re-paste. |
| shipping routes carrying any v2 | `DESIGN.md:77` | 1 | **7** [M12] | CONTRADICTS | Re-paste. |
| internal routes carrying v2 | `DESIGN.md:78` | 12 | **26** [M12] | CONTRADICTS | Re-paste. |
| dev route trees | `_archive/README.md:55` | 41 route trees under `src/app/dev/` | **37** directories [M13] | CONTRADICTS (REC) | Date-stamp. |
| unregistered scripts | `docs/loop/STATE.md:95` | "153 scripts that no gate runs. 254 in `scripts/`, 101 registered" | **144** runnable and unregistered; **257** tracked under `scripts/` (226 runnable); **102** registered, of which **82** live under `scripts/` [M14] | CONTRADICTS (all three) | Restate as "144 runnable scripts under `scripts/` that the chain does not run". |
| docs archive pass size | `docs/loop/STATE.md:96` | 352 files | **358** markdown files under `docs/` [M15] | CONTRADICTS | 352 to 358. |
| dev routes to retire | `docs/loop/STATE.md:97` | 37 routes | 37 [M13] | AGREES | none |
| bloat baseline recap | `docs/loop/WAKE-UP.md:153-154` | 153 scripts, 352 documents, 37 dev routes | 144 / 358 / 37 | CONTRADICTS (2 of 3) | Same edits as above. |
| dev route inventory | `docs/loop/01-CLEANUP.md:18` and `:77` | 37 routes | 37 [M13] | AGREES | none |
| repo totals | `docs/loop/02-ORGANISATION-RESEARCH.md:15-17` | 2,799 tracked / 503 md / 358 in docs / 128 plans+specs / 257 scripts / 102 gates | 2,799 / 503 / 358 / 128 / 257 / 102 [M15] | AGREES (all six) | none. Typed today and already carrying an expiry note, which is the right shape until they are generated. |
| repo totals | `docs/loop/artifacts/org-map-2026-08-19.md:7,24` | same six | same six [M15] | AGREES | none |
| bloat census | `docs/loop/artifacts/bloat-census-2026-08-18.md:53` | 153 scripts that no gate runs | 144 [M14] | CONTRADICTS (REC) | Date-stamp; it is an artifact of its tick. |
| bloat census | `…/bloat-census-2026-08-18.md:82` | 37 dev routes | 37 | AGREES | none |
| route census | `docs/superpowers/research/2026-08-19-internal-state-audit.md:11` | 102 page routes: 49 reader-facing, 50 workbench (47 `/dev` + 3 `_design`), 3 admin | 102 `page.tsx`, 47 under `/dev`, 3 under `_design`, 49 reachable [M9][M12] | AGREES | none |
| the same line's verdict on CLAUDE.md | `…-internal-state-audit.md:11` | "`CLAUDE.md` says 56; it is stale by 46" | 102 - 56 = 46 | AGREES | none |
| Supabase row count | `README.md:4` | 722k rows | **not settleable from the repo** (no database access this tick, by instruction) | UNRESOLVED | Delete the figure from a README or move it to a dated data note. |
| pages the template drives | `README.md:25`, `:32`, `:99` | 500k+ pages | `CLAUDE.md:9` says 615 prerendered. The two are not reconcilable and neither is checkable here. | CONTRADICTS (inter-document) | Delete the 500k claim; it predates the current URL policy. |
| component migration remainder | `docs/design-system/PLAN.md:139` | "the other 126 components" | 317 [M9] | CONTRADICTS (REC) | Date-stamp the plan. |
| retokenized components | `docs/design-system/TOKENS.md:48` | ~120 components | 317 [M9] | CONTRADICTS (REC) | Date-stamp. |
| files rendering the legacy system | `DESIGN.md:21`, `:452` | ~260 files | **not checked**: the document names no instrument for this figure and there is no gate that emits it | UNRESOLVED | Name the command that produces it, or mark it an estimate. |
| banned palette names in TOKENS.md | `docs/loop/STATE.md:109-110` (tick-5 entry) | 25 references to moss, amber, teal, cream | **25 lines** contain one; 26 occurrences [M16] | AGREES (line measure) | Add "(lines, not occurrences)". |
| `/industries` blank across N routes | `docs/loop/09-SITE-CONTINUATION.md:91`, `…-2026-08-18.md:25` | 200 routes | **not checked**: this counts generated URLs, not source routes, and the generator was not run | UNRESOLVED | State it as "~200 generated industry URLs". |

### C. "Current / latest" pointers.

| CLAIM | FILE:LINE | STATED | ACTUAL | VERDICT | ONE-LINE FIX |
|---|---|---|---|---|---|
| the current handoff | `CLAUDE.md:120` | `HANDOFF-marginatlas-2026-08-01.md` **IS THE CURRENT HANDOFF, READ IT FIRST** | Three newer landed: `2026-08-07`, `2026-08-09`, `2026-08-18` [M17] | CONTRADICTS | Repoint to `HANDOFF-marginatlas-2026-08-18.md`. |
| the reading-order pointer | `CLAUDE.md:33` | read `docs/handoff/<latest>-session-handoff.md` | The newest file matching that pattern is `2026-06-23-session-handoff.md`. The four newest handoffs are named `HANDOFF-marginatlas-<date>.md` and would never be found by it. | CONTRADICTS | Replace the glob with the literal newest filename, or rename the newest to match. |
| handoff index | `docs/handoff/INDEX.md:21` | 2026-06-16 is **CURRENT** | Five newer: `2026-06-23`, `2026-08-01`, `2026-08-07`, `2026-08-09`, `2026-08-18` [M17] | CONTRADICTS | Move the CURRENT marker to 2026-08-18. |
| handoff naming convention | `docs/handoff/INDEX.md:11` | filename is `YYYY-MM-DD-session-handoff.md` | The four newest use `HANDOFF-marginatlas-YYYY-MM-DD.md` [M17] | CONTRADICTS | State both forms, or rename. |
| handoff index completeness | `docs/handoff/INDEX.md:19-25` | 5 entries | **15** dated handoff documents in the directory, plus 17 numbered `NN_*.md` files [M17] | CONTRADICTS | Add the 10 missing rows, or say the table lists only session handoffs. |
| design authority | `CLAUDE.md:34` | `docs/design-system/GUIDELINES.md` is the authority for any UI work | file exists; last committed **2026-05-28** [M11] | AGREES (resolves) | Add the last-reviewed date next to the pointer. |
| architecture authority | `CLAUDE.md:35` | `docs/architecture/README.md`, "the file map" | file exists; last committed **2026-05-27**; both its counts contradict (rows B6, B7) | AGREES (resolves) | Add last-reviewed date; fix the two counts. |
| section + cohesion authority | `CLAUDE.md:36` | `docs/brand/section-constitution.md`, `docs/brand/cohesion-master-plan.md` | both exist, last committed 2026-06-15 [M11] | AGREES | Add last-reviewed dates. |
| definition of done | `CLAUDE.md:32` | `docs/verification-protocol.md` is non-negotiable | exists, last committed 2026-06-15; its gate count is wrong by 71 (row A6) | AGREES (resolves) | Fix its number. |
| self-declared source of truth | `DESIGN_STATE.md:3` | "Source of truth for the self-driving design loop (cron d07207f5, every :11/:41)" | The loop it describes is superseded by `docs/loop/`; the file is dated 2026-06-03 in its own log and 5 of the 7 routes in its queue no longer exist (row D24) | CONTRADICTS | Add "SUPERSEDED 2026-08-18 by `docs/loop/`" as line 2, or move to the attic. |
| root TODO | `TODO.md:1`, `:17` | "TODO, session 2026-05-28" (its own H1), "▶ IN PROGRESS" | The in-progress item is marked DONE 25 lines later at `:42`; the file has not been committed since 2026-05-30 [M11] | CONTRADICTS | Rename to `docs/handoff/2026-05-28-todo.md` or add "CLOSED 2026-05-30". |
| precedence of authority | `docs/loop/README.md:15-25` | 7 ranked sources | every named path resolves [M18] | AGREES | none |
| loop state pointers | `docs/loop/STATE.md:12-14` | tick 5 done, next slot 6, this census in flight | matches the tick log at `:106` | AGREES | none |

### D. Status claims.

Database state was **not** checked. No connection was opened, by instruction.
Everything below is repo-side only, and where a claim can only be settled
against Supabase it is marked UNRESOLVED rather than guessed.

| CLAIM | FILE:LINE | STATED | ACTUAL | VERDICT | ONE-LINE FIX |
|---|---|---|---|---|---|
| `contact_messages` applied | `CLAUDE.md:138` | EXISTS, its 2026-08-01 migration was applied | `db/migrations/2026-08-01-contact-messages.sql` exists [M19]. Applied-state is a database fact. | UNRESOLVED | Record the check date next to the claim; the repo cannot carry it. |
| `newsletter_signups` missing | `CLAUDE.md:140` | MISSING | `db/migrations/2026-08-16-newsletter-source.sql` exists and is the stated remedy [M19] | UNRESOLVED | Same. |
| `corrections` missing | `CLAUDE.md:141` | MISSING | `db/migrations/2026-08-16-corrections.sql` exists [M19] | UNRESOLVED | Same. |
| `saved_cells` missing but consistent | `CLAUDE.md:141` | feature is off, auth is "Coming soon" | `isAuthEnabled()` defaults **false** (`src/lib/feature_flags.ts:75`); "Coming soon" renders at `src/app/(site)/account/AccountPreview.tsx:92` and `src/app/(site)/signin/SignInForm.tsx:39` [M20] | AGREES | none |
| perf indexes applied | `CLAUDE.md:163` | APPLIED 2026-06-02 | migration file exists; applied-state is a database fact | UNRESOLVED | Same. |
| no `vercel.json` | `CLAUDE.md:96` | there is none, so the build command is a dashboard setting | no `vercel.json` tracked or on disk [M21] | AGREES | none |
| runner fails the build | `CLAUDE.md:103` | `prebuild_all` exits 1 when any gate fails, including under `--no-bail` | `process.exit(1)` at `scripts/prebuild_all.ts:548` and `:556` [M22] | AGREES | none |
| 9 migrations exist | (implied by `CLAUDE.md` §Manual actions) | 5 named files | 9 files in `db/migrations/`, all 5 named ones present [M19] | AGREES | none |
| commits unpushed | `docs/handoff/HANDOFF-marginatlas-2026-08-18.md:3`, `:69` | "162 commits sit unpushed on `main`" | `origin/main` is `6fc88e3e`, which **is that handoff's own commit** ("handoff: 162 commits and the paint rule"). They were pushed. Today `main` is `edfab3ab`, 8 ahead of `origin/main` [M23]. | CONTRADICTS | Add "corrected: they were pushed; see `docs/loop/WAKE-UP.md:12`". |
| untracked spike | `…-2026-08-18.md:86` | `scripts/spikes/deadcode_boards_probe.tsx` is untracked | tracked [M24] | CONTRADICTS (REC) | Date-stamp. |
| cream ratchet | `…-2026-08-18.md:73` | 33 across 16 files | 33 across 16 [M25] | AGREES | none |
| palette ratchet | `…-2026-08-18.md:74` | 4 across 2 files | 4 across 2 [M25] | AGREES | none |
| take-home bypasses | `…-2026-08-18.md:75` | 0 unreviewed, 5 reviewed | 0 and 5 [M25] | AGREES | none |
| commits already pushed | `docs/loop/STATE.md:41` | "`origin/main` equals `HEAD`" | `origin/main` `6fc88e3e`, `HEAD` `edfab3ab`, 8 ahead [M23]. True on 2026-08-18, false now, and it contradicts `STATE.md:17` in the same file, which is right. | CONTRADICTS | Rewrite as "the 162 were pushed on 2026-08-18; everything since is unpushed by rule". |
| cell section registry | `docs/loop/STATE.md:37-39`, `00-OPERATING-RULES.md` trap 1 | `PAGE_SECTION_ORDER` lists 7 cell sections | `CELL_PAGE_SECTIONS` has exactly 7 [M26] | AGREES | none. The paired claim "the cell page renders 34" was not re-measured here; it needs a render, not a count. |
| working tree | `docs/loop/STATE.md:15` | clean apart from `.mcp.json` and untracked `scratchpad/` | matches [M27] | AGREES | none |
| tick-4 work uncommitted | `docs/superpowers/research/2026-08-19-internal-state-audit.md:12` | "Tick 4's work, including gate 102 and the `--font-display` fix, is uncommitted" | committed as `2179bcb2` [M6][M7] | CONTRADICTS | One-line resolution note. |
| ratchet writers | `…-internal-state-audit.md:17` | 4 of 7 ratchets do not refuse a raise; `no-stock-imagery` has no writer | 6 baseline JSONs exist under `scripts/`; none for stock imagery [M28] | AGREES | none |
| local flags | `…-internal-state-audit.md:14` (item 3) | `.env.local` sets no spine or home reform flag | `.env.local` sets 5 `NEXT_PUBLIC_*` names, none of them `SPINE_REFORM*` or `HOME_REFORM` [M29] | AGREES | none |
| redirect precedent | `docs/loop/00-OPERATING-RULES.md:§11` | "`/browse` to `/world` is the first-party precedent, already in this repo" | `src/app/(site)/browse/page.tsx:2` is a permanent redirect to `/world` [M30] | AGREES | none |
| Supabase tier | `README.md:3`, `:88` | "the existing Supabase free tier" | `CLAUDE.md:7` says **Supabase Pro**. Not settleable from the repo, but the two documents cannot both be current. | CONTRADICTS (inter-document) | Delete the tier from `README.md`. |
| Next.js version | `README.md:8` | 15.0.3 | `^15.5.18` in `package.json`, 15.5.18 installed [M31] | CONTRADICTS | 15.0.3 to 15.5. |
| React version | `README.md:9` | "React 19 RC" | `^19.2.6` [M31] | CONTRADICTS | "React 19". |
| pricing page | `README.md:21` | `pricing/page.tsx`, 4-tier, Free / $38 / $78 / $150+ | `src/app/(site)/pricing/page.tsx`, **3 tiers, $0 / $37 / $77**, and its own header says "NO 'Contact sales' or opaque enterprise tier" [M32] | CONTRADICTS (path, tier count, all three prices) | Delete the pricing line; `src/lib/pricing/matrix.ts` is the single source. |
| design-loop queue "DONE" | `DESIGN_STATE.md:41`, `:45`, `:46`, `:47`, `:49` | `/dev/cell`, `/dev/country`, `/dev/home`, `/dev/sectors`, `/dev/compare` built and DONE | none of those five directories exist. `/dev/cities` and `/dev/calculator` do. [M13] | CONTRADICTS (5 of 7) | Mark the file superseded (row C10) rather than editing five lines. |
| data column is cream | `src/lib/feature_flags.ts:95` (comment) | "The data column stays cream and opaque either way" | Cream is banned by charter §11 and gated by `verify_no_cream` (position 35 of 102) [M1][M4] | CONTRADICTS | Source comment, not a document, and out of this file's ownership. Listed so it is not lost. |

### E. Ratchet baselines quoted in prose.

| CLAIM | FILE:LINE | STATED | ACTUAL | VERDICT | ONE-LINE FIX |
|---|---|---|---|---|---|
| cream ratchet size | `.../2026-08-17-founder-brief-and-loop-charter.md:429` | "gate 98, a ratchet at **517 references across 177 files** (`scripts/cream_baseline.json`)" | **33 references across 16 files** [M25] | CONTRADICTS (both figures and the gate index) | Replace the two numbers with "see `scripts/cream_baseline.json`". |
| palette ratchet size | `…-loop-charter.md:435` | "Its baseline of 165" | **4 across 2 files** [M25] | CONTRADICTS (past tense, so it reads as history, but no date bounds it) | Add "(165 at the time; 4 today)". |
| cream distribution | `.../2026-08-17-cohesion-audit.md:144-146` | 517 across 177 as of `662c6b25`; another tree at 479 across 167 | 33 across 16 [M25] | CONTRADICTS | The sha-stamp is the right instinct; add "superseded, now 33/16". |
| cream by area | `…-cohesion-audit.md:150-157` | `src/components/kit/` 114 refs in 46 files, `ui/` 15 in 9, `cities/` 12 in 7, `spine/` 7 in 4 | the current baseline has **no `src/components/kit/` entry at all**; the largest is `src/app/globals.css` at 5 [M25] | CONTRADICTS | Same one-line supersession note covers the whole table. |
| paragraph budget | `.../2026-08-07-visual-reform-design.md:99` | "at most 20 words of prose" | `budget: 20` [M33] | AGREES | none |
| paragraphs over budget | `…-visual-reform-design.md:126`, `:132` | 43 over budget; "the work list is those 43" | `over` array length 43 [M33] | AGREES | none |
| geo-link ratchet | `scripts/geo_link_construction_baseline.json` `why` field | "collisions untouched at 81" | 7 constructions, 81 collisions [M33] | AGREES | none. No document quotes these numbers, which is why they have not drifted. |
| take-home two-bucket | `docs/loop/05-GUARDRAILS.md:21` | `take_home_bypass_baseline.json` splits `unreviewed` from `reviewed` | it does; 0 and 5 [M25] | AGREES | none |

---

## ONE-LINE FIXES

Fixable by editing a single line, so they can land inside one tick. Grouped by
file so a fixer opens each file once. **35 edits across 18 files.**

**Gate count, 95/101/99/31/26/25 to 102** (the whole class is one find-and-replace
per line):

1. `CLAUDE.md:92`: 95 to 102.
2. `CLAUDE.md:99`: 95 to 102.
3. `CLAUDE.md:23`: drop "25-gate".
4. `CLAUDE.md:93`: `prebuild:serial` is a 43-gate subset, not the same chain.
5. `docs/verification-protocol.md:31`: 31/31 to 102/102.
6. `docs/verification-protocol.md:79`: 31/31 to 102/102.
7. `docs/loop/PROMPT.md:47`: 101 to 102.
8. `docs/loop/06-REFORMATION.md:38`: 101 to 102.
9. `docs/loop/10-HOMEPAGE.md:126`: 101 to 102.
10. `docs/loop/03-LONGEVITY.md:47`: 101 to 102.
11. `docs/loop/04-FAILURE-REFLECTION.md:32`: 101 to 102.
12. `docs/loop/DECISIONS-NEEDED.md:38`: 101 to 102.
13. `docs/loop/STATE.md:66`: 101 to 102.
14. `docs/loop/STATE.md:68`: 101 to 102.
15. `docs/loop/WAKE-UP.md:21`: 101 to 102.
16. `docs/handoff/HANDOFF-marginatlas-2026-08-18.md:212`: 101 to 102 (it is an
    instruction to a future agent, not a record).
17. `.../2026-08-17-founder-brief-and-loop-charter.md:220`: 99/99 to 102/102.
18. `…-loop-charter.md:429`: delete "gate 98".
19. `…-loop-charter.md:652`: delete "It is gate 99".

**Counts:**

20. `CLAUDE.md:10`: 322 to 688, 136 to 317.
21. `CLAUDE.md:11`: 56 to 102.
22. `docs/architecture/README.md:12`: 46 to 102.
23. `docs/architecture/README.md:13`: 87 to 317.
24. `docs/loop/STATE.md:95`: 153/254/101 to 144/257/102.
25. `docs/loop/STATE.md:96`: 352 to 358.
26. `docs/loop/WAKE-UP.md:153-154`: 153 to 144, 352 to 358.
27. `DESIGN.md:73-78`: one paste of `node scripts/audit_generation_seam.mjs`
    output replaces the whole six-line block. Counts as one edit because the
    block is one code fence, and it is the highest-value single edit in this
    census: it flips a **status**, not just a number.

**Pointers:**

28. `CLAUDE.md:120`: repoint to `HANDOFF-marginatlas-2026-08-18.md`.
29. `CLAUDE.md:33`: replace the `<latest>-session-handoff.md` glob with the
    literal filename; the glob cannot match the four newest handoffs.
30. `docs/handoff/INDEX.md:21`: move **CURRENT** to 2026-08-18.
31. `DESIGN_STATE.md:3`: insert "SUPERSEDED 2026-08-18 by `docs/loop/`".
32. `TODO.md:1`: insert "CLOSED 2026-05-30; historical".

**Statuses:**

33. `docs/loop/STATE.md:41`: "already pushed" to "pushed on 2026-08-18;
    everything since is unpushed by rule".
34. `README.md:8-9`: 15.0.3 to 15.5, "React 19 RC" to "React 19".
35. `README.md:21`: delete the pricing line (wrong path, wrong tier count,
    wrong prices).

**Deliberately not one-line, so not listed above:** the 38 "31/31" occurrences
across 16 dated plan files. Editing them individually would take a tick and
would falsify history. One status banner per dated directory is the correct
move, and it belongs to `06-REFORMATION.md`.

---

## STRUCTURAL

These recur by nature. Fixing the number today buys about a month.

**1. The gate count is typed in 28 places and generated in zero.**
The chain grew 25 to 26 to 31 to 53 to 58 to 95 to 98 to 99 to 101 to 102, and
each step left a fossil in whatever document was being written that week. Eight
distinct values are live in the repo right now. The runner already prints the
true figure at `prebuild_all.ts:498`. Until documents read it instead of
restating it, this row will be on the next census with a different set of wrong
numbers. `03-PROCEDURE.md:271` writes `prebuild N/N` and is the only document
that got this right.

**2. Every file count in `CLAUDE.md` is typed, and `CLAUDE.md` is read first.**
322/136/56/615 were presumably right once. The repo has roughly doubled since.
A wrong number in the entry point is the most expensive kind, because it is read
with the most trust and it seeds every downstream estimate. These four are
mechanically derivable from `git ls-files` in one line each.

**3. "Current" is asserted, never derived.** Three documents each name a
different handoff as current (`CLAUDE.md` 2026-08-01, `INDEX.md` 2026-06-16,
`STATE.md` 2026-08-18), and none of them is wrong about anything except which
file is newest, which the filesystem already knows. Worse, the naming convention
split (`<date>-session-handoff.md` versus `HANDOFF-marginatlas-<date>.md`) means
the `CLAUDE.md` glob **cannot** resolve to the newest handoff even in principle.
A pointer that is a sort order rather than a sentence cannot go stale.

**4. Ratchet baselines are quoted in prose that outlives them.** Cream went
517/177 to 479/167 to 33/16 while three documents kept the first figure. The
ratchets that are never quoted (geo-link at 7/81) have never drifted. The
baseline JSON is already the machine-readable truth; prose should cite the path
and not the value. Note the direction of the error: these are *victories*
recorded as *problems*, so the stale number makes the work look undone.

**5. A record and a rule are the same file type here.** `TODO.md`, `DESIGN_STATE.md`
and `_archive/README.md` all read as live instruction and are all dated records.
Nothing in the tree distinguishes them, so a session cannot tell a superseded
plan from a standing one without reading the git log. This is the same defect
that produced rows A31, A32, C10 and C11, and it is what the target tree in
`org-proposal.md` has to solve.

**6. A number and its instrument drift apart.** `DESIGN.md` §0.1 names its
instrument, which is exactly right, and the pasted output is still 16 days stale
and now says the opposite of the truth. Naming the command is necessary and not
sufficient; the output has to be regenerated or the block has to say when it was
taken.

---

## What this census cannot distinguish

Stated plainly, per operating rule 4.2.

- **An unread document looks exactly like an authoritative one.** Nothing here
  measures readership. `docs/architecture/README.md` is wrong by 56 routes and
  is item 3 in the mandated reading order; `docs/design-system/PLAN.md` is wrong
  by 191 components and may not have been opened since May. This census cannot
  tell them apart, and it ranked them the same. Where the distinction matters,
  archive rather than delete.
- **A count that agrees today may be a coincidence rather than a maintained
  invariant.** 34 rows read AGREES. Only a handful of those are agreements a
  mechanism defends: the ratchet JSONs (E5-E8), the layering allowlist (B5), the
  `N/N` placeholder (A26). The rest agree because someone typed them recently,
  the same way the 96 contradicting rows agreed when *they* were typed. Twenty of
  the agreeing rows were written in the last 24 hours. Expect them to rot on the
  same schedule.
- **REC versus live cannot be settled from the text.** I marked 14 rows REC on
  the basis of a date in a heading or a filename. A document with a date in its
  title may still be the only place a live rule is written down, and a document
  with no date may be dead. That judgement is the founder's, not a census's.
- **Database state is invisible here, by instruction.** Five rows in section D
  are UNRESOLVED for that reason. The repo can prove a migration file exists; it
  cannot prove a table does. The two `2026-08-16` migrations may have been
  applied by hand at any point since they were written, and nothing in this tree
  would show it.
- **"615 static pages" would take a forbidden build to settle.** The only
  `.next` on this machine is a dev build with an empty prerender manifest, so
  the figure is neither confirmed nor refuted.
- **This is a count of documents, not of harm.** A wrong gate count in a
  superseded 2026-06 plan and a wrong gate count in `CLAUDE.md` are one row each.
  The ONE-LINE FIXES list is ordered by file, not by blast radius; pricing that
  is `06-REFORMATION.md`'s job.
- **Line numbers move.** Two files under census (`docs/loop/STATE.md`,
  `docs/loop/02-ORGANISATION-RESEARCH.md`, `docs/loop/WAKE-UP.md`) were edited by
  another agent while this ran. Every line number here was read at
  `edfab3ab..HEAD` on 2026-08-19 and should be grepped, not trusted, by a fixer.

---

## Measurement commands

Every ACTUAL figure above came from one of these, run from `E:\atlas\website`.
Nothing is inferred; the three figures that could not be measured are marked
UNRESOLVED in the table and are not stated as facts.

| ID | What | Command |
|---|---|---|
| M1 | gate count, 102 | a Node script that reads `scripts/prebuild_all.ts`, applies `stripComments` from `scripts/lib/strip_comments.ts` to every line in order, takes the span from `const GATES: Gate[] = [` to the first line-initial `];`, and counts `{ name: "…"`. Also reports 102 unique names, 0 duplicates. |
| M2 | naive cross-check, 102 | `grep -c '{ name: "' scripts/prebuild_all.ts` |
| M3 | serial chain, 43 | `node -e "console.log(require('./package.json').scripts['prebuild:serial'].split('&&').length)"` |
| M4 | gate positions | same script as M1, printing `indexOf`: `no-cream` 35, `no-self-referential-css-vars` 38, `palette-membership` 63, `paragraph-budget` 98, of 102 |
| M5 | "31/31" spread | `grep -rn "31/31" docs/ \| wc -l` -> 38; `grep -rn "31/31" docs/ \| sed 's/:.*//' \| sort \| uniq -c \| sort -rn` -> 16 files |
| M6 | HEAD gate count | `git show HEAD:scripts/prebuild_all.ts \| grep -c '{ name: "'` -> 102 |
| M7 | gate 102 tracked | `git ls-files --error-unmatch scripts/verify_no_self_referential_css_vars.ts` -> prints the path (tracked) |
| M8 | no production build | `cat .next/prerender-manifest.json` -> `"routes": {}`; `cat .next/BUILD_ID` -> absent |
| M9 | file counts | `T=$(git ls-files)` then `echo "$T" \| grep -cE '^src/.*\.tsx?$'` 688 · `'^src/components/.*\.tsx$'` 317 · `'^src/.*\.tsx$'` 460 · `'^src/app/.*page\.tsx$'` 102 · `'^src/app/.*route\.ts$'` 16 · `'^src/app/dev/.*page\.tsx$'` 47 · `'^src/app/_design/.*page\.tsx$'` 3 · non-dev `page.tsx` 55 |
| | | **Trap, and I hit it first:** `git ls-files 'src/app/**/page.tsx'` returns **101**, silently dropping `src/app/page.tsx`, because a git pathspec glob does not match at depth 1. Every count above uses a prefix `grep` on the full `git ls-files` output for that reason. `find src/app -name page.tsx \| wc -l` also gives 102, and the two lists diff clean. |
| M10 | layering allowlist, 14 | `awk '/^const ALLOWLIST = new Set\(\[/,/^\]\);/' scripts/verify_layering.ts \| grep -cE '^\s*"'`; confirmed by `npx tsx scripts/verify_layering.ts` (GATE: PASS) |
| M11 | document age | `git log -1 --format=%ad --date=short -- <path>` |
| M12 | route generations | `node scripts/audit_generation_seam.mjs` -> 102 routes; 49 reachable, 53 internal; 47 not yet v2; 1 v2-only; 7 carrying v2; 26 internal carrying v2 |
| M13 | dev routes, 37 | `ls src/app/dev \| wc -l` -> 37 (36 directories + `page.tsx`); `ls src/app/dev/home` -> no such directory |
| M14 | unregistered scripts | Node script: 102 registered scripts, 82 under `scripts/`, 20 under `tests/`; `git ls-files` gives 257 tracked under `scripts/`, 226 of them `.ts/.tsx/.mjs/.js/.cjs`; set difference = **144** |
| M15 | repo totals | `git ls-files \| wc -l` 2,799 · `grep -c '\.md$'` 503 · `grep -c '^docs/.*\.md$'` 358 · `grep -cE '^docs/superpowers/(plans\|specs)/'` 128 · `grep -c '^scripts/'` 257 |
| M16 | TOKENS.md palette names | `grep -icE 'moss\|amber\|teal\|cream' docs/design-system/TOKENS.md` -> 25 lines; `grep -oiE ... \| wc -l` -> 26 occurrences |
| M17 | handoff inventory | `ls -1 docs/handoff/`; `git log --diff-filter=A --format=%ad --date=short -1 -- <file>` per file |
| M18 | precedence paths resolve | `test -f` on each of the 7 paths in `docs/loop/README.md:15-25` |
| M19 | migrations | `ls -1 db/migrations/` -> 9 files |
| M20 | auth off | `sed -n 74,76p src/lib/feature_flags.ts`; `grep -rn "Coming soon" src/app/` |
| M21 | no vercel.json | `ls vercel.json` -> No such file; `git ls-files \| grep -i vercel` -> empty |
| M22 | runner exits 1 | `grep -n 'process.exit' scripts/prebuild_all.ts` -> `:548`, `:556` |
| M23 | push state | `git rev-parse --short HEAD` `edfab3ab` · `git rev-parse --short origin/main` `6fc88e3e` · `git rev-list --left-right --count origin/main...main` -> `0  8` · `git log --oneline` shows `6fc88e3e handoff: 162 commits and the paint rule` |
| M24 | spike tracked | `git ls-files scripts/spikes/` -> includes `deadcode_boards_probe.tsx` |
| M25 | ratchet baselines | `node -e` over each JSON: cream 33 refs / 16 files · palette 4 / 2 · take-home `unreviewed` 0, `reviewed` 5 · hex 294 / 28 · geo-link 7 constructions / 81 collisions · paragraph budget 20, over 43 |
| M26 | cell sections, 7 | Node parse of `src/lib/page-layout/section-order.ts` -> `CELL_PAGE_SECTIONS` 7, `COUNTRY_PAGE_SECTIONS` 26, `INDUSTRY_PAGE_SECTIONS` 3, `NEIGHBORHOOD_PAGE_SECTIONS` 2, `REGION_PAGE_SECTIONS` 5 |
| M27 | tree state | `git status --porcelain --untracked-files=all` |
| M28 | ratchet files | `git ls-files \| grep -iE 'baseline\|ratchet'` -> 6 baseline JSONs under `scripts/`, none for stock imagery |
| M29 | local flags | `grep -oE '^NEXT_PUBLIC_[A-Z0-9_]+' .env.local` -> R2_PUBLIC_URL, SENTRY_DSN, SUPABASE_ANON_KEY, SUPABASE_URL, WARM_FRAME. Values were not read. |
| M30 | browse redirect | `grep -rn "browse" src/app --include=*.tsx` -> `src/app/(site)/browse/page.tsx:2` "permanent redirect to /world" |
| M31 | versions | `node -e "const p=require('./package.json'); ..."` -> next `^15.5.18`, react `^19.2.6`; `require('next/package.json').version` -> 15.5.18 |
| M32 | pricing | `grep -rnoE '\$[0-9]+' 'src/app/(site)/pricing/page.tsx'` -> `$0`, `$37`, `$77`; header comment `:10` states the same three |
| M33 | budget baselines | `node -e` over `scripts/paragraph_budget_baseline.json` -> `budget` 20, `over` length 43; `scripts/geo_link_construction_baseline.json` -> 7 / 81, `recorded` 2026-08-09 |
| M34 | comment blocks inside the GATES array, 35 | `awk '/const GATES: Gate\[\] = \[/,/^\];/' scripts/prebuild_all.ts \| grep -c '/\*'` |
| M35 | spread of the gate-count claim | `git ls-files '*.md'` piped through `grep -nE '(prebuild\|gate chain)'` then a second `grep` for `N/N`, `N gates` or `N-gate` -> 115 candidate lines in 56 files. That grep is **noisy**: it also catches review-gate ratios and unrelated fractions. The 78-locations / 32-files / 10-values figure in the summary is the hand-verified subset, i.e. the section A rows plus the line lists they carry, not this grep. Quoted as an order of magnitude only. |

**Not run, deliberately:** `npm run prebuild` (another process holds the chain
this tick, and a red gate seen here would not be mine), `npm run build`, and any
database connection.
