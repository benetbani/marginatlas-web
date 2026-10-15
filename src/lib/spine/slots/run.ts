/**
 * src/lib/spine/slots/run.ts , STAGE 4, TO RUN, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F; spec sections 2 to 4; R5 section
 * 5): "What does staying open cost?" after the hire (slot 7, slots/hire.ts):
 *   8  RUNNING COSTS (MONEY per unit): electricity at 30, placed among the countries with its signal (the fill never printed, never placed),
 *      diesel a row; behind the plus the UK's premises tax, insurance the law requires, its lease split by type, the peers' electricity.
 *   9  CREDIT AND CARD FEES (SHARE): the lending rate at 30, placed with its signal, on the stage's one world track (the central bank's rate
 *      its reference, a tick); the UK's card, cash and late-payment shares as rows; its loans, payment split and waits behind the plus; the
 *      loan's lever under the rows (Q2, answer A).
 *   10 FILING DEADLINES (TIME): the UK's annual accounts at 30, the other deadlines a time each with its unit in its label, the costs behind
 *      the plus.
 *   11 AGAINST THE PEERS (table): the comparison table, its own Box stamped as the slot.
 * Each returns null where its data is absent (no seat). Rules the changes ledger dates carry its dating (slots/dated.ts).
 */
import { usdCents } from "@/components/spine/kit";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { getCountryProfile } from "@/lib/economic_profile";
import { isElectricityFill } from "@/lib/spine/running_costs_rows";
import { worldRange, worldValues } from "@/lib/spine/world_stats";
import { peerMarks } from "@/lib/spine/peer_marks";
import { placementOf } from "@/lib/spine/placement";
import { signalFor } from "@/lib/spine/signal";
import { buildLeaseByLaw } from "@/lib/spine/sections/lease_by_law";
import { buildPayments, lawValue, ruleRaw, ruleRow, ruleValue, type LawValue } from "@/lib/spine/sections/country_rules";
import { buildCountryFinancing } from "@/lib/spine/country_depth_rows";
import { buildPeerTable, type PeerTable } from "@/lib/spine/peer_rows";
import { datedRow } from "./dated";
import { list, present, type SlotLead, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const bare = (v: LawValue) => lawValue(v, true);
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const profileProv = (iso2: string, field: string) => ({ src: `economic_indicators/country_profile_v2.json:${field}`, kind: getCountryProfile(iso2).tier === "A" ? ("looked up" as const) : ("estimate" as const) });

/** A duration's figure, its unit and the words around them: "14 days' warning" is 14, days and "warning"; null where no duration stands. */
export function durationParts(text: string): { figure: string; unit: "days" | "weeks" | "months" | "years"; rest: string } | null {
  const m = (text || "").replace(/[\s ]+/g, " ").trim().match(/^(.*?)(\d+(?:\.\d+)?(?: to \d+(?:\.\d+)?)?) (days?|weeks?|months?|years?)(?:'s|')?(.*)$/i);
  if (!m) return null;
  const unit = m[3].toLowerCase().replace(/s?$/, "s") as "days" | "weeks" | "months" | "years";
  return { figure: m[2], unit, rest: `${m[1]} ${m[4]}`.replace(/\s+/g, " ").trim() };
}

/** A dated rule's row: the ledger's value and note where it dates the rule, the file's otherwise. */
function dated(base: SlotRow | null, iso2: string, change: string, today: string): SlotRow | null {
  if (!base) return null;
  const d = datedRow(iso2, change, today, bare);
  return d ? { ...base, value: d.value, note: d.note ?? base.note ?? null, change } : base;
}

/* ----- SLOT 8, RUNNING COSTS ----- */
export function buildRunningCostsSlot(iso2In: string, today: string): SlotModel<null> | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  if (profile.iso2.toUpperCase() !== iso2) return null;
  const F = "electricity_usd_per_kwh_commercial";
  const kwh = isPos(profile.electricity_usd_per_kwh_commercial) && !isElectricityFill(profile.electricity_usd_per_kwh_commercial) ? profile.electricity_usd_per_kwh_commercial : null;
  const set = worldValues(F);
  const lead: SlotLead | null = kwh != null ? { figure: usdCents(kwh), words: COPY.ranged.electricityWords, placement: placementOf(kwh, set, "countries"), placed: "electricity", ...signalFor("electricity", kwh, set), prov: profileProv(iso2, F) } : null;
  const diesel = isPos(profile.diesel_usd_per_liter) ? profile.diesel_usd_per_liter : null;
  const rows: SlotRow[] = diesel != null ? [{ key: "diesel", label: J.run.diesel, value: usdCents(diesel), note: COPY.ranged.dieselNote, prov: profileProv(iso2, "diesel_usd_per_liter"), confidence: profile.tier === "A" ? "measured" : "modeled" }] : [];
  if (!lead && rows.length === 0) return null;

  const P = J.premises;
  const premises = present([
    ruleRow(iso2, "premises", "full-relief-limit", { label: P.relief, note: COPY.rulesRows.reliefNote }),
    dated(ruleRow(iso2, "premises", "small-multiplier", { label: P.rates, note: COPY.rulesRows.ratesNote }), iso2, "rates-small-multiplier", today),
    ruleRow(iso2, "premises", "small-retail-multiplier", { label: P.retail, note: COPY.rulesRows.retailNote }),
  ]);
  const insurance = present([
    ruleRow(iso2, "insurance", "employers-liability-cover", { bare: true }),
    ruleRow(iso2, "insurance", "employers-liability-fine", { bare: true }),
    ruleRow(iso2, "insurance", "certificate-fine", { bare: true }),
  ]);

  /* THE UK'S LEASE, BY TYPE (sections/lease_by_law.ts): its rules' states (a figure in a rule that is a state moves to the row's note),
     its terms a time each with its unit in its label (the landlord's least notice first, the card's figure before), its stamp duty. */
  const lease = iso2 === "GB" ? buildLeaseByLaw() : null;
  const L = J.lease;
  /* The lease's fact rows carry their values as text (a fact row's value is a node; this file prints strings). */
  const byKey = new Map((lease?.rows ?? []).map((r) => [r.key, { ...r, value: String(r.value ?? "") }]));
  const leaseState: SlotRow[] = present([
    byKey.get("renewal") ? { key: "renewal", label: byKey.get("renewal")!.label, value: byKey.get("renewal")!.value, note: byKey.get("renewal")!.note ?? null } : null,
    byKey.get("repairs") ? { key: "repairs", label: byKey.get("repairs")!.label, value: byKey.get("repairs")!.value, note: byKey.get("repairs")!.note ?? null } : null,
    byKey.get("vat") ? { key: "vat", label: byKey.get("vat")!.label, value: L.exempt, note: byKey.get("vat")!.value } : null,
    byKey.get("refused") ? { key: "refused", label: byKey.get("refused")!.label, value: L.compensated, note: [byKey.get("refused")!.value, byKey.get("refused")!.note].filter(Boolean).join(", ") } : null,
  ]);
  const TERMS: Array<[string, string, boolean]> = [["signing-away", L.optOut, false], ["asking", L.request, false], ["new-lease", L.newLease, false], ["short", L.short, false], ["registering", L.registered, true]];
  const leaseTerms: SlotRow[] = lease
    ? [
        { key: "notice", label: L.notice, value: String(lease.focal.months), note: L.noticeNote, prov: lease.focal.prov },
        ...TERMS.flatMap(([key, label, dropRest]): SlotRow[] => {
          const r = byKey.get(key);
          const d = r ? durationParts(r.value) : null;
          /* The label carries the unit, so a term the file states in another unit stands nowhere rather than under a wrong label. */
          if (!r || !d || !label.endsWith(d.unit)) return [];
          const note = [dropRest || !d.rest ? null : capFirst(d.rest), r.note ? (dropRest || !d.rest ? r.note : lowFirst(r.note)) : null].filter(Boolean).join(", ");
          return [{ key, label, value: d.figure, note: note || null, prov: r.prov ?? null }];
        }),
      ]
    : [];
  const leaseCosts: SlotRow[] = (lease?.tax ?? []).flatMap((t, i): SlotRow[] => (t.usd == null ? [] : [{ key: `tax-${t.years}`, label: COPY.leaseByLaw.taxLabel[t.years], value: usd(t.usd), note: i > 0 && t.dueDays != null ? COPY.leaseByLaw.taxNoteDue.replace("{days}", String(t.dueDays)) : COPY.leaseByLaw.taxNote, prov: t.prov }]));
  /* THE PEERS' ELECTRICITY (Reading 9): the peers the track marked, as rows without doors (Reading 20: this slot locks, and a locked slot
     keeps no link a free reader would lose). */
  const peers: SlotRow[] = kwh != null ? (peerMarks(iso2, F) ?? []).map((m) => ({ key: m.iso2, label: m.name, value: usdCents(m.value), prov: m.prov })) : [];

  const M = J.more;
  return {
    id: "running-costs",
    lead,
    /* The old card's expression (running_costs_rows.ts): the profile's figures are modelled off tier A. */
    sample: profile.tier !== "A",
    rows: rows.length ? { key: "own", head: J.slots["running-costs"].heading, type: "money", rows } : null,
    more: present([list("premises", M.premises, "money", premises), list("insurance", M.insurance, "money", insurance), list("lease", M.lease, "state", leaseState), list("lease-terms", M.leaseTerms, "time", leaseTerms), list("lease-costs", M.leaseCosts, "money", leaseCosts), list("peers-power", M.peersPower, "money", peers)]),
    drawing: null,
    thin: !lead,
  };
}

