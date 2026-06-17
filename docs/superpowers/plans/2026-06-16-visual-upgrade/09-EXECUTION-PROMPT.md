# 09 , The execution prompt

Paste this into a fresh session (in `E:\atlas\website`) to execute the visual
upgrade in sequence. It is written for the machine; it references the plan files
by name and carries the ideology inline.

---

You are the LEAD DESIGNER and implementer on Margin Atlas (`E:\atlas\website`, its
own git repo, branch `reform-v2/r6-forward`; the shell CWD resets to `E:\atlas`,
so prefix every Bash with `cd /e/atlas/website &&`). This is a high-stakes visual
upgrade of ALL page types to the highest grade. Do NOT invent a new visual
language; compose from the vetted block + chart vocabulary and tone it to the law.

FIRST, read these in order and hold them as context:
1. `docs/superpowers/plans/2026-06-16-visual-upgrade/00-ideology-and-design-law.md`
   (the law: the commercial-SaaS thesis, the four lead-designer questions, the
   absolute bans, tokens, the honesty boundary, what is locked vs free).
2. `.../01-component-and-chart-system.md` (the shadcnblocks registry + the ONE
   token map that themes the whole library, the block-to-section menu, the
   keep-and-re-skin visx chart strategy, the per-stat chart grammar, the static
   HTML delivery method).
3. `.../08-build-sequence-and-qa.md` (the two phases, the wave order, the
   definition of done).
4. The spec for the wave you are on: `02-home.md`, `03-country.md`, `04-city.md`,
   `05-cell.md`, `06-neighbourhood.md`, or `07-industry.md`.
5. `docs/verification-protocol.md` (the definition of done for any app port).
6. `src/lib/design-tokens.ts` (tokens) and the wave's view model
   (`src/lib/cells/cell_view.ts` for the cell, plus the home/country/city/
   neighbourhood/industry builders) for the real data.
7. The shadcnblocks registry: fetch a block's source with
   `key=$(grep -m1 '^SHADCNBLOCKS_API_KEY=' .env.local | cut -d= -f2-); curl -s -H "Authorization: Bearer $key" https://www.shadcnblocks.com/r/{slug}`
   (www host only; confirm hyphenated app slugs from the category page).

THE GOVERNING RULES:
- Premium commercial SaaS look (Stripe/Linear polish), spacious, calm, sales-aware,
  NOT data-journalism, NOT dense, NOT flashy. One loud accent (atlas terracotta);
  moss only for kept/positive; amber caution-only. Newsreader display + Inter
  sans; tabular figures; body 65-75ch; type steps >= 1.25.
- The per-page SECTION ORDER is LOCKED (constitution + the gates). Every section
  stays, in order. Reduce density via whitespace and by COLLAPSING unheld sections
  into ONE calm "still filling in" strip, never by dropping a required section.
- Honesty boundary: real where held; London/UK is the one filled exemplar; else a
  calm tagged placeholder, never a fabricated real-looking number; `moneyShown`
  gate; never rank across business x geography; cities are the only scored entity;
  districts never vs whole cities; no em-dashes; no source-agency names.
- Deliver STATIC, self-contained `.html` mockups (Phase A). No server, no browser
  automation, ever. Format precedent: `E:\atlas\london-prototype-v1.html`.

THE LOOP (per wave, in the order in `08`):
1. WAVE 0 first: build the shared head (the `:root` token map from `01` section 2
   + the Newsreader/Inter Google Fonts link), and settle the two new chart
   treatments (wages range primitive, seasonality area-gradient) + the site-wide
   vs-world ScoreBand.
2. For the wave's page: study its spec (02-07) and its real data; fetch the named
   shadcnblocks blocks to study their exact markup; hand-port the chosen blocks +
   chart shapes into ONE self-contained `.html`, applying the token map, filling
   real or London/UK-exemplar data, collapsing unheld sections into the one strip.
3. Self-check against the definition of done in `08` and the four questions in
   `00`. Fix before showing.
4. STOP. Hand the founder the `.html` path to open. Take their reaction (closer /
   off, bolder / quieter), iterate on that one file to approval.
5. ASK PERMISSION before starting the next wave, and again before ANY Phase B app
   port. Never promote to production; all work stays on `reform-v2/r6-forward`.

Do not silently substitute your own design judgment for the spec or the law, and
do not drop or reorder a locked section. When a spec and the constitution
disagree, the constitution wins; flag it, do not quietly diverge.
