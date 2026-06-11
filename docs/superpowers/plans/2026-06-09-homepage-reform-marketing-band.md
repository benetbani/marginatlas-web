# Homepage Reform SP2: Marketing Band Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the homepage's marketing band below the data hooks: a 3-step how-it-works, a who-it-is-for audience band, a free-vs-premium upgrade teaser with a CTA to /pricing, and a prominent free-report newsletter to close.

**Architecture:** Four pure-presentational server components in `src/components/home/`, each one focused file, mounted into `src/app/page.tsx` between the neighborhood depth-proof and the blog rail (the newsletter sits after the blog rail). Graphics are reused as-is (tokens, `SectionEyebrow`, `atlas-card`, the existing `LeadMagnetForm` island). Tier names and prices are read from the shared `TIERS` constant so the homepage upgrade teaser cannot drift from /pricing.

**Tech Stack:** Next.js 15.5 App Router (server components), React 19.2, TypeScript 5, Tailwind 3.4 (tokens only), `@phosphor-icons/react/dist/ssr`.

---

## Context the executor needs

This is **sub-project 2 of 3** of the homepage reform. SP1 (cuts + reorder + example tiles) already shipped to main. The design spec is `docs/superpowers/specs/2026-06-09-homepage-reform-design.md`; this plan implements its sections 9 (how-it-works), 10 (who-it-is-for), 11 (upgrade), and 12 (newsletter), in the spec's section-2 order.

**Current homepage order after SP1** (`src/app/page.tsx`): hero+search -> example tiles -> world map -> BreakInBeat (easiest break-in) -> neighborhood proof -> blog rail. The global `FooterNewsletterBar` (parchment strip, `id="newsletter"`) renders from the layout below everything.

**Target order after SP2:** hero+search -> example tiles -> world map -> break-in -> neighborhood proof -> **how-it-works -> who-it-is-for -> upgrade** -> blog rail -> **newsletter** -> (global footer bar).

### Constraints (enforced by gates or the founder)
- **No em-dashes** in user-visible source (the `--` in a doc-comment is fine; the gate flags the em-dash CHARACTER). Use period/comma/colon.
- **No source-agency names** in copy (no Eurostat/BLS/etc.).
- **No fabricated social proof:** the audience band names CATEGORIES only. No invented company logos, no testimonial quotes.
- **No raw hex / px / ms** in components: use Tailwind token classes (e.g. `h-2 w-2`, not `style={{width:8}}`), and the `atlas-700` / `cocoa-700` / `ink-900` / `parchment` / `atlas-500` color tokens already used across `src/components/home/`.
- **No checkout from the homepage:** the upgrade CTA links to `/pricing`.
- **The upgrade teaser must match the real tiers:** its rows are a faithful subset of the v34 matrix in `src/app/pricing/page.tsx`; tier names + prices come from `TIERS` (`@/components/monetization`).

### Testing approach (read before Task 1)
These four components are **pure presentational JSX** with no computation and no I/O. The repo's convention is: pure builders are unit-tested with `npx tsx`, I/O loaders are verified on a Vercel preview. Static presentational components are neither, so there is **nothing to assert in a unit test** (a "renders 3 steps" test would only re-state the static array). Do **not** write throwaway tests. Verification for all four is the single Vercel preview build + screenshot in Task 5, exactly as SP1's component half was verified. Type-correctness is caught by the preview's `tsc` gate.

---

## File structure

- **Create** `src/components/home/HowItWorks.tsx` — the 3-step explainer (search, see the numbers, decide). One responsibility: render three static steps.
- **Create** `src/components/home/AudienceBand.tsx` — the who-it-is-for band naming four audience categories.
- **Create** `src/components/home/UpgradeTeaser.tsx` — the free-vs-premium mini table (6-row subset of the real matrix) + CTA to /pricing.
- **Create** `src/components/home/HomeNewsletter.tsx` — the prominent free-report band, a shell around the existing `LeadMagnetForm` client island.
- **Modify** `src/app/page.tsx` — import + mount the four components in the target order (Task 5).
- **Modify** `src/lib/page-layout/section-order.ts` — register `home-how-it-works`, `home-audience`, `home-upgrade` in `SECTION_TONES` as `"white"` (the convention for every `home-*` id; `home-newsletter` is already registered). Task 5.

