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
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-end gap-3 border-b border-[var(--c-border)] px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          <span>Place, lightest rent first</span>
          <span className="text-right">Rent load<InfoTip gloss="Rent as a share of sales." /></span>
        </div>
        <div className="space-y-1 pt-1">
          {rows.map((r) => {
            const isLightest = r.name === lightest;
            // Real links only: a row is an <a> solely when its seed place carries a
            // real href (London -> the cell page). Every other city renders as a
            // plain unlinked row: no arrow, no hover affordance.
            const Tag: any = r.href ? "a" : "div";
            return (
              <Tag key={r.name} href={r.href} className={`${r.href ? "hov " : ""}-mx-2 grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-3 rounded-md px-2 py-2`}>
                <span className={`min-w-0 truncate text-[12.5px] ${isLightest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{r.name}{r.href ? <span className="text-[var(--c-muted)]"> &#8594;</span> : null}</span>
                <Fig className="text-right text-[13px] text-[var(--c-ink)]">{r.rent_load_pct}%</Fig>
              </Tag>
            );
          })}
        </div>
      </Box>
    </div>
  );
}
