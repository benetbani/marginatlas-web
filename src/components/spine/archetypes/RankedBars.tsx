/**
 * RankedBars , THE RANKED-BARS ARCHETYPE. Vertical bars from a zero baseline,
 * sorted low to high so the best stands high and right (rule 29A), the
 * leader in the full terracotta with its figure in the accent, the rest in
 * the lighter terracotta; the figure at the lead rung above each bar, the
 * name beneath as the link; a hairline top rule at the WORLD'S HIGHEST value
 * for the metric, so only the world leader touches it (founder ruling 13,
 * 2026-09-04); a basis line and a withheld line in the practical register.
 * Below the wide layouts the phone gets a two-column table, because six
 * names cannot stand under six bars at 327px without cutting.
 *
 * Self-omits below two rows. Never draws a value the caller marks withheld:
 * losses and floors arrive as a count and a sentence, never as a bar.
 */
import * as React from "react";
import { Box, Rail, Fig } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "./copy";

export type BarRow = { key: string; name: string; href?: string; value: number; flagged?: boolean };
export type RankedBarsProps = {
  id: string;
  kicker: string;
  icon?: AtlasIconId;
  tagged?: boolean;
  basis: string;
  withheldLine?: string | null;
  rows: BarRow[];
  /** The world's highest value for this metric, as the same unit as `value`. */
  worldMax: number;
  fmt: (v: number) => string;
  phoneHead: { name: string; value: string };
};

const H = 150;

export function RankedBars({ id, kicker, icon, tagged, basis, withheldLine, rows, worldMax, fmt, phoneHead }: RankedBarsProps) {
  if (rows.length < 2) return null;
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  const leader = sorted[sorted.length - 1];
  const top = Math.max(worldMax, leader.value);
  /* FEWER THAN FOUR ROWS RECONFIGURE TO THE TABLE AT EVERY WIDTH. Measured by
     the harness: two bars across a card leave a 480x144 hole (E6), the
     sparse-but-wide fault the founder names most often; the table holds two
     rows as honestly as six. The constitution recorded this rule in run 10. */
  const drawBars = sorted.length >= 4;
  return (
    <Box id={id} data-archetype="ranked-bars">
      <Rail icon={icon} kicker={kicker} sample={tagged} />
      <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
      {withheldLine ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{withheldLine}</p> : null}
      {drawBars ? <div className="relative mt-2.5 hidden lg:block" data-idea="I2">
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-border)]" style={{ top: 26 }} />
        <div className="absolute right-0 text-[length:var(--t-micro)] text-[var(--c-muted)]" style={{ top: 8 }}>{COPY.margin.worldBest} {fmt(top)}</div>
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: H + 26 }} />
        <ol className="grid" style={{ listStyle: "none", margin: 0, padding: 0, gridAutoFlow: "column", gridAutoColumns: "minmax(0,1fr)", columnGap: 8 }}>
          {sorted.map((r) => {
            const isLeader = r.key === leader.key;
            const h = Math.max(2, Math.round((H * r.value) / top));
            const inner = (
              <>
                <div style={{ height: H + 26, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                  <div className="relative bg-[var(--c-card)] px-1 text-[length:var(--t-lead)] leading-none" style={{ marginBottom: 6, color: isLeader ? "var(--terra-text)" : "var(--c-ink)" }}>
                    <Fig className="font-medium">{fmt(r.value)}</Fig>
                  </div>
                  <div aria-hidden="true" style={{ width: 28, height: h, background: isLeader ? "var(--terra)" : "var(--terra-border)", borderRadius: "2px 2px 0 0" }} />
                </div>
                <div className="text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)] underline decoration-[var(--c-line-strong)] decoration-1 underline-offset-[3px]" style={{ paddingTop: 7, minHeight: "calc(7px + 2.75em)" }}>{r.name}</div>
              </>
            );
            return (
              <li key={r.key} style={{ minWidth: 0 }} data-bar={r.key}>
                {r.href ? <a href={r.href} className="block no-underline">{inner}</a> : inner}
              </li>
            );
          })}
        </ol>
      </div> : null}
      <div className={drawBars ? "mt-2.5 lg:hidden" : "mt-2.5"}>
        <div className="flex items-baseline justify-between pb-2">
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.name}</span>
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.value}</span>
        </div>
        <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {[...sorted].reverse().map((r) => {
            const isLeader = r.key === leader.key;
            const row = (
              <>
                <span className="min-w-0 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name}</span>
                <Fig className="text-right text-[length:var(--t-body)] font-semibold" >
                  <span style={{ color: isLeader ? "var(--terra-text)" : "var(--c-ink)" }}>{fmt(r.value)}</span>
                </Fig>
              </>
            );
            const cls = "flex items-baseline justify-between gap-x-3 py-2.5";
            return r.href ? <a key={r.key} href={r.href} className={cls}>{row}</a> : <div key={r.key} className={cls}>{row}</div>;
          })}
        </div>
      </div>
    </Box>
  );
}
