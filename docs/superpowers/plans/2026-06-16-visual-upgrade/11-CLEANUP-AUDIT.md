# 11 , Cleanup audit (read-only, nothing deleted yet)

## Cleanup audit

This is READ-ONLY. Nothing was deleted. Three buckets: SAFE-DELETE (clearly throwaway/obsolete, mine or untracked ephemera), PROPOSE (founder-authored, looks obsolete, needs confirmation), KEEP (load-bearing). Note: the root `.gitignore` already untracks the big regeneratable working dirs (`cache/`, `extracted/`, `normalised/`, `logs/`, `*.log`, `build_output.txt`); the `website/.gitignore` already untracks `screens/`, `scratch/`, `design-assets/incoming/`, `*.tsbuildinfo`, `err.txt`, `*slugcheck*`. Those are listed as SAFE-DELETE only where on-disk clutter is worth clearing, since git won't miss them.

### SAFE-DELETE (clearly throwaway/obsolete; all untracked or my own superseded artifacts)

- `E:/atlas/home-mockup.html` — superseded duplicate of `home.html` (both 2026-06-16; `home.html` is the one wired into `mockups-index.html`; this `-mockup` copy is not referenced).
- `E:/atlas/neighbourhood-london-west-end.html` — superseded duplicate of `neighbourhood-west-end.html` (latter is the one referenced by `mockups-index.html`; this longer-named copy is orphaned).
- `E:/atlas/london-prototype-v1.html` — explicit "v1" prototype, superseded by the 6 approved mockups; untracked.
- `E:/atlas/cell-reform-p1-1280.jpeg` — screenshot of the REJECTED `/dev/cell-reform` P1 prototype (per memory: P1 rejected); untracked.
- `E:/atlas/cell-reform-p1-375.jpeg` — mobile screenshot of the same rejected P1 prototype; untracked.
- `E:/atlas/live-london-top.jpeg` — one-off live-page screenshot used for a past review; untracked, not referenced.
- `E:/atlas/build_output.txt` — stale build log (2026-05-19; already gitignored).
- `E:/atlas/tsc.log` — empty stale tsc log (0 bytes; already gitignored via `*.log`).
- `E:/atlas/scratch-lab-server.cjs` — throwaway 3-line static server pointing at `scratch-restaurant-v4.html` (a file that no longer exists); untracked.
- `E:/atlas/scratch/` (entire dir) — scratch lab: huge one-off QC HTML renders (`cell_*.html`, `city_*.html`, `ind_*.html`, `learn_*.html`, `london_page.html`, `paris_page.html`), `write-mockups.cjs` (a one-shot generator reading a temp task output), `wave_b_cell_list_v1.json` (1.5 MB v1 artifact), `unsplash_test.json`, `moss-fix.svg`. All untracked throwaway.
- `E:/atlas/.playwright-mcp/` (75 console-*.log files) — Playwright MCP debug console dumps from 2026-06-15; untracked, pure ephemera.
- `E:/atlas/logs/` — pipeline run logs (`phase_b_*.log`, `wave5_*.log`, `rebuild_cities_v4c.log`, `phase_b_violations.log` 651 KB); already gitignored, regeneratable.
- `E:/atlas/website/E:atlaswebsitescratch_slugcheck.txt` — malformed-path scratch file (literal `E:atlas...` filename), one-line slug-check output; untracked, already gitignored via `*slugcheck*`.
- `E:/atlas/website/err.txt` — empty stale error file (0 bytes; already gitignored).
- `E:/atlas/website/tsconfig.tsbuildinfo` — TypeScript incremental build cache (1 MB; already gitignored, regenerated on build).
- `E:/atlas/website/scratch/` (entire dir) — QC render dumps (`qc_*.html` up to 484 KB each, `qc_*.txt`), one-off probe scripts (`probe_*.ts`, `peek_cells_master.ts`), `convert_brand_*.mjs`. Untracked, already gitignored.
- `E:/atlas/website/screens/` (entire dir, ~48 MB of PNGs) — verification screenshots from past sessions (`cell-saas-*`, `cities_*`, `country-*`, `dev_*`, `audit-*`, etc.); untracked, already gitignored.

### PROPOSE (founder-authored; looks obsolete but I did not create it and cannot be certain — confirm before deleting)

