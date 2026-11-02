import React from 'react';

export const Badge = ({ children, variant = 'gray', size = 'sm', className = '' }) => {
  const variantStyles = {
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-orange-50 text-orange-700 border-orange-200',
    green: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-orange-50 text-orange-700 border-orange-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    red: 'bg-red-50 text-red-700 border-red-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const sizeStyles = {
    xs: 'text-[11px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant] || variantStyles.gray} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {children}
    </span>
  );
};
