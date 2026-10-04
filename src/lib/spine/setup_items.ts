/**
 * src/lib/spine/setup_items.ts
 *
 * The bill to open's lines from a cell's setup_costs block, pure (moved out of adapt_cell.ts on 2026-10-04 so its test runs
 * without the database client that module loads).
 */
import type { Cell } from "@/lib/cells";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Build the setup line items from a cell's real setup_costs block. Only called
 * when hasSetupCostData(cell) is true, so at least one line is real. A bill the
 * cell holds from its parent trade's row is none of this trade's (plan 06, task
 * A3): it prints only on the trade it was written for. */
export function setupItemsFromCell(cell: Pick<Cell, "setup_costs" | "_fromParentIndustry">): { surface_line?: string; items: Array<{ name: string; usd: number }> } | undefined {
  const setup = cell.setup_costs;
  if (!setup || cell._fromParentIndustry) return undefined;
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
  return { items };
}
