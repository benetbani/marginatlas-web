# Homepage v2 (founder review) — Pass A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild the core of the homepage after the founder's 2026-06-11 review: remove the two catastrophic/dumb sections, fix the button color and the "software shop" copy, make the audience band horizontal with icons, and add the two strongest new data sections (rich clickable neighborhoods, and an honest like-for-like US-states comparison). Every number resolves live from real cells or self-omits; nothing is hardcoded or fabricated.

**Architecture:** New presentational + light-loader components in `src/components/home/` and `src/lib/home/`, wired into `src/app/page.tsx`. Live resolution + a trusted-local gate keep the data honest. Pass B (featured deep-dive, popular questions, richer free/paid) is a separate plan.

**Tech:** Next.js 15.5 server components, React 19.2, TS5, Tailwind (tokens only), `@phosphor-icons/react/dist/ssr`.

---

## Governing rules (from the founder, non-negotiable)
- **Common-sense check on every element.** No absolute rankings mixing business type and geography. No badmouthing industries. Consulting/PE are clients, never examples/subjects.
- **No fabrication.** A number is shown only if it resolves from a real, trusted-local cell; otherwise the tile/row self-omits. Neighborhood detail comes from the real flavor data; where absent, the card self-omits (we are NOT inventing).
- **Plain, human copy.** No jargon ("each cell" -> "each place"); no weird coinages ("software shop").
- **US industry-misroute caveat:** on the US path, only `restaurants`, `software-development`, `grocery-stores` resolve to the correct industry; every other fine-grained US slug silently misroutes (separate bug, fixed next). So any US example/comparison in this pass uses ONLY those three slugs. Non-US example cells are acceptable as single tiles only when trusted-local.

---

## Removals + quick fixes

### Task 1: Remove the break-in beat and the how-it-works section; unify button color
**Files:** Modify `src/app/page.tsx`, `src/components/newsletter/LeadMagnetForm.tsx`

- [ ] **Step 1:** In `src/app/page.tsx`, remove the `BreakInBeat` mount (the `<ToneBand tone="home-featured"><BreakInBeat breakIn={beats.breakIn} /></ToneBand>` block and its surrounding comment) and the `HowItWorks` mount (`<ToneBand tone="home-how-it-works"><HowItWorks /></ToneBand>`). Remove the now-unused imports `BreakInBeat`, `HowItWorks`, and `loadHomepageBeats`/`beats` if `beats` is no longer referenced (check: `beats.breakIn` was its only use; remove `const beats = await loadHomepageBeats();` and the import). Leave `loadExampleTiles`/`ExampleTiles` intact.
- [ ] **Step 2:** In `src/components/newsletter/LeadMagnetForm.tsx` line ~71, change the submit button `bg-atlas-500` to `bg-atlas-700 hover:bg-atlas-800` (standardize primary CTAs on atlas-700, matching the NavigatorForm "Show me the numbers" button). This is the top/bottom button-color mismatch the founder flagged.
- [ ] **Step 3:** Commit: `git commit -m "feat(home): remove break-in beat + how-it-works; unify primary CTA color (atlas-700)"`

### Task 2: Kill the "software shop" phrasing
**Files:** Modify `src/lib/extremes/leaderboards.ts`, `src/lib/editorial/blurbs.ts`

- [ ] **Step 1:** In `src/lib/extremes/leaderboards.ts` replace "software shop" with "software firm" (line ~234 title, ~236 body "development studio" is fine, leave it) and in `src/lib/editorial/blurbs.ts` line ~26 replace "Small software shops" with "Small software firms". Grep the repo for any other user-facing "software shop" in `.ts`/`.tsx` (NOT in `activity_character_generated.json` for this pass) and fix to "software firm"/"software studio".
- [ ] **Step 2:** Commit: `git commit -m "copy(home): replace 'software shop' with plain wording"`

### Task 3: Audience band -> horizontal four cards with icons
**Files:** Rewrite `src/components/home/AudienceBand.tsx`

- [ ] **Step 1:** Rewrite to a horizontal four-card row (responsive: 1 col mobile, 2 cols sm, 4 cols lg) with a phosphor icon atop each card. Keep the four categories (they are clients/audience, which is correct here). Use these icons from `@phosphor-icons/react/dist/ssr`: ChartLineUp (Private equity and investors), Megaphone (Marketing and growth agencies), Briefcase (Management consultants), Storefront (Founders and operators). Icon at `size={24}` in `text-atlas-700`, card `atlas-card px-5 py-6 text-center` (or left-aligned, match site idiom), heading `font-display text-base font-medium`, the one-line use under it `text-sm text-cocoa-700`. Keep the SectionEyebrow "Who it's for" + the H2. Full code:

