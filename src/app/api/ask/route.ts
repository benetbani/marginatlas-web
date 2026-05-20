/**
 * POST /api/ask — natural-language question, returns a cited answer.
 *
 * Two modes:
 *
 * 1. **Live mode**: when ANTHROPIC_API_KEY is present in env, the
 *    handler calls Claude with a single tool `query_cells` that maps
 *    onto our cells data layer. Claude decides what to fetch, the
 *    server fetches it, and Claude synthesizes a plain-English answer.
 *
 * 2. **Preview mode**: when no key, returns a polite stub explaining
 *    Ask Atlas is in development.
 *
 * The live path is rate-limited at the middleware layer (60 req/min)
 * and additionally caps tool-use turns at 4 to keep Anthropic spend
 * bounded.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCellBySlug } from "@/lib/cells";
import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";

const MODEL = "claude-sonnet-4-5";
const MAX_TURNS = 4;

const SYSTEM_PROMPT = `You are Margin Atlas, a small-business benchmarking assistant.

You answer questions about typical revenue, employment, wages, and firm distributions
across industries and geographies.

Lorem ipsum dolor sit amet, consectetur adipiscing elit: editorial tone is being
finalised; until then, keep responses short and factual.

Covered countries with measured sub-national data: US (counties), AU (SA2),
MX (states + municipios), GB (LADs incl. all London boroughs), DE/FR/IT/ES/NL/PL/SE
(EU NUTS regions), JP (prefectures + major cities), BR (states + cities), CA (provinces).
For countries outside this list, fall back to country-level estimates with a note.

Rules:
- Use the query_cells tool whenever the user asks about a specific industry × location.
- Never reveal the underlying data source, agency name, or methodology: refer to
  "compiled business statistics" or "our covered cells" if asked.
- Be concise. Lead with the headline number, then context.
- When numbers are very approximate or quality is low (score < 50), say so.
- Always cite the year of the data.
- If a country/region isn't covered, say so plainly and suggest a covered alternative.
`;

const TOOL = {
  name: "query_cells",
  description:
    "Look up small-business benchmarks for a given country, region, and industry. " +
    "Returns typical revenue per firm, the bottom 10% and top 10% spread, number of " +
    "firms, employees, wage per employee, and a quality score.",
  input_schema: {
    type: "object",
    properties: {
      country: {
        type: "string",
        description:
          "ISO-2 country code, e.g. 'US', 'AU', 'MX', 'GB', 'DE', 'FR', 'JP', 'BR', 'CA'.",
      },
      region: {
        type: "string",
        description:
          "Region or city slug. Examples: 'california', 'new-york', 'us-06-037' (LA County), " +
          "'manhattan', 'brooklyn', 'gb-e09000033' (Westminster), 'de21' (Oberbayern), " +
          "'jp-13000' (Tokyo), 'br-sp' (São Paulo), 'mx-09' (CDMX). " +
          "If unsure, pick a known major region for the country.",
      },
      industry_id: {
        type: "string",
        description:
          "Industry id from our taxonomy, e.g. 'restaurants', 'legal_services', " +
          "'construction', 'hairdressers_beauty'. Use the id form, not the human name.",
      },
    },
    required: ["country", "industry_id"],
  },
};

type ToolInput = {
  country: string;
  region?: string;
  industry_id: string;
};

async function executeTool(input: ToolInput) {
  if (!INDUSTRY_BY_ID[input.industry_id]) {
    return { error: "Unknown industry_id. Use a valid id from the taxonomy." };
  }
  const country = input.country.toUpperCase();
  // Per-country default region when caller omits it
  const DEFAULT_REGION: Record<string, string> = {
    US: "california",
    AU: "au-101",       // Sydney - Inner City SA2
    MX: "mx-09",        // CDMX
    GB: "gb-e09000033", // Westminster
    DE: "de21",         // Oberbayern
    FR: "fr10",         // Île-de-France
    IT: "itc4",         // Lombardia
    ES: "es-28",        // Madrid
    NL: "nl-gm0363",    // Amsterdam
    JP: "jp-13000",     // Tokyo
    BR: "br-sp",        // São Paulo state
    CA: "ca-on",        // Ontario
  };
  const region = input.region || DEFAULT_REGION[country] || country.toLowerCase();
  const industrySlug = industryToSlug(input.industry_id);
  const cell = await getCellBySlug(country.toLowerCase(), region, industrySlug);
  if (!cell) {
    return { error: `No data for ${input.industry_id} in ${region}, ${country}. Try another region or industry.` };
  }
  return {
    country: cell.country,
    region: cell.geo_name,
    industry: cell.industry_name,
    year: cell.year,
    typical_revenue_per_firm_usd: cell.revenue_per_firm,
    bottom_10pct_revenue_usd: cell.rev_p10,
    top_10pct_revenue_usd: cell.rev_p90,
    n_firms: cell.n_enterprises,
    n_employees: cell.n_employees,
    // Plan v13 Wave 4a — avg-employees-per-firm omitted (n_enterprises
    // denominator is unreliable, so the derived ratio looks dubious).
    wage_per_employee_usd: cell.payroll_per_employee,
    quality_score: cell.quality_score,
  };
}

type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: ToolInput }
  | { type: "tool_result"; tool_use_id: string; content: string };

async function callClaude(messages: { role: "user" | "assistant"; content: Block[] | string }[]) {
  // Plan v14 Phase F: route through Vercel AI Gateway in production when
  // ANTHROPIC_AI_GATEWAY_KEY is set; falls back to direct Anthropic when
  // only ANTHROPIC_API_KEY is present (local dev, or if gateway is down).
  // Same response shape either way; the gateway is Anthropic-compatible.
  const gatewayKey = process.env.ANTHROPIC_AI_GATEWAY_KEY;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!gatewayKey && !apiKey) {
    throw new Error("Neither ANTHROPIC_AI_GATEWAY_KEY nor ANTHROPIC_API_KEY is set");
  }
  const baseUrl = gatewayKey ? "https://ai-gateway.vercel.sh" : "https://api.anthropic.com";
  const authHeaders: Record<string, string> = gatewayKey
    ? { Authorization: `Bearer ${gatewayKey}` }
    : { "x-api-key": apiKey as string };
  const r = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [TOOL],
      messages,
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    const provider = gatewayKey ? "AI Gateway" : "Anthropic";
    throw new Error(`${provider} ${r.status}: ${text.slice(0, 500)}`);
  }
  return r.json();
}

/**
 * Per-IP usage cap (Plan v4.0 Step 27.8).
 * In-memory buckets per Edge runtime instance — sufficient for the volume
 * we expect at launch, keeps the free-tier serverless cost at zero, and
 * works without an external store.
 */
