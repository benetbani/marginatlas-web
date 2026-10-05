/**
 * THE DUEL ON THE HOME PAGE (his ruling of 2026-10-05 on PARKED P36.2, option (a); HOMEPAGE-EDITORIAL.md, format 2): the question,
 * the set's two highest and two lowest on one scale, and the set's middle as the card's figure, from src/lib/home/duel.ts (the
 * registers' feed, never a typed number). The site's ranked bars: no member featured, the far end the set's own highest, every bar
 * a door to its trade's London page, every figure stamped. Drawn only while the feed's item is fresh (the 45-day rule).
 */
import * as React from "react";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { COPY } from "@/lib/spine/copy";
import type { Duel } from "@/lib/home/duel";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "2026-09-30" reads "September 2026". */
const monthOf = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

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
      focal={{ figure: duel.middle.figure, words: C.words.replace("{month}", monthOf(duel.asOf)), prov: duel.middle.prov }}
    />
  );
}
