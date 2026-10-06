# What is left: the report (2026-10-06, night)

The plan in this folder (PLAN.md) is done except the two parts that wait on you: Task 4.1 (your ruling D2) and the push
itself. Everything sits on the website branch `whats-left`, 32 commits on your local `main`, not pushed. Production is still
the deep goal's deploy (50ecd9e5).

## What would go live (switches stay off)

- **Made-up file addresses answer 404.** An address with a dot in its last part that the site does not serve
  (`/gb/london/x.y`, `/wp-login.php`, `/.env`, `/data/uk/2026.10/nothing.csv`) now gets the site's not-found page instead of a
  page or a soft 404 at 200. The 32 real files in `public/`, `robots.txt` and the 8 sitemap shards answer as before.
- **The edge runs on every image request.** One middleware call each; nothing visible changes. With accounts on later, a
  photograph still costs no Supabase call (Task 2.1).
- **/extremes:** the chip row is gone; every lens is its own section with an anchor (`#catalog`, `#cost`, `#take-home`,
  `#crowding`).
- **London's 7 district pages:** the title and description say "estimated shop rent(s)", as the page itself does.
- **"Checked 6 October 2026" in the page foot** on `/gb`, `/cities/london` and the London trade pages whose figures come from
  the registers (114 of the 137 trades in the register slice). Nowhere else: not the how-to, not the district pages, not the
  23 trades the registers only roughly match, not Manchester and the other UK cities (their figures are the shard's).
- Not visible: the launch tools (below), LAUNCH-SWITCHES rows 12 to 14, two new chain gates, three docs commits.

Risk: moderate, from one routing change that touches every request. No data, schema, env, dependency or switch change.
Rollback: redeploy 50ecd9e5.

## Three questions for you

1. **Deploy?** `git push origin whats-left:main` (a fast-forward), then the probes the final review listed, then
   `npm run launch:branch` on the new `main`.
2. **D2: lock the UK trade pages outside London when the paywall goes on?** `/gb/manchester/restaurants` is a full page at
   200 today. Recommendation: lock them as London's are. Task 4.1 is ready; it changes nothing while the paywall is off.
3. **What should "Checked" mean?** As built (masterplan step 31): the day the register export ran and its guards passed.
   It is not a re-reading of the sources: under it sit tables dated April 2021 (premises), November 2025 (survival), May 2026
   (failures) and October 2026 (turnover). Options: keep it as built (recommended: the Sources page carries each table's
   own date); or keep the date fixed until a slice actually changes; or hold the line until a person re-reads the registers.

## What was done

- **Batch 1, the launch tools.** `deploy:watch` and `launch:check` read the address the way row 13 passes it and refuse a
  path Git Bash rewrote; `verify:deploy --build` runs what `npm run build` runs, postbuild included; `npm run launch:branch`
  builds launch day's one commit (the private line out of `.env.production`, nothing else) and proves it before moving the
  branch; rows 12 to 14 of LAUNCH-SWITCHES say what is true today.
- **Batch 2, routing.** The two branches another session left (`junk-url-real-middleware`, `dotted-404`) are replayed onto
  this branch. The plan named two hidden breaks; there were three (the third: a test that read a Promise since A7). The
  session refresh skips files, with one shared definition of a file.
- **Batch 3, the QUEUE.** All 116 open rows set to what the code says (a review sampled every done and stale verdict and
  corrected nine). Two rows added: `routing:prototype-keys`, `uk:hood-hub-description`.
- **Batch 4, launch-page fixes.** The district titles, /extremes, and the Checked line (the register export now writes the
  day it ran; the reviews narrowed where it prints three times, until every stamped page carried register figures).

## Found on the way

- **Live on production today:** `/gb/london/constructor` answers a 308 to `/gb/london/function Object() { [native code] }`
  (then 404): slug lookups read plain objects that inherit JavaScript's built-ins. Not caused by this branch. A separate task
  is offered in the app; QUEUE `routing:prototype-keys`.
- The neighbourhoods hub's description promises each district's headline industry, which the hub stopped drawing. QUEUE
  `uk:hood-hub-description`.
- **Playwright's Chromium is gone from this machine's disk** (`AppData/Local/ms-playwright` holds only a stub), so the chain's
  18 browser gates cannot start here. Restoring it is `npx playwright install chromium`, a download: yours to allow.

## Verified

Every task was reviewed on its own (spec and quality), every Important finding fixed and re-reviewed; a final review of the
whole branch said ready with fixes, and the fixes are in. Full `tsc --noEmit` clean at the head. The gate chain, run here
the way Vercel runs it: 236 of 254 gates pass; the 18 browser gates could not start (the missing Chromium above); the 3
cell-lattice checks are deferred, as on Vercel's last build. The Next build and the postbuild guard were not run here (the
chain step stopped the runner, and this machine has about 1 GB free). Vercel runs all of it on the push: its last production
build passed 252 of 252 gates, built, and held the middleware at 253 KB of the guard's 900 KB. A failed build there leaves
the live site as it is.

## Next

On your yes: the push, the probes, `npm run launch:branch` (it must be rebuilt on the new `main`). Then the plans PLAN.md
lists after Batch 4: `uk:cities-sourced-or-marked` first (it blocks launch), `edge:place-segment`, and the small rows. D1
(a Pro purchase rehearsed in Stripe's test mode) and D3 to D13 stand as PLAN.md wrote them.
