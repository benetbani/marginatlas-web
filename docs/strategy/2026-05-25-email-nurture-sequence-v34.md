# v34 Phase G — email nurture sequence + Tesseract Research sender

**Status:** drafted, awaiting founder copy approval + sender config.
**Parent plan:** `2026-05-25-monetization-mega-plan-v34.md` Part 6 Phase G.

This doc captures what ships when the founder is ready to wire ConvertKit
(or whichever provider) against the Tesseract Research email domain.
The site infrastructure is already there: `FooterNewsletterBar`,
`InlineMidArticle` (now mounted after the cell-page failure-modes
section in v34 Phase G), and the `/api/newsletter` endpoint writing
to Supabase `newsletter_signups`.

What is missing today is only:

1. The sender domain / SPF / DKIM / DMARC on Tesseract Research
2. The ConvertKit (or equivalent) account + API key
3. A bridge job that reads new rows from `newsletter_signups` and
   subscribes them to the ConvertKit form
4. The six-email nurture sequence below, configured inside ConvertKit

The bridge can be a Vercel cron + a small `/api/internal/sync-newsletter`
endpoint. Half a day of work once the sender + key exist.

---

## Sender configuration

Per founder decision (2026-05-25): "email not ready tbh, we can use
another one from tesseract research".

- **Display name (From):** `Margin Atlas`
- **From address:** `atlas@tesseract.research` (or similar — confirm
  the actual TR-owned domain before DNS work)
- **Reply-To:** same address
- **DKIM / SPF / DMARC:** must be set up for the Tesseract Research
  parent domain before the first send. If TR already has DKIM, we
  add a subdomain selector. Otherwise full setup.

Switching to a dedicated `hello@marginatlas.com` later is a 30-minute
job — change one env var + add the DNS records. The user-facing
sender name stays Margin Atlas either way.

---

## The 6-email nurture sequence

Drafted against the v34 microcopy rules (no trial copy, no money-back,
no urgency theatre, calm professional tone). Each subject line is
under 50 chars. Each body is between 300 and 600 words.

Subjects + opening lines below. Full bodies live separately in the
ConvertKit broadcast config (drafted in a follow-up).

### Email 1 — sent the moment they subscribe

- **Subject:** `Welcome to Margin Atlas`
- **Opening:** "You signed up to get the next thing we publish. Here's
  what to expect: one email on the first of every month, around 600
  words, with one deep-dive on a single benchmark and three short data
  hits. That's it."
- **Job to do:** confirm what they signed up for; set expectations;
  link to two of the most-loved cells (data-driven recommendations
  from analytics later, hand-picked for now).

### Email 2 — sent 3 days after signup

- **Subject:** `How we standardize benchmarks across countries`
- **Opening:** "When you compare a small business in Mexico City to
  one in Lisbon, you have to decide what 'the same' means. Here's the
  short version of how we do it without flattening the differences
  that matter."
- **Job to do:** trust signal. Show the methodology backbone in an
  approachable way. Link to /about-data for the deep version.

### Email 3 — sent 10 days after signup

- **Subject:** `The hardest part of small-business data`
- **Opening:** "Survival bias. Most public small-business stats are
  weighted toward the firms that lived long enough to file the
  paperwork. Here's how we surface that and what it means for the
  benchmarks you see in Atlas."
- **Job to do:** epistemic credibility. Show we know the limits of
  the data we publish.

### Email 4 — sent 21 days after signup

- **Subject:** `What's behind the lock`
- **Opening:** "We keep the median, the top decile, and the bottom
  decile visible on every cell. Behind the Basic lock are the two
  middle quartiles, year-over-year change, and source citations on
  each cost line. Here's why we drew the line there."
- **Job to do:** explain the tier philosophy plainly. No pressure.
  Includes a single CTA: 'See pricing' (link to /pricing).

### Email 5 — sent 35 days after signup

- **Subject:** `The first month digest`
- **Opening:** "The five most-read cells this month and one piece of
  ambient feedback we've been chewing on."
- **Job to do:** convert the subscriber into a returning visitor.
  Drives traffic back to the site without selling anything.

### Email 6 — sent 60 days after signup

- **Subject:** `Is there a benchmark we should add?`
- **Opening:** "Reply to this email with the thing you wish Atlas
  covered. We read everything that comes back. The roadmap is partly
  shaped by which gaps land most often."
- **Job to do:** open a feedback loop. Subscribers who reply become
  the most engaged segment downstream.

After email 6, the subscriber drops into the monthly broadcast
cadence with everyone else.

---

## Copy rules carried over from v34

- No urgency / scarcity ("only X spots left", "today only")
- No fake testimonials
- No source-agency names (R-020 prebuild gate)
- No em-dashes (R-019 prebuild gate)
- No "Pro" / "Team" tier names (v34 renamed to Basic / Premium)
- No $19 / $79 prices (v34 set to $37 / $77)
- No trial / money-back promises
- Numbers in tabular-nums spirit even in plain-text emails (line up
  via fixed-width chars)
- One CTA per email max

---

## What gets shipped THIS sprint vs. later

**Shipped in v34 Phase G:**
- `InlineMidArticle` mounted on cell pages after FailureModes
- `FooterNewsletterBar` already site-wide
- `ExitIntentModal` already wired (calm, dismissable, one-per-visitor
  via localStorage)
- This nurture-sequence spec committed to the repo so the founder
  can review + approve copy ahead of the sender wiring

**Deferred (Phase G2):**
- Tesseract Research sender DNS / DKIM / SPF / DMARC
- ConvertKit account + API key
- `/api/internal/sync-newsletter` bridge job
- The full bodies of emails 1-6 written out
- Welcome email send within 5 min of signup (today the
  `/api/newsletter` endpoint just inserts a row)

Phase D (Stripe) and Phase G2 (email sender) are the two remaining
external-dependency blockers before v34 baseline ships end-to-end.

---

## Acceptance criteria

Phase G is "shipped" when:

- [ ] `InlineMidArticle` renders on every cell page after FailureModes (DONE)
- [ ] This nurture spec is committed (DONE)
- [ ] Per-page audit Gate A still green on /cell after the mount (DONE)
- [ ] Em-dash gate + research-rules gate still pass (DONE)

Phase G2 acceptance:

- [ ] DKIM verified on the Tesseract Research sender domain
- [ ] ConvertKit form accepts subscriptions from the sync job
- [ ] Welcome email arrives within 5 min for a fresh signup
- [ ] Unsubscribe link verified working
- [ ] All 6 nurture-sequence emails configured + scheduled
