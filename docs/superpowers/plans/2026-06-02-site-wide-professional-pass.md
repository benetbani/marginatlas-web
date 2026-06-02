# Site-Wide Professional Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make marginatlas.com read as one professional product by unifying the design language across every user-facing surface, fixing the concrete visual errors and brand violations the 2026-06-02 audit found, and promoting the finished v2 components after a de-blue pass.

**Architecture:** A foundation tranche (semantic delta tokens + a regression gate), then one shipped-and-verified production deploy per surface, then global fixes, then S3 v2 promotions. Every tranche is independently shippable; a failed Vercel build never promotes, so production stays safe.

**Tech Stack:** Next.js 15.5, React 19.2, TypeScript 5 (strict), Tailwind 3.4 driven by `src/lib/design-tokens.ts`, prebuild gates run by `scripts/prebuild_all.ts`, Supabase reads in `src/lib/cells`. Local `next build`/`dev` OOM; Vercel is the compiler.

**Source spec:** `docs/superpowers/specs/2026-06-02-site-wide-professional-pass-design.md`

---

## Conventions (read once, applied by every task)

These recipes are defined here so individual tasks do not repeat them.

### C1. The eyebrow conversion recipe
Replace any hand-rolled eyebrow label with the primitive.
- Before (any of): `<div|p|span className="... uppercase ... tracking-[wide|0.16em|0.22em|wider] ... text-atlas-600|700|cocoa-700/60 ...">LABEL</...>`
- After: `<SectionEyebrow size="md">LABEL</SectionEyebrow>` (light surfaces) or `<SectionEyebrow tone="inverse" size="md">LABEL</SectionEyebrow>` (dark/atlas-paper-dark surfaces).
- Add the import once per file: `import { SectionEyebrow } from "@/components/ui/section-eyebrow";`
- Preserve any margin the old element carried by moving it to `className` (e.g. `className="mb-3"`).
- If the old eyebrow sat as the first child of a CSS grid `<section>`, move it ABOVE the grid (a grid child becomes a grid cell). Wrap in a fragment if needed.

### C2. The card conversion recipe
Replace hand-rolled card shells (`rounded-2xl border ... shadow-[...]` or inline `rgba(...)` borders) with the canonical surface.
- Prefer the existing `.atlas-card` / `.atlas-card-soft` / `.atlas-card-band` utility classes (already in `globals.css`), or the `ui/card` component (`import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";`) where the header/title/content slots fit.
- Never introduce a new inline `shadow-[...]` or `border-[rgba(...)]`. Use tokens.

### C3. Spacing rhythm
Section vertical padding uses one ladder: `py-10 md:py-14` for standard bands, `py-12 md:py-16` for major bands. Replace ad hoc `py-4`/`py-8` on top-level sections with the nearest ladder value. Do not touch inner-component padding.

### C4. Per-tranche verification (the "tests")
There is no unit harness for UI. Each surface/render task verifies via:
1. `npx tsc --noEmit 2>&1 | grep "error TS" | grep -vc "design-assets/"` returns `0`.
2. Dash + agency scan on changed files returns clean:
   `grep -nP "[\x{2014}\x{2013}]" <files>` (only pre-existing comment hits allowed) and
   `grep -niE "eurostat|destatis|insee|e-stat|\bcensus\b|\bBLS\b|\bATO\b|ibge" <files>` (none new).
