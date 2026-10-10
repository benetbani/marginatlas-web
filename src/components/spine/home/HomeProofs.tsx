/**
 * THE THREE PROOFS ON THE HOME PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 8; the home's spec of 2026-10-09,
 * section 4, approved as written; reformed by plan docs/superpowers/plans/2026-10-10-home-reform, Task 4): what the site reads, keeps
 * and works out, each a door card that keeps its box on the band (MODEL 10.4), one figure at 30, one line, one second reading (clause
 * 65) and one door. The joins, a year of company notices matched by name, its names found drawn as a ring in ink at the lead rung
 * ("97", "in 100 names found in the register"), so the card's one 30 stays its focal; the archive, the months of notices kept, the
 * last twelve drawn as quiet columns in their own order with each month's count as its reading, its register copies as a row; the
 * formulas, /gb's tax burden under its own name, the page's second loud moment (LOUD_SEATS seat 2), its two rules as rows and the
 * masthead's own data drawn as a bar of 50 cells in ink and grey (/gb draws that share as a pie). The drawings differ in kind on the
 * level and from the example's above (ring, columns, segment bar; strip, units), as clauses 55 and 64 ask. Each second reading
 * stands at its card's foot (`mt-auto`), so the height a shorter card is lent opens above it and never pools under it.
 *
 * DOORS THAT LOOK LIKE DOORS (the critique's P1.7): the title is the link, stretched over the whole card (`after:absolute
 * after:inset-0`), an arrow at the right end of its row, the card's edge in ink2 on hover; nothing lifts and nothing turns terracotta.
 * The archive's columns stand above the stretched link (`relative z-20`), so a pointer or a tap reads a month there and anywhere else
 * opens the door, and no control sits inside a link. Every title at 20 on 28 (P1.9), as the open sections' titles stand. THE TAX IN
 * TWO COLUMNS FROM 600px OF CARD (P0.7, the kit's container idiom, as FactRows splits its lists): at 768 the card takes the row, its
 * name, figure and line on the left, its rules and bar on the right. Every figure from src/lib/home/proofs.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { Ring } from "@/components/spine/archetypes/Ring";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import { MonthBars } from "@/components/spine/archetypes/MonthBars";
import type { DoorKind } from "@/lib/spine/door_kinds";
import type { ProofArchiveData, ProofJoinsData, ProofTaxData } from "@/lib/home/proofs";

/** A door card: its own stacking context for the stretched link, its edge to ink2 on hover, its title at the heading rung (20 on 28). */
const CARD = "relative isolate flex flex-col transition-colors hover:border-[var(--c-ink2)] [&_[data-rail-title]]:text-[length:var(--t-head)] [&_[data-rail-title]]:leading-7 [&_[data-rail-title]]:tracking-[-0.01em]";
/** The tax bar's cells: fifty, so a share of 18 fills 9 exactly (the critique's P2.4; twenty-five drew 4 for it). */
export const TAX_BAR_CELLS = 50;

/** THE DOOR'S TITLE ROW: the card's Rail inside the link (passed as the child, so the census still reads each card's kicker off its
 *  Rail), the link stretched over the card, the arrow at the row's right end. */
function DoorTitle({ href, lands, children }: { href: string; lands?: DoorKind; children: React.ReactNode }) {
  return (
    <div data-door-title="" className="flex items-start gap-2">
      <a href={href} {...(lands ? { "data-lands": lands } : {})} className="min-w-0 flex-1 text-[var(--c-ink)] no-underline after:absolute after:inset-0 after:z-10 after:rounded-[12px]">
        {children}
      </a>
      <span aria-hidden className="mt-1 shrink-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">&#8594;</span>
    </div>
  );
}

export function ProofJoins({ p }: { p: ProofJoinsData }) {
  return (
    <Box id="joins" keep className={CARD}>
      <DoorTitle href={p.href}>
        <Rail icon={p.icon} kicker={p.kicker} level={2} />
      </DoorTitle>
      <Focal figure={p.figure} words={p.line} prov={p.prov} />
      <div className="mt-auto">
        <Ring size="lead" tone="ink" value={p.ring.value} figure={p.ring.figure} prov={p.ring.prov} caption={p.ring.caption} />
      </div>
    </Box>
  );
}

export function ProofArchive({ p }: { p: ProofArchiveData }) {
  return (
    <Box id="archive" keep className={CARD}>
      <DoorTitle href={p.href}>
        <Rail icon={p.icon} kicker={p.kicker} level={2} />
      </DoorTitle>
      <Focal figure={p.figure} words={p.line} prov={p.prov} />
      {/* THE MONTHS STAND ABOVE THE STRETCHED LINK (z-20 over its z-10): a pointer or a tap there reads a column and never opens the door. */}
      {p.months ? (
        <div className="relative z-20 mt-auto">
          <MonthBars points={p.months.points} start={p.months.start} tone="ink" counts={p.months.counts} />
        </div>
      ) : null}
      <div className={p.months ? "mt-4" : "mt-auto"}>
        <FactRows rows={[{ key: "copies", icon: "filings", label: p.row.label, value: p.row.value, note: p.row.note, prov: p.row.prov }]} />
      </div>
    </Box>
  );
}

export function ProofTax({ p }: { p: ProofTaxData }) {
  return (
    <Box id="tax" keep className={CARD}>
      <DoorTitle href={p.href} lands={p.lands}>
        <Rail icon={p.icon} kicker={p.kicker} level={2} />
      </DoorTitle>
      {/* TWO COLUMNS FROM 600px OF CARD (P0.7): the figure's name, the figure and its line on the left, the two rules and the bar on the
          right; under 600px one column, the rules under the line. The rows stand at the column's foot, so lent height opens above them. */}
      <div className="flex flex-1 flex-col [container-type:inline-size]">
        <div className="grid flex-1 grid-cols-1 [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:gap-x-12">
          <div>
            <span data-figure-name="" className="mb-1 block text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{p.label}</span>
            <Focal figure={p.figure} words={p.line} prov={p.prov} accent />
          </div>
          <div className="flex flex-col">
            <div className="mt-auto">
              <FactRows rows={p.rows} />
            </div>
            <div data-answer-bar className="mt-4 max-w-[28ch]">
              <SegmentBar bare tone="ink" segments={TAX_BAR_CELLS} label={p.bar.aria} value={p.bar.value} figure={p.figure} unit="" part={p.bar.part} rest={p.bar.rest} />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
