/**
 * src/lib/spine/checked.ts
 *
 * THE "CHECKED" DATE A PAGE MAY PRINT (milestone 2, masterplan step 31; the credibility doctrine of 2026-10-02: the page foot
 * holds "Checked [date]"). Only a date the data holds, never today's standing in for a check. The UK pages' figures come from the
 * register slices under data/uk/registers, and their date is the slices' build date, the manifest's `built`, which
 * E:/atlas/registers/uk/export_for_site.py writes at export: the day the export ran, since 2026-10-06 (QUEUE
 * data:uk-register-built-date). Elsewhere no page holds a checked date at all. WHAT THE DATE CANNOT SAY: an export on a later
 * day moves it even when no slice changed, so "Checked" is the day the slices were last cut from the register tables and
 * fingerprinted, not a new reading of the sources (each table's own date stays in the manifest's `files`).
 */
import manifest from "../../../data/uk/registers/manifest.json";

const built = (manifest as { built?: unknown }).built;
export const REGISTER_BUILT: string | null = typeof built === "string" && /^\d{4}-\d{2}-\d{2}$/.test(built) ? built : null;

export function checkedDateFor(iso2: string | null | undefined): string | null {
  return String(iso2 ?? "").toUpperCase() === "GB" ? REGISTER_BUILT : null;
}
