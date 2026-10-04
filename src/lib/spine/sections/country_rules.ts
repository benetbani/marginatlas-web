/**
 * THE COUNTRY'S RULES, DATED CHANGES AND PAYMENTS, AS THE PAGE PRINTS THEM (2026-10-04, the UK page reform; his words that day:
 * "there are not so many details about the country ... the sections ... feel not very backed up ... there has to be some context
 * below, some hot stuff, some gold nuggets ... but we should avoid making each section with a line of sentences below").
 * Page-agnostic, keyed by country; the United Kingdom is the one country the files hold today.
 *
 * THE FILES (research R6, every row read on its primary page and stamped with the day it was checked):
 *  - data/sections/changes.json: dated changes to the rules a small firm lives under, in force or enacted with a date, each a
 *    value before and a value from, in the law's own currency and units;
 *  - data/sections/rules.json: the standing rules behind the page's figures, grouped by topic (filings, employing, paying,
 *    insurance, holidays, premises, closing);
 *  - data/sections/payments.json: how people pay (a payments body's figures and a retail survey's) and what card readers charge.
 *
 * THE LAW, inside this module: a figure prints in the law's own currency and unit (research R4, pattern P19: "£100" is the number
 * on the fee schedule and reads as checked, a converted dollar figure as computed); a value the copy cannot say (a unit this module
 * does not know) is not printed; nothing is compared, ranked or concluded, so every row is a label and an absolute (PART 9 clauses
 * 12 and 15). Texts stand only where the law holds no figure ("required").
 */
import changesJson from "../../../../data/sections/changes.json";
import rulesJson from "../../../../data/sections/rules.json";
import paymentsJson from "../../../../data/sections/payments.json";
import type { AtlasIconId } from "@/components/brand/icons";
import type { ChangeRow } from "@/components/spine/archetypes/DatedChanges";
import type { FactRow } from "@/components/spine/archetypes/FactRows";

/** One figure as the files hold it (changes.json and rules.json `_about`). */
export type LawValue = {
  gbp?: number;
  pct?: number;
  pence?: number;
  days?: number;
  months?: number;
  years?: number;
  weeks?: number;
  hours?: number;
  day?: number;
  text?: string;
  per?: "hour" | "week" | "day" | "year" | string;
  over_gbp?: number;
  above?: "bank_rate" | string;
};

