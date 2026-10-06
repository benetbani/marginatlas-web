# HANDOFF: marginatlas, 2026-10-04 (night)

The truth pass is LIVE (website `main` 38f81e8a, proven on production); milestone 1 of his launch interview is BUILT on website
branch `milestone-1` (M1 a3e8af73 to M11 97fa4226), its full chain 210 of 211 on 97fa4226 (the one red a renderer's crash on exit,
green alone), **LIVE since 2026-10-05 at `main` 128c66b6 on his "Push and deploy now"**, proven on production 18 of 19 (the 19th,
the estimate mark's hover label, fixed on branch `m1-followups` 0e0eba92, NOT pushed); milestone 2 (Pro) is not started, its code
map is written. Written 2026-10-04, late night; closed and shipped 2026-10-05 after midnight.

## 0. 2026-10-06 DAY: THE DEEP GOAL (READ THIS FIRST; section 0b below is the masterplan night, sections 1 to 14 the 2026-10-04 state)

**DEPLOYED 2026-10-06, about 3:40pm, on his word ("Deploy it now", his answer to the /go question): `main` 50ecd9e5 live, every
switch still off, proven on production 23 of 23 (scratchpad/_prod_proof_goal.sh: the home page's ask, /download/2026-benchmarks
to /data, "Where to open a restaurant" and "an electrician", no district word on the recommender or New York's cards, "An
ice cream shop in West End", "a typical news publisher" and "a typical gym", /gb, /cities/london, /icon, the sitemap,
/account). The first build, 56dd5b10, failed after `next build` on the postbuild edge-size guard: the Stripe webhook (a Node
function) read as "edge" because @sentry/core holds the word EdgeRuntime, 1,028.4 KB against the 1 MB Edge cap; production
stayed on bd78bb1c; 50ecd9e5 makes the guard read Next's middleware-manifest.json and measure gzipped (three fixtures).
`launch-day` is one commit on the local `main`, rebuilt after the deploy (`git log -2 launch-day`), not pushed.** Before that: production was `main` bd78bb1c (deployed about 5:30am on his "Do this", every switch off). His goal of
the same morning (verbatim in `rules/FOUNDER-VERDICTS.md`, "The deep goal": deeper backend and SaaS functions, planning,
debugging, the architecture checked, obsolete files removed, the structure solidified, unfinished tasks and cleanups, a better
home page, a very high standard) was built on website branch **`goal-2026-10-06`**: 30 commits on
bd78bb1c (6b947592 to 3006edf5, then the records, then the deploy fix 50ecd9e5), under the day's checkup (`docs/checkup/2026-10-06.md`: ten findings ranked, its ledger and
the deltas after the changes) and its plan (`docs/superpowers/plans/2026-10-06-goal/PLAN.md`, batches A to D, its ledger the
full record, a line per commit). Full chain at 9a9c1085: 252 of 252 in 1,122.7 s; D2c after it, its gate green. **Live now; the next push or deploy needs his word again.**

**What changed, a line a batch.**
- A, the SaaS layer: one account and one governing subscription per Stripe customer (webhook and checkout), Sentry and a
  record per event, a dry-run reconcile (`npm run billing:reconcile`); the public data API and the CSV leave out what the
  paywall locks; a rate limit on every API route; the session refreshed by the middleware and /signin saying when a link
  fails; the forms keep no IP or user agent; row level security written into the migration files as live already enforces it.
- B, the home page and its promises: the ask is his ruled "notify me when my city reaches this depth" (a city to choose, its
  own tag), not a PDF that did not exist (its address redirects to /data); the notebook shows each category's newest post,
  text first; the trades answer ends without a hole; /account hides an empty saved list.
- C, the structure: the typecheck reads 3,402 files, not 6,725 (no scratch folders, per-icon imports); routes 121 to 101 (the
  unlisted /dev explorations archived under the tag `archive/dev-2026-10-06`); unreachable files 12 to 1; one carrier for
  the counts; the page-laws ratchet locked.
- D, unfinished rows and faults found on the way: no page sums a district up in a word or two (QUEUE
  city:invented-words-elsewhere closed; gate `no-place-words`); the district overview nothing could reach, deleted; twelve
  trades' honesty line ("Estimates for a typical new" was live) and every "a"/"an" by sound ("Where to open a restaurants"
  was live); the exit-intent pop-up deleted; the v34 coverage gate's ten stubs given rules; two stale records corrected.

