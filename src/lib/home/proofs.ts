/**
 * src/lib/home/proofs.ts
 *
 * THE THREE PROOFS OF THE EDGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 8; the home's spec of 2026-10-09,
 * section 4, approved as written): three doors, each one figure at 30, one line, one second reading and one door, showing what the
 * site reads, keeps and works out:
 *   the joins     a year of liquidation and administration notices matched by name to the register (buildJoins): failure rates by
 *                 trade where the official figures stop at broad industry; the names found drawn as a ring; door: #failures
 *   the archive   the months of notices kept and the register copies kept (buildArchive): what the register's monthly file drops;
 *                 the copies as a row; door: #archive
 *   the formulas  the UK's total effective tax burden on a sole trader's profit, worked out from the year's rules, the figure /gb's
 *                 masthead prints (buildHomeAnswers' answer), drawn with the masthead's own bar; door: /gb#take
 * Never typed: each figure is its builder's. The tax proof is the home's second loud moment (LOUD_SEATS seat 2) and stands last, so the
 * joins and the archive, quiet, stand between it and the first.
 */
import { buildJoins } from "@/lib/home/how_made";
import { buildArchive } from "@/lib/home/archive";
import { buildHomeAnswers } from "@/lib/spine/home_answers";
import { ukTaxOnProfit } from "@/lib/spine/uk_tax_on_profit";
import { UK_2026_27 } from "@/lib/uk/law/params_2026_27";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import type { DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";

type ProofBase = { href: string; icon: AtlasIconId; kicker: string; figure: string; line: string; prov: Provenance };
export type ProofJoinsData = ProofBase & { ring: { value: number; figure: string; prov: Provenance; names: string; namesProv: Provenance; before: string; after: string } };
export type ProofArchiveData = ProofBase & { row: { label: string; value: string; note: string; prov: Provenance } };
export type ProofTaxData = ProofBase & { label: string; lands: DoorKind; bar: { value: number; part?: string; rest?: string; aria: string } };
export type Proofs = { joins: ProofJoinsData; archive: ProofArchiveData; tax: ProofTaxData };

/** The three proofs, or null where any of their builders holds nothing to print. */
export function buildProofs(): Proofs | null {
  const C = COPY.home.proofs;
  const j = buildJoins();
  const a = buildArchive();
  const answer = buildHomeAnswers("GB").find((x) => x.key === "answer");
  const uk = ukTaxOnProfit();
  if (!j || !a || !answer || !answer.bar || !uk) return null;
  const [before, after] = C.joins.ring.split("{names}");
  return {
    joins: {
      href: "/about-data#failures",
      icon: "vacancy",
      kicker: C.joins.kicker,
      figure: j.notices.figure,
      line: C.joins.words,
      prov: j.notices.prov,
      ring: { value: j.share, figure: j.matched.figure, prov: j.matched.prov, names: j.names.figure, namesProv: j.names.prov, before, after },
    },
    archive: {
      href: "/about-data#archive",
      icon: "freshness",
      kicker: C.archive.kicker,
      figure: C.archive.figure.replace("{n}", String(a.months)),
      line: C.archive.words.replace("{first}", a.firstName).replace("{last}", a.lastName),
      prov: a.prov.months,
      row: { label: C.archive.row, value: String(a.copies), note: a.copiesWords, prov: a.prov.copies },
    },
    tax: {
      href: answer.href,
      icon: "taxes",
      kicker: C.tax.kicker,
      label: answer.kicker,
      figure: answer.figure,
      line: C.tax.words.replace("{profit}", usd(uk.profitUsd)).replace("{year}", UK_2026_27.taxYear),
      prov: answer.prov,
      lands: answer.lands,
      bar: answer.bar,
    },
  };
}
