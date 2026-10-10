/**
 * src/lib/home/proofs.ts
 *
 * THE THREE PROOFS OF THE EDGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 8; the home's spec of 2026-10-09,
 * section 4, approved as written; reformed by plan docs/superpowers/plans/2026-10-10-home-reform, Task 4): three doors, each one figure
 * at 30, one line, one second reading and one door, showing what the site reads, keeps and works out:
 *   the joins     a year of liquidation and administration notices matched by name to the register (buildJoins): failure rates by
 *                 trade where the official figures stop at broad industry; the names found drawn as a ring, its figure the names
 *                 found in 100 ("97", the critique's P1.6) and its caption the copy's words alone; door: #failures
 *   the archive   the months of notices kept and the register copies kept (buildArchive): what the register's monthly file drops;
 *                 the last twelve months drawn as columns in their own order, each the month's notices by each notice's own date
 *                 (the spec's decision 8; they sum to the joins' year, 31,926 today), the line saying how a month is counted;
 *                 the copies as a row; door: #archive
 *   the formulas  the UK's total effective tax burden on a sole trader's profit, worked out from the year's rules, the figure /gb's
 *                 masthead prints (buildHomeAnswers' answer), its two rules as rows whose whole numbers sum to it (income tax and
 *                 National Insurance, P0.7), the masthead's own data drawn as the segment bar; door: /gb#take
 * Never typed: each figure is its builder's. The tax proof stands last, so the joins and the archive, quiet, stand between it and the
 * example's step 3. The year's hyphen is unbreakable (U+2011), so "2026-27" never breaks over two lines (P2.3).
 */
import { buildJoins } from "@/lib/home/how_made";
import { buildArchive, monthName } from "@/lib/home/archive";
import { buildHomeAnswers } from "@/lib/spine/home_answers";
import { ukTaxOnProfit } from "@/lib/spine/uk_tax_on_profit";
import { UK_2026_27 } from "@/lib/uk/law/params_2026_27";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import type { DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";

type ProofBase = { href: string; icon: AtlasIconId; kicker: string; figure: string; line: string; prov: Provenance };
export type ProofJoinsData = ProofBase & { ring: { value: number; figure: string; prov: Provenance; caption: string } };
/** The months drawn: each month's index in the calendar (0 is January) and its notices, the order run on from `start` ("2025-10"),
 *  and the words a column's reading and the drawing's label take. */
export type ProofMonths = { points: Array<{ month: number; value: number }>; start: string; counts: { words: string; aria: string } };
export type ProofArchiveData = ProofBase & { months: ProofMonths | null; row: { label: string; value: string; note: string; prov: Provenance } };
/** One rule of the tax: its name and its share of the profit as printed, a whole percent. */
export type ProofRule = { key: string; label: string; value: string; prov: Provenance };
export type ProofTaxData = ProofBase & { label: string; lands: DoorKind; rows: ProofRule[]; bar: { value: number; part?: string; rest?: string; aria: string } };
export type Proofs = { joins: ProofJoinsData; archive: ProofArchiveData; tax: ProofTaxData };

/** The months a year of columns draws. */
const DRAWN_MONTHS = 12;

/** The three proofs, or null where any of their builders holds nothing to print. */
export function buildProofs(): Proofs | null {
  const C = COPY.home.proofs;
  const j = buildJoins();
  const a = buildArchive();
  const answer = buildHomeAnswers("GB").find((x) => x.key === "answer");
  const uk = ukTaxOnProfit();
  if (!j || !a || !answer || !answer.bar || !uk) return null;
  /* THE LAST TWELVE MONTHS HELD, in their own order (the spec's decision 8); fewer than twelve and the card draws no columns, its line
     then the months held. */
  const twelve = a.series.slice(-DRAWN_MONTHS);
  const drawn = twelve.length === DRAWN_MONTHS;
  const firstName = drawn ? monthName(twelve[0].month) : a.firstName;
  const lastName = drawn ? monthName(twelve[DRAWN_MONTHS - 1].month) : a.lastName;
  return {
    joins: {
      href: "/about-data#failures",
      icon: "vacancy",
      kicker: C.joins.kicker,
      figure: j.notices.figure,
      line: C.joins.words,
      prov: j.notices.prov,
      /* THE NAMES FOUND IN 100 (P1.6): the ring prints the share, rounded, and its caption the copy's words alone; the two counts it is
         worked out from stand on About the figures' #failures. */
      ring: { value: j.share, figure: String(Math.round(j.share)), prov: { src: "home/method.json:matched_names of names", kind: "worked out" }, caption: C.joins.ring },
    },
    archive: {
      href: "/about-data#archive",
      icon: "freshness",
      kicker: C.archive.kicker,
      figure: C.archive.figure.replace("{n}", String(a.months)),
      line: C.archive.words.replace("{first}", firstName).replace("{last}", lastName),
      prov: a.prov.months,
      months: drawn ? { points: twelve.map((m) => ({ month: Number(m.month.slice(5, 7)) - 1, value: m.notices })), start: twelve[0].month, counts: { words: C.archive.readout, aria: C.archive.aria } } : null,
      row: { label: C.archive.row, value: String(a.copies), note: a.copiesWords, prov: a.prov.copies },
    },
    tax: {
      href: answer.href,
      icon: "taxes",
      kicker: C.tax.kicker,
      label: answer.kicker,
      figure: answer.figure,
      /* THE YEAR HOLDS TOGETHER (P2.3): a non-breaking hyphen, so "2026-27" never ends one line and starts the next. */
      line: C.tax.words.replace("{profit}", usd(uk.profitUsd)).replace("{year}", UK_2026_27.taxYear.replace("-", "‑")),
      prov: answer.prov,
      lands: answer.lands,
      /* ITS TWO RULES (P0.7): whole numbers that sum to the printed total, each the law engine's own part (uk_tax_on_profit.ts). */
      rows: [
        { key: "income-tax", label: C.tax.income, value: `${uk.partsPercent.incomeTax}%`, prov: { src: `${answer.prov.src}:income tax`, kind: "worked out" } },
        { key: "class-4", label: C.tax.class4, value: `${uk.partsPercent.class4}%`, prov: { src: `${answer.prov.src}:class 4`, kind: "worked out" } },
      ],
      bar: answer.bar,
    },
  };
}
