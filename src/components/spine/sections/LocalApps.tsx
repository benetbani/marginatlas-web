/**
 * LocalApps, THE APPS A SHOP RUNS ON, BY JOB (2026-09-25; his message that night: "Supporting applications for each country in
 * terms of categories, booking, delivery, marketing, etc. Focus on not worldwide apps, more local ones"). Page-agnostic, keyed by
 * country (sections/local_apps.ts).
 *
 * THE LAW, inside the component:
 *  - A DIRECTORY, NOT A MEASUREMENT: no figure stands for the card, so none is invented for it; each app's fee is its figure.
 *  - EACH JOB A BLOCK: its glyph and its name, then its apps, the country's own first. Each app a row: the flag of the country it
 *    was founded in (the local cue is the flag, never a word), its name, and its fee as one short figure with its unit as a
 *    symbol ("1.69%/sale", "$44/mo", "Free").
 *  - Blocks flow down balanced columns (one under 560px of card, two from 560px, three from 900px), each kept whole, so seven
 *    jobs never leave a row two thirds empty the way a grid of three does (the harness's LONE STAT, 697 by 138 at 1280).
 *  - The note a fee carries on its page (the plan, the limit) is the row's title, for a pointer; never a line of its own.
 *  - `data-archetype="local-apps"`, `data-visual="1"` (the flags draw), `data-jobs`; `data-row` and `data-label` on each app.
 */
import * as React from "react";
import { Box, Fig, Ico, Rail } from "@/components/spine/kit";
import { CountryFlag } from "@/components/CountryFlag";
import { COPY } from "@/lib/spine/copy";
import type { LocalApps as LocalAppsData } from "@/lib/spine/sections/local_apps";

export function LocalApps({ id = "local-apps", data }: { id?: string; data: LocalAppsData }) {
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="supplier" kicker={COPY.localApps.kicker} />
      <div className="[container-type:inline-size]">
        <div data-archetype="local-apps" data-visual="1" data-jobs={String(data.jobs.length)} className="gap-x-8 [@container(min-width:560px)]:columns-2 [@container(min-width:900px)]:columns-3">
          {data.jobs.map((j) => (
            <section key={j.key} data-job={j.key} className="mb-5 min-w-0 break-inside-avoid">
              <div className="mb-2 flex items-center gap-2">
                <Ico id={j.icon} tone="terra" />
                <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{j.label}</span>
              </div>
              <ol className="m-0 list-none divide-y divide-[var(--c-border)] p-0">
                {j.apps.map((a) => (
                  <li key={a.name} data-row={a.name} title={a.note || undefined} className="grid max-w-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 py-2">
                    <CountryFlag iso2={a.from} />
                    <span data-label className="min-w-0 truncate text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{a.name}</span>
                    <Fig className="whitespace-nowrap text-right text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{a.fee}</Fig>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </Box>
  );
}
