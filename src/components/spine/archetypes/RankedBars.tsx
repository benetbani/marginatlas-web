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
 *
 * A BURDEN RANKS THE OTHER WAY (city:districts, the build loop's run 25,
 * 2026-09-07): with `best="min"` the lowest value leads (a rent load), the
 * bars stand heaviest to lightest so the leader is still the right-most and
 * the accent still marks the good end (rule 29A), and the top rule is the
 * SET'S heaviest, named by `topLabel`, since a world's best for a burden
 * would be a rule at the floor. A row may carry a `note` (what a district
 * is): at the wide layout the notes list under the chart, best first, so the
 * bar labels stay names; below it the note rides the row beside its name.
 * Both forms declare their row count (`data-expect-rows`) and mark every
 * drawn row (`data-row`), so the harness and the page filter can prove that
 * every row draws at every width.
 */
import * as React from "react";
import { Box, Rail, Fig } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "./copy";

export type BarRow = { key: string; name: string; href?: string; value: number; flagged?: boolean; /** One word or phrase about the row (a district's character), listed under the chart at the wide layout and beside the name below it. */ note?: string };
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
  /** "max": the highest value leads (a margin). "min": the lowest leads (a burden such as a rent load). */
  best?: "max" | "min";
  /** The words at the top rule; the world's best by default, the set's heaviest for a burden. */
  topLabel?: string;
  /** The heading over the notes list at the wide layout, when rows carry notes. */
  notesHead?: string;
};

const H = 150;

export function RankedBars({ id, kicker, icon, tagged, basis, withheldLine, rows, worldMax, fmt, phoneHead, best = "max", topLabel, notesHead }: RankedBarsProps) {
  if (rows.length < 2) return null;
  const ascending = [...rows].sort((a, b) => a.value - b.value);
  /* THE LEADER IS ALWAYS THE RIGHT-MOST BAR: the highest for a margin, the lowest for a burden. */
  const sorted = best === "min" ? ascending.slice().reverse() : ascending;
  const leader = sorted[sorted.length - 1];
  const top = Math.max(worldMax, ascending[ascending.length - 1].value);
  const notes = rows.filter((r) => r.note);
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
        <div className="absolute right-0 text-[length:var(--t-micro)] text-[var(--c-muted)]" style={{ top: 8 }}>{topLabel ?? COPY.margin.worldBest} {fmt(top)}</div>
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: H + 26 }} />
        <ol className="grid" data-expect-rows={sorted.length} style={{ listStyle: "none", margin: 0, padding: 0, gridAutoFlow: "column", gridAutoColumns: "minmax(0,1fr)", columnGap: 8 }}>
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
                {/* THE UNDERLINE IS A LINK'S, so a name with no door wears none (the
                    district photograph of run 25 showed seven underlined names and
                    no destination, a promise the card could not keep). */}
                <div className={`text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)] ${r.href ? "underline decoration-[var(--c-line-strong)] decoration-1 underline-offset-[3px]" : ""}`} style={{ paddingTop: 7, minHeight: "calc(7px + 2.75em)" }}>{r.name}</div>
              </>
            );
            return (
              <li key={r.key} style={{ minWidth: 0 }} data-bar={r.key} data-row={r.key}>
                {r.href ? <a href={r.href} className="block no-underline">{inner}</a> : inner}
              </li>
            );
          })}
        </ol>
        {/* THE NOTES UNDER THE CHART, best first, so a bar's label stays a name and
            the words a reader wants beside a figure sit in one list at one size. */}
        {notes.length ? (
          <div className="mt-3" data-notes>
            {notesHead ? <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{notesHead}</div> : null}
            <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
              {[...sorted].reverse().map((r) => r.note ? (
                <div key={r.key} className="flex items-baseline justify-between gap-3 py-1.5">
                  <span className="text-[length:var(--t-micro)] text-[var(--c-ink)]">{r.name}</span>
                  <span className="text-right text-[length:var(--t-micro)] text-[var(--c-ink2)]">{r.note}</span>
                </div>
              ) : null)}
            </div>
          </div>
        ) : null}
      </div> : null}
      <div className={drawBars ? "mt-2.5 lg:hidden" : "mt-2.5"}>
        <div className="flex items-baseline justify-between pb-2">
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.name}</span>
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.value}</span>
        </div>
        <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={sorted.length}>
          {[...sorted].reverse().map((r) => {
            const isLeader = r.key === leader.key;
            const row = (
              <>
                <span className="min-w-0 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name}{r.note ? <span className="block text-[length:var(--t-micro)] font-normal text-[var(--c-muted)]">{r.note}</span> : null}</span>
                <Fig className="text-right text-[length:var(--t-body)] font-semibold" >
                  <span style={{ color: isLeader ? "var(--terra-text)" : "var(--c-ink)" }}>{fmt(r.value)}</span>
                </Fig>
              </>
            );
            const cls = "flex items-baseline justify-between gap-x-3 py-2.5";
            return r.href ? <a key={r.key} href={r.href} className={cls} data-row={r.key}>{row}</a> : <div key={r.key} className={cls} data-row={r.key}>{row}</div>;
          })}
        </div>
      </div>
    </Box>
  );
}
