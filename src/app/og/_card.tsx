/**
 * src/app/og/_card.tsx , the shared chrome behind every social card.
 *
 * WHY THIS EXISTS. There are now four cards: /og/default, /og/cell, /og/city,
 * /og/country and /og/industry. They are ONE design shown with different
 * content, not five designs. The card's look is a review artifact awaiting the
 * founder's verdict, and a verdict is only worth giving on one design: five
 * copies of a frame drift the moment anyone edits one of them, and then the
 * founder is reviewing five things and approving none.
 *
 * WHAT THIS IS NOT. It is not a redesign. Every number below (padding, type
 * size, weight, letter spacing, colour, radius, gap) is lifted verbatim from
 * the two cards that shipped, and the two of them render byte-identically
 * through this module. If a value here looks arbitrary it is because it was
 * arbitrary there, and changing it is a design decision, not a refactor.
 *
 * A leaf file inside a route segment, not a route: only `route.tsx` and
 * `page.tsx` are routable, so a colocated component here adds no URL. It has no
 * imports at all beyond the JSX the runtime supplies, which matters on these
 * routes specifically: see the Edge bundle history in /og/cell/route.tsx.
 */

/**
 * Palette. Terracotta plus cool neutrals, per the palette law in
 * docs/superpowers/plans/2026-06-16-visual-upgrade/EXECUTION-CONSTITUTION.md
 * section 1.
 *
 * These are literals rather than reads from src/lib/design-tokens.ts because
 * that file holds no cool-neutral family. Its ink and cocoa ramps are the warm
 * brown-black ladder from the 2026-06-04 Warm Atlas reformation (ink-900 is
 * #211810), so importing a token here would swap one brown for another and
 * leave a palette violation in place. The greys below are the constitution's
 * own ramp. src/app/og/ is excluded from verify_hardcoded_hex precisely because
 * image routes carry raw colour; see scripts/verify_hardcoded_hex.ts.
 */
export const INK = "#0e1116"; // grey-900, primary text
export const MUTED = "#6b7785"; // grey-500, secondary text and captions
export const TERRACOTTA = "#c11c00"; // atlas-600, the only accent

/** The card ground, identical on every card. */
const PAPER = "linear-gradient(135deg, #ffffff 0%, #f7f6f4 100%)";

/** Every card is a 1200x630 OG frame. Passed to ImageResponse by each route. */
export const CARD_SIZE = { width: 1200, height: 630 } as const;

/**
 * The outer frame: the ground, the padding, the type family, the base colour.
 * Children compose the middle; each route owns its own middle because the
 * brand card leads with a claim and the data cards lead with a title.
 */
export function OgFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: PAPER,
        padding: "72px",
        fontFamily: "sans-serif",
        color: INK,
      }}
    >
      {children}
    </div>
  );
}

/** The masthead lockup: the terracotta mark and the wordmark. */
export function OgBrand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          display: "flex",
          width: 36,
          height: 36,
          background: TERRACOTTA,
          borderRadius: 6,
        }}
      />
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
        Margin Atlas
      </div>
    </div>
  );
}

/**
 * The title block used by every card that names a place or a trade.
 *
 * `marginTop: 60` and the absence of a left rule are what separate this from
 * the brand card's hero block, which hangs off the bottom on a terracotta rule.
 * Both shapes shipped; neither is changed here.
 */
export function OgTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ display: "flex", marginTop: 60, flexDirection: "column" }}>
      <div
        style={{
          fontSize: 62,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -1.5,
          color: INK,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 26,
          marginTop: 16,
          color: MUTED,
          lineHeight: 1.3,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

/**
 * The figure block: a label, the number, the provenance sentence, and one
 * optional detail line.
 *
 * `provenance` is REQUIRED, and required as a non-optional string, because the
 * whole point of this family is that a figure on a card cannot claim more
 * confidence than the data supports. A caller that cannot derive a provenance
 * sentence must not render this block at all; it renders no figure instead.
 * Making the prop optional would let that rule be broken by omission, which is
 * how the defect happens in the first place.
 *
 * The provenance sits ABOVE the detail line so the first thing read after the
 * number is how the number was produced.
 */
export function OgFigure({
  label,
  value,
  provenance,
  detail,
}: {
  label: string;
  value: string;
  provenance: string;
  detail?: string | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "auto",
        padding: "20px 28px",
        background: "rgba(255,255,255,0.7)",
        borderRadius: 16,
        borderLeft: `6px solid ${TERRACOTTA}`,
        alignSelf: "flex-start",
      }}
    >
      <div style={{ fontSize: 20, color: MUTED }}>{label}</div>
      <div
        style={{
          fontSize: 60,
          fontWeight: 700,
          color: TERRACOTTA,
          lineHeight: 1.1,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      {provenance ? (
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: MUTED,
            marginTop: 8,
          }}
        >
          {provenance}
        </div>
      ) : null}
      {detail ? (
        <div style={{ fontSize: 20, color: MUTED, marginTop: 4 }}>{detail}</div>
      ) : null}
    </div>
  );
}

/**
 * The footer rule.
 *
 * `marginTop` is a caller decision and it is load-bearing, not cosmetic. The
 * figure block above carries marginTop:auto, so when a figure renders it
 * absorbs the free space and the footer just trails it by 32. When there is no
 * figure nothing absorbs the space, and the footer rides up under the subtitle
 * leaving the bottom third of the card empty; in that state the footer has to
 * take the auto itself. Every data card therefore passes
 * `hasFigure ? 32 : "auto"`.
 *
 * `fontSize` differs by card and both values shipped: the brand card sets its
 * footer at 20 to sit under a wider hero, the data cards at 18.
 */
export function OgFooter({
  marginTop,
  fontSize = 18,
}: {
  marginTop: number | "auto";
  fontSize?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop,
        color: MUTED,
        fontSize,
      }}
    >
      <span>marginatlas.com</span>
      <span>Small businesses worldwide</span>
    </div>
  );
}
