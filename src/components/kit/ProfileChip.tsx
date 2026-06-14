"use client";

/**
 * ProfileChip - the quiet masthead chip that holds the reader's standing context
 * (the assumptions that "follow them" into the calculator and the venue switcher).
 *
 * THE AGENCY GRAMMAR (P1-P5):
 *   P1 (act in place): editing a field writes the profile in place; the chip's
 *       summary updates live. Nothing navigates.
 *   P2 (right tempo): every edit is a cheap client write (localStorage), so it
 *       lands instantly. No Apply button, no spinner.
 *   P3 (reversible): "Clear" wipes the context back to unset; the durable store
 *       persists across pages so the reader does not re-key it.
 *   P4 (oriented): the resting chip states the context in plain words ("US,
 *       owner, local currency") so the reader always knows what assumptions the
 *       figures carry.
 *   P5 (disclosed not displayed): the chip rests as one small affordance and
 *       only opens the editor on intent; when nothing is set it reads "Set your
 *       context" rather than showing a row of empty fields.
 *
 * Solid token surfaces (not glass yet, Phase B), AA contrast, 44px targets,
 * reduced-motion honored. Tokens only, no raw hex/px/ms, no em-dashes, no
 * source-agency names. The lead mounts <ProfileChip /> in the masthead next wave.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/taxonomy";
import {
  useProfile,
  type DrawMode,
  type Units,
} from "@/lib/profile";

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2";

/** A short, human venue vocabulary. The venue switcher owns the canonical
 *  per-industry list; here we just remember a coarse standing preference. */
const VENUE_OPTIONS: { value: string; label: string }[] = [
  { value: "high-street", label: "High street" },
  { value: "mall", label: "Shopping centre" },
  { value: "suburban", label: "Suburban" },
  { value: "out-of-town", label: "Out of town" },
  { value: "online", label: "Mostly online" },
];

/** Coarse budget bands, stored as a round number in home currency. */
const BUDGET_BANDS: { value: number; label: string }[] = [
  { value: 25000, label: "Under 50k" },
  { value: 100000, label: "50k to 150k" },
  { value: 250000, label: "150k to 350k" },
  { value: 500000, label: "350k to 750k" },
  { value: 1000000, label: "Over 750k" },
];

function CaretIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 14s4.5-4 4.5-7.5A4.5 4.5 0 0 0 8 2a4.5 4.5 0 0 0-4.5 4.5C3.5 10 8 14 8 14Z" />
      <circle cx="8" cy="6.5" r="1.5" />
    </svg>
  );
}

function countryName(code: string | undefined): string | null {
  if (!code) return null;
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

function budgetLabel(budget: number | undefined): string | null {
  if (budget == null) return null;
  return BUDGET_BANDS.find((b) => b.value === budget)?.label ?? null;
}

function venueLabel(venue: string | undefined): string | null {
  if (!venue) return null;
  return VENUE_OPTIONS.find((v) => v.value === venue)?.label ?? venue;
}

/** The resting one-line summary the chip shows. Picks the most telling few set
 *  fields, in priority order, so it stays short. */
function summarize(parts: (string | null)[]): string {
  const set = parts.filter((p): p is string => !!p);
  if (set.length === 0) return "Set your context";
  return set.slice(0, 2).join(" · ");
}

/* ------------------------------------------------------------------ */
/* Small field shells, shared by the popover rows.                     */
/* ------------------------------------------------------------------ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cocoa-500">
      {children}
    </span>
  );
}

const SELECT_CLASS = cn(
  "h-11 w-full rounded-md border border-parchment bg-cream-50 px-3 text-sm text-ink-900",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
);

/* ------------------------------------------------------------------ */
/* A small two-option toggle (draw, units) honoring the radiogroup feel */
/* without pulling the full Segmented (keeps this self-contained).      */
/* ------------------------------------------------------------------ */

function MiniToggle<V extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: V; label: string }[];
  value: V | undefined;
  onChange: (v: V) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex w-full rounded-full border border-parchment bg-cream-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
              RING,
              active
                ? "bg-atlas-500 text-cream-50 shadow-subtle"
                : "text-cocoa-700 hover:bg-cream-50 hover:text-ink-900",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* ProfileChip                                                         */
/* ================================================================== */

export type ProfileChipProps = {
  /** Which side the popover opens toward. Default right-aligned under the chip. */
  align?: "left" | "right";
  className?: string;
};

