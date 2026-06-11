# Homepage Reform SP3: Search Cascade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the homepage search (`NavigatorForm`) into a three-field guided cascade, country then city then business, pre-filled with a rotating real example, landing the visitor straight on the business-in-place cell.

**Architecture:** One small pure data helper (`src/lib/home/search_cascade.ts`) supplies the country to city list (from the generated city-alias tables the navigator already uses) and the curated rotating pre-fill set. `NavigatorForm` is reworked in place (it is mounted only on the homepage) from six fields in a two-column Where/What layout to three fields: Country, City, Business. The submit mechanic is unchanged, per the founder's standing in-code directive: it still `router.push`es to `/{country}/{geo}/{industry}` with the native `action="/api/go"` fallback for no-JS.

**Tech Stack:** Next.js 15.5 App Router, React 19.2 (client component), TypeScript 5, Tailwind 3.4 (tokens only). Pure helper unit-tested with `npx tsx`; the component verified on a Vercel preview.

---

## Context the executor needs

This is **sub-project 3 of 3** of the homepage reform, and the only interactive piece. SP1 (cuts + tiles) and SP2 (marketing band) already shipped. Design spec: `docs/superpowers/specs/2026-06-09-homepage-reform-design.md` (sections 4 and 5). The founder picked the "three-field cascade" approach explicitly.

### Resolution facts (verified by investigation, do not re-derive)
- **The cell route never 404s from the data layer.** `getCellBySlug` (`src/lib/cells.ts`) synthesizes a plausible cell on any miss. So the bar is NOT "avoid 404s" but "land on a *trusted-local* cell (not synthetic, `coverage_tier !== "X"`, `geo_level !== "country"`), per `src/lib/cells/trust.ts`. The curated examples below are chosen to clear that bar.
- **Country to city** is driven by `CITIES_BY_STATE` in `src/lib/cities/city_aliases_generated.ts` (shape: `CITIES_BY_STATE[ISO2_UPPER][regionSlug] = citySlug[]`). Unioning a country's region arrays gives its flat city list. **Each city slug is itself a URL-resolving geo** (US curated city slugs like `los-angeles` resolve to their county; non-US like `barcelona` resolve via the friendly-overlay map). Labels come from `CITY_FRIENDLY_DISPLAY_LABEL[ISO2_UPPER][citySlug]`. The curated set has 102 cities across 53 countries with **zero gaps** (every slug has a resolving geo and a label). Do NOT use `data/cities/city_list_v1.json` as the city source: it has no geo or region, so most of its cities would route to synthesized tier-X cells.
- **`/api/go` (the no-JS fallback) accepts a city without a region** (`src/app/api/go/route.ts`): it prefers `subdivision`, then `region`, then redirects to `/{country}`. So a hidden `subdivision=<citySlug>` resolves directly; when no city is picked, a hidden `region=<curated default>` keeps the native submit landing on a cell.
- **`ComboField`** (`src/components/ComboField.tsx`) is fully controlled: its display derives from the `value` prop, and it already matches typed input against label + examples + keywords (so "barber" finds "Barbershops") and auto-commits the top match on Enter or blur. The rotating pre-fill works by setting `value` after mount; no ComboField change is needed.
- **`getDefaultRegionForCountry(iso2)`** (`src/lib/regions/default_region_by_country.ts`) returns the curated default region slug (US california, GB gb, FR fr10, ES es300, DE de30, JP japan, ...) or `undefined`.
- **Industry ids** (carry the id, emit `industryToSlug(id)` at submit): `restaurants`, `legal_services`, `software_development` (all `smb_core`, default-visible). `industryToSlug` produces the hyphen slug.
- **`NavigatorForm` is mounted only on the homepage** (`src/app/page.tsx:262`); other repo hits are doc-comments. In-place rework is homepage-scoped.

### Honest deviation from the spec (intentional)
The spec line "picking a city narrows the businesses" is NOT implemented: activities are not city-specific in the data, so faking a per-city narrowing would be arbitrary. The business field stays the full forgiving activity list. Country to city narrowing IS real. This keeps the no-fabrication bar.

### Constraints
- **Do not change the submit mechanic** (founder, in-code): keep `router.push('/'+cc+'/'+geo+'/'+industryToSlug(business))` and the native `action="/api/go"` fallback with hidden inputs.
- Tokens only; **no em-dash character** in source (use period/comma/colon; `--` in a doc-comment is fine); reuse the existing card chrome (top rule, header strip, footer CTAs, Surprise me).
- No autonomous `npm run build` / `prebuild` / `tsc`. Running the `npx tsx` unit test IS allowed (it is the sanctioned test method, not a build). The component is verified on a remote Vercel preview.

