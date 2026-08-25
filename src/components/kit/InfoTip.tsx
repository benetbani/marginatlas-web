"use client";

/**
 * InfoTip , the "?" gloss beside a term a reader may not know.
 *
 * MOVED OUT OF THE SPINE KIT AND ONTO RADIX, 2026-08-21. The kit is
 * server-rendered, and a Radix tooltip needs the client, so it lives in its own
 * file with its own boundary. `spine/kit.tsx` re-exports it, so all thirteen
 * call sites are unchanged: same import, same props, same "?" in the same place.
 *
 * ============== WHAT WAS WRONG WITH THE HAND-ROLLED ONE =====================
 *
 * It was CSS-only: a sibling span at `opacity: 0`, revealed by
 * `group-hover/tip` and `group-focus-within/tip`. That looks fine and fails
 * three ways a reader can feel.
 *
 *  1. NOT DISMISSIBLE. WCAG 2.1 SC 1.4.13, "Content on Hover or Focus", is
 *     Level AA and requires that hover content can be dismissed without moving
 *     the pointer. There was no escape handling anywhere; the only way out was
 *     to move the mouse. Radix closes on Escape.
 *  2. NOT HOVERABLE. The same success criterion requires the revealed content
 *     itself to be hoverable, so a reader can move onto it to read a long gloss
 *     without it vanishing. The old panel carried `pointer-events-none`, which
 *     guarantees the opposite.
 *  3. ANNOUNCED TWICE. The trigger carried `aria-label={gloss}` AND the gloss
 *     sat in the DOM as a permanently-present span. A screen reader read the
 *     whole gloss as the button's name and then read it again as content. Radix
 *     wires `aria-describedby` to the panel and only while it is open, so it is
 *     announced once, as a description rather than as a name.
 *
 * The button also keeps `cursor-help` and the 3.5 x 3.5 ring, so nothing about
 * the mark a reader sees changes.
 *
 * ================== WHY THE PROVIDER IS INSIDE THIS COMPONENT ===============
 *
 * Radix wants one `TooltipProvider` above any tooltip. Putting it in the root
 * layout would be the tidier architecture and would also mean every one of
 * these thirteen call sites silently breaks if a future layout refactor drops
 * it. Keeping it here makes the component self-contained: it works wherever it
 * is dropped, including inside a server component, with no ambient setup. The
 * cost is one extra context per tip, which is negligible next to a tip that
 * renders nothing because its provider went missing.
 */
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InfoTip({
  gloss,
  className = "ml-1",
}: {
  gloss: string;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            /* The accessible NAME stays generic and the gloss becomes the
               DESCRIPTION, which Radix wires up. The old component put the
               whole gloss in aria-label, so a screen reader read a paragraph
               where a button name belongs. */
            aria-label="What this means"
            /* ONE DISPLAY, AND IT IS AN INLINE ONE. This carried both inline-flex
               and grid. Tailwind emits both and its own source order decides the
               winner, so every one of these computed as display:grid , which is
               BLOCK level. A marker that sits inside a sentence was therefore
               breaking the line before and after itself: "16 covers / ? / a day to
               break even" rendered as three lines in a card with 190px of unused
               width beside it. Seven of them on the four London pages, seventeen
               call sites in twelve files, every one of them wrong in the same way
               and none of it visible to a typecheck. place-items-center is the
               grid spelling of centring, so it goes with the grid and the flex
               spelling takes its place. */
            className={`group/tip inline-flex align-middle ${className} h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-[var(--c-line-strong)] text-[length:var(--t-micro)] font-semibold leading-none text-[var(--c-muted)]`}
          >
            ?
          </button>
        </TooltipTrigger>
        {/* max-w in ch, not rem: the old panel was a fixed 11rem, which is a
            width rather than a measure and reads differently at every type
            size it is dropped beside. */}
        <TooltipContent className="max-w-[38ch] text-[length:var(--t-micro)] leading-snug">
          {gloss}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default InfoTip;
