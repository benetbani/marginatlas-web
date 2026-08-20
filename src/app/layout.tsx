import "./globals.css";
import type { Metadata } from "next";

// Pin all server-rendered routes to Frankfurt. Supabase
// project lives in eu-west-1 (per the dashboard banner); Vercel default
// is iad1 (US East). Every Supabase query was eating ~80-150ms of
// transatlantic round-trip latency. Pinning Vercel to fra1 (Frankfurt)
// puts the function 10-30ms from the DB. With 4 queries per cell page
// that's roughly 300-600ms shaved off the cold-render time.
//
// Override per-route by re-exporting preferredRegion at the page level.
export const preferredRegion = "fra1";

import Script from "next/script";
import { Geist, Space_Grotesk } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Organization } from "@/components/StructuredData";
import { PaywallModalRoot } from "@/components/monetization";
import { AtlasGutters } from "@/components/kit";
import { isWarmFrameEnabled } from "@/lib/feature_flags";

// Typography.
//
// GEIST + SPACE GROTESK, SITE-WIDE, 2026-08-20. This replaces Newsreader + Inter
// and it is a PORT of a standing ruling rather than a new choice.
//
//   rules/FOUNDER-VERDICTS.md: "Standing: Geist + Space Grotesk, Geist Mono
//   numbers weight 500. [rule 38]"
//   rules/FORM-CATALOG.md (2026-07-11): "The locked skin is Geist + Space
//   Grotesk, terracotta on answers only, hairline cards, tokens only."
//
// Both faces were already installed and already loaded by src/lib/fonts-spine.ts
// for the v2 spine surfaces. Measured 2026-08-20: the ratified pair reached
// exactly ONE reader-facing component while the whole site chrome ran a serif
// plus Inter. So this is not a redesign, it is the rest of the site catching up
// with its own rulebook, and it closes the cohesion gap of two faces on one site.
//
// WHAT THIS SUPERSEDES, said plainly rather than deleted. The 2026-06-15 display
// decision picked Newsreader from a serif showcase, over Fraunces, Spectral and
// Playfair. That was a choice among SERIFS for the display slot. The 2026-07-11
// locked skin is newer, and the founder ruled again on 2026-08-20 while looking
// at neo-grotesque reference cards: "that's the kind of font that we should use
// on the site." A newer founder ruling beats an older one; the older one is
// recorded here so nobody re-derives it as a regression.
const displayFace = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  /* THE SLOT IS `--font-serif`, NOT `--font-display`, and the rename is a bug
     fix rather than a preference. globals.css declares
     `--font-display: var(--font-display), Newsreader, ...` on :root, which is
     the SAME element this class lands on, so the property referenced itself.
     Measured in a browser on a two-order fixture: when the :root declaration
     wins the tie, `--font-display` computes to the EMPTY STRING and every
     `font-family: var(--font-display)` element silently inherits the body sans.
     Not Newsreader, and not the Georgia written beside it, because a
     self-referential custom property is invalid at computed-value time and it
     takes the whole declaration with it. When the class wins instead, the
     :root declaration is simply discarded, so its fallback chain never applies
     either. Harmful in one order, useless in the other, and which one you get
     depends on stylesheet ordering.
     `--font-sans` next to it never had this problem because the slot and the
     consumer have different names. This makes the serif follow its neighbour. */
  variable: "--font-serif",
});
const bodyFace = Geist({
  subsets: ["latin"],
  /* 700 stays loaded even though rulebook v1 caps DISPLAY weight at semibold.
     That ban is enforced by `verify_no_bold_display` over six named surface
     files, not by starving the site of the weight: `font-bold` is still used in
     tables and chrome outside those files, and dropping 700 here would not
     remove it, it would make the browser SYNTHESISE a bold, which is worse
     looking and invisible to every gate. */
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Margin Atlas: Small-business benchmarks worldwide",
  description:
    "Revenue, payroll, and after-tax owner take-home for small businesses worldwide, broken down by industry, city, and size. Compiled from official business statistics and standardized for cross-country comparison.",
  metadataBase: new URL("https://www.marginatlas.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // The sitewide social card. Before this, openGraph declared no image and
  // twitter declared card: "summary_large_image" with no image to put in it,
  // so every route that does not set its own picture, the home page included,
  // told each platform to reserve a large image slot and then handed it
  // nothing.
  //
  // THE RULE THIS FILE CANNOT ENFORCE, and the one a future reader needs:
  // a route that declares its own `openGraph` MUST supply its own `images`.
  // Next resolves metadata per KEY by REPLACEMENT, not by deep merge
  // (node_modules/next/dist/lib/metadata/resolve-metadata.js, the openGraph
  // case assigns rather than merges), so a page that sets openGraph for a
  // title alone silently discards everything below, images included. The same
  // holds for `twitter`. This is not inheritance with overrides; it is
  // wholesale substitution, and it fails silently.
  //
  // That is exactly how the two /industries hubs shipped with a twitter:image
  // and no og:image at all, which is the tag every non-X platform reads.
  //
  // The path is relative because metadataBase above resolves it to an
  // absolute URL in the emitted tags, which is the convention every existing
  // OG image on the site already follows (see the three
  // src/app/[country]/[geo]/[industry] pages, which pass a relative
  // /og/cell?... path the same way).
  //
  // /og/default carries no figures on purpose. A default card cannot know
  // which page was pasted, so any number on it would be a number that does
  // not say what it measures.
  openGraph: {
    title: "Margin Atlas: Small-business benchmarks worldwide",
    description:
      "Revenue, payroll, and after-tax owner take-home for small businesses worldwide, by industry, city, and size.",
    url: "https://www.marginatlas.com",
    siteName: "Margin Atlas",
    type: "website",
    images: [{ url: "/og/default", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Margin Atlas: Small-business benchmarks worldwide",
    description:
      "Small-business revenue, payroll, and owner take-home, by industry, city, and size.",
    images: ["/og/default"],
  },
};

/* --atlas-header-h HAS THREE VALUES BECAUSE THE MASTHEAD HAS THREE HEIGHTS.
   It declared two, 80 and 88, and matched the bar at neither.

   Measured on the rendered page, header.getBoundingClientRect().height against
   the token at the same width:

       360     84.8   token 80    -4.8
       753    124.8   token 88   -36.8     <- the bar wrapped to two rows
      1265     88.8   token 88    -0.8

   Every `top-[var(--atlas-header-h)]` sticky on this site was pinned to a
   number the bar does not have, and the 768-to-1023 band was out by nearly
   37px. The wrap is fixed at its cause in SiteChrome, where the seven-link nav
   switched on at md with no room for it; both it and MobileNav now change at
   lg, so 753 measures 92.8 rather than 124.8.

   What remains is three genuine heights, and they land on Tailwind's own
   breakpoints: the hamburger is a 44px control and makes 768-1023 the tallest
   band, while 1024+ is shorter because the inline nav is not as tall as the
   button it replaces. Each value is rounded UP to the next whole pixel, so a
   sticky may sit a fraction low but never underneath the bar. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Warm frame (R6 Phase B): the glass chrome class on the sticky header swaps
  // in only when the frame is on; the gutters render themselves (no-op when
  // off). With the flag off the header keeps its white + parchment-hairline bar.
  const warmFrame = isWarmFrameEnabled();
  const headerClass = warmFrame
    ? "atlas-glass-chrome sticky top-0 z-raised"
    : "bg-white border-b border-parchment sticky top-0 z-raised";
  return (
    <html
      lang="en"
      className={`${displayFace.variable} ${bodyFace.variable} [--atlas-header-h:85px] md:[--atlas-header-h:93px] lg:[--atlas-header-h:89px]`}
    >
      {/* SaaS reformation 2026-06-12 — the body is the app ground, a cool
          neutral (via the `body` rule in globals.css). The .atlas-paper
          class stays on map containers and white panels only; white cards
          sit on this ground, seated by the elevation scale. */}
      <body className="min-h-screen text-ink-900 font-sans">
        {/* Warm frame (R6 Phase B): the fixed place-photography gutters behind
            the whole page. Renders nothing unless NEXT_PUBLIC_WARM_FRAME is on;
            sits at z -1 so all content paints above it and the imagery only
            shows in the empty margins beside the readable column. */}
        <AtlasGutters />
        {/* Microsoft Clarity — heatmaps + session recordings, free forever.
            The src URL is Clarity's loader; it injects the actual tracking
            script after load. afterInteractive so it never blocks render. */}
        <Script
          id="ms-clarity"
          src="https://www.clarity.ms/tag/wtu315an8b"
          strategy="afterInteractive"
        />
        <Organization />
        {/* The site masthead, <main>, newsletter bar and footer used to sit
           here and therefore wrapped every route. They now live in
           <SiteChrome>, rendered by src/app/(site)/layout.tsx and by the
           [country] pages that want them.

           They could not stay here. One URL, /[country]/[geo]/[industry],
           serves three different renders chosen at REQUEST TIME by data,
           and App Router layouts are keyed by path, not by data. Reading
           the path here via headers() would make this layout dynamic and
           opt every route out of static rendering.

           What remains below is genuinely global: the gutters, analytics,
           the Organization schema, and the paywall root. */}
        {children}
        {/* Plan v26 C.5 — Vercel Speed Insights: real-user LCP / CLS /
           INP captured per route. Free on Hobby. View in Vercel
           dashboard → Speed Insights. */}
        <SpeedInsights />
        {/* Plan v34 Phase B — paywall modal mounted once at the layout
           level. Listens for the atlas:open-paywall custom event from
           any lock primitive on any page. */}
        <PaywallModalRoot />
      </body>
    </html>
  );
}