```tsx
/**
 * AudienceBand -- "who it's for". Four audience CATEGORIES Atlas serves, framed
 * as who-it-is-for (not fabricated social proof: no logos, no quotes). Horizontal
 * four-card row with an icon per card. Server component, tokens only.
 */
import { ChartLineUp, Megaphone, Briefcase, Storefront } from "@phosphor-icons/react/dist/ssr";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const AUDIENCES: { who: string; use: string; Icon: typeof Briefcase }[] = [
  { who: "Private equity and investors", use: "Size a market and sanity-check a target before the first call.", Icon: ChartLineUp },
  { who: "Marketing and growth agencies", use: "Understand a client's real economics before pitching a budget.", Icon: Megaphone },
  { who: "Management consultants", use: "Benchmark an industry in minutes instead of a research week.", Icon: Briefcase },
  { who: "Founders and operators", use: "See what a business keeps before risking your own money.", Icon: Storefront },
];

export function AudienceBand() {
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Who it's for</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-8 md:mb-10">
        Built for the people who price a business for a living
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {AUDIENCES.map(({ who, use, Icon }) => (
          <div key={who} className="atlas-card px-5 py-6">
            <Icon size={24} weight="regular" className="text-atlas-700" aria-hidden />
            <h3 className="mt-3 font-display text-base font-medium tracking-tight text-ink-900">{who}</h3>
            <p className="mt-1.5 text-sm text-cocoa-700 leading-relaxed">{use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit: `git commit -m "feat(home): audience band as horizontal four cards with icons"`

---

## New data section: rich neighborhoods (the star)

### Task 4: Neighborhood loader + section (6 clickable cards, real flavor, image placeholders)
**Files:** Create `src/lib/home/neighborhood_cards.ts`, `src/components/home/NeighborhoodCards.tsx`; modify `src/app/page.tsx`

Data source: `getNeighborhoodFlavor(citySlug, neighborhoodSlug)` from `src/lib/cities/neighborhood_flavor.ts` (real fields: `signature_businesses[]`, `food_scene`, `demographic_skew`, `walkability`, `history_note`, `price_tier`, `dont_miss`, `character_paragraph`). Click target: `/cities/{citySlug}/neighborhoods` (the real hub page). Each card shows three REAL deeper notes + an image placeholder + a price-tier tag. Self-omits any candidate with no flavor data, and the section self-omits below 4 cards.

- [ ] **Step 1:** Create `src/lib/home/neighborhood_cards.ts`:

```ts
/**
 * neighborhood_cards.ts -- resolves the homepage neighborhood cards from the
 * real flavor data (src/lib/cities/neighborhood_flavor.ts). No invented detail:
 * a candidate with no flavor entry is dropped. Pure (reads a static JSON import).
 */
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";

export type NeighborhoodCard = {
  name: string;        // display name
  city: string;        // display city
  href: string;        // /cities/{citySlug}/neighborhoods
  knownFor: string;    // signature businesses, joined
  dontMiss: string;    // the one specific deeper detail
  priceTier: string;   // luxury | expensive | mid | affordable | budget
};

// Candidate (citySlug, neighborhoodSlug, display name, display city). The loader
// keeps the first up-to-6 that have real flavor data, across distinct cities for
// variety. All slugs must exist in data/cities/neighborhood_flavor_v1.json.
const CANDIDATES: { citySlug: string; hood: string; name: string; city: string }[] = [
  { citySlug: "new-york", hood: "queens",      name: "Queens",       city: "New York" },
  { citySlug: "paris",    hood: "marais",      name: "Le Marais",    city: "Paris" },
  { citySlug: "tokyo",    hood: "shitamachi",  name: "Shitamachi",   city: "Tokyo" },
  { citySlug: "london",   hood: "east-london", name: "East London",  city: "London" },
  { citySlug: "new-york", hood: "manhattan",   name: "Manhattan",    city: "New York" },
  { citySlug: "paris",    hood: "montmartre",  name: "Montmartre",   city: "Paris" },
  { citySlug: "london",   hood: "west-london", name: "West London",  city: "London" },
  { citySlug: "new-york", hood: "brooklyn",    name: "Brooklyn",     city: "New York" },
];

