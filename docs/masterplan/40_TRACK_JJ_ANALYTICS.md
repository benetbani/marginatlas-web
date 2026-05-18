# 40 · Track JJ — Analytics + Monitoring + Error Tracking

> Operational visibility. We're flying blind on traffic, errors, and
> /ask cost. Fix before launch + growth phase.

---

## 1 · Goal

Know what's happening: traffic, conversions, errors, /ask cost. No
guessing.

---

## 2 · Sub-tracks

### JJ.1 — Vercel Analytics

Built-in, ~5 min setup. Page views, top routes, devices, countries.

Founder action: 5 min.

### JJ.2 — Plausible (or PostHog) for events

Track custom events:
- Cell page view
- /ask question submitted
- Tax overlay opened
- City picker used
- CSV export
- Sign in / Sign up
- Subscription started
- Subscription cancelled

Plausible: privacy-first, $9/mo for 10k pageviews. Or PostHog:
free tier 1M events, more complex.

Recommendation: start with Plausible (simpler).

Effort: 2 hr setup + script integration.

### JJ.3 — /ask cost monitoring

Per-request:
- Log to Supabase table `ask_queries (id, ts, ip, question, model,
  tokens_in, tokens_out, tool_calls, cost_estimate)`
- Compute cost: tokens_in × $0.003/1k + tokens_out × $0.015/1k
- Dashboard endpoint `/admin/ask-stats` showing daily/monthly burn

Add hard cap: if monthly burn > $200, /ask routes return preview-stub.

Effort: 2 hr.

### JJ.4 — Sentry error tracking

Setup:
- npm install @sentry/nextjs
- Configure with project DSN
- Add to next.config.ts

Catches uncaught errors in production with stack traces + request
context.

Founder action: 10 min Sentry account setup. Free tier 5k errors/month.

Effort: 1 hr engineering.

### JJ.5 — Status page

Simple `/status` page showing:
- Production URL up/down
- Supabase up/down
- /api/ask up/down
- Vercel deploy status (latest commit + time)
- Last data refresh per country

Use simple ping checks; no fancy infrastructure.

Effort: 1.5 hr.

### JJ.6 — Top-queries dashboard

Internal `/admin/queries` page showing:
- Top 100 /ask questions of the week
- Top viewed cells
- Top searched cities
- Bounce rate per route

Pulls from Plausible + Supabase logs.

Effort: 2 hr.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| JJ.1 Vercel Analytics | 5 min (founder) |
| JJ.2 Plausible setup + events | 2 hr |
| JJ.3 /ask cost monitoring | 2 hr |
| JJ.4 Sentry | 1 hr eng + 10 min founder |
| JJ.5 Status page | 1.5 hr |
| JJ.6 Top-queries dashboard | 2 hr |
| **Total** | **~9 hr engineering + ~15 min founder** |

---

## 4 · Verification gate

- Vercel Analytics shows real visitor data
- Plausible logs custom events
- /ask cost tracked per request
- Sentry catches a deliberately-thrown test error
- /status page green
- /admin/queries renders for founder login

---

## 5 · What this unlocks

- Founder knows what's working
- Cost surprises (/ask burn) caught early
- Errors caught before users complain
- Foundation for product decisions based on real usage
