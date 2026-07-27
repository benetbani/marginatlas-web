/**
 * src/components/spine2/page/store.tsx
 *
 * THE CELL PAGE STORE, and the only client JavaScript this page's own
 * chapters ship. One piece of state, the pay-yourself target, and everything
 * that legitimately moves with it:
 *
 *   the hero      , the revenue the room needs, the marker on the measured
 *                   spread, and how far above the typical room that lands
 *   chapter 03    , the three groups of the hundred
 *   chapter 07    , the third mark on the daily floor
 *
 * Everything else on the page is a server component. The provider takes
 * server-rendered `children` straight through, so the three islands can sit
 * far apart in the document without dragging the chapters between them into
 * the client bundle.
 *
 * Every constant here arrives in `model` from the data file (see
 * spine2_adapter.buildStore); nothing about the distribution is written down
 * in this file, because a curve typed into a component drifts from the
 * figures it claims to describe the first time the data moves (M7).
 */
"use client";

import * as React from "react";

import { Statblock, type StatRow } from "@/components/spine2/Statblock";
import { Hundred } from "@/components/spine2/Hundred";
import { AxisDots } from "@/components/spine2/AxisDots";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import {
  money,
  moneyParts,
  type CellStoreModel,
  type FloorModel,
  type HeroModel,
} from "@/lib/cells/spine2_adapter";

type StoreValue = {
  model: CellStoreModel;
  target: number;
  setTarget: (t: number) => void;
  /** Revenue the room must take before it pays the target. */
  need: number;
  /** Rank in the modelled population whose keep is exactly t, 0 to 1. */
  rankOf: (t: number) => number;
  /** Takings an open day must make to pay the target. */
  paysTargetPerDay: number;
};

const Ctx = React.createContext<StoreValue | null>(null);

function useStore(): StoreValue {
  const v = React.useContext(Ctx);
  if (v == null) {
    throw new Error("cell page store: a store island rendered outside CellStoreProvider");
  }
  return v;
}

