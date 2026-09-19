/**
 * BentoBand , THE BAND THAT IS NO LONGER TWO CARDS.
 *
 * His words, 2026-09-10: "the bento format with green blue and white is used
 * as a visual guidance that we can go a bit more experimental with bento style
 * in our page, not just 2 sections dividing each row." Ported from A2 and B4
 * of design/references/founder-2026-09-10.md.
 *
 * WHAT THIS REVERSES. `kit.tsx`'s `Band` is written around one rule, "TWO
 * SECTIONS TO A ROW, WHICH IS THE DEFAULT AND NOT THE EXCEPTION", and every
 * page on this site is built from it. That rule stands as the default; this is
 * the sanctioned second option, and the only one.
 *
 * WHAT DOES NOT PORT: THE COLOUR. Every reference he sent is blue, green,
 * purple or teal, and green is banned outright here. The palette is terracotta
 * and warm neutrals from globals.css. The COMPOSITION ports; the colour does
 * not.
 *
 * WHAT SURVIVES UNCHANGED: HIS RULING 7 OF 2026-09-04, "two sections that sit
 * on the same horizontal level should always have the same height, no matter
 * what." A bento is not an exception to it. Cells in one grid row share one
 * height BY CONSTRUCTION (`auto-rows-fr` plus `[&>*]:h-full`), exactly as
 * `Band` does it, and the cluster is a full rectangle, so no cell has a ragged
 * bottom edge and nothing sits beside a hole.
 *
 * ============================ THE LAW ============================
 *
 * 1. THREE OR FOUR CELLS. Not two: two cards side by side IS `Band`, and its
 *    closed set of five ratios (1-1, 1-2, 2-1, 2-3, 3-2) already covers every
 *    uneven pair, so a two-cell bento would be a second way to say a thing the
 *    site already says one way. Not five: a band is 1072px wide, five cells
 *    mean every small cell is under 260px at 1280 and a five-deep stack on a
 *    phone, and a composition the eye cannot take in at a glance has stopped
 *    being a composition and become a list. The constants are exported so a
 *    caller and a gate read the same number.
 *
 * 2. THE CLUSTER EXACTLY TILES A RECTANGLE. Every cell declares a footprint in
 *    grid units; the cluster packs them into a grid of `cols` columns and then
 *    PROVES the result: every unit of the rectangle claimed exactly once, and
 *    the areas summing to columns times rows. No hole, no overlap, no ragged
 *    edge. This is MODEL.md PART 9 clause 10 ("Three cells in a four-cell grid
 *    with a hole") stated as arithmetic instead of as a warning.
 *
 * 3. A MALFORMED CLUSTER THROWS. It does not self-omit and it does not draw a
 *    marker. The repo's convention is that a section with insufficient DATA
 *    self-omits silently, and that convention must not be extended here,
 *    because the two cases are not the same case: a builder returning nothing
 *    is the world being quiet, and a cluster whose spans do not tile is a
 *    caller that typed the wrong number. Self-omitting would delete a section
 *    from a page over a typo, which is precisely the failure the founder has
 *    named repeatedly ("a section deleted rather than replaced"); a rendered
 *    fault marker would ship the fault to a reader. A throw can do neither.
 *    The tiling is declared in the caller's own source, never composed from
 *    data, so a malformed cluster is deterministic: it fails on the first
 *    render, in the first gate, and can never reach a page. The cost is
 *    accepted deliberately , an exception during a page render takes the
 *    route down , because a hole in a band is a fault the founder has rejected
 *    by name and a page that quietly loses a card is worse than one that says
 *    so. A caller whose cell COUNT depends on data (a partner section that
 *    resolves for some countries and not others) does not pass a null cell; it
 *    chooses between `BentoBand` and `Band` before it builds the list, and
 *    `bentoFits` below is exported so it can ask without rendering.
 *
 * 4. THE COLLAPSE, AND IT IS CHECKED AT ALL THREE WIDTHS. A bento that only
 *    works at 1280 is worthless.
 *      1280 and up : the declared grid, 2 or 3 columns.
 *      768 to 1023 : two columns. A cell wider than two columns is capped at
 *                    two and the cluster is REPACKED and REPROVEN on the
 *                    narrower grid, so a 3-column cluster becomes a 2-column
 *                    one that still tiles (its rows grow instead).
 *      under 768   : one column, one cell per row, in declared order. Every
 *                    cell is 1x1 there, so the tiling is trivial and equal
 *                    heights are vacuous, which is the honest reading of
 *                    ruling 7 on a phone: nothing shares a level.
 *
 * 5. EQUAL HEIGHTS WITHIN A GRID ROW, BY CONSTRUCTION, NOT BY CONTENT LUCK.
 *    The grid stretches every cell to its row (`items-stretch` plus
 *    `[&>*]:h-full`, the same two `Band` uses), so two cells on one horizontal
 *    level share one bottom edge whatever is in them. A cell that cannot fill
 *    its height is redesigned, never unstretched.
 *
 *    ROWS ARE NOT EQUAL TO EACH OTHER, AND THAT IS DELIBERATE. The first
 *    version of this file forced every row to one height (`auto-rows-fr`) on
 *    the reading that ruling 7 demands it. It does not: his words are "two
 *    sections that sit on the SAME HORIZONTAL LEVEL should always have the same
 *    height", which binds a row and says nothing about one row against
 *    another. Forcing all rows equal was measurably worse, and the harness said
 *    so before anything shipped: in the four-cell story a wide 264px strip in
 *    the third row dragged the first two rows to 264 each, which stretched the
 *    spectra cell beside them from 313 to 560 and opened a 558 by 258 hole
 *    inside it. Each row now sizes to its own tallest cell.
 *
 *    WHAT A COMPOSER STILL OWES: a cell that spans two rows is stretched to the
 *    sum of them, so its content has to be about as tall as the stack beside
 *    it. That is the composition work, not a rule the component can do for the
 *    caller, and the gathered-emptiness check reports it card by card when the
 *    caller gets it wrong.
 *
 * 6. AT MOST ONE LOUD CELL IN A CLUSTER. MODEL.md PART 6: "At most one loud
 *    card per band." The cluster IS the band, so its accent budget is the
 *    band's: one accent-coloured figure across all its cells, which is also
 *    what the archetype harness already enforces per card.
 *
 * BLIND SPOT, STATED BEFORE THIS IS TRUSTED: the validator proves the DECLARED
 * spans tile. It cannot prove the browser drew them where they were declared,
 * because it never sees a box. That half is measured from the rendered
 * rectangles by `scripts/harness/check_archetypes.mjs` (TILING, CELL COUNT, NO
 * HOLE ON COLLAPSE) at all three widths, deliberately from the drawn boxes and
 * not from these numbers, because these numbers are the thing under test.
 */
