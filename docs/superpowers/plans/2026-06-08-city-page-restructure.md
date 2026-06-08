# City-Page Restructure (Sub-project 1) Implementation Plan

> **For agentic workers:** execute task-by-task with the founder's §8 ship loop
> (build subagent, controller review, light `npx tsx` gates, Vercel as the real
> typecheck + 29 gates, HTML verify + one mobile screenshot, fast-forward the
> verified SHA to main, confirm live). Steps use checkbox (`- [ ]`) tracking.
> Strictly sequential: each task ships fully and is confirmed live before the next.

**Goal:** Restructure the city page (`/cities/[slug]`) into the decided
decision-first, city-true flagship: cut the off-topic blocks, reorder, calm the
data board, extend the activity ranking to every city, and rebuild sister cities
into a real peer comparison.

**Architecture:** Pure edits to the existing city page and its domain builders
(`src/lib/scores/city_board.ts`, `ComparableCitiesRibbon`), plus one redirect for
the removed curiosities route. No new dataset. The riskiest change (Task 3) adds
modeled numbers to every city and is gated behind a dry-run that must be shown to
the founder before shipping.

**Tech Stack:** Next.js 15.5 App Router, React 19.2, TypeScript 5, Tailwind 3.4,
the board kit (`src/components/board/*`), the cell engine (`src/lib/cells*`,
`src/lib/scores/*`).

**Source spec:** `docs/superpowers/specs/2026-06-08-city-and-neighborhood-pages-design.md` (§3).

**Sequencing note (gap-free):** removing culture / government / commercial-streets
from the city signature panel is DEFERRED to the sub-projects that build their new
homes (country page in SP2, neighborhoods in SP3), so no content is removed from the
site before its destination is live. SP1 leaves the signature panel and the
sister-cities slot in place except where a task below replaces them.

---

## Per-task ship loop (applies to every task)

1. **Build (subagent).** Dispatch a focused subagent with the task text. It edits
   the named files, runs the light single-file `npx tsx` gates it can, self-reviews,
   and does NOT commit / build / tsc / prebuild. For any new modeled number it MUST
   produce a dry-run table and confirm every value is in-bounds.
2. **Review (controller).** Read every touched diff, re-run the dry-run, eyeball
   numbers and copy.
3. **Stage precisely.** `git add` only the named files (bracket paths need
   `GIT_LITERAL_PATHSPECS=1`). Confirm with `git diff --cached --name-only`.
