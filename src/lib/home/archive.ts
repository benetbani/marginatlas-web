/**
 * src/lib/home/archive.ts
 *
 * WHAT THE SITE KEEPS (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 2; the home's spec of 2026-10-09, proof 2,
 * "Kept and dated"): the months of liquidation and administration notices the site's own archive holds and the dated copies of the
 * company register it keeps, from data/home/archive.json (the archive's log, read by scripts/data/home/export_home.py archive), never typed. Counted: a
 * month is held or not, a copy is kept or not. The home's second proof and About the figures' #archive read it. Since plan
 * 2026-10-10 (the home reformed to ship, Task 4; the spec's decision 8) it also hands over each month's notices in month order
 * (`series`), which the home's second proof draws as twelve columns: a month's count is the archive's own, each notice counted in
 * the month of its own date.
 */
import archiveJson from "../../../data/home/archive.json";
import type { Provenance } from "@/lib/spine/provenance";

type Export = { gazette: { first: string; last: string; months: Array<{ month: string; notices: number }> }; register: { copies: string[] } };

export type Archive = {
  /** The months of notices held, and the first and the last as a reader says them ("October 2025"). */
  months: number;
  firstName: string;
  lastName: string;
  /** Each month held and its notices, in month order ({ month: "2025-10", notices: 2828 }): the months the home's second proof draws. */
  series: Array<{ month: string; notices: number }>;
  /** The register copies kept, and their days as one phrase ("1 May and 1 October 2026"). */
  copies: number;
  copiesWords: string;
  prov: { months: Provenance; copies: Provenance };
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2025-10" as a reader says it: "October 2025". */
export function monthName(ym: string): string {
  return `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
}

/** Days as one phrase, the year said once where they share it ("1 May and 1 October 2026"), else each with its own. */
export function daysWords(days: readonly string[]): string {
  const parts = days.map((d) => ({ day: Number(d.slice(8, 10)), month: MONTHS[Number(d.slice(5, 7)) - 1], year: d.slice(0, 4) }));
  const oneYear = parts.every((p) => p.year === parts[0].year);
  const said = parts.map((p, i) => (oneYear && i < parts.length - 1 ? `${p.day} ${p.month}` : `${p.day} ${p.month} ${p.year}`));
  if (said.length <= 1) return said[0] ?? "";
  return `${said.slice(0, -1).join(", ")} and ${said[said.length - 1]}`;
}

export function buildArchive(): Archive | null {
  const d = archiveJson as unknown as Export;
  const months = d.gazette?.months ?? [];
  const copies = d.register?.copies ?? [];
  if (months.length === 0 || copies.length === 0 || !d.gazette.first || !d.gazette.last) return null;
  return {
    months: months.length,
    firstName: monthName(d.gazette.first),
    lastName: monthName(d.gazette.last),
    series: months.map((m) => ({ month: m.month, notices: m.notices })),
    copies: copies.length,
    copiesWords: daysWords(copies),
    prov: {
      months: { src: "home/archive.json:gazette.months", kind: "counted" },
      copies: { src: "home/archive.json:register.copies", kind: "counted" },
    },
  };
}
