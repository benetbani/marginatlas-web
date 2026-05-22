# Monitoring + alerting setup

> Plan v26 C.5 — production monitoring so we catch the next silent
> regression in minutes instead of weeks. Configuration tasks only;
> no code changes required after the @vercel/speed-insights install.

## What's already wired

- `@vercel/speed-insights` mounted in `src/app/layout.tsx`. Real-user
  metrics (LCP / CLS / INP) flowing to Vercel dashboard.
- `@sentry/nextjs` installed and runtime errors flow to Sentry.
- `scripts/audit/deploy_smoke_test.ts` — 17-assertion post-deploy
  test. Run manually after each deploy.

## What you still need to configure (in dashboards, no code)

### Vercel — deploy notifications

Why: catch failed builds via email instead of via my screenshot
debugging two days later.

How:
1. Open Vercel dashboard → Project `marginatlas-web-twtl` → Settings → Notifications
2. Add Notification → Email → enter your address
3. Select events:
   - **Deployment failed** (✓ critical)
   - Deployment ready (optional)
   - Domain configured (optional)

You'll now get email any time a build fails. The screenshot you sent
earlier where every deploy from 5aee0bd through eddaad8 was red
should never happen silently again.

### Sentry — alert rules

Why: catch runtime errors before users do.

How:
1. Open https://sentry.io → your org → marginatlas project → Alerts
2. Create Alert Rule:
   - Name: "New issue in production"
   - When: A new issue is created
   - Environment: production
   - Action: send email to you
3. Create Alert Rule:
   - Name: "Spike in errors"
   - When: number of errors > 10 in 5 minutes
   - Action: send email + Slack (if wired)

### Vercel Speed Insights — review weekly

Why: real LCP / CLS / INP from actual visitors. Surfaces UX
regressions that don't throw errors.

How:
1. Vercel dashboard → Speed Insights tab (will populate after
   ~24h of traffic since the layout change)
2. Look for routes with LCP > 2.5s or CLS > 0.1 — those are the
   visible-slowness offenders.
3. Mobile vs Desktop tabs — mobile is usually the worse of the two.

### Sentry — release tracking

Sentry already gets release names from `@sentry/nextjs` (the
sentry.client.config and sentry.server.config files set this up).

If you want to compare error rates pre/post-deploy:
1. Sentry → Releases tab — should show one entry per commit
2. Each release shows: events, users affected, sessions

This is the post-mortem path when "the site broke after the v26
deploy" happens.

## What I still recommend setting up (not done)

### GitHub Action: smoke test on every deploy

The `scripts/audit/deploy_smoke_test.ts` script is great but
nobody's running it automatically after each deploy. Wire it via
GitHub Actions:

```yaml
# .github/workflows/post-deploy-smoke.yml
name: Post-deploy smoke
on:
  deployment_status:
    types: [success]
jobs:
  smoke:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx tsx scripts/audit/deploy_smoke_test.ts
        env:
          BASE: ${{ github.event.deployment_status.environment_url }}
```

If smoke fails → GitHub issue auto-opened → you get notified.

### IndexNow ping

Google deprecated sitemap ping mid-2023, but Bing accepts IndexNow.
After every deploy that adds URLs, POST to:

```
POST https://api.indexnow.org/indexnow
{
  "host": "www.marginatlas.com",
  "key": "<API_KEY>",
  "keyLocation": "https://www.marginatlas.com/<API_KEY>.txt",
  "urlList": [...]
}
```

Generate a key, put it at the keyLocation URL, and Bing /
Yandex / Seznam refresh their index within hours.

## Strategic recommendation

The single most important monitoring win is **Vercel deploy
notifications** — 60-second setup that prevents the next 3-week
silent regression. Do that first.

Speed Insights and Sentry alerts are weekly-or-monthly review tools,
not real-time saviors. Set them up but don't expect them to catch
deploy-time issues.