The homepage is not bound by the `verify_section_order` gate (no `"home"` key in `PAGE_SECTION_ORDER`), so no canonical-order list needs editing; the tone entries are convention, and `getToneClass` already falls back to white for any unregistered id.

---

### Task 1: HowItWorks component

**Files:**
- Create: `src/components/home/HowItWorks.tsx`

- [ ] **Step 1: Write the component**

```tsx
/**
 * HowItWorks -- the homepage's 3-step explainer: search, see the numbers,
 * decide. Pure presentational server component, tokens only, no data. Shows the
 * flow from a query to a decision so a first-time visitor understands the tool
 * before scrolling into the rest of the marketing band.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Search a business and a place",
    body: "Pick a trade and a city. A bakery in Lyon, a law firm in Texas, a hotel in Bali.",
  },
  {
    n: "2",
    title: "See the real numbers",
    body: "Revenue, costs, wages, and what the owner actually keeps, drawn from the data we hold for that cell.",
  },
  {
    n: "3",
    title: "Decide before you risk money",
    body: "Know whether the business works, and how hard it is to break in, before you commit a cent.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">How it works</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-8 md:mb-10">
        From a question to a decision, in three steps
      </h2>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {STEPS.map((s) => (
          <li key={s.n} className="atlas-card px-6 py-7">
            <div className="font-display text-3xl font-semibold tabular-nums text-atlas-700">
              {s.n}
            </div>
            <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-ink-900">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/HowItWorks.tsx
git commit -m "feat(home): how-it-works 3-step explainer component"
```

---

### Task 2: AudienceBand component

**Files:**
- Create: `src/components/home/AudienceBand.tsx`

- [ ] **Step 1: Write the component**

Honesty note: this names audience CATEGORIES, not companies. No logos, no quotes. The heading frames it as "who it is for", never "trusted by" or "used by [name]".

```tsx
/**
 * AudienceBand -- "who it's for". Names the four audience categories Atlas
 * serves, framed as who-it-is-for, NOT as fabricated social proof: no invented
 * logos, no testimonial quotes. Pure presentational server component, tokens
 * only. If real named references land later they replace this honest read.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const AUDIENCES: { who: string; use: string }[] = [
  {
    who: "Private equity and investors",
    use: "Size a market and sanity-check a target before the first call.",
  },
  {
    who: "Marketing and growth agencies",
    use: "Understand a client's real economics before pitching the budget.",
  },
  {
    who: "Management consultants",
    use: "Benchmark an industry in minutes instead of a research week.",
  },
  {
    who: "Founders and operators",
    use: "See what a business keeps before risking your own money.",
  },
];

export function AudienceBand() {
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Who it's for</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-8 md:mb-10">
        Built for the people who price a business for a living
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {AUDIENCES.map((a) => (
          <div key={a.who} className="atlas-card px-6 py-6">
            <h3 className="font-display text-lg font-medium tracking-tight text-ink-900">
              {a.who}
            </h3>
            <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">{a.use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/AudienceBand.tsx
git commit -m "feat(home): who-it-is-for audience band component"
```

---

### Task 3: UpgradeTeaser component

**Files:**
- Create: `src/components/home/UpgradeTeaser.tsx`

- [ ] **Step 1: Write the component**

The six rows are a faithful subset of the v34 feature matrix in `src/app/pricing/page.tsx` (the authoritative full table). Tier names + monthly prices are read from `TIERS` so the homepage and /pricing cannot drift. Uses the same `Check` / `Minus` phosphor SSR icons the pricing matrix uses (so there is no literal dash character to trip the em-dash gate).