type FileChange = { key: string; item: string; date: string; before: LawValue; from: LawValue; note?: string; status: "in_force" | "enacted"; url: string; checked: string };
type FileRule = { key: string; label: string; value: LawValue; note?: string; url: string; checked: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const PER: Record<string, string> = { hour: "an hour", week: "a week", day: "a day", year: "a year" };

/** "£12.71", "£90,000", "£5 million": the pound figure as the law prints it. */
function gbp(v: number): string {
  if (v >= 1_000_000 && v % 1_000_000 === 0) return `£${v / 1_000_000} million`;
  return Number.isInteger(v) ? `£${v.toLocaleString("en-GB")}` : `£${v.toFixed(2)}`;
}

/** A dated value in words and figures, or null where the unit is one this module cannot say. `bare` drops the period ("an hour")
 *  for the left side of a change, which says it once on the right. */
export function lawValue(v: LawValue, bare = false): string | null {
  const per = v.per && !bare ? PER[v.per] ?? null : null;
  const over = typeof v.over_gbp === "number" ? ` over ${gbp(v.over_gbp)}` : "";
  let core: string | null = null;
  if (typeof v.gbp === "number") core = gbp(v.gbp);
  else if (typeof v.pct === "number") core = v.above === "bank_rate" ? `${v.pct}% over Bank Rate` : `${v.pct}%`;
  else if (typeof v.pence === "number") core = `${v.pence}p`;
  else if (typeof v.months === "number") core = typeof v.days === "number" ? `${plural(v.months, "month", "months")}, ${plural(v.days, "day", "days")}` : plural(v.months, "month", "months");
  else if (typeof v.days === "number") core = plural(v.days, "day", "days");
  else if (typeof v.years === "number") core = plural(v.years, "year", "years");
  else if (typeof v.weeks === "number") core = plural(v.weeks, "week", "weeks");
  else if (typeof v.hours === "number") core = plural(v.hours, "hour", "hours");
  else if (typeof v.day === "number") core = `day ${v.day}`;
  else if (typeof v.text === "string" && v.text.trim()) {
    /* "required over £50,000" says "over £50,000" once the item says what is required (the digital records rows). */
    if (over && /^required$/i.test(v.text.trim())) return over.trim();
    core = v.text.trim();
  }
  if (core == null) return null;
  return `${core}${over}${per ? ` ${per}` : ""}`;
}

/** "1 Feb 2026" from "2026-02-01", its spaces unbreakable: a date never splits over two lines ("from 1 / Apr 2026"). */
export function dateText(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return `${Number(m[3])}\u00a0${MONTHS[Number(m[2]) - 1]}\u00a0${m[1]}`;
}

function countryBlock<T>(file: unknown, iso2: string): T | null {
  const c = (file as Record<string, unknown>)[iso2.toUpperCase()];
  return c && typeof c === "object" ? (c as T) : null;
}

/**
 * THE CHANGES, IN TWO RUNS. COMING: every change enacted with a date after `today`, soonest first. IN FORCE: the changes in force,
 * the `lead` keys and every change of the last `recentDays` first, newest first (the ones a person opening a small business meets
 * first, and the news), then the rest newest first, which the card shows behind its plus; `inForceLead` counts the lead rows. A row
 * whose two values the module cannot say is left out, never half printed.
 */
export function buildRuleChanges(iso2: string, today: string, lead: string[] = [], recentDays = 120): { coming: ChangeRow[]; inForce: ChangeRow[]; inForceLead: number } | null {
  const c = countryBlock<{ changes?: FileChange[] }>(changesJson, iso2);
  if (!c || !Array.isArray(c.changes)) return null;
  const row = (x: FileChange): ChangeRow | null => {
    const d = dateText(x.date);
    const before = lawValue(x.before, !!x.from.per && x.from.per === x.before.per);
    const from = lawValue(x.from);
    if (!d || !before || !from) return null;
    return { key: `${x.key}-${x.date}`, item: x.item, dateText: d, iso: x.date, before, from };
  };
  /* A RATE THAT CHANGED WITH ITS THRESHOLD IS TWO ROWS (employer National Insurance: 13.8% above £9,100 to 15% above £5,000): one
     line held both and ran past a half column, so the rate and the threshold each take a row, the threshold's item said once. */
  const rows = (x: FileChange): ChangeRow[] => {
    const b = x.before, f = x.from;
    if (typeof b.pct === "number" && typeof f.pct === "number" && typeof b.over_gbp === "number" && typeof f.over_gbp === "number") {
      const d = dateText(x.date);
      if (!d) return [];
      return [
        { key: `${x.key}-${x.date}-rate`, item: x.item, dateText: d, iso: x.date, before: `${b.pct}%`, from: `${f.pct}%` },
        { key: `${x.key}-${x.date}-threshold`, item: `${x.item} threshold`, dateText: d, iso: x.date, before: lawValue({ gbp: b.over_gbp })!, from: lawValue({ gbp: f.over_gbp })! },
      ];
    }
    const one = row(x);
    return one ? [one] : [];
  };
  const coming = c.changes
    .filter((x) => x.date > today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap(rows);
  const inForceAll = c.changes.filter((x) => x.date <= today);
  /* THE NEWEST CHANGE NEVER WAITS BEHIND THE PLUS (2026-10-04): under "Recent rule changes" the first date read is taken for the
     latest, and the tribunal's time limit (in force 1 October 2026) stood behind the plus under April's rows. */
  const t = Date.parse(`${today}T00:00:00Z`);
  const since = Number.isFinite(t) ? new Date(t - recentDays * 86400000).toISOString().slice(0, 10) : today;
  const isLead = (x: FileChange) => lead.includes(x.key) || x.date > since;
  const leads = inForceAll.filter(isLead).sort((a, b) => b.date.localeCompare(a.date));
  const rest = inForceAll.filter((x) => !isLead(x)).sort((a, b) => b.date.localeCompare(a.date));
  const leadRows = leads.flatMap(rows);
  return { coming, inForce: [...leadRows, ...rest.flatMap(rows)], inForceLead: leadRows.length };
}

/** The latest change of one item key already in force on `today` (its date and its `from` value): a row whose value the law has
 *  since changed prints the new value (the qualifying period for unfair dismissal reads "6 months" from 1 January 2027 without a
 *  deploy, as the page regenerates daily). */
export function latestChange(iso2: string, key: string, today: string): { dateText: string; from: string } | null {
  const c = countryBlock<{ changes?: FileChange[] }>(changesJson, iso2);
  const hit = (c?.changes ?? []).filter((x) => x.key === key && x.date <= today).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!hit) return null;
  const d = dateText(hit.date);
  const from = lawValue(hit.from);
  return d && from ? { dateText: d, from } : null;
}

/** The newest dated change for one item key (its `from` date and value), for a row's note ("6 months from 1 Jan 2027"). */
export function nextChange(iso2: string, key: string, today: string): { dateText: string; from: string } | null {
  const c = countryBlock<{ changes?: FileChange[] }>(changesJson, iso2);
  const hit = (c?.changes ?? []).filter((x) => x.key === key && x.date > today).sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!hit) return null;
  const d = dateText(hit.date);
  const from = lawValue(hit.from);
  return d && from ? { dateText: d, from } : null;
}

