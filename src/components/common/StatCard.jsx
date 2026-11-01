import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-slate-100 text-slate-700',
  trend,
  trendDirection = 'up',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-[#d0d7de] p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-[#0969da]/50 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#656d76] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-md ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#1f2328] tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              trendDirection === 'up' ? 'text-[#1a7f37]' : 'text-[#cf222e]'
            }`}
          >
            {trendDirection === 'up' ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#656d76] truncate">{subtitle}</p>
      )}
    </div>
  );
};
