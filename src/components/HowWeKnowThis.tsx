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
 * The link points at /about-data#<anchor>; anchors live on that page
 * (measured / regional / estimated / modeled).
 *
 * Server component. Zero client cost.
 */
import Link from "next/link";

export type HowWeKnowThisProps = {
  /** Anchor on /about-data — usually one of: measured | regional | estimated | modeled */
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
  return (
    <Link
      href={`/about-data#${anchor}`}
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
