/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,

  // Strip the `X-Powered-By: Next.js` header — small but standard
  // security hardening. Removes a free fingerprint for opportunistic
  // CVE-scanners.
  poweredByHeader: false,

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

  experimental: {
    // Future: add typed routes when stable
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

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryBuildOptions
);
