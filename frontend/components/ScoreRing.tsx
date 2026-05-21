"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number; // 0-1
  label: string;
  color?: string;
  size?: number;
}

export default function ScoreRing({ score, label, color = "#7c3aed", size = 120 }: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 1);
  const offset = circumference * (1 - (animated ? pct : 0));
  const displayPct = Math.round(pct * 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [score]);

  const getColor = () => {
    if (pct >= 0.7) return "#22c55e";
    if (pct >= 0.4) return "#f59e0b";
    return "#ef4444";
  };

  const ringColor = label.toLowerCase().includes("intent") || label.toLowerCase().includes("interest")
    ? getColor()
    : color;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={ringColor} strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring"
            style={{ filter: `drop-shadow(0 0 6px ${ringColor}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{displayPct}</span>
          <span className="text-xs text-white/40">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium text-white/60 tracking-wide uppercase">{label}</span>
    </div>
  );
}
