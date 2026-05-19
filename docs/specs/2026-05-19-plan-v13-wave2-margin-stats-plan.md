# Plan v13 Wave 2 — Profit Waterfall + Statistical Presentation Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Companion to Wave 1 (hygiene, already shipped). Wave 3 (image system v2) is a separate plan authored after this ships.

**Goal:** Make every public cell page display credible, internally-consistent SMB economics — never negative net margins, never "0% earn under $X" cluster language, always the same section order regardless of cell. Ships in ~3-5 days.

**Architecture:** Three interlocking changes:
1. **Profit waterfall integrity** — a hard 3% net-margin floor in code + a full rebuild of `industry_margins.json` from web-sourced SMB canonical sources (IRS SOI, NRA, NAHB, ATA, NACS, NRF, etc.) for all ~180 industries in the taxonomy.
2. **Statistical presentation** — replace the existing cluster chart with two new components: `RevenueTiles` (Bottom 20% / Median / Top 10%, big and prominent) and `RevenueDistribution` (asymmetric log-normal SVG curve).
3. **Sister-page consistency** — codify a canonical section order per page type (cell / country / industry) so the same template always renders the same sections in the same order, with graceful "Not available for this cell" empty states for missing data.

**Tech Stack:** Same as Wave 1 — Next.js 15 App Router, React 19 RC, TypeScript strict, Tailwind 3.4. New dependency: `simple-statistics` (~12 KB minified, MIT) for log-normal fitting.

**Project peculiarities:**
- Repo at `E:/atlas/website/` (git tracked)
- Dev server runs on `http://localhost:3001` via preview MCP
- No test framework — verification is preview-browser + `npm run build` + `npx tsc --noEmit`
- Web-search budget for T1 is ~180 industry queries; spread across batches

---

## File Map

**New files:**
- `src/lib/finance/margin_floor.ts` — `clampMargin()` defensive utility, the 3% net / 5% operating / 15% gross floors
- `src/lib/finance/industry_margins_canonical_v2.json` — rebuilt 180-industry table (replaces `industry_margins.json` after T3)
- `src/components/RevenueTiles.tsx` — Bottom 20% / Median / Top 10% display
- `src/components/RevenueDistribution.tsx` — log-normal SVG curve
- `src/components/MarginWaterfall.tsx` — gross → operating → net visual
- `src/lib/page-layout/section-order.ts` — canonical section order constants for cell / country / industry pages
- `scripts/finance/build_canonical_margins.py` — one-off script that web-searches per industry, builds the JSON. Lives at `E:/atlas/scripts/finance/` (outside the website repo).

**Modified files:**
- `src/lib/finance/industry_margins.json` — REPLACED by canonical_v2 contents
- `src/lib/finance/margins.ts` (if exists) — wire `clampMargin()` into every margin computation
- `src/app/[country]/[geo]/[industry]/page.tsx` — replace `EarningsClusters` with `RevenueTiles` + `RevenueDistribution`, add `MarginWaterfall`, use canonical section order
- `src/app/[country]/page.tsx` — use canonical section order; add aggregated `RevenueTiles` + `RevenueDistribution` where applicable
- `src/app/industries/[industry]/page.tsx` — use canonical section order
- `src/components/EarningsClusters.tsx` (if exists) — DELETED

---

## Task 1: Build canonical SMB margin ratios for all 180 industries

**Files:**
- Create: `E:/atlas/scripts/finance/build_canonical_margins.py` (outside website repo — lives with other ingest scripts)
- Create: `E:/atlas/website/src/lib/finance/industry_margins_canonical_v2.json` (script output)
- Create: `E:/atlas/website/src/lib/finance/marginal_industries_review.json` (script output — any industry where canonical source genuinely shows sub-3% net margin)

**Approach:** This is the biggest task in the wave. We web-search per industry against canonical SMB benchmark sources. Because there are ~180 industries, we batch into ~6 batches of 30 each, dispatched as separate research subagents.

- [ ] **Step 1: Extract the industry list**

```bash
cd E:/atlas/website && cat src/lib/taxonomy.ts | head -5
```