3. Stage exact files, commit ending with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`, push `main`.
4. Poll Vercel: `gh api repos/benetbani/marginatlas-web/commits/$(git rev-parse HEAD)/status --jq .state` until `success`.
5. Curl the affected prod URL with browser headers and grep for the unified signature
   (`leading-none`, `tracking-[0.18em]`) and the specific fix. Confirm HTTP 200.

Browser-header curl helper (no admin key needed for public pages):
```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
curl.exe -sL -o /tmp/p.html -w "%{http_code}\n" --max-time 30 -A "$UA" -H "Accept-Language: en-US,en;q=0.9" -H "Accept: text/html" "<URL>"
```

### C5. Guardrails (every task)
No em-dashes in `src/**`; no source-agency names in copy; tokens only; stage exact paths (never `git add -A`, the tree carries regenerated `data/audit/*` + `tsbuildinfo` noise); no `--no-verify`/`--no-gpg-sign`/force-push.

---

## Phase 0: Foundation

### Task 0.1: Semantic delta color tokens

**Files:**
- Modify: `src/lib/design-tokens.ts` (the `colors` object, after the `tier` block; and `tailwindColors`)

- [ ] **Step 1: Add the delta token group to `colors`**

In `src/lib/design-tokens.ts`, immediately after the `tier: { ... }` block and before `parchment:`, add:
```ts
  /**
   * Delta / multiplier indicators (above, at par, caution, below). Semantic,
   * reusing the warm palette so we stop hardcoding green/yellow/red hex like
   * #16A34A / #CA8A04 / #7F1D1D in neighborhood and decide pages.
   */
  delta: {
    positive: "#3f6212", // = moss-700, above par
    atpar: "#952509", //    = atlas-700, at par
    caution: "#f87850", //  = atlas-300, watch
    negative: "#991b1b", // = clay-700, below par
  },
```

- [ ] **Step 2: Expose delta through Tailwind**

In the same file, in `tailwindColors`, add `delta: colors.delta,` after the `tier: colors.tier,` line.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -c "error TS" ` ; Expected: a number that does NOT increase vs baseline (run before and after). The token change is type-safe.

- [ ] **Step 4: Commit (do not push yet; rides with Task 0.2)**

```bash
git add src/lib/design-tokens.ts
git commit -m "tokens: add semantic delta color scale (positive/atpar/caution/negative)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 0.2: Hardcoded-hex regression gate

**Files:**
- Create: `scripts/verify_hardcoded_hex.ts`
- Create: `scripts/hardcoded_hex_baseline.json` (generated)
- Create: `scripts/__tests__/verify_hardcoded_hex.test.ts`
- Modify: `package.json` (add to the `prebuild` gate list)

- [ ] **Step 1: Write the gate**

Create `scripts/verify_hardcoded_hex.ts`. It walks `src/app` and `src/components` `.tsx` files, counts 3/6-digit hex literals (`#[0-9a-fA-F]{3,6}` word-bounded), compares each file against a committed baseline, and fails if any file exceeds its baseline count or a non-baselined file introduces hex. Excludes files that legitimately need raw color.
```ts
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { globSync } from "glob";

const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
// Files that legitimately carry raw color (palette source, raster/OG, SVG maps).
const EXCLUDE = [
  "src/lib/design-tokens.ts",
  "src/app/icon.tsx",
  "src/app/apple-icon.tsx",
  "src/app/og/**",
  "src/components/**/*WorldMap*.tsx",
  "src/components/cities/CitiesWorldMap.tsx",
  "src/components/**/*Map*.tsx",
];
const BASELINE = "scripts/hardcoded_hex_baseline.json";

export function scan(): Record<string, number> {
  const files = globSync("src/{app,components}/**/*.tsx", { ignore: EXCLUDE });
  const counts: Record<string, number> = {};
  for (const f of files) {
    const m = readFileSync(f, "utf8").match(HEX);
    if (m && m.length) counts[f.replace(/\\/g, "/")] = m.length;
  }
  return counts;
}

function main() {
  const counts = scan();
  if (process.argv.includes("--update-baseline")) {
    writeFileSync(BASELINE, JSON.stringify(counts, null, 2) + "\n");
    console.log(`Baseline written: ${Object.keys(counts).length} files.`);
    return;
  }
  const baseline: Record<string, number> = existsSync(BASELINE)
    ? JSON.parse(readFileSync(BASELINE, "utf8"))
    : {};
  const violations: string[] = [];
  for (const [file, n] of Object.entries(counts)) {
    const allowed = baseline[file] ?? 0;
    if (n > allowed) violations.push(`${file}: ${n} hex (baseline ${allowed})`);
  }
  if (violations.length) {
    console.error("Hardcoded hex regression:\n" + violations.join("\n"));
    console.error("\nTokenize the new hex, or if intentional run: npx tsx scripts/verify_hardcoded_hex.ts --update-baseline");
    process.exit(1);
  }
  console.log("verify_hardcoded_hex: no new hardcoded hex.");
}

if (process.argv[1] && process.argv[1].includes("verify_hardcoded_hex")) main();
```

