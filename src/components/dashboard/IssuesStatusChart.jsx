import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useDevFlow } from '../../context/DevFlowContext';
import { ISSUES_STATUS_DATA } from '../../data/mockData';
import { AlertCircle, CheckCircle2, Clock, GitPullRequest } from 'lucide-react';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white border border-[#d0d7de] p-2.5 rounded-lg shadow-md text-xs space-y-0.5">
        <p className="font-semibold text-[#1f2328]">{data.name} Issues</p>
        <p className="text-[#656d76]">
          Count: <span className="font-bold text-[#1f2328] font-mono">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const IssuesStatusChart = () => {
  const { dashboardStats } = useDevFlow();

  const data = dashboardStats?.issuesByStatus || ISSUES_STATUS_DATA;
  const totalIssues = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  const getStatusIcon = (name) => {
    switch (name) {
      case 'Closed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#8250df]" />;
      case 'Open':
        return <AlertCircle className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'In Progress':
        return <Clock className="w-3.5 h-3.5 text-[#0969da]" />;
      case 'Resolved / In Review':
      case 'In Review':
        return <GitPullRequest className="w-3.5 h-3.5 text-[#bc4c00]" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs flex flex-col h-full">
      <div className="pb-3 mb-2 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#1a7f37]" />
          Issues by Status (Live DB)
        </h3>
        <p className="text-xs text-[#656d76] mt-0.5">
          Distribution across active lifecycle states in MySQL
        </p>
      </div>

      <div className="h-48 sm:h-52 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-[#1f2328] font-mono leading-none">
            {totalIssues}
          </span>
          <span className="text-[10px] text-[#656d76] uppercase font-semibold mt-0.5">
            Total
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        {data.map((item) => {
          const percent = totalIssues > 0 ? Math.round((item.value / totalIssues) * 100) : 0;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-md bg-[#f6f8fa] border border-slate-200/80"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {getStatusIcon(item.name)}
                <span className="text-xs text-[#1f2328] font-medium truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold font-mono text-[#1f2328]">
                  {item.value}
                </span>
                <span className="text-[10px] text-[#656d76]">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
