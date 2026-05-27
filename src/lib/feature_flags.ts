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
 * Snapshot of every flag's current value. Useful for `/status` and
 * for the audit / debug surfaces.
 */
export function snapshotFlags(): Record<string, boolean> {
  return {
    NEXT_PUBLIC_AU_PRIMARY_DATA: isAuPrimaryDataEnabled(),
    NEXT_PUBLIC_ACCOUNT_PREVIEW: isAccountPreviewEnabled(),
  };
}
