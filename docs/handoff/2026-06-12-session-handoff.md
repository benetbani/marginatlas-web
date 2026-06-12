# Margin Atlas — CONTINUE HERE (session handoff, 2026-06-12)

> **For the agent picking this up:** read this document top to bottom FIRST. Then skim the
> canonical docs in section 6. Your auto-loaded memory (`MEMORY.md` + the project memories)
> already holds the durable facts; this handoff is the live bridge from the previous chat.
> After reading, you have full continuity. **End your first reply by asking the founder the one
> operating decision: "Fable or Sonnet?"** (today the only one that can start is Fable; see
> section 5). Do not start building until the founder answers.

> **For the founder:** to continue in a fresh chat in this same project, paste:
> *"Read `docs/handoff/2026-06-12-session-handoff.md` in full, confirm you have the context, then
> ask me: Fable or Sonnet."*

---

## 1. Where we are, in one paragraph
The **brand, the design system, and the two-pipeline operating model are COMPLETE** and live in
`docs/brand/`. After 160 founder decisions across four direction quizzes, Atlas has a defined
soul (a wise, generous guide; the world's honest map of what businesses really make; warm
almanac look; vermillion + cream; a distinctive serif still being chosen) and a single
anti-patchwork design-system constitution. The next phase is **execution via two complementary
pipelines**: **Fable** (frontier model: design / structure / elite content) and **Sonnet**
(`claude-sonnet-4-6`: data / replication). The whole program reduces to one choice each time:
**Fable or Sonnet.** Everything else (the homepage work, the content blueprint, the roadmap, one
known bug) feeds this.

## 2. The operating model (the heart of it)
Read `docs/brand/pipelines-control.md` — it is the control panel and the single source of truth
for how the program runs.
- **FABLE = the architect** (frontier model). Owns HOW IT LOOKS + HOW IT READS: the design
  system, tokens, the font decision, the cartographic kit, the Atlas Page Kit components, one
  beautiful **template per page type**, and the editorial **contracts + gold exemplars +
  validators**. A 5-phase whole-page reformation (`docs/brand/pipeline-fable.md`), each phase
  closed by a founder gate. It NEVER generates per-cell data at scale.
- **SONNET = the cartographer** (`claude-sonnet-4-6`). Owns HOW MANY: fills Fable's templates
  with REAL validated data across every country / city / industry / business, via a precedence
  chain (trusted-local -> extrapolated+labeled -> baseline+labeled -> null/self-omit). Never
  invents a number, never redesigns, writes a fill-report per target
  (`docs/brand/pipeline-sonnet.md`).
- **Complementary + one-directional:** Fable ships a template, THEN Sonnet fills it. Sonnet
  trails Fable by at least one merged template per page type. Shared contract = the template +
  the kit + the editorial contracts; `FILL:<field>` marks Sonnet's fields; escalations go to
  `docs/brand/_pipeline/contract-gaps.md` (Fable-only triage). This is the surgical model
  strategy: Fable on the ~10% taste-bound work, Sonnet on the bulk.

## 3. The current build state (precise, verified)
- **Branch:** `reform-v2/palette-brick`. Production (`main`) AUTO-deploys from a fast-forward of
  this branch.
- **On `main`:** the homepage SP1 (example tiles) + SP2 (marketing band), the country-page
  reform (SP1-3), the city-page reform, and the monetization scaffolding (auth + gating + Stripe,
  all DORMANT behind `NEXT_PUBLIC_*` flags). All shipped earlier.