function titleCaseTier(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function loadNeighborhoodCards(): NeighborhoodCard[] {
  const out: NeighborhoodCard[] = [];
  for (const c of CANDIDATES) {
    if (out.length >= 6) break;
    const f = getNeighborhoodFlavor(c.citySlug, c.hood);
    if (!f) continue; // no real data -> drop, never invent
    const knownFor = (f.signature_businesses || []).slice(0, 3).join(", ");
    if (!knownFor || !f.dont_miss) continue;
    out.push({
      name: c.name,
      city: c.city,
      href: `/cities/${c.citySlug}/neighborhoods`,
      knownFor,
      dontMiss: f.dont_miss,
      priceTier: titleCaseTier(f.price_tier),
    });
  }
  return out;
}
```

- [ ] **Step 2:** Create `src/components/home/NeighborhoodCards.tsx`:

```tsx
/**
 * NeighborhoodCards -- the homepage "drilled to the neighborhood" proof, rebuilt
 * with REAL deep flavor data (six clickable cards, an image placeholder ready for
 * a real photo, a "known for" line, and one specific not-on-Google detail each).
 * Self-omits below four cards. Server component, tokens only.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { NeighborhoodCard } from "@/lib/home/neighborhood_cards";

export function NeighborhoodCards({ cards }: { cards: NeighborhoodCard[] }) {
  if (cards.length < 4) return null;
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Drilled to the neighborhood</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-3">
        The same benchmarks, block by block
      </h2>
      <p className="max-w-2xl text-base text-cocoa-700 leading-relaxed mb-8">
        A business two streets over can run on completely different economics. Here
        is the character behind a few of the places we cover.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((n) => (
          <a key={n.href + n.name} href={n.href} className="group atlas-card block overflow-hidden p-0">
            {/* Image placeholder, ready for a real photo later. */}
            <div
              aria-hidden
              className="h-32 w-full bg-gradient-to-br from-cocoa-700/15 to-atlas-700/15 flex items-center justify-center"
            >
              <span className="font-display text-sm text-cocoa-700/50">{n.city}</span>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
                  {n.name}
                </h3>
                <span className="text-[11px] uppercase tracking-wide text-cocoa-700/70">{n.priceTier}</span>
              </div>
              <p className="mt-1 text-xs text-cocoa-700/80">{n.city}</p>
              <p className="mt-2.5 text-sm text-ink-700"><span className="text-cocoa-700/70">Known for:</span> {n.knownFor}</p>
              <p className="mt-1.5 text-sm text-cocoa-700 leading-relaxed">{n.dontMiss}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** In `src/app/page.tsx`, replace the existing `loadNeighborhoodProof` block + its `{neighborhoodProof && (...)}` render with the new loader + component. Add imports `loadNeighborhoodCards` + `NeighborhoodCards`; add `const neighborhoodCards = loadNeighborhoodCards();`; mount `<ToneBand tone="home-cities-placeholder"><NeighborhoodCards cards={neighborhoodCards} /></ToneBand>` where the old neighborhood proof was. Remove the now-dead `loadNeighborhoodProof`, `NEIGHBORHOOD_ANCHORS`, `CHARACTER_LABELS`, `NeighborhoodProof` type, and the `getNeighborhoodsForCity`/`Neighborhood`/`NeighborhoodCharacter` imports if unused.
- [ ] **Step 4:** Commit: `git commit -m "feat(home): rich clickable neighborhood cards from real flavor data + image placeholders"`

---

## New data section: honest like-for-like US-states comparison

### Task 5: US-states comparison (same trade across CA/NY/TX/FL, live revenue, trusted only)
**Files:** Create `src/lib/home/state_comparison.ts`, `src/components/home/StateComparison.tsx`; modify `src/app/page.tsx`

Honest, like-for-like: ONE trade compared across four comparable large US states, real revenue resolved live, trusted-local only. Uses only clean-resolving US slugs (restaurants / software-development / grocery-stores). Each value links to its real cell.

- [ ] **Step 1:** Create `src/lib/home/state_comparison.ts`. It resolves, for a given clean US industry slug, the trusted-local revenue for CA/NY/TX/FL via the existing cell accessor. Reuse the same accessor `loadExampleTiles` uses (`getCellBySlug` + `withBudget` + `isTrustedLocalCell` from `@/lib/cells/trust`, `fmtMoney` from `@/lib/format/money`). Pattern (mirror `src/lib/home/example_tiles.ts`):