import * as React from "react";
import { Box, Fig, Ico, SampleTag } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";

export const BENTO_MIN_CELLS = 3;
export const BENTO_MAX_CELLS = 4;

/** The columns a cluster may declare at the widest width. Closed on purpose,
 *  the same reason `Band`'s five ratios are closed: an open number is a
 *  different composition on every page. */
export type BentoCols = 2 | 3;

export type BentoCell = {
  /** Stable, unique inside the cluster; it is the name every red uses. */
  key: string;
  /** Columns this cell occupies at the widest width. */
  cols: 1 | 2;
  /** Rows this cell occupies at the widest width. */
  rows: 1 | 2;
  node: React.ReactNode;
};

type Placement = { key: string; col: number; row: number; cols: number; rows: number };

/**
 * FIRST FIT, TOP LEFT TO BOTTOM RIGHT, in the caller's declared order, which
 * is also the reading order a phone gets. The packer is deliberately dumb: a
 * cleverer one would find a tiling for spans a reader would not expect, and
 * then the composition on the page would stop matching the composition in the
 * source.
 */
function packBento(cells: BentoCell[], cols: number): { placements: Placement[]; rows: number } {
  const grid: boolean[][] = [];
  const rowAt = (r: number) => {
    while (grid.length <= r) grid.push(new Array(cols).fill(false));
    return grid[r];
  };
  const fits = (r: number, c: number, w: number, h: number) => {
    if (c + w > cols) return false;
    for (let rr = r; rr < r + h; rr++) {
      const row = rowAt(rr);
      for (let cc = c; cc < c + w; cc++) if (row[cc]) return false;
    }
    return true;
  };
  const placements: Placement[] = [];
  for (const cell of cells) {
    const w = Math.min(cell.cols, cols);
    const h = cell.rows;
    let placed = false;
    /* The ceiling is a guard, not a limit: four cells of at most two rows can
       never need more than eight rows, so reaching it means the packer is
       broken and the message should say that rather than hang. */
    for (let r = 0; r < 16 && !placed; r++) {
      for (let c = 0; c < cols; c++) {
        if (!fits(r, c, w, h)) continue;
        for (let rr = r; rr < r + h; rr++) {
          const row = rowAt(rr);
          for (let cc = c; cc < c + w; cc++) row[cc] = true;
        }
        placements.push({ key: cell.key, col: c, row: r, cols: w, rows: h });
        placed = true;
        break;
      }
    }
    if (!placed) throw new Error(`BentoBand: cell "${cell.key}" (${cell.cols}x${cell.rows}) could not be placed in a ${cols}-column cluster`);
  }
  return { placements, rows: grid.length };
}