4. **Commit + push** to `reform-v2/palette-brick` (lower-case conventional message,
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`).
5. **Vercel gate.** Poll `vercel ls marginatlas-web-twtl --yes 2>&1` until the new
   preview is Ready. On Error: `vercel inspect <url> --logs`, fix forward, re-push.
6. **Verify.** Hit the changed routes on the preview with the bypass headers, regex
   the key strings (sections present/absent, figures correct, no NaN/undefined/
   negative, modeled labels present), take ONE mobile screenshot via
   `node scripts/shot_preview.mjs <preview> "/cities/<slug>" --mobile` (PowerShell,
   `Set-Location E:\atlas\website` first).
7. **Ship.** `git fetch origin main`; confirm `git log <sha>..origin/main` empty;
   `git push origin <verified-sha>:main`.
8. **Confirm live** on marginatlas.com (follow the www 307 redirect).

Light gates to run locally per task (sequential, one process at a time):
`npx tsx scripts/verify_no_em_dashes.ts`, `verify_no_source_agencies.ts`,
`verify_hardcoded_hex.ts`, `verify_section_order.ts`, `verify_layering.ts`,
`scripts/audit/find_useless_tiles.ts`.

---

## Task 1: Cuts + reorder + curiosities redirect

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx` (only if it imports the
  curiosities preview; otherwise untouched)
- Modify: `src/app/cities/[slug]/page.tsx` (remove three blocks, reorder)
- Delete: `src/app/cities/[slug]/curiosities/page.tsx`
- Modify: redirect config (determine: `next.config` `redirects()` or
  `src/middleware.ts`) to 308-redirect `/cities/:slug/curiosities` -> `/cities/:slug`
- Check: `src/app/sitemap.ts` (remove curiosities entries if present)

**What changes (no new numbers):**
- Remove from the city page: the decision-wizard CTA section, the ten-industry
  mosaic section (including the `MoreDepthBanner` inside it), and the curiosities
  preview block.
- Delete the `/cities/[slug]/curiosities` route and add a permanent redirect from it
  to the city page, so indexed URLs keep their equity (no hard 404, no slug rename).
- Reorder the remaining sections to: masthead/score, data board, signature panel,
  neighborhoods teaser, activity ranking (still London-only until Task 3),
  peer comparison (still the old ribbon until Task 4). Keep the quiet coverage link.

- [ ] **Build:** make the edits; remove now-unused imports; run the light gates
  (especially `verify_section_order`, since section order is gated). No dry-run
  (no new figures).
- [ ] **Review:** confirm the three blocks are gone, the redirect resolves, no
  dangling imports, section order gate passes.
- [ ] **Verify on preview:** `/cities/london` and a non-London city (e.g.
  `/cities/paris`) render; the CTA / mosaic / curiosities-preview strings are ABSENT;
  `/cities/london/curiosities` 308-redirects to `/cities/london`; one mobile shot.
- [ ] **Ship + confirm live.**

**Acceptance:** city page shows the reordered sections, the three blocks are gone,
old curiosities URLs redirect to the city page, all gates green.

---

## Task 2: Calm the data board + thin-coverage state

**Files:**
- Modify: `src/components/board/StatGrid.tsx` and/or `DataSection.tsx` (a muted
  treatment for always-empty rows; additive prop, default off so the cell and
  country boards are unchanged)
- Modify: `src/app/cities/[slug]/page.tsx` (pass the muted treatment for the city
  board; add the thin-coverage state for non-Tier-1 cities)

**What changes (render only, no new numbers):**
- De-emphasize the board rows that are always blank at city altitude (lower contrast
  / smaller weight on a dashed row) so a city board does not read as broken, while
  keeping the four-section scaffold identical to the cell and country boards. The
  muted treatment is opt-in via a prop so only the city board changes.
- Add an explicit thin-coverage state for Tier 2 / Tier 3 cities (a quiet line that
  says coverage is thin here), so a sparse page reads as honest, not broken.
- Do NOT remove the informality row yet (it leaves with the country relocation in
  SP2, to stay gap-free).

- [ ] **Build:** add the muted-row prop + the thin-coverage line; run the light
  gates (hex gate especially, since this is a style change; use tokens only).
- [ ] **Review:** confirm cell and country boards are visually unchanged (prop
  default off); confirm the city board mutes blanks; confirm a Tier-2 city shows the
  thin-coverage line.
- [ ] **Show before/after:** mobile screenshots of a Tier-1 city (e.g. London) and a
  Tier-2 city, presented to the founder (this is a render change, so show before
  shipping).
- [ ] **Ship + confirm live.**

**Acceptance:** city board mutes empty rows, thin cities show the thin-coverage
state, cell + country boards unchanged, tokens only (hex gate green).

---

## Task 3: Activity ranking extended to every city (dry-run gated)

**Files:**
- Modify: `src/lib/scores/city_board.ts` (`buildCityActivities`: produce a ranking
  for every city from the cell engine, not just London)
- Modify: `src/app/cities/[slug]/page.tsx` (render the section for all cities;
  update the section copy if the sort changes)
- Create: `scripts/audit/dryrun_city_activities.ts` (the proof table)

**What changes (NEW modeled numbers on every city, the risky step):**
- Extend `buildCityActivities` so any city resolves a ranked activity list from the
  existing cell engine (the same modeled, labeled owner-take-home and break-in the
  cell pages already compute). Never invent: a city or activity with no resolvable
  cell self-omits that row; a city with too few rows omits the whole section.
- Sort by the break-in rating (the lean, matching the "easiest to break in" verdict),
  with owner take-home shown as a secondary figure per row. London keeps its curated
  numbers (they must reconcile with the engine, not double up).
- Keep the existing "modeled, directional" labeling.

- [ ] **Build:** implement the engine-backed ranking; write
  `scripts/audit/dryrun_city_activities.ts` that, for a representative city set
  (a Tier-1 spread plus London), prints each city's ranked rows (activity, break-in,
  take-home) and asserts: no NaN/negative/duplicate, take-home within plausibility
  bounds, London matches its curated figures, and empty cities omit cleanly.
