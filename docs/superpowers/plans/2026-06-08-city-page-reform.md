# City Page Reform Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. This plan adapts the standard TDD loop to this repo's reality: there is **no local `npm run build` / `npx tsc` / unit-test step** (OOM > 600 MB; Vercel owns the build). Verification per task is the project's shipping loop: per-file stage, commit on `reform-v2/palette-brick`, push a Vercel preview, mobile-screenshot the affected routes, eyeball, then fast-forward `main`. This ordering and these constraints come from the founder and override the skill's default TDD ceremony.

**Goal:** Reform the `/cities/[slug]` page per the founder's 2026-06-08 review: lighter masthead, a renamed and rescaled Business Climate Score, ruled and relabeled data tables with tooltips, a universal-friendly signature panel, a four-card neighborhoods strip, a two-column "everyday trades" table, and a structured three-peer comparison.

**Architecture:** All changes are server-rendered. The board kit (`StatGrid`, `DataSection`) gains an **opt-in `variant="ruled"`** so only the city board changes this round; cell and country boards stay byte-identical. Score, peers, and activities logic stay in `src/lib`; the page stays a thin composition. No new client JS (the one tooltip is CSS-only). No Supabase, no new queries.

**Tech Stack:** Next.js 15.5 App Router, React 19.2 server components, TypeScript 5, Tailwind 3.4, design tokens only (no raw hex/px in inline styles), static JSON data under `data/cities` and `data/economics`.

**Resolved decisions (founder, 2026-06-08):** masthead keeps the photo, drops only the CSS filter; score bands read **Excellent / Strong / Moderate / Difficult**; the trades slate is the ten with real data (pharmacies deferred); the ruled-table look ships **city-first** behind an opt-in. Two standing assumptions: the peer same-country rule is "at most one, except US/CN/IN allow two", and the praised "signature activities" is the ranked trades table (its badges + real take-home are preserved inside the two-column reform).

---

## Task order (each shipped + verified before the next)

A (masthead) -> B (score) -> C (board tables) -> F (everyday trades) -> E (neighborhoods) -> D (signature panel) -> G (peers). Easy and contained first; the two algorithmic items last.

## Verification loop (applies to every task)

1. Stage only the files the task names: `git -C /e/atlas/website add <exact paths>` (never `git add -A`; bracket route paths need `GIT_LITERAL_PATHSPECS=1`).
2. Commit on `reform-v2/palette-brick` with a precise message.
3. Push a preview and read the URL: `git -C /e/atlas/website push origin reform-v2/palette-brick` (Vercel builds the branch preview).
4. Screenshot, from `E:\atlas\website` in PowerShell: `node scripts/shot_preview.mjs <preview-url> "/cities/london" --mobile` and again for `"/cities/new-orleans"` (a thin Tier-2 city) and `"/cities/new-york"`. Preview auth: header `x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o`, `x-vercel-set-bypass-cookie: true`, a browser UA (the script already sets these).
5. Eyeball the affected section on mobile + desktop. Confirm: no `NaN`/`undefined`, no em-dash, on-palette, the change is present, and the cell + country pages are untouched where the task says so.
6. Ship: `git -C /e/atlas/website push origin reform-v2/palette-brick:main`, confirm `https://www.marginatlas.com/...` (follow the 307 to www) shows it.

---

## Task A: Masthead photo, drop only the filter

**Files:**
- Modify: `src/components/board/MastheadImage.tsx:31-51`
- Modify: `src/app/cities/[slug]/page.tsx:233`

- [ ] **Step 1: Add a `filter` prop to MastheadImage and gate the inline filter on it.** Replace the component signature and the `<img>` so the desaturation filter is applied only when `filter` is true (default true, so the country page is unchanged):

```tsx
export function MastheadImage({
  src,
  filter = true,
}: {
  /** The already-resolved photo URL for this place. Omit / null to self-omit. */
  src?: string | null;
  /** When false, render the photo in full colour (no grayscale/saturate filter).
   *  The city page passes false (founder 2026-06-08); the country page keeps true. */
  filter?: boolean;
}) {
  if (!src) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        style={filter ? { filter: "grayscale(0.55) contrast(1.02) saturate(0.7)" } : undefined}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,247,230,0.55) 0%, rgba(255,247,230,0.78) 55%, rgba(255,247,230,0.97) 100%)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: City page opts out of the filter.** In `src/app/cities/[slug]/page.tsx:233`, change `<MastheadImage src={mastheadSrc} />` to `<MastheadImage src={mastheadSrc} filter={false} />`.

- [ ] **Step 3: Verify** via the loop. Confirm the city masthead photo now reads in full (faint) colour and the **country** page masthead still looks identical to before (it never passed `filter`, so it keeps the duotone). Commit message: `feat(city): drop masthead photo filter on city pages`.

---

## Task B: Business Climate Score

**Files:**
- Modify: `src/components/board/BreakInScore.tsx:122-164` (the `CityScoreMasthead` export and a new `climateWord` helper)

Leave `bandText`, `bandWord`, `bandPill`, and `BreakInMasthead` untouched so cell pages do not move.

- [ ] **Step 1: Add a city-only band-word helper** just above `CityScoreMasthead` (after `bandPill`, around line 69):

```tsx
/** City Business Climate Score band words. Higher = a better climate to do
 * business in. Separate from bandWord (which labels cell break-in difficulty) so
 * the cell masthead is unaffected. */