- **On the branch, built but NOT shipped:**
  - **SP3 (homepage search cascade):** NavigatorForm reworked into country -> city -> business
    with a rotating prefill (commits `30bb01c9`, `d5536d7f`, `f787c7c8`). Verified on preview;
    HELD for a founder try (it reworks the live primary CTA). Task #34.
  - **HP-v2 Pass A (homepage rebuild from the founder's "slop" review):** removed the
    catastrophic "easiest to break in" section + how-it-works; added rich clickable neighborhood
    cards (real flavor data) + an honest like-for-like US-states comparison (with a distinctness
    guard that auto-drops identical-value trades); unified the button color; killed "software
    shop" copy; made the audience band horizontal with icons (commits `170f7f7d`..`4f16cf0c`).
    Parked on a Vercel preview. Task #35.
- **KNOWN BLOCKER — the US wrong-industry bug:** on the US path, many fine-grained cell pages
  silently render a DIFFERENT industry's data (e.g. `/us/california/legal-services` shows
  "Software development"; dental shows software; hairdressers show employment-services; pharmacy
  shows grocery). Root cause: the US branch of `getCellBySlugRaw` in `src/lib/cells.ts`
  (resolveToMeasuredIndustry + a NAICS-3 prefix `.or()` + a fuzzy `industry_description`
  fallback) lands on an unrelated measured row with no banner. This GATES the cross-trade
  comparisons, the search cascade, and the learn deep-links. Fix it as a foundation item early in
  Fable P1 (or before any cross-trade build): never show industry B's data under industry A's
  URL/name without an honest substitution banner, or return the correctly-named extrapolated
  cell, or notFound. Dry-run + show the founder before/after.
- **Working tree:** three beneficial uncommitted edits were folded into this handoff's commit:
  `tsconfig.json` now excludes the design-export staging from tsc; `CityHeroV2.tsx` +
  `FeaturedCardV2.tsx` tokenize their tier dots (`colors.tier.deep/good/starter`, retiring the
  old hardcoded blue). All verified safe.

## 4. The blueprint + the roadmap (already written)
- **The 3-layer blueprint:** `docs/superpowers/specs/2026-06-11-page-content-map.md` — for every
  page type: WHAT content it holds, HOW it should feel (voice/honesty/signature moves), and HOW
  it is designed / alive / one-of-a-kind. Built from the first two quizzes.
- **The master roadmap:** `docs/superpowers/plans/2026-06-12-atlas-master-execution-plan.md` — 8
  phases + 3 parallel tracks. The Fable pipeline supersedes its build sequencing but inherits its
  content + rules.

## 5. The immediate next step
**Start Fable Phase 1** (Sonnet is structurally blocked until Fable ships the first template).
Phase 1 = foundation: reconcile the design tokens, run the **font showcase** (3-4 serif
candidates on a real Atlas page so the founder chooses the display face), assemble the
cartographic + icon + chart + spot kit, then build the **Atlas Page Kit** and the **flagship
business-page template**. Launch line (from the control panel):
*"Run the next Fable pipeline item per `docs/brand/pipeline-fable.md`."* Run it one elite item at
a time, with a preview + a founder gate at each phase boundary.

## 6. Canonical documents (read in this order; all in `docs/brand/` unless noted)
1. `pipelines-control.md` — the control panel (how the whole program runs; THE entry point).
2. `brand-identity.md` — the brand (essence, feeling, visual world, color, type, imagery, devices).
3. `design-system.md` — the single design-system constitution (everything inherits from it).
4. `pipeline-fable.md` — the 5-phase Fable reformation plan.
5. `pipeline-sonnet.md` — the Sonnet data-fill loop.
6. `visual-assets.md` — how the best export assets land in `src/components/brand/`.
7. `_audit/` (asset / design / screenshot) — what the design-export bundles contained.
8. `../superpowers/specs/2026-06-11-page-content-map.md` — the content + experience + design blueprint.
9. `../superpowers/plans/2026-06-12-atlas-master-execution-plan.md` — the master roadmap.
10. `../design/` is now empty; the asset prompts moved to `docs/brand/design-tool-prompts.md`.

The raw design-tool exports (10 bundles, ~70MB) are staged under
`docs/brand/assets/incoming/Margin-Atlas*/` (gitignored). Canonical set = `Margin-Atlas--5/`.

## 7. Standing rules (NON-NEGOTIABLE)
- **Common-sense check on every data element.** No absolute rankings mixing business x geography;
  no badmouthing industries; consulting / PE are CLIENTS, never subjects. (See the
  `common-sense-and-like-for-like` memory.)
