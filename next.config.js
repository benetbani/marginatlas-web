/** @type {import('next').NextConfig} */
// Plan v30 hotfix — Sentry import removed from next.config.js entirely.
// Was being required at top-level which pulled @sentry/nextjs (~50MB
// resolved) into every build, contributing to the OOM that killed
// every Vercel deploy. Sentry runtime instrumentation lives in
// src/instrumentation.ts and runs at request-time, not build-time.
// const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,


  // Strip the `X-Powered-By: Next.js` header — small but standard
  // security hardening. Removes a free fingerprint for opportunistic
  // CVE-scanners.
  poweredByHeader: false,

  // Plan v16: raise per-page static-generation timeout from the 60s
  // default to 300s. Pages like /industries/[industry] and /[country]/[iso2]
  // do multiple Supabase hits per render; Vercel's build was timing out
  // before content finished loading. This is a build-time guardrail
  // only; runtime requests are still bound by Vercel's function limits.
  staticPageGenerationTimeout: 300,

  // External image hosts the next/image optimizer is allowed to fetch.
  // Anything else returns 400 from the optimizer endpoint.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
    ],
  },

  // Security headers applied to every response. Added 2026-05-27 in
  // the security-audit pass. Notes:
  //   - HSTS preload requires the domain be submitted at
  //     hstspreload.org; the header alone tells browsers that have
  //     already seen us to only use HTTPS going forward.
  //   - X-Frame-Options DENY + frame-ancestors 'none' are belt+braces
  //     for the same clickjacking protection (older browsers honor
  //     the legacy header; modern ones honor the CSP).
  //   - Permissions-Policy denies camera/microphone/geolocation/etc.
  //     We never request these; making it explicit means a future
  //     dependency that tries to use them gets blocked at the
  //     browser, not silently allowed.
  //   - Referrer-Policy strict-origin-when-cross-origin keeps the
  //     full URL out of third-party referer headers (the cell URL
  //     itself encodes the user's interest, which is mildly sensitive).
  //   - X-Content-Type-Options nosniff prevents browsers from
  //     re-classifying CSV / JSON responses as HTML and executing
  //     them — relevant for /api/export-csv specifically.
  // No Content-Security-Policy yet: we use inline scripts (Next.js
  // RSC payload + Sentry init) and Tailwind injects inline styles;
  // a strict CSP would need nonces threaded through every request,
  // which is a separate piece of work.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
          },
        ],
      },
    ];
  },

  // The per-city curiosities page was retired; its old URLs 308-redirect
  // to the city page so existing SEO equity carries over to the parent.
  async redirects() {
    return [
      {
        source: "/cities/:slug/curiosities",
        destination: "/cities/:slug",
        permanent: true,
      },
    ];
  },

};

// Sentry build wrapper: uploads source maps + injects the SDK.
// All flags below are no-ops without SENTRY_AUTH_TOKEN, so local builds
// and previews still work without Sentry credentials.
const sentryWebpackPluginOptions = {
  // Org/project are set via env (SENTRY_ORG, SENTRY_PROJECT) or the
  // CLI prompt during the wizard. Safe defaults: skip uploads when
  // no auth token is present.
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Don't break the build if source-map upload fails (e.g. no auth token).
  errorHandler: (err) => {
    // eslint-disable-next-line no-console
    console.warn("[sentry] source map upload skipped:", err?.message || err);
  },
};

const sentryBuildOptions = {
  // Hide internal Sentry source from public source maps.
  hideSourceMaps: true,
  // Disable the bundled CLI logger spam in CI.
  disableLogger: true,
  // Tunnel events through a Next.js route to dodge ad-blockers.
  // Keep off until we wire the /monitoring/* rewrite intentionally.
  // tunnelRoute: "/monitoring",
};

// Plan v15 Block 1a — Sentry wrapper temporarily disabled: was causing
// `RangeError: Maximum call stack size exceeded` in Set.add on every
// SSR request under Next 15.5.18 + @sentry/nextjs combination. Sentry
// itself is gated on NODE_ENV === 'production' in the runtime configs,
// so dev wasn't supposed to report anyway, but the webpack wrapper
// was injecting instrumentation that overflowed. Re-enable after
// upstream fix lands or after we pin a known-good @sentry/nextjs.
module.exports = nextConfig;
// module.exports = withSentryConfig(
//   nextConfig,
//   sentryWebpackPluginOptions,
//   sentryBuildOptions
// );
