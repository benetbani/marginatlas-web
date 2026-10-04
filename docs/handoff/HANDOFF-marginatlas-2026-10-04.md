# HANDOFF: marginatlas, 2026-10-04 (night)

The truth pass is LIVE (website `main` 38f81e8a, proven on production); milestone 1 of his launch interview is BUILT on website
branch `milestone-1` (M1 a3e8af73 to M11 97fa4226), its full chain 210 of 211 on 97fa4226 (the one red a renderer's crash on exit,
green alone), **LIVE since 2026-10-05 at `main` 128c66b6 on his "Push and deploy now"**, proven on production 18 of 19 (the 19th,
the estimate mark's hover label, fixed on branch `m1-followups` 0e0eba92, NOT pushed); milestone 2 (Pro) is not started, its code
map is written. Written 2026-10-04, late night; closed and shipped 2026-10-05 after midnight.

> **How to use this document.** Read top to bottom once. Then read the files in section 7 in the given order. Do not start work
> until you can answer the checklist in section 13. A ready-to-paste re-hydration prompt is in section 14.

## 1. TL;DR

marginatlas.com is a small-business decision atlas (what a trade earns, costs and survives, by place) whose depth is the United
Kingdom; one launch day is planned for early to mid November 2026, with Pro on sale. On 2026-10-04 three things shipped in order:
the band page on every page type (21be5408), then the truth pass (plan 06: every wrong UK figure the labels audit found now prints
the register's figure, the law engine's or an estimate said so; London is Greater London; one Sources and licences page; each
truth-pass figure stamped with its provenance), merged with the vertical engine under it and deployed on his "Merge and deploy now"
(38f81e8a). Then, on his "push forward", the loop built milestone 1 of his 2026-09-26 launch interview (ten open launch fixes, M1 to
M10, including indexing by a floor census) on branch `milestone-1`. **The single most important thing: `milestone-1` is not pushed
and nothing may be pushed or deployed without his explicit yes.** Milestone 1 is LIVE (128c66b6, his "Push and deploy now", proven on production) and
photographed (`E:/atlas/design/loop/build/photos/m1/MILESTONE-1-SHEET.jpeg`); the next action: then his milestone review, then plan milestone 2 (Pro) from the code map
(`docs/superpowers/research/2026-10-04-pro-code-map.md`: nearly everything exists, switched off, built for the old Basic and
Premium plans, wired to no live page).

## 2. Mission & success criteria

- **The enduring goal, his words:** data quality first, "no visibly wrong numbers" (memory `project_marginatlas_direction`); a figure
  that looks like data and is not is the site's worst failure. Depth stays in the UK until after launch.
- **The launch plan (his interview of 2026-09-26, `E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md`):** one launch day; Pro ON at
  $38 a month or $238 a year (dollars), Stripe checkout first, no trial; on UK pages each chapter's first level free, the rest
  locked (title, icon, blurred drawing, one line, one button, never a pop-up). Order: **milestone 1 the launch fixes, milestone 2
  Pro, milestone 3 the home page**; he reviews only at each milestone and before launch day.
- **The current tactic:** milestone 1 live and reviewed. Done means: the chain green on `milestone-1`, his yes, `main` moved to it,
  production probed, his review taken.
- **His working instruction this session:** "push forward" (three times) means continue the plan autonomously, deciding what the
  rules and his rulings already decide, and asking only for what is his (rulings, money, pushes, deploys).
- **Hard constraints:** section 9.

## 3. Current state: ground truth

| Component | Status | Notes |
|---|---|---|
| Production (www.marginatlas.com) | LIVE at website `main` 128c66b6 (milestone 1, 2026-10-05) | milestone 1 proven by `website/scratchpad/reform/_prod_m1.mjs`, 18 of 19. Before it, at 38f81e8a: | band page, truth pass, vertical engine; proven 2026-10-04 on 8 URLs at 1280 and 375 (`website/scratchpad/reform/_prod_truth.mjs`, 16 of 16 ok) |
| Website branch `milestone-1` | BUILT, NOT PUSHED | on top of 38f81e8a: M1 a3e8af73, M2 ced69596, M3 c74110e0, M4 b0ae3dbb, M5 3333ee2d, M6 b1242302, M7 331ffe8c, M8 2d60e156, M9 02018341, M10 3d3ea1ef, gate fixes cd2185a6, 642ce9ea, 8d985049, M11 8d23abd1 and 97fa4226 (counts 0332d3d4), docs |
| Full chain on `milestone-1` | GREEN on 97fa4226 (210 of 211, the one red green alone) | started on 3d3ea1ef's tree; output `C:\Users\benet\AppData\Local\Temp\claude\E--atlas\180d5f78-520f-4ed5-8bc8-0e423e0c92bb\scratchpad\chain_m1close.txt`; at 113 of 210 gates, two red, both in the new census gate and both fixed after the run read them: `harness-preflight` (no preflight call, cd2185a6) and `gate-reds-ratchet` (its red printed without a rule, 642ce9ea); each rechecked alone green. The first run ended 207 of 210, its third red `geo-link-construction` (four country-tree paths built from parts) fixed in 8d985049. The second run, on 97fa4226 (`chain_m1final.txt` in the same scratchpad folder): 210 of 211, `pages-fresh` red only because its renderer crashed on exit (3221226505) after writing all nine pages; green alone at once. |
| Floor census | WRITTEN 2026-10-04T21:34 | `website/data/seo/floor_census.json`: 1,515 spine pages outside the UK, 646 at their floor (countries 194/194, how-to 151/151, industries 133/138, cities 42/245, trade pages 126/787) |
| Design repo `E:/atlas` | branch `p4-seam`, local only (no remote) | last commit 7dbb8a8; UNCOMMITTED: `rules/FOUNDER-VERDICTS.md` (his answers of the night appended); commit it |
| Pro code map (for milestone 2) | WRITTEN | `website/docs/superpowers/research/2026-10-04-pro-code-map.md`: flags all off, Stripe checkout and a signature-checked webhook for Basic/Premium at $37/$77, magic-link accounts, paywall drawings on dev routes only, the two tables not applied to the live database; nine gaps against his ruling listed |
| Analytics | Clarity removed in code on `milestone-1` | Vercel Web Analytics loads only when he switches it on in the Vercel dashboard AND `NEXT_PUBLIC_WEB_ANALYTICS=1` is set |
| Main pages' gates | 211 in the chain (M11 added `copy-no-method-words`) | count generated in `website/CLAUDE.md` (never type a count) |

## 4. How we got here: the decision trail

1. **The band page (his message of 2026-10-04, verbatim in FOUNDER-VERDICTS: abandon the bento for sections on alternating bands).**
   Shipped on the UK page ("idk-push", bd6b85da), then on every page type ("Push forward man", "Deploy now", 21be5408).
2. **The truth pass (his "push forward").** The labels audit (`E:/atlas/design/loop/build/research/2026-10-02-labels-audit-uk-pages.md`)
   had found live wrong numbers (a constant "~$675K" in 103 trade heads, one restaurant bill copied onto ten trades, "London"
   meaning three places, world medians over interpolated countries). He answered four questions, every recommendation:
   **Greater London** (E12000007) on every page; **one Sources and licences page**, the foot links to it, cards stay agency-free;
   a London money trade leads with **break-even** ("a business needs X a year to carry an average London shop; Y of 100 registered
   businesses take that"), the middle business's keeps beside it, sole trader first, company under the plus; survival **recent
   (period) rates first**, the 2019 starters beside it once. Plan `website/docs/superpowers/plans/2026-10-04-vertical-engine-06-truth-pass.md`
   (status block at its top). Departures, each with its reason: the sales strip prints tenths, never quartiles (his N9 of
   2026-08-30, gate `no-quartile-words`); London's metro GDP left with its density (the 14.3M metro is not Greater London); the city
   market card's figure is the register's total (the FOCAL law) with three-word labels (ROW SENTENCE); London's age mix took the
   residents and visitors card's seat (that card's split was a slope on the metro; replace, never cut; the page's BLOCK FLOOR);
   **B3b found on the way:** the UK page's "What London's trades keep" printed the hand-typed London margins its doors no longer
   showed, now "What London's trades take", the register's typical sales.
3. **Deployed on his "Merge and deploy now (Recommended)"** (the question named that the vertical engine merges under it).
4. **Milestone 1 (his "push forward").** A sweep found ten interview items open; each is his decided answer, so nothing was re-asked:
   - M1 retired trades under a place redirect (308) in one hop to the nearest live page: the merged successor in the same place,
     else the place's own page (`src/lib/taxonomy/retired_paths.ts`, wired in `src/middleware.ts` before the rename handler so a
     legacy slug never takes two hops).
   - M2 Clarity removed (his answer 7); Vercel Web Analytics behind a flag, because Vercel serves its script only once he switches
     it on (no npm install: downloads need his permission).
   - M3 the staff card's average-salary bar removed (answer 30). The card's one figure at 30 became the minimum wage's full-time
     year, in ink; loud seat two declared HELD EMPTY (the old declaration said the accent is the average, not the wage floor, so the
     floor was not promoted); the hire lever's total went to 16px (the model laws' FOCAL refuses a 20 in a card holding a 30).
   - M4 his three kept forms (the two six-spectra tables, the city cards) recorded as FOCAL exemptions by form (answer 31); the UK
     page's model-law count is 0.
   - M5 the industry places table's rows are doors (answer 35), a ruled exception to M23 ("a compare table is a reading"), declared
     by `data-doors="1"` and walked by the doors gate; the table draws on no trade today (it needs four cities with own figures).
   - M6 the district hub's visitor figures withheld (answer 36); the district doors moved onto the rent ranking's rows; the hood
     floor became 4.
   - M7 the industry survival card's foot says "the trade anywhere, not one country's" (answer 32).
   - M8 the 26 London trade headers that opened on "Not known yet" lead with a trusted figure (answer 2, "cost to open, sales a
     year"): register sales (112, from the truth pass), else the cost to open at London prices (14), else the UK survival of the
     trade's group (9); three keep the state word.
   - M9 "About the figures" (the page titled so at `/about-data`, opening with how to read a figure: counted, worked out, looked
     up, estimate; both footers link it) and the thin pages' "Notify me when <place> reaches this depth".
   - M10 indexing (answer 6: "UK pages + every page at its floor; thin pages noindexed until they reach it"; production said
     "index, follow" everywhere): a floor census of renders, not an assumption per page family, because the floor is measured on
     renders and the static count was proven equal to the model laws' BLOCK FLOOR on sixteen pages.
   - M11, found by the milestone's photographs: "typical for the trade, modelled" on the London pizzerias header. Sixteen COPY
     strings still carried a word his copy correction of 2026-09-24 struck, each printed only on pages the plain-copy harness never
     renders; each rewritten in the file's own register, and `copy-no-method-words` walks every COPY value (8d23abd1, 97fa4226).

## 5. Hard-won truths & mental model

- **One London:** Greater London, E12000007. `src/lib/uk/registers/register_city.ts` marks a city held to a register region; such a
  page prints no metro figure. Visitors come through one resolver (`cityVisitorsM`, people.json first).
- **Provenance:** every truth-pass figure carries `data-src` (file and key) and `data-kind` (counted, worked out, looked up,
  estimate: the register ledger's words); `provenance` counts the rest per harness page and only falls.
- **Indexing:** `src/lib/seo/indexable.ts`: a UK page always indexes; any other spine page only when the census counted it at its
  floor; a spine page the census never counted does not. Floors (the model laws' `FLOOR_BY_SURFACE`): country 13, city 16, cell 15,
  industry 11, hood 4, howto 7. Non-UK cities sit at 15 (the neighbourhood pager draws only on curated cities), so 203 of 245 are
  noindexed by his rule as worded; worth naming to him at review.
- **The census is a snapshot:** after any change that adds or removes a block on a spine page, rerun `scripts/seo/floor_census.tsx`
  (about eight minutes, needs the database) and commit the file; `floor-census-fresh` only sees the harness's non-UK exemplars.
- **The harness reads renders:** `pages-fresh` renders nine pages first; the model laws (BLOCK FLOOR, FOCAL one 30 a card and nothing
  between 16 and 30 beside it, ROW SENTENCE labels of three words at most), the loud seats (`LOUD_SEATS` declared in each view, held
  to the render's accents), the page laws and the copy gate all read them. Baselines only fall.
- **Copy:** no em dashes, no source agency on a card (UK publishers live only in `src/lib/spine/uk_sources.ts`), no semicolons, one
  supporting line of twelve words at most, labels never sentences, no "modelled" or "withheld" words, no quartile words.
- **Generated files:** `npx tsx scripts/counts.ts --write` after a gate change; `npx tsx scripts/harness/census.ts --write` after a
  view change (writes `docs/loop/CENSUS.md` and the design repo's `PAGES.md`).
- **Deploys:** Vercel runs the whole chain before building; push to live took about four minutes on 2026-10-04.

## 6. Dead ends: do NOT retry

- Raising any ratchet baseline to pass (fix the card the row names; every baseline here only fell).
- The curated London model (`data/london/london_market_v1.json`) as figures on any page; the invented 0.5 and 1.8 band; world
  medians on world tracks; the residents and visitors slope for London; quartiles in a strip.
- A second browser while the full chain runs (memory deaths on an 8 GB machine; 1.7 GB free was typical).
- `--url=/gb` style arguments in Git Bash without `MSYS_NO_PATHCONV=1` (rewritten to `C:/Program Files/Git/gb`).
- Python heredocs holding `\\b` (it became a backspace byte twice); write regex code with the Write tool, or check `repr`.
- Importing `adapt_city.ts` or `adapt_cell.ts` in a chain test (pulls the Supabase client): use the pure modules
  (`city_peer_list.ts`, `setup_items.ts`).
- Committing on `main` directly (it happened once this session; moved to `milestone-1`).

## 7. Critical files & artifacts (reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-10-04.md` | this dossier | first |
| 2 | `E:/atlas/design/loop/build/STATE.md` | the state of record (`step-in-flight`) | must |
| 3 | `E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md` | his launch plan and the three milestones | must |
| 4 | `E:/atlas/website/docs/superpowers/plans/2026-10-04-milestone-1-close.md` | M1 to M10 as built, commits | must |
| 5 | `E:/atlas/rules/FOUNDER-VERDICTS.md` (last three sections) | his words of 2026-10-04, verbatim | must |
| 6 | `E:/atlas/website/docs/superpowers/plans/2026-10-04-vertical-engine-06-truth-pass.md` (status block) | the truth pass and its departures | should |
| 7 | `E:/atlas/design/loop/build/QUEUE.md` (section I, the launch rows) | every row's status | should |
| 8 | `E:/atlas/design/loop/build/briefs/MODEL.md` PART 10 (10.8c, forbids 68 to 77) | the page laws incl. the truth pass's | should |
| 9 | `E:/atlas/website/CLAUDE.md` and `docs/verification-protocol.md` | repo conventions, the definition of done | should |
| 10 | `E:/atlas/website/docs/superpowers/research/2026-10-04-pro-code-map.md` | what exists for Pro, and the nine gaps against his ruling | before milestone 2 |
| 10b | `E:/atlas/design/loop/build/research/2026-10-02-labels-audit-uk-pages.md` | the wrong-number audit; items 10, 11, 14 to 19, 23, 24 remain | later |
| 11 | `src/lib/seo/indexable.ts`, `scripts/seo/floor_census.tsx`, `src/lib/seo/depth_source.ts` | indexing and the notify ask | when touching SEO |
| 12 | `src/lib/spine/london_trade_hero.ts`, `src/lib/spine/provenance.ts`, `src/lib/spine/uk_sources.ts`, `src/lib/taxonomy/retired_paths.ts` | the truth pass's and milestone 1's core modules | when touching them |
| 13 | memory: `C:/Users/benet/.claude/projects/E--atlas/memory/MEMORY.md`, `project_2026-10-04_milestone1_close.md`, `project_2026-10-04_truth_pass_plan06.md`, `project_2026-09-26_launch_interview.md` | durable notes | should |

## 8. Open threads & next steps

**Committed next steps (in order; step 3 needs his explicit yes):**

1. **DONE 2026-10-05: prove milestone 1's chain.** Read the chain output (section 3; it ends with a `chain exit` line). Expected: only
   `harness-preflight` and `gate-reds-ratchet` red, both fixed after the run read them. Then run, from `E:/atlas/website`:
   `NODE_OPTIONS=--require=./scripts/lib/pw_edge_fallback.cjs npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail
   --only=harness-preflight,gate-reds-ratchet,floor-census-fresh > <a file>` and read the file. If the output file is gone or any
   other gate is red, run the full chain again on the branch head (about 20 minutes, serial, nothing else heavy running) and fix
   any red at its source.
2. **DONE 2026-10-05 (`E:/atlas/design/loop/build/photos/m1/`, sheet `MILESTONE-1-SHEET.jpeg`): photograph the changes** (1280 and 375, from fresh renders: `scratchpad/reform/render_some.sh "<surface> <slugs>"` then
   `_shoot_zone.mjs` or `_shoot_sel.mjs`): the UK staff card (`#hiring`), the London district hub's rent ranking, the pizzerias and
   hostels headers, About the figures (`scratchpad/reform/_about_render.tsx` then `#reading`), the notify form on `/cities/frankfurt`.
   Send them with a plain, short report (what changed for a reader; the 203 non-UK city pages now noindexed, named as his rule's
   consequence; his switch for analytics).
3. **DONE 2026-10-05 (his "Push and deploy now (Recommended)"; live 128c66b6; `_prod_m1.mjs` 18 of 19, the 19th fixed on
   `m1-followups` 0e0eba92 and shipping with the next deploy he approves). Was: ask him** (one AskUserQuestion, recommendation first): push and deploy milestone 1? On yes: `git checkout main && git merge
   --ff-only milestone-1 && git push origin main`; watch with `MSYS_NO_PATHCONV=1 node scripts/deploy_watch.mjs
   --marker="full time at the minimum wage" --minutes=22` (that phrase is new on `/gb`); then probe: `/gb/london/banking` answers 308
   to `/cities/london` (`scratchpad/reform/_status_probe.mjs`, www host), `/cities/frankfurt` carries `noindex`, `/gb` and
   `/cities/london` carry `index`, `/gb/london/pizzerias` leads with "Cost to open", `/about-data` reads "About the figures". Record
   the commit in `STATE.md`, QUEUE and memory.
4. **His switch for analytics:** Vercel dashboard, the project, Analytics, enable Web Analytics; then Settings, Environment
   Variables, `NEXT_PUBLIC_WEB_ANALYTICS` = `1` for Production; then redeploy. Give him these clicks; the code is ready.
5. **His milestone 1 review.** Take his corrections as rulings into FOUNDER-VERDICTS and gates.
6. **Milestone 2, Pro (after his review):** start from the code map (`docs/superpowers/research/2026-10-04-pro-code-map.md`), then
   write a plan from the interview's milestone 2 list (the paywall on UK pages with locked sections' structured data; checkout
   first, $38/$238, the account from the checkout email; terms, privacy and refunds drafted for his approval; the first Pro
   sections: DATA-REQUIREMENTS items 73, 77, 76, 74). The map's sharpest findings: checkout demands a signed-in user (his ruling
   wants the account made from the checkout email); `LockVeil` ships the locked content in the HTML (lock on the server instead);
   the paywall modal sits on every page while he said "never a pop-up", and a chain gate (`verify_monetization_coverage` check B)
   requires that modal, so the gate changes with his ruling written into it; `verify_v34_research_rules` bans the word "refund".
   His alone: the Stripe account, live keys and price objects, applying the two migrations, VAT registration, the terms' wording.

**Optional / later:** the labels audit's remaining items (the world-typical cards on London trade pages such as "Covering the costs
70%"; rent by district from the valuation tables; customer earnings tenths from ASHE; the premises figures); the corrections and
changelog pages (QUEUE `cred:about-figures`); the London restaurants header's empty top-right slot; folding the older
`data/quality/thin_pages_v1.json` sitemap filter into the census.

## 9. Constraints, guardrails & operator preferences

- **Never** push or deploy without his explicit yes in chat; never `--no-verify`; never force-push; never rename a URL (redirect
  instead); never raise a ratchet baseline; never pipe a verification into a filter (redirect to a file and read it); never print
  `.env.local` values; no downloads (npm installs included) without his permission; subagents never commit under `E:/atlas`.
- Never name a source agency on a card; never fabricate testimonials, reviews, logos or credentials; the VOA rating list is never
  republished; the Gazette's fair-use rules hold.
- He decides taste, money, rulings and pushes; the loop decides everything his rules already decide (DOCTRINE 16, "never ask him to
  look"). Ask with AskUserQuestion, recommendation first, two to four options.
- Reports: plain words, short, no jargon, what changed for a reader; he reads photographs, never a dev server or a browser session.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; branch off `main` for website work.

## 10. Environment & reproduction

- Website `E:/atlas/website` (Next.js 15, React 19, Tailwind 3.4), remote `benetbani/marginatlas-web`, default `main`; design repo
  `E:/atlas`, branch `p4-seam`, local only. Windows 11, Git Bash for scripts.
- Typecheck: `npx tsc --noEmit -p .` (scratch `.ts` files under `website/scratchpad/` are included; keep them compiling or delete
  your own).
- Chain: `NODE_OPTIONS=--require=./scripts/lib/pw_edge_fallback.cjs npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail > out.txt`
  (one gate: `--only=<name>`); the Edge fallback is required for browser gates on this machine.
- Renders: `bash scratchpad/reform/render_some.sh "city london" "cell gb london restaurants"` (writes
  `scratchpad/harness/pages/<surface>-<slugs>.html`); all nine: `node scripts/verify_pages_fresh.mjs`.
- Census: `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require
  ./scripts/spikes/stub_next_font.cjs scripts/seo/floor_census.tsx` (`--only=` and `--limit=` for trials).
- Production checks: `node scratchpad/reform/_prod_truth.mjs` (Edge, a browser user agent; production answers bare clients on the
  apex with a 307 to www).

## 11. Landmines & gotchas

- Components written for Next's automatic JSX runtime (`CountryFlag`, the about page) need `globalThis.React = React` in a tsx test.
- A new gate must call the harness preflight (if it lives in `scripts/harness/`) and print its reds through `scripts/lib/red`
  (`red.mjs` for an .mjs gate): `harness-preflight` and `gate-reds-ratchet` each caught the census gate once.
- A country or region URL is never built from parts: ask `src/lib/geo/page_targets.ts` (`countryPageTarget`, `geoPageTarget`), or
  sanction the construction in `scripts/verify_geo_link_construction.ts` with the guard that checks the route's own list. The
  middleware cannot import page_targets cheaply (it pulls the neighbourhood data into the edge bundle).
- The plain-copy harness reads nine pages; `copy-no-method-words` reads every COPY string. A string printed from outside COPY (older
  components) is read by neither until it renders on a harness page (QUEUE `copy:legacy-modeled-strings`).
- The middleware lowercases paths before the retired blocks; a new block placed before canonicalisation would see mixed case.
- `CompareTable` rows may link only on a table that declares `data-doors="1"`; the doors gate still forbids links on every other table.
- Two footers exist: `src/components/SiteChrome.tsx` (the main pages) and `src/components/spine2/SiteFooter.tsx`.
- The newsletter endpoint accepts a `depth:<path>` source only for a path the census counted under its floor outside the UK.
- Files in the working copies are mostly LF with CRLF warnings from git; Python patches here read and wrote LF and kept diffs small.

## 12. Glossary

- **A1 to A6, B1 to B5, B3b:** the truth pass's tasks (plan 06). **M1 to M10:** milestone 1's items (the close plan).
- **Band page / zone:** each level of a page a full-width band, tones alternating (MODEL PART 10). **Floor:** a page type's minimum
  block count. **Thin page:** a spine page outside the UK counted under its floor. **Register city:** a city whose page is held to a
  register region (London: Greater London).
- **Loud seat:** one of a page's three declared accent moments (`LOUD_SEATS`). **HIS row:** a QUEUE row only he can answer.
- **Provenance kinds:** counted, worked out, looked up, estimate.

## 13. Successor verification checklist

You are oriented when you can answer:

1. What is live on production, at which commit, and what did his "Merge and deploy now" bring in with it?
2. What is on `milestone-1`, is it pushed, and what was the state of its chain at handoff?
3. What are his four rulings of 2026-10-04 evening for the truth pass?
4. What decides whether a page outside the UK is indexed, and what must you run after changing a page's blocks?
5. What must be true, and whose word is needed, before `main` moves?
6. Which baseline may you raise to get a gate green?
7. What does milestone 2 contain, and which parts are his?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com (website E:/atlas/website, design repo E:/atlas)
Working directory: E:/atlas/website
Handoff dossier (read this FIRST, in full): E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-10-04.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   E:/atlas/design/loop/build/STATE.md
   E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md
   E:/atlas/website/docs/superpowers/plans/2026-10-04-milestone-1-close.md
   E:/atlas/rules/FOUNDER-VERDICTS.md (the last three sections)
   E:/atlas/website/docs/superpowers/plans/2026-10-04-vertical-engine-06-truth-pass.md (the status block at its top)
   E:/atlas/design/loop/build/QUEUE.md (section I and the launch rows)
   E:/atlas/design/loop/build/briefs/MODEL.md (PART 10)
   E:/atlas/website/docs/superpowers/research/2026-10-04-pro-code-map.md
   E:/atlas/website/CLAUDE.md and E:/atlas/website/docs/verification-protocol.md
   C:/Users/benet/.claude/projects/E--atlas/memory/MEMORY.md and project_2026-10-04_milestone1_close.md
3. Do not edit anything, run anything destructive, or make decisions until steps 1-2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5-10 lines: the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint,
   not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files
   (run git log and git status in both repos); the dossier is a point-in-time snapshot
   and the code and data are ground truth.
6. Then stop and wait for my go, unless the dossier's "Open threads" marks a committed
   next step I've pre-authorized. Steps 1 and 2 there (prove the chain, photograph) are
   pre-authorized; step 3 (push and deploy) needs my explicit yes.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly. If anything in the dossier is unclear, ask before acting, but only after
you've read everything above.
```
