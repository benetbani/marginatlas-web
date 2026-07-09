/**
 * src/lib/feature_flags.ts
 *
 * Single source of truth for product feature flags.
 *
 * Why: prior to this module, feature-flag checks were scattered as
 * one-line `process.env.NEXT_PUBLIC_*` reads across the codebase
 * (`au_primary_loader.ts`, `account/page.tsx`, etc.). The next flag
 * would have been the 14th file to grep for. Centralising:
 *   1. One file to inspect "what's flagged on/off in this deploy?"
 *   2. Typed accessors instead of stringly-typed env reads
 *   3. Tolerant boolean parsing ("1" / "true" / "on" all enable)
 *
 * Convention:
 *   - Product-behaviour flags belong here.
 *   - Config / secrets (Supabase URL, service role key) stay in
 *     `lib/supabase.ts` and similar service modules. Those are not
 *     toggled per-deploy; they are environment-required.
 *   - Build-time strictness flags (e.g. COMPARATIVE_VOICE_STRICT)
 *     stay in the verify scripts that read them; they don't run in
 *     the app process.
 *
 * Adding a flag:
 *   1. Add the env-var name to the FLAG_NAMES const below.
 *   2. Add a typed accessor that calls parseFlag().
 *   3. Document the default polarity in the JSDoc.
 *   4. Update .env.example with the kill-switch syntax.
 *
 * 2026-05-27.
 */

/**
 * Permissive boolean parser. Accepts the common "on" / "off" forms
 * so deployment configs can use whichever convention the operator
 * prefers.
 */
function parseFlag(value: string | undefined, defaultOn: boolean): boolean {
  if (value == null) return defaultOn;
  const v = value.toLowerCase().trim();
  if (v === "") return defaultOn;
  if (v === "0" || v === "false" || v === "off" || v === "no") return false;
  if (v === "1" || v === "true" || v === "on" || v === "yes") return true;
  // Unknown value: fall back to default to avoid silent breakage.
  return defaultOn;
}

/**
 * Australia primary-data override on cell pages. Default-on since
 * Phase 1d activation (2026-05-27); ATO Small Business Benchmark
 * ratios drive AU cells. Kill switch reverts to modelled values
 * instantly.
 */
export function isAuPrimaryDataEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_AU_PRIMARY_DATA, true);
}

/**
 * `/account` page design preview. Default OFF since auth isn't
 * wired yet; the public `/account` route renders a "coming soon"
 * placeholder. Local dev can flip this on to see the dummy-data
 * design without auth.
 */
export function isAccountPreviewEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_ACCOUNT_PREVIEW, false);
}

/**
 * Supabase magic-link auth + free accounts (Milestone 1). Default OFF until the
 * founder enables Supabase Auth (email provider + redirect-URL allowlist) and
 * applies the saved-cells migration. With this OFF the site is unchanged: no
 * sign-in UI, CellActions stays on localStorage, /account shows "coming soon",
 * and no auth code runs. Flip to "1" (in Vercel) to activate M1.
 */
export function isAuthEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_AUTH_ENABLED, false);
}

/**
 * The owner-take-home paywall gate (Milestone 2). Default OFF: every number shows
 * in full, exactly as today. When ON, the static page ships a redacted placeholder
 * for owner take-home and a subscriber's browser reveals the real value via the
 * authed /api/cell-take-home. Do NOT flip this on until all four surfaces (cell
 * board, city table, industry table, Compare) are gated, or the value leaks.
 * Requires auth + Stripe configured.
 */
export function isGatingEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_GATING_ENABLED, false);
}

/**
 * The warm frame (R6 Phase B): the photo gutters + per-category hero wash +
 * glass sticky chrome. Default ON since the R7 cohesion plan (founder, 2026-06-14):
 * the frame is the site's standard chrome, the unifying framing layer on every
 * page type. Set NEXT_PUBLIC_WARM_FRAME=0 to kill it (the only off-switch now).
 * The data column stays cream and opaque either way: warmth lives in the frame,
 * never behind a number; gutters collapse below 1100px so mobile stays calm.
 */
export function isWarmFrameEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_WARM_FRAME, true);
}

/**
 * The new recommender for the /decide route. Default OFF so live /decide stays
 * the old page until the founder flips NEXT_PUBLIC_RECOMMENDER after eyeballing
 * the dev route. This mirrors the per-page spine gate: each page type has its own
 * adapter before flipping live.
 */
