/**
 * WherePays , one trade's rent load, city by city. Founder D3 (2026-07-11, rulebook v1 §5):
 * per-city net margin for one trade and the modeled $/yr take-home are UNKNOWABLE at
 * this altitude (the same hallucination family as the city page's banned per-trade
 * margins, read from the other axis), so both columns are CUT. What remains is what
 * the atlas can defend: each city's rent load (the knowable input that moves the keep)
 * plus a plain link into the city-level cell page where one exists. The invented
 * RENT_FLOOR / RENT_COST_PER_PT re-rank and its inert format chips are deleted with
 * the metric they re-ranked; the LockVeil went with the $ column it hid (rulebook v1
 * §45: nothing veiled in review builds, and there is nothing left to veil).
 *
 * Order: rent load ascending, lightest lease first (founder D1). Self-omits when no
 * place carries a rent_load_pct (never a placeholder). No bars: the figures rank
 * themselves (rulebook v1 §25 bar rationing; §26 a lone number may stay a number).
 * terracotta: none; the list is inputs, not an answer.
 */
import { Box, Rail, Fig, InfoTip } from "@/components/spine/kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Place = { name: string; rent_load_pct?: number; href?: string };

export function WherePaysExplorer({ d }: { d: any }) {
  const basePlaces: Place[] = d.where_pays?.places ?? [];
  // Only the honestly-knowable input survives: a place without a rent load has
  // nothing to show here, and with none at all the whole card self-omits (the body
  // also drops the Movement header when the chapter is empty).
  const rows = basePlaces
    .filter((p): p is Place & { rent_load_pct: number } => typeof p.rent_load_pct === "number")
    .sort((a, b) => a.rent_load_pct - b.rent_load_pct);
  if (rows.length === 0) return null;
  const lightest = rows[0]?.name;

  return (
    <div className="w-full">
      <Box>
        <Rail icon="where-it-pays" kicker="The rent, city by city" sample />
        {/* A REAL TABLE. Places down the side, one measure across the top, and a
            header row drawn to look like one with NOTHING underneath it: zero
            table elements, so the words "rent load" were never attached to the
            figures they name. A screen reader got a city, a number, a city, a
            number. Third section in this loop with the same fault, after the two
            comparison tables, and the third time the library's own table answers
            it.
            THE LINK MOVED FROM THE ROW TO THE NAME. A row cannot be wrapped in a
            link inside a table, and a link is the right element for the one row
            that has somewhere to go. The clickable area narrows from the whole
            row to the name and its arrow; the row still lights on hover, so it
            still reads as reachable. One row in this list carries a link.
            THE COLUMN SIZES ITSELF. It was pinned at four and a half rem, which
            on a phone took a third of the row for a two-character figure. */}
        <Table className="text-[length:var(--t-micro)]">
          <caption className="sr-only">
            The rent as a share of sales, city by city, lightest first.
          </caption>
          <TableHeader>
            <TableRow className="border-[var(--c-border)] hover:bg-transparent">
              <TableHead scope="col" className="h-auto px-2 pb-2 text-left align-bottom text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Place, lightest rent first
              </TableHead>
              <TableHead scope="col" className="h-auto w-px whitespace-nowrap px-2 pb-2 text-right align-bottom text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Rent load<InfoTip gloss="Rent as a share of sales." />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const isLightest = r.name === lightest;
              return (
                <TableRow key={r.name} className={`${r.href ? "hov " : ""}border-0 hover:bg-transparent`}>
                  <TableHead
                    scope="row"
                    className={`h-auto min-w-0 px-2 py-2 text-left align-middle text-[length:var(--t-micro)] ${isLightest ? "font-semibold text-[var(--c-ink)]" : "font-normal text-[var(--c-ink2)]"}`}
                  >
                    {/* Real links only: a row is a link solely when its place carries
                        a real destination. Every other city is plain text: no arrow,
                        no hover affordance. */}
                    {r.href ? (
                      <a href={r.href} className="underline-offset-2 hover:underline">
                        {r.name}
                        <span className="text-[var(--c-muted)]"> &#8594;</span>
                      </a>
                    ) : (
                      r.name
                    )}
                  </TableHead>
                  <TableCell className="w-px whitespace-nowrap px-2 py-2 text-right align-middle">
                    <Fig className="text-[length:var(--t-micro)] text-[var(--c-ink)]">{r.rent_load_pct}%</Fig>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
}
