# Margin Atlas — Phase F Launch Checklist

**Owner:** Founder (you)
**Goal:** Take the repo from green-build to live at `www.marginatlas.com` with analytics, error monitoring, and the apex domain redirecting correctly.
**Estimated total time:** ~2 hours, mostly waiting on DNS.

Work the steps in order. Every section has a clear DONE signal — don't skip ahead until each one fires.

---

## 0. What's already wired (no action needed)

The Phase F code drop has already:

- Added Plausible Analytics script to `src/app/layout.tsx` (loads with `strategy="afterInteractive"`, data-domain = `www.marginatlas.com`).
- Installed `@sentry/nextjs` and created `sentry.{client,server,edge}.config.ts` + `src/instrumentation.ts`. PII scrubbing wired into `beforeSend`.
- Wrapped `next.config.js` with `withSentryConfig`. Added `poweredByHeader: false` and image `remotePatterns` for Unsplash / Pexels / Wikimedia.
- Switched `metadataBase`, `robots.ts` sitemap+host, `sitemap.ts` BASE_URL, all JSON-LD URLs, breadcrumbs, embed, status, and `[country]/[geo]/[industry]` canonical URLs to `https://www.marginatlas.com`.
- Added a `marginatlas.com → www.marginatlas.com` 308 redirect in `src/middleware.ts` (server-side fallback if Vercel DNS hiccups).
- Created `.env.example` enumerating every required env var with comments.

---

## 1. Pre-launch verification (15 min, local)

Run from `E:/atlas/website/`:

```bash
npm run lint
npm run build
```

Expected: both exit 0. Any TypeScript error or build failure blocks launch — fix before going further.

Then in dev mode (`npm run dev`), spot-check:

- [ ] `http://localhost:3000/` — homepage renders, search bar visible
- [ ] `http://localhost:3000/sitemap.xml` — returns the sitemap index, lists `sitemap/0.xml` through `sitemap/4.xml`
- [ ] `http://localhost:3000/robots.txt` — references `https://www.marginatlas.com/sitemap.xml` and `host: https://www.marginatlas.com`
- [ ] `http://localhost:3000/us/california/restaurants` (or any real cell) — narrative renders, breadcrumbs link with `https://www.marginatlas.com`
- [ ] `http://localhost:3000/gb` — country page renders
- [ ] `http://localhost:3000/industries/restaurants` — industry page renders
- [ ] `http://localhost:3000/admin/review?key=<your-ADMIN_KEY>` — admin gate accepts the key

If any of these 404 or 500, stop and fix locally before deploying.

---

## 2. Vercel deploy (30 min)

### 2a. Project import

1. Go to <https://vercel.com> and sign in (GitHub OAuth recommended — auto-wires the repo).
2. **New Project** → **Import Git Repository** → pick the Margin Atlas repo.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: leave as repo root (the website lives there).
5. Build command: **default** (`npm run build`).
6. Output directory: **default** (`.next`).
7. **Don't deploy yet** — env vars first.

### 2b. Env vars

Open the project → **Settings** → **Environment Variables**. For each variable in `.env.example`, paste the production value and tick **Production** (also tick Preview/Development if you want previews to work the same).

| Variable                          | Source                                                          |
| --------------------------------- | --------------------------------------------------------------- |
| `SUPABASE_URL`                    | Supabase project settings → API → Project URL                   |
| `SUPABASE_SERVICE_ROLE_KEY`       | Supabase → API → service_role key (NOT anon)                    |
| `NEXT_PUBLIC_SUPABASE_URL`        | Same as `SUPABASE_URL`                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase → API → anon/public key                                |
| `UNSPLASH_ACCESS_KEY`             | Unsplash → Your apps → Access Key                               |
| `UNSPLASH_SECRET_KEY`             | Unsplash → Your apps → Secret Key                               |
| `PEXELS_API_KEY`                  | Pexels → Account → API                                          |
| `ANTHROPIC_API_KEY`               | console.anthropic.com → API Keys                                |
| `ADMIN_KEY`                       | Generate any strong random string (e.g. `openssl rand -hex 32`) |
| `NEXT_PUBLIC_SENTRY_DSN`          | Filled in step 5 below — paste a placeholder for now            |
| `SENTRY_AUTH_TOKEN`               | Optional; set after Sentry project exists if you want source maps |
| `SENTRY_ORG`, `SENTRY_PROJECT`    | Optional; only needed alongside the auth token                  |

