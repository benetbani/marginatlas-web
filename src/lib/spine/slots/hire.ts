/**
 * src/lib/spine/slots/hire.ts , STAGE 4, TO RUN, SLOT 7: WHAT A HIRE COSTS (plan 2026-10-13 country-page-journey, Task 3E; spec sections 2 and
 * 3; R5 section 5, slot 7): "What does one employee cost a year?" MONEY a year. The wage floor's full-time year at 30 (the staff card's one
 * figure since milestone 1, M3); the UK's money rules as rows (the hourly floor, the allowance, the enrolment trigger, the locals' note no
 * other slot prints, Reading 12); behind the plus, each list of one type: what the employer adds, the rules of employing (a time each, its
 * unit in its label), statutory pay a week, how hiring goes (the shard's four words, "Hiring staff" off the board), an hour all in and the
 * job market. The hire's lever stands under the rows (Q2, answer A). Where the employer's share would stand alone it rides the lead's words
 * (Reading 15). Thin: the floor and the share. With no floor the slot omits.
 */
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { buildPayBars, type PayBarsData } from "@/lib/spine/pay_rows";
import { getCountryRates } from "@/lib/tax/country_rates";
import { buildCountryEmployment } from "@/lib/spine/country_depth_rows";
import { buildHireAllIn } from "@/lib/spine/sections/hire_all_in";
import { buildJobMarket } from "@/lib/spine/sections/market_jobs";
import { lawValue, ruleNote, ruleRaw, ruleRow, type LawValue } from "@/lib/spine/sections/country_rules";
import { queryFacts } from "@/lib/facts/store";
import { loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import { datedRow, monthsOf } from "./dated";
import { list, present, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
const bare = (v: LawValue) => lawValue(v, true);
const count = (v: LawValue | null, unit: "weeks" | "hours" | "days"): string | null => (v && typeof v[unit] === "number" ? String(v[unit]) : null);
/** A file note that dates its rule ("since 1 Apr 2026") goes stale with the next change; the ledger dates the row instead. */
const undated = (note: string | null | undefined): string | null => (note && !/\b(since|from) \d{1,2} [A-Z][a-z]{2} \d{4}\b/.test(note) ? note : null);
/** A rule row whose value and note the ledger dates on `today`; the file's own note stands where it says no date. */
function datedRule(iso2: string, key: string, change: string, today: string, label?: string): SlotRow | null {
  const base = ruleRow(iso2, "employing", key, { bare: true, label });
  if (!base) return null;
  const d = datedRow(iso2, change, today, bare);
  return { ...base, value: d?.value ?? base.value, note: d?.note ?? undated(base.note), change: d?.change ?? null };
}

/** The shard's four words on hiring (Reading 14), each a state from a closed list. */
export const HIRING_METRICS = { hire: "people_pay.hiring.hire_ease", contracts: "people_pay.hiring.contract_ease", fire: "people_pay.hiring.fire_ease", depth: "people_pay.hiring.recruiting_depth" } as const;

export function hiringStates(iso2: string): SlotRow[] {
  const code = countryEntityId(iso2);
  if (!code || !loadCountryShard(code)) return [];
  return (Object.keys(HIRING_METRICS) as Array<keyof typeof HIRING_METRICS>).flatMap((k) => {
    const f = queryFacts({ entityId: code, metrics: [HIRING_METRICS[k]], rowKey: "" })[0];
    const word = f && f.tag !== "placeholder" && typeof f.value === "string" ? J.hiringWords[f.value.trim().toLowerCase()] : undefined;
    return word ? [{ key: k, label: J.hiringRows[k], value: word }] : [];
  });
}

export type HireDrawing = { iso2: string; pay: PayBarsData | null; rate: number | null };

export function buildHireSlot(iso2In: string, today: string): SlotModel<HireDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const pay = buildPayBars(iso2);
  const floor = pay && !pay.withheld ? pay.rows.find((r) => r.key === "minimum" && r.value > 0) ?? null : null;
  if (!floor) return null;
  const social = getCountryRates(iso2).employerSocial;
  const share = typeof social === "number" && social > 0 ? Math.round(social * 1000) / 10 : null;
  const H = J.hire;
  const E = J.employ;

  /* WHAT THE EMPLOYER ADDS: the employer's rate (the law's, dated, where the ledger holds it), then the pension minimums. */
  /* The law's rate on pay over a threshold ("15% over £5,000") is a share and a sum: the share is the row's value, the threshold its note,
     so the list stays one type (the answer-type gate read "£" first and called the row money). */
  const pctOnly = (v: LawValue) => (typeof v.pct === "number" ? `${v.pct}%` : null);
  const ni = datedRow(iso2, "employer-ni", today, pctOnly);
  const niOver = ruleRaw(iso2, "employing", "employer-ni-threshold")?.gbp;
  const niThreshold = typeof niOver === "number" ? H.over.replace("{amount}", lawValue({ gbp: niOver }) as string) : null;
  const employer: SlotRow | null = ni ? { key: "employer", label: H.employer, value: ni.value, note: [niThreshold, ni.note ?? (niThreshold ? null : undated(ruleNote(iso2, "employing", "employer-ni")))].filter(Boolean).join(", ") || null, change: ni.change } : share != null ? { key: "employer", label: H.employer, value: `${share}%`, note: COPY.pay.employerShare } : null;
  const adds: SlotRow[] = present([employer, ruleRow(iso2, "employing", "pension-employer"), ruleRow(iso2, "employing", "pension-total")]);
  const addsList = list("adds", J.more.adds, "share", adds);

  /* THE UK'S MONEY RULES: the hourly floor and the allowance, each dated, and the enrolment trigger (the locals' second note). */
  const money: SlotRow[] = present([datedRule(iso2, "minimum-wage-21", "minimum-wage-21", today, H.hourly), datedRule(iso2, "employment-allowance", "employment-allowance", today), ruleRow(iso2, "employing", "pension-trigger", { bare: true })]);

  /* THE RULES OF EMPLOYING: a time each, its unit in its label, the dismissal period dated. */
  const employment = buildCountryEmployment(iso2);
  const raw = (key: string) => ruleRaw(iso2, "employing", key);
  const dismissal = datedRow(iso2, "unfair-dismissal-period", today, monthsOf);
  const dismissalOwn = raw("unfair-dismissal");
  const bankDays = ruleRaw(iso2, "holidays", "england-wales");
  const holidayYear = (ruleNote(iso2, "holidays", "england-wales") ?? "").match(/20\d\d/)?.[0] ?? null;
  const employing: SlotRow[] = present([
    employment?.leaveDays != null ? { key: "holiday", label: E.holiday, value: String(employment.leaveDays), note: COPY.employment.notes.leave } : null,
    count(raw("longest-week"), "hours") ? { key: "week", label: E.week, value: count(raw("longest-week"), "hours") as string, note: COPY.employment.notes.week } : null,
    dismissal ? { key: "dismissal", label: E.dismissal, value: dismissal.value, note: dismissal.note ?? COPY.employment.notes.dismissal, change: dismissal.change } : dismissalOwn && monthsOf(dismissalOwn) ? { key: "dismissal", label: E.dismissal, value: monthsOf(dismissalOwn) as string, note: COPY.employment.notes.dismissal } : null,
    count(raw("maternity-pay-length"), "weeks") ? { key: "maternity", label: E.maternity, value: count(raw("maternity-pay-length"), "weeks") as string, note: COPY.employment.notes.maternity } : null,
    count(raw("notice-2-to-12-years"), "weeks") ? { key: "notice", label: E.notice, value: count(raw("notice-2-to-12-years"), "weeks") as string, note: COPY.rulesRows.noticeNote } : null,
    count(raw("sick-pay-length"), "weeks") ? { key: "sick", label: E.sick, value: count(raw("sick-pay-length"), "weeks") as string, note: COPY.rulesRows.sickNote } : null,
    count(bankDays, "days") && holidayYear ? { key: "bank-holidays", label: E.bankHolidays, value: count(bankDays, "days") as string, note: COPY.rulesRows.holidaysNote.replace("{year}", holidayYear) } : null,
  ]);

  /* STATUTORY PAY A WEEK, each dated. */
  const statutory: SlotRow[] = present([datedRule(iso2, "sick-pay", "sick-pay-rate", today), datedRule(iso2, "maternity-pay-weekly", "maternity-pay-rate", today)]);

  /* AN HOUR, ALL IN: the law engine's worked hour, the parting bills and the law's two amounts printed nowhere else (the UK's alone). */
  const allIn = iso2 === "GB" ? buildHireAllIn({ allowance: true }) : null;
  const hour: SlotRow[] = allIn && allIn.perWorkedHour.usd != null
    ? [
        { key: "hour", label: H.hour, value: usd(allIn.perWorkedHour.usd), note: COPY.hireAllIn.words, prov: allIn.perWorkedHour.prov },
        ...allIn.parting.flatMap((p): SlotRow[] => (p.usd != null ? [{ key: `parting-${p.years}`, label: COPY.hireAllIn.parting[p.years], value: usd(p.usd), note: p.redundancy > 0 ? COPY.hireAllIn.partingNote : COPY.hireAllIn.partingNoteNotice, prov: p.prov }] : [])),
        ...allIn.extras.map((x): SlotRow => ({ key: x.key, label: x.label, value: String(x.value), note: x.note ?? null, prov: x.prov ?? null })),
      ]
    : [];

  /* THE JOB MARKET: the rates, then the trade's vacancies per hundred jobs and its payroll a year on. */
  const jm = buildJobMarket(iso2);
  const jobs: SlotRow[] = jm
    ? [
        ...jm.rates.map((r): SlotRow => ({ key: r.key, label: r.label, value: `${r.pct}%`, note: COPY.jobMarket.focalWords })),
        ...(jm.sector ? [{ key: "vacancies", label: H.vacancies, value: String(jm.sector.vacancies), note: jm.sector.label }, { key: "payroll", label: H.payroll, value: `${jm.sector.payrollChange}%`, note: COPY.jobMarket.payroll }] : []),
      ]
    : [];

  return {
    id: "hire",
    lead: { figure: usd(floor.value), words: !addsList && share != null ? H.leadShare.replace("{share}", `${share}%`) : COPY.pay.focalWords },
    rows: money.length > 0 ? { key: "money", head: J.slots.hire.heading, type: "money", rows: money } : null,
    more: present([
      addsList,
      list("employing", J.more.employing, "time", employing),
      list("statutory", J.more.statutory, "money", statutory),
      list("hiring", J.more.hiring, "state", hiringStates(iso2)),
      list("hour", J.more.hour, "money", hour),
      list("jobs", J.more.jobs, "share", jobs),
    ]),
    drawing: { iso2, pay, rate: share },
    thin: money.length === 0,
  };
}
