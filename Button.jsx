import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const variants = {
    primary:
      'bg-gradient-to-r from-purple to-purple-hover text-white shadow-purple-glow hover:shadow-lg hover:shadow-purple/30 border border-purple/30',
    secondary:
      'bg-card text-text-primary border border-border hover:border-purple/50 hover:bg-cardHover',
    outline:
      'bg-transparent border border-border text-text-secondary hover:text-text-primary hover:border-purple/50 hover:bg-card/50',
    ghost:
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-cardHover',
    danger:
      'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;