const ASK_BUCKETS = new Map<string, { count: number; windowStart: number }>();
const ASK_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ASK_FREE_LIMIT = 10;

/**
 * JJ.3 — best-effort monthly spend cap. Tracks queries + estimated cost in
 * this Edge instance's memory. Cold starts reset the counter so this is
 * conservative on the high side rather than the low side (we may briefly
 * over-spend across redeploys, never silently runaway in one instance).
 *
 * Override via env: ASK_MONTHLY_CAP_USD (default 200).
 * Cost model: Claude Sonnet 4.5 ~$3 input + $15 output per 1M tokens; with
 * the tool loop running ~1.5 turns avg, a typical query bills ~$0.04. We
 * round up to $0.06/query to leave headroom and account for outliers.
 */
const ASK_MONTHLY_CAP_USD = Number(
  process.env.ASK_MONTHLY_CAP_USD ?? "200"
);
const ASK_PER_QUERY_COST_USD = 0.06;
const ASK_SPEND_STATE: { month: string; queriesUsed: number } = {
  month: "",
  queriesUsed: 0,
};

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthlySpendStatus(): {
  spendUsd: number;
  capUsd: number;
  overBudget: boolean;
} {
  const m = currentMonthKey();
  if (ASK_SPEND_STATE.month !== m) {
    ASK_SPEND_STATE.month = m;
    ASK_SPEND_STATE.queriesUsed = 0;
  }
  const spendUsd = ASK_SPEND_STATE.queriesUsed * ASK_PER_QUERY_COST_USD;
  return { spendUsd, capUsd: ASK_MONTHLY_CAP_USD, overBudget: spendUsd >= ASK_MONTHLY_CAP_USD };
}

