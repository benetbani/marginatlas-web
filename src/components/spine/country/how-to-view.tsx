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
import { Box, Rail } from "@/components/spine/kit";
import { Zone } from "@/components/spine/zones";
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
  /* THE BAND PAGE (2026-10-04, his "push forward man" after the United Kingdom's band page went live; MODEL.md PART 10): each level
     a zone, the tone by its place, the sections open on it. The opening; the steps beside the legal forms (2-1, one under the other
     until 1024: the sequence is a narrow column, about 560px of content, and the forms' table needs its own width); the three
     glossaries (what each legal form is, what the paperwork dots mean, what locals know: about 335, 365 and 350 tall at 1280, which
     is why they sit together), the locals' seat the third where no notes are authored, so a seat never holds a band alone; the
     close. The bento's measurements are in git (this file before 2026-10-04). */
  return (
    <>
      {/* THE TRAIL BACK UP (Crumbs.tsx, 2026-09-22): the country page above, this page below. */}
      <Crumbs items={buildHowToCrumbs(iso2)} />
      {/* NO NEGATIVE MARGIN HERE (2026-10-04): the other bodies take SiteChrome's 24 down to the phone's 16 with -mx-2, but this
          route writes its own main at 16 on a phone (24 from 768), so the same -mx-2 left the open sections 8 from the glass. */}
      <div data-spine-body data-composition="zones">
        <Zone split="wide" label={d.title}>
          {/* THE PAGE'S OPENING, MARKED AS THE BENTO'S HERO BAND MARKED IT (`Band hero`): the sanction the full-width gates read for
              the one opening a page may stretch across the column (MODEL.md PART 9 clause 36, the opening, the table, the exit). */}
          <div data-hero="1">
            <Box id="howto">
              <h1 data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]">{d.title}</h1>
              {d.lead ? <p className="mt-2 [max-width:var(--measure-prose)] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.lead}</p> : null}
              {d.cells.length > 0 ? (
                <div className="mt-5 border-t border-[var(--c-border)] pt-4">
                  <div className="mb-2 text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{COPY.howto.cells}</div>
                  <KvGrid cells={d.cells} />
                </div>
              ) : null}
            </Box>
          </div>
        </Zone>
        {d.steps || d.tiers.length > 0 ? (
          <Zone split="2-1" stack="lg" label={COPY.howToSteps.kicker}>
            {d.steps ? (
              <Box id="steps">
                <Rail icon="red-tape" kicker={COPY.howToSteps.kicker} />
                {d.steps.totalDays ? (
                  <div className="mb-4">
                    <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{COPY.howToSteps.totalLabel}</div>
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
                <TiersTable rows={d.tiers} fill />
              </Box>
            ) : null}
          </Zone>
        ) : null}
        <Zone split="1-1-1" stack="lg" label={COPY.howto.forms}>
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
          ) : (
            <BlockedSeat id="locals" icon="locals-know" kicker={COPY.blocked.locals.kicker} line={COPY.blocked.locals.line} foot={COPY.blocked.locals.foot} />
          )}
        </Zone>
        <Zone split="wide" label={COPY.close.kicker}>
          <div data-terminus>
            <Box id="close">
              <Terminus kicker={COPY.close.kicker} doors={d.doors} />
            </Box>
          </div>
        </Zone>
      </div>
    </>
  );
}
