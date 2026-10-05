/**
 * HowWeKnowThis — quiet inline methodology link.
 *
 * Replaces the apologetic "Estimated" / "Modeled" pills that used to
 * bad-mouth our own data. Reuses the v34 dotted-underline affordance
 * (atlas-300 dotted bottom border, atlas-700 hover) so the user reads
 * it as a trust signal, not a warning.
 *
 * Drop inline next to a stat block:
 *   <span className="tabular-nums">$1.2M</span> <HowWeKnowThis anchor="estimated" />
 *
 * The link points at /about-data#<anchor>. The four tier anchors (measured /
 * regional / estimated / modeled) left that page on 2026-10-05 with the tiers
 * themselves (masterplan step 02), so a tier lands on "How to read a figure"
 * (#reading), the four kinds the pages print; any other anchor is kept.
 *
 * Server component. Zero client cost.
 */
import Link from "next/link";

/** The tier anchors /about-data no longer carries; each lands on the four kinds. */
const TIER_ANCHORS: ReadonlySet<string> = new Set(["measured", "regional", "estimated", "modeled"]);

export type HowWeKnowThisProps = {
  /** Anchor on /about-data. A retired tier name (measured, regional, estimated, modeled) lands on #reading. */
  anchor?: string;
  /** Optional override label. Default is "How we know this". */
  label?: string;
  /** Optional className for layout tweaks. */
  className?: string;
};

export function HowWeKnowThis({
  anchor = "measured",
  label = "How we know this",
  className,
}: HowWeKnowThisProps) {
  const target = TIER_ANCHORS.has(anchor) ? "reading" : anchor;
  return (
    <Link
      href={`/about-data#${target}`}
      className={[
        "inline-block text-[11px] leading-none",
        "text-ink-700 hover:text-atlas-700",
        "border-b border-dotted border-atlas-300 hover:border-atlas-700",
        "transition-colors no-underline",
        className || "",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
