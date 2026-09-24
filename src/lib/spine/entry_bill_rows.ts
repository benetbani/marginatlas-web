/**
 * src/lib/spine/entry_bill_rows.ts
 *
 * THE BILL TO REGISTER, the country page's `04 entry-bill` (MODEL.md 8.2;
 * plan step 31, third dispatch, 2026-09-17; closes plan step 44, "The bill to
 * open never prints both"). Two figures, both from one file, and a GUARD
 * between them and the table they sit beside. Pure over the files,
 * synchronous, no database, so the harness and the prebuild gate can build
 * every country. Each figure with its file and field:
 *
 *  - THE BILL, ALL IN: `costs.license_setup_usd` in
 *    data/facts/country/<ISO2>.json, read through src/lib/facts/country_shard.ts
 *    into the fact store (191 of 195; 16 tagged held, 175 modeled). The
 *    warehouse's definition (page-data/schema/country-schema.md line 79):
 *    the registry fee, the notary where the law requires one, and one
 *    representative first trade licence; paid-in share capital is NOT in it
 *    by the schema's own rule, which is what the foot says. Printed whole
 *    ($0 on Rwanda prints as `$0`, a figure, never "Free"; the hero's
 *    COPY.free convention is not inherited).
 *  - THE DAYS UNTIL TRADING: `setup.total_days` in the same shard (195 of
 *    195; 44 held, 151 modeled), the schema's "realistic time to be
 *    trading": the day the slowest filing-path step clears, the bank
 *    account included and the VAT registration excluded. It is NOT the
 *    hero's and the glance's registration time, which is the formation
 *    file's LLC filing turnaround (1 day on GB against 21 here); the two are
 *    different quantities, the basis says which this one is, and the guard
 *    below keeps them consistent.
 *
 * THE GUARD, and it is the whole honesty of the band (the brief's sections
 * 2.4 and 4). The registering table beside this card draws the formation
 * file's LLC row (data/legal/business_formation_costs_v1.json through
 * getFormationRowByTier, the same accessor and the same first-LLC-row pick
 * the hero and the glance read, so the reference is the figure the masthead
 * prints). Measured over the 148 countries holding an LLC row and both shard
 * figures: the shard's days are FEWER than the table's filing days on 81,
 * and the shard's bill is LOWER than the table's government fee alone on 51,
 * in a direction that cannot be true (a company cannot trade before it is
 * registered; a bill that includes the fee cannot be smaller than the fee).
 * So before either figure prints: if the bill is lower than the LLC row's
 * fee, the bill is withheld; if the days are fewer than the LLC row's filing
 * days, the days are withheld. Equal is consistent (France, 14 against 14).
 * A withheld figure is never printed, never replaced by a word, never
 * clipped up to the fee; its slot carries one stated line in PART 5's shape
 * (COPY.entryBill.withheld). Where the formation file holds no LLC row (43
 * countries) there is nothing to check against and the shard's figures print
 * with their tag. A figure tagged placeholder is a fill, and a fill is
 * withheld (the template's rule), read here as not on file; none of the
 * 386 rows carries that tag today.
 *
 * Counted over the 195 on 2026-09-17, reproduced from the brief exactly:
 * both figures print on 91 (48 consistent with their table, 43 with no
 * table), the bill alone on 49, the days alone on 21, neither on 34 (32
 * failing both tests, plus Iceland and Senegal with no bill and their days
 * fewer). The unit test, tests/spine/entry_bill_guard.test.ts, holds the
 * guard to the brief's named cases and these counts as a ratchet.
 *
 * MODELLED SAYS MODELLED. The sample mark is behind his switch, so the foot
 * names in words any printed figure whose tag is not held; the basis names a
 * unit for every figure the card prints and for none it withholds (the
 * glance's rule). The card carries no placement line: the composition's row
 * gives the bill one and the days none, and the site-wide placement builder
 * (PART 6's one fixed sentence, R2) does not exist in src/lib yet; it is the
 * `05 | 06` dispatch's to build, and this card takes it the day it lands
 * rather than typing a local copy.
 */
