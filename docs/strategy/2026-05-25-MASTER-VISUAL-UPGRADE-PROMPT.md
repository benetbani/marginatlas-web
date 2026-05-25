# MASTER VISUAL-UPGRADE PROMPT — Margin Atlas

**Date authored:** 2026-05-25 (after CitiesFix2 + Business-Formation v1.1.0 landed).
**Trigger:** Founder feedback: "it feels so clunky and unnatural still. Implement a visual upgrade plan please, be careful not to reformat everything, an upgrade, element hierarchy, visual order, cards, section elements placement, text hierarchy."
**Tools:** shadcn/ui primitives (copy-paste, React 19 safe) + Tremor Raw patterns (copy-paste, React 19 safe). The installed `ui-styling` skill is the reference.

**Tone of execution:** Surgical, not transformational. Every primitive replaces a hand-rolled equivalent that already exists. No page gets a from-scratch rewrite. Every section has a hard pass/fail.

---

## SECTION 0 — Canvas (what we are and are not doing)

### What this upgrade IS
- A consistency pass: replace ~12 different hand-rolled card chromes with **one Card primitive** and **one StatCard primitive** so the visual rhythm is the same on every page.
- A hierarchy pass: every page gets a clear visual order (eyebrow → H1 → subhead → primary surface → secondary surfaces → footer rail).
- A typography pass: tighten the font-display/body/caption/eyebrow ladder. Right now we have 4-5 different headline sizes drifting around.
- A density pass: introduce shadcn Tabs / Accordion / Tooltip / Separator / Badge where we currently have raw `<div>`s with ad-hoc styles.
- A chart pass: introduce Tremor-style BarList / SparkArea / ProgressBar for the 6-7 places we still render numbers as plain tables or text.