/**
 * THE RULES OF ONE TOPIC AS FACT ROWS, in the order `keys` names them: each the file's own label (three words or fewer), the value
 * in the law's unit, the file's note (eight words or fewer), a glyph. A key the file does not hold, or a value it cannot say, is
 * left out; under `min` rows the topic draws nothing.
 */
export function ruleRows(iso2: string, topic: string, keys: Array<{ key: string; icon: AtlasIconId; label?: string; note?: string | null }>, min = 2): FactRow[] | null {
  const c = countryBlock<Record<string, unknown>>(rulesJson, iso2);
  const list = c && Array.isArray(c[topic]) ? (c[topic] as FileRule[]) : null;
  if (!list) return null;
  const rows: FactRow[] = [];
  for (const k of keys) {
    const r = list.find((x) => x.key === k.key);
    if (!r) continue;
    const value = lawValue(r.value);
    if (!value) continue;
    rows.push({ key: r.key, icon: k.icon, label: k.label ?? r.label, value, note: k.note === undefined ? r.note ?? null : k.note });
  }
  return rows.length >= min ? rows : null;
}

/** One rule's value as printed, or null. */
/** One rule's value as the file holds it (its amount in pounds, its percent), for arithmetic; null where the file holds none. */
export function ruleAmount(iso2: string, topic: string, key: string): { gbp?: number; pct?: number } | null {
  const c = countryBlock<Record<string, unknown>>(rulesJson, iso2);
  const list = c && Array.isArray(c[topic]) ? (c[topic] as FileRule[]) : null;
  const r = list?.find((x) => x.key === key);
  return r && r.value && typeof r.value === "object" ? { gbp: typeof r.value.gbp === "number" ? r.value.gbp : undefined, pct: typeof r.value.pct === "number" ? r.value.pct : undefined } : null;
}

/** One rule's note as the file holds it, or null. */
export function ruleNote(iso2: string, topic: string, key: string): string | null {
  const c = countryBlock<Record<string, unknown>>(rulesJson, iso2);
  const list = c && Array.isArray(c[topic]) ? (c[topic] as FileRule[]) : null;
  const r = list?.find((x) => x.key === key);
  return r && typeof r.note === "string" ? r.note : null;
}

export function ruleValue(iso2: string, topic: string, key: string): string | null {
  const c = countryBlock<Record<string, unknown>>(rulesJson, iso2);
  const list = c && Array.isArray(c[topic]) ? (c[topic] as FileRule[]) : null;
  const r = list?.find((x) => x.key === key);
  return r ? lawValue(r.value) : null;
}

