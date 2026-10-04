/**
 * src/lib/site/web_analytics.ts
 *
 * THE SITE'S ONE ANALYTICS SWITCH (milestone 1, M2; his interview of 2026-09-26, answer 7: "Clarity removed; cookie-free analytics
 * (Vercel Web Analytics or Plausible), no banner"). Clarity left the layout on 2026-10-04. Vercel Web Analytics counts page views
 * with no cookie and no identifier that follows a reader; Vercel serves its script at `/_vercel/insights/script.js` once he turns
 * Web Analytics on for the project, and the request 404s before that, so the layout loads it only when this flag is set
 * (`NEXT_PUBLIC_WEB_ANALYTICS=1` in the project's environment). The privacy and cookie pages read the same flag, so they describe
 * exactly what runs.
 */
export const WEB_ANALYTICS_ON = process.env.NEXT_PUBLIC_WEB_ANALYTICS === "1";
