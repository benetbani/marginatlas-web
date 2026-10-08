import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { UK_SOURCES, WORLD_SOURCES, type UkSource } from "@/lib/spine/uk_sources";

export const revalidate = 86400;

export const metadata = {
  title: "About the figures | Margin Atlas",
  description: "How to read a figure on Margin Atlas: what is counted, worked out, looked up or estimated, and where each comes from.",
  alternates: { canonical: "/about-data" },
};

export default function AboutDataPage() {
  return (
    /* ON A CARD, converged onto the shell /privacy, /terms and /cookies
       already use (`LegalPage`, whose own comment says it matched THIS page's
       reading measure and then added the surface this page never got).

       WHAT I SAW at 1440: the whole of this page, the site's trust reference,
       painted straight onto the fixed photograph with no ground under any of
       it. It reads down the left where the picture is sky and sea, and the
       long lines run out over the cliffside town: "so a Restaurant in
       California compares directly to a Restaurant in Paris" ends at x=845,
       on the buildings. The quiet grey line about the "How we know this" link
       is the weakest type on the page and sits on open water. The country
       page's section nav failed in exactly this way and for exactly this
       reason.

       max-w-2xl stays: that is the reading measure, and it is not the card's
       business. mb-16 to match the legal shell's closing space. */
    <article className="atlas-card max-w-2xl px-6 py-8 md:px-9 md:py-10 mb-16">
      {/* Plan v32 (audit Sprint A5) — decorative placeholder image at the
         top removed (founder rule: no decorative images on overview
         pages). Stale "40+ countries" copy updated to reflect the real
         coverage. */}
      <SectionEyebrow size="md" className="mb-3">Reference</SectionEyebrow>
      {/* ABOUT THE FIGURES (his interview of 2026-09-26: estimates signalled by the pages' quiet notes plus an "About the figures"
          page in the footer; milestone 1, M9). The URL stays /about-data: a slug is never renamed. */}
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
        About the figures
      </h1>
      <p className="mt-4 text-lg text-ink-800 leading-relaxed">
        Margin Atlas brings together small-business benchmarks across every
        country: revenue, employment, wages, and the spread between the
        smallest and largest firms in every industry.
      </p>

      <section className="mt-10">
        {/* THE FOUR KINDS (milestone 1, M9): the register ledger's own words, the same four every truth-pass figure carries in its
            markup (src/lib/spine/provenance.ts), each with a figure a reader meets on the United Kingdom's pages. */}
        <h2 id="reading" className="scroll-mt-24 text-xl font-semibold text-ink-900">How to read a figure</h2>
        <p className="mt-3 text-ink-800">
          Every figure on the United Kingdom&rsquo;s pages is one of four kinds, and where it matters the line under it says which.
        </p>
        <ul className="mt-4 space-y-3 text-ink-800">
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Counted.</strong> Taken straight from an official register or table: the 7,865 registered restaurants in London.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Worked out.</strong> Our arithmetic on official figures: a typical restaurant&rsquo;s yearly sales, read from the register&rsquo;s sales bands, or the tax a sole trader pays at this year&rsquo;s rates.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Looked up.</strong> A rule, a price or a published count read on a named page on a stated day: the minimum wage, a card reader&rsquo;s fee.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Estimate.</strong> Our judgement where no register holds the figure, and the line under it says so: the sales a London restaurant needs to break even, or the cost to open at London prices.</span>
          </li>
        </ul>
        <p className="mt-3 text-sm text-ink-700">
          Outside the United Kingdom most figures are estimates from national statistics and a trade&rsquo;s typical shape, and each
          page says so once, at the foot of its first card. Where the figures come from is listed under{" "}
          <a href="#sources" className="underline underline-offset-2">Sources and licences</a>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">What you'll find</h2>
        <ul className="mt-4 space-y-3 text-ink-800">
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Typical numbers.</strong> What the middle firm in an industry actually earns, employs, and pays.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>The spread.</strong> What the smallest 10% and biggest 10% look like, so you understand the full range.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Cross-country comparison.</strong> Friendly industry names that match across borders, so a "Restaurant" in California compares directly to a "Restaurant" in Paris.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Sub-national depth.</strong> State-level, regional, and county-level data where available.</span>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        {/* HOW QUALITY IS SHOWN, said as the pages print it (masterplan step 02, 2026-10-05). This section taught a "coverage
            chip" and four tiers, Measured, Regional, Estimated and Modeled, and promised a "How we know this" link beside every
            headline number: the rebuilt pages print none of the three. What they print is the four kinds above, the line under
            a figure, and a small half-filled circle on an estimate (AnswerCard's foot). The id stays: it was the footer's
            anchor once, and a link to it must land here. The links that named a tier (HowWeKnowThis) now land on #reading. */}
        <h2 id="quality" className="text-xl font-semibold text-ink-900">How quality is shown</h2>
        <p className="mt-3 text-ink-800">
          A figure carries no grade. Where it matters, the line under it says which of the four kinds above it is,
          and an estimate carries a small half-filled circle beside that line.
        </p>
      </section>

      <section className="mt-10">
        {/* WHEN WE ESTIMATE (P36.1, the rewrites of 2026-10-06): the old post "When we extrapolate and when we don't" moved here, as
            BLOG.md says, its tiers and badges gone with the pages that printed them; /blog/when-we-extrapolate lands on this id
            (data/blog/moved_posts.json). */}
        <h2 id="estimates" className="scroll-mt-24 text-xl font-semibold text-ink-900">When we estimate</h2>
        <ul className="mt-4 space-y-3 text-ink-800">
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>In the United Kingdom,</strong> only where no register holds the figure: the sales a London business needs to break even, or the cost to open at London prices. The line under the figure says it is an estimate.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Outside the United Kingdom,</strong> most figures are estimates from national statistics and a trade&rsquo;s typical shape, and each page says so once.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>With no fair basis,</strong> the page leaves the figure out rather than guess.</span>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        {/* WHAT THE FIGURES LEAVE OUT (P36.1, the rewrites of 2026-10-06): the old post "What we won't show" moved here, as BLOG.md
            says, rewritten from the data pack's own ledger (public/data/uk/2026.10/ledger.json, each row's leaves_out), so it says
            what the UK tables leave out in their own terms; /blog/what-we-omit lands on this id (data/blog/moved_posts.json). */}
        <h2 id="leave-out" className="scroll-mt-24 text-xl font-semibold text-ink-900">What the figures leave out</h2>
        <ul className="mt-4 space-y-3 text-ink-800">
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Unregistered businesses.</strong> The counts, takings and survival figures hold businesses registered for VAT or PAYE. The 54% of UK businesses on neither register, most of them sole traders, are not in them, so the middle business&rsquo;s takings sit above the middle of all businesses. <a href="/blog/hidden-economy-solo-proprietors" className="underline underline-offset-2">Who the counts leave out</a>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Sole traders, where the register is of companies.</strong> Failures count limited companies; company ages and new companies count limited companies and limited liability partnerships. A sole trader&rsquo;s insolvency is personal and is not counted.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Where a business trades.</strong> A business is counted at its registered address, which is not always where it trades.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Small numbers.</strong> Counts are rounded to the nearest 5. The middle business&rsquo;s takings are not printed where an area holds under 40 businesses, and a failure rate only where the year holds 10 or more insolvencies.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Shared codes.</strong> Where several trades share one industry code, a figure is the whole code&rsquo;s: barbers, hairdressers, and nail, brow and lash studios share one.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Rent.</strong> The official rent estimate is of April 2021, not today&rsquo;s asking rents. Pubs and hotels are valued on their takings and have none.</span>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Business formation data</h2>
        <p className="mt-3 text-ink-800">
          Setup cost and days-to-start figures cover 152 countries. Numbers
          combine commercial registry filings, national investment promotion
          agency guides, and international benchmarking archives. Formation
          regimes change slowly: most countries' setup days have moved by
          less than a week in the last decade.
        </p>
        <p className="mt-3 text-ink-800">
          Costs are the mandatory government and notary fees in USD-equivalent.
          Professional service fees (lawyers, accountants, registered office
          rental) are not included.
        </p>
      </section>

      <section className="mt-10">
        {/* SOURCES AND LICENCES (plan 06, task B4; his ruling of 2026-10-04 on R-002: "One sources page"). Every UK page's foot
            links here (SourcesFoot.tsx). The list is src/lib/spine/uk_sources.ts, the one module allowed to name a source, built
            from the repository's own records; an attribution line prints only where those records name the licence. The
            licence asks that nothing imply a source endorses the site, so the opening line says so. */}
        <h2 id="sources" className="scroll-mt-24 text-xl font-semibold text-ink-900">Sources and licences</h2>
        <p className="mt-3 text-ink-800">
          The United Kingdom&rsquo;s pages are built on these sources. Each is named with what the pages print from it and, where
          its licence asks for one, its attribution line. No source endorses Margin Atlas or checks how its figures are used here.
        </p>
        <SourceList sources={UK_SOURCES} />
        {/* THE HOME PAGE'S SOURCES OUTSIDE THE UNITED KINGDOM (plan 2026-10-08, home sections 2 and 3), named the way the UK's are. */}
        <p className="mt-6 text-ink-800">
          The home page also prints figures from outside the United Kingdom, from these sources.
        </p>
        <SourceList sources={WORLD_SOURCES} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Updates</h2>
        <p className="mt-3 text-ink-800">
          The dataset is refreshed regularly. Each benchmark page indicates the recency of the underlying observation.
        </p>
        <p className="mt-3 text-ink-800">
          When a figure turns out wrong, we correct it and list it on the{" "}
          <a href="/corrections" className="underline underline-offset-2">corrections page</a>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Citing Atlas</h2>
        <p className="mt-3 text-ink-800">
          Atlas may be cited in articles, reports, or presentations. The only request is a link back to the benchmark page being cited.
        </p>
        <p className="mt-3 text-ink-800">
          The UK tables behind the pages are free to download, with how to cite them, on the{" "}
          <a href="/data" className="underline underline-offset-2">data page</a>.
        </p>
      </section>
    </article>
  );
}

/** One list of sources: the publisher, what the pages print from it with each dataset or page read, and the attribution line where
 *  its licence asks for one. The UK's list and the home's sources outside the UK draw the same way. */
function SourceList({ sources }: { sources: readonly UkSource[] }) {
  return (
    <ul className="mt-5 space-y-5">
      {sources.map((s) => (
        <li key={s.key}>
          <p className="font-semibold text-ink-900">{s.publisher}</p>
          <ul className="mt-1 space-y-1 text-sm leading-relaxed text-ink-800">
            {s.items.map((i) => (
              <li key={i.title}>
                {i.prints}:{" "}
                {i.url ? <a href={i.url} className="underline underline-offset-2">{i.title}</a> : i.title}.
              </li>
            ))}
          </ul>
          {s.attribution ? <p className="mt-1 text-sm text-ink-700">{s.attribution}</p> : null}
        </li>
      ))}
    </ul>
  );
}