- `E:/atlas/ATLAS-MASTER-PLAN-v2.0.md` — superseded by v2.1 (same day, 2026-05-13).
- `E:/atlas/ATLAS-MASTER-PLAN-v2.1.md` — both master plans predate the v2.2-v2.5 execution plans and the entire 2026-06 reformation; likely historical.
- `E:/atlas/ATLAS-EXECUTION-PLAN-v2.2.md` — superseded by v2.3/v2.4/v2.5.
- `E:/atlas/ATLAS-EXECUTION-PLAN-v2.3.md` — superseded by v2.4/v2.5.
- `E:/atlas/ATLAS-EXECUTION-PLAN-v2.4.md` — superseded by v2.5 (the latest version exists).
- `E:/atlas/ATLAS-EXECUTION-PLAN-v2.5.md` — latest of the series but the whole v2.x line is the May acquisition push, now superseded by the 2026-06-16 visual-upgrade plan; confirm whether any v2.x is still a reference.
- `E:/atlas/GOAL-PLAN-500.md` — May acquisition-target plan; likely superseded by later GOAL-PLAN-* and the current product direction.
- `E:/atlas/GOAL-PLAN-US-500.md` — superseded by `GOAL-PLAN-US-MAXIMUM.md` (next-day, larger scope).
- `E:/atlas/GOAL-PLAN-US-MAXIMUM.md` — May data-acquisition goal doc; pre-reformation, likely historical.
- `E:/atlas/GOAL-PLAN-GLOBAL-EXPANSION.md` — May expansion goal doc; pre-reformation, likely historical.
- `E:/atlas/SESSION-SUMMARY-2026-05-13.md` — dated session summary, historical.
- `E:/atlas/SESSION-SUMMARY-v1.18.md` — versioned session summary, superseded by v1.19 and far-later state.
- `E:/atlas/SESSION-SUMMARY-v1.19.md` — versioned session summary; latest of the pair but still May-era, pre-reformation.
- `E:/atlas/HANDOFF-v1.16.md` — old data-foundation handoff (v1.16); superseded by the current `docs/handoff/2026-06-16-session-handoff.md` in the website repo.
- `E:/atlas/STATE.md` — "Atlas Acquisition State," last updated 2026-05-12; cell-count trajectory doc, likely stale vs current data.
- `E:/atlas/NEXT-STEPS.md` — May post-acquisition handoff; likely superseded.
- `E:/atlas/HEALTH.md` — May health snapshot; likely stale.
- `E:/atlas/QC-REPORT.md` — May QC snapshot; likely stale.
- `E:/atlas/SAMPLE-INSPECTION.md` — May sample-inspection note; likely one-off.
- `E:/atlas/WAVE-2-COMPLETE.md` — May "wave 2 complete" marker; historical milestone doc.
- `E:/atlas/COUNTRY-COVERAGE-PROBES.md` — May coverage-probe notes; likely superseded by the deep-research pipeline.
- `E:/atlas/EXCLUSIONS.md` — May data-exclusion notes; confirm whether still authoritative or migrated into the website repo.
- `E:/atlas/PRICING.md` — tiny May pricing note (1.2 KB); confirm vs the live pricing page / current product direction.
- `E:/atlas/README.md` — May acquisition-era root README; confirm vs `website/README.md` (the real product README).
- `E:/atlas/DELIVERY-INDEX.md` is inside `delivery/` (see below); the root has no DELIVERY-INDEX.
- `E:/atlas/inventory.csv` — May data-inventory export (98 KB); confirm whether regeneratable or superseded by the website data layer.
- `E:/atlas/inventory.json` — May data-inventory export (223 KB); same as above.
- `E:/atlas/secrets.env` — looks like an old secrets file at repo root (untracked; root `.gitignore` covers `.env*` but NOT `secrets.env`, so it is exposed-on-disk only, not committed). PROPOSE to confirm it holds nothing live, then remove; do not delete blind in case a script reads it.
- `E:/atlas/delivery/` (entire dir, includes a 25 MB `atlas-global-v1.15.0.zip` and ~20 versioned `atlas-global-v1.x` / `atlas-us-maximum-v1.x` snapshot dirs) — stacked May delivery snapshots; almost certainly only the latest (or none) is needed now, but these are founder-authored data deliverables, so confirm before pruning.
- `E:/atlas/refs/` empty-stub files: `uk-ixbrl-tag-frequency.json` and `uk-ixbrl-tag-samples.json` are both 2 bytes (empty `{}`/`[]`); confirm they are abandoned stubs.
- `E:/atlas/research-prompts/` — empty directory; confirm it can be removed (superseded by `deep-research/prompts/`).
- `E:/atlas/cells/` and `E:/atlas/normalised/` — empty directories (pipeline output dirs, `normalised/` already gitignored); confirm removable.
- `E:/atlas/website/PLAN_V3.md` — tracked, May plan; superseded by PLAN_V4 and the 2026-06 plan dir.
- `E:/atlas/website/PLAN_V4.md` — tracked, May plan; superseded by the current `docs/superpowers/plans/2026-06-16-visual-upgrade/`.
- `E:/atlas/website/DESIGN.md` — tracked May design doc; likely superseded by `docs/brand/` design-system constitution.
- `E:/atlas/website/DESIGN_STATE.md` — tracked early-June design-state doc; likely superseded by the reformation handoff.
- `E:/atlas/website/DESIGN-RESEARCH-PROMPT.md` — tracked design-research prompt; likely superseded by `DESIGN-SOURCING-RESEARCH-PROMPT.md` (2026-06-16, the one referenced in memory).
- `E:/atlas/website/src/app/dev/cell-reform/` — the REJECTED P1 prototype (per memory: "P1 prototype /dev/cell-reform REJECTED"). It is git-tracked, so I am proposing rather than auto-deleting; confirm it is safe to remove now that `/dev/london-commercial` is the active direction prototype.

