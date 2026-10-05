"use client";
/**
 * GatedTakeHome — the owner-take-home cell under the paywall (Milestone 2).
 *
 * Server-renders ONLY the redacted placeholder (RedactedNumber), so the real
 * value is never in the static HTML. On mount, when auth is on, it asks the
 * entitlement-checked /api/cell-take-home for the real value; a Pro reader
 * gets a number and we swap it in, everyone else keeps the placeholder (a link
 * to the pricing page, or text inside a row link). The true value reaches the browser only for an
 * entitled viewer, over an uncached authed request.
 */
import * as React from "react";
import { isAuthEnabled } from "@/lib/feature_flags";
import { RedactedNumber } from "@/components/monetization/RedactedNumber";
import { fmtUSD } from "@/components/board/format";
import type { PaywallTier } from "@/components/monetization/events";

export function GatedTakeHome({
  country,
  geo,
  industry,
  tier = "pro",
  ariaLabel = "Owner take-home, in Pro",
  inLink = false,
}: {
  country: string;
  geo: string;
  industry: string;
  tier?: PaywallTier;
  ariaLabel?: string;
  /** True inside a row link: the placeholder renders as text (a link inside a link is not valid HTML). */
  inLink?: boolean;
}) {
  const [value, setValue] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!isAuthEnabled()) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/cell-take-home?country=${encodeURIComponent(country)}&geo=${encodeURIComponent(
            geo,
          )}&industry=${encodeURIComponent(industry)}`,
        );
        const json = await res.json();
        if (active && typeof json?.value === "number") setValue(json.value);
      } catch {
        // keep the placeholder
      }
    })();
    return () => {
      active = false;
    };
  }, [country, geo, industry]);

  if (value != null) {
    return (
      <span className="font-display font-semibold tabular-nums text-ink-900">
        {fmtUSD(value)}
      </span>
    );
  }
  return (
    <RedactedNumber tier={tier} entry="cell_owner_take_home" ariaLabel={ariaLabel} inLink={inLink} />
  );
}
