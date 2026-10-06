/**
 * THE DUEL ON THE HOME PAGE (his ruling of 2026-10-05 on PARKED P36.2, option (a); HOMEPAGE-EDITORIAL.md, format 2): the question,
 * the set's two highest and two lowest on one scale, and the set's middle as the card's figure, from src/lib/home/duel.ts (the
 * registers' feed, never a typed number). The site's ranked bars: no member featured, the far end the set's own highest, every bar
 * a door to its trade's London page, every figure stamped. Drawn only while the feed's item is fresh (the 45-day rule), which is why
 * its one line carries no month (his instruction of 2026-10-07, the home's words cut by half).
 */
import * as React from "react";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { COPY } from "@/lib/spine/copy";
import type { Duel } from "@/lib/home/duel";

export function HomeDuel({ duel }: { duel: Duel }) {
  const C = COPY.home.duel;
  return (
    <RankedBars
      id="duel"
      kicker={duel.title}
      icon="vacancy"
      basis=""
      rows={duel.rows.map((r) => ({ key: r.key, name: r.name, value: r.value, href: r.href, lands: r.lands, prov: r.prov }))}
      worldMax={Math.max(...duel.rows.map((r) => r.value))}
      ceiling="set"
      topLabel={C.topLabel}
      fmt={(v) => v.toFixed(1)}
      phoneHead={{ name: C.phoneName, value: C.phoneValue }}
      feature="none"
      focal={{ figure: duel.middle.figure, words: C.words, prov: duel.middle.prov }}
    />
  );
}
