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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#0969da]/30 focus:border-[#0969da] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary:
      'bg-[#1f883d] hover:bg-[#1a7f37] text-white border border-[#1b1f24]/15 shadow-sm active:bg-[#197935]',
    default:
      'bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de] shadow-sm active:bg-[#ebecf0]',
    blue:
      'bg-[#0969da] hover:bg-[#0860ca] text-white border border-[#0860ca] shadow-sm',
    danger:
      'bg-[#f6f8fa] hover:bg-[#ffebe9] text-[#cf222e] border border-[#d0d7de] hover:border-[#cf222e]/40 shadow-sm',
    dangerSolid:
      'bg-[#cf222e] hover:bg-[#b91c1c] text-white border border-[#b91c1c] shadow-sm',
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#656d76] hover:text-[#1f2328]',
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