- [ ] **Step 2: Write the test**

Create `scripts/__tests__/verify_hardcoded_hex.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { scan } from "../verify_hardcoded_hex";

describe("verify_hardcoded_hex", () => {
  it("does not flag the token source file (excluded)", () => {
    const counts = scan();
    expect(counts["src/lib/design-tokens.ts"]).toBeUndefined();
  });
  it("returns a plain map of file to positive count", () => {
    const counts = scan();
    for (const n of Object.values(counts)) expect(n).toBeGreaterThan(0);
  });
});
```
(If the repo has no vitest, run the test file with `npx tsx` asserting manually; check `package.json` for the test runner first and match it.)

- [ ] **Step 3: Seed the baseline**

Run: `npx tsx scripts/verify_hardcoded_hex.ts --update-baseline`
Expected: writes `scripts/hardcoded_hex_baseline.json` listing ~47 current offenders. This makes the gate green today and blocks only NEW hex.

- [ ] **Step 4: Run the gate to verify it passes now**

Run: `npx tsx scripts/verify_hardcoded_hex.ts`
Expected: `verify_hardcoded_hex: no new hardcoded hex.` (exit 0)

- [ ] **Step 5: Prove it catches a regression**

Temporarily add `const x = "#123456";` to any non-excluded component, run the gate, expect exit 1 with that file listed, then revert the temporary line.

- [ ] **Step 6: Wire into prebuild**

In `package.json`, add `npx tsx scripts/verify_hardcoded_hex.ts` to the `prebuild` script chain (alongside `verify_no_em_dashes`). Keep parallel concurrency <= 4.

- [ ] **Step 7: Commit + push (Phase 0 deploys; carries the spec + delta tokens)**

```bash
git add scripts/verify_hardcoded_hex.ts scripts/hardcoded_hex_baseline.json scripts/__tests__/verify_hardcoded_hex.test.ts package.json
git commit -m "gate: verify_hardcoded_hex (baseline-snapshot, blocks new hex only)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push origin main
```

- [ ] **Step 8: Verify deploy green**

Poll `gh api repos/benetbani/marginatlas-web/commits/$(git rev-parse HEAD)/status --jq .state` until `success`. Confirm the Vercel prebuild ran the new gate (no build failure).

---

## Phase 1: Per-surface slices (one deploy each)

Each task: apply C1 (eyebrows), C2 (cards), C3 (spacing) to the surface, tokenize its hex using the delta/atlas/cream tokens, fix the surface-specific bugs, then verify per C4.

### Task 1.1: Pricing

**Files:**
- Modify: `src/app/pricing/page.tsx`
- Modify: `src/components/billing/PricingFAQ.tsx` (eyebrows only, if present)

- [ ] **Step 1: Retire the brand breach.** Find the button shadow at `pricing/page.tsx:236-237` containing `rgba(22,174,181,...)` (sibling-product teal, violates R-001). Replace the whole `shadow-[...]` with the token shadow `shadow-[0_1px_3px_rgb(0_0_0/0.05),_0_8px_28px_rgb(0_0_0/0.06)]` (the `elevation.card` value) or the `.atlas-card` class.
- [ ] **Step 2: Remove the stub.** Replace the "Coming soon. Drop your email below..." copy at `pricing/page.tsx:278` and the "Notify me when Basic/Premium opens" CTAs with honest live copy that matches the real tier state (the tiers are designed, billing deferred): e.g. headline "Plans" and a single newsletter line "We will email you when paid plans open." No "coming soon" phrasing (R-016).
- [ ] **Step 3: Eyebrows.** Convert the eyebrows at lines ~103,129,181 (the `text-[11px] tracking-[0.22em]`) and the table headers ~138,140,153 to `SectionEyebrow size="md"` per C1. This also removes the `text-[11px]` token violation.
- [ ] **Step 4: Cards.** Convert the plan cards (~206,243) to `.atlas-card` per C2.
- [ ] **Step 5: Verify** per C4. Prod check: curl `https://marginatlas.com/pricing`, assert 200, assert `grep -c "rgba(22,174,181" /tmp/p.html` is `0`, assert `grep -ic "coming soon" /tmp/p.html` is `0`, assert `tracking-\[0.18em\]` present.
- [ ] **Step 6: Commit + push + confirm green** (C4 steps 3-5).

