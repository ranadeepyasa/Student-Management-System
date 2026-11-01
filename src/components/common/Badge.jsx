import React from 'react';

export const Badge = ({ children, variant = 'gray', size = 'sm', className = '' }) => {
  const variantStyles = {
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-[#ddf4ff] text-[#0969da] border-[#54aeff]/40',
    green: 'bg-[#dafbe1] text-[#1a7f37] border-[#4ac26b]/40',
    purple: 'bg-[#fbefff] text-[#8250df] border-[#c297ff]/40',
    orange: 'bg-[#fff1e5] text-[#bc4c00] border-[#ff9b49]/40',
    red: 'bg-[#ffebe9] text-[#cf222e] border-[#ff8182]/40',
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
