// ============================================================
// DeepAudit AI — Claim Card Component
// ============================================================
"use client";

import { useState } from "react";
import { ClaimVerification } from "@/lib/types";

interface ClaimCardProps {
  verification: ClaimVerification;
  index: number;
}

const STATUS_CONFIG = {
  verified: {
    emoji: "🟢",
    label: "Verified",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/10",
  },
  outdated: {
    emoji: "🟡",
    label: "Outdated",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/10",
  },
  hallucinated: {
    emoji: "🔴",
    label: "Hallucinated",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    glow: "shadow-red-500/10",
  },
  unverifiable: {
    emoji: "⚪",
    label: "Unverifiable",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    glow: "shadow-slate-500/10",
  },
};

export default function ClaimCard({ verification, index }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[verification.status];

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-300 hover:shadow-lg ${config.glow} cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xl mt-0.5 shrink-0">{config.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200 leading-relaxed">
              &ldquo;{verification.claim.text}&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border}`}
              >
                {config.label}
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-wide">
                {verification.claim.category}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence badge */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className={`text-lg font-bold ${config.text}`}
          >
            {verification.confidence}%
          </div>
          <span className="text-[10px] text-slate-500 uppercase">Confidence</span>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3 animate-fadeIn">
          {/* Reasoning */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Analysis
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {verification.reasoning}
            </p>
          </div>

          {/* Corrected Info */}
          {verification.correctedInfo && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                ✦ Corrected Information
              </h4>
              <p className="text-sm text-blue-200">{verification.correctedInfo}</p>
            </div>
          )}

          {/* Sources */}
          {verification.sources.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Sources ({verification.sources.length})
              </h4>
              <div className="space-y-2">
                {verification.sources.map((source, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {source.title}
                    </a>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {source.snippet}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {source.publishedDate && (
                        <span className="text-[10px] text-slate-500">
                          📅 {source.publishedDate}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">
                        Relevance: {(source.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expand indicator */}
      <div className="mt-2 text-center">
        <span className="text-xs text-slate-500">
          {expanded ? "▲ Collapse" : "▼ Click to expand details & sources"}
        </span>
      </div>
    </div>
  );
}
