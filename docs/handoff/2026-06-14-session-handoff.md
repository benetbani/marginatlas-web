# Session handoff, 2026-06-14: R6.5 shipped, R7 cohesion in progress

This is a complete, self-contained handoff. A fresh AI in a new conversation,
plus the files it points to, should be able to continue with zero lost context.
Read it in full. It is long on purpose.

---

## 0. THE FIRST PROMPT (paste this verbatim into the new conversation)

> You are continuing senior design + engineering work on **Margin Atlas**
> (`E:\atlas\website`, its own git repo; the parent `E:\atlas` is a separate
> data-pipeline repo). Do NOT write code, run a build, or change anything yet.
> First, READ THESE IN THIS ORDER and hold them as context:
>
> 1. `docs/handoff/2026-06-14-session-handoff.md` (this file, in full)
> 2. `docs/verification-protocol.md` (the definition of done; apply it to every delivery)
> 3. `CLAUDE.md` (the project index + hard constraints)
> 4. `docs/brand/section-constitution.md` (the per-page-type section spine)
> 5. `docs/brand/cohesion-master-plan.md` (the ONE visual language + the R7 plan + the locked decisions)
> 6. `docs/brand/design-system.md` and `docs/brand/brand-identity.md` (the visual law)
> 7. Your memory files for this project (auto-loaded), especially the Section
>    Constitution, Verification Protocol, and "never remove sections / ship state" notes.
>
> Then do three things, in order: (a) tell me, in about 6 lines, the current
> state (what is live vs held, what the next wave is); (b) tell me the single
> next step and wait for my go; (c) from then on, drive the work in verified,
> committed waves, running the verification protocol before every delivery, and
> SEEING every visual change with the Playwright MCP (screenshot, do not assume).
> The shell working directory resets to `E:\atlas`; prefix every shell command
> with `cd /e/atlas/website &&`. Never silently substitute your judgment for an
> explicit instruction, and never silently drop a required section.

---

## 1. How to use this handoff

The first prompt above bootstraps a new conversation: it makes the AI read the
canonical docs in order, then state the situation and the next step before
touching anything. Everything below is the detail behind that. The canonical,
always-current sources of truth are the linked docs; this handoff threads them
together and records what is done, what is live, and what is next.

---

## 2. Current state on one screen

- **Branch:** `reform-v2/r6-forward` (the working branch; pushed to origin
  `github.com/benetbani/marginatlas-web.git`). HEAD ~ `ca27056a`.
- **Production (marginatlas.com):** the **R6.5 promote** (Vercel deploy
  `kfn4zigfl`, ~4h before this handoff): warm frame ON, the brand-section blocks,
  the interaction layer (make-it-yours / watch / zoom), the data-sanity fixes.
- **HELD on the branch, NOT live:** the engraved-almanac direction. That means:
  the section constitution, the entire engraved kit (`src/components/kit/engraved/`),
  the **engraved country page**, the R7 cohesion foundation (frame-on default),
  the cohesion master plan, and the verification protocol. None of this is in
  production yet. The next promote (R7 Wave F) brings the cohesive site live.
- **IMPORTANT live caveat:** because the engraved country page is held,
  **production still shows the PRE-FIX country page** (the green hero wash + the
  dropped metrics the founder hated). The fix is committed (`8537cdfd`) but
  unpromoted, by the founder's explicit "hold for one cohesive promote" call. If
  the founder wants the country fix live sooner, promoting just the branch is a
  clean option (it is verified green); otherwise it ships at Wave F.
- **Gates:** green at HEAD (tsc clean, `npm run prebuild` 31/31, page-sections +
  section-order PASS).

---

## 3. The product (one paragraph)

Margin Atlas (marginatlas.com) is a global small-business benchmarks site: every
page answers "how much does an X make in Y" with the number, the structural
reason behind it, and an honest read. Coverage ~191 countries, 180+ industries,
free to browse. Register is **brand** (the site IS the product, editorial), with
a few tool-like routes in the **product** register. Next.js 15.5 App Router /
RSC, React 19.2, TypeScript 5 (strict, no noUnusedLocals), Tailwind 3.4,
Supabase Pro (eu-west-1), Vercel (fra1), Sentry. Fonts: Fraunces (display,
`--font-display`) + Inter (sans, `--font-sans`).

