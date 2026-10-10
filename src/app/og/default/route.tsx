/**
 * /og/default , the sitewide social card.
 *
 * Usage: wired into the root layout's openGraph.images and twitter.images,
 * so every route that does not set its own image inherits this one.
 *
 * Why it exists. The root layout declared twitter.card =
 * "summary_large_image" and supplied no image at all, which tells every
 * platform to reserve a large image slot and then hands it nothing. Around
 * ninety routes, the home page among them, shared as a blank frame. That is
 * worse than declaring nothing, because "nothing declared" degrades to a
 * plain link and "large image, absent" degrades to a broken one.
 *
 * WHY IT CARRIES NO FIGURES. A sitewide default cannot know which page it is
 * representing. Any number printed here would be attached to whatever URL
 * happened to be pasted, which is the one unforgivable thing on this project:
 * a figure that does not say what it measures. The per-cell card at /og/cell
 * is where numbers belong, because that route resolves the actual cell and
 * states its coverage tier alongside it.
 *
 * Node.js runtime, matching /og/cell. See that file's header for the Edge
 * bundle-size history that forced the switch.
 */
import { ImageResponse } from "next/og";
// The frame, the brand lockup and the footer, shared with the four data cards
// so the family stays ONE design. The palette lives there too; see that file's
// header for why these are raw literals and not token reads. The hero block
// below stays local: it is the only card that leads with a claim rather than a
// title, and it hangs off the bottom on a terracotta rule.
import {
  CARD_SIZE,
  INK,
  TERRACOTTA,
  OgFrame,
  OgBrand,
  OgFooter,
} from "../_card";
import { COPY } from "@/lib/spine/copy";

export const runtime = "nodejs";
// The output is byte-identical on every request: no params, no data, no clock.
// Without this each crawler scrape re-rasterises the same 76 KB PNG. /og/cell
// cannot do this because its output depends on query parameters.
export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <OgFrame>
        <OgBrand />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            borderLeft: `6px solid ${TERRACOTTA}`,
            paddingLeft: 28,
          }}
        >
          {/* THE CARD SAYS WHAT THE HOME SAYS (plan 2026-10-10, the home reformed to ship, Task 7; the ship audit's 2.3): the
              site's one definition (COPY.home.definition), the line the home prints under its picker and both structured-data
              blocks state, and the card's alt in the root layout. It read "What a small business actually earns" over a second
              line in the old positioning ("Revenue, payroll, and after-tax owner take-home, by trade, city, and size."); one
              sentence now, so the card makes no claim the page does not. */}
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: INK,
            }}
          >
            {COPY.home.definition}
          </div>
        </div>

        {/* 20, not the data cards' 18: this footer sits under a wider hero. */}
        <OgFooter marginTop={40} fontSize={20} />
      </OgFrame>
    ),
    CARD_SIZE
  );
}
