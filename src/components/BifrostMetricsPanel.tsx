// ============================================================
// DeepAudit AI — Bifrost Metrics Dashboard Panel
// ============================================================
"use client";

import { BifrostMetrics } from "@/lib/types";

interface MetricsPanelProps {
  metrics: BifrostMetrics;
}

export default function BifrostMetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⚡</span>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Bifrost Gateway Metrics
        </h3>
        <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          Maxim AI
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tokens */}
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Tokens</div>
          <div className="text-xl font-bold text-slate-200 mt-1">
            {metrics.totalTokensUsed.toLocaleString()}
          </div>
        </div>

        {/* Latency */}
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Latency</div>
          <div className="text-xl font-bold text-slate-200 mt-1">
            {metrics.totalLatencyMs}
            <span className="text-xs text-slate-400 ml-1">ms</span>
          </div>
        </div>

        {/* Model */}
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Model</div>
          <div className="text-sm font-bold text-slate-200 mt-1 truncate">
            {metrics.modelUsed}
          </div>
        </div>

        {/* Cost */}
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Est. Cost</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            ${metrics.costEstimateUsd.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Guardrails */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Guardrails:</span>
        {metrics.guardrailsTriggered.map((g, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-0.5 rounded-full ${
              g === "none"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {g === "none" ? "✓ All Clear" : `⚠ ${g}`}
          </span>
        ))}
      </div>
    </div>
  );
}
