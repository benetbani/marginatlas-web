/**
 * WHICH TRADES FAIL MOST, ON THE UK PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 4; his ruling of
 * 2026-10-05 on PARKED P36.2, and the home's spec of 2026-10-09, section 6: the duel moves from the home to /gb's chapter 04 beside
 * where new firms last). The question, the set's two highest and two lowest on one scale, the set's middle as the card's figure (ink:
 * no member featured), every bar a door to its trade's London page, every figure stamped, drawn only while the feed's item is fresh
 * (the 45-day rule), from src/lib/home/duel.ts. It stands in a half of an `even` level beside where new firms last, which stretches
 * it to the taller card's height (country-view.tsx): `fill` draws its four rows as the table at every width from sm, whose rows
 * share that height, where the columns (a fixed height) stood 52px of blank foot at 1280 (the page laws' CARD FOOT BLANK).
 */
import * as React from "react";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { COPY } from "@/lib/spine/copy";
import type { Duel as DuelData } from "@/lib/home/duel";

export function Duel({ duel }: { duel: DuelData }) {
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
      fill
      focal={{ figure: duel.middle.figure, words: C.words, prov: duel.middle.prov }}
    />
  );
}