### Task 1.2: Compare

**Files:**
- Modify: `src/app/compare/page.tsx`, `src/app/compare/CompareClient.tsx`, `src/app/compare/cities/[pair]/page.tsx`

- [ ] **Step 1:** Convert the header eyebrow at `CompareClient.tsx:156` (and any in the pair page) to `SectionEyebrow size="md"` per C1.
- [ ] **Step 2:** Replace the bare/undefined `.card` usages at `CompareClient.tsx:155,213` with `.atlas-card` per C2.
- [ ] **Step 3:** Give `compare/page.tsx` a header eyebrow (it currently has none) using `SectionEyebrow`.
- [ ] **Step 4: Verify** per C4 (curl `/compare`, 200, unified signature present).
- [ ] **Step 5: Commit + push + confirm green.**

### Task 1.3: Cities

**Files:**
- Modify: `src/app/cities/page.tsx`, `src/app/cities/[slug]/page.tsx`, `src/app/cities/[slug]/neighborhoods/page.tsx`

- [ ] **Step 1:** Convert eyebrows at `cities/page.tsx:114` and `cities/[slug]/page.tsx:339,378,416` to `SectionEyebrow size="md"` per C1.
- [ ] **Step 2:** Replace the inline `border-[rgba(76,39,18,0.10)] shadow-[...]` card at `cities/page.tsx:129` with `.atlas-card` per C2.
- [ ] **Step 3:** Tokenize the delta hex at `cities/[slug]/neighborhoods/page.tsx:125-130` (`#14532D #16A34A #CA8A04 #7F1D1D`) to `text-delta-positive` / `text-delta-atpar` / `text-delta-caution` / `text-delta-negative` (map by the multiplier band each represents).
- [ ] **Step 4: Verify** per C4 (curl `/cities` and one `/cities/<slug>`). Confirm `verify_hardcoded_hex` passes (the delta hex are gone, so update baseline only if a legitimately-excluded file changed).
- [ ] **Step 5: Commit + push + confirm green.**

### Task 1.4: Sectors

**Files:**
- Modify: `src/app/sectors/[sector]/page.tsx`

- [ ] **Step 1:** Convert the eyebrow at line 87 (`tracking-wider`) to `SectionEyebrow size="md"` per C1.
- [ ] **Step 2:** Tokenize the `#F5F5F5` header fallback at line 81 to `cream-100` (`bg-cream-100`), removing the inline `style`.
- [ ] **Step 3:** Normalize section padding at lines 112,145,164 to the C3 ladder.
- [ ] **Step 4: Verify** per C4 (curl one `/sectors/<id>`).
- [ ] **Step 5: Commit + push + confirm green.**

### Task 1.5: Industries

**Files:**
- Modify: `src/app/industries/page.tsx`

- [ ] **Step 1: Confirm intent.** Check git history of `industries/page.tsx` for whether the Popular / A-Z / emoji sections (audit B4/B6/B7) were deliberately removed. If deliberate, skip restoration and only unify the eyebrow; note it in the commit. If unintentional, proceed.
- [ ] **Step 2:** Restore the Popular section (top N industries), the A-Z alphabetical listing, and the sector emoji glyphs next to category names, matching the patterns used on `/sectors`.
- [ ] **Step 3:** Convert the eyebrows at lines 42,62 (`tracking-[0.16em]`) to `SectionEyebrow size="md"` per C1.
- [ ] **Step 4: Verify** per C4 (curl `/industries`, confirm Popular + A-Z markers render).
- [ ] **Step 5: Commit + push + confirm green.**