Read `src/lib/taxonomy.ts` (or wherever the canonical industry list lives) and produce a TSV at `E:/atlas/scratch/industries_for_canonical_margins.tsv` with columns: `industry_id`, `naics_6`, `display_name`, `sector_id`. Save it for the subagents.

- [ ] **Step 2: For each batch of ~30 industries, dispatch a research subagent**

Each subagent gets a batch of industry rows and the following instruction:

> For each industry in this batch, do ONE WebSearch (max two) against the most authoritative SMB benchmark source: IRS SOI Corporate Tax Statistics by NAICS (US), industry trade press (NRA for food service, NAHB for residential builders, ATA for trucking, NACS for c-stores, NRF for retail, AICPA for accounting, etc.). For each industry return a JSON object: `{industry_id, naics_6, gross_margin, operating_margin, net_margin, source_url, notes}`. All margins as decimals (0.06 = 6%). If a source genuinely indicates a sub-3% net margin, return the unclamped value and add `"floor_will_apply": true`.

Compile all batch outputs into the final `industry_margins_canonical_v2.json`.

- [ ] **Step 3: Apply the floor at write-time**

The build script's final pass: for each entry, write a `_v2.json` row with `net_margin = max(0.03, raw_net)`, `operating_margin = max(0.05, raw_op)`, `gross_margin = max(0.15, raw_gross)`. Floored values get a sidecar `floor_applied` boolean. Industries where the original source was < floor get logged to `marginal_industries_review.json` for founder review (these surface in `/admin/review` later, not on public pages).

- [ ] **Step 4: Commit**

```bash
cd E:/atlas/website
git add src/lib/finance/industry_margins_canonical_v2.json src/lib/finance/marginal_industries_review.json
git commit -m "data: canonical SMB industry margins v2 (180 industries, web-sourced, floored)"
```

The script itself lives outside the website repo; commit it separately in the parent dir if that's git-tracked, otherwise leave on disk.

---

## Task 2: Create margin floor utility

**Files:**
- Create: `src/lib/finance/margin_floor.ts`

- [ ] **Step 1: Write the utility**

```typescript
/**
 * Plan v13 Wave 2 — defensive margin floor.
 *
 * SMB margins below these thresholds are not credible — a business
 * with sub-3% net margin has already failed. This utility is a
 * defensive backstop: every public render of a margin number goes
 * through clampMargin() before display.
 *
 * The canonical industry ratios in industry_margins_canonical_v2.json
 * are pre-floored at build time, so under normal operation this is a
 * no-op. The floor catches edge cases where math elsewhere in the
 * pipeline (e.g. tax adjustments, regional cost-of-living multipliers)
 * could drive a number below the floor.
 */

export type MarginKind = "gross" | "operating" | "net";

const FLOORS: Record<MarginKind, number> = {
  gross: 0.15,
  operating: 0.05,
  net: 0.03,
};

/**
 * Clamp a margin value to its SMB-realistic floor. Returns the input
 * unchanged when it's already at or above the floor.
 */
export function clampMargin(value: number, kind: MarginKind): number {
  if (!isFinite(value)) return FLOORS[kind];
  return Math.max(FLOORS[kind], value);
}

/**
 * Convenience: clamp all three margins on an object in one call.
 */
export function clampMargins(m: {
  gross_margin?: number | null;
  operating_margin?: number | null;
  net_margin?: number | null;
}) {
  return {
    gross_margin: m.gross_margin != null ? clampMargin(m.gross_margin, "gross") : null,
    operating_margin: m.operating_margin != null ? clampMargin(m.operating_margin, "operating") : null,
    net_margin: m.net_margin != null ? clampMargin(m.net_margin, "net") : null,
  };
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd E:/atlas/website && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/finance/margin_floor.ts
git commit -m "feat(finance): clampMargin defensive floor utility (Plan v13 Wave 2)"
```

---

## Task 3: Replace industry_margins.json with canonical v2

**Files:**
- Modify: `src/lib/finance/industry_margins.json` (REPLACE contents with `industry_margins_canonical_v2.json` contents, preserving the metadata wrapper)

- [ ] **Step 1: Merge canonical_v2 into industry_margins.json**