function climateWord(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "Excellent";
    case "manageable":
      return "Strong";
    case "demanding":
      return "Moderate";
    case "brutal":
      return "Difficult";
  }
}
```

- [ ] **Step 2: Rebuild `CityScoreMasthead`** (lines 135-164) so the label reads "Business Climate Score", the number shows in its band colour with a muted `/100`, and the band pill uses `climateWord`:

```tsx
export function CityScoreMasthead({
  score,
}: {
  score: { score: number; band: BreakInBand } | null;
}) {
  if (!score) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="flex items-baseline gap-0.5">
        <span
          className={`font-display text-4xl font-semibold leading-none tabular-nums md:text-5xl ${bandText(
            score.band,
          )}`}
        >
          {score.score}
        </span>
        <span className="font-display text-xl font-semibold tabular-nums leading-none text-cocoa-400 md:text-2xl">
          /100
        </span>
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
          Business Climate Score
        </span>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandPill(
            score.band,
          )}`}
        >
          {climateWord(score.band)}
        </span>
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Verify** via the loop on `/cities/new-york` (high score) and `/cities/new-orleans` (lower). Confirm `82/100` style with the 82 coloured and `/100` muted, label "Business Climate Score", word from the new set. Confirm a cell page's break-in masthead is unchanged (still "Break-in rating" + Forgiving/etc). Commit: `feat(city): rebrand headline to Business Climate Score, show /100 and climate bands`.

---

## Task C: Ruled, relabeled data tables with tooltips

**Files:**
- Create: `src/components/board/InfoDot.tsx`
- Modify: `src/components/board/StatGrid.tsx` (add `tip` to `StatRow`, add `variant`)
- Modify: `src/components/board/DataSection.tsx` (add `variant`, bigger title in ruled mode)
- Modify: `src/lib/scores/city_board.ts:206-315` (relabel/drop rows, monthly salary, tips)
- Modify: `src/app/cities/[slug]/page.tsx:264-268` (pass `variant="ruled"`)

- [ ] **Step 1: Create the CSS-only InfoDot.** No client JS; reveals on hover and keyboard focus.

```tsx
/**
 * src/components/board/InfoDot.tsx
 *
 * A tiny "?" affordance that reveals a one-line explanation on hover or keyboard
 * focus. CSS-only (group-hover + group-focus-within), so the static board stays
 * free of client JS. Tokens only, no raw hex. Used by the ruled StatGrid in place
 * of a stacked sub-label, per founder direction 2026-06-08.
 */
import * as React from "react";