### 2c. First deploy

1. Click **Deploy**.
2. Wait ~3-5 min for the build.
3. First deploy lands at `<project-name>.vercel.app`. Open it.
4. Verify: homepage loads, a random cell page loads, no obvious errors.

**DONE signal:** the `.vercel.app` URL serves the live homepage.

---

## 3. DNS cut to `www.marginatlas.com` (20 min + propagation wait)

### 3a. Add the domain in Vercel

1. Project → **Settings** → **Domains**.
2. Add `www.marginatlas.com` — Vercel will show CNAME instructions.
3. Add `marginatlas.com` (apex) — Vercel will show either an A record or ALIAS instructions.
4. Mark `www.marginatlas.com` as the **primary** domain (small flag icon). This makes Vercel issue 308s from the apex automatically.

### 3b. Configure DNS at the registrar

Log into wherever the domain is registered (Namecheap / Google Domains / Cloudflare / etc.). Set:

| Type    | Name | Value                       | Notes                                  |
| ------- | ---- | --------------------------- | -------------------------------------- |
| `CNAME` | www  | `cname.vercel-dns.com`      | Standard Vercel CNAME                  |
| `A`     | @    | `76.76.21.21`               | Vercel apex IP                         |

If your registrar supports ALIAS/ANAME instead of A for the apex, use:

| Type      | Name | Value                       |
| --------- | ---- | --------------------------- |
| `ALIAS`   | @    | `cname.vercel-dns.com`      |

(Cloudflare: set the orange cloud to **DNS only** / grey, not proxied — Vercel handles TLS.)

### 3c. Wait for TLS

Vercel auto-issues a Let's Encrypt cert as soon as the DNS records resolve. This usually takes 5-15 min after DNS propagates; can take up to an hour.

**DONE signal:** in Vercel → Domains, both `www.marginatlas.com` and `marginatlas.com` show **Valid Configuration** with a green checkmark and an active SSL cert.

### 3d. Smoke test the canonical setup

```bash
curl -I https://www.marginatlas.com/         # expect 200
curl -I https://marginatlas.com/             # expect 308 → www
curl -I http://www.marginatlas.com/          # expect 308 → https
```

If the apex doesn't 308-redirect via Vercel's built-in handling, the middleware fallback in `src/middleware.ts` will catch it on the next request — no action needed.

---

## 4. Plausible Analytics setup (10 min)

1. Sign up at <https://plausible.io>.
2. **Add a site** → domain = `www.marginatlas.com` (must match the `data-domain` in `src/app/layout.tsx`).
3. Pick the $9/mo plan if you want production support; the trial is fine to start.
4. Skip the "install the snippet" step — it's already in the layout.
5. Open `https://www.marginatlas.com/` in a fresh tab.
6. Reload the Plausible dashboard.

**DONE signal:** Plausible shows **1 current visitor** within 60 seconds.

Optional — to track custom events (search submits, calculator runs, region clicks), edit the relevant component to call `window.plausible?.('event-name')`. Already-firing default events: pageviews + outbound link clicks.

---

## 5. Sentry setup (10 min)

1. Sign up at <https://sentry.io>.
2. **Create Project** → platform = **Next.js** → name it `margin-atlas`.
3. Sentry shows a DSN like `https://abc123@o4506...ingest.sentry.io/4506...` — copy it.
4. Paste it into Vercel → Project → Settings → Environment Variables → `NEXT_PUBLIC_SENTRY_DSN` (Production scope). **Replace** the placeholder.
5. (Optional) Generate a Sentry **auth token** at Settings → Auth Tokens → scope `project:releases`. Paste into Vercel as `SENTRY_AUTH_TOKEN` to enable source map uploads. Also set `SENTRY_ORG` and `SENTRY_PROJECT` if you want uploads to work; the build won't fail without them.
6. Redeploy: Vercel → Deployments → latest → ⋯ menu → **Redeploy**. (Env var changes need a redeploy to take effect.)
7. Trigger a known error to confirm wiring. Quickest path: temporarily add a throwing page, or visit a route that intentionally 500s. Or use the browser console: `Sentry.captureException(new Error("phase-f wiring test"))` from the homepage (the Sentry SDK is on `window` in production).

