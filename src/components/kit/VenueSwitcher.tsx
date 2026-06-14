"use client";

/**
 * VenueSwitcher - the persistent venue toggle that reframes the economics by
 * where the business sits (interaction-control foundation, P1 + P3 + P4).
 *
 * A coffee shop on a high street, in a mall, in an airport, or in a station is
 * the same business on very different terms: rent, footfall, and captive pricing
 * all shift. This is a low-friction, always-visible toggle that sits beside the
 * sub-type switch in the masthead. Picking a venue acts on the visible numbers in
 * place (P1, the page server-re-derives, no Apply), writes to the URL via
 * useUrlState (P3, shareable + back-safe), and carries a strong active state so
 * the reader always knows which venue they are reading (P4).
 *
 * Built on Segmented for the WAI radiogroup keyboard model, the roving tabstop,
 * the 44px targets, and the focus ring. The options are generic (passed in), so
 * the high-street / mall / airport / station set is supplied by the page, not
 * hard-coded here.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Segmented, type SegmentedOption } from "./controls/Segmented";
import { useUrlState } from "@/lib/url_state";

export type VenueOption = {
  /** A stable slug, e.g. "high_street", "mall", "airport", "station". */
  value: string;
  /** The label shown in the toggle, e.g. "High street". */
  label: string;
  /** Optional second line under the label. */
  sub?: string;
  /** Disable this single option (e.g. no captive-venue data for this cell). */
  disabled?: boolean;
};

export type VenueSwitcherProps = {
  /** The venues to toggle between (generic, supplied by the page). */
  options: VenueOption[];
  /** The current venue (the page's canonical value, mirrored from searchParams). */
  value: string;
  /** Query-string key the choice writes to. Defaults to "venue". */
  paramKey?: string;
  /** Optional notify on change, fired alongside the URL write (e.g. analytics). */
  onChange?: (next: string) => void;
  /** Required: labels the group for assistive tech, e.g. "Choose the venue". */
  ariaLabel: string;
  /** Quiet lead-in label shown before the toggle, e.g. "Where". Optional. */
  lead?: string;
  className?: string;
};

const identity = (raw: string | null): string => raw ?? "";
const serialize = (v: string): string | null => (v ? v : null);

export function VenueSwitcher({
  options,
  value,
  paramKey = "venue",
  onChange,
  ariaLabel,
  lead,
  className,
}: VenueSwitcherProps) {
  const [urlValue, setUrlValue] = useUrlState<string>(
    paramKey,
    identity,
    serialize,
    value,
  );

  // The active venue: the URL value when it names a real option, otherwise the
  // page's canonical value. Guards against a stale/typo'd query key.
  const active = options.some((o) => o.value === urlValue) ? urlValue : value;

  const handleChange = React.useCallback(
    (next: string) => {
      setUrlValue(next);
      onChange?.(next);
    },
    [setUrlValue, onChange],
  );

  // A lone venue is not a choice: nothing to toggle, so omit (P5).
  if (options.length < 2) return null;

  const segOptions: SegmentedOption[] = options.map((o) => ({
    value: o.value,
    label: o.label,
    sub: o.sub,
    disabled: o.disabled,
  }));

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {lead ? (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
          {lead}
        </span>
      ) : null}
      <Segmented
        options={segOptions}
        value={active}
        onChange={handleChange}
        ariaLabel={ariaLabel}
        size="sm"
      />
    </div>
  );
}
