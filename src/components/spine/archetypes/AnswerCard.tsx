/**
 * AnswerCard , THE ANSWER-CARD ARCHETYPE (a page's masthead). The identity
 * row, a subtitle composed from what the card holds, the one answer-class
 * figure with its basis, and the companion facts as a KvGrid docked at the
 * card's half. Built once, drawn for every country; the city and trade
 * mastheads take the same component with their own facts.
 *
 * THE LAW INSIDE IT:
 *  - The name appears once, with its flag (founder, 2026-08-30).
 *  - The subtitle promises only what the card holds (the blueprint's rule; the
 *    builder composes it from the resolved cells).
 *  - The answer is the page's only 40; its label carries the SAMPLE tag when
 *    the answer is modelled (rule 4A), never the country name.
 *  - The companion grid is docked at the half from md up, top-aligned with the
 *    label, and fills row by row; with no cells the answer stands alone and
 *    nothing empty is drawn.
 *  - Words come from the copy table, in the practical register.
 */
import * as React from "react";
import { Band, Box, SampleTag } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { CountryFlag } from "@/components/CountryFlag";
import { KvGrid, type KvCell } from "./KvGrid";
import { COPY } from "./copy";

export type AnswerCardProps = {
  id?: string;
  name: string;
  iso2?: string;
  subtitle: string | null;
  answer: { label: string; value: string; regime?: string | null; confidence: "measured" | "modeled" | "placeholder" } | null;
  cells: KvCell[];
};

export function AnswerCard({ id = "take", name, iso2, subtitle, answer, cells }: AnswerCardProps) {
  const tagged = answer != null && answer.confidence !== "measured";
  const live = cells.filter((c) => c.value != null && c.value !== "");
  return (
    <Band hero>
      <Box id={id} data-archetype="answer-card">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <AtlasMark id="alt-country" size={13} className="opacity-55" />
          {iso2 ? <CountryFlag iso2={iso2} className="w-9 shrink-0" /> : null}
          <h1 id="headline" data-typography="custom" className="text-balance text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)]">
            {name}
          </h1>
        </div>
        {subtitle ? <p className="mt-1.5 max-w-[52ch] text-balance text-[length:var(--t-body)] text-[var(--c-ink2)]">{subtitle}</p> : null}
        {/* THE SPLIT ONLY WHEN THERE ARE CELLS. Measured by the harness at 768:
            a 1-1 split put a 130px answer beside a 250px grid and left a
            363x120 hole under the answer (E6). At tablet the answer takes a
            third and the grid two thirds, so the grid's cells widen, their
            notes stop wrapping, and the columns finish within the quarter;
            from lg the halves are equal. With no cells the answer stands
            alone. */}
        <div className={`mt-6 grid grid-cols-1 gap-8 ${live.length > 0 ? "md:grid-cols-[1fr_2fr] md:gap-10 lg:grid-cols-2 lg:gap-12" : ""}`} data-state={answer ? (live.length ? "answer-and-cells" : "answer-only") : "no-answer"}>
          {answer ? (
            <div data-answer="1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{answer.label}</div>
                {tagged ? <SampleTag /> : null}
              </div>
              <div className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{answer.value}</div>
              <div className="mt-2.5 max-w-[40ch] text-balance text-[length:var(--t-body)] text-[var(--c-ink2)]">
                {COPY.answer.basis}
                {answer.regime ? (
                  <>
                    {" "}{COPY.answer.basisUnder} <span className="text-[var(--c-ink)]">{answer.regime}</span>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            /* THE STATE WORD (catalogue I9): absence said as a word at figure
               size, with its label, never an empty slot and never a fabricated
               rate. Ink, not the accent: it is not an answer. */
            <div data-answer-absent="1">
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.answer.label}</div>
              <div className="mt-1 text-[length:var(--t-head)] font-medium leading-none text-[var(--c-ink)]">{COPY.answer.absent}</div>
              <div className="mt-2.5 max-w-[40ch] text-[length:var(--t-body)] text-[var(--c-ink2)]">{COPY.answer.absentNote}</div>
            </div>
          )}
          {live.length > 0 ? <KvGrid cells={live} /> : null}
        </div>
      </Box>
    </Band>
  );
}