---

## 4. The decision that governs everything now (R7 cohesion)

The site had grown two visual languages (a warm SaaS card kit on cell/city/
industry/home, and a new engraved almanac on country). The founder ordered a
cohesion operation. The locked decision (see `docs/brand/cohesion-master-plan.md`):

- **ONE language = engraved-almanac FRAME + clean DATA core.** The engraved
  vocabulary (chrome, section shells, compass/contour/rosette motifs, the
  clay-to-moss meaning scale, Fraunces display, the honest sample-state) is the
  shared identity on every page. The DATA (tables, charts, the RangeStrip spread,
  the money breakdown, scorecards) stays crisp, opaque, high-contrast on cream.
  The law: warmth + texture in the frame, never behind a number.
- **The warm frame is ON by default** site-wide (the standard chrome).
- **The cell/business page gets the LIGHTEST engraved touch** (frame + hero +
  dividers only) so the dense data board stays the star.
- **The country page is held**; the whole cohesive site promotes once, at Wave F.

The governing structural docs:
- `docs/brand/section-constitution.md`: WHAT each page type contains (the fixed
  section spine, per type, organized by the 9 judgment lenses for country).
- `docs/brand/cohesion-master-plan.md`: HOW it all looks + the R7 roadmap.
- `docs/verification-protocol.md`: the definition of done for every delivery.
- `docs/brand/design-system.md` + `brand-identity.md`: the palette / type / law.

---

## 5. Architecture map (where things live)

The Atlas Page Kit (`src/components/kit/`, barrel `@/components/kit`):
- root: RangeStrip (the signature 7-gradation spread), AnswerFirstMasthead,
  HonestTakeBox, MoneyGoesBreakdown, the editorial beats, StickySectionNav,
  furniture, SectionEmpty, StillFillingIn + `groupSectionStack` (the grouped
  empty-state collapse).
- `kit/controls/`: the interaction grammar (Slider, ResetAnchor, PendingShell,
  OrientationHeader, Segmented) + the masthead switchers, MakeItYours,
  WatchTray/AddToWatch, ProfileChip, ZoomControl.
- `kit/blocks/`: the brand-signature sections (OperatorVoices, RiskList,
  CostDrivers, LicenceList, MinimumWage, StreetCharacter, VsWorld, OneThing) -
  the earlier (non-engraved) versions.
- `kit/tables/` + `kit/charts/`: the clean data components (AtlasTable,
  ComparisonTable, OwnerKeepTable, CostSplitTable, RangeTable, WeightedCompare;
  Waterfall, ScoreBand, ComparisonBars, HeatStrip, FootfallGrid, VisitorSplit).
- `kit/frame/`: AtlasGutters + HeroWash (the warm frame, flag-aware).
- **`kit/engraved/` (the R7 identity layer, the future of the whole site):** the
  foundation (`primitives.tsx`: meaningStep, CompassRosette, ContourField,
  RouteLine, Glyph, StampSeal, SampleState, Eyebrow), `EngravedHero`, `Scorecard`,
  the ported sections (`Setup.tsx`, `Compare.tsx`, `Editorial.tsx`, `GutCheck.tsx`),
  and the 9 new judgment-lens sections (`CountryShape`, `OpportunityGap`,
  `SameBusinessAbroad`, `SpecialZones`, `GroundUnderYou`, `WhoHasMoney`,
  `HowFarYouReach`, `TalentReality`, `YourLifeHere`). Engraved color lives in the
  `globals.css` engraved CSS-var layer; components carry no raw hex.

The section contract: `src/lib/page-sections.ts` (the manifest) + the gate
`scripts/verify_page_sections.ts`. Per-page view-models in `src/lib/{cells,
countries,cities,industries}/*_view.ts`. The warm frame: `globals.css`
`.atlas-frame-*` / `.atlas-wash--*` / `.atlas-glass-chrome`, mounted in
`src/app/layout.tsx` (AtlasGutters + glass chrome), flag `isWarmFrameEnabled`.

