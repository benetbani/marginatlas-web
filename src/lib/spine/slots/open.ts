/**
 * src/lib/spine/slots/open.ts , STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D; spec sections 2 and 3; R5 section 5, slot 6):
 * "What does opening take?" One slot, "Forms, fees and days": the bill to register at 30 (the shard's own figure, stamped, so it reads as
 * its own fact beside the table's government fee), the legal forms table under it (one unit a column), the days until trading as a row
 * where the shard's total stands and no step's wait is unsourced. Behind the plus, each list of one type: the steps in days under a label
 * from a closed list (the shard's own words as each row's note, his law of 2026-09-20: "labels and categories, defined once"), how each step
 * goes, each step's cost where more than one step costs money (where one does, the bill's words say the rest are free), the licences'
 * waits by trade, and the UK's walls from abroad: their state, their costs, their waits. The steps draw where the legal forms table does,
 * as the bill's card drew them before. Thin: the bill or the table alone; with neither the slot omits.
 */
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { buildEntryBill, ENTRY_BILL_METRICS } from "@/lib/spine/entry_bill_rows";
import { buildHowToSteps } from "@/lib/spine/howto_steps_rows";
import { buildCountryLicences } from "@/lib/spine/country_licences_rows";
import { buildSetupRows, howToOpenDoor, type SetupRow } from "@/lib/spine/setup_rows";
import { buildFromAbroad } from "@/lib/spine/sections/from_abroad";
import { latestChange } from "@/lib/spine/sections/country_rules";
import { list, present, type SlotLead, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
/** The calendar's average month in days, the figure `monthsOfDays` in sections/if_it_fails.ts divides by. */
const DAYS_A_MONTH = 365.25 / 12;

/** A duration as whole days, for a list whose head says "in days": days as they are, weeks times seven, months at the calendar's average
 *  month, a range end by end; null where the text holds no duration of that shape ("Start immediately", a dash). */
export function inDays(text: string | null | undefined): string | null {
  const v = (text ?? "").replace(/[\s ]+/g, " ").trim().toLowerCase();
  const m = v.match(/^(\d+(?:\.\d+)?)(?: to (\d+(?:\.\d+)?))? (days?|weeks?|months?)$/);
  if (!m) return null;
  const per = m[3].startsWith("day") ? 1 : m[3].startsWith("week") ? 7 : DAYS_A_MONTH;
  const a = Math.round(Number(m[1]) * per);
  return m[2] ? `${a} to ${Math.round(Number(m[2]) * per)}` : String(a);
}

/** A step's label from the closed list (COPY.journey.stepLabels), by the words its shard's name holds, read in this order so a name that
 *  holds two (a bank account confirmed to the tax office) takes the more particular. */
const STEP_WORDS: ReadonlyArray<readonly [keyof typeof COPY.journey.stepLabels, RegExp]> = [
  ["name", /\bname\b/i],
  ["bank", /\bbank/i],
  ["tax", /\btax/i],
  ["vat", /\bvat\b|\bgst\b|\bsales tax\b/i],
  ["social", /\bsocial\b|\bpension|\binsurance\b|\bsecurity\b/i],
  ["licence", /\blicen[cs]|\bpermit\b|\btrade office\b/i],
  ["notary", /\bnotar/i],
  ["seal", /\bseal\b|\bstamp\b/i],
  ["register", /\bregist|\bincorporat/i],
];
export function stepLabel(name: string): string {
  for (const [key, re] of STEP_WORDS) if (re.test(name)) return J.stepLabels[key];
  return J.stepLabels.other;
}

/** Labels made distinct: the second of a label takes " 2", the third " 3". */
export function uniqueLabels(labels: string[]): string[] {
  const seen = new Map<string, number>();
  return labels.map((l) => {
    const n = (seen.get(l) ?? 0) + 1;
    seen.set(l, n);
    return n === 1 ? l : `${l} ${n}`;
  });
}

export type OpenDrawing = { setup: SetupRow[]; howTo: { href: string; label: string } | null };

export function buildOpenSlot(iso2In: string, today: string): SlotModel<OpenDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const bill = buildEntryBill(iso2);
  const setup = buildSetupRows(iso2);
  const steps = setup.length > 0 ? buildHowToSteps(iso2) : null;
  const all = steps?.steps ?? [];
  const isFree = (c: string | null) => !!c && /^\$0(\.0+)?$/.test(c.trim());
  const paid = all.filter((s) => s.cost && !isFree(s.cost));
  const free = all.filter((s) => isFree(s.cost));
  /* WHERE ONE STEP IS THE ONLY ONE THAT COSTS MONEY the bill is that fee, and its words say the other steps are free (2026-09-25, QUEUE
     country:register-fee-three-prints), with the law's pound fee where the change file holds it (the design review of 2026-10-04). */
  const oneFee = !!bill?.figure && paid.length === 1 && paid[0].cost === bill.figure && free.length > 0;
  const localFee = oneFee ? latestChange(iso2, "incorporation-fee", today)?.from ?? null : null;
  const E = COPY.entryBill;
  const words = oneFee ? (localFee ? E.focalWordsLocalFee.replace("{fee}", localFee).replace("{n}", String(free.length)) : E.focalWordsOneFee.replace("{n}", String(free.length))) : E.focalWords;
  const printed = bill?.verdict.bill.state === "printed" ? bill.verdict.bill : null;
  const lead: SlotLead | null = bill?.figure && printed ? { figure: bill.figure, words, prov: { src: `facts/country/${iso2}.json:${ENTRY_BILL_METRICS.bill}`, kind: printed.tag === "held" ? "looked up" : "estimate" } } : null;
  if (!lead && setup.length === 0) return null;

  /* THE DAYS UNTIL TRADING, a row: the shard's total where the guard prints it, never where a step's wait has no source (the UK's bank
     account, howto_steps_rows.ts UNSOURCED_WAITS, takes the total with it). */
  const days = bill?.figures.days ?? null;
  const tradingRows: SlotRow[] = days != null && !(steps && steps.totalDays == null) ? [{ key: "trading", label: J.openRows.trading, value: String(Math.round(days)), note: E.basisDays }] : [];

  const labels = uniqueLabels(all.map((s) => stepLabel(s.name)));
  const stepRows: SlotRow[] = all.map((s, i) => ({ key: s.key, label: labels[i], value: inDays(s.days) ?? "–", note: s.name }));
  const howRows: SlotRow[] = all.flatMap((s, i) => (s.how ? [{ key: s.key, label: labels[i], value: s.how }] : []));
  const costRows: SlotRow[] = oneFee ? [] : all.flatMap((s, i) => (s.cost ? [{ key: s.key, label: labels[i], value: s.cost }] : []));
  const licenceRows: SlotRow[] = (setup.length > 0 ? buildCountryLicences(iso2) ?? [] : []).flatMap((r, i) => {
    const d = inDays(r.value);
    return d != null ? [{ key: `licence-${i}`, label: r.label, value: d, note: r.note ?? null }] : [];
  });

  /* THE UK'S WALLS FROM ABROAD (sections/from_abroad.ts), three lists: each wall's state; what the route and the walls cost (a law's own
     fee in its pounds, a summed cost in dollars); the waits in days. A stay's length is no wait, so the Youth Mobility scheme's months
     stand in its cost's note. */
  const abroad = iso2 === "GB" ? buildFromAbroad() : null;
  const A = J.abroad;
  const abroadState: SlotRow[] = (abroad?.walls ?? []).map((w) => ({ key: w.key, label: w.label, value: COPY.fromAbroad.state[w.state], note: w.note, prov: w.prov }));
  const abroadCosts: SlotRow[] = abroad && abroad.focal.usd != null
    ? [
        { key: "founder", label: A.founder, value: usd(abroad.focal.usd), note: A.founderNote.replace("{years}", String(abroad.focal.years)), prov: abroad.focal.prov },
        ...abroad.walls.flatMap((w): SlotRow[] => (w.usd != null ? [{ key: w.key, label: w.label, value: usd(w.usd), note: w.time ? A.forTime.replace("{time}", w.time) : w.note, prov: w.prov }] : w.fee ? [{ key: w.key, label: w.label, value: w.fee, note: w.note, prov: w.prov }] : [])),
      ]
    : [];
  const abroadWaits: SlotRow[] = abroad
    ? [
        { key: "decision", label: A.decision, value: String(abroad.focal.weeks * 7), note: A.decisionNote, prov: abroad.focal.prov },
        ...abroad.walls.flatMap((w): SlotRow[] => {
          const d = w.usd == null ? inDays(w.time) : null;
          return d != null ? [{ key: w.key, label: w.label, value: d, note: w.note, prov: w.prov }] : [];
        }),
      ]
    : [];

  const M = J.more;
  return {
    id: "open",
    lead,
    /* The slot's own rows have no floor (list() is the plus's, two to eight), so the one row is its list. */
    rows: tradingRows.length > 0 ? { key: "trading", head: J.openRows.trading, type: "time", rows: tradingRows } : null,
    more: present([
      list("steps", M.steps, "time", stepRows),
      list("how", M.stepsHow, "state", howRows),
      list("costs", M.stepCosts, "money", costRows),
      list("licences", M.licenceWaits, "time", licenceRows),
      list("abroad", M.abroad, "state", abroadState),
      list("abroad-costs", M.abroadCosts, "money", abroadCosts),
      list("abroad-waits", M.abroadWaits, "time", abroadWaits),
    ]),
    drawing: { setup, howTo: setup.length > 0 ? howToOpenDoor(iso2) : null },
    thin: setup.length === 0 || !lead,
    gloss: setup.length > 0 ? COPY.glossary.legalForm : null,
  };
}
