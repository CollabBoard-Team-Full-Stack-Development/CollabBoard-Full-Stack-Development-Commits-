import React from 'react';
import Avatar from './Avatar';

export const ActivityItem = ({ activity }) => {
  const { user, action, target, from, to, timestamp } = activity;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-card/40 border border-border/40 hover:bg-cardHover/60 transition-colors">
      <Avatar src={user.avatar} name={user.name} size="sm" />
      
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-primary leading-relaxed">
          <span className="font-semibold text-text-primary">{user.name}</span>{' '}
          <span className="text-text-secondary">{action}</span>{' '}
          <span className="font-medium text-purple">{target}</span>
          {from && to && (
            <span className="text-text-muted">
              {' '}
              from <span className="text-text-secondary">{from}</span> to{' '}
              <span className="text-text-secondary">{to}</span>
            </span>
          )}
        </p>
        <span className="text-[10px] text-text-muted mt-1 block">{timestamp}</span>
      </div>
    </div>
  );
};

export default ActivityItem;