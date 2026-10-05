# Phase C, steps 14 to 21: half of every UK chapter behind Pro, never in a cached page

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md`. Tick boxes here; record each
> step in `LEDGER.md`.

**Goal:** on UK pages, each chapter's first level free and every later level locked (ruling 18); a locked section shows its title
and icon, a blurred drawing behind, one line and one button, no pop-up (ruling 22); search engines read the free half and the
locked parts carry `isAccessibleForFree: false` (interview, "contradictions reconciled"); a Pro reader sees everything. All of it
behind `isPaywallOn()` (step 10), so production does not change until his launch switch.

**Architecture, and why.** The UK pages are rendered ahead of time and cached for everyone (`revalidate` 86400 on `[country]` and
the trade route, 43200 on `cities/[slug]`; the middleware adds `public, s-maxage=21600`). A cached page cannot know its reader, so:
1. The public pages render the locked form for everyone. A locked section is a stand-in: its real figures are never in the
   HTML (the "no leaked values" rule of `src/lib/monetization/viewer_tier.ts`; a blur over real numbers is a paywall anyone
   reads with view-source).
2. A signed-in reader's request for a lockable UK page is rewritten by the middleware to an uncached mirror route under `/pro`
   that renders the same page with `unlocked` when `getSessionTier()` says pro, and the locked form otherwise. The mirror routes
   sit in the same layout groups as the public ones, so the chrome is identical.
3. Which levels lock is one pure function over a page's ordered levels, tested against the three UK page types as they render.

**Facts this phase stands on** (the map of 2026-10-05, from source and the 2026-10-05 renders):
- `src/components/spine/zones.tsx`: one `Zone` is one level; a chapter is the `chapter` prop on its first drawn zone; `Zone` drops
  empty children and has no lock prop.
- `/gb` (country-view.tsx UK branch `if (rich)` L1484; `zones` L1612-1696; rendered L1702-1708; the rail's section list
  L1498-1525): levels in order: take, changes (outside chapters); 01 setup, staff, running, peers; 02 state, money; 03 trades,
  people, cities, spend; 04 years; then the close "Where to next" (outside). Chapter tags sit only on each chapter's first zone,
  and the close carries none, so membership is carried forward and stops at the close. Locks: staff, running, peers, money,
  people, cities, spend: 7 of 11 chapter levels.
- `/cities/london` (city-view.tsx `cityZonesAll` L927-950, filtered L951): every zone carries `chapter`. London: 01 premises,
  gates, living, crew; 02 districts; 03 peers, hoods. Locks gates, living, crew, hoods: 4 of 7.
- `/gb/london/<trade>` (cell-view.tsx `cellZonesAll` L400-422, filtered L423): take, opening outside; 01 permits, (stock), split,
  (peers); 02 clears; 03 market, mix, apps, exit. Restaurants locks 4 of 7, barbershops 5 of 8.
- District hub and district pages: one level a chapter, so nothing locks; the how-to page has no chapters. Neither is wired.
- Gates that meet a lock: `harness-links` (LINK_FLOOR city 16, cell 8: locking "The mix" takes four sibling-trade links and drops
  each trade page from 9 to 5); `harness-laws` BLOCK FLOOR counts `[data-block]` (a locked section keeps it); `frost-reads` (no
  `backdrop-filter`, a kept card opaque); `subsection-icons` (every `Rail` has an icon); `copy-no-method-words` and the plain-copy
  rules; `v34-research-rules` rule 12 (`blur(6px)`).

---

## Step 14: which levels lock, as one pure function

**Files:** Create `src/lib/monetization/levels.ts`; Test `tests/monetization/levels.test.ts`.

- [ ] **Test first** (rule `paywall-levels`):

```ts
/**
 * WHICH LEVELS LOCK (milestone 2; his ruling 18: "each chapter's first level free, the rest Pro"; 27: UK pages only). Membership
 * of a chapter is carried forward from the zone that opens it and stops at a level marked outside every chapter.
 *
 * Run: npx tsx tests/monetization/levels.test.ts
 */
import { lockedLevelKeys, type LevelRef } from "../../src/lib/monetization/levels";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "paywall-levels";
const FILE = "src/lib/monetization/levels.ts";
const REMEDY = "lock every level after the first of its chapter; never a level outside the chapters";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };
const same = (a: Set<string>, b: string[]) => a.size === b.length && b.every((k) => a.has(k));