Design assets (gitignored reference, the engraved STYLE source, ported once into
code): `design-assets/incoming/2026-06-14-country-engraved/` (and earlier
`2026-06-14-claude-design/`). The rule: assets are style reference; the kit is
the implementation. Do not depend on per-instance hand-made assets.

---

## 6. Per-page-type state (now vs target)

- **Country** (`src/app/[country]/page.tsx`): DONE on the engraved spine (held).
  The reference instance. Photo hero kept; Scorecard, CountryShape radar,
  SetupStepper, HiringRead, WhoHasMoney, HowFarYouReach, Neighbours,
  GroundUnderYou, CitiesGrid (uniform, no good/bad rank), CharacterPanel,
  LocalsKnow, VsWorld, HonestTake (low), GutCheck, OneThing. Real data where
  held, honest tagged sample otherwise.
- **Cell / business** (`[country]/[geo]/[industry]/page.tsx` + `[sub]` +
  `CellDecisionStack.tsx`): on the R6.5 kit (brand blocks + make-it-yours). TARGET:
  lightest engraved touch (frame + hero + dividers); keep the clean data core.
- **City** (`cities/[slug]/page.tsx`): R6.5 kit (ScoreBand/VisitorSplit/
  OwnerKeepTable/vs-peers). TARGET: engraved frame + shells, keep data.
- **Industry, Home, Learn, Compare, Neighbourhood, Directories**: R6.5 kit.
  TARGET: engraved frame + shells; directories get the world map hero.

---

## 7. The forward plan (R7 cohesion, the active program)

Executed via the subagent-driven-development loop (implementer, spec review, code
review), each wave gate-green + committed, then one cohesive promote.

- **Wave A, foundation (IN PROGRESS).** A.1 done: warm frame ON by default
  (`073b0db5`). REMAINING A: (1) make the engraved section shell the ONE standard
  shell, reconcile `BeatCard` into it, one divider family; (2) DEDUPE the
  duplicate components (VsWorld / OneThing / GutCheck / HonestTake exist in both
  `kit/blocks` and `kit/engraved`, the engraved becomes canonical); (3) one type
  scale + token layer; (4) one answer-first hero contract; (5) one 375px reflow
  rule. Build this carefully in the main session (shared files, not parallel-safe).
- **Waves B-E, per-page adoption** via subagents: B cell (lightest touch), C
  city, D industry + home, E learn + compare + neighbourhood + directories.
- **Wave F:** verify all gates + a per-type cohesion QA pass at 1280 + 375 (SCREENSHOT
  via Playwright), one comprehensive preview across every page type, then the
  single promote (production env already has NEXT_PUBLIC_WARM_FRAME=1).

A separate, later thread is the **data-fill (Sonnet) phase**: real content for the
sections currently showing honest sample states (operator voices, risks, the new
lens sections, etc.). Architecture is built; content is fed later. Never fabricate.

---

## 8. The verification protocol (apply before EVERY delivery)

`docs/verification-protocol.md`, in order: (0) instruction fidelity, re-read the
request, enumerate every ask, never silently substitute or drop a section; (1)
gates; (2) data honesty, real or tagged sample, no visibly-wrong number,
like-for-like; (3) SEE it, screenshot the affected pages at 1280 + 375, exemplar
+ thin, via the Playwright MCP; (4) honest reporting; (5) ship discipline,
preview then promote. This was founder-mandated after repeated execution misses.
It is non-negotiable.

---

## 9. Hard rules + the founder's working style

- Hard constraints (gate-enforced): no em-dashes, no source-agency names, no raw
  hex/px/ms in components (tokens only), no URL slug renames, no force-push to
  main, prebuild concurrency <= 4 on Windows.
- Standing rules (locked in memory): never remove / self-omit / reorder a
  required section without explicit approval (propose, never silently enact);
  never let production fall behind verified work; common sense + like-for-like on
  every number, never rank across business x geography, never badmouth an
  industry; no fabricated place detail; quiet editorial voice; the warm-frame law.
- The founder works in waves, reviews live output closely, and reacts strongly to
  any divergence from what was asked and to anything that looks unpolished or
  inconsistent. SEE your work, do exactly what was asked, report honestly,
  preview before promote. When unsure between an explicit instruction and your
  own taste, follow the instruction and raise the question.

---