```tsx
/**
 * UpgradeTeaser -- the homepage's free-vs-premium mini comparison. A faithful
 * SUBSET of the v34 tier matrix (the authoritative full table lives on
 * /pricing, src/app/pricing/page.tsx); tier names and prices come from the
 * shared TIERS constant so the two surfaces cannot drift. Pure presentational
 * server component, tokens only. The CTA points to /pricing; no checkout from
 * the homepage.
 */
import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { TIERS, PRICING_HREF } from "@/components/monetization";

// A 6-row subset of the v34 feature matrix. Each tuple is
// [feature, free, basic, premium]; a string renders as-is, a boolean renders a
// check / dash. Kept short on purpose: /pricing carries the full table.
const ROWS: [string, boolean | string, boolean | string, boolean | string][] = [
  ["Median, top and bottom decile", true, true, true],
  ["Lower and upper quartile (p25, p75)", false, true, true],
  ["Year-over-year change", false, true, true],
  ["Saved cells", false, "25", "Unlimited"],
  ["Side-by-side comparison", false, false, true],
  ["CSV export", false, false, true],
];

function MiniCell({ v }: { v: boolean | string }) {
  if (v === true)
    return <Check size={15} weight="regular" aria-label="included" className="inline-block text-atlas-700" />;
  if (v === false)
    return <Minus size={11} weight="regular" aria-label="not included" className="inline-block text-cocoa-700/30" />;
  return <span className="text-sm font-semibold text-ink-900 tabular-nums">{v}</span>;
}

export function UpgradeTeaser() {
  const cols = [
    "Free",
    `${TIERS.basic.name} $${TIERS.basic.priceMonthly}`,
    `${TIERS.premium.name} $${TIERS.premium.priceMonthly}`,
  ];
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Free and paid</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-3">
        Every benchmark is free to read
      </h2>
      <p className="max-w-2xl text-base text-cocoa-700 leading-relaxed mb-8">
        Paid tiers add deeper quartiles, saved cells, comparison, and the data
        out of the page. Here is the short version.
      </p>
      <div className="overflow-x-auto rounded-lg border border-parchment bg-white max-w-3xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/85">
                Feature
              </th>
              {cols.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="text-center px-4 py-3 text-[11px] tracking-[0.12em] uppercase font-semibold text-cocoa-700/85"
                  style={{ width: "20%" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, f, b, p]) => (
              <tr key={label} className="border-t border-parchment">
                <td className="px-4 py-3 text-ink-900">{label}</td>
                <td className="text-center px-4 py-3"><MiniCell v={f} /></td>
                <td className="text-center px-4 py-3"><MiniCell v={b} /></td>
                <td className="text-center px-4 py-3"><MiniCell v={p} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a
        href={PRICING_HREF}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-atlas-700 hover:text-atlas-500 transition-colors"
      >
        See everything in each tier <span aria-hidden>&rarr;</span>
      </a>
    </section>
  );
}
```

Note: the `style={{ width: "20%" }}` on the column headers is a percentage layout hint copied verbatim from the pricing matrix (`src/app/pricing/page.tsx` uses the identical `style={{ width: "16%" }}`); it is not a raw pixel value, so it does not trip the no-raw-px rule. Everything else is token classes.

- [ ] **Step 2: Commit**

```bash
git add src/components/home/UpgradeTeaser.tsx
git commit -m "feat(home): free-vs-premium upgrade teaser component"
```

---

### Task 4: HomeNewsletter component

**Files:**
- Create: `src/components/home/HomeNewsletter.tsx`

- [ ] **Step 1: Write the component**

Reuses the existing `LeadMagnetForm` client island (`src/components/newsletter/LeadMagnetForm.tsx`), which POSTs to `/api/lead-magnet/2026-benchmarks` and renders its own success state. **Do NOT add `id="newsletter"`** to this band: the global `FooterNewsletterBar` already owns that anchor id, and a second one on the homepage would be a duplicate id. This band is the richer, more prominent offer that sits above the footer bar.

