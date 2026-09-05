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
import { COPY } from "@/lib/spine/copy";
import { buildHowTo } from "@/lib/spine/howto_rows";

export function HowToBody({ iso2 }: { iso2: string }) {
  const d = buildHowTo(iso2);
  if (!d) return null;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <Band hero>
        <Box id="howto">
          <h1 className="text-[length:var(--t-head)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]">{d.title}</h1>
          <p className="mt-2 max-w-[60ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.lead}</p>
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
      <Band split="1-1">
        <Box id="dots">
          <Rail icon="register-cost" kicker={COPY.howto.dots} />
          <NoteList notes={d.dots} />
        </Box>
        {d.locals ? (
          <Box id="locals">
            <Rail icon="locals-know" kicker={COPY.locals.kicker} sample />
            <NoteList notes={d.locals} />
          </Box>
        ) : null}
      </Band>
      <div data-terminus className="mt-8">
        <Box id="close">
          <Terminus kicker={COPY.close.kicker} doors={d.doors} />
        </Box>
      </div>
    </main>
  );
}
