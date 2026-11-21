// ============================================================
// DeepAudit AI — Trust Score Gauge (SVG Animated)
// ============================================================
"use client";

import { useEffect, useState } from "react";

interface TrustScoreGaugeProps {
  score: number; // 0-100
  size?: number;
}

export default function TrustScoreGauge({ score, size = 200 }: TrustScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  const getColor = (s: number) => {
    if (s >= 75) return "#0a0a0a"; // near-black
    if (s >= 50) return "#404040"; // dark gray
    if (s >= 25) return "#737373"; // mid gray
    return "#a3a3a3"; // light gray
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Highly Trustworthy";
    if (s >= 60) return "Mostly Reliable";
    if (s >= 40) return "Needs Review";
    if (s >= 20) return "Low Confidence";
    return "Likely Unreliable";
  };

  const color = getColor(animatedScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="drop-shadow-lg">
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="12"
        />
        {/* Animated progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          className="transition-all duration-500"
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bold"
          fill={color}
          fontSize={size / 4}
        >
          {animatedScore}
        </text>
        <text
          x={cx}
          y={cy + size / 7}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#737373"
          fontSize={size / 14}
        >
          TRUST SCORE
        </text>
      </svg>
      <span className="text-sm font-medium px-3 py-1 rounded-full text-neutral-900 bg-neutral-100 border border-neutral-300">
        {getLabel(animatedScore)}
      </span>
    </div>
  );
}
