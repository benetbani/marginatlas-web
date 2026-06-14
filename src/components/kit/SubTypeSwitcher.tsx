"use client";

/**
 * SubTypeSwitcher - the masthead title switcher that reframes the page by
 * sub-type (interaction-control foundation, agency principles P1 + P3 + P5).
 *
 * The business name on an Atlas page is not a fixed label, it is a switchable
 * type: "a coffee shop", "a bakery", "a wine bar". This control sits in the
 * masthead title slot and reads as part of the headline, a quiet underlined type
 * the reader can change. Changing it does NOT reload (P1): it writes the chosen
 * sub-type to the URL via useUrlState (P3, shareable + back-safe) and exposes the
 * value so the page server-re-derives the masthead figures around it. The control
 * itself never fetches.
 *
 * It is disclosed-not-displayed (P5): one quiet line that reads as the title,
 * with the active type carrying a soft underline so it is legible as a control
 * without shouting. Built on Segmented, so it inherits the WAI radiogroup
 * keyboard model, the roving tabstop, the 44px targets, and the focus ring.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Segmented, type SegmentedOption } from "./controls/Segmented";
import { useUrlState } from "@/lib/url_state";

export type SubTypeOption = {
  value: string;
  label: string;
  /** Optional second line under the label (e.g. a count or qualifier). */
  sub?: string;
  /** Disable this single option. */
  disabled?: boolean;
};

export type SubTypeSwitcherProps = {
  /** The sub-types to choose between (the business name, switchable). */
  options: SubTypeOption[];
  /** The current sub-type (the page's canonical value, mirrored from searchParams). */
  value: string;
  /** Query-string key the choice writes to. Defaults to "subtype". */
  paramKey?: string;
  /** Optional notify on change, fired alongside the URL write (e.g. analytics). */
  onChange?: (next: string) => void;
  /** Required: labels the group for assistive tech, e.g. "Choose the business type". */
  ariaLabel: string;
  /** Quiet lead-in word shown before the switch, e.g. "Running". Optional. */
  lead?: string;
  className?: string;
};

const identity = (raw: string | null): string => raw ?? "";
const serialize = (v: string): string | null => (v ? v : null);

/**
 * The switcher reads its live value from the URL but FALLS BACK to the page's
 * canonical `value` when the key is absent, so the server render and the client
 * agree (no hydration drift) and a clean URL still shows the right type.
 */
export function SubTypeSwitcher({
  options,
  value,
  paramKey = "subtype",
  onChange,
  ariaLabel,
  lead,
  className,
}: SubTypeSwitcherProps) {
  const [urlValue, setUrlValue] = useUrlState<string>(
    paramKey,
    identity,
    serialize,
    value,
  );

  // The active type: the URL value when it names a real option, otherwise the
  // page's canonical value. Guards against a stale/typo'd query key.
  const active = options.some((o) => o.value === urlValue) ? urlValue : value;

  const handleChange = React.useCallback(
    (next: string) => {
      setUrlValue(next);
      onChange?.(next);
    },
    [setUrlValue, onChange],
  );

  // A lone type is not a choice: render it as plain title text, no control noise
  // (P5, disclosed not displayed).
  if (options.length < 2) {
    const only = options[0];
    if (!only) return null;
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-2 font-display text-lg font-medium text-cocoa-700",
          className,
        )}
      >
        {lead ? <span className="text-cocoa-500">{lead}</span> : null}
        <span className="text-ink-900">{only.label}</span>
      </span>
    );
  }

  const segOptions: SegmentedOption[] = options.map((o) => ({
    value: o.value,
    label: o.label,
    sub: o.sub,
    disabled: o.disabled,
  }));

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {lead ? (
        <span className="font-display text-lg font-medium text-cocoa-500">
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
