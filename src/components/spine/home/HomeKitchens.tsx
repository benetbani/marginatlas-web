/**
 * THE RANKED LIST ON THE HOME PAGE (his ruling of 2026-10-05 on PARKED P36.2b, option (a): "Where kitchens score five";
 * HOMEPAGE-EDITORIAL.md, format 6, beside the duel): the set's two highest and two lowest boroughs and the middle borough as the
 * card's figure, from src/lib/home/kitchens.ts (the registers' feed, never a typed number). The site's MarkList: no marks (a
 * borough has no flag), no doors (no page answers for one borough), every figure stamped. Drawn only while the feed's item is fresh (the 45-day rule).
 */
import * as React from "react";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { COPY } from "@/lib/spine/copy";
import type { Kitchens } from "@/lib/home/kitchens";

/** "2026-10-02" reads "October 2026", as the duel beside it dates its figure. */
const monthOf = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export function HomeKitchens({ kitchens, oneColumn = false }: { kitchens: Kitchens; oneColumn?: boolean }) {
  const C = COPY.home.kitchens;
  return (
    <MarkList
      id="kitchens"
      kicker={kitchens.title}
      icon="scorecard"
      headline={{ label: C.headline.replace("{month}", monthOf(kitchens.asOf)), value: kitchens.middle.value, prov: kitchens.middle.prov }}
      basis={C.basis.replace("{n}", String(kitchens.count))}
      head={{ name: C.headName, value: C.headValue }}
      rows={kitchens.rows.map((r) => ({ key: r.key, name: r.name, value: r.value, prov: r.prov }))}
      fmt={(v) => String(v)}
      withheld={0}
      oneColumn={oneColumn}
    />
  );
}