export function CellStoreProvider({
  model,
  children,
}: {
  model: CellStoreModel;
  children: React.ReactNode;
}) {
  const [target, setTarget] = React.useState(model.target);

  const value = React.useMemo<StoreValue>(() => {
    const rankOf = (t: number): number => {
      if (!(model.span > 0) || !(model.curve > 0)) return 0;
      const above = t - model.floor;
      if (above <= 0) return 0;
      return Math.max(0, Math.min(1, Math.pow(above / model.span, 1 / model.curve)));
    };
    return {
      model,
      target,
      setTarget,
      need: model.contrib > 0 ? (model.fixed + target) / model.contrib : 0,
      rankOf,
      paysTargetPerDay:
        model.contrib > 0 && model.openDays > 0
          ? (model.committedPerDay + target / model.openDays) / model.contrib
          : 0,
    };
  }, [model, target]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ------------------------------------------------------------------ */
/* chapter 01 , the answer, the spread and the one input               */
/* ------------------------------------------------------------------ */

export function HeroAnswer({ hero }: { hero: HeroModel }) {
  const { model, target, setTarget, need } = useStore();

  const spreadReady = model.p25 > 0 && model.p75 > model.p25;
  const markerPct = spreadReady
    ? Math.max(0, Math.min(100, ((need - model.p25) / (model.p75 - model.p25)) * 100))
    : null;

  return (
    <>
      <div className="answer">
        <div className="num fig">{money(need)}</div>
        <div className="l">
          of annual revenue, before this pays you{" "}
          <b>${target.toLocaleString("en-US")}</b> a year
        </div>
        {spreadReady && markerPct != null ? (
          <div className="rng">
            <b className="fig" style={{ fontSize: 10, fontWeight: 500 }}>
              {money(model.p25)}
            </b>
            <span className="bar" style={{ width: 200 }}>
              <i style={{ left: 0, right: 0 }} />
              <u style={{ left: `${markerPct.toFixed(1)}%` }} />
            </span>
            <b className="fig" style={{ fontSize: 10, fontWeight: 500 }}>
              {money(model.p75)}
            </b>
            <span>the middle half of the trade</span>
          </div>
        ) : null}
      </div>

      <div className="setter">
        <span className="lab">Pay yourself</span>
        <input
          type="range"
          min={model.targetMin}
          max={model.targetMax}
          step={model.targetStep}
          value={target}
          aria-label="Target annual income"
          onChange={(e) => setTarget(Number(e.target.value))}
        />
        <span className="val fig">{money(target)}</span>
      </div>
      <p className="note" style={{ fontSize: "12.5px", marginTop: 9 }}>
        Set at twice the {hero.crumb.city} average wage, which is what most
        people mean by doing well. Drag it and the room you would need moves
        with it, along with the hundred and the daily floor below.
      </p>
    </>
  );
}

/** The hero's side panel. One row moves with the slider, so the block is here. */
export function HeroPanel({ hero }: { hero: HeroModel }) {
  const { model, need } = useStore();

  const gap =
    model.medianRevenue > 0 ? Math.round((need / model.medianRevenue - 1) * 100) : null;

  const rows: StatRow[] = [
    ...hero.panelRows.slice(0, 3),
    ...(gap != null
      ? [
          {
            label: "More than the typical room takes",
            sub: "at the pay you set",
            value: `${gap >= 0 ? "+" : "−"}${Math.abs(gap)}`,
            unit: "%",
          },
        ]
      : []),
    ...hero.panelRows.slice(3),
  ].map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  return (
    <Statblock
      rail={false}
      header={{ label: "The room this page models", icon: "benchmark" }}
      rows={rows}
    />
  );
}

/* ------------------------------------------------------------------ */
/* chapter 03 , the hundred                                            */
/* ------------------------------------------------------------------ */

export function HundredBlock({ noun, city }: { noun: string; city: string }) {
  const { model, target, rankOf } = useStore();

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const over = clamp((1 - rankOf(target)) * 100);
  const none = Math.min(100 - over, clamp(rankOf(0) * 100));
  const mid = 100 - over - none;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <span className="lab">
          Of every 100 {noun}s in {city}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: "11.5px",
            fontWeight: 600,
            color: "var(--terra-deep)",
            whiteSpace: "nowrap",
          }}
        >
          paying yourself <span>{money(target)}</span>
        </span>
      </div>
      <Hundred
        total={100}
        groups={[
          { kind: "over", count: over, label: `pay their owner ${money(target)} or more` },
          { kind: "mid", count: mid, label: "pay something, but less than that" },
          { kind: "none", count: none, label: "pay their owner nothing at all" },
        ]}
        caption={`Each square is one ${noun}. Move the slider in the hero and the three groups move with it.`}
      />
      <p className="note" style={{ marginTop: 16 }}>
        <span className="lowconf" style={{ marginRight: 10 }}>
          <GlyphIcon id="confidence" size={13} />
          Modelled, not measured
        </span>
        Nobody publishes what owners in this trade take home. This shape is
        fitted to two figures on this page: what the modelled room keeps at its
        own place in the trade, and the share of rooms that pay an owner
        properly.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* chapter 07 , the third mark on the daily floor                      */
/* ------------------------------------------------------------------ */

export function FloorTrack({ floor }: { floor: FloorModel }) {
  const { target, paysTargetPerDay } = useStore();

  const stops = [
    {
      value: floor.committedPerDay,
      display: floor.committedDisplay,
      label: "committed cost",
    },
    {
      value: floor.breakevenPerDay,
      display: floor.breakevenDisplay,
      label: "breaks even",
    },
    {
      value: paysTargetPerDay,
      display: `$${Math.round(paysTargetPerDay).toLocaleString("en-US")}`,
      label: `pays you ${money(target)}`,
      role: "subject" as const,
    },
  ];

  const hi = Math.max(paysTargetPerDay, floor.breakevenPerDay * 1.05);

  return <AxisDots stops={stops} domain={[floor.committedPerDay, hi]} track="gradient" />;
}

/** Re-exported so a chapter can print the same figure the hero prints. */
export { moneyParts };
