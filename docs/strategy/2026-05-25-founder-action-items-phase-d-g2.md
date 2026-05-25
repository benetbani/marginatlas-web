# What I need from you to finish Phase D (Stripe) and Phase G2 (email)

Short, action-only. You said "just do this, do this, do that" so this is exactly that.

You have:
- Namecheap (DNS for whatever Tesseract Research domain you'll use)
- A Stripe account (not yet registered for Margin Atlas)

You need to make ~6 decisions and click ~20 buttons. After that I take over and finish both phases in one sprint each.

---

## Phase D — Stripe (paid tiers go live)

### Step 1: register the domain on your Stripe account

In Stripe → Settings → Public details → add `marginatlas.com` and `www.marginatlas.com` to "Statement descriptor" and "Business website". This is the line your customers will see on their card statement. Suggested descriptor: `MARGINATLAS`.

### Step 2: create 2 products with 4 prices

Stripe dashboard → Products → "+ Add product". Do this twice:

**Product 1: Margin Atlas Basic**
- Name: `Margin Atlas Basic`
- Description: `Unlocks p25 and p75 quartiles, year-over-year changes, source citations, and saved cells (up to 25).`
- Pricing → add two prices:
  - `$37.00 USD` recurring monthly → save the price ID (starts with `price_...`)
  - `$372.00 USD` recurring yearly → save the price ID

**Product 2: Margin Atlas Premium**
- Name: `Margin Atlas Premium`
- Description: `Adds side-by-side comparison, CSV export, email alerts on cell updates, confidence bands, seasonality, and unlimited saved cells.`
- Pricing → add two prices:
  - `$77.00 USD` recurring monthly → save the price ID
  - `$768.00 USD` recurring yearly → save the price ID

You'll have 4 price IDs at the end. Paste them in the env-var block at the bottom of this doc.

### Step 3: enable the Customer Portal

Stripe → Settings → Billing → Customer portal → Activate.

Check ON:
- Customers can cancel subscriptions immediately
- Customers can update payment methods
- Customers can view billing history
- Customers can update tax IDs (optional)

Check OFF:
- Pause subscriptions (we don't want this)
- Update quantities (we have no seat-based plans)

This is the page where users will go to cancel. We do NOT build our own cancel UI; Stripe's is good and legally compliant.

### Step 4: configure the webhook endpoint

Stripe → Developers → Webhooks → "+ Add endpoint".

- Endpoint URL: `https://www.marginatlas.com/api/stripe/webhook`
- Listen to events: select these exactly:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

Stripe will give you a webhook signing secret (starts with `whsec_...`). Save it.

### Step 5: grab your API keys

Stripe → Developers → API keys.

- Publishable key (starts with `pk_live_...` if live mode, `pk_test_...` if test mode)
- Secret key (starts with `sk_live_...` or `sk_test_...`) — click "Reveal" once

**Recommendation: ship in test mode first.** Use `sk_test_...` and `pk_test_...` so the first checkout is verified end-to-end with Stripe's test card `4242 4242 4242 4242`. Flip to live keys after one clean test.

### Step 6: paste these env vars in Vercel

Go to Vercel project → Settings → Environment Variables. Add these (paste the values from above):

```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... in production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC_MONTHLY=price_...
STRIPE_PRICE_BASIC_ANNUAL=price_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_ANNUAL=price_...
```

Set all of them to "Production, Preview, Development".

### After you finish Step 6, I will:

- Build `/api/stripe/checkout` that takes `?tier=basic&cycle=monthly` and creates a Stripe Checkout Session, then redirects.
- Build `/api/stripe/webhook` that verifies signatures and writes the user's tier to a new `user_tiers` table in Supabase.
- Build `/api/stripe/portal` that one-click redirects logged-in users to the Stripe Customer Portal.
- Swap every pricing-page CTA from `#newsletter` to `/api/stripe/checkout?tier=...&cycle=...`.
- Swap every paywall-modal CTA the same way.
- Add `/account` page showing current tier + link to portal.
- Replace `getViewerTier()` stub with the real Supabase lookup keyed by session cookie.
- Phase H analytics will start firing real conversions.

Estimated time after you're done with Step 6: **1 sprint**.

### Founder open questions for Phase D:

1. **Test mode or live mode for first deploy?** (Recommend: test mode for 24 hours of smoke, then flip.)
2. **Sales-tax collection?** Stripe Tax exists. Recommend leaving OFF for the first launch — we don't have enough volume to make the compliance worth it. Easy to flip on later.
3. **Failed payment retry policy?** Stripe default = retry 4 times over 3 weeks, then cancel. Recommend keeping the default.

---

## Phase G2 — email sender (ConvertKit on a Tesseract Research subdomain)

### Step 1: pick the sender domain

You said "another one from Tesseract Research". I need the EXACT domain you own. Options I'd recommend:

- `tesseractresearch.com` — if you own this, perfect.
- `tesseract.research` — if you own this, fine but `.research` TLD deliverability is slightly worse than `.com`.
- Some other TR-owned domain you'd point at email.

**Action: tell me the domain.** I'll write the DNS records with the exact host names.

### Step 2: pick the email provider

Three reasonable options:

| Provider | Cost | Pros | Cons |
|---|---|---|---|
| **ConvertKit** | $9/mo to start | Made for newsletters; great deliverability; visual sequences | Pricier at scale |
| **Resend** | Free up to 3K/mo | Developer-first; clean API; cheaper | You manage the sequences yourself |
| **Mailgun** | $15/mo to start | Battle-tested; cheap at scale | API only, no GUI for sequences |

**Recommendation: ConvertKit.** The 6-email nurture sequence we drafted is exactly what their visual sequence builder is built for. The cost is fine at our scale.

**Action: pick one and create an account.**

### Step 3: in your provider, add the sender domain

In ConvertKit (or whoever): Settings → Email → Sending Domains → Add domain → enter the domain from Step 1.

They'll show you 3-4 DNS records to add. They look like:

```
TXT  ck-{ID}._domainkey.{your-domain}  v=DKIM1; k=rsa; p=MIGfMA0GCSqGSI...
TXT  @                                   v=spf1 include:_spf.kit.com -all
CNAME ck-fb-{ID}.{your-domain}           {ID}.ck.tracking.kit.com
```

**Copy those exact values.**

### Step 4: paste them into Namecheap

Namecheap dashboard → Domain List → click "Manage" next to the domain → "Advanced DNS" tab.

For each record from ConvertKit:
- Click "Add New Record"
- Pick the type (TXT, CNAME, etc.)
- Host = the bit before `.{your-domain}` (e.g., for `ck-12345._domainkey.tesseractresearch.com` the host is `ck-12345._domainkey`; for the root SPF record use `@`)
- Value = the exact string from ConvertKit
- TTL = Automatic
- Save

Wait 15 minutes. Click "Verify" in ConvertKit. All records should turn green.

### Step 5: add a DMARC record (security best practice)

In Namecheap, add one more TXT record:

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@{your-domain}
TTL: Automatic
```

This tells receivers what to do with mail that fails authentication. `p=quarantine` means "send suspicious mail to spam, not reject". Safer to start with than `p=reject`.

### Step 6: configure ConvertKit

In ConvertKit:
- Create a form (just one). Name it "Margin Atlas signup". Embed type doesn't matter — we'll use the API.
- Note the Form ID (visible in the URL of the form edit page).
- Settings → Advanced → API → generate an API key.

### Step 7: paste these env vars in Vercel

```
CONVERTKIT_API_KEY=...
CONVERTKIT_FORM_ID=...
NEWSLETTER_FROM_EMAIL=atlas@{your-domain}
NEWSLETTER_FROM_NAME=Margin Atlas
```

### After you finish Step 7, I will:

- Build `/api/internal/sync-newsletter` (Vercel cron, every 5 min) that reads new rows from Supabase `newsletter_signups` and subscribes them to the ConvertKit form.
- Update `/api/newsletter` so the welcome email arrives within seconds, not days.
- Configure the 6-email nurture sequence inside ConvertKit (you copy the bodies from `docs/strategy/2026-05-25-email-nurture-sequence-v34.md`).
- Verify the unsubscribe link works one-click.

Estimated time after you're done with Step 7: **half a sprint**.

### Founder open questions for Phase G2:

1. **Which Tesseract Research domain?** Need the exact one.
2. **ConvertKit, Resend, or Mailgun?** (Recommend ConvertKit.)
3. **Sender email local-part?** `atlas@`, `hello@`, `newsletter@`, `noreply@`? (Recommend `atlas@`. Friendly, branded, and makes replies traceable.)

---

## Summary of everything I need from you

To unblock Phase D:
- [ ] Send me: 4 Stripe price IDs (Basic monthly/annual, Premium monthly/annual)
- [ ] Send me: Stripe secret key (sk_test_... for first deploy)
- [ ] Send me: Stripe publishable key (pk_test_...)
- [ ] Send me: webhook signing secret (whsec_...)
- [ ] Confirm: test mode or live mode first

To unblock Phase G2:
- [ ] Send me: the Tesseract Research domain you want to use
- [ ] Send me: ConvertKit API key + form ID (or whichever provider)
- [ ] Confirm: sender local-part (`atlas@`?)
- [ ] DKIM/SPF/CNAME/DMARC records added in Namecheap (records turn green in ConvertKit)

Both blocks are completely independent. You can ship Phase D first and Phase G2 later, or vice versa. I recommend Phase D first because it's where the revenue lives.

---

**Where to send the keys:** drop them into the Vercel env vars yourself (Settings → Environment Variables). I won't see the values; the deployed app reads them at runtime. Just tell me when each block is done and which env vars are populated, and I'll start the sprint.
