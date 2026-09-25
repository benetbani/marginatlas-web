/**
 * Origin, BORN ABROAD, AND VISITORS (2026-09-25; his message that night: "By origin, native, immigrant, tourist"). Page-agnostic,
 * keyed by country and a city (sections/people.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the focal place's share born abroad, the same figure every page prints (the signature files); its
 *    pie is the one wedge in the accent, the other place's pie in ink beside it, so the two read against each other.
 *  - EACH PIE NAMED under it, with its share for the place that is not the figure (the figure's own share is never printed twice).
 *  - THE VISITORS as figures: overseas visits a year, the place's own count where held.
 *  - From 720px of card the figure, the pies and the visitors stand side by side (the pies alone at the left of a wide card left
 *    a blank of 828 by 120 at 1280, the harness's LONE STAT); from 440px the pies and the visitors share a line under the figure
 *    (492 by 120 at 768); under that they stack.
 *  - `data-archetype="origin"`, `data-visual="1"`, `data-places`.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import { Pie } from "@/components/spine/charts/Pie";
import { COPY } from "@/lib/spine/copy";
import type { Origin as OriginData } from "@/lib/spine/sections/people";

export function Origin({ id = "origin", data }: { id?: string; data: OriginData }) {
  const O = COPY.people.origin;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="tourist" kicker={O.kicker} />
      <div className="[container-type:inline-size]">
        <div className="grid items-center gap-x-10 gap-y-5 [@container(min-width:440px)]:grid-cols-[auto_minmax(0,1fr)] [@container(min-width:720px)]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="[@container(min-width:440px)]:col-span-2 [@container(min-width:720px)]:col-span-1">
            <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.figure}</div>
            <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.words}</p>
          </div>
          <div data-archetype="origin" data-visual="1" data-places={String(data.places.length)} className="flex items-end gap-x-8">
            {data.places.map((p) => (
              <div key={p.name} data-row={p.name} className="flex flex-col items-center gap-2">
                <Pie share={p.pct / 100} tone={p.focal ? "terra" : "ink"} aria={`${p.name}: ${p.pct}% born abroad`} className={p.focal ? "h-24 w-24" : "h-16 w-16"} />
                <span data-label className="text-[length:var(--t-micro)] leading-tight text-[var(--c-ink2)]">
                  {p.name}
                  {p.focal ? null : <> <Fig className="font-semibold text-[var(--c-ink)]">{p.pct}%</Fig></>}
                </span>
              </div>
            ))}
          </div>
          {data.visits.length ? (
            <div data-visits className="grid grid-cols-2 gap-4 [@container(min-width:720px)]:grid-cols-1">
              {data.visits.map((v) => (
                <div key={v.name}>
                  <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{v.name.charAt(0).toUpperCase() + v.name.slice(1)}</div>
                  <Fig className="mt-1 block text-[length:var(--t-lead)] font-semibold leading-tight text-[var(--c-ink)]">{v.millions}M</Fig>
                  <div className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{v.overnight ? O.overnight : O.visits}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Box>
  );
}
