/**
 * src/lib/spine/slots/dated.ts , A CHANGE DATED ON THE ROW IT CHANGES (plan 2026-10-13 country-page-journey, Task 3E; spec section 2: "the
 * rule changes stand in stage 6, each change also dated on the row it changes"; Review Focus 3). A row printing a rule the changes ledger
 * dates (data/sections/changes.json, through sections/country_rules.ts) takes the value in force on `today`, in the row's own form, and a
 * note that agrees with the ledger: the coming value and its day where a change is coming, else the day the value in force began while
 * that change is news (the changes slot's own window, 120 days). The page regenerates daily, so on a change's day the value and the note
 * switch together. Older changes print the value and no note; the changes slot keeps their dates.
 */
import { changeAround, lawValue, type LawValue } from "@/lib/spine/sections/country_rules";
import { COPY } from "@/lib/spine/copy";

/** How long a change in force stays news on its row: the changes slot's recent window (buildRuleChanges' `recentDays`). */
export const DATED_RECENT_DAYS = 120;

export type Dated = { value: string; note: string | null; change: string };

const daysBetween = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

/** A span in whole months, for a label that carries "months"; null for any other unit. */
export function monthsOf(v: LawValue): string | null {
  if (typeof v.years === "number") return String(v.years * 12);
  if (typeof v.months === "number" && typeof v.days !== "number") return String(v.months);
  return null;
}

/** The value a dated rule holds on `today` in the row's form (`fmt`), and the note that agrees with the ledger; null where the ledger does
 *  not date the rule, or `fmt` cannot say its value. */
export function datedRow(iso2: string, change: string, today: string, fmt: (v: LawValue) => string | null): Dated | null {
  const { latest, next } = changeAround(iso2, change, today);
  const held = latest ? latest.from : next ? next.before : null;
  const value = held ? fmt(held) : null;
  if (value == null) return null;
  const D = COPY.journey.dated;
  const to = next ? lawValue(next.from) : null;
  if (next && to) return { value, note: D.coming.replace("{to}", to).replace("{date}", next.dateText), change };
  if (latest && daysBetween(latest.date, today) <= DATED_RECENT_DAYS) return { value, note: D.since.replace("{date}", latest.dateText), change };
  return { value, note: null, change };
}