import { countryFigure, type CountryBankFigure } from "@/lib/facts/country_shard";
import type { FactTag } from "@/lib/facts/types";
import { getFormationRowByTier, getFormationRows } from "@/lib/tax/country_rates";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The two shard metrics this card reads, named once. */
export const ENTRY_BILL_METRICS = { bill: "costs.license_setup_usd", days: "setup.total_days" } as const;

/** The formation table's LLC row as the guard reads it: the government fee and the filing days, either possibly unheld. */
export type GuardTable = { costUsd: number | null; days: number | null };

/** One slot's verdict: printed with its tag, or withheld with the reason. */
export type GuardSlot =
  | { state: "printed"; value: number; tag: FactTag }
  | { state: "withheld"; reason: "disagrees" | "not-on-file" };

export type GuardVerdict = { bill: GuardSlot; days: GuardSlot };

/**
 * THE GUARD, pure. `bill` and `days` are the shard's figures (null when the
 * shard holds none); `table` is the formation file's LLC row (null when the
 * country holds no LLC row, in which case nothing is checked and every held
 * figure prints).
 */
export function guardEntryBill(bill: CountryBankFigure | null, days: CountryBankFigure | null, table: GuardTable | null): GuardVerdict {
  const judge = (figure: CountryBankFigure | null, reference: number | null): GuardSlot => {
    if (!figure || figure.tag === "placeholder") return { state: "withheld", reason: "not-on-file" };
    if (reference != null && figure.value < reference) return { state: "withheld", reason: "disagrees" };
    return { state: "printed", value: figure.value, tag: figure.tag };
  };
  return {
    bill: judge(bill, table ? table.costUsd : null),
    days: judge(days, table ? table.days : null),
  };
}

export type EntryBillData = {
  iso2: string;
  verdict: GuardVerdict;
  /** The LLC row the guard read, or null where the formation file holds none. */
  table: GuardTable | null;
  /** The focal figure as printed, or null when its slot carries the withheld line. */
  figure: string | null;
  /** The line where the focal would stand, or null when the figure prints. */
  withheld: string | null;
  /** The second slot: the days with their words, or the line that stands in the slot. */
  second: { figure: string; words: string } | { withheld: string };
  /** One unit clause per printed figure; null when neither prints. */
  basis: string | null;
  /** The share-capital exclusion where the bill prints, and the modelled sentence where a printed figure is not held. */
  foot: string | null;
  /** The printed values, null where withheld; the gates read these. */
  figures: { bill: number | null; days: number | null };
  /** True when a printed figure's tag is not held: the opener's mark, behind the switch. */
  sample: boolean;
  confidence: "measured" | "modeled";
};

/** The days as printed: the hero's own singular rule. */
export const daysFigure = (days: number) => (Math.round(days) === 1 ? "1 day" : `${Math.round(days)} days`);

