"use client";
/**
 * WherePays explorer , the commercial heart and the ONLY client island on the
 * page. The like-for-like "where it pays best" leaderboard with a subtype filter
 * that GENUINELY RE-RANKS: each format carries a rent_sensitivity, so a low-rent
 * format (ghost kitchen) rescues the high-rent cities while a rent-heavy format
 * (fine dining) punishes them. The ordering shifts, it is not a uniform scalar.
 *
 * Free tier: the ranking + net-margin %, fully generous. Pro seam: the absolute
 * owner take-home ($/yr) column sits under a LockVeil (the single highest-value
 * paid reveal). The real column stays in the DOM, value-visible under a calm veil.
 * Built inline (no kit modification); reuses Box/Rail/Fig/RankBars grammar + LockVeil.
 *
 * ACCENT BUDGET (Final Ascent P2): terracotta = the ANSWER only , the leader's bar.
 * Everything that used to compete for it is ink now: the active filter chip (selection
 * is chrome), the Pro column header (the LockPill is gone; the veil carries the Pro
 * affordance), and the best-row figures (bold ink; the bar already lights the row).
 * The LockVeil's own lock tile + CTA are kit-owned chrome (the deliberate monetization
 * accent), leaving the screenful at <=3 marks.
 */
import * as React from "react";
import { Box, Rail, Fig, TERRA, TRACK, usd } from "@/components/spine/kit";
import { LockVeil } from "@/components/spine/kit-index";
import { deriveSubtypes, type SubtypeRow } from "./subtypes";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

type Place = { name: string; take_home_usd: number; net_margin_pct: number; rent_load_pct: number; href?: string };