## 10. Operational gotchas (read before running anything)

- **Shell CWD resets to `E:\atlas`** between calls. ALWAYS prefix with
  `cd /e/atlas/website &&`. A `vercel --prod` once ran from the parent and created
  a bogus empty Vercel project named **"atlas"** (ignore it; the real project is
  **`marginatlas-web-twtl`**, production domain www.marginatlas.com).
- **Vercel CLI is installed and logged in as the founder (`benet-4126`).** Deploy
  a preview with `cd /e/atlas/website && vercel deploy --build-env NEXT_PUBLIC_WARM_FRAME=1 --yes`;
  promote with `vercel deploy --prod ...`. Preview URLs are behind Vercel auth
  (the founder views them logged in). The build runs remotely (near the DB), so
  local-DB slowness is not a factor; do NOT rely on `npm run build` locally.
- **A transient server-side rate-limit** intermittently throttles bursts of
  parallel subagents (it killed an 8-agent workflow in 10s). Not a usage cap. If
  a workflow dies instantly with "Server is temporarily limiting requests", wait
  and retry, or reduce concurrency, or do the work in the main session.
- **Playwright MCP** was added to the project config (`claude mcp add playwright
  npx @playwright/mcp@latest`); it loads at session start, so it is available
  NOW in the new conversation. Use it to SEE every visual change (navigate +
  `browser_take_screenshot`), at 1280 and 375. There is also a `Claude_Preview`
  MCP (preview_* tools) but its screenshot stalls when the tab is backgrounded;
  prefer Playwright.
- **Verify, do not autonomously build:** `npx tsc --noEmit` and `npm run prebuild`
  are the approved verification commands (the founder approved the verify cadence);
  do not run `npm run build` without reason.
- LF/CRLF git warnings on commit are benign (Windows line endings).

---

## 11. Commit timeline (orient in git, newest first)

`ca27056a` verification protocol + CLAUDE.md ; `073b0db5` R7 Wave A.1 frame-on ;
`8537cdfd` engraved country page (held) ; `5daaf3a8` locked decisions ;
`7ae6eea5` cohesion master plan ; `c38b802f` engraved Wave 3 (9 new sections) ;
`64495dd9` engraved Wave 2 (12 sections) ; `7c592e61` engraved foundation ;
`1a4c0738` section constitution ; `86ae32d7` first country rebuild (metrics hero,
killed wash, data-first) ; `8c3acadc` RSC fix ~ the R6.5 production promote ;
`46586176`..`97dd05d0` R6.5 Phases 4-1 ; `3e5398ad` warm frame ; `bbbd7dd6` page
rescue ; `4ac55759` tables+charts ; `2e61eaf9`/`cbdf4f68` R6 interaction.

---

## 12. The immediate next steps (what to do first in the new conversation)

1. Bootstrap-read (the first prompt), confirm state with the founder.
2. **Continue R7 Wave A foundation** (shell unification + dedupe + one type
   scale + one hero contract + one reflow), in the main session, gate-green,
   committed. This is the wave that creates cohesion.
3. Then Waves B-E (per-page adoption) via subagents, watching the rate-limit.
4. Then Wave F: cohesive preview (screenshot every page type via Playwright,
   desktop + 375) -> founder nod -> single promote.
5. Standing question to resolve with the founder early: promote the engraved
   country fix now (production still shows the pre-fix country page), or keep
   holding it for Wave F.

---

## 13. Docs + memory index (the canonical sources)

In-repo: `docs/verification-protocol.md`, `docs/brand/section-constitution.md`,
`docs/brand/cohesion-master-plan.md`, `docs/brand/design-system.md`,
`docs/brand/brand-identity.md`, `docs/brand/design-improvement-pipeline.md`,
`docs/superpowers/specs/2026-06-11-page-content-map.md` (the original section
quiz), `CLAUDE.md`. Memory (auto-loaded): the Section Constitution, the
Verification Protocol, "never remove sections / ship state", common-sense +
like-for-like, the SaaS reformation run state, the brand + two-pipeline model.

Everything is committed on `reform-v2/r6-forward`. Production is the R6.5 promote.
The engraved cohesion direction is the held, in-progress future. Continue from
Wave A.