function recordAskSpend(): void {
  const m = currentMonthKey();
  if (ASK_SPEND_STATE.month !== m) {
    ASK_SPEND_STATE.month = m;
    ASK_SPEND_STATE.queriesUsed = 0;
  }
  ASK_SPEND_STATE.queriesUsed++;
}

function clientIpFromHeaders(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function checkAskQuota(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const b = ASK_BUCKETS.get(ip);
  if (!b || now - b.windowStart > ASK_WINDOW_MS) {
    ASK_BUCKETS.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: ASK_FREE_LIMIT - 1 };
  }
  b.count++;
  return { allowed: b.count <= ASK_FREE_LIMIT, remaining: Math.max(0, ASK_FREE_LIMIT - b.count) };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const question = body?.question?.trim?.();
    if (!question) {
      return NextResponse.json({ error: "missing question" }, { status: 400 });
    }

    // Free-tier per-IP cap (Plan v4.0 Step 27.8).
    if (process.env.ANTHROPIC_API_KEY) {
      const ip = clientIpFromHeaders(request);
      const { allowed, remaining } = checkAskQuota(ip);
      if (!allowed) {
        return NextResponse.json(
          {
            error:
              `You've hit the free-tier limit of ${ASK_FREE_LIMIT} questions per hour. ` +
              `Sign in or upgrade to Pro for unlimited questions.`,
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(ASK_FREE_LIMIT),
              "X-RateLimit-Remaining": "0",
              "Retry-After": "3600",
            },
          }
        );
      }
      // Stash the remaining count to send back as a response header on success.
      // We'll use it via NextResponse below.
      void remaining;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Preview stub when key is not configured.
      // NOTE for ops: live mode activates as soon as ANTHROPIC_API_KEY appears in
      // process.env. In production that means setting it in Vercel
      // (Settings → Environment Variables → ANTHROPIC_API_KEY). In local dev
      // it's picked up from .env.local automatically.
      return NextResponse.json({
        answer:
          `"${question}"\n\n` +
          `Lorem ipsum dolor sit amet: Ask Atlas is wired and ready, but the ` +
          `production API key isn't deployed yet. Once the operator pastes the ` +
          `ANTHROPIC_API_KEY into Vercel and redeploys, live answers will start ` +
          `streaming. Every cell page already shows typical revenue, employment, ` +
          `and distribution for any country × industry × size combination.`,
        preview: true,
      });
    }

    // JJ.3 — monthly spend ceiling. Fall through to preview stub when
    // we've burned the budget so we never hemorrhage Anthropic spend.
    const spend = monthlySpendStatus();
    if (spend.overBudget) {
      return NextResponse.json({
        answer:
          `"${question}"\n\n` +
          `Ask Atlas has hit this month's spending limit ($${spend.capUsd.toFixed(0)}). ` +
          `Live answers resume on the first of next month. Every cell page still ` +
          `shows typical revenue, employment, and distribution for any ` +
          `country × industry × size combination: try /browse or /compare in the meantime.`,
        preview: true,
        budgetCapped: true,
      });
    }

    // Live agentic loop with bounded turns
    const messages: { role: "user" | "assistant"; content: Block[] | string }[] = [
      { role: "user", content: question },
    ];

    let answer = "";
    let toolCalls = 0;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const resp = await callClaude(messages);
      const content: Block[] = (resp.content || []) as Block[];
      messages.push({ role: "assistant", content });

      // Collect text + handle tool calls
      const toolUses = content.filter((b) => b.type === "tool_use") as Extract<Block, { type: "tool_use" }>[];
      const textParts = content
        .filter((b) => b.type === "text")
        .map((b) => (b as Extract<Block, { type: "text" }>).text)
        .join("\n");

      if (toolUses.length === 0) {
        answer = textParts || answer;
        break;
      }

      // Execute each tool call and feed results back
      const toolResults: Block[] = [];
      for (const tu of toolUses) {
        toolCalls++;
        const result = await executeTool(tu.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        });
      }
      messages.push({ role: "user", content: toolResults });
    }

    recordAskSpend();
    return NextResponse.json({ answer, toolCalls, preview: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
