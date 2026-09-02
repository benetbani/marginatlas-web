"use client";
/**
 * Client interactives for the cell page that are NOT part of the money-chapter
 * subtype propagation: the sortable Nearby comparison table (click-to-sort, a
 * keeps-per-$1 rate column proving the section's own verdict; figures + bold-best
 * only, the in-cell bars are gone per rulebook v1 sections 22/25), the Wages
 * mid-pay figures + track-free range brackets (permanently visible, rulebook v2
 * S6), and the Risks dot plot on a shared labeled 0-10 scale. Kept out
 * of money-chapter.tsx
 * because they do not read the FormatContext. All prose from the seed.
 */
import * as React from "react";
import { Box, Rail, Fig, EaseScale, InfoTip, InlineDisclosure, usd } from "@/components/spine/kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const money = usd; // ONE money grammar page-set-wide (kit usd: exact below $10,000, $426K, $1.4M)

type Col = { key: string; label: string; unit: string; get: (x: any) => number; cell: (v: number) => string };

/* Nearby , WI-4 brief (enriched, Final Ascent; rulebook v2 corrections 2026-07-10
 * drop the hand-rolled surface_line div , a verdict outside Rail that claimed "keeps
 * the least per dollar"): the table CARRIES that claim itself, needing no sentence
 * to assert it , a sortable keeps-per-$1 column (take over turnover, in cents),
 * default sort, proves it directly. The in-cell CellScaleBars are DELETED
 * (rulebook v1 sections 22/25, founder G2/G11: figures + bold-best carry each
 * column's winner; a table you read like a sentence, not a chart you study).
 * terracotta target: ONE , the keeps-per-$1 winner's figure. Best in the other
 * columns is semibold ink; the sort header, HERE tag and row tint are ink/neutral chrome. */
