import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { VELOCITY_CHART_DATA } from '../../data/mockData';
import { TrendingUp, GitCommit, GitMerge } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#d0d7de] p-3 rounded-lg shadow-md text-xs space-y-1">
        <p className="font-bold text-[#1f2328] mb-1.5">{label}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#656d76]">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-semibold font-mono text-[#1f2328]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ProjectProgressChart = () => {
  return (
    <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ea580c]" />
            Development Velocity & Sprint Progress
          </h3>
          <p className="text-xs text-[#656d76] mt-0.5">
            Weekly commit volume, PR merges, and completed issues
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#656d76]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
            <GitCommit className="w-3 h-3 text-[#ea580c]" /> 260+ commits
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
            <GitMerge className="w-3 h-3 text-[#1a7f37]" /> 140+ PRs
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={VELOCITY_CHART_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a7f37" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1a7f37" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8250df" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8250df" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#8c959f"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e1e4e8' }}
            />
            <YAxis
              stroke="#8c959f"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#ea580c"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCommits)"
            />
            <Area
              type="monotone"
              dataKey="prsMerged"
              name="PRs Merged"
              stroke="#1a7f37"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrs)"
            />
            <Area
              type="monotone"
              dataKey="issuesResolved"
              name="Issues Resolved"
              stroke="#8250df"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIssues)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