export function InfoDot({ tip }: { tip: string }) {
  return (
    <span className="group/info relative ml-1 inline-flex align-middle">
      <span
        tabIndex={0}
        role="note"
        aria-label={tip}
        className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-cocoa-300 text-[9px] font-semibold leading-none text-cocoa-500 select-none"
      >
        ?
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-48 rounded-lg border border-parchment bg-white p-2 text-[11px] font-normal normal-case leading-snug tracking-normal text-cocoa-700 opacity-0 shadow-sm transition-opacity duration-150 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Extend `StatRow` and add the ruled variant to `StatGrid`.** Add `tip?: string` to the type and a `variant` prop. Keep the existing grid branch exactly as-is so cell/country boards do not change.

```tsx
import { InfoDot } from "./InfoDot";

export type StatRow = {
  label: string;
  value: string | null;
  hint?: string;
  /** Optional one-line explanation shown as a "?" tooltip (ruled variant only). */
  tip?: string;
};

export function StatGrid({
  rows,
  muteEmpty = false,
  variant = "grid",
}: {
  rows: StatRow[];
  muteEmpty?: boolean;
  variant?: "grid" | "ruled";
}) {
  if (variant === "ruled") {
    return (
      <dl className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
        {rows.map((row) => {
          const blank = row.value == null || row.value === MISSING;
          return (
            <div
              key={row.label}
              className={`flex items-baseline justify-between gap-3 border-b border-parchment py-2.5 ${
                blank && muteEmpty ? "opacity-60" : ""
              }`}
            >
              <dt className="flex items-center text-[13px] text-cocoa-700">
                <span>{row.label}</span>
                {row.tip ? <InfoDot tip={row.tip} /> : null}
              </dt>
              <dd
                className={
                  blank
                    ? "font-display text-[15px] font-semibold tabular-nums text-cocoa-400"
                    : "font-display text-[15px] font-semibold tabular-nums text-ink-900"
                }
              >
                {blank ? MISSING : row.value}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
      {rows.map((row) => {
        const blank = row.value == null || row.value === MISSING;
        return (
          <div key={row.label} className={blank && muteEmpty ? "opacity-60" : undefined}>
            <dt className="text-[11px] uppercase tracking-wide text-cocoa-500">{row.label}</dt>
            <dd
              className={
                blank
                  ? "font-display text-lg font-semibold tabular-nums text-cocoa-400"
                  : "font-display text-lg font-semibold tabular-nums text-ink-900"
              }
            >
              {blank ? MISSING : row.value}
            </dd>
            {row.hint ? (
              <dd className="mt-0.5 text-[11px] text-cocoa-500">{row.hint}</dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
```

- [ ] **Step 3: Thread `variant` through `DataSection` and enlarge the title in ruled mode.** Add the prop, render an `h3` instead of the 10px eyebrow when ruled, and pass `variant` to both `StatGrid` calls:

```tsx
export function DataSection({
  section,
  muteEmpty = false,
  variant = "grid",
}: {
  section: BoardSection;
  muteEmpty?: boolean;
  variant?: "grid" | "ruled";
}) {
  const inline = section.rows.slice(0, INLINE_ROWS);
  const overflow = section.rows.slice(INLINE_ROWS);

  return (
    <section className="mt-8">
      {variant === "ruled" ? (
        <h3 className="font-display text-base font-semibold tracking-tight text-ink-900 md:text-lg">
          {section.title}
        </h3>
      ) : (
        <SectionEyebrow>{section.title}</SectionEyebrow>
      )}

      {section.dek ? <p className="mt-1 text-sm text-cocoa-700">{section.dek}</p> : null}
      {section.chart ? <div className="mt-3">{section.chart}</div> : null}

      <div className="mt-3">
        <StatGrid rows={inline} muteEmpty={muteEmpty} variant={variant} />
      </div>

      {overflow.length > 0 ? (
        <ShowMore>
          <StatGrid rows={overflow} muteEmpty={muteEmpty} variant={variant} />
        </ShowMore>
      ) : null}

      {section.modeled ? (
        <p className="mt-3 text-[11px] text-cocoa-500">
          Modeled from national business demography. Directional.
        </p>
      ) : null}

      {section.footer ? <div className="mt-3">{section.footer}</div> : null}
    </section>
  );
}
```

- [ ] **Step 4: Relabel and trim the rows in `buildCityBoard`** (`src/lib/scores/city_board.ts`). Replace the demand/location/market/survival row arrays (lines 223-307) with the versions below. Changes: "Population/metro residents" -> "Metro population"; "Households" -> "Average net wealth per citizen" (blank for now); income proxy -> "Average salary" shown **per month**; "Footfall" -> "Annual visitors"; drop "Prime rent"; drop "Saturation" + "Business density"; "Informality" -> "Self-employment" (no suffix); drop "Closure rate"; sub-labels become `tip`s.

Add the monthly income line (replaces the annual `incomeProxy` block at lines 217-222):

```ts
  const cityMonthly = isNum(city.avgGrossSalaryUsdYear)
    ? city.avgGrossSalaryUsdYear / 12
    : null;
  const countryMonthly = econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary : null;
  const monthlyIncome = cityMonthly ?? countryMonthly;
```

```ts
  const demandRows: StatRow[] = [
    {
      label: "Metro population",
      value: isNum(population) ? fmtInt(population) : null,
      tip: "Resident population of the wider metro area.",
    },
    {
      label: "Average net wealth per citizen",
      value: null,
      tip: "Average net wealth per resident. Being filled in from metro wealth data.",
    },
    {
      label: "Average salary",
      value: isNum(monthlyIncome) ? `${fmtUSD(monthlyIncome)}/mo` : null,
      tip: "Average gross salary, per month, before tax.",
    },
    {
      label: "Annual visitors",
      value: isNum(city.touristArrivalsM) ? `${fmtNum(city.touristArrivalsM)}M` : null,
      tip: "Tourist arrivals per year, a proxy for street footfall.",
    },
  ];

  const locationRows: StatRow[] = [
    {
      label: "Rent pressure",
      value: L ? textOrNull(L.rentPressure) : null,
      tip: "The most common rent-pressure level across local trades.",
    },
    {
      label: "Cost of living",
      value: isNum(city.costOfLivingIndex) ? fmtNum(city.costOfLivingIndex) : null,
      tip: "Cost-of-living index. A leading metro sits at 100.",
    },
  ];

  const marketRows: StatRow[] = [
    {
      label: "Self-employment",
      value:
        econ && isNum(econ.selfEmploymentPct)
          ? `${Math.round(econ.selfEmploymentPct)}%`
          : null,
      tip: "Share of workers who are self-employed. A country-level figure.",
    },
  ];

  const survivalRows: StatRow[] = [
    {
      label: "1-year survival",
      value: isNum(survival.yr1) ? `${survival.yr1}%` : null,
      tip: "Share of new businesses still trading after a year. Representative across local trades.",
    },
    { label: "3-year survival", value: isNum(survival.yr3) ? `${survival.yr3}%` : null },
    { label: "5-year survival", value: isNum(survival.yr5) ? `${survival.yr5}%` : null },
  ];
```

Leave the `return [...]` section list (lines 309-314) and titles unchanged. (The `hasSurvivalCurve` line above `survival` stays; the `tip` on the 1-year row replaces the old `hint`.)

- [ ] **Step 5: City page passes the ruled variant.** In `src/app/cities/[slug]/page.tsx`, change the board map (lines 265-267) to `<DataSection section={s} key={s.key} muteEmpty variant="ruled" />`.

- [ ] **Step 6: Verify** via the loop. On `/cities/london`: ruled rows with hairline separators, bigger section titles, a "?" by each label that reveals on hover/focus, "Average salary" shown per month, no Saturation/Business density/Households/Prime rent/Closure rate rows, "Self-employment" not "Informality". On a **cell** page and a **country** page: boards look exactly as before (grid variant untouched). Commit: `feat(city): ruled board tables, clearer labels, tooltips; drop dead rows`.

---

## Task F: "Everyday trades", two columns, fixed slate of ten

**Files:**
- Modify: `src/lib/scores/city_board.ts` (`CityActivityRow` type nullable badge; `buildCityActivities` -> fixed slate)
- Modify: `src/app/cities/[slug]/page.tsx:340-400` (two-column render, conditional badge/dash) + add `MISSING` import

- [ ] **Step 1: Make the badge fields nullable** on `CityActivityRow` (lines 385-392) so a trade with no trusted-local cell can still appear with a dash:

```ts
  /** Break-in score, integer 0..100, or null when no trusted local cell exists. */
  breakInScore: number | null;
  /** The band word driving the per-row badge tone, or null. */
  breakInBand: BreakInBand | null;
```

- [ ] **Step 2: Add the slate and rewrite `buildCityActivities`** (replace lines 487-567). It iterates a fixed list of ten everyday trades, resolves each cell under the city, fills figures only for trusted-local cells (else a dash row), and omits the whole section only when fewer than three trades carry a real take-home:

```ts
/** The ten everyday trades shown on every city, in a stable order. Each resolves
 * to a real industry in the taxonomy. Pharmacies are intentionally absent (not
 * modeled yet, founder 2026-06-08); revisit when a pharmacies industry exists. */
const POPULAR_TRADES: string[] = [
  "restaurants",
  "grocery_stores",
  "doctors_clinics",
  "auto_repair_shops",
  "hairdressers_beauty",
  "clothing_stores",
  "cafes_coffee",
  "bars_nightclubs",
  "dental_practices",
  "sports_fitness",
];

export async function buildCityActivities(input: {
  slug: string;
  countryIso2: string;
}): Promise<CityActivityRow[]> {
  const citySlug = input.slug;
  const iso2Upper = input.countryIso2.toUpperCase();
  const iso2Lower = input.countryIso2.toLowerCase();

  const econSnap = getCountryEconomicsSnapshot(iso2Upper);
  const annualIncome = isNum(econSnap.avgMonthlySalary) ? econSnap.avgMonthlySalary * 12 : null;

  const resolved = await Promise.all(
    POPULAR_TRADES.map(async (industryId) => {
      const activitySlug = industryToSlug(industryId);
      const cell = await withBudget(
        getCellBySlug(iso2Lower, citySlug, activitySlug, { sizeBand: null, year: null }),
        null,
        4_000,
        `city-activities:${iso2Lower}/${citySlug}/${industryId}`,
      );
      return { industryId, activitySlug, cell };
    }),
  );

  const rows: CityActivityRow[] = [];
  let withFigures = 0;
  for (const r of resolved) {
    const ind = INDUSTRY_BY_ID[r.industryId];
    const name = ind?.name ?? r.activitySlug.replace(/-/g, " ");
    const base = { name, slug: r.activitySlug, href: `/${iso2Lower}/${citySlug}/${r.activitySlug}` };

    const cell = r.cell;
    if (cell && isTrustedLocalCell(cell, r.industryId)) {
      const rating = breakInForCell(cell, citySlug, annualIncome);
      const { takeHome, netMarginPct } = takeHomeAndMarginForCell(cell, annualIncome);
      if (rating != null && isNum(takeHome)) {
        withFigures += 1;
        rows.push({
          ...base,
          breakInScore: rating.score,
          breakInBand: rating.band,
          takeHome,
          netMarginPct,
        });
        continue;
      }
    }
    // No trusted local figure: keep the trade on the slate with a dash, never a
    // borrowed or invented number.
    rows.push({ ...base, breakInScore: null, breakInBand: null, takeHome: null, netMarginPct: null });
  }

  // A slate of all-dashes is not worth showing; require at least three real reads.
  if (withFigures < MIN_CITY_ACTIVITY_ROWS) return [];

  rows.sort((a, b) => {
    const ta = a.takeHome ?? -Infinity;
    const tb = b.takeHome ?? -Infinity;
    if (tb !== ta) return tb - ta;
    return (b.breakInScore ?? -Infinity) - (a.breakInScore ?? -Infinity);
  });
  return rows;
}
```

(The helper `takeHomeAndMarginForCell` and constant `MIN_CITY_ACTIVITY_ROWS` are unchanged; `CITY_ACTIVITY_SLATE` and the `getTopIndustriesForCountry` import become unused, remove the constant and drop `getTopIndustriesForCountry` from the import on line 58 if nothing else uses it.)

- [ ] **Step 3: Two-column render** in `src/app/cities/[slug]/page.tsx`. Add `MISSING` to the format import (line 49: `import { fmtUSD, fmtPct, MISSING } from "@/components/board/format";`). Replace the activities `<section>` body (the eyebrow, dek, and single `<ul>`, lines 348-398) with:

```tsx
          <section className="mt-10">
            <SectionEyebrow>Everyday trades</SectionEyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mt-1">
              What an owner keeps in {city.name}
            </h2>
            <p className="text-sm md:text-base text-cocoa-700/80 mt-1.5 mb-5 max-w-2xl leading-relaxed">
              The everyday businesses you find in almost any city, and what a
              typical owner keeps after tax in {city.name}. The badge is the same 0
              to 100 break-in read each business shows on its own page, higher means
              easier to get started. Modeled from local business demography.
              Directional.
            </p>
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {[
                activities.slice(0, Math.ceil(activities.length / 2)),
                activities.slice(Math.ceil(activities.length / 2)),
              ].map((col, ci) => (
                <ul key={ci} className="divide-y divide-parchment border-y border-parchment">
                  {col.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={a.href}
                        className="group flex items-baseline justify-between gap-3 py-2.5 transition-colors"
                      >
                        <span className="flex min-w-0 items-baseline gap-2.5">
                          <span className="truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700 transition-colors">
                            {a.name}
                          </span>
                          {a.breakInScore != null && a.breakInBand != null ? (
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${breakInBadge(
                                a.breakInBand,
                              )}`}
                            >
                              <span className="tabular-nums">{a.breakInScore}</span>
                              <span>{breakInWord(a.breakInBand)}</span>
                            </span>
                          ) : null}
                        </span>
                        <span className="flex shrink-0 items-baseline gap-3">
                          {a.netMarginPct != null && (
                            <span className="hidden text-[11px] tabular-nums text-cocoa-500 sm:inline">
                              {fmtPct(a.netMarginPct)} net
                            </span>
                          )}
                          <span className="font-display text-base font-semibold tabular-nums text-ink-900">
                            {a.takeHome != null ? fmtUSD(a.takeHome) : MISSING}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-cocoa-500">
              Owner take-home is after tax, for a typical single-site operator.
            </p>
          </section>
