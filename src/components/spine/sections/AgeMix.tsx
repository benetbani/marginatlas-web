/**
 * AgeMix, WHO LIVES HERE, BY AGE (2026-09-25; his message that night: "By age, generation based"). Page-agnostic, keyed by country
 * and a city (sections/people.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the focal place's share aged 25 to 49 (the working, spending core); its segment is the one part in
 *    the accent, and it carries no label of its own (the figure says it). The other place's same band is in the accent's tint, so
 *    the eye compares the two cores before reading anything.
 *  - ONE BAR A PLACE, the whole population cut into its five bands in age order, each band's share inside its segment where it
 *    fits; the place's name at the bar's start. The country first, the city under it.
 *  - THE BANDS NAMED ONCE, as a legend under the bars.
 *  - `data-archetype="age-mix"`, `data-visual="1"`, `data-bars`; `data-row` on each bar.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { AgeMix as AgeMixData } from "@/lib/spine/sections/people";

/* THE BANDS STEP FROM LIGHT TO DARK WITH AGE (2026-09-26): under 16, 16 to 24 and 65 and over were soft2, border and border, one
   pale grey three times, so the legend could not be matched to a single segment. Now ink2 at four strengths about ten points of
   lightness apart, youngest palest; the core band keeps the accent. A band's tone is a layer under its label, so the label keeps
   its full ink. */
const TONES: Record<string, number> = { under16: 0.12, "16to24": 0.26, "50to64": 0.4, "65plus": 0.54 };

export function AgeMix({ id = "age-mix", data }: { id?: string; data: AgeMixData }) {
  const A = COPY.people.age;
  const tone = (key: string, focal: boolean): { background: string; opacity?: number } =>
    key === "25to49" ? { background: focal ? "var(--terra)" : "var(--terra-border)" } : { background: "var(--c-ink2)", opacity: TONES[key] ?? 0.24 };
  const legend = data.bars[0].bands;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="who-for" kicker={A.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.figure}</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.words}</p>
      </div>
      <div data-archetype="age-mix" data-visual="1" data-bars={String(data.bars.length)} className="flex flex-col gap-4">
        {data.bars.map((bar) => (
          <div key={bar.name} data-row={bar.name}>
            <div className="mb-2 text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{bar.name.charAt(0).toUpperCase() + bar.name.slice(1)}</div>
            <div className="flex h-9 w-full gap-0.5 overflow-hidden rounded-lg" role="img" aria-label={`${bar.name}: ${bar.bands.map((b) => `${b.label} ${b.pct}%`).join(", ")}`}>
              {bar.bands.map((b) => {
                const labelled = !(bar.focal && b.key === "25to49") && b.pct >= 9;
                return (
                  <span key={b.key} data-wedge={b.key} className="relative flex h-full min-w-0.5 items-center justify-center overflow-hidden first:rounded-l-lg last:rounded-r-lg" style={{ width: `${b.pct}%` }}>
                    <span aria-hidden className="absolute inset-0" style={tone(b.key, bar.focal)} />
                    {labelled ? <span className="relative text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink)]">{Math.round(b.pct)}%</span> : null}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          {legend.map((b) => (
            <span key={b.key} className="inline-flex items-center gap-2">
              {/* The swatch keeps a hairline edge, so the palest band still reads as a mark on the card's white. */}
              <span aria-hidden className="relative inline-block h-2.5 w-2.5 overflow-hidden rounded-sm border border-[var(--c-border)]"><span className="absolute inset-0" style={tone(b.key, false)} /></span>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </Box>
  );
}
