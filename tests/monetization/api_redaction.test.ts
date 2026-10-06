/**
 * THE PUBLIC DATA LEAVES OUT WHAT THE PAGES LOCK (the checkup of 2026-10-06, finding 3): while the paywall is on, a UK cell's rent
 * share, payroll share and wage per employee (the London trade page's locked level "split") are null in /api/cell-lookup and in
 * the cell CSV; everything else stays, and nothing changes off the UK or with the paywall off. Both routes call the one function.
 *
 * Run: npx tsx tests/monetization/api_redaction.test.ts
 */
import { readFileSync } from "node:fs";
import { PAYWALLED_API_FIELDS, redactForPaywall } from "../../src/lib/monetization/api_redaction";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "api-redaction";
const FILE = "src/lib/monetization/api_redaction.ts";
const REMEDY = "pass every public data row through redactForPaywall, and list only the figures a locked level draws";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const row = { country: "GB", rev_p50: 280000, survival_yr5: 0.29, n_enterprises: 7865, rent_share_pct: 12, payroll_share_pct: 31, payroll_per_employee: 24000 };
const on = redactForPaywall(row, { paywallOn: true, country: "GB" });
check("a UK cell with the paywall on loses the three locked figures", on.rent_share_pct === null && on.payroll_share_pct === null && on.payroll_per_employee === null);
check("and keeps what the pages give free (sales, survival, the count)", on.rev_p50 === 280000 && on.survival_yr5 === 0.29 && on.n_enterprises === 7865);
check("the paywall off changes nothing", redactForPaywall(row, { paywallOn: false, country: "GB" }) === row);
check("a cell off the UK changes nothing", redactForPaywall({ ...row, country: "DE" }, { paywallOn: true, country: "DE" }).rent_share_pct === 12);
check("a field the row does not carry is not added", !("rent_share_pct" in redactForPaywall({ country: "GB" }, { paywallOn: true, country: "gb" })));
check("only the locked level's three figures are listed", PAYWALLED_API_FIELDS.length === 3);

/* Both public routes call it, with the paywall's own switch. */
for (const route of ["src/app/api/cell-lookup/route.ts", "src/app/api/export-csv/route.ts"]) {
  const src = readFileSync(route, "utf8");
  check(`${route} passes its row through redactForPaywall with isPaywallOn()`, src.includes("redactForPaywall(") && src.includes("isPaywallOn()"));
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/api_redaction: all pass");