### Task 1.6: Calculator

**Files:**
- Modify: `src/app/calculator/page.tsx`, `src/components/CalculatorForm.tsx`

- [ ] **Step 1:** Convert the eyebrow at `calculator/page.tsx:31` to `SectionEyebrow size="md"` per C1.
- [ ] **Step 2:** Convert the custom link blocks (lines 58-77) to `.atlas-card` per C2.
- [ ] **Step 3:** Check the `grid-cols` at `CalculatorForm.tsx:268` for a missing mobile breakpoint; add `sm:`/`md:` prefixes if it overflows at 320px.
- [ ] **Step 4: Verify** per C4 (curl `/calculator`).
- [ ] **Step 5: Commit + push + confirm green.**

### Task 1.7: About-data

**Files:**
- Modify: `src/app/about-data/page.tsx`

- [ ] **Step 1:** Add `SectionEyebrow` labels above the page sections (currently a naked h1 + narrative). Give each major section an eyebrow + heading for hierarchy. Keep copy generic (no source-agency names, R-002).
- [ ] **Step 2: Verify** per C4 (curl `/about-data`).
- [ ] **Step 3: Commit + push + confirm green.**

### Task 1.8: Neighborhoods

**Files:**
- Modify: `src/app/[country]/[geo]/page.tsx` (neighborhood view), `src/app/cities/[slug]/neighborhoods/page.tsx` (if any eyebrow/card left from 1.3)

- [ ] **Step 1:** Convert the eyebrow at `[country]/[geo]/page.tsx:136` to `SectionEyebrow size="md"` per C1.
- [ ] **Step 2:** Convert the hand-rolled card at `[country]/[geo]/page.tsx:134` to `.atlas-card` per C2.
- [ ] **Step 3:** Add the missing sibling-neighborhood links (audit H6) and the parent-city back-link (H9) to the neighborhood view.
- [ ] **Step 4: Verify** per C4 (curl one neighborhood URL).
- [ ] **Step 5: Commit + push + confirm green.**

---

## Phase 2: Global fixes

### Task 2.1: EU/NUTS2 region-name resolution

**Files:**
- Modify: `src/lib/cells/geo.ts` (`geoNameFromSlug`)
- Test: `src/lib/cells/__tests__/geo_region_name.test.ts`
- Reference: `data/coverage/admin1_regions_v1.json`

- [ ] **Step 1: Inspect the data shape.** Read `data/coverage/admin1_regions_v1.json` and confirm the key->name shape (e.g. `{ "ES511": "Extremadura", ... }` or nested). Note the exact accessor.
- [ ] **Step 2: Write the failing test.**
```ts
import { describe, it, expect } from "vitest";
import { geoNameFromSlug } from "../geo";
describe("geoNameFromSlug EU regions", () => {
  it("resolves a NUTS2 code to its region name", () => {
    expect(geoNameFromSlug("es511", "es")).toBe("Extremadura");
  });
  it("falls back to the slug when unknown", () => {
    expect(geoNameFromSlug("zz999", "zz")).toBeTruthy();
  });
});
```
- [ ] **Step 3: Run it, expect FAIL** (currently returns "ES511" or the raw code).
- [ ] **Step 4: Implement.** In `geoNameFromSlug`, before the final fallback, add an admin1 lookup: import the JSON, normalize the slug to the file's key casing (likely upper-case the code), return the mapped name if present. Keep the existing override/alias chain ahead of it only where those are more specific (city overrides must still win over a region code).
- [ ] **Step 5: Run the test, expect PASS.**
- [ ] **Step 6: Dry-run on real cells (show before/after).** Curl prod is the old behavior; locally, log `geoNameFromSlug` for `es511/es`, plus 2-3 other EU regions (e.g. `de21/de`, `fr10/fr`). Confirm names resolve. Paste the before/after to the founder.
- [ ] **Step 7: tsc + commit + push + verify on prod.** After deploy, curl `https://marginatlas.com/es/es511/restaurants` with browser headers and confirm the region name (not "ES511") appears in the title/breadcrumb.

