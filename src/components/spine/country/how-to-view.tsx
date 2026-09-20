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
      <NoteList notes={d.dots} />
    </Box>
  );
  return (
    <div>
      <Band hero>
        <Box id="howto">
          <h1 data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]">{d.title}</h1>
          <p className="mt-2 [max-width:var(--measure-prose)] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.lead}</p>
          {d.cells.length > 0 ? (
            <div className="mt-5 border-t border-[var(--c-border)] pt-4">
              <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.howto.cells}</div>
              <KvGrid cells={d.cells} />
            </div>
          ) : null}
        </Box>
      </Band>
      {d.tiers.length > 0 || d.forms.length > 0 ? (
        <Band split="1-1" stack="lg">
          {d.tiers.length > 0 ? (
            <Box id="forms">
              <Rail icon="register-cost" kicker={COPY.tiers.kicker} />
              <TiersTable rows={d.tiers} />
            </Box>
          ) : null}
          {d.forms.length > 0 ? (
            <Box id="what">
              <Rail icon="bank" kicker={COPY.howto.forms} />
              <NoteList notes={d.forms} columns={2} />
            </Box>
          ) : null}
        </Band>
      ) : null}
      {/* `03 dots | 04 locals` (MODEL.md 8.9): GB's authored notes beside the
          dots at 1-1; elsewhere `04` is THE DRAWN BLOCKED SEAT with the country
          page's own line and item (its `16 locals`, DATA-REQUIREMENTS item 6),
          the same seat form, which 8.9 said from the day it was written and
          the code never drew (QUEUE launch:howto-locals-seat, 2026-09-19: DE
          and IN rendered 5 of 6 with the dots card alone in this band). The
          seat cannot share the band with the five notes: stretched to their
          height it carried a 480 by 246 blank inside a 480 by 361 card at 1280
          and 304 by 270 at 768, the page filter's WHITE SPACE red, MEASURED
          2026-09-19 on DE and IN; so off GB each stands in its own band at
          two thirds, the country's precedent for a drawn card beside a seat
          (`12 money | 16 locals`), LONE CARD twice, expected. */}
      {d.locals ? (
        <Band split="1-1">
          {dots}
          <Box id="locals">
            <Rail icon="locals-know" kicker={COPY.locals.kicker} sample />
            <NoteList notes={d.locals} />
          </Box>
        </Band>
      ) : (
        <>
          <Band split="2-1" stack="lg">{dots}</Band>
          <Band split="2-1" stack="lg">
            <BlockedSeat id="locals" icon="locals-know" kicker={COPY.blocked.locals.kicker} line={COPY.blocked.locals.line} foot={COPY.blocked.locals.foot} />
          </Band>
        </>
      )}
      <div data-terminus className="mt-8">
        <Box id="close">
          <Terminus kicker={COPY.close.kicker} doors={d.doors} />
        </Box>
      </div>
    </div>
  );
}