**His, at launch.** LAUNCH-SWITCHES row 2 now names four migration files in order (the two of 2026-10-06 added); row 3 holds
custom SMTP and the cross-device sign-in choice. The prepared branch `launch-day` is one commit on the local `main` (the
live 50ecd9e5 plus records only) deleting the private line from `.env.production` and adding nothing (rebuilt after the deploy; the sample
gate passes it as a public site). Rebuild it again if `main` moves before launch day.

**Owner decisions found, none acted on** (the checkup's report names each with its reason): generating the presence manifest
(about 26,000 production lookups, and it would unpublish synthesized pages); the 15 dependencies nothing imports (removing them
rewrites the lockfile, an install); 98 GB of worktrees and the parent repo's missing remote and 12,477 loose objects (his
machine, his backup); a one-process runner for the static gates; /saved, which nothing writes; the hero's rotating-word gaps
(his design); cross-device magic links; what past_due means for Pro; P30.2's details; no email is ever sent, so the depth
notices and the privacy page's "a link in every email" wait on a sender he chooses.

**The day's traps.**
- The chain runs no typecheck, and `next build` does. Run `tsc --noEmit` after every restore or late fix in a batch, not only
  before it: C4 restored a route after its typecheck, and the tree failed `tsc` for eight commits (caught before any push).
- A Python patch through a Bash heredoc: `\b` arrived as a backspace inside a regex, and `\s` with a warning. Use the Edit tool
  for anything with a backslash, or build it with `chr(92)`; scan touched files for control characters before a commit.
