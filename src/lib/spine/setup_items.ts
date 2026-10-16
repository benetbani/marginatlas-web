/**
 * src/lib/spine/setup_items.ts
 *
 * The bill to open's lines from a cell's setup_costs block, pure (moved out of adapt_cell.ts on 2026-10-04 so its test runs
 * without the database client that module loads).
 */
import type { Cell } from "@/lib/cells";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * THE SHAPE OF A MEASUREMENT (fix round 1 of release 3 job A, the review's I-3): a data file and its key (`data/<path>.json:<key>`) or a
 * named register (`uk/registers/<file>.json:<key>`), the forms the site's stamps already take. Any other string ("trust me", "survey") names
 * nothing a reader could follow, and the bill does not print. This reader checks the SHAPE only, since it runs where no file system is at
 * hand; the gate held-bill checks that the file and the key exist for every block a writer holds.
 */
export const MEASURED_SRC = /^(?:data\/[A-Za-z0-9_\/.-]+\.json|uk\/registers\/[A-Za-z0-9_.-]+\.json):[A-Za-z0-9_.*-]+$/;
export function isMeasuredSource(src: unknown): src is string {
  return typeof src === "string" && MEASURED_SRC.test(src.trim());
}

/** Build the setup line items from a cell's setup_costs block. A parent trade's bill is none of this trade's (plan 06, task A3). WHOSE IT IS (plan 2026-10-11,
 * uk:held-bill-provenance): each writer set ONE bill on every row of a country (scripts/import/deepening/gb/restaurants.sql, a UK estimate, grade B; the us files
 * the same for the US), so the block carries the row's country as `scope`; the bulk files (grade C) set the same US lines in every country: below B, nothing.
 *
 * NO TYPED BILL (release 3 job A, 2026-10-16): a bill prints only where its block names the measurement its lines were read from
 * (`measured_src`). Every block the database holds was typed by hand on 2026-05-24: the three deepening files pick point values inside
 * ranges from startup guides (the UK fit-out 250,000 "comparable to US figures"), and the bulk template multiplies typed US baselines by a
 * typed country factor. None names a measurement, so none prints: the trade page earns it back off the shard (open_rows.ts) and the
 * calculator builds its bill from the city's fit-out or states none (simulator/defaults.ts). Gate: held-bill (tests/open/held_bill.test.ts). */
export function setupItemsFromCell(cell: Pick<Cell, "setup_costs" | "_fromParentIndustry" | "country">): { surface_line?: string; items: Array<{ name: string; usd: number }>; scope: string; src: string } | undefined {
  const setup = cell.setup_costs;
  if (!setup || cell._fromParentIndustry || (setup.grade !== "A" && setup.grade !== "B") || !cell.country) return undefined;
  if (!isMeasuredSource(setup.measured_src)) return undefined;
  const items: Array<{ name: string; usd: number }> = [];
  const reg = setup.registration;
  const cap = setup.capital;
  const push = (name: string, usd: number | undefined) => {
    if (isNum(usd) && usd > 0) items.push({ name, usd: Math.round(usd) });
  };
  if (cap) {
    push("Fit-out", cap.property_fitout);
    push("Equipment", cap.equipment_initial);
    push("Initial inventory", cap.initial_inventory);
    push("Lease deposit", cap.lease_deposit);
    push("Pre-opening marketing", cap.pre_opening_marketing);
  }
  if (reg) {
    push("Business registration", reg.business_registration_fee);
    push("Industry licences", reg.industry_licenses_fee);
    push("Professional licences", reg.professional_license_fee);
    push("Insurance and bonds", reg.insurance_bond_initial);
    push("Certifications", reg.certifications_initial);
  }
  if (items.length === 0) return undefined;
  /* THE STAMP NAMES THE MEASUREMENT (fix round 1, I-3): every printed line carries `src`, the block's measured_src, as its data-src. */
  return { items, scope: cell.country.toUpperCase(), src: (setup.measured_src as string).trim() };
}
