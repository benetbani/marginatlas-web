/**
 * SiteFooter , the one footer for every v2 page.
 *
 * WHAT IT REPLACES. Five v2 pages each ended with the same placeholder:
 * `<footer><span className="tag">Margin Atlas</span></footer>`. A dashed pill
 * carrying the site's name is not a footer; it is a note saying the footer was
 * not written yet, repeated five times.
 *
 * WHAT A FOOTER IS FOR HERE. A reader who reaches it has finished. Their intent
 * is exploratory, not extractive: what else is here, how was this built, can it
 * be trusted. So the footer carries the two axes the site is organised by
 * (places and trades), the tools, the pages that show the working, and one
 * sentence saying what the site is. It does not carry a pitch.
 *
 * THE SOCIAL ROW, AND THE RULE THAT GOVERNS IT.
 * `CHANNELS` is the single list of everything a reader could follow, and every
 * `href` is `string | null`. **A null href renders nothing at all**: no icon, no
 * greyed placeholder, no tooltip promising an account. Today every entry is
 * null, because no Margin Atlas account exists on any network and no feed route
 * has been built, so the row renders ZERO icons and the footer is designed to
 * look finished at zero rather than to look like something failed to load.
 * BRAND.md states the reason: a social icon linking nowhere is the first small
 * lie a reader catches. The decision behind the list, channel by channel, is in
 * `design/loop4/research/2026-08-04-social.md`.
 *
 * WHY THIS FILE CARRIES A STYLE BLOCK, WHICH IS OTHERWISE DISCOURAGED.
 * `atlas-spine.css` is generated from the founder's mockup and must never be
 * edited, and it has no footer rules beyond the bare `.av2 footer` band. Rest
 * and hover colours cannot be expressed as inline styles: an inline `color`
 * beats any stylesheet `:hover`, so putting the rest colour inline would make
 * the hover state impossible. The block below therefore owns COLOUR STATE only,
 * uses nothing but existing tokens, and follows the stylesheet's own hover
 * contract (guarded by `hover:hover and pointer:fine` so a tap on a phone leaves
 * no sticky state). Layout stays inline, as on every other v2 surface.
 *
 * LINKS ARE RESOLVED, NEVER ASSEMBLED. The one country named here goes through
 * `countryPageTarget`, which checks the same list `/[country]` gates on, so it
 * cannot promise a page the route would refuse. If it ever returns null the line
 * disappears rather than 404ing.
 */
import * as React from "react";