/* ----- SLOT 9, CREDIT AND CARD FEES ----- */
export type CreditDrawing = { iso2: string; rate: number; base: { share: number; display: string } | null; loan: { min: number; max: number; rate: number } | null };
export function buildCreditSlot(iso2In: string, today: string): SlotModel<CreditDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  const F = "bank_lending_rate_pct";
  const rate = profile.iso2.toUpperCase() === iso2 && isPos(profile.bank_lending_rate_pct) ? profile.bank_lending_rate_pct : null;
  if (rate == null) return null;
  const set = worldValues(F);
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  const C = J.credit;
  const lead: SlotLead = { figure: pct(rate), words: C.words, placement: placementOf(rate, set, "countries"), placed: "lending-rate", ...signalFor("lending-rate", rate, set), prov: profileProv(iso2, F) };
  /* THE CENTRAL BANK'S RATE, THE TRACK'S REFERENCE (a tick since Task 2), placed only inside the world's range. */
  const fin = buildCountryFinancing(iso2);
  const range = worldRange(F);
  const baseShare = fin?.baseRate != null && fin.baseRate > 0 ? fin.baseRate / 100 : null;
  const base = baseShare != null && range && baseShare >= range.min && baseShare <= range.max ? { share: baseShare, display: String(fin?.cells.find((c) => c.key === "base")?.value ?? `${fin?.baseRate}%`) } : null;

  const pay = buildPayments(iso2);
  const R = COPY.rulesRows.payments;
  const share = (v: number) => `${v}%`;
  const loanRate = fin?.loan ? dated({ key: "loan-rate", label: C.loanRate, value: share(fin.loan.rate), note: null }, iso2, "start-up-loan-rate", today) : null;
  const rows: SlotRow[] = present([
    pay && pay.feeLow != null && pay.feeHigh != null ? { key: "readers", label: R.readers, value: pay.feeLow === pay.feeHigh ? share(pay.feeLow) : `${share(pay.feeLow)} to ${share(pay.feeHigh)}`, note: R.readersNote } : null,
    pay?.cash ? { key: "cash", label: R.cash, value: share(pay.cash.now), note: R.cashNote.replace("{then}", share(pay.cash.then)).replace("{thenYear}", pay.cash.thenYear) } : null,
    ruleRow(iso2, "paying", "statutory-interest"),
    loanRate,
  ]);
  const loans: SlotRow[] = fin?.loan
    ? [
        { key: "loan-least", label: ruleRow(iso2, "financing", "start-up-loan-min")?.label ?? COPY.financing.cells.startup, value: usd(fin.loan.min), note: ruleValue(iso2, "financing", "start-up-loan-min") },
        { key: "loan-most", label: ruleRow(iso2, "financing", "start-up-loan-max")?.label ?? COPY.financing.cells.startup, value: usd(fin.loan.max), note: ruleValue(iso2, "financing", "start-up-loan-max") },
        ...(fin.cells.filter((c) => c.key.startsWith("grant-")).map((c): SlotRow => ({ key: c.key, label: c.label, value: String(c.value), note: c.note ?? null }))),
      ]
    : [];
  const split: SlotRow[] = (pay?.parts ?? []).map((p, i) => ({ key: p.key, label: p.name, value: share(p.share), note: i === 0 ? R.basis.replace("{period}", pay!.period) : null }));
  const raw = (key: string) => ruleRaw(iso2, "paying", key);
  const lands: SlotRow[] = present([
    pay?.payoutDays != null ? { key: "payouts", label: C.payouts, value: String(pay.payoutDays), note: pay.payoutFast ? R.payoutNote : null } : null,
    typeof raw("default-payment-period")?.days === "number" ? { key: "terms", label: C.terms, value: String(raw("default-payment-period")!.days), note: ruleRow(iso2, "paying", "default-payment-period")?.note ?? null } : null,
    typeof raw("agreed-period-business")?.days === "number" ? { key: "agreed", label: C.agreed, value: String(raw("agreed-period-business")!.days), note: ruleRow(iso2, "paying", "agreed-period-business")?.note ?? null } : null,
  ]);
  const M = J.more;
  return {
    id: "credit",
    lead,
    sample: profile.tier !== "A",
    rows: rows.length ? { key: "own", head: J.slots.credit.heading, type: "share", rows } : null,
    more: present([list("loans", M.loans, "money", loans), list("pay", M.pay, "share", split), list("lands", M.lands, "time", lands)]),
    drawing: { iso2, rate, base, loan: fin?.loan ?? null },
    thin: rows.length === 0,
  };
}

