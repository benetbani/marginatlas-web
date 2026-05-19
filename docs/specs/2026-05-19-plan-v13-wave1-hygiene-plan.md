# Plan v13 Wave 1 — Hygiene Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. This plan covers Wave 1 only — Waves 2 and 3 will be separate plans authored after Wave 1 ships.

**Goal:** Strip embarrassing engineering artifacts and unreliable data columns from the public site to restore founder-grade credibility. Ships in ~1 day.

**Architecture:** Pure-render-layer changes. No DB writes, no schema changes, no data backfill. A single new helper (`formatRecency`) for year strings, a single new helper (`hasRegionalCoverage`) for region-tab gating, and surgical edits across cell/country/geo page templates + shared components.

**Tech Stack:** Next.js 15 App Router, React 19 RC, TypeScript strict, Tailwind 3.4. Verification via `next lint`, `next build`, and the running preview server at `http://localhost:3001`.

**Project peculiarities:**
- Repo lives at `E:\atlas\website\` (git tracked)
- No test framework installed — verification is preview-browser + lint + build
- Preview dev server is already running on port 3001 (`atlas-dev` in the preview MCP)
- `npm run prebuild` runs `verify_taxonomy.ts` automatically

---

## File Map

**New files (2):**
- `src/lib/format/recency.ts` — `formatRecency()` helper, always returns "Most recent data" for public surfaces
- `src/lib/coverage/regional.ts` — `hasRegionalCoverage(iso2)` helper backed by a pre-computed JSON manifest

**New data file (1):**
- `data/coverage/regional_coverage_v1.json` — `{iso2: boolean}` map of which countries have any `regional_cells` rows. Built once by a one-off script.

**Modified files (estimated 8-12):**
- `src/app/[country]/[geo]/[industry]/page.tsx` — strip year displays, strip n-firms tile
- `src/app/[country]/page.tsx` — strip year, strip n-firms column, wire region-tab gating
- `src/app/[country]/[geo]/page.tsx` — strip year, strip n-firms column
- `src/app/industries/[industry]/page.tsx` — strip year, strip n-firms references
- `src/components/CountryFlag.tsx` (or wherever flag is) — strip 3D/wave effects
- `src/components/CompareTable.tsx` — strip n-firms column
- `src/components/CellWarningChips.tsx` — strip engineering jargon chips ("coverage TBC", "data 2018-2020", "490 cells")
- Any other component containing literal year strings or n-firms references (Grep will reveal them)

---

## Task 0: Audit pass — find every offending string

**Files:**
- Read-only scan; no edits this task

- [ ] **Step 1: Find every year-string occurrence in public render paths**

Run from `E:\atlas\website`:

```bash
npx grep -rn --include='*.tsx' --include='*.ts' -E '\b20[12][0-9]\b' src/app src/components | grep -v admin | grep -v __tests__
```

Capture output. Expected: 20-80 hits. Most will be the patterns we need to strip (year column headers, "data from 2024", year ranges in tooltips).

- [ ] **Step 2: Find every # firms reference**

```bash
npx grep -rn --include='*.tsx' --include='*.ts' -E 'n_enterprises|number.of.firms|n_firms|firmCount|enterprisesCount|enterprises_count|#\s*firms' src/app src/components | grep -v admin
```

Expected: 5-15 hits across cell page, country page, comparison table, calculator.

- [ ] **Step 3: Find every "coverage TBC" / cell-count / engineering jargon string**

```bash
npx grep -rn --include='*.tsx' --include='*.ts' -E 'coverage TBC|cells in this|n=\d+ cells|n_cells|confidence_score|cell count' src/app src/components | grep -v admin
```

Expected: 3-10 hits, mostly in CellWarningChips and footer disclosures.

- [ ] **Step 4: Find the flag component**

```bash
npx grep -rln --include='*.tsx' -i 'flag' src/components src/app/[country]/page.tsx 2>/dev/null
```

Identify the flag-rendering component (likely `src/components/CountryFlag.tsx` or inline in `[country]/page.tsx`).

- [ ] **Step 5: Capture findings in a scratch file**

Write the consolidated audit list to `docs/specs/2026-05-19-wave1-audit-findings.md` so Tasks 1-9 have a reference. Format:

```markdown
# Wave 1 Audit Findings