/**
 * THE PROOF, and it is run on every packing at every width. Overlap cannot
 * happen under first fit; the assertion stays anyway, because the day the
 * packer changes is the day nobody remembers that it could not.
 */
function proveTiling(placements: Placement[], cols: number, rows: number, where: string): void {
  const claims: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (const p of placements) {
    for (let r = p.row; r < p.row + p.rows; r++) {
      for (let c = p.col; c < p.col + p.cols; c++) {
        if (r >= rows || c >= cols) throw new Error(`BentoBand ${where}: cell "${p.key}" runs outside the ${cols}x${rows} rectangle`);
        claims[r][c]++;
      }
    }
  }
  const holes: string[] = [];
  const overlaps: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (claims[r][c] === 0) holes.push(`column ${c + 1}, row ${r + 1}`);
      if (claims[r][c] > 1) overlaps.push(`column ${c + 1}, row ${r + 1}`);
    }
  }
  const area = placements.reduce((a, p) => a + p.cols * p.rows, 0);
  if (holes.length || overlaps.length || area !== cols * rows) {
    throw new Error(
      `BentoBand ${where}: the cells do not tile their ${cols}x${rows} rectangle. ` +
        `Areas sum to ${area} against ${cols * rows} units. ` +
        (holes.length ? `Unclaimed: ${holes.join("; ")}. ` : "") +
        (overlaps.length ? `Claimed twice: ${overlaps.join("; ")}. ` : "") +
        `A cluster that does not tile is a caller fault, not missing data.`,
    );
  }
}

/** Every tiling this cluster needs, proven, or a throw naming the width. */
function layoutBento(cells: BentoCell[], cols: BentoCols) {
  if (cells.length < BENTO_MIN_CELLS || cells.length > BENTO_MAX_CELLS) {
    throw new Error(`BentoBand: ${cells.length} cells. A cluster holds ${BENTO_MIN_CELLS} or ${BENTO_MAX_CELLS}: two cards in a row is Band, five is a list.`);
  }
  const keys = cells.map((c) => c.key);
  if (new Set(keys).size !== keys.length) throw new Error(`BentoBand: two cells share a key (${keys.join(", ")})`);
  for (const c of cells) if (c.node == null || c.node === false) throw new Error(`BentoBand: cell "${c.key}" has nothing to draw. An empty cell is the hole this component exists to stop; choose Band before building the list.`);
  const wide = packBento(cells, cols);
  proveTiling(wide.placements, cols, wide.rows, "at 1024 and up");
  const tablet = packBento(cells, 2);
  proveTiling(tablet.placements, 2, tablet.rows, "at 768 to 1023");
  return { wide, tablet };
}

/**
 * Would this set of cells make a cluster? Exported so a caller whose cell
 * count depends on data can ask before it commits, rather than discovering the
 * answer as a thrown page.
 */
