/**
 * MobileExpandableSection
 * =======================
 *
 * Mobile disclosure pattern for the Smart Waterfall. Desktop shows all 13
 * lines at once. On phones that's overwhelming, so we summarize to the
 * three lines an operator cares about most and let the reader expand.
 *
 *   - Summary view: total revenue, total costs, profit kept.
 *   - Expanded view: every line item, color-coded to match desktop.
 *   - Tap-and-hold on a row reveals a sticky tooltip with the line note.
 *   - Height transition is 200ms ease-out.
 */

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export type WaterfallLine = {
  label: string;
  /** 0..1 share of total revenue. */
  share: number;
  /** Hex color, matches desktop Smart Waterfall. */
  color: string;
  /** Tooltip note shown on long-press. */
  note: string;
  /** Render the row in atlas-700 emphasis. */
  isProfit?: boolean;
};

export type MobileExpandableSectionProps = {
  title: string;
  /** 3 lines: total revenue, total costs, profit kept. */
  summaryLines: WaterfallLine[];
  /** Full breakdown — typically 13 lines for restaurants. */
  fullLines: WaterfallLine[];
  /** Annual revenue used to compute absolute amounts. */
  totalRevenue: number;
  /** Pre-open the section, e.g. when deep-linked. */
  defaultOpen?: boolean;
};

function shortMoney(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v)}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}
function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export default function MobileExpandableSection({
  title,
  summaryLines,
  fullLines,
  totalRevenue,
  defaultOpen = false,
}: MobileExpandableSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [tooltip, setTooltip] = useState<WaterfallLine | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    if (!bodyRef.current) return;
    setH(bodyRef.current.scrollHeight);
  }, [open, fullLines, summaryLines]);

  const lines = open ? fullLines : summaryLines;

  return (
    <section aria-label={title} className="px-5 py-6">
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">{title}</h2>
      <p className="mt-1 text-xs text-cocoa-700">
        Annual breakdown of the typical operator. Total revenue {shortMoney(totalRevenue)}.
      </p>

      <div
        ref={bodyRef}
        className="mt-4 overflow-hidden"
        style={{ height: typeof h === "number" ? h : "auto", transition: "height 200ms ease-out" }}
      >
        <ol className="space-y-1.5">
          {lines.map((l, i) => (
            <WaterfallRow
              key={`${l.label}-${i}`}
              line={l}
              totalRevenue={totalRevenue}
              onTooltip={setTooltip}
            />
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 w-full h-11 rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 bg-cream-100 border border-parchment text-cocoa-700"
      >
        <span>{open ? "Show summary" : `Show all ${fullLines.length} lines`}</span>
        <span
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms ease" }}
        >
          <CaretDown size={12} />
        </span>
      </button>

      {tooltip && (
        <div
          role="tooltip"
          onClick={() => setTooltip(null)}
          className="fixed left-4 right-4 bottom-24 z-40 rounded-md px-3 py-2 text-sm shadow-lg bg-ink-900 text-white"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold">{tooltip.label}</span>
            <span className="tabular-nums text-xs text-white/70">{pct(tooltip.share)}</span>
          </div>
          <p className="mt-0.5 text-xs text-white/70">{tooltip.note}</p>
        </div>
      )}
    </section>
  );
}

function WaterfallRow({
  line,
  totalRevenue,
  onTooltip,
}: {
  line: WaterfallLine;
  totalRevenue: number;
  onTooltip: (l: WaterfallLine | null) => void;
}) {
  const widthPct = Math.max(2, line.share * 100);
  const timer = useRef<number | null>(null);

  const start = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onTooltip(line), 320);
  };
  const cancel = () => {
    if (timer.current) { window.clearTimeout(timer.current); timer.current = null; }
  };

  return (
    <li>
      <button
        type="button"
        onTouchStart={start}
        onTouchEnd={cancel}
        onTouchCancel={cancel}
        onMouseDown={start}
        onMouseUp={cancel}
        onMouseLeave={cancel}
        className="w-full grid grid-cols-12 items-center gap-2 py-1.5 text-left"
      >
        <div className="col-span-5 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block rounded-sm shrink-0"
            style={{ width: 8, height: 8, background: line.color }}
          />
          <span className={`text-[13px] ${line.isProfit ? "font-semibold text-atlas-700" : "font-medium text-ink-900"}`}>
            {line.label}
          </span>
        </div>
        <div className="col-span-4">
          <span
            aria-hidden="true"
            className="block rounded-sm"
            style={{
              height: 6,
              width: `${widthPct}%`,
              background: line.color,
              opacity: line.isProfit ? 1 : 0.85,
            }}
          />
        </div>
        <div className="col-span-3 flex justify-end items-baseline gap-1.5">
          <span className="text-[11px] tabular-nums text-cocoa-700/70">{pct(line.share)}</span>
          <span className="text-[13px] font-semibold tabular-nums text-ink-900">
            {shortMoney(totalRevenue * line.share)}
          </span>
        </div>
      </button>
    </li>
  );
}