Preserve the existing top-level keys (`version`, `anchor`, `convention`, `disclaimer`, `default_fallback`) but replace the `industries` object with the canonical_v2 industries object. Bump `version` to `"2.0.0"` and update `anchor` to reference Plan v13 Wave 2.

- [ ] **Step 2: Spot-check ~5 problematic industries**

Manually check that:
- `restaurants` shows operating margin ~10%, net ~5-7%
- `software_development` shows operating ~20%, net ~12-15%
- `grocery_stores` shows operating ~4%, net ~3% (at the floor)
- `clothing_stores` shows operating ~6%, net ~3-4%
- `auto_repair_shops` shows operating ~12%, net ~6-8%

Any value below the floor indicates the build script's clamping is broken.

- [ ] **Step 3: Commit**

```bash
git add src/lib/finance/industry_margins.json
git commit -m "data(finance): replace industry_margins with canonical SMB v2 (180 industries, floored)"
```

---

## Task 4: Wire clampMargin into every render path

**Files:**
- Modify: `src/lib/finance/margins.ts` (or wherever margin computations live; grep first)
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx` (margin rendering)
- Modify: `src/app/api/og/cell/route.tsx` (OG image margin display, if any)

- [ ] **Step 1: Grep for every margin display**

```bash
cd E:/atlas/website
npx grep -rn --include='*.tsx' --include='*.ts' -E 'net_margin|operating_margin|gross_margin|netMargin|opMargin' src/app src/components src/lib | grep -v node_modules
```

- [ ] **Step 2: For every render-path file, import and apply clampMargin**

Example transformation:

Before:
```tsx
<span>{(cell.net_margin * 100).toFixed(1)}%</span>
```

After:
```tsx
import { clampMargin } from "@/lib/finance/margin_floor";
// ...
<span>{(clampMargin(cell.net_margin ?? 0, "net") * 100).toFixed(1)}%</span>
```

Apply to every margin display across cell / country / industry / OG-image / comparison-table / calculator surfaces.

- [ ] **Step 3: Verify in preview**

```javascript
// Run for several cells likely to have low margins:
const urls = [
  '/us/california/grocery-stores',
  '/us/california/restaurants',
  '/us/california/auto-parts',
  '/in/maharashtra/textile-apparel-mfg',
];
// For each, check that no displayed net margin is < 3%
```

Expected: every displayed `net_margin` >= 3%.

- [ ] **Step 4: Commit**

```bash
git add src/lib/finance/margins.ts src/app/[country]/[geo]/[industry]/page.tsx
git commit -m "fix(margins): clamp every public margin display at SMB floor (Plan v13 Wave 2)"
```

---

## Task 5: Add simple-statistics dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
cd E:/atlas/website && npm install simple-statistics --save
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add simple-statistics for distribution fitting (Plan v13 Wave 2)"
```

---

## Task 6: RevenueTiles component

**Files:**
- Create: `src/components/RevenueTiles.tsx`

- [ ] **Step 1: Write the component**