```ts
import { getCellBySlug, withBudget } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { fmtMoney } from "@/lib/format/money";

export type StateRevenue = { state: string; href: string; revenue: string };
export type TradeComparison = { trade: string; rows: StateRevenue[] };

// Clean-resolving US industry slugs ONLY (the US misroute does not touch these).
const TRADES: { slug: string; label: string }[] = [
  { slug: "restaurants", label: "Restaurants" },
  { slug: "software-development", label: "Software firms" },
  { slug: "grocery-stores", label: "Grocery stores" },
];
const STATES: { slug: string; label: string }[] = [
  { slug: "california", label: "California" },
  { slug: "new-york", label: "New York" },
  { slug: "texas", label: "Texas" },
  { slug: "florida", label: "Florida" },
];

async function revenueFor(stateSlug: string, industrySlug: string): Promise<number | null> {
  const cell = await withBudget(
    getCellBySlug("us", stateSlug, industrySlug, { sizeBand: null, year: null }),
    null,
    4_000,
    `state-comp:${stateSlug}/${industrySlug}`,
  );
  if (!cell || !isTrustedLocalCell(cell)) return null;
  const rev = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  return typeof rev === "number" && rev > 0 ? rev : null;
}

export async function loadStateComparisons(): Promise<TradeComparison[]> {
  const out: TradeComparison[] = [];
  for (const t of TRADES) {
    const rows: StateRevenue[] = [];
    for (const s of STATES) {
      const rev = await revenueFor(s.slug, t.slug);
      if (rev == null) continue;
      rows.push({ state: s.label, href: `/us/${s.slug}/${t.slug}`, revenue: fmtMoney(rev) });
    }
    if (rows.length >= 3) out.push({ trade: t.label, rows });
  }
  return out;
}
```

(Verify the real field names against `src/lib/home/example_tiles.ts` / the `Cell` type: use whatever that file uses for revenue, `revenue_per_firm ?? rev_p50`, and the same `getCellBySlug`/`withBudget`/`isTrustedLocalCell`/`fmtMoney` import paths. Adjust if the signatures differ.)

- [ ] **Step 2:** Create `src/components/home/StateComparison.tsx` -- a clean comparison block: for each trade, a labeled row of the four states with their revenue, each linking to the cell. Self-omits below one trade.

```tsx
/**
 * StateComparison -- an honest like-for-like data story: the SAME trade compared
 * across four comparable large US states, with real revenue resolved live (a
 * trusted-local measurement, never a synthesized or cross-geography figure).
 * Self-omits when nothing resolves. Server component, tokens only.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { TradeComparison } from "@/lib/home/state_comparison";

export function StateComparison({ comparisons }: { comparisons: TradeComparison[] }) {
  if (comparisons.length < 1) return null;
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Same business, different place</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-3">
        What a typical business brings in, state by state
      </h2>
      <p className="max-w-2xl text-base text-cocoa-700 leading-relaxed mb-8">
        The same trade earns very differently depending on where it sits. Typical
        annual revenue for a single business, across four large US states.
      </p>
      <div className="space-y-5">
        {comparisons.map((c) => (
          <div key={c.trade} className="atlas-card px-5 py-4">
            <div className="font-display text-base font-medium text-ink-900 mb-3">{c.trade}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {c.rows.map((r) => (
                <a key={r.href} href={r.href} className="group block">
                  <div className="text-xs text-cocoa-700/80">{r.state}</div>
                  <div className="font-display text-lg tabular-nums text-ink-900 group-hover:text-atlas-700 transition-colors">{r.revenue}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** In `src/app/page.tsx`, add imports + `const stateComparisons = await loadStateComparisons();` and mount `<ToneBand tone="home-featured"><StateComparison comparisons={stateComparisons} /></ToneBand>` after the world map, before the neighborhood cards.
- [ ] **Step 4:** Commit: `git commit -m "feat(home): honest like-for-like US-states revenue comparison (live, trusted-only)"`

---

## Final order after Pass A (page.tsx)
hero+search -> example tiles -> world map -> state comparison -> neighborhood cards -> audience (horizontal) -> upgrade -> blog -> newsletter. (Break-in + how-it-works gone.)

### Task 6: Verify on preview + show founder (do NOT auto-ship)
- [ ] Deploy `vercel deploy --yes --cwd "E:/atlas/website"`. Confirm build clean (29 gates + tsc).
- [ ] Verify: state comparison renders real distinct numbers (CA/NY/TX/FL restaurants); neighborhood cards show 6 with real "known for" + don't-miss + clickable to /cities/.../neighborhoods; audience is a 4-card horizontal row with icons; both primary buttons are atlas-700; break-in + how-it-works gone; no "software shop". Screenshot desktop + mobile.
- [ ] Present the preview + screenshots to the founder. Do NOT push to main. Pass B (featured deep-dive, popular questions, richer free/paid) follows.

---

## Self-review
Spec coverage: removals (T1), button (T1), copy (T2), audience horizontal+icons (T3), rich clickable neighborhoods + placeholders (T4), honest like-for-like comparison (T5). Pass B carries the remaining editorial. Every number is resolved live + trusted-gated or self-omits; neighborhood detail is real flavor data or the card drops. No US misrouted slugs used. Plain copy. Tokens only.
