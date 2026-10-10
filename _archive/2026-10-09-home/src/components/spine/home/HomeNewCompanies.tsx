/**
 * WHERE NEW COMPANIES OPEN ON THE HOME PAGE (plan 2026-10-08, home sections, section 2): the list card's grouped form, the UK's own
 * figure for scale at 30 in ink (quiet: no accent), the one line saying the measure once, then Latin America's five highest and
 * Africa's, each country its flag, its name and its figure (his /countries ruling: a country is its flag and its name), a door to its
 * country page, and the rest of each region behind the founder's plus. The flag comes from CountryFlag and nowhere else (MarkList's
 * clause 5). Every figure from src/lib/home/new_companies.ts, stamped.
 */
import * as React from "react";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { CountryFlag } from "@/components/CountryFlag";
import { COPY } from "@/lib/spine/copy";
import type { NewCompanies } from "@/lib/home/new_companies";

export function HomeNewCompanies({ nc }: { nc: NewCompanies }) {
  const C = COPY.home.newCompanies;
  return (
    <MarkList
      id="new-companies"
      kicker={C.kicker}
      icon="global-spread"
      headline={{ label: C.headline, value: nc.uk.value, prov: nc.uk.prov }}
      basis={C.basis.replace("{year}", String(nc.year))}
      head={{ name: C.headName, value: C.headValue }}
      rows={[]}
      groups={nc.groups.map((g) => ({
        key: g.key,
        name: g.name,
        rows: g.rows.map((r) => ({ key: r.key, name: r.name, value: r.value, mark: <CountryFlag iso2={r.iso2} />, href: r.href, lands: r.lands, prov: r.prov })),
        rest: g.rest.length >= 2 ? { summary: g.more, rows: g.rest } : null,
      }))}
      fmt={(v) => v.toFixed(1)}
    />
  );
}
