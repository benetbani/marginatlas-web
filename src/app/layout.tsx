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
import { Newsreader, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Organization } from "@/components/StructuredData";
import { PaywallModalRoot } from "@/components/monetization";
import { AtlasGutters } from "@/components/kit";
import { isWarmFrameEnabled } from "@/lib/feature_flags";

// Typography.
// Display face decision 2026-06-15 (founder, from the serif showcase at R7 A.2.5):
// Newsreader on the --font-display slot, chosen by feel on real Atlas content over
// Fraunces, Spectral, and Playfair Display. This reverses the 2026-06-13 move to
// Fraunces; on the live masthead the founder preferred Newsreader's warm, classic
// newspaper-editorial read. Loaded as the variable font (opsz optical sizing) so
// headings and the masthead figure get the display cut.
// Inter: clean, neutral sans for body text + ALL numbers in tables, stats, and
// waterfall lines (with tabular-nums enabled).
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  style: ["normal", "italic"],
});
const inter = Inter({
  subsets: ["latin"],
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
      className={`${newsreader.variable} ${inter.variable} [--atlas-header-h:80px] md:[--atlas-header-h:88px]`}
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
