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
    { label: "Total Claims", value: total },
    { label: "Verified", value: verified },
    { label: "Outdated", value: outdated },
    { label: "Hallucinated", value: hallucinated },
    { label: "Unverifiable", value: unverifiable },
  ];

  // Visual bar (grayscale, darkest = verified → lightest = unverifiable)
  const barSegments = [
    { count: verified, color: "bg-neutral-900" },
    { count: outdated, color: "bg-neutral-500" },
    { count: hallucinated, color: "bg-neutral-700" },
    { count: unverifiable, color: "bg-neutral-300" },
  ];

  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-50 rounded-lg p-3 text-center border border-neutral-200"
          >
            <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      {total > 0 && (
        <div className="h-3 rounded-full bg-neutral-100 overflow-hidden flex border border-neutral-200">
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