```tsx
/**
 * HomeNewsletter -- the prominent free-report lead magnet that closes the
 * homepage above the global footer bar. Offers the 2026 benchmarks PDF in
 * exchange for an email, reusing the existing LeadMagnetForm client island.
 * Server component shell, tokens only. NO id="newsletter": the global
 * FooterNewsletterBar keeps that anchor; this is a separate, richer offer.
 */
import { Suspense } from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import LeadMagnetForm from "@/components/newsletter/LeadMagnetForm";

const BULLETS = [
  "Median revenue, margin, and wages for 24 industries across 12 economies.",
  "Cost structure for the typical operator in each cell.",
  "Methodology and sourcing trail, so the numbers hold up.",
];

export function HomeNewsletter() {
  return (
    <section className="py-12 md:py-16">
      <div className="rounded-2xl bg-white border border-parchment px-6 py-10 md:px-10 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <SectionEyebrow size="md" className="mb-2">Free report</SectionEyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
              Get the 2026 small business benchmarks
            </h2>
            <p className="mt-3 text-base text-cocoa-700 leading-relaxed">
              A 38-page PDF of the numbers behind Atlas. Free, in exchange for an
              email.
            </p>
            <Suspense>
              <LeadMagnetForm />
            </Suspense>
          </div>
          <ul className="space-y-3">
            {BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-sm md:text-base text-ink-900"
              >
                <span
                  aria-hidden
                  className="inline-block rounded-sm shrink-0 bg-atlas-500 mt-1.5 h-2 w-2"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/HomeNewsletter.tsx
git commit -m "feat(home): prominent free-report newsletter band component"
```

---

### Task 5: Wire the band into the homepage, register tones, verify, ship

**Files:**
- Modify: `src/app/page.tsx` (imports near the top; mounts in the body)
- Modify: `src/lib/page-layout/section-order.ts` (three tone entries)

- [ ] **Step 1: Add the four imports to `src/app/page.tsx`**

After the existing `import { loadExampleTiles } from "@/lib/home/example_tiles";` line, add:

```tsx
import { HowItWorks } from "@/components/home/HowItWorks";
import { AudienceBand } from "@/components/home/AudienceBand";
import { UpgradeTeaser } from "@/components/home/UpgradeTeaser";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
```

- [ ] **Step 2: Mount how-it-works + audience + upgrade between the neighborhood proof and the blog rail**

The neighborhood-proof block ends with:

```tsx
      </ToneBand>
      )}
```

immediately before the large `{/* ... DidYouKnow ... */}` comment block. Insert the three new bands right after that `)}` and before that comment block:

```tsx
      )}

      {/* Marketing band (homepage reform SP2): how-it-works, who-it-is-for, and
          the free-vs-premium upgrade teaser. Pure presentational, tokens only;
          the upgrade CTA points to /pricing (no checkout from the homepage). */}
      <ToneBand tone="home-how-it-works">
        <HowItWorks />
      </ToneBand>

      <ToneBand tone="home-audience">
        <AudienceBand />
      </ToneBand>

      <ToneBand tone="home-upgrade">
        <UpgradeTeaser />
      </ToneBand>
```

- [ ] **Step 3: Mount the newsletter after the blog rail**

The blog-rail `ToneBand` closes with `</ToneBand>` immediately before the final `{/* Plan v32 Sprint B -- homepage NewsletterSignup card removed. ... */}` comment. Insert the newsletter band right after the blog rail's closing `</ToneBand>` and before that final comment:

```tsx
      </ToneBand>

      {/* Prominent free-report lead magnet (homepage reform SP2), above the
          global FooterNewsletterBar. No id="newsletter" here: the footer bar
          owns that anchor. */}
      <ToneBand tone="home-newsletter">
        <HomeNewsletter />
      </ToneBand>
```

- [ ] **Step 4: Register the three new tone ids in `src/lib/page-layout/section-order.ts`**

In `SECTION_TONES`, in the Homepage block (the entries from `"home-hero"` to `"home-blog-rail"`), add three white entries. `home-newsletter` is already present in the legacy block, so do not duplicate it. Replace:

```ts
  "home-featured": "white",
  "home-blog-rail": "white",
```

with:

```ts
  "home-featured": "white",
  "home-how-it-works": "white",
  "home-audience": "white",
  "home-upgrade": "white",
  "home-blog-rail": "white",
```

- [ ] **Step 5: Commit the wiring**

