/**
 * The how-to page's body, "How to open a business in [country name]",
 * composed of archetypes only: the hero card with the title, the lead and
 * the key-value grid of what a business pays; a 1-1 band with the tiers
 * table (every legal form, equal rows) beside what each form is; a 1-1 band
 * with what the paperwork dots mean beside the country's authored notes
 * where held; the terminus with doors back. The hero and the terminus are
 * the only full-width bands. Every row comes from howto_rows.
 */
import * as React from "react";
import { Band, Box, Rail } from "@/components/spine/kit";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { COPY } from "@/lib/spine/copy";
import { buildHowTo } from "@/lib/spine/howto_rows";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { Crumbs } from "@/components/spine/Crumbs";
import { buildHowToCrumbs } from "@/lib/spine/crumb_rows";
import { Fig } from "@/components/spine/kit";
import { Stepper } from "@/components/spine/archetypes/Stepper";

/**
 * THE THREE LOUD MOMENTS: none, by design (MODEL.md 8.9, "Loud today: 0 of 3";
 * plan step 40, 2026-09-19). The country page's hero answered; this page is its
 * appendix and carries no accent and no 40 (its cells sit at the hero fact
 * rung, 20). The three seats are declared so the census prints the page's
 * ledger and the loud-seats gate holds the render to zero accents; nobody
 * "fixes" this page by inventing a focal for a page with no answer of its own.
 */
export const LOUD_SEATS = [
  { seat: 1, card: "none", figure: "none", state: "NO HONEST CANDIDATE", condition: "8.9: this page carries no accent and no 40, a working page under the country's answer; 0 of 3 by design" },
  { seat: 2, card: "none", figure: "none", state: "NO HONEST CANDIDATE", condition: "8.9: the same, by design" },
  { seat: 3, card: "none", figure: "none", state: "NO HONEST CANDIDATE", condition: "8.9: the same, by design" },
] as const satisfies readonly LoudSeat[];

export function HowToBody({ iso2 }: { iso2: string }) {
  const d = buildHowTo(iso2);
  if (!d) return null;
  /* `03 dots`, written once (the census counts `<Box` in this file) and seated
     in whichever band the page draws below. */
  const dots = (
    <Box id="dots">
      <Rail icon="register-cost" kicker={COPY.howto.dots} />
      <NoteList notes={d.dots} columns={2} />
    </Box>
  );
  return (
    <div>
      {/* THE TRAIL BACK UP (Crumbs.tsx, 2026-09-22): the country page above, this page below. */}
      <Crumbs items={buildHowToCrumbs(iso2)} />
      <Band hero>
        <Box id="howto">
          <h1 data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]">{d.title}</h1>
          {d.lead ? <p className="mt-2 [max-width:var(--measure-prose)] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.lead}</p> : null}
          {d.cells.length > 0 ? (
            <div className="mt-5 border-t border-[var(--c-border)] pt-4">
              <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.howto.cells}</div>
              <KvGrid cells={d.cells} />
            </div>
          ) : null}
        </Box>
      </Band>
      {/* `01 steps`, THE SEQUENCE THIS PAGE IS ABOUT (2026-09-23, QUEUE
          ui:how-to-as-a-stepper): the country's own registration steps in the
          file's own order, on the rail that makes them a sequence. FULL WIDTH
          AND OUTSIDE A BAND, the trade page's `07 peers` precedent: a lone
          card inside a band is a level with air beside it (clauses 52 and 53),
          and this card has no partner because nothing on this page belongs
          beside the process itself. The width is filled by the card's own two
          columns: the sequence left, what it comes to and where it comes from
          right, which is the one composition that does not leave a column of
          nothing at 768. */}
      {/* `01 steps | 02 forms` (2026-09-23, QUEUE ui:how-to-as-a-stepper): what
          you do, in order, beside which legal form you pick, which is the same
          decision asked from two sides. THE STEPS ARE NOT FULL WIDTH, and that
          was measured rather than assumed: a sequence is an intrinsically
          narrow column, about 560px of content, and in a 1032px card every
          arrangement of it left 400px or more of nothing (the holes checker
          found 258 by 354, then 495 by 408). A card whose content cannot fill
          a width does not take that width. The notes that explain each form
          move down to the dots' band, where they belong anyway: both are
          glossaries. */}
      {d.steps || d.tiers.length > 0 ? (
        <Band split="2-1" stack="lg">
          {d.steps ? (
            <Box id="steps">
              <Rail icon="red-tape" kicker={COPY.howToSteps.kicker} />
              {d.steps.totalDays ? (
                <div className="mb-4">
                  <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.howToSteps.totalLabel}</div>
                  <Fig className="mt-1 block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{d.steps.totalDays}</Fig>
                </div>
              ) : null}
              <Stepper steps={d.steps.steps} />
              {d.steps.basis ? <p className="mt-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.steps.basis}</p> : null}
              {d.steps.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.steps.foot}</p> : null}
            </Box>
          ) : null}
          {d.tiers.length > 0 ? (
            <Box id="forms" className="flex flex-col">
              <Rail icon="register-cost" kicker={COPY.tiers.kicker} gloss={COPY.glossary.legalForm} />
              {/* The legal forms share the height the steps beside them lend the card (2026-09-25: the legend drawn as dots is one line
                  where the sentence was two, and the card's foot stood 76px empty). */}
              <TiersTable rows={d.tiers} fill />
            </Box>
          ) : null}
        </Band>
      ) : null}
      {/* `03 what | 04 dots | 05 locals`, A LEVEL OF THREE (2026-09-23, clause
          50's cap, and the first one on this page). The three cards are the
          page's glossaries: what each legal form is, what the paperwork dots
          mean, and what locals know. Measured at 1280 before it was seated:
          335, 365 and 350 tall, which is why they sit together; the tiers
          table and the steps, at 285 and 519, do not belong beside any of
          them. Off the countries with authored notes the level is the two
          that remain, and the seat that used to stand alone (its history is in
          MODEL.md 8.9 and QUEUE launch:howto-locals-seat) keeps its own band. */}
      {d.forms.length > 0 || d.locals ? (
        <Band split={d.locals ? "1-1-1" : "1-1"} stack="lg">
          {d.forms.length > 0 ? (
            <Box id="what">
              <Rail icon="bank" kicker={COPY.howto.forms} />
              <NoteList notes={d.forms} columns={2} />
            </Box>
          ) : null}
          {dots}
          {d.locals ? (
            <Box id="locals" className="flex flex-col">
              <Rail icon="locals-know" kicker={COPY.locals.kicker} sample />
              <NoteList notes={d.locals} columns={2} fill />
            </Box>
          ) : null}
        </Band>
      ) : null}
      {!d.locals ? (
        <Band split="2-1" stack="lg">
          <BlockedSeat id="locals" icon="locals-know" kicker={COPY.blocked.locals.kicker} line={COPY.blocked.locals.line} foot={COPY.blocked.locals.foot} />
        </Band>
      ) : null}
      <div data-terminus className="mt-8">
        <Box id="close">
          <Terminus kicker={COPY.close.kicker} doors={d.doors} />
        </Box>
      </div>
    </div>
  );
}
