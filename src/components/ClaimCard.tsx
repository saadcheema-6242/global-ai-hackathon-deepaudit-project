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

// Only allow http(s) links. Source URLs come from an external search API,
// so an untrusted "javascript:"/"data:" URL must never reach an <a href>.
function safeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

// Monochrome status system — differentiated by icon + fill/outline weight,
// not color, so it reads clearly in the black & white theme.
const STATUS_CONFIG = {
  verified: {
    icon: "✓",
    label: "Verified",
    card: "border-neutral-300 bg-white",
    accent: "border-l-neutral-900",
    pill: "bg-neutral-900 text-white border-neutral-900",
    value: "text-neutral-900",
  },
  outdated: {
    icon: "!",
    label: "Outdated",
    card: "border-neutral-300 bg-neutral-50",
    accent: "border-l-neutral-500",
    pill: "bg-neutral-200 text-neutral-800 border-neutral-400",
    value: "text-neutral-700",
  },
  hallucinated: {
    icon: "✕",
    label: "Hallucinated",
    card: "border-neutral-900 bg-neutral-50",
    accent: "border-l-neutral-900",
    pill: "bg-white text-neutral-900 border-neutral-900 border-2",
    value: "text-neutral-900",
  },
  unverifiable: {
    icon: "?",
    label: "Unverifiable",
    card: "border-neutral-200 bg-white",
    accent: "border-l-neutral-300",
    pill: "bg-neutral-50 text-neutral-500 border-neutral-300",
    value: "text-neutral-500",
  },
};

export default function ClaimCard({ verification, index }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[verification.status];

  return (
    <div
      className={`rounded-xl border border-l-4 ${config.card} ${config.accent} p-4 transition-all duration-300 hover:shadow-md cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="w-6 h-6 mt-0.5 shrink-0 rounded-full border border-neutral-300 flex items-center justify-center text-xs font-bold text-neutral-900">
            {config.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-900 leading-relaxed">
              &ldquo;{verification.claim.text}&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${config.pill}`}
              >
                {config.label}
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wide">
                {verification.claim.category}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence badge */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`text-lg font-bold ${config.value}`}>
            {verification.confidence}%
          </div>
          <span className="text-[10px] text-neutral-500 uppercase">Confidence</span>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200 space-y-3 animate-fadeIn">
          {/* Reasoning */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Analysis
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {verification.reasoning}
            </p>
          </div>

          {/* Corrected Info */}
          {verification.correctedInfo && (
            <div className="bg-neutral-900 text-white rounded-lg p-3">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                ✦ Corrected Information
              </h4>
              <p className="text-sm text-white">{verification.correctedInfo}</p>
            </div>
          )}

          {/* Sources */}
          {verification.sources.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Sources ({verification.sources.length})
              </h4>
              <div className="space-y-2">
                {verification.sources.map((source, i) => {
                  const safeUrl = safeHttpUrl(source.url);
                  return (
                  <div
                    key={i}
                    className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
                  >
                    {safeUrl ? (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-neutral-900 underline decoration-neutral-400 hover:decoration-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {source.title}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-neutral-700">
                        {source.title}
                      </span>
                    )}
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {source.snippet}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {source.publishedDate && (
                        <span className="text-[10px] text-neutral-500">
                          📅 {source.publishedDate}
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-500">
                        Relevance: {(source.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expand indicator */}
      <div className="mt-2 text-center">
        <span className="text-xs text-neutral-500">
          {expanded ? "▲ Collapse" : "▼ Click to expand details & sources"}
        </span>
      </div>
    </div>
  );
}
