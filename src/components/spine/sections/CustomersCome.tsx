/**
 * CustomersCome, HOW CUSTOMERS COME (2026-09-25; his message that night: "Type of customers by mode of transport pedestrians, car
 * or online"). Page-agnostic, keyed by country (sections/people.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the share of retail sales made online, drawn beside it as a pie in ink (the card's accent is kept
 *    for the walkers below; ART-DIRECTION C2, two accent marks a card at most).
 *  - THE TRIPS AS ONE BAR (ShareBar's led form): on foot first and in the accent, by car second in its tint, then the rest; the
 *    place and year the trips were counted in named over the bar, since the trips are all trips there, not shopping trips alone.
 *  - `data-archetype="customers-come"`, `data-visual="1"`.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Pie } from "@/components/spine/charts/Pie";
import { ShareBar } from "@/components/spine/archetypes/ShareBar";
import { COPY } from "@/lib/spine/copy";
import type { CustomersCome as CustomersComeData } from "@/lib/spine/sections/people";

export function CustomersCome({ id = "customers-come", data }: { id?: string; data: CustomersComeData }) {
  const C = COPY.people.come;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="footfall" kicker={C.kicker} />
      <div data-archetype="customers-come" data-visual="1" className="flex flex-col">
        <div className="mb-5 flex items-center gap-5">
          <div>
            <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.figure}</div>
            <p className="mt-2 max-w-[24ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.words}</p>
          </div>
          <Pie share={data.online / 100} tone="ink" aria={`${data.figure} ${data.words}`} className="h-20 w-20" />
        </div>
        <div className="mb-2 text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{C.trips.replace("{place}", data.tripsPlace)}</div>
        <ShareBar parts={data.parts} lead={["walk", "car"]} residualKey="other" tall />
      </div>
    </Box>
  );
}