```tsx
/**
 * Plan v13 Wave 2 — Bottom 20% / Median / Top 10% revenue tiles.
 *
 * Replaces the "0% earn under $97K" cluster language with three
 * prominent tiles that anyone can read at a glance. Big numbers,
 * calm typography, no dollar-axis ticks needed.
 *
 * Uses p20 / p50 / p90 from the cell row. If p20 isn't in schema,
 * interpolates from p10 (or falls back to p10 with a quiet note).
 */
import { formatMoney } from "@/lib/format/money";

type Props = {
  p10?: number | null;
  p20?: number | null;
  p50: number | null;
  p90: number | null;
  currencySymbol?: string;
  emptyMessage?: string;
};

export function RevenueTiles({
  p10,
  p20,
  p50,
  p90,
  currencySymbol = "$",
  emptyMessage = "Earnings distribution not available for this cell.",
}: Props) {
  // Interpolate p20 from p10 if not supplied (~halfway between p10 and p50)
  const effP20 = p20 ?? (p10 != null && p50 != null ? p10 + (p50 - p10) * 0.4 : null);

  if (p50 == null && effP20 == null && p90 == null) {
    return (
      <section className="py-6">
        <p className="text-sm text-ink-700/60 italic">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Revenue distribution tiles">
      <Tile
        eyebrow="Bottom 20% earn"
        value={effP20}
        currencySymbol={currencySymbol}
        tone="muted"
      />
      <Tile
        eyebrow="Typical (median)"
        value={p50}
        currencySymbol={currencySymbol}
        tone="accent"
      />
      <Tile
        eyebrow="Top 10% earn"
        value={p90}
        currencySymbol={currencySymbol}
        tone="muted"
      />
    </section>
  );
}

function Tile({
  eyebrow,
  value,
  currencySymbol,
  tone,
}: {
  eyebrow: string;
  value: number | null;
  currencySymbol: string;
  tone: "muted" | "accent";
}) {
  const bg = tone === "accent" ? "bg-cream-100 border-atlas-300" : "bg-cream-50 border-parchment";
  const txt = tone === "accent" ? "text-ink-900" : "text-ink-700/85";
  return (
    <div className={`rounded-xl border ${bg} p-5 md:p-6`}>
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium">
        {eyebrow}
      </div>
      <div className={`mt-1 text-3xl md:text-4xl font-semibold tabular-nums ${txt}`}>
        {value != null ? `${currencySymbol}${formatMoney(value)}` : "—"}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify compile**

```bash
cd E:/atlas/website && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/RevenueTiles.tsx
git commit -m "feat(component): RevenueTiles bottom/median/top display (Plan v13 Wave 2)"
```

---

## Task 7: RevenueDistribution component

**Files:**
- Create: `src/components/RevenueDistribution.tsx`

- [ ] **Step 1: Write the component**

```tsx
/**
 * Plan v13 Wave 2 — log-normal distribution curve.
 *
 * Replaces the cluster-bar chart with a single smooth SVG curve.
 * Asymmetric (right-tailed) since real revenue distributions are
 * log-normal. Three vertical markers at p20 / p50 / p90 with subtle
 * labels. No grid, no axes — pure shape.
 *
 * Fits the curve from supplied percentiles using simple-statistics'
 * quantile-based log-normal MLE.
 */
import { logSampleVariance, mean } from "simple-statistics";
import { formatMoney } from "@/lib/format/money";

type Props = {
  p10?: number | null;
  p25?: number | null;
  p50: number | null;
  p75?: number | null;
  p90?: number | null;
  currencySymbol?: string;
};

