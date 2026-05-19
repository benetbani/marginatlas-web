/**
 * /status — simple uptime + dependency dashboard (Track JJ.5).
 *
 * Server component that pings each tracked dependency at request time and
 * renders a green/yellow/red dot per system. No external uptime infra —
 * just inline HTTP checks with a short timeout. Cached for 60 seconds.
 */
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

type Check = {
  name: string;
  description: string;
  result: "up" | "degraded" | "down" | "unknown";
  detail?: string;
  latencyMs?: number;
};

async function checkUrl(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<{ result: Check["result"]; detail?: string; latencyMs?: number }> {
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
    if (res.status >= 500) return { result: "down", detail: `HTTP ${res.status}`, latencyMs };
    return { result: "degraded", detail: `HTTP ${res.status}`, latencyMs };
  } catch (e) {
    const latencyMs = Date.now() - started;
    const msg = e instanceof Error ? e.message : String(e);
    return { result: "down", detail: msg.slice(0, 80), latencyMs };
  } finally {
    clearTimeout(t);
  }
}

async function runChecks(): Promise<Check[]> {
  noStore();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks: Promise<Check>[] = [];

  checks.push(
    (async () => {
      const r = await checkUrl("https://marginatlas.com/", { method: "HEAD" });
      return {
        name: "marginatlas.com",
        description: "Production landing page",
        ...r,
      };
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
        return {
          name: "Supabase (cells)",
          description: "Read of regional_cells",
          ...r,
        };
      })()
    );
  } else {
    checks.push(
      Promise.resolve({
        name: "Supabase (cells)",
        description: "Read of regional_cells",
        result: "unknown" as const,
        detail: "no SUPABASE_URL/key in env",
      })
    );
  }

  checks.push(
    (async () => {
      const r = await checkUrl("https://marginatlas.com/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: "ping" }),
      });
      return {
        name: "/api/ask",
        description: "Ask Atlas backend",
        ...r,
      };
    })()
  );

  checks.push(
    (async () => {
      const r = await checkUrl("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY || "ping",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1,
          messages: [{ role: "user", content: "." }],
        }),
        timeoutMs: 8000,
      });
      // Anthropic returns 401 on bad key, 200 on success, 400 if model unsupported.
      // Either way, the API is reachable — treat 2xx/4xx as "up".
      const reachable =
        r.result === "up" ||
        r.result === "degraded" ||
        (r.detail && r.detail.startsWith("HTTP 4"));
      return {
        name: "Anthropic API",
        description: "Upstream for Ask Atlas",
        result: reachable ? ("up" as const) : r.result,
        detail: r.detail,
        latencyMs: r.latencyMs,
      };
    })()
  );

  return Promise.all(checks);
}

function colorFor(result: Check["result"]): string {
  switch (result) {
    case "up":
      return "bg-moss-500";
    case "degraded":
      return "bg-clay-400";
    case "down":
      return "bg-clay-700";
    default:
      return "bg-ink-300";
  }
}

function labelFor(result: Check["result"]): string {
  switch (result) {
    case "up":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "down":
      return "Down";
    default:
      return "Unknown";
  }
}

export const metadata = {
  title: "Status: Margin Atlas",
  description: "Live uptime of Margin Atlas dependencies.",
};

export default async function StatusPage() {
  const checks = await runChecks();
  const allUp = checks.every((c) => c.result === "up");
  const anyDown = checks.some((c) => c.result === "down");

  return (
    <div className="py-12 max-w-3xl">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        System status
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
        {allUp
          ? "All systems operational"
          : anyDown
          ? "We&apos;re investigating an issue"
          : "Operating with degraded service"}
      </h1>
      <p className="mt-2 text-sm text-ink-700/70">
        Checked just now from the request edge. Reload to re-run.
      </p>

      <div className="mt-8 divide-y divide-ink-200/70 rounded-2xl border border-ink-200 bg-cream-50 overflow-hidden">
        {checks.map((c) => (
          <div key={c.name} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-900">{c.name}</div>
              <div className="text-xs text-ink-700/70">{c.description}</div>
              {c.detail ? (
                <div className="mt-1 text-xs text-ink-700/60 truncate">
                  {c.detail}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${colorFor(
                    c.result
                  )}`}
                />
                <span className="text-sm font-medium text-ink-900">
                  {labelFor(c.result)}
                </span>
              </div>
              {c.latencyMs ? (
                <span className="text-xs text-ink-700/60 tabular-nums">
                  {c.latencyMs}ms
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-ink-700/60">
        Reports here are best-effort. Brief network blips can flag a service as
        degraded; refresh once. Persistent issues will get a public note.
      </p>
    </div>
  );
}