### Task 2.2: og:title, Speed Insights, mobile text

**Files:**
- Modify: `src/app/page.tsx` (metadata), `src/app/layout.tsx` (Speed Insights), `src/app/blog/page.tsx:28`, `src/app/blog/[slug]/page.tsx:50`, `src/app/not-found.tsx:29`, `src/components/SmartImage.tsx:86`

- [ ] **Step 1:** Add `openGraph: { title: "..." }` (and a matching `title`) to the homepage `metadata` export (audit E4).
- [ ] **Step 2:** Wire Speed Insights (audit G7): add `@vercel/speed-insights/next` `<SpeedInsights />` to `layout.tsx` if the package is present; if not present, skip and note it (no new paid dependency without approval).
- [ ] **Step 3:** Add base/`sm:` sizes to the 4 flagged headings so 320px does not get desktop size (e.g. `text-3xl sm:text-5xl md:text-7xl`).
- [ ] **Step 4: Verify** per C4 (curl `/`, grep `og:title`; curl `/blog`).
- [ ] **Step 5: Commit + push + confirm green.**

### Task 2.3: Data-confidence treatment for implausible cells

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx` (banner near the hero), `src/lib/cells.ts` or the relevant list accessors (exclusion from top/featured)
- Reference: `data/audit/page_sanity_audit_v1.json` (the 449 flagged cells, the bound logic)

- [ ] **Step 1: Define the trip condition.** Reuse the existing page-sanity bound logic (the same bounds `enforceSanity` uses) to compute `isImplausibleExtrapolation(cell)`: true when `coverage_tier === "X"` AND revenue trips the SMB bound. Put this helper next to `enforceSanity`.
- [ ] **Step 2: Banner.** When `isImplausibleExtrapolation(cell)`, render a quiet low-confidence banner on the cell page (reuse `CellFallbackBanner`/`CoverageIndicator` styling, no new component if one fits): "This figure is a low-confidence estimate and may be off." No source-agency names.
- [ ] **Step 3: Exclude from discovery lists.** In `getTopCells` / `getTopRegionalCells` / featured selection, filter out rows where `isImplausibleExtrapolation` is true so they never headline.
- [ ] **Step 4: Dry-run + show.** Pick one known-bad cell (from the audit JSON, e.g. an island-nation extrapolated cell) and one known-good measured cell; show the founder that the banner appears on the bad one and not the good one, and that top lists no longer surface the bad one.
- [ ] **Step 5: tsc + commit + push + verify on prod** (curl the known-bad cell, confirm banner; curl a top-list page, confirm the bad cell is absent).

---

## Phase 3: S3 (v2 promotions)

### Task 3.1: De-blue + tokenize CoverageHubV2 and CountryScorecardV2

**Files:**
- Modify: `src/components/v2/CoverageHubV2.tsx`, `src/components/v2/CountryScorecardV2.tsx`

- [ ] **Step 1:** Replace every hardcoded tier-dot hex (the green `#1F8A4C`, the blue `#2563EB`, the vermillion `#D73A14`, the graphite `#3A3A3A`) with `TierDot` (`import { TierDot } from "@/components/ui/tier-dot";`) mapping deep/good/starter/modeled. The blue is fully retired.
- [ ] **Step 2:** Tokenize the remaining hardcoded hex in both files (text/border colors) to atlas/ink/cocoa/cream tokens.
- [ ] **Step 3: Verify** the `/_design/v2-review` admin page still renders these two on mock data with warm dots (curl with the admin key, confirm no `#2563EB` in the page CSS for these components). tsc + `verify_hardcoded_hex` pass (their counts drop; update baseline for these two files).
- [ ] **Step 4: Commit + push + confirm green** (no public surface changes yet).

