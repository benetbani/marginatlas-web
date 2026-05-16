"use client";

import { useState } from "react";

const EXAMPLE_QUESTIONS = [
  "What's the typical revenue for a restaurant in California?",
  "How big is a typical bakery in France vs Germany?",
  "Which US state has the most plumbing businesses?",
  "What do hairdressers earn in Switzerland vs Greece?",
  "Compare software development across the Nordic countries",
];

export function AskClient() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (r.status === 429) {
        const j = await r.json().catch(() => ({}));
        setResponse(
          j.error ||
            "You've hit the free-tier limit (10 questions per hour). Sign in or upgrade for unlimited."
        );
      } else if (r.ok) {
        const j = await r.json();
        setResponse(j.answer || "No answer yet — this feature isn't fully wired.");
      } else {
        const j = await r.json().catch(() => ({}));
        setResponse(
          j.error || "Ask Atlas is still in preview. Join the waitlist below to get notified when it's live."
        );
      }
    } catch {
      setResponse("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitlistEmail.includes("@")) {
      setWaitlistState("error");
      return;
    }
    setWaitlistState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail, tag: "ask-waitlist" }),
      });
      if (r.ok) {
        setWaitlistState("success");
        setWaitlistEmail("");
      } else {
        setWaitlistState("error");
      }
    } catch {
      setWaitlistState("error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Ask box */}
      <form onSubmit={ask} className="card">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What's the typical revenue for a small bakery in Paris?"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-ink-200 bg-white outline-none focus:border-atlas-500 text-sm resize-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-ink-700/70">
            Cited answers · powered by Claude · Pro plan only when live
          </span>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2 rounded-lg bg-atlas-500 hover:bg-atlas-600 text-white font-medium text-sm disabled:opacity-50 transition"
          >
            {loading ? "Thinking…" : "Ask"}
          </button>
        </div>
      </form>

      {/* Example questions */}
      <section>
        <div className="text-xs uppercase tracking-wide text-ink-700 font-medium mb-2">
          Try one of these
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="px-3 py-1.5 rounded-full bg-ink-100 hover:bg-atlas-50 text-xs text-ink-700 hover:text-atlas-700 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Response area */}
      {response && (
        <section className="card bg-atlas-50/50 border-atlas-200">
          <div className="text-xs uppercase tracking-wide text-atlas-700 font-medium mb-2">
            Atlas response
          </div>
          <p className="text-sm text-ink-900 leading-relaxed whitespace-pre-wrap">{response}</p>
        </section>
      )}

      {/* Waitlist */}
      <section className="card bg-ink-100/30 border-ink-200">
        <h3 className="font-semibold text-ink-900">Get notified when Ask Atlas launches</h3>
        <p className="mt-1 text-sm text-ink-700">
          Live AI queries with inline citations to government statistical data.
          Currently in development.
        </p>
        {waitlistState === "success" ? (
          <p className="mt-3 text-sm text-atlas-600">✓ You're on the list.</p>
        ) : (
          <form onSubmit={joinWaitlist} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-3 py-2 rounded-lg border border-ink-200 bg-white outline-none focus:border-atlas-500 text-sm"
              required
            />
            <button
              type="submit"
              disabled={waitlistState === "loading"}
              className="px-4 py-2 rounded-lg bg-ink-900 hover:bg-ink-800 text-white font-medium text-sm transition"
            >
              {waitlistState === "loading" ? "…" : "Join waitlist"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
