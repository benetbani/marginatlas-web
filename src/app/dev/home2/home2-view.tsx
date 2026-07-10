/**
 * Home2View , rebuilt homepage BODY on the spine kit. Wave 2 Task 5: the masthead only
 * (Task 6 appends the spine-below chapters beneath this section).
 *
 * ONE white "lift" Box floats over the shell's skyline (see ./layout.tsx), holding, in
 * order: a POV eyebrow, the single server-rendered crawlable <h1> question, a one-line
 * subtitle, an optional real-data insight Chip (self-omits on null/empty, never a
 * fabricated stat), and the launcher.
 *
 * THE LAUNCHER preserves the "/api/go" no-JS contract verbatim: NavigatorForm is mounted
 * exactly as-is (its own <form action="/api/go" method="get"> + the four hidden inputs +
 * its client submit() are untouched , not reimplemented, wrapped, or forked). Beside it,
 * a plain server-rendered <a href="/decide"> is the prominent recommender entry point; a
 * real link works with JS off too. Two honest paths in: pick it yourself, or let the
 * Atlas pick for you.
 */
import { Box, Chip, Full } from "@/components/spine/kit";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { NavigatorForm } from "@/components/NavigatorForm";

export function Home2View({ insight }: { insight?: string | null }) {
  return (
    <section className="overflow-hidden py-8 md:py-12">
      <Full>
      <Box elevation="lift">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">
            The #1 atlas of local profit intelligence
          </div>
          {/* Server-rendered, concrete , no client-only word rotation, so a crawler
              sees a real question (matches the current homepage's crawlable-H1 rule). */}
          <h1
            data-typography="custom"
            className="mx-auto mt-2 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2.6rem]"
          >
            How much does a {HERO_BUSINESSES[0]} keep in {HERO_CITIES[0]}?
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-[var(--c-ink2)] md:text-[15px]">
            Know if a business works before you risk your money.
          </p>
          {insight ? (
            <div className="mt-4 flex justify-center">
              <Chip>{insight}</Chip>
            </div>
          ) : null}
        </div>

        {/* The launcher. The recommender entry point sits above the concrete picker so
            both read as two honest doors in, not one buried inside the other. */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <a
            href="/decide"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--terra-border)] bg-[var(--terra-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--terra-text)] transition hover:bg-[var(--terra-border)]"
          >
            Or let the Atlas pick the place for you
            <span aria-hidden="true">&rarr;</span>
          </a>
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
            or search a place and a business directly
          </span>
        </div>

        {/* NavigatorForm mounted as-is: unmodified "/api/go" no-JS form + hidden inputs. */}
        <div className="mt-4">
          <NavigatorForm />
        </div>
      </Box>
      </Full>
    </section>
  );
}
