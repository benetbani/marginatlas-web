/**
 * THE THREE PROOFS ON THE HOME PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 8; the home's spec of 2026-10-09,
 * section 4, approved as written): what the site reads, keeps and works out, each a door card (MODEL 10.4: the whole card the link, so
 * it keeps its box on the band), one figure at 30, one line, one second reading (clause 65) and one door. The joins, a year of company
 * notices matched by name, its names found drawn as a ring at the lead rung so the card's one 30 stays its focal; the archive, the months
 * of notices kept, its register copies as a row; the formulas, /gb's tax burden under its own name, the page's second loud moment
 * (LOUD_SEATS seat 2), drawn with the masthead's own bar. The drawings differ in kind on the level and from the example's above (ring,
 * row, segment bar; strip, units), as clauses 55 and 64 ask. Each second reading stands at its card's foot (`mt-auto`), so the height a
 * shorter card is lent opens above it and never pools under it. Every figure from src/lib/home/proofs.ts, stamped.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { Ring } from "@/components/spine/archetypes/Ring";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import type { ProofArchiveData, ProofJoinsData, ProofTaxData } from "@/lib/home/proofs";

const DOOR = "tap-y flex h-full flex-col text-[var(--c-ink)] no-underline";

export function ProofJoins({ p }: { p: ProofJoinsData }) {
  return (
    <Box id="joins" keep className="flex flex-col">
      <a href={p.href} className={DOOR}>
        <Rail icon={p.icon} kicker={p.kicker} level={2} />
        <Focal figure={p.figure} words={p.line} prov={p.prov} />
        <div className="mt-auto">
          <Ring size="lead" value={p.ring.value} figure={p.ring.figure} prov={p.ring.prov} caption={<>{p.ring.before}<Fig prov={p.ring.namesProv}>{p.ring.names}</Fig>{p.ring.after}</>} />
        </div>
      </a>
    </Box>
  );
}

export function ProofArchive({ p }: { p: ProofArchiveData }) {
  return (
    <Box id="archive" keep className="flex flex-col">
      <a href={p.href} className={DOOR}>
        <Rail icon={p.icon} kicker={p.kicker} level={2} />
        <Focal figure={p.figure} words={p.line} prov={p.prov} />
        <div className="mt-auto">
          <FactRows rows={[{ key: "copies", icon: "filings", label: p.row.label, value: p.row.value, note: p.row.note, prov: p.row.prov }]} />
        </div>
      </a>
    </Box>
  );
}

export function ProofTax({ p }: { p: ProofTaxData }) {
  return (
    <Box id="tax" keep className="flex flex-col">
      <a href={p.href} data-lands={p.lands} className={DOOR}>
        <Rail icon={p.icon} kicker={p.kicker} level={2} />
        <span data-figure-name="" className="mb-1 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{p.label}</span>
        <Focal figure={p.figure} words={p.line} prov={p.prov} accent />
        <div data-answer-bar className="mt-auto max-w-[28ch]">
          <SegmentBar bare label={p.bar.aria} value={p.bar.value} figure={p.figure} unit="" part={p.bar.part} rest={p.bar.rest} />
        </div>
      </a>
    </Box>
  );
}
