"use client";

/**
 * ControlsDemo - the client demo wrapper for the interaction-control primitives
 * on the /dev/kit catalog. Each primitive is driven by local sample state so it
 * can be exercised in one place (the catalog itself stays a server component).
 *
 * Sample-data only: no real cell figures, no source-agency names, tokens only,
 * no em-dashes.
 */
import * as React from "react";
import {
  Slider,
  ResetAnchor,
  PendingShell,
  OrientationHeader,
  Segmented,
} from "@/components/kit";

function usdFull(n: number): string {
  return Number.isFinite(n) ? `$${Math.round(n).toLocaleString("en-US")}` : "–";
}

function DemoBlock({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-parchment bg-cream-50 p-5">
      <h3
        data-typography="custom"
        className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500"
      >
        {title}
      </h3>
      {note ? <p className="mb-4 text-xs text-cocoa-700">{note}</p> : null}
      <div className={note ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

export function ControlsDemo() {
  // Slider + ResetAnchor share one adjusted figure. The slider sets a tip %
  // (0..30), and the take-home figure re-derives from it, client-live, with the
  // canonical figure held beside it via ResetAnchor.
  const CANONICAL_TIP = 18;
  const BASE_TAKEHOME = 48000;
  const [tip, setTip] = React.useState<number>(CANONICAL_TIP);
  // A toy re-derivation: each point of tip above canonical nudges take-home.
  const adjustedTakeHome = Math.round(
    BASE_TAKEHOME * (1 + (tip - CANONICAL_TIP) * 0.012),
  );

  // Segmented sub-type switcher sample.
  const [subType, setSubType] = React.useState<string>("all");

  // PendingShell sample: a toggle to simulate a server re-derivation in flight.
  const [pending, setPending] = React.useState<boolean>(false);

  return (
    <div className="space-y-6">
      <DemoBlock
        title="OrientationHeader (P4: you are here)"
        note="Trade, place, altitude as quiet coordinates; the current level is emphasized and non-link. Sticky disabled here so the catalog scrolls normally."
      >
        <OrientationHeader
          sticky={false}
          items={[
            { label: "Italian restaurant", href: "#" },
            { label: "London", href: "#" },
            { label: "City level", current: true },
          ]}
        />
      </DemoBlock>

      <DemoBlock
        title="Segmented (sub-type switcher base)"
        note="Roving-tabstop radiogroup: click or arrow-key between options. The active option is the you-are-here state."
      >
        <Segmented
          ariaLabel="Restaurant sub-type"
          value={subType}
          onChange={setSubType}
          options={[
            { value: "all", label: "All restaurants", sub: "13,000 firms" },
            { value: "pizzeria", label: "Pizzeria", sub: "2,400 firms" },
            { value: "fine", label: "Fine dining", sub: "900 firms" },
            { value: "cafe", label: "Cafe", sub: "5,100 firms" },
          ]}
        />
        <p className="mt-3 text-xs text-cocoa-700">
          Selected: <span className="font-semibold text-ink-900">{subType}</span>
        </p>
      </DemoBlock>

      <DemoBlock
        title="Slider + ResetAnchor (P1 in place, P3 reversible)"
        note="Drag for feel or type for an exact value; the take-home figure re-derives live, with the canonical figure held beside it and a quiet way back once adjusted."
      >
        <div className="space-y-5">
          <Slider
            id="demo-tip"
            label="Tip kept by the house"
            min={0}
            max={30}
            step={1}
            value={tip}
            onChange={setTip}
            format={(n) => `${n}%`}
            ticks={[0, 10, 20, 30]}
            suffix="%"
          />
          <ResetAnchor
            canonical={BASE_TAKEHOME}
            adjusted={adjustedTakeHome}
            format={usdFull}
            onReset={() => setTip(CANONICAL_TIP)}
            label="Owner take-home a year"
          />
        </div>
      </DemoBlock>

      <DemoBlock
        title="PendingShell (P2: in control during a server re-derivation)"
        note="Toggle pending: the numbers stay visible-but-dimmed under a soft sweep, never blanked, never a centered spinner."
      >
        <button
          type="button"
          onClick={() => setPending((p) => !p)}
          className="mb-4 inline-flex h-11 items-center rounded-full border border-parchment bg-cream-50 px-4 text-sm font-medium text-ink-900 transition-colors hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
        >
          {pending ? "Stop pending" : "Simulate server update"}
        </button>
        <PendingShell pending={pending}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Typical revenue", value: "$720K" },
              { label: "Owner take-home", value: "$48K" },
              { label: "Net margin", value: "5%" },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-parchment bg-cream-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-xl font-semibold tabular-nums text-ink-900">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </PendingShell>
      </DemoBlock>
    </div>
  );
}
