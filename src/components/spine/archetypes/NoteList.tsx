/**
 * NoteList , THE NOTE-LIST ARCHETYPE (what locals know). The page's one
 * editorial section, prose by nature and by exemption (E1, declared by the
 * attribute), rebuilt to the founder's verdict of 2026-08-27 on the legacy
 * wall of text: a LABEL a reader can scan over ONE FACT, hairlines between,
 * never a paragraph. The notes are authored by hand per country and always
 * carry the sample tag on their rail; the tag is the rail's business.
 *
 * THE LAW INSIDE IT:
 *  - A label is a title, one line; a label that wraps is a sentence and the
 *    harness reports it. A fact is one or two short sentences; a fact that
 *    runs past four lines at any width is a wall and the harness reports it.
 *  - At most five notes; the sixth is not drawn.
 *  - In a WIDE card the notes flow in two columns, so the list never towers
 *    over its band partner (the founder, 2026-09-05: "massive white space" in
 *    the salaries card beside it). The list decides by ITS OWN width, a
 *    container query at 600px, below which a column could not hold a fact
 *    inside four lines; the caller only says whether columns are allowed.
 *    An odd last note spans both columns, so a row is never half empty (seen
 *    on the how-to page at 768: three forms, the third alone beside a blank).
 *  - Nothing drawn, no figure required: the note list is words by design.
 *  - No notes, nothing drawn.
 *  - THE EDITORIAL EXEMPTION IS A SWITCH, ON BY DEFAULT (plan step 31, fifth
 *    dispatch, 2026-09-18). A page carries ONE prose section (MODEL.md PART 9
 *    clause 44, R9), and on the country page it is `16 locals`; the question
 *    list `18 checks` draws on this same law (a label over one line,
 *    hairlines between, no figure, no paragraph, no tap state) and passes
 *    `editorial={false}`, so it carries no exemption and stands under the
 *    art-direction gate's 220-character prose ceiling by its own arithmetic
 *    (COMPOSITION.md section 9: worst case 176). The stamp is
 *    `data-editorial="1"`, the value scripts/verify_art_direction.mjs reads
 *    (`[data-editorial='1']`, the same value industry-view.tsx and
 *    NeighborhoodExplorer.tsx stamp); the bare attribute this file carried
 *    until this dispatch rendered as `data-editorial="true"`, which that
 *    selector never matched, so the exemption the model grants the locals
 *    card had never been in effect (measured 2026-09-18: the country page's
 *    locals card red under E1 at 588 characters, the how-to page's forms
 *    card at 589).
 */
import * as React from "react";
import { NOTE_CAP, type LocalNote } from "@/lib/spine/locals_rows";

export function NoteList({ notes, columns = 1, editorial = true }: { notes: LocalNote[]; columns?: 1 | 2; editorial?: boolean }) {
  const live = notes.filter((n) => n.label && n.fact).slice(0, NOTE_CAP);
  if (live.length === 0) return null;
  return (
    <div data-archetype="note-list" {...(editorial ? { "data-editorial": "1" } : {})} data-notes={String(live.length)} data-columns={String(columns)} className="[container-type:inline-size]">
      <ol className={columns === 2 ? "grid [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:gap-x-6" : "grid"}>
        {live.map((n, i) => (
          <li key={i} data-note={i} className={"border-t border-[var(--c-border)] py-2.5 first:border-t-0 first:pt-0 last:pb-0" + (columns === 2 ? " [@container(min-width:600px)]:[&:nth-child(2)]:border-t-0 [@container(min-width:600px)]:[&:nth-child(2)]:pt-0 [@container(min-width:600px)]:[&:nth-child(odd):last-child]:col-span-2" : "")}>
            <div data-note-label className="text-[length:var(--t-micro)] font-semibold leading-tight text-[var(--c-ink)]">{n.label}</div>
            <p data-note-fact className="mt-0.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{n.fact}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