```

- [ ] **Step 4: Verify** via the loop. On `/cities/new-york`: two columns, the ten everyday trades (restaurants, grocery, doctors/clinics, auto repair, hairdressers/beauty, clothing, cafes, bars, dentists, gyms), badges where real, a dash where not. On a thin city: the section either shows the slate (if 3+ real) or omits cleanly. Commit: `feat(city): everyday-trades table, two columns, fixed ten-trade slate`.

---

## Task E: Neighborhoods strip, four featured + explore-all

**Files:**
- Modify: `src/lib/cities/neighborhoods.ts` (add `featured?` to the `Neighborhood` type)
- Modify: `src/lib/economics/neighborhood_multipliers.ts` (add `getNeighborhoodTags` accessor)
- Modify: `data/cities/neighborhoods_v1.json` (flag four featured per flagship city)
- Modify: `src/app/cities/[slug]/page.tsx:109-114, 301-338` (local type + section rewrite)

- [ ] **Step 1: Confirm the neighborhood row's tag field.** Read `src/lib/economics/neighborhood_multipliers.ts` around the `FILE.neighborhoods` row type and where `appliedTags` is derived. Add an accessor (place it next to `getNeighborhoodMultiplier`); use the row's actual tags field name (it is `tags` if that is what `appliedTags` reads):

```ts
/** The economic tags curated for a neighborhood (financial_cbd, tourist_zone, ...)
 * or [] when none. Industry-agnostic, so the city page can describe an area without
 * choosing a trade. */
