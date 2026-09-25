/**
 * HeroBoard, THE COUNTRY MASTHEAD TO HIS DESIGN OF 2026-09-20 (his words
 * verbatim in rules/FOUNDER-VERDICTS.md under that date; MODEL.md 8.2 row
 * `00 take`'s bracket, the constitution by his word). The first question,
 * PART 9 clause 57: how is this data best shown? One answer and a handful of
 * placed facts are a board, not a chart: the answer big, the facts as one
 * column read top to bottom, each with the one word that places it among the
 * countries, and a picture of the place between them. Its family is the
 * masthead's (the answer card's), its data hero_board.ts's.
 *
 * THE LAW, inside the component:
 *  - THE IDENTITY LINE: the flag first, bigger (the board rung, no outline,
 *    CountryFlag.tsx), NOTHING to its left; the country's name to its right,
 *    its letters as tall as the flag (both at the ladder top, 40, PART 4), so
 *    the two read as one line. No mark, no icon (PART 9 clause 7).
 *  - THREE COLUMNS UNDER IT at lg: the answer on the left (its label, the
 *    figure at the page's one 40 in the accent, its basis line); the image in
 *    the centre; the column of supporting figures on the right. At md the
 *    answer and the image share a row and the column runs under them; at 375
 *    everything stacks, the answer first.
 *  - THE COLUMN: at most six rows (his cap), each one shape: a terracotta icon
 *    tile, the label, the figure with its unit, and the level word in a small
 *    chip. Hairlines between rows, the basis "Among the countries" under them
 *    so the level words say what they measure. Never a grid of four by two.
 *  - THE IMAGE is what the builder hands over; a placeholder is stamped
 *    `data-placeholder="1"` and carries its one line under it, so it is never
 *    read as the country.
 *  - `data-visual="1"`: the board carries a photograph and a placed column;
 *    the level's one visual is this card, and his page laws (clause 53) count
 *    it so.
 *  - `data-answers` is the masthead's declared answer (verify_doors reads it
 *    as the page's promise, the same as AnswerCard's).
 *
 * Gated by the archetype harness (stories `hero-board`: the exemplar, a thin
 * country, a country whose pay pair is withheld) and the page laws.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { Band, Box, Ico } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { HeroBoardData } from "@/lib/spine/hero_board";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { DuotonePhoto } from "@/components/spine/archetypes/CityCards";
import { Pie } from "@/components/spine/charts/Pie";

export const HERO_BOARD_ROWS_CAP = 6;

export function HeroBoard({ id = "take", board, answers }: { id?: string; board: HeroBoardData; answers?: string }) {
  const rows = board.rows.slice(0, HERO_BOARD_ROWS_CAP);
  return (
    <Band hero>
      <Box id={id} data-archetype="hero-board" data-level="page" data-visual="1" data-answers={answers} data-rows={String(rows.length)}>
        <div className="flex items-center gap-4">
          <CountryFlag iso2={board.iso2} size="board" className="shrink-0" />
          {/* THE NAME STEPS DOWN A RUNG ON A PHONE (the goal's A13, 2026-09-24): at a phone's 327 of content, "Afghanistan" at the 40 ran 11 past the card beside the flag (the page laws, TEXT OUT OF BOX, once the renders measured the width production serves), so under sm it takes the focal rung, 30, and the flag and the name keep one line. */}
          <h1 id="headline" data-typography="custom" className="min-w-0 text-[length:var(--t-focal)] font-semibold leading-none tracking-tight text-[var(--c-ink)] sm:text-[length:var(--t-answer)]">
            {board.name}
          </h1>
        </div>
        {/* TWO STATES, ONE BOARD. With an answer: three columns at lg (the
            answer, the image, the column), two at md (the answer beside the
            image, the column under both). Without one (no small-business
            regime on file, the state word stands): the state word and the
            image share the first column, the picture filling the space the
            figure would have taken, so no column stands three quarters empty
            beside the rows (measured on AF: 323 by 204 of air in the
            three-column form, the page filter's WHITE SPACE). */}
        <div data-state={board.answer ? "answer" : "no-answer"} className={`mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 ${board.answer ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"}`}>
          {board.answer ? (
            /* THE COLUMN SPLITS ITS SPARE HEIGHT (2026-09-25; his "blank space in the hero is the worst place for it"): the six rows
               beside it set the card's height, and the drawing used to stand at this column's foot with 100 of nothing above it.
               The answer, its drawing and the words now read as one block at the top, the plus closes the column, and the air
               between is shared out, never one lump. */
            <div className="grid content-between gap-5">
              <div data-answer="1">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{board.answer.label}</div>
                {/* THE ANSWER DRAWN, the figure never printed twice (his law of 2026-09-19, "a share of a whole is drawn").
                    A SHARE IS A PIE BESIDE ITS FIGURE (2026-09-25, his word that night: "the 20% with cubic bars at the hero is a
                    catastrophe, no need for that, a pie chart would be enough"): the wedge in the accent the figure is printed in,
                    so the colour is the key and no legend is needed. A position between two ends (a city's pay among the cities)
                    keeps the one-row bar with its ends named, under the figure. */}
                {board.answerBar && board.answerBar.part && board.answerBar.rest && !board.answerBar.ends ? (
                  <div className="mt-2 flex items-center gap-5">
                    <div data-hero-figure className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{board.answer.value}</div>
                    <div data-answer-bar><Pie share={board.answerBar.value / 100} aria={board.answerBar.aria} className="h-28 w-28" /></div>
                  </div>
                ) : (
                  <div data-hero-figure className="fig mt-1 text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{board.answer.value}</div>
                )}
                {board.answerBar && board.answerBar.part && board.answerBar.rest && !board.answerBar.ends ? null : board.answerBar ? (
                  <div data-answer-bar className="mt-4 max-w-[28ch]">
                    <SegmentBar bare label={board.answerBar.aria} value={board.answerBar.value} figure={board.answer.value} unit="" part={board.answerBar.part} rest={board.answerBar.rest} ends={board.answerBar.ends} />
                  </div>
                ) : null}
                {/* The words under the figure are the board's own where it says them (a city's "Pay, a year."), the country's basis with its regime otherwise: one archetype at two altitudes since 2026-09-20 evening. */}
                <p data-subtitle className="mt-3 max-w-[28ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">
                  {board.answerBasis != null ? board.answerBasis : (
                    <>
                      {COPY.answer.basis}
                      {board.answer.regime ? <>{" "}{COPY.answer.basisUnder} <span className="text-[var(--c-ink)]">{board.answer.regime}</span></> : null}
                    </>
                  )}
                </p>
              </div>
              {board.subtitle ? <p className="max-w-[28ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{board.subtitle}</p> : null}
              {board.taxes && board.taxes.length >= 2 ? (
                <div data-hero-taxes className="max-w-[34ch]">
                  <DetailPanel name="hero-taxes" summary={COPY.heroBoard.taxes.summary} rows={board.taxes} />
                </div>
              ) : null}
            </div>
          ) : null}
          {/* THE IMAGE FILLS THE HEIGHT ITS NEIGHBOURS SET (his clause 52: the
              cards fit as a bento, no blank under a column). At 375 it is a
              4:3 picture in the flow; from md it is absolutely filled into
              its cell, so the card's height is the taller of the answer and
              the column, never the picture's, and nothing stands empty beside
              it. The placeholder's one line sits on the picture as a small
              chip (B22), never under it. */}
          {board.answer ? (
            <ImageCell image={board.image} />
          ) : (
            <div className="flex flex-col gap-4">
              <div data-answer-absent="1">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.answer.label}</div>
                <p data-subtitle className="mt-1 max-w-[28ch] text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{COPY.answer.absent}</p>
              </div>
              <ImageCell image={board.image} grow />
              {board.subtitle ? <p className="max-w-[28ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{board.subtitle}</p> : null}
            </div>
          )}
          <div className={`flex flex-col ${board.answer ? "md:col-span-2 lg:col-span-1" : ""}`}>
            {/* ONE GRID FOR THE WHOLE BOARD, NOT ONE PER ROW (2026-09-23, his
                ruling on alignment, measured first). Each row used to be its own
                grid, so every row sized its own columns and the figures ended at
                1094, 1074 and 1098: three right edges in a column that exists to
                be read down. The rows are subgrids of this one now, so the four
                columns are the same four columns on every row. */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
              {rows.map((r) => (
                <div key={r.key} data-row={r.key} className="col-span-full grid grid-cols-subgrid items-center gap-x-3 py-2">
                  <Ico id={r.icon} tone="terra" />
                  <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{r.label}</span>
                  <span className="whitespace-nowrap text-right text-[length:var(--t-body)] font-medium tabular-nums text-[var(--c-ink)]">
                    {r.value}
                    <span className="ml-1 text-[length:var(--t-micro)] font-normal text-[var(--c-muted)]">{r.unit}</span>
                  </span>
                  {r.level ? (
                    <LevelMark level={r.level} />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{board.levelBasis ?? COPY.heroBoard.levelBasis}</p>
          </div>
        </div>
      </Box>
    </Band>
  );
}

/** THE LEVEL AS A MARK (2026-09-25, his word that night: "symbols ... can be used to replace words in our sections that are soooo
 *  verbose"): three rising bars, as many filled as the figure stands high among the countries (one low, two medium, three high),
 *  in place of the word in a chip. Like the word, it says where the figure stands and nothing about good or bad. The word stays
 *  for a screen reader and a pointer's title; the column's one-line key says what the marks rank. */
function LevelMark({ level }: { level: "high" | "medium" | "low" }) {
  const n = level === "high" ? 3 : level === "medium" ? 2 : 1;
  const word = COPY.heroBoard.levels[level];
  return (
    <span data-level={level} role="img" aria-label={word} title={word} className="inline-flex h-4 items-end gap-0.5 justify-self-end">
      {[1, 2, 3].map((i) => (
        <span key={i} aria-hidden className="block w-1.5 rounded-sm" style={{ height: `${35 + i * 20}%`, background: i <= n ? "var(--terra)" : "var(--c-soft2)" }} />
      ))}
    </span>
  );
}

function ImageCell({ image, grow = false }: { image: HeroBoardData["image"]; grow?: boolean }) {
  return (
    <div className={`relative md:min-h-40 ${grow ? "md:flex-1" : ""}`}>
      {/* THE PLACEHOLDER IN THE PAGE'S DUOTONE (2026-09-25): the one photograph the repository holds is not the country, and in full
          colour it put a blue sky and green cliffs, the two colours the palette bans, at the top of the page; the city cards on the
          same page already draw it through this recipe. A country's own photograph, when one lands, draws as it is. */}
      {image.placeholder ? (
        <div data-hero-image data-placeholder="1" className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:absolute md:inset-0 md:aspect-auto md:h-full">
          <DuotonePhoto src={image.src} placeholder />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} data-hero-image className="aspect-[4/3] w-full rounded-lg object-cover md:absolute md:inset-0 md:aspect-auto md:h-full" />
      )}
      {image.placeholder ? <div data-overlay="1" className="absolute bottom-2 left-2 rounded-md bg-[var(--c-card)] px-2 py-0.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.heroBoard.placeholder}</div> : null}
    </div>
  );
}