export function isRecommenderEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_RECOMMENDER, false);
}

/**
 * The five spine page types. Each live route branches on its own gate
 * (isSpineReformEnabledFor) so a page flips to the rebuilt surface independently, and
 * only once its real-data adapter has shipped.
 */
export type SpinePage = "cell" | "industry" | "city" | "hood" | "region" | "country";

/**
 * The spine page-type reform (Final Ascent), GLOBAL master. Default OFF. This is a
 * convenience switch that enables every page whose real-data adapter has shipped (see
 * isSpineReformEnabledFor). It deliberately does NOT enable a page that still renders
 * an illustrative seed, so setting this on in production can never put sample numbers
 * on a live URL (the honesty rail forbids exactly that). To preview an illustrative
 * page locally, set that page's own per-page var instead.
 */
export function isSpineReformEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_SPINE_REFORM, false);
}

/**
 * Per-page spine gate: what every live route actually branches on, so each page type
 * flips independently and only a page with real, reconciled data ever ships.
 *
 * Resolution order:
 *   1. The page's own NEXT_PUBLIC_SPINE_REFORM_<PAGE> var, when set, always wins
 *      (either polarity). This is the production go-live control: set a finished
 *      page to "1" in Vercel to serve its real spine, or "0" to force it off.
 *   2. Otherwise a page whose adapter has SHIPPED follows the global master
 *      (isSpineReformEnabled). A page that still renders an illustrative seed does
 *      NOT: the master cannot enable it, so a stray global flag in production stays
 *      honest, and only that page's explicit per-page var (local preview) turns it on.
 *
 * The real vs illustrative split is the boolean at each case below. Keep it in lockstep
 * with the shipped adapters: when a new adapter lands, flip its case to true in the
 * same commit (cell / industry / city / hood are real; region / country are not yet).
 */
export function isSpineReformEnabledFor(page: SpinePage): boolean {
  switch (page) {
    case "cell":
      return resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_CELL, true);
    case "industry":
      return resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_INDUSTRY, true);
    case "city":
      return resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_CITY, true);
    case "hood":
      // Real: buildSpineHoodSeed renders the seven real London macro-districts and
      // falls through to the non-spine page for cities without curated districts.
      return resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_HOOD, true);
    case "region":
      // No real adapter planned (the region route mounts the illustrative city body
      // for preview only). Master never enables it.
      return resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_REGION, false);
    case "country":
      // Illustrative hero has no honest country-level source. Master never enables it.
      return resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_COUNTRY, false);
  }
}

/**
 * Resolve one page's gate: an explicit per-page var (either polarity) wins; otherwise
 * the global master applies only when this page's adapter has shipped (masterEnables),
 * so the master can never turn on an illustrative page.
 */
function resolveSpinePage(perPageValue: string | undefined, masterEnables: boolean): boolean {
  if (perPageValue != null && perPageValue.trim() !== "") {
    return parseFlag(perPageValue, false);
  }
  return masterEnables ? isSpineReformEnabled() : false;
}

/**
 * Snapshot of every flag's current value. Useful for `/status` and
 * for the audit / debug surfaces.
 */
export function snapshotFlags(): Record<string, boolean> {
  return {
    NEXT_PUBLIC_AU_PRIMARY_DATA: isAuPrimaryDataEnabled(),
    NEXT_PUBLIC_ACCOUNT_PREVIEW: isAccountPreviewEnabled(),
    NEXT_PUBLIC_AUTH_ENABLED: isAuthEnabled(),
    NEXT_PUBLIC_GATING_ENABLED: isGatingEnabled(),
    NEXT_PUBLIC_WARM_FRAME: isWarmFrameEnabled(),
    NEXT_PUBLIC_RECOMMENDER: isRecommenderEnabled(),
    NEXT_PUBLIC_SPINE_REFORM: isSpineReformEnabled(),
    // The resolved per-page spine gates (master + per-page var), what each route sees.
    "spine.cell": isSpineReformEnabledFor("cell"),
    "spine.industry": isSpineReformEnabledFor("industry"),
    "spine.city": isSpineReformEnabledFor("city"),
    "spine.hood": isSpineReformEnabledFor("hood"),
    "spine.region": isSpineReformEnabledFor("region"),
    "spine.country": isSpineReformEnabledFor("country"),
  };
}