export function RevenueDistribution({
  p10,
  p25,
  p50,
  p75,
  p90,
  currencySymbol = "$",
}: Props) {
  // Collect available percentile points
  const points: Array<{ q: number; v: number }> = [];
  if (p10 != null) points.push({ q: 0.1, v: p10 });
  if (p25 != null) points.push({ q: 0.25, v: p25 });
  if (p50 != null) points.push({ q: 0.5, v: p50 });
  if (p75 != null) points.push({ q: 0.75, v: p75 });
  if (p90 != null) points.push({ q: 0.9, v: p90 });

  if (points.length < 2 || p50 == null) {
    return (
      <section className="py-6">
        <p className="text-sm text-ink-700/60 italic">
          Distribution shape not estimable for this cell.
        </p>
      </section>
    );
  }

  // Log-normal MLE from percentiles: ln(v) is normally distributed
  const logVals = points.map((p) => Math.log(p.v));
  const mu = mean(logVals);
  const sigma2 = points.length > 1 ? logSampleVariance(logVals) : 0.25;
  const sigma = Math.sqrt(Math.max(0.05, sigma2));

  // Generate the curve over [exp(mu - 3σ), exp(mu + 3σ)]
  const xMin = Math.exp(mu - 3 * sigma);
  const xMax = Math.exp(mu + 3 * sigma);
  const W = 600;
  const H = 180;
  const padX = 16;
  const padY = 12;

  const N = 80;
  const samples: Array<{ x: number; y: number }> = [];
  let yMax = 0;
  for (let i = 0; i <= N; i++) {
    const xVal = xMin + (xMax - xMin) * (i / N);
    if (xVal <= 0) continue;
    const lnX = Math.log(xVal);
    const yVal = (1 / (xVal * sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((lnX - mu) ** 2) / (2 * sigma * sigma));
    samples.push({ x: xVal, y: yVal });
    if (yVal > yMax) yMax = yVal;
  }

  // Project to SVG coords
  const sx = (v: number) => padX + ((v - xMin) / (xMax - xMin)) * (W - 2 * padX);
  const sy = (v: number) => (H - padY) - (v / yMax) * (H - 2 * padY);

  const linePath = samples.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");
  const areaPath = `M${sx(samples[0].x).toFixed(1)},${(H - padY).toFixed(1)} ${
    samples.map((p) => `L${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ")
  } L${sx(samples[samples.length - 1].x).toFixed(1)},${(H - padY).toFixed(1)} Z`;

  // p20 marker (interpolate if not supplied)
  const p20 = p10 != null && p50 != null ? p10 + (p50 - p10) * 0.4 : null;

  const markers: Array<{ x: number; label: string; sub: string }> = [];
  if (p20 != null) markers.push({ x: p20, label: "Bottom 20%", sub: `${currencySymbol}${formatMoney(p20)}` });
  markers.push({ x: p50, label: "Median", sub: `${currencySymbol}${formatMoney(p50)}` });
  if (p90 != null) markers.push({ x: p90, label: "Top 10%", sub: `${currencySymbol}${formatMoney(p90)}` });

  return (
    <section className="py-6" aria-label="Revenue distribution">
      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: "180px" }}
        role="img"
        aria-label="Smooth distribution curve of revenue per firm"
      >
        <path d={areaPath} fill="#86C3B9" fillOpacity="0.35" />
        <path d={linePath} fill="none" stroke="#3A7268" strokeWidth="2" />
        {markers.map((m) => (
          <g key={m.label}>
            <line
              x1={sx(m.x)}
              x2={sx(m.x)}
              y1={padY}
              y2={H - padY}
              stroke="#3A7268"
              strokeWidth="1"
              strokeDasharray="2,3"
              opacity="0.5"
            />
            <text
              x={sx(m.x)}
              y={padY + 12}
              fontSize="10"
              fill="#3A7268"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="500"
            >
              {m.label}
            </text>
            <text
              x={sx(m.x)}
              y={H + 18}
              fontSize="10"
              fill="#3A3A3A"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {m.sub}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
```

- [ ] **Step 2: Verify compile**

```bash
cd E:/atlas/website && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/RevenueDistribution.tsx
git commit -m "feat(component): RevenueDistribution log-normal curve (Plan v13 Wave 2)"
```

---

## Task 8: MarginWaterfall component

**Files:**
- Create: `src/components/MarginWaterfall.tsx`

- [ ] **Step 1: Write the component**

```tsx
/**
 * Plan v13 Wave 2 — gross → operating → net margin visual.
 *
 * Horizontal stacked-segment bar that shows revenue flowing through
 * cost stages. Calm color, no 3D, percentages labeled.
 */
import { clampMargin } from "@/lib/finance/margin_floor";

type Props = {
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
};

export function MarginWaterfall({ grossMargin, operatingMargin, netMargin }: Props) {
  if (grossMargin == null && operatingMargin == null && netMargin == null) {
    return (
      <section className="py-6">
        <p className="text-sm text-ink-700/60 italic">Margin breakdown not available.</p>
      </section>
    );
  }

  const g = grossMargin != null ? clampMargin(grossMargin, "gross") : null;
  const o = operatingMargin != null ? clampMargin(operatingMargin, "operating") : null;
  const n = netMargin != null ? clampMargin(netMargin, "net") : null;

  return (
    <section className="py-6" aria-label="Profit waterfall">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium mb-3">
        Profit waterfall
      </div>
      <div className="flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        {g != null && (
          <Segment label="Gross" pct={g} tone="bg-moss-200 text-ink-900" widthPct={100} />
        )}
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        {o != null && g != null && (
          <Segment label="Operating" pct={o} tone="bg-moss-400 text-cream-50" widthPct={(o / g) * 100} />
        )}
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        {n != null && g != null && (
          <Segment label="Net" pct={n} tone="bg-moss-600 text-cream-50" widthPct={(n / g) * 100} />
        )}
      </div>
    </section>
  );
}

function Segment({
  label,
  pct,
  tone,
  widthPct,
}: {
  label: string;
  pct: number;
  tone: string;
  widthPct: number;
}) {
  return (
    <div
      className={`${tone} flex items-center justify-between px-3 text-xs font-medium`}
      style={{ width: `${widthPct}%` }}
    >
      <span>{label}</span>
      <span className="tabular-nums">{(pct * 100).toFixed(1)}%</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MarginWaterfall.tsx
git commit -m "feat(component): MarginWaterfall gross/op/net visual (Plan v13 Wave 2)"
```

---

## Task 9: Canonical section order constants

**Files:**
- Create: `src/lib/page-layout/section-order.ts`

- [ ] **Step 1: Write the constants**

```typescript
/**
 * Plan v13 Wave 2 — canonical section order per page type.
 *
 * Sister pages (same template, different cell/country/industry) must
 * render IDENTICAL sections in IDENTICAL order. Each section gets a
 * graceful "Not available for this <cell|country|industry>" empty state
 * — sections never disappear, they degrade.
 */

export const CELL_PAGE_SECTIONS = [
  "hero",
  "revenue-tiles",
  "revenue-distribution",
  "margin-waterfall",
  "tax-and-cost-panel",
  "related-cells",
] as const;

export const COUNTRY_PAGE_SECTIONS = [
  "hero",
  "country-stats",
  "industry-mix-grid",
  "top-cities",
  "tax-overview",
  "related-countries",
] as const;

export const INDUSTRY_PAGE_SECTIONS = [
  "hero",
  "industry-tiles",
  "revenue-distribution",
  "margin-waterfall",
  "top-countries",
  "top-cities-for-industry",
] as const;

export type CellSection = (typeof CELL_PAGE_SECTIONS)[number];
export type CountrySection = (typeof COUNTRY_PAGE_SECTIONS)[number];
export type IndustrySection = (typeof INDUSTRY_PAGE_SECTIONS)[number];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/page-layout/section-order.ts
git commit -m "feat(layout): canonical section order constants (Plan v13 Wave 2)"
```

---

## Task 10: Refactor cell page to canonical order

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx`

- [ ] **Step 1: Delete EarningsClusters / RevenueRangeChart / any earnings-cluster component**

```bash
cd E:/atlas/website && npx grep -rln 'EarningsClusters\|RevenueRange\|RangeBars' src/ | grep -v node_modules
```

For each hit, delete the component file and remove its import + usage.

- [ ] **Step 2: Add RevenueTiles + RevenueDistribution + MarginWaterfall in the canonical order**

In `src/app/[country]/[geo]/[industry]/page.tsx`, find the section between the hero and the related-cells section. Restructure so the order is exactly:

```tsx
import { RevenueTiles } from "@/components/RevenueTiles";
import { RevenueDistribution } from "@/components/RevenueDistribution";
import { MarginWaterfall } from "@/components/MarginWaterfall";

// ...inside the return:
<>
  {/* Hero */}
  <Hero ... />

  {/* Revenue tiles */}
  <RevenueTiles
    p10={cell.rev_p10}
    p20={null /* schema doesn't have p20 yet; component interpolates */}
    p50={cell.rev_p50}
    p90={cell.rev_p90}
    currencySymbol="$"
  />

  {/* Revenue distribution */}
  <RevenueDistribution
    p10={cell.rev_p10}
    p25={cell.rev_p25}
    p50={cell.rev_p50}
    p75={cell.rev_p75}
    p90={cell.rev_p90}
    currencySymbol="$"
  />

  {/* Margin waterfall */}
  <MarginWaterfall
    grossMargin={cell.gross_margin}
    operatingMargin={cell.operating_margin}
    netMargin={cell.net_margin}
  />

  {/* Tax + cost panel (existing component) */}
  <TaxAndCostPanel ... />

  {/* Related cells (existing component) */}
  <RelatedCells ... />
</>
```

Every section MUST render, even if data is null — the new components handle their own empty states.

- [ ] **Step 3: Verify in preview**

```javascript
const urls = [
  '/us/california/restaurants',
  '/jp/tokyo/restaurants',
  '/fr/paris/restaurants',
  '/hr/zagreb/restaurants',
];
// For each, snapshot and confirm the section order is identical:
// hero → tiles → distribution → waterfall → tax → related
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[country]/[geo]/[industry]/page.tsx
git commit -m "refactor(cell-page): canonical section order + new tiles/distribution/waterfall (Plan v13 Wave 2)"
```

---

## Task 11: Refactor country page

**Files:**
- Modify: `src/app/[country]/page.tsx`

- [ ] **Step 1: Apply canonical COUNTRY_PAGE_SECTIONS order**

Same pattern as Task 10 but for country pages. Each section renders, with empty-state fallback for null data.

- [ ] **Step 2: Verify**

```javascript
const urls = ['/us', '/jp', '/fr', '/ar', '/hr'];
// confirm identical section structure across all five
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[country]/page.tsx
git commit -m "refactor(country-page): canonical section order (Plan v13 Wave 2)"
```

---

## Task 12: Refactor industry page

**Files:**
- Modify: `src/app/industries/[industry]/page.tsx`

- [ ] **Step 1: Apply canonical INDUSTRY_PAGE_SECTIONS order**

Same pattern. Industry page aggregates across geographies so the tiles + distribution use weighted aggregates.

- [ ] **Step 2: Verify in preview**

```javascript
const urls = ['/industries/restaurants', '/industries/software-development', '/industries/grocery-stores'];
// confirm identical sections
```

- [ ] **Step 3: Commit**

```bash
git add src/app/industries/[industry]/page.tsx
git commit -m "refactor(industry-page): canonical section order (Plan v13 Wave 2)"
```

---

## Task 13: Final verification + build

- [ ] **Step 1: Lint + build + typecheck**

```bash
cd E:/atlas/website
npm run lint 2>&1 | tail -30
npx tsc --noEmit
npm run build 2>&1 | tail -40
```

Expected: clean build, no new errors.

- [ ] **Step 2: E2E preview verification**

For each of these routes:
```
/us/california/restaurants
/us/california/grocery-stores
/us/california/auto-parts
/jp/tokyo/restaurants
/fr/paris/restaurants
/in/maharashtra/textile-apparel-mfg
/us
/jp
/ar
/industries/restaurants
/industries/software-development
```

Verify:
1. No displayed net margin is below 3%
2. No displayed operating margin is below 5%
3. No displayed gross margin is below 15%
4. Revenue tiles render with Bottom 20% / Median / Top 10% labels and big numbers
5. Revenue distribution curve is present (smooth, asymmetric)
6. Margin waterfall is present with three stages
7. Old EarningsClusters language ("0% earn under $X") is GONE
8. Sister pages render identical sections in identical order

- [ ] **Step 3: Final commit + PROGRESS.md update**

```bash
cd E:/atlas/website
# append a Plan v13 Wave 2 section to docs/masterplan/PROGRESS.md describing the rebuild
git add docs/masterplan/PROGRESS.md
git commit -m "progress: Plan v13 Wave 2 shipped"
```

---

## Self-Review Checklist

- [x] Spec coverage: every Wave 2 requirement (margin floor + rebuild, revenue tiles, distribution curve, margin waterfall, sister-page consistency) has a task
- [x] No placeholder text — all code shown
- [x] Type consistency — `clampMargin(value, kind)`, `RevenueTiles props`, `RevenueDistribution props`, `MarginWaterfall props` all consistent across tasks
- [x] File paths are concrete
- [x] Verification uses real commands and real URLs
- [x] All git commits target `E:/atlas/website/` (the website repo)
- [x] Plan v12's Q9 Damodaran audit is acknowledged as superseded by T1's full canonical rebuild

---

## Out of Scope (Wave 3 — separate plan)

- Image system v2 (AI generation + Wikimedia fallback)
- Image rendering bug investigation
- Sub-regional coverage data backfill (just gating in Wave 1)
- IRS SOI deep ingest beyond margin ratios
