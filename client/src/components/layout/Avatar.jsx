import React from 'react';

export const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
  showTooltip = false,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border-2',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
  };

  const statusColors = {
    Online: 'bg-success',
    Busy: 'bg-danger',
    Away: 'bg-warning',
    Offline: 'bg-text-muted',
  };

  const getInitials = (str) => {
    if (!str) return '?';
    return str
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block group ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-border/50 transition-transform duration-200 group-hover:scale-105`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-purple/20 text-purple border border-purple/40 flex items-center justify-center font-semibold transition-transform duration-200 group-hover:scale-105`}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-sidebar ${statusSizes[size]} ${
            statusColors[status] || statusColors.Offline
          }`}
          title={status}
        />
      )}

      {showTooltip && name && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-sidebar border border-border text-text-primary text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
          {name}
        </div>
      )}
    </div>
  );
};

export default Avatar;