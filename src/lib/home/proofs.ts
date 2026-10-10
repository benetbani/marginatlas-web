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
 *                 the twelve months of the joins' own year drawn as columns in their own order, each the month's notices by each
 *                 notice's own date (the spec's decision 8; they sum to the first proof's figure, 31,926 today, and keep summing
 *                 to it as the archive grows: proofArchive), the line saying how a month is counted; the copies as a row;
 *                 door: #archive
 *   the formulas  the UK's total effective tax burden on a sole trader's profit, worked out from the year's rules, the figure /gb's
 *                 masthead prints (buildHomeAnswers' answer), its two rules as rows whose whole numbers sum to it (income tax and
 *                 National Insurance, P0.7), the masthead's own data drawn as the segment bar; door: /gb#take
 * Never typed: each figure is its builder's. The tax proof stands last, so the joins and the archive, quiet, stand between it and the
 * example's step 3. The year's hyphen is unbreakable (U+2011), so "2026-27" never breaks over two lines (P2.3).
 */
import { buildJoins, type Joins } from "@/lib/home/how_made";
import { buildArchive, monthName, type Archive } from "@/lib/home/archive";
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
 *  the words a column's reading and the drawing's label take, and where the twelve counts came from (stamped on the drawing's root). */
export type ProofMonths = { points: Array<{ month: number; value: number }>; start: string; counts: { words: string; aria: string }; prov: Provenance };
export type ProofArchiveData = ProofBase & { months: ProofMonths | null; row: { label: string; value: string; note: string; prov: Provenance } };
/** One rule of the tax: its name and its share of the profit as printed, a whole percent. */
export type ProofRule = { key: string; label: string; value: string; prov: Provenance };
export type ProofTaxData = ProofBase & { label: string; lands: DoorKind; rows: ProofRule[]; bar: { value: number; part?: string; rest?: string; aria: string } };
export type Proofs = { joins: ProofJoinsData; archive: ProofArchiveData; tax: ProofTaxData };

/** The months a year of columns draws. */
const DRAWN_MONTHS = 12;

/** The second proof, the archive: its figure the months it draws, its line how a month is counted, its columns the notices of each.
 *
 *  THE JOINS' OWN YEAR, NOT THE LAST TWELVE MONTHS HELD (the closing cleanup of plan 2026-10-10, item 10). Proof 1's notices are a fixed
 *  window (data/home/method.json names it) and the archive grows a month at every monthly run, so a card that drew the last twelve
 *  months held would print "13 months" over twelve columns that no longer sum to proof 1's figure. The columns, the figure and the
 *  line's months are the archive's months inside that window, so proofs 1 and 2 always agree; a re-export of the archive alone moves
 *  nothing here, and one made in the right order (the failures table, then method and archive) moves the window and the columns with
 *  it. A window the archive does not hold whole (twelve months) draws no columns, and the card says the months held. */
export function proofArchive(a: Archive, j: Joins): ProofArchiveData {
  const C = COPY.home.proofs;
  const year = j.span ? a.series.filter((m) => m.month >= j.span!.first && m.month <= j.span!.last) : [];
  const drawn = year.length === DRAWN_MONTHS;
  const firstName = drawn ? monthName(year[0].month) : a.firstName;
  const lastName = drawn ? monthName(year[DRAWN_MONTHS - 1].month) : a.lastName;
  return {
    href: "/about-data#archive",
    icon: "freshness",
    kicker: C.archive.kicker,
    figure: C.archive.figure.replace("{n}", String(drawn ? year.length : a.months)),
    line: C.archive.words.replace("{first}", firstName).replace("{last}", lastName),
    prov: a.prov.months,
    months: drawn ? { points: year.map((m) => ({ month: Number(m.month.slice(5, 7)) - 1, value: m.notices })), start: year[0].month, counts: { words: C.archive.readout, aria: C.archive.aria }, prov: a.prov.months } : null,
    row: { label: C.archive.row, value: String(a.copies), note: a.copiesWords, prov: a.prov.copies },
  };
}

/** The three proofs, or null where any of their builders holds nothing to print. */
export function buildProofs(): Proofs | null {
  const C = COPY.home.proofs;
  const j = buildJoins();
  const a = buildArchive();
  const answer = buildHomeAnswers("GB").find((x) => x.key === "answer");
  const uk = ukTaxOnProfit();
  if (!j || !a || !answer || !answer.bar || !uk) return null;
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
    archive: proofArchive(a, j),
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
