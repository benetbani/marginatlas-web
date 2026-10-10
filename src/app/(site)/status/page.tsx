/**
 * /status — simple uptime + dependency dashboard (Track JJ.5).
 *
 * Server component that pings each tracked dependency at request time and
 * renders a dot per system. No external uptime infra, just inline HTTP checks
 * with a short timeout, run on every request (force-dynamic).
 *
 * PLAIN NAMES, AND NO RAW ERROR TEXT (plan 2026-10-10, the home reformed to ship, Task 8; the ship audit's 5.9). This page is linked
 * from every footer, and it printed "Supabase (cells)", "Read of regional_cells" and whatever a failed fetch threw, a vendor's name,
 * a table's name and a stack fragment for any reader during an outage. It names what a reader uses, the pages and the figures, and
 * says only whether each answered. Its outage heading printed "We&apos;re investigating an issue" with the entity in letters: a
 * JavaScript string in braces is not JSX text, so the entity was never decoded. The words now need no apostrophe, and they promise
 * no public note nobody writes.
 */
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

type Check = {
  name: string;
  description: string;
  result: "up" | "degraded" | "down" | "unknown";
  latencyMs?: number;
};

async function checkUrl(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<{ result: Check["result"]; latencyMs?: number }> {
  const timeoutMs = init.timeoutMs ?? 5000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
    const latencyMs = Date.now() - started;
    if (res.ok) return { result: "up", latencyMs };
    if (res.status >= 500) return { result: "down", latencyMs };
    return { result: "degraded", latencyMs };
  } catch {
    return { result: "down", latencyMs: Date.now() - started };
  } finally {
    clearTimeout(t);
  }
}

/** What a reader sees each check as: the pages they read, and the figures those pages draw. */
const PAGES = { name: "Pages", description: "The home page answers" };
const FIGURES = { name: "Figures", description: "The figures behind the pages answer" };

async function runChecks(): Promise<Check[]> {
  noStore();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks: Promise<Check>[] = [];

  checks.push(
    (async () => {
      const r = await checkUrl("https://www.marginatlas.com/", { method: "HEAD" });
      return { ...PAGES, ...r };
    })()
  );

  if (supabaseUrl && supabaseKey) {
    checks.push(
      (async () => {
        const r = await checkUrl(
          `${supabaseUrl}/rest/v1/regional_cells?select=country&limit=1`,
          {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          }
        );
        return { ...FIGURES, ...r };
      })()
    );
  } else {
    checks.push(Promise.resolve({ ...FIGURES, result: "unknown" as const }));
  }

  // Ask Atlas + Anthropic API checks removed from
  // status page along with the /ask route and AskWidget. No AI-flavored
  // services are currently part of the user-visible product.

  return Promise.all(checks);
}

function colorFor(result: Check["result"]): string {
  switch (result) {
    case "up":
      return "bg-atlas-500";
    case "degraded":
      return "bg-clay-400";
    case "down":
      return "bg-clay-700";
    default:
      return "bg-paper-450";
  }
}

function labelFor(result: Check["result"]): string {
  switch (result) {
    case "up":
      return "Working";
    case "degraded":
      return "Partly working";
    case "down":
      return "Down";
    default:
      return "Not checked";
  }
}

/** The page's heading for each state of the checks: four words at most, plain, no apostrophe. Not exported: a page file exports
 *  only what Next reads from it. */
const STATUS_HEADINGS = {
  allUp: "Everything is working",
  anyDown: "Something is down",
  otherwise: "Something is not right",
} as const;

export const metadata = {
  title: "Status: Margin Atlas",
  description: "Whether Margin Atlas is up, checked when you open the page.",
  alternates: { canonical: "/status" },
};

export default async function StatusPage() {
  const checks = await runChecks();
  const allUp = checks.every((c) => c.result === "up");
  const anyDown = checks.some((c) => c.result === "down");

  return (
    <div className="py-12 max-w-3xl">
      {/* The masthead was bare type on the fixed page photograph. One card,
          the same shape every other route in this group now uses. */}
      <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
      <div className="text-sm font-medium text-[var(--c-ink2)]">
        Status
      </div>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--c-ink)]">
        {allUp ? STATUS_HEADINGS.allUp : anyDown ? STATUS_HEADINGS.anyDown : STATUS_HEADINGS.otherwise}
      </h1>
      <p className="mt-2 text-sm text-[var(--c-ink2)]">
        Checked when you opened this page.
      </p>
      </div>

      <div className="atlas-card mt-8 divide-y divide-paper-350/70 overflow-hidden">
        {checks.map((c) => (
          <div key={c.name} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--c-ink)]">{c.name}</div>
              <div className="text-xs text-[var(--c-ink2)]">{c.description}</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${colorFor(
                    c.result
                  )}`}
                />
                <span className="text-sm font-medium text-[var(--c-ink)]">
                  {labelFor(c.result)}
                </span>
              </div>
              {c.latencyMs ? (
                <span className="text-xs text-[var(--c-ink2)] tabular-nums">
                  {c.latencyMs}ms
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-[var(--c-ink2)]">
        Each check runs when the page loads. A brief network blip can show here, so reload once.
      </p>
    </div>
  );
}