const gb: LevelRef[] = [
  { key: "take", outside: true }, { key: "changes", outside: true },
  { key: "setup", chapter: "01" }, { key: "staff" }, { key: "running" }, { key: "peers" },
  { key: "state", chapter: "02" }, { key: "money" },
  { key: "trades", chapter: "03" }, { key: "people" }, { key: "cities" }, { key: "spend" },
  { key: "years", chapter: "04" },
  { key: "close", outside: true },
];
check("/gb locks seven of eleven chapter levels", same(lockedLevelKeys(gb), ["staff", "running", "peers", "money", "people", "cities", "spend"]));

const london: LevelRef[] = [
  { key: "premises", chapter: "01" }, { key: "gates", chapter: "01" }, { key: "living", chapter: "01" }, { key: "crew", chapter: "01" },
  { key: "districts", chapter: "02" }, { key: "peers", chapter: "03" }, { key: "hoods", chapter: "03" },
];
check("/cities/london locks four of seven", same(lockedLevelKeys(london), ["gates", "living", "crew", "hoods"]));

const restaurants: LevelRef[] = [
  { key: "take", outside: true }, { key: "opening", outside: true },
  { key: "permits", chapter: "01" }, { key: "split", chapter: "01" }, { key: "clears", chapter: "02" },
  { key: "market", chapter: "03" }, { key: "mix", chapter: "03" }, { key: "apps", chapter: "03" }, { key: "exit", chapter: "03" },
];
check("a London trade page (restaurants) locks four of seven", same(lockedLevelKeys(restaurants), ["split", "mix", "apps", "exit"]));

