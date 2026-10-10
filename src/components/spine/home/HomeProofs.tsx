/**
 * THE THREE PROOFS ON THE HOME PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 8; the home's spec of 2026-10-09,
 * section 4, approved as written; reformed by plan docs/superpowers/plans/2026-10-10-home-reform, Task 4): what the site reads, keeps
 * and works out, each a door card that keeps its box on the band (MODEL 10.4), one figure at 30, one line, one second reading (clause
 * 65) and one door. The joins, a year of company notices matched by name, its names found drawn as a ring in ink at the lead rung
 * ("97", "in 100 names found in the register"), so the card's one 30 stays its focal; the archive, the months of notices kept, the
 * twelve of the joins' own year drawn as quiet columns in their own order with each month's count as its reading, stamped as a
 * figure is, its register copies as a row; the
 * formulas, /gb's tax burden under its own name, in ink since the band took the page's second loud seat (plan 2026-10-10, Task 5), its two rules as rows and the
 * masthead's own data drawn as one stacked bar of the two rules and what is kept (/gb draws that share as a pie). The drawings differ
 * in kind on the level and from the example's above (ring, columns, stacked bar; strip, units), as clauses 55 and 64 ask.
 *
 * ONE ANATOMY FOR THE THREE CARDS (critique pass 2, P0.1), top to bottom: the title row, the figure, the line, the drawing 20px under
 * the line (and 12px over the foot's hairline at the least), the foot rows under a hairline at the card's foot (`mt-auto`). So the three figures stand on one line (the tax's name for
 * its figure moved into its line: "Total effective tax burden on a sole trader's {profit} profit, {year} rules."), the three drawings
 * start at one height (the focal's own 16px and `mt-1`: the critique's `mt-5` measured from the line), and the height a shorter card
 * is lent opens as one band between its drawing and the hairline, no taller than the cards' difference, never as a block under the
 * line (the joins held about 100px of nothing there when its ring stood at `mt-auto`). The hairline is the foot's own: measured in the
 * browser, a one-row foot with its note under its label leaves the right half of the row blank, and without a rule that blank ran up
 * into the drawing's years row as one 96px hole; the rule is ink the page filter reads, and it ties the three feet together. The joins'
 * ring stands in its row form with its caption beside it and the two counts it is worked out from at the foot; the archive's copies
 * row is a foot row like them, with no glyph; the tax draws the stacked bar of its two rules and, as the bar's key, its three parts (a
 * swatch in each part's ink; a note in the law's own pounds on the two rules; a third row, what is kept, in the soft grey with the bar's own
 * edge, critique pass 3, item P1.5: the key named two parts and stood 50px under its bar), the bar naming nothing under itself, the two
 * columns kept from 600px of card (no rule there: the rows stand beside the bar).
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
/** THE FOOT: pushed to the card's foot, its rows under a hairline (the rows' own 12px padding stands under it). */
const FOOT = "mt-auto border-t border-[var(--c-border)]";
/** The tax bar's three parts and their key's swatches, one ink each: income tax in ink, National Insurance in ink2, what is kept in the soft
 *  grey (the bar's rest, which carries a 1px edge, as the key's swatch does: FactRows). The key names all three (critique pass 3, item P1.5). */
export const TAX_INK: Record<string, string> = { "income-tax": "var(--c-ink)", "class-4": "var(--c-ink2)", keep: "var(--c-soft2)" };

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
      <div className="mb-3 mt-1">
        <Ring size="lead" tone="ink" layout="row" value={p.ring.value} figure={p.ring.figure} prov={p.ring.prov} caption={p.ring.caption} />
      </div>
      <div className={FOOT}>
        <FactRows rows={p.rows} />
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
        <div className="relative z-20 mb-3 mt-1">
          <MonthBars points={p.months.points} start={p.months.start} tone="ink" counts={p.months.counts} prov={p.months.prov} />
        </div>
      ) : null}
      <div className={FOOT}>
        <FactRows rows={[{ key: "copies", label: p.row.label, value: p.row.value, note: p.row.note, prov: p.row.prov }]} />
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
      {/* TWO COLUMNS FROM 600px OF CARD (P0.7): the figure, its line and the bar on the left, the two rules, the bar's key, on the right
          and centred in their column, lifted 12px so the first rule's text stands level with the figure rather than 12px of its row's padding
          under it; under 600px one column, the bar 20px under the line (`mt-1` after the focal's 16, where the other
          two cards' drawings start) and the rules at the foot under their hairline, so lent height opens between the bar and the rule. */}
      <div className="flex flex-1 flex-col [container-type:inline-size]">
        <div className="grid flex-1 grid-cols-1 grid-rows-[auto_1fr] [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:grid-rows-1 [@container(min-width:600px)]:gap-x-12">
          <div className="flex flex-col">
            <Focal figure={p.figure} words={p.line} prov={p.prov} />
            <div data-answer-bar className="mb-3 mt-1 [@container(min-width:600px)]:my-auto">
              <SegmentBar bare tone="ink" label={p.bar.aria} value={p.bar.value} figure={p.figure} unit="" parts={p.rows.filter((r) => r.key !== "keep").map((r) => ({ key: r.key, value: r.percent, fill: TAX_INK[r.key] ?? "var(--c-ink2)" }))} />
            </div>
          </div>
          <div className="flex flex-col [@container(min-width:600px)]:justify-center">
            <div className={`${FOOT} [@container(min-width:600px)]:-mt-3 [@container(min-width:600px)]:border-t-0`}>
              <FactRows rows={p.rows.map((r) => ({ key: r.key, label: r.label, value: r.value, note: r.note, swatch: TAX_INK[r.key] ?? "var(--c-ink2)", prov: r.prov }))} />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
