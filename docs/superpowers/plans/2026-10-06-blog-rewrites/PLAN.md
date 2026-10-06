# The blog rewritten on the registers, and the home page's ranked list (2026-10-06)

His words, 2026-10-06 about 1am, after the second deploy's report listed what still waited on him: "idk-push-forward-more-details-later".
Read as: build what needs none of his facts, take the recommendation where a choice comes up (as he did on all nineteen PARKED
questions), leave his details (P30.2) for later, and ask before the next deploy (approval for the last deploy does not carry over).

Two pieces, both already ruled option (a) on 2026-10-05:

1. **P36.1, "the ten rewrites next"**: the ten live posts BLOG.md marks "rewrite on UK registers" still print figures with no
   source, and several contradict the registers (restaurants "15-25% fail in five years" against 29 of 100 still trading after
   five years on the closure rates of 2024). Rebuilt on the free data pack at `public/data/uk/2026.10/`.
2. **P36.2b, his recommendation (a)**: "Where kitchens score five", the ranked list beside the duel on the new home page, behind
   `NEXT_PUBLIC_HOME_REFORM`, from the registers' feed.

## Decisions taken (the loop's, each with its reason; his word can change any)

- **D1. Slugs stay.** Eight posts are rewritten in place. Two method notes with no figure of their own become sections of About
  the figures, as BLOG.md says, and their slugs redirect there (308, the retired list's mechanism, from
  `data/blog/moved_posts.json`): `what-we-omit` to `#leave-out`, `when-we-extrapolate` to `#estimates`. The hidden economy stays a
  post: the pack's own ledger (ledger.json, the turnover rows' leaves_out) holds its figure, 54% of UK businesses on neither the
  VAT nor the PAYE register, so the gate can check it there. `how-to-benchmark-your-business` stays a post: no guides hub exists
  yet (GUIDES.md is a plan).
- **D2. The byline is "Margin Atlas", not his name**, with the line "Drafted with AI assistance from the registers' tables."
  CREDIBILITY.md's line is "drafted with AI assistance and checked by [name]"; he has not read these, so no page says he did.
  His name goes on each post he reads (BLOG.md: "every number checked by that person").
- **D3. Every figure in a post is recomputed from the data pack by a gate.** Frontmatter lists each printed figure with its file,
  row, column and form; the gate `blog-content` reads the pack's CSV, recomputes, and reds on a mismatch or on any digit in the
  prose that no entry covers (years and dates excepted; an invented illustration is declared `kind: example` and its post says
  "imaginary"). Money is printed as the pages print it, in dollars through `convertToUsd` at the pinned pound rate
  (src/lib/finance/fx.ts), so a post and the page it links print one figure for one fact.
- **D4. No statistics body named in a post's prose** (his R-002 ruling: names on the one Sources and licences page; the post's
  foot links there with the licence sentence, as every UK page's foot does). The gate reuses the agency list.
- **D5. Like for like** (his standing rule; BLOG.md's rules): one trade across places, one place across trades, or one place over
  time, never a trade in one place against another trade in another place.
- **D6. Ruling 38 stands for new articles**: the twelve generated stories in `goal-2026-10-02/drafts/blog/` stay drafts; the
  rewrites replace posts already live, which is P36.1 (a).
- **D7. The two keepers get light edits**: median against average keeps its imaginary firms (declared); firm against establishment
  trades Walmart's unsourced count for the pack's businesses and premises.

## Tasks

1. Blog schema and rendering: `src/lib/blog.ts` reads category, format, updated, data_as_of, figures, behind, data, method;
   the post page prints the category, the dates, the AI line, and a foot of four plain blocks (figures behind this, data, method,
   the sources sentence); the index shows each post's category; sitemap entries and Article markup for every post.
2. The gate `blog-content` (tests/blog/blog_content.test.ts), with plants proving it reds.
3. The eight rewrites and the two light edits, each passing the gate.
4. About the figures: "What the figures leave out" and "When we estimate" sections; two slugs redirected.
5. P36.2b: the ranked list on the home page behind its switch, from the feed's `kitchens-five` item, through the harness.
6. Proof: tsc, the gate chain's affected gates, renders and photographs; the ledger; his word before any push.

## Ledger

(appended as each task lands)