### What this upgrade IS NOT
- **Not a brand repaint.** Atlas-paper texture, vermillion (atlas-700 = #952509), cream-50 background, font-display serif, and the editorial caption style ALL STAY. shadcn defaults that look "Vercel-grey" must be retuned to Atlas tokens before use.
- **Not a content rewrite.** Headlines and body copy stay. We only restructure layout.
- **Not a URL change.** `/industries/{slug}`, `industry_id`, `cell_id`, etc. STAY. UI labels can change but slugs and data IDs cannot.
- **Not a behavioral change.** The Navigator form submit mechanic stays exactly as the §3 agent left it (router.push + ComboField). §4 button work is a SEPARATE task, not part of this visual upgrade.
- **Not a dependency explosion.** No new npm packages unless absolutely required. shadcn/ui ships as copy-paste files in `src/components/ui/`. Tremor Raw also ships as copy-paste. The only new runtime deps are the Radix UI primitives that specific shadcn components need (typically `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-accordion`, `@radix-ui/react-separator`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`). Each one must be justified by an actual use.

### Forbidden moves
- Adding the full shadcn theme CSS variables file and letting it override our atlas tokens. **We re-skin shadcn to atlas tokens, not the reverse.**
- Wrapping every existing `<div>` in a `<Card>` just because the primitive exists. Use it where the visual benefit is real (paper card, hover state, hierarchy).
- Replacing the Atlas font-display serif (Inter is shadcn's default — we do not use it for headlines).
- Removing the cream paper texture from any page that currently has it.
- Replacing the Navigator form with a shadcn `<Form>` + `react-hook-form` + `zod` stack. The form already works as the §3 agent shipped it. Touch the chrome only.
- Adding `lucide-react` to a page that already uses Phosphor without a deliberate icon replacement plan. Sectors use Phosphor Duotone — keep them.
- Introducing dark mode classes (`dark:bg-gray-900` etc.). Atlas is light-only by design. Strip dark variants from any shadcn snippet before copy-paste.
- Touching `app/api/*`, `lib/supabase/*`, `lib/budget.ts`, `withBudget`, or any data layer. This is a view-layer-only pass.

### Required moves
- Every primitive lands in `src/components/ui/` (the shadcn convention) AFTER being re-tokenized to atlas colors.
- Every page upgrade is a NARROW PR-shaped diff — replace one section's chrome at a time. No file gets rewritten end-to-end.
- After each section ships, run the full 10-gate prebuild chain. Any gate that newly fails blocks merge.
- The monetization-coverage HTML report stays green (per-page checklist already exists in `coverage/monetization-coverage.html`).
- All hard rules preserved: no em-dashes, no source-agency names, no padlock icons, no apologetic copy, no "Contact sales" tier, no "money-back guarantee", no 600MB RAM ceiling violation, no commit of `.env.local`, no `--no-verify`.

---

## SECTION 1 — Foundation: install + re-tokenize shadcn/ui

**Goal:** shadcn primitives are available in `src/components/ui/`, themed to atlas-paper / atlas-700 / cream-50 / font-display, NOT to default zinc/slate/Inter.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 1.1 | `src/components/ui/` exists with the chosen primitive set | yes | `ls` |
| 1.2 | shadcn `components.json` configured for Tailwind 3.4 / TS / `@/` alias | yes | file present |
| 1.3 | No `globals.css` override that breaks atlas tokens | atlas-paper, atlas-700, cream-50, ink-900, parchment all still resolve | grep + visual diff on homepage |
| 1.4 | shadcn primitives default font is `font-display` for headings and `font-sans` (existing Atlas sans) for body | yes | grep on each primitive |
| 1.5 | Dark mode classes stripped from copy-pasted primitives | zero `dark:` selectors in `src/components/ui/` | grep |
| 1.6 | `npm run prebuild` clean after install | all 10 gates green | run |
| 1.7 | `npx tsc --noEmit` clean after install | zero errors | run |
| 1.8 | Bundle size delta from installs | < 30KB gzipped for the FIRST PR (only the primitives actually wired up land in the bundle, the rest are tree-shaken) | `next build` output |

### Required deliverables

- Initialize shadcn via `npx shadcn@latest init` with: TypeScript yes, style "default", base color "slate" (we override anyway), CSS variables yes, `globals.css` path → existing `src/app/globals.css`, components path → `@/components`, utils path → `@/lib/utils`, react-server-components yes.
- After init, **immediately re-skin** the CSS variables in `globals.css` so:
  - `--background` → cream-50 hex
  - `--foreground` → ink-900 hex
  - `--card` → atlas-paper hex (the same #FAF6EE-ish tone we already use)
  - `--primary` → atlas-700 (#952509)
  - `--primary-foreground` → cream-50
  - `--border` → ink-200 hex
  - `--ring` → atlas-700/40
  - `--muted` → parchment hex
  - `--muted-foreground` → cocoa-700 hex
  - All `--radius` set to `1rem` (matches our `rounded-2xl` default).
- Add the seven primitives needed (one `add` command per primitive, in order): `button`, `card`, `badge`, `separator`, `tabs`, `tooltip`, `accordion`. Each one must be reviewed and dark-mode-stripped before commit.
- Add `cn()` util at `src/lib/utils.ts` (shadcn standard).
- Tremor primitives: shadcn does NOT ship Tremor. Tremor v3 npm package is React 18 only. Use **Tremor Raw** (copy-paste) for the three primitives we need: `BarList`, `ProgressBar`, `Tracker`. Source: tremor.so/docs/components.

### Acceptance criteria

- All 8 hard targets pass.
- Homepage renders identically to today (no visual delta yet — primitives are installed but unused).
- Storybook-style sanity page (optional) at `/dev/ui-primitives` showing each primitive in atlas skin.

---

## SECTION 2 — StatCard primitive (the most-used pattern on the site)

**Goal:** one canonical StatCard that replaces the four hand-rolled variants we have today (city hero overlay cards, cell page KPI strip, `/coverage/[iso2]` numbers, homepage hero stat tiles). All future stats use it.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 2.1 | `src/components/ui/stat-card.tsx` exists | yes | file present |
| 2.2 | Props: `label`, `value`, `unit?`, `guidingWord?`, `guidingColor?`, `caption?`, `tone?` ('default' / 'inverted'), `size?` ('sm' / 'md' / 'lg') | exact shape | grep |
| 2.3 | Built on shadcn `Card` primitive | yes | grep |
| 2.4 | Uses `font-display` for the value, atlas eyebrow style for the label, cocoa-700 caption | yes | grep |
| 2.5 | Renders the guiding word with `getGuidingWord()` color when passed | matches `src/lib/cities/guiding_word.ts` API | grep |
| 2.6 | Tabular-nums on the value | yes | grep |
| 2.7 | No padlock icon ever rendered (forbidden by v34 rules) | zero `<Lock />` | grep |

### Required deliverables

- New file `src/components/ui/stat-card.tsx` with the props above.
- Storybook coverage at `/dev/ui-primitives` showing: small, medium, large; with and without guiding word; with and without caption.
- Replace **only** the four call sites:
  1. `src/app/cities/[slug]/page.tsx` — the 8 hero overlay cards already render with a local `StatOverlayCard` component; migrate them to the shared `StatCard size="sm"` variant. Keep the 8-card layout exactly.
  2. `src/app/[country]/[geo]/[industry]/page.tsx` — the cell-page top KPI strip (revenue / margin / employees / firm density).
  3. `src/app/coverage/[iso2]/page.tsx` — country-coverage stat tiles at the top.
  4. `src/app/page.tsx` — the homepage hero stat trio under the rotating headline.
- Each replacement is a single commit. After each commit, screenshot the page before + after; if there's a visible regression that the founder did not approve, revert.

### Acceptance criteria

- All 7 hard targets pass.
- Four call sites use the shared primitive with no behavior or copy change.
- The city hero overlay still shows 8 cards in 2/4/8 col grid (mobile / tablet / desktop). Founder's last requirement preserved.

---

## SECTION 3 — Page-by-page upgrade matrix

**Goal:** every key page receives a targeted hierarchy + density upgrade. Each page is one commit. No page gets a full rewrite.

### The matrix

| # | Page | What changes | Primitives used | Hard pass/fail |
|---|---|---|---|---|
| 3.1 | `/` (homepage) | Hero spacing tightened: eyebrow + H1 + subhead + Navigator + stat strip + featured cells. Replace the 3 ad-hoc "Try" pill chips in the footer of Navigator with shadcn `Badge` variant `outline`. Featured-tiles use shared `Card` primitive with `hover:shadow-md`. | `Card`, `Badge`, `Separator`, `Tooltip` | Hierarchy: eyebrow text-[11px] uppercase tracking-[0.18em] atlas-700; H1 font-display text-3xl→6xl with text-balance; subhead text-base→lg cocoa-700/80. CLS=0. |
| 3.2 | `/cities` | Map untouched (already shipped CitiesFix2). Country-grouped list below gets `Tabs` for continent filter (Africa / Americas / Asia / Europe / Oceania / Middle East) instead of all continents stacked vertically. Each city card uses shared `Card`. | `Tabs`, `Card`, `Badge` | Default tab = "Americas" (most-trafficked). City flag in `Badge` chip. Per-card hover lift. |
| 3.3 | `/cities/[slug]` | Hero overlay cards already done in §2. Below the hero: introduce a `Tabs` with "Overview / Profitable / Saturated / Formation". Each tab is one of the existing components, just rehoused. | `Tabs`, `Card`, `Separator` | All 4 existing component sections still render. URL hash preserves tab state. |
| 3.4 | `/[country]/[geo]/[industry]` (cell page) | KPI strip → StatCard primitive (done in §2). The "Same industry across states" / "across countries" / "neighbors" / "variants" sections get a `Tabs` wrapper instead of stacking vertically. Methodology footnote moves into an `Accordion`. | `Tabs`, `Accordion`, `Card`, `StatCard`, `Tooltip`, `Separator` | Page LCP unchanged. All 5 secondary fetches still wrapped in `withBudget`. No tab takes longer than 100ms to switch (data already in DOM). |
| 3.5 | `/pricing` | Tier cards → shared `Card` primitive. Feature list uses `Separator` between rows. CTA → shared `Button` primitive (atlas-700 fill). Trust signals limited to 2 (v34 rule). No padlock icons. No "money-back guarantee" copy. No "Contact sales" tier. | `Card`, `Button`, `Badge`, `Separator` | v34 rules gate stays green. Tier labels still: Free / Atlas Pro. "Cancel anytime" copy verbatim (already shipped). |
| 3.6 | `/industries` | Activity index table → shared `Card` with per-row `hover:bg-cream-100/50`. Add a `Tabs` at the top to filter by sector (existing visibleSectors gate). | `Tabs`, `Card`, `Badge` | Term is "Activities" in UI; URL still `/industries/`. No source-agency leak. |
| 3.7 | `/sectors` + `/sectors/[sector]` | Sector tile grid uses shared `Card` with Phosphor Duotone icon. Sector page intro gets the eyebrow → H1 → subhead → KPI strip ladder. | `Card`, `Badge`, `Separator` | Phosphor icons stay; do NOT swap to lucide. |
| 3.8 | `/methodology` | Long-form essay gets `Accordion` per section (How we score / Where data comes from / What is excluded). Body remains markdown-rendered. | `Accordion`, `Separator` | All anchors still work. No source-agency names anywhere. |
| 3.9 | `/about-data` | Same accordion pattern as `/methodology`. | `Accordion`, `Separator` | Same. |
| 3.10 | `/compare` + `/compare/cities/[pair]` | KPI side-by-side strip uses shared `StatCard` with `size="sm"`. The compare table gets a `Tooltip` on every column header explaining what the metric means. | `StatCard`, `Tooltip`, `Card`, `Separator` | Tooltips show methodology text without leaving the page. |
| 3.11 | `/calculator` | The single-page calculator inputs get atlas-skinned shadcn `Input` and `Select` if useful — only if it visibly tightens the UI. Otherwise skip. | optional `Input`, `Select` | Result-card uses shared `Card`. |
| 3.12 | `/blog` + `/blog/[slug]` + `/learn` + `/learn/[slug]` | Card grid for index pages uses shared `Card`. Article header gets eyebrow → H1 → subhead ladder. | `Card`, `Separator`, `Badge` | Reading width capped at `max-w-prose`. font-display H2/H3 inside articles. |
| 3.13 | `/world` | Map untouched. Below the map: continent KPI strip uses shared `StatCard size="sm"`. | `StatCard`, `Card` | Map still terracotta dots. |
| 3.14 | `/coverage` + `/coverage/[iso2]` | Per-country stats already in §2. Coverage index page uses shared `Card` with `Badge` "100% / partial / planned" per country. | `Card`, `Badge`, `Separator` | Badge color: green-700 / amber-600 / parchment. No leaked source agencies. |
| 3.15 | `/account`, `/saved`, `/you` | Use shared `Card` for each section. Empty states keep the editorial caption style. | `Card`, `Separator` | No padlock icons. No "Upgrade now" hard sell on `/you`. |
| 3.16 | `/admin/*` | Internal-only. Use shared `Card` + `Tabs` for the three subpages. Lower visual priority. | `Card`, `Tabs`, `Badge` | Admin pages are noindex (already are). |
| 3.17 | `/download/2026-benchmarks` | Hero card uses shared `Card` with stronger shadow. CTA shared `Button`. | `Card`, `Button` | Lead-magnet form still works. |

### Acceptance criteria

- Every row's "Hard pass/fail" verifies.
- Every page screenshots before + after into `docs/visual-upgrade-screenshots/` so the founder can diff in 60 seconds.
- Zero pages regress on `npm run prebuild`.

---

## SECTION 4 — Tremor Raw chart primitives

**Goal:** three Tremor Raw primitives land where we currently render raw HTML tables or naked numbers. Charts are not decorative — they replace text-only renderings of distributions where a chart is materially more useful.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 4.1 | `BarList` in `src/components/ui/bar-list.tsx`, atlas-skinned | atlas-700 bars on parchment track | grep |
| 4.2 | `ProgressBar` in `src/components/ui/progress-bar.tsx`, atlas-skinned | atlas-700 fill, parchment empty | grep |
| 4.3 | `Tracker` in `src/components/ui/tracker.tsx`, atlas-skinned (used for data-coverage 12-month state) | green-700 / amber-600 / parchment cells | grep |
| 4.4 | No new npm package for Tremor | Tremor Raw is copy-paste only | `package.json` diff shows only added Radix + cva + clsx + tailwind-merge + lucide-react |

### Required call sites

- **Cell page** — replace the "businesses per 1000 people" table with `BarList` (top 8 activities in the country).
- **City page Saturation section** — `BarList` for the firm-density list (already a single-column table; the BarList renders the same data with bars in the row, no extra column needed).
- **`/coverage/[iso2]`** — `ProgressBar` for completion % per industry/sector.
- **Cell page methodology footnote** — `Tracker` for "data fresh in last 12 months" with a green/amber cell per month.
- **`/pricing`** — `ProgressBar` for "Free tier uses 3 of 10 monthly searches" if we surface that. (Skip if no usage state is wired up.)

### Acceptance criteria

- All 4 hard targets pass.
- At least 3 of the 5 call sites ship. The other 2 can be deferred if state is not available.
- No chart uses a default Tremor blue. Atlas vermillion or atlas-emerald only.

---

## SECTION 5 — Typography & spacing rationalization

**Goal:** the type ladder is consistent across every page. Today we have 4-5 different headline sizes drifting around.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 5.1 | H1 scale | `text-3xl md:text-5xl lg:text-6xl font-display tracking-tight text-balance` | grep on `<h1>` |
| 5.2 | H2 scale | `text-2xl md:text-3xl font-display tracking-tight text-balance` | grep |
| 5.3 | H3 scale | `text-xl md:text-2xl font-display tracking-tight` | grep |
| 5.4 | Eyebrow style | `text-[11px] uppercase tracking-[0.18em] font-semibold text-atlas-700` | grep |
| 5.5 | Subhead style | `text-base md:text-lg text-cocoa-700/80 max-w-2xl` | grep |
| 5.6 | Caption style | `text-xs text-cocoa-700/70` | grep |
| 5.7 | Body copy | `text-sm md:text-base text-ink-800 leading-relaxed` | grep |
| 5.8 | Section spacing | `mb-12 md:mb-16` between major sections; `space-y-6` within a section | grep |
| 5.9 | No headline ever uses `font-sans` | zero `<h1 class="*font-sans*">` | grep |

### Required deliverables

- A new file `src/lib/ui/typography.ts` exporting the canonical class strings (`H1`, `H2`, `H3`, `Eyebrow`, `Subhead`, `Caption`, `Body`) so future devs do not drift.
- A grep verifier `scripts/verify_typography_consistency.ts` that fails the build if a new `<h1>`/`<h2>`/`<h3>` doesn't match the canonical class string (allow opt-out via `data-typography="custom"`).
- Migrate any drift found during the audit to the canonical classes.

### Acceptance criteria

- All 9 hard targets pass.
- The verifier is added to the prebuild chain as gate #11.

---

## SECTION 6 — Mobile audit (highest-priority failure mode)

**Goal:** every page passes the 375px mobile audit. No horizontal overflow, no headline overflow, no broken card.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 6.1 | Zero horizontal scroll on every page at 375px | yes | manual screenshot pass |
| 6.2 | H1 wraps to ≤ 2 lines on every page at 375px | yes | screenshot |
| 6.3 | Every Tabs primitive scrolls horizontally if labels exceed viewport, not wraps | yes | `overflow-x-auto whitespace-nowrap` on TabsList |
| 6.4 | Every Accordion is full-width with no horizontal padding leak | yes | inspect |
| 6.5 | Every Card has explicit `px-4 md:px-6` interior padding | yes | grep |
| 6.6 | Buttons never wrap to 2 lines on mobile | yes | inspect |
| 6.7 | StatCard on mobile shrinks to `size="sm"` automatically | yes | grep |

### Acceptance criteria

- All 7 hard targets pass on a 320px and a 375px viewport.
- Founder loads `/cities/saint-petersburg`, `/us/california/restaurants`, `/pricing`, `/coverage/de`, and `/methodology` on mobile and sees no overflow.

---

## SECTION 7 — Quality checks (mandatory after every section)

After every section commit:

1. `npx tsc --noEmit` — zero errors.
2. `npm run prebuild` — all 10 (soon 11) gates green.
3. `npm run build` — Next.js production build succeeds, bundle-size delta logged.
4. `npm run audit:cell-smoke` — cell-page smoke against production passes.
5. Screenshot before + after into `docs/visual-upgrade-screenshots/`.
6. Manual eyeball on homepage, one city page, one cell page, `/pricing`.

After the WHOLE upgrade is shipped:

7. `npm run audit:monetization` — coverage HTML report still green.
8. `npm run audit:reality` — v24/v25 reality audit still green.
9. Lighthouse on `/` and `/us/california/restaurants` — CLS = 0, LCP < 2.5s, TBT < 200ms.
10. 24h production smoke — load 5 random cell pages from prod, no JS errors in Sentry.

---

## SECTION 8 — Execution order (sequential, not parallel)

This pass is sequential because each section depends on the previous one's primitives. Do NOT fan out to parallel agents until §1 is fully merged.

1. **§1** Foundation (shadcn install + retokenize). One commit. Manual review before §2.
2. **§2** StatCard primitive + 4 migration call sites. One commit per call site (4 commits).
3. **§5** Typography rationalization + new prebuild gate. One commit.
4. **§3.1, 3.2, 3.3, 3.4** in order (highest-traffic pages first: home, /cities, city page, cell page). One commit per page.
5. **§4** Tremor Raw primitives + 3 call sites. One commit per primitive + call site.
6. **§3.5 through 3.17** in order. One commit per page; group only if a page is < 10 lines of changes.
7. **§6** Mobile audit sweep. One commit per page that fails the audit, fixing only the failure.
8. **§7** Final quality checks. Zero new commits expected here.

---

## SECTION 9 — Acceptance criteria (the founder's pass/fail)

The whole upgrade is considered shipped when:

- Every section's hard targets verify.
- Founder loads the homepage, one city page, one cell page, /pricing, /coverage/us, /methodology, and /sectors/food and reports "this looks like one site, not 7 sites."
- The 10-gate (soon 11-gate) prebuild chain is green.
- Production deploy succeeds in fra1 in < 4 minutes.
- No regression in monetization-coverage HTML report.
- No regression in v34-research-rules gate (no padlocks, no .99 charm pricing, no apologetic copy, no "Contact sales", ≤ 2 trust signals per page, etc.).
- Sentry shows zero new client-side errors over 24h.

---

## SECTION 10 — Out-of-scope (deferred, not part of this pass)

Listed here so they are not silently dropped:

- **§4 Navigator button** still uses `router.push`. The bulletproof native `<form action="/api/go" method="get">` path is a SEPARATE task. If the button is reported broken again, that task gets prioritized BEFORE this upgrade can ship.
- **Dark mode.** Atlas is light-only by design. No dark mode.
- **i18n.** All copy is English. No translation pass.
- **Animation library.** No framer-motion, no @react-spring. shadcn Radix transitions are the only animations introduced.
- **Custom illustration art.** No new SVGs beyond what shadcn copy-pastes ship.
- **Email / popup CRO.** Out of scope.

---

## Approval gate

This is the design. Before any code lands:

1. Founder reviews this document.
2. Any section the founder wants to change, drop, or add gets edited inline.
3. Founder approves with "execute" (the established pattern).
4. Then, and only then, an agent starts at SECTION 1.

Approval requested.