export function Nearby({ d }: { d: any }) {
  const rows: any[] = d.nearby?.places ?? [];
  // Column presence: keep only the columns for which EVERY row carries a real
  // value. On promotion the peers hold name + turnover only (no honest per-peer
  // take-home / break-in), so those columns , and the derived keeps-per-$1 ,
  // drop out; the full seed keeps all four. Turnover is always present.
  const hasTake = rows.length > 0 && rows.every((r) => typeof r.take_home_usd === "number");
  const hasBrk = rows.length > 0 && rows.every((r) => typeof r.break_in_0_100 === "number");
  const cols: Col[] = [
    { key: "rev", label: "Turnover", unit: "$/yr", get: (x) => x.rev_p50_usd, cell: (v) => money(v) },
    ...(hasTake ? [{ key: "take", label: "Owner keeps", unit: "$/yr", get: (x: any) => x.take_home_usd, cell: (v: number) => money(v) } as Col] : []),
    ...(hasTake ? [{ key: "rate", label: "Keeps per $1", unit: "c", get: (x: any) => (x.rev_p50_usd ? (x.take_home_usd / x.rev_p50_usd) * 100 : 0), cell: (v: number) => v.toFixed(1) + "c" } as Col] : []),
    ...(hasBrk ? [{ key: "brk", label: "Ease of entry", unit: "/10", get: (x: any) => x.break_in_0_100, cell: (v: number) => "" + Math.round(v / 10) } as Col] : []),
  ];
  // Default sort: keeps-per-$1 when present (proves the section's verdict),
  // else turnover. Never a key that no longer exists.
  const defaultSort = hasTake ? "rate" : "rev";
  const [sortKey, setSortKey] = React.useState<string>(defaultSort);
  const col = cols.find((c) => c.key === sortKey) ?? cols[0];
  const best: Record<string, number> = {};
  cols.forEach((c) => (best[c.key] = Math.max(...rows.map((r) => c.get(r)))));
  const sorted = [...rows].sort((a, b) => col.get(b) - col.get(a));
  // Grid template adapts to the live column count (place + N metric columns), so
  // a promoted table with turnover only reads as a clean two-column list rather
  // than a five-slot grid with three empty tracks.
  const gridCols = `1.3fr ${cols.map(() => "1fr").join(" ")}`;

  return (
    <Box id="peers">
      {/* same section-opener treatment as sibling cards (Rail kicker, not a bold Head) */}
      <Rail icon="compare" kicker="The same trade, comparable places" sample />
      {/* A REAL TABLE, because this is a real table.
          It was a grid of plain boxes: places down the side, metrics across the
          top, a header row, click-to-sort and a sorted-direction attribute, and
          not one table element in it. Measured before changing anything:
          FOUR sorted-direction attributes, all four sitting on buttons, where
          that attribute means nothing and is discarded.
          SIXTEEN column labels that vanish above 640 pixels. Each figure carries
          a small label naming its column, and that label is hidden on anything
          wider than a phone, because on a wide screen the column header does the
          naming. Except there was no column header, only a box that looked like
          one. So the desktop reading was a place name followed by four bare
          numbers: "Birmingham, $340K, $39K, 11.5c, 5". Nothing said which was
          which. The phone reading was better than the desktop one.
          The structure now carries the meaning: real column headers, a real row
          header per place, and the sort state on the header where it is read.
          The small labels stay for the phone layout, and above it the header
          does the work it was always drawn to look like it was doing. */}
      <Table className="text-[length:var(--t-micro)]">
        <caption className="sr-only">
          The same trade in comparable places, sorted by {col.label.toLowerCase()}, highest first.
        </caption>
        <TableHeader className="hidden sm:table-header-group">
          <TableRow className="border-[var(--c-border)] hover:bg-transparent">
            <TableHead scope="col" className="h-auto w-[30%] px-0 pb-2 text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
              Place
            </TableHead>
            {cols.map((c) => {
              const on = c.key === sortKey;
              return (
                <TableHead
                  key={c.key}
                  scope="col"
                  aria-sort={on ? "descending" : "none"}
                  className="h-auto px-0 pb-2 text-right"
                >
                  <span className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setSortKey(c.key)}
                      className={`flex items-center gap-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide transition-colors ${on ? "text-[var(--c-ink)]" : "text-[var(--c-muted)] hover:text-[var(--c-ink2)]"}`}
                    >
                      <span>{c.label} <span className="font-normal lowercase tracking-normal">({c.unit})</span></span>
                      <span aria-hidden className={`fig text-[length:var(--t-mark)] ${on ? "opacity-100" : "opacity-30"}`}>{on ? "↓" : "↕"}</span>
                    </button>
                    {/* rulebook 40: the coined "keeps per $1" metric carries its gloss as a "?"
                        InfoTip on the header (OUTSIDE the sort button, no nested buttons), which
                        replaces the glued definition caption that used to sit under the table. */}
                    {c.key === "rate" ? <InfoTip gloss="The owner's yearly take for every dollar of turnover." /> : null}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow
              key={r.name}
              className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-md border border-[var(--c-border)] p-3 hover:bg-transparent sm:table-row sm:gap-0 sm:rounded-none sm:border-0 sm:border-b sm:p-0"
              style={r.home ? { background: "var(--c-soft)" } : undefined}
            >
              <TableHead
                scope="row"
                className="col-span-2 h-auto px-0 py-0 text-left text-[length:var(--t-body)] font-medium text-[var(--c-ink)] sm:table-cell sm:py-2.5 sm:align-middle"
              >
                <span className="block min-w-0 truncate">
                  {r.name}
                  {r.home ? <span className="ml-1.5 text-[length:var(--t-mark)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">here</span> : null}
                </span>
              </TableHead>
              {cols.map((c) => {
                const v = c.get(r);
                const isBest = v === best[c.key];
                const crowned = c.key === "rate" && isBest; // the ONE terracotta accent in this card
                return (
                  <TableCell key={c.key} className="min-w-0 px-0 py-0 align-middle sm:table-cell sm:py-2.5 sm:text-right">
                    <span className="block text-[length:var(--t-mark)] uppercase tracking-wide text-[var(--c-muted)] sm:hidden">{c.label}</span>
                    <Fig className={`text-[length:var(--t-micro)] ${crowned ? "font-semibold text-[var(--terra-text)]" : isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink)]"}`}>{c.cell(v)}</Fig>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* THE DISCLOSURE SAT WHERE THE NUMBERS ARE NOT. This card declares itself a
          sample at its head, and the tables only other caption is screen-reader
          only, so a sighted reader who scrolls down to four named cities and four
          exact turnover figures has nothing beside those figures saying what they
          are. A tag forty pixels above a table gets read once, on the way past;
          the figures get read one at a time, and each one reads as a measurement.
          One line, at the point of reading, in the same words the tag uses. */}
      <p className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Illustrative. These are not measurements taken in each city.</p>
      {/* the glued definition + "read like for like" instruction caption is DELETED
          (rulebook 26/40): the unit lives in the column header "(c)" and its InfoTip, and
          the section's own kicker already states the "same trade, comparable places" scope. */}
    </Box>
  );
}

/* Wages , "What each role is paid", and A8 OF THE SUBSECTION QUEUE.
 *
 * WARRANT (procedure step 1). A visitor reads this to decide WHAT THEY MUST
 * OFFER TO FILL EACH ROLE, and which of those wages they can move. Without it
 * they would budget one figure a role, discover the market's floor sits above
 * it for the role they cannot open without, and find out too late that the
 * cheapest role has no room in it at all.
 *
 * NOT THREE RANGE BRACKETS, AND NOT A GROUPED ONE EITHER, which is the decision
 * this row turned on and it is worth writing out because the queue predicted
 * both.
 *
 * THREE BRACKETS ARE FORBIDDEN BY THE CAP, and the arithmetic is simpler than
 * the note that reopened it. RangeBracket declares data-idea="I12" per
 * instance, SPAN is capped at two a page, and three is more than two whether or
 * not any other section has spent one. They are also the same shape three times
 * in one card, which is the sameness this whole effort exists to end, and each
 * one sets its typical at the focal rung, so the card would hold three figures
 * competing to be read first and therefore no answer at all.
 *
 * A GROUPED RANGE FORM IS NOT IN THE CATALOGUE, and inventing one is rule 0's
 * ban. The nearest thing that exists, SpreadStrip, is a horizontal track and
 * this page is at the track cap of two. So step 3's own escape applies: when
 * every form the named type points at is unavailable, the information was named
 * wrongly. Three roles, each carrying a lowest, a typical and a highest, is not
 * three ranges read one at a time. It is ENTITIES ACROSS SEVERAL METRICS, whose
 * catalogue row is a table, idea I8, free. The reader compares roles down the
 * columns, which is what a table is for and what three stacked brackets cannot
 * do at all.
 *
 * WHAT WAS HERE, AND WHY IT HAD TO GO. Three range brackets on a shared rail,
 * hand-rolled inline, carrying no data-idea: the catalogue addendum's "where
 * the sameness actually lives", and the three tracks that put this page at five
 * against a cap of two the moment anyone declared them. They also could not be
 * read. The card's own comment said so: the low and the high existed only in
 * the description a screen reader hears, so a sighted reader got a bracket on a
 * scale and could recover neither end. The table prints all nine figures.
 *
 * A ROLE PAID ONE RATE PRINTS THE SAME FIGURE THREE TIMES, and that is the
 * honest picture rather than a rendering fault. Every cell that carries wages
 * has one such role, the kitchen porter here at 24K and the junior stylist in a
 * salon, and the drawing this replaces had already been corrected once for
 * making that role look like a role with no figures at all. Empty cells would
 * reintroduce exactly that.
 *
 * THE CARD HAS NO ACCENT, and that is inherited rather than newly decided: a
 * head-chef row is a roster position, not an answer, so the figures are the
 * read. Rule 29A would forbid the obvious alternative anyway, because a wage is
 * a burden and terracotta never marks the dearest of anything.
 *
 * width: two fifths of the band, beside the money waterfall.
 */
export function Wages({ d }: { d: any }) {
  const roles: any[] = d.wages?.roles ?? [];
  if (roles.length === 0) return null;
  /* A FOURTH PRIVATE FORMATTER STOOD HERE AND IS GONE (C29, 2026-09-02): a local
     `kUsd` that rounded every wage to the nearest thousand and printed a K
     whatever the magnitude, so a role paid $4,200 a year read "$4K" and one paid
     $600 read "$1K". The three figures use this file's own `money` now, which is
     the kit's ratified formatter. London's roles are all above $10,000, so no
     committed render moves; the card renders on every cell page in the atlas,
     including the ones where a kitchen porter is paid four figures. */
  /* DEAREST FIRST, sorted here rather than trusted from the adapter, because
     the order is the reading: a budget starts at the hire that costs most. */
  const rows = [...roles].sort((a, b) => (b.mid_usd ?? 0) - (a.mid_usd ?? 0));
  /* A ROLE WITH NO TYPICAL HAS NOTHING FOR THE MIDDLE COLUMN TO SAY, so it is
     dropped rather than printed as a zero or a dash beside two real ends. */
  const kept = rows.filter((r) => Number.isFinite(r.mid_usd));
  if (kept.length === 0) return null;
  /* Number.isFinite FIRST: two undefined ends are equal to each other, so the
     bare comparison printed the one-rate caveat for a role that simply carries
     no ends at all. */
  const flat = kept.some((r) => Number.isFinite(r.low_usd) && r.low_usd === r.high_usd);
  return (
    <Box id="wages">
      <Rail icon="wages" kicker="What the team costs" sample />
      {/* THE TABLE IS THE FORM, idea I8, and its craft is the alignment. Every
          role's three figures sit on ONE baseline, so a row reads as one span
          rather than as three separate facts, and every column's digits line up
          under each other, so a reader compares roles by looking down rather
          than by reading across three times.
          SIZE CONTRAST CARRIES THE MEANING: the typical stands at the section
          rung against its own two ends at body, 24 against 14, so each row says
          "this much, and it can move between these" in one glance. The column
          of typicals is therefore the first thing on the card and the ends are
          the second, which is the same hierarchy the catalogue's own span form
          uses and the reason this reads as its relative rather than as a
          different idea wearing a table.
          LOW, TYPICAL, HIGH IN THAT ORDER, left to right, and in the span
          form's own words: those are RangeBracket's default end labels, and its
          own layout puts the low at the left, the typical between and the high
          at the right. A reader who has met one meets the other
          in the same arrangement. */}
      {/* NO mt HERE. The Rail already carries 8 below it, which is the spacing
          ladder's slot rung, and adding 4 made the gap 12, a value between two
          rungs, which is the same fault this loop has now found four times. */}
      <div data-idea="I8">
        <table className="w-full table-fixed border-collapse">
          {/* THE TYPICAL COLUMN IS THE WIDEST OF THE THREE, because it holds the
              largest type. At four equal-ish columns a 24px figure filled its
              cell edge to edge and sat about eight pixels from the 14px figure
              beside it at 375, which is the collision fault class one measurement
              short of happening. */}
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "21%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--c-border)]">
              {/* the corner cell labels nothing, so it declares nothing */}
              <th className="pb-2" />
              <th scope="col" className="pb-2 pl-2 text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Low</th>
              <th scope="col" className="pb-2 pl-2 text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">Typical</th>
              <th scope="col" className="pb-2 pl-2 text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">High</th>
            </tr>
          </thead>
          <tbody>
            {kept.map((r) => (
              <tr key={r.role} className="border-b border-[var(--c-border)] last:border-b-0">
                <th scope="row" className="py-2 pr-2 text-left align-baseline text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">{r.role}</th>
                <td className="py-2 pl-2 text-right align-baseline text-[length:var(--t-body)] text-[var(--c-ink2)]">
                  {Number.isFinite(r.low_usd) ? <Fig>{money(r.low_usd)}</Fig> : null}
                </td>
                <td className="py-2 pl-2 text-right align-baseline text-[length:var(--t-section)] leading-none text-[var(--c-ink)]">
                  <Fig>{money(r.mid_usd)}</Fig>
                </td>
                <td className="py-2 pl-2 text-right align-baseline text-[length:var(--t-body)] text-[var(--c-ink2)]">
                  {Number.isFinite(r.high_usd) ? <Fig>{money(r.high_usd)}</Fig> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* THE UNIT, AND THEN THE ONE CAVEAT THE TABLE CANNOT STATE ABOUT
            ITSELF. The second sentence renders only when a role in this cell
            actually pays one rate, so a page where every role has a spread is
            never told about a case it does not contain. */}
        <p className="mt-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
          Pay a year, for one person in the role.{flat ? " A role that pays one rate shows the same figure three times." : ""}
        </p>
      </div>
    </Box>
  );
}

/* Risks , WI-3 brief (enriched, Final Ascent):
 * decision: what actually closes these kitchens. ALL FOUR scores visible on ONE shared
 * labeled scale, flipped to the PAGE scale (high = good): each danger score becomes a
 * safety read (safe = 11 - score, clamped 1..10), most-dangerous first, so the /10
 * convention means the same thing everywhere on the page. Notes sit behind the
 * disclosure. width: rail half. terracotta target: none (ink markers; the set is the read). */
export function Risks({ d }: { d: any }) {
  const arr: any[] = d.risks?.items ?? [];
  if (arr.length === 0) return null;
  const rows = arr
    .map((r) => ({ r, safe: Math.max(1, Math.min(10, 11 - r.score_1_10)) }))
    .sort((a, b) => a.safe - b.safe)
    .map(({ r, safe }) => [r.name, (safe / 10) * 100, `${safe}/10`]) as Array<[string, number, string, string?]>;
  return (
    <Box id="risks" className="md:flex-[2]">
      <Rail icon="watch" kicker="What to watch" sample />
      <div className="mt-1"><EaseScale rows={rows} endLabels={["Riskier", "Safer"]} /></div>
      <InlineDisclosure name="risks" summary="What each risk does">
        {/* TWO UP, AND THE REASON IS THE READING MEASURE. Rulebook v2 §17.
            One item per row gave the note column every pixel the card had:
            measured at 1280, 898px of card left 750px of note, which is 155
            CHARACTERS PER LINE at this size, roughly double a comfortable
            measure and the widest text anywhere in the four pages. Capping the
            column instead would have left 300px of dead space on every row,
            which §17 forbids in the same breath. Two columns spend the width on
            a second item rather than on air, and take the measure to about 60.

            THE PAIRING FIRES AT lg, NOT sm or md. Founder, 2026-08-21: "in mobile the
            look is always stacked with one card after another where there is a
            good opportunity that we can put two cards in the same row." sm: is
            640px and phones are 375 to 430, so a pairing written there has never
            once fired on a phone; a ratchet counts them for that reason. These
            are sentences rather than number tiles, and two columns of prose at
            375px would be about 25 characters a line, so this one genuinely
            wants the wider tier. Measured at every tier below rather than
            assumed: 54 characters a line at 375, 56 at 768, and the cap below holds the
            widest tier at 73. 56ch is not a new number: it is the measure the spine
            stylesheet's own .note class already uses. The ch unit measures the
            "0" advance, which in this face runs wider than the average lowercase
            letter, so 56ch lands at about 73 REAL characters; the number that
            matters is the measured one, and it was measured with the webfont
            settled, because the first two readings disagreed until it was.

            IT IS AN INLINE STYLE RATHER THAN max-w-[56ch] FOR ONE REASON: the
            preview these were measured in reads a stylesheet built earlier, so a
            newly written arbitrary class cannot appear in it and the cap could
            not be seen in a picture. Production would have generated it, but a
            change nobody can look at is not a change anyone can check. A ch cap is a MEASURE; a rem cap is a width, which
            is why max-w-2xl reads as 96 characters and is the thing being
            migrated away from. */}
        <div className="mt-2 grid gap-x-7 gap-y-2.5 border-t border-[var(--c-border)] pt-2.5 lg:grid-cols-2">
          {arr.map((r) => (
            <div key={r.name} className="grid grid-cols-1 items-baseline gap-x-3 gap-y-0.5 sm:grid-cols-[104px_1fr]">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{r.name}</span>
              <span className="block text-[11.5px] leading-snug text-[var(--c-ink2)]" style={{ maxWidth: "56ch" }}>{r.note}</span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}