check("a chapter of one level locks nothing (the district pages)", lockedLevelKeys([{ key: "rank", chapter: "01" }, { key: "character", chapter: "02" }]).size === 0);
check("levels before the first chapter stay free", lockedLevelKeys([{ key: "a" }, { key: "b" }, { key: "c", chapter: "01" }, { key: "d" }]).size === 1);
check("a page with no chapters locks nothing (the how-to page)", lockedLevelKeys([{ key: "a" }, { key: "b" }]).size === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/levels: all pass");
```

- [ ] **Build `src/lib/monetization/levels.ts`:**

```ts
/**
 * src/lib/monetization/levels.ts
 *
 * WHICH LEVELS LOCK (milestone 2; his interview of 2026-09-26: 18, half of every chapter, each chapter's first level free and
 * the rest Pro; 27, UK pages only, which the caller decides). A level is a zone (src/components/spine/zones.tsx). A view tags a
 * chapter on the zone that opens it; later zones of the chapter may carry the same tag (city, trade) or none (the country page),
 * so membership is carried forward, and a zone marked `outside` (the page's answer before chapter 01, its close after the last)
 * belongs to no chapter and never locks.
 */
export type LevelRef = { key: string; chapter?: string | null; outside?: boolean };

export function lockedLevelKeys(levels: readonly LevelRef[]): Set<string> {
  const locked = new Set<string>();
  let current: string | null = null;
  let seenInChapter = 0;
  for (const level of levels) {
    if (level.outside) { current = null; seenInChapter = 0; continue; }
    if (level.chapter && level.chapter !== current) { current = level.chapter; seenInChapter = 0; }
    if (!current) continue;
    seenInChapter++;
    if (seenInChapter > 1) locked.add(level.key);
  }
  return locked;
}
```

- [ ] **Run**, wire `paywall-levels`, counts, carriers. **Commit:** `14: which levels lock, one tested function (his ruling 18)`.

---

## Step 15: the locked section

**Why.** One component draws every locked section the same way: the section's own title and icon (its `Rail`), a stand-in drawing
of its kind blurred behind (never its figures), one line saying what it answers, one button to `/pricing`. It keeps the section's
id and `data-block` so the page's block count and anchors hold, and stamps `data-locked` and the class `pro-locked` for the
structured data's selector.

**Files:** Create `src/components/spine/LockedSection.tsx`; Modify `src/lib/spine/copy.ts` (a `locked` group); Modify
`src/components/spine/archetypes/stories.tsx` (one story per stand-in kind); Modify `scripts/verify_v34_research_rules.ts` rule 12
(point it at `LockedSection.tsx` once nothing mounts `BlurredOverlay`, in the same commit as any removal).

- [ ] **Copy:** `COPY.locked = { button: "Open with Pro", lines: { <section id>: "<one line, at most 12 words>" } }`. One line per
  section id that can lock (step 16 lists them from the three views' rail lists). Each line says what the section answers in the
  visitor's words ("What a first hire costs you, all in."), no figure, no method word, no semicolon, no em dash. The button's
  three words pass `v34-research-rules` (not "Unlock now", "Get access", "Upgrade now").
- [ ] **Build `src/components/spine/LockedSection.tsx`** (a server component):

```tsx
/**
 * THE LOCKED SECTION (milestone 2; his ruling 22: "title and icon, the drawing blurred behind, one line, one button; no pop-up").
 *
 * The drawing behind is a stand-in of the section's kind, never the section itself: the page is cached for every reader, so a
 * real figure here would be readable in the page source (src/lib/monetization/viewer_tier.ts, "no leaked values"). The section
 * keeps its id, so its anchor and its block hold (BLOCK FLOOR counts `[data-block]`), and stamps `data-locked` and the class the
 * locked-section structured data selects (`.pro-locked`). A kept card: the reader operates its button (MODEL 10.4).
 */
import { Box, Rail } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/spine/icons";
import { COPY } from "@/lib/spine/copy";

export type StandInKind = "bars" | "track" | "rows" | "grid" | "table";

function StandIn({ kind }: { kind: StandInKind }) {
  const fill = "var(--c-line-strong)";
  const shapes: Record<StandInKind, React.ReactNode> = {
    bars: [0, 1, 2, 3].map((i) => <rect key={i} x="0" y={i * 22} width={[220, 170, 120, 80][i]} height="12" rx="3" fill={fill} />),
    track: [<rect key="t" x="0" y="34" width="260" height="8" rx="4" fill={fill} />, <rect key="m" x="90" y="26" width="70" height="24" rx="4" fill={fill} />],
    rows: [0, 1, 2, 3].map((i) => <rect key={i} x="0" y={i * 22} width="260" height="10" rx="3" fill={fill} />),
    grid: Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i % 10) * 26} y={Math.floor(i / 10) * 22} width="18" height="14" rx="3" fill={fill} />),
    table: [0, 1, 2, 3, 4].map((i) => <rect key={i} x="0" y={i * 18} width={i === 0 ? 260 : 200} height="8" rx="2" fill={fill} />),
  };
  return (
    <svg viewBox="0 0 260 90" width="100%" height="90" aria-hidden="true" focusable="false" style={{ filter: "blur(6px)" }}>
      {shapes[kind]}
    </svg>
  );
}