## Year-string hits (N total)
- src/app/[country]/[geo]/[industry]/page.tsx:142 — "Data from 2024"
- ...

## # firms hits (N total)
- src/components/CompareTable.tsx:88 — `n_enterprises` column header
- ...

## Engineering jargon hits (N total)
- src/components/CellWarningChips.tsx:42 — "coverage TBC"
- ...

## Flag component location
- src/components/CountryFlag.tsx
```

- [ ] **Step 6: Commit the audit findings**

```bash
git add docs/specs/2026-05-19-wave1-audit-findings.md
git commit -m "plan v13 wave 1: audit findings for hygiene pass"
```

---

## Task 1: Create formatRecency helper

**Files:**
- Create: `src/lib/format/recency.ts`

- [ ] **Step 1: Write the helper**

```typescript
/**
 * Plan v13 Wave 1 — recency label helper.
 *
 * Public-facing pages must NEVER display raw year strings or year
 * ranges. The user shouldn't have to interpret "data 2018-2020" or
 * wonder why one cell says 2019 and another 2024. We collapse all
 * vintage information into a single calm phrase.
 *
 * Internal surfaces (/admin/review, debugging panels) should bypass
 * this helper and show real years.
 */

export type RecencyInput =
  | number
  | string
  | { from?: number | string | null; to?: number | string | null }
  | null
  | undefined;

/**
 * Always returns "Most recent data" for public render paths.
 * The argument is ignored on purpose — included so callers can pass
 * existing `year` props without rewriting calling code.
 */
export function formatRecency(_input?: RecencyInput): string {
  return "Most recent data";
}

/**
 * Escape hatch for /admin/review and other internal surfaces.
 * Returns the actual year string ("2024", "2018–2020", etc.) for
 * debugging contexts where vintage matters.
 */
export function formatRecencyDebug(input: RecencyInput): string {
  if (input == null) return "—";
  if (typeof input === "number") return String(input);
  if (typeof input === "string") return input;
  const { from, to } = input;
  if (from && to && from !== to) return `${from}–${to}`;
  return String(from ?? to ?? "—");
}
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd E:/atlas/website && npx tsc --noEmit src/lib/format/recency.ts 2>&1 | head -10
```

Expected: no output (clean compile).

- [ ] **Step 3: Commit**

```bash
git add src/lib/format/recency.ts
git commit -m "feat: add formatRecency helper for public-facing vintage labels"
```

---

## Task 2: Strip year strings — cell page

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx` (lines per audit findings)

- [ ] **Step 1: For every audit-flagged year reference in the cell page, replace with formatRecency**

Pattern A — raw year literal as JSX text:

Before:
```tsx
<span className="text-xs text-ink-700/60">Data from 2024</span>
```

After:
```tsx
<span className="text-xs text-ink-700/60">{formatRecency()}</span>
```

Pattern B — year prop interpolation:

Before:
```tsx
<span>{cell.year}</span>
```

After:
```tsx
<span>{formatRecency(cell.year)}</span>
```

Pattern C — year range string:

Before:
```tsx
{`Data range: ${cell.year_from}–${cell.year_to}`}
```

After:
```tsx
{formatRecency({ from: cell.year_from, to: cell.year_to })}
```

- [ ] **Step 2: Add the import at the top of the cell page**

```tsx
import { formatRecency } from "@/lib/format/recency";
```

- [ ] **Step 3: Verify in the running preview**

```javascript
// Run via preview_eval against atlas-dev server
window.location.href = 'http://localhost:3001/us/california/restaurants';
```

Then snapshot the page and grep its text content for any `20[12][0-9]` matches:

```javascript
document.body.textContent.match(/\b20[12][0-9]\b/g) || 'none'
```

Expected: `'none'` or only matches inside admin/dev URLs (none should be in visible body text).

- [ ] **Step 4: Commit**

```bash
git add src/app/[country]/[geo]/[industry]/page.tsx
git commit -m "fix: strip year literals from cell page, use formatRecency"
```

---

## Task 3: Strip year strings — country page

**Files:**
- Modify: `src/app/[country]/page.tsx`

- [ ] **Step 1: Apply the same three patterns across the country page**

Pattern A — raw year literal as JSX text:

Before:
```tsx
<span className="text-xs text-ink-700/60">Data from 2024</span>
```

After:
```tsx
<span className="text-xs text-ink-700/60">{formatRecency()}</span>
```

Pattern B — year prop interpolation:

Before:
```tsx
<span>{country.year}</span>
```

After:
```tsx
<span>{formatRecency(country.year)}</span>
```

Pattern C — year range string:

Before:
```tsx
{`Data range: ${country.year_from}–${country.year_to}`}
```

After:
```tsx
{formatRecency({ from: country.year_from, to: country.year_to })}
```

Add the import at the top of the file:

```tsx
import { formatRecency } from "@/lib/format/recency";
```

Use the audit findings file to locate each hit.

- [ ] **Step 2: Verify in preview**

```javascript
window.location.href = 'http://localhost:3001/us';
// Wait for navigation, then:
document.body.textContent.match(/\b20[12][0-9]\b/g) || 'none'
```

Expected: `'none'`.

- [ ] **Step 3: Commit**

```bash
git add src/app/[country]/page.tsx
git commit -m "fix: strip year literals from country page"
```

---

## Task 4: Strip year strings — geo (sub-region) page + industry page

**Files:**
- Modify: `src/app/[country]/[geo]/page.tsx`
- Modify: `src/app/industries/[industry]/page.tsx`

- [ ] **Step 1: Apply the same three patterns to both files**

For each file, apply Pattern A (raw year literal), Pattern B (year prop interpolation), and Pattern C (year range string) — repeating exactly as shown in Task 2. Add the import:

```tsx
import { formatRecency } from "@/lib/format/recency";
```

Use the audit findings file to locate each hit in each of the two files.

- [ ] **Step 2: Verify in preview for both routes**

```javascript
window.location.href = 'http://localhost:3001/us/california';
// then
document.body.textContent.match(/\b20[12][0-9]\b/g) || 'none'

// then
window.location.href = 'http://localhost:3001/industries/restaurants';
document.body.textContent.match(/\b20[12][0-9]\b/g) || 'none'
```

Expected: `'none'` on both.

- [ ] **Step 3: Commit**

```bash
git add src/app/[country]/[geo]/page.tsx src/app/industries/[industry]/page.tsx
git commit -m "fix: strip year literals from geo + industry pages"
```

---

## Task 5: Strip engineering jargon chips

**Files:**
- Modify: `src/components/CellWarningChips.tsx` (or wherever the "coverage TBC" / cell-count chips live per audit)

- [ ] **Step 1: Delete the chip entries that expose internals**

Patterns to delete entirely (delete the whole `<Chip>` element, not just the text):

- `coverage TBC`
- `our show coverage`
- `n=NNN cells`, `NNN cells in this class`, `cell count`
- `confidence: NN%`, `confidence_score`
- `data only 2018-2020` / `data only YYYY-YYYY`
- Any chip whose text references internal pipeline state

Keep chips that warn the user about something they need to know:
- "Sample size small — interpret with care"
- "Conversion estimate, not measured"

- [ ] **Step 2: Verify in preview**

```javascript
window.location.href = 'http://localhost:3001/hr/zagreb/restaurants';  // Croatia cell, founder flagged this one
// Search for the offensive strings:
['coverage TBC', 'cells in this', 'n=', 'confidence_score', 'data only'].filter(s => document.body.textContent.includes(s))
```

Expected: `[]` (empty array — none of the patterns present).

- [ ] **Step 3: Commit**

```bash
git add src/components/CellWarningChips.tsx
git commit -m "fix: strip engineering-jargon chips from public cell pages"
```

---

## Task 6: Remove # firms column — cell page

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx`

- [ ] **Step 1: Delete the firm-count tile from the cell stats section**

The cell page currently renders a stat tile something like:

```tsx
<StatTile
  label="Active firms"
  value={cell.n_enterprises?.toLocaleString() ?? "—"}
  caption={`Across ${cell.geo_name}`}