export function buildEntryBill(iso2In: string): EntryBillData | null {
  const iso2 = iso2In.toUpperCase();
  const bill = countryFigure(iso2, ENTRY_BILL_METRICS.bill);
  const days = countryFigure(iso2, ENTRY_BILL_METRICS.days);
  /* A country whose shard holds neither metric has no card: the section
     self-omits, and the band it would have partnered stands alone, honestly,
     as LONE CARD. None of the 195 is in that state (the days are held for
     every one); the guard's not-on-file line is for a bill missing beside
     days that are held. */
  if (!bill && !days) return null;
  const llc = getFormationRowByTier(iso2, "LLC");
  const table: GuardTable | null = llc ? { costUsd: llc.costUsd, days: llc.days } : null;
  const verdict = guardEntryBill(bill, days, table);

  const W = COPY.entryBill.withheld;
  const figure = verdict.bill.state === "printed" ? usd(verdict.bill.value) : null;
  const withheld = verdict.bill.state === "printed" ? null : verdict.bill.reason === "disagrees" ? W.bill : W.billNotOnFile;
  const second: EntryBillData["second"] =
    verdict.days.state === "printed"
      ? { figure: daysFigure(verdict.days.value), words: COPY.entryBill.daysWords }
      : { withheld: verdict.days.reason === "disagrees" ? W.days : W.daysNotOnFile };

  /* The basis: one clause per printed figure, none for a withheld one. */
  const clauses: string[] = [];
  if (verdict.bill.state === "printed") clauses.push(COPY.entryBill.basisBill);
  if (verdict.days.state === "printed") clauses.push(COPY.entryBill.basisDays);
  /* One line (his correction of 2026-09-24, evening): the bill's sentence where it prints, the days' otherwise. */
  const basis = clauses.length > 0 ? clauses[0] : null;

  /* The foot: the exclusion where the bill prints, then the modelled sentence. */
  const footParts: string[] = [];
  if (verdict.bill.state === "printed" && COPY.entryBill.foot) footParts.push(COPY.entryBill.foot);
  const modelled: string[] = [];
  if (verdict.bill.state === "printed" && verdict.bill.tag !== "held") modelled.push(COPY.entryBill.names.bill);
  if (verdict.days.state === "printed" && verdict.days.tag !== "held") modelled.push(COPY.entryBill.names.days);
  if (modelled.length > 0 && COPY.entryBill.footModelled) {
    /* The verb follows the noun, not the count: "the bill is", "the days are", "the bill and the days are". */
    const verb = modelled.length === 1 && modelled[0] === COPY.entryBill.names.bill ? "is" : "are";
    footParts.push(capFirst(fill(COPY.entryBill.footModelled, { what: modelled.join(" and "), verb })));
  }
  const foot = footParts.length > 0 ? footParts.join(" ") : null;

  const sample = modelled.length > 0;
  return {
    iso2,
    verdict,
    table,
    figure,
    withheld,
    second,
    basis,
    foot,
    figures: {
      bill: verdict.bill.state === "printed" ? verdict.bill.value : null,
      days: verdict.days.state === "printed" ? verdict.days.value : null,
    },
    sample,
    confidence: sample ? "modeled" : "measured",
  };
}


/**
 * THE BILL'S PLUS (his correction 5 of 2026-09-20: "the bill to register
 * should also exist, but you should add some more context ... if a subsection
 * can only have one number, it should not exist"). The rows behind the plus
 * are the LLC's own facts the formation file already holds, never a split of
 * the bill the file does not itemise: the form's name in its country, the
 * government fee alone (the bill's basis says the bill adds a first licence),
 * the filing turnaround, and the paperwork level of the registering table's
 * dots. Fewer than two rows draw nothing (DetailPanel's own floor).
 */
export type EntryBillDetailRow = { label: string; value: string; note?: string };
export function buildEntryBillDetail(iso2In: string): EntryBillDetailRow[] {
  const iso2 = iso2In.toUpperCase();
  const llc = getFormationRowByTier(iso2, "LLC");
  if (!llc) return [];
  const rows: EntryBillDetailRow[] = [];
  const D = COPY.entryBill.detailRows;
  if (llc.localTerm) rows.push({ label: D.form, value: llc.localTerm });
  if (typeof llc.costUsd === "number" && Number.isFinite(llc.costUsd)) rows.push({ label: D.fee, value: llc.costUsd === 0 ? COPY.free : usd(llc.costUsd) });
  if (typeof llc.days === "number" && Number.isFinite(llc.days) && llc.days > 0) rows.push({ label: D.filing, value: llc.days === 1 ? "1 day" : `${llc.days} days` });
  const paperwork = getFormationRows(iso2).find((r) => r.tier === "LLC")?.complexity_score;
  if (typeof paperwork === "number" && Number.isFinite(paperwork)) rows.push({ label: D.paperwork, value: `${Math.round(paperwork)} of 5` });
  return rows;
}