### KEEP (load-bearing — do not touch)

- `E:/atlas/home.html`, `E:/atlas/country-uk.html`, `E:/atlas/city-london.html`, `E:/atlas/cell-london-restaurants.html`, `E:/atlas/industry-restaurants.html`, `E:/atlas/neighbourhood-west-end.html` — the 6 approved static mockups (the entire visual-upgrade LOOK is approved via these).
- `E:/atlas/mockups-index.html` — the index that links the 6 approved mockups; load-bearing entry point.
- `E:/atlas/ref-levels.jpeg`, `E:/atlas/ref-numbeo.jpeg`, `E:/atlas/ref-owid.jpeg`, `E:/atlas/ref-stripe.jpeg` — founder reference images for the design direction (referenced in the reformation work); keep until founder says otherwise.
- `E:/atlas/deep-research/` (entire dir) — ACTIVE data pipeline: `prompts/`, `reports/`, `drops/`, plus `INDEX.md`, `EXTRAPOLATION_MAP.md`, `FINALIZE_CHECKLIST.md`, `OVERNIGHT_STATE.md`, ingest/mapping/review docs. Founder runs the DB commits from here; recent commits touch it. Load-bearing.
- `E:/atlas/website/` (the entire Next.js repo source) — the actual frontend; `src/`, `content/`, `data/`, `db/`, `public/`, `tests/`, config files.
- `E:/atlas/website/src/app/_design/` — internal design-system catalog ("visual source of truth for every primitive"); explicitly load-bearing.
- `E:/atlas/website/src/app/dev/london-commercial/` — the CURRENT (2026-06-16) direction prototype (Stripe-level, sales-driven); active, untracked-but-live.
- `E:/atlas/website/src/app/dev/{charts,kit,brand-glyphs,font-showcase,calculator,cities,country,compare,home,cell,pricing,distribution-states,lock-states}/` — internal dev/QA routes still in use (e.g. `/dev/charts` is the chart-kit showcase referenced in memory). Keep unless founder wants a dev-route purge; not obviously throwaway.
- `E:/atlas/website/docs/` (including `docs/superpowers/plans/2026-06-16-visual-upgrade/` 00-09 + README, `docs/brand/`, `docs/handoff/`, `docs/verification-protocol.md`) — the full DESIGN plan, brand constitution, handoffs, and verification protocol. Load-bearing.
- `E:/atlas/website/.env.local`, `E:/atlas/website/components.json`, `E:/atlas/website/.npmrc` — shadcnblocks registry wiring + API key + tokens config; load-bearing.
- `E:/atlas/website/DESIGN-SOURCING-RESEARCH-PROMPT.md` — current (2026-06-16) design-sourcing research doc referenced in memory.
- `E:/atlas/website/TODO.md`, `E:/atlas/website/PRODUCT.md`, `E:/atlas/website/README.md`, `E:/atlas/website/CLAUDE.md` — active product/repo docs.
- `E:/atlas/website/tailwind.config.ts`, `next.config.js`, `tsconfig.json`, `package.json`, `package-lock.json`, `postcss.config.js`, `sentry.*.config.ts` — build/config; load-bearing.
- `E:/atlas/website/design-assets/incoming/{2026-06-14-claude-design, 2026-06-14-country-engraved}/` — NOTE: the memory note about deletable `set_17..20` does NOT match what is on disk here (these are different, dated 2026-06-14 dirs). KEEP pending founder confirmation rather than treating as the stale sets; do not delete on the strength of the old note.
- `E:/atlas/adapters/`, `E:/atlas/scripts/`, `E:/atlas/taxonomy/`, `E:/atlas/macro/`, `E:/atlas/us/`, `E:/atlas/refs/` (minus the 2-byte stubs noted), `E:/atlas/ledger/`, `E:/atlas/cache/` (gitignored but is the live FX/sample cache) — the data-acquisition + city-data pipeline source and reference data; load-bearing for the pipeline, do not delete.
- `E:/atlas/secrets.env` is in PROPOSE (above), not here, because of its security implication.
- `E:/atlas/.git/`, `E:/atlas/website/.git/`, `E:/atlas/.github/`, `E:/atlas/.claude/`, `E:/atlas/website/.claude/`, `E:/atlas/website/.superpowers/`, `E:/atlas/website/.vercel/`, `E:/atlas/website/node_modules/` — VCS/tooling/deps; keep.