/>
```

Delete the entire `<StatTile>` block. Do NOT delete the `n_enterprises` read from the cell row — it's used internally for tier classification.

- [ ] **Step 2: Verify in preview**

```javascript
window.location.href = 'http://localhost:3001/us/california/restaurants';
// Search for firm-count language:
['Active firms', 'Number of firms', 'firm count', '# firms', 'n_enterprises'].filter(s => document.body.textContent.includes(s))
```

Expected: `[]`.

- [ ] **Step 3: Commit**

```bash
git add src/app/[country]/[geo]/[industry]/page.tsx
git commit -m "fix: remove # firms tile from cell page"
```

---

## Task 7: Remove # firms column — country, geo, comparison

**Files:**
- Modify: `src/app/[country]/page.tsx`
- Modify: `src/app/[country]/[geo]/page.tsx`
- Modify: `src/components/CompareTable.tsx`
- Modify: `src/components/CalculatorInputs.tsx` (if it references n_enterprises)

- [ ] **Step 1: Delete the # firms column from each table**

In each file, find the `<th>` and `<td>` for the firm-count column and remove BOTH (header + body row). Adjust the `<thead>` `<tr>` column count if needed.

Example (CompareTable.tsx):

Before:
```tsx
<thead>
  <tr>
    <th>Cell</th>
    <th>Revenue/firm</th>
    <th>Firms</th>   {/* delete this */}
    <th>Net margin</th>
  </tr>
</thead>
<tbody>
  {rows.map(r => (
    <tr key={r.id}>
      <td>{r.label}</td>
      <td>{r.revenue}</td>
      <td>{r.n_enterprises}</td>   {/* delete this */}
      <td>{r.netMargin}</td>
    </tr>
  ))}
</tbody>
```

After:
```tsx
<thead>
  <tr>
    <th>Cell</th>
    <th>Revenue/firm</th>
    <th>Net margin</th>
  </tr>
</thead>
<tbody>
  {rows.map(r => (
    <tr key={r.id}>
      <td>{r.label}</td>
      <td>{r.revenue}</td>
      <td>{r.netMargin}</td>
    </tr>
  ))}
</tbody>
```

- [ ] **Step 2: Verify in preview for each affected route**

```javascript
// Country
window.location.href = 'http://localhost:3001/us';
document.body.textContent.includes('Firms') || document.body.textContent.includes('Number of firms')

// Geo
window.location.href = 'http://localhost:3001/us/california';
document.body.textContent.includes('Firms') || document.body.textContent.includes('Number of firms')

// Compare
window.location.href = 'http://localhost:3001/compare';
document.body.textContent.includes('Firms') || document.body.textContent.includes('Number of firms')
```

Expected: `false` for each.

- [ ] **Step 3: Commit**

```bash
git add src/app/[country]/page.tsx src/app/[country]/[geo]/page.tsx src/components/CompareTable.tsx src/components/CalculatorInputs.tsx
git commit -m "fix: remove # firms column from country, geo, comparison, calculator"
```

---

## Task 8: Fix flag component — strip 3D/wave/shine effects

**Files:**
- Modify: `src/components/CountryFlag.tsx` (or wherever per Task 0 audit)

- [ ] **Step 1: Replace the entire component with a plain SVG-rendering version**

Most flag components have CSS like:

```tsx
<div
  className="flag-3d"
  style={{
    transform: "perspective(800px) rotate3d(0,1,0,-12deg)",
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
  }}
>
  <img src={flagUrl} alt={`${countryName} flag`} />
  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent" />
</div>
```

Replace with the calm version:

```tsx
type Props = {
  iso2: string;
  countryName: string;
  className?: string;
};