```bash
git add src/app/page.tsx src/lib/page-layout/section-order.ts
git commit -m "feat(home): mount marketing band (how-it-works, audience, upgrade, newsletter), register tones"
```

- [ ] **Step 6: Deploy a Vercel preview (remote build, no local build)**

From `E:/atlas/website`:

```bash
vercel deploy --yes --cwd "E:/atlas/website"
```

Expected: exit 0, runs all prebuild gates + tsc + the page set, prints a `Preview: https://marginatlas-web-...vercel.app` URL. If a gate fails (em-dash, layering, hardcoded-hex), read the error, fix the named file, recommit, redeploy.

- [ ] **Step 7: Verify the preview with curl (string presence) + a screenshot (layout + counts)**

Curl the preview root with the bypass header and a browser UA, and confirm the new copy is present:

```bash
curl -s -H "x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o" -H "user-agent: Mozilla/5.0" "<PREVIEW_URL>/" -o "E:/atlas/website/screens/home-sp2.html"
```

Then check (in the saved HTML): `How it works`, `From a question to a decision`, `Who it's for`, `Built for the people who price a business`, `Every benchmark is free to read`, `Basic $37`, `Premium $77`, `See everything in each tier`, `Get the 2026 small business benchmarks`. Confirm the audience band names categories only (no company names). Because Next embeds the RSC flight tree alongside the visible DOM, counts double in curl output: verify the **single** `id="newsletter"` (the footer bar) and the overall layout/order visually in the screenshot, not by grep count.

Screenshot via PowerShell (Git Bash mangles the leading-slash route arg):

```powershell
Set-Location "E:\atlas\website"; $env:BYPASS="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; node scripts/shot_preview.mjs <PREVIEW_URL> "/"
```

Expected: `screens/home.png` shows, top to bottom: hero+search, example tiles, world map, break-in beat, neighborhood proof, **how-it-works (3 numbered cards), who-it-is-for (4 audience cards), upgrade table (Free/Basic $37/Premium $77 with checks), blog rail, free-report newsletter band**, then the global footer bar. Confirm no em-dash characters render in the new copy and the upgrade table values match the tiers (p25/p75 = Basic+, comparison + CSV = Premium only).

- [ ] **Step 8: Ship to main (fast-forward, auto-triggers the production build)**

Only after the preview build is clean and the screenshot confirms the order:

```bash
git push origin reform-v2/palette-brick:main
```

Expected: `... -> main`. Production rebuilds the verified code. Then send the founder the screenshot.

---

## Follow-on plans (not this plan)

- **SP3, the search cascade** (`docs/superpowers/plans/2026-06-09-homepage-reform-search-cascade.md`, to be written): rework `NavigatorForm` into country -> city -> business with a rotating pre-fill and forgiving partial input, landing on the cell. The interactive piece; its own plan because it is the only client-state change in the homepage reform.

---

## Self-review

**Spec coverage:** spec section 9 (how-it-works) -> Task 1; section 10 (who-it-is-for) -> Task 2; section 11 (upgrade table + CTA to /pricing) -> Task 3; section 12 (prominent free-report newsletter) -> Task 4; section 2 order (the band sits below the depth proof, newsletter closes) -> Task 5 mount positions. Covered.

**Placeholder scan:** every component task carries complete code; no TBD/TODO; the mount edits quote the exact anchor lines to insert around. Clean.

**Type consistency:** `HowItWorks`, `AudienceBand`, `UpgradeTeaser`, `HomeNewsletter` are the exact named exports imported in Task 5. `TIERS.basic.name` / `.priceMonthly` and `PRICING_HREF` match the `@/components/monetization` exports (`TierSpec` has `name` + `priceMonthly`; `PRICING_HREF` is exported). `LeadMagnetForm` is a default export, imported as default. `SectionEyebrow` takes `size` + `className` (matches existing usage). Consistent.

**Honesty + constraints:** audience band is categories only (no logos/quotes); upgrade rows are a faithful matrix subset with names/prices from the shared constant (no drift, no invented numbers); newsletter reuses the real lead-magnet endpoint; no `id="newsletter"` duplicate; tokens only; no em-dash characters in copy. Holds.
