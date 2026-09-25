/**
 * LocalApps, THE APPS A SHOP RUNS ON, BY JOB (2026-09-25; his message that night: "Supporting applications for each country in
 * terms of categories, booking, delivery, marketing, etc. Focus on not worldwide apps, more local ones"). Page-agnostic, keyed by
 * country (sections/local_apps.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is how many of the apps it lists were founded in the country, of how many (his "not worldwide apps,
 *    more local ones", counted off the list the reader sees; 2026-09-25, the card's first seat: a directory with no figure is the
 *    model laws' FOCAL on every page that seats it). Each app's fee is its row's figure. Drawn only where one app is the
 *    country's own: "0 of 19" says nothing a flag does not.
 *  - EACH JOB A BLOCK: its glyph and its name (the card's lead, a rung over its rows), then its apps, the country's own first. Each app a row: the flag of the country it
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
      {data.localCount > 0 ? (
        <div className="mb-5">
          <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">
            {data.localCount} <span className="text-[var(--c-muted)]">{COPY.localApps.of}</span> {data.total}
          </div>
          <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.localApps.focalWords}</p>
        </div>
      ) : null}
      <div className="[container-type:inline-size]">
        <div data-archetype="local-apps" data-visual="1" data-jobs={String(data.jobs.length)} className="gap-x-8 [@container(min-width:560px)]:columns-2 [@container(min-width:900px)]:columns-3">
          {data.jobs.map((j) => (
            <section key={j.key} data-job={j.key} className="mb-5 min-w-0 break-inside-avoid">
              {/* THE JOB'S NAME IS THE CARD'S LEAD, a rung over its rows (2026-09-25, the card's first seat): at the micro rung in capitals
                  every word of a directory with no figure stood at 14px or under, and the page filter's NO LEAD read a card with no
                  order for the eye. The subject leads, as the spectra table's `lead` scale has its trait names do. */}
              <div className="mb-1 flex items-center gap-2">
                <Ico id={j.icon} tone="terra" />
                <span className="text-[length:var(--t-lead)] font-semibold leading-tight text-[var(--c-ink)]">{j.label}</span>
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
