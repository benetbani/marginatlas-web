/**
 * Plan v28 Lane B — server-side reasonableness check.
 *
 * Catches "obvious unit error" anomalies that slip past the simple
 * SMB bounds: aggregate-vs-per-firm confusion, currency confusion
 * (CHF displayed as USD), wage × employees vastly exceeding revenue.
 *
 * Returns a list of issues. Empty list means the cell passes.
 * Pages can choose to suppress sections, log to telemetry, or both.
 */

export type ReasonablenessInput = {
  iso2?: string | null;
  industryId?: string | null;
  revenuePerFirm?: number | null;
  totalEmployees?: number | null;
  totalEnterprises?: number | null;
  payrollPerEmployee?: number | null;
};

export type ReasonablenessIssue = {
  code: "rev_too_high_for_smb" | "rev_too_low_for_smb" | "wage_exceeds_revenue" | "wage_too_high" | "wage_too_low" | "labor_share_absurd" | "currency_likely_local";
  severity: "warn" | "block";
  message: string;
  values?: Record<string, number | string>;
};

const ABSOLUTE_REVENUE_CEILING_PER_FIRM = 60_000_000; // $60M — above this is corporate, not SMB
const ABSOLUTE_REVENUE_FLOOR_PER_FIRM = 5_000; // $5K — below this is not a real business
const ABSOLUTE_WAGE_CEILING = 250_000; // $250K — above this is C-suite, not SMB employee median
const ABSOLUTE_WAGE_FLOOR = 1_200; // $1.2K/yr — below this is probably annual not monthly

export function checkReasonableness(input: ReasonablenessInput): ReasonablenessIssue[] {
  const issues: ReasonablenessIssue[] = [];

  const rev = input.revenuePerFirm;
  const wage = input.payrollPerEmployee;
  const totalEmp = input.totalEmployees;
  const totalEnt = input.totalEnterprises;

  if (rev != null) {
    if (rev > ABSOLUTE_REVENUE_CEILING_PER_FIRM) {
      issues.push({
        code: "rev_too_high_for_smb",
        severity: "block",
        message: `Revenue per firm $${rev.toLocaleString()} exceeds SMB ceiling of $${ABSOLUTE_REVENUE_CEILING_PER_FIRM.toLocaleString()}. Likely aggregate-vs-per-firm confusion or currency error.`,
        values: { revenue: rev },
      });
    } else if (rev > 0 && rev < ABSOLUTE_REVENUE_FLOOR_PER_FIRM) {
      issues.push({
        code: "rev_too_low_for_smb",
        severity: "warn",
        message: `Revenue per firm $${rev} below realistic floor. Possible thousands-vs-units error.`,
        values: { revenue: rev },
      });
    }
  }

  if (wage != null) {
    if (wage > ABSOLUTE_WAGE_CEILING) {
      issues.push({
        code: "wage_too_high",
        severity: "warn",
        message: `Median wage $${wage.toLocaleString()} exceeds realistic SMB ceiling. Possible currency or scale error.`,
        values: { wage },
      });
    } else if (wage > 0 && wage < ABSOLUTE_WAGE_FLOOR) {
      issues.push({
        code: "wage_too_low",
        severity: "warn",
        message: `Median wage $${wage} below realistic annual floor. Possible monthly-vs-annual or local-currency confusion.`,
        values: { wage },
      });
    }
  }

  if (wage != null && rev != null && totalEmp != null && totalEnt != null && totalEnt > 0) {
    const empPerFirm = totalEmp / totalEnt;
    const laborCostPerFirm = empPerFirm * wage;
    if (laborCostPerFirm > rev * 1.5) {
      issues.push({
        code: "labor_share_absurd",
        severity: "block",
        message: `Implied labor cost ($${Math.round(laborCostPerFirm).toLocaleString()}) exceeds 150% of revenue ($${Math.round(rev).toLocaleString()}). Internal inconsistency.`,
        values: { revenue: rev, labor_cost: laborCostPerFirm, ratio: laborCostPerFirm / rev },
      });
    }
    if (rev > 0 && laborCostPerFirm > rev) {
      issues.push({
        code: "wage_exceeds_revenue",
        severity: "warn",
        message: `Implied labor cost exceeds revenue. Possible currency mismatch between wage and revenue fields.`,
        values: { revenue: rev, labor_cost: laborCostPerFirm },
      });
    }
  }

  // Currency heuristic: very-high-wage countries where the value is round and
  // suspiciously large (Japan ¥6,000,000 leaked as $6M).
  if (wage != null && wage > 500_000 && wage < 20_000_000) {
    issues.push({
      code: "currency_likely_local",
      severity: "warn",
      message: `Wage in the ${wage.toLocaleString()} band is consistent with local currency (yen, won, peso) rendered as dollars.`,
      values: { wage },
    });
  }
  if (rev != null && rev > 100_000_000 && rev < 1_000_000_000_000) {
    issues.push({
      code: "currency_likely_local",
      severity: "block",
      message: `Revenue ${rev.toLocaleString()} is in the band where local currency was likely mistaken for USD.`,
      values: { revenue: rev },
    });
  }

  return issues;
}

/** Convenience: returns the worst severity present in the list, or null. */
export function worstSeverity(issues: ReasonablenessIssue[]): "block" | "warn" | null {
  if (issues.some((i) => i.severity === "block")) return "block";
  if (issues.length > 0) return "warn";
  return null;
}
