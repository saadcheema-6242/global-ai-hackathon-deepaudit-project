// ============================================================
// DeepAudit AI — Bifrost Metrics Dashboard Panel
// ============================================================
"use client";

import { BifrostMetrics } from "@/lib/types";

interface MetricsPanelProps {
  metrics: BifrostMetrics;
}

const STATUS_BANNER = {
  live: {
    badge: "● Live LLM",
    badgeClass: "bg-neutral-900 text-white border-neutral-900",
    noticeClass: "",
    defaultNotice: "A real LLM verified these claims against live web sources.",
  },
  demo: {
    badge: "○ Demo mode",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-300",
    noticeClass: "text-neutral-500",
    defaultNotice: "No LLM key configured — results use local simulation.",
  },
  error: {
    badge: "⚠ Gateway error",
    badgeClass: "bg-white text-neutral-900 border-neutral-900 border-2",
    noticeClass: "text-neutral-900 font-medium",
    defaultNotice:
      "The LLM gateway failed — results fell back to local simulation and may be unreliable.",
  },
} as const;

export default function BifrostMetricsPanel({ metrics }: MetricsPanelProps) {
  const status = STATUS_BANNER[metrics.gatewayStatus] ?? STATUS_BANNER.demo;

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-lg">⚡</span>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
          Bifrost Gateway Metrics
        </h3>
        <span className="text-xs text-neutral-600 bg-white px-2 py-0.5 rounded-full border border-neutral-300">
          Maxim AI
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ml-auto ${status.badgeClass}`}
        >
          {status.badge}
        </span>
      </div>

      {/* Loud status line — never let a silent simulation look like a live run */}
      {metrics.gatewayStatus !== "live" && (
        <div
          className={`mb-4 text-xs rounded-lg border px-3 py-2 ${
            metrics.gatewayStatus === "error"
              ? "border-neutral-900 bg-white"
              : "border-neutral-200 bg-white"
          } ${status.noticeClass}`}
        >
          {metrics.gatewayNotice || status.defaultNotice}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tokens */}
        <div className="bg-white rounded-lg p-3 border border-neutral-200">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Tokens</div>
          <div className="text-xl font-bold text-neutral-900 mt-1">
            {metrics.totalTokensUsed.toLocaleString()}
          </div>
        </div>

        {/* Latency */}
        <div className="bg-white rounded-lg p-3 border border-neutral-200">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Latency</div>
          <div className="text-xl font-bold text-neutral-900 mt-1">
            {metrics.totalLatencyMs}
            <span className="text-xs text-neutral-500 ml-1">ms</span>
          </div>
        </div>

        {/* Model */}
        <div className="bg-white rounded-lg p-3 border border-neutral-200">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Model</div>
          <div className="text-sm font-bold text-neutral-900 mt-1 truncate">
            {metrics.modelUsed}
          </div>
        </div>

        {/* Cost */}
        <div className="bg-white rounded-lg p-3 border border-neutral-200">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Est. Cost</div>
          <div className="text-xl font-bold text-neutral-900 mt-1">
            ${metrics.costEstimateUsd.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Guardrails */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-neutral-500 uppercase tracking-wider">Guardrails:</span>
        {metrics.guardrailsTriggered.map((g, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-0.5 rounded-full border ${
              g === "none"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-900 border-neutral-400"
            }`}
          >
            {g === "none" ? "✓ All Clear" : `⚠ ${g}`}
          </span>
        ))}
      </div>
    </div>
  );
}
