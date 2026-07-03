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
 * The spine page-type reform (Final Ascent). Default OFF: every live route
 * (country / region / cell / industry / neighborhoods) renders exactly as today.
 * When ON, those routes render the rebuilt "spine" surfaces instead. Kept OFF in
 * production until each page's real-data adapter lands (the bundled spine seeds are
 * illustrative placeholders, so flipping this on before the adapters would put
 * sample numbers on live URLs, which the honesty rail forbids). Local dev / preview
 * can set NEXT_PUBLIC_SPINE_REFORM=1 to see the promoted surfaces. Flip per
 * page-group in Vercel only once its adapter shows real, reconciled numbers.
 */
export function isSpineReformEnabled(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_SPINE_REFORM, false);
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
    NEXT_PUBLIC_SPINE_REFORM: isSpineReformEnabled(),
  };
}
