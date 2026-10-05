# Morning report, 6 October 2026

Good morning. The night's 40 steps are done. Everything sits on the website branch `night-2026-10-05`, with one more commit
ready on the branch `launch-day`. Nothing is pushed or deployed, no setting is changed anywhere, nothing is posted.

## What a reader gets, once you switch it on

- **Fixes first (steps 1 to 4).** An address that names nothing answers "not found" instead of an empty page. No made-up score
  is left on a live page. London's pages print official figures, or say "estimate" where there is none.
- **Pro, milestone 2 (steps 5 to 31).** One plan: $38 a month or $238 a year. Checkout with no account and no trial, a welcome
  page after it, the plan and a cancel button on the account page. On /gb, the UK city pages and the London trade pages, the
  first half of every chapter stays free and the rest shows a plain locked card with one button. Four new Pro sections on /gb:
  what one hire costs all in, the lease by law, opening from abroad, what failing costs. Terms, privacy and cookies drafted
  for you. "Report a mistake" at the foot of every page.
- **The home page, milestone 3 (steps 32 to 37).** Your headline and the search, which now lands only on pages that exist, the
  UK first. Then the UK's three answers, each a door to its part of /gb, the UK's cities beside what the atlas holds, Pro said
  once (only while the paywall is on), the notebook and the newsletter. Built to the UK page's standard: every check at zero.
- **Launch (steps 38 and 39).** The sample-marks gate now holds your ruling 5 (the marks stay off), so launch day is one line
  deleted and nothing added. The launch checklist is fixed and run. Your clicks are listed in order. Four launch posts are
  drafted for you to post yourself.

## What is proven

- **The full chain**, three times: after step 21 (219 of 225), after step 31 (228 of 231) and tonight at the end
  (233 of 235: the home search typed London's path instead of taking it from the reader's pick, and a world map the old home
  page left behind was reached by nothing). Every red was fixed at its source and passed alone.
- **The photographs**, each looked at before it went in a sheet (folders under `E:/atlas/design/loop/build/photos/`):
  `m2/MILESTONE-2-SHEET.jpeg` (Pro, the locks, pricing, welcome), `night-D/PHASE-D-SHEET.jpeg` (the four Pro sections) and
  `m3/MILESTONE-3-SHEET.jpeg` (the home page, before and after, at three widths).
- **The launch checklist**, run on its own items: 7 of 8 green. The one reason is real: Frankfurt and Abidjan, like 203 of the
  245 city pages outside the UK, are one block under their floor (question P38.1 below).

## Waiting for your word

Each question with my recommendation first. The detail is in `PARKED.md`.

1. **P06.1** Run the two account migrations in Supabase? Yes, on launch day, before the switches.
2. **P09.1** Do $38 and $238 include VAT for UK buyers? Yes: set both Stripe prices tax-inclusive, the page keeps its prices.
3. **P11.1** Stripe's customer portal: cancel at the end of the period, card updates? Yes (your ruling 34).
4. **P30.1** Approve the legal drafts? Approve as drafted. They take the stricter side where the law was unclear.
5. **P30.2** Your name or company, address and VAT number for the drafts' six gaps.
6. **P30.3** Stripe's receipt line and the renewal email? Both.
7. **P31.1** A public corrections page? Yes from launch day, starting with "no corrections yet". No changelog until there is a
   data release to list.
8. **P18.1** The night branch never had a full build (the machine never had 3 GB free). Let Vercel's build on your push be
   the first, or run `npm run build` yourself with your apps closed.
9. **P20.1** With the paywall on, a free reader of a locked page loses some links (London restaurants' sibling trades, /gb's
   city cards). Add a free row of plain doors to the next trades and cities in each page's free half.
10. **P38.1** 203 city pages outside the UK sit one block under their floor and stay out of search. Launch with that standing.
11. **P36.1** The notebook's posts: keep the two the research keeps, rewrite ten, retire 58 before going public.
12. **P36.2** The editorial feed on the home page: two formats first, the duel and the ranked list.
13. **P36.3** The old home page: switch the new one on at launch, then delete the old branch.
14. **P03.1** London's rent by district: keep the seven districts, called estimated, until a district rent source exists.
15. **P04.1** What UK households spend on: let the data track download the official Family Spending tables.
16. **P04.2** /gb's peers table: keep the peers, called estimates, and source them on the data track.
17. **P0.1** Turn on Vercel's cookie-free visit counting. Yes.
18. **P0.2** Name yourself on an about page. Yes, a short one.
19. **P0.3** Publish the UK data pack at /data, free. Yes.

## Your clicks

`LAUNCH-SWITCHES.md`, fifteen rows in the order you work: your desk (the legal approval), Supabase (two migrations, sign-in),
Stripe (the product, the portal, the terms link, tax, the emails, the webhook), Vercel (ten variables, Analytics), the push
(the night branch, then `launch-day`), the checks after the deploy, Search Console's sitemaps, and the posts.

## Where the ledger stands

Every step DONE except 06 (PARKED: the migration is yours to run). No step was skipped. The full record is `LEDGER.md`.

## One question

What do you want pushed and deployed? My recommendation: push the night branch and deploy it now with every switch off. The
fixes go live at once, and billing, the paywall and the new home page stay dark behind their switches. One thing to know: with
the paywall off, the four Pro sections on /gb are open to every reader until launch day. Then review the new home page (the m3
sheet) and switch it on with the launch.
