// ============================================================
// DeepAudit AI — Summary Stats Bar
// ============================================================
"use client";

interface SummaryStatsProps {
  total: number;
  verified: number;
  outdated: number;
  hallucinated: number;
  unverifiable: number;
}

export default function SummaryStats({
  total,
  verified,
  outdated,
  hallucinated,
  unverifiable,
}: SummaryStatsProps) {
  const stats = [
    { label: "Total Claims", value: total, color: "text-slate-200", bg: "bg-slate-700/30" },
    { label: "Verified", value: verified, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Outdated", value: outdated, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Hallucinated", value: hallucinated, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Unverifiable", value: unverifiable, color: "text-slate-400", bg: "bg-slate-500/10" },
  ];

  // Visual bar
  const barSegments = [
    { count: verified, color: "bg-emerald-500" },
    { count: outdated, color: "bg-yellow-500" },
    { count: hallucinated, color: "bg-red-500" },
    { count: unverifiable, color: "bg-slate-500" },
  ];

  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-lg p-3 text-center border border-slate-700/30`}
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      {total > 0 && (
        <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex">
          {barSegments.map((seg, i) =>
            seg.count > 0 ? (
              <div
                key={i}
                className={`${seg.color} transition-all duration-700 ease-out`}
                style={{ width: `${(seg.count / total) * 100}%` }}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
