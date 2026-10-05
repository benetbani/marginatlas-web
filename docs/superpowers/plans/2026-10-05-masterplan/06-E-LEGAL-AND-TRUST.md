# Phase E, steps 30 and 31: the terms Pro needs, the trust a reader can check, milestone 2's close

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md`. Tick boxes here; record each
> step in `LEDGER.md`.

**His rulings:** 34 (the loop drafts terms, privacy and refund rules from standard UK subscription terms: cancel any time, access
to the end of the paid period, consent to immediate access at checkout; he approves); 17 (existing depth moves behind Pro: the
live pages' "everything free stays free" promises change on launch day, step 12 switched them); the credibility doctrine of
2026-10-02 (`CREDIBILITY.md`: earned in the open, never a fabricated testimonial, review, logo or credential).

**What exists** (the map of 2026-10-05): `src/app/(site)/terms/page.tsx` (updated "29 July 2026"; "Paying" L98-105 already says
cancel whenever, access to the end of the paid period; liability capped at what was paid, L120), `privacy/page.tsx` (Stripe
L65-68, tax records L118-119), `cookies/page.tsx` (Stripe's checkout cookies L51-54); no refunds page. Gates on their words:
`banned-vocabulary` (`scripts/verify_banned_vocabulary.ts` L52-73: no "turnover", "covers", "percentage points", "pp", "net
margin" on these pages), `no-session-recording` (privacy and cookies keep the `WEB_ANALYTICS_ON ?` switch), `v34-research-rules`
(the legal paths exempted from the "refund" and "for N days" bans in step 13), `no-em-dashes`.

---

## Step 30: the terms of Pro, cancelling and refunds, privacy and cookies, drafted for his approval

**Files:** Create `src/lib/legal/pro_legal.ts` (the drafts as structured sections, one source); Modify the three legal pages
(render the Pro sections when `isPaywallOn()`, the current text otherwise); Create `scripts/legal/export_drafts.ts` (writes the
drafts as markdown for him); Create `E:/atlas/design/loop/build/m2/legal/2026-10-05-uk-subscription-law.md` (the research note)
and `E:/atlas/design/loop/build/m2/legal/PRO-LEGAL-DRAFT.md` (the export).

- [ ] **Research first, reading only** (public pages, no file saved but the note): the Consumer Contracts (Information,
  Cancellation and Additional Charges) Regulations 2013 (regulations 29 to 38: the 14-day right; regulation 36 for services and
  37 for digital content not on a tangible medium: the right ends once supply begins with the consumer's express consent and
  acknowledgement; regulation 16: confirmation on a durable medium including that consent); the Consumer Rights Act 2015's
  digital content remedies (sections 34 to 45); and the Digital Markets, Competition and Consumers Act 2024, Part 4, Chapter 2
  (subscription contracts): whether and from when it is in force, and what it requires (pre-contract information, reminder
  notices, ending in one step, a renewal cooling-off period). legislation.gov.uk and GOV.UK only; each statement in the note with
  its URL and the date read. Where the note cannot settle a point, it says so, and the draft follows the stricter reading.
- [ ] **The drafts** in `pro_legal.ts`, plain English, his register, no em dash, no semicolon in a sentence a reader sees:
  - **Terms of Pro:** what Pro is (the locked half of every UK chapter and the Pro sections, for the period paid); the price
    ($38 a month or $238 a year, charged in US dollars by Stripe; whether VAT is included is his decision, step 09's parked item,
    so the draft holds both wordings marked for him); renewal until cancelled; cancelling any time in the account, access to the
    end of the paid period; the 14-day right and its end on immediate access, worded to match the checkout's consent line (step 09
    `CONSENT_LINE`); price changes with notice and the right to cancel first; one person's use, no resale or bulk copying of the
    figures; the figures are information, not advice; liability (never excluding what the law does not allow to be excluded);
    the law of England and Wales, with a consumer's own courts kept.
  - **Cancelling and refunds** (a section of the terms with the anchor `#refunds`; the pricing page links to it): how to cancel;
    no charge after cancelling; when a refund is given (a double charge, a charge after cancelling, content not as described under
    the 2015 Act); how to ask (the contact page).
  - **Privacy, accounts and payments:** what an account holds (email, plan, Stripe customer id); payments by Stripe (the site
    never sees a card number); Supabase hosts accounts (its region); Vercel's cookie-free counting holds no personal data; the
    lawful bases (the contract for the plan, legitimate interests for security); how long records are kept (accounting records:
    six years, the tax rule); the reader's rights and the ICO.
  - **Cookies:** the sign-in cookie, strictly necessary, set only when a reader signs in; Stripe's own on its checkout pages.
  Every place the draft needs his identity (his trading name or company, its number and address, a VAT number if any) holds a
  marked gap `[HIS: ...]`, never an invented value.
- [ ] **Wire:** each legal page renders its Pro sections when `isPaywallOn()`, the current text otherwise (so production does not
  change before launch day), and shows the update date the draft carries.
- [ ] **Export** the drafts to `PRO-LEGAL-DRAFT.md` with `npx tsx scripts/legal/export_drafts.ts` (one source: the module).
- [ ] **Park** in `PARKED.md`: (1) his approval of the drafts (the file path); (2) his identity for the `[HIS: ...]` gaps; (3) if
  the 2024 Act's subscription rules are in force at launch, the renewal reminders Stripe can send (a dashboard setting) and the
  receipt's line confirming the immediate-access consent (regulation 16's durable medium; a receipt footer setting in Stripe).
- [ ] **Verify:** `banned-vocabulary`, `v34-research-rules`, `no-session-recording`, `no-em-dashes`, `legacy-method-words`, `tsc`,
  `page-metadata`. **Commit:** `30: the terms of Pro, cancelling and refunds, privacy and cookies, drafted for his approval behind the launch switch`.

---

## Step 31: what a reader can check, and milestone 2's close

**Why.** QUEUE `close:furniture-lines` (a "Report a mistake" link and a last-checked line at every page's foot) is part of the
credibility doctrine's day-one set; the `corrections` table exists and answers (checked 2026-09-17), and a `CorrectionForm`
exists, mounted only on a legacy branch.

**Files:** read `src/components/**/CorrectionForm*` and the route that posts corrections first; Modify the spine page foot (beside
`SourcesFoot` in the five spine views); a test (rule `page-foot`).

- [ ] **Report a mistake** on every spine page's foot: a link to a page that holds the existing correction form with the page's
  path filled in (reuse the form and its route; if none is reachable, mount the form on `/corrections/new` with `robots` noindex).
- [ ] **Checked** only where a real date is held: the UK pages read their register snapshot's build date (the slices' metadata
  under `data/uk/registers/`); any page with no held date prints no line. Never today's date standing in for a check.
- [ ] **Park** (`cred:about-figures`'s rest): a public corrections log and a changelog are promises he makes; recommendation: a
  corrections page listing each correction with its date from launch day, and no changelog until there is something to list.
- [ ] **Test** (`page-foot`): a render of each spine page type holds one "Report a mistake" link with the page's path; a UK page
  holds a checked line equal to its register date; a page without a held date holds none.
- [ ] **The full chain** (protocol section 5); every red fixed; the count in the ledger.
- [ ] **Photographs** of what changed since step 21 (the four Pro sections open and locked, the legal pages' Pro wording rendered
  with the switch on, the page foot) added to `E:/atlas/design/loop/build/photos/m2/MILESTONE-2-SHEET.jpeg`.
- [ ] **Commit** both repos (STATE.md: milestone 2 built, not pushed): `31: a mistake can be reported from every page; milestone 2 closed on the night branch`.