import {
  ButterflyIcon,
  LinkedinLogoIcon,
  RssSimpleIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

import { countryPageTarget } from "@/lib/geo/page_targets";

/* ---------------------------------------------------------------------------
   THE CHANNELS.

   One constant, exported so a gate or an audit can read it without rendering
   the component. `href: null` means the account does not exist. Creating an
   account is the founder's call and nothing here does it; when one exists, the
   only edit is the string.

   The icon set is fixed by BRAND.md: drawn glyphs from
   @phosphor-icons/react/dist/ssr, one stroke weight, never a brand colour and
   never a coloured circle badge. Bluesky has no logo in Phosphor; Butterfly is
   the mark the library provides for it and it is drawn in the same weight as
   the rest, which is the property that matters.

   RssSimple is not a social network. It is here because it is the only follow
   channel with no algorithm in the middle, the two personas who read by feed
   (analysts and journalists) are the two the site is built for, and it belongs
   in the same row for the same reason. No feed route exists yet either, so it
   is null with the rest.
--------------------------------------------------------------------------- */
export type Channel = {
  name: string;
  href: string | null;
  Icon: typeof XLogoIcon;
};

export const CHANNELS: ReadonlyArray<Channel> = [
  { name: "LinkedIn", href: null, Icon: LinkedinLogoIcon },
  { name: "X", href: null, Icon: XLogoIcon },
  { name: "Bluesky", href: null, Icon: ButterflyIcon },
  { name: "Feed", href: null, Icon: RssSimpleIcon },
];

/* ---------------------------------------------------------------------------
   THE LINKS.

   Every href is a route that exists under src/app, checked against the route
   list and then opened in a browser. Nothing is assembled from parts.
--------------------------------------------------------------------------- */

/** The one country a footer can justify naming: the only one carrying a cell
 *  reconciled line by line. Resolved, so it is a link or it is nothing. */
const ANCHOR_COUNTRY = countryPageTarget("GB");

type FooterLink = { label: string; href: string };
type FooterColumn = { id: string; title: string; links: ReadonlyArray<FooterLink> };

const COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    id: "places",
    title: "Places",
    links: [
      { label: "Every country", href: "/world" },
      { label: "Countries A to Z", href: "/countries" },
      { label: "Every city", href: "/cities" },
      ...(ANCHOR_COUNTRY
        ? [{ label: ANCHOR_COUNTRY.label, href: ANCHOR_COUNTRY.href }]
        : []),
    ],
  },
  {
    id: "trades",
    title: "Trades",
    links: [
      { label: "Every trade", href: "/industries" },
      { label: "Restaurants in London", href: "/gb/london/restaurants" },
      { label: "Highs and lows", href: "/extremes" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    links: [
      { label: "All tools", href: "/tools" },
      { label: "Which business, and where", href: "/decide" },
      { label: "Break even and take home", href: "/calculator" },
      { label: "Compare two places", href: "/compare" },
      { label: "Margin Index", href: "/margin-index" },
      { label: "What the paid tier adds", href: "/pricing" },
    ],
  },
  {
    id: "working",
    title: "How this works",
    links: [
      { label: "How a figure is built", href: "/methodology" },
      { label: "About the data", href: "/about-data" },
      { label: "What is covered", href: "/coverage" },
      { label: "Common questions", href: "/faq" },
      { label: "Notes", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const FINE_PRINT: ReadonlyArray<FooterLink> = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

/* Colour state only. Layout is inline, as everywhere else in the v2 kit.
   The hover guard and the reduced-motion twin mirror the stylesheet's own
   hover contract rather than inventing a second one. */
const FOOTER_STYLE = `
.av2 .sitefoot .cols a{color:var(--ink-2)}
.av2 .sitefoot .fine a{color:var(--muted)}
.av2 .sitefoot .ch a{color:var(--n2);display:inline-flex}
.av2 .sitefoot a{transition:color .09s ease-out}
@media (hover:hover) and (pointer:fine){
  .av2 .sitefoot .cols a:hover,.av2 .sitefoot .fine a:hover,.av2 .sitefoot .ch a:hover{color:var(--ink)}
}
@media (prefers-reduced-motion:reduce){.av2 .sitefoot a{transition:none}}
`;

/**
 * The brand mark, rebuilt at the call site.
 *
 * `.brand` and its `.m` square are scoped `.av2 .mast .brand` in the
 * stylesheet, so they are unstyled anywhere else and the footer cannot borrow
 * the class without borrowing a sticky, z-20 masthead with it. Same 15px
 * square, same radius token, same gradient between the same two terracottas.
 */
function BrandMark() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "-.01em",
        color: "var(--ink)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 15,
          height: 15,
          borderRadius: "var(--r-xs)",
          flex: "none",
          background:
            "linear-gradient(150deg,var(--terra-bright),var(--terra-deep))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)",
        }}
      />
      Margin Atlas
    </span>
  );
}

export function SiteFooter() {
  /* The whole rule in one line: a channel with no account is not rendered. */
  const live = CHANNELS.filter(
    (c): c is Channel & { href: string } => c.href !== null,
  );

  return (
    <footer className="sitefoot">
      <style>{FOOTER_STYLE}</style>

      {/* `.av2 footer` is a flex band with a hairline above it. One full-width
          child lets the footer keep that band and compose inside it, rather
          than overriding a display the founder set. */}
      <div style={{ width: "100%" }}>
        <BrandMark />

        {/* The site in one sentence. Verbatim from BRAND.md, which requires it
            to match the homepage's opening line word for word: the two are
            deliberately kept in step so the answer to "what is this" is the
            same wherever it is asked. */}
        <p
          style={{
            margin: "10px 0 0",
            maxWidth: "58ch",
            fontSize: 12.5,
            lineHeight: 1.55,
            color: "var(--muted)",
          }}
        >
          What a small business earns, and what its owner actually keeps, trade
          by trade and place by place.
        </p>

        <nav
          className="cols"
          aria-label="Footer"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "26px 26px",
            marginTop: 32,
          }}
        >
          {COLUMNS.map((col) => (
            <div key={col.id}>
              <div className="lab" id={`sitefoot-${col.id}`} style={{ marginBottom: 10 }}>
                {col.title}
              </div>
              <ul
                aria-labelledby={`sitefoot-${col.id}`}
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {/* The anchor carries the 40px floor, not the li. This
                    component already states the principle for its social
                    glyphs, "16px is the glyph; the 12px padding around it is
                    what makes the target", and then did not apply it to the 22
                    text links beside them, which measured 16px tall at 390px.
                    Padding on the li would grow the row without growing the
                    thing a thumb has to hit. */}
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      style={{
                        fontSize: 12.5,
                        display: "flex",
                        alignItems: "center",
                        minHeight: 40,
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className="fine"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 32,
            paddingTop: 16,
            borderTop: "1px solid var(--hair)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {/* The legal strip was missed when the 22 column links were given
                their 40px minimum, and it renders at 18px. Three links nobody
                clicks often are still three links, and "Privacy" is one a
                reader goes looking for deliberately. */}
            {FINE_PRINT.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{ display: "inline-flex", alignItems: "center", minHeight: 40 }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Zero channels today, so this whole block is absent rather than
              empty. 16px is the glyph; the 12px padding around it is what makes
              the tap target 40px, which BRAND.md's spec did not state and
              DESIGN.md requires. An icon-only link carries its own name. */}
          {live.length > 0 ? (
            <div className="ch" style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {live.map(({ name, href, Icon }) => (
                <a key={name} href={href} aria-label={name} style={{ padding: 12 }}>
                  <Icon size={16} weight="regular" aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
