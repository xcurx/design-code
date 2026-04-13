import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showIcon?: boolean;
}

export function ScoreGauge({
  value,
  size = 120,
  strokeWidth = 10,
  className,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  let color = "text-green-500";
  if (value < 40) color = "text-red-500";
  else if (value < 70) color = "text-yellow-500";

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg className="absolute top-0 left-0 -rotate-90 transform" width={size} height={size}>
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn("transition-all duration-1000 ease-in-out", color)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Value text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(value)}</span>
        <span className="text-xs text-muted-foreground uppercase mt-1">Score</span>
      </div>
    </div>
  );
}
