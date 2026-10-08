/**
 * WHERE NEW FIRMS LAST ON THE HOME PAGE (plan 2026-10-08, home sections, section 1): the lead city's share of its 2019 firms still
 * trading five years on, the card's one figure and one of the page's three loud moments (LOUD_SEATS, seat 2), then the UK's cities
 * as the site's gradient bar list, highest first, each a door to its city page, the lead's bar the one in the accent's gradient, a
 * tick at the UK's own share keyed once under the list. The bars' far end is the whole, 100, so a bar is the city's own share and
 * never a share of the leader's. The list fills the height its level gives it (`fill`): it stands beside the UK's city rows, which
 * fill theirs too, so neither half stands a blank foot. Every figure from src/lib/home/firms_last.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { BarList } from "@/components/spine/charts/BarList";
import { COPY } from "@/lib/spine/copy";
import type { FirmsLast } from "@/lib/home/firms_last";

/** Of 100: the bars' far end is the whole. */
const WHOLE = 100;

export function HomeFirmsLast({ last }: { last: FirmsLast }) {
  const C = COPY.home.firmsLast;
  return (
    <Box id="firms-last" className="flex flex-col">
      <Rail icon="ranking" kicker={C.kicker} />
      <Focal figure={last.lead.figure} words={last.lead.words} prov={last.lead.prov} accent />
      <BarList items={last.rows.map((r) => ({ key: r.key, label: r.name, value: r.value, display: r.display, href: r.href, prov: r.prov }))} max={WHOLE} look="plain" mark={last.lead.key} fill reference={last.uk} ariaUnit={C.aria} />
    </Box>
  );
}