export function bentoFits(cells: BentoCell[], cols: BentoCols): boolean {
  try {
    layoutBento(cells, cols);
    return true;
  } catch {
    return false;
  }
}

/* THE PLACEMENT CLASSES ARE LITERALS, not composed strings, because Tailwind
   scans source text and a class built at runtime is a class that never reaches
   the stylesheet. Every value this component can emit is written out here
   once. */
const LG_COL_START = ["lg:col-start-1", "lg:col-start-2", "lg:col-start-3"];
const LG_COL_SPAN = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-3"];
const LG_ROW_START = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3", "lg:row-start-4"];
const LG_ROW_SPAN = ["lg:row-span-1", "lg:row-span-2"];
const MD_COL_START = ["md:col-start-1", "md:col-start-2"];
const MD_COL_SPAN = ["md:col-span-1", "md:col-span-2"];
const MD_ROW_START = ["md:row-start-1", "md:row-start-2", "md:row-start-3", "md:row-start-4"];
const MD_ROW_SPAN = ["md:row-span-1", "md:row-span-2"];
const LG_GRID: Record<BentoCols, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" };

/**
 * The band itself. It IS the band, never a child of one: `Band` wrapping this
 * would put a single child in a row and the model's LONE CARD rule would fire
 * on the wrapper, correctly.
 *
 * THE CLUSTER NAMES ITSELF TO THE CHECKERS (plan step 32, second dispatch,
 * 2026-09-18, the first real cluster on a page: the city's `04 premises`).
 * `data-band="bento"` on the root says the root is the band, because the
 * model-laws checker infers a card's band from its parent and a cell's
 * parent here is its own placement wrapper, one child each: LONE CARD read
 * a four-cell cluster as four lone cards until the root declared itself
 * (check_model_laws.mjs, the BAND note). `id` reaches the root and stamps
 * `data-block` the way the kit's Box does for a section card (a cluster with
 * an id is a section by construction), so BLOCK FLOOR counts the cluster
 * once, MODEL.md 8.3's own count ("the bento counted as one"), and the two
 * checkers address every cell by the cluster's id: the cluster is the
 * section, and a cell of it is not a section of its own. A cluster in a
 * story passes no id and is no block, as before.
 */
export function BentoBand({ id, cols, cells }: { id?: string; cols: BentoCols; cells: BentoCell[] }) {
  const { wide, tablet } = layoutBento(cells, cols);
  const wideBy = new Map(wide.placements.map((p) => [p.key, p]));
  const tabletBy = new Map(tablet.placements.map((p) => [p.key, p]));
  return (
    /* mt-8 and gap-8 are `Band`'s own rungs of the spacing ladder (chapter 48,
       band 32, card padding 16/20/28, slot 8): a bento sits in the same rhythm
       as every other band or it reads as a different page. */
    <div
      id={id}
      data-block={id}
      data-band="bento"
      data-archetype="bento-band"
      data-bento-cells={cells.length}
      data-bento-cols={cols}
      className={`mt-8 grid grid-cols-1 items-stretch gap-8 [&>*]:h-full md:grid-cols-2 ${LG_GRID[cols]}`}
    >
      {cells.map((cell) => {
        const w = wideBy.get(cell.key)!;
        const t = tabletBy.get(cell.key)!;
        const cls = [
          MD_COL_START[t.col],
          MD_COL_SPAN[t.cols - 1],
          MD_ROW_START[t.row],
          MD_ROW_SPAN[t.rows - 1],
          LG_COL_START[w.col],
          LG_COL_SPAN[w.cols - 1],
          LG_ROW_START[w.row],
          LG_ROW_SPAN[w.rows - 1],
        ].join(" ");
        return (
          <div key={cell.key} data-bento-cell={cell.key} className={`min-w-0 ${cls}`}>
            {cell.node}
          </div>
        );
      })}
    </div>
  );
}

/* ===================== THE TWO CELL TYPES HE NAMED ===================== */

