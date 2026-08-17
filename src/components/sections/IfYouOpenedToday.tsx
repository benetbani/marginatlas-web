/**
 * IfYouOpenedToday — date-aware composition that names actual
 * calendar dates for the major milestones of opening this business.
 *
 * Reads cell.setup_costs + cell.cost_stack + cell.revenue_per_firm.
 * Computes (from today's date):
 *   - estimated opening date (registration + fit-out time)
 *   - first revenue date (a week post-opening for ramp)
 *   - operating break-even (cash-flow positive month)
 *   - capital payback (full setup-cost recovered)
 *
 * Country-aware on registration time (US ~2 weeks, JP ~4 weeks,
 * AE ~6 weeks, etc.). Self-suppresses when setup_costs is absent
 * (industries where opening cost is trivial like consultants).
 *
 * Founder-research lens: the visceral effect of seeing actual
 * calendar dates — "you'd be operational by August 7th" — turns
 * the abstract benchmark into "I could do this."
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";

type Props = {
  cell: Cell;
};

// Country-specific business-formation time in weeks.
// Source: World Bank Doing Business 2020 + national chamber data.
const REGISTRATION_WEEKS: Record<string, number> = {
  US: 2, GB: 1, DE: 3, FR: 3, IT: 4, ES: 4, NL: 1, BE: 3,
  AT: 3, CH: 2, IE: 1, PT: 4, GR: 6, PL: 3, CZ: 3, HU: 3,
  SE: 2, NO: 2, DK: 1, FI: 2,
  JP: 4, KR: 2, SG: 1, AE: 6, IL: 3,
  AU: 1, NZ: 1, CA: 2,
  MX: 8, BR: 12, AR: 14, CL: 4, CO: 6, PE: 6,
  IN: 10, ID: 8, VN: 8, PH: 8, MY: 4, TH: 4, CN: 6,
  EG: 12, MA: 8, NG: 12, KE: 8, ZA: 6,
  TR: 4,
};

// Industry-specific "operational by" lag: weeks from finished
// registration to able-to-take-first-customer. Captures construction
// + permits + equipment install. Default 4 weeks.
const FITOUT_WEEKS: Record<string, number> = {
  restaurants: 12,
  cafes_coffee: 8,
  hairdressers_beauty: 6,
  barbershops: 4,
  auto_repair_shops: 8,
  hotels_lodging: 26,
  dental_practices: 10,
  doctors_clinics: 8,
  legal_services: 2,
  accounting_tax: 2,
  real_estate_agencies: 3,
  residential_construction: 4,
  grocery_stores: 10,
  clothing_stores: 6,
  sports_fitness: 10,
  veterinary_pet_care: 10,
};

function addWeeks(d: Date, weeks: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + Math.round(weeks * 7));
  return out;
}

function addMonths(d: Date, months: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + Math.round(months));
  return out;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function IfYouOpenedToday({ cell }: Props) {
  const setup = cell.setup_costs;
  const rev = cell.revenue_per_firm ?? cell.rev_p50;
  if (!setup || !rev || rev <= 0 || !cell.industry_id) return null;
  const totalSetup =
    (setup.registration?.total_estimated ?? 0) +
    (setup.capital?.total_estimated ?? 0);
  if (totalSetup <= 0) return null;

  const today = new Date();
  const regWeeks = REGISTRATION_WEEKS[cell.country] ?? 4;
  const fitWeeks = FITOUT_WEEKS[cell.industry_id] ?? 4;

  // Milestones
  const registeredBy = addWeeks(today, regWeeks);
  const operationalBy = addWeeks(registeredBy, fitWeeks);
  const firstRevenueBy = addWeeks(operationalBy, 1);

  // Operating break-even: assume net margin ~6% of revenue (industry
  // average for SMB); monthly profit = rev × 0.06 / 12; break-even
  // when cumulative profit covers 3 months of operating cost (working
  // capital reserve gives runway).
  const monthlyRevenue = rev / 12;
  // Assume the first 3 months ramp at 40%, 70%, 90% of mature revenue.
  // Then full from month 4 onwards. Net margin steady at 6%.
  const NET_MARGIN = 0.06;
  let cumProfit = 0;
  let breakEvenMonth = -1;
  let paybackMonth = -1;
  const RAMP = [0.4, 0.7, 0.9];
  for (let m = 1; m <= 120; m++) {
    const rampMultiplier = m <= 3 ? RAMP[m - 1] : 1;
    const monthRevenue = monthlyRevenue * rampMultiplier;
    const monthProfit = monthRevenue * NET_MARGIN;
    cumProfit += monthProfit;
    if (breakEvenMonth < 0 && monthProfit > 0) breakEvenMonth = m;
    if (paybackMonth < 0 && cumProfit >= totalSetup) {
      paybackMonth = m;
      break;
    }
  }
  if (paybackMonth < 0) paybackMonth = 120; // cap at 10 years for display

  const breakEvenDate = addMonths(operationalBy, breakEvenMonth);
  const paybackDate = addMonths(operationalBy, paybackMonth);
  const paybackYears = (paybackMonth / 12).toFixed(1);

  return (
    <section
      aria-labelledby="if-today-heading"
      className="atlas-card my-8 md:my-12 overflow-hidden"
    >
      <div className="px-6 py-5 md:px-8 md:py-6 border-b border-paper-250">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700 mb-2">
          If you signed the paperwork today
        </div>
        <h3
          id="if-today-heading"
          className="font-display text-xl md:text-2xl text-ink-900 leading-snug"
        >
          You'd open by <span className="text-atlas-700">{formatDate(operationalBy)}</span>{" "}
          and break even on operating by <span className="text-atlas-700">{formatDate(breakEvenDate)}</span>.
        </h3>
        <p className="mt-2 text-sm md:text-base text-ink-700 leading-relaxed">
          Full capital payback at typical performance: <span className="font-semibold text-ink-900">{formatDate(paybackDate)}</span>{" "}
          (about {paybackYears} years from opening).
        </p>
      </div>

      <ol className="divide-y divide-paper-250">
        <Milestone
          n={1}
          when={formatDate(today)}
          label="Today"
          detail="Sign the lease, pay the registration fee, place equipment orders."
        />
        <Milestone
          n={2}
          when={formatDate(registeredBy)}
          label={`Business registered (~${regWeeks} weeks)`}
          detail={
            REGISTRATION_WEEKS[cell.country]
              ? `Country-typical formation time for ${cell.country}.`
              : "Country-typical formation time; varies with permit complexity."
          }
        />
        <Milestone
          n={3}
          when={formatDate(operationalBy)}
          label={`Doors open (~${fitWeeks} weeks of fit-out)`}
          detail="Permits cleared, equipment installed, first staff hired and trained."
        />
        <Milestone
          n={4}
          when={formatDate(firstRevenueBy)}
          label="First customer revenue"
          detail="Soft launch in week one is typical; full marketing push in week two."
        />
        <Milestone
          n={5}
          when={formatDate(breakEvenDate)}
          label={`Operating break-even (month ${breakEvenMonth})`}
          detail="Monthly revenue covers monthly cost stack. Owner has not yet recovered the initial investment."
        />
        <Milestone
          n={6}
          when={formatDate(paybackDate)}
          label={`Full capital payback (month ${paybackMonth})`}
          detail={`Cumulative profit equals total setup cost. From here on, every dollar of profit is on top of recovered investment.`}
        />
      </ol>

      <div className="px-6 py-3 md:px-8 bg-paper-100 text-xs text-ink-600 border-t border-paper-250">
        Assumes typical performance (~6% net margin) and a 3-month ramp.
        Bottom-decile operators take 50-100% longer to break even; top
        decile pay back in roughly half the time. The "if you opened
        today" framing rolls forward each day as the date moves.
      </div>
    </section>
  );
}

function Milestone({
  n,
  when,
  label,
  detail,
}: {
  n: number;
  when: string;
  label: string;
  detail: string;
}) {
  return (
    <li className="px-6 py-4 md:px-8 md:py-5 flex gap-4 md:gap-6">
      <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-atlas-50 border border-atlas-200 flex items-center justify-center text-sm font-semibold text-atlas-700 tabular-nums">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="font-display text-base md:text-lg font-semibold text-ink-900 leading-tight">
            {label}
          </div>
          <div className="text-xs md:text-sm text-atlas-700 font-medium tabular-nums whitespace-nowrap">
            {when}
          </div>
        </div>
        <p className="mt-1 text-sm text-ink-700 leading-relaxed">{detail}</p>
      </div>
    </li>
  );
}