export function CountryFlag({ iso2, countryName, className = "" }: Props) {
  const src = `/flags/${iso2.toLowerCase()}.svg`;
  return (
    <img
      src={src}
      alt={`${countryName} flag`}
      className={`block aspect-[3/2] w-12 object-cover rounded-sm border border-ink-200/40 ${className}`}
      loading="lazy"
    />
  );
}
```

Strip every `transform`, `perspective`, `rotate3d`, `filter: drop-shadow`, gradient overlay, and any `motion-` Tailwind classes.

- [ ] **Step 2: Verify in preview**

```javascript
window.location.href = 'http://localhost:3001/world';
// Snapshot a flag element and inspect its computed styles:
(function(){
  const flag = document.querySelector('img[alt*="flag"]');
  if (!flag) return 'no flag found';
  const cs = getComputedStyle(flag);
  return {
    transform: cs.transform,
    filter: cs.filter,
    boxShadow: cs.boxShadow,
    parentTransform: getComputedStyle(flag.parentElement).transform,
  };
})()
```

Expected: `transform: 'none'`, `filter: 'none'`, `boxShadow: 'none'`, `parentTransform: 'none'`. (Some baseline shadow from the container is fine, but no `perspective` or `rotate3d`.)

- [ ] **Step 3: Commit**

```bash
git add src/components/CountryFlag.tsx
git commit -m "fix: strip 3D wave + shine effects from country flag"
```

---

## Task 9: Build regional coverage manifest

**Files:**
- Create: `scripts/coverage/build_regional_coverage.py`
- Create: `data/coverage/regional_coverage_v1.json`

- [ ] **Step 1: Write the manifest builder script**

```python
"""Plan v13 Wave 1 — build the regional_coverage_v1 manifest.

Queries Supabase for which countries have any regional_cells rows.
Output: {iso2_upper: bool} mapping for fast static lookup in the
website without a per-request DB roundtrip.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)
except Exception:
    pass

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

SUPABASE_URL = "https://npfqasdghbffqgmzgxzr.supabase.co"
key = None
env = Path(r"E:\atlas\website\.env.local")
for line in env.read_text(encoding="utf-8").splitlines():
    if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
        key = line.split("=", 1)[1].strip().strip('"')
        break
if not key:
    sys.exit("no key")

S = requests.Session()
S.headers.update({"apikey": key, "Authorization": f"Bearer {key}"})

# Distinct countries with any regional_cells row
url = f"{SUPABASE_URL}/rest/v1/regional_cells?select=country&limit=10000"
seen = set()
offset = 0
page = 5000
while True:
    r = S.get(url, headers={"Range": f"{offset}-{offset+page-1}"}, verify=False, timeout=120)
    if r.status_code not in (200, 206):
        break
    rows = r.json()
    if not rows:
        break
    for row in rows:
        c = row.get("country")
        if c:
            seen.add(c.upper())
    if len(rows) < page:
        break
    offset += page

# Emit only countries that DO have coverage. The renderer treats a
# missing key as False (no coverage), so we don't need the full ISO2
# universe in the manifest — just the positive set.
manifest = {iso2: True for iso2 in sorted(seen)}

out = Path(r"E:\atlas\website\data\coverage\regional_coverage_v1.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(f"wrote {out} with {len(manifest)} countries having regional coverage")
```

- [ ] **Step 2: Run the script**

```bash
cd E:/atlas && python scripts/coverage/build_regional_coverage.py
```

Expected output: `wrote E:\atlas\website\data\coverage\regional_coverage_v1.json with N countries having regional coverage` where N is probably 10-30.

- [ ] **Step 3: Commit**

```bash
cd E:/atlas/website
git add data/coverage/regional_coverage_v1.json
cd E:/atlas
git add scripts/coverage/build_regional_coverage.py
# Note: scripts dir is outside the website git repo; commit only the json
cd E:/atlas/website
git commit -m "data: regional coverage manifest for Wave 1 region-tab gating"
```

---

## Task 10: Wire hasRegionalCoverage helper + region-tab gating

**Files:**
- Create: `src/lib/coverage/regional.ts`
- Modify: `src/app/[country]/page.tsx`

- [ ] **Step 1: Create the helper**

```typescript
/**
 * Plan v13 Wave 1 — regional coverage gating.
 *
 * Returns true if we have any regional_cells rows for the given
 * country. Used to hide the "Regions" tab on country pages when
 * we have no data to put behind it (no half-broken state).
 */
import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
  process.cwd(),
  "data",
  "coverage",
  "regional_coverage_v1.json"
);

let MANIFEST: Record<string, boolean> = {};
try {
  MANIFEST = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
} catch {
  MANIFEST = {};
}

export function hasRegionalCoverage(iso2: string): boolean {
  return Boolean(MANIFEST[iso2.toUpperCase()]);
}
```

- [ ] **Step 2: Wire into the country page**

In `src/app/[country]/page.tsx`, find the tab navigation block. Wrap the Regions tab in a conditional:

Before:
```tsx
<Tab href={`/${iso2}#regions`}>Regions</Tab>
<Tab href={`/${iso2}#industries`}>Industries</Tab>
```

After:
```tsx
import { hasRegionalCoverage } from "@/lib/coverage/regional";

// ...inside component:
const showRegions = hasRegionalCoverage(iso2);

{showRegions ? <Tab href={`/${iso2}#regions`}>Regions</Tab> : null}
<Tab href={`/${iso2}#industries`}>Industries</Tab>
```

Also conditionally render the regions section body itself:

```tsx
{showRegions ? <RegionsSection iso2={iso2} /> : null}
```

- [ ] **Step 3: Verify with Argentina (no regional coverage per founder)**

```javascript
window.location.href = 'http://localhost:3001/ar';
// Check that no "Regions" tab is rendered:
Array.from(document.querySelectorAll('a, button')).map(e => e.textContent.trim()).filter(t => t === 'Regions')
```

Expected: `[]`.

Then verify with the US (full regional coverage):

```javascript
window.location.href = 'http://localhost:3001/us';
Array.from(document.querySelectorAll('a, button')).map(e => e.textContent.trim()).filter(t => t === 'Regions')
```

Expected: `['Regions']`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/coverage/regional.ts src/app/[country]/page.tsx
git commit -m "feat: hide Regions tab on country pages without sub-regional data"
```

---

## Task 11: Final verification + build

- [ ] **Step 1: Run lint**

```bash
cd E:/atlas/website && npm run lint 2>&1 | tail -30
```

Expected: no new errors introduced. (Pre-existing warnings are OK; new errors caused by our changes are not.)

- [ ] **Step 2: Run a full production build**

```bash
cd E:/atlas/website && npm run build 2>&1 | tail -40
```

Expected: clean build, no TypeScript errors, no failed static generation, prebuild's `verify_taxonomy.ts` passes.

- [ ] **Step 3: Final end-to-end preview check**

Visit these routes via preview_eval and confirm each is clean:

```javascript
// Run for each URL:
const urls = [
  'http://localhost:3001/us/california/restaurants',
  'http://localhost:3001/gb/london/restaurants',
  'http://localhost:3001/hr/zagreb/restaurants',  // founder flagged Croatia
  'http://localhost:3001/ar',                      // founder flagged AR regions
  'http://localhost:3001/world',                   // flag styling
  'http://localhost:3001/compare',
];
// For each, eval after navigation:
(function() {
  const text = document.body.textContent;
  return {
    year_leak: !!text.match(/\b20[12][0-9]\b/),
    firms_leak: ['Number of firms', 'Active firms', '# firms', 'Firms'].some(s => text.includes(s)),
    jargon_leak: ['coverage TBC', 'cells in this', 'n=', 'data only'].some(s => text.includes(s)),
  };
})()
```

Expected: every flag `false` for every URL.

- [ ] **Step 4: Final commit + summary update**

```bash
cd E:/atlas/website
git add docs/specs/2026-05-19-plan-v13-wave1-hygiene-plan.md docs/specs/2026-05-19-plan-v13-credibility-fix-design.md
git commit -m "docs: Plan v13 spec + Wave 1 implementation plan"
```

Append a section to `docs/masterplan/PROGRESS.md` summarizing Wave 1:
- Tasks completed
- Routes verified
- Diff size in lines

```bash
git add docs/masterplan/PROGRESS.md
git commit -m "progress: Plan v13 Wave 1 hygiene shipped"
```

---

## Self-Review Checklist (run before handing off)

- [x] Every spec requirement from Wave 1 has at least one task
- [x] No placeholder text — every step has actual code or actual commands
- [x] Type consistency — `formatRecency`, `hasRegionalCoverage`, `CountryFlag` props all consistent across tasks
- [x] File paths are concrete (absolute or unambiguous relative)
- [x] No "TBD", "TODO", "similar to above"
- [x] Verification steps use real commands/expressions, not "verify it works"
- [x] All git commits target the website repo (E:/atlas/website) not the parent E:/atlas

## Out of Scope (Waves 2 & 3 — separate plans)

- Net margin floor + canonical rebuild (Wave 2)
- Revenue tiles + distribution curve (Wave 2)
- Margin waterfall component (Wave 2)
- Sister-page section harmonization (Wave 2)
- Image system v2 with AI fallback (Wave 3)
- Image rendering bug investigation (Wave 3)