/* ----- SLOT 10, FILING DEADLINES ----- */
export function buildFilingsSlot(iso2In: string, today: string): SlotModel<null> | null {
  const iso2 = iso2In.toUpperCase();
  const accounts = ruleRaw(iso2, "filings", "accounts-deadline");
  const accountsText = accounts ? lawValue(accounts) : null;
  if (!accountsText) return null;
  const F = J.filings;
  /* A deadline in months and days: the months its figure, the days said in its note. */
  const monthsRow = (key: string, label: string): SlotRow | null => {
    const v = ruleRaw(iso2, "filings", key);
    const note = ruleRow(iso2, "filings", key)?.note ?? "";
    if (!v || typeof v.months !== "number") return null;
    const days = typeof v.days === "number" ? v.days : 0;
    /* Stamped like the lead (each fact says where it was read: plan 2026-10-12 rhythm-air-inside, Task 4). */
    return { key, label, value: String(v.months), note: days === 0 ? note || null : (days === 1 ? F.andDay : F.andDays.replace("{n}", String(days))).replace("{note}", note), prov: { src: `sections/rules.json:${iso2}:filings:${key}`, kind: "looked up" } };
  };
  const rows = present([monthsRow("tax-return-deadline", F.taxReturn), monthsRow("corporation-tax-payment", F.taxPayment), monthsRow("vat-return-deadline", F.vatReturn)]);
  const lateLow = ruleValue(iso2, "filings", "late-accounts-1");
  const lateHigh = ruleValue(iso2, "filings", "late-accounts-4");
  const costs = present([
    dated(ruleRow(iso2, "filings", "confirmation-statement-fee", { note: COPY.rulesRows.statementWords }), iso2, "confirmation-statement-fee", today),
    lateLow && lateHigh ? { key: "late-accounts", label: ruleRow(iso2, "filings", "late-accounts-1")?.label ?? "", value: `${lateLow} to ${lateHigh}`, note: COPY.rulesRows.lateAccountsNote } : null,
  ]);
  return {
    id: "filings",
    /* The accounts' deadline, the rules file's own row (final review M8: stamped). */
    lead: { figure: accountsText, words: J.slots.filings.words, prov: { src: `sections/rules.json:${iso2}:filings:accounts-deadline`, kind: "looked up" } },
    rows: rows.length ? { key: "own", head: J.slots.filings.heading, type: "time", rows } : null,
    more: present([list("costs", J.more.filingCosts, "money", costs)]),
    drawing: null,
    thin: false,
  };
}

/* ----- SLOT 11, AGAINST THE PEERS ----- */
export type PeersDrawing = { table: PeerTable; caveat?: string };
export function buildPeersSlot(iso2: string): SlotModel<PeersDrawing> | null {
  const table = buildPeerTable(iso2);
  if (!table) return null;
  /* His ruling of 2026-10-05 on PARKED P04.2: the UK's peers kept, called estimates; no other caveat prints. */
  const caveat = table.caveat === COPY.peers.caveatEstimates ? table.caveat : undefined;
  return { id: "peers", lead: null, rows: null, more: [], drawing: { table, caveat }, thin: false };
}