export function ProfileChip({ align = "right", className }: ProfileChipProps) {
  const { profile, hydrated, isSet, set, clear } = useProfile();
  const [open, setOpen] = React.useState(false);
  const popRef = React.useRef<HTMLDivElement | null>(null);
  const chipRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        chipRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        popRef.current &&
        !popRef.current.contains(t) &&
        chipRef.current &&
        !chipRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Pre-hydration the server rendered nothing-set, so render the neutral label
  // until the client knows the real profile (no hydration mismatch).
  const summary = hydrated
    ? summarize([
        countryName(profile.homeCountry),
        profile.draw ? (profile.draw === "owner" ? "Owner" : "Renting") : null,
        budgetLabel(profile.budget),
        venueLabel(profile.venue),
        profile.units === "home" ? "Home currency" : null,
      ])
    : "Set your context";

  const showSet = hydrated && isSet;

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={chipRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Your context"
        className={cn(
          "inline-flex min-h-[44px] max-w-[14rem] items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
          RING,
          showSet
            ? "border-parchment bg-cream-50 text-ink-900 hover:bg-cream-100"
            : "border-dashed border-cocoa-300 bg-transparent text-cocoa-700 hover:border-cocoa-500 hover:text-ink-900",
        )}
      >
        <PinIcon className="h-3.5 w-3.5 shrink-0 text-cocoa-500" />
        <span className="truncate">{summary}</span>
        <CaretIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-cocoa-500 transition-transform motion-safe:duration-200",
            open ? "rotate-180" : "",
          )}
        />
      </button>

      {open ? (
        <div
          ref={popRef}
          role="dialog"
          aria-label="Set your context"
          className={cn(
            "absolute top-full z-dropdown mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-parchment bg-cream-50 p-4 shadow-lift",
            "motion-safe:animate-ds-slide-up",
            align === "left" ? "left-0" : "right-0",
          )}
        >
          <div className="mb-3">
            {/* typography-ok: compact popover title, not a page section heading */}
            <h2 className="font-display text-base font-medium text-ink-900">
              Make it yours
            </h2>
            <p className="mt-0.5 text-xs leading-relaxed text-cocoa-700">
              Set this once and the figures follow you. It stays on this device.
            </p>
          </div>

          <div className="space-y-3">
            {/* Home country */}
            <label className="block">
              <FieldLabel>Where you are based</FieldLabel>
              <select
                value={profile.homeCountry ?? ""}
                onChange={(e) =>
                  set({ homeCountry: e.target.value || undefined })
                }
                className={SELECT_CLASS}
              >
                <option value="">Not set</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Budget band */}
            <label className="block">
              <FieldLabel>Roughly what you can put in</FieldLabel>
              <select
                value={profile.budget != null ? String(profile.budget) : ""}
                onChange={(e) =>
                  set({
                    budget: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className={SELECT_CLASS}
              >
                <option value="">Not set</option>
                {BUDGET_BANDS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Venue */}
            <label className="block">
              <FieldLabel>Venue you have in mind</FieldLabel>
              <select
                value={profile.venue ?? ""}
                onChange={(e) => set({ venue: e.target.value || undefined })}
                className={SELECT_CLASS}
              >
                <option value="">Not set</option>
                {VENUE_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Draw mode */}
            <div>
              <FieldLabel>Premises</FieldLabel>
              <MiniToggle<DrawMode>
                ariaLabel="Own the premises or rent"
                options={[
                  { value: "owner", label: "I own it" },
                  { value: "rent", label: "I rent" },
                ]}
                value={profile.draw}
                onChange={(draw) => set({ draw })}
              />
            </div>

            {/* Units */}
            <div>
              <FieldLabel>Read figures in</FieldLabel>
              <MiniToggle<Units>
                ariaLabel="Currency to read figures in"
                options={[
                  { value: "local", label: "Local currency" },
                  { value: "home", label: "My currency" },
                ]}
                value={profile.units ?? "local"}
                onChange={(units) => set({ units })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-parchment pt-3">
            <button
              type="button"
              onClick={() => clear()}
              disabled={!isSet}
              className={cn(
                "inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-medium text-cocoa-700 transition-colors hover:text-ink-900 disabled:pointer-events-none disabled:text-cocoa-300",
                RING,
              )}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                chipRef.current?.focus();
              }}
              className={cn(
                "inline-flex min-h-[44px] items-center rounded-full bg-atlas-500 px-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-atlas-700",
                RING,
              )}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
