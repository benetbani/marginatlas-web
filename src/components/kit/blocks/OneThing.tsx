/**
 * OneThing - the brand's pinned last word that closes a page (blocks family).
 *
 * A small eyebrow, then one warm confident sentence set in the display serif,
 * then a quiet sign-off row: a "last checked" freshness stamp and a humble
 * "see a number that looks off, flag it" line. It reads like a person closing
 * the page, not a footer. A faint hairline rule above it sets it apart from the
 * content it follows.
 *
 * This is FRAME / editorial scaffolding: it carries warmth (the rule, the
 * eyebrow, the serif sentence) and holds no figures, so it is server-renderable
 * with no client JS. The flag link is a plain anchor when a target is given;
 * with no target it reads as quiet non-link text rather than pointing nowhere.
 *
 * Nullable and self-honest: when no closing sentence is passed, the block prints
 * a calm honest line in place of the sentence, never a fabricated one. The
 * freshness stamp omits itself when no date is held. Reduces to a legible 375px
 * form: the sentence wraps, the sign-off row wraps, nothing scrolls sideways.
 *
 * Tokens only, no raw hex / px / ms, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/** True when a React node carries something to show. */
function hasNode(n: React.ReactNode): boolean {
  if (n == null || n === false || n === "") return false;
  if (typeof n === "string") return n.trim().length > 0;
  return true;
}

export type OneThingProps = {
  /** The single closing sentence, set in the serif. The content this block exists to carry. */
  children?: React.ReactNode;
  /** Eyebrow label above the sentence. */
  eyebrow?: string;
  /** Freshness stamp, e.g. "June 2026". Omitted from the sign-off row when not held. */
  lastChecked?: React.ReactNode;
  /**
   * Where the "Flag it." link points, e.g. a corrections page or a mailto.
   * With a target the phrase is a real link; without one it reads as quiet text
   * so the sign-off never points at a dead anchor.
   */
  flagHref?: string | null;
  /** Anchor id for the sticky section nav. */
  id?: string;
  className?: string;
};

export function OneThing({
  children,
  eyebrow = "One thing to remember",
  lastChecked,
  flagHref,
  id,
  className,
}: OneThingProps) {
  const haveSentence = hasNode(children);
  const haveStamp = hasNode(lastChecked);
  const haveFlag = hasText(flagHref);

  return (
    <section
      id={id}
      aria-label={hasText(eyebrow) ? eyebrow : "One thing to remember"}
      className={["border-t border-parchment pt-7", className].filter(Boolean).join(" ")}
    >
      {/* the small editorial rule: a quiet terracotta mark setting the close apart */}
      <span
        aria-hidden="true"
        className="mb-4 block h-[3px] w-8 rounded-full bg-atlas-500"
      />

      {hasText(eyebrow) ? <SectionEyebrow className="mb-3">{eyebrow}</SectionEyebrow> : null}

      <p className="m-0 max-w-[30ch] text-balance font-display text-xl font-medium leading-snug tracking-tight text-ink-900 md:text-2xl">
        {haveSentence
          ? children
          : "We are still gathering the one thing worth remembering about this place."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] leading-relaxed text-cocoa-700">
        {haveStamp ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-atlas-500" />
            Last checked {lastChecked}
          </span>
        ) : null}
        {haveStamp ? <span aria-hidden="true" className="text-paper-400">&middot;</span> : null}
        {/* THE INVITATION ONLY APPEARS WHEN IT CAN BE ACCEPTED. Until 2026-08-21
            the else-branch here printed "See a number that looks off? Flag it."
            with "Flag it." in the link colour at semibold, as a plain span. **No
            call site anywhere passes `flagHref`**, so on every page carrying this
            block it was a correction affordance a reader could not click: styled
            like a link, behaving like text.

            That is the founder's complaint in its purest form, and it is the
            widest instance on the site: roughly 700 fixed routes plus every cell
            and neighbourhood page. Asking a reader to report a wrong number and
            then giving them nothing to press is worse than not asking. */}
        {haveFlag ? (
          <span>
            See a number that looks off?{" "}
            <a
              href={flagHref as string}
              className="font-semibold text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:decoration-atlas-700"
            >
              Flag it.
            </a>
          </span>
        ) : null}
      </div>
    </section>
  );
}
