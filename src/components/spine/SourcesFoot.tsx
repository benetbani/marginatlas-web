/**
 * SourcesFoot, THE UK PAGES' ONE LINE OF SOURCES (plan 06, task B4; his ruling of 2026-10-04 on R-002: "One sources page"). The
 * United Kingdom's figures come from registers and statistics licensed under the Open Government Licence v3.0, which asks for the
 * source to be acknowledged and allows one page that names them all. Every UK spine page (country, city, trade, how-to,
 * neighbourhood) carries this line under its last band: the licence's own sentence and one link to About the figures, where
 * uk_sources.ts names each source with its attribution line. No card, heading or title names a source (R-002 and the copy
 * rulings); this line names none either.
 *
 * At the micro rung (12px), muted, under the bands; nothing off the UK, where no such licence asks for it. Its 24px under the last zone
 * is padding, not a margin, and globals.css paints it as one band with the Report line, edge to edge, in the tint (critique pass 3, fix
 * round D2, item P2.5): a margin is a gap the band's background never paints.
 */
import * as React from "react";
import { UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";

export function SourcesFoot({ iso2 }: { iso2: string | null | undefined }) {
  if (String(iso2 ?? "").toUpperCase() !== "GB") return null;
  return (
    <p data-sources-foot data-type-allow="sources-foot" className="pt-6 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
      {UK_SOURCES_FOOT.line}{" "}
      {/* The link's three words keep to one line: the paragraph measure (about 440px at 12px) broke it after "Sources". */}
      <a href={UK_SOURCES_FOOT.href} className="tap-y whitespace-nowrap underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]">
        {UK_SOURCES_FOOT.link}
      </a>
    </p>
  );
}