### Shipping note (read before Task 3)
SP3 reworks the **live primary CTA**. The founder asked to **try a clickable preview before it goes live**. So Task 3 builds + verifies on a preview and PRESENTS it; it does **NOT** fast-forward main. The production ship waits for the founder's nod.

---

## File structure

- **Create** `src/lib/home/search_cascade.ts` — `getCitiesForCountryCode(iso2)` (flat country to city list) + `CASCADE_PREFILLS` (curated rotating examples) + types. Pure, client-safe.
- **Create** `tests/home/search_cascade.test.ts` — asserts the city helper and that every prefill is valid (country in COUNTRIES, business is a default-visible activity id, a non-empty city is one of that country's curated cities). Protects the live CTA from a wrong id/slug.
- **Rewrite** `src/components/NavigatorForm.tsx` — six fields to three (Country, City, Business), rotating pre-fill, region resolved behind the scenes, submit mechanic + native fallback preserved, card chrome reused.

---

### Task 1: The cascade data helper + its test

**Files:**
- Create: `src/lib/home/search_cascade.ts`
- Test: `tests/home/search_cascade.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/home/search_cascade.test.ts` (mirrors the existing `tests/cells/industry_resolution.test.ts` idiom: relative imports, `check`/`errors`, `process.exit(1)` on fail):

```ts
/**
 * search_cascade.test.ts
 *
 * Validates the homepage three-field search cascade data:
 *   1. getCitiesForCountryCode returns a deduped, label-sorted, non-empty list
 *      for a country with curated cities (US), case-insensitively, and [] for
 *      an unknown country.
 *   2. Every CASCADE_PREFILLS entry is valid: country in COUNTRIES, business is
 *      a default-visible activity id that yields a slug, and a non-empty city is
 *      one of that country's curated cities. This is what stops a wrong id/slug
 *      from making the live homepage CTA pre-fill blank or 404.
 *
 * Run: npx tsx tests/home/search_cascade.test.ts
 */
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "../../src/lib/home/search_cascade";
import { COUNTRIES, visibleIndustries, industryToSlug } from "../../src/lib/taxonomy";

const errors: string[] = [];
const check = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
};

// 1. US city list: non-trivial, deduped, all slug+label, sorted by label.
{
  const us = getCitiesForCountryCode("US");
  check(us.length >= 10, `US city list should be non-trivial, got ${us.length}`);
  const slugs = us.map((c) => c.slug);
  check(new Set(slugs).size === slugs.length, "US city list must be de-duplicated");
  check(us.every((c) => c.slug.length > 0 && c.label.length > 0), "US cities must all have slug + label");
  const labels = us.map((c) => c.label);
  const sorted = labels.slice().sort((a, b) => a.localeCompare(b));
  check(JSON.stringify(labels) === JSON.stringify(sorted), "US cities must be sorted by label");
  check(slugs.includes("los-angeles"), "US cities should include los-angeles");
  check(slugs.includes("new-york"), "US cities should include new-york");
}

// 2. Case-insensitive iso2.
{
  check(
    getCitiesForCountryCode("us").length === getCitiesForCountryCode("US").length,
    "iso2 must be case-insensitive",
  );
}

// 3. Unknown country returns an empty array (caller shows Anywhere only).
{
  const any = getCitiesForCountryCode("ZZ");
  check(Array.isArray(any) && any.length === 0, "unknown country returns empty array");
}

// 4. Every prefill is valid.
{
  const countryCodes = new Set(COUNTRIES.map((c) => c.code));
  const defaultGate = { revealMixed: false, revealCorp: false };
  const visibleIds = new Set(visibleIndustries(defaultGate).map((i) => i.id));
  for (const p of CASCADE_PREFILLS) {
    check(countryCodes.has(p.country), `prefill country '${p.country}' must be in COUNTRIES`);
    check(visibleIds.has(p.business), `prefill business '${p.business}' must be a default-visible activity id`);
    check(industryToSlug(p.business).length > 0, `prefill business '${p.business}' must yield a slug`);
    if (p.city) {
      const cities = new Set(getCitiesForCountryCode(p.country).map((c) => c.slug));
      check(cities.has(p.city), `prefill city '${p.city}' must be a curated city of '${p.country}'`);
    }
  }
  check(CASCADE_PREFILLS.length >= 5, "should have at least 5 rotating examples");
}

if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} assertion(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("PASS: search_cascade helper + prefills");
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx tsx tests/home/search_cascade.test.ts`
Expected: FAIL (module `src/lib/home/search_cascade` does not exist yet).

- [ ] **Step 3: Write the helper**

Create `src/lib/home/search_cascade.ts`:

```ts
/**
 * search_cascade.ts -- data for the homepage three-field search cascade
 * (country to city to business). Pure and client-safe (no node:fs): the city
 * list comes from the generated city-alias tables the navigator already uses.
 */
import {
  CITIES_BY_STATE,
  CITY_FRIENDLY_DISPLAY_LABEL,
} from "@/lib/cities/city_aliases_generated";

export type CascadeCity = { slug: string; label: string };

/** Title-case a hyphen slug as a last-resort label. */
function prettifySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * Flat, region-free list of the curated cities for a country (iso2). Unions the
 * city slugs across the country's regions in CITIES_BY_STATE, labels each from
 * CITY_FRIENDLY_DISPLAY_LABEL, de-dupes, and sorts by label. Every returned slug
 * is a URL-resolving geo (the curated set has no gaps). Returns [] for a country
 * with no curated cities, so the caller offers "Anywhere" only.
 */
export function getCitiesForCountryCode(iso2: string): CascadeCity[] {
  const cc = iso2.toUpperCase();
  const byRegion = CITIES_BY_STATE[cc];
  if (!byRegion) return [];
  const labels = CITY_FRIENDLY_DISPLAY_LABEL[cc] || {};
  const seen = new Set<string>();
  const out: CascadeCity[] = [];
  for (const region of Object.keys(byRegion)) {
    for (const slug of byRegion[region]) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, label: labels[slug] || prettifySlug(slug) });
    }
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

export type CascadePrefill = {
  /** iso2 upper, matches the NavigatorForm country state + a COUNTRIES code. */
  country: string;
  /** A curated city slug (a resolving geo), or "" for "Anywhere in {country}". */
  city: string;
  /** An industry id (visibleIndustries .id); the form emits industryToSlug(id). */
  business: string;
};

/**
 * Curated rotating pre-fill examples. Each lands on a real, data-rich cell:
 * city-level entries use confirmed curated city slugs with restaurants (the most
 * widely covered activity); the "Anywhere" entries resolve to a country's
 * curated default region and reuse the homepage's confirmed example cells (UK
 * law, US software). The search_cascade test asserts every entry is valid.
 */
export const CASCADE_PREFILLS: CascadePrefill[] = [
  { country: "US", city: "los-angeles",   business: "restaurants" },
  { country: "GB", city: "",              business: "legal_services" },
  { country: "ES", city: "barcelona",     business: "restaurants" },
  { country: "US", city: "",              business: "software_development" },
  { country: "FR", city: "paris",         business: "restaurants" },
  { country: "JP", city: "tokyo",         business: "restaurants" },
  { country: "US", city: "new-york",      business: "restaurants" },
  { country: "DE", city: "munich",        business: "restaurants" },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx tsx tests/home/search_cascade.test.ts`
Expected: `PASS: search_cascade helper + prefills`. If a prefill fails (e.g. an industry id or city slug is wrong), fix that entry to the real id/slug (cross-check `src/lib/taxonomy/industries.json` for the id and `src/lib/cities/city_aliases_generated.ts` for the city slug) and re-run.

- [ ] **Step 5: Commit**

```bash
git add src/lib/home/search_cascade.ts tests/home/search_cascade.test.ts
git commit -m "feat(home): search-cascade data helper (country to city list + rotating prefills) + test"
```

---

### Task 2: Rework NavigatorForm into the three-field cascade

**Files:**
- Rewrite: `src/components/NavigatorForm.tsx`

- [ ] **Step 1: Replace the whole file**

Replace the entire contents of `src/components/NavigatorForm.tsx` with:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { ComboField, type ComboOption } from "./ComboField";
import {
  COUNTRIES,
  industryToSlug,
  visibleIndustries,
  type Gate,
} from "@/lib/taxonomy";
import { getDefaultRegionForCountry } from "@/lib/regions/default_region_by_country";
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "@/lib/home/search_cascade";
import { elevation } from "@/lib/design-tokens";

/**
 * NavigatorForm: the homepage search, reworked into a three-field guided cascade
 * (country to city to business) per the homepage reform SP3. The submit mechanic
 * is unchanged (router.push to `/{country}/{geo}/{industry}`, with the native
 * action="/api/go" fallback for no-JS), per the founder's standing directive.
 *
 * What changed from the six-field Navigator:
 *  - Three visible fields, in order: Country, City, Business. Region, sector,
 *    and size are gone from the UI. The region is resolved behind the scenes: a
 *    picked city slug IS the URL geo, and "Anywhere in {country}" resolves to
 *    that country's curated default region, so the result link still works.
 *  - The form pre-fills with a rotating real example so it never reads blank;
 *    the rotation stops for good on the first user interaction.
 *  - Business is NOT narrowed by city (activities are not city-specific in the
 *    data), so the full forgiving activity list stays available.
 *
 * The card chrome (top rule, header strip, footer CTAs, Surprise me) is reused.
 */

/** Client-side gate read. Matches lib/audience.ts on the server. */
function readClientGate(): Gate {
  if (typeof window === "undefined") return { revealMixed: false, revealCorp: false };
  const params = new URLSearchParams(window.location.search);
  const cookie = document.cookie || "";
  const cookiePro = /(?:^|;\s*)atlas_pro=1(?:;|$)/.test(cookie);
  const showLarge = params.get("show_large") === "1" || params.get("show_large") === "true";
  const showMixed = params.get("show_mixed") === "1" || params.get("show_mixed") === "true";
  const pro = params.get("pro") === "1" || params.get("pro") === "true" || cookiePro;
  return {
    revealCorp: pro || showLarge,
    revealMixed: pro || showMixed || showLarge,
  };
}

export function NavigatorForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Deterministic initial example (the first curated prefill) so the server and
  // first client render match (no hydration mismatch). The rotation below takes
  // over after mount.
  const [country, setCountry] = useState(CASCADE_PREFILLS[0].country);
  const [city, setCity] = useState(CASCADE_PREFILLS[0].city);
  const [business, setBusiness] = useState(CASCADE_PREFILLS[0].business);
  const [gate, setGate] = useState<Gate>({ revealMixed: false, revealCorp: false });
  // True once the user touches any field; freezes the rotating pre-fill.
  const [touched, setTouched] = useState(false);
  const prefillIdx = useRef(0);

  // Client gate so ?pro=1 / cookies can widen the activity list.
  useEffect(() => {
    setGate(readClientGate());
  }, []);

  // Rotating pre-fill: cycle the three fields through the curated examples every
  // few seconds until the user interacts. ComboField is controlled, so setting
  // the values updates the displayed selection. The effect re-runs when
  // `touched` flips true and its cleanup clears the interval, freezing the form.
  useEffect(() => {
    if (touched) return;
    const id = window.setInterval(() => {
      prefillIdx.current = (prefillIdx.current + 1) % CASCADE_PREFILLS.length;
      const ex = CASCADE_PREFILLS[prefillIdx.current];
      setCountry(ex.country);
      setCity(ex.city);
      setBusiness(ex.business);
    }, 4000);
    return () => window.clearInterval(id);
  }, [touched]);

  const countryOptions: ComboOption[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: c.name,
        keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
      })),
    []
  );

  // City options depend on country: a leading "Anywhere in {country}" (value "")
  // plus the country's curated cities (each slug is a URL-resolving geo).
  const cityOptions: ComboOption[] = useMemo(() => {
    const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;
    const anywhere: ComboOption = { value: "", label: `Anywhere in ${countryName}` };
    const cities = getCitiesForCountryCode(country).map((c) => ({
      value: c.slug,
      label: c.label,
      keywords: [c.slug, c.label.toLowerCase()],
    }));
    return [anywhere, ...cities];
  }, [country]);

  // Business options: the full forgiving activity list (audience-gated),
  // alphabetical. NOT narrowed by city (activities are not city-specific).
  const businessOptions: ComboOption[] = useMemo(
    () =>
      visibleIndustries(gate)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((i) => ({
          value: i.id,
          label: i.name,
          examples: i.examples,
          keywords: i.keywords,
        })),
    [gate]
  );

  function submit() {
    try {
      if (!business) {
        alert("Pick a business to find the data you're looking for.");
        return;
      }
      const cc = country.toLowerCase();
      // Submit mechanic unchanged: navigate to /{country}/{geo}/{industry}.
      // geo precedence: the picked city slug (a resolving geo), else this
      // country's curated default region, else the country code itself.
      const geo = city || getDefaultRegionForCountry(country) || cc;
      const path = `/${cc}/${geo}/${industryToSlug(business)}`;
      setIsLoading(true);
      router.push(path);
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch (err) {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("NavigatorForm submit failed", err);
        window.location.href = "/random";
      }
    }
  }

  function surpriseMe() {
    try {
      setIsLoading(true);
      router.push("/random");
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch {
      if (typeof window !== "undefined") {
        window.location.href = "/random";
      }
    }
  }

  // Native-fallback geo (no-JS via /api/go): subdivision carries the city;
  // region carries the curated default when no city is picked, so the native
  // submit still lands on a cell (/api/go prefers subdivision, then region).
  const fallbackRegion = city ? "" : getDefaultRegionForCountry(country) || "";

  return (
    <form
      action="/api/go"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-2xl atlas-paper-card border border-ink-200 hover:border-ink-300 transition-colors"
      style={{ boxShadow: elevation.card }}
    >
      {/* Hidden inputs mirror state for the no-JS native submit (action="/api/go"). */}
      <input type="hidden" name="country" value={country.toLowerCase()} />
      <input type="hidden" name="region" value={fallbackRegion.toLowerCase()} />
      <input type="hidden" name="subdivision" value={city.toLowerCase()} />
      <input type="hidden" name="industry" value={business ? industryToSlug(business) : ""} />

      {/* Vermillion top rule. */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-atlas-700 via-atlas-500 to-atlas-700"
      />

      {/* Card header strip. */}
      <div className="flex items-baseline justify-between gap-4 px-5 md:px-8 pt-5 md:pt-7 pb-3 border-b border-ink-200">
        <div>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
            The Navigator
          </div>
          <h2 className="mt-1 font-display text-lg md:text-xl text-ink-900 leading-tight">
            Pick a country, a city, and a business.
          </h2>
        </div>
        <div className="hidden sm:block text-right text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-cocoa-700/70 font-medium leading-tight">
          <div>105 countries</div>
          <div>200+ activities</div>
        </div>
      </div>

      {/* Three-field cascade: Country, then City, then Business. */}
      <div className="px-5 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <ComboField
            id="country"
            label="Country"
            required
            options={countryOptions}
            value={country}
            onChange={(v) => {
              setTouched(true);
              setCountry(v);
              setCity("");
            }}
            tooltip="Where the business is. The United States has city-level depth; many countries are country-level for now."
          />
          <ComboField
            id="city"
            label="City"
            options={cityOptions}
            value={city}
            onChange={(v) => {
              setTouched(true);
              setCity(v);
            }}
            tooltip="A major city we cover, or leave it on Anywhere to see the country's strongest region."
          />
          <ComboField
            id="business"
            label="Business"
            required
            options={businessOptions}
            value={business}
            onChange={(v) => {
              setTouched(true);
              setBusiness(v);
            }}
            placeholder="Type a business: restaurants, barbers, plumbers"
          />
        </div>
      </div>

      {/* Footer bar: sample line + Surprise me + submit. */}
      <div className="rounded-b-2xl border-t border-ink-200 bg-white px-5 md:px-8 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] md:text-xs text-cocoa-700/80 leading-relaxed">
            <span className="font-semibold uppercase tracking-[0.12em] text-atlas-700 mr-1.5">
              Try
            </span>
            restaurants in Los Angeles
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            law firms in the UK
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            software in San Francisco
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={surpriseMe}
              disabled={isLoading}
              aria-busy={isLoading}
              className="px-4 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-900 text-sm font-medium border border-parchment transition disabled:opacity-70 disabled:cursor-wait"
            >
              Surprise me
            </button>
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="px-5 py-2.5 rounded-full bg-atlas-700 hover:bg-atlas-800 active:bg-atlas-900 text-cream-50 font-semibold text-sm shadow-sm transition disabled:opacity-70 disabled:cursor-wait inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="inline-block w-3.5 h-3.5 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin"
                  />
                  Loading...
                </>
              ) : (
                <>Show me the numbers <span aria-hidden="true">&rarr;</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
```

Notes for the implementer:
- This DROPS the imports the six-field form used (`SIZE_BANDS`, `visibleSectors`, `visibleIndustriesInSector`, `getRegionsForCountry`, `getSubdivisionsForRegion`, `CITIES_BY_STATE`) and the region/sector/size state. Make sure no stale import or reference remains (tsc on the preview will catch a leftover).
- The arbitrary Tailwind values (`h-[3px]`, `tracking-[0.18em]`, `text-[10px]`, `w-3.5`) and `style={{ boxShadow: elevation.card }}` are copied verbatim from the current file, which passes all gates, so they remain gate-clean (`elevation.card` is a token, not a raw value).
- No em-dash character anywhere; the right arrow is `&rarr;`.

- [ ] **Step 2: Commit**

```bash
git add src/components/NavigatorForm.tsx
git commit -m "feat(home): rework Navigator into country-city-business cascade with rotating prefill"
```

---

### Task 3: Verify on a Vercel preview, then present for the founder to try (do NOT ship)

**Files:** none (controller-run).

- [ ] **Step 1: Deploy a preview (remote build, all gates + tsc)**

```bash
vercel deploy --yes --cwd "E:/atlas/website"
```

Expected: exit 0, prints a `Preview:` URL. If tsc flags a leftover six-field reference or a gate fails, fix the named file, recommit, redeploy.

- [ ] **Step 2: Verify the cascade lands on real cells (not 404, not tier-X synth)**

Curl several paths the cascade produces, with the bypass header + a browser UA, and confirm each renders a real business-in-place page (a masthead headline + revenue numbers, not a thin/synthesized stub):

```bash
# The rotation's destinations:
curl -s -H "x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o" -H "user-agent: Mozilla/5.0" "<PREVIEW_URL>/us/los-angeles/restaurants"      | grep -o "<title>[^<]*"
curl -s -H "x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o" -H "user-agent: Mozilla/5.0" "<PREVIEW_URL>/gb/gb/legal-services"           | grep -o "<title>[^<]*"
curl -s -H "x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o" -H "user-agent: Mozilla/5.0" "<PREVIEW_URL>/us/california/software-development" | grep -o "<title>[^<]*"
curl -s -H "x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o" -H "user-agent: Mozilla/5.0" "<PREVIEW_URL>/es/barcelona/restaurants"         | grep -o "<title>[^<]*"
```

Expected: each returns a real cell title (a business + place), HTTP 200. Spot any that read as a synthesized stub and, if found, drop that prefill from `CASCADE_PREFILLS` (re-run the Task 1 test) before shipping.

- [ ] **Step 3: Screenshot the homepage (shows the three-field cascade pre-filled)**

```powershell
Set-Location "E:\atlas\website"; $env:BYPASS="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; node scripts/shot_preview.mjs <PREVIEW_URL> "/"
```

Expected: `screens/home.png` shows the search card with three fields, Country / City / Business, pre-filled with a real example (e.g. United States / Los Angeles / Restaurants), the "Try" line and both CTAs intact.

- [ ] **Step 4: Present the clickable preview + screenshot to the founder, and STOP**

Send the founder the `Preview:` URL (so they can try the new search live) and the screenshot. Do NOT `git push origin reform-v2/palette-brick:main`. The production ship waits for the founder's nod, per the live-CTA commitment. When they approve, fast-forward main and record SP3 as shipped (completing the homepage reform).

---

## Self-review

**Spec coverage (sections 4-5):** three fields country/city/business, in order (Task 2 layout) with country narrowing cities (`cityOptions` depends on country); rotating pre-fill that is never blank (Task 2 rotation effect + Task 1 `CASCADE_PREFILLS`); forgiving input (reuses `ComboField`'s label/examples/keywords matching + Enter/blur auto-commit); lands straight on the cell (submit pushes `/cc/geo/industry`); funnels through the one search (no new browse rails added). The single deviation ("city narrows business") is documented and intentional (no city/business data).

**Placeholder scan:** both files are complete; the test asserts the prefills; the verification curls list concrete paths. No TBD.

**Type consistency:** `getCitiesForCountryCode` + `CASCADE_PREFILLS` are the exact exports the component and the test import. `CascadePrefill` fields (`country`, `city`, `business`) match the component's state and the test's checks. `ComboOption` shape (`value`, `label`, `examples?`, `keywords?`) matches `ComboField`. `getDefaultRegionForCountry` returns `string | undefined`, handled by the `|| cc` fallback. `visibleIndustries(gate)` + `industryToSlug(id)` match taxonomy exports.

**Constraints:** submit mechanic preserved (router.push to `/cc/geo/industry` + native `/api/go` hidden inputs); tokens only; no em-dash character; card chrome reused; pure helper unit-tested via `npx tsx`; component preview-verified; ship gated on the founder's try.