**DONE signal:** the test error appears in the Sentry **Issues** view within 60 seconds.

---

## 6. Final QA (30 min)

Hit the live `www.marginatlas.com` and tick each:

- [ ] Homepage loads, hero renders, search works
- [ ] `https://marginatlas.com/` → 308 redirects to `https://www.marginatlas.com/`
- [ ] DevTools → Mobile emulation at 375px width: hero doesn't overflow, header collapses cleanly
- [ ] Submit a search query → results page renders
- [ ] Visit 5 random cell pages (e.g. `/us/california/restaurants`, `/gb/london/cafes`, `/jp/tokyo/manufacturing`): each loads, narratives render, breadcrumbs work
- [ ] `/world` map renders
- [ ] `/calculator` — submit a sample input, calculation runs
- [ ] `/compare` — picks two cells and renders
- [ ] `/admin/review?key=<ADMIN_KEY>` — gated access works; wrong key 401s
- [ ] Newsletter signup (if wired to Mailchimp/ConvertKit) — submit own email, confirm it lands
- [ ] `/sitemap.xml` returns valid XML, links to the 5 sub-sitemaps
- [ ] `/robots.txt` references `https://www.marginatlas.com/sitemap.xml`
- [ ] Footer year, copyright, and version look right
- [ ] No console errors on the homepage in production build
- [ ] Plausible dashboard counts your QA visits
- [ ] Sentry dashboard stays empty (or only has the test error from step 5)

---

## 7. Post-launch monitoring (continuous, first 24h)

- **Sentry dashboard** — refresh every few hours. Any new error type with >5 occurrences should be triaged within the day.
- **Plausible** — watch the live visitor count and the realtime page list. Confirms the site is actually reachable from outside your network.
- **Vercel → Deployments → Build Logs** — keep an eye out for build-time warnings that crept in.
- **Vercel → Speed Insights** (Pro tier only) — once you have a day of traffic, check Core Web Vitals. LCP target < 2.5s, CLS < 0.1.

If you upgrade to Vercel Pro ($20/mo), enable **Speed Insights** and **Web Analytics** for free — they complement Plausible (Vercel's are bot-filtered + technical, Plausible's are human-focused + simple).

---

## 8. Submit to search engines (10 min, after 24h of uptime)

Once the site has been live and reachable for ~24h:

1. **Google Search Console**: <https://search.google.com/search-console>
   - Add property → **Domain** (preferred) → `marginatlas.com`
   - Verify via DNS TXT record at the registrar
   - Submit sitemap: `https://www.marginatlas.com/sitemap.xml`
2. **Bing Webmaster Tools**: <https://www.bing.com/webmasters>
   - Same flow; or auto-import from Google Search Console.

Both should start indexing within days.

---

## Troubleshooting

**TLS cert stuck "pending" > 1h** — Confirm both DNS records resolve (`dig www.marginatlas.com CNAME` and `dig marginatlas.com A`). If they don't, your DNS change hasn't propagated. If they do, in Vercel → Domains → click **Refresh** on the domain.

**Apex doesn't redirect** — Vercel's built-in apex→www redirect requires the primary flag set on `www.marginatlas.com` in Settings → Domains. If that's set and it still doesn't redirect, the middleware fallback (`src/middleware.ts`, `host === "marginatlas.com"` check) will catch it.

**Plausible shows 0 visitors after loading the homepage** — Open DevTools → Network → filter "plausible". Should see a 202 POST to `event`. If you see it blocked by your ad-blocker, that's expected — try in an incognito window without extensions.

**Sentry doesn't capture errors** — Confirm `NEXT_PUBLIC_SENTRY_DSN` is set in **Production** scope (not just Preview) and that you redeployed after setting it. The DSN must match the format `https://XXX@oNNN.ingest.sentry.io/PPP`.

**Build fails with `withSentryConfig is not a function`** — `npm install` didn't pick up `@sentry/nextjs`. Re-run `npm install` and commit the lockfile.

**Anything else** — Vercel build logs are the first place to look; Sentry catches runtime errors; Plausible confirms the page loaded.
