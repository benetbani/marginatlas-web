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

export const HERO_BOARD_ROWS_CAP = 6;

export function HeroBoard({ id = "take", board, answers }: { id?: string; board: HeroBoardData; answers?: string }) {
  const rows = board.rows.slice(0, HERO_BOARD_ROWS_CAP);
  return (
    <Band hero>
      <Box id={id} data-archetype="hero-board" data-level="page" data-visual="1" data-answers={answers} data-rows={String(rows.length)}>
        <div className="flex items-center gap-4">
          <CountryFlag iso2={board.iso2} size="board" className="shrink-0" />
          <h1 id="headline" data-typography="custom" className="text-[length:var(--t-answer)] font-semibold leading-none tracking-tight text-[var(--c-ink)]">
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
            <div className="flex flex-col">
              <div data-answer="1">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{board.answer.label}</div>
                <div data-hero-figure className="fig mt-1 text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{board.answer.value}</div>
                {/* The words under the figure are the board's own where it says them (a city's "Pay, a year."), the country's basis with its regime otherwise: one archetype at two altitudes since 2026-09-20 evening. */}
                <p data-subtitle className="mt-2 max-w-[28ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">
                  {board.answerBasis != null ? board.answerBasis : (
                    <>
                      {COPY.answer.basis}
                      {board.answer.regime ? <>{" "}{COPY.answer.basisUnder} <span className="text-[var(--c-ink)]">{board.answer.regime}</span></> : null}
                    </>
                  )}
                </p>
              </div>
              {board.subtitle ? <p className="mt-4 max-w-[28ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{board.subtitle}</p> : null}
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
            <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
              {rows.map((r) => (
                <div key={r.key} data-row={r.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 py-2">
                  <Ico id={r.icon} tone="terra" />
                  <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{r.label}</span>
                  <span className="whitespace-nowrap text-right text-[length:var(--t-body)] font-medium tabular-nums text-[var(--c-ink)]">
                    {r.value}
                    <span className="ml-1 text-[length:var(--t-micro)] font-normal text-[var(--c-muted)]">{r.unit}</span>
                  </span>
                  {r.level ? (
                    <span data-level={r.level} className="rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{COPY.heroBoard.levels[r.level]}</span>
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

function ImageCell({ image, grow = false }: { image: HeroBoardData["image"]; grow?: boolean }) {
  return (
    <div className={`relative md:min-h-40 ${grow ? "md:flex-1" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} data-hero-image data-placeholder={image.placeholder ? "1" : undefined} className="aspect-[4/3] w-full rounded-lg object-cover md:absolute md:inset-0 md:aspect-auto md:h-full" />
      {image.placeholder ? <div data-overlay="1" className="absolute bottom-2 left-2 rounded-md bg-[var(--c-card)] px-2 py-0.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.heroBoard.placeholder}</div> : null}
    </div>
  );
}