type FileMethod = { key: string; name: string; pct?: number };
type FileReader = { key: string; name: string; plan?: string; fee?: { pct?: number }; monthly?: { gbp?: number }; payout?: { days?: number; text?: string } };
type FilePayments = {
  all_payments?: { period: string; methods?: FileMethod[]; history?: Array<{ key: string; pct_by_year?: Record<string, number> }> };
  retail?: { period: string; methods?: FileMethod[] };
  card_readers?: FileReader[];
};

export type PaymentsCard = {
  /** The free readers' slowest payout in days, and whether one pays out within minutes (payments.json, card_readers). */
  payoutDays: number | null;
  payoutFast: boolean;
  /** How shoppers pay, by number of transactions, the parts summing to 100 (the remainder named "Other"). */
  parts: Array<{ key: string; name: string; share: number }>;
  period: string;
  /** The pay-as-you-go card readers' in-person fees, lowest and highest, in percent of a sale. */
  feeLow: number | null;
  feeHigh: number | null;
  /** Cash's share of all payments, now and the earliest year on file. */
  cash: { now: number; nowYear: string; then: number; thenYear: string } | null;
};

/**
 * HOW CUSTOMERS PAY, FROM THE RETAIL SURVEY (shop transactions by number, the closest held reading of how a small business's
 * customers pay at its till): the methods the survey prints, the remainder named "Other" so the ring adds to its whole; the card
 * readers' pay-as-you-go fees (the plans with no monthly charge); cash across all payments now and on the earliest year the
 * payments body prints. Null where the retail split holds under two methods.
 */
export function buildPayments(iso2: string): PaymentsCard | null {
  const p = countryBlock<FilePayments>(paymentsJson, iso2);
  const methods = (p?.retail?.methods ?? []).filter((m) => typeof m.pct === "number" && (m.pct as number) > 0);
  if (!p || !p.retail || methods.length < 2) return null;
  const NAMES: Record<string, string> = { "debit-card": "Debit card", "credit-card": "Credit card", cash: "Cash" };
  const parts = methods.map((m) => ({ key: m.key, name: NAMES[m.key] ?? m.name, share: m.pct as number }));
  const sum = parts.reduce((a, b) => a + b.share, 0);
  const other = Math.round((100 - sum) * 10) / 10;
  if (other > 0.05) parts.push({ key: "other", name: "Other", share: other });
  const free = (p.card_readers ?? []).filter((r) => typeof r.fee?.pct === "number" && (r.monthly?.gbp ?? 0) === 0).map((r) => r.fee!.pct as number);
  const cashHist = p.all_payments?.history?.find((h) => h.key === "cash")?.pct_by_year ?? null;
  let cash: PaymentsCard["cash"] = null;
  if (cashHist) {
    const years = Object.keys(cashHist).sort();
    if (years.length >= 2) cash = { now: cashHist[years[years.length - 1]], nowYear: years[years.length - 1], then: cashHist[years[0]], thenYear: years[0] };
  }
  /* The free readers' payouts as the file holds them: the slowest in days (the row's value) and whether any pays within minutes. */
  const freeReaders = (p.card_readers ?? []).filter((r) => (r.monthly?.gbp ?? 0) === 0 && r.payout);
  const days = freeReaders.map((r) => r.payout?.days).filter((d): d is number => typeof d === "number" && d > 0);
  const payoutDays = days.length ? Math.max(...days) : null;
  const payoutFast = freeReaders.some((r) => typeof r.payout?.text === "string" && /minute/i.test(r.payout.text));
  return { parts, period: p.retail.period, feeLow: free.length ? Math.min(...free) : null, feeHigh: free.length ? Math.max(...free) : null, cash, payoutDays, payoutFast };
}

/** The countries the rules file holds (two-letter keys), for the archetype sheet's stories. */
export function listRuleCountries(): string[] {
  return Object.keys(rulesJson as Record<string, unknown>).filter((k) => /^[A-Z]{2}$/.test(k));
}
