/**
 * src/lib/spine/sections/lease_by_law.ts
 *
 * THE LEASE, BY LAW (milestone 2, masterplan step 24; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS item
 * 73). What the law of England and Wales says about a shop's lease, read from data/uk/law/lease_law.json (the research of
 * 2026-10-02, section 73: every field its page, its quote and its day), and the stamp duty on one, from the law engine:
 *
 *   the figure:  the least notice a landlord must give to end a protected lease (1954 Act, s.25: six to twelve months)
 *   the rows:    the clauses in plain words, each naming the field it reads
 *   the tax:     stamp duty on a 5- and a 10-year lease of an 80 m2 London shop at its valuation (the valuation office's
 *                rateable value a square metre, Greater London's shops, data/uk/registers/premises.json), by sdltOnLeaseRent
 *   signed for:  the rent to the first break, the deposit, a solicitor's fee and the tax, summed only when every part is held;
 *                the research found no official figure for the break, the deposit or the fee (73.5, 73.9), so it withholds
 *
 * Computed money is given in pounds and in dollars through the site's FX module; a law's own amounts stay in pounds.
 */
import type { FactRow } from "@/components/spine/archetypes/FactRows";
import leaseLawJson from "../../../../data/uk/law/lease_law.json";
import premisesJson from "../../../../data/uk/registers/premises.json";
import { convertToUsd } from "@/lib/finance/fx";
import type { Provenance } from "@/lib/spine/provenance";
import { leaseRentNpv, sdltOnLeaseRent } from "@/lib/uk/law/lease_tax";
import { pennies, sumPennies } from "@/lib/uk/law/money";

export type LeaseLawField = { value: unknown; source_url: string; quote: string; checked: string };
export type LeaseLaw = { checked: string; fields: Record<string, LeaseLawField> };
export const LEASE_LAW = leaseLawJson as unknown as LeaseLaw;

/** The unit the card states: no official figure gives a typical small shop's floor, so the card says which it priced. */
export const LEASE_UNIT_M2 = 80;
/** Greater London, the region London is held to (his ruling of 2026-10-04). */
const LONDON = "E12000007";
const TAX_YEARS = [5, 10] as const;

type Money = { gbp: number; usd: number | null; prov: Provenance };
export type LeaseByLaw = {
  focal: { months: number; prov: Provenance };
  /** The stated unit's yearly rent at its valuation, the base of the tax; null where the valuation is not held. */
  rentGbp: number | null;
  /** dueDays: the days to pay it, where a tax is due (the law file's sdlt_return_days); null where nothing is due. */
  tax: Array<{ years: (typeof TAX_YEARS)[number]; dueDays: number | null } & Money>;
  signedFor: (Money & { parts: { toBreak: number; deposit: number; fee: number; tax: number } }) | null;
  rows: FactRow[];
};

type PremisesSlice = { rows: Record<string, { categories: Record<string, { rv_per_m2?: number | null }> }> };
const londonShopRvPerM2 = (): number | null => {
  const v = (premisesJson as unknown as PremisesSlice).rows[LONDON]?.categories?.Shops?.rv_per_m2;
  return typeof v === "number" && v > 0 ? v : null;
};

const num = (law: LeaseLaw, key: string): number | null => {
  const v = law.fields[key]?.value;
  return typeof v === "number" && Number.isFinite(v) ? v : null;
};
const lookedUp = (key: string): Provenance => ({ src: `uk/law/lease_law.json:${key}`, kind: "looked up" });
const money = (gbp: number, src: string): Money => ({ gbp, usd: convertToUsd("GBP", gbp), prov: { src, kind: "worked out" } });

