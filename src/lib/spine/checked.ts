/**
 * src/lib/spine/checked.ts
 *
 * THE "CHECKED" DATE A PAGE MAY PRINT (milestone 2, masterplan step 31; the credibility doctrine of 2026-10-02: the page foot
 * holds "Checked [date]"). Only a date the data holds, never today's standing in for a check. The UK pages' figures come from the
 * register slices under data/uk/registers, and their date is the slices' build date, the manifest's `built`, which
 * E:/atlas/registers/uk/export_for_site.py writes at export. The manifest of 2026-10-05 holds none, so no page prints the line
 * until an export writes it (QUEUE data:uk-register-built-date); elsewhere no page holds a checked date at all.
 */
import manifest from "../../../data/uk/registers/manifest.json";

const built = (manifest as { built?: unknown }).built;
export const REGISTER_BUILT: string | null = typeof built === "string" && /^\d{4}-\d{2}-\d{2}$/.test(built) ? built : null;

export function checkedDateFor(iso2: string | null | undefined): string | null {
  return String(iso2 ?? "").toUpperCase() === "GB" ? REGISTER_BUILT : null;
}