- **Like-for-like only;** comparisons hold one axis constant; reuse the distinctness guard.
- **No fabrication.** Real data, or an honest LABELED placeholder. **Architecture-first:**
  COUNTRY / INDUSTRY / CITY new sections may use `N/A` / lorem placeholders during the skeleton
  phase (fill later). BUSINESS/CELL, NEIGHBORHOOD, LEARN, COMPARE get real data now.
- **Voice:** a sharp friend with the numbers; talk to "you"; honest opinions backed by data; dry
  wit, no metaphors; plain operator language ("kebab shop," "covers"), never consultant-speak;
  one term everywhere: "what the owner keeps."
- **Tokens only** (no raw hex/px in components); **no em-dashes** in user-facing source; **no
  source-agency names**; **no slug renames**.
- **Surgical model strategy:** Fable for design / voice / bug-root-cause / originality seeds;
  Sonnet for bulk replication + data fill + tests. Never Fable for scale data.
- **ALWAYS dry-run + show before data/render changes.** Preview-gate everything. **No autonomous
  local `npm run build` / `prebuild` / `tsc`** (the remote Vercel deploy runs all gates).

## 8. How to ship (the deploy + verify loop)
- Commit on `reform-v2/palette-brick`. Deploy a preview: `vercel deploy --yes --cwd
  "E:/atlas/website"` (builds REMOTELY, runs the ~29 prebuild gates + tsc + all pages, no local
  build / no OOM). It prints a `Preview:` URL.
- Verify: curl with header `x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o` + a
  browser UA. Screenshot via PowerShell (Set-Location first): `$env:BYPASS="...";
  node scripts/shot_preview.mjs <preview-url> "/route" [--mobile]` -> saves `screens/<route>.png`.
- Ship: `git push origin reform-v2/palette-brick:main` fast-forwards main and auto-triggers
  production. High-stakes surfaces (the live primary CTA, core-data changes) get a founder try
  first.

## 9. Gotchas
- **Bash cwd resets to the parent `E:/atlas` across turns.** Always `git -C /e/atlas/website ...`
  or `cd /e/atlas/website` first. PowerShell starts in the parent too; `Set-Location
  "E:\atlas\website"` before scripts.
- **RSC double-count:** Next embeds the flight tree alongside the visible DOM, so curl-greps
  double-count and interpolated `{text}` greps return 0 even when present. Verify counts + copy
  via SCREENSHOT, not grep.
- **Prebuild gates** include `verify_section_order` (rendered section ids must be an in-order
  subsequence of the canonical list in `src/lib/page-layout/section-order.ts`; reorders must
  update the list, removals are free) and `verify_layering` (app/components must not import
  `data/`; move accessors to `src/lib/`).
- **The font is an OPEN SLOT** (`var(--font-display)`); do not hardcode a face. The export's
  "Newsreader" is a placeholder; the showcase decides.
- The design-export staging + `scratch/` are gitignored.

## 10. Open items / tasks
- **Font showcase** (Fable P1) — let the founder choose the display serif.
- **SP3 ship decision** (the search cascade is built + held; needs the bug fix + a founder try).
- **HP-v2 Pass A ship decision** (built + parked on preview).
- **The US wrong-industry bug** (foundation fix; gates the cross-trade work).
- **Raw-perspectives pipeline** (task #36, parallel: Reddit/forums + AI deep research -> curated
  operator voices for `OperatorVoices` / contrarian-insight / myth-vs-reality).
- **Monetization activation** (founder flips the dormant flags per
  `docs/handoff/2026-06-09-activation-runbook.md` when ready).

## 11. THE DECISION
After reading, ask the founder: **Fable or Sonnet?**
- **Today the answer is Fable** (Sonnet has nothing to fill until Fable ships the first
  template). The first action is the first Fable Phase 1 item (section 5).
- If the founder says Sonnet, explain it is blocked, name the one template Fable must finish
  first (the flagship business page), and proceed with Fable.
