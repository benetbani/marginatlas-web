/**
 * HOW FIGURES ARE MADE ON THE HOME PAGE (plan 2026-10-08, home sections, section 4): the notices read, at 30 in ink (quiet: no
 * accent), with the technique in its one line, then two ruled rows (FactRows): the names matched of the names the notices held,
 * and the London trade pages whose takings are read from the band counts; no count of countries and no estimates line (his ruling
 * of 2026-10-07: the home's 195 counter is wrong); then one door to About the figures, where every source is named. It stands
 * beside the notebook. Every figure from src/lib/home/how_made.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { COPY } from "@/lib/spine/copy";
import type { HowMade } from "@/lib/home/how_made";

export function HomeHowMade({ how }: { how: HowMade }) {
  return (
    <Box id="how-made" className="flex flex-col">
      <Rail icon="methodology" kicker={COPY.home.howMade.kicker} />
      <Focal figure={how.notices.figure} words={how.notices.words} prov={how.notices.prov} />
      <FactRows rows={how.rows.map((r) => ({ key: r.key, label: r.label, value: r.value, note: r.note, prov: r.prov }))} />
      <div className="mt-3">
        <a href={how.link.href} className="tap-y inline-block text-[length:var(--t-body)] text-[var(--c-ink2)] underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]">{how.link.label}</a>
      </div>
    </Box>
  );
}