export function LockedSection({ id, title, icon, kind }: { id: string; title: string; icon: AtlasIconId; kind: StandInKind }) {
  const line = (COPY.locked.lines as Record<string, string>)[id];
  return (
    <Box id={id} keep data-locked="1" className="pro-locked">
      <Rail icon={icon} kicker={title} />
      <div className="mt-3">
        <StandIn kind={kind} />
      </div>
      {line ? <p className="mt-3 text-[length:var(--t-body)] text-[var(--c-ink2)]">{line}</p> : null}
      <a href="/pricing" className="tap-y mt-4 inline-flex rounded-full bg-[var(--c-ink)] px-5 py-2 text-[length:var(--t-body)] font-semibold text-white">
        {COPY.locked.button}
      </a>
    </Box>
  );
}
```

  Before using this code, open `src/components/spine/kit.tsx` and the icon module: use the real import path of `AtlasIconId`, the
  real button class the site's pill doors use (copy the class from `close_rows.ts`'s door, or the `/compare` pill in
  `city-view.tsx`), and the type tokens the open sections use (`--t-body`, `--c-ink2`). Tokens only: `hardcoded-hex` and
  `spine-elevation` hold.
- [ ] **Stories:** one story per kind in `stories.tsx`, and the census row (`npx tsx scripts/harness/census.ts --write`).
- [ ] **Verify:** `tsc`, `subsection-icons`, `frost-reads`, `spine-elevation`, `no-em-dashes`, `copy-no-method-words`,
  `census-fresh`, `v34-research-rules`. **Commit:** `15: the locked section: its title and icon, a blurred stand-in, one line, one button`.

---

## Step 16: the three UK views draw their locks

**Why.** The function decides, the component draws; each view now hands its ordered levels to the function and draws a locked
section for each card of a locked level, only when the caller says the page is locked.

**Files:** Modify `src/components/spine/country/country-view.tsx`, `src/components/spine/city/city-view.tsx`,
`src/components/spine/cell/cell-view.tsx`; Modify `src/lib/spine/copy.ts` (`COPY.locked.lines`, every section id that can lock).

- [ ] **One prop per view:** each view body (`SpineCountryBody`, the city body, the cell body) takes `locked?: boolean` (default
  false). When false, nothing changes: the default harness renders and every existing gate read exactly what they read today.
- [ ] **Levels per view:** where the view builds its zones array, add to each zone the `ids` of the section cards it holds (the
  same ids its `Box`es carry and its rail list names) and `outside: true` on the zones before chapter 01 and on the close. Build
  the `LevelRef[]` from that array (`{ key, chapter, outside }`) and call `lockedLevelKeys` once.
- [ ] **Drawing:** when `locked` and a zone's key is in the set, its body becomes one `LockedSection` per id, in the same order,
  inside the same `Zone` (the split stays). Title: the rail list's label for that id. Icon: the icon that section's `Rail` uses
  (keep a small `id -> { icon, kind }` table beside the rail list; `kind` is the stand-in nearest its drawing: bars for RankedBars
  and PayBars, track for tracks and ranges, rows for FactRows and KvGrid, grid for unit grids, table for tables and spectra).
- [ ] **A test that the free half is untouched** (rule `paywall-free-half`, `tests/monetization/free_half.test.ts`): render each
  of the three bodies twice with `renderToStaticMarkup` (set `globalThis.React`, as `tests/seo/depth_notify.test.ts` does): with
  `locked` false the markup equals today's (compare against the body rendered from the pre-change module is impossible, so instead
  assert: no `data-locked` anywhere); with `locked` true, assert the locked ids are exactly the ones `lockedLevelKeys` names for that
  page, that every first level of a chapter has no `data-locked` element, and that no element inside a `[data-locked]` carries the
  class `fig`, `data-kind` or `data-src`. Use the harness fixtures the renderer uses (`scripts/harness/render_page.tsx` shows how
  it builds each surface's data); if building the data needs the database, read the pages from `scratchpad/harness/pages/` instead
  and move these assertions into step 20's gate.
- [ ] **Verify:** `tsc`, re-render the nine harness pages (`node scripts/verify_pages_fresh.mjs`), `harness-laws`,
  `harness-page-laws`, `harness-copy-plain`, `harness-links`, `census-fresh`, `provenance`: all as before (locked is false).
- [ ] **Commit:** `16: the three UK views draw their locks when told to; nothing changes until then`.

---

## Step 17: the routes hand the views their lock

**Why.** The decision "locked or not" belongs to the route: a UK page, the paywall on, and the reader not Pro. The public routes
can never know the reader (they are cached), so they pass `locked = isPaywallOn() && isUkPage(path)`. The mirror routes of step 18
pass the reader's own answer.

**Files:** Modify `src/app/[country]/page.tsx`, `src/app/[country]/[geo]/[industry]/page.tsx`, `src/app/(site)/cities/[slug]/page.tsx`.

- [ ] **Extract** each route's page body into an exported async function in the same file, `renderCountryRoute(params, { locked })`,
  `renderCellRoute(params, { locked })`, `renderCityRoute(params, { locked })`, returning exactly what the default export returned.
  The default export calls it with `locked: isPaywallOn() && isUkPage(<the path>)`. `generateMetadata`, `generateStaticParams`,
  `revalidate` and `dynamicParams` stay where they are.
- [ ] **Verify** `tsc`; re-render the nine pages and run `harness-laws`, `harness-links`, `doors`, `pages-fresh` (unchanged, the
  paywall is off in the harness). **Commit:** `17: the UK routes decide the lock (UK page, paywall on); the views draw it`.

---

## Step 18: a Pro reader's uncached page

**Why.** The only reader the cached page cannot serve is the one who paid. The middleware sends a signed-in reader of a lockable
UK page to an uncached mirror; the mirror asks Supabase and renders unlocked for Pro, locked for anyone else. A free reader who
is signed in sees the same locks as everyone; a crawler never has the cookie and never reaches the mirror.

**Files:**
- Create: `src/lib/monetization/pro_route.ts`; Test: `tests/monetization/pro_route.test.ts`
- Create: `src/app/pro/[country]/page.tsx`, `src/app/pro/[country]/[geo]/[industry]/page.tsx`,
  `src/app/(site)/pro/cities/[slug]/page.tsx` (each in the same layout group as the route it mirrors: `[country]` has no layout of
  its own, the city route sits under `(site)`)
- Modify: `src/middleware.ts`

- [ ] **Test first** (rule `pro-route`): `proRewrite("/gb", ["sb-abcd-auth-token"], true) === "/pro/gb"`;
  `proRewrite("/gb/london/restaurants", ["sb-abcd-auth-token.0"], true) === "/pro/gb/london/restaurants"`;
  `proRewrite("/cities/london", [...], true) === "/pro/cities/london"`; `proRewrite("/cities/paris", [...], true) === null` (not
  UK); `proRewrite("/cities/london/neighborhoods", [...], true) === null` (nothing locks there); `proRewrite("/gb", [], true) === null`
  (no session); `proRewrite("/gb", ["sb-abcd-auth-token"], false) === null` (paywall off); `proRewrite("/gb/how-to-open", [...], true) === null`.
- [ ] **Build `src/lib/monetization/pro_route.ts`** (edge-safe: no Supabase, no census JSON; the city test reads the slug table the
  middleware already imports):

```ts
/**
 * src/lib/monetization/pro_route.ts
 *
 * WHERE A SIGNED-IN READER OF A LOCKED UK PAGE GOES (milestone 2). The public UK pages are cached for everyone and locked; a
 * reader holding a session cookie is sent to the uncached mirror under /pro, which renders unlocked for Pro and locked for anyone
 * else. Only the page types that lock anything are sent: the country page, a UK city page, a London trade page (the district
 * pages lock nothing, each chapter being one level; the how-to page has no chapters). Edge-safe: this runs in the middleware.
 */
