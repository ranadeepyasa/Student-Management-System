import React from 'react';

export const Button = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary:
      'bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 shadow-xs active:bg-orange-800',
    default:
      'bg-white hover:bg-orange-50/40 text-slate-800 border border-slate-200 shadow-2xs active:bg-orange-50',
    blue:
      'bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 shadow-xs',
    danger:
      'bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-300 shadow-2xs',
    dangerSolid:
      'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-xs',
    ghost:
      'bg-transparent hover:bg-orange-50 text-slate-600 hover:text-orange-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-sm px-4 py-2 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};