export function getNeighborhoodTags(
  citySlug: string,
  neighborhoodSlug: string,
): NeighborhoodTag[] {
  const row = FILE.neighborhoods[key(citySlug, neighborhoodSlug)];
  return row?.tags ?? [];
}
```

- [ ] **Step 2: Add `featured?: boolean`** to the `Neighborhood` type in `src/lib/cities/neighborhoods.ts` (the type around lines 42-52) and to the page-local `Neighborhood` type in `page.tsx` (lines 109-114):

```ts
type Neighborhood = {
  slug: string;
  name: string;
  character: string;
  description?: string;
  featured?: boolean;
};
```

- [ ] **Step 3: Flag four featured neighborhoods** for the flagship cities in `data/cities/neighborhoods_v1.json`. For `new-york`, set `"featured": true` on the four entries that best match the boroughs the founder named: the Manhattan-Midtown entry (as the Manhattan stand-in), Brooklyn, Queens, and The Bronx. For `london`, flag four iconic areas present in its scheme (e.g. the City, the West End/Westminster, Camden, and one more from the existing list). Do not rename any slug. Cities without flags fall back to their first four.

- [ ] **Step 4: Rewrite the neighborhoods section** in `page.tsx` (lines 301-338). Import the helpers at the top: `import { getNeighborhoodTags, tagLabel } from "@/lib/economics/neighborhood_multipliers";`. Add a small descriptor helper above the component, then the new section:

```tsx
function neighborhoodDescriptor(citySlug: string, n: Neighborhood): string {
  const tags = getNeighborhoodTags(citySlug, n.slug);
  if (tags.length > 0) return tags.slice(0, 2).map(tagLabel).join(", ");
  return n.character.replace(/-/g, " ");
}
```

```tsx
        {scheme && scheme.neighborhoods.length > 0 && (() => {
          const featured = scheme.neighborhoods.filter((n) => n.featured).slice(0, 4);
          const shown = featured.length > 0 ? featured : scheme.neighborhoods.slice(0, 4);
          return (
            <section className="mb-12 md:mb-16">
              <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
                Neighborhoods
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
                Where {city.name} does business
              </h2>
              <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
                The areas that set the tone, each with its own pace and prices. Open
                one for its street-level numbers.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {shown.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}`}
                    className="group block rounded-xl border border-parchment hover:border-atlas-500 bg-cream-50 p-4 transition-colors"
                  >
                    <div className="font-medium text-sm text-ink-900 group-hover:text-atlas-700 leading-tight">
                      {n.name}
                    </div>
                    <div className="text-[11px] text-cocoa-700/60 mt-1 capitalize">
                      {neighborhoodDescriptor(city.slug, n)}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href={`/cities/${city.slug}/neighborhoods`}
                  className="text-sm text-atlas-700 font-medium underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
                >
                  Explore all neighborhoods →
                </Link>
              </div>
            </section>
          );
        })()}
```

- [ ] **Step 5: Verify** via the loop on `/cities/new-york` (the four boroughs lead, no "shape of New York" line, no "The N sub-areas", one explore-all button, the per-card descriptor reads as a real area type) and a city with no flags (shows its first four). Commit: `feat(city): four featured neighborhoods, drop the all-list redundancy and the weak headings`.

---

## Task D: Signature panel, universal demographics + real standout sectors

**Files:**
- Modify: `src/components/cities/CitySignaturePanel.tsx` (demographics framing, sector heading, kill the country sector fallback)
- Modify: `src/lib/scores/city_board.ts` (export a `buildCityStandoutSectors` helper) OR a new `src/lib/scores/city_standout.ts`
- Modify: `src/app/cities/[slug]/page.tsx` (pass derived standouts into the panel)

This is the one item with genuine design latitude; the steps below are the agreed shape, but the standout derivation is reviewed on its first city before rollout.

- [ ] **Step 1: Stop the generic country sector fallback.** In `resolveSignature` (CitySignaturePanel.tsx line 114), change `signature_sectors: city.signature_sectors ?? country.signature_sectors` to `signature_sectors: city.signature_sectors ?? []`, and in the city-only branch keep requiring real city sectors. The panel must render its People block even when sectors is empty (see Step 3), so a city without a curated entry no longer shows its country's three sectors as if they were the city's.

- [ ] **Step 2: Derive real standout sectors when a city has none curated.** Add `buildCityStandoutSectors(citySlug, countryIso2)` (new file `src/lib/scores/city_standout.ts`) that reuses the cell engine: resolve the city's trusted-local trades (the same path as `buildCityActivities`), score each by how far its local owner take-home sits **above the country baseline** for that trade, and return the top one to three as `{ label, industry_slug, blurb }` where the blurb is a plain, generated one-liner ("Owners here keep more than the national norm." style, no source agency, no em-dash). When fewer than one standout resolves, return `[]`. Full signature and bounds to be written against the engine in this step (mirror `takeHomeAndMarginForCell`).

- [ ] **Step 3: Universal-friendly demographics + flexible sector block.** In `CitySignaturePanel.tsx`: (a) when `foreign_born_pct`/`foreign_owned_pct` are low or absent, soften the People block so it does not lead with a near-zero number (render the stat only when meaningful, else a neutral one-liner); (b) accept an optional `standoutSectors` prop and render `sig.signature_sectors` if present, else the derived standouts, under a reframed heading that works for one to three items, e.g. "What stands out here" instead of the rigid "Three sectors that say {City}"; (c) when neither curated nor derived sectors exist, omit just the sector block (keep People). Exact JSX written in this step.

- [ ] **Step 4: Page wires the derived standouts.** In `page.tsx`, compute `const standout = await buildCityStandoutSectors(city.slug, city.iso2);` and pass `standoutSectors={standout}` to `<CitySignaturePanel ... />`.

- [ ] **Step 5: Verify** via the loop on a curated city (`/cities/new-york`, still shows its curated sectors), a non-curated multi-ethnic city (derived standouts appear, no country clone), and a non-curated monocultural city (People block reads fine with low diversity, sector block shows derived standouts or omits). Confirm the **country** page's signature panel (which passes `showInstitutions`) is unaffected. Commit: `feat(city): universal signature demographics and real per-city standout sectors`.

---

## Task G: Structured three-peer comparison

**Files:**
- Create: `data/cities/city_rivals_v1.json`
- Modify: `src/lib/cities/comparable_cities.ts` (add `getCityPeerSet`, keep `getComparableCities` intact for the cell ribbon)
- Modify: `src/lib/scores/city_peers.ts` (use `getCityPeerSet`, carry the role)
- Modify: `src/components/cities/CityPeers.tsx` (role caption + new subhead)

- [ ] **Step 1: Create the curated rivalry map.** `data/cities/city_rivals_v1.json` (slugs must match `city_list_v1.json`; the lookup guards missing entries):

```json
{
  "rivals": {
    "london": "paris",
    "paris": "london",
    "new-york": "los-angeles",
    "los-angeles": "new-york",
    "hong-kong": "singapore",
    "singapore": "hong-kong",
    "tokyo": "osaka",
    "shanghai": "beijing",
    "beijing": "shanghai",
    "madrid": "barcelona",
    "barcelona": "madrid",
    "milan": "rome",
    "rome": "milan",
    "sydney": "melbourne",
    "melbourne": "sydney",
    "toronto": "montreal",
    "montreal": "toronto",
    "sao-paulo": "rio-de-janeiro",
    "rio-de-janeiro": "sao-paulo",
    "mumbai": "delhi",
    "delhi": "mumbai",
    "berlin": "munich",
    "munich": "berlin",
    "dubai": "abu-dhabi"
  }
}
```

- [ ] **Step 2: Add `getCityPeerSet`** to `comparable_cities.ts` (do not touch `getComparableCities`). It picks a local competitor, a curated/derived rival, and a peer abroad, within a population band, capping same-country peers at one (two for US/CN/IN):

```ts
import cityRivalsJson from "../../../data/cities/city_rivals_v1.json";

const RIVALS = (cityRivalsJson as { rivals: Record<string, string> }).rivals;
const BIG_COUNTRIES = new Set(["US", "CN", "IN"]);

export type PeerRole = "competitor" | "rival" | "international";
export type CityPeerPick = CityEntry & { role: PeerRole };

function withinPopRange(seed: CityEntry, c: CityEntry, ratio = 3): boolean {
  if (!(seed.pop_m > 0) || !(c.pop_m > 0)) return true;
  const r = c.pop_m / seed.pop_m;
  return r >= 1 / ratio && r <= ratio;
}

function rankBySimilarity(seed: CityEntry, pool: CityEntry[]): CityEntry[] {
  return pool
    .map((c) => ({ c, d: similarityDistance(seed, c) }))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.c);
}

export function getCityPeerSet(citySlug: string | null | undefined): CityPeerPick[] {
  if (!citySlug) return [];
  const seed = BY_SLUG[citySlug.toLowerCase()];
  if (!seed) return [];

  const all = CITIES.filter((c) => c.slug !== seed.slug);
  const inRange = all.filter((c) => withinPopRange(seed, c));
  const pool = inRange.length >= 6 ? inRange : all;

  const picks: CityPeerPick[] = [];
  const usedSlugs = new Set<string>();
  const usedCountries = new Set<string>();
  const sameCountryCap = BIG_COUNTRIES.has(seed.iso2) ? 2 : 1;
  let sameCountryUsed = 0;

  const canTake = (c: CityEntry): boolean => {
    if (usedSlugs.has(c.slug)) return false;
    if (c.iso2 === seed.iso2) return sameCountryUsed < sameCountryCap;
    return !usedCountries.has(c.iso2);
  };
  const take = (c: CityEntry, role: PeerRole): void => {
    picks.push({ ...c, role });
    usedSlugs.add(c.slug);
    if (c.iso2 === seed.iso2) sameCountryUsed += 1;
    else usedCountries.add(c.iso2);
  };

  // 1) Local competitor: nearest same country, else same continent, else anywhere.
  const competitor =
    rankBySimilarity(seed, pool.filter((c) => c.iso2 === seed.iso2)).find(canTake) ??
    rankBySimilarity(
      seed,
      pool.filter((c) => c.iso2 !== seed.iso2 && c.continent === seed.continent),
    ).find(canTake) ??
    rankBySimilarity(seed, pool).find(canTake);
  if (competitor) take(competitor, "competitor");

  // 2) Classic rival: curated if present + takeable (editorial, ignores pop band),
  //    else nearest cross-country.
  const rivalEntry = RIVALS[seed.slug] ? BY_SLUG[RIVALS[seed.slug]] : undefined;
  const rival =
    rivalEntry && rivalEntry.slug !== seed.slug && canTake(rivalEntry)
      ? rivalEntry
      : rankBySimilarity(seed, pool.filter((c) => c.iso2 !== seed.iso2)).find(canTake);
  if (rival) take(rival, "rival");

  // 3) Peer abroad: nearest from a different continent than the seed.
  const intl =
    rankBySimilarity(seed, pool.filter((c) => c.continent !== seed.continent)).find(canTake) ??
    rankBySimilarity(seed, pool.filter((c) => c.iso2 !== seed.iso2)).find(canTake);
  if (intl) take(intl, "international");

  // Backfill to three if a role could not be filled.
  if (picks.length < 3) {
    for (const c of rankBySimilarity(seed, pool)) {
      if (picks.length >= 3) break;
      if (canTake(c)) take(c, "international");
    }
  }

  return picks.slice(0, 3);
}
```

- [ ] **Step 3: Switch `buildCityPeers`** (`city_peers.ts`) to `getCityPeerSet` and carry the role onto `CityPeer`:

```ts
import { getCityPeerSet, type PeerRole } from "@/lib/cities/comparable_cities";
// add to CityPeer: role: PeerRole;
export function buildCityPeers(citySlug: string, limit = 3): CityPeer[] {
  const peers = getCityPeerSet(citySlug).slice(0, limit);
  const out: CityPeer[] = [];
  for (const peer of peers) {
    const record = BY_SLUG.get(peer.slug);
    const econ = getCountryEconomicsSnapshot(peer.iso2);
    const scored = record
      ? buildCityScore({
          city: {
            slug: record.slug,
            popM: record.pop_m ?? null,
            avgGrossSalaryUsdYear: record.avg_gross_salary_usd_year ?? null,
            costOfLivingIndex: record.cost_of_living_index ?? null,
            touristArrivalsM: record.tourist_arrivals_m ?? null,
          },
          econ: { selfEmploymentPct: econ.selfEmploymentPct, avgMonthlySalary: econ.avgMonthlySalary },
        })
      : null;
    out.push({
      slug: peer.slug,
      name: peer.name,
      iso2: peer.iso2,
      continent: peer.continent,
      role: peer.role,
      score: scored ? scored.score : null,
      band: scored ? scored.band : null,
    });
  }
  return out;
}
```

- [ ] **Step 4: Show the role + new subhead** in `CityPeers.tsx`. Add a `roleLabel` helper and render it as the card's small caption (replacing the continent eyebrow text, keeping the flag), and change the H2 (line 85) to "A local competitor, a classic rival, and a peer abroad.":

```tsx
import type { PeerRole } from "@/lib/cities/comparable_cities";
function roleLabel(role: PeerRole): string {
  switch (role) {
    case "competitor": return "Local competitor";
    case "rival": return "Classic rival";
    case "international": return "Peer abroad";
  }
}
// in the card header, replace <span>{p.continent}</span> with <span>{roleLabel(p.role)}</span>
```

- [ ] **Step 5: Verify** via the loop on `/cities/london` (expect Paris as the classic rival), `/cities/new-york` (expect Los Angeles; US may carry two same-country peers), `/cities/hong-kong` (expect Singapore). Confirm roles read correctly, populations are in a sane range, and the **cell** page's comparable-cities ribbon (still using `getComparableCities`) is unchanged. Commit: `feat(city): structured peers (competitor, classic rival, peer abroad) with rivalry map`.

---

## Self-review: spec coverage

| Founder point | Task |
|---|---|
| Remove image effect (keep photo, drop filter) | A |
| Rename to Business Climate Score, 82/100 coloured, smarter band words | B |
| Table separators + bigger titles | C |
| "Metro population" (drop sub-label) | C |
| "Households" -> "Average net wealth per citizen" (blank for now) | C |
| Monthly salary, not annual | C |
| "Footfall" -> clearer ("Annual visitors") | C |
| "?" tooltips instead of title+subtitle | C |
| Self-employment vs informality conflation fixed | C |
| Saturation + business density removed | C |
| "What makes X X": universal demographics | D |
| Three signature sectors removed-as-is, reformed to per-city standout | D |
| Signature activities table preserved (badges, real take-home) | F |
| Neighborhoods: max four, kill all-list redundancy, keep explore-all | E |
| Kill "shape of {City}" subtitle + "{N} sub-areas" heading | E |
| "What an owner keeps": two columns | F |
| Ten popular everyday trades, not abstract categories | F |
| Peers: competitor + historical rival + peer abroad, pop range, same-country cap | G |

All eighteen points map to a task. Deferred (noted, not in this plan): filling the net-wealth figure from the old wealth data with a per-country uplift; adding a pharmacies industry.