import { cityPathFor } from "@/lib/cities/city_path";

const AUTH_COOKIE = /^sb-[a-z0-9]+-auth-token(\.\d+)?$/;

export function lockablePath(path: string): boolean {
  if (path === "/gb") return true;
  if (/^\/gb\/london\/[a-z0-9-]+$/.test(path)) return true;
  const city = /^\/cities\/([a-z0-9-]+)$/.exec(path)?.[1];
  return !!city && cityPathFor("GB", city) !== null;
}

export function proRewrite(path: string, cookieNames: readonly string[], paywallOn: boolean): string | null {
  if (!paywallOn || !lockablePath(path)) return null;
  return cookieNames.some((n) => AUTH_COOKIE.test(n)) ? `/pro${path}` : null;
}
```

  `/gb/london/how-to-open` style static children: confirm with `COUNTRY_STATIC_CHILDREN` (`src/lib/routing/top_level_segments.ts`)
  that no static child of `/gb/london` matches the trade pattern; if one does, exclude it and add the case to the test.
- [ ] **The middleware:** after the redirects and the canonical rules (a request that redirects never reaches this) and before the
  block that sets `public, s-maxage` cache headers, call `proRewrite(pathname, request.cookies.getAll().map((c) => c.name), isPaywallOn())`;
  when it answers, return `NextResponse.rewrite(new URL(target, request.url))` with `Cache-Control: private, no-store`. Read the
  middleware whole first: the rewrite must not pass through the cache-header branch.
- [ ] **The mirror routes:** each `export const dynamic = "force-dynamic"`; `generateMetadata` returns robots `{ index: false,
  follow: false }` and `alternates.canonical` the public path; the default export calls the public route's `render*Route(params,
  { locked: (await getSessionTier()) !== "pro" })`. A path that is not lockable answers `notFound()`.
- [ ] **Build check (the repo once had a route-conflict outage):** with at least 3 GB free, run `npm run build > <file> 2>&1` and
  read it; record the reason in the ledger ("new route trees under /pro"). Under 3 GB, wait; after two hours of waiting, park "a
  build of the night branch" for the morning and continue (Vercel's chain and build run on his push anyway).
- [ ] **Commit:** `18: a Pro reader's uncached mirror of the locked UK pages; the middleware sends signed-in readers there`.