### Task 3.2: Promote CoverageHubV2 into a real /coverage hub

**Files:**
- Modify: `src/app/coverage/page.tsx` (currently a redirect)
- Reference: coverage data source (`src/lib/coverage/*`, `data/coverage/*`, or a DB count accessor)

- [ ] **Step 1:** Build a server accessor that returns the `countries` array CoverageHubV2 expects (`{ iso2, name, tier, cellCount, lastRefreshed }`) from real coverage data. Reuse existing coverage lib functions; do not invent counts.
- [ ] **Step 2:** Replace the `permanentRedirect` in `coverage/page.tsx` with a page that renders `CoverageHubV2` fed by that accessor. Keep `/world` intact and add a cross-link between them (no slug rename, R-003-style SEO safety).
- [ ] **Step 3:** Add `/coverage` to `sitemap.ts` and a nav/footer link (R-022).
- [ ] **Step 4: Dry-run + show.** Founder reviews the before (redirect) vs after (hub) on the deploy.
- [ ] **Step 5: tsc + commit + push + verify on prod** (curl `/coverage`, 200, hub content present, warm tier dots, no `#2563EB`).

### Task 3.3: Promote CountryScorecardV2 onto the country page

**Files:**
- Modify: `src/app/[country]/page.tsx`
- Reference: `getCountryEconomicsSnapshot`, `getTopIndustriesForCountry`, the existing `CountryAtAGlance` props

- [ ] **Step 1:** Build the `CountryScorecardV2` props (`iso2, name, tier, cellCount, industriesCovered, citiesCovered, yearRange, sampleIndustries[], sampleCities[]`) from real country data accessors. Map coverage tier to the v2 `tier` union.
- [ ] **Step 2:** Render `CountryScorecardV2` on the country page in place of (or above) the `CountryAtAGlance` + `CountrySignaturePanel` stack. Keep whichever still adds value; remove genuine duplication.
- [ ] **Step 3: Dry-run + show** on `/de` (before/after).
- [ ] **Step 4: tsc + commit + push + verify on prod** (curl `/de`, 200, scorecard present, warm dots).

---

## Self-Review

**Spec coverage:** every spec section maps to a task. Phase 0 spec.3 -> Tasks 0.1, 0.2. Phase 1 spec.4 table (8 surfaces) -> Tasks 1.1-1.8 (same order). Phase 2 spec.5 -> Tasks 2.1 (region names), 2.2 (og/speed/mobile), 2.3 (449-cell treatment). Phase 3 spec.6 -> Tasks 3.1 (de-blue), 3.2 (/coverage hub), 3.3 (country scorecard). Verification protocol spec.7 -> Convention C4. No gaps.

**Placeholder scan:** code-bearing steps carry real code (delta tokens, the gate, the geo test). The mechanical surface conversions reference the C1/C2/C3 recipes by exact file:line from the audit rather than repeating identical code, which is DRY, not a placeholder. The one genuine unknown (industries-section intent, Task 1.5 Step 1; coverage data accessor shape, Task 3.2 Step 1) is written as an explicit inspect-first step, not a vague TODO.

**Type consistency:** `SectionEyebrow` (size "md"/"sm", tone "default"/"muted"/"inverse"), `TierDot` (tier deep/good/starter/modeled), `delta.{positive,atpar,caution,negative}`, and `isImplausibleExtrapolation(cell)` are used consistently across tasks.

---

## Notes for the executor

- Run tasks strictly in order; each depends on the foundation (delta tokens, the gate) from Phase 0.
- After tokenizing hex in a surface, the `verify_hardcoded_hex` baseline for that file should DECREASE; only run `--update-baseline` when an EXCLUDED file legitimately changed, never to silence a real new literal.
- If a Vercel build fails, production stays on the prior deploy; read the build log, fix, re-push. Do not force anything.
- Founder halts or reorders at any tranche boundary.