- [ ] **Run the dry-run:** `npx tsx scripts/audit/dryrun_city_activities.ts`; every
  assertion PASS.
- [ ] **Show the founder** the dry-run table for several cities before shipping
  (founder rule: always dry-run and show before a data/render change).
- [ ] **Review:** re-run the dry-run; eyeball the numbers and the new ordering.
- [ ] **Verify on preview:** several cities show a ranked activity list with break-in
  + take-home, "modeled" label present, no NaN/undefined/negative in visible figures;
  one mobile shot.
- [ ] **Ship + confirm live.**

**Acceptance:** every covered city shows a break-in-ranked activity list from the
engine, labeled modeled, with no visibly-wrong number; thin/empty cities omit
cleanly; dry-run assertions all pass and were shown.

---

## Task 4: Peer comparison (rebuild sister cities)

**Files:**
- Modify or replace: `src/components/ComparableCitiesRibbon.tsx` (or a new
  `src/components/cities/CityPeers.tsx`)
- Create: `src/lib/scores/city_peers.ts` (peer selection: nearest cities by score,
  size, and cost tier)
- Modify: `src/app/cities/[slug]/page.tsx` (render the peer block in the
  peer-comparison slot)
- Create: `scripts/audit/dryrun_city_peers.ts` (proof the peer picks are sane)

**What changes (new computed comparison, no invented figures):**
- Replace the restaurants-hardcoded sister-cities ribbon with a genuine "cities like
  this" read: pick the nearest peer cities by the city score, metro size, and cost
  tier, and show each with its score so the reader can compare. Each links to that
  city page (routing to peers). No per-activity hardcode.

- [ ] **Build:** implement `city_peers.ts` (deterministic peer selection from the
  city list); render the peer block; write `dryrun_city_peers.ts` that prints each
  Tier-1 city's chosen peers and asserts peers are distinct, exclude self, and are
  genuinely near in score/size/cost.
- [ ] **Run the dry-run** and show a few cities' peer picks to the founder.
- [ ] **Review + verify on preview:** the peer block replaces the old ribbon, peers
  are sensible and link correctly; one mobile shot.
- [ ] **Ship + confirm live.**

**Acceptance:** the old restaurants ribbon is gone; each city shows sensible peer
cities by score/size/cost, each linking to its page; dry-run sane.

---

## Deferred out of SP1 (handled in later sub-projects, gap-free)

- Remove culture spectrum + government scores from the city signature panel: paired
  with SP2 (they appear on the country page rebranded first).
- Remove the commercial-streets block: paired with SP3 (it appears on the
  neighborhood pages first).
- Remove the informality row + business-formation costs from the city surfaces:
  paired with SP2 (country page).
- Expand signature sectors to more cities: data work, sequenced with SP4 curation.
- The one allowed city signature visualization: held until it clearly earns a slot.

---

## Self-review

- **Spec coverage (§3):** cuts (Task 1), reorder (Task 1), curiosities cut (Task 1),
  board mute (Task 2), thin state (Task 2), activity ranking all-cities (Task 3),
  peer comparison (Task 4). Signature slim + relocations are explicitly deferred to
  SP2/SP3 to stay gap-free (documented above). Verdict anchored on break-in (Task 3
  sort). Covered.
- **No-new-number tasks (1, 2)** skip the dry-run by design; **new-number tasks
  (3, 4)** each carry a dry-run that is shown before shipping, per the founder rule.
- **Naming consistency:** `buildCityActivities` (existing) is extended, not renamed;
  new modules are `city_peers.ts`, dry-runs `dryrun_city_activities.ts` /
  `dryrun_city_peers.ts`. No slug renames anywhere.
- **Constraints:** tokens only (hex gate), no em-dashes, no source-agency names,
  section-order gate respected, per-file staging, no local build.