---

## Step 19: the locked parts say so to search engines

**Files:** Create `src/components/spine/ProLockedData.tsx`; Modify the three public UK routes (render it when locked); Test
`tests/monetization/locked_data.test.ts` (rule `locked-data`).

- [ ] **Test first:** `renderToStaticMarkup(<ProLockedData />)` holds one `application/ld+json` script whose JSON has
  `"isAccessibleForFree": false` and `hasPart` with `{ "@type": "WebPageElement", "isAccessibleForFree": false, "cssSelector": ".pro-locked" }`;
  with `locked` false the route renders none (check through the route's `render*Route` if it renders without the database, else in
  step 20's gate).
- [ ] **Build:**

```tsx
/** THE LOCKED PARTS, SAID TO SEARCH ENGINES (his interview of 2026-09-26, "contradictions reconciled": the closed half carries
 *  isAccessibleForFree false, so it is not read as cloaking). Rendered only on a locked UK page. */
export function ProLockedData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    isAccessibleForFree: false,
    hasPart: [{ "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".pro-locked" }],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

- [ ] **Commit:** `19: a locked UK page tells search engines which parts are Pro`.

---

## Step 20: the gate that holds the paywall to his ruling

**Why.** Every rule of this phase becomes a check that runs on every deploy (the repo's working method, rule 4).

**Files:** Modify `scripts/harness/render_page.tsx` (a `--locked` option: sets `NEXT_PUBLIC_PAYWALL=1` and
`NEXT_PUBLIC_AUTH_ENABLED=1` for that render and writes `<surface>-<slugs>-locked.html`); Create
`scripts/harness/check_paywall.mjs`; Modify `scripts/prebuild_all.ts` (gate `paywall-shape`, after `pages-fresh`).

- [ ] **The gate** renders three locked pages itself (country GB, city london, cell gb london restaurants; never through
  `pages.json`, whose gates would read a locked page's sections as faults) and checks with jsdom, printing reds through
  `scripts/lib/red.mjs` after calling `preflight({ name: "check_paywall" })`:
  1. the locked section ids are exactly `lockedLevelKeys` of the page's levels (read the zones in order: `[data-zone]`, the
     chapter heads `[data-chapter-head]`, and each zone's section ids);
  2. no first level of a chapter holds a `[data-locked]`;
  3. each `[data-locked]` has `data-block`, the class `pro-locked`, a `[data-rail]` with an icon, exactly one paragraph of at most
     12 words passing the plain-copy list, exactly one link and it goes to `/pricing`;
  4. inside any `[data-locked]`: no `.fig`, no `[data-kind]`, no `[data-src]`, no digit in text;
  5. no `role="dialog"`, `aria-modal` or fixed-position overlay anywhere;
  6. one JSON-LD script with `isAccessibleForFree: false` whose `cssSelector` matches at least one element;
  7. reported, not failed: distinct internal links locked against unlocked, per page (the question is parked: see below).
  Plant each of 1 to 6 once (edit a render by hand in a scratch copy), see it red, restore.
- [ ] **Park** in `PARKED.md`: "Locking takes the sibling-trade links of 'The mix' from free readers (London trade pages 9 to 5
  internal links, under the floor of 8). (a) Recommended: a free row of doors to other London trades, no figures, in the trade
  page's free half; (b) keep 'The mix' free; (c) accept fewer links." Build nothing for it: the paywall is off until he answers.
- [ ] **Counts, carriers. Commit:** `20: the paywall-shape gate holds every locked page to his ruling 22`.

---

## Step 21: milestone 2's checkpoint: the full chain and the photographs

- [ ] **The full chain** (protocol section 5); fix every red at its source; record the count in the ledger.
- [ ] **Photographs** at 1280 and 375: a locked `/gb` chapter 01 (its free first level and two locked sections), a locked London
  trade page's chapter 03, the pricing page, the welcome page (render it with a fixture session, or photograph the component),
  the account's plan line. One sheet: `E:/atlas/design/loop/build/photos/m2/MILESTONE-2-SHEET.jpeg`, captions in his register.
- [ ] **Ledger, STATE.md** (`step-in-flight`), **commit** both repos.