/**
 * BentoMetric , "a single important metric that lives standalone" (B4).
 *
 * One large figure at the focal rung with its label and a short basis line,
 * and nothing else. His reference draws this as a ring; it is NOT a ring here,
 * and the reason is that a ring is a share mark. It draws a part against a
 * whole, and a standalone metric has no whole to draw one against, so the ring
 * around it would be decoration sitting on top of data, which this site bans.
 * The kit already holds `Gauge` for a bounded reading and `Donut` for a share;
 * a third circular form for a figure that is neither would be a fourth way of
 * saying nothing. What ports from his reference is the CELL: one number, big,
 * alone, with room around it.
 *
 * THE EMPTINESS IS DISTRIBUTED, NOT GATHERED, and that is a composition
 * decision rather than a way past a gate. A small cell in a tall grid row has
 * spare height by construction (ruling 7 stretches it to its neighbour). Piled
 * at the bottom it is the hole the founder rejects by name; opener at the top,
 * figure centred in what is left, basis pinned at the foot, it is the shape
 * his own reference draws.
 *
 * TWO LAWS ADDED FOR THE CELL'S FIRST STANDALONE SEAT, the country page's
 * `04 entry-bill` (MODEL.md 8.2, "BentoMetric plus its two missing laws";
 * plan step 31, third dispatch, 2026-09-17). The cluster form and the
 * standalone card are ONE component; both laws are optional props, so a
 * cluster cell that needs neither draws exactly what it drew before.
 *
 *  1. A SECOND FIGURE AT THE LEAD RUNG, `second`. Under a `--c-border`
 *     hairline, one figure at `--t-lead` 16, `.fig`, weight 600, `--c-ink`,
 *     then its words on the same line at `--t-body` 14 `--c-ink2` ("21 days
 *     until you can trade"). It is RangeStrip's own `extra` idiom (a single
 *     extra figure under a hairline, its line 34) lifted from 14 to the lead
 *     rung, because this figure is a different quantity from the focal and
 *     cannot share its rung without breaking FOCAL (PART 4: one 30 a card,
 *     nothing between 16 and 30). Nothing else in the cell sits above 16.
 *     Since plan step 33's second dispatch (2026-09-18) the slot also takes
 *     an ARRAY of companions on the one hairline row (`CompanionRow`, the
 *     trade page's `04 open`: months to break even beside years to pay
 *     back), the same rung and the same words idiom, two figures where the
 *     composition names two; a single companion draws exactly as before.
 *  2. THE WITHHELD LINE, PART 5's shape ("a cell that cannot hold an honest
 *     figure is WITHHELD with a stated line ... never filled with a word,
 *     never left deliberately empty, and never clipped"). Either slot can be
 *     withheld: `withheld` stands where the focal would, at `--t-lead` 16 in
 *     `--c-ink2`, the drawn blocked seat's own line (BlockedSeat.tsx), and a
 *     `second` of the shape `{ withheld }` stands in the second slot at the
 *     same rung. A withheld figure is never printed and never replaced by a
 *     word; the line says what is missing and why. PART 4 is explicit that a
 *     card whose figure is merely withheld is NOT exempt from FOCAL: its
 *     line stands at 16 where the focal would and the finding stays until
 *     the data lands, so a standalone card with its focal withheld reds
 *     FOCAL on purpose.
 *
 *  BOTH DIRECTIONS ARE ENFORCED, the way MarkList enforces its withheld
 *  count: a cell given neither `figure` nor `withheld` is a figure dropped in
 *  silence, and a cell given both is a card apologising for nothing. Each
 *  THROWS, by law 3 above: the pair is composed in a builder from data, but
 *  which of the two a builder passes is the builder's own logic, so the fault
 *  is deterministic and fails in the first gate, never on a reader.
 *
 *  THE FOOT, `foot`, is PART 7's own fourth part ("where earned, one line, a
 *  coverage statement or one companion figure, never a verdict"), at
 *  `--t-micro` under the basis; the bill's is the exclusion the reader needs
 *  ("Share capital, where the law asks for one, is not in the bill."). And
 *  the BASIS is optional for exactly one case: a card that prints no figure
 *  at all (both slots withheld) has no unit to say, because a basis
 *  describes a printed figure (the glance's rule, glance_rows.ts: a unit is
 *  said for every cell the card prints and for none it withholds).
 *
 *  `id` reaches the kit's Box, which stamps it as `data-block` so BLOCK FLOOR
 *  counts the standalone card (a cluster cell has no id and is not a block on
 *  its own); `lean` stamps `data-lean="1"`, the kit's own rule for a lone
 *  survivor holding one figure (Band: it takes the narrow column, so the air
 *  falls outside its edge), inert while the card has a partner.
 *  `data-archetype="bento-metric"` names the form to the three checkers
 *  (check_archetypes reads it as the story's card; check_page_holes and
 *  check_model_laws read it as the card's form, not exempt from NO LEAD or
 *  FOCAL); inside a cluster the wrapper's `bento-band` comes first in
 *  document order and still wins, measured on the three cluster stories.
 */
