// ============================================================
// DeepAudit AI — Main Dashboard Page
// ============================================================
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import ClaimCard from "@/components/ClaimCard";
import SummaryStats from "@/components/SummaryStats";
import BifrostMetricsPanel from "@/components/BifrostMetricsPanel";
import { AuditReport } from "@/lib/types";
import { AUDIT_PRESETS } from "@/lib/presets";

// End-to-end pipeline, surfaced on the UI so anyone can see exactly how a
// submission flows from raw text to a verified trust report.
const PIPELINE = [
  {
    step: "1",
    emoji: "📝",
    title: "Input",
    desc: "Paste any AI output, article, or research summary.",
    tech: "Your text",
  },
  {
    step: "2",
    emoji: "🧠",
    title: "Extract Claims",
    desc: "An LLM pulls out every verifiable factual claim.",
    tech: "Bifrost AI Gateway",
  },
  {
    step: "3",
    emoji: "🔎",
    title: "Verify Sources",
    desc: "Each claim is checked against the live web in parallel.",
    tech: "Tavily Search API",
  },
  {
    step: "4",
    emoji: "📊",
    title: "Score",
    desc: "Claims are labelled verified / outdated / hallucinated.",
    tech: "Scoring engine",
  },
  {
    step: "5",
    emoji: "✅",
    title: "Trust Report",
    desc: "A 0–100 trust score with per-claim evidence.",
    tech: "Exportable JSON",
  },
];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async (text: string) => {
    if (!text.trim() || text.trim().length < 10) {
      setError("Please enter at least 10 characters to audit.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Audit failed. Please try again.");
        return;
      }

      setReport(data);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetText: string) => {
    setInputText(presetText);
    runAudit(presetText);
  };

  const handleExport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepaudit-report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* ── Hero Section ── */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            Verify Any AI-Generated Text in Seconds
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Paste any LLM output, article, or research summary. DeepAudit extracts
            factual claims, verifies each one against real-time web sources via{" "}
            <span className="font-semibold text-neutral-900">Tavily Search API</span>, and
            routes through the{" "}
            <span className="font-semibold text-neutral-900">Bifrost AI Gateway</span> for
            secure, observable AI processing.
          </p>
        </div>

        {/* ── End-to-End Pipeline ── */}
        <section className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              How it works — end to end
            </h3>
            <span className="text-xs text-neutral-500">
              Tavily × Bifrost × Next.js
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="relative">
                <div className="h-full bg-white border border-neutral-200 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                      {p.step}
                    </span>
                    <span className="text-lg">{p.emoji}</span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 mt-1">
                    {p.title}
                  </div>
                  <p className="text-xs text-neutral-600 leading-snug">{p.desc}</p>
                  <div className="mt-auto pt-2">
                    <span className="inline-block text-[10px] font-medium uppercase tracking-wide text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-full px-2 py-0.5">
                      {p.tech}
                    </span>
                  </div>
                </div>
                {/* Connector arrow between steps on large screens */}
                {i < PIPELINE.length - 1 && (
                  <span className="hidden lg:block absolute top-1/2 -right-2.5 -translate-y-1/2 text-neutral-300 text-lg z-10">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-4">
            🔒 Hardened: rate-limited API, input-size caps, URL-scheme validation, and
            server-only API keys. Runs in demo mode with zero keys, or live with Tavily +
            any OpenAI-compatible LLM endpoint.
          </p>
        </section>

        {/* ── Preset Buttons ── */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-xs text-neutral-500 self-center mr-1">Try a demo:</span>
          {AUDIT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset.text)}
              disabled={loading}
              className="group px-4 py-2 rounded-lg bg-white border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-1.5">{preset.emoji}</span>
              {preset.label}
              <span className="block text-[10px] text-neutral-500 group-hover:text-neutral-700 mt-0.5">
                {preset.description}
              </span>
            </button>
          ))}
        </div>

        {/* ── Input Area ── */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
            <span>📝</span> Paste AI-generated text, article, or any content to audit:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste any text here... For example, an AI-generated article, ChatGPT response, code documentation, or research summary."
            className="w-full h-40 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-all"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              {inputText.length} characters
            </span>
            <button
              onClick={() => runAudit(inputText)}
              disabled={loading || inputText.trim().length < 10}
              className="px-6 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Auditing...
                </>
              ) : (
                <>🔍 Run Deep Audit</>
              )}
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-4 text-neutral-800 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Results ── */}
        {report && (
          <div className="space-y-8 animate-fadeIn">
            {/* Trust Score & Summary */}
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
              <div className="flex justify-center">
                <TrustScoreGauge score={report.overallTrustScore} size={200} />
              </div>
              <div className="space-y-4">
                <SummaryStats
                  total={report.totalClaims}
                  verified={report.verifiedCount}
                  outdated={report.outdatedCount}
                  hallucinated={report.hallucinatedCount}
                  unverifiable={report.unverifiableCount}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExport}
                    className="text-xs px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all"
                  >
                    📥 Export Report (JSON)
                  </button>
                  <span className="text-xs text-neutral-500">
                    Audit ID: {report.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Bifrost Metrics */}
            <BifrostMetricsPanel metrics={report.bifrostMetrics} />

            {/* Individual Claim Cards */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span>📋</span> Claim-by-Claim Analysis
              </h3>
              {report.claims.map((v, i) => (
                <ClaimCard key={v.claim.id} verification={v} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="border-t border-neutral-200 pt-8 pb-4 text-center space-y-2">
          <p className="text-xs text-neutral-500">
            Built for the{" "}
            <span className="text-neutral-800 font-medium">
              HackCulture Global AI Hackathon
            </span>{" "}
            by Geek Room
          </p>
          <p className="text-xs text-neutral-400">
            Powered by{" "}
            <span className="text-neutral-700">Tavily Search API</span> •{" "}
            <span className="text-neutral-700">Bifrost (Maxim AI) Gateway</span> •{" "}
            Next.js • TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
}
