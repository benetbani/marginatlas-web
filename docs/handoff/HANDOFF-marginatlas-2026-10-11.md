# HANDOFF: marginatlas.com, the home reform in its last polish loop (start of a new Claude Code account)

Status, 2026-10-11: production is `main` ae6d8048 (Phase 1 index safety, live since 2026-10-10). The home introduction plan (12 tasks)
and the home reform plan (Tasks 1 to 8 done, Task 9's critique loop in progress) are built on website branch `home-introduction`, 76
commits ahead of main, a clean fast-forward, NOTHING pushed. Critique pass 3 scored 85/100 with no P0. Its fix round D1 committed five
P1 items and the publisher rename, finished and tested three P2 items without committing them (7 files), then died on the old account's
weekly limit before its report, its typecheck and the remaining P2 items.

> **Update, later on 2026-10-11 (the new account's first session).** Sections 1 to 8 describe the start of the day; the ledger
> `.superpowers/sdd/progress.md` (lines from "NEW ACCOUNT 2026-10-11" on) records every commit and ruling since. Done: Step 1
> (77b4ee8f); round D1 closed (its report reconstructed from the evidence, reviewed: approved); round D2 (10 commits, reviewed:
> approved); P1.6 on a real `next build` and `next start` (`.superpowers/sdd/hr-p16-report.md`); critique pass 4 at 93/100 with no P0
> and no P1, which ends the loop (`home-critique-4.md`); rounds F1 and F2 (12 commits each) fixed every finding of the final
> whole-branch review's parts 1 and 2, both task reviews and pass 4's seven P2s. HEAD b01d7fcb, 111 commits over main, nothing pushed.
> Owed before his word: the whole chain with the build on the final head, the final review's part 3, the records (QUEUE N, PAGES,
> STATE). Queued, not for this deploy: M6 of the final review, /gb chapter 04's lone state from about 14 November 2026 (QUEUE N,
> `gb:ch04-lone-state`), and the dynamic routes' 404 skeleton (`site:dynamic-404-skeleton`). Next work, planned and not built: `E:/atlas/docs/superpowers/plans/2026-10-11-uk-trade-pages-copy-half.md` and
> `2026-10-11-uk-cost-to-open-and-place-slugs.md` (launch blockers before the paywall).

> **How to use this document.** Read section 0, then top to bottom once. Then read the files in section 7 in the given order. Do not
> start work until you can answer the checklist in section 13. The paste-in prompt is section 14. Writing this file is the only change
> the handoff made to either repository; it is uncommitted.

---

## 0. The account switch: what carries over and what does not

The owner (Benet Bani) moved this work to a new Claude Code account (his professional email; the Claude for Startups programme: five
seats and $1,000 of API credits, as he described it). Same Windows machine, same folders, same git repositories. What that means:

| Thing | Carries over? | Why / where |
|---|---|---|
| Both repositories, every branch, every uncommitted edit | Yes | `E:\atlas\website` (the site) and `E:\atlas` (design and data). Git does not know about Claude accounts |
| The auto-memory | Very likely yes | `C:\Users\benet\.claude` is a Windows junction to `E:\Others\.claude`; memory lives at `C:\Users\benet\.claude\projects\E--atlas\memory\` (index `MEMORY.md`). If the new account's sessions read another home, section 9 repeats every binding rule |
| Skills and plugins (superpowers, handoff-max, checkup) | Yes, if the same ~/.claude is used | `C:\Users\benet\.claude\skills\`, `...\plugins\` |
| The subagent ledger, briefs, reports | Yes | `E:\atlas\website\.superpowers\sdd\` (git-ignored, on disk; `git clean -fdx` would destroy it: never run it) |
| Scratch evidence and photographs | Yes | `E:\atlas\website\scratchpad\home-reform\` (never committed) |
| Old conversations in the app's sidebar | No | The desktop app keeps a session registry per account. The transcripts still exist on disk; the last one is `C:\Users\benet\.claude\projects\E--atlas\10488a2b-aee6-4059-af35-e732f5e3a505.jsonl` (very large: read only targeted pieces, never the whole) |
| claude.ai connectors (Linear, Drive and so on) | No | Per account: each needs his authorization again (claude.ai connector settings or `/mcp`). Nothing in the plan needs one |
| GitHub, Vercel, Supabase credentials | Yes, untouched | Machine-level (git credential manager, gh). You never use them without his word anyway |
| Usage limits | Fresh | The old account's last implementer died on "You've hit your weekly limit, resets Oct 15". The new account starts clean |

---

## 1. TL;DR

Margin Atlas (marginatlas.com, Next.js 15 on Vercel, Supabase) answers "how much does a <trade> make in <city>?" from official records
and the joins between them. On 2026-10-10 the owner asked for a world-class editorial reform of the home page: critique until polished,
add authenticity and variation, one section on a terracotta ground with the site's own stats, a publishing-ready menu, ship readiness.
That reform is built on `home-introduction`, on top of the earlier "home as an introduction" plan, all unpushed. The plan's finish line
is a critique pass with no P0 and no P1, the whole gate chain green, a full typecheck, a final whole-branch review, then his word. The
critique loop stands at pass 3 (51, then 75, then 85 of 100). Fix round D1 committed P1.1 to P1.5 and the publisher rename ("Margin
Atlas"), left P2.1, P2.3 and P2.4 done, tested RED to GREEN and gated but **uncommitted**, and never reached P2.2, P2.5 to P2.8, P2.10,
its typecheck or its report. **The committed next step:** commit the verified P2 draft, finish the remaining P2 items, typecheck, record
D1 in the ledger, then P1.6 (photograph the page as it actually builds), a fresh critique pass 4, plan Task 10 (chain, records, final
review), then ask him to deploy. Nothing is pushed, merged or deployed without his explicit word in chat.

---

## 2. Mission & success criteria

**Enduring goal (his, many times):** Margin Atlas as the unmatched, honest source for small-business economics. No visibly wrong
number; every figure from a builder with its provenance; the edge is official local inputs, the joins between registers, and the
archive (time is the moat nobody can copy). Money later through Pro ($48 a month or $456 a year, shown as "$38 a month, billed yearly"),
switched off until launch day.

**Current tactic: ship the reformed home.** His words (2026-10-10, /goal), typos cleaned: "Reform the homepage with an additional
critique in mind, take the role of a world class editorial website designer and project leader and critique the homepage until you make
it so polished and world class. Add authenticity, add variation, add 1 section in terracotta background to signify some stats for the
site. Make it full, make it complete and perfect. Exquisite design too. Make the menu of the hero section more production ready,
publishing ready. Study details on how to make the page ready to ship. Continue with other unfinished changes meanwhile."

**Done means** (spec section 6, `E:\atlas\docs\superpowers\specs\2026-10-10-home-reform-design.md`):
- the browser gates at 375, 768, 1080, 1280 and 1440 on the home, /gb and /new-businesses with 0 reds;
- the first screen at 375x667 holds the h1, the picker and the definition;
- the whole chain green (`Ran: N / N`, N = CLAUDE.md's generated gate count, 280 today) and the full typecheck clean;
- a critique pass by a fresh reviewer from new photographs finds no P0 and no P1 (the loop repeats until it does);
- every task reviewed; a final whole-branch review over BOTH plans (ae6d8048..home-introduction);
- nothing pushed until his word.

**Rules the reform bends, each gated so it cannot spread** (spec section 5): one terracotta zone on the home (ZONE TONES accepts it on
home-gb only); a second full-width zone (the band, named in `tests/trust/home_shape.test.ts` beside the hero); four evidence counts on
the home (named in `tests/home/site_counts.test.ts`; no country, city or trade-list count, never an allocated total).

**Out of scope** (spec section 7): pounds on UK pages (his open decision of 2026-10-04); the city and trade page architecture (Phase 2);
new data; the paywall's half rule; Pro's contents and price.

---

## 3. Current state: ground truth

### 3a. Repositories and production

| Component | State | Notes |
|---|---|---|
| Production | `origin/main` = `main` = ae6d8048, LIVE | Phase 1 index safety, deployed 2026-10-10 about 01:40 on his "Deploy now (Recommended)"; chain 270/270 then; production probed |
| `launch-day` branch | 92e20da8 = main + 1 commit (the switches on) | Rebuild after every deploy: `node scripts/launch_branch.mjs` |
| **`home-introduction`** (the working branch, checked out in `E:\atlas\website`) | HEAD acf51a17, 76 commits over main, fast-forward possible | b6ca7ca0..51cc3b8b is the home introduction plan (24 commits); 51cc3b8b..acf51a17 is the reform (52 commits). Map in 3b |
| Whole gate chain | last run 272/272 GATE PASS at 51cc3b8b (2026-10-10 07:28, `scratchpad/deploy/chain.txt`) | NOT run since; the reform added 8 gates (280 now). Task 10 owes the run |
| Full typecheck | last recorded clean full tsc: round C2 (8288c3bf) | None recorded since (the three P0.3 photo fixes, D1). **D1 ran no typecheck.** Owed |
| Reviews | Reform Tasks 1 to 8 each reviewed and approved (with fix rounds and re-reviews); the closing cleanups and the critique-2 rounds were implementer-verified only | D1 not reviewed. The final whole-branch review (deferred on purpose to the end of the reform, covering both plans) catches the rest |
| Ledger | `.superpowers/sdd/progress.md`, 735 lines | Its last line is his publisher ruling. **D1's six commits are not in it**: append them |
| Design repo `E:\atlas` | branch `p4-seam`, HEAD 96b5dad (the reform plan) | Uncommitted: `design/loop/build/PAGES.md` (census output; Task 10 commits it), `docs/superpowers/plans/2026-10-10-home-reform/_amend.md` and `task-09.md` (amendments 8 and 9, written during execution; commit them with the records), `.claude/settings.local.json` (not ours: leave it). **No git remote: never backed up** |
| Old side branches | `proto-key-guard`, `dotted-404`, `junk-url-real-middleware` (worktrees under `E:\atlas\.claude\worktrees\`), `icon-404` | Their fixes reached main by replay through `whats-left` (checked: e3aad643 and 12fa8f2f are in main). Obsolete; deleting them is optional and his call |
| Scheduled tasks | none in the app | The UK archive's monthly run (`registers/uk/archive_monthly.py`, the 12th at 22:30 on this machine) is NOT scheduled; it needs his yes (`E:\atlas\archive\uk\README.md`, "The one scheduled command") |

### 3b. The branch's commit map (oldest first)

| Range / commits | What | Reviewed |
|---|---|---|
| b6ca7ca0..87a80339, fix round A, ef0326e3..0950ff64 (fix round B), 6789e19e, 0efdfdf3, 1ee06e8e, 51cc3b8b | Home introduction plan Tasks 1 to 12: archive slice and gate, the proofs' builders, shared forms, /gb chapter 04, /new-businesses (noindex), the worked example's builder and drawing, the proofs, the hero, the home wired as an introduction, ratchets locked | Yes, every task approved |
| f18f74c5 + d4f8c192, ea6c7ab7 | Reform Task 1: the masthead publishing ready, `src/lib/nav.ts` NAV, skip link, one text red | Yes |
| 4658e77e + 517f70c3, 1546bb6a, aff5d8ef, b9d48be9, 8a6ab0c8, b6b863d4 | Task 2: the hero (his h1 on set lines, HeroWords stopping after one lap) and the picker (keyboard fixed) | Yes, after two re-reviews |
| dae93c23 | Task 3: the worked example on one anatomy | Yes |
| fd85ad67 | Task 4: the proofs (joins ring, archive months, tax bar) | Yes |
| 49cde4c6, e5fecb3a | Task 5: the terracotta band "Read from the record" (`src/lib/home/site_counts.ts`) | Yes |
| 1c796d00 | Task 6: the foot (grey city photographs, thumbnails) | Yes |
| 61c91b7d + 508ebae1, c8200bab, d6e5143a | Task 7: head, icons (numbered `/icon`, `/icon1`, `/icon2`), client weight | Yes |
| 927c8ab6 + 5c9d4341, 42785e05, 7793783a, 2b52de21 | Task 8: trust and launch guards; privacy words made true; launch:check item (j) | Yes |
| 8a6699a1, b40715dc, 6384e192, 2f09aeba; a1dafa42, 7ce4740c | Closing cleanups 1 and 2 (`hr-cleanup.md` items 1 to 24) | Implementer-verified |
| a1197014 | Task 9 Steps 1 to 7: the wordmark's air with both switches on | |
| d4438623, b796e313, a73a2324, 7fe7c8d2, 47ac1b81 | Critique 2, round C1 | |
| f740d356, 9bb06a1e, 8b864817, 2821fe89, 219b9fb3, 4a525ba5, 8288c3bf | Critique 2, round C2 | |
| 25785fb3, b9f0f84e, f9a83455 | Critique 2 P0.3, found by the first photographs inside the chrome | |
| 700af1b3, 3e89b132, 659b1ebf, c794c606, 8dba0295 | **Critique 3, round D1: P1.1 to P1.5** | Not yet |
| acf51a17 | **D1: the publisher is Margin Atlas** (footer copyright, Dataset structured data) | Not yet |

### 3c. Critique pass 3 (`.superpowers/sdd/home-critique-3.md`), item by item

| Item | What | State | Evidence (in `scratchpad/home-reform/`) |
|---|---|---|---|
| P1.1 | 16px white strip between the bar and the grey hero | DONE 700af1b3 | d1-p11-* (strip gone at 375 to 1280; the country page checked too) |
| P1.2 | Search hidden on the home's first screen, a hole at the bar's right | DONE 3e89b132 | d1-p12-*; the sheet drops its own Search row |
| P1.3 | Two left edges on a phone (24 for the chrome, 16 for the page) | DONE 659b1ebf | d1-p13-* (one gutter of 16, `GUTTER` beside `NAV`; non-spine pages photographed at 375); model-laws ratchet held at baseline |
| P1.4 | The tablet menu, a phone's list in a full-width slab | DONE c794c606 | d1-p14-after.txt: a 360px panel under the button at 768 and 1024, last row inside the screen; full-width sheet under 768 |
| P1.5 | Tax card's key 50px under its bar, two of three parts named | DONE 8dba0295 | d1-p15-after.txt: bar to key 19 to 20px from 1024 to 1440, three rows. **At 768 the card's left half keeps 77px under its bar** (under the 120 floor, over the critic's 48 target): watch in pass 4 |
| P1.6 | The page as it ships has never been seen (every photograph is a static render) | OPEN | Section 8, Step 4 |
| P2.1 | One gutter for a level of cards (`cards` on Zone: 24 from 768, 32 from 1024) | **DONE, UNCOMMITTED** | d1-p2a-after.txt: gaps 32 and 32 at 1080 and 1024, 24 at 768, the joins' title on one line; at 768 the tax card's left blank falls from 77 to 51 |
| P2.2 | The cities' figures named eight rows below them ("Typical pay" column head from 768) | OPEN | |
| P2.3 | The archive's line: "Notices a month, {first} to {last}." | **DONE, UNCOMMITTED** | d1-p2a-red/green-archive.txt |
| P2.4 | The joins' working row: "Different names" (31,926 notices against 31,376 names) | **DONE, UNCOMMITTED** | d1-p2a-red/green-how_made.txt |
| P2.5 | The foot lines' ground (one band edge to edge in the tint) | OPEN | Meets P1.1's selector and P1.6 (the production frame's white) |
| P2.6 | The 404: doors as rows under 640, each with its arrow; reshoot | OPEN | d1-p13-notfound-375.jpeg exists (the gutter change only) |
| P2.7 | The phone's city cells: "All UK cities" at 20 semibold; no arrows on photo cells under 768 | OPEN | |
| P2.8 | /gb chapter 04: label Start "100%"; /new-businesses: `whitespace-nowrap` on FiguresTable's value heads | OPEN | |
| P2.9 | The photographs folder | DONE (stale sets in `shots-stale`, `shots-stale2`, `shots-stale3`) | |
| P2.10 | Launch day's sheet: Pricing drawn as the bar's ink pill | OPEN | |
| Q1 (privacy read), Q2 (publisher name) | Owner questions | ANSWERED by his ruling of 2026-10-10 | The privacy words stand; the publisher is "Margin Atlas" (done) |

### 3d. The uncommitted draft, exactly

`git -C E:/atlas/website diff --stat` lists 7 files, 32 insertions, 8 deletions:
- `src/components/spine/zones.tsx`: `SIDE_MD_CARDS` and `SIDE_LG_CARDS`, and a `cards` prop on `Zone` (P2.1).
- `src/components/spine/home/home-view.tsx`: the zones array's type gains `cards?: boolean`; the proofs zone passes `cards: true`; the
  `<Zone>` gets `cards={z.cards}` (P2.1).
- `src/lib/spine/copy.ts`: `COPY.home.proofs.joins.names` from "Names in notices" to "Different names" (P2.4);
  `COPY.home.proofs.archive.words` to "Notices a month, {first} to {last}." (P2.3).
- `tests/home/home_answers.test.ts` (the gutter check), `tests/home/archive.test.ts` (the line), `tests/home/how_made.test.ts` (the
  label), `tests/trust/home_shape.test.ts` (the proofs' zone asks for cards).

The evidence the agent left (2026-10-10, 22:48 to 22:49, `scratchpad/home-reform/`): `d1-p2a-red-*.txt` (each of the four tests red
on exactly its new check), `d1-p2a-green-*.txt` (all four pass), `d1-p2a-holes*.txt`, `-laws*`, `-copy`, `-read`, `-model` (home-gb, 0
reds at every width run), `d1-p2a-after.txt` (the gutter measures), `d1-p2a-tax.txt`. Missing: a named-gate run for it, a typecheck, a
commit. Also: `git status` lists `src/components/HeaderSearch.tsx` as modified with an EMPTY content diff (line endings or a stale index
stat only). It is not part of the draft. Never commit a line-ending-only change.

---

## 4. How we got here: the decision trail

1. **Phase 1 index safety** (architecture adopted by him 2026-10-09; spec `E:\atlas\docs\superpowers\specs\2026-10-09-page-architecture-design.md`).
   Research measured 34,776 trade-in-city URLs, invented UK places indexed, hub pages 92 to 94% alike and zero searches for city-by-trade
   pairs. So: invented place words 404 at the edge, copied families noindex and out of the sitemaps, aliases canonical, sitemaps by
   family (0, 3, 6, 7, 8 listed; 1, 2, 4, 5 empty), robots from one crawler list, IndexNow by hand only. **Why:** Google's 2026 policy
   punishes combinatorial pages; demand sits in trade questions. Deployed ae6d8048.
2. **The URL rule, restated by him 2026-10-09:** "never change the address of a page that keeps its content; retire an address only by a
   permanent redirect to the page that now holds its content, or by a 404 when nothing does". No real address is retired before his
   Search Console inventory exists (`E:\atlas\seo\search-console\`, not exported yet). This is why /icon could not be redirected.
3. **The home as an introduction** (spec `2026-10-09-home-introduction-design.md`, plan `E:\atlas\docs\superpowers\plans\2026-10-09-home-introduction.md`).
   The home explains the concept with one worked case (a London restaurant in four steps), three proofs of the method (the joins, the
   archive, tax worked out from the law) and the foot. Sections that did not introduce moved to /gb chapter 04 and the new noindex
   /new-businesses. 12 tasks, all approved. Its final whole-branch review was deliberately deferred to the end of the reform (same branch,
   nothing deployed between).
4. **His reform request (2026-10-10).** An art director's critique (pass 1, 51/100) and a ship audit became the spec and its appendices
   (`specs/2026-10-10-home-reform/critique.md`, `ship-audit.md`). Decisions taken for him under his "stop questions, decide and build"
   ruling (spec section 2):
   - **One text red:** `--terra-text` re-pointed to `#991600` site-wide (his h1 words already used it). `#c2410c`, an orange he had
     rejected, left the site. `#fb8469` (`--terra`) stays the fill for drawn answers and the band; `#e62200` is the wordmark's alone.
     Why: two reds read as an accident; one line reverts it.
   - **The home's city photographs grey**, so the band and the cities never read as one salmon wall; later 72x48 thumbnails from 768.
   - **His h1 on set lines**: "How much does a restaurant" / "make in London?" from 640px, three lines below; "?" inside the city slot;
     HeroWords stops after one lap and on interaction (WCAG 2.2.2); motion opacity only (gate hero-still, after his 2026-10-07 complaint
     that the sliding words felt unnatural).
   - **Pricing hidden in the bar, the sheet and the footer while the paywall is off** (ProBand's rule: nothing about Pro prints with the
     switch off); /pricing stays reachable and in the sitemap.
   - **One nav constant**, `src/lib/nav.ts` NAV: Countries, Cities, Trades, Compare, Tools, Extremes, Blog. "Trades" is a label only;
     the address `/industries` is unchanged (URL rule).
   - **The band "Read from the record"**: four counts, each `counted` and recomputed by its test: **32 official datasets** (an explicit
     `official` flag on each UK_SOURCES publisher; 4 of the 36 sources are not official bodies), **68 legal rates and limits**
     (UK_2026_27's finite values), **111 of 138 London trades with sales** (londonPagesRead), **117 of 138 trades with failure rates**.
     The denominators show on purpose: they admit where the site is thin (authenticity). Ink on `--terra` only (7.06:1). The loud-seats
     ledger learned a FIELD state (a seat lit by its ground): pays LIT, record FIELD, foot NO HONEST CANDIDATE.
   - **Icons as numbered files**, so the published `/icon` keeps serving.
   - **Privacy:** server Sentry reports carried cookies (the session cookie holds the email from launch day). The code now drops
     cookies, `x-vercel-ip-*`, `x-vercel-id` and bodies, and the privacy page says exactly that.
5. **Execution method:** subagent-driven development. One implementer at a time in the one working tree (Sonnet), a reviewer per task
   (Sonnet, reading a clean `git archive` export), fix rounds for Important findings, re-reviews, Minor findings to `hr-cleanup.md`. The
   reviews caught real faults: the privacy leak, /icon retired, two keyboard bugs in the picker, scroll offsets counted twice, the
   taxonomy shipped to every page through a barrel, a newsletter button off a phone's screen.
6. **The critique loop (Task 9 Step 9):** each pass by a fresh critic from photographs, in the appendix's format (verdict, ten scores,
   P0, P1, P2, keep list, owner questions). Pass 2 (75): decided Q1, the proof cards KEEP their icon chips (his ruling of 2026-09-19;
   only the archive's copies-row chip went); Q2, a drawing's focal mark prints its value small (applied; MODEL.md not edited; tell him
   in the final report). Pass 3 (85): the body is finished work; what remains sits where the page meets the chrome. Its section 4 lists
   what is world class and must not be touched.
7. **His rulings this weekend:** "stop questioning ... push forward" (2026-10-07); "Whatever push forward, publisher name is Margin
   Atlas, just go forward with it. Also continue with building, changing, fixes, everything" (2026-10-10). So: decide and build; the
   privacy words stand without his line-by-line read; pushes, deploys, switches and downloads still need his word.
8. **His Claude for Startups question (2026-10-10), the advice given:** keep the stack (Next.js, Vercel, Supabase, Claude Code). The
   slowness comes from the 8 GB machine, one working tree serialising every implementer, and very long conversations, not from the
   tools. Recommended: cloud and parallel sessions once CI exists; Linear as the work queue (its connector needs his authorization);
   Firecrawl for the data pipeline (yes); the Applied AI office hours (yes); the API credits for Batch API data extraction and Managed
   Agents, not coding (the plan covers coding); skip Augment Code, Runable, Lovable, Moda, ClickHouse and the like (no fit). Found while
   answering: CI is blocked today because `scripts/lib/local_only.mjs:27` hard-codes `DESIGN_REPO = "E:/atlas/design"` (the browser
   gates skip off this machine), and the design repo holds 11.6 GB of history (806 commits, 47 blobs over 50 MB) with no remote.

---

## 5. Hard-won truths & the mental model

**The gate chain.** `scripts/prebuild_all.ts`, 280 gates (`GATES`; the count is generated into CLAUDE.md by `scripts/counts.ts`). It
runs on Vercel inside `npm run build` (vercel.json pins it), but there the browser gates skip (no browser), so only a local run measures
the page laws, the copy laws and the loud seats. Locally, `node scripts/verify_deploy.mjs` runs it serially into
`scratchpad/deploy/chain.txt` (`--build` adds `next build` and the postbuild guard). A subset:
`node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=a,b,c`. Known deferrals, not failures:
`cell-lattice:3`, `dispositions:4`.

**Memory on this 8 GB machine.** Full tsc only at 1150 MB free or more (else the scoped config
`scratchpad/home-reform/tsconfig.scoped.json`); the whole chain at 1300 MB or more with no browser open; renders and browser gates one at
a time. The RAM goes to his Edge and the Claude app: never close his applications; wait and read the memory line again. `tsc` exiting
134 is starvation, not a type error.

**The harness.** Spine pages render to static HTML (`bash scratchpad/reform/render_some.sh "home gb"`; also "country GB", "openings
world", "cell gb london restaurants"); the browser gates read those renders. The harness renders a body WITHOUT SiteChrome: chrome
photographs use `scratchpad/home-reform/chrome-render.tsx` (scratch, never committed; its header has the run command). The harness preload
stubs `usePathname` to "/gb". Every photograph so far is static markup with one state forced and fonts from a Google Fonts link: none is
the built, hydrated page (hence P1.6).

**Page laws (his, gated).** Three loud moments a page at most, two quiet cards between loud ones; two-up levels; the hero and the band
the only full-width zones on the home; equal heights on even levels; **no blank in a card** (page-holes floor 120px; critics target under
48); one 30 a section card and the page's one 40 (the worked example's step 3, $740K); labels never sentences.

**Copy rules (his, gated).** One heading of four words at most and one supporting line a section; twelve words a line; no semicolon;
never "modelled", "withheld", "on file"; no em-dash; no source-agency names in page copy (the About page's sources list is the one
place); sentence case; plain words, no disclaimers.

**Figures.** Every figure from its builder, never typed, stamped `data-src` and `data-kind` (`src/lib/spine/provenance.ts`); counts are
evidence, never allocated slots (`verify_no_slot_counting`); no country, city or trade-list count on the home.

**Switches.** Auth and the paywall are OFF until launch day (`src/lib/feature_flags.ts`; the launch-day branch flips them); nothing about
sign-in or Pro draws while off. `launch:check` must see Vercel's switches (unknown is never "off").

**Counts and census.** `scripts/counts.ts` reads the git INDEX: stage a new file before `counts --write`, or `counts-fresh` reds.
`scripts/harness/census.ts --write` also rewrites the design repo's PAGES.md (left uncommitted until the records).

**Time-pinned gates.** The band's month comes from the register export (`REGISTER_BUILT`), pinned by `site_counts.test.ts` TODAY: a new
month's export reds `site-counts` until TODAY moves (by design: a person looks). The archive card draws the joins' fixed window from
`data/home/method.json`, so proofs 1 and 2 always agree; re-exports run the failures table first, then method, then archive
(`python -P scripts/data/home/export_home.py ...`), never by hand.

**Files edited at byte level only:** `src/components/spine/country/country-view.tsx` and `city-view.tsx` (git `-text`, stray line
endings). Keep every file's line endings (`git ls-files --eol`); the Write tool turns CRLF into LF.

**Standing baselines that are not faults:** model laws at baseline on cell-gb-london-restaurants 2 (#team, #mix), city-london 3,
industry-restaurants 2, all older than the branch.

---

## 6. Dead ends: do NOT retry

| Tried or tempting | Why not |
|---|---|
| Redirecting `/icon` (or any published address) | Phase 1's dispositions guard and the URL rule: no redirect before the Search Console inventory. Numbered icon files keep it serving |
| `generateImageMetadata` for the icons | Moved the icon to `/icon/<id>`, breaking the published `/icon` |
| Counting "36 official datasets" | 4 publishers are not official bodies; the band says 32 (an `official` flag). The spec's decision 7 still says 36: Task 10 corrects it |
| Hiding Search on the home's first screen until the picker scrolls away | Traded a jump for a hole at the bar's right edge (P1.2); Search now shows from the first paint |
| A full-width tablet sheet with a scrim | His refusal of modals (2026-09-22): the tablet menu is a dropdown panel, no scrim, no dim |
| A plain lazy regex for JSX comments in home_shape | Over-matched across two comments; the tempered form in the test is the fix. Never write `*/` inside a comment in that file |
| Two implementers at once in the one tree; reviewers reading the live tree | Index locks and moving HEADs; reviewers use clean `git archive` exports |
| Pushing the design repo to GitHub as it is | 11.6 GB of history, 47 blobs over 50 MB (GitHub refuses files over 100 MB). A fresh light repo is the way |
| A GitHub Actions chain "with two secrets" today | The browser gates would skip there (the hard-coded design path), so CI would prove less than the local run |
| Spending the $1,000 API credits on coding | The plan covers coding; credits suit batch data extraction or Managed Agents |
| `npx playwright install` or any download to fix a browser | A download needs his word; `scripts/lib/pw_edge_fallback.cjs` runs Playwright on the installed Edge |
| Working around the TLS interception that blocks Google Fonts and Supabase on this machine | Never. The dev server falls back; photographs load the faces by link; say so |
| Retrying a subagent call that Avast WebShield blocked ("Do not retry") | Not retried; the controller did that review itself |
| Running a critique from old photographs | P2.9: stale sets moved to `shots-stale*`; a critic reads only current frames |

---

## 7. Critical files & artifacts (reading order)

**Tier 1, read before acting (in this order):**

| # | Path | Role |
|---|---|---|
| 1 | `E:\atlas\website\CLAUDE.md` | Entry point, hard constraints, commands. Its "Latest handoff" line still names 2026-10-04: THIS dossier is newer |
| 2 | `C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md`, then `feedback_2026-10-10_publisher_push_forward.md`, `project_2026-10-10_home_critique_reform.md`, `feedback_2026-10-07_stop_questions_countries_home.md`, `dev_verification_gotchas.md` | His rulings and this machine's traps |
| 3 | `E:\atlas\website\.superpowers\sdd\progress.md`, lines 695 to 735 | The reform's ledger, every commit and verdict (D1 missing) |
| 4 | `E:\atlas\docs\superpowers\specs\2026-10-10-home-reform-design.md` (sections 2, 5, 6, 7) | The decisions that govern |
| 5 | `E:\atlas\website\.superpowers\sdd\home-critique-3.md` | The open items, each with its fix and its "done when" |
| 6 | `E:\atlas\website\.superpowers\sdd\hr-crit3-d1-brief.md` | The round that stopped |
| 7 | `E:\atlas\website\.superpowers\sdd\hr-implementer-rules.md`, `hr-reviewer-rules.md` | The rules every subagent gets (verbatim constraints, commands, report form) |
| 8 | `git -C E:/atlas/website status --short --untracked-files=no` and `git -C E:/atlas/website diff` | The draft |

**Tier 2, read when the step comes:**

| Path | When |
|---|---|
| `E:\atlas\docs\superpowers\plans\2026-10-10-home-reform\task-09.md` (Steps 1 to 9) and `task-10.md` | The loop's steps; the chain, the records, the final review |
| `E:\atlas\docs\superpowers\plans\2026-10-10-home-reform\_amend.md` | Amendments 1 to 9 (9: the 667px first screen) |
| `E:\atlas\docs\superpowers\specs\2026-10-10-home-reform\critique.md`, `ship-audit.md` | A critic's inputs |
| `E:\atlas\website\.superpowers\sdd\home-critique-2.md`, `home-critique.md` | Earlier passes, the format |
| `E:\atlas\website\.superpowers\sdd\hr-crit2-c1-brief.md`, `hr-crit2-c2-brief.md` and their reports | How earlier fix rounds were briefed and reported |
| `E:\atlas\website\.superpowers\sdd\hr-cleanup.md` (item 25), `hi-minors.md`, `p1-minors.md` | The final review's minors lists |
| `E:\atlas\docs\superpowers\specs\2026-10-09-home-introduction-design.md`, `plans\2026-10-09-home-introduction.md` | The final review covers both plans |
| `E:\atlas\design\loop\build\STATE.md` (line 9, step-in-flight), `QUEUE.md` (last section M) | Records |
| `E:\atlas\website\docs\superpowers\plans\2026-10-05-masterplan\LAUNCH-SWITCHES.md` | Launch day and post-deploy rows (row 14: sitemaps in Search Console) |
| `E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-10-04.md` | The prior handoff (milestones, the Pro code map) |

**Code you will touch:** `src/components/SiteChrome.tsx`, `MobileNav.tsx`, `HeaderSearch.tsx`, `src/lib/nav.ts`, `src/app/globals.css`
(THE ZONES), `src/components/spine/zones.tsx`, `src/components/spine/home/home-view.tsx`, `HomeProofs.tsx`, `src/lib/home/proofs.ts`,
`src/lib/spine/copy.ts`, `src/app/not-found.tsx`, the foot's `CityRows` and `CityParts`, `FiguresTable`, the API routes under
`src/app/api/contact` and `src/app/api/correction` (singular), and the tests under `tests/home/`, `tests/trust/`, `tests/chrome/masthead.test.ts`.

---

## 8. The path forward (in order)

### Step 0. Orient (read-only)
Read tier 1, answer section 13 in chat, flag any contradiction (git and the files are ground truth). Check memory:
`node -e "const f=Math.round(require('os').freemem()/1048576);console.log(f+' MB free')"`.

### Step 1. Commit the verified P2 draft (P2.1, P2.3, P2.4)
- Read `git diff`; confirm it is exactly 3d. Run `git update-index --refresh`. If `HeaderSearch.tsx` still shows as modified, and both
  `git diff -- src/components/HeaderSearch.tsx` and `git diff --ignore-cr-at-eol -- src/components/HeaderSearch.tsx` print nothing,
  `git checkout -- src/components/HeaderSearch.tsx` is safe (it only restores the committed line endings).
- Re-run, each into a file under `scratchpad/home-reform/` and read there: the four tests
  (`node node_modules/tsx/dist/cli.mjs tests/home/archive.test.ts`, then `home_answers`, `how_made`, `tests/trust/home_shape.test.ts`);
  a fresh render of the home; the named gates in one `--only` run (`home-shape,home-answers,home-archive,home-forms,interact,provenance,loud-seats,no-em-dashes,model-laws-copy,gathered-emptiness`);
  the home's browser gates one at a time.
- Typecheck (full at 1150 MB, else scoped). Commit only the 7 files of 3d (never HeaderSearch):
  `home-critique-3 P2.1, P2.3, P2.4: one gutter for a level of cards; the archive's line and the joins' row in plain words (critique pass 3, fix round D1, plan 2026-10-10, the home reformed to ship)`,
  a blank line, then the trailer.

### Step 2. The remaining P2 items
One implementer (Sonnet) with a brief `.superpowers/sdd/hr-crit3-d2-brief.md` modelled on the D1 brief, the rules file, and items P2.2,
P2.5, P2.6, P2.7, P2.8 and P2.10 from `home-critique-3.md` (each names its file, its fix and its "done when"). Test first where a test
can see it; commits named `home-critique-3 P2.x: ...`; photographs `d2-*` into `scratchpad/home-reform/shots/`; report into
`hr-crit3-d2-report.md`. Notes: P2.5 touches the same zone bleed as P1.1, so check the strip stays gone; P2.6 reshoots the 404 at 375 and
1280; P2.10 needs the chrome render with both switches on. Small items may be done in the main session; the rule stays one change, one
verification.

### Step 3. Close round D1 properly
- A full typecheck over the branch (D1 never ran one).
- Write `hr-crit3-d1-report.md` from the evidence files (the agent never did) and append the ledger lines, for example
  `REFORM crit3 D1: 700af1b3..acf51a17 (P1.1-P1.5, publisher) + <the P2 commit>; the agent died on the weekly limit before its report`.
- Recommended: one task review (Sonnet, `hr-reviewer-rules.md`, a clean export) of `f9a83455..HEAD`, because P1.1 and P1.3 change every
  spine page and P1.3 moves every non-spine page's phone gutter from 24 to 16. Build the diff file with the superpowers skill's
  `scripts/review-package BASE HEAD` (in
  `C:\Users\benet\.claude\plugins\cache\claude-plugins-official\superpowers\6.1.1\skills\subagent-driven-development\`).

### Step 4. P1.6: see the page as it ships
The stated reason for a local build (his rule: a build needs a reason) is exactly this item. At 1300 MB free with no browser open:
`node scripts/verify_deploy.mjs --build > scratchpad/home-reform/build-p16.txt 2>&1; echo "exit $?" >> scratchpad/home-reform/build-p16.txt`
(the chain, then `next build`, then the postbuild guard; it also serves Task 10's chain run if no code changes after it). Then start the
built site in the background (`node node_modules/next/dist/bin/next start -p 3100`), use one Playwright browser, and shoot: the home whole
at 375, 768, 1024 and 1280; the bar before and after a scroll; the menu open at 375 and 768; the 404; the foot lines with the newsletter
bar; one frame mid-fade of the h1. Read every frame. Stop the server after.
**Landmine:** `next/font/google` fetches Geist and Space Grotesk at build time, and this machine's TLS interception blocks Google Fonts
(the dev server falls back). If the build fails on fonts, do not work around it. Then P1.6 becomes either a Vercel preview (needs his
word to push the branch to a non-main branch) or the first post-deploy check (photograph production right after his deploy, ready to fix
forward). Tell him which in one line, with the deploy ask (Step 9).

### Step 5. hr-cleanup item 25
`src/app/api/contact/route.ts` and `src/app/api/correction/` (singular; `hr-cleanup.md` item 25 says "corrections") log the database reply body on a failed insert, which can echo the row. Log the
error code and message only, as the newsletter route now does. Test first; commit.

### Step 6. Critique pass 4 (the loop)
Move frames superseded by d1 and d2 (the c1-*, c2-* and p3-* of a subject with a newer frame) into `shots-stale4/`. Dispatch a fresh
critic (the most capable model, Opus) with the spec, `critique.md`, `ship-audit.md`, `home-critique-3.md` and every current photograph
(with the P1.6 frames), asking for the same format into `.superpowers/sdd/home-critique-4.md`. Its P0 and P1 items become fix rounds
(one commit each, test first, Task 9 Steps 1 to 7 again for the pages touched); P2 items go to the final review's list, or get fixed if
cheap. Repeat until a pass finds no P0 and no P1. Watch especially: the tax card's left half at 768 (51 to 77px of blank), the sheet with
both switches on, the 404's rows.

### Step 7. Plan Task 10: typecheck, chain, records
1. Full typecheck: `node node_modules/typescript/bin/tsc --noEmit -p . > scratchpad/home-reform/tsc10.txt 2>&1; echo "exit $?" >> scratchpad/home-reform/tsc10.txt`
   (the file holds only `exit 0`).
2. Whole chain at 1300 MB, no browser open: `node scripts/verify_deploy.mjs > scratchpad/home-reform/chain10.txt 2>&1; echo "exit $?" >> scratchpad/home-reform/chain10.txt`.
   Read `scratchpad/deploy/chain.txt`: `Ran: 280 / 280` (or the generated count), `Failed: 0`, `Died on memory: 0`, `GATE: PASS`; the
   tree clean; `git diff ae6d8048 -- scripts/harness/*baseline* scripts/*baseline*` shows only lowered values or new pages seeded at
   their measure. A gate that dies on memory runs alone afterwards with `--only=<name>`. Ratchets that fell (type ladder, width
   discipline) may be locked lower with their own `--write-baseline`, never raised.
3. Records in the design repo (stage only these): QUEUE.md section N exactly as `task-10.md` Step 3 writes it, **with two changes**:
   the `owner:privacy-words` row is DONE (his "whatever, push forward"), and add a `site:publisher` row (Margin Atlas, acf51a17); plus
   one row per open P2 or final-review item. PAGES.md (the census). STATE.md's step-in-flight in one line. Also commit `_amend.md` and
   `task-09.md`. Correct the spec's decision 7 (36 to 32 official datasets, with the flag). In the website repo, one docs commit points
   CLAUDE.md's "Latest handoff" and `docs/handoff/INDEX.md` at this dossier and commits it.

### Step 8. The final whole-branch review
Package `ae6d8048..home-introduction` with `scripts/review-package` (slim of generated files) and dispatch the most capable model with
both specs, both plans, the minors lists (`hi-minors.md`, `hr-cleanup.md`, the critique P2s left), the critique passes and the global
constraints from `hr-implementer-rules.md`. Its Critical and Important findings go to ONE fix subagent with the whole list; the chain runs
again after any code change. If Avast blocks the reviewer's API call, do not retry against the block: review it yourself and say so.

### Step 9. Ask for his deploy word (the only question)
Report in plain, short lines: the branch and its commit count; the chain line; the critique score; the photographs' paths (he opens them
himself); the decisions taken for him (spec section 2, one line each, plus Q2's focal-value reading); that the privacy words go live with
the deploy; how P1.6 was seen. Then the ask. On his "deploy":
1. `git -C E:/atlas/website push origin home-introduction:main` (a fast-forward of ae6d8048; never force).
2. `MSYS_NO_PATHCONV=1 node scripts/deploy_watch.mjs --marker='<a string only the new home prints, e.g. data-zone-label="Read from the record">' --url=/`
3. Read-only production probes with a browser user agent (`curl -A "Mozilla/5.0 ... Chrome/140.0 Safari/537.36"`): /, /gb,
   /new-businesses, /icon, /pricing (200, and absent from the bar), the 404, a Phase 1 404 word, the sitemap index.
4. `node scripts/launch_branch.mjs` (rebuild launch-day on the new main).
5. Records: STATE.md, the QUEUE N rows to LIVE, a memory file, the ledger.

### Step 10. After the deploy (all his)
Search Console and Bing take sitemap 8 and lose 1, 2 and 4 (LAUNCH-SWITCHES row 14). The IndexNow post
(`node node_modules/tsx/dist/cli.mjs scripts/seo/indexnow.ts --phase1 --send`, 37,485 addresses) only on his word. His Search Console
export into `E:\atlas\seo\search-console\` unlocks Phase 2 (one city page with a trade switcher; `?trade=` views canonical to the city).

### Other unfinished work ("continue with other unfinished changes meanwhile")
Open QUEUE rows in `E:\atlas\design\loop\build\QUEUE.md`: `uk:trade-pages-by-country` (a pre-launch blocker), `home:hotels` (re-homed),
`data:orphan-trade-ids`, `seo:census-after-deploy`, `data:us-description-guards`; item 5's notes in `hr-cleanup.md` (the legacy
DimensionSwitcher, SpineMap's marker focus ring, the old header token in two spike scripts, the menu glyph's 90ms fade). Pre-launch
blockers from his 2026-10-09 decisions: sign-in on a second device, provenance on the UK pages. France is the first new country (BODACC
joined to SIRENE) when data work resumes. Take these only after the reform is deployed, or while waiting on him.

### Someday: infrastructure (each push or account step is his)
1. A fresh private GitHub repo for the design repo's light part (specs, plans, rules, QUEUE, STATE; big data stays local). It has no
   backup today: the largest single risk to the project.
2. `scripts/lib/local_only.mjs`: read the design repo's path from an environment variable, with today's path as the default.
3. Then a GitHub Actions chain, then cloud Claude Code sessions in parallel (each in its own worktree).
4. Linear as the work queue (his authorization), Firecrawl in the data pipeline, the Applied AI office hours, the API credits for Batch
   extraction jobs.

---

## 9. Constraints, guardrails & operator preferences

**His never-list, verbatim:** "Never: push, deploy, merge into main, force-push, --no-verify; change Stripe, Supabase, Vercel or DNS
settings; apply a migration to the live database; print or copy any .env value; install or download anything (npm, pip, data files);
send an email or post anywhere; rename a URL; raise a ratchet baseline; pipe a verification into a filter; run two browsers or a browser
beside the chain; close my apps for memory (wait and check again). Never invent a figure, testimonial, review, logo or credential."

**The URL rule** (section 4, item 2). **Decide and build:** ask only for a push, a deploy, a switch or a download; take the recommended
option and move; batch the work and report once. **His word is per action:** a past "deploy now" does not cover the next deploy.

**Design:** terracotta and neutral greys only (no green, no brown); his hero stays his; three loud moments; no blank in a card; tokens,
not raw values, in components.

**Verification habits:** every verification writes to a file (`> file 2>&1; echo "exit $?" >> file`) and is read with the Read tool,
never piped; one change, one verification; read the module that produces a number before acting on it; every gate failure names a
remedy; the chain never needs the network or a secret.

**Commands:** Git Bash from `E:/atlas/website` (prefix `cd /e/atlas/website &&`: the shell's cwd resets to `E:\atlas`); tsx as
`node node_modules/tsx/dist/cli.mjs`, never npx; never switch branches, rebase, reset, stash or merge mid-plan.

**Reporting to him:** plain, short, answer first; honest about failures; photographs or files he opens himself; never a browser or a
dev server to SHOW him work.

**Commits:** stage only the task's files; the message ends with a blank line and `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## 10. Environment & reproduction

- Website: `E:\atlas\website` (git, remote github.com/benetbani/marginatlas-web, the Vercel project, region fra1). Design and data repo:
  `E:\atlas` (branch p4-seam, no remote). Windows 11, 8 GB RAM, Git Bash and PowerShell.
- Tests: `node node_modules/tsx/dist/cli.mjs tests/<path>.test.ts`. Typecheck: `node node_modules/typescript/bin/tsc --noEmit -p .`.
- Counts: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write`. Census: `node node_modules/tsx/dist/cli.mjs scripts/harness/census.ts --write`.
- Renders: `bash scratchpad/reform/render_some.sh "home gb"` (writes `scratchpad/harness/pages/home-gb.html`).
- Browser gates (one at a time, with `--list=scratchpad/home-reform/pages.json` or the c1/c2 lists): `scripts/harness/check_page_laws.mjs`,
  `check_page_holes.mjs`, `check_copy_plain.mjs`, `check_readability.mjs`, `check_model_laws.mjs`; `scripts/verify_loud_seats.mjs`. Wide
  widths: `scratchpad/home-reform/holes-wide.mjs`, `laws-wide.mjs`; the first screen: `first_screen.mjs`.
- Photographs: `node scratchpad/home-reform/shoot_zone.mjs <render.html> <css selector> <out-prefix> [widths]` (a zone is
  `section[data-zone-label="Worked example"]`); whole pages: `scripts/harness/shoot_page.mjs`. The chrome render: see the header of
  `scratchpad/home-reform/chrome-render.tsx` (run through tsx with
  `--tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs`).
- If Playwright's own browser is missing: `NODE_OPTIONS=--require=./scripts/lib/pw_edge_fallback.cjs` (the installed Edge, no download).
- Status: `npm run status`; a quick look: `npm run look`; launch readiness: `npm run launch:check`.
- Secrets live in `.env.local` and Vercel. Never print them.

---

## 11. Landmines & gotchas

- **The ledger has no D1 entry**: anyone resuming from progress.md alone would think D1 never ran. git log is the truth.
- **D1's P1 commits are unreviewed and untypechecked**, though each ran its tests RED to GREEN and its gates.
- **A local `next build` may fail on Google Fonts** (TLS interception); see Step 4.
- **The archive's monthly run (the 12th)** brings new months: a re-export reds `site-counts` (TODAY) and the archive's sum checks until
  handled in order. Do not run the archive or re-export without his word and a plan.
- **Avast WebShield** once blocked a subagent's first API reply as "malicious". Do not bypass it.
- **index.lock** when two processes commit: one implementer at a time; wait ten seconds and retry once.
- **Escapes:** `\u00A0` and `\u2011` can land as literal characters through the Edit or Write tools; check the bytes. A Python heredoc in
  Git Bash turns `\b` into a backspace: patch backslash-holding code with the Edit tool.
- **A JSX comment cannot sit inside a ternary branch**; put it above the `{cond ? (` line.
- **A pipe hides exit codes** (`cmd | tail` reports tail's 0). Never pipe a verification.
- **Gate names differ from plan text sometimes**: read `scripts/gates.json`.
- **A capital letter in a public/ file name is unreachable in production** (the middleware lowercases paths).
- **A hidden browser tab never reveals React's streamed boundaries**: call `window.$RV(window.$RB.splice(0))` before measuring there.
- **`/sitemap` probes, `--live` tests and IndexNow touch production**: only when a step says so.
- **CLAUDE.md's "Latest handoff" line is stale** (it names 2026-10-04) until Task 10's docs commit.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| Chain | The 280-gate prebuild suite (`scripts/prebuild_all.ts`) |
| Harness | Static page renders plus the browser gates that read them |
| Spine | The shared page kit every page type is built on (zones, rails, archetypes) |
| Zone, level, rail | A full-width band of the page; a row of sections inside it; a section's titled column |
| Loud seat, LIT, FIELD | One of the page's three loud moments; LIT by its figure; FIELD lit by its ground (the terracotta band) |
| The band | The home's terracotta zone "Read from the record" with its four counts |
| Proofs | The home's three method cards: the joins, the archive, the tax |
| Worked example | The home's London restaurant in four steps (step 3, $740K, the page's one 40) |
| P0 / P1 / P2 | Critique priorities: must fix / what makes it world class (the bar) / polish |
| Pass N; rounds C1, C2, D1 | Critique passes and their fix rounds |
| Phase 1 / Phase 2 | The page architecture: index safety (live) / one city page with a trade switcher (after his Search Console export) |
| Switches | `NEXT_PUBLIC_*` feature flags for auth and the paywall, off until launch day |
| QUEUE, STATE, PAGES | The design repo's work queue, state of record, section census (`E:\atlas\design\loop\build\`) |
| hr-*, hi-*, p1-* | Subagent briefs and reports for the home reform, the home introduction, Phase 1 |
| Ratchet | A gate holding a measured baseline that may only fall |
| Provenance kind | `counted`, `worked out` and the like, stamped on each figure (`data-kind`) |

---

## 13. Successor verification checklist

You are oriented when you can answer these:
1. What is live on production, and how many commits does `home-introduction` hold over it? Is the merge a fast-forward?
2. Which critique-3 items are committed, which are done but uncommitted (and in which files), and which are not started?
3. What three things did fix round D1 never do before it died?
4. What did the owner rule about the publisher's name and the privacy words, and what does that change in Task 10's records?
5. What are the band's four counts, and why 32 and not 36?
6. Why might a local `next build` fail on this machine, and what are the two fallbacks for P1.6?
7. What must happen before any push, and who gives the word? What are the deploy steps after it?
8. Why can't the design repo go to GitHub as it is, and why would CI skip the browser gates today?

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort in a NEW Claude Code account (same Windows machine, same folders, same git repositories, no
conversation history). Another session prepared a complete handoff so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com, the home page reform in its last polish loop
Working directory: E:\atlas\website (the design and data repo is E:\atlas)
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-10-11.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom, starting with section 0 (what the account switch changes).
2. Then read these files, in this order (the dossier's section 7 explains why each matters):
   1. E:\atlas\website\CLAUDE.md
   2. C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md, then in the same folder:
      feedback_2026-10-10_publisher_push_forward.md, project_2026-10-10_home_critique_reform.md,
      feedback_2026-10-07_stop_questions_countries_home.md, dev_verification_gotchas.md
      (if that folder is empty for this account, rely on the dossier's section 9, which repeats every binding rule)
   3. E:\atlas\website\.superpowers\sdd\progress.md, lines 695 to 735
   4. E:\atlas\docs\superpowers\specs\2026-10-10-home-reform-design.md, sections 2, 5, 6 and 7
   5. E:\atlas\website\.superpowers\sdd\home-critique-3.md
   6. E:\atlas\website\.superpowers\sdd\hr-crit3-d1-brief.md
   7. E:\atlas\website\.superpowers\sdd\hr-implementer-rules.md and hr-reviewer-rules.md
   8. the output of `git -C E:/atlas/website status --short --untracked-files=no`, `git -C E:/atlas/website diff` and
      `git -C E:/atlas/website log --oneline -8`
3. Do not edit anything, run anything destructive, or make decisions until steps 1 and 2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" (dossier section 13) in 5 to 10 lines: the mission, the
   current state, the committed next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint, not an essay.
5. Flag any contradiction or gap between the dossier and the actual files (git and the files are ground truth; the dossier is a
   snapshot of 2026-10-11).
6. The owner has pre-authorized continuing the build ("stop questioning, push forward"; "continue with building, changing, fixes,
   everything"). So after the checkpoint, state what you are about to do and continue from the first step still open: the update note
   at the top of the dossier and the ledger's last lines (`.superpowers/sdd/progress.md`) say where the work stands, and git log is
   the truth (Steps 1 to 6 of section 8 were done on 2026-10-11; do not redo them). Ask him only for a push, a deploy, a switch or a
   download. Never push, deploy or merge without his explicit word in chat.

Honor the operator preferences and guardrails in the dossier as if they were given to you directly. If anything in the dossier is
unclear, ask before acting, but only after you have read everything above.
```
