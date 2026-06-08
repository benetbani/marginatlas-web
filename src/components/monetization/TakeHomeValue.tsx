import * as React from "react";
import { isGatingEnabled } from "@/lib/feature_flags";
import { fmtUSD, MISSING } from "@/components/board/format";
import { GatedTakeHome } from "@/components/monetization/GatedTakeHome";
import { RedactedNumber } from "@/components/monetization/RedactedNumber";

/**
 * Owner-take-home figure for the city + industry ranking tables, paywalled when
 * gating is on (Milestone 2). Gate off (the default): the plain number, exactly
 * as today. Gate on: the real value is NEVER emitted into the static HTML; a
 * redacted placeholder shows and a client island (GatedTakeHome) reveals the
 * real number only for an entitled viewer over an authed, uncached request.
 *
 * `cellHref` is the row's cell-page URL ("/country/geo/industry"), parsed for the
 * reveal's slugs. Server component: it decides at static-render time, so a free
 * viewer's HTML carries only the placeholder. When there is nothing to hide
 * (no take-home) it dashes; when the slugs cannot be parsed it still redacts
 * rather than leak the number.
 */
export function TakeHomeValue({
  takeHome,
  cellHref,
}: {
  takeHome: number | null;
  cellHref: string | null;
}) {
  if (isGatingEnabled() && takeHome != null) {
    const parts = (cellHref ?? "").split("/").filter(Boolean);
    if (parts.length >= 3) {
      const [country, geo, industry] = parts;
      return (
        <GatedTakeHome
          country={country}
          geo={geo}
          industry={industry}
          tier="basic"
          ariaLabel="Owner take-home, unlock with Basic"
        />
      );
    }
    // No resolvable slugs: never leak the figure, show the bare placeholder.
    return (
      <RedactedNumber
        tier="basic"
        entry="cell_owner_take_home"
        ariaLabel="Owner take-home, unlock with Basic"
      />
    );
  }
  return <>{takeHome != null ? fmtUSD(takeHome) : MISSING}</>;
}