- Deleting a page means three hand lists: its segment in `src/lib/routing/top_level_segments.ts`, the junk-URL test's
  "spared" list, and any gate naming the file (the B+C chain's one red).
- The type-ladder and width writers write whatever they count: run the check first, write only after it passes.
- `git stash push -- <paths>` refuses deleted paths: unstage the deletions, then `git stash push --keep-index`.
- The in-memory rate limiter answers a script's sixty-first request with 429: a probe that drives `routeRequest` varies
  `x-real-ip` per request.
- The npm postbuild guard (`scripts/verify_edge_function_sizes.ts`) runs only after `next build`, so only on Vercel; no local
  run sees it. A failed Vercel build's log is readable here: the Vercel CLI is installed globally and logged in, `vercel
  inspect <deployment id> --logs` (the id is in the commit's GitHub status). Node's `fetch` cannot reach production from this
  machine ("fetch failed"), so `deploy:watch` cannot either: watch with curl and a browser user agent.

## 0b. 2026-10-06 MORNING: THE MASTERPLAN NIGHT (sections 1 to 14 below are the 2026-10-04 state)

**Where things stand.** The masterplan of 2026-10-05 (40 steps, `docs/superpowers/plans/2026-10-05-masterplan/`) ran unattended
through the night and is finished: every step DONE except 06 (PARKED: the subscriptions migration is his to run). All of it is
on website branch **`night-2026-10-05`** (its head is the commit "40: the night's proof and the morning pack", on a1117f1d), made from `main` 128c66b6 plus `m1-followups`; branch **`launch-day`** is
that head plus one commit deleting `NEXT_PUBLIC_SITE_PRIVATE=1` from `.env.production`. **DEPLOYED on his word of 2026-10-05, evening ("Push the night branch and deploy, switches off"): `main` is the night branch at 50e00bcb, live on Vercel with every switch off and proven on production (/gb shows the four Pro sections open and "Report a mistake", no lock; / is still the old home page; /pricing sells one plan; /terms and /privacy keep today's text; an address naming nothing answers 404). The first build, e7a5b4fa, failed on `no-cream` (the deleted world map's ratchet entry at zero) and was never promoted; 50e00bcb fixed it. `launch-day` stays local. Nothing posted.** **DEPLOYED AGAIN 2026-10-06, about 1am, on his words ("Take your recommendation on all 19 parked questions", then "Push and deploy when it's done"): `main` at 17a2a32c, every switch still off, the nineteen rulings' builds proven on production with curl (/about, /data and its pack, /corrections, the 58 retired posts' redirects, /gb's household card at 32% and the peers called estimates; / still the old home page; /terms and /pricing without the drafts). The proof caught the pack's README.md unreachable (the site lowercases every path), fixed by 17a2a32c. `launch-day` is f6e6ab5a on 17a2a32c, local. The ledger's "After the night" has the whole record.** **Then, 2026-10-06
morning, under his "idk-push-forward-more-details-later": P36.2b ("Where kitchens score five" beside the duel) and P36.1's ten
blog rewrites on the free data pack, built and verified on the night branch (ddf63ce9, 19db813f; chain 242 of 244, the two reds
fixed and green); DEPLOYED on his word ("Do this") at about 5:30am, `main` bd78bb1c, proven on production
(docs/superpowers/plans/2026-10-06-blog-rewrites/PLAN.md). His next goal, the same morning: deeper backend and SaaS work, the
architecture checked, obsolete files removed, unfinished tasks and cleanups, a better home page; branch `goal-2026-10-06`.** The design repo's commits are on `p4-seam` (STATE.md's step in flight says the same).

**What was built.** Milestone 2 (Pro): one plan at $38 / $238 (`src/lib/monetization/plan.ts`), checkout with no account and no
trial, the Stripe webhook on a pure core, the welcome page, the account's plan and the portal, no pop-up anywhere, the paywall
(`isPaywallOn()` = `NEXT_PUBLIC_PAYWALL` and accounts together) locking every UK chapter's later levels on /gb, the UK city pages
and the London trade pages, an uncached `/pro` mirror for Pro readers, the closed half declared to search engines, the four Pro
sections on /gb (an hour all in, the lease by law, opening from abroad, if it fails), the legal drafts behind the switch, "Report
a mistake" on every spine page. Milestone 3: the home page on the band page behind `NEXT_PUBLIC_HOME_REFORM` (the hero he kept,
a search that lands only on pages that exist, the UK's three answers as doors, the cities and what the atlas holds, Pro once,
the notebook, the newsletter), every harness gate at zero for `home-gb`. Launch: the sample gate holds his ruling 5 (marks stay
off; a public build passes while the honesty stands in source), the launch checklist's faults fixed, LAUNCH-SWITCHES.md in his
order, four launch posts drafted in `E:/atlas/design/loop/build/launch/posts/`.

**Proven.** Full chains: 219 of 225 after step 21, 228 of 231 after step 31, 233 of 235 after step 40 (at 04f16d2b) (every red fixed at its source,
green alone). Sheets: `photos/m2/MILESTONE-2-SHEET.jpeg`, `photos/night-D/PHASE-D-SHEET.jpeg`, `photos/m3/MILESTONE-3-SHEET.jpeg`
(under `E:/atlas/design/loop/build/`). The launch checklist subset a, c to i: 7 of 8, the reason real (P38.1).

**Next actions, in order.** (1) `PARKED.md` is ruled (option (a) on all nineteen, 2026-10-05 evening), each entry's Ruled line
says where it stands; still his: P30.2's details for the terms (name or company, its number, the address, the VAT number),
P36.2b (the ranked list), the author line for the ten blog rewrites (the next build; drafts in
`E:/atlas/design/loop/build/goal-2026-10-02/drafts/blog/`), whether the pack's two held-back files go public, and the peers'
sourcing (the data track's, QUEUE data:uk-peers-sourced). (2) Launch day by `LAUNCH-SWITCHES.md`, then `launch-day`. (3) Done:
the night branch's builds ran on Vercel (P18.1: 50e00bcb, 5b2a2401, 17a2a32c).

**The night's traps (each cost time once).**
- `scripts/counts.ts` counts TRACKED files: `git add` a new file before `counts --write`, or `counts-fresh` reds.
- The Write tool turns `\u2014`-style escapes into the characters; Python patches build an escape with `chr(92)`. A Python
  heredoc in Git Bash wrote "\\r\\n" in a regex as CR CR LF: write scripts with the Write tool and build control characters with
  `chr()`.
- Zones stack their cells with `items-start`; a level of doors (kept boxes) ends ragged unless the zone is `even` (step 37), and
  then each card's rows go to its foot (`mt-auto`) so no blank pools under them (CARD FOOT BLANK is 48px).
- TAP SIZE exempts text fields, so the newsletter's email field ran 23px tall on phones (a `flex-1` basis of zero in a column)
  and only the photograph caught it. Look at every photograph.
- UK Business Forums answers scripts with a browser check and Reddit refuses scripts: their rules were not read first-hand, and
  no check was got round; the posts' README says so.
- Free memory fell to 26 MB during a browser gate: wait and check again, never close his apps.
- The launch check's item (i) reads production's home page; `--home-file=<render>` reads a local render in a subset.

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
