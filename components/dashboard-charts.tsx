"use client";

import { ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

export function ActivityBarChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[2, 2, 0, 0]}
          className="fill-blue-500"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ScoreAreaChart({ data }: { data: any[] }) {
  if (!data || data.length < 2) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--emerald-500, #10b981)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--emerald-500, #10b981)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="score"
          stroke="var(--emerald-500, #10b981)"
          fillOpacity={1}
          fill="url(#scoreGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