export function buildLeaseByLaw(law: LeaseLaw = LEASE_LAW, opts: { rentGbp?: number } = {}): LeaseByLaw | null {
  const f = law.fields;
  const notice = f.landlord_notice_months?.value as { min?: number; max?: number } | undefined;
  if (!notice || typeof notice.min !== "number") return null;

  const perM2 = londonShopRvPerM2();
  const rentGbp = opts.rentGbp ?? (perM2 != null ? pennies(perM2 * LEASE_UNIT_M2) : null);
  const taxOn = (years: number) => (rentGbp == null ? null : sdltOnLeaseRent(leaseRentNpv(Array(years).fill(rentGbp))));
  const dueDays = num(law, "sdlt_return_days");
  const tax =
    rentGbp == null
      ? []
      : TAX_YEARS.map((years) => {
          const gbp = taxOn(years) as number;
          return { years, dueDays: gbp > 0 ? dueDays : null, ...money(gbp, `uk/law/lease_tax.ts:sdltOnLeaseRent:${LEASE_UNIT_M2} m2 London shop at its valuation:${years} years`) };
        });

  /* SIGNED FOR, ONLY FROM PARTS THAT ARE ALL HELD (item 73's "done means"): one missing part and there is no total. */
  const breakMonths = num(law, "break_first_months");
  const depositMonths = num(law, "deposit_months");
  const fee = num(law, "legal_fee_gbp");
  const leaseYears = num(law, "lease_years");
  let signedFor: LeaseByLaw["signedFor"] = null;
  if (rentGbp != null && breakMonths != null && depositMonths != null && fee != null && leaseYears != null) {
    const parts = { toBreak: pennies((rentGbp * breakMonths) / 12), deposit: pennies((rentGbp * depositMonths) / 12), fee: pennies(fee), tax: taxOn(leaseYears) as number };
    signedFor = { ...money(sumPennies([parts.toBreak, parts.deposit, parts.fee, parts.tax]), "uk/law/lease_law.json:signed for"), parts };
  }

  /* THE CLAUSES, each a law's own words made plain, in the order a tenant meets them: holding on, signing it away, asking to
     renew, a court's new lease, a refusal's price, short leases, registering, the repairs claim at the end, VAT on the rent. */
  const rows: FactRow[] = [];
  const push = (key: string, field: string, label: string, value: string | null, note: string | null) => {
    if (value && f[field]) rows.push({ key, icon: ICON[key], label, value, note, prov: lookedUp(field) });
  };
  push("renewal", "renewal_right", "Renewal", f.renewal_right?.value === "statutory" ? "By law" : null, "Unless you sign it away");
  const outDays = num(law, "contracting_out_notice_days");
  push("signing-away", "contracting_out_notice_days", "Signing it away", outDays != null ? `${outDays} days' warning` : null, "Then a signed declaration");
  const request = f.tenant_request_months?.value as { min?: number; max?: number } | undefined;
  push("asking", "tenant_request_months", "Asking to renew", request?.min != null && request?.max != null ? `${request.min} to ${request.max} months` : null, "Before the date you ask for");
  const newYears = num(law, "new_tenancy_years_max");
  push("new-lease", "new_tenancy_years_max", "Longest new lease", newYears != null ? `${newYears} years` : null, "Court-set, at market rent");
  const comp = f.compensation_rateable_value?.value as { multiplier?: number; after_14_years?: number } | undefined;
  push("refused", "compensation_rateable_value", "Refused renewal", comp?.multiplier != null ? `${comp.multiplier} x rateable value` : null, comp?.after_14_years != null ? `${comp.after_14_years} x after 14 years there` : null);
  const short = num(law, "short_tenancy_months");
  push("short", "short_tenancy_months", "Short leases", short != null ? `${short} months or less` : null, "Outside the Act's protection");
  const regYears = num(law, "registration_over_years");
  const regMonths = num(law, "registration_months");
  const regFee = f.registration_fee_gbp?.value as { fee?: number; rent_up_to?: number } | undefined;
  push("registering", "registration_over_years", "Registering it", regYears != null ? `Over ${regYears} years` : null, regMonths != null && regFee?.fee != null ? `Within ${regMonths} months, £${regFee.fee}` : null);
  const schedule = num(law, "dilapidations_schedule_days");
  push("repairs", "dilapidations_cap", "Repairs claim", f.dilapidations_cap ? "Capped" : null, schedule != null ? `At the loss, within ${schedule} days` : "At the landlord's loss");
  const vat = f.vat_on_rent?.value as { rule?: string; rate_pct?: number } | undefined;
  push("vat", "vat_on_rent", "VAT on rent", vat?.rule === "optional" && vat.rate_pct != null ? `${vat.rate_pct}% if opted` : null, "Exempt unless opted to tax");

  return { focal: { months: notice.min, prov: lookedUp("landlord_notice_months") }, rentGbp, tax, signedFor, rows };
}

const ICON: Record<string, NonNullable<FactRow["icon"]>> = {
  renewal: "commercial-rent",
  "signing-away": "red-tape",
  asking: "first-year",
  "new-lease": "commercial-rent",
  refused: "verdict",
  short: "first-year",
  registering: "register-cost",
  repairs: "cost-breakdown",
  vat: "taxes",
};
