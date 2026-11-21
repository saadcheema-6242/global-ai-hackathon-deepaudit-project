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
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ── Hero Section ── */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Verify Any AI-Generated Text in Seconds
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Paste any LLM output, article, or research summary. DeepAudit extracts
            factual claims, verifies each one against real-time web sources via{" "}
            <span className="text-cyan-400 font-medium">Tavily Search API</span>, and
            routes through{" "}
            <span className="text-purple-400 font-medium">Bifrost AI Gateway</span> for
            secure, observable AI processing.
          </p>
        </div>

        {/* ── Preset Buttons ── */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-xs text-slate-500 self-center mr-1">Try a demo:</span>
          {AUDIT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset.text)}
              disabled={loading}
              className="group px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-1.5">{preset.emoji}</span>
              {preset.label}
              <span className="block text-[10px] text-slate-500 group-hover:text-slate-400 mt-0.5">
                {preset.description}
              </span>
            </button>
          ))}
        </div>

        {/* ── Input Area ── */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <span>📝</span> Paste AI-generated text, article, or any content to audit:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste any text here... For example, an AI-generated article, ChatGPT response, code documentation, or research summary."
            className="w-full h-40 bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {inputText.length} characters
            </span>
            <button
              onClick={() => runAudit(inputText)}
              disabled={loading || inputText.trim().length < 10}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center gap-2"
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
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
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
                    className="text-xs px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                  >
                    📥 Export Report (JSON)
                  </button>
                  <span className="text-xs text-slate-500">
                    Audit ID: {report.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Bifrost Metrics */}
            <BifrostMetricsPanel metrics={report.bifrostMetrics} />

            {/* Individual Claim Cards */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>📋</span> Claim-by-Claim Analysis
              </h3>
              {report.claims.map((v, i) => (
                <ClaimCard key={v.claim.id} verification={v} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="border-t border-slate-800 pt-8 pb-4 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Built for the{" "}
            <span className="text-slate-400 font-medium">
              HackCulture Global AI Hackathon
            </span>{" "}
            by Geek Room
          </p>
          <p className="text-xs text-slate-600">
            Powered by{" "}
            <span className="text-cyan-500">Tavily Search API</span> •{" "}
            <span className="text-purple-500">Bifrost (Maxim AI) Gateway</span> •{" "}
            Next.js • TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
}
