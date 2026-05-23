/**
 * ComingSoonPlaceholderCard
 * =========================
 *
 * Silent placeholder for grid positions where the content is upcoming.
 * Matches surrounding card styling (rounded-2xl, parchment border,
 * cream-50 background) but sits at 70% opacity so it reads as future
 * rather than active. No CTA on purpose: the surrounding context owns
 * navigation.
 */

import { Hourglass } from "@phosphor-icons/react/dist/ssr";

export type ComingSoonPlaceholderCardProps = {
  /** One-line description, e.g. "Country profile for Paraguay". */
  description: string;
  className?: string;
};

export default function ComingSoonPlaceholderCard({
  description,
  className,
}: ComingSoonPlaceholderCardProps) {
  return (
    <div
      className={[
        "rounded-2xl bg-cream-50 border border-parchment p-5 opacity-70",
        className ?? "",
      ].join(" ")}
      aria-label={`Coming soon: ${description}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-atlas-700">
          <Hourglass size={16} weight="regular" aria-hidden="true" />
        </span>
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-cocoa-700/70">
          Coming soon
        </span>
      </div>
      <p className="mt-4 text-sm text-cocoa-700 leading-snug">
        {description}
      </p>
    </div>
  );
}