/** One companion figure at the lead rung with its words: "21 days" "until you can trade". */
export type Companion = { figure: string; words: string };

/**
 * THE COMPANION ROW, law 1's markup once, drawn for one companion (the
 * country's entry bill: the days until trading) or for two on the same
 * hairline row (the trade page's `04 open`, MODEL.md 8.6: months to break
 * even and years to pay back, "two figures on one hairline row, the strip's
 * extra idiom"). Each figure at `--t-lead` 16, `.fig`, weight 600, `--c-ink`,
 * its words beside it at `--t-body` 14 `--c-ink2`; the pairs wrap as a unit
 * where the card is too narrow for both. Exported so RankedBars draws its
 * foot from this one function rather than a second copy of the row (the
 * hatch's precedent: one pattern, imported, never reinvented).
 */
export function CompanionRow({ items }: { items: Companion[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
      {items.map((c, i) => (
        <span key={`${c.figure}-${i}`} data-companion className="inline-flex flex-wrap items-baseline gap-x-1.5">
          <Fig className="text-[length:var(--t-lead)] font-semibold leading-none text-[var(--c-ink)]">{c.figure}</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{c.words}</span>
        </span>
      ))}
    </div>
  );
}

export function BentoMetric({
  id,
  kicker,
  icon,
  figure,
  withheld,
  second,
  label,
  basis,
  foot,
  sample = false,
  accent = false,
  lean = false,
}: {
  /** The section's id when the cell stands alone as a block; a cluster cell passes none. */
  id?: string;
  kicker: string;
  icon?: AtlasIconId;
  /** The focal figure, as printed. Given INSTEAD of `withheld`, never with it. */
  figure?: string;
  /** The stated line where the focal would stand, when the figure is withheld (law 2). Given INSTEAD of `figure`. */
  withheld?: string;
  /** The second figure at the lead rung under a hairline with its words, or the line that stands in its slot (laws 1 and 2); or TWO companions on that one hairline row (the trade page's `04 open`, MODEL.md 8.6: months to break even, years to pay back). */
  second?: Companion | Companion[] | { withheld: string };
  /** OPTIONAL, AND USUALLY LEFT OUT. A line under the figure saying what the
   *  figure is, for the case where the opener above cannot say it. When the
   *  opener already does ("What it costs to register" over "$15"), a label is
   *  the same sentence twice, and the cost is not only the repetition: the
   *  extra line makes the cell about 40px taller, and two of these stacked
   *  beside a tall cell then stretch it past its own content and open a hole
   *  in it. Measured, on this component's own stories, before the line came
   *  out. */
  label?: string;
  /** What is measured and in what unit. It says what the figure is, never what it means. Absent only when no figure prints. */
  basis?: string;
  /** PART 7's foot, where earned: one line under the basis, never a verdict. */
  foot?: string;
  sample?: boolean;
  accent?: boolean;
  /** The kit's lone-survivor rule: a one-figure card takes the narrow column when it stands alone in a band. */
  lean?: boolean;
}) {
  if (figure == null && withheld == null) throw new Error(`BentoMetric "${kicker}": neither a figure nor a withheld line. A figure withheld without a stated line is a silent drop (PART 5); pass one of the two.`);
  if (figure != null && withheld != null) throw new Error(`BentoMetric "${kicker}": a figure and a withheld line together. A line beside a printed figure apologises for nothing; pass one of the two.`);
  return (
    <Box id={id} data-lean={lean ? "1" : undefined} className="flex h-full flex-col" data-archetype="bento-metric" data-bento-kind="metric">
      <div className="mb-1.5 flex items-center gap-2">
        {icon ? <Ico id={icon} /> : null}
        <h3 data-typography="custom" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{kicker}</h3>
        {sample ? <SampleTag /> : null}
      </div>
      <div className="flex flex-1 flex-col justify-center py-2">
        {figure != null ? (
          <Fig className={`block text-[length:var(--t-focal)] font-semibold leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{figure}</Fig>
        ) : (
          <p data-withheld-line="focal" className="text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{withheld}</p>
        )}
        {label ? <div className="mt-2 text-[length:var(--t-body)] text-[var(--c-ink2)]">{label}</div> : null}
      </div>
      {second ? (
        <div data-second className="mb-3 border-t border-[var(--c-border)] pt-3">
          {Array.isArray(second) ? (
            <CompanionRow items={second} />
          ) : "figure" in second ? (
            <CompanionRow items={[second]} />
          ) : (
            <p data-withheld-line="second" className="text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{second.withheld}</p>
          )}
        </div>
      ) : null}
      {basis ? <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{basis}</p> : null}
      {foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</p> : null}
    </Box>
  );
}

/**
 * BentoCount , "weeks of paid leave per year" (B4): a count you can also see.
 *
 * A figure that is a count out of a whole, drawn so THE WHOLE IS VISIBLE and
 * the part is read against it. His reference is a big figure over a dot grid,
 * and that is what this draws.
 *
 * WHY NOT THE KIT'S `Dots`, WHICH LOOKS LIKE THIS ALREADY. It was measured
 * against this and refused for a reason that belongs in the form: `Dots` draws
 * ONE ROW that never wraps, at 7px a dot, so a whole over about a dozen runs
 * off the side of a card at 375, and a whole of 52 (his own example, weeks in
 * a year) is not drawable in it at any width. It is right for a 0 to 5
 * paperwork score inside a table row and wrong for a cell whose whole subject
 * is the size of the whole. This grid wraps, and its units are large enough to
 * be counted rather than merely compared.
 *
 * THE COLOUR. Filled units are `--terra`, the rest `--c-soft2` with a hairline
 * so the whole stays visible when the part is small. The figure follows its
 * fill into `--terra-text` (PART 6: fills follow their figure), which makes
 * this the cluster's ONE loud cell; a page adopting it spends one of its three
 * accents and names it in the page's brief. `accent={false}` returns the cell
 * to ink for a page that has already spent its three.
 *
 * AND THE UNITS RETURN WITH IT. Until plan step 32's second dispatch
 * (2026-09-18) the units never read `accent`: a cell returned to ink still
 * drew its filled units in `--terra`, a second terracotta fill in the cluster
 * beside the lit cell, found by the city premises mockup (04-premises.html,
 * 2026-09-16) and by the art-direction gate's C2, which counts a `--terra`
 * background as a mark. PART 6 gives a card with no accent figure its leader
 * mark in `--c-ink2` and the rest in `--c-soft2`, so that is what an ink
 * count draws now: the fill follows the figure in both directions.
 *
 * THE GRID'S HEIGHT FOLLOWS THE WHOLE, WHEN THE CELL STANDS TALL: `columns`
 * (plan step 32, second dispatch, 2026-09-18, for the city's `04 premises`).
 * By default the units are 10px squares that wrap to the cell's width, so a
 * whole of 100 in a 300px cell is five rows, 66px tall, whatever the cell's
 * height. MODEL.md 8.3 makes the count the cluster's one tall cell "because
 * a dot grid of 100 is the one drawing", and a cell spanning two rows is
 * stretched to the stack beside it, so its content has to be about as tall
 * as that stack (BentoBand law 5, the composer's work). Measured on Abidjan
 * at 768 with the default wrap: the grid 66px, 82px of air above the figure
 * and 70 below, and the page filter red on a 234 by 120 blank (the air above
 * joined to the figure row's right side) while London and Frankfurt, whose
 * cells beside the count wrapped one line less, passed by three pixels.
 * `columns` fixes the units in a row and sizes each to the cell's width
 * (a CSS grid of equal square cells), so the grid's height is set by the
 * whole and the column count and not by the cell's width: a whole of 100 in
 * fifteen columns is seven rows, about 140px at a 300px cell, and the air
 * on either side of the figure falls to a few dozen pixels at every width.
 * Left out, the cell draws exactly what it drew before; the three older
 * stories pass nothing.
 *
 * A COUNT THAT IS THE WHOLE SAYS NO "of N" (plan step 34's second dispatch,
 * 2026-09-18, the industry page's starting crew, MODEL.md 8.7 `05 pays`:
 * "4 to 8 people drawn as units, the part inked"). A crew of eleven is
 * eleven units, every one of them the part: the whole is the count itself,
 * so "11 of 11" would say one number twice and read as a share of nothing.
 * When the part equals the whole the figure alone says the whole, the
 * drawing shows it, and the aria label counts it once; a part short of its
 * whole prints "of N" exactly as before, so the three older callers (chains
 * of 100, closures of 100, shops of 100) draw what they drew.
 */
export function BentoCount({
  kicker,
  icon,
  part,
  whole,
  label,
  basis,
  sample = false,
  accent = true,
  columns,
}: {
  kicker: string;
  icon?: AtlasIconId;
  part: number;
  whole: number;
  /** OPTIONAL, the same rule as `BentoMetric`'s: left out wherever the opener
   *  already names what is being counted. It is still used for the drawing's
   *  own screen-reader name when it is given. */
  label?: string;
  basis: string;
  sample?: boolean;
  accent?: boolean;
  /** The units in a row, each sized to the cell's width, for a cell that stands tall (the note above). Left out: 10px units wrapping to the width. */
  columns?: number;
}) {
  /* A count that is not a count self-omits rather than drawing a wrong whole:
     a part over its whole, a negative part, or a whole of nothing. */
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole < 1 || part < 0 || part > whole) return null;
  const units = Array.from({ length: Math.round(whole) });
  const filled = Math.round(part);
  /* The count is the whole: the figure says it once (the note above). */
  const isWhole = filled === Math.round(whole);
  return (
    <Box className="flex h-full flex-col" data-bento-kind="count" data-count-whole={isWhole ? "1" : undefined}>
      <div className="mb-1.5 flex items-center gap-2">
        {icon ? <Ico id={icon} /> : null}
        <h3 data-typography="custom" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{kicker}</h3>
        {sample ? <SampleTag /> : null}
      </div>
      <div className="flex flex-1 flex-col justify-center py-2">
        <div className="flex items-baseline gap-1.5">
          <Fig className={`block text-[length:var(--t-focal)] font-semibold leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{filled}</Fig>
          {/* THE WHOLE IS SAID AS WELL AS DRAWN. The grid below carries it for
              the eye; a reader who counts nothing still reads "of 8" here.
              Unless the count IS the whole, when the figure has already said it. */}
          {isWhole ? null : <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">of {Math.round(whole)}</span>}
        </div>
        <div
          className={columns ? "mt-2.5 grid gap-[4px]" : "mt-2.5 flex flex-wrap gap-[4px]"}
          style={columns ? { gridTemplateColumns: `repeat(${Math.max(1, Math.round(columns))}, minmax(0, 1fr))` } : undefined}
          role="img"
          aria-label={isWhole ? `${filled}, ${label ?? kicker}` : `${filled} out of ${Math.round(whole)}, ${label ?? kicker}`}
        >
          {units.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={columns ? "aspect-square w-full rounded-[2px] border" : "h-[10px] w-[10px] rounded-[2px] border"}
              style={
                i < filled
                  ? accent
                    ? { background: "var(--terra)", borderColor: "var(--terra)" }
                    : { background: "var(--c-ink2)", borderColor: "var(--c-ink2)" }
                  : { background: "var(--c-soft2)", borderColor: "var(--c-border)" }
              }
            />
          ))}
        </div>
        {label ? <div className="mt-2.5 text-[length:var(--t-body)] text-[var(--c-ink2)]">{label}</div> : null}
      </div>
      <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
    </Box>
  );
}
