"use client";

/**
 * Segmented - a generic segmented control / toggle group
 * (interaction-control foundation, agency principles P1 + P4).
 *
 * The base primitive for the sub-type switcher and the venue switcher. P1: a
 * choice acts on the visible numbers in place (the consumer re-derives on
 * `onChange`, no Apply). P4: the active option is clearly the "you are here"
 * state, so the reader always sees which slice they are looking at.
 *
 * Keyboard: a single roving tabstop (the active option), arrow keys move and
 * select (Left/Up previous, Right/Down next, Home/End to the ends), wrapping at
 * the ends. Built on the WAI radiogroup pattern. Focus ring on every option,
 * 44px targets, token-styled (cream rail, atlas active fill).
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type SegmentedOption<V extends string = string> = {
  value: V;
  label: string;
  /** Optional second line under the label (e.g. a count or qualifier). */
  sub?: string;
  /** Disable this single option. */
  disabled?: boolean;
};

export type SegmentedProps<V extends string = string> = {
  options: SegmentedOption<V>[];
  value: V;
  onChange: (next: V) => void;
  /** Required: labels the group for assistive tech. */
  ariaLabel: string;
  /** "md" is the default control height; "sm" trims it for dense rows. */
  size?: "sm" | "md";
  className?: string;
};

export function Segmented<V extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  className,
}: SegmentedProps<V>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Indices that can actually receive focus (skip disabled options).
  const enabled = options
    .map((o, i) => (o.disabled ? -1 : i))
    .filter((i) => i >= 0);

  const move = (fromIndex: number, dir: 1 | -1 | "home" | "end") => {
    if (enabled.length === 0) return;
    const pos = enabled.indexOf(fromIndex);
    let nextIndex: number;
    if (dir === "home") nextIndex = enabled[0];
    else if (dir === "end") nextIndex = enabled[enabled.length - 1];
    else {
      const len = enabled.length;
      const nextPos = (pos + (dir === 1 ? 1 : -1) + len) % len;
      nextIndex = enabled[nextPos];
    }
    onChange(options[nextIndex].value);
    refs.current[nextIndex]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        move(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        move(index, -1);
        break;
      case "Home":
        e.preventDefault();
        move(index, "home");
        break;
      case "End":
        e.preventDefault();
        move(index, "end");
        break;
    }
  };

  const pad = size === "sm" ? "px-3" : "px-4";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-full flex-wrap items-stretch gap-1 rounded-full border border-parchment bg-cream-100 p-1",
        className,
      )}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.sub ? `${opt.label}, ${opt.sub}` : undefined}
            disabled={opt.disabled}
            // Roving tabstop: only the active option is tabbable.
            tabIndex={active ? 0 : -1}
            onClick={() => !opt.disabled && onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex min-h-[44px] flex-col items-center justify-center rounded-full text-sm font-medium transition-colors",
              pad,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:text-cocoa-300",
              active
                ? "bg-atlas-500 text-white shadow-subtle"
                : "text-cocoa-700 hover:bg-white hover:text-ink-900",
            )}
          >
            <span className="leading-tight">{opt.label}</span>
            {opt.sub ? (
              <span
                className={cn(
                  "text-[11px] font-medium leading-tight",
                  active ? "text-cream-100" : "text-cocoa-500",
                )}
              >
                {opt.sub}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
