/**
 * src/lib/spine/setup_rows.ts
 *
 * THE TIERS TABLE'S ROWS for a country, from the formation file, by the same
 * mapping the adapter applies, plus the door to the how-to page when that
 * page exists. Local and synchronous, for the stories and the harness.
 */
import { getFormationRows } from "@/lib/tax/country_rates";
import { COUNTRIES } from "@/lib/taxonomy";
import { COPY } from "@/lib/spine/copy";
import { inSentence } from "@/lib/spine/place_names";
import type { Provenance } from "@/lib/spine/provenance";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** `costProv`, `daysProv`: the formation file's row and field each figure was read from (plan 2026-10-12 rhythm-air-inside, Task 4: a figure that prints alike elsewhere is a fact of its own only with its own source). */
export type SetupRow = { tier: string; local_term?: string; cost_usd?: number; days?: number; complexity_1_5?: number; costProv?: Provenance; daysProv?: Provenance };

export function buildSetupRows(iso2In: string): SetupRow[] {
  const iso2 = iso2In.toUpperCase();
  const rows = getFormationRows(iso2);
  /* A row's place in the file names its figures: the peers table's home row reads the first LLC row by the same place (peer_rows.ts). */
  const at = (i: number, field: string): Provenance => ({ src: `legal/business_formation_costs_v1.json:countries.${iso2}.${i}.${field}`, kind: "looked up" });
  return rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => typeof r.tier === "string")
    .map(({ r, i }) => ({
      tier: r.tier as string,
      local_term: r.local_term || undefined,
      cost_usd: isNum(r.setup_cost_usd) ? Math.round(r.setup_cost_usd) : undefined,
      days: isNum(r.setup_days) ? Math.round(r.setup_days) : undefined,
      complexity_1_5: isNum(r.complexity_score) ? Math.round(r.complexity_score) : undefined,
      ...(isNum(r.setup_cost_usd) ? { costProv: at(i, "setup_cost_usd") } : {}),
      ...(isNum(r.setup_days) ? { daysProv: at(i, "setup_days") } : {}),
    }));
}

/**
 * THE DOOR TO "How to open a business in [country name]" (founder ruling 8,
 * 2026-09-04). The page is not built; the route is reserved as
 * /[country]/how-to-open. Until a page renders there this returns null and the
 * table draws no link, because a door to a 404 is a promise the site cannot
 * keep (and the dead-link gate would fail the build). When the page lands,
 * this is the one line to change.
 */
export function howToOpenDoor(iso2: string): { href: string; label: string } | null {
  const name = (COUNTRIES as Array<{ code: string; name: string }>).find((c) => c.code === iso2.toUpperCase())?.name;
  if (!name) return null;
  const HOW_TO_PAGE_EXISTS = true; // src/app/[country]/how-to-open/page.tsx, built run 5 (2026-09-05)
  // The page answers 404 for a country with no legal form on file, so the door is not drawn there either.
  if (buildSetupRows(iso2).length === 0) return null;
  return HOW_TO_PAGE_EXISTS ? { href: `/${iso2.toLowerCase()}/how-to-open`, label: COPY.tiers.door.replace("{country}", inSentence(name)) } : null;
}