export function WherePaysExplorer({ d }: { d: any }) {
  const basePlaces: Place[] = d.where_pays?.places ?? [];
  const subs: SubtypeRow[] = deriveSubtypes(d);
  const tradeWord: string = (d.meta?.name ?? "formats").toLowerCase();
  const baseKeep: number = d.subtypes?.base_net_pct ?? d.margins?.net_pct ?? d.margin_index?.keeps_per_100 ?? 7;
  const [sel, setSel] = React.useState<string>("all");
  const [unlocked, setUnlocked] = React.useState(false);

  // The subtype-filter chips only earn their place when a format genuinely
  // RE-RANKS the cities, which needs a real rent_sensitivity on the raw subtype
  // list. On real-data promotion that field is omitted (no honest source), so
  // every format defaults to sensitivity 1, nothing re-ranks, and the chips
  // would be inert chrome. Guard on the RAW list (deriveSubtypes defaults the
  // field to 1, so the derived rows cannot tell "absent" from "1"): show the
  // filter row only when at least one raw subtype carries a rent_sensitivity.
  const rawSubtypes: any[] = d.subtypes?.list ?? [];
  const hasRentSensitivity = rawSubtypes.some((s) => typeof s?.rent_sensitivity === "number");
  const canFilter = hasRentSensitivity && subs.length > 0;

  const active = sel === "all" ? null : subs.find((s) => s.slug === sel) ?? null;

  // Genuine re-rank: a format flexes each place by its keep ratio AND by how hard
  // that place's rent bites THIS format. The baseline model priced rent at sensitivity
  // 1; picking a format re-prices the rent drag. Each rent-point above the field's
  // light-rent floor (9%) re-prices the read by 4% times how far the format's rent
  // sensitivity sits from 1. So a light-rent format (cafe / bistro, 0.6) LIFTS the high-rent
  // cities (New York, rent 16%) and a rent-heavy one (fine dining, 1.4) DROPS them, genuinely
  // reshuffling the tight middle. Both the net % (the visible read) and the veiled take-home
  // flex, so the ranking-by-net stays honest: nothing moves that the rent gap cannot move.
  const RENT_FLOOR = 9;
  const RENT_COST_PER_PT = 0.04;
  const rows = basePlaces
    .map((p) => {
      const keepRatio = active ? active.keeps_pct / baseKeep : 1;
      const sens = active?.rent_sensitivity ?? 1;
      const rentDrag = (p.rent_load_pct - RENT_FLOOR) * (sens - 1) * RENT_COST_PER_PT; // +ve = costlier for this format
      const flex = keepRatio * (1 - rentDrag);
      const take = Math.max(0, Math.round((p.take_home_usd * flex) / 1000) * 1000);
      const net = active ? +Math.max(0, p.net_margin_pct * flex).toFixed(1) : p.net_margin_pct;
      return { name: p.name, take, net, href: p.href };
    })
    // Rank by the VISIBLE metric (net %), so the free ordering is self-consistent with the
    // column the reader sees. The $/yr take-home is the Pro reveal only and never sets the order.
    .sort((a, b) => b.net - a.net);

  const maxNet = Math.max(...rows.map((r) => r.net), 1);
  const best = rows[0]?.name; // best net keep (the visible ranking)
  // the Pro $/yr column emphasises its own leader (highest take-home), so its bold row is
  // self-consistent with the dollar figures it shows, even though the list order follows net %.
  const bestTake = rows.reduce((a, r) => (r.take > a.take ? r : a), rows[0] ?? { name: "", take: 0, net: 0 }).name;
  const note: string = d.where_pays?.note ?? "";

  // No places resolve: the chapter has nothing honest to rank, so the whole island
  // self-omits (the body also drops the Movement header when the chapter is empty).
  if (basePlaces.length === 0) return null;

  return (
    <div className="w-full">
      <Box className="relative overflow-hidden">
        <div className="relative">
          <Rail icon="where-it-pays" kicker="Where it pays best" verdict={d.where_pays?.verdict} />
          <p className="-mt-1 mb-3 max-w-2xl text-[12.5px] text-[var(--c-ink2)]">{note}</p>

          {/* subtype filter (the client re-rank interaction). Hidden when no format
              carries a real rent_sensitivity, since then nothing re-ranks and the
              chips would be inert. */}
          {canFilter ? (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              <FilterChip label={`All ${tradeWord}`} active={sel === "all"} onClick={() => setSel("all")} />
              {subs.map((s) => (
                <FilterChip key={s.slug} label={s.name} active={sel === s.slug} onClick={() => setSel(s.slug)} />
              ))}
            </div>
          ) : null}

          {/* free columns: rank + net-% shape + net %. The bar length encodes the visible metric
              (net %), and the order is ranked by it, so the read is self-consistent. Pro column
              (absolute $/yr take-home) is veiled and never sets the order. */}
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-end gap-3 border-b border-[var(--c-border)] px-2 pb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                <span>Place, ranked by net keep</span>
                <span className="text-right">Net %</span>
              </div>
              <div className="space-y-1">
                {rows.map((r) => {
                  const isBest = r.name === best;
                  // Real links only: a row is an <a> solely when its seed place carries a
                  // real href (London -> the cell page). Every other city renders as a
                  // plain unlinked row: no arrow, no hover affordance.
                  const Tag: any = r.href ? "a" : "div";
                  return (
                    <Tag key={r.name} href={r.href} className={`${r.href ? "hov " : ""}-mx-2 grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3 rounded-md px-2 py-2`}>
                      <span className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-2.5">
                        <span className={`min-w-0 truncate text-[12.5px] ${isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"} ${r.href ? "hover:text-[var(--terra-text)]" : ""}`}>{r.name}{r.href ? <span className="text-[var(--c-muted)]"> &#8594;</span> : null}</span>
                        <span className="h-2 overflow-hidden rounded-full" style={{ background: TRACK }}>
                          <span className="block h-full rounded-full" role="img" aria-label={`${r.name} keeps ${r.net}% net`} style={{ width: `${Math.max(3, (r.net / maxNet) * 100)}%`, background: isBest ? TERRA : "#c8c8c6" }} />
                        </span>
                      </span>
                      <Fig className={`text-right text-[13px] ${isBest ? "font-semibold" : ""} ${active ? "text-[var(--c-ink2)]" : "text-[var(--c-ink)]"}`}>{r.net}%</Fig>
                    </Tag>
                  );
                })}
              </div>
              <div className="mt-2 text-[11px] text-[var(--c-muted)]">
                {active ? <>Ranked for <b className="text-[var(--c-ink2)]">{active.name}</b>: {(active.rent_sensitivity ?? 1) < 1 ? "a light-rent format, so the high-rent cities climb." : (active.rent_sensitivity ?? 1) > 1 ? "a rent-heavy format, so the high-rent cities fall." : `the field holds its all-${tradeWord} order.`} Figures are modeled from each city&apos;s rent load for this format. </> : canFilter ? <>Ranked for all {tradeWord}. Pick a format above to reshuffle the high-rent cities. </> : <>Ranked by what a typical owner keeps, best first. </>}
                Best net margin is bold.
              </div>
            </div>

            {/* Pro seam: the absolute $/yr owner take-home per city, veiled. Value stays in the DOM.
                Header + figures are ink; the veil's own tile + CTA carry the Pro accent. */}
            <div className="md:w-[13rem]">
              <div className="mb-2 px-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Owner keeps ($/yr)</div>
              <LockVeil unlocked={unlocked} onUnlock={() => setUnlocked(true)} headline="See the take-home in dollars" note="Unlock the owner's yearly take-home for every city, for each format, converted like for like." cta="Unlock">
                <div className="space-y-1">
                  {rows.map((r) => {
                    const isTop = r.name === bestTake;
                    return (
                      <div key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md px-2 py-2">
                        <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{r.name}</span>
                        <Fig className={`text-right text-[13px] ${isTop ? "font-bold" : ""} ${active ? "text-[var(--c-ink2)]" : "text-[var(--c-ink)]"}`}>{money(r.take)}</Fig>
                      </div>
                    );
                  })}
                </div>
              </LockVeil>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

/* selection is CHROME, so the active state is ink, never terracotta */
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition"
      style={
        active
          ? { background: "var(--c-ink)", borderColor: "var(--c-ink)", color: "#fff" }
          : { background: "var(--c-soft)", borderColor: "var(--c-border)", color: "var(--c-ink2)" }
      }
    >
      {label}
    </button>
  );
}
