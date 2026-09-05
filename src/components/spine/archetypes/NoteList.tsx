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
 *  - Nothing drawn, no figure required: the note list is words by design.
 *  - No notes, nothing drawn.
 */
import * as React from "react";
import { NOTE_CAP, type LocalNote } from "@/lib/spine/locals_rows";

export function NoteList({ notes }: { notes: LocalNote[] }) {
  const live = notes.filter((n) => n.label && n.fact).slice(0, NOTE_CAP);
  if (live.length === 0) return null;
  return (
    <div data-archetype="note-list" data-editorial data-notes={String(live.length)}>
      <ol className="divide-y divide-[var(--c-border)]">
        {live.map((n, i) => (
          <li key={i} data-note={i} className="py-2.5 first:pt-0 last:pb-0">
            <div data-note-label className="text-[length:var(--t-micro)] font-semibold leading-tight text-[var(--c-ink)]">{n.label}</div>
            <p data-note-fact className="mt-0.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{n.fact}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